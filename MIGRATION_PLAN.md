# Enterprise Migration Plan

## Overview

This document provides a comprehensive, step-by-step plan for migrating from the current flat project structure to the new enterprise-grade architecture.

## Migration Phases

### Phase 1: Preparation (1-2 days)

#### 1.1 Backup Current State

```bash
# Create a backup branch
git checkout main
git checkout -b backup-pre-migration

# Create a full backup
cd /path/to/project
tar -czf sutrakala-backup-$(date +%Y%m%d).tar.gz .
```

#### 1.2 Document Current State

```bash
# List all files
find . -type f -not -path '*/node_modules/*' -not -path '*/.git/*' > file-list.txt

# Document current dependencies
npm list --depth=0 > current-dependencies.txt
```

#### 1.3 Notify Team

- Inform all team members about the migration
- Schedule migration during low-activity period
- Prepare rollback plan

### Phase 2: Setup New Structure (1 day)

#### 2.1 Create Directory Structure

```bash
# Run the setup script
./scripts/migration/setup-new-structure.sh

# Or manually create directories
mkdir -p src/{core/{auth,firestore,storage},features/{authentication,product-catalog,checkout,wishlist},components/{atoms,molecules,organisms},pages/{home,login,shop,cart},styles/{base,components,utilities,themes},config}
mkdir -p public/{assets/{images,fonts,icons,products},css,js}
mkdir -p tests/{unit/{auth,firestore,utils},integration/{auth,cart},e2e}
mkdir -p docs/{architecture,api,deployment}
mkdir -p scripts/{build,deploy,lint}
mkdir -p config/{firebase,ci-cd}
```

#### 2.2 Install New Dependencies

```bash
# Install development dependencies
npm install --save-dev vitest @playwright/test rollup postcss eslint stylelint prettier

# Verify installation
npm list --depth=0
```

### Phase 3: File Migration (2-3 days)

#### 3.1 Move JavaScript Files

```bash
# Core modules
mv js/core/auth-*.js src/core/auth/
mv js/core/user-service.js src/core/firestore/
mv js/core/cart.js src/core/firestore/
mv js/core/forms.js src/core/
mv js/core/navigation.js src/core/

# Features
mv js/features/auth/*.js src/features/authentication/
mv js/features/product-*.js src/features/product-catalog/
mv js/features/wishlist.js src/features/wishlist/

# Utils
mv js/utils/*.js src/core/

# Config
mv js/firebase-*.js src/config/

# Main files
mv js/main.js src/
mv js/auth-init.js src/core/auth/
mv js/cart-page.js src/pages/cart/
```

#### 3.2 Move CSS Files

```bash
# Base styles
mv css/_variables.css src/styles/base/
mv css/_mixins.css src/styles/base/
mv css/_typography.css src/styles/base/
mv css/_layout.css src/styles/base/

# Component styles
mv css/_components/*.css src/styles/components/
mv css/_sections/*.css src/styles/components/

# Main stylesheet
mv css/main.css src/styles/
```

#### 3.3 Move HTML Files

```bash
# Copy to public for production
cp index.html public/
cp login.html public/
cp shop.html public/
cp cart.html public/
cp pages/*.html public/pages/

# Copy to src for development templates
cp index.html src/pages/home/index.html
cp login.html src/pages/login/index.html
cp shop.html src/pages/shop/index.html
cp cart.html src/pages/cart/index.html
```

#### 3.4 Move Assets

```bash
cp -r assets/images/* public/assets/images/
cp -r assets/fonts/* public/assets/fonts/
cp -r assets/icons/* public/assets/icons/
cp -r assets/products/* public/assets/products/
```

#### 3.5 Move Documentation

```bash
cp AUTH_SETUP_GUIDE.md docs/
cp FIREBASE_SETUP.md docs/
cp GOOGLE_SIGNIN_*.md docs/
cp README.md docs/README_OLD.md
```

### Phase 4: Update References (1-2 days)

#### 4.1 Update HTML File References

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

#### 4.2 Update JavaScript Imports

**Before:**
```javascript
import { authManager } from './core/auth-manager.js';
import { storage } from './utils/storage.js';
```

**After:**
```javascript
import { authManager } from '../core/auth/auth-manager.js';
import { storage } from '../core/storage.js';
```

#### 4.3 Update CSS Imports

**Before:**
```css
@import 'variables.css';
```

**After:**
```css
@import './base/variables.css';
```

### Phase 5: Configuration (1 day)

