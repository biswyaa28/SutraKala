// js/features/auth/login-page.js
/**
 * Login Page Component
 * Handles Google authentication on the dedicated login page
 * Redirects users back to the referring page after successful login
 */

import { initFirebase } from '../../firebase-init.js';
import { signInWithGoogle } from '../../core/auth-helpers.js';
import { authManager } from '../../core/auth-manager.js';

class LoginPage {
  constructor() {
    this.googleLoginBtn = null;
    this.errorMessageEl = null;
    this.loginContentEl = null;
    this.redirectUrl = null;
    
    this.init();
  }

  /**
   * Initialize login page
   */
  async init() {

    // Get DOM elements
    this.googleLoginBtn = document.getElementById('googleLoginBtn');
    this.errorMessageEl = document.getElementById('errorMessage');
    this.loginContentEl = document.getElementById('loginContent');

    // Get redirect URL from query params or default to home
    const urlParams = new URLSearchParams(window.location.search);
    this.redirectUrl = urlParams.get('redirect') || 'index.html';

    try {
      // Initialize Firebase first
      await initFirebase();

      // Initialize AuthManager
      await authManager.init();
      
      // Check if user is already logged in
      await this.checkAuthState();

      // Bind events
      this.bindEvents();

    } catch (error) {
      this.showError('Failed to initialize authentication system. Please refresh the page.', '');
    }
  }

