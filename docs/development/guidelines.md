# Development Guidelines

## Table of Contents

1. [Getting Started](#getting-started)
2. [Coding Standards](#coding-standards)
3. [Git Workflow](#git-workflow)
4. [Testing](#testing)
5. [Code Review](#code-review)

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/sutrakala.git

# Navigate to project directory
cd sutrakala

# Install dependencies
npm install

# Copy environment template
cp .env.local.template .env.local

# Start development server
npm run dev
```

### Project Setup

1. Configure Firebase credentials in `.env.local`
2. Set up Firebase project in Firebase Console
3. Enable Authentication providers (Google, Phone)
4. Deploy Firestore rules

## Coding Standards

### JavaScript

#### Naming Conventions

```javascript
// Classes: PascalCase
class AuthManager { }

// Functions/Variables: camelCase
function getUserData() { }
const currentUser = null;

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// Private members: _prefix
this._internalState = null;

// Files: kebab-case
// auth-helpers.js, user-service.js
```

#### Module Structure

```javascript
// 1. Imports (external libraries first, then internal)
import { getAuth } from 'firebase/auth';
import { authManager } from '../core/auth-manager.js';

// 2. Constants
const MAX_RETRIES = 3;

// 3. Class/Function definitions
export class UserService {
  // Implementation
}

// 4. Exports
export default UserService;
```

#### Error Handling

```javascript
// Always use try-catch for async operations
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    // Log error (in development)
    // Show user-friendly message
    throw new Error('Failed to fetch data');
  }
}

// Custom error classes for domain-specific errors
class AuthError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'AuthError';
  }
}
```

### CSS

#### BEM Methodology

```css
/* Block */
.card { }

/* Element */
.card__title { }
.card__content { }

/* Modifier */
.card--featured { }
.card__title--large { }

/* Example */
<button class="btn btn--primary btn--large">
  Click Me
</button>
```

#### CSS Organization

```css
/* 1. Base styles (variables, resets) */
@import 'base/variables.css';
@import 'base/reset.css';

/* 2. Component styles */
@import 'components/button.css';
@import 'components/card.css';

/* 3. Utility classes */
@import 'utilities/flex.css';
@import 'utilities/spacing.css';

/* 4. Theme overrides */
@import 'themes/dark.css';
```

#### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-primary: #764ba2;
  --color-secondary: #667eea;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;

  /* Typography */
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
}
```

## Git Workflow

### Branch Naming

```
feature/add-google-login
fix/cart-count-bug
docs/update-readme
refactor/auth-module
test/add-unit-tests
chore/update-dependencies
```

### Commit Messages

```
feat: add Google Sign-In support

- Implement OAuth 2.0 flow
- Add Google provider configuration
- Update login modal with Google button

Closes #123
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and commit
3. Push to remote
4. Create Pull Request
5. Request review from team members
6. Address feedback
7. Merge after approval

## Testing

### Writing Tests

```javascript
// tests/unit/auth/auth-manager.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthManager } from '../../../src/core/auth/auth-manager.js';

describe('AuthManager', () => {
  let authManager;

  beforeEach(() => {
    authManager = new AuthManager();
  });

  it('should initialize with null user', () => {
    expect(authManager.getUser()).toBeNull();
  });

  it('should update user on login', () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    authManager.login(mockUser);
    expect(authManager.getUser()).toEqual(mockUser);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Code Review

### Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included for new features
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Documentation is updated
- [ ] No sensitive data in code
- [ ] Performance considerations addressed

### Review Guidelines

1. **Be constructive**: Suggest improvements, don't just criticize
2. **Be timely**: Review within 24 hours
3. **Be thorough**: Test the changes locally
4. **Be clear**: Explain why something should change

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run serve        # Start local server

# Testing
npm test            # Run all tests
npm run test:unit   # Run unit tests
npm run test:e2e    # Run E2E tests

# Linting
npm run lint        # Lint JavaScript
npm run lint:css    # Lint CSS
npm run lint:fix    # Auto-fix linting issues

# Deployment
npm run deploy:staging    # Deploy to staging
npm run deploy:production # Deploy to production
```
