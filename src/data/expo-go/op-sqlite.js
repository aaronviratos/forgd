// Expo Go stand-in for @op-engineering/op-sqlite, the native SQLite driver.
//
// Expo Go cannot load the driver's native code, and the real package reaches for it as
// soon as it is imported, which crashes the app. When the app is started for Expo Go
// (`npm run go`), metro.config.js swaps the package for this file. In Expo Go the app uses
// PowerSync's JavaScript SQLite instead (src/data/db.native.ts), so nothing here should
// ever be called; if something is, it fails with a clear message.
// Development and store builds always get the real driver.

function unavailable(name) {
  return () => {
    throw new Error(
      `op-sqlite.${name}() is not available in Expo Go. Expo Go uses the JavaScript ` +
        'database (src/data/db.native.ts); build a development build for the native one.',
    );
  };
}

export const open = unavailable('open');
export const getDylibPath = unavailable('getDylibPath');
