export interface MonochromaticTheme {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Architectural' | 'Gallery' | 'Botanical' | 'Editorial' | 'Minimalist' | 'Atelier';
  hue: number;
  saturation: number;
  previewColor: string;
  swatches: {
    tint: string;
    lightTone: string;
    brand: string;
    darkTone: string;
    shade: string;
  };
}

export const MONOCHROMATIC_PALETTES: MonochromaticTheme[] = [
  {
    id: 'nordic-slate',
    name: 'Nordic Slate',
    tagline: 'Scandinavian Architectural Precision',
    description: 'A disciplined cool slate-blue single hue (220°). Evokes alpine mist, modern concrete, and Dieter Rams industrial clarity.',
    category: 'Architectural',
    hue: 220,
    saturation: 28,
    previewColor: 'hsl(220, 28%, 42%)',
    swatches: {
      tint: 'hsl(220, 30%, 96%)',
      lightTone: 'hsl(220, 22%, 86%)',
      brand: 'hsl(220, 32%, 36%)',
      darkTone: 'hsl(220, 36%, 22%)',
      shade: 'hsl(220, 44%, 10%)',
    },
  },
  {
    id: 'carbon-noir',
    name: 'Carbon Noir',
    tagline: 'Leica Minimalist Monolith',
    description: 'An ultra-refined near-achromatic monochrome (215° at 4% sat). Pure architectural exhibition aesthetic reminiscent of silver gelatin prints and modern art catalogues.',
    category: 'Minimalist',
    hue: 215,
    saturation: 4,
    previewColor: 'hsl(215, 4%, 38%)',
    swatches: {
      tint: 'hsl(215, 4%, 96%)',
      lightTone: 'hsl(215, 4%, 85%)',
      brand: 'hsl(215, 4%, 32%)',
      darkTone: 'hsl(215, 4%, 20%)',
      shade: 'hsl(215, 4%, 9%)',
    },
  },
  {
    id: 'sage-mineral',
    name: 'Sage Mineral',
    tagline: 'Biophilic Botanical Sanctuary',
    description: 'A serene single-hue sage mineral green (158°). Calms cognitive load, perfect for atmospheric and ecological observation without eye fatigue.',
    category: 'Botanical',
    hue: 158,
    saturation: 25,
    previewColor: 'hsl(158, 25%, 38%)',
    swatches: {
      tint: 'hsl(158, 26%, 95%)',
      lightTone: 'hsl(158, 20%, 84%)',
      brand: 'hsl(158, 28%, 34%)',
      darkTone: 'hsl(158, 30%, 20%)',
      shade: 'hsl(158, 35%, 9%)',
    },
  },
  {
    id: 'midnight-indigo',
    name: 'Midnight Indigo',
    tagline: 'Contemporary Gallery Sapphire',
    description: 'Deep cobalt-indigo single hue (238°). Inspired by museum night openings, archival fountain pens, and deep oceanic telemetry.',
    category: 'Gallery',
    hue: 238,
    saturation: 34,
    previewColor: 'hsl(238, 34%, 44%)',
    swatches: {
      tint: 'hsl(238, 35%, 96%)',
      lightTone: 'hsl(238, 26%, 86%)',
      brand: 'hsl(238, 38%, 40%)',
      darkTone: 'hsl(238, 42%, 22%)',
      shade: 'hsl(238, 48%, 10%)',
    },
  },
  {
    id: 'sepia-ochre',
    name: 'Sepia Ochre',
    tagline: 'Archival Editorial Monograph',
    description: 'Warm golden raw-umber hue (38°). Evokes unbleached cotton paper, modernist architectural blueprints, and warm studio daylight.',
    category: 'Editorial',
    hue: 38,
    saturation: 32,
    previewColor: 'hsl(38, 32%, 40%)',
    swatches: {
      tint: 'hsl(38, 34%, 96%)',
      lightTone: 'hsl(38, 24%, 86%)',
      brand: 'hsl(38, 36%, 36%)',
      darkTone: 'hsl(38, 40%, 22%)',
      shade: 'hsl(38, 46%, 10%)',
    },
  },
  {
    id: 'bordeaux-rose',
    name: 'Bordeaux Rose',
    tagline: 'Exhibition Salon Burgundy',
    description: 'Understated crimson-wine single hue (348°). Designed for high-end design ateliers, dramatic tactile contrast, and curated gallery vernissages.',
    category: 'Atelier',
    hue: 348,
    saturation: 30,
    previewColor: 'hsl(348, 30%, 42%)',
    swatches: {
      tint: 'hsl(348, 32%, 96%)',
      lightTone: 'hsl(348, 22%, 86%)',
      brand: 'hsl(348, 34%, 38%)',
      darkTone: 'hsl(348, 38%, 22%)',
      shade: 'hsl(348, 44%, 10%)',
    },
  },
];

export const DEFAULT_MONOCHROMATIC_THEME = 'nordic-slate';

export const getMonochromaticTheme = (id: string): MonochromaticTheme => {
  return MONOCHROMATIC_PALETTES.find((p) => p.id === id) || MONOCHROMATIC_PALETTES[0];
};

/**
 * Applies the monochromatic theme to document root by computing
 * pure tints, tones, and shades of the single designated hue.
 */
export const applyMonochromaticTheme = (themeId: string, isDark: boolean): void => {
  const theme = getMonochromaticTheme(themeId);
  const root = document.documentElement;
  const h = theme.hue;
  const s = theme.saturation;

  root.setAttribute('data-mono-theme', theme.id);
  root.style.setProperty('--mono-h', `${h}`);
  root.style.setProperty('--mono-s', `${s}%`);

  if (!isDark) {
    // ── LIGHT MODE: High-key tints and rich shade typography ──
    root.style.setProperty('--mono-50',  `hsl(${h}, ${Math.min(s + 5, 100)}%, 98.5%)`);
    root.style.setProperty('--mono-100', `hsl(${h}, ${s}%, 95.5%)`);
    root.style.setProperty('--mono-150', `hsl(${h}, ${s}%, 92.5%)`);
    root.style.setProperty('--mono-200', `hsl(${h}, ${Math.max(s - 4, 1)}%, 86.5%)`);
    root.style.setProperty('--mono-300', `hsl(${h}, ${Math.max(s - 6, 1)}%, 74%)`);
    root.style.setProperty('--mono-400', `hsl(${h}, ${Math.max(s - 8, 1)}%, 56%)`);
    root.style.setProperty('--mono-500', `hsl(${h}, ${s}%, 42%)`);
    root.style.setProperty('--mono-600', `hsl(${h}, ${Math.min(s + 6, 100)}%, 32%)`);
    root.style.setProperty('--mono-700', `hsl(${h}, ${Math.min(s + 10, 100)}%, 22%)`);
    root.style.setProperty('--mono-800', `hsl(${h}, ${Math.min(s + 12, 100)}%, 14%)`);
    root.style.setProperty('--mono-900', `hsl(${h}, ${Math.min(s + 14, 100)}%, 8%)`);

    root.style.setProperty('--bg-primary',   `hsl(${h}, ${Math.min(s + 5, 100)}%, 98.5%)`);
    root.style.setProperty('--bg-secondary', `hsl(${h}, ${s}%, 95.5%)`);
    root.style.setProperty('--bg-surface',   `hsl(${h}, ${Math.min(s + 2, 100)}%, 97.5%)`);
    root.style.setProperty('--text-primary', `hsl(${h}, ${Math.min(s + 12, 100)}%, 14%)`);
    root.style.setProperty('--text-muted',   `hsl(${h}, ${Math.max(s - 8, 1)}%, 52%)`);
    root.style.setProperty('--border-color', `hsl(${h}, ${Math.max(s - 4, 1)}%, 86.5%)`);
    root.style.setProperty('--border-subtle',`hsl(${h}, ${Math.max(s - 5, 1)}%, 91%)`);

    root.style.setProperty('--brand',        `hsl(${h}, ${Math.min(s + 12, 100)}%, 34%)`);
    root.style.setProperty('--brand-hover',  `hsl(${h}, ${Math.min(s + 16, 100)}%, 24%)`);
    root.style.setProperty('--brand-light',  `hsl(${h}, ${Math.min(s + 10, 100)}%, 92%)`);
    root.style.setProperty('--brand-subtle', `hsl(${h}, ${Math.max(s - 2, 1)}%, 96%)`);
    root.style.setProperty('--shadow-color', `hsla(${h}, ${s}%, 12%, 0.06)`);
  } else {
    // ── DARK MODE: Deep shades and luminous tint typography ──
    root.style.setProperty('--mono-50',  `hsl(${h}, ${Math.min(s + 30, 100)}%, 88%)`);
    root.style.setProperty('--mono-100', `hsl(${h}, ${Math.min(s + 20, 100)}%, 76%)`);
    root.style.setProperty('--mono-150', `hsl(${h}, ${Math.min(s + 12, 100)}%, 62%)`);
    root.style.setProperty('--mono-200', `hsl(${h}, ${s}%, 46%)`);
    root.style.setProperty('--mono-300', `hsl(${h}, ${Math.max(s - 4, 1)}%, 32%)`);
    root.style.setProperty('--mono-400', `hsl(${h}, ${Math.max(s - 6, 1)}%, 23%)`);
    root.style.setProperty('--mono-500', `hsl(${h}, ${Math.max(s - 6, 1)}%, 17%)`);
    root.style.setProperty('--mono-600', `hsl(${h}, ${Math.max(s - 8, 1)}%, 13%)`);
    root.style.setProperty('--mono-700', `hsl(${h}, ${Math.max(s - 8, 1)}%, 9.5%)`);
    root.style.setProperty('--mono-800', `hsl(${h}, ${Math.max(s - 10, 1)}%, 6.5%)`);
    root.style.setProperty('--mono-900', `hsl(${h}, ${Math.max(s - 12, 1)}%, 4%)`);

    root.style.setProperty('--bg-primary',   '#050605');
    root.style.setProperty('--bg-secondary', '#0b0d0c');
    root.style.setProperty('--bg-surface',   'rgba(255, 255, 255, 0.04)');
    root.style.setProperty('--text-primary', 'rgba(255, 255, 255, 0.92)');
    root.style.setProperty('--text-muted',   'rgba(255, 255, 255, 0.46)');
    root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
    root.style.setProperty('--border-subtle','rgba(255, 255, 255, 0.06)');

    root.style.setProperty('--brand',        '#9fe870');
    root.style.setProperty('--brand-hover',  '#c9f7ae');
    root.style.setProperty('--brand-light',  'rgba(159, 232, 112, 0.2)');
    root.style.setProperty('--brand-subtle', 'rgba(159, 232, 112, 0.08)');
    root.style.setProperty('--shadow-color', `hsla(0, 0%, 0%, 0.35)`);
  }
};
