"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-maroon-dark text-stone-200 py-12 border-t-2 border-gold/40 relative overflow-hidden mt-auto">
      {/* Background Watermark */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10 pointer-events-none"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
        {/* Brand Column */}
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <h4 className="text-base font-serif font-black text-gold gold-glow tracking-widest uppercase">
              MAA SHOOLINI MELA 2026
            </h4>
          </Link>
          <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto md:mx-0 font-sans">
            Celebrating Solan's rich heritage, spiritual legacy, and cultural traditions in Himachal Pradesh.
          </p>
        </div>

        {/* Venue Column */}
        <div className="flex flex-col items-center justify-center space-y-1 text-xs">
          <span className="text-stone-400 uppercase tracking-widest text-[9px] font-bold">Main Festival Venue:</span>
          <span className="text-sm font-serif font-bold text-gold">Thodo Ground & Mall Road, Solan (H.P.)</span>
          <span className="text-stone-500 font-semibold">June 26 - June 28, 2026</span>
        </div>

        {/* Copyright & Info Column */}
        <div className="text-center md:text-right space-y-2 text-xs">
          <p className="text-[10px] text-stone-400 font-sans">
            Developed for devotees and tourists to experience the historic festival of Himachal Pradesh.
          </p>
          <p className="text-xs text-gold font-serif">
            © 2026 Maa Shoolini Mela Committees. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
