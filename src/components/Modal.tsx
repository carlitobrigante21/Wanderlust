import { MapPin, Star, X } from 'lucide-react';
import { useEffect } from 'react';

import { useTheme } from '../context/ThemeContext';

export interface ModalDestination {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  rating: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: ModalDestination | null;
}

const Modal = ({ isOpen, onClose, destination }: ModalProps): JSX.Element | null => {
  const { theme } = useTheme();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !destination) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-3xl overflow-hidden rounded-3xl border shadow-2xl transition-all duration-300 ${
          theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
        } scale-100 opacity-100`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-72 overflow-hidden">
          <img src={destination.image} alt={destination.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-700 transition hover:scale-110"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {destination.title}
              </h3>
              <div className={`mt-2 flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                <MapPin size={16} />
                <span>{destination.location}</span>
              </div>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              <span className="mr-1 inline-flex items-center gap-1">
                <Star size={14} />
              </span>
              {destination.rating.toFixed(1)}
            </span>
          </div>

          <p className={`text-sm leading-7 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            {destination.description}
          </p>
          <p className={`text-sm leading-7 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            Discover the atmosphere, culture, and hidden experiences that make this destination truly special.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