  /**
   * Check if user is already authenticated
   */
  async checkAuthState() {
    try {
      // Wait a bit for auth state to settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = authManager.getUser();
      
      if (user) {
        this.showSuccess();
        setTimeout(() => {
          this.redirectAfterLogin();
        }, 1000);
      }
    } catch (error) {
      // Don't show error for initial check, just log it
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    this.googleLoginBtn?.addEventListener('click', () => this.handleGoogleLogin());
  }

  /**
   * Handle Google login
   */
  async handleGoogleLogin() {
    try {
      
      // Clear any previous errors
      this.hideError();

      // Show loading state
      this.setLoading(true);

      // Sign in with Google
      const result = await signInWithGoogle();

      // Show success message briefly, then redirect
      this.showSuccess();
      
      setTimeout(() => {
        this.redirectAfterLogin();
      }, 1000);

    } catch (error) {
      
      // Restore form
      this.setLoading(false);
      
      // Get user-friendly error message
      const errorMessage = this.getFriendlyErrorMessage(error);
      this.showError(errorMessage, error.code);
    }
  }

  /**
   * Get user-friendly error message
   * @param {Error} error - Error object
   * @returns {string} Friendly error message
   */
  getFriendlyErrorMessage(error) {
    const errorCode = error.code;
    
    if (errorCode === 'auth/popup-closed-by-user') {
      return 'Sign-in was cancelled. Please try again.';
    } else if (errorCode === 'auth/popup-blocked') {
      return 'Pop-up was blocked by your browser. Please allow pop-ups for this site.';
    } else if (errorCode === 'auth/network-request-failed') {
      return 'Network error. Please check your internet connection and try again.';
    } else if (errorCode === 'auth/unauthorized-domain') {
      return 'This domain is not authorized for Google Sign-In. Please contact support.';
    } else if (errorCode === 'auth/operation-not-allowed') {
      return 'Google Sign-In is not enabled. Please contact support.';
    } else if (error.message) {
      return error.message;
    } else {
      return 'Failed to sign in with Google. Please try again.';
    }
  }

  /**
   * Set loading state
   * @param {boolean} loading - Whether to show loading state
   */
  setLoading(loading) {
    if (!this.loginContentEl) return;

    if (loading) {
      this.loginContentEl.innerHTML = `
        <h1 class="login-title">Welcome to SutraKala</h1>
        <p class="login-subtitle">Sign in to save your cart and track orders</p>

        <div class="login-loading" style="padding: 2rem 0;">
          <div class="spinner"></div>
          <p>Signing you in...</p>
        </div>
      `;
    } else {
      // Restore the login form
      this.restoreLoginForm();
    }
  }

  /**
   * Restore login form
   */
  restoreLoginForm() {
    if (!this.loginContentEl) return;

    this.loginContentEl.innerHTML = `
      <h1 class="login-title">Welcome to SutraKala</h1>
      <p class="login-subtitle">Sign in to save your cart and track orders</p>

      <div id="errorMessage" class="error-message" role="alert"></div>

      <button class="google-login-btn" id="googleLoginBtn">
        <i class="fab fa-google"></i>
        <span>Continue with Google</span>
      </button>

      <div class="login-guest">
        <p>Just browsing? <a href="index.html">Continue as guest</a></p>
      </div>
    `;

    // Re-bind elements
    this.googleLoginBtn = document.getElementById('googleLoginBtn');
    this.errorMessageEl = document.getElementById('errorMessage');
    
    // Re-bind events
    this.bindEvents();
  }

  /**
   * Show success state
   */
  showSuccess() {
    if (!this.loginContentEl) return;

    this.loginContentEl.innerHTML = `
      <div class="login-loading">
        <div style="font-size: 3rem; color: var(--color-mint); margin-bottom: 1rem;">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2 style="color: var(--color-sage); margin-bottom: 0.5rem;">Welcome back!</h2>
        <p style="color: var(--color-text-secondary);">Redirecting you now...</p>
      </div>
    `;
  }

  /**
   * Show error message with helpful actions
   * @param {string} message - Error message to display
   * @param {string} errorCode - Firebase error code
   */
  showError(message, errorCode = '') {
    if (!this.errorMessageEl) return;

    let errorHTML = `<strong>⚠️ Sign-In Failed</strong><br>${message}`;
    
    // Add helpful links based on error code
    if (errorCode === 'auth/unauthorized-domain') {
      errorHTML += `<br><br><a href="GOOGLE_SIGNIN_FIX.md" target="_blank" style="color: #764ba2; text-decoration: underline;">📖 View Fix Guide</a>`;
    } else if (errorCode === 'auth/operation-not-allowed') {
      errorHTML += `<br><br><a href="GOOGLE_SIGNIN_FIX.md" target="_blank" style="color: #764ba2; text-decoration: underline;">📖 View Setup Guide</a>`;
    } else if (errorCode === 'auth/popup-blocked') {
      errorHTML += `<br><br><small>💡 Tip: Allow popups for this site, or we'll try a different method.</small>`;
    }
    
    this.errorMessageEl.innerHTML = errorHTML;
    this.errorMessageEl.classList.add('show');
  }

  /**
   * Hide error message
   */
  hideError() {
    if (!this.errorMessageEl) return;

    this.errorMessageEl.textContent = '';
    this.errorMessageEl.classList.remove('show');
  }

  /**
   * Redirect user after successful login
   */
  redirectAfterLogin() {
    
    // Clean the redirect URL to prevent open redirect vulnerabilities
    const cleanUrl = this.sanitizeRedirectUrl(this.redirectUrl);
    
    window.location.href = cleanUrl;
  }

  /**
   * Sanitize redirect URL to prevent open redirect attacks
   * @param {string} url - URL to sanitize
   * @returns {string} Safe URL
   */
  sanitizeRedirectUrl(url) {
    // Only allow relative URLs (no protocol)
    if (!url || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      return 'index.html';
    }

    // Remove any leading slashes and ensure it's a local path
    const cleanUrl = url.replace(/^\/+/, '');
    
    // Whitelist of allowed pages
    const allowedPages = [
      'index.html',
      'shop.html',
      'cart.html',
      'pages/orders.html',
      'pages/addresses.html',
      'pages/profile.html'
    ];

    // If URL is in whitelist, return it; otherwise default to home
    return allowedPages.includes(cleanUrl) ? cleanUrl : 'index.html';
  }
}

// Initialize login page when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new LoginPage());
} else {
  new LoginPage();
}
