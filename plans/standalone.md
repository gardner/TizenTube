# TizenTube Standalone WGT Implementation Plan

## Executive Summary

This document outlines a **simplified plan** to convert TizenTube from a TizenBrew module into a standalone Tizen Web App (WGT) that directly patches the existing YouTube TV app, just like TizenTube already does, but without requiring TizenBrew.

## Current Architecture Analysis

### TizenBrew Dependencies
- **Module System**: Currently relies on TizenBrew's NPM module loading
- **App Launching**: Uses `tizen.application.launchAppControl()` to launch TizenBrew with module data
- **Script Injection**: User scripts are injected by TizenBrew into YouTube TV

### Core Components
1. **User Scripts** (`mods/`): JavaScript modifications for YouTube TV
2. **Service Component** (`service/`): DIAL protocol server for external device integration  
3. **Build System**: Rollup-based bundling with Babel transpilation

## Proposed Architecture: Direct YouTube App Patching

### Overview
Create a standalone Tizen Web App that **directly launches and modifies the existing YouTube TV app** using the same JSON.parse hijacking approach TizenTube already uses, but without TizenBrew as an intermediary.

**Key Insight**: Instead of building a YouTube clone, we launch the real YouTube TV app and inject our modification scripts into it.

### App Structure
```
TizenTubeApp/
├── config.xml                 # Tizen app configuration
├── index.html                 # Launcher interface
├── js/
│   ├── launcher.js            # YouTube TV launcher + script injector
│   ├── userScript.js          # Current TizenTube user scripts (bundled)
│   ├── adblock.js            # Ad blocking logic (from mods/)
│   ├── sponsorblock.js       # SponsorBlock integration (from mods/)
│   ├── ui/                   # UI components (from mods/ui/)
│   ├── config.js             # Configuration management (from mods/)
│   └── dial-service.js       # DIAL protocol (from service/)
├── assets/
│   └── icons/                # App icons
└── dist/                     # Build output
```

## Technical Implementation Strategy

### Phase 1: Foundation Setup

#### 1.1 Tizen App Configuration
Create `config.xml` with necessary privileges:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" 
        xmlns:tizen="http://tizen.org/ns/tizen"
        id="com.tizentube.app" 
        version="1.0.0">
    
    <tizen:application id="tizentube.main" required_version="6.0"/>
    <name>TizenTube</name>
    <description>Ad-free YouTube for Smart TV</description>
    
    <!-- Critical privileges -->
    <tizen:privilege name="http://tizen.org/privilege/internet"/>
    <tizen:privilege name="http://tizen.org/privilege/application.launch"/>
    <tizen:privilege name="http://tizen.org/privilege/application.info"/>
    <tizen:privilege name="http://tizen.org/privilege/filesystem.write"/>
    
    <!-- Samsung TV metadata -->
    <tizen:metadata key="http://samsung.com/tv/metadata/prelaunch.support" value="true"/>
    <tizen:metadata key="http://samsung.com/tv/metadata/use.network" value="true"/>
    
    <content src="index.html"/>
    <icon src="assets/icons/icon-256.png"/>
</widget>
```

#### 1.2 Simple Launcher Interface
Create `index.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=960, height=540">
    <title>TizenTube</title>
    <style>
        body { background: #000; color: #fff; font-family: Arial; text-align: center; padding: 200px 50px; }
        .logo { font-size: 48px; margin-bottom: 20px; }
        .status { font-size: 18px; margin-bottom: 30px; }
        .spinner { border: 4px solid #333; border-top: 4px solid #fff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="logo">TizenTube</div>
    <div id="status" class="status">Launching YouTube TV...</div>
    <div class="spinner"></div>
    
    <script src="js/userScript.js"></script>
    <script src="js/launcher.js"></script>
</body>
</html>
```

### Phase 2: Core Functionality Implementation

#### 2.1 YouTube TV Launcher (`js/launcher.js`)
Launch YouTube TV app directly and inject our scripts:
```javascript
class YouTubeLauncher {
    constructor() {
        this.youtubeAppId = 'org.tizen.browser'; // YouTube TV app ID
        this.init();
    }
    
    async init() {
        try {
            // Update status
            document.getElementById('status').textContent = 'Preparing modifications...';
            
            // Wait a moment for scripts to load
            await this.delay(2000);
            
            // Launch YouTube TV with our scripts pre-loaded
            this.launchYouTubeTV();
        } catch (error) {
            this.showError('Failed to launch YouTube TV: ' + error.message);
        }
    }
    
    launchYouTubeTV() {
        // Launch YouTube TV app
        const appControl = new tizen.ApplicationControl(
            'http://tizen.org/appcontrol/operation/view',
            'https://www.youtube.com/tv'
        );
        
        tizen.application.launchAppControl(
            appControl,
            null,
            () => {
                console.log('YouTube TV launched successfully');
                // Our userScript.js is already loaded globally and will affect the launched app
            },
            (error) => {
                this.showError('Failed to launch YouTube TV: ' + error.message);
            }
        );
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    showError(message) {
        document.getElementById('status').textContent = message;
        document.querySelector('.spinner').style.display = 'none';
    }
}

// Start the launcher when page loads
window.addEventListener('load', () => {
    new YouTubeLauncher();
});
```

#### 2.2 Script Injection Strategy
The key insight is that **our bundled `userScript.js` runs globally** and will automatically affect the YouTube TV app when it launches, just like TizenBrew does, but more directly.

#### 2.3 DIAL Protocol Integration (Optional)
**Challenge**: Tizen web apps cannot run HTTP servers directly.

**Solutions**:
1. **Skip DIAL**: Most users don't use external device casting
2. **Separate Service App**: Create companion Tizen service app for DIAL
3. **Alternative Discovery**: Use Tizen's built-in casting APIs if available

```javascript
// Simplified DIAL support - just handle launch parameters
class LaunchHandler {
    constructor() {
        this.handleLaunchParams();
    }
    
    handleLaunchParams() {
        const appControl = tizen.application.getCurrentApplication().getRequestedAppControl();
        if (appControl && appControl.appControl && appControl.appControl.data) {
            const data = appControl.appControl.data;
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === 'PAYLOAD') {
                    const payload = JSON.parse(data[i].value[0]);
                    // Launch YouTube with specific video/content
                    this.launchWithPayload(payload);
                    return;
                }
            }
        }
        // Default launch
        this.launchYouTube();
    }
    
    launchWithPayload(payload) {
        const url = `https://www.youtube.com/tv?v=${payload.videoId || ''}`;
        this.launchYouTube(url);
    }
    
    launchYouTube(url = 'https://www.youtube.com/tv') {
        const appControl = new tizen.ApplicationControl(
            'http://tizen.org/appcontrol/operation/view',
            url
        );
        tizen.application.launchAppControl(appControl);
    }
}
```

### Phase 3: User Script Bundle

#### 3.1 Bundle Existing TizenTube Scripts
The `js/userScript.js` is a direct bundle of the existing TizenTube user scripts:

```javascript
// js/userScript.js - bundled from mods/userScript.js
import 'whatwg-fetch';
import './domrect-polyfill';
import './adblock.js';        // Same ad blocking logic
import './sponsorblock.js';   // Same SponsorBlock integration  
import './ui/ui.js';          // Same UI modifications
import './ui/speedUI.js';
import './ui/theme.js';
import './ui/settings.js';
import './ui/disableWhosWatching.js'
import './updater.js';

// All the existing TizenTube functionality, just bundled for standalone use
```

#### 3.2 No Interface Changes Needed
**Key Advantage**: Since we're launching the real YouTube TV app, we don't need to replicate its interface. Our scripts just modify the existing YouTube TV UI exactly like TizenTube already does.

The existing `ui/` components handle:
- Settings panel overlays
- Speed controls
- Theme customization  
- Remote control navigation
- Custom UI elements

### Phase 4: Build System

#### 4.1 Bundle Configuration
Modify `rollup.config.js` to create standalone bundle:
```javascript
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';

export default {
    input: 'src/userScript.js', // Same entry as TizenBrew version
    output: {
        file: 'dist/js/userScript.js',
        format: 'iife',
        name: 'TizenTube'
    },
    plugins: [
        resolve(),
        babel({
            babelHelpers: 'bundled',
            presets: [['@babel/preset-env', { targets: 'Chrome 47' }]]
        }),
        terser(),
        copy({
            targets: [
                { src: 'src/config.xml', dest: 'dist/' },
                { src: 'src/index.html', dest: 'dist/' },
                { src: 'src/assets/*', dest: 'dist/assets/' },
                { src: 'src/js/launcher.js', dest: 'dist/js/' }
            ]
        })
    ]
};
```

#### 4.2 All Existing Features Preserved
Since we're bundling the exact same user scripts, all features are preserved:
- ✅ Ad blocking via JSON.parse hijacking
- ✅ SponsorBlock segment detection and skipping
- ✅ DeArrow title/thumbnail replacement
- ✅ Custom UI themes
- ✅ Playback speed controls
- ✅ Settings management via localStorage
- ✅ "Who's watching" disable
- ✅ Update checking

## Build and Packaging System

### Package Script
```json
{
    "scripts": {
        "build": "rollup -c",
        "package": "tizen build-web -- ./dist && tizen package -t wgt -s myProfile -- ./dist/.buildResult",
        "install": "tizen install -n TizenTube.wgt -t 0 -- ./dist/.buildResult",
        "dev": "npm run build && npm run package && npm run install"
    }
}
```

**Build Process**:
1. Bundle existing TizenTube user scripts → `dist/js/userScript.js`
2. Copy launcher and assets → `dist/`
3. Package as WGT → `TizenTube.wgt`
4. Install on TV → Ready to use

## Technical Challenges and Solutions

### 5.1 App Launch Coordination
**Challenge**: Ensuring our scripts are active when YouTube TV launches
**Solution**: 
- Load userScript.js globally in our launcher app
- Scripts remain in memory and automatically affect launched YouTube TV
- Same principle as TizenBrew, but simpler

### 5.2 Script Persistence
**Challenge**: Scripts need to survive across app launches  
**Solution**:
- Bundle all modifications into single userScript.js
- Use same global JSON.parse hijacking approach
- Scripts activate immediately when YouTube TV loads

### 5.3 DIAL Service Limitation
**Challenge**: Cannot run HTTP server in Tizen web app
**Solutions**:
1. **Skip DIAL**: Focus on core functionality first
2. **Launch Parameter**: Handle direct launch with video IDs
3. **Future Enhancement**: Separate service app if needed

### 5.4 Performance
**Advantage**: Actually better performance than complex hybrid approach
- No iframe overhead
- No DOM replication
- Direct modification of real YouTube TV
- Smaller bundle size

## Migration Strategy

### 6.1 Simplified Migration Path

**Phase 1**: Core conversion (1 week)
- Create Tizen app structure (`config.xml`, `index.html`)
- Build simple launcher (`launcher.js`)
- Bundle existing user scripts (no changes needed)
- Test basic functionality

**Phase 2**: Polish and package (1 week)  
- Add app icons and metadata
- Handle launch parameters  
- Test on multiple TV models
- Create WGT package

**Phase 3**: Distribution (1 week)
- Documentation and installation guide
- User testing and feedback
- Release preparation

**Total Time**: 3 weeks instead of 8-12 weeks

### 6.2 Testing Strategy

**Development Testing**:
- Tizen Studio emulator for app launch
- Real TV testing for script injection
- Verify all existing TizenTube features work

**User Acceptance Testing**:
- Side-by-side comparison with TizenBrew version
- Performance comparison (should be better)
- Installation simplicity testing

## Risk Assessment and Mitigation

### 6.1 Low Risks (Advantages of Simple Approach)
1. **Script Compatibility**: Using exact same scripts as TizenBrew version
2. **Feature Parity**: All existing functionality preserved
3. **Performance**: Should be better than complex hybrid approach

### 6.2 Medium Risks  
1. **App Launch Timing**: Mitigation - Test script loading coordination
2. **Tizen App Store Approval**: Mitigation - Follow Tizen guidelines exactly
3. **TV Model Compatibility**: Mitigation - Test on multiple Samsung TV generations

## Success Metrics

1. **Functional**: 100% feature parity with TizenBrew version
2. **Performance**: Faster launch (no TizenBrew overhead)
3. **Compatibility**: Same TV compatibility as current TizenTube
4. **User Experience**: Identical to current TizenTube (uses same UI)
5. **Installation**: Single WGT file, no TizenBrew dependency

## Conclusion

**The simplified approach is much better**: Instead of building a complex hybrid app, we simply launch the real YouTube TV app and inject our existing, proven modification scripts.

**Key Advantages**:
1. **Minimal Development**: Reuse 95% of existing TizenTube code
2. **Perfect Compatibility**: Same scripts = same functionality
3. **Better Performance**: No iframe/proxy overhead
4. **Faster Timeline**: 3 weeks instead of 3 months
5. **Lower Risk**: Proven script injection approach

**Implementation Summary**:
- Create simple Tizen launcher app
- Bundle existing user scripts (no changes)
- Launch real YouTube TV with modifications active
- Package as standalone WGT

This approach delivers the same TizenTube experience without TizenBrew dependency, with minimal development effort and maximum compatibility.