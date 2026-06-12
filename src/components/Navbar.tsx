"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Menu, X, Sparkles } from "lucide-react";
import AartiDrawer from "./AartiDrawer";
import LanguageToggle from "@/components/LanguageToggle";
import { Translate, TranslationKey } from "@/context/LanguageContext";

export default function Navbar() {
  const [isAartiOpen, setIsAartiOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks: { token: TranslationKey; href: string }[] = [
    { token: "nav_home", href: "/" },
    { token: "nav_mela_details", href: "/mela-details" },
    { token: "nav_schedule", href: "/schedule" },
    { token: "nav_attractions", href: "/attractions" },
    { token: "nav_darshan", href: "/darshan" },
    { token: "nav_food_fest", href: "/food" },
    { token: "nav_logistics", href: "/visitor-info" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gold/15 bg-maroon-dark/95 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          
          {/* Logo with Himachali Temple Arch and Diya Stand */}
          <Link href="/" className="flex items-center gap-2.5 group min-h-[44px] relative pl-10 pr-2">
            {/* Himachali Temple Arch (SVG) positioned absolute on the left */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-10 text-gold drop-shadow-[0_1.5px_2.5px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 40 46" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M 6 42 L 34 42" strokeWidth="2.5" />
                <path d="M 8 40 L 32 40" strokeWidth="2" />
                <path d="M 10 40 L 10 18 M 30 40 L 30 18" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 10 18 C 10 12, 14 8, 20 8 C 26 8, 30 12, 30 18" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 13 18 C 13 14, 16 11, 20 11 C 24 11, 27 14, 27 18" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 6 18 L 34 18" strokeWidth="2" strokeLinecap="round" />
                <path d="M 12 13 L 28 13" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 20 4 L 20 11" strokeWidth="1.5" />
                <circle cx="20" cy="4" r="1.5" fill="currentColor" />
              </svg>
            </div>
            
            <span className="text-base sm:text-lg font-serif font-black text-gold gold-glow tracking-widest uppercase">
              MAA SHOOLINI
            </span>

            {/* Subtle oil lamp Diya stand (SVG) on the right of branding */}
            <div className="w-5 h-8 text-gold drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.6)] animate-pulse flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6v26M8 32h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M6 22c0 2 3 3.5 6 3.5s6-1.5 6-3.5H6z" fill="currentColor" stroke="currentColor" strokeWidth="0.8" />
                <path d="M8 12c0 1.5 2 2.5 4 2.5s4-1 4-2.5H8z" fill="currentColor" stroke="currentColor" strokeWidth="0.8" />
                <path d="M12 2c-.6 1.8-1.5 3.2-1.5 4.8 0 1.5 1.1 2.7 2.5 2.7s2.5-1.2 2.5-2.7c0-1.6-.9-3-1.5-4.8z" fill="url(#diya-flame-nav)" />
                <defs>
                  <linearGradient id="diya-flame-nav" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="40%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </Link>

          {/* Desktop Navigation Filigree Container */}
          <div className="hidden lg:flex items-center relative py-1.5 px-6 border-y border-gold/30 bg-black/20 rounded-md">
            {/* Left filigree ornament */}
            <svg className="absolute left-[-18px] top-1/2 -translate-y-1/2 w-7 h-9 text-gold pointer-events-none" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M 22 4 C 15 4, 9 8, 9 16 C 9 24, 15 28, 22 28" />
              <path d="M 9 16 C 4 16, 1 12, 1 8 C 1 4, 4 2, 7 2" strokeWidth="0.8" />
              <path d="M 9 16 C 4 16, 1 20, 1 24 C 1 28, 4 30, 7 30" strokeWidth="0.8" />
            </svg>
            {/* Right filigree ornament */}
            <svg className="absolute right-[-18px] top-1/2 -translate-y-1/2 w-7 h-9 text-gold pointer-events-none" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M 2 4 C 9 4, 15 8, 15 16 C 15 24, 9 28, 2 28" />
              <path d="M 15 16 C 20 16, 23 12, 23 8 C 23 4, 20 2, 17 2" strokeWidth="0.8" />
              <path d="M 15 16 C 20 16, 23 20, 23 24 C 23 28, 20 30, 17 30" strokeWidth="0.8" />
            </svg>

            <nav className="flex items-center gap-2 xl:gap-3.5 font-serif text-[11px] xl:text-xs font-bold text-gold/80">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.token}
                    href={link.href}
                    className={`transition-colors duration-300 hover:text-gold-light tracking-widest ${
                      isActive ? "text-gold gold-glow font-black border-b border-gold/45" : "text-gold/60"
                    }`}
                  >
                    [<Translate token={link.token} />]
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Action Buttons: Language Switcher, Aarti Trigger & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Text Language Selector */}
            <LanguageToggle />

            {/* Golden Coin Aarti Button */}
            <button
              onClick={() => setIsAartiOpen(true)}
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.7),_inset_0_1px_1.5px_rgba(255,255,255,0.4)] border border-amber-900/60 hover:scale-[1.05] active:scale-95 transition-all duration-300 ease-apple-ease gpu-accelerated will-animate-transform"
              style={{
                // Brushed Golden/Bronze metallic radial gradient
                background: "radial-gradient(circle at 50% 25%, #fef08a 0%, #caa97c 50%, #9a7532 95%, #543d0c 100%)",
              }}
              aria-label="Open Aarti Panel"
            >
              {/* Embossed Diya icon inside gold circle */}
              <div className="relative z-10 flex flex-col items-center justify-center drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)]">
                <svg className="w-5 h-5 text-amber-950/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 15c0-2.5 2-4.5 7-4.5s7 2 7 4.5H5z" fill="currentColor" />
                  <path d="M12 2.5c-.4 1-.8 1.8-.8 2.5 0 1 .8 1.8 1.8 1.8s1.8-.8 1.8-1.8c0-.7-.4-1.5-.8-2.5z" fill="#ea580c" />
                </svg>
                <span className="text-[7.5px] sm:text-[8px] font-serif font-black text-amber-950 tracking-widest uppercase mt-0.5 leading-none">
                  <Translate token="nav_aarti" />
                </span>
              </div>

              {/* Outer rim SVG border */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50%" cy="50%" r="45%" stroke="rgba(84, 61, 12, 0.4)" strokeWidth="0.8" strokeDasharray="2 1.5" />
              </svg>

              {/* Inner highlight rim */}
              <div className="absolute inset-0.5 rounded-full border border-white/20 pointer-events-none" />
            </button>

            {/* Mobile Hamburger menu toggle (min 48x48px for thumb tapping) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 rounded-lg border border-gold/20 text-gold hover:bg-gold/5 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-maroon-dark to-stone-950 text-gold flex flex-col justify-between p-6 shadow-2xl"
          >
            {/* Mobile Header Inside Overlay */}
            <div className="flex items-center justify-between pb-6 border-b border-gold/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <span className="text-lg font-serif font-black tracking-widest uppercase">
                  MAA SHOOLINI
                </span>
              </div>
              
              {/* Close Button (min 48x48px for easy close) */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-full border border-gold/30 text-gold hover:bg-gold/10 hover:text-white transition-all duration-300 min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation links listed inside screen overlay */}
            <nav className="flex flex-col gap-6 font-serif text-lg font-bold text-center items-center justify-center flex-grow py-8">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.token}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-3 px-6 rounded-xl border border-transparent transition-all duration-200 ${
                        isActive
                          ? "bg-gold/10 text-white font-black border-gold/30 shadow-md"
                          : "text-gold/70 hover:text-gold hover:bg-gold/5"
                      }`}
                    >
                      [<Translate token={link.token} />]
                    </Link>
                  </motion.div>
                );
              })}
            </nav>


            {/* Mobile Overlay Footer */}
            <div className="text-center py-4 border-t border-gold/10 space-y-2">
              <p className="text-xs text-stone-400 font-sans">
                Solan, Himachal Pradesh • June 26 – 28, 2026
              </p>
              <p className="text-[10px] text-gold/40 font-serif">
                ॥ जय माँ शूलिनी देवी - सदा सहायते ॥
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Aarti Drawer panel */}
      <AartiDrawer isOpen={isAartiOpen} onClose={() => setIsAartiOpen(false)} />
    </>
  );
}
