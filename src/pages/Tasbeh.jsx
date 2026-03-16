import React, { useState, useEffect } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Fingerprint, Palette, Sparkles } from 'lucide-react';

const zikrs = [
  { id: 1, title: "Subhanalloh", arabic: "سُبْحَانَ ٱللَّٰهِ", translation: "Alloh barcha nuqsonlardan pokdir" },
  { id: 2, title: "Alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ", translation: "Allohga hamd bo'lsin" },
  { id: 3, title: "Allohu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ", translation: "Alloh buyukdir" },
  { id: 4, title: "La ilaha illalloh", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", translation: "Allohdan o'zga iloh yo'q" },
  { id: 5, title: "Astagfirulloh", arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", translation: "Allohdan mag'firat so'rayman" },
  { id: 6, title: "Subhanallohi va bihamdihi", arabic: "سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ", translation: "Alloh pokdir va Unga hamd bo'lsin" },
  { id: 7, title: "La haola va la quvvata illa billah", arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ", translation: "Kuch va quvvat faqat Allohdandir" },
  { id: 8, title: "Allohumma solli ala Muhammad", arabic: "ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ", translation: "Allohim, Muhammadga salovot yo'lla" },
  { id: 9, title: "Hasbunallohu va ni'mal vakil", arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", translation: "Alloh bizga kifoya, U naqadar go'zal Vakildir" },
  { id: 10, title: "La ilaha illa anta subhanaka inni kuntu minaz zalimin", arabic: "لَّا إِلَٰهَ إِلَّآ أَنتَ سُبْحَٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّٰلِمِينَ", translation: "Sendan o'zga iloh yo'q, Sen poksan..." }
];

const themes = [
  { 
    id: 'emerald', 
    name: 'Zumrad', 
    primary: 'emerald', 
    bg: 'from-emerald-600 to-teal-800', 
    glow: 'rgba(16, 185, 129, 0.3)',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30'
  },
  { 
    id: 'gold', 
    name: 'Oltin', 
    primary: 'amber', 
    bg: 'from-amber-600 to-yellow-800', 
    glow: 'rgba(245, 158, 11, 0.3)',
    text: 'text-amber-400',
    border: 'border-amber-500/30'
  },
  { 
    id: 'ocean', 
    name: 'Okean', 
    primary: 'sky', 
    bg: 'from-sky-600 to-indigo-800', 
    glow: 'rgba(14, 165, 233, 0.3)',
    text: 'text-sky-400',
    border: 'border-sky-500/30'
  },
  { 
    id: 'rose', 
    name: 'Atirgul', 
    primary: 'rose', 
    bg: 'from-rose-600 to-pink-800', 
    glow: 'rgba(244, 63, 94, 0.3)',
    text: 'text-rose-400',
    border: 'border-rose-500/30'
  },
  { 
    id: 'midnight', 
    name: 'Tun', 
    primary: 'violet', 
    bg: 'from-violet-600 to-purple-900', 
    glow: 'rgba(139, 92, 246, 0.3)',
    text: 'text-violet-400',
    border: 'border-violet-500/30'
  }
];

const Tasbeh = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const [beadRotation, setBeadRotation] = useState(0);

  const activeZikr = zikrs[currentIndex];

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    setTotalCount(prev => prev + 1);
    setBeadRotation(prev => prev + (360 / 33)); // Visual bead rotation
    
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const resetCount = () => {
    setCount(0);
  };

  const nextZikr = () => {
    setCurrentIndex((prev) => (prev + 1) % zikrs.length);
    setCount(0);
  };

  const prevZikr = () => {
    setCurrentIndex((prev) => (prev - 1 + zikrs.length) % zikrs.length);
    setCount(0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-800/50 rounded-full border border-slate-700/50 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Sparkles size={14} className={activeTheme.text} />
          Premium Tasbeh
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Zikr va Salovotlar
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Qalbingizga nuri Ilohiy inishi uchun har bir nafasda Allohni eslang.
        </p>
      </header>

      {/* Theme Selector */}
      <div className="flex flex-wrap justify-center gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setActiveTheme(theme)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-300 ${
              activeTheme.id === theme.id 
              ? `bg-${theme.primary}-500/20 ${theme.border} scale-105` 
              : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${theme.bg}`} />
            <span className={`text-sm font-bold ${activeTheme.id === theme.id ? 'text-white' : 'text-slate-500'}`}>
              {theme.name}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Zikr List */}
        <div className="lg:col-span-4 space-y-4 max-h-[700px] overflow-y-auto pr-3 custom-scrollbar">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 px-2">
            <Palette size={20} className={activeTheme.text} />
            Zikrlar
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {zikrs.map((zikr, index) => (
              <button
                key={zikr.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setCount(0);
                }}
                className={`group w-full text-left p-5 rounded-[24px] border transition-all duration-500 relative overflow-hidden ${
                  currentIndex === index 
                  ? `bg-${activeTheme.primary}-500/10 ${activeTheme.border} ring-1 ring-${activeTheme.primary}-500/20` 
                  : 'bg-slate-800/20 border-slate-800/50 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                {currentIndex === index && (
                  <div className={`absolute -right-4 -top-4 w-16 h-16 bg-${activeTheme.primary}-500/10 blur-2xl`} />
                )}
                
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentIndex === index ? activeTheme.text : 'text-slate-500'}`}>
                      {index + 1}-Zikr
                    </span>
                    <span className="font-arabic text-xl opacity-40 group-hover:opacity-100 transition-opacity text-slate-400">
                      {zikr.arabic.split(' ')[0]}
                    </span>
                  </div>
                  <h3 className={`font-bold transition-colors ${currentIndex === index ? 'text-white' : 'text-slate-400'}`}>
                    {zikr.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 italic">
                    {zikr.translation}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Counter Engine */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-2xl bg-slate-800/30 backdrop-blur-3xl border border-slate-700/50 rounded-[48px] p-8 md:p-16 flex flex-col items-center gap-12 relative overflow-hidden group">
            {/* Background Glow Effect */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 opacity-5 ${activeTheme.bg}`} 
            />
            
            <div className="text-center space-y-8 relative z-10 w-full animate-in fade-in duration-1000">
              <div className={`font-arabic text-4xl md:text-6xl ${activeTheme.text} drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] leading-snug min-h-[100px] flex items-center justify-center`}>
                {activeZikr.arabic}
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">{activeZikr.title}</h2>
                <div className={`h-1 w-20 mx-auto rounded-full bg-gradient-to-r ${activeTheme.bg}`} />
                <p className="text-slate-400 text-lg max-w-md mx-auto italic font-medium">"{activeZikr.translation}"</p>
              </div>
            </div>

            {/* Visual Tasbeh Beads Shell */}
            <div className="relative z-10 w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
              {/* Spinning Bead Container */}
              <div 
                className="absolute inset-0 transition-transform duration-500" 
                style={{ transform: `rotate(${beadRotation}deg)` }}
              >
                {[...Array(33)].map((_, i) => {
                  const angle = (i * 360) / 33;
                  const radius = 145; // Adjust based on size
                  return (
                    <div 
                      key={i}
                      className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full shadow-lg border border-white/5 transition-all duration-300 ${
                        (count % 33) > i ? `bg-gradient-to-br ${activeTheme.bg} scale-125 ring-4 ring-${activeTheme.primary}-500/20` : 'bg-slate-700/50'
                      }`}
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`
                      }}
                    />
                  );
                })}
              </div>

              {/* Central Counter Display */}
              <div className="text-center relative bg-slate-900/40 w-48 h-48 md:w-56 md:h-56 rounded-full border border-slate-700/50 flex flex-col items-center justify-center backdrop-blur-md shadow-inner">
                <div className="text-7xl md:text-8xl font-black font-mono text-white tracking-tighter drop-shadow-2xl">
                  {count}
                </div>
                <div className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 ${activeTheme.text}`}>
                  Zikr Soni
                </div>
                
                {/* Reset Button */}
                <button 
                  onClick={resetCount}
                  className="absolute bottom-4 p-2.5 bg-slate-800/50 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-full transition-all duration-300 border border-slate-700/50"
                  title="Qayta boshlash"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full relative z-10 flex flex-col items-center gap-8">
              {/* Main Interaction Button */}
              <button 
                onClick={handleIncrement}
                className="group relative"
              >
                <div className={`absolute inset-0 blur-3xl opacity-50 group-active:scale-150 transition-all duration-500 bg-gradient-to-br ${activeTheme.bg}`} />
                <div className={`relative w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br ${activeTheme.bg} rounded-full p-1.5 shadow-2xl group-active:scale-95 transition-all duration-100 ring-4 ring-white/10`}>
                  <div className="w-full h-full bg-black/10 rounded-full flex items-center justify-center border-t border-white/20 backdrop-blur-sm">
                    <Fingerprint size={56} className="text-white opacity-90 drop-shadow-lg" />
                  </div>
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                   <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] group-hover:text-white transition-colors">YETTI KAT BOSING</span>
                </div>
              </button>

              {/* Footer Nav */}
              <div className="flex items-center justify-between w-full mt-12 bg-slate-900/30 p-6 rounded-[32px] border border-slate-700/30">
                <button 
                  onClick={prevZikr}
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-all group"
                >
                  <div className="p-3 bg-slate-800/50 rounded-2xl group-hover:bg-slate-700 border border-slate-700/50 group-active:translate-x-1 transition-all">
                    <ChevronLeft size={22} />
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Oldingi</p>
                    <p className="text-xs font-bold">Zikr</p>
                  </div>
                </button>

                <div className="text-center px-8 border-x border-slate-700/30">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Umumiy hisob</p>
                  <div className={`text-2xl font-black font-mono tracking-wider ${activeTheme.text}`}>
                    {totalCount.toLocaleString()}
                  </div>
                </div>

                <button 
                  onClick={nextZikr}
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-all group"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Keyingi</p>
                    <p className="text-xs font-bold">Zikr</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-2xl group-hover:bg-slate-700 border border-slate-700/50 group-active:-translate-x-1 transition-all">
                    <ChevronRight size={22} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasbeh;
