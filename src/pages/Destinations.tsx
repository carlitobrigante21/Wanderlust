import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import Card, { CardDestination } from '../components/Card';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Modal, { ModalDestination } from '../components/Modal';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../services/api';
import type { Destination } from '../types';

const Destinations = (): JSX.Element => {
  const { t } = useLanguage();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<ModalDestination | null>(null);

  useEffect(() => {
    const loadDestinations = async (): Promise<void> => {
      try {
        setLoading(true);
        const data = await apiService.getDestinations(12);
        setDestinations(data);
      } catch {
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };

    void loadDestinations();
  }, [t]);

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    if (!normalizedQuery) {
      return destinations;
    }

    return destinations.filter((destination) => {
      const haystack = `${destination.title} ${destination.country} ${destination.region} ${destination.description}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [destinations, search]);

  const cardDestinations: CardDestination[] = filteredDestinations.map((destination) => ({
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
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">{t('destinations')}</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{t('discover')}</h1>
          </div>
          <label className="flex w-full max-w-xl items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('search')}
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
        </div>

        {loading && <LoadingSkeleton count={6} />}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-6 text-sm text-slate-500 dark:text-slate-400">
              {filteredDestinations.length} {t('destinations').toLowerCase()}
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {cardDestinations.map((destination) => (
                <Card key={destination.id} destination={destination} onQuickView={setSelectedDestination} />
              ))}
            </div>
          </>
        )}

        {!loading && !error && filteredDestinations.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            {t('noResults')}
          </div>
        )}
      </section>

      <Modal isOpen={Boolean(selectedDestination)} onClose={() => setSelectedDestination(null)} destination={selectedDestination} />
    </main>
  );
};

export default Destinations;
