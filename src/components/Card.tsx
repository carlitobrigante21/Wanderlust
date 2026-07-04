import { Heart, MapPin, Star } from 'lucide-react';
import { useContext } from 'react';

import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import useLocalStorage from '../hooks/useLocalStorage';

export interface CardDestination {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  rating: number;
}

interface CardProps {
  destination: CardDestination;
  onQuickView: (destination: CardDestination) => void;
}

const Card = ({ destination, onQuickView }: CardProps): JSX.Element => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [savedDestinations, setSavedDestinations] = useLocalStorage<number[]>('wanderlust-saved', []);

  const isSaved = savedDestinations.includes(destination.id);

  const toggleSaved = (): void => {
    setSavedDestinations((currentSaved) =>
      currentSaved.includes(destination.id)
        ? currentSaved.filter((id) => id !== destination.id)
        : [...currentSaved, destination.id],
    );
  };

  return (
    <article
      className={`group overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${
        theme === 'dark'
          ? 'border-slate-800 bg-slate-900 shadow-slate-950/40'
          : 'border-slate-200 bg-white shadow-slate-200/70'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        <button
          type="button"
          onClick={toggleSaved}
          className="absolute right-3 top-3 rounded-full border border-white/30 bg-white/80 p-2 text-amber-500 backdrop-blur transition hover:scale-110"
          aria-label={isSaved ? t('removeTrip') : t('saveTrip')}
        >
          {isSaved ? <Heart size={18} fill="currentColor" /> : <Heart size={18} />}
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {destination.title}
            </h3>
            <div className={`mt-1 flex items-center gap-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <MapPin size={14} />
              <span>{destination.location}</span>
            </div>
          </div>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            ★ {destination.rating.toFixed(1)}
          </span>
        </div>

        <p className={`text-sm leading-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
          {destination.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => onQuickView(destination)}
            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            {t('quickView')}
          </button>
          <div className={`flex items-center gap-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            <Star size={14} className="text-amber-400" />
            <span>{destination.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
