// js/utils/dom.js
export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => context.querySelectorAll(selector);

export const addEvent = (element, event, handler) => {
    if (element) {
        element.addEventListener(event, handler);
    }
};

export const delegateEvent = (container, event, selector, handler) => {
    if (container) {
        container.addEventListener(event, (e) => {
            if (e.target.closest(selector)) {
                handler(e, e.target.closest(selector));
            }
        });
    }
};
