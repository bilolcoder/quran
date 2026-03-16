import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Loader2, Navigation, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const QiblaFinder = () => {
  const [coords, setCoords] = useState(null);
  const [qiblaAngle, setQiblaAngle] = useState(null);
  const [heading, setHeading] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile for compass sensor
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setIsMobile(true);
    }

    const getLocation = () => {
      if (!navigator.geolocation) {
        setError("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });
          const angle = calculateQibla(latitude, longitude);
          setQiblaAngle(angle);
          setLoading(false);
        },
        (err) => {
          setError("Joylashuvni aniqlash imkoni bo'lmadi. Iltimos, ruxsat bering.");
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    };

    getLocation();

    // Compass heading handler
    const handleOrientation = (e) => {
      let compass = e.webkitCompassHeading || e.alpha;
      if (compass !== undefined && compass !== null) {
        // e.alpha is 0-360 CCW on Android usually, webkitCompassHeading is 0-360 CW
        // We normalize to CW heading (0 = North)
        setHeading(e.webkitCompassHeading || (360 - e.alpha));
      }
    };

    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ requires permission
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', (e) => {
            let compass = e.webkitCompassHeading || e.alpha;
            setHeading(e.webkitCompassHeading || (360 - e.alpha));
          }, true);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const calculateQibla = (lat, lon) => {
    const phiK = (21.4225 * Math.PI) / 180;
    const lambdaK = (39.8262 * Math.PI) / 180;
    const phiU = (lat * Math.PI) / 180;
    const lambdaU = (lon * Math.PI) / 180;

    const y = Math.sin(lambdaK - lambdaU);
    const x = Math.cos(phiU) * Math.tan(phiK) - Math.sin(phiU) * Math.cos(lambdaK - lambdaU);
    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    return (qibla + 360) % 360;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
        <Compass className="w-8 h-8 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-emerald-500 font-bold animate-pulse text-lg tracking-widest uppercase">Joylashuv aniqlanmoqda...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 px-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center justify-center gap-3">
          <Navigation className="w-8 h-8 text-emerald-500 fill-emerald-500" />
          Qibla Topuvchi
        </h1>
        <p className="text-slate-500 font-medium">Ka'ba tomon yo'nalishni aniqlang</p>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-500 font-bold text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors"
          >
            Qayta urinish
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Main Compass UI */}
          <div className="relative aspect-square max-w-[400px] mx-auto group">
            {/* Compass Outer Rings */}
            <div className="absolute inset-0 border-[6px] border-slate-800 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)]" />
            <div className="absolute inset-4 border border-slate-700/50 rounded-full" />
            <div className="absolute inset-10 border-2 border-slate-700 rounded-full" />

            {/* Degree Markings */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="absolute inset-0 flex items-start justify-center"
                style={{ transform: `rotate(${i * 30}deg)` }}
              >
                <div className={`w-1 h-4 mt-2 ${i % 3 === 0 ? 'bg-emerald-500 w-1.5 h-6' : 'bg-slate-700'}`} />
              </div>
            ))}

            {/* Cardinal Points */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-black text-slate-500">
              <span className="absolute top-12 text-emerald-500">N</span>
              <span className="absolute right-12">E</span>
              <span className="absolute bottom-12">S</span>
              <span className="absolute left-12">W</span>
            </div>

            {/* Compass Body (Rotates with heading) */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: -heading }}
              transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            >
              {/* North Pointer */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full w-2 h-32 bg-gradient-to-t from-emerald-500 to-transparent rounded-full opacity-20" />
              
              {/* Qibla Indicator (Fixed relative to the compass) */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ rotate: qiblaAngle }}
              >
                <div className="relative h-full py-8">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                     <motion.div 
                       animate={{ y: [0, -10, 0] }}
                       transition={{ duration: 2, repeat: Infinity }}
                       className="mb-2"
                     >
                        <div className="bg-emerald-500 p-2 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                           <Navigation className="w-6 h-6 text-white rotate-0" />
                        </div>
                     </motion.div>
                     <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Qibla</p>
                   </div>
                   {/* Needle */}
                   <div className="w-1.5 h-1/2 bg-gradient-to-t from-emerald-500/10 via-emerald-500/40 to-emerald-500 rounded-full mx-auto" />
                </div>
              </motion.div>
            </motion.div>

            {/* Center HUD */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-slate-900/80 backdrop-blur-xl w-32 h-32 rounded-full border border-slate-700 flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-black text-white">{Math.round(qiblaAngle)}°</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Gradus</span>
              </div>
            </div>
          </div>

          {/* Device Specific Controls */}
          {isMobile && !heading && (
            <button 
              onClick={requestPermission}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-2 group"
            >
              <Compass className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Kompasni yoqing
            </button>
          )}

          {/* Info Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50 space-y-3">
                <div className="flex items-center gap-3 text-emerald-500">
                   <MapPin size={20} />
                   <h3 className="font-bold">Sizning joylashuvingiz</h3>
                </div>
                <div className="space-y-1">
                   <p className="text-xs text-slate-500 font-bold uppercase">Kenglik: <span className="text-slate-300">{coords.latitude.toFixed(4)}</span></p>
                   <p className="text-xs text-slate-500 font-bold uppercase">Uzunlik: <span className="text-slate-300">{coords.longitude.toFixed(4)}</span></p>
                </div>
             </div>

             <div className="bg-emerald-500/5 p-6 rounded-[2rem] border border-emerald-500/10 space-y-3">
                <div className="flex items-center gap-3 text-emerald-500">
                   <Info size={20} />
                   <h3 className="font-bold">Eslatma</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                   Qibla yo'nalishi Shimoldan soat yo'nalishi bo'yicha aniqlanadi. Telefonda foydalanayotgan bo'lsangiz, uni tekis ushlang.
                </p>
             </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex justify-center pt-8">
        <Link 
          to="/" 
          className="px-8 py-4 bg-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-700 transition-all border border-slate-700/50"
        >
          Asosiy sahifa
        </Link>
      </div>
    </div>
  );
};

export default QiblaFinder;
