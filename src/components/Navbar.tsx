"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Menu, X, Sparkles } from "lucide-react";
import AartiDrawer from "./AartiDrawer";

export default function Navbar() {
  const [isAartiOpen, setIsAartiOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "MELA DETAILS", href: "/mela-details" },
    { name: "SCHEDULE", href: "/schedule" },
    { name: "ATTRACTIONS", href: "/attractions" },
    { name: "LOGISTICS", href: "/visitor-info" },
    { name: "DEVOTIONAL WALL", href: "/devotional-wall" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gold/10 bg-maroon-dark/95 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group min-h-[44px]">
            <Sparkles className="w-5 h-5 text-gold animate-pulse" />
            <span className="text-lg sm:text-xl font-serif font-black text-gold gold-glow tracking-widest uppercase">
              MAA SHOOLINI
            </span>
          </Link>

          {/* Desktop Navigation (lg breakpoint and above) */}
          <nav className="hidden lg:flex items-center gap-1.5 font-serif text-[11px] xl:text-xs font-bold text-gold/80">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-2 py-1.5 transition-colors duration-200 hover:text-gold-light ${
                    isActive ? "text-gold gold-glow font-black border-b-2 border-gold/50" : "text-gold/60"
                  }`}
                >
                  [{link.name}]
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons: Aarti Trigger & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Aarti button - 48px target helper inside container */}
            <button
              onClick={() => setIsAartiOpen(true)}
              className="px-4 py-2 border border-gold rounded-full text-xs font-black text-gold hover:bg-gold/10 hover:text-gold-light tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-md active:scale-95 min-h-[48px] min-w-[100px] justify-center cursor-pointer"
            >
              <Flame className="w-4 h-4 text-saffron animate-pulse" />
              <span>AARTI</span>
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
                    key={link.name}
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
                      [{link.name}]
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
