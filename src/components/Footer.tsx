import { useContext } from 'react';
import { Compass, Mail, MapPin } from 'lucide-react';

import LanguageContext from '../context/LanguageContext';

const Footer = (): JSX.Element => {
  const { t } = useContext(LanguageContext);

  return (
    <footer className="border-t border-slate-200 bg-white/80 py-8 text-slate-700 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
            <Compass size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Wanderlust</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('discover')}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-emerald-500" />
            <span>{t('destinations')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-emerald-500" />
            <span>{t('contact')}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-3 border-t border-slate-200 px-4 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} Wanderlust. {t('copyright')}</p>
        <p>{t('info')}</p>
      </div>
    </footer>
  );
};

export default Footer;
