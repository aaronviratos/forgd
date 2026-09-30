// Metro bundler settings. Extends Expo's defaults; comments explain each addition.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const upstream = config.resolver.resolveRequest;

// 1. PowerSync's Expo Go database (@powersync/adapter-sql-js) includes code for running
// under Node on a computer, which imports Node's `fs` and `crypto`. That code only runs
// under Node, never on a phone, but Metro refuses to bundle imports it cannot find. Swap
// those two imports for empty modules, for that package only, so any other code that
// wrongly uses Node modules still fails loudly.
const NODE_ONLY = new Set(['node:fs', 'node:crypto', 'fs', 'crypto']);
const FROM_SQLJS = /[\\/]@powersync[\\/](adapter-sql-js|sql-js)[\\/]/;

// 2. When started for Expo Go (`npm run go` sets FORGD_EXPO_GO=1), swap the native SQLite
// driver for a stand-in: Expo Go cannot load its native code and the real package crashes
// as soon as it is imported. Development and store builds never set this.
const EXPO_GO = process.env.FORGD_EXPO_GO === '1';
const OP_SQLITE_STANDIN = path.join(__dirname, 'src/data/expo-go/op-sqlite.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (NODE_ONLY.has(moduleName) && FROM_SQLJS.test(context.originModulePath)) {
    return { type: 'empty' };
  }
  if (EXPO_GO && platform !== 'web' && moduleName === '@op-engineering/op-sqlite') {
    return { type: 'sourceFile', filePath: OP_SQLITE_STANDIN };
  }
  return (upstream ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
