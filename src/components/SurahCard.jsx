import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const SurahCard = ({ surah }) => {
  return (
    <Link 
      to={`/surah/${surah.id}`}
      className="group relative p-6 bg-slate-800/40 backdrop-blur-sm rounded-3xl border border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all duration-500 flex flex-col gap-4 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-emerald-400 font-bold group-hover:from-emerald-500 group-hover:to-teal-600 group-hover:text-white group-hover:border-transparent transition-all duration-500 shadow-lg">
            {surah.id}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors duration-300">
              {surah.name_simple}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {surah.translated_name.name}
            </p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="font-arabic text-2xl text-white group-hover:text-emerald-400 transition-colors duration-300 leading-none">
            {surah.name_arabic}
          </span>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-2">
            {surah.verses_count} Oyat
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50 relative z-10">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
            surah.revelation_place === 'makkah' 
            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
          }`}>
            {surah.revelation_place === 'makkah' ? 'Makka' : 'Madina'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-emerald-400 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-widest">O'qish</span>
          <BookOpen size={12} />
        </div>
      </div>
    </Link>
  );
};

export default SurahCard;
