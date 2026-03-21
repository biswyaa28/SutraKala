// js/features/auth/otp-input.js
/**
 * OTP Input Component
 * 6-digit verification code input with auto-focus and paste support
 */

export class OTPInput {
  constructor(container, options = {}) {
    if (!container) throw new Error('OTP container element is required');

    this.container = container;
    this.options = {
      length: 6,
      type: 'numeric',
      autoSubmit: false,
      onComplete: null,
      ...options
    };
    this.inputs = [];
    this.init();
  }

  init() {
    this.container.innerHTML = '';
    this.container.className = 'otp-input-container';

    for (let i = 0; i < this.options.length; i++) {
      const input = this.createInput(i);
      this.inputs.push(input);
      this.container.appendChild(input);
    }

    setTimeout(() => this.inputs[0]?.focus(), 100);
    console.log('[OTPInput] Initialized');
  }

  createInput(index) {
    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = this.options.type === 'numeric' ? 'numeric' : 'text';
    input.className = 'otp-input-box';
    input.maxLength = 1;
    input.autocomplete = 'off';
    input.setAttribute('data-index', index);
    input.setAttribute('aria-label', `Digit ${index + 1}`);

    input.addEventListener('input', (e) => this.handleInput(e, index));
    input.addEventListener('keydown', (e) => this.handleKeydown(e, index));
    input.addEventListener('paste', (e) => this.handlePaste(e, index));
    input.addEventListener('focus', (e) => e.target.select());

    return input;
  }

  handleInput(e, index) {
    let value = e.target.value;
    value = this.options.type === 'numeric' ? value.replace(/\D/g, '') : value.replace(/[^a-zA-Z0-9]/g, '');
    e.target.value = value;

    if (value && index < this.inputs.length - 1) {
      this.inputs[index + 1].focus();
    }

    if (this.isFilled()) this.handleComplete();
  }

  handleKeydown(e, index) {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      e.preventDefault();
      this.inputs[index - 1].focus();
      this.inputs[index - 1].value = '';
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      this.inputs[index - 1].focus();
    }
    if (e.key === 'ArrowRight' && index < this.inputs.length - 1) {
      e.preventDefault();
      this.inputs[index + 1].focus();
    }
    if (e.key === 'Enter' && this.isFilled()) {
      e.preventDefault();
      this.handleComplete();
    }
  }

  handlePaste(e, index) {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    let cleaned = this.options.type === 'numeric' ? pastedText.replace(/\D/g, '') : pastedText.replace(/[^a-zA-Z0-9]/g, '');

    for (let i = 0; i < cleaned.length && (index + i) < this.inputs.length; i++) {
      this.inputs[index + i].value = cleaned[i];
    }

    const lastIndex = Math.min(index + cleaned.length - 1, this.inputs.length - 1);
    this.inputs[lastIndex].focus();

    if (this.isFilled()) this.handleComplete();
  }

  isFilled() {
    return this.inputs.every(input => input.value.length === 1);
  }

  handleComplete() {
    const code = this.getValue();
    this.container.classList.add('otp-input-complete');
    if (this.options.onComplete) this.options.onComplete(code);
    if (this.options.autoSubmit) this.inputs.forEach(input => input.blur());
  }

  getValue() {
    return this.inputs.map(input => input.value).join('');
  }

  clear() {
    this.inputs.forEach(input => {
      input.value = '';
      input.classList.remove('otp-input-error', 'otp-input-success');
    });
    this.container.classList.remove('otp-input-complete', 'otp-input-error');
    setTimeout(() => this.inputs[0]?.focus(), 10);
  }

  setError(message = null) {
    this.container.classList.add('otp-input-error');
    this.inputs.forEach(input => input.classList.add('otp-input-error'));
    this.container.style.animation = 'shake 0.5s';
    setTimeout(() => { this.container.style.animation = ''; }, 500);

    if (message) {
      let errorEl = this.container.parentElement?.querySelector('.otp-error-message');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'otp-error-message';
        errorEl.setAttribute('role', 'alert');
        this.container.parentElement?.appendChild(errorEl);
      }
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  clearError() {
    this.container.classList.remove('otp-input-error');
    this.inputs.forEach(input => input.classList.remove('otp-input-error'));
    const errorEl = this.container.parentElement?.querySelector('.otp-error-message');
    if (errorEl) errorEl.style.display = 'none';
  }
}
