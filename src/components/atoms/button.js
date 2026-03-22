/**
 * Button Atom Component
 * Reusable button component following atomic design
 *
 * Usage:
 * <button class="btn btn--primary">Click Me</button>
 * <button class="btn btn--secondary btn--icon">
 *   <i class="icon"></i>
 * </button>
 */

import './button.css';

export class Button {
  /**
   * Button variants
   */
  static VARIANTS = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    DANGER: 'danger',
    GHOST: 'ghost',
    LINK: 'link'
  };

  /**
   * Button sizes
   */
  static SIZES = {
    SMALL: 'sm',
    MEDIUM: 'md',
    LARGE: 'lg',
    XLARGE: 'xl'
  };

  /**
   * Create button element
   * @param {Object} options - Button configuration
   * @param {string} options.text - Button text
   * @param {string} options.variant - Button variant
   * @param {string} options.size - Button size
   * @param {boolean} options.disabled - Disabled state
   * @param {string} options.icon - Icon class name
   * @param {Function} options.onClick - Click handler
   * @returns {HTMLButtonElement} Button element
   */
  static create({
    text,
    variant = Button.VARIANTS.PRIMARY,
    size = Button.SIZES.MEDIUM,
    disabled = false,
    icon = null,
    onClick = null
  } = {}) {
    const button = document.createElement('button');

    // Base classes
    button.className = `btn btn--${variant} btn--${size}`;

    if (disabled) {
      button.disabled = true;
      button.classList.add('btn--disabled');
    }

    if (icon) {
      button.setAttribute('aria-label', text || 'Icon button');
      const iconEl = document.createElement('i');
      iconEl.className = icon;
      button.appendChild(iconEl);
    } else {
      button.textContent = text;
    }

    if (onClick) {
      button.addEventListener('click', onClick);
    }

    return button;
  }

  /**
   * Create button group
   * @param {Array} buttons - Array of button configurations
   * @param {boolean} vertical - Vertical layout
   * @returns {HTMLDivElement} Button group container
   */
  static createGroup(buttons, vertical = false) {
    const group = document.createElement('div');
    group.className = `btn-group${vertical ? ' btn-group--vertical' : ''}`;

    buttons.forEach(config => {
      group.appendChild(Button.create(config));
    });

    return group;
  }
}

export default Button;
