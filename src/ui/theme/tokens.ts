// Design tokens (UX.md §5, D-016, D-017). Contrast is enforced by tests/ui/contrast.test.ts.

export type ColorScheme = 'light' | 'dark';

export type Palette = {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  income: string;
  expense: string;
  warning: string;
  success: string;
  danger: string;
  /** Borders of interactive components (≥ 3:1, WCAG 1.4.11). */
  border: string;
};

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    bg: '#F7F8F9',
    surface: '#FFFFFF',
    text: '#1A1D21',
    textMuted: '#4A515A',
    primary: '#0F5F73',
    onPrimary: '#FFFFFF',
    income: '#1F5FAD',
    expense: '#B3471B',
    warning: '#8A5A00',
    success: '#116B5C',
    danger: '#A1263A',
    border: '#7D858F',
  },
  dark: {
    bg: '#121417',
    surface: '#1C1F23',
    text: '#E8EAED',
    textMuted: '#B4BAC2',
    primary: '#6CC4D9',
    onPrimary: '#121417',
    income: '#8AB4F8',
    expense: '#F2A07B',
    warning: '#E8C268',
    success: '#6FD1BC',
    danger: '#F28B9B',
    border: '#737B85',
  },
};

/** Base-4 spacing scale (UX.md §5.3). */
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { control: 8, card: 12 } as const;

/** Minimum touch target in dp/px on both platforms (D-027). */
export const minTarget = 48;
/** Minimum gap between adjacent actions (D-027). */
export const actionGap = 12;

/** Single centered column on large web screens (D-020). */
export const maxContentWidth = 480;

/** Type scale in sp/px; scales with the system font size (UX.md §5.2). */
export const typography = {
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 23, fontWeight: '600' },
  title: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
  headline: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
  display: { fontSize: 32, lineHeight: 42, fontWeight: '700' },
} as const;

export type TypographyVariant = keyof typeof typography;
