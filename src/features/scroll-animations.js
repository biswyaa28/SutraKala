// js/features/scroll-animations.js
import { $$ } from '../utils/dom.js';

export class ScrollAnimations {
    constructor(canAnimate) {
        this.canAnimate = canAnimate;
        this.initObserver();
    }

    /**
     * Initializes Hardware-accelerated IntersectionObserver to block DOM reflows until elements hit user view bounds natively decoupled from continuous JS arrays.
     */
    initObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (this.canAnimate() && typeof anime !== 'undefined') {
                        anime({
                            targets: entry.target,
                            translateY: [30, 0],
                            opacity: [0, 1],
                            duration: 800,
                            easing: 'easeOutQuart'
                        });
                    } else {
                        // Instant fallback if animation drops out
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Bind cleanly to DOM
        $$('.reveal-on-scroll').forEach(el => observer.observe(el));
    }
}
