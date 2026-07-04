import { useState } from 'react';
import { Bookmark, Compass, Home, Menu, Moon, Sun, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = (): JSX.Element => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const linkClassName = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`;

  const closeMenu = (): void => setIsMenuOpen(false);

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="text-xl font-semibold tracking-tight" onClick={closeMenu}>
          Wanderlust
        </NavLink>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={linkClassName}>
            <Home size={16} />
            {t('navHome')}
          </NavLink>
          <NavLink to="/destinations" className={linkClassName}>
            <Compass size={16} />
            {t('navDestinations')}
          </NavLink>
          <NavLink to="/saved" className={linkClassName}>
            <Bookmark size={16} />
            {t('navSaved')}
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-full border border-slate-300 px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label={t('language')}
          >
            {language === 'EN' ? 'KA' : 'EN'}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-slate-300 p-2.5 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label={theme === 'light' ? t('darkMode') : t('lightMode')}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button
            type="button"
            className="rounded-full border border-slate-300 p-2.5 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 md:hidden"
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
          >
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink to="/" className={linkClassName} onClick={closeMenu}>
              <Home size={16} />
              {t('navHome')}
            </NavLink>
            <NavLink to="/destinations" className={linkClassName} onClick={closeMenu}>
              <Compass size={16} />
              {t('navDestinations')}
            </NavLink>
            <NavLink to="/saved" className={linkClassName} onClick={closeMenu}>
              <Bookmark size={16} />
              {t('navSaved')}
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
