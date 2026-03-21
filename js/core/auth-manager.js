// js/core/auth-manager.js
/**
 * Authentication Manager
 * Centralized auth state management with event emitter pattern
 * Handles auth state changes and coordinates with Firestore
 */

import { onAuthStateChange, getCurrentUser } from './auth-helpers.js';
import { getUserData, createUserDocument, updateLastLogin } from './user-service.js';
import { syncCartOnLogin } from '../utils/cart-sync.js';

class AuthManager {
  constructor() {
    this.user = null;
    this.userData = null;
    this.loading = true;
    this.initialized = false;
    this.listeners = new Map();
    this.unsubscribeAuth = null;
  }

  /**
   * Initialize auth manager and set up auth state listener
   * @returns {Promise<void>}
   */
  async init() {
    if (this.initialized) {
      console.warn('[AuthManager] Already initialized');
      return;
    }

    console.log('[AuthManager] Initializing...');

    try {
      // Set up auth state listener
      this.unsubscribeAuth = await onAuthStateChange(async (user) => {
        await this._handleAuthStateChange(user);
      });

      this.initialized = true;
      console.log('[AuthManager] Initialized successfully');
    } catch (error) {
      console.error('[AuthManager] Initialization failed:', error);
      this.loading = false;
      this.emit('error', error);
    }
  }

  /**
   * Handle authentication state changes
   * @private
   * @param {Object|null} user - Firebase user object
   */
  async _handleAuthStateChange(user) {
    console.log('[AuthManager] Auth state changed:', user ? 'logged in' : 'logged out');
    this.loading = true;
    this.emit('loading', true);

    try {
      if (user) {
        // User is logged in
        this.user = user;

        // Get or create user document in Firestore
        let userData = await getUserData(user.uid);

        if (!userData) {
          // First-time user - create document
          console.log('[AuthManager] First-time user, creating document');
          const provider = user.providerData[0]?.providerId?.includes('google') ? 'google' : 'phone';
          await createUserDocument(user, provider);
          userData = await getUserData(user.uid);
        } else {
          // Existing user - update last login
          await updateLastLogin();
        }

        this.userData = userData;

        // Sync cart on first login
        if (this.isFirstLogin()) {
          console.log('[AuthManager] Syncing cart for first login...');
          const mergedCart = await syncCartOnLogin();
          if (userData) {
            userData.cart = mergedCart;
            this.userData = userData;
          }
        }

        this.emit('login', { user, userData });
      } else {
        // User is logged out
        const wasLoggedIn = this.user !== null;
        this.user = null;
        this.userData = null;

        if (wasLoggedIn) {
          this.emit('logout');
        }
      }
    } catch (error) {
      console.error('[AuthManager] Error handling auth state change:', error);
      this.emit('error', error);
    } finally {
      this.loading = false;
      this.emit('loading', false);
      this.emit('stateChange', {
        user: this.user,
        userData: this.userData,
        loading: this.loading
      });
    }
  }

  /**
   * Check if this is the user's first login in this session
   * @returns {boolean}
   * @private
   */
  isFirstLogin() {
    const key = 'auth_first_login_checked';
    const checked = sessionStorage.getItem(key);
    
    if (!checked) {
      sessionStorage.setItem(key, 'true');
      return true;
    }
    
    return false;
  }

  /**
   * Get current authenticated user
   * @returns {Object|null} Current user
   */
  getUser() {
    return this.user;
  }

  /**
   * Get current user data from Firestore
   * @returns {Object|null} Current user data
   */
  getUserData() {
    return this.userData;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.user !== null;
  }

  /**
   * Check if auth is loading
   * @returns {boolean}
   */
  isLoading() {
    return this.loading;
  }

  /**
   * Refresh user data from Firestore
   * @returns {Promise<Object|null>} Updated user data
   */
  async refreshUserData() {
    if (!this.user) {
      console.warn('[AuthManager] No user to refresh');
      return null;
    }

    try {
      this.userData = await getUserData(this.user.uid);
      this.emit('dataRefresh', this.userData);
      return this.userData;
    } catch (error) {
      console.error('[AuthManager] Failed to refresh user data:', error);
      this.emit('error', error);
      return null;
    }
  }

  /**
   * Add event listener
   * @param {string} event - Event name (login, logout, stateChange, loading, error, dataRefresh)
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event).push(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Emit event to all listeners
   * @private
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[AuthManager] Error in ${event} listener:`, error);
      }
    });
  }

  /**
   * Cleanup and destroy auth manager
   */
  destroy() {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
      this.unsubscribeAuth = null;
    }

    this.listeners.clear();
    this.user = null;
    this.userData = null;
    this.initialized = false;

    console.log('[AuthManager] Destroyed');
  }
}

// Export singleton instance
export const authManager = new AuthManager();

// Export class for testing
export { AuthManager };
