// metro.config.cjs
// Use a .cjs file (CommonJS) on Windows to avoid ESM loader path issues when Expo dynamically imports the config.
const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/dist/metro');

module.exports = withNativeWind(getDefaultConfig(__dirname));
