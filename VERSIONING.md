# TizenTube Versioning Strategy

TizenTube uses **semantic versioning** (SemVer) to ensure compatibility with Tizen TV platform requirements.

## Version Format

**Format:** `x.y.z`

**Constraints (Tizen Requirements):**
- `x` (major): 0-255
- `y` (minor): 0-255  
- `z` (patch): 0-65535

**Examples:**
- `1.0.0` - Initial stable release
- `1.1.0` - New features added
- `1.1.1` - Bug fixes
- `2.0.0` - Breaking changes

## Why Semantic Versioning?

1. **Tizen Compatibility** - Required format for Samsung TV platform
2. **Meaningful Versions** - Major.Minor.Patch indicates change impact
3. **Industry Standard** - Widely understood versioning scheme
4. **Tool Support** - Works with standard package managers and CI/CD

## Version Management

### Manual Version Updates

Use the version bump script with explicit version:

```bash
# Update version to specific semantic version
./scripts/version-bump.sh 1.2.0

# Update version and create git tag
./scripts/version-bump.sh 1.2.0 --tag
```

This automatically updates:
- `package.json`
- `standalone/src/config.xml`

### Release Process

1. **Develop and test** your changes
2. **Choose appropriate version** based on changes:
   - **Major** (x.0.0): Breaking changes, major new features
   - **Minor** (x.y.0): New features, backwards compatible
   - **Patch** (x.y.z): Bug fixes, minor updates
3. **Update version** using the script:
   ```bash
   ./scripts/version-bump.sh 1.2.0 --tag
   ```
4. **Push the tag** to trigger release:
   ```bash
   git push origin v1.2.0
   ```
5. **GitHub Actions** automatically builds and releases the WGT

### Release Channels

- **Latest Release**: `latest` tag - Always points to the most recent stable version
- **Stable Releases**: Tagged versions (e.g., `v1.2.0`) 
- **Development**: Main branch (continuous integration)
- **Manual Builds**: On-demand via GitHub Actions

## Naming Convention

### Git Tags
- **Versioned**: `v1.0.0`, `v1.2.0`, `v2.0.0`
- **Latest**: `latest` (always points to most recent release)

### Release Titles
- Format: `TizenTube Standalone v1.2.0`
- Example: `TizenTube Standalone v2.0.0`

### WGT Files
- GitHub Release: `TizenTube.wgt`
- Build Artifacts: `tizentube-wgt-v1.2.0`

## Migration from Date-Based Versioning

Previous versions used date-based versioning (e.g., `2025.01.15`) which caused Tizen installation failures due to platform constraints.

**Why We Switched:**
- **Tizen Compatibility** - Date format `2025.01.15` exceeded Tizen's version number limits
- **Platform Requirements** - Samsung TV platform enforces strict x.y.z format
- **Installation Success** - Prevents "Parsing error -19" during WGT installation

## Version Validation

The version scripts include automatic validation:

```javascript
// Validates Tizen version constraints
const [x, y, z] = version.split('.').map(Number);
if (x > 255 || y > 255 || z > 65535) {
    throw new Error('Version exceeds Tizen limits');
}
```

## Version Checks

The userScript includes update checking that works with semantic versions:

```javascript
// Semantic version comparison
function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
        if (parts1[i] > parts2[i]) return 1;
        if (parts1[i] < parts2[i]) return -1;
    }
    return 0;
}
```

## Release Notes

Each release includes:
- **Version Number** - Semantic version (e.g., v1.2.0)
- **Change Type** - Major/Minor/Patch classification  
- **Git Commit** - Exact source code state
- **Installation Instructions** - How to install the WGT
- **Feature Summary** - What's new in this release

This ensures Tizen compatibility while providing clear versioning semantics.