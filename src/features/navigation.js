// js/core/navigation.js
import { $, $$ } from '../utils/dom.js';

export class Navigation {
    constructor() {
        this.menuOpen = false;
        this.bindMobileMenu();
        this.bindSmoothScroll();
        this.bindOutsideClose();
    }

    bindMobileMenu() {
        const toggle = $('.mobile-menu-toggle');
        const menu   = $('.mobile-menu');
        const icon   = toggle?.querySelector('i');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            this.menuOpen = !this.menuOpen;
            menu.classList.toggle('active', this.menuOpen);
            toggle.setAttribute('aria-expanded', String(this.menuOpen));

            // Swap hamburger ↔ X icon
            if (icon) {
                icon.classList.toggle('fa-bars', !this.menuOpen);
                icon.classList.toggle('fa-times',  this.menuOpen);
            }
        });

        // Auto-close when any mobile nav link is clicked
        $$('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMenu(toggle, menu, icon));
        });
    }

    closeMenu(toggle, menu, icon) {
        this.menuOpen = false;
        menu.classList.remove('active');
        toggle?.setAttribute('aria-expanded', 'false');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }

    bindOutsideClose() {
        document.addEventListener('click', (e) => {
            const toggle = $('.mobile-menu-toggle');
            const menu   = $('.mobile-menu');
            const icon   = toggle?.querySelector('i');
            if (this.menuOpen && !menu?.contains(e.target) && !toggle?.contains(e.target)) {
                this.closeMenu(toggle, menu, icon);
            }
        });
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
