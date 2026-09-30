#!/usr/bin/env node
/**
 * `npm run go`: start the app for testing in Expo Go on a phone.
 *
 * - Tells Metro to use the Expo Go stand-in for the native SQLite driver (FORGD_EXPO_GO=1).
 * - Puts this computer's Wi-Fi address in the QR code, skipping virtual adapters such as
 *   Windows Mobile Hotspot (192.168.137.x) that a phone cannot reach.
 * - Supabase refuses sign-in links that return to a bare IP address, so email-link sign-in
 *   needs `--tunnel` (a named address) or an emailed code. `--sslip` writes the address as
 *   a name (192.168.4.131.sslip.io) instead, but many home routers block such names.
 *
 * Extra arguments pass through to `expo start`, e.g. `npm run go -- --tunnel` when the phone
 * and computer are on different networks, or `npm run go -- --clear` to rebuild from scratch.
 */
import { spawn } from 'node:child_process';
import { networkInterfaces } from 'node:os';

const args = process.argv.slice(2);
const tunnel = args.includes('--tunnel');
const sslip = args.includes('--sslip');

/** The best guess at this computer's Wi-Fi/LAN address. */
function lanAddress() {
  const candidates = [];
  for (const [name, addrs] of Object.entries(networkInterfaces())) {
    for (const a of addrs ?? []) {
      if (a.family !== 'IPv4' || a.internal) continue;
      if (a.address.startsWith('169.254.') || a.address.startsWith('192.168.137.')) continue;
      // Prefer adapters that look like Wi-Fi or Ethernet over virtual ones.
      const score = /wi-?fi|wlan|en0|ethernet|eth0/i.test(name) ? 0 : 1;
      candidates.push({ score, address: a.address, name });
    }
  }
  candidates.sort((x, y) => x.score - y.score);
  return candidates[0];
}

const env = { ...process.env, FORGD_EXPO_GO: '1' };
if (!tunnel && !env.REACT_NATIVE_PACKAGER_HOSTNAME) {
  const lan = lanAddress();
  if (lan) {
    env.REACT_NATIVE_PACKAGER_HOSTNAME = sslip ? `${lan.address}.sslip.io` : lan.address;
    console.log(`Using ${env.REACT_NATIVE_PACKAGER_HOSTNAME} (${lan.name}) for the QR code.`);
  }
}

const passThrough = args.filter((a) => a !== '--sslip');
const expoArgs = ['expo', 'start', ...(tunnel ? [] : ['--lan']), ...passThrough];
const child = spawn('npx', expoArgs, {
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
child.on('exit', (code) => process.exit(code ?? 0));
