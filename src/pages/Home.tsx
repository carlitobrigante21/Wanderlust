import { useEffect, useState } from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import Card, { CardDestination } from '../components/Card';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Modal, { ModalDestination } from '../components/Modal';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../services/api';
import type { Destination } from '../types';

const Home = (): JSX.Element => {
  const { t } = useLanguage();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<ModalDestination | null>(null);

  useEffect(() => {
    const loadDestinations = async (): Promise<void> => {
      try {
        setLoading(true);
        const data = await apiService.getDestinations(3);
        setDestinations(data);
      } catch {
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };

    void loadDestinations();
  }, [t]);

  const cardDestinations: CardDestination[] = destinations.map((destination) => ({
    id: destination.id,
    title: destination.title,
    description: destination.description,
    image: destination.image,
    location: `${destination.country} • ${destination.region}`,
    rating: destination.rating,
  }));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-900 shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <div
          className="relative flex min-h-[420px] flex-col justify-between bg-cover bg-center p-8 sm:p-10 lg:p-12"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(2,6,23,0.92), rgba(3,105,161,0.6)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-cyan-500/20" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90 backdrop-blur">
              <Sparkles size={16} />
              {t('featuredDestinations')}
            </div>
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{t('heroTitle')}</h1>
              <p className="max-w-xl text-lg text-slate-200">{t('heroSubtitle')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                {t('heroCta')}
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/saved"
                className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t('saved')}
              </Link>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-sm text-slate-200">
            <Compass size={16} />
            <span>Curated adventures for modern travelers</span>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-white/90 p-8 backdrop-blur dark:bg-slate-900/80 sm:p-10 lg:p-12">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">{t('quickView')}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{t('discover')}</h2>
          </div>
          {loading && <LoadingSkeleton count={3} />}

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-4 sm:grid-cols-3">
              {cardDestinations.map((destination) => (
                <Card key={destination.id} destination={destination} onQuickView={setSelectedDestination} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal isOpen={Boolean(selectedDestination)} onClose={() => setSelectedDestination(null)} destination={selectedDestination} />
    </main>
  );
};

export default Home;
