# SutraKala - Enterprise E-Commerce Platform

> A modern, enterprise-grade e-commerce platform for handcrafted products built with Firebase.

[![CI/CD](https://github.com/your-org/sutrakala/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/sutrakala/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

SutraKala is a full-featured e-commerce platform designed for selling handcrafted products. Built
with modern web technologies and Firebase backend services, it provides a seamless shopping
experience with features like user authentication, product catalog, shopping cart, wishlist, and
order management.

### Key Features

- 🔐 **Authentication**: Google Sign-In and Phone OTP authentication
- 🛍️ **Product Catalog**: Browse and search products with filters
- 🛒 **Shopping Cart**: Real-time cart synchronization
- ❤️ **Wishlist**: Save favorite products
- 📦 **Order Management**: Track orders and delivery status
- 📱 **Responsive Design**: Mobile-first, works on all devices
- 🎨 **Modern UI**: Beautiful, accessible interface
- ⚡ **Performance**: Optimized loading and caching

## 🛠 Tech Stack

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid, BEM methodology
- **JavaScript (ES6+)** - Modules, async/await, modern features

### Backend Services

- **Firebase Authentication** - User management
- **Cloud Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **Firebase Hosting** - Global CDN hosting

### Development Tools

- **Vitest** - Unit testing framework
- **Playwright** - E2E testing
- **Rollup** - Module bundler
- **PostCSS** - CSS processing
- **ESLint** - JavaScript linting
- **Stylelint** - CSS linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipeline

## 📁 Project Structure

```
sutrakala/
├── src/                          # Source code
│   ├── core/                     # Core application logic
│   │   ├── auth/                 # Authentication module
│   │   │   ├── auth-helpers.js   # Auth utility functions
│   │   │   ├── auth-manager.js   # Auth state management
│   │   │   └── auth-init.js      # Auth initialization
│   │   ├── firestore/            # Firestore services
│   │   │   ├── user-service.js   # User data operations
│   │   │   └── cart.js           # Cart operations
│   │   └── storage/              # Storage utilities
│   │       └── storage.js        # LocalStorage wrapper
│   ├── features/                 # Feature modules
│   │   ├── authentication/       # Auth feature
│   │   ├── product-catalog/      # Product browsing
│   │   ├── checkout/             # Checkout flow
│   │   └── wishlist/             # Wishlist feature
│   ├── components/               # UI components (Atomic Design)
│   │   ├── atoms/                # Basic components
│   │   │   ├── button.js         # Button component
│   │   │   └── input.js          # Input component
│   │   ├── molecules/            # Composite components
│   │   │   └── card.js           # Card component
│   │   └── organisms/            # Complex components
│   ├── pages/                    # Page-specific code
│   │   ├── home/                 # Home page
│   │   ├── login/                # Login page
│   │   ├── shop/                 # Shop page
│   │   └── cart/                 # Cart page
│   ├── styles/                   # Stylesheets
│   │   ├── base/                 # Variables, mixins, reset
│   │   ├── components/           # Component styles
│   │   ├── utilities/            # Utility classes
│   │   └── themes/               # Theme configurations
│   └── config/                   # Configuration files
│       ├── firebase-init.js      # Firebase initialization
│       └── firebase-config.js    # Firebase config
├── public/                       # Static assets (production)
│   ├── assets/                   # Images, fonts, icons
│   ├── css/                      # Compiled CSS
│   └── js/                       # Bundled JavaScript
├── tests/                        # Test suites
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
├── docs/                         # Documentation
│   ├── architecture/             # Architecture docs
│   ├── api/                      # API documentation
│   └── deployment/               # Deployment guides
├── scripts/                      # Build and deployment scripts
│   ├── build/                    # Build scripts
│   └── deploy/                   # Deployment scripts
├── config/                       # Build configuration
│   ├── rollup.config.js          # Rollup config
│   └── postcss.config.js         # PostCSS config
├── .github/workflows/            # CI/CD workflows
├── package.json                  # Dependencies & scripts
├── README.md                     # This file
└── CONTRIBUTING.md               # Contribution guidelines
```

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/sutrakala.git
cd sutrakala
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

```bash
# Copy the environment template
cp .env.local.template .env.local

# Edit .env.local with your Firebase credentials
```

4. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Google, Phone)
   - Create Firestore database
   - Deploy Firestore rules: `firebase deploy --only firestore:rules`

5. **Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📖 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm run serve            # Start local Firebase emulator

# Testing
npm test                 # Run all tests
npm run test:unit        # Run unit tests
npm run test:integration # Run integration tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Generate coverage report
npm run test:watch       # Run tests in watch mode

# Linting
npm run lint             # Lint JavaScript files
npm run lint:css         # Lint CSS files
npm run lint:fix         # Auto-fix linting issues

# Deployment
npm run deploy:staging   # Deploy to staging environment
npm run deploy:production # Deploy to production
```

### Development Workflow

1. **Create a feature branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Follow coding standards
   - Write tests
   - Update documentation

3. **Test your changes**

```bash
npm test
npm run lint
```

4. **Commit and push**

```bash
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

5. **Create a Pull Request**

### Coding Standards

- **JavaScript**: ESLint + Prettier
- **CSS**: Stylelint + BEM methodology
- **HTML**: Semantic markup + Accessibility
- **Commits**: Conventional Commits specification

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit        # Unit tests with Vitest
npm run test:e2e         # E2E tests with Playwright

# Run with coverage
npm run test:coverage
```

### Writing Tests

**Unit Test Example:**

```javascript
// tests/unit/utils/storage.test.js
import { describe, it, expect } from 'vitest';
import { storage } from '../../../src/utils/storage.js';

describe('Storage', () => {
  it('should store and retrieve values', () => {
    storage.set('key', 'value');
    expect(storage.get('key')).toBe('value');
  });
});
```

**E2E Test Example:**

```javascript
// tests/e2e/home.spec.js
import { test, expect } from '@playwright/test';

test('should display home page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SutraKala/);
});
```

## 🚀 Deployment

### Deploy to Staging

```bash
npm run deploy:staging
```

### Deploy to Production

```bash
npm run deploy:production
```

### CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- **Push to main**: Triggers build and tests
- **Tests pass**: Deploys to staging
- **Manual approval**: Deploys to production

See [`.github/workflows/`](.github/workflows/) for workflow configurations.

## 📚 Documentation

- [Architecture Overview](docs/architecture/overview.md) - System architecture
- [Development Guidelines](docs/development/guidelines.md) - Coding standards
- [Deployment Guide](docs/deployment/guide.md) - Deployment procedures
- [API Documentation](docs/api/) - API reference
- [Migration Guide](MIGRATION_GUIDE.md) - Migration from old structure

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

### Code of Conduct

Please be respectful and constructive in your interactions. We're committed to providing a welcoming
community for all.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/sutrakala/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/sutrakala/discussions)

## 🙏 Acknowledgments

- Built with [Firebase](https://firebase.google.com/)
- UI inspired by [Material Design](https://material.io/)
- Testing with [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/)

---

Built with ❤️ by the SutraKala Team
