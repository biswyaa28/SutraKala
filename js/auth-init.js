// js/auth-init.js
/**
 * Authentication Initialization
 * Initialize AuthManager, AuthUI, and LoginModal on page load
 */

import { initFirebase } from './firebase-init.js';
import { authManager } from './core/auth-manager.js';
import { AuthUI } from './features/auth/auth-ui.js';
import { LoginModal } from './features/auth/login-modal.js';

/**
 * Initialize authentication system
 */
async function initAuth() {
  try {
    console.log('[AuthInit] Starting authentication initialization...');

    // Wait for Firebase to be fully initialized
    await initFirebase();
    console.log('[AuthInit] Firebase ready');

    // Initialize AuthManager (sets up auth state listener)
    await authManager.init();
    console.log('[AuthInit] AuthManager ready');

    // Initialize AuthUI in navbar
    const authUI = new AuthUI('authUIContainer');
    console.log('[AuthInit] AuthUI ready');

    // Initialize LoginModal
    const loginModal = new LoginModal('loginModal');
    console.log('[AuthInit] LoginModal ready');

    console.log('[AuthInit] ✅ Authentication system initialized successfully');

    // Export for debugging
    window.authDebug = {
      authManager,
      authUI,
      loginModal
    };
  } catch (error) {
    console.error('[AuthInit] ❌ Failed to initialize authentication:', error);
    console.error('[AuthInit] Error stack:', error.stack);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  // DOM already loaded
  initAuth();
}

export { initAuth };
