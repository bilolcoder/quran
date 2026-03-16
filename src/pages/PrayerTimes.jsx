import React, { useState, useEffect } from 'react';
import { fetchPrayerTimes } from '../utils/api';
import { Clock, MapPin, Loader2, RefreshCw } from 'lucide-react';

const PrayerTimes = () => {
  const [timings, setTimings] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activePrayer, setActivePrayer] = useState(null);
  const [countdown, setCountdown] = useState("");

  const prayerNamesUz = {
    Fajr: "Bomdod",
    Sunrise: "Quyosh",
    Dhuhr: "Peshin",
    Asr: "Asr",
    Maghrib: "Shom",
    Isha: "Xufton"
  };

  const prayerIcons = {
    Fajr: "🌅",
    Sunrise: "☀️",
    Dhuhr: "☀",
    Asr: "⛅",
    Maghrib: "🌇",
    Isha: "🌙"
  };

  const getTimes = async (lat, lon) => {
    setLoading(true);
    try {
      const data = await fetchPrayerTimes(lat, lon);
      setTimings(data.timings);
      setLocation(data.meta.timezone);
      setError(null);
    } catch (err) {
      setError("Namoz vaqtlarini yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getTimes(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError("Joylashuvni aniqlashga ruxsat berilmadi. Iltimos, ruxsat bering.");
          setLoading(false);
        }
      );
    } else {
      setError("Brauzeringiz joylashuvni aniqlashni qo'llab-quvvatlamaydi.");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!timings) return;

    const calculateActiveAndCountdown = () => {
      const now = new Date();
      const prayers = Object.entries(timings)
        .filter(([name]) => prayerNamesUz[name])
        .map(([name, time]) => {
          const [hours, minutes] = time.split(':').map(Number);
          const prayerDate = new Date();
          prayerDate.setHours(hours, minutes, 0, 0);
          return { name, date: prayerDate };
        });

      // Sort prayers chronologically
      prayers.sort((a, b) => a.date - b.date);

      let current = null;
      let next = null;

      for (let i = 0; i < prayers.length; i++) {
        if (now >= prayers[i].date) {
          current = prayers[i].name;
          next = prayers[i + 1] || { ...prayers[0], date: new Date(prayers[0].date.getTime() + 24 * 60 * 60 * 1000) };
        }
      }

      // If it's before the first prayer of the day yes
      if (!current) {
        current = "Isha"; // Theoretically still Isha from previous day
        next = prayers[0];
      }

      setActivePrayer(current);

      const diff = next.date - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    calculateActiveAndCountdown();
    const interval = setInterval(calculateActiveAndCountdown, 1000);
    return () => clearInterval(interval);
  }, [timings]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-slate-500 animate-pulse">Joylashuv aniqlanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold">
          <MapPin className="w-4 h-4" />
          {location || "Aniqlanmoqda..."}
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Namoz Vaqtlari</h1>
        <p className="text-slate-500">Bugun: {new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        
        {activePrayer && (
          <div className="p-6 bg-gradient-to-br from-primary-600 to-emerald-700 rounded-3xl text-white shadow-2xl shadow-primary-600/20">
            <p className="text-primary-100 text-sm font-bold uppercase tracking-widest mb-2">Hozirgi vaqt</p>
            <h2 className="text-3xl font-black mb-1">{prayerNamesUz[activePrayer]} vaqti</h2>
            <div className="text-5xl font-mono font-black mt-4">
              -{countdown}
            </div>
            <p className="text-primary-100 text-xs mt-2 italic">Navbatdagi namozgacha qolgan vaqt</p>
          </div>
        )}
      </header>

      {error ? (
        <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-center space-y-4">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all font-bold"
          >
            Qayta urinish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {timings && Object.entries(timings)
            .filter(([name]) => prayerNamesUz[name])
            .map(([name, time]) => (
            <div 
              key={name}
              className={`group p-6 rounded-3xl border transition-all ${
                activePrayer === name 
                ? 'bg-slate-800 border-4 border-green-700' 
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
              } flex items-center justify-between`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-3xl ${activePrayer === name ? '' : 'grayscale group-hover:grayscale-0'} transition-all`}>
                  {prayerIcons[name]}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{prayerNamesUz[name]}</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Namoz vaqti</p>
                </div>
              </div>
              <div className={`text-2xl font-black font-mono ${activePrayer === name ? 'text-primary-700' : 'text-primary-600 dark:text-primary-400'}`}>
                {time}
              </div>
            </div>
          ))}
          
          <button 
            onClick={handleRefresh}
            className="mt-4 flex items-center justify-center gap-2 text-slate-400 hover:text-primary-600 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" /> Yangilash
          </button>
        </div>
      )}
    </div>
  );
};

export default PrayerTimes;
