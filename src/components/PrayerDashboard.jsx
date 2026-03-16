import React, { useState, useEffect } from 'react';
import { fetchPrayerTimes } from '../utils/api';
import { Clock, MapPin, Loader2, Calendar } from 'lucide-react';

const PrayerDashboard = () => {
  const [timings, setTimings] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePrayer, setActivePrayer] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
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

  useEffect(() => {
    const getTimes = async (lat, lon) => {
      try {
        const data = await fetchPrayerTimes(lat, lon);
        setTimings(data.timings);
        setLocation(data.meta.timezone.split('/')[1]?.replace('_', ' ') || data.meta.timezone);
        setError(null);
      } catch (err) {
        setError("Yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getTimes(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Default to Tashkent if permission denied
          getTimes(41.2995, 69.2401);
          setLocation("Toshkent");
        }
      );
    } else {
      getTimes(41.2995, 69.2401);
      setLocation("Toshkent");
    }
  }, []);

  useEffect(() => {
    if (!timings) return;

    const updateTimer = () => {
      const now = new Date();
      const prayers = Object.entries(timings)
        .filter(([name]) => prayerNamesUz[name])
        .map(([name, time]) => {
          const [hours, minutes] = time.split(':').map(Number);
          const prayerDate = new Date();
          prayerDate.setHours(hours, minutes, 0, 0);
          return { name, date: prayerDate };
        });

      prayers.sort((a, b) => a.date - b.date);

      let current = prayers[prayers.length - 1].name;
      let next = { ...prayers[0], date: new Date(prayers[0].date.getTime() + 24 * 60 * 60 * 1000) };

      for (let i = 0; i < prayers.length; i++) {
        if (now < prayers[i].date) {
          next = prayers[i];
          current = prayers[i - 1]?.name || "Isha";
          break;
        }
      }

      setActivePrayer(current);
      setNextPrayer(next);

      const diff = next.date - now;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [timings]);

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[200px] mb-8">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
        <p className="text-slate-400 text-sm">Namoz vaqtlari yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-xl shadow-emerald-900/20 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Clock size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-100/80 text-sm font-medium mb-4">
              <MapPin size={14} />
              <span>{location}</span>
              <span className="mx-1 opacity-50">•</span>
              <Calendar size={14} />
              <span>{new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })}</span>
            </div>
            
            <h2 className="text-lg font-bold text-emerald-100 uppercase tracking-wider mb-1">Hozirgi vaqt</h2>
            <div className="text-4xl font-black mb-4">
              {prayerNamesUz[activePrayer]}
            </div>
          </div>

          <div className="relative z-10 flex items-end justify-between">
            <div>
              <p className="text-emerald-100/70 text-sm font-medium mb-1">Keyingi namoz: {prayerNamesUz[nextPrayer?.name]}</p>
              <div className="text-3xl font-mono font-black tabular-nums">
                -{countdown}
              </div>
            </div>
            <div className="text-right">
              <p className="text-emerald-100/70 text-xs uppercase tracking-widest mb-1">Hozirgi vaqt</p>
              <p className="text-xl font-bold">{new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>

        {/* List of Times */}
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-4 flex flex-col justify-between">
          <div className="space-y-2">
            {timings && Object.entries(timings)
              .filter(([name]) => prayerNamesUz[name])
              .map(([name, time]) => (
                <div 
                  key={name}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                    activePrayer === name 
                    ? 'bg-emerald-500/20 border border-emerald-500/30' 
                    : 'hover:bg-slate-700/30 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{prayerIcons[name]}</span>
                    <span className={`font-semibold ${activePrayer === name ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {prayerNamesUz[name]}
                    </span>
                  </div>
                  <span className={`font-mono font-bold ${activePrayer === name ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {time}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerDashboard;
