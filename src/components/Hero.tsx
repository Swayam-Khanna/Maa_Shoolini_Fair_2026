"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Sparkles, Flame, X, ZoomIn } from "lucide-react";
import { Translate, TranslationKey } from "@/context/LanguageContext";

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
      className="relative min-h-[calc(100vh-68px)] text-white flex flex-col justify-between overflow-hidden py-12"
      style={{
        background: "radial-gradient(circle at center, #4A000A 0%, #2A0005 100%)"
      }}
    >
      {/* Background Image Layer (Watermark/Faded spiritual backdrop blend) */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-[0.18] pointer-events-none"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      />
      {/* Reddish/Gold glowing radial overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.14)_0%,rgba(42,0,5,0.95)_90%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-saffron/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Traditional Arch Border (Top & Sides) */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gold via-yellow-200 to-gold opacity-75" />

      {/* Main Hero Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-grow w-full py-8">
        
        {/* Left Side: Title & Countdown */}
        <div className="lg:col-span-6 space-y-8 text-left">
          {/* Poetic Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4a0404]/80 border border-gold/30 text-gold text-[10px] sm:text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <Translate token="hero_tag" />
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-3"
          >
            <h1 className="font-serif font-black tracking-wide text-gold gold-glow leading-[0.9] uppercase">
              <span className="text-4xl sm:text-6xl md:text-[5.5rem] block">
                <Translate token="hero_title_1" />
              </span>
              <span className="text-4xl sm:text-6xl md:text-[5.5rem] block">
                <Translate token="hero_title_2" />
              </span>
              <span className="text-2xl sm:text-4xl md:text-[3.25rem] leading-tight mt-2 block">
                <Translate token="hero_title_3" />
              </span>
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-xl font-sans pt-2">
              <Translate token="hero_desc" />
            </p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-3.5"
          >
            <span className="text-xs uppercase tracking-widest text-stone-400 font-bold block font-sans">
              <Translate token="hero_countdown_title" />
            </span>
            {mounted ? (
              <div className="flex gap-3 sm:gap-4">
                {[
                  { token: "days" as TranslationKey, value: timeLeft.days },
                  { token: "hours" as TranslationKey, value: timeLeft.hours },
                  { token: "minutes" as TranslationKey, value: timeLeft.minutes },
                  { token: "seconds" as TranslationKey, value: timeLeft.seconds },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center bg-[#2d120a]/60 border border-gold/30 rounded-2xl p-3 min-w-[72px] sm:min-w-[84px] h-[72px] sm:h-[82px] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.15),_0_4px_12px_rgba(0,0,0,0.7)] backdrop-blur-sm relative overflow-hidden group hover:scale-[1.03] transition-transform duration-300 ease-apple-ease"
                  >
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-gold gold-glow leading-none">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1.5 font-sans">
                      <Translate token={item.token} />
                    </span>
                    {/* Inner highlight rim */}
                    <div className="absolute inset-0.5 rounded-[14px] border border-white/5 pointer-events-none" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-20 w-80 bg-black/20 rounded-lg animate-pulse" />
            )}
          </motion.div>
        </div>

        {/* Right Side: Visual Showcase Card Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="lg:col-span-6 grid grid-cols-2 gap-4 self-center w-full"
        >
          {showcaseImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (img.title === "Maa Shoolini Deities") {
                  window.location.href = "/darshan";
                } else {
                  setLightboxImage(img);
                }
              }}
              className="group relative h-40 sm:h-48 cursor-pointer border-2 border-gold/45 rounded-2xl p-1.5 bg-gradient-to-br from-gold/15 to-amber-900/40 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.3),_0_6px_20px_rgba(0,0,0,0.8)] hover:scale-[1.03] transition-all duration-300 ease-apple-ease gpu-accelerated will-animate-transform"
            >
              <div className="relative w-full h-full overflow-hidden rounded-xl border border-gold/30">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${img.url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90" />
                <div className="absolute top-3 right-3 bg-black/55 p-1.5 rounded-full border border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <ZoomIn className="w-3.5 h-3.5 text-gold" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                  <h4 className="text-xs sm:text-sm font-serif font-black text-gold gold-glow leading-tight uppercase">
                    {img.title}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-stone-300 font-sans mt-0.5 line-clamp-1">
                    <Translate token="view_full_screen" />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom: Event Meta, Developer Credit & Decorative Sparkle */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-4 flex items-center justify-between border-t border-gold/10 pt-4 mt-8 gap-4">

        {/* Event Meta Line */}
        <div className="flex items-center gap-2 text-stone-400 text-[10px] sm:text-xs font-sans flex-shrink-0">
          <MapPin className="w-3.5 h-3.5 text-gold/80" />
          <span>June 26 – June 28, 2026 • Solan, Himachal Pradesh</span>
        </div>

        {/* Developer Credit — center */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex-grow text-center hidden sm:block"
        >
          <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-sans tracking-widest text-gold/40 hover:text-gold/70 transition-colors duration-300 select-none cursor-default">
            <svg className="w-3 h-3 text-gold/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L9.5 8.5H3l5.5 4-2.1 6.5L12 15l5.6 4-2.1-6.5L21 8.5h-6.5z"/>
            </svg>
            <span>
              Crafted by{" "}
              <span className="text-gold/60 font-semibold font-serif">Swayam Khanna</span>
              <span className="text-stone-500 mx-1">·</span>
              <span className="italic text-stone-500">Software Engineer</span>
            </span>
          </span>
        </motion.div>

        {/* Decorative Sparkle Star */}
        <div className="text-gold opacity-80 hover:scale-110 transition-transform duration-300 cursor-default select-none flex-shrink-0">
          <svg className="w-5 h-5 text-gold gold-glow" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
          </svg>
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
              className="fixed inset-0 bg-black/95 z-50 backdrop-blur-md cursor-zoom-out"
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
                  <h3 className="text-xl md:text-2xl font-serif font-black text-gold gold-glow uppercase">
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
