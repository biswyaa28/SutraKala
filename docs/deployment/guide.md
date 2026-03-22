# Deployment Guide

## Overview

This guide covers deployment procedures for SutraKala across different environments.

## Environments

| Environment | URL | Purpose |
|------------|-----|---------|
| Development | localhost:5000 | Local development |
| Staging | sutrakala-staging.web.app | Pre-production testing |
| Production | sutrakala.web.app | Live production |

## Prerequisites

1. Firebase CLI installed: `npm install -g firebase-tools`
2. Firebase project configured
3. Appropriate permissions for deployment

## Build Process

### Development Build

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev
```

### Production Build

```bash
# Clean previous builds
npm run clean

# Build for production
npm run build

# This will:
# 1. Bundle JavaScript with Rollup
# 2. Process CSS with PostCSS
# 3. Optimize images
# 4. Minify assets
# 5. Generate source maps
```

### Build Output

```
public/
├── index.html
├── css/
│   ├── main.min.css
│   └── main.min.css.map
├── js/
│   ├── main.min.js
│   └── main.min.js.map
└── assets/
    ├── images/
    ├── fonts/
    └── icons/
```

## Deployment Procedures

### Deploy to Staging

```bash
# Run tests
npm test

# Build
npm run build

# Deploy to staging
npm run deploy:staging
```

Or manually:

```bash
firebase deploy --only hosting,firestore,functions --project sutrakala-staging
```

### Deploy to Production

```bash
# Ensure all tests pass
npm test

# Build with production settings
NODE_ENV=production npm run build

# Deploy to production
npm run deploy:production
```

Or manually:

```bash
firebase deploy --only hosting,firestore,functions --project sutrakala-aa44b
```

## CI/CD Pipeline

### GitHub Actions Workflow

The deployment pipeline is automated via GitHub Actions:

1. **Push to main**: Triggers build and tests
2. **Tests pass**: Deploys to staging
3. **Manual approval**: Deploys to production

### Workflow Files

- `.github/workflows/ci.yml`: Continuous integration
- `.github/workflows/cd.yml`: Continuous deployment

## Firebase Configuration

### firestore.rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules
```

### firestore.indexes.json

```bash
# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

### storage.rules

```bash
# Deploy Storage rules
firebase deploy --only storage
```

## Rollback Procedures

### Quick Rollback

```bash
# List previous deployments
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback
```

### Manual Rollback

1. Go to Firebase Console
2. Navigate to Hosting
3. Click "Release history"
4. Select previous version
5. Click "Rollback"

## Post-Deployment Checklist

- [ ] Verify site loads correctly
- [ ] Test authentication flow
- [ ] Check cart functionality
- [ ] Verify Firestore connections
- [ ] Test on multiple devices
- [ ] Check analytics tracking
- [ ] Monitor error logs

## Monitoring

### Firebase Console

- **Hosting**: Deployment history, traffic stats
- **Firestore**: Database usage, query stats
- **Authentication**: User sign-ins, errors
- **Performance**: Page load metrics

### Error Tracking

```javascript
// Errors are logged to Firebase Error Reporting
// View in Firebase Console > Crashlytics
```

## Environment Variables

### Production Secrets

Set via Firebase CLI:

```bash
firebase functions:secrets:set FIREBASE_API_KEY
firebase functions:secrets:set FIREBASE_AUTH_DOMAIN
```

### Local Development

Copy `.env.local.template` to `.env.local` and fill in values.

## Performance Optimization

### Caching Strategy

```json
{
  "hosting": {
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

### CDN Distribution

Firebase Hosting automatically distributes content via global CDN.

## Security

### Security Headers

Configured in `firebase.json`:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Content-Security-Policy",
            "value": "default-src 'self'; script-src 'self' https://www.gstatic.com https://www.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
          }
        ]
      }
    ]
  }
}
```

## Troubleshooting

### Common Issues

**Build fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Deployment fails**
```bash
# Check Firebase authentication
firebase login
firebase projects:list

# Verify project configuration
cat .firebaserc
```

**Site not updating**
```bash
# Force clear CDN cache
# Wait up to 5 minutes for propagation
```

## Support

For deployment issues:
1. Check Firebase Console logs
2. Review GitHub Actions logs
3. Contact DevOps team
