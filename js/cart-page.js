// js/cart-page.js
import { storage } from './utils/storage.js';
import { showToast } from './utils/toast.js';

class CartPage {
    constructor() {
        this.items = storage.get('craftedloop_cart', []);
        this.init();
    }

    init() {
        this.renderCart();
        this.updateSummary();
        this.bindEvents();
    }

    bindEvents() {
        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.handleCheckout());
        }

        // Cart button in header (reload current page)
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
                mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.classList.toggle('active');
            });
        }
    }

    renderCart() {
        const cartItemsList = document.getElementById('cartItemsList');
        const emptyState = document.getElementById('emptyState');
        const checkoutSection = document.getElementById('checkoutSection');
        const cartCount = document.getElementById('cartCount');

        if (!cartItemsList) return;

        // Update cart count badge
        if (cartCount) {
            cartCount.textContent = this.items.length;
        }

        if (this.items.length === 0) {
            cartItemsList.style.display = 'none';
            emptyState.style.display = 'block';
            if (checkoutSection) checkoutSection.style.display = 'none';
            return;
        }

        cartItemsList.style.display = 'block';
        emptyState.style.display = 'none';
        if (checkoutSection) checkoutSection.style.display = 'flex';

        cartItemsList.innerHTML = this.items.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <i class="fas fa-mitten" aria-hidden="true"></i>
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name || item.product || 'Item'}</h3>
                    <p class="cart-item-price">₹${(item.price || 0).toLocaleString()}</p>
                </div>
                <button class="cart-item-remove" data-index="${index}" aria-label="Remove ${item.name || 'item'} from cart">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');

        // Bind remove buttons
        cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.removeItem(index);
            });
        });
    }

    updateSummary() {
        const itemCount = document.getElementById('itemCount');
        const subtotal = document.getElementById('subtotal');
        const totalAmount = document.getElementById('totalAmount');

        const total = this.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

        if (itemCount) itemCount.textContent = this.items.length;
        if (subtotal) subtotal.textContent = `₹${total.toLocaleString()}`;
        if (totalAmount) totalAmount.textContent = `₹${total.toLocaleString()}`;
    }

    removeItem(index) {
        this.items.splice(index, 1);
        storage.set('craftedloop_cart', this.items);
        this.renderCart();
        this.updateSummary();
        showToast('Item removed from cart');
    }

    handleCheckout() {
        if (this.items.length === 0) {
            showToast('Your cart is empty');
            return;
        }

        // Get form values
        const fullName = document.getElementById('fullName')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const address = document.getElementById('address')?.value.trim();
        const city = document.getElementById('city')?.value.trim();
        const state = document.getElementById('state')?.value.trim();
        const pincode = document.getElementById('pincode')?.value.trim();

        // Validate required fields
        if (!fullName || !phone || !address || !city || !state || !pincode) {
            showToast('Please fill in all required fields');
            
            // Focus on first empty required field
            const form = document.getElementById('addressForm');
            const firstEmpty = form?.querySelector('input:required:invalid, textarea:required:invalid');
            if (firstEmpty) firstEmpty.focus();
            return;
        }

        // Validate phone number format
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(phone)) {
            showToast('Please enter a valid phone number');
            document.getElementById('phone')?.focus();
            return;
        }

        // Validate pincode format (6 digits)
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(pincode)) {
            showToast('Please enter a valid 6-digit PIN code');
            document.getElementById('pincode')?.focus();
            return;
        }

        // Build WhatsApp message
        let message = "Hi SutraKala, I would like to place an order:%0A%0A";
        
        // Add items
        message += "*Order Items:*%0A";
        let total = 0;
        this.items.forEach((item, index) => {
            const price = Number(item.price) || 0;
            const name = item.name || item.product || 'Item';
            message += `${index + 1}. ${name} - ₹${price.toLocaleString()}%0A`;
            total += price;
        });

        // Add total
        message += `%0A*Total: ₹${total.toLocaleString()}*%0A%0A`;

        // Add delivery address
        message += "*Delivery Address:*%0A";
        message += `Name: ${fullName}%0A`;
        message += `Phone: ${phone}%0A`;
        message += `Address: ${address}%0A`;
        message += `City: ${city}%0A`;
        message += `State: ${state}%0A`;
        message += `PIN: ${pincode}`;

        // Open WhatsApp
        const whatsappURL = `https://wa.me/919103329604?text=${message}`;
        window.open(whatsappURL, '_blank');

        // Show success message
        showToast('Redirecting to WhatsApp...');
    }
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    new CartPage();
});
