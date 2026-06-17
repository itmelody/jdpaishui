#!/bin/bash
# GitHub Pages deployment status checker

echo "========================================"
echo "GitHub Pages Deployment Status"
echo "========================================"
echo ""

# Check if gh-pages branch exists
if git ls-remote --heads origin gh-pages > /dev/null 2>&1; then
    echo "✅ gh-pages branch exists on remote"
    
    # Get latest commit on gh-pages
    GH_PAGES_COMMIT=$(git ls-remote origin gh-pages | cut -f1)
    echo "   Latest commit: ${GH_PAGES_COMMIT:0:8}"
else
    echo "❌ gh-pages branch does not exist on remote"
fi

echo ""

# Check local branches
echo "Local branches:"
git branch -v | grep -E "(main|gh-pages)" | sed 's/^/   /'

echo ""

# Check if GitHub Actions workflow is configured
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "✅ GitHub Actions workflow configured"
    echo "   File: .github/workflows/deploy.yml"
else
    echo "❌ GitHub Actions workflow not found"
fi

echo ""

# Check Vite base path
if grep -q "base: '/jdpaishui/'" vite.config.ts; then
    echo "✅ Vite base path configured correctly"
else
    echo "⚠️  Vite base path may need configuration"
fi

echo ""
echo "========================================"
echo "Deployment URL:"
echo "[https://itmelody.github.io/jdpaishui/](https://itmelody.github.io/jdpaishui/)"
echo "========================================"
echo ""
echo "To check deployment progress, visit:"
echo "[https://github.com/itmelody/jdpaishui/actions](https://github.com/itmelody/jdpaishui/actions)"
echo ""
echo "To enable GitHub Pages manually:"
echo "1. Go to: https://github.com/itmelody/jdpaishui/settings/pages"
echo "2. Select Source: GitHub Actions"
echo "3. Click Save"
echo "========================================"
