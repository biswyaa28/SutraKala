# Contributing to SutraKala

Thank you for your interest in contributing to SutraKala! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Code Review](#code-review)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Code editor (VS Code recommended)

### Setup

```bash
# Fork the repository
git clone https://github.com/your-username/sutrakala.git
cd sutrakala

# Install dependencies
npm install

# Create a branch
git checkout -b feature/your-feature-name
```

## Development Workflow

### 1. Create a Branch

```bash
# Feature branches
git checkout -b feature/add-new-payment-method

# Bug fixes
git checkout -b fix/cart-count-not-updating

# Documentation
git checkout -b docs/update-readme
```

### 2. Make Changes

- Follow the coding standards
- Write tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run linting
npm run lint
npm run lint:css

# Test build
npm run build
```

### 4. Commit Your Changes

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

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

#### Code Style

```javascript
// Use semicolons
const value = 42;

// Use single quotes
const name = 'SutraKala';

// Use 2 spaces for indentation
function example() {
  return true;
}

// Use arrow functions for callbacks
const result = items.map(item => item.name);

// Use template literals for strings
const greeting = `Hello, ${name}!`;

// Destructure objects
const { name, email } = user;

// Use spread operator
const newArray = [...oldArray, newItem];
```

#### Error Handling

```javascript
// Always handle errors
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    // Log and rethrow or handle gracefully
    throw new Error('Failed to fetch data');
  }
}

// Use custom error classes
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
```

#### Organization

```css
/* 1. Properties in order */
.element {
  /* Positioning */
  position: absolute;
  top: 0;

  /* Display & Box Model */
  display: flex;
  width: 100%;
  padding: 1rem;

  /* Typography */
  font-size: 1rem;
  color: #333;

  /* Visual */
  background: #fff;
  border: 1px solid #ddd;

  /* Misc */
  z-index: 10;
}
```

#### Custom Properties

```css
/* Use CSS custom properties */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
}
```

### HTML

#### Semantic Markup

```html
<!-- Use semantic elements -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Page Title</h1>
    <p>Content...</p>
  </article>
</main>

<footer>
  <p>&copy; 2026 SutraKala</p>
</footer>
```

#### Accessibility

```html
<!-- Always include alt text -->
<img src="logo.jpg" alt="SutraKala Logo">

<!-- Use ARIA labels -->
<button aria-label="Close modal">×</button>

<!-- Use proper heading hierarchy -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
```

## Testing Guidelines

### Unit Tests

```javascript
// tests/unit/example.test.js
import { describe, it, expect, beforeEach } from 'vitest';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should do something', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = someFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### E2E Tests

```javascript
// tests/e2e/example.spec.js
import { test, expect } from '@playwright/test';

test.describe('Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/page');

    const element = page.locator('.element');
    await expect(element).toBeVisible();
  });
});
```

### Test Coverage

- Aim for >80% code coverage
- Test happy path and edge cases
- Test error scenarios
- Mock external dependencies

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build/config changes

### Examples

```
feat(auth): add phone OTP authentication

Implemented phone number authentication with OTP verification.
- Added PhoneInput component
- Added OTP verification flow
- Updated login modal with phone option

Closes #123

---

fix(cart): resolve cart count not updating

Fixed issue where cart count didn't update after adding items.
The issue was caused by missing event listener on add-to-cart button.

Fixes #456

---

docs(readme): update installation instructions

Added Node.js version requirements and troubleshooting section.
```

### Commit Best Practices

- Keep commits atomic (one logical change)
- Write clear, descriptive messages
- Reference issues/PRs when applicable
- Don't commit generated files

## Pull Request Process

### Creating a PR

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Push** to your fork
6. **Create** a Pull Request

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally

## Screenshots (if applicable)
Add screenshots of UI changes

## Related Issues
Closes #123
```

## Code Review

### Reviewer Guidelines

- Be constructive and respectful
- Focus on code, not the person
- Suggest improvements, don't just criticize
- Approve when standards are met
- Request changes for critical issues

### Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log in production code
- [ ] Error handling is implemented
- [ ] Security considerations addressed
- [ ] Performance considerations addressed
- [ ] Accessibility considerations addressed

### Responding to Feedback

- Address all comments
- Ask for clarification if needed
- Make requested changes promptly
- Re-request review after changes

## Questions?

If you have questions:
1. Check existing documentation
2. Search existing issues
3. Create a new issue with your question
4. Join our community discussions

Thank you for contributing to SutraKala! 🎉
