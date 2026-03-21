// js/utils/auth-errors.js
/**
 * User-friendly Firebase Auth error messages
 * Maps Firebase error codes to actionable messages for Indian users
 */

export const AUTH_ERRORS = {
  // Phone authentication errors
  'auth/invalid-phone-number': 'Please enter a valid 10-digit Indian mobile number',
  'auth/missing-phone-number': 'Mobile number is required',
  'auth/quota-exceeded': 'SMS quota exceeded. Please try again later',
  'auth/too-many-requests': 'Too many attempts. Please wait 5 minutes and try again',
  'auth/user-disabled': 'This account has been disabled. Contact support',
  
  // OTP verification errors
  'auth/code-expired': 'OTP expired. Please request a new code',
  'auth/invalid-verification-code': 'Invalid OTP. Please check and try again',
  'auth/invalid-verification-id': 'Verification session expired. Please restart',
  'auth/missing-verification-code': 'Please enter the OTP code',
  'auth/missing-verification-id': 'Verification session not found. Please restart',
  
  // Google Sign-In errors
  'auth/popup-closed-by-user': 'Login cancelled. Please try again',
  'auth/popup-blocked': 'Popup blocked by browser. Please allow popups and retry',
  'auth/cancelled-popup-request': 'Another login is in progress',
  'auth/account-exists-with-different-credential': 'An account already exists with this email using a different login method',
  
  // Network and general errors
  'auth/network-request-failed': 'No internet connection. Please check and retry',
  'auth/timeout': 'Request timed out. Please check your connection',
  'auth/internal-error': 'Something went wrong. Please try again',
  'auth/operation-not-allowed': 'This login method is not enabled. Contact support',
  
  // Session errors
  'auth/requires-recent-login': 'Please log in again to continue',
  'auth/user-not-found': 'No account found. Please sign up first',
  'auth/user-token-expired': 'Session expired. Please log in again',
  
  // reCAPTCHA errors
  'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again',
  'auth/invalid-app-credential': 'reCAPTCHA verification failed. Please refresh the page',
  'auth/missing-app-credential': 'reCAPTCHA not initialized. Please refresh the page',
  
  // Generic fallback
  'auth/unknown': 'An error occurred. Please try again'
};

/**
 * Get user-friendly error message from Firebase error
 * @param {Error} error - Firebase error object
 * @returns {string} User-friendly error message
 */
export function getAuthErrorMessage(error) {
  if (!error) return 'An unknown error occurred';
  
  // Handle Firebase auth errors
  if (error.code && error.code.startsWith('auth/')) {
    return AUTH_ERRORS[error.code] || AUTH_ERRORS['auth/unknown'];
  }
  
  // Handle network errors
  if (error.message && error.message.includes('network')) {
    return AUTH_ERRORS['auth/network-request-failed'];
  }
  
  // Handle timeout errors
  if (error.message && error.message.includes('timeout')) {
    return AUTH_ERRORS['auth/timeout'];
  }
  
  // Fallback to error message or generic message
  return error.message || AUTH_ERRORS['auth/unknown'];
}

/**
 * Format phone number for display (hide middle digits)
 * @param {string} phoneNumber - Phone number with country code (+91XXXXXXXXXX)
 * @returns {string} Formatted phone number (+91 XXXXX ****10)
 */
export function formatPhoneForDisplay(phoneNumber) {
  if (!phoneNumber || phoneNumber.length < 10) return phoneNumber;
  
  // Remove country code for formatting
  const number = phoneNumber.replace('+91', '').replace(/\s/g, '');
  
  if (number.length !== 10) return phoneNumber;
  
  // Show first 5 digits and last 2 digits
  const visible = number.slice(0, 5) + ' ****' + number.slice(-2);
  return `+91 ${visible}`;
}

/**
 * Validate Indian phone number
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid Indian mobile number
 */
export function isValidIndianPhone(phoneNumber) {
  if (!phoneNumber) return false;
  
  // Remove all non-numeric characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Check if it's a valid 10-digit number (with or without +91)
  const withoutCountryCode = cleaned.replace('+91', '');
  
  // Must be exactly 10 digits and start with 6-9
  return /^[6-9]\d{9}$/.test(withoutCountryCode);
}

/**
 * Format Indian phone number for Firebase
 * @param {string} phoneNumber - Phone number input
 * @returns {string} Formatted phone number with country code (+91XXXXXXXXXX)
 */
export function formatPhoneForFirebase(phoneNumber) {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Remove +91 if present at the start
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  }
  
  // Add +91 country code
  return `+91${cleaned}`;
}

/**
 * Format phone number for display with spacing
 * @param {string} phoneNumber - Phone number input
 * @returns {string} Formatted phone number (+91 98765 43210)
 */
export function formatPhoneWithSpacing(phoneNumber) {
  if (!phoneNumber) return '';
  
  const cleaned = phoneNumber.replace(/\D/g, '');
  const withoutCountryCode = cleaned.replace(/^91/, '');
  
  if (withoutCountryCode.length !== 10) return phoneNumber;
  
  // Format as +91 XXXXX XXXXX
  return `+91 ${withoutCountryCode.slice(0, 5)} ${withoutCountryCode.slice(5)}`;
}
