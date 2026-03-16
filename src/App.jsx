import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SurahDetail from './pages/SurahDetail';
import PrayerTimes from './pages/PrayerTimes';
import Tasbeh from './pages/Tasbeh';
import QiblaFinder from './pages/QiblaFinder';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/surah/:id" element={<SurahDetail />} />
            <Route path="/prayer-times" element={<PrayerTimes />} />
            <Route path="/tasbeh" element={<Tasbeh />} />
            <Route path="/qibla" element={<QiblaFinder />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
