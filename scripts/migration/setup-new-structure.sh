#!/bin/bash

# Enterprise Structure Setup Script
# Usage: ./scripts/migration/setup-new-structure.sh

set -e  # Exit on error

echo "🚀 Setting up enterprise project structure..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Get project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "Project root: $PROJECT_ROOT"
echo ""

# Create directory structure
print_info "Creating directory structure..."

# Source directories
print_info "Creating src/ directories..."
mkdir -p src/core/auth
mkdir -p src/core/firestore
mkdir -p src/core/storage
mkdir -p src/features/authentication
mkdir -p src/features/product-catalog
mkdir -p src/features/checkout
mkdir -p src/features/wishlist
mkdir -p src/components/atoms
mkdir -p src/components/molecules
mkdir -p src/components/organisms
mkdir -p src/pages/home
mkdir -p src/pages/login
mkdir -p src/pages/shop
mkdir -p src/pages/cart
mkdir -p src/pages/checkout
mkdir -p src/styles/base
mkdir -p src/styles/components
mkdir -p src/styles/utilities
mkdir -p src/styles/themes
mkdir -p src/config
print_success "src/ directories created"

# Public directories
print_info "Creating public/ directories..."
mkdir -p public/assets/images
mkdir -p public/assets/fonts
mkdir -p public/assets/icons
mkdir -p public/assets/products
mkdir -p public/css
mkdir -p public/js
mkdir -p public/pages
print_success "public/ directories created"

# Test directories
print_info "Creating tests/ directories..."
mkdir -p tests/unit/auth
mkdir -p tests/unit/firestore
mkdir -p tests/unit/utils
mkdir -p tests/integration/auth
mkdir -p tests/integration/cart
mkdir -p tests/e2e
print_success "tests/ directories created"

# Documentation directories
print_info "Creating docs/ directories..."
mkdir -p docs/architecture
mkdir -p docs/api
mkdir -p docs/deployment
mkdir -p docs/development
print_success "docs/ directories created"

# Script directories
print_info "Creating scripts/ directories..."
mkdir -p scripts/build
mkdir -p scripts/deploy
mkdir -p scripts/lint
mkdir -p scripts/migration
print_success "scripts/ directories created"

# Config directories
print_info "Creating config/ directories..."
mkdir -p config/firebase
mkdir -p config/ci-cd
print_success "config/ directories created"

# Move files
print_info "Migrating files..."

# JavaScript files
if [ -d "js" ]; then
    print_info "Moving JavaScript files..."

    # Core files
    [ -f "js/core/auth-helpers.js" ] && cp js/core/auth-helpers.js src/core/auth/
    [ -f "js/core/auth-manager.js" ] && cp js/core/auth-manager.js src/core/auth/
    [ -f "js/core/user-service.js" ] && cp js/core/user-service.js src/core/firestore/
    [ -f "js/core/cart.js" ] && cp js/core/cart.js src/core/firestore/
    [ -f "js/core/forms.js" ] && cp js/core/forms.js src/core/
    [ -f "js/core/navigation.js" ] && cp js/core/navigation.js src/core/

    # Feature files
    [ -d "js/features/auth" ] && cp js/features/auth/*.js src/features/authentication/ 2>/dev/null || true
    [ -f "js/features/product-hover.js" ] && cp js/features/product-hover.js src/features/product-catalog/
    [ -f "js/features/scroll-animations.js" ] && cp js/features/scroll-animations.js src/features/product-catalog/
    [ -f "js/features/wishlist.js" ] && cp js/features/wishlist.js src/features/wishlist/

    # Utils
    [ -d "js/utils" ] && cp js/utils/*.js src/core/ 2>/dev/null || true

    # Config
    [ -f "js/firebase-init.js" ] && cp js/firebase-init.js src/config/
    [ -f "js/firebase-config.js" ] && cp js/firebase-config.js src/config/

    # Main files
    [ -f "js/main.js" ] && cp js/main.js src/
    [ -f "js/auth-init.js" ] && cp js/auth-init.js src/core/auth/
    [ -f "js/cart-page.js" ] && cp js/cart-page.js src/pages/cart/
    [ -f "js/performance-traces.js" ] && cp js/performance-traces.js src/core/

    print_success "JavaScript files moved"
fi

# CSS files
if [ -d "css" ]; then
    print_info "Moving CSS files..."

    [ -f "css/_variables.css" ] && cp css/_variables.css src/styles/base/
    [ -f "css/_mixins.css" ] && cp css/_mixins.css src/styles/base/
    [ -f "css/_typography.css" ] && cp css/_typography.css src/styles/base/
    [ -f "css/_layout.css" ] && cp css/_layout.css src/styles/base/
    [ -f "css/main.css" ] && cp css/main.css src/styles/
    [ -d "css/_components" ] && cp css/_components/*.css src/styles/components/ 2>/dev/null || true
    [ -d "css/_sections" ] && cp css/_sections/*.css src/styles/components/ 2>/dev/null || true

    print_success "CSS files moved"
fi

# HTML files
print_info "Copying HTML files..."
[ -f "index.html" ] && cp index.html public/ && cp index.html src/pages/home/index.html
[ -f "login.html" ] && cp login.html public/ && cp login.html src/pages/login/index.html
[ -f "shop.html" ] && cp shop.html public/ && cp shop.html src/pages/shop/index.html
[ -f "cart.html" ] && cp cart.html public/ && cp cart.html src/pages/cart/index.html
[ -d "pages" ] && cp pages/*.html public/pages/ 2>/dev/null || true
print_success "HTML files copied"

# Assets
print_info "Copying assets..."
[ -d "assets/images" ] && cp -r assets/images/* public/assets/images/ 2>/dev/null || true
[ -d "assets/fonts" ] && cp -r assets/fonts/* public/assets/fonts/ 2>/dev/null || true
[ -d "assets/icons" ] && cp -r assets/icons/* public/assets/icons/ 2>/dev/null || true
[ -d "assets/products" ] && cp -r assets/products/* public/assets/products/ 2>/dev/null || true
print_success "Assets copied"

# Documentation
print_info "Copying documentation..."
[ -f "AUTH_SETUP_GUIDE.md" ] && cp AUTH_SETUP_GUIDE.md docs/
[ -f "FIREBASE_SETUP.md" ] && cp FIREBASE_SETUP.md docs/
[ -f "GOOGLE_SIGNIN_CHECKLIST.md" ] && cp GOOGLE_SIGNIN_CHECKLIST.md docs/
[ -f "GOOGLE_SIGNIN_FIX.md" ] && cp GOOGLE_SIGNIN_FIX.md docs/
print_success "Documentation copied"

# Create .gitkeep files in empty directories
print_info "Creating .gitkeep files..."
find . -type d -empty -not -path '*/.git/*' -not -path '*/node_modules/*' | while read dir; do
    touch "$dir/.gitkeep"
done
print_success ".gitkeep files created"

echo ""
print_success "Enterprise structure setup complete!"
echo ""
echo "Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Configure environment: cp .env.local.template .env.local"
echo "3. Update .env.local with your Firebase credentials"
echo "4. Run tests: npm test"
echo "5. Start development: npm run dev"
echo ""
