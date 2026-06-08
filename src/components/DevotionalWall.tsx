"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, Sparkles, MapPin, Heart } from "lucide-react";

interface Prayer {
  id: string;
  name: string;
  message: string;
  location: string;
  date: string;
}

const DEFAULT_PRAYERS: Prayer[] = [
  {
    id: "p1",
    name: "Suresh Sharma",
    location: "Solan, HP",
    message: "May Maa Shoolini protect our family and bless our beautiful town with health and happiness. Jai Mata Di!",
    date: "June 08, 2026"
  },
  {
    id: "p2",
    name: "Sunita Thakur",
    location: "Shimla, HP",
    message: "Seeking blessings for my children's education and prosperity. Looking forward to the sacred Shobha Yatra!",
    date: "June 08, 2026"
  },
  {
    id: "p3",
    name: "Rohit Verma",
    location: "Chandigarh",
    message: "May the Mother Goddess guide us all onto the path of righteousness and clear away all obstacles.",
    date: "June 07, 2026"
  },
  {
    id: "p4",
    name: "Meenakshi Devi",
    location: "Kandaghat, HP",
    message: "Srimat Maa Shoolini Devi is our ultimate shelter. Endless pranams at the holy feet of the Mother.",
    date: "June 06, 2026"
  }
];

export default function DevotionalWall() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  
  // Form State
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const savedPrayers = localStorage.getItem("shoolini_prayers");
    if (savedPrayers) {
      setPrayers(JSON.parse(savedPrayers));
    } else {
      setPrayers(DEFAULT_PRAYERS);
      localStorage.setItem("shoolini_prayers", JSON.stringify(DEFAULT_PRAYERS));
    }
  }, []);

  // Submit Prayer Handler
  const handleSubmitPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });

    const newPrayer: Prayer = {
      id: `p-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      location: location.trim() || "India",
      date: formattedDate
    };

    const updatedPrayers = [newPrayer, ...prayers];
    setPrayers(updatedPrayers);
    localStorage.setItem("shoolini_prayers", JSON.stringify(updatedPrayers));

    // Reset Form
    setName("");
    setMessage("");
    setLocation("");
    setFormSubmitted(true);

    setTimeout(() => {
      setFormSubmitted(false);
    }, 4000);
  };

  return (
    <section id="devotional-wall" className="py-20 bg-gradient-to-b from-maroon-dark to-stone-950 text-white scroll-mt-16 relative overflow-hidden flex-grow">
      {/* Decorative Gold Sparkles Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(212,175,55,0.08)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-gold font-bold text-xs uppercase tracking-widest block font-serif">
            Digital Prayers & Blessings
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-gold gold-glow">
            Interactive Devotional Wall
          </h2>
          <div className="w-24 h-1 bg-saffron mx-auto rounded-full" />
          <p className="text-stone-300 max-w-xl mx-auto text-sm font-sans">
            Can't travel to Solan this year? Pin a prayer wish on our Devotional Wall to receive Maa Shoolini's divine grace from afar.
          </p>
        </div>

        {/* Core Layout: Centered Prayer Form */}
        <div className="max-w-3xl mx-auto bg-black/30 border border-gold/20 rounded-3xl p-6 sm:p-8 mb-16 relative overflow-hidden">
          {/* Decorative arch header element inside card */}
          <div className="absolute top-0 inset-x-0 opacity-5 pointer-events-none flex justify-center">
            <svg width="100%" height="30" viewBox="0 0 200 30" fill="none">
              <path d="M0 30 C 50 8, 150 8, 200 30 L 200 0 L 0 0 Z" fill="#d4af37" />
            </svg>
          </div>

          <div className="space-y-2 mb-6 text-center">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-gold flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5 text-saffron" />
              Offer Your Prayer Wish
            </h3>
            <p className="text-xs text-stone-400 font-sans">
              Your devotional messages and wishes will be posted on the public board below.
            </p>
          </div>

          <form onSubmit={handleSubmitPrayer} className="space-y-4 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="devotee-name" className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block font-sans">
                  Full Name *
                </label>
                <input
                  id="devotee-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Devender Kumar"
                  className="w-full px-4 py-2.5 bg-black/40 border border-gold/20 rounded-xl text-white text-sm focus:outline-none focus:border-gold placeholder:text-stone-600 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="devotee-location" className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block font-sans">
                  City/Town (Optional)
                </label>
                <input
                  id="devotee-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="E.g., Solan, HP"
                  className="w-full px-4 py-2.5 bg-black/40 border border-gold/20 rounded-xl text-white text-sm focus:outline-none focus:border-gold placeholder:text-stone-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="devotee-message" className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block font-sans">
                Your Prayer / Festival Wish *
              </label>
              <textarea
                id="devotee-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your prayers, wishes, or praises to Maa Shoolini..."
                className="w-full px-4 py-2.5 bg-black/40 border border-gold/20 rounded-xl text-white text-sm focus:outline-none focus:border-gold placeholder:text-stone-600 transition-colors resize-none"
              />
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-maroon-light via-maroon to-maroon-dark hover:from-saffron hover:to-saffron-deep border border-gold/40 hover:border-gold rounded-xl text-xs font-serif font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                Post Prayer on Wall
              </button>
            </div>

            {/* Form Success Message */}
            <AnimatePresence>
              {formSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="font-sans">Your prayer has been posted successfully and saved locally in your browser! Jai Mata Di.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Scrollable Devotional Wall Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gold/25 pb-3">
            <h3 className="text-lg md:text-xl font-serif font-bold text-gold flex items-center gap-2">
              <Heart className="w-5 h-5 text-saffron fill-saffron/20" />
              Devotee Board ({prayers.length} Posts)
            </h3>
            <span className="text-xs text-stone-400 font-sans">Scroll to view recent wishes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {prayers.map((prayer) => (
              <div
                key={prayer.id}
                className="bg-black/25 p-5 rounded-2xl border border-gold/10 hover:border-gold/25 hover:bg-black/35 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-stone-400 border-b border-gold/5 pb-2 font-sans">
                    <span className="flex items-center gap-1 font-bold text-saffron-light">
                      <MessageSquare className="w-3.5 h-3.5 text-saffron shrink-0" />
                      Devotional Prayer
                    </span>
                    <span>{prayer.date}</span>
                  </div>
                  <p className="text-stone-200 text-xs sm:text-sm leading-relaxed font-sans italic">
                    "{prayer.message}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-[11px] font-bold text-gold mt-4 pt-3 border-t border-gold/5 font-serif">
                  <span>{prayer.name}</span>
                  <span className="flex items-center gap-1 font-normal text-stone-400 text-[10px] font-sans">
                    <MapPin className="w-3 h-3 text-saffron shrink-0" />
                    {prayer.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
