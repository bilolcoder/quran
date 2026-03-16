import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSurahDetails, fetchVerses } from '../utils/api';
import { ChevronLeft, Loader2, Play, Info, Mic, MicOff, AlertCircle } from 'lucide-react';

const SurahDetail = () => {
  const { id } = useParams();
  const [surah, setSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [wordStatuses, setWordStatuses] = useState([]); // array of { word, status: 'correct' | 'error' | 'pending' }
  const recognitionRef = useRef(null);
  const errorAudio = useRef(null);

  useEffect(() => {
    // Initialize Audio
    errorAudio.current = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
    errorAudio.current.volume = 0.5;

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

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ar-SA';

      recognitionRef.current.onresult = (event) => {
        const currentTranscript = event.results[event.results.length - 1][0].transcript;
        const isFinal = event.results[event.results.length - 1].isFinal;

        const newTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        setTranscript(newTranscript);
        if (isFinal) {
          checkRecitation(newTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
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
      // Find if this word exists in the surah at a reasonable position
      // For simplicity, we check if it matches the word at the same index or nearby
      const match = surahWords.slice(Math.max(0, i - 10), i + 10).some(sw => sw === word);
      
      if (!match && word.length > 1) {
        // Play sound ONLY if it's the latest word being processed as final
        if (i === userWords.length - 1) {
          errorAudio.current.play().catch(e => console.log("Audio play failed:", e));
        }
        return { word, status: 'error' };
      }
      return { word, status: 'correct' };
    });

    setWordStatuses(statuses);
  };

  const toggleListening = () => {
    // Attempt to "unlock" audio on first click
    if (errorAudio.current) {
      errorAudio.current.play().then(() => {
        errorAudio.current.pause();
        errorAudio.current.currentTime = 0;
      }).catch(() => {});
    }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-white">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
              {surah?.name_simple}
              <span className="font-arabic text-2xl text-primary-600">{surah?.name_arabic}</span>
            </h1>
            <p className="text-slate-500">{surah?.translated_name.name} • {surah?.verses_count} Oyat</p>
          </div>
        </div>

        <button 
          onClick={toggleListening}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
            isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-600/20'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {isListening ? 'Eshitilmoqda...' : 'Qiroatni boshlash'}
        </button>
      </div>

      {isListening && (
        <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl border border-primary-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary-500 shrink-0 mt-1" />
          <div>
            <p className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-1">Jonli Qiroat</p>
            <p className="font-arabic text-xl text-slate-700 dark:text-slate-300" dir="rtl">
              {wordStatuses.length > 0 ? (
                wordStatuses.map((item, i) => (
                  <span 
                    key={i} 
                    className={item.status === 'error' ? 'text-red-500 font-bold underline decoration-wavy' : 'text-emerald-500'}
                  >
                    {item.word}{' '}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">
                  {transcript || 'Waiting for speech...'}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {surah?.bismillah_pre && (
        <div className="text-center py-12 border-b border-slate-100 dark:border-slate-800">
          <p className="font-arabic text-4xl leading-relaxed text-white">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
        <div className="space-y-12">
          {/* Continuous Arabic Text */}
          <div className="text-right dir-rtl" dir="rtl">
            <p className="font-arabic text-4xl md:text-5xl leading-[2.5] md:leading-[3] text-slate-900 dark:text-slate-100 select-none notranslate inline-block">
              {verses.map((verse, index) => (
                <span key={verse.id} className="inline group relative cursor-pointer hover:text-primary-600 transition-colors">
                  {verse.text_uthmani}
                  <span className="inline-flex items-center justify-center w-10 h-10 mx-2 text-sm font-bold border-2 border-primary-200 dark:border-primary-800 rounded-full text-primary-600 dark:text-primary-400 align-middle notranslate" dir="ltr">
                    {verse.verse_number}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurahDetail;
