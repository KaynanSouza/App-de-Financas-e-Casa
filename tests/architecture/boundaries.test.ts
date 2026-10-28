import fs from 'fs';
import path from 'path';

// Architecture rules from AGENTS.md §4 and ARCH.md ("Regras de dependência").

const SRC = path.resolve(__dirname, '../../src');

/** Third-party packages allowed outside src/platform: UI and navigation only. Add here only after review. */
const UI_PACKAGES = new Set([
  'react',
  'react-native',
  'expo-router',
  'expo-status-bar',
  'react-native-svg',
  'react-native-safe-area-context',
]);

type Import = { file: string; spec: string };

function listFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e: fs.Dirent) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return listFiles(full);
    return /\.(ts|tsx)$/.test(e.name) ? [full] : [];
  });
}

function importsOf(file: string): Import[] {
  const code = fs.readFileSync(file, 'utf8');
  const re = /(?:from\s+|import\s*\(\s*|require\s*\(\s*|import\s+)['"]([^'"]+)['"]/g;
  return [...code.matchAll(re)].map((m) => ({ file: path.relative(SRC, file).split(path.sep).join('/'), spec: m[1] }));
}

/** Resolves an import to "src/<area>/..." when it points inside src, else null. */
function srcTarget(imp: Import): string | null {
  if (imp.spec.startsWith('@/')) return imp.spec.slice(2);
  if (imp.spec.startsWith('.')) {
    const abs = path.resolve(SRC, path.dirname(imp.file), imp.spec);
    const rel = path.relative(SRC, abs);
    return rel.startsWith('..') ? null : rel.split(path.sep).join('/');
  }
  return null;
}

const packageName = (spec: string) =>
  spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];

const all = listFiles(SRC).flatMap(importsOf);
const isExternal = (i: Import) => !i.spec.startsWith('.') && !i.spec.startsWith('@/');

describe('architecture boundaries', () => {
  it('src/core imports nothing but other core files', () => {
    const bad = all.filter((i) => {
      if (!i.file.startsWith('core/')) return false;
      if (isExternal(i)) return true;
      const t = srcTarget(i);
      return t === null || !t.startsWith('core/');
    });
    expect(bad).toEqual([]);
  });

  it('platform-specific packages are imported only inside src/platform', () => {
    const bad = all.filter(
      (i) => !i.file.startsWith('platform/') && !i.file.startsWith('core/') && isExternal(i) && !UI_PACKAGES.has(packageName(i.spec)),
    );
    expect(bad).toEqual([]);
  });

  it('product modules do not import each other (they talk through events)', () => {
    const bad = all.filter((i) => {
      const own = /^modules\/([^/]+)\//.exec(i.file)?.[1];
      const target = srcTarget(i);
      const other = target ? /^modules\/([^/]+)/.exec(target)?.[1] : undefined;
      return own !== undefined && other !== undefined && other !== own;
    });
    expect(bad).toEqual([]);
  });

  it('the rule itself catches violations', () => {
    const fake: Import = { file: 'core/money/x.ts', spec: 'expo-crypto' };
    expect(isExternal(fake)).toBe(true);
    expect(UI_PACKAGES.has(packageName('expo-sqlite'))).toBe(false);
    expect(packageName('@expo/vector-icons/Foo')).toBe('@expo/vector-icons');
  });
});
