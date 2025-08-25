# TizenTube

TizenTube enhances your YouTube TV viewing experience by removing ads and adding SponsorBlock support. Available in two versions:

1. **TizenBrew Module** - Requires TizenBrew installation
2. **Standalone Web App** - Direct installation on Samsung Tizen TVs (NEW!)

Looking for an app for Android TVs? Check out [TizenTube Cobalt](https://github.com/reisxd/TizenTubeCobalt). It offers everything TizenTube has for Android TVs. [Download the latest release here.](https://github.com/reisxd/TizenTubeCobalt/releases/latest).

[Discord Server Invite](https://discord.gg/m2P7v8Y2qR)

# Installation Options

## Option 1: Standalone Web App (Recommended)

Install TizenTube directly on your Samsung TV without requiring TizenBrew:

### 🚀 Pre-built Release (Easiest)

**Download ready-to-install WGT from GitHub Releases:**

1. **Download WGT**: Go to [Releases](https://github.com/gardner/TizenTube/releases) and download `TizenTube.wgt`
   - **Latest Release**: Always get the most recent version from [Latest](https://github.com/gardner/TizenTube/releases/tag/latest)
   - **Specific Version**: Choose a specific date-based version (e.g., v2025.01.15)
2. **Install on TV**:
   - Copy WGT to USB drive → Install on Samsung TV
   - Or use Tizen CLI: `tizen install -t 0 -n TizenTube.wgt`
3. **Launch**: Find TizenTube in your TV's app menu

### 🛠️ Build from Source

#### Prerequisites (for building)
- Samsung Tizen TV (2018+ recommended)
- **For Docker Build:** Docker installed on your computer
- **For Local Build:** Tizen Studio or Tizen CLI installed
- Developer Mode enabled on TV (for direct installation)

#### Build Instructions

#### Option A: Docker Build (Recommended - No Tizen Studio Required)

1. **Clone and build using Docker:**
   ```bash
   git clone https://github.com/gardner/TizenTube.git
   cd TizenTube
   # Build WGT using Docker (includes Tizen Studio)
   ./docker/build-docker.sh
   ```

2. **Install WGT on TV:**
   - Copy `output/TizenTube.wgt` to your TV via USB drive
   - Install using TV's built-in package installer
   - Or use Tizen CLI: `tizen install -t 0 -n TizenTube.wgt -- output/`

**Certificate Persistence:** The Docker build automatically creates and persists signing certificates in the `certificates/` directory, ensuring consistent signatures across builds.

#### Option B: Local Build (Requires Tizen Studio)

1. **Build the standalone app:**
   ```bash
   git clone https://github.com/gardner/TizenTube.git
   cd TizenTube/standalone
   pnpm install
   pnpm run build
   ```

2. **Package as WGT:**
   ```bash
   # Requires Tizen CLI to be installed and configured
   pnpm run package
   ```

3. **Install on TV:**
   ```bash
   # Connect to TV and install
   pnpm run install-tv
   ```

4. **Launch TizenTube** from your TV's app menu

### Benefits of Standalone Version
- ✅ **No TizenBrew dependency** - Direct TV installation
- ✅ **Better performance** - No proxy overhead
- ✅ **Simpler setup** - Single WGT file installation
- ✅ **Same features** - Identical functionality to TizenBrew version

## Option 2: TizenBrew Module (Legacy)

Use TizenTube as a TizenBrew module:

1. Install TizenBrew from [here](https://github.com/gardner/TizenBrew) and follow the instructions.

2. Add the NPM module `@foxreis/tizentube` to the module manager. You can access the module manager by pressing the [GREEN] button on the remote.

# Features

Both installation methods provide identical functionality:

- **Ad Blocker** - Removes all YouTube TV advertisements
- **[SponsorBlock](https://sponsor.ajay.app/) Support** - Skip sponsored segments automatically
- **Video Speed Control** - Adjust playback speed from 0.25x to 4x
- **[DeArrow](https://dearrow.ajay.app/) Support** - Replace clickbait titles and thumbnails
- **Customizable Themes** - Custom focus container and route colors
- **Long Press Support** - Enhanced remote control navigation
- **High Quality Thumbnails** - Better thumbnail resolution
- **Chapters Support** - Enhanced video chapter navigation
- **Who's Watching Menu Control** - Disable annoying "Who's watching?" prompts

# How It Works

TizenTube uses advanced JSON.parse hijacking to intercept and modify YouTube TV's API responses in real-time:

1. **Launches Real YouTube TV** - No UI replication needed
2. **Injects Modification Scripts** - Proven ad-blocking and enhancement code
3. **Intercepts API Calls** - Filters out ads before they reach the interface
4. **Enhances User Experience** - Adds features YouTube TV lacks

This approach ensures **100% compatibility** with YouTube TV updates while providing a seamless, ad-free experience.

# Development

## Building from Source

### TizenBrew Module
```bash
cd mods
pnpm install
pnpm run build
# Output: ../dist/userScript.js
```

### Standalone Web App

#### Docker Build
```bash
# Build WGT using Docker (no Tizen Studio required)
./docker/build-docker.sh
# Output: output/TizenTube.wgt
```

#### Local Build
```bash
cd standalone
pnpm install
pnpm run build         # Builds mods + creates WGT structure
pnpm run package       # Creates WGT package (requires Tizen CLI)
pnpm run package-docker # Alternative: use Docker for packaging
```

## Project Structure

```
TizenTube/
├── mods/                 # TizenBrew module source
│   ├── userScript.js     # Entry point
│   ├── adblock.js        # Ad blocking logic
│   ├── sponsorblock.js   # SponsorBlock integration
│   ├── ui/               # UI enhancements
│   └── rollup.config.js  # Build configuration
├── service/              # DIAL protocol service (TizenBrew only)
├── standalone/           # Standalone Tizen Web App
│   ├── src/
│   │   ├── config.xml    # Tizen app configuration
│   │   ├── index.html    # Launcher interface
│   │   ├── assets/icons/ # App icons
│   │   └── js/launcher.js # YouTube TV launcher
│   └── rollup.config.js  # Standalone build config
├── docker/               # Docker-based build system
│   ├── Dockerfile        # Multi-stage Docker build
│   ├── build-docker.sh   # Build script
│   ├── package.sh        # WGT packaging script
│   └── expect_script     # Automated certificate handling
├── certificates/         # Persistent Tizen signing certificates
├── dist/                 # Build outputs
└── output/               # Docker build outputs (WGT files)
```

# Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes (following the existing code style)
4. Test on actual Tizen TV hardware when possible
5. Submit a pull request

For feature requests or bug reports, [open an issue](https://github.com/gardner/TizenTube/issues/new).

# Troubleshooting

## Common Issues

**Standalone App Won't Launch YouTube:**
- Ensure TV has YouTube app installed
- Check Developer Mode is enabled
- Verify WGT was installed successfully

**Features Not Working:**
- Wait 2-3 seconds after launching for scripts to initialize
- Check TV's internet connection for SponsorBlock functionality
- Restart the app if issues persist

**Build Errors:**
- Ensure Node.js 18+ and pnpm are installed
- Clear node_modules and reinstall dependencies
- Check file permissions for build output directories

**Certificate Issues:**
- **"Certificate already exists"**: Delete `certificates/` directory and rebuild
- **"Invalid signature"**: TV may have cached old certificate - restart TV
- **Docker permission errors**: Ensure Docker can write to `certificates/` and `output/` directories

## Support

- [Discord Server](https://discord.gg/m2P7v8Y2qR) - Community support and discussion
- [GitHub Issues](https://github.com/gardner/TizenTube/issues) - Bug reports and feature requests

# Versioning

TizenTube uses date-based versioning (e.g., `2025.01.15`) for simple, intuitive releases. See [VERSIONING.md](VERSIONING.md) for details.

# License

This project is licensed under GPL-3.0 - see the LICENSE file for details.

# Acknowledgments

- [SponsorBlock](https://sponsor.ajay.app/) API for community-driven segment data
- [DeArrow](https://dearrow.ajay.app/) for title and thumbnail replacements
- [TizenBrew](https://github.com/gardner/TizenBrew) for the original module system
- YouTube WebOS contributors for foundational code
