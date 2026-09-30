// Metro bundler settings. Extends Expo's defaults; the comment explains the one addition.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// PowerSync's Expo Go database (@powersync/adapter-sql-js) includes code for running under
// Node on a computer, which imports Node's `fs` and `crypto`. That code only runs under
// Node, never on a phone, but Metro refuses to bundle imports it cannot find. Swap those two
// imports for empty modules, for that package only, so any other code that wrongly uses
// Node modules still fails loudly.
const NODE_ONLY = new Set(['node:fs', 'node:crypto', 'fs', 'crypto']);
const FROM_SQLJS = /[\\/]@powersync[\\/](adapter-sql-js|sql-js)[\\/]/;
const upstream = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (NODE_ONLY.has(moduleName) && FROM_SQLJS.test(context.originModulePath)) {
    return { type: 'empty' };
  }
  return (upstream ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
