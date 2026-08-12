(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const LENIS_SRC = 'https://unpkg.com/lenis@1.3.25/dist/lenis.min.js';
    const STYLE_ID = 'portfolio-ui-motion-styles';
    let lenisInstance = null;
    let bodyObserver = null;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            html.lenis,
            html.lenis body {
                height: auto;
            }

            .lenis.lenis-smooth {
                scroll-behavior: auto !important;
            }

            .lenis.lenis-smooth [data-lenis-prevent] {
                overscroll-behavior: contain;
            }

            .lenis.lenis-stopped {
                overflow: hidden;
            }

            .lenis.lenis-smooth iframe {
                pointer-events: none;
            }

            .hero-motion-ready .hero-copy,
            .hero-motion-ready .hero-portrait {
                animation: none !important;
            }

            .hero-motion-ready .hero-intro,
            .hero-motion-ready .hero-role,
            .hero-motion-ready .hero-description,
            .hero-motion-ready .hero-actions {
                opacity: 0;
                transform: translate3d(0, 22px, 0);
                will-change: transform, opacity;
            }

            .hero-motion-ready .hero-intro {
                transform: translate3d(0, 12px, 0);
                transition: opacity 520ms ease, transform 620ms cubic-bezier(.22, 1, .36, 1);
            }

            .hero-motion-ready .hero-copy h1 {
                overflow: hidden;
            }

            .hero-motion-letter {
                display: inline-block;
                opacity: 0;
                transform: translate3d(0, 1.05em, 0) rotate(3deg);
                transform-origin: 50% 100%;
                will-change: transform, opacity;
                transition:
                    opacity 460ms ease,
                    transform 720ms cubic-bezier(.16, 1, .3, 1);
                transition-delay: calc(110ms + (var(--letter-index) * 52ms));
            }

            .hero-motion-ready .hero-role {
                clip-path: inset(0 0 100% 0);
                transition:
                    opacity 560ms ease 310ms,
                    transform 760ms cubic-bezier(.16, 1, .3, 1) 310ms,
                    clip-path 820ms cubic-bezier(.16, 1, .3, 1) 310ms;
            }

            .hero-motion-ready .hero-description {
                transition:
                    opacity 620ms ease 470ms,
                    transform 780ms cubic-bezier(.22, 1, .36, 1) 470ms;
            }

            .hero-motion-ready .hero-actions {
                transition:
                    opacity 560ms ease 610ms,
                    transform 720ms cubic-bezier(.22, 1, .36, 1) 610ms;
            }

            .hero-motion-ready .hero-portrait {
                opacity: 0;
                transform: translate3d(34px, 18px, 0) scale(.94);
                transform-origin: 50% 55%;
                transition:
                    opacity 700ms ease 160ms,
                    transform 980ms cubic-bezier(.16, 1, .3, 1) 160ms;
                will-change: transform, opacity;
            }

            .hero-motion-ready .portrait-backdrop {
                transform: scale(.965) rotate(1.2deg);
                transition: transform 1050ms cubic-bezier(.16, 1, .3, 1) 180ms;
            }

            .hero-motion-ready .portrait-tile {
                opacity: 0;
                transition: opacity 650ms ease;
            }

            .hero-motion-ready .portrait-tile:nth-child(1) { transition-delay: 430ms; }
            .hero-motion-ready .portrait-tile:nth-child(2) { transition-delay: 500ms; }
            .hero-motion-ready .portrait-tile:nth-child(3) { transition-delay: 560ms; }
            .hero-motion-ready .portrait-tile:nth-child(4) { transition-delay: 610ms; }
            .hero-motion-ready .portrait-tile:nth-child(5) { transition-delay: 660ms; }
            .hero-motion-ready .portrait-tile:nth-child(6) { transition-delay: 710ms; }

            .hero-motion-entered .hero-intro,
            .hero-motion-entered .hero-role,
            .hero-motion-entered .hero-description,
            .hero-motion-entered .hero-actions {
                opacity: 1;
                transform: translate3d(0, 0, 0);
            }

            .hero-motion-entered .hero-role {
                clip-path: inset(0 0 0 0);
            }

            .hero-motion-entered .hero-motion-letter {
                opacity: 1;
                transform: translate3d(0, 0, 0) rotate(0deg);
            }

            .hero-motion-entered .hero-portrait {
                opacity: 1;
                transform: translate3d(0, 0, 0) scale(1);
            }

            .hero-motion-entered .portrait-backdrop {
                transform: scale(1) rotate(0deg);
            }

            .hero-motion-entered .portrait-tile {
                opacity: 1;
            }

            @media (prefers-reduced-motion: reduce) {
                .hero-motion-ready .hero-intro,
                .hero-motion-ready .hero-role,
                .hero-motion-ready .hero-description,
                .hero-motion-ready .hero-actions,
                .hero-motion-ready .hero-portrait,
                .hero-motion-ready .hero-motion-letter,
                .hero-motion-ready .portrait-backdrop,
                .hero-motion-ready .portrait-tile {
                    opacity: 1 !important;
                    transform: none !important;
                    clip-path: none !important;
                    transition: none !important;
                    will-change: auto !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function splitHeroTitle(title) {
        if (!title || title.dataset.motionSplit === 'true') return;

        const text = title.textContent.trim();
        if (!text) return;

        title.dataset.motionSplit = 'true';
        title.setAttribute('aria-label', text);
        title.textContent = '';

        Array.from(text).forEach((character, index) => {
            const span = document.createElement('span');
            span.className = 'hero-motion-letter';
            span.setAttribute('aria-hidden', 'true');
            span.style.setProperty('--letter-index', String(index));
            span.textContent = character === ' ' ? '\u00a0' : character;
            title.appendChild(span);
        });
    }

    function initializeHeroMotion() {
        const hero = document.querySelector('.home-hero');
        if (!hero) return;

        injectStyles();
        hero.classList.add('hero-motion-ready');
        splitHeroTitle(hero.querySelector('#hero-title'));

        if (reduceMotion.matches) {
            hero.classList.add('hero-motion-entered');
            return;
        }

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                hero.classList.add('hero-motion-entered');
            });
        });
    }

    function normalizeAboutMobileNavigation() {
        if (!document.body.classList.contains('about-page')) return;

        const legacyToggle = document.querySelector('button.hamburger#hamburger');
        if (!legacyToggle) return;

        legacyToggle.classList.remove('hamburger');
        legacyToggle.classList.add('menu-toggle');
    }

    function keepLenisInSyncWithOverlays() {
        if (!lenisInstance || !document.body) return;

        const sync = () => {
            if (!lenisInstance) return;
            if (document.body.classList.contains('no-scroll')) {
                lenisInstance.stop();
            } else {
                lenisInstance.start();
            }
        };

        bodyObserver = new MutationObserver(sync);
        bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        sync();
    }

    function startLenis() {
        if (!window.Lenis || lenisInstance || reduceMotion.matches || !finePointer.matches) return;

        lenisInstance = new window.Lenis({
            autoRaf: true,
            smoothWheel: true,
            syncTouch: false,
            lerp: 0.085,
            wheelMultiplier: 0.82,
            anchors: { duration: 1.05 },
            stopInertiaOnNavigate: true,
            prevent: (node) => Boolean(node && node.closest && node.closest('[role="dialog"], [data-lenis-prevent]'))
        });

        window.portfolioLenis = lenisInstance;
        keepLenisInSyncWithOverlays();
    }

    function destroyLenis() {
        if (bodyObserver) {
            bodyObserver.disconnect();
            bodyObserver = null;
        }
        if (lenisInstance) {
            lenisInstance.destroy();
            lenisInstance = null;
            window.portfolioLenis = null;
        }
    }

    function loadLenis() {
        if (reduceMotion.matches || !finePointer.matches) return;
        if (window.Lenis) {
            startLenis();
            return;
        }
        if (document.querySelector('script[data-portfolio-lenis]')) return;

        const script = document.createElement('script');
        script.src = LENIS_SRC;
        script.async = true;
        script.dataset.portfolioLenis = 'true';
        script.addEventListener('load', startLenis, { once: true });
        script.addEventListener('error', () => {
            console.warn('Smooth scrolling could not be loaded; native scrolling remains active.');
        }, { once: true });
        document.head.appendChild(script);
    }

    function handleMotionPreference() {
        if (reduceMotion.matches) {
            destroyLenis();
            document.querySelector('.home-hero')?.classList.add('hero-motion-entered');
        } else {
            loadLenis();
        }
    }

    function initialize() {
        normalizeAboutMobileNavigation();
        injectStyles();
        initializeHeroMotion();
        loadLenis();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }

    reduceMotion.addEventListener('change', handleMotionPreference);
    window.addEventListener('pagehide', (event) => {
        if (!event.persisted) destroyLenis();
    });
})();
