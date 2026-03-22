#!/bin/bash

# Migration Verification Script
# Usage: ./scripts/migration/verify-migration.sh

set -e

echo "🔍 Verifying Enterprise Migration..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

# Function to check and report
check() {
    local name="$1"
    local condition="$2"

    if eval "$condition"; then
        echo -e "${GREEN}✓${NC} $name"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $name"
        ((FAIL++))
    fi
}

warn() {
    local name="$1"
    echo -e "${YELLOW}⚠${NC} $name"
    ((WARN++))
}

echo -e "${BLUE}=== Directory Structure ===${NC}"

# Check src directories
check "src/core/auth exists" "[ -d 'src/core/auth' ]"
check "src/core/firestore exists" "[ -d 'src/core/firestore' ]"
check "src/features/authentication exists" "[ -d 'src/features/authentication' ]"
check "src/components/atoms exists" "[ -d 'src/components/atoms' ]"
check "src/components/molecules exists" "[ -d 'src/components/molecules' ]"
check "src/pages/home exists" "[ -d 'src/pages/home' ]"
check "src/styles/base exists" "[ -d 'src/styles/base' ]"

echo ""
echo -e "${BLUE}=== Configuration Files ===${NC}"

# Check config files
check "package.json exists" "[ -f 'package.json' ]"
check ".eslintrc.json exists" "[ -f '.eslintrc.json' ]"
check ".stylelintrc.json exists" "[ -f '.stylelintrc.json' ]"
check ".prettierrc exists" "[ -f '.prettierrc' ]"
check "rollup.config.js exists" "[ -f 'config/rollup.config.js' ]"
check "postcss.config.js exists" "[ -f 'config/postcss.config.js' ]"

echo ""
echo -e "${BLUE}=== Source Files ===${NC}"

# Check source files
check "src/main.js exists" "[ -f 'src/main.js' ]"
check "src/core/auth/auth-helpers.js exists" "[ -f 'src/core/auth/auth-helpers.js' ]"
check "src/core/auth/auth-manager.js exists" "[ -f 'src/core/auth/auth-manager.js' ]"
check "src/core/firestore/user-service.js exists" "[ -f 'src/core/firestore/user-service.js' ]"
check "src/config/firebase-init.js exists" "[ -f 'src/config/firebase-init.js' ]"
check "src/styles/main.css exists" "[ -f 'src/styles/main.css' ]"

echo ""
echo -e "${BLUE}=== Test Files ===${NC}"

# Check test files
check "tests/setup.js exists" "[ -f 'tests/setup.js' ]"
check "tests/vitest.config.js exists" "[ -f 'tests/vitest.config.js' ]"
check "tests/unit directory has tests" "[ -n '\$(ls -A tests/unit 2>/dev/null)' ]"
check "tests/e2e directory has tests" "[ -n '\$(ls -A tests/e2e 2>/dev/null)' ]"

echo ""
echo -e "${BLUE}=== Documentation ===${NC}"

# Check documentation
check "README.md exists" "[ -f 'README.md' ]"
check "CONTRIBUTING.md exists" "[ -f 'CONTRIBUTING.md' ]"
check "MIGRATION_PLAN.md exists" "[ -f 'MIGRATION_PLAN.md' ]"
check "docs/architecture exists" "[ -d 'docs/architecture' ]"
check "docs/deployment exists" "[ -d 'docs/deployment' ]"

echo ""
echo -e "${BLUE}=== CI/CD ===${NC}"

# Check CI/CD
check ".github/workflows exists" "[ -d '.github/workflows' ]"
check "ci.yml exists" "[ -f '.github/workflows/ci.yml' ]"
check "cd.yml exists" "[ -f '.github/workflows/cd.yml' ]"

echo ""
echo -e "${BLUE}=== Public Assets ===${NC}"

# Check public assets
check "public/assets/images exists" "[ -d 'public/assets/images' ]"
check "public/css directory exists" "[ -d 'public/css' ]"
check "public/js directory exists" "[ -d 'public/js' ]"

echo ""
echo "================================"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo -e "${YELLOW}Warnings: $WARN${NC}"
echo "================================"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ Migration verification successful!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Install dependencies: npm install"
    echo "2. Configure environment: cp .env.local.template .env.local"
    echo "3. Edit .env.local with your Firebase credentials"
    echo "4. Run tests: npm test"
    echo "5. Start development: npm run dev"
    exit 0
else
    echo -e "${RED}❌ Migration verification failed!${NC}"
    echo ""
    echo "Please review the failed checks and ensure all files are in place."
    echo "You may need to run the setup script: ./scripts/migration/setup-new-structure.sh"
    exit 1
fi
