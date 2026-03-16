import React from 'react';
import { Link } from 'react-router-dom';

const SurahCard = ({ surah }) => {
  return (
    <Link 
      to={`/surah/${surah.id}`}
      className="group p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm">
            {surah.id}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
              {surah.name_simple}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {surah.translated_name.name}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-arabic text-2xl text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
            {surah.name_arabic}
          </span>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
            {surah.verses_count} Oyat
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
          {surah.revelation_place === 'makkah' ? 'Makka' : 'Madina'}
        </span>
      </div>
    </Link>
  );
};

export default SurahCard;
