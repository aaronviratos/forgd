// Jest settings. Extends Expo's preset; the comments explain each addition.
const preset = require('jest-expo/jest-preset');

module.exports = {
  preset: 'jest-expo',
  // Some packages (PowerSync) ship .mjs files; convert them the same way as .js files.
  transform: { '\\.mjs$': preset.transform['\\.[jt]sx?$'] },
  // Packages in node_modules that ship modern syntax and must be converted for tests.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|react-native-svg|phosphor-react-native|@powersync/.*|uuid)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/prototype/'],
  // Tests run on a computer, not a phone: use PowerSync's shared core (schema, types)
  // instead of the React Native package, which loads the phone's database driver.
  moduleNameMapper: { '^@powersync/react-native$': '@powersync/common' },
};
