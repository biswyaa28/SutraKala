# Migration Guide

## Enterprise Restructure Migration

This document describes the migration from the flat project structure to the new enterprise-grade architecture.

## What Changed

### Directory Structure

**Before:**
```
/
├── js/
├── css/
├── assets/
├── pages/
└── *.html
```

**After:**
```
/
├── src/              # Source code
│   ├── core/         # Core modules
│   ├── features/     # Feature modules
│   ├── components/   # UI components
│   ├── pages/        # Page-specific code
│   └── styles/       # Stylesheets
├── public/           # Production assets
├── tests/            # Test suites
├── docs/             # Documentation
├── scripts/          # Build scripts
└── config/           # Configuration
```

### File Locations

| Old Path | New Path |
|----------|----------|
| `js/core/*.js` | `src/core/auth/*.js`, `src/core/firestore/*.js` |
| `js/features/*.js` | `src/features/*/*.js` |
| `js/utils/*.js` | `src/core/*.js` |
| `js/firebase-*.js` | `src/config/firebase-*.js` |
| `css/*.css` | `src/styles/base/*.css` |
| `*.html` | `public/*.html` |
| `assets/*` | `public/assets/*` |

### Import Path Changes

Update your imports from:
```javascript
import { authManager } from './core/auth-manager.js';
```

To:
```javascript
import { authManager } from '../core/auth/auth-manager.js';
```

### New Dependencies

Install required development dependencies:

```bash
npm install
```

This will install:
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Rollup** - Module bundling
- **PostCSS** - CSS processing
- **ESLint** - Code linting
- **Stylelint** - CSS linting

### New Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run all tests |
| `npm run lint` | Lint code |
| `npm run deploy:staging` | Deploy to staging |
| `npm run deploy:production` | Deploy to production |

## Migration Steps

### 1. Backup Your Work

```bash
git checkout -b backup-before-migration
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Update Environment Variables

Copy the new template:
```bash
cp .env.local.template .env.local
```

Update with your Firebase credentials.

### 4. Update Import Paths

All import paths have been updated in the migrated files. If you have custom files, update them according to the new structure.

### 5. Update HTML References

Update your HTML files to reference the new paths:

**Before:**
```html
<link rel="stylesheet" href="css/main.css">
<script type="module" src="js/main.js"></script>
```

**After:**
```html
<link rel="stylesheet" href="/css/main.min.css">
<script type="module" src="/js/main.min.js"></script>
```

### 6. Run Tests

```bash
npm test
```

### 7. Build and Verify

```bash
npm run build
npm run dev
```

## Breaking Changes

### 1. Console Statements Removed

All `console.log()` statements have been removed from production code. Use proper error handling instead.

### 2. CSS Class Naming

CSS now follows BEM methodology. Update your class names:

**Before:**
```css
.login-btn { }
.login-btn-large { }
```

**After:**
```css
.btn--login { }
.btn--login.btn--large { }
```

### 3. Environment Variables

Environment variable names have been standardized. Update your `.env.local`:

```env
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Tests Fail

```bash
# Run tests with verbose output
npm test -- --reporter=verbose
```

### Import Errors

Check that your import paths match the new structure:
- Core modules: `src/core/`
- Features: `src/features/`
- Components: `src/components/`

## Rollback

If you need to rollback:

```bash
git checkout main
git revert --no-commit migration-branch
```

## Support

For migration issues:
1. Check the [Documentation](docs/)
2. Review [Development Guidelines](docs/development/guidelines.md)
3. Create an issue on GitHub

## Benefits of New Structure

1. **Scalability**: Supports 100+ developers
2. **Maintainability**: Clear separation of concerns
3. **Testability**: Proper test infrastructure
4. **Performance**: Optimized build process
5. **Security**: Enhanced security configurations
6. **Documentation**: Comprehensive documentation

---

Migration completed: March 2026
Version: 2.0.0
