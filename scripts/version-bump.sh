#!/bin/bash
# TizenTube Version Management Script
# Uses date-based versioning: YYYY.MM.DD

set -e

# Generate version based on current date (or use provided version)
VERSION=${1:-$(date +"%Y.%m.%d")}

# Use Node.js script to update versions reliably
node scripts/update-version.js "$VERSION"

# Optional: Create git tag
if [ "$2" = "--tag" ] || [ "$1" = "--tag" ]; then
    echo ""
    echo "🏷️  Creating git tag: v$VERSION"
    git add package.json standalone/src/config.xml
    git commit -m "chore: bump version to $VERSION"
    git tag "v$VERSION"
    echo "✅ Tagged version v$VERSION"
    echo "   Run 'git push origin v$VERSION' to trigger release"
fi