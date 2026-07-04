export type ThemeMode = 'light' | 'dark';

export type Language = 'EN' | 'KA';

export interface Destination {
  id: number;
  title: string;
  description: string;
  country: string;
  region: string;
  duration: string;
  rating: number;
  image: string;
  tags: string[];
  article: string;
  featured: boolean;
  isPopular: boolean;
}

export interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export interface LanguageState {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}
