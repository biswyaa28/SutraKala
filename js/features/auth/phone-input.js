// js/features/auth/phone-input.js
/**
 * Phone Input Component
 * Auto-formatting for Indian mobile numbers (+91)
 */

import { isValidIndianPhone, formatPhoneWithSpacing, formatPhoneForFirebase } from '../../utils/auth-errors.js';

export class PhoneInput {
  constructor(inputElement, options = {}) {
    if (!inputElement) {
      throw new Error('Phone input element is required');
    }

    this.input = inputElement;
    this.options = {
      countryCode: '+91',
      placeholder: 'Enter 10-digit mobile number',
      autoFormat: true,
      ...options
    };

    this.init();
  }

  init() {
    this.input.type = 'tel';
    this.input.inputMode = 'numeric';
    this.input.placeholder = this.options.placeholder;
    this.input.maxLength = 15;

    this.addCountryCodePrefix();
    this.input.addEventListener('input', (e) => this.handleInput(e));
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.input.addEventListener('paste', (e) => this.handlePaste(e));
    this.input.addEventListener('blur', () => this.validate());

    console.log('[PhoneInput] Initialized');
  }

  addCountryCodePrefix() {
    const container = this.input.parentElement;
    if (!container || container.querySelector('.phone-prefix')) return;

    container.classList.add('phone-input-container');
    const prefix = document.createElement('span');
    prefix.className = 'phone-prefix';
    prefix.textContent = this.options.countryCode;
    prefix.setAttribute('aria-hidden', 'true');
    container.insertBefore(prefix, this.input);
    this.input.classList.add('phone-input-with-prefix');
  }

  handleInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    if (this.options.autoFormat && value.length > 0) {
      value = this.formatNumber(value);
    }
    this.input.value = value;
    this.validate();
  }

  handleKeydown(e) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  }

  handlePaste(e) {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    let cleaned = pastedText.replace(/\D/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) cleaned = cleaned.slice(2);
    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);
    this.input.value = this.options.autoFormat ? this.formatNumber(cleaned) : cleaned;
    this.validate();
  }

  formatNumber(value) {
    return value.length <= 5 ? value : `${value.slice(0, 5)} ${value.slice(5)}`;
  }

  getRawValue() {
    return this.input.value.replace(/\D/g, '');
  }

  getFormattedValue() {
    return formatPhoneForFirebase(this.getRawValue());
  }

  validate() {
    const value = this.getRawValue();
    const isValid = isValidIndianPhone(value);
    this.input.classList.toggle('phone-input-error', !isValid && value.length > 0);
    this.input.classList.toggle('phone-input-valid', isValid);
    this.input.setAttribute('aria-invalid', !isValid && value.length > 0);
    return isValid;
  }

  clear() {
    this.input.value = '';
    this.input.classList.remove('phone-input-error', 'phone-input-valid');
  }

  focus() {
    this.input.focus();
  }

  setError(message) {
    this.input.classList.add('phone-input-error');
    const container = this.input.parentElement;
    let errorEl = container?.querySelector('.phone-input-error-message');
    if (!errorEl && container) {
      errorEl = document.createElement('div');
      errorEl.className = 'phone-input-error-message';
      errorEl.setAttribute('role', 'alert');
      container.appendChild(errorEl);
    }
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  clearError() {
    this.input.classList.remove('phone-input-error');
    const errorEl = this.input.parentElement?.querySelector('.phone-input-error-message');
    if (errorEl) errorEl.style.display = 'none';
  }
}
