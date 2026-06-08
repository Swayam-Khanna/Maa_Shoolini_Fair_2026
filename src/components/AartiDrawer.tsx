"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Sparkles } from "lucide-react";

interface AartiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AartiDrawer({ isOpen, onClose }: AartiDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Traditional Aarti verses and Mantra
  const mantra = {
    hindi: "ॐ शूलिनी देव्यै विद्महे महाशक्त्यै च धीमहि तन्नो देवी प्रचोदयात् ॥",
    english: "Om Shoolini Devyai Vidmahe, Mahashaktyai Cha Dhimahi, Tanno Devi Prachodayat.",
    meaning: "We contemplate the goddess Shoolini, we meditate on her great power. May that Divine Mother inspire and guide our intellect."
  };

  const aartiVerses = [
    {
      hindi: "जय अम्बे गौरी, मैया जय श्यामा गौरी।\nतुमको निसदिन ध्यावत, हरि ब्रह्मा शिव री॥\nजय अम्बे गौरी...",
      english: "Jai Ambe Gauri, Maiya Jai Shyama Gauri.\nTumko Nisadin Dhyavat, Hari Brahma Shiva Ri.\nJai Ambe Gauri..."
    },
    {
      hindi: "मांग सिंदूर विराजत, टीको मृगमद को।\nउज्जवल से दोउ नैना, चन्द्रबदन नीको॥\nजय अम्बे गौरी...",
      english: "Maang Sindoor Virajat, Teeko Mrigamad Ko.\nUjjawal Se Dou Naina, Chandrabadan Neeko.\nJai Ambe Gauri..."
    },
    {
      hindi: "कनक समान कलेवर, रक्ताम्बर राजे।\nरक्तपुष्प गल माला, कण्ठन पर साजे॥\nजय अम्बे गौरी...",
      english: "Kanak Samaan Kalevar, Raktaambar Raaje.\nRaktapushpa Gal Maala, Kanthan Par Saaje.\nJai Ambe Gauri..."
    },
    {
      hindi: "केहरि वाहन राजत, खड्ग खप्पर धारी।\nसुर-नर-मुनिजन सेवत, तिनके दुःखहारी॥\nजय अम्बे गौरी...",
      english: "Kehari Vaahan Raajat, Khadga Khappar Dhaari.\nSur-Nar-Munijan Sevat, Tinake Dukhahaari.\nJai Ambe Gauri..."
    },
    {
      hindi: "शूल धरणी संकट हरणी, सोलन वास करी।\nभक्त जनों के काज सवारे, संकट दूर हरी॥\nजय माँ शूलिनी...",
      english: "Shool Dharani Sankat Harani, Solan Vaas Kari.\nBhakt Janon Ke Kaaj Sawaare, Sankat Door Hari.\nJai Maa Shoolini..."
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine transition animations dynamically
  const drawerVariants = isMobile
    ? {
        initial: { y: "100%", x: 0 },
        animate: { y: 0, x: 0 },
        exit: { y: "100%", x: 0 }
      }
    : {
        initial: { x: "100%", y: 0 },
        animate: { x: 0, y: 0 },
        exit: { x: "100%", y: 0 }
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Panel: Bottom-sheet on Mobile, Side-drawer on Desktop */}
          <motion.div
            initial={drawerVariants.initial}
            animate={drawerVariants.animate}
            exit={drawerVariants.exit}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] w-full md:right-0 md:top-0 md:left-auto md:h-full md:w-full md:max-w-lg bg-gradient-to-b from-maroon-dark to-stone-900 border-t md:border-t-0 md:border-l border-gold/30 rounded-t-3xl md:rounded-t-none shadow-2xl z-60 overflow-y-auto flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-gold/20 flex items-center justify-between sticky top-0 bg-maroon-dark/95 backdrop-blur-md z-10 rounded-t-3xl md:rounded-t-none">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-gold animate-pulse" />
                <h2 className="text-xl md:text-2xl font-serif font-bold text-gold gold-glow">
                  माँ शूलिनी आरती
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-full border border-gold/30 text-gold hover:bg-gold/10 hover:text-gold-light transition-all duration-300 min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer"
                aria-label="Close Aarti Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-8 flex-1">
              {/* Devi Introduction */}
              <div className="bg-maroon/20 border border-gold/20 rounded-xl p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
                <Sparkles className="w-5 h-5 text-gold mx-auto mb-2 opacity-80" />
                <p className="text-stone-300 text-xs sm:text-sm italic font-sans leading-relaxed">
                  "Maa Shoolini Devi, the protector deity of Solan, rides a lion and wields a sacred Trident (Shoola). She is the essence of ultimate cosmic power and absolute peace."
                </p>
              </div>

              {/* Shoolini Gayatri Mantra */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gold/15 pb-2">
                  <div className="w-1.5 h-6 bg-saffron rounded-full" />
                  <h3 className="text-base sm:text-lg font-serif font-bold text-gold">शूलिनी गायत्री मन्त्र (Gayatri Mantra)</h3>
                </div>
                <div className="bg-black/30 p-4 sm:p-5 rounded-xl border border-gold/10 space-y-4 text-center">
                  <p className="text-lg sm:text-xl font-serif text-saffron-light leading-relaxed select-all">
                    {mantra.hindi}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-300 italic font-sans leading-relaxed">
                    "{mantra.english}"
                  </p>
                  <div className="text-xs text-stone-400 border-t border-gold/5 pt-3 mt-2">
                    <span className="font-semibold text-gold block mb-1">Meaning:</span>
                    {mantra.meaning}
                  </div>
                </div>
              </div>

              {/* Aarti Verses */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gold/15 pb-2">
                  <div className="w-1.5 h-6 bg-saffron rounded-full" />
                  <h3 className="text-base sm:text-lg font-serif font-bold text-gold">माँ शूलिनी आरती (Devotional Hymn)</h3>
                </div>

                <div className="space-y-6">
                  {aartiVerses.map((verse, idx) => (
                    <div
                      key={idx}
                      className="bg-black/20 p-4 sm:p-5 rounded-xl border border-gold/10 hover:border-gold/30 transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-serif font-semibold px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                          Verse {idx + 1}
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-serif text-stone-100 whitespace-pre-line leading-loose text-center group-hover:text-gold-light transition-colors duration-200">
                        {verse.hindi}
                      </p>
                      <div className="border-t border-gold/5 my-3" />
                      <p className="text-[10px] sm:text-xs text-stone-400 whitespace-pre-line leading-relaxed text-center italic font-sans">
                        {verse.english}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer inside drawer */}
              <div className="text-center py-4 border-t border-gold/10">
                <p className="text-xs text-gold/60 font-serif">
                  ॥ जय माँ शूलिनी देवी - सोलन की अधिष्ठात्री देवी ॥
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
