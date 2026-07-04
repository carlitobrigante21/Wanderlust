import { useEffect, useState } from 'react';
import { Compass, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

import Card, { CardDestination } from '../components/Card';
import Modal, { ModalDestination } from '../components/Modal';
import { useLanguage } from '../context/LanguageContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { apiService } from '../services/api';
import type { Destination } from '../types';

const SavedTrips = (): JSX.Element => {
  const { t } = useLanguage();
  const [savedIds] = useLocalStorage<number[]>('wanderlust-saved', []);
  const [savedDestinations, setSavedDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<ModalDestination | null>(null);

  useEffect(() => {
    const loadSavedDestinations = async (): Promise<void> => {
      try {
        setLoading(true);
        const allDestinations = await apiService.getDestinations(20);
        const filtered = allDestinations.filter((destination) => savedIds.includes(destination.id));
        setSavedDestinations(filtered);
      } catch {
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };

    void loadSavedDestinations();
  }, [savedIds, t]);

  const cardDestinations: CardDestination[] = savedDestinations.map((destination) => ({
    id: destination.id,
    title: destination.title,
    description: destination.description,
    image: destination.image,
    location: `${destination.country} • ${destination.region}`,
    rating: destination.rating,
  }));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">{t('saved')}</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{t('bookmarks')}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{t('saveTrip')}</p>
        </div>

        {loading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-[1.5rem] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="h-40 rounded-[1.25rem] bg-slate-200 dark:bg-slate-800" />
                <div className="mt-4 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-2 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        {!loading && !error && savedDestinations.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
              <HeartHandshake size={28} />
            </div>
            <h2 className="mt-6 text-xl font-semibold">{t('emptyStateTitle')}</h2>
            <p className="mx-auto mt-3 max-w-md text-slate-500 dark:text-slate-400">{t('emptyStateDescription')}</p>
            <Link
              to="/destinations"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              <Compass size={16} />
              {t('discoverPlaces')}
            </Link>
          </div>
        )}

        {!loading && !error && savedDestinations.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cardDestinations.map((destination) => (
              <Card key={destination.id} destination={destination} onQuickView={setSelectedDestination} />
            ))}
          </div>
        )}
      </section>

      <Modal isOpen={Boolean(selectedDestination)} onClose={() => setSelectedDestination(null)} destination={selectedDestination} />
    </main>
  );
};

export default SavedTrips;
