# TizenTube Versioning Strategy

TizenTube uses **date-based versioning** (CalVer) for simple, intuitive version management.

## Version Format

**Format:** `YYYY.MM.DD`

**Examples:**
- `2025.01.15` - Release on January 15, 2025
- `2025.03.22` - Release on March 22, 2025
- `2025.12.01` - Release on December 1, 2025

## Why Date-Based Versioning?

1. **User-Friendly** - Anyone can immediately tell which version is newer
2. **No Ambiguity** - No need to decide if changes are major/minor/patch
3. **Development Activity** - Shows how actively maintained the project is
4. **Perfect for Apps** - End users care about freshness, not API compatibility

## Version Management

### Automatic Version Updates

Use the version bump script:

```bash
# Update version to current date
./scripts/version-bump.sh

# Update version and create git tag
./scripts/version-bump.sh --tag
```

This automatically updates:
- `package.json`
- `standalone/src/config.xml`

### Manual Release Process

1. **Develop and test** your changes
2. **Update version** using the script:
   ```bash
   ./scripts/version-bump.sh --tag
   ```
3. **Push the tag** to trigger release:
   ```bash
   git push origin v2025.01.15
   ```
4. **GitHub Actions** automatically builds and releases the WGT

### Release Channels

- **Latest Release**: `latest` tag - Always points to the most recent stable version
- **Stable Releases**: Tagged versions (e.g., `v2025.01.15`) 
- **Development**: Main branch (continuous integration)
- **Manual Builds**: On-demand via GitHub Actions

## Naming Convention

### Git Tags
- **Versioned**: `v2025.01.15`, `v2025.03.22`
- **Latest**: `latest` (always points to most recent release)

### Release Titles
- Format: `TizenTube Standalone v2025.01.15`
- Example: `TizenTube Standalone v2025.03.22`

### WGT Files
- GitHub Release: `TizenTube.wgt`
- Build Artifacts: `tizentube-wgt-v2025.01.15`

## Migration from Semantic Versioning

Previous versions used semantic versioning (e.g., `1.7.0`). The transition to date-based versioning provides:

- **Clearer Timeline** - Version `2025.01.15` is obviously newer than `2024.12.01`
- **Simpler Decision Making** - No debates about major vs minor changes
- **Better User Experience** - Users can easily identify the most recent version

## Version Checks

The userScript includes automatic update checking that works with date-based versions:

```javascript
// Version comparison works naturally with date-based strings
if ("2025.01.15" > "2024.12.01") {
    // Show update notification
}
```

## Release Notes

Each release includes:
- **Build Date** - When the WGT was built
- **Git Commit** - Exact source code state
- **Installation Instructions** - How to install the WGT
- **Feature Summary** - What's new in this release

This provides full traceability while keeping versions simple and intuitive.