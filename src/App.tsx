import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Destination {
  id: number;
  title: string;
  location: string;
  image: string;
  description: string;
  rating: number;
  featured: boolean;
}

type Language = 'en' | 'ka';
type Theme = 'light' | 'dark';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

interface SavedContextType {
  savedIds: number[];
  toggleSave: (id: number) => void;
  isSaved: (id: number) => boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const SavedContext = createContext<SavedContextType | undefined>(undefined);

const dictionary: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.destinations': 'Destinations',
    'nav.saved': 'Saved Trips',
    'hero.title': 'Discover Your Next Adventure',
    'hero.subtitle': 'Explore historic cities, breathtaking mountains, and peaceful beaches around the world.',
    'hero.cta': 'Explore Now',
    'home.featured': 'Featured Destinations',
    'search.placeholder': 'Search by destination or country...',
    'destinations.title': 'All Destinations',
    'saved.title': 'Your Bookmarked Trips',
    'saved.empty': 'Your saved list is empty.',
    'saved.cta': 'Discover Places',
    'card.quickView': 'Quick View',
    'card.save': 'Save',
    'card.saved': 'Saved',
    'modal.close': 'Close',
    'modal.rating': 'Rating',
    'footer.text': '© 2026 Wanderlust. All rights reserved.',
    'loading': 'Loading amazing destinations...',
    'error': 'Failed to load destinations. Please try again later.'
  },
  ka: {
    'nav.home': 'მთავარი',
    'nav.destinations': 'მიმართულებები',
    'nav.saved': 'შენახული',
    'hero.title': 'აღმოაჩინე შენი შემდეგი თავგადასავალი',
    'hero.subtitle': 'გამოიკვლიე ისტორიული ქალაქები, თვალწარმტაცი მთები და მშვიდი სანაპიროები მთელ მსოფლიოში.',
    'hero.cta': 'აღმოაჩინე ახლავე',
    'home.featured': 'რეკომენდებული მიმართულებები',
    'search.placeholder': 'მოძებნე ლოკაცია ან ქვეყანა...',
    'destinations.title': 'ყველა მიმართულება',
    'saved.title': 'შენი შენახული მოგზაურობები',
    'saved.empty': 'შენი შენახული სია ცარიელია.',
    'saved.cta': 'აღმოაჩინე ადგილები',
    'card.quickView': 'სწრაფი ნახვა',
    'card.save': 'შენახვა',
    'card.saved': 'შენახულია',
    'modal.close': 'დახურვა',
    'modal.rating': 'რეიტინგი',
    'footer.text': '© 2026 ვანდერლუსტი. ყველა უფლება დაცულია.',
    'loading': 'მიმართულებები იტვირთება...',
    'error': 'ვერ მოხერხდა ჩატვირთვა. გთხოვთ სცადოთ მოგვიანებით.'
  }
};

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

const mockDestinationsData: Omit<Destination, 'id' | 'title' | 'description'>[] = [
  { location: 'Tbilisi, Georgia', image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80', rating: 4.9, featured: true },
  { location: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', rating: 4.8, featured: true },
  { location: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', rating: 4.9, featured: true },
  { location: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80', rating: 4.7, featured: false },
  { location: 'Rome, Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', rating: 4.8, featured: false },
  { location: 'Reykjavik, Iceland', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80', rating: 4.9, featured: false },
  { location: 'Svaneti, Georgia', image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80', rating: 5.0, featured: true },
  { location: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', rating: 4.6, featured: false },
  { location: 'New York, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', rating: 4.7, featured: false },
  { location: 'Sydney, Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80', rating: 4.8, featured: false },
  { location: 'Cairo, Egypt', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80', rating: 4.5, featured: false },
  { location: 'Batumi, Georgia', image: 'https://images.unsplash.com/photo-1561361531-9952838b337a?auto=format&fit=crop&w=800&q=80', rating: 4.7, featured: false },
];

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('wanderlust_lang', 'en');
  const [theme, setTheme] = useLocalStorage<Theme>('wanderlust_theme', 'light');
  const [savedIds, setSavedIds] = useLocalStorage<number[]>('wanderlust_saved', []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'ka' : 'en'));
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const toggleSave = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((savedId) => savedId !== id) : [...prev, id]
    );
  };

  const isSaved = (id: number) => savedIds.includes(id);
  const t = (key: string) => dictionary[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <SavedContext.Provider value={{ savedIds, toggleSave, isSaved }}>
          {children}
        </SavedContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
};

const Navbar: React.FC = () => {
  const langCtx = useContext(LanguageContext);
  const themeCtx = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!langCtx || !themeCtx) return null;
  const { t, language, toggleLanguage } = langCtx;
  const { theme, toggleTheme } = themeCtx;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-wider text-blue-600 dark:text-blue-400">WANDERLUST</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">{t('nav.home')}</Link>
            <Link to="/destinations" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">{t('nav.destinations')}</Link>
            <Link to="/saved" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">{t('nav.saved')}</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleLanguage} className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              {language === 'en' ? '🇬🇪 KA' : '🇺🇸 EN'}
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M18.364 17.636l-.707-.707M6.364 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M18.364 17.636l-.707-.707M6.364 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </button>
            <button onClick={toggleLanguage} className="px-2 py-1 text-xs font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition">
              {language === 'en' ? 'KA' : 'EN'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition">
          <div className="flex flex-col space-y-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">{t('nav.home')}</Link>
            <Link to="/destinations" onClick={() => setIsOpen(false)} className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">{t('nav.destinations')}</Link>
            <Link to="/saved" onClick={() => setIsOpen(false)} className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">{t('nav.saved')}</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((id) => (
        <div key={id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md animate-pulse">
          <div className="h-56 bg-slate-200 dark:bg-slate-700 w-full" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-28" />
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface CardProps {
  destination: Destination;
  onQuickView: (destination: Destination) => void;
}

const Card: React.FC<CardProps> = ({ destination, onQuickView }) => {
  const langCtx = useContext(LanguageContext);
  const savedCtx = useContext(SavedContext);

  if (!langCtx || !savedCtx) return null;
  const { t } = langCtx;
  const { toggleSave, isSaved } = savedCtx;

  const saved = isSaved(destination.id);

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 dark:border-slate-800">
      <div className="relative h-56 overflow-hidden">
        <img src={destination.image} alt={destination.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1 shadow">
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{destination.rating.toFixed(1)}</span>
        </div>
        <button onClick={() => toggleSave(destination.id)} className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md text-red-500 hover:scale-110 transition active:scale-95">
          <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
      </div>
      <div className="p-6 space-y-2">
        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase">{destination.location}</p>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{destination.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{destination.description}</p>
        
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
          <button onClick={() => onQuickView(destination)} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            {t('card.quickView')} &rarr;
          </button>
          <button onClick={() => toggleSave(destination.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${saved ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}>
            {saved ? t('card.saved') : t('card.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, destination }) => {
  const langCtx = useContext(LanguageContext);
  if (!isOpen || !destination || !langCtx) return null;
  const { t } = langCtx;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 transition-all duration-300 transform scale-100">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/40 text-white hover:bg-slate-900/60 transition z-10">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="h-64 sm:h-80 relative">
          <img src={destination.image} alt={destination.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
            {destination.location}
          </div>
        </div>
        <div className="p-8 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{destination.title}</h2>
            <div className="flex items-center space-x-1.5 bg-amber-100 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/30">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="text-sm font-bold text-amber-800 dark:text-amber-400">{t('modal.rating')}: {destination.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">{destination.description}</p>
          <div className="pt-4 flex justify-end">
            <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-xl font-bold shadow-md transition-all">
              {t('modal.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const useFetchDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchTrips = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=12');
        if (active) {
          const loadedData = response.data.map((post: any, index: number) => {
            const staticMeta = mockDestinationsData[index % mockDestinationsData.length];
            const formattedTitle = post.title.split(' ').slice(0, 3).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            const formattedDesc = post.body.charAt(0).toUpperCase() + post.body.slice(1) + '.';
            return {
              id: post.id,
              title: formattedTitle,
              description: formattedDesc,
              ...staticMeta,
            };
          });
          setDestinations(loadedData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Axios Fetch Error, falling back to static model data:', err);
        if (active) {
          const backupData = mockDestinationsData.map((meta, i) => ({
            id: i + 1,
            title: ['Magical Svaneti', 'Charming Paris', 'Neon Tokyo', 'Glistening Santorini', 'Eternal Rome', 'Aurora Reykjavik', 'Scenic Mestia', 'Exotic Bali', 'Bright New York', 'Sunny Sydney', 'Historic Cairo', 'Coastal Batumi'][i % 12],
            description: 'Experience premium travel guided tours, luxury hospitality, and breathtaking landscapes tailored exactly for your ultimate vacation.',
            ...meta
          }));
          setDestinations(backupData);
          setLoading(false);
        }
      }
    };
    fetchTrips();
    return () => { active = false; };
  }, []);

  return { destinations, loading, error };
};

const Home: React.FC<{ onQuickView: (dest: Destination) => void }> = ({ onQuickView }) => {
  const langCtx = useContext(LanguageContext);
  const { destinations, loading, error } = useFetchDestinations();

  if (!langCtx) return null;
  const { t } = langCtx;

  const featuredDestinations = destinations.filter((dest) => dest.featured);

  return (
    <div className="space-y-16">
      <div className="relative rounded-3xl overflow-hidden h-[500px] sm:h-[600px] shadow-2xl flex items-center justify-center text-center px-4 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.7)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80')" }}>
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight uppercase drop-shadow-md">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 drop-shadow max-w-2xl mx-auto font-medium">
            {t('hero.subtitle')}
          </p>
          <div className="pt-4">
            <Link to="/destinations" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition-transform transform hover:scale-105 active:scale-95 text-lg">
              {t('hero.cta')}
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('home.featured')}</h2>
          <div className="h-1.5 w-20 bg-blue-600 dark:bg-blue-400 rounded-full" />
        </div>

        {error && <div className="p-4 bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-semibold rounded-xl text-center">{t('error')}</div>}
        
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((dest) => (
              <Card key={dest.id} destination={dest} onQuickView={onQuickView} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Destinations: React.FC<{ onQuickView: (dest: Destination) => void }> = ({ onQuickView }) => {
  const langCtx = useContext(LanguageContext);
  const [searchQuery, setSearchQuery] = useState('');
  const { destinations, loading, error } = useFetchDestinations();

  if (!langCtx) return null;
  const { t } = langCtx;

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('destinations.title')}</h2>
          <div className="h-1.5 w-20 bg-blue-600 dark:bg-blue-400 rounded-full" />
        </div>
        
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('search.placeholder')} className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition" />
        </div>
      </div>

      {error && <div className="p-4 bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-semibold rounded-xl text-center">{t('error')}</div>}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <Card key={dest.id} destination={dest} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </div>
  );
};

const SavedTrips: React.FC<{ onQuickView: (dest: Destination) => void }> = ({ onQuickView }) => {
  const langCtx = useContext(LanguageContext);
  const savedCtx = useContext(SavedContext);
  const { destinations, loading } = useFetchDestinations();
  const navigate = useNavigate();

  if (!langCtx || !savedCtx) return null;
  const { t } = langCtx;
  const { savedIds } = savedCtx;

  const savedDestinations = destinations.filter((dest) => savedIds.includes(dest.id));

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('saved.title')}</h2>
        <div className="h-1.5 w-20 bg-blue-600 dark:bg-blue-400 rounded-full" />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : savedDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedDestinations.map((dest) => (
            <Card key={dest.id} destination={dest} onQuickView={onQuickView} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex justify-center text-slate-300 dark:text-slate-600">
            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t('saved.empty')}</h3>
          </div>
          <button onClick={() => navigate('/destinations')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-transform transform hover:scale-105 active:scale-95">
            {t('saved.cta')}
          </button>
        </div>
      )}
    </div>
  );
};

const Footer: React.FC = () => {
  const langCtx = useContext(LanguageContext);
  if (!langCtx) return null;
  const { t } = langCtx;

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>{t('footer.text')}</p>
      </div>
    </footer>
  );
};

const AppLayout: React.FC = () => {
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = (dest: Destination) => {
    setSelectedDest(dest);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Routes>
          <Route path="/" element={<Home onQuickView={handleQuickView} />} />
          <Route path="/destinations" element={<Destinations onQuickView={handleQuickView} />} />
          <Route path="/saved" element={<SavedTrips onQuickView={handleQuickView} />} />
        </Routes>
      </main>
      <Footer />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} destination={selectedDest} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProviders>
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </AppProviders>
  );
};

export default App;
