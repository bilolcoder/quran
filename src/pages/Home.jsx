import React, { useEffect, useState } from 'react';
import { fetchChapters } from '../utils/api';
import SurahCard from '../components/SurahCard';
import { Loader2 } from 'lucide-react';

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
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Qur'oni Karim
        </h1>
        <p className="text-slate-400">
          Qur'oni Karimni chiroyli va qulay interfeysda o'qing, o'rganing va tushuning.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurahs.map((surah) => (
          <SurahCard key={surah.id} surah={surah} />
        ))}
      </div>
    </div>
  );
};

export default Home;
