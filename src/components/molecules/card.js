/**
 * Card Molecule Component
 * Composite card component with header, body, and footer
 *
 * Usage:
 * <div class="card">
 *   <div class="card__header">...</div>
 *   <div class="card__body">...</div>
 *   <div class="card__footer">...</div>
 * </div>
 */

import './card.css';

export class Card {
  /**
   * Card variants
   */
  static VARIANTS = {
    DEFAULT: 'default',
    ELEVATED: 'elevated',
    OUTLINED: 'outlined',
    INTERACTIVE: 'interactive'
  };

  /**
   * Create card element
   * @param {Object} options - Card configuration
   * @param {string} options.variant - Card variant
   * @param {string} options.title - Card title
   * @param {string} options.subtitle - Card subtitle
   * @param {HTMLElement} options.header - Custom header content
   * @param {HTMLElement} options.body - Body content
   * @param {HTMLElement} options.footer - Footer content
   * @param {boolean} options.clickable - Clickable card
   * @param {Function} options.onClick - Click handler
   * @returns {HTMLDivElement} Card element
   */
  static create({
    variant = Card.VARIANTS.DEFAULT,
    title = null,
    subtitle = null,
    header = null,
    body = null,
    footer = null,
    clickable = false,
    onClick = null
  } = {}) {
    const card = document.createElement('div');
    card.className = `card card--${variant}`;

    if (clickable) {
      card.classList.add('card--clickable');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
    }

    // Create header
    if (header) {
      card.appendChild(header);
    } else if (title) {
      const headerEl = document.createElement('div');
      headerEl.className = 'card__header';

      const titleEl = document.createElement('h3');
      titleEl.className = 'card__title';
      titleEl.textContent = title;
      headerEl.appendChild(titleEl);

      if (subtitle) {
        const subtitleEl = document.createElement('p');
        subtitleEl.className = 'card__subtitle';
        subtitleEl.textContent = subtitle;
        headerEl.appendChild(subtitleEl);
      }

      card.appendChild(headerEl);
    }

    // Create body
    if (body) {
      const bodyEl = document.createElement('div');
      bodyEl.className = 'card__body';

      if (typeof body === 'string') {
        bodyEl.innerHTML = body;
      } else {
        bodyEl.appendChild(body);
      }

      card.appendChild(bodyEl);
    }

    // Create footer
    if (footer) {
      const footerEl = document.createElement('div');
      footerEl.className = 'card__footer';

      if (typeof footer === 'string') {
        footerEl.innerHTML = footer;
      } else {
        footerEl.appendChild(footer);
      }

      card.appendChild(footerEl);
    }

    if (clickable && onClick) {
      card.addEventListener('click', onClick);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      });
    }

    return card;
  }

  /**
   * Create product card
   * @param {Object} product - Product data
   * @returns {HTMLDivElement} Product card element
   */
  static createProductCard(product) {
    const { name, price, image, category, rating } = product;

    const card = Card.create({
      variant: Card.VARIANTS.INTERACTIVE,
      body: `
        <div class="product-card">
          <div class="product-card__image">
            <img src="${image}" alt="${name}" loading="lazy" />
          </div>
          <div class="product-card__content">
            <span class="product-card__category">${category}</span>
            <h3 class="product-card__title">${name}</h3>
            <div class="product-card__price">
              <span class="product-card__price-current">₹${price}</span>
            </div>
            ${rating ? `
            <div class="product-card__rating">
              ${'★'.repeat(Math.floor(rating))}${'☆'.repeat(5 - Math.floor(rating))}
              <span class="product-card__rating-count">(${rating})</span>
            </div>
            ` : ''}
          </div>
        </div>
      `
    });

    return card;
  }
}

export default Card;
