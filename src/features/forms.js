// js/core/forms.js
import { $$ } from '../utils/dom.js';

export class FormValidator {
    constructor() {
        this.bindValidation();
    }

    bindValidation() {
        $$('.contact-form input, .contact-form textarea').forEach(input => {
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.shake(input);
            });
        });
    }

    shake(el) {
        if (typeof anime !== 'undefined') {
            anime({
                targets: el,
                translateX: [
                    { value: -5, duration: 50 },
                    { value: 5, duration: 50 },
                    { value: -5, duration: 50 },
                    { value: 0, duration: 50 }
                ],
                borderColor: '#E5A3A3',
                easing: 'easeInOutSine'
            });
        }
    }
}
