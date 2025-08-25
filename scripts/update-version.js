#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get version from command line or use current date
const version = process.argv[2] || new Date().toISOString().slice(0, 10).replace(/-/g, '.');

console.log(`🔖 Updating TizenTube to version: ${version}`);

// Update package.json
const packagePath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
packageJson.version = version;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

// Update config.xml
const configPath = path.join(__dirname, '../standalone/src/config.xml');
let configXml = fs.readFileSync(configPath, 'utf8');

// Replace only the widget version attribute
configXml = configXml.replace(
  /(<widget[^>]*version=")[^"]*(")/,
  `$1${version}$2`
);

fs.writeFileSync(configPath, configXml);

console.log('✅ Updated version in:');
console.log('   - package.json');
console.log('   - standalone/src/config.xml');
console.log('');
console.log('📋 Current versions:');
console.log(`   package.json: ${version}`);
console.log(`   config.xml: ${version}`);