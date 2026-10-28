// Debug APK for the OPPO (arm64-v8a): prebuild -> Gradle -> optional install.
// Usage: node scripts/android-debug.mjs [--clean] [--install]
// The debug APK loads JS from Metro: run `npx expo start` and `adb reverse tcp:8081 tcp:8081` (skill expo-app).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = new Set(process.argv.slice(2));
const isWin = process.platform === 'win32';

function run(cmd, cmdArgs, opts = {}) {
  console.log(`> ${cmd} ${cmdArgs.join(' ')}`);
  const r = spawnSync(cmd, cmdArgs, { stdio: 'inherit', shell: isWin, ...opts });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run('npx', ['expo', 'prebuild', '--platform', 'android', '--no-install', ...(args.has('--clean') ? ['--clean'] : [])]);
const androidDir = path.resolve('android');
run(path.join(androidDir, isWin ? 'gradlew.bat' : 'gradlew'), ['assembleDebug', '-PreactNativeArchitectures=arm64-v8a'], {
  cwd: androidDir,
});

const apk = path.resolve('android/app/build/outputs/apk/debug/app-debug.apk');
console.log(`APK: ${apk} (${(fs.statSync(apk).size / 1e6).toFixed(0)} MB)`);

if (args.has('--install')) {
  const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  const adb = sdk ? path.join(sdk, 'platform-tools', isWin ? 'adb.exe' : 'adb') : 'adb';
  run(adb, ['install', '-r', apk]);
}
