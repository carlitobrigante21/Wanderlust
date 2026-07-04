import { createContext, ReactNode, useContext, useMemo } from 'react';

import type { Language, LanguageState } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

const translations: Record<Language, Record<string, string>> = {
  EN: {
    home: 'Home',
    destinations: 'Destinations',
    saved: 'Saved',
    quickView: 'Quick View',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    search: 'Search destinations',
    explore: 'Explore',
    viewDetails: 'View Details',
    saveTrip: 'Save Trip',
    removeTrip: 'Remove',
    loading: 'Loading destinations...',
    error: 'Unable to load destinations.',
    noResults: 'No destinations found.',
    featured: 'Featured',
    popular: 'Popular',
    rating: 'Rating',
    duration: 'Duration',
    discover: 'Discover More',
    about: 'About',
    contact: 'Contact',
    language: 'Language',
    bookmarks: 'Bookmarks',
    emptySaved: 'No saved trips yet.',
    copyright: 'Crafted for your next escape.',
    info: 'Curated travel inspiration for modern explorers.',
    navHome: 'Home',
    heroTitle: 'Travel with wonder',
    heroSubtitle: 'Discover unforgettable escapes, culture, and scenic adventures.',
    heroCta: 'Explore destinations',
    featuredDestinations: 'Featured destinations',
    discoverPlaces: 'Discover Places',
    emptyStateTitle: 'Your travel list is empty',
    emptyStateDescription: 'Save a destination to keep your next great escape close at hand.',
    navDestinations: 'Destinations',
    navSaved: 'Saved',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  KA: {
    home: 'მთავარი',
    destinations: 'დანიშნულებები',
    saved: 'შენახული',
    quickView: 'სწრაფი გადახედვა',
    lightMode: 'ღია თემა',
    darkMode: 'მუქი თემა',
    search: 'მოძებნეთ დანიშნულებები',
    explore: 'აღმოაჩინე',
    viewDetails: 'დეტალების ნახვა',
    saveTrip: 'მოგზაურობის შენახვა',
    removeTrip: 'წაშლა',
    loading: 'დანიშნულებების ჩატვირთვა...',
    error: 'დანიშნულებების ჩატვირთვა ვერ მოხერხდა.',
    noResults: 'დანიშნულებები ვერ მოიძებნა.',
    featured: 'პოპულარული',
    popular: 'პოპულარული',
    rating: 'რეიტინგი',
    duration: 'ხანგრძლივობა',
    discover: 'მეტი გამოკვლევა',
    about: 'ჩვენს შესახებ',
    contact: 'კონტაქტი',
    language: 'ენა',
    bookmarks: 'სანიშნები',
    emptySaved: 'ჯერ არცერთი მოგზაურობა შენახული არ არის.',
    copyright: 'საბაჟო თქვენი შემდეგი თავგადასავლისთვის.',
    info: 'კურირებული მოგზაურობის შთაგონება თანამედროვე აღმოჩენებისთვის.',
    navHome: 'მთავარი',
    heroTitle: 'გაეცანით შთაგონებას',
    heroSubtitle: 'აღმოაჩინეთ დაუვიწყარი გასასვლელები, კულტურა და ლამაზი მოგზაურობები.',
    heroCta: 'დანიშნულებების დათვალიერება',
    featuredDestinations: 'გამორჩეული დანიშნულებები',
    discoverPlaces: 'ადგილების აღმოჩენა',
    emptyStateTitle: 'თქვენი მოგზაურობის სია ცარიელია',
    emptyStateDescription: 'შეინახეთ დანიშნულება და თქვენი შემდეგი დიდი თავგადასავალი ყოველთვის თქვენს ხელთა იქნება.',
    navDestinations: 'დანიშნულებები',
    navSaved: 'შენახული',
    openMenu: 'მენიუს გახსნა',
    closeMenu: 'მენიუს დახურვა',
  },
};

const defaultLanguageState: LanguageState = {
  language: 'EN',
  toggleLanguage: () => undefined,
  setLanguage: () => undefined,
  t: (key: string) => key,
};

const LanguageContext = createContext<LanguageState>(defaultLanguageState);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps): JSX.Element => {
  const [language, setLanguage] = useLocalStorage<Language>('wanderlust-language', 'EN');

  const toggleLanguage = (): void => {
    setLanguage((currentLanguage) => (currentLanguage === 'EN' ? 'KA' : 'EN'));
  };

  const t = (key: string): string => translations[language][key] ?? key;

  const value = useMemo<LanguageState>(
    () => ({
      language,
      toggleLanguage,
      setLanguage,
      t,
    }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageState => useContext(LanguageContext);

export default LanguageContext;
