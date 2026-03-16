import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSurahDetails, fetchVerses } from '../utils/api';
import { ChevronLeft, ChevronRight, Loader2, Mic, MicOff, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SurahDetail = () => {
  const { id } = useParams();
  const [surah, setSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [wordStatuses, setWordStatuses] = useState([]); 
  const recognitionRef = useRef(null);
  const errorAudio = useRef(null);

  useEffect(() => {
    errorAudio.current = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
    errorAudio.current.volume = 0.3;

    const getData = async () => {
      setLoading(true);
      try {
        const [surahData, versesData] = await Promise.all([
          fetchSurahDetails(id),
          fetchVerses(id)
        ]);
        setSurah(surahData);
        setVerses(versesData);
      } catch (error) {
        console.error("Error fetching surah data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
    window.scrollTo(0, 0);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ar-SA';

      recognitionRef.current.onresult = (event) => {
        const isFinal = event.results[event.results.length - 1].isFinal;
        const newTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');

        setTranscript(newTranscript);
        if (isFinal) {
          checkRecitation(newTranscript);
        }
      };

      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, [id]);

  const normalizeArabic = (text) => {
    if (!text) return "";
    return text.replace(/[\u064B-\u0652\u0670]/g, "").replace(/\s+/g, " ").trim();
  };

  const checkRecitation = (text) => {
    if (!verses.length) return;
    const normalizedUserInput = normalizeArabic(text);
    const userWords = normalizedUserInput.split(/\s+/).filter(w => w.length > 0);
    const fullSurahText = verses.map(v => normalizeArabic(v.text_uthmani)).join(" ");
    const surahWords = fullSurahText.split(/\s+/);

    const statuses = userWords.map((word, i) => {
      const match = surahWords.slice(Math.max(0, i - 10), i + 10).some(sw => sw === word);
      if (!match && word.length > 1) {
        if (i === userWords.length - 1) {
          errorAudio.current.play().catch(() => {});
        }
        return { word, status: 'error' };
      }
      return { word, status: 'correct' };
    });
    setWordStatuses(statuses);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setWordStatuses([]);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Group verses by page_number
  const pages = useMemo(() => {
    const pageGroups = {};
    verses.forEach(v => {
      if (!pageGroups[v.page_number]) {
        pageGroups[v.page_number] = [];
      }
      pageGroups[v.page_number].push(v);
    });
    return Object.keys(pageGroups).sort((a, b) => Number(a) - Number(b)).map(pageNum => ({
      pageNumber: pageNum,
      verses: pageGroups[pageNum]
    }));
  }, [verses]);

  const currentPage = pages[currentPageIndex];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      <p className="text-emerald-600 font-medium animate-pulse">Yuklanmoqda...</p>
    </div>
  );

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden px-4 md:px-0">
      {/* Background Islamic Pattern - Naqsh fon */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none z-0" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/islamic-exercise.png')` }}>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 dark:bg-slate-900/50 p-6 rounded-3xl backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center gap-5">
            <Link to="/" className="p-3 bg-white dark:bg-slate-800 hover:scale-110 shadow-sm rounded-2xl transition-all text-emerald-600">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                {surah?.name_simple}
                <span className="font-arabic text-3xl text-emerald-600 drop-shadow-sm">{surah?.name_arabic}</span>
              </h1>
              <p className="text-slate-500 font-medium text-sm md:text-base">{surah?.translated_name.name} • <span className="text-emerald-600">{surah?.verses_count} oyat</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={toggleListening}
              className={`group flex items-center justify-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse scale-105'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-600/20'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 group-hover:scale-125 transition-transform" />}
              <span className="hidden sm:inline">{isListening ? 'Eshitilmoqda...' : 'Qiroatni tekshirish'}</span>
              <span className="sm:hidden">{isListening ? '...' : 'Tekshirish'}</span>
            </button>
          </div>
        </div>

        {/* Live Feedback */}
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-3xl border-2 border-emerald-500/20 shadow-inner"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Jonli tahlil</span>
              </div>
              <p className="font-arabic text-2xl md:text-3xl text-slate-700 dark:text-slate-200 leading-relaxed" dir="rtl">
                {wordStatuses.length > 0 ? (
                  wordStatuses.map((item, i) => (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={i}
                      className={item.status === 'error' ? 'text-red-500 border-b-2 border-red-500' : 'text-emerald-600'}
                    >
                      {item.word}{' '}
                    </motion.span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-lg font-sans">Sizni eshitayapman, marhamat qiroat qiling...</span>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Navigation */}
        {pages.length > 1 && (
          <div className="flex items-center justify-between bg-white/30 dark:bg-slate-900/30 p-4 rounded-3xl border border-emerald-100/50 dark:border-emerald-900/10">
            <button 
              disabled={currentPageIndex === 0}
              onClick={() => setCurrentPageIndex(prev => prev - 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed border border-emerald-100 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-bold hidden sm:inline">Oldingi bet</span>
            </button>

            <div className="flex flex-col items-center">
               <div className="flex items-center gap-2 text-emerald-600">
                  <BookOpen size={16} />
                  <span className="text-lg font-bold">Bet {currentPage?.pageNumber}</span>
               </div>
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sahifa {currentPageIndex + 1} / {pages.length}</span>
            </div>

            <button 
              disabled={currentPageIndex === pages.length - 1}
              onClick={() => setCurrentPageIndex(prev => prev + 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed border border-emerald-100 shadow-sm"
            >
              <span className="font-bold hidden sm:inline">Keyingi bet</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Mushaf Container */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPageIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="relative bg-[#fcfbf7] dark:bg-slate-800/80 p-6 md:p-16 rounded-[2rem] md:rounded-[4rem] shadow-2xl border-8 border-[#e9e4d1] dark:border-slate-700/50 min-h-[500px] flex flex-col"
          >
            {/* Decorative Corner Elements */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-emerald-600/20 rounded-tl-3xl"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-emerald-600/20 rounded-br-3xl"></div>

            {/* Bismillah on the first page of the surah */}
            {currentPageIndex === 0 && surah?.bismillah_pre && (
              <div className="text-center mb-12">
                <p className="font-arabic text-4xl md:text-6xl text-slate-800 dark:text-white drop-shadow-sm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-emerald-600/30 to-transparent mx-auto mt-6"></div>
              </div>
            )}

            <div className="text-right flex-1" dir="rtl">
              <p className="font-arabic text-3xl md:text-5xl lg:text-6xl leading-[2.5] md:leading-[3] lg:leading-[3.2] text-slate-900 dark:text-slate-100 select-none">
                {currentPage?.verses.map((verse) => (
                  <span key={verse.id} className="inline group transition-all duration-300 hover:text-emerald-600">
                    <span className="mx-1 md:mx-2 cursor-default">{verse.text_uthmani}</span>
                    <span className="inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 mx-1 text-sm md:text-base font-bold border-2 border-emerald-200 dark:border-emerald-800 rounded-full text-emerald-700 dark:text-emerald-400 align-middle bg-emerald-50/50 dark:bg-emerald-900/20 shadow-sm">
                      {verse.verse_number}
                    </span>
                  </span>
                ))}
              </p>
            </div>

            {/* Page Footer */}
            <div className="mt-12 pt-8 border-t border-emerald-100 dark:border-emerald-900/20 text-center">
               <span className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Surat {surah?.name_simple} • Sahifa {currentPage?.pageNumber}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quick Page Jump for long surahs */}
        {pages.length > 5 && (
          <div className="flex flex-wrap justify-center gap-2">
            {pages.map((page, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPageIndex(idx)}
                className={`w-8 h-8 rounded-full text-[10px] font-bold transition-all ${
                  currentPageIndex === idx 
                  ? 'bg-emerald-600 text-white scale-110' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SurahDetail;