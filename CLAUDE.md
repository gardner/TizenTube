# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TizenTube is a TizenBrew module that enhances streaming website viewing experience by removing ads and adding SponsorBlock support. It's specifically designed for Samsung Tizen TVs. The project consists of two main components:

1. **User Scripts (`mods/`)** - Client-side modifications injected into streaming websites
2. **Service (`service/`)** - Express server providing DIAL protocol support for TV integration

## Build System

The project uses Rollup for bundling with different configurations for each component:

### Build Commands
- **Build user scripts**: `cd mods && npm run build` (outputs to `dist/userScript.js`)
- **Build service**: `cd service && rollup -c rollup.config.js` (outputs to `dist/service.js`)

### Build Process
- User scripts are bundled into a single IIFE targeting Chrome 47 (Tizen browser compatibility)
- Service is bundled as CommonJS with custom XML content injection for DIAL protocol
- Both use Babel for ES5 transpilation and Terser for minification

## Architecture

### User Scripts (`mods/`)
- **Entry point**: `userScript.js` - imports all modules
- **Core modules**: 
  - `adblock.js` - Ad blocking functionality
  - `sponsorblock.js` - SponsorBlock integration
  - `ui/` - UI components (settings, themes, speed controls)
- **Build target**: Single bundled file for injection into streaming sites

### Service (`service/`)
- **Express server** on port 8085 with CORS enabled
- **DIAL protocol support** for TV app launching via `@patrickkfkan/peer-dial`
- **Integration**: Launches TizenBrew app with YouTube TV URL

### Key Dependencies
- **User scripts**: Babel, Rollup, polyfills for older browsers
- **Service**: Express, CORS, peer-dial library

## Development Notes

- The project targets Chrome 47 due to Tizen TV browser limitations
- All builds output to `dist/` directory in project root
- Service must be bundled due to XML template injection requirements
- User scripts include polyfills for DOM features not available on older TV browsers