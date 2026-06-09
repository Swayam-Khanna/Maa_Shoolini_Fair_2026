"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-2 py-1.5 text-[11px] xl:text-xs font-serif font-bold tracking-widest text-gold/60 hover:text-gold-light transition-all duration-200 cursor-pointer select-none active:scale-95 flex items-center justify-center min-h-[44px]"
      aria-label="Toggle Language"
    >
      {language === "en" ? "EN | हिं" : "हिं | EN"}
    </button>
  );
}
