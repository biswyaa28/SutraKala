# SutraKala Architecture Overview

## Project Structure

```
sutrakala/
├── src/                      # Source code
│   ├── core/                 # Core application logic
│   │   ├── auth/             # Authentication module
│   │   ├── firestore/        # Firestore services
│   │   └── storage/          # Storage utilities
│   ├── features/             # Feature modules
│   │   ├── authentication/   # Auth feature
│   │   ├── product-catalog/  # Product management
│   │   ├── checkout/         # Checkout flow
│   │   └── wishlist/         # Wishlist feature
│   ├── components/           # UI components
│   │   ├── atoms/            # Basic components (buttons, inputs)
│   │   ├── molecules/        # Composite components
│   │   └── organisms/        # Complex components
│   ├── pages/                # Page-specific code
│   │   ├── home/             # Home page
│   │   ├── login/            # Login page
│   │   ├── shop/             # Shop page
│   │   └── cart/             # Cart page
│   ├── styles/               # Stylesheets
│   │   ├── base/             # Base styles (variables, mixins)
│   │   ├── components/       # Component styles
│   │   ├── utilities/        # Utility classes
│   │   └── themes/           # Theme configurations
│   ├── config/               # Configuration files
│   └── utils/                # Utility functions
├── public/                   # Static assets (production)
│   ├── assets/               # Images, fonts, icons
│   ├── css/                  # Compiled CSS
│   └── js/                   # Bundled JavaScript
├── tests/                    # Test suites
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── e2e/                  # End-to-end tests
├── docs/                     # Documentation
│   ├── architecture/         # Architecture docs
│   ├── api/                  # API documentation
│   └── deployment/           # Deployment guides
├── scripts/                  # Build and deployment scripts
│   ├── build/                # Build scripts
│   ├── deploy/               # Deployment scripts
│   └── lint/                 # Linting scripts
├── config/                   # Configuration files
│   ├── firebase/             # Firebase configuration
│   └── ci-cd/                # CI/CD configuration
└── .github/                  # GitHub workflows
```

## Architecture Principles

### 1. Modular Design
- **Separation of Concerns**: Each module has a single responsibility
- **Loose Coupling**: Modules communicate through well-defined interfaces
- **High Cohesion**: Related functionality is grouped together

### 2. Component-Based Architecture
- **Atomic Design**: Components organized as atoms, molecules, organisms
- **Reusability**: Components are designed for reuse across the application
- **Composability**: Complex components built from simpler ones

### 3. Service-Oriented
- **Firebase Services**: Abstracted through service layer
- **Dependency Injection**: Services injected where needed
- **Testability**: Services can be mocked for testing

### 4. State Management
- **Centralized Auth State**: Managed by AuthManager
- **Local State**: Component-level state for UI
- **Persistent State**: Firestore for user data

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Flexbox, Grid
- **JavaScript (ES6+)**: Modules, async/await

### Backend Services
- **Firebase Authentication**: User management
- **Cloud Firestore**: NoSQL database
- **Firebase Storage**: File storage
- **Firebase Hosting**: Static hosting

### Development Tools
- **Vitest**: Unit testing
- **Playwright**: E2E testing
- **Rollup**: Module bundling
- **PostCSS**: CSS processing
- **ESLint**: Code linting
- **Stylelint**: CSS linting

## Data Flow

```
User Action → Event Handler → Service Layer → Firebase → State Update → UI Re-render
```

### Authentication Flow
```
1. User clicks login
2. AuthUI opens LoginModal
3. User enters credentials
4. AuthManager processes authentication
5. Firebase returns user data
6. UserService creates/updates user document
7. Auth state updates
8. UI reflects logged-in state
```

### Cart Flow
```
1. User adds product to cart
2. Cart component updates local state
3. CartSync saves to localStorage (guest) or Firestore (authenticated)
4. Cart count updates in navbar
5. Cart page reflects changes
```

## Security Considerations

1. **Authentication**: Firebase Auth with secure token handling
2. **Authorization**: Firestore security rules
3. **Input Validation**: Client and server-side validation
4. **XSS Prevention**: Content Security Policy headers
5. **CSRF Protection**: Firebase token verification

## Performance Optimization

1. **Code Splitting**: Feature-based lazy loading
2. **Image Optimization**: WebP format, lazy loading
3. **Caching**: Service worker, browser cache headers
4. **Minification**: CSS and JavaScript minification
5. **CDN**: Firebase global CDN

## Scalability

The architecture supports:
- **100+ developers**: Clear module boundaries, consistent patterns
- **High traffic**: Firebase auto-scaling, CDN distribution
- **Feature growth**: Modular feature additions without refactoring
- **Internationalization**: Ready for i18n implementation
