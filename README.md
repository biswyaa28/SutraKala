# 🧵 CraftedLoop - Handmade Crochet E-Commerce Website

> A beautiful, responsive e-commerce landing page for an Indian handmade crochet business. Features product showcase, shopping cart, contact form, and gallery sections with a soft pastel aesthetic.

![CraftedLoop Banner](./assets/banner.png)

---

## 📋 Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Customization](#-customization)
- [Backend Integration](#-backend-integration)
- [Accessibility](#-accessibility)
- [Performance](#-performance)
- [Browser Support](#-browser-support)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### Design & UI
- 🎨 **Pastel Color Scheme** - Soft mint, pink, lavender, and peach colors
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🎭 **Smooth Animations** - Fade-in effects, hover transitions, and scroll animations
- 🖼️ **Image Optimization** - Lazy loading for faster page loads
- 🌙 **Clean Aesthetic** - Modern, feminine design with rounded corners and subtle shadows

### E-Commerce
- 🛒 **Shopping Cart** - Add/remove items with localStorage persistence
- 🏷️ **Product Cards** - Beautiful cards with hover zoom effects
- 💰 **Indian Pricing** - Prices displayed in ₹ (Rupees)
- 📦 **Product Grid** - Responsive grid layout (1-4 columns based on screen)

### Navigation
- 📍 **Sticky Header** - Navigation stays visible while scrolling
- 🍔 **Mobile Menu** - Hamburger menu with smooth slide animation
- 🔗 **Smooth Scrolling** - Seamless navigation between sections
- 📊 **Active State** - Current section highlighted in navigation

### Forms & Communication
- ✅ **Form Validation** - Real-time validation with error messages
- 📧 **Contact Form** - Name, email, phone, and message fields
- 💬 **WhatsApp Integration** - Direct chat link for customer support
- 🔔 **Toast Notifications** - Success/error messages for user actions

### Accessibility
- ♿ **WCAG Compliant** - ARIA labels, semantic HTML, keyboard navigation
- 🦮 **Screen Reader Ready** - Skip links, proper heading hierarchy
- 🎯 **Focus Management** - Visible focus states for all interactive elements
- 📏 **Proper Contrast** - Text meets WCAG AA contrast requirements

### Indian Context
- 🇮🇳 **Local Business** - Jammu, Maharashtra address
- 📞 **Indian Phone Format** - +91 prefix validation
- 💳 **UPI Ready** - Payment options for Indian market
- 🚚 **India Post** - Shipping integration ready

---

## 🌐 Live Demo

> **Coming Soon** - Deploy to Vercel/Netlify

[View Demo](#) | [Report Bug](#) | [Request Feature](#)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | - | Semantic markup |
| CSS3 | - | Styling with variables, Grid, Flexbox |
| JavaScript (ES6+) | - | Interactive functionality |
| Google Fonts | - | Inter (body), Playfair Display (headings) |
| Font Awesome | 6.4.0 | Icons |

### Backend (Optional)
| Technology | Version | Purpose |
|------------|---------|---------|
| Supabase | 2.x | Database, Auth, Storage |
| Razorpay | 2.x | Payment gateway |
| Deno | 1.x | Edge functions |

### Development Tools
| Tool | Purpose |
|------|---------|
| VS Code | Code editor |
| Git | Version control |
| Vite | Build tool (optional) |
| ESLint | Code linting |

---

## 📁 Project Structure

```
crochet-site/
├── index.html              # Main HTML file
├── landing-page.html       # Alternative landing page
├── styles.css              # Main stylesheet (if using separate file)
├── styles-complete.css     # Complete CSS with all components
├── script.js               # Main JavaScript file
├── script-complete.js      # Complete JS with all features
├── assets/                 # Images, fonts, etc.
│   ├── images/
│   └── icons/
├── backend/                # Supabase backend
│   ├── schema.sql          # Database schema
│   ├── supabase-client.js  # Supabase client library
│   ├── package.json        # Node dependencies
│   ├── .env.example        # Environment template
│   ├── README.md           # Backend setup guide
│   └── functions/          # Edge functions
│       └── payment-webhook/
│           └── index.ts    # Razorpay webhook handler
└── README.md               # This file
```

### File Descriptions

| File | Size | Description |
|------|------|-------------|
| `index.html` | ~20KB | Complete HTML with all sections |
| `landing-page.html` | ~25KB | Alternative single-file version with inline CSS/JS |
| `styles-complete.css` | ~35KB | Comprehensive CSS with design system |
| `script-complete.js` | ~30KB | Full JavaScript with cart, nav, forms |
| `backend/schema.sql` | ~25KB | Complete database schema with RLS |
| `backend/supabase-client.js` | ~20KB | API client with all functions |

---

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)
- Git (optional, for version control)
- Node.js 16+ (optional, for backend)

### Installation

#### Option 1: Quick Start (Frontend Only)

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/yourusername/crochet-site.git
   cd crochet-site
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server:
   npx serve .
   ```

3. **Done!** 🎉 The site is ready to use.

#### Option 2: With Build Tools (Recommended for Production)

1. **Initialize npm project**
   ```bash
   npm init -y
   ```

2. **Install Vite (optional)**
   ```bash
   npm install -D vite
   ```

3. **Add scripts to package.json**
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

#### Option 3: With Backend (Full E-Commerce)

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Set up Supabase**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Run `schema.sql` in SQL Editor
   - Copy API keys to `.env`

5. **Start development**
   ```bash
   cd ..
   npm run dev
   ```

---

## 📖 Usage

### Basic Usage

The website works out of the box with no configuration needed:

```html
<!-- Open in browser -->
file:///path/to/index.html
```

### Shopping Cart

The cart uses localStorage to persist items:

```javascript
// Cart is automatically managed by script.js
// Items persist across page refreshes
// Cart count updates in real-time
```

### Contact Form

Form validation is built-in:

- **Name**: Required, min 2 characters
- **Email**: Required, valid format
- **Phone**: Optional, Indian format (+91)
- **Message**: Required, min 10 characters

### Mobile Navigation

Hamburger menu activates automatically on screens < 768px:

```javascript
// Toggle menu
document.getElementById('mobileMenuToggle').click();
```

---

## 🎨 Customization

### Color Scheme

Edit CSS variables in `styles-complete.css`:

```css
:root {
  --color-mint: #A8D8B9;      /* Change mint green */
  --color-pink: #FFB6C1;      /* Change blush pink */
  --color-lavender: #E6E6FA;  /* Change lavender */
  --color-peach: #FFE4B5;     /* Change peach */
}
```

### Typography

Change fonts in HTML `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

Update CSS variables:

```css
:root {
  --font-primary: 'Your Body Font', sans-serif;
  --font-heading: 'Your Heading Font', serif;
}
```

### Products

Edit product data in `index.html`:

```html
<article class="product-card" data-product-id="1">
  <div class="product-image">
    <img src="your-image.jpg" alt="Product name">
  </div>
  <div class="product-info">
    <h3 class="product-name">Product Name</h3>
    <p class="product-description">Description here</p>
    <p class="product-price">₹999</p>
    <button class="btn-add-to-cart" data-product="Product Name" data-price="999">
      Add to Cart
    </button>
  </div>
</article>
```

### Contact Information

Update in `index.html`:

```html
<div class="contact-item">
  <i class="fas fa-map-marker-alt"></i>
  <div>
    <strong>Address</strong>
    <p>Your Address Here</p>
  </div>
</div>
```

### Business Details

Update in JavaScript (`script-complete.js`):

```javascript
const businessInfo = {
  name: 'CraftedLoop',
  phone: '+91 9876543210',
  email: 'hello@craftedloop.in',
  address: 'Jammu, Maharashtra',
  whatsapp: '919876543210'
};
```

---

## 🔧 Backend Integration

### Supabase Setup

See [`backend/README.md`](./backend/README.md) for detailed instructions.

Quick setup:

```sql
-- Run in Supabase SQL Editor
-- Creates all tables, triggers, and policies

-- 1. Copy schema.sql contents
-- 2. Paste in SQL Editor
-- 3. Click Run
```

### Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### API Usage

```javascript
import supabaseClient from './backend/supabase-client.js';

// Get products
const products = await supabaseClient.products.getProducts();

// Create order
const order = await supabaseClient.orders.createOrder(orderData);

// User auth
await supabaseClient.auth.signIn(email, password);
```

### Payment Integration

Razorpay webhook handler included in `backend/functions/payment-webhook/index.ts`.

Deploy with Supabase CLI:

```bash
supabase functions deploy payment-webhook
```

---

## ♿ Accessibility

### Features Implemented

- ✅ Skip to main content link
- ✅ ARIA labels on all interactive elements
- ✅ Semantic HTML5 tags (header, nav, main, section, footer, article)
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Alt text on all images
- ✅ Focus visible states
- ✅ Keyboard navigation support
- ✅ Screen reader announcements (aria-live)
- ✅ Color contrast meets WCAG AA
- ✅ Reduced motion support

### Testing

Test with screen readers:
- NVDA (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

Test keyboard navigation:
```
Tab - Move forward
Shift+Tab - Move backward
Enter - Activate links/buttons
Escape - Close modals/menus
```

---

## ⚡ Performance

### Optimization Techniques

- **Lazy Loading**: Images load only when visible
- **CSS Variables**: Efficient theming and updates
- **Debounced Scroll**: Prevents excessive calculations
- **LocalStorage**: Cart persists without server requests
- **Minimal Dependencies**: Vanilla JS, no frameworks
- **Optimized Animations**: GPU-accelerated transforms

### Lighthouse Scores (Target)

| Metric | Score |
|--------|-------|
| Performance | 95+ |
| Accessibility | 100 |
| Best Practices | 95+ |
| SEO | 100 |

### Optimization Tips

1. Compress images with TinyPNG
2. Use WebP format for better compression
3. Enable gzip/brotli on server
4. Use CDN for fonts and icons
5. Minify CSS/JS for production

---

## 🌍 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Opera | 76+ | ✅ Full |
| Samsung Internet | 14+ | ✅ Full |

**Note**: IE11 is not supported. Use modern browsers for best experience.

---

## 🚀 Future Enhancements

### Phase 1: Backend Integration
- [ ] Supabase database setup
- [ ] User authentication (email/password, Google, Facebook)
- [ ] Product management (CRUD operations)
- [ ] Order management system
- [ ] Admin dashboard

### Phase 2: Payments
- [ ] Razorpay integration
- [ ] UPI payment support
- [ ] Card payments
- [ ] COD (Cash on Delivery)
- [ ] Payment webhooks
- [ ] Invoice generation

### Phase 3: Features
- [ ] Product search functionality
- [ ] Category filtering
- [ ] Price range filter
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Coupon/discount codes
- [ ] Email notifications

### Phase 4: Shipping
- [ ] India Post API integration
- [ ] Shipping cost calculator
- [ ] Order tracking
- [ ] Delivery time estimates
- [ ] Pincode serviceability check

### Phase 5: Advanced
- [ ] Multi-language support (Hindi, English)
- [ ] Multi-currency support
- [ ] Progressive Web App (PWA)
- [ ] Push notifications
- [ ] Social media sharing
- [ ] Referral program
- [ ] Loyalty points system

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
   ```bash
   git fork https://github.com/yourusername/crochet-site.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Code Style

- Use ES6+ JavaScript
- Follow CSS BEM naming convention
- Use semantic HTML5
- Add comments for complex logic
- Test in multiple browsers

### Reporting Bugs

1. Check existing issues
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Browser/OS information

---

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 CraftedLoop

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

**CraftedLoop**

- 📍 Address: 123 Artisan Lane, Bandra West, Jammu, Maharashtra 400050, India
- 📧 Email: hello@craftedloop.in
- 📱 Phone: +91 98765 43210
- 💬 WhatsApp: [Chat with us](https://wa.me/919876543210)

**Social Media**

- [Instagram](#) - @craftedloop
- [Facebook](#) - /craftedloop
- [Pinterest](#) - @craftedloop

---

## 🙏 Acknowledgments

- [Google Fonts](https://fonts.google.com/) - Beautiful typography
- [Font Awesome](https://fontawesome.com/) - Icon library
- [Unsplash](https://unsplash.com/) - Placeholder images
- [Supabase](https://supabase.com/) - Backend as a service
- [Razorpay](https://razorpay.com/) - Payment gateway

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/crochet-site?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/yourusername/crochet-site?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/yourusername/crochet-site?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/yourusername/crochet-site?style=for-the-badge)

---

<div align="center">

**Made with ❤️ in Jammu, India**

[Back to top](#-craftedloop---handmade-crochet-e-commerce-website)

</div>
