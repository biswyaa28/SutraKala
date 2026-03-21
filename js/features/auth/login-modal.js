// js/features/auth/login-modal.js
/**
 * Login Modal Component
 * Manages authentication flow with state machine: initial → phone-input → otp-verify → success
 */

import { PhoneInput } from './phone-input.js';
import { OTPInput } from './otp-input.js';
import { signInWithGoogle, sendPhoneOTP, verifyPhoneOTP, initRecaptcha } from '../../core/auth-helpers.js';
import { getAuthErrorMessage, formatPhoneForDisplay } from '../../utils/auth-errors.js';

export class LoginModal {
  constructor(modalId = 'loginModal') {
    this.modalId = modalId;
    this.modal = null;
    this.state = 'initial'; // initial | phone-input | otp-verify | loading | success | error
    this.phoneNumber = null;
    this.confirmationResult = null; // Store the confirmation result
    this.recaptchaVerifier = null;
    this.phoneInputComponent = null;
    this.otpInputComponent = null;
    this.resendTimer = null;
    this.resendCountdown = 60;
    
    this.init();
  }

  /**
   * Initialize login modal
   */
  init() {
    // Create modal if it doesn't exist
    if (!document.getElementById(this.modalId)) {
      this.createModal();
    }
    
    this.modal = document.getElementById(this.modalId);
    
    // Listen for open event from AuthUI
    window.addEventListener('openLoginModal', () => this.open());
    
    console.log('[LoginModal] Initialized');
  }