#### 5.1 Update package.json

```json
{
  "scripts": {
    "dev": "npm-run-all --parallel watch:css watch:js serve",
    "build": "npm-run-all build:css build:js build:optimize",
    "test": "vitest run",
    "lint": "eslint src/ tests/"
  }
}
```

#### 5.2 Configure Firebase

Update `config/firebase/firebase.json`:

```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|webp|woff2)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

#### 5.3 Setup Environment Variables

```bash
# Copy and configure
cp .env.local.template .env.local

# Edit with your Firebase credentials
nano .env.local
```

### Phase 6: Testing (2-3 days)

#### 6.1 Unit Tests

```bash
# Run unit tests
npm run test:unit

# Check coverage
npm run test:coverage
```

#### 6.2 Integration Tests

```bash
# Run integration tests
npm run test:integration
```

#### 6.3 E2E Tests

```bash
# Start dev server
npm run dev

# In another terminal, run E2E tests
npm run test:e2e
```

#### 6.4 Manual Testing Checklist

- [ ] Home page loads correctly
- [ ] Login flow works (Google, Phone)
- [ ] Product browsing works
- [ ] Add to cart functionality
- [ ] Cart page displays correctly
- [ ] Checkout flow
- [ ] Wishlist functionality
- [ ] Responsive design on mobile
- [ ] All links work
- [ ] Images load correctly

### Phase 7: Build & Deploy (1 day)

#### 7.1 Test Build

```bash
# Clean previous builds
npm run clean

# Build for production
npm run build

# Verify build output
ls -la public/css public/js
```

#### 7.2 Deploy to Staging

```bash
# Deploy to staging
npm run deploy:staging

# Verify staging deployment
open https://sutrakala-staging.web.app
```

#### 7.3 Deploy to Production

```bash
# Deploy to production (requires confirmation)
npm run deploy:production

# Verify production deployment
open https://sutrakala.web.app
```

### Phase 8: Verification (1 day)

#### 8.1 Performance Checks

```bash
# Run Lighthouse
npm run lighthouse

# Check bundle sizes
npm run build -- --analyze
```

#### 8.2 Security Checks

```bash
# Run security audit
npm audit

# Run Snyk security scan
npm run security:check
```

#### 8.3 Final Verification Checklist

- [ ] All tests passing
- [ ] Build successful
- [ ] Staging deployment verified
- [ ] Production deployment verified
- [ ] Performance metrics acceptable
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team trained on new structure

## Rollback Plan

If issues occur during migration:

### Quick Rollback

```bash
# Return to backup branch
git checkout main
git checkout -b migration-rollback
git merge backup-pre-migration

# Restore from backup
tar -xzf sutrakala-backup-YYYYMMDD.tar.gz
```

### Partial Rollback

If only specific phases have issues:

```bash
# Revert specific file moves
git checkout HEAD -- js/ css/
git reset --hard backup-pre-migration
```

## Post-Migration Tasks

### 1. Update CI/CD

```bash
# Update GitHub Actions workflows
# See .github/workflows/ci.yml and cd.yml
```

### 2. Update Documentation

- Update README.md
- Update CONTRIBUTING.md
- Update internal wikis

### 3. Team Training

- Conduct training session
- Share new development guidelines
- Review new workflows

### 4. Monitor & Optimize

- Monitor error logs
- Track performance metrics
- Gather team feedback
- Iterate on structure

## Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 1. Preparation | 1-2 days | None |
| 2. Setup | 1 day | Phase 1 |
| 3. File Migration | 2-3 days | Phase 2 |
| 4. Update References | 1-2 days | Phase 3 |
| 5. Configuration | 1 day | Phase 4 |
| 6. Testing | 2-3 days | Phase 5 |
| 7. Build & Deploy | 1 day | Phase 6 |
| 8. Verification | 1 day | Phase 7 |
| **Total** | **10-14 days** | |

## Success Criteria

- ✅ All files migrated to new structure
- ✅ All tests passing (>80% coverage)
- ✅ Build successful
- ✅ Staging deployment verified
- ✅ Production deployment successful
- ✅ No broken links or imports
- ✅ Performance metrics met
- ✅ Team trained on new structure
- ✅ Documentation complete

## Support

For migration issues:
1. Check this migration guide
2. Review error logs
3. Consult team leads
4. Create issue on GitHub

---

**Migration Start Date**: ___________
**Migration End Date**: ___________
**Migration Lead**: ___________
**Team Members**: ___________
