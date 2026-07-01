import React, { createContext, ReactNode, useCallback, useContext, useMemo, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Language, translations } from './translations';
import { setLanguage as setLanguageAction } from '../store/languageSlice';
import { RootState } from '../store';

type TranslationParams = Record<string, string | number>;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: string, params?: TranslationParams) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const getNestedValue = (source: unknown, path: string): string | undefined => {
  const value = path.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object' && part in current) {
      return (current as Record<string, unknown>)[part];
    }

    return undefined;
  }, source);

  return typeof value === 'string' ? value : undefined;
};

const interpolate = (text: string, params?: TranslationParams) => {
  if (!params) {
    return text;
  }

  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, String(value)),
    text
  );
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.language.language);

  const setLanguage = useCallback(
    async (nextLanguage: Language) => {
      dispatch(setLanguageAction(nextLanguage));
    },
    [dispatch]
  );

  const t = useCallback(
    (key: string, params?: TranslationParams) => {
      const translated =
        getNestedValue(translations[language], key) ??
        getNestedValue(translations.en, key) ??
        key;

      return interpolate(translated, params);
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useTranslation must be used inside LanguageProvider');
  }

  return context;
};
