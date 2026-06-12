"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Language = "en" | "hi";

export const translations = {
  en: {
    nav_home: "HOME",
    nav_mela_details: "MELA DETAILS",
    nav_schedule: "SCHEDULE",
    nav_attractions: "ATTRACTIONS",
    nav_logistics: "LOGISTICS",
    nav_devotional_wall: "DEVOTIONAL WALL",
    nav_darshan: "DARSHAN",
    nav_aarti: "AARTI",
    nav_food_fest: "FOOD FEST",
    nav_parking: "PARKING & TRAFFIC",
    // Hero translations
    hero_tag: "Historic 3-Day Festival",
    hero_title_1: "Maa",
    hero_title_2: "Shoolini",
    hero_title_3: "Mela Solan 2026",
    hero_desc: "Solan's ancient valley resonates with spiritual beats, celebrating the divine shield of Shoolini Mata in a grand historic 3-day legacy from June 26 to June 28, 2026.",
    hero_countdown_title: "Mela Commences In:",
    days: "Days",
    hours: "Hours",
    minutes: "Mins",
    seconds: "Secs",
    coming_soon: "Shoolini Fair Coming Soon!",
    experience_spirit: "EXPERIENCE THE SPIRIT",
    view_full_screen: "View full screen",
    medallion_cultural: "CULTURAL PERFORMANCES",
    medallion_food: "TRADITIONAL FOOD BAZAAR",
    medallion_flower: "GRAND FLOWER SHOW",
    medallion_shobha: "SHOBHA YATRA DETAILS",
    translation_button: "हिं हिंदी अनुवाद",
    darshan_title: "Deity Darshan & Pushpa Varsha",
    darshan_button: "पुष्प वर्षा / Shower Flowers",
    darshan_desc: "Offer fresh marigold and rose petals at the feet of Maa Shoolini.",
  },
  hi: {
    nav_home: "मुख्य पृष्ठ",
    nav_mela_details: "मेला विवरण",
    nav_schedule: "समय-सारणी",
    nav_attractions: "मुख्य आकर्षण",
    nav_logistics: "यात्री सूचना",
    nav_devotional_wall: "भक्ति दीवार",
    nav_darshan: "दिव्य दर्शन",
    nav_aarti: "आरती",
    nav_food_fest: "भोजन उत्सव",
    nav_parking: "पार्किंग और ट्रैफ़िक",
    // Hero translations
    hero_tag: "ऐतिहासिक 3-दिवसीय उत्सव",
    hero_title_1: "माँ",
    hero_title_2: "शूलिनी",
    hero_title_3: "मेला सोलन २०२६",
    hero_desc: "सोलन की प्राचीन घाटी आध्यात्मिक तरंगों से गूंजती है, जो २६ जून से २८ जून, २०२६ तक माँ शूलिनी देवी के दिव्य रक्षा कवच का उत्सव मनाती है।",
    hero_countdown_title: "मेला शुरू होने में शेष:",
    days: "दिन",
    hours: "घंटे",
    minutes: "मिनट",
    seconds: "सेकंड",
    coming_soon: "शूलिनी मेला जल्द आ रहा है!",
    experience_spirit: "दिव्य अनुभूति का अनुभव करें",
    view_full_screen: "पूर्ण आकार में देखें",
    medallion_cultural: "सांस्कृतिक कार्यक्रम",
    medallion_food: "पारंपरिक भोजन बाज़ार",
    medallion_flower: "भव्य पुष्प प्रदर्शनी",
    medallion_shobha: "शोभा यात्रा विवरण",
    translation_button: "EN English",
    darshan_title: "दिव्य दर्शन एवं पुष्प वर्षा",
    darshan_button: "पुष्प वर्षा / पुष्प अर्पित करें",
    darshan_desc: "माँ शूलिनी के चरणों में ताज़े गेंदा और गुलाब के पुष्प अर्पित करें।",
  }
};

type Translations = typeof translations.en;
export type TranslationKey = keyof Translations;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Load preferred language from localStorage on mount
  useEffect(() => {
    const storedLang = localStorage.getItem("preferred_lang") as Language;
    if (storedLang === "en" || storedLang === "hi") {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred_lang", lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "hi" : "en");
  }, [language, setLanguage]);

  const t = useCallback((key: string): string => {
    const langDict = translations[language] as Record<string, string>;
    const defaultDict = translations.en as Record<string, string>;
    return langDict[key] || defaultDict[key] || key;
  }, [language]);

  const value = React.useMemo(() => ({
    language,
    setLanguage,
    t,
    toggleLanguage
  }), [language, setLanguage, t, toggleLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

/**
 * Reusable Translation component that transitions smoothly on swap.
 * Uses hardware accelerated transitions on opacity and translate to eliminate layout jumps.
 * Displays fallback english translation on server-side rendering to prevent hydration mismatches.
 */
export function Translate({ token }: { token: TranslationKey }) {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState(t(token));
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setOpacity(0);
    const timer = setTimeout(() => {
      setText(t(token));
      setOpacity(1);
    }, 100); // Quick fade transition

    return () => clearTimeout(timer);
  }, [language, token, t, mounted]);

  return (
    <span
      className="transition-opacity duration-100 ease-in-out"
      style={{ opacity }}
    >
      {mounted ? text : translations.en[token]}
    </span>
  );
}

