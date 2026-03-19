// js/core/navigation.js
import { $, $$ } from '../utils/dom.js';

export class Navigation {
    constructor() {
        this.bindMobileMenu();
        this.bindSmoothScroll();
    }

    bindMobileMenu() {
        const toggle = $('.mobile-menu-toggle');
        const menu = $('.mobile-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
            });
        }
    }

    bindSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}
