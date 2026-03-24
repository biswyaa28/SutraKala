// js/performance-traces.js
// Custom performance traces for key user interactions

import { createTrace, trackUserAction, trackAsyncOperation, isProduction } from './firebase-init.js';

/**
 * Shop Page Performance Trace
 * Tracks shop page load time and product rendering
 */
export class ShopPageTrace {
  constructor() {
    if (!isProduction) return;
    
    this.trace = createTrace('shop_page_experience');
    this.trace?.start();
    
    // Track when products are rendered
    this.observeProductLoad();
  }

  observeProductLoad() {
    const productGrid = document.querySelector('.shop-grid');
    if (!productGrid) return;

    // Use MutationObserver to detect when products are added
    const observer = new MutationObserver(() => {
      const productCount = productGrid.querySelectorAll('.shop-card').length;
      
      if (productCount > 0) {
        this.trace?.putMetric('products_loaded', productCount);
        this.trace?.putAttribute('page', 'shop');
        this.stop();
        observer.disconnect();
      }
    });

    observer.observe(productGrid, { childList: true, subtree: true });

    // Fallback: stop after 5 seconds if products don't load
    setTimeout(() => {
      this.stop();
      observer.disconnect();
    }, 5000);
  }

  stop() {
    this.trace?.stop();
  }
}

/**
 * Add to Cart Performance Trace
 * Tracks add to cart interactions and cart update time
 */
export class AddToCartTrace {
  constructor() {
    this.setupListeners();
  }

  setupListeners() {
    document.addEventListener('click', (e) => {
      const addToCartBtn = e.target.closest('.btn-add-to-cart');
      
      if (addToCartBtn) {
        const productName = addToCartBtn.dataset.product;
        const productPrice = addToCartBtn.dataset.price;
        
        trackUserAction('add_to_cart', {
          product_name: productName,
          product_price: productPrice,
          page: window.location.pathname
        });
      }
    });
  }
}

/**
 * Cart Page Performance Trace
 * Tracks cart page load and checkout flow
 */
export class CartPageTrace {
  constructor() {
    if (!isProduction) return;
    
    this.trace = createTrace('cart_page_load');
    this.trace?.start();
    
    this.trackCartItems();
    this.trackCheckout();
  }

  trackCartItems() {
    // Wait for cart to be rendered
    const checkCart = setInterval(() => {
      const cartItems = document.querySelectorAll('.cart-item');
      
      if (cartItems.length > 0 || document.getElementById('emptyState')?.style.display !== 'none') {
        this.trace?.putMetric('cart_items_count', cartItems.length);
        this.trace?.stop();
        clearInterval(checkCart);
      }
    }, 100);

    // Timeout after 3 seconds
    setTimeout(() => {
      clearInterval(checkCart);
      this.trace?.stop();
    }, 3000);
  }

  trackCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        trackUserAction('checkout_initiated', {
          cart_value: document.getElementById('totalAmount')?.textContent || '0',
          page: 'cart'
        });
      });
    }
  }
}

/**
 * Navigation Performance Trace
 * Tracks navigation between pages
 */
export class NavigationTrace {
  constructor() {
    this.trackNavClicks();
  }

  trackNavClicks() {
    document.addEventListener('click', (e) => {
      const navLink = e.target.closest('.nav-link, .mobile-nav-link, .btn-continue-shopping');
      
      if (navLink) {
        const destination = navLink.getAttribute('href') || navLink.textContent;
        
        trackUserAction('navigation', {
          from: window.location.pathname,
          to: destination,
          link_type: navLink.className
        });
      }
    });
  }
}

/**
 * Form Submission Performance Trace
 * Tracks contact form and address form submissions
 */
export class FormSubmissionTrace {
  constructor() {
    this.trackForms();
  }

  trackForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        trackUserAction('contact_form_submit', {
          form_type: 'contact',
          page: window.location.pathname
        });
      });
    }

    // Address form (cart page)
    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
      addressForm.addEventListener('submit', (e) => {
        trackUserAction('address_form_filled', {
          form_type: 'delivery_address',
          page: 'cart'
        });
      });
    }
  }
}

/**
 * Image Load Performance Trace
 * Tracks product image loading time
 */
export class ImageLoadTrace {
  constructor() {
    this.trackImageLoading();
  }

  trackImageLoading() {
    if (!isProduction) return;

    const trace = createTrace('product_images_load');
    trace?.start();

    const images = document.querySelectorAll('.shop-card-image img, .cart-item-image img');
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      trace?.stop();
      return;
    }

    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          
          if (loadedCount === totalImages) {
            trace?.putMetric('images_loaded', totalImages);
            trace?.putAttribute('page', window.location.pathname);
            trace?.stop();
          }
        });

        img.addEventListener('error', () => {
          loadedCount++;
          
          if (loadedCount === totalImages) {
            trace?.putMetric('images_loaded', totalImages);
            trace?.putMetric('images_failed', 1);
            trace?.stop();
          }
        });
      }
    });

    // Check if all images were already loaded
    if (loadedCount === totalImages) {
      trace?.putMetric('images_loaded', totalImages);
      trace?.stop();
    }

    // Timeout after 10 seconds
    setTimeout(() => {
      trace?.putMetric('images_loaded', loadedCount);
      trace?.putMetric('images_total', totalImages);
      trace?.stop();
    }, 10000);
  }
}

// Initialize traces based on current page
export function initPageTraces() {
  const currentPage = window.location.pathname;

  // Common traces for all pages
  new NavigationTrace();
  new FormSubmissionTrace();

  // Page-specific traces
  if (currentPage.includes('shop.html') || currentPage.endsWith('/shop')) {
    new ShopPageTrace();
    new AddToCartTrace();
    new ImageLoadTrace();
  }

  if (currentPage.includes('cart.html') || currentPage.endsWith('/cart')) {
    new CartPageTrace();
  }

  // Track initial page view
  trackUserAction('page_view', {
    page: currentPage,
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  });
}
