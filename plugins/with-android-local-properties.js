// Config plugin: writes android/local.properties on every prebuild, so the native build is reproducible.
// - sdk.dir from ANDROID_HOME (or ANDROID_SDK_ROOT)
// - cmake.dir from CASA_CMAKE_DIR, else the newest CMake >= 4.1 inside the SDK.
// Why: CMake 3.22 (ninja 1.10) breaks on Windows paths > 260 chars; 4.1.2 works (docs/PROVA-DE-VIDA.md §7).
// Paths use forward slashes: a backslash is an escape in .properties files.
const fs = require('fs');
const path = require('path');
const { withDangerousMod } = require('expo/config-plugins');

const MIN_CMAKE = [4, 1];

function toProps(p) {
  return p.split(path.sep).join('/');
}

function parseVersion(name) {
  const parts = name.split('.').map((n) => parseInt(n, 10));
  return parts.every((n) => Number.isFinite(n)) ? parts : null;
}

function newestCmake(sdkDir) {
  const dir = path.join(sdkDir, 'cmake');
  if (!fs.existsSync(dir)) return null;
  const versions = fs
    .readdirSync(dir)
    .map((name) => ({ name, v: parseVersion(name) }))
    .filter((x) => x.v && (x.v[0] > MIN_CMAKE[0] || (x.v[0] === MIN_CMAKE[0] && x.v[1] >= MIN_CMAKE[1])))
    .sort((a, b) => b.v[0] - a.v[0] || b.v[1] - a.v[1] || (b.v[2] ?? 0) - (a.v[2] ?? 0));
  return versions.length ? path.join(dir, versions[0].name) : null;
}

module.exports = function withAndroidLocalProperties(config) {
  return withDangerousMod(config, [
    'android',
    (cfg) => {
      const sdkDir = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
      if (!sdkDir) {
        console.warn('[with-android-local-properties] ANDROID_HOME not set; local.properties not written.');
        return cfg;
      }
      const cmakeDir = process.env.CASA_CMAKE_DIR || newestCmake(sdkDir);
      const lines = [`sdk.dir=${toProps(sdkDir)}`];
      if (cmakeDir) lines.push(`cmake.dir=${toProps(cmakeDir)}`);
      else console.warn('[with-android-local-properties] No CMake >= 4.1 found; the Windows build may fail (MAX_PATH).');

      const file = path.join(cfg.modRequest.platformProjectRoot, 'local.properties');
      fs.writeFileSync(file, lines.join('\n') + '\n');
      return cfg;
    },
  ]);
};
