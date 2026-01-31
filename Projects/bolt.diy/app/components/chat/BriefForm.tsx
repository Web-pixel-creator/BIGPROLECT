/**
 * BriefForm - Simple form for non-technical users to create website briefs
 * Converts structured input into a Brief object for PromptGenerator
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from '@remix-run/react';
import { classNames } from '~/utils/classNames';
import type { Brief, SiteType, DesignStyle } from '~/lib/services/enhancedPromptGenerator';
import { resolveBriefSeed } from '~/lib/services/brief-utils';
import { analyzeScreenshots } from '~/lib/services/screenshotAnalyzer';
import type { ProviderInfo } from '~/types/model';
import FilePreview from './FilePreview';

type Locale = 'en' | 'ru';

interface BriefFormProps {
  onSubmit: (brief: Brief) => Promise<void> | void;
  isLoading?: boolean;
  className?: string;
  model?: string;
  provider?: ProviderInfo;
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

const MAX_SCREENSHOTS = 3;

export function BriefForm({ onSubmit, isLoading = false, className, model, provider }: BriefFormProps) {
  const [searchParams] = useSearchParams();
  const [locale, setLocale] = useState<Locale>('en');
  const [siteType, setSiteType] = useState<SiteType>('landing');
  const [theme, setTheme] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState('');
  const [style, setStyle] = useState<DesignStyle>('modern');
  const [wishes, setWishes] = useState('');
  const [lockDesign, setLockDesign] = useState(false);
  const [lockedSeed, setLockedSeed] = useState<number | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'error' | 'success'>('idle');
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);
  const [analysisFallbackProvider, setAnalysisFallbackProvider] = useState<string | null>(null);
  const [analysisFallbackModel, setAnalysisFallbackModel] = useState<string | null>(null);
  const screenshotInputRef = useRef<HTMLInputElement | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const browserLang = typeof navigator !== 'undefined' ? navigator.language : '';
    setLocale(browserLang?.startsWith('ru') ? 'ru' : 'en');
  }, []);

  useEffect(() => {
    if (screenshotPreviews.length === 0) {
      setAnalysisStatus('idle');
      setAnalysisMessage(null);
      setAnalysisFallbackProvider(null);
      setAnalysisFallbackModel(null);
    }
  }, [screenshotPreviews.length]);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    const hasParams = [
      'theme',
      'type',
      'style',
      'colors',
      'wishes',
      'seed',
      'lock',
    ].some((key) => searchParams.get(key));

    if (!hasParams) {
      return;
    }

    initializedRef.current = true;

    const themeParam = searchParams.get('theme');
    const typeParam = searchParams.get('type');
    const styleParam = searchParams.get('style');
    const colorsParam = searchParams.get('colors');
    const wishesParam = searchParams.get('wishes');
    const seedParam = searchParams.get('seed');
    const lockParam = searchParams.get('lock');

    if (themeParam) {
      setTheme(themeParam.trim());
    }

    if (typeParam && SITE_TYPES.some((item) => item.value === typeParam)) {
      setSiteType(typeParam as SiteType);
    }

    if (styleParam && DESIGN_STYLES.some((item) => item.value === styleParam)) {
      setStyle(styleParam as DesignStyle);
    }

    if (colorsParam) {
      const parsedColors = colorsParam
        .split(',')
        .map((color) => color.trim())
        .filter((color) => /^#[0-9A-Fa-f]{6}$/.test(color))
        .slice(0, 3);

      if (parsedColors.length > 0) {
        setSelectedColors(parsedColors);
      }
    }

    if (wishesParam) {
      setWishes(wishesParam.trim());
    }

    const numericSeed = seedParam ? Number(seedParam) : NaN;
    const shouldLock = lockParam === '1' || lockParam === 'true' || Number.isFinite(numericSeed);

    if (shouldLock) {
      setLockDesign(true);
      if (Number.isFinite(numericSeed)) {
        setLockedSeed(numericSeed);
      }
    }
  }, [searchParams]);

  const t = useCallback((en: string, ru: string) => locale === 'ru' ? ru : en, [locale]);
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

  const readFileAsDataUrl = useCallback((file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  const addScreenshots = useCallback(
    async (files: FileList | File[]) => {
      const incoming = Array.from(files).filter((file) => file.type.startsWith('image/'));
      if (incoming.length === 0) {
        return;
      }

      const availableSlots = Math.max(0, MAX_SCREENSHOTS - screenshotFiles.length);
      const selected = incoming.slice(0, availableSlots);

      if (selected.length === 0) {
        return;
      }

      try {
        const previews = await Promise.all(selected.map(readFileAsDataUrl));
        setAnalysisStatus('idle');
        setAnalysisMessage(null);
        setAnalysisFallbackProvider(null);
        setAnalysisFallbackModel(null);
        setScreenshotFiles((prev) => [...prev, ...selected]);
        setScreenshotPreviews((prev) => [...prev, ...previews]);
      } catch (error) {
        console.warn('Failed to read screenshot files', error);
      }
    },
    [readFileAsDataUrl, screenshotFiles.length],
  );

  const handleScreenshotChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        void addScreenshots(event.target.files);
      }

      event.target.value = '';
    },
    [addScreenshots],
  );

  const handleRemoveScreenshot = useCallback((index: number) => {
    setAnalysisStatus('idle');
    setAnalysisMessage(null);
    setAnalysisFallbackProvider(null);
    setAnalysisFallbackModel(null);
    setScreenshotFiles((prev) => prev.filter((_, i) => i !== index));
    setScreenshotPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!theme.trim()) {
      return;
    }

    const { seed, nextLockedSeed } = resolveBriefSeed({
      lockDesign,
      lockedSeed,
    });

    if (lockedSeed !== nextLockedSeed) {
      setLockedSeed(nextLockedSeed);
    }

    let screenshotAnalysis: Brief['screenshotAnalysis'] | undefined;

    if (screenshotPreviews.length > 0) {
      setAnalysisStatus('analyzing');
      setAnalysisMessage(null);
      setAnalysisFallbackProvider(null);
      setAnalysisFallbackModel(null);

      const analysisResult = await analyzeScreenshots({
        images: screenshotPreviews,
        model,
        provider,
      });

      if (analysisResult.analysis) {
        screenshotAnalysis = analysisResult.analysis;
        setAnalysisStatus('success');
        if (analysisResult.fallbackProvider || analysisResult.fallbackModel) {
          setAnalysisFallbackProvider(analysisResult.fallbackProvider ?? null);
          setAnalysisFallbackModel(analysisResult.fallbackModel ?? null);
        }
      } else {
        setAnalysisStatus('error');
        setAnalysisMessage(
          t(
            'Could not analyze screenshots. Continuing without them.',
            '\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0430\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B. \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u043C \u0431\u0435\u0437 \u043D\u0438\u0445.',
          ),
        );
      }
    } else {
      setAnalysisStatus('idle');
      setAnalysisMessage(null);
      setAnalysisFallbackProvider(null);
      setAnalysisFallbackModel(null);
    }

    const brief: Brief = {
      type: siteType,
      theme: theme.trim(),
      colors: selectedColors,
      style,
      wishes: wishes.trim() || undefined,
      seed,
      screenshotAnalysis,
    };

    await onSubmit(brief);
  }, [
    siteType,
    theme,
    selectedColors,
    style,
    wishes,
    lockDesign,
    lockedSeed,
    screenshotPreviews,
    model,
    provider,
    onSubmit,
    t,
  ]);

  const buildShareUrl = useCallback(
    (seedValue: number | null) => {
      if (typeof window === 'undefined') {
        return '';
      }

      const url = new URL(window.location.href);
      url.searchParams.set('theme', theme.trim());
      url.searchParams.set('type', siteType);
      url.searchParams.set('style', style);
      url.searchParams.set('lock', lockDesign ? '1' : '0');

      if (selectedColors.length > 0) {
        url.searchParams.set('colors', selectedColors.join(','));
      } else {
        url.searchParams.delete('colors');
      }

      if (wishes.trim()) {
        url.searchParams.set('wishes', wishes.trim());
      } else {
        url.searchParams.delete('wishes');
      }

      if (lockDesign && seedValue !== null) {
        url.searchParams.set('seed', seedValue.toString());
      } else {
        url.searchParams.delete('seed');
      }

      return url.toString();
    },
    [theme, siteType, style, lockDesign, selectedColors, wishes],
  );

  const handleCopyShareLink = useCallback(async () => {
    let seedValue = lockedSeed;

    if (lockDesign && seedValue === null) {
      seedValue = Date.now();
      setLockedSeed(seedValue);
    }

    const url = buildShareUrl(seedValue);

    if (!url) {
      return;
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
        return;
      }
    } catch {
      // fallback below
    }

    window.prompt('Copy this link', url);
  }, [buildShareUrl, lockDesign, lockedSeed]);

  const isValid = theme.trim().length > 0;
  const isBusy = isLoading || analysisStatus === 'analyzing';

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
          {t('Create Your Website', '\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0441\u0432\u043E\u0439 \u0441\u0430\u0439\u0442')}
        </h2>
        <p className="text-bolt-elements-textSecondary text-sm">
          {t(
            'Fill in the details and we\'ll generate a professional website for you',
            '\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0434\u0430\u043D\u043D\u044B\u0435, \u0438 \u043C\u044B \u0441\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0435\u043C \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0430\u0439\u0442'
          )}
        </p>
      </div>

      {/* Site Type */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-bolt-elements-textPrimary">
          {t('Website Type', '\u0422\u0438\u043F \u0441\u0430\u0439\u0442\u0430')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {SITE_TYPES.map(({ value, label, labelRu }) => (
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
              {locale === 'ru' ? labelRu : label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme/Niche */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-bolt-elements-textPrimary">
          {t('Business Theme / Niche *', '\u0422\u0435\u043C\u0430 / \u041D\u0438\u0448\u0430 *')}
        </label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder={t(
            'e.g., furniture store, medical clinic, photography studio...',
            '\u043D\u0430\u043F\u0440., \u043C\u0435\u0431\u0435\u043B\u044C\u043D\u044B\u0439 \u043C\u0430\u0433\u0430\u0437\u0438\u043D, \u043A\u043B\u0438\u043D\u0438\u043A\u0430, \u0444\u043E\u0442\u043E\u0441\u0442\u0443\u0434\u0438\u044F...'
          )}
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
          {t('Design Style', '\u0421\u0442\u0438\u043B\u044C \u0434\u0438\u0437\u0430\u0439\u043D\u0430')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DESIGN_STYLES.map(({ value, label, labelRu, icon }) => (
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
              {locale === 'ru' ? labelRu : label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-bolt-elements-textPrimary">
          {t('Brand Colors (optional, up to 3)', '\u0426\u0432\u0435\u0442\u0430 \u0431\u0440\u0435\u043D\u0434\u0430 (\u043D\u0435\u043E\u0431\u044F\u0437., \u0434\u043E 3)')}
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
              {t('Add', '\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C')}
            </button>
          </div>
        </div>
        {selectedColors.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-bolt-elements-textTertiary">{t('Selected:', '\u0412\u044B\u0431\u0440\u0430\u043D\u043E:')}</span>
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

      {/* Reference Screenshots */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-bolt-elements-textPrimary">
          {t('Reference Screenshots (optional)', '\u0420\u0435\u0444\u0435\u0440\u0435\u043D\u0441\u044B (\u043D\u0435\u043E\u0431\u044F\u0437.)')}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={screenshotInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleScreenshotChange}
          />
          <button
            type="button"
            onClick={() => screenshotInputRef.current?.click()}
            className={classNames(
              'px-3 py-2 rounded-lg text-sm font-medium transition-all',
              'bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary',
              'border border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive'
            )}
          >
            {t('Upload screenshots', '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B')}
          </button>
          <span className="text-xs text-bolt-elements-textTertiary">
            {t('Up to 3 images', '\u0414\u043E 3 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439')}
          </span>
        </div>
        <FilePreview files={screenshotFiles} imageDataList={screenshotPreviews} onRemove={handleRemoveScreenshot} />
        {analysisStatus === 'analyzing' && (
          <p className="text-xs text-bolt-elements-textTertiary">
            {t('Analyzing screenshots...', '\u0410\u043D\u0430\u043B\u0438\u0437 \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u043E\u0432...')}
          </p>
        )}
        {analysisStatus === 'error' && analysisMessage && (
          <p className="text-xs text-amber-500">{analysisMessage}</p>
        )}
        {analysisStatus === 'success' && (analysisFallbackProvider || analysisFallbackModel) && (
          <div
            className={classNames(
              'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs',
              'bg-bolt-elements-background-depth-3 border-bolt-elements-borderColor text-bolt-elements-textSecondary',
            )}
          >
            <span className="i-ph:info text-xs" />
            <span>
              {t(
                `Fallback model used: ${analysisFallbackProvider ?? 'Unknown'}${analysisFallbackModel ? ` / ${analysisFallbackModel}` : ''}`,
                `Использован fallback: ${analysisFallbackProvider ?? '\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439'}${analysisFallbackModel ? ` / ${analysisFallbackModel}` : ''}`,
              )}
            </span>
          </div>
        )}
      </div>

      {/* Additional Wishes */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-bolt-elements-textPrimary">
          {t('Additional Requirements (optional)', '\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F (\u043D\u0435\u043E\u0431\u044F\u0437.)')}
        </label>
        <textarea
          value={wishes}
          onChange={(e) => setWishes(e.target.value)}
          placeholder={t(
            'Any specific features, sections, or requirements...',
            '\u041B\u044E\u0431\u044B\u0435 \u043E\u0441\u043E\u0431\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438, \u0441\u0435\u043A\u0446\u0438\u0438 \u0438\u043B\u0438 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F...'
          )}
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

      {/* Lock Design */}
      <label className="flex items-center gap-3 text-sm text-bolt-elements-textSecondary">
        <input
          type="checkbox"
          checked={lockDesign}
          onChange={(e) => {
            const nextValue = e.target.checked;
            setLockDesign(nextValue);
            if (!nextValue) {
              setLockedSeed(null);
            }
            if (nextValue && lockedSeed === null) {
              setLockedSeed(Date.now());
            }
          }}
          className="h-4 w-4 rounded border-bolt-elements-borderColor text-bolt-elements-button-primary-background focus:ring-bolt-elements-button-primary-background"
        />
        <span>
          {t('Lock design (repeatable result)', '\u0417\u0430\u0444\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0434\u0438\u0437\u0430\u0439\u043D (\u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u043C\u044B\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442)')}
        </span>
      </label>
      {lockDesign && lockedSeed !== null && (
        <div className="flex items-center justify-between rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-3 px-3 py-2 text-xs text-bolt-elements-textSecondary">
          <span>{t(`Seed: ${lockedSeed}`, `Seed: ${lockedSeed}`)}</span>
          <button
            type="button"
            onClick={handleCopyShareLink}
            className={classNames(
              'px-2 py-1 rounded-md border text-xs font-medium transition-all',
              shareCopied
                ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text border-transparent'
                : 'bg-transparent text-bolt-elements-textSecondary border-bolt-elements-borderColor hover:border-bolt-elements-borderColorActive',
            )}
          >
            {shareCopied
              ? t('Copied', '\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E')
              : t('Copy share link', '\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443')}
          </button>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || isBusy}
        className={classNames(
          'w-full py-3 px-4 rounded-lg font-medium text-base transition-all',
          'flex items-center justify-center gap-2',
          isValid && !isBusy
            ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover'
            : 'bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text opacity-50 cursor-not-allowed'
        )}
      >
        {isBusy ? (
          <>
            <span className="i-svg-spinners:90-ring-with-bg" />
            {analysisStatus === 'analyzing'
              ? t('Analyzing references...', '\u0410\u043D\u0430\u043B\u0438\u0437 \u0440\u0435\u0444\u0435\u0440\u0435\u043D\u0441\u043E\u0432...')
              : t('Generating...', '\u0413\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F...')}
          </>
        ) : (
          <>
            <span className="i-ph:rocket-launch" />
            {t('Generate Website', '\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0430\u0439\u0442')}
          </>
        )}
      </button>
    </form>
  );
}
