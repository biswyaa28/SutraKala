/**
 * Input Atom Component
 * Reusable input component following atomic design
 *
 * Usage:
 * <input class="input" type="text" placeholder="Enter text" />
 * <div class="input-group input-group--error">
 *   <input class="input" type="email" />
 *   <span class="input__error">Invalid email</span>
 * </div>
 */

import './input.css';

export class Input {
  /**
   * Input types
   */
  static TYPES = {
    TEXT: 'text',
    EMAIL: 'email',
    PASSWORD: 'password',
    NUMBER: 'number',
    TEL: 'tel',
    URL: 'url',
    SEARCH: 'search',
    TEXTAREA: 'textarea'
  };

  /**
   * Input sizes
   */
  static SIZES = {
    SMALL: 'sm',
    MEDIUM: 'md',
    LARGE: 'lg'
  };

  /**
   * Create input element
   * @param {Object} options - Input configuration
   * @param {string} options.type - Input type
   * @param {string} options.name - Input name
   * @param {string} options.placeholder - Placeholder text
   * @param {string} options.value - Initial value
   * @param {boolean} options.required - Required field
   * @param {boolean} options.disabled - Disabled state
   * @param {string} options.error - Error message
   * @param {string} options.label - Label text
   * @param {Function} options.onChange - Change handler
   * @param {Function} options.onBlur - Blur handler
   * @returns {HTMLInputElement|HTMLTextAreaElement} Input element
   */
  static create({
    type = Input.TYPES.TEXT,
    name,
    placeholder,
    value = '',
    required = false,
    disabled = false,
    error = null,
    label = null,
    onChange = null,
    onBlur = null
  } = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'input-group';

    // Create label if provided
    if (label) {
      const labelEl = document.createElement('label');
      labelEl.className = 'input__label';
      labelEl.textContent = label;
      labelEl.setAttribute('for', name);
      wrapper.appendChild(labelEl);
    }

    // Create input element
    const input = type === Input.TYPES.TEXTAREA
      ? document.createElement('textarea')
      : document.createElement('input');

    input.className = 'input';
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.value = value;
    input.required = required;
    input.disabled = disabled;

    if (name) {
      input.id = name;
    }

    if (onChange) {
      input.addEventListener('input', onChange);
    }

    if (onBlur) {
      input.addEventListener('blur', onBlur);
    }

    wrapper.appendChild(input);

    // Create error message if provided
    if (error) {
      wrapper.classList.add('input-group--error');
      const errorEl = document.createElement('span');
      errorEl.className = 'input__error';
      errorEl.textContent = error;
      wrapper.appendChild(errorEl);
    }

    return { wrapper, input };
  }

  /**
   * Set input error state
   * @param {HTMLElement} wrapper - Input wrapper element
   * @param {string} message - Error message
   */
  static setError(wrapper, message) {
    wrapper.classList.add('input-group--error');

    let errorEl = wrapper.querySelector('.input__error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'input__error';
      wrapper.appendChild(errorEl);
    }

    errorEl.textContent = message;
  }

  /**
   * Clear input error state
   * @param {HTMLElement} wrapper - Input wrapper element
   */
  static clearError(wrapper) {
    wrapper.classList.remove('input-group--error');
    const errorEl = wrapper.querySelector('.input__error');
    if (errorEl) {
      errorEl.remove();
    }
  }

  /**
   * Validate input
   * @param {HTMLInputElement} input - Input element
   * @returns {boolean} Is valid
   */
  static validate(input) {
    if (!input.validity.valid) {
      if (input.validity.valueMissing) {
        return false;
      }
      if (input.validity.typeMismatch) {
        return false;
      }
      if (input.validity.patternMismatch) {
        return false;
      }
    }
    return true;
  }
}

export default Input;
