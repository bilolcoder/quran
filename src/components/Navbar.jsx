import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Search, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary-600 rounded-lg group-hover:bg-primary-500 transition-colors">
            <Book className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-emerald-500">
            Quran Kareem
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
            Suralar
          </Link>
          <Link to="/prayer-times" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
            Namoz Vaqtlari
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
