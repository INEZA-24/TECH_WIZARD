(function () {
    'use strict';

    const MODE_SETTINGS = {
        hero: { desktop: 32, tablet: 22, mobile: 13, distance: 150, speed: 0.2, pointer: true, pointerDistance: 170, pointerLinkDistance: 185, click: true },
        journey: { desktop: 20, tablet: 15, mobile: 10, distance: 118, speed: 0.11, pointer: true, pointerDistance: 145, pointerLinkDistance: 160, click: true },
        beyond: { desktop: 17, tablet: 13, mobile: 8, distance: 132, speed: 0.1, pointer: true, pointerDistance: 145, pointerLinkDistance: 160, click: true },
        contact: { desktop: 18, tablet: 14, mobile: 9, distance: 160, speed: 0.16, pointer: true, pointerDistance: 175, pointerLinkDistance: 190, click: true },
        closing: { desktop: 14, tablet: 11, mobile: 7, distance: 155, speed: 0.1, pointer: true, pointerDistance: 160, pointerLinkDistance: 175, click: true },
        projects: { desktop: 26, tablet: 18, mobile: 11, distance: 168, speed: 0.18, pointer: true, pointerDistance: 175, pointerLinkDistance: 195, click: true }
    };

    const MAX_USER_NODES = 10;
    const CLICK_PULSE_DURATION = 850;
    const SCROLL_IDLE_DELAY = 140;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const instances = new Set();

    class NetworkBackground {
        constructor(host) {
            this.host = host;
            this.mode = host.dataset.networkMode;
            this.settings = MODE_SETTINGS[this.mode] || MODE_SETTINGS.hero;
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d', { alpha: true });
            this.nodes = [];
            this.pointer = { x: 0, y: 0, active: false };
            this.visible = false;
            this.frame = 0;
            this.resizeFrame = 0;
            this.scrollTimer = 0;
            this.isScrolling = false;
            this.width = 0;
            this.height = 0;
            this.interactionHost = this.host.parentElement || this.host;
            this.draw = this.draw.bind(this);
            this.resize = this.resize.bind(this);
            this.handlePointer = this.handlePointer.bind(this);
            this.clearPointer = this.clearPointer.bind(this);
            this.handlePointerDown = this.handlePointerDown.bind(this);
            this.handleScroll = this.handleScroll.bind(this);
            this.handleVisibility = this.handleVisibility.bind(this);
            this.canvas.setAttribute('aria-hidden', 'true');
            this.host.appendChild(this.canvas);
            this.observe();
            this.bind();
            this.resize();
        }

        nodeCount() {
            if (this.width <= 520) return this.settings.mobile;
            if (this.width <= 900) return this.settings.tablet;
            return this.settings.desktop;
        }

        makeNode(index, overrides = {}) {
            const edgeBias = (this.mode === 'contact' && index % 3 === 0) || (this.mode === 'closing' && index % 2 === 0);
            const x = edgeBias
                ? (index % 2 ? Math.random() * this.width * 0.2 : this.width * (0.8 + Math.random() * 0.2))
                : Math.random() * this.width;

            return {
                x,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * this.settings.speed,
                vy: (Math.random() - 0.5) * this.settings.speed,
                radius: 1 + Math.random() * 0.75,
                phase: Math.random() * Math.PI * 2,
                userCreated: false,
                createdAt: 0,
                ...overrides
            };
        }

        populate() {
            const baseNodes = this.nodes.filter((node) => !node.userCreated);
            const userNodes = this.nodes.filter((node) => node.userCreated);
            const count = this.nodeCount();

            if (baseNodes.length > count) baseNodes.length = count;
            while (baseNodes.length < count) baseNodes.push(this.makeNode(baseNodes.length));

            this.nodes = [...baseNodes, ...userNodes.slice(-MAX_USER_NODES)];
        }

        resize() {
            cancelAnimationFrame(this.resizeFrame);
            this.resizeFrame = requestAnimationFrame(() => {
                const rect = this.host.getBoundingClientRect();
                const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
                this.width = Math.max(1, rect.width);
                this.height = Math.max(1, rect.height);
                this.canvas.width = Math.round(this.width * ratio);
                this.canvas.height = Math.round(this.height * ratio);
                this.canvas.style.width = `${this.width}px`;
                this.canvas.style.height = `${this.height}px`;
                this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
                this.populate();
                if (reduceMotion.matches) this.render(true);
            });
        }

        observe() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    this.visible = entry.isIntersecting;
                    this.updateAnimation();
                });
            }, { rootMargin: '120px 0px', threshold: 0.01 });
            this.observer.observe(this.host);
        }

        bind() {
            window.addEventListener('resize', this.resize, { passive: true });
            window.addEventListener('scroll', this.handleScroll, { passive: true });
            document.addEventListener('visibilitychange', this.handleVisibility);

            if (finePointer.matches && (this.settings.pointer || this.settings.click)) {
                this.interactionHost.addEventListener('pointermove', this.handlePointer, { passive: true });
                this.interactionHost.addEventListener('pointerleave', this.clearPointer, { passive: true });
                this.interactionHost.addEventListener('pointerdown', this.handlePointerDown, { passive: true });
            }
        }

        pointFromEvent(event) {
            const rect = this.host.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
            return { x, y };
        }

        handlePointer(event) {
            if (!this.settings.pointer || this.isScrolling) return;

            const point = this.pointFromEvent(event);
            if (!point) {
                this.clearPointer();
                return;
            }

            this.pointer.x = point.x;
            this.pointer.y = point.y;
            this.pointer.active = true;
        }

        clearPointer() {
            this.pointer.active = false;
        }

        handleScroll() {
            this.pointer.active = false;
            this.isScrolling = true;
            window.clearTimeout(this.scrollTimer);
            this.scrollTimer = window.setTimeout(() => {
                this.isScrolling = false;
            }, SCROLL_IDLE_DELAY);
        }

        handlePointerDown(event) {
            if (!this.settings.click || reduceMotion.matches || this.isScrolling || event.button !== 0) return;
            if (event.target.closest('a, button, input, textarea, select, summary, [role="button"]')) return;

            const point = this.pointFromEvent(event);
            if (!point) return;
            this.createUserNode(point.x, point.y);
        }

        createUserNode(x, y) {
            const userNodes = this.nodes.filter((node) => node.userCreated);
            if (userNodes.length >= MAX_USER_NODES) {
                const oldest = userNodes.reduce((currentOldest, node) => (
                    !currentOldest || node.createdAt < currentOldest.createdAt ? node : currentOldest
                ), null);
                const oldestIndex = this.nodes.indexOf(oldest);
                if (oldestIndex >= 0) this.nodes.splice(oldestIndex, 1);
            }

            const launchSpeed = Math.max(this.settings.speed * 1.15, 0.14);
            const angle = Math.random() * Math.PI * 2;
            this.nodes.push(this.makeNode(this.nodes.length, {
                x,
                y,
                vx: Math.cos(angle) * launchSpeed,
                vy: Math.sin(angle) * launchSpeed,
                radius: 2.2,
                userCreated: true,
                createdAt: performance.now()
            }));
        }

        handleVisibility() {
            this.updateAnimation();
        }

        updateAnimation() {
            cancelAnimationFrame(this.frame);
            if (reduceMotion.matches) {
                this.render(true);
                return;
            }
            if (this.visible && !document.hidden) this.frame = requestAnimationFrame(this.draw);
        }

        update() {
            const pointerDistance = this.settings.pointerDistance || 160;
            const pointerDistanceSquared = pointerDistance * pointerDistance;

            this.nodes.forEach((node) => {
                node.x += node.vx;
                node.y += node.vy;
                node.phase += 0.005;

                if (node.x < -12) node.x = this.width + 12;
                if (node.x > this.width + 12) node.x = -12;
                if (node.y < -12) node.y = this.height + 12;
                if (node.y > this.height + 12) node.y = -12;

                if (this.pointer.active && !this.isScrolling) {
                    const dx = node.x - this.pointer.x;
                    const dy = node.y - this.pointer.y;
                    const distanceSquared = dx * dx + dy * dy;

                    if (distanceSquared < pointerDistanceSquared && distanceSquared > 1) {
                        const distance = Math.sqrt(distanceSquared);
                        const influence = 1 - distance / pointerDistance;
                        const push = influence * 1.05;
                        node.x += (dx / distance) * push;
                        node.y += (dy / distance) * push;
                        node.vx += (dx / distance) * influence * 0.004;
                        node.vy += (dy / distance) * influence * 0.004;
                    }
                }

                const maxVelocity = Math.max(this.settings.speed * 2.5, 0.45);
                const velocity = Math.hypot(node.vx, node.vy);
                if (velocity > maxVelocity) {
                    node.vx = (node.vx / velocity) * maxVelocity;
                    node.vy = (node.vy / velocity) * maxVelocity;
                }

                node.vx *= 0.9996;
                node.vy *= 0.9996;
            });
        }

        render(isStatic) {
            const context = this.context;
            context.clearRect(0, 0, this.width, this.height);
            const baseDistance = this.settings.distance;

            for (let first = 0; first < this.nodes.length; first += 1) {
                const a = this.nodes[first];
                for (let second = first + 1; second < this.nodes.length; second += 1) {
                    const b = this.nodes[second];
                    const maxDistance = (a.userCreated || b.userCreated) ? baseDistance * 1.25 : baseDistance;
                    const maxDistanceSquared = maxDistance * maxDistance;
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distanceSquared = dx * dx + dy * dy;
                    if (distanceSquared > maxDistanceSquared) continue;

                    const distance = Math.sqrt(distanceSquared);
                    let alpha = (1 - distance / maxDistance) * (a.userCreated || b.userCreated ? 0.28 : 0.18);
                    if (this.mode === 'journey') alpha *= 0.82 + Math.sin(a.phase + b.phase) * 0.12;

                    context.beginPath();
                    context.moveTo(a.x, a.y);
                    context.lineTo(b.x, b.y);
                    context.strokeStyle = `rgba(65, 148, 208, ${Math.max(0.03, alpha)})`;
                    context.lineWidth = a.userCreated || b.userCreated ? 0.9 : 0.7;
                    context.stroke();
                }
            }

            if (this.pointer.active && !this.isScrolling && !isStatic) {
                const pointerLinkDistance = this.settings.pointerLinkDistance || 180;
                const pointerLinkDistanceSquared = pointerLinkDistance * pointerLinkDistance;

                this.nodes.forEach((node) => {
                    const dx = node.x - this.pointer.x;
                    const dy = node.y - this.pointer.y;
                    const distanceSquared = dx * dx + dy * dy;
                    if (distanceSquared > pointerLinkDistanceSquared) return;

                    const distance = Math.sqrt(distanceSquared);
                    const alpha = (1 - distance / pointerLinkDistance) * 0.3;
                    context.beginPath();
                    context.moveTo(this.pointer.x, this.pointer.y);
                    context.lineTo(node.x, node.y);
                    context.strokeStyle = `rgba(87, 166, 221, ${Math.max(0.035, alpha)})`;
                    context.lineWidth = 0.75;
                    context.stroke();
                });
            }

            const now = performance.now();
            this.nodes.forEach((node) => {
                const pulseAge = node.userCreated ? now - node.createdAt : CLICK_PULSE_DURATION + 1;
                const isPulsing = pulseAge >= 0 && pulseAge < CLICK_PULSE_DURATION;
                const alpha = isStatic
                    ? 0.22
                    : node.userCreated
                        ? 0.4 + Math.sin(node.phase) * 0.05
                        : 0.22 + Math.sin(node.phase) * 0.04;

                if (isPulsing) {
                    const progress = pulseAge / CLICK_PULSE_DURATION;
                    context.beginPath();
                    context.arc(node.x, node.y, 6 + progress * 17, 0, Math.PI * 2);
                    context.strokeStyle = `rgba(87, 166, 221, ${0.4 * (1 - progress)})`;
                    context.lineWidth = 1.05;
                    context.stroke();
                }

                context.beginPath();
                context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                context.fillStyle = `rgba(87, 166, 221, ${alpha})`;
                context.fill();
            });
        }

        draw() {
            this.update();
            this.render(false);
            if (this.visible && !document.hidden && !reduceMotion.matches) {
                this.frame = requestAnimationFrame(this.draw);
            }
        }

        destroy() {
            cancelAnimationFrame(this.frame);
            cancelAnimationFrame(this.resizeFrame);
            window.clearTimeout(this.scrollTimer);
            this.observer.disconnect();
            window.removeEventListener('resize', this.resize);
            window.removeEventListener('scroll', this.handleScroll);
            document.removeEventListener('visibilitychange', this.handleVisibility);

            if (finePointer.matches && (this.settings.pointer || this.settings.click)) {
                this.interactionHost.removeEventListener('pointermove', this.handlePointer);
                this.interactionHost.removeEventListener('pointerleave', this.clearPointer);
                this.interactionHost.removeEventListener('pointerdown', this.handlePointerDown);
            }

            this.canvas.remove();
        }
    }

    function updateAchievementsNavigation() {
        document.querySelectorAll('a[href="certifications.html"], a[href$="/certifications.html"]').forEach((link) => {
            if (link.textContent.trim() === 'Certificates') link.textContent = 'Achievements';
        });
    }

    function loadAchievementsRefinements() {
        if (!document.body.classList.contains('achievements-page-body')) return;
        if (document.querySelector('script[data-achievements-refinements]')) return;
        const script = document.createElement('script');
        script.src = 'script/achievements-refinements.js';
        script.dataset.achievementsRefinements = 'true';
        document.body.appendChild(script);
    }

    function loadUiMotion() {
        if (document.querySelector('script[data-portfolio-ui-motion]')) return;
        const script = document.createElement('script');
        script.src = 'script/ui-motion.js';
        script.dataset.portfolioUiMotion = 'true';
        document.body.appendChild(script);
    }

    function initialize() {
        updateAchievementsNavigation();
        loadAchievementsRefinements();
        loadUiMotion();
        document.querySelectorAll('.network-background[data-network-mode]').forEach((host) => {
            if (!host.dataset.networkReady) {
                host.dataset.networkReady = 'true';
                instances.add(new NetworkBackground(host));
            }
        });
    }

    function refreshMotion() {
        instances.forEach((instance) => instance.updateAnimation());
    }

    function destroyAll() {
        reduceMotion.removeEventListener('change', refreshMotion);
        instances.forEach((instance) => instance.destroy());
        instances.clear();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }

    reduceMotion.addEventListener('change', refreshMotion);
    window.addEventListener('pagehide', (event) => {
        if (!event.persisted) destroyAll();
    });
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            updateAchievementsNavigation();
            instances.forEach((instance) => {
                instance.resize();
                instance.updateAnimation();
            });
        }
    });
})();