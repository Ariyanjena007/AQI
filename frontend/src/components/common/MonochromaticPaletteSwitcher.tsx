import React, { useState, useRef, useEffect } from 'react';
import {
  MONOCHROMATIC_PALETTES,
  MonochromaticTheme,
} from '../../services/monochromaticThemes';
import { Palette, Check, Sparkles, ChevronDown } from 'lucide-react';

interface MonochromaticPaletteSwitcherProps {
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
  variant?: 'compact' | 'full' | 'inline-badges';
}

export const MonochromaticPaletteSwitcher: React.FC<MonochromaticPaletteSwitcherProps> = ({
  currentThemeId,
  onSelectTheme,
  variant = 'compact',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTheme =
    MONOCHROMATIC_PALETTES.find((p) => p.id === currentThemeId) ||
    MONOCHROMATIC_PALETTES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (variant === 'full') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" style={{ color: 'var(--brand)' }} />
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Curated Monochromatic Palettes
            </h4>
          </div>
          <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
            Single-hue harmony · Tints, Tones & Shades
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {MONOCHROMATIC_PALETTES.map((theme) => {
            const isSelected = theme.id === currentThemeId;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSelectTheme(theme.id)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-200 group relative ${
                  isSelected
                    ? 'ring-2 shadow-sm'
                    : 'hover:border-opacity-100 opacity-90 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--brand-subtle)' : 'var(--bg-surface)',
                  borderColor: isSelected ? 'var(--brand)' : 'var(--border-color)',
                  // @ts-ignore
                  ringColor: 'var(--brand)',
                }}
              >
                {/* Header: Name and Category */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: theme.previewColor }}
                      />
                      <span
                        className="text-xs font-heading font-bold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {theme.name}
                      </span>
                    </div>
                    <span
                      className="text-[10px] font-mono tracking-tight block mt-0.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {theme.tagline}
                    </span>
                  </div>

                  {isSelected && (
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--brand)',
                        color: 'white',
                      }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* 5-Step Monochromatic Swatch Spectrum */}
                <div className="my-2.5">
                  <div className="h-4 w-full rounded-md overflow-hidden flex border" style={{ borderColor: 'var(--border-color)' }}>
                    <div
                      className="flex-1 h-full"
                      style={{ backgroundColor: theme.swatches.tint }}
                      title="Tint (High Light)"
                    />
                    <div
                      className="flex-1 h-full"
                      style={{ backgroundColor: theme.swatches.lightTone }}
                      title="Light Tone"
                    />
                    <div
                      className="flex-1 h-full"
                      style={{ backgroundColor: theme.swatches.brand }}
                      title="Brand Accent Tone"
                    />
                    <div
                      className="flex-1 h-full"
                      style={{ backgroundColor: theme.swatches.darkTone }}
                      title="Dark Tone"
                    />
                    <div
                      className="flex-1 h-full"
                      style={{ backgroundColor: theme.swatches.shade }}
                      title="Deep Shade"
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
                    <span>Tint (White+)</span>
                    <span>Tone (Gray+)</span>
                    <span>Shade (Black+)</span>
                  </div>
                </div>

                <p
                  className="text-[11px] leading-relaxed line-clamp-2 mt-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {theme.description}
                </p>

                {/* Metadata Pill */}
                <div className="mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] font-mono" style={{ borderColor: 'var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Hue: {theme.hue}° · Sat: {theme.saturation}%
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded uppercase font-semibold text-[9px]"
                    style={{
                      backgroundColor: 'var(--brand-light)',
                      color: 'var(--brand)',
                    }}
                  >
                    {theme.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Compact Variant (Top Navigation Bar)
  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all hover:opacity-90"
        style={{
          backgroundColor: 'var(--brand-subtle)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
        title="Switch Monochromatic Palette"
        aria-label="Monochromatic Palette Selector"
      >
        <span
          className="w-2.5 h-2.5 rounded-full border shadow-2xs flex-shrink-0"
          style={{
            backgroundColor: activeTheme.previewColor,
            borderColor: 'var(--border-color)',
          }}
        />
        <span className="hidden sm:inline font-medium text-[11px]">
          {activeTheme.name}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          style={{ color: 'var(--text-muted)' }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border shadow-xl z-50 p-2.5 animate-fade-up text-left"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 12px 30px var(--shadow-color)',
          }}
        >
          {/* Header */}
          <div
            className="px-2 py-1.5 border-b mb-2 flex items-center justify-between"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--brand)' }} />
              <span
                className="text-[11px] font-mono font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-primary)' }}
              >
                Monochromatic Spectrum
              </span>
            </div>
            <span
              className="text-[9px] font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              1 Hue · Strict Tones
            </span>
          </div>

          {/* List of palettes */}
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-0.5">
            {MONOCHROMATIC_PALETTES.map((theme) => {
              const isSelected = theme.id === currentThemeId;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    onSelectTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    isSelected
                      ? 'border font-medium'
                      : 'hover:opacity-90 border border-transparent'
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? 'var(--brand-light)'
                      : 'transparent',
                    borderColor: isSelected
                      ? 'var(--brand)'
                      : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0 border"
                      style={{
                        backgroundColor: theme.previewColor,
                        borderColor: 'var(--border-color)',
                      }}
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-xs font-semibold"
                          style={{
                            color: isSelected
                              ? 'var(--brand)'
                              : 'var(--text-primary)',
                          }}
                        >
                          {theme.name}
                        </span>
                        <span
                          className="text-[9px] font-mono px-1 py-0.2 rounded"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          {theme.hue}°
                        </span>
                      </div>
                      <span
                        className="text-[10px] block truncate"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {theme.tagline}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Micro 3-step swatch preview */}
                    <div className="flex rounded overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
                      <span className="w-2 h-3" style={{ backgroundColor: theme.swatches.tint }} />
                      <span className="w-2 h-3" style={{ backgroundColor: theme.swatches.brand }} />
                      <span className="w-2 h-3" style={{ backgroundColor: theme.swatches.shade }} />
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5" style={{ color: 'var(--brand)' }} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer explanation */}
          <div
            className="mt-2 pt-2 border-t px-2 text-[10px] font-mono text-center"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)',
            }}
          >
            All UI components calculate tints, tones & shades from the chosen hue.
          </div>
        </div>
      )}
    </div>
  );
};
