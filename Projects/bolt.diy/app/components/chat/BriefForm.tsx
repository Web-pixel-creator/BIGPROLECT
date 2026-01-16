/**
 * BriefForm - Simple form for non-technical users to create website briefs
 * Converts structured input into a Brief object for PromptGenerator
 */

import React, { useState, useCallback } from 'react';
import { classNames } from '~/utils/classNames';
import type { Brief, SiteType, DesignStyle } from '~/lib/services/promptGenerator';

interface BriefFormProps {
  onSubmit: (brief: Brief) => void;
  isLoading?: boolean;
  className?: string;
}

const SITE_TYPES: { value: SiteType; label: string; labelRu: string }[] = [
  { value: 'landing', label: 'Landing Page', labelRu: '\u041B\u0435\u043D\u0434\u0438\u043D\u0433' },
  { value: 'corporate', label: 'Corporate Website', labelRu: '\u041A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0441\u0430\u0439\u0442' },
  { value: 'ecommerce', label: 'E-commerce', labelRu: '\u0418\u043D\u0442\u0435\u0440\u043D\u0435\u0442-\u043C\u0430\u0433\u0430\u0437\u0438\u043D' },
  { value: 'portfolio', label: 'Portfolio', labelRu: '\u041F\u043E\u0440\u0442\u0444\u043E\u043B\u0438\u043E' },
  { value: 'blog', label: 'Blog', labelRu: '\u0411\u043B\u043E\u0433' },
];

const DESIGN_STYLES: { value: DesignStyle; label: string; labelRu: string; icon: string }[] = [
  { value: 'modern', label: 'Modern', labelRu: '\u0421\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0439', icon: 'i-ph:sparkle' },
  { value: 'minimal', label: 'Minimal', labelRu: '\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u0438\u0437\u043C', icon: 'i-ph:minus-circle' },
  { value: 'creative', label: 'Creative', labelRu: '\u041A\u0440\u0435\u0430\u0442\u0438\u0432\u043D\u044B\u0439', icon: 'i-ph:paint-brush' },
  { value: 'professional', label: 'Professional', labelRu: '\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439', icon: 'i-ph:briefcase' },
];

const PRESET_COLORS = [
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Indigo', hex: '#6366F1' },
];

export function BriefForm({ onSubmit, isLoading = false, className }: BriefFormProps) {
  const [siteType, setSiteType] = useState<SiteType>('landing');
  const [theme, setTheme] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState('');
  const [style, setStyle] = useState<DesignStyle>('modern');
  const [wishes, setWishes] = useState('');

  const handleColorToggle = useCallback((hex: string) => {
    setSelectedColors(prev => {
      if (prev.includes(hex)) {
        return prev.filter(c => c !== hex);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), hex];
      }
      return [...prev, hex];
    });
  }, []);

  const handleAddCustomColor = useCallback(() => {
    if (customColor && /^#[0-9A-Fa-f]{6}$/.test(customColor)) {
      if (!selectedColors.includes(customColor) && selectedColors.length < 3) {
        setSelectedColors(prev => [...prev, customColor]);
      }
      setCustomColor('');
    }
  }, [customColor, selectedColors]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!theme.trim()) {
      return;
    }

    const brief: Brief = {
      type: siteType,
      theme: theme.trim(),
      colors: selectedColors,
      style,
      wishes: wishes.trim() || undefined,
    };

    onSubmit(brief);
  }, [siteType, theme, selectedColors, style, wishes, onSubmit]);

  const isValid = theme.trim().length > 0;

  return (
    <form 
      onSubmit={handleSubmit}
      className={classNames(
        'flex flex-col gap-6 p-6 rounded-xl',
        'bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor',
        className
      )}
    >
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-bolt-elements-textPrimary mb-2">
          Create Your Website
        </h2>
        <p className="text-bolt-elements-textSecondary text-sm">
          Fill in the details and we'll generate a professional website for you
        </p>
      </div>

      {/* Site Type */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-bolt-elements-textPrimary">
          Website Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {SITE_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSiteType(value)}
              className={classNames(
                'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                'border',
                siteType === value
                  ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text border-transparent'
                  : 'bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme/Niche */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-bolt-elements-textPrimary">
          Business Theme / Niche *
        </label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="e.g., furniture store, medical clinic, photography studio..."
          className={classNames(
            'w-full px-4 py-3 rounded-lg text-sm',
            'bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary',
            'border border-bolt-elements-borderColor',
            'placeholder:text-bolt-elements-textTertiary',
            'focus:outline-none focus:border-bolt-elements-borderColorActive'
          )}
        />
      </div>

      {/* Design Style */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-bolt-elements-textPrimary">
          Design Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DESIGN_STYLES.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStyle(value)}
              className={classNames(
                'flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-all',
                'border',
                style === value
                  ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text border-transparent'
                  : 'bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive'
              )}
            >
              <span className={icon} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-bolt-elements-textPrimary">
          Brand Colors (optional, up to 3)
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map(({ name, hex }) => (
            <button
              key={hex}
              type="button"
              onClick={() => handleColorToggle(hex)}
              title={name}
              className={classNames(
                'w-8 h-8 rounded-full transition-all',
                'border-2',
                selectedColors.includes(hex)
                  ? 'border-white scale-110 shadow-lg'
                  : 'border-transparent hover:scale-105'
              )}
              style={{ backgroundColor: hex }}
            />
          ))}
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="#RRGGBB"
              className={classNames(
                'w-20 px-2 py-1 rounded text-xs',
                'bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary',
                'border border-bolt-elements-borderColor',
                'focus:outline-none focus:border-bolt-elements-borderColorActive'
              )}
            />
            <button
              type="button"
              onClick={handleAddCustomColor}
              disabled={!customColor || selectedColors.length >= 3}
              className={classNames(
                'px-2 py-1 rounded text-xs',
                'bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary',
                'border border-bolt-elements-borderColor',
                'hover:border-bolt-elements-borderColorActive',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              Add
            </button>
          </div>
        </div>
        {selectedColors.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-bolt-elements-textTertiary">Selected:</span>
            {selectedColors.map(hex => (
              <div
                key={hex}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-bolt-elements-background-depth-3"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: hex }}
                />
                <span className="text-xs text-bolt-elements-textSecondary">{hex}</span>
                <button
                  type="button"
                  onClick={() => handleColorToggle(hex)}
                  className="text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary"
                >
                  <span className="i-ph:x text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Wishes */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-bolt-elements-textPrimary">
          Additional Requirements (optional)
        </label>
        <textarea
          value={wishes}
          onChange={(e) => setWishes(e.target.value)}
          placeholder="Any specific features, sections, or requirements..."
          rows={3}
          className={classNames(
            'w-full px-4 py-3 rounded-lg text-sm resize-none',
            'bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary',
            'border border-bolt-elements-borderColor',
            'placeholder:text-bolt-elements-textTertiary',
            'focus:outline-none focus:border-bolt-elements-borderColorActive'
          )}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className={classNames(
          'w-full py-3 px-4 rounded-lg font-medium text-base transition-all',
          'flex items-center justify-center gap-2',
          isValid && !isLoading
            ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover'
            : 'bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text opacity-50 cursor-not-allowed'
        )}
      >
        {isLoading ? (
          <>
            <span className="i-svg-spinners:90-ring-with-bg" />
            Generating...
          </>
        ) : (
          <>
            <span className="i-ph:rocket-launch" />
            Generate Website
          </>
        )}
      </button>
    </form>
  );
}
