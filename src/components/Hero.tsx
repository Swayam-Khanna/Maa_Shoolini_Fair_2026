"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Sparkles, Flame, X, ZoomIn } from "lucide-react";

interface ShowcaseImage {
  url: string;
  title: string;
  caption: string;
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<ShowcaseImage | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const showcaseImages: ShowcaseImage[] = [
    {
      url: "/temple.png",
      title: "Shoolini Mata Temple",
      caption: "Solan's sacred shrine beautifully illuminated at dusk.",
    },
    {
      url: "/altar.jpg",
      title: "Sacred Inner Sanctum",
      caption: "The magnificent Garbhagriha altar displaying the deities of Maa Shoolini.",
    },
    {
      url: "/hero-bg.jpg",
      title: "Maa Shoolini Deities",
      caption: "The sacred traditional painting of the protector sisters.",
    },
    {
      url: "/procession.jpg",
      title: "Grand Shobha Yatra",
      caption: "The divine Palki procession traversing Solan's Mall Road.",
    },
  ];

  useEffect(() => {
    setMounted(true);
    const targetDate = new Date("2026-06-26T00:00:00+05:30").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-68px)] bg-maroon-dark text-white flex flex-col justify-between overflow-hidden py-12"
    >
      {/* Background Image Layer (Watermark/Faded spiritual backdrop blend) */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25 pointer-events-none"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      />
      {/* Reddish/Gold glowing radial overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.18)_0%,rgba(74,4,4,0.9)_80%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Traditional Arch Border (Top & Sides) */}
      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-r from-gold via-yellow-300 to-gold opacity-80" />

      {/* Main Hero Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-grow w-full py-8">
        
        {/* Left Side: Title & Countdown */}
        <div className="lg:col-span-6 space-y-8 text-left">
          {/* Poetic Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-saffron/10 border border-saffron/30 text-saffron-light text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Historic 3-Day Festival
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black tracking-wide text-gold gold-glow leading-none uppercase">
              Maa Shoolini <br />
              <span className="text-white text-3xl sm:text-4xl md:text-5xl tracking-normal text-stroke-gold">Mela Solan 2026</span>
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-xl font-sans">
              Solan's ancient valley resonates with spiritual beats, celebrating the divine shield of Shoolini Mata in a grand historic 3-day legacy from June 26 to June 28, 2026.
            </p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-3"
          >
            <span className="text-xs uppercase tracking-widest text-stone-400 font-bold block font-sans">
              Mela Commences In:
            </span>
            {mounted ? (
              <div className="flex gap-3 sm:gap-4">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Mins", value: timeLeft.minutes },
                  { label: "Secs", value: timeLeft.seconds },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center bg-black/40 border border-gold/20 rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[90px] backdrop-blur-md shadow-lg"
                  >
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-gold gold-glow">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-xs text-stone-400 font-semibold uppercase tracking-wider mt-1 font-sans">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-20 w-80 bg-black/20 rounded-lg animate-pulse" />
            )}
          </motion.div>

          {/* Buttons and Event Meta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center gap-5 pt-4 text-xs font-semibold text-stone-300 font-sans"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-saffron" />
              <span>June 26 – June 28, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-saffron" />
              <span>Solan, Himachal Pradesh</span>
            </div>
          </motion.div>

          {/* Pulsing Coming Soon Banner (Touch targets prioritized) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="pt-4 flex flex-wrap gap-4 items-center"
          >
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-maroon-light via-maroon to-maroon-dark border-2 border-gold rounded-xl text-xs font-serif font-black tracking-widest uppercase text-gold shadow-lg min-h-[48px] select-none cursor-default"
            >
              <Flame className="w-4 h-4 text-gold animate-pulse" />
              <span>Shoolini Fair Coming Soon!</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side: Visual Showcase Card Grid (Temple, Altar, Deity, Procession) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="lg:col-span-6 grid grid-cols-2 gap-4 h-full"
        >
          {showcaseImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setLightboxImage(img)}
              className="group relative h-40 sm:h-48 rounded-2xl border-2 border-gold/30 overflow-hidden shadow-xl cursor-pointer hover:border-gold transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('${img.url}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90" />
              <div className="absolute top-3 right-3 bg-black/55 p-1.5 rounded-full border border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3.5 h-3.5 text-gold" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <h4 className="text-xs sm:text-sm font-serif font-black text-gold gold-glow leading-tight">
                  {img.title}
                </h4>
                <p className="text-[9px] sm:text-[10px] text-stone-300 font-sans mt-0.5 line-clamp-1">
                  View full screen
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom: Row of Flickering Diyas & Scroll Down Indicator */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-2 flex flex-col md:flex-row items-center justify-between border-t border-gold/10 pt-4 bg-black/10">
        
        {/* Left Side Diyas */}
        <div className="flex items-end gap-6 mb-4 md:mb-0">
          {[
            { size: "w-10 h-10", flameSize: "w-3 h-6" },
            { size: "w-14 h-14", flameSize: "w-4.5 h-8" },
            { size: "w-10 h-10", flameSize: "w-3 h-6" },
          ].map((diya, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Flame */}
              <div className={`${diya.flameSize} bg-gradient-to-t from-red-600 via-saffron to-yellow-300 rounded-full animate-flicker`} />
              {/* Clay Pot (Diya) */}
              <div className={`${diya.size} bg-gradient-to-b from-amber-800 to-stone-900 rounded-b-full border-t border-gold/30 shadow-md flex items-center justify-center`}>
                <div className="w-full h-1/2 bg-amber-950/80 rounded-b-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center text-stone-400 text-xs font-semibold tracking-widest font-serif">
          <span>EXPERIENCE THE SPIRIT</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-6 bg-gold rounded-full mt-2"
          />
        </div>

        {/* Right Side Diyas */}
        <div className="flex items-end gap-6 mt-4 md:mt-0">
          {[
            { size: "w-10 h-10", flameSize: "w-3 h-6" },
            { size: "w-14 h-14", flameSize: "w-4.5 h-8" },
            { size: "w-10 h-10", flameSize: "w-3 h-6" },
          ].map((diya, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Flame */}
              <div className={`${diya.flameSize} bg-gradient-to-t from-red-600 via-saffron to-yellow-300 rounded-full animate-flicker`} />
              {/* Clay Pot (Diya) */}
              <div className={`${diya.size} bg-gradient-to-b from-amber-800 to-stone-900 rounded-b-full border-t border-gold/30 shadow-md flex items-center justify-center`}>
                <div className="w-full h-1/2 bg-amber-950/80 rounded-b-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal overlay */}
      <AnimatePresence>
        {lightboxImage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-md cursor-zoom-out"
            />

            {/* Modal Card Wrapper */}
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setLightboxImage(null);
                }
              }}
              className="fixed inset-0 z-60 flex items-center justify-center p-4 cursor-zoom-out"
            >
              {/* Modal Card */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl w-full bg-stone-900/90 border border-gold/30 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl cursor-default"
              >
                {/* Image Section */}
                <div className="relative h-[65vh] w-full bg-black flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat p-8"
                    style={{ backgroundImage: `url('${lightboxImage.url}')` }}
                  />
                  {/* Close button */}
                  <button
                    onClick={() => setLightboxImage(null)}
                    className="absolute top-5 right-5 p-3 bg-black/60 rounded-full border border-gold/30 text-gold hover:bg-gold/20 hover:text-white transition-all duration-300 min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer"
                    aria-label="Close Lightbox"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Details Footer */}
                <div className="p-6 border-t border-gold/20 bg-maroon-dark/95 text-left space-y-2">
                  <h3 className="text-xl md:text-2xl font-serif font-black text-gold gold-glow">
                    {lightboxImage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                    {lightboxImage.caption}
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
