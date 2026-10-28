import { contrastRatio } from '../../src/ui/theme/contrast';
import { palettes, type ColorScheme } from '../../src/ui/theme/tokens';

// WCAG 2.2 AA: text ≥ 4.5:1 (1.4.3); component boundaries and icons ≥ 3:1 (1.4.11). D-016, D-027.
const TEXT = 4.5;
const NON_TEXT = 3;

const textTokens = ['text', 'textMuted', 'primary', 'income', 'expense', 'warning', 'success', 'danger'] as const;

describe.each<ColorScheme>(['light', 'dark'])('%s theme contrast', (scheme) => {
  const p = palettes[scheme];

  it.each(textTokens)('%s is readable on bg and surface', (token) => {
    expect(contrastRatio(p[token], p.bg)).toBeGreaterThanOrEqual(TEXT);
    expect(contrastRatio(p[token], p.surface)).toBeGreaterThanOrEqual(TEXT);
  });

  it('button labels are readable on filled buttons', () => {
    expect(contrastRatio(p.onPrimary, p.primary)).toBeGreaterThanOrEqual(TEXT);
    expect(contrastRatio(p.surface, p.danger)).toBeGreaterThanOrEqual(TEXT);
  });

  it('component borders meet 3:1 on bg and surface', () => {
    expect(contrastRatio(p.border, p.bg)).toBeGreaterThanOrEqual(NON_TEXT);
    expect(contrastRatio(p.border, p.surface)).toBeGreaterThanOrEqual(NON_TEXT);
  });
});

describe('contrastRatio', () => {
  it('matches known WCAG values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });

  it('rejects malformed colors', () => {
    expect(() => contrastRatio('red', '#FFFFFF')).toThrow();
  });
});
