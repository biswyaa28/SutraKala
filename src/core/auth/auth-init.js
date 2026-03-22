// js/auth-init.js
/**
 * Authentication Initialization
 * Initialize AuthManager, AuthUI, and LoginModal on page load
 */

import { initFirebase } from "./firebase-init.js";
import { authManager } from "./core/auth-manager.js";
import { AuthUI } from "./features/auth/auth-ui.js";
import { LoginModal } from "./features/auth/login-modal.js";

/**
 * Initialize authentication system
 */
async function initAuth() {
  try {
    // Wait for Firebase to be fully initialized
    await initFirebase();

    // Initialize AuthManager (sets up auth state listener)
    await authManager.init();

    // Initialize AuthUI in navbar
    const authUI = new AuthUI("authUIContainer");

    // Initialize LoginModal
    const loginModal = new LoginModal("loginModal");

    // Export for debugging
    window.authDebug = {
      authManager,
      authUI,
      loginModal,
    };
  } catch (error) {
    // Error handling
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuth);
} else {
  // DOM already loaded
  initAuth();
}

export { initAuth };