  /**
   * Create modal HTML structure
   */
  createModal() {
    const modalHTML = `
      <div class="modal" id="${this.modalId}" role="dialog" aria-labelledby="loginModalTitle" aria-modal="true" hidden>
        <div class="modal-overlay"></div>
        <div class="modal-content login-modal-content">
          <button class="modal-close" aria-label="Close login modal">
            <i class="fas fa-times"></i>
          </button>

          <div class="login-modal-body" id="loginModalBody">
            <!-- Content will be rendered based on state -->
          </div>

          <!-- reCAPTCHA container (invisible) -->
          <div id="recaptcha-container"></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  /**
   * Open modal
   */
  open() {
    if (!this.modal) return;

    // Reset to initial state
    this.setState('initial');
    
    // Show modal
    this.modal.removeAttribute('hidden');
    setTimeout(() => this.modal.classList.add('is-open'), 10);

    // Bind close events
    this.bindCloseEvents();

    console.log('[LoginModal] Opened');
  }

  /**
   * Close modal
   */
  close() {
    if (!this.modal) return;

    this.modal.classList.remove('is-open');
    
    setTimeout(() => {
      this.modal.setAttribute('hidden', '');
      this.cleanup();
    }, 300);

    console.log('[LoginModal] Closed');
  }

  /**
   * Bind modal close events
   */
  bindCloseEvents() {
    const closeBtn = this.modal.querySelector('.modal-close');
    const overlay = this.modal.querySelector('.modal-overlay');

    closeBtn?.addEventListener('click', () => this.close());
    overlay?.addEventListener('click', () => this.close());

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.close();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  /**
   * Set modal state and render
   * @param {string} newState - New state
   */
  setState(newState) {
    this.state = newState;
    this.render();
  }

  /**
   * Render modal content based on state
   */
  render() {
    const body = this.modal?.querySelector('#loginModalBody');
    if (!body) return;

    switch (this.state) {
      case 'initial':
        this.renderInitial(body);
        break;
      case 'phone-input':
        this.renderPhoneInput(body);
        break;
      case 'otp-verify':
        this.renderOTPVerify(body);
        break;
      case 'loading':
        this.renderLoading(body);
        break;
      case 'success':
        this.renderSuccess(body);
        break;
      default:
        this.renderInitial(body);
    }
  }

  /**
   * Render initial screen (Choose login method)
   */
  renderInitial(container) {
    container.innerHTML = `
      <div class="login-modal-header">
        <h2 id="loginModalTitle" class="login-modal-title">Welcome to SutraKala</h2>
        <p class="login-modal-subtitle">Sign in to save your cart and track orders</p>
      </div>

      <div class="login-methods">
        <button class="login-method-btn login-method-google" id="googleLoginBtn">
          <i class="fab fa-google"></i>
          <span>Continue with Google</span>
        </button>

        <div class="login-divider">
          <span>or</span>
        </div>

        <button class="login-method-btn login-method-phone" id="phoneLoginBtn">
          <i class="fas fa-mobile-alt"></i>
          <span>Continue with Phone OTP</span>
        </button>
      </div>

      <div class="login-guest-link">
        <p>Just browsing? <a href="shop.html" class="link">Continue as guest</a></p>
      </div>
    `;

    // Bind button events
    setTimeout(() => {
      document.getElementById('googleLoginBtn')?.addEventListener('click', () => this.handleGoogleLogin());
      document.getElementById('phoneLoginBtn')?.addEventListener('click', () => this.setState('phone-input'));
    }, 0);
  }

  /**
   * Render phone input screen
   */
  renderPhoneInput(container) {
    container.innerHTML = `
      <div class="login-modal-header">
        <button class="login-back-btn" id="backBtn">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2 class="login-modal-title">Enter your mobile number</h2>
        <p class="login-modal-subtitle">We'll send you a verification code</p>
      </div>

      <div class="login-phone-form">
        <div class="form-group">
          <label for="phoneInput" class="form-label">Mobile Number</label>
          <div class="phone-input-wrapper">
            <input 
              type="tel" 
              id="phoneInput" 
              class="form-input phone-input" 
              placeholder="Enter 10-digit number"
              autocomplete="tel"
              required
            />
          </div>
          <p class="form-help-text">
            <i class="fas fa-info-circle"></i>
            Standard SMS rates may apply
          </p>
        </div>

        <button class="btn btn-primary btn-block" id="sendOTPBtn">
          Send OTP
        </button>
      </div>
    `;

    // Initialize phone input component
    setTimeout(() => {
      const phoneInput = document.getElementById('phoneInput');
      if (phoneInput) {
        this.phoneInputComponent = new PhoneInput(phoneInput);
        phoneInput.focus();
      }

      // Bind events
      document.getElementById('backBtn')?.addEventListener('click', () => this.setState('initial'));
      document.getElementById('sendOTPBtn')?.addEventListener('click', () => this.handleSendOTP());
      
      // Send OTP on Enter key
      phoneInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleSendOTP();
        }
      });
    }, 0);
  }

  /**
   * Render OTP verification screen
   */
  renderOTPVerify(container) {
    const maskedPhone = formatPhoneForDisplay(this.phoneNumber);
    
    container.innerHTML = `
      <div class="login-modal-header">
        <button class="login-back-btn" id="backBtn">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2 class="login-modal-title">Enter verification code</h2>
        <p class="login-modal-subtitle">OTP sent to ${maskedPhone}</p>
      </div>

      <div class="login-otp-form">
        <div class="otp-input-wrapper" id="otpInputWrapper"></div>

        <button class="btn btn-primary btn-block" id="verifyOTPBtn">
          Verify OTP
        </button>

        <div class="otp-resend">
          <p id="resendText">Didn't receive code? <button class="link-btn" id="resendBtn" disabled>Resend OTP (<span id="countdown">60</span>s)</button></p>
        </div>
      </div>
    `;

    // Initialize OTP input component
    setTimeout(() => {
      const otpWrapper = document.getElementById('otpInputWrapper');
      if (otpWrapper) {
        this.otpInputComponent = new OTPInput(otpWrapper, {
          length: 6,
          type: 'numeric',
          autoSubmit: false,
          onComplete: (code) => {
            console.log('[LoginModal] OTP entered:', code);
          }
        });
      }

      // Start resend countdown
      this.startResendCountdown();

      // Bind events
      document.getElementById('backBtn')?.addEventListener('click', () => {
        this.clearResendTimer();
        this.setState('phone-input');
      });
      document.getElementById('verifyOTPBtn')?.addEventListener('click', () => this.handleVerifyOTP());
      document.getElementById('resendBtn')?.addEventListener('click', () => this.handleResendOTP());
    }, 0);
  }

  /**
   * Render loading screen
   */
  renderLoading(container) {
    container.innerHTML = `
      <div class="login-loading">
        <div class="spinner"></div>
        <p>Please wait...</p>
      </div>
    `;
  }

  /**
   * Render success screen
   */
  renderSuccess(container) {
    container.innerHTML = `
      <div class="login-success">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Welcome back!</h2>
        <p>You've successfully logged in</p>
      </div>
    `;

    // Auto-close after 2 seconds
    setTimeout(() => this.close(), 2000);
  }

  /**
   * Handle Google login
   */
  async handleGoogleLogin() {
    try {
      this.setState('loading');
      
      const result = await signInWithGoogle();
      console.log('[LoginModal] Google login successful:', result.user.uid);
      
      this.setState('success');
    } catch (error) {
      console.error('[LoginModal] Google login failed:', error);
      this.showError(error.message || 'Failed to sign in with Google');
      this.setState('initial');
    }
  }

  /**
   * Handle send OTP
   */
  async handleSendOTP() {
    try {
      // Validate phone number
      if (!this.phoneInputComponent || !this.phoneInputComponent.validate()) {
        this.phoneInputComponent?.setError('Please enter a valid 10-digit mobile number');
        return;
      }

      const phoneNumber = this.phoneInputComponent.getFormattedValue();
      this.phoneNumber = phoneNumber;

      this.setState('loading');

      // Initialize reCAPTCHA if not already done
      if (!this.recaptchaVerifier) {
        this.recaptchaVerifier = await initRecaptcha('recaptcha-container', true);
      }

      // Send OTP
      this.confirmationResult = await sendPhoneOTP(phoneNumber, this.recaptchaVerifier);
      
      console.log('[LoginModal] OTP sent successfully');
      this.setState('otp-verify');
    } catch (error) {
      console.error('[LoginModal] Send OTP failed:', error);
      this.showError(error.message || 'Failed to send OTP');
      this.setState('phone-input');
    }
  }

  /**
   * Handle verify OTP
   */
  async handleVerifyOTP() {
    try {
      if (!this.otpInputComponent || !this.otpInputComponent.isFilled()) {
        this.otpInputComponent?.setError('Please enter the complete OTP');
        return;
      }

      const otpCode = this.otpInputComponent.getValue();
      
      this.setState('loading');

      // Verify OTP
      const result = await verifyPhoneOTP(this.confirmationResult, otpCode);
      
      console.log('[LoginModal] OTP verification successful:', result.user.uid);
      this.setState('success');
    } catch (error) {
      console.error('[LoginModal] OTP verification failed:', error);
      this.otpInputComponent?.setError(error.message || 'Invalid OTP');
      this.otpInputComponent?.clear();
      this.setState('otp-verify');
    }
  }

  /**
   * Handle resend OTP
   */
  async handleResendOTP() {
    try {
      this.clearResendTimer();
      this.otpInputComponent?.clear();
      
      // Re-send OTP with same phone number
      this.confirmationResult = await sendPhoneOTP(this.phoneNumber, this.recaptchaVerifier);
      
      console.log('[LoginModal] OTP resent successfully');
      this.showSuccess('OTP resent successfully');
      
      // Restart countdown
      this.startResendCountdown();
    } catch (error) {
      console.error('[LoginModal] Resend OTP failed:', error);
      this.showError(error.message || 'Failed to resend OTP');
    }
  }

  /**
   * Start resend countdown timer
   */
  startResendCountdown() {
    this.resendCountdown = 60;
    const resendBtn = document.getElementById('resendBtn');
    const countdownEl = document.getElementById('countdown');

    if (!resendBtn || !countdownEl) return;

    resendBtn.disabled = true;
    
    this.resendTimer = setInterval(() => {
      this.resendCountdown--;
      countdownEl.textContent = this.resendCountdown;

      if (this.resendCountdown <= 0) {
        this.clearResendTimer();
        resendBtn.disabled = false;
        resendBtn.innerHTML = 'Resend OTP';
      }
    }, 1000);
  }

  /**
   * Clear resend timer
   */
  clearResendTimer() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = null;
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    this.showToast(message, 'error');
  }

  /**
   * Show success message
   * @param {string} message - Success message
   */
  showSuccess(message) {
    this.showToast(message, 'success');
  }

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type ('success' or 'error')
   */
  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    toast.hidden = false;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.hidden = true;
      }, 300);
    }, 3000);
  }

  /**
   * Cleanup modal resources
   */
  cleanup() {
    this.clearResendTimer();
    
    if (this.phoneInputComponent) {
      this.phoneInputComponent = null;
    }
    
    if (this.otpInputComponent) {
      this.otpInputComponent = null;
    }
    
    this.phoneNumber = null;
    this.confirmationResult = null;
  }

  /**
   * Destroy modal
   */
  destroy() {
    this.cleanup();
    this.close();
    
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
    
    console.log('[LoginModal] Destroyed');
  }
}
