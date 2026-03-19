// js/core/cart.js
import { storage } from '../utils/storage.js';
import { springPhysics } from '../utils/animation.js';
import { $, $$ } from '../utils/dom.js';

export class ShoppingCart {
    constructor() {
        this.items = storage.get('craftedloop_cart', []);
        this.bindEvents();
        this.updateBadge();
    }

    bindEvents() {
        $$('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.addItem(e.target.dataset.id || 'item-demo');
                
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: btn,
                        scale: [0.97, 1],
                        duration: 400,
                        easing: springPhysics.snap
                    });
                }
            });
        });
    }

    addItem(item) {
        this.items.push(item);
        storage.set('craftedloop_cart', this.items);
        this.updateBadge();
    }

    updateBadge() {
        const badge = $('.cart-count');
        if (badge) {
            badge.textContent = this.items.length;
            if (typeof anime !== 'undefined' && this.items.length > 0) {
                anime({
                    targets: badge,
                    scale: [1.2, 1],
                    duration: 300,
                    easing: springPhysics.bounce
                });
            }
        }
    }
}
