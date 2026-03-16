import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
              Quran App
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-primary-400 font-medium transition-colors">
              Suralar
            </Link>
            <Link to="/tasbeh" className="text-slate-300 hover:text-emerald-400 font-medium transition-colors">
              Tasbeh
            </Link>
            <Link to="/qibla" className="text-slate-300 hover:text-emerald-400 font-medium transition-colors">
              Qibla
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-2 animate-in slide-in-from-top-4">
            <Link 
              to="/" 
              className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Suralar
            </Link>
            <Link 
              to="/tasbeh" 
              className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Tasbeh
            </Link>
            <Link 
              to="/qibla" 
              className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Qibla
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
