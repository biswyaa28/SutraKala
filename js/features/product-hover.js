// js/features/product-hover.js
import { $$ } from '../utils/dom.js';
import { springPhysics } from '../utils/animation.js';

export class ProductHoverEngine {
    constructor(canAnimate) {
        this.canAnimate = canAnimate;
        this.bindTilt();
    }

    bindTilt() {
        $$('.product-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                // Instantly block 3D DOM locks if FPS controller flag fails or executing mobile
                if (window.innerWidth <= 768 || !this.canAnimate()) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: card,
                        rotateX: ((y - centerY) / centerY) * -3,
                        rotateY: ((x - centerX) / centerX) * 3,
                        scale: 1.02,
                        duration: 100,
                        easing: 'linear'
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: card,
                        rotateX: 0,
                        rotateY: 0,
                        scale: 1,
                        duration: 600,
                        easing: springPhysics.gentle
                    });
                }
            });
        });
    }
}
