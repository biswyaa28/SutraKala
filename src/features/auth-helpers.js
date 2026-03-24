// js/features/auth-helpers.js
/**
 * Firebase Authentication helper functions
 * Provides high-level API for Google Sign-In and Phone OTP authentication
 */

import { getAuthInstance } from '../config/firebase-init.js';
import { getAuthErrorMessage } from './auth-errors.js';

/**
 * Sign in with Google popup (with automatic fallback to redirect)
 * @param {boolean} forceRedirect - Force use of redirect instead of popup
 * @returns {Promise<Object>} User credential with user data
 * @throws {Error} Firebase auth error
 */
export async function signInWithGoogle(forceRedirect = false) {
  try {
    const auth = getAuthInstance();
    if (!auth) {
      throw new Error('Firebase Auth not initialized. Please refresh the page and try again.');
    }

    // Dynamically import Firebase auth methods
    const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } =
      await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');

    const provider = new GoogleAuthProvider();

    // Add additional OAuth scopes if needed
    provider.addScope('profile');
    provider.addScope('email');

    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account' // Force account selection
    });

    // Try popup first, fallback to redirect if it fails
    if (forceRedirect) {
      await signInWithRedirect(auth, provider);
      // Redirect will happen, no return value
      return null;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      return {
        user: result.user,
        credential: result.credential,
        operationType: result.operationType
      };
    } catch (popupError) {
      // If popup was blocked or failed, try redirect
      if (
        popupError.code === 'auth/popup-blocked' ||
        popupError.code === 'auth/popup-closed-by-user' ||
        popupError.code === 'auth/cancelled-popup-request'
      ) {
        await signInWithRedirect(auth, provider);
        // Redirect will happen, no return value
        return null;
      }
      throw popupError; // Re-throw if it's a different error
    }
  } catch (error) {
    // Provide helpful error messages
    let errorMessage = getAuthErrorMessage(error);

    if (error.code === 'auth/unauthorized-domain') {
      errorMessage = `Unauthorized domain error.

Please add '${window.location.hostname}' to your Firebase authorized domains:
1. Go to Firebase Console → Authentication → Settings
2. Add '${window.location.hostname}' to Authorized domains
3. Wait 1-2 minutes and try again.`;
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = `Google Sign-In is not enabled.

Please enable it in Firebase Console:
1. Go to Firebase Console → Authentication → Sign-in method
2. Click on "Google"
3. Toggle "Enable" to ON
4. Click "Save"`;
    }

    throw new Error(errorMessage);
  }
}

/**
 * Check for redirect result after user comes back from Google sign-in
 * Call this on page load to handle redirect-based authentication
 * @returns {Promise<Object|null>} User credential or null if no redirect
 */
export async function checkGoogleRedirectResult() {
  try {
    const auth = getAuthInstance();
    if (!auth) {
      return null;
    }

    const { getRedirectResult } =
      await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');

    const result = await getRedirectResult(auth);

    if (result && result.user) {
      return {
        user: result.user,
        credential: result.credential,
        operationType: result.operationType
      };
    }

    return null;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Initialize reCAPTCHA verifier for phone authentication
 * @param {string} containerId - ID of container element for reCAPTCHA
 * @param {boolean} invisible - Whether to use invisible reCAPTCHA (default: true)
 * @returns {Promise<Object>} RecaptchaVerifier instance
 */
export async function initRecaptcha(containerId = 'recaptcha-container', invisible = true) {
  try {
    const auth = getAuthInstance();
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    // Ensure auth is ready by waiting for it to be fully initialized
    await new Promise((resolve) => setTimeout(resolve, 100));

    const { RecaptchaVerifier } =
      await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');

    const verifier = new RecaptchaVerifier(
      containerId,
      {
        size: invisible ? 'invisible' : 'normal',
        callback: () => {},
        'expired-callback': () => {}
      },
      auth
    );

    // Render the reCAPTCHA widget
    await verifier.render();

    return verifier;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Send OTP to phone number
 * @param {string} phoneNumber - Phone number with country code (+91XXXXXXXXXX)
 * @param {Object} recaptchaVerifier - RecaptchaVerifier instance
 * @returns {Promise<Object>} Confirmation result object with confirm() method
 */
export async function sendPhoneOTP(phoneNumber, recaptchaVerifier) {
  try {
    const auth = getAuthInstance();
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      throw new Error('Phone number must include country code (e.g., +91XXXXXXXXXX)');
    }

    const { signInWithPhoneNumber } =
      await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);

    // Store the confirmation result, not just the verification ID
    // The confirmationResult has a confirm() method we need later
    return confirmationResult;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Verify OTP code and complete phone authentication
 * @param {Object} confirmationResult - Confirmation result from sendPhoneOTP
 * @param {string} otpCode - 6-digit OTP code entered by user
 * @returns {Promise<Object>} User credential with user data
 */
export async function verifyPhoneOTP(confirmationResult, otpCode) {
  try {
    if (!confirmationResult) {
      throw new Error('Confirmation result is required');
    }

    if (!otpCode || otpCode.length !== 6) {
      throw new Error('Please enter a valid 6-digit OTP');
    }

    // Use the confirm() method on the confirmationResult
    const result = await confirmationResult.confirm(otpCode);

    return {
      user: result.user,
      operationType: result.operationType
    };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export async function signOut() {
  try {
    const auth = getAuthInstance();
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    const { signOut: firebaseSignOut } =
      await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');

    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Get current authenticated user
 * @returns {Object|null} Current user or null if not authenticated
 */
export function getCurrentUser() {
  const auth = getAuthInstance();
  return auth ? auth.currentUser : null;
}

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function (user) => {}
 * @returns {Function} Unsubscribe function
 */
export async function onAuthStateChange(callback) {
  try {
    const auth = getAuthInstance();
    if (!auth) {
      return () => {}; // Return empty unsubscribe function
    }

    const { onAuthStateChanged } =
      await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');

    return onAuthStateChanged(auth, callback);
  } catch (error) {
    return () => {}; // Return empty unsubscribe function
  }
}

/**
 * Reload current user data
 * @returns {Promise<void>}
 */
export async function reloadUser() {
  try {
    const auth = getAuthInstance();
    const user = auth?.currentUser;

    if (!user) {
      throw new Error('No user is currently signed in');
    }

    await user.reload();
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Update user profile (displayName, photoURL)
 * @param {Object} profile - Profile data { displayName?, photoURL? }
 * @returns {Promise<void>}
 */
export async function updateUserProfile(profile) {
  try {
    const auth = getAuthInstance();
    const user = auth?.currentUser;

    if (!user) {
      throw new Error('No user is currently signed in');
    }

    const { updateProfile } =
      await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');

    await updateProfile(user, profile);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Delete current user account
 * @returns {Promise<void>}
 */
export async function deleteUserAccount() {
  try {
    const auth = getAuthInstance();
    const user = auth?.currentUser;

    if (!user) {
      throw new Error('No user is currently signed in');
    }

    const { deleteUser } =
      await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');

    await deleteUser(user);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}
