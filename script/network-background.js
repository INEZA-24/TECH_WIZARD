(function () {
    'use strict';

    const MODE_SETTINGS = {
        hero: { desktop: 32, tablet: 22, mobile: 13, distance: 150, speed: 0.055, pointer: true },
        journey: { desktop: 20, tablet: 15, mobile: 10, distance: 118, speed: 0.035, pointer: false },
        beyond: { desktop: 17, tablet: 13, mobile: 8, distance: 132, speed: 0.032, pointer: false },
        contact: { desktop: 18, tablet: 14, mobile: 9, distance: 160, speed: 0.04, pointer: true },
        closing: { desktop: 14, tablet: 11, mobile: 7, distance: 155, speed: 0.026, pointer: false },
        projects: { desktop: 26, tablet: 18, mobile: 11, distance: 168, speed: 0.05, pointer: true }
    };

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
            this.width = 0;
            this.height = 0;
            this.draw = this.draw.bind(this);
            this.resize = this.resize.bind(this);
            this.handlePointer = this.handlePointer.bind(this);
            this.clearPointer = this.clearPointer.bind(this);
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

        makeNode(index) {
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
                phase: Math.random() * Math.PI * 2
            };
        }

        populate() {
            const count = this.nodeCount();
            if (this.nodes.length > count) this.nodes.length = count;
            while (this.nodes.length < count) this.nodes.push(this.makeNode(this.nodes.length));
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
            document.addEventListener('visibilitychange', this.handleVisibility);
            if (this.settings.pointer && finePointer.matches) {
                this.host.parentElement.addEventListener('pointermove', this.handlePointer, { passive: true });
                this.host.parentElement.addEventListener('pointerleave', this.clearPointer, { passive: true });
            }
        }

        handlePointer(event) {
            const rect = this.host.getBoundingClientRect();
            this.pointer.x = event.clientX - rect.left;
            this.pointer.y = event.clientY - rect.top;
            this.pointer.active = true;
        }

        clearPointer() {
            this.pointer.active = false;
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
            this.nodes.forEach((node) => {
                node.x += node.vx;
                node.y += node.vy;
                node.phase += 0.002;
                if (node.x < -12) node.x = this.width + 12;
                if (node.x > this.width + 12) node.x = -12;
                if (node.y < -12) node.y = this.height + 12;
                if (node.y > this.height + 12) node.y = -12;

                if (this.pointer.active) {
                    const dx = node.x - this.pointer.x;
                    const dy = node.y - this.pointer.y;
                    const distanceSquared = dx * dx + dy * dy;
                    if (distanceSquared < 18000 && distanceSquared > 1) {
                        const influence = (1 - distanceSquared / 18000) * 0.07;
                        node.x += dx * influence * 0.02;
                        node.y += dy * influence * 0.02;
                    }
                }
            });
        }

        render(isStatic) {
            const context = this.context;
            context.clearRect(0, 0, this.width, this.height);
            const maxDistance = this.settings.distance;
            const maxDistanceSquared = maxDistance * maxDistance;

            for (let first = 0; first < this.nodes.length; first += 1) {
                const a = this.nodes[first];
                for (let second = first + 1; second < this.nodes.length; second += 1) {
                    const b = this.nodes[second];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distanceSquared = dx * dx + dy * dy;
                    if (distanceSquared > maxDistanceSquared) continue;
                    const distance = Math.sqrt(distanceSquared);
                    let alpha = (1 - distance / maxDistance) * 0.16;
                    if (this.mode === 'journey') alpha *= 0.72 + Math.sin(a.phase + b.phase) * 0.16;
                    context.beginPath();
                    context.moveTo(a.x, a.y);
                    context.lineTo(b.x, b.y);
                    context.strokeStyle = `rgba(65, 148, 208, ${Math.max(0.025, alpha)})`;
                    context.lineWidth = 0.7;
                    context.stroke();
                }
            }

            this.nodes.forEach((node) => {
                const alpha = isStatic ? 0.22 : 0.2 + Math.sin(node.phase) * 0.035;
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
            this.observer.disconnect();
            window.removeEventListener('resize', this.resize);
            document.removeEventListener('visibilitychange', this.handleVisibility);
            if (this.settings.pointer && this.host.parentElement) {
                this.host.parentElement.removeEventListener('pointermove', this.handlePointer);
                this.host.parentElement.removeEventListener('pointerleave', this.clearPointer);
            }
            this.canvas.remove();
        }
    }

    function initialize() {
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
            instances.forEach((instance) => {
                instance.resize();
                instance.updateAnimation();
            });
        }
    });
})();
