// js/main.js
import { initPerformanceMonitor } from './utils/animation.js';
import { ShoppingCart } from './features/cart.js';
import { Navigation } from './features/navigation.js';
import { FormValidator } from './features/forms.js';
import { Wishlist } from './features/wishlist.js';
import { ProductHoverEngine } from './features/product-hover.js';
import { ScrollAnimations } from './features/scroll-animations.js';
import { initPageTraces } from './utils/performance-traces.js';
import { initShopProducts } from './features/product-catalog/shop-products.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Firebase Performance Monitoring (production only)
    initPageTraces();

    // 2. Mount System FPS Monitor (Resolves a live flag function hook)
    const canAnimateCheck = initPerformanceMonitor();

    // 3. Initialize Core Ecosystem
    new Navigation();
    new ShoppingCart();
    new FormValidator();

    // 4. Enable Visual Experience Interactions (Using FPS bounds closure mapping precisely decoupled naturally)
    new ProductHoverEngine(canAnimateCheck);
    new ScrollAnimations(canAnimateCheck);
    new Wishlist();

    // 5. Initialize Shop Products from Sanity (if on shop page)
    if (document.querySelector('.shop-grid')) {
        initShopProducts();
    }
    
    // 6. Hero Bouquet Entrance Animation
    const heroBouquet = document.getElementById('heroBouquet');
    if (heroBouquet && typeof anime !== 'undefined') {
        anime({
            targets: heroBouquet,
            translateY: [80, 0],
            scale: [0.9, 1],
            rotate: [5, 0],
            opacity: [0, 1],
            duration: 3000,
            delay: 100,
            easing: 'easeOutQuart'
        });
    }
    
});
