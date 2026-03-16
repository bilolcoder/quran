import React, { useEffect, useState } from 'react';
import { fetchChapters } from '../utils/api';
import SurahCard from '../components/SurahCard';
import PrayerDashboard from '../components/PrayerDashboard';
import { Loader2, Search } from 'lucide-react';

const Home = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getSurahs = async () => {
      try {
        const data = await fetchChapters();
        setSurahs(data);
      } catch (error) {
        console.error("Error fetching surahs:", error);
      } finally {
        setLoading(false);
      }
    };
    getSurahs();
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.translated_name.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Prayer Dashboard Section */}
      <PrayerDashboard />

      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Suralar
            </h1>
            <p className="text-slate-400">
              Qur'oni Karim suralarini o'qing va o'rganing.
            </p>
          </div>

          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              placeholder="Sura qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-slate-200 placeholder:text-slate-500"
            />
          </div>
        </div>
      </header>

      {filteredSurahs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurahs.map((surah) => (
            <SurahCard key={surah.id} surah={surah} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
          <p className="text-slate-400 italic">Qidiruv bo'yicha suralar topilmadi...</p>
        </div>
      )}
    </div>
  );
};

export default Home;
