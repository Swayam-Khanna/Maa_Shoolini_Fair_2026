"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Translate, TranslationKey } from "@/context/LanguageContext";

interface Medallion {
  token: TranslationKey;
  svgIcon: React.ReactNode;
}

export default function MedallionSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const medallions: Medallion[] = [
    {
      token: "medallion_cultural",
      svgIcon: (
        // Traditional Dancers Silhouette (Dark Engraved)
        <svg className="w-9 h-9 sm:w-10 sm:h-10 text-maroon-dark/85 group-hover:text-maroon-dark transition-colors duration-300 flex-shrink-0 drop-shadow-[0_0.75px_0_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          {/* Dancer 1 */}
          <circle cx="8" cy="6" r="1.8" />
          <path d="M8 7.8c-1.5 0.5-2.2 1.5-2.2 3.5m2.2-3.5c1.5 0.5 2.2 1.5 2.2 3.5M8 11.5v4.5m0 0l-1.5 2.5m1.5-2.5l1.5 2.5" />
          <path d="M4 10c1.2-.8 2.5-1 4-1" />
          {/* Dancer 2 */}
          <circle cx="16" cy="6" r="1.8" />
          <path d="M16 7.8c-1.5 0.5-2.2 1.5-2.2 3.5m2.2-3.5c1.5 0.5 2.2 1.5 2.2 3.5M16 11.5v4.5m0 0l-1.5 2.5m1.5-2.5l1.5 2.5" />
          <path d="M20 10c-1.2-.8-2.5-1-4-1" />
        </svg>
      )
    },
    {
      token: "medallion_food",
      svgIcon: (
        // Traditional Food Bazaar Stall Silhouette (Dark Engraved)
        <svg className="w-9 h-9 sm:w-10 sm:h-10 text-maroon-dark/85 group-hover:text-maroon-dark transition-colors duration-300 flex-shrink-0 drop-shadow-[0_0.75px_0_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8h18L19 4H5L3 8z" />
          <path d="M5 8v10h14V8" />
          <circle cx="9" cy="13.5" r="1.8" />
          <path d="M7.2 13.5h3.6" />
          <circle cx="15" cy="13.5" r="2.2" />
          <path d="M12.8 13.5h4.4" />
          <path d="M9 10.5v-1M15 9.5v-1" />
        </svg>
      )
    },
    {
      token: "medallion_flower",
      svgIcon: (
        // Lotus Flowers Silhouette (Dark Engraved)
        <svg className="w-9 h-9 sm:w-10 sm:h-10 text-maroon-dark/85 group-hover:text-maroon-dark transition-colors duration-300 flex-shrink-0 drop-shadow-[0_0.75px_0_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20c3-2 5-6 5-9 0-2.5-1.5-4-3-2.5-.8.8-1.5 2-1.5 2s-.7-1.2-1.5-2c-1.5-1.5-3 0-3 2.5 0 3 2 7 5 9z" />
          <path d="M12 11c-1-1.5-2.5-2.5-4-1.5-1.5 1-1.5 3.5.8 5.5M12 11c1-1.5 2.5-2.5 4-1.5 1.5 1 1.5 3.5-.8 5.5" />
          <path d="M12 15c-1.5-1-3.5-.8-5 .5M12 15c1.5-1 3.5-.8 5 .5" />
        </svg>
      )
    },
    {
      token: "medallion_shobha",
      svgIcon: (
        // Procession Diya & Flags Silhouette (Dark Engraved)
        <svg className="w-9 h-9 sm:w-10 sm:h-10 text-maroon-dark/85 group-hover:text-maroon-dark transition-colors duration-300 flex-shrink-0 drop-shadow-[0_0.75px_0_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3v17" />
          <path d="M6 5h11l-2.5 3 2.5 3H6" />
          <path d="M11.5 17c0 1.2 1.2 2 2.8 2s2.8-.8 2.8-2h-5.6z" />
          <path d="M14.3 15c0-.4.3-1 .7-1s.7.6.7 1a.7.7 0 01-1.4 0z" fill="currentColor" />
        </svg>
      )
    }
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="w-full flex items-center gap-3 py-1 select-none relative z-10">
      
      {/* Left Navigation Arrow (Floating Gold Diamond) */}
      <button
        onClick={() => handleScroll("left")}
        className="w-7 h-7 rotate-45 border border-gold/45 flex items-center justify-center bg-gradient-to-br from-[#dfc08f] via-[#cba76d] to-[#825d26] shadow-md cursor-pointer hover:scale-[1.08] active:scale-95 transition-transform duration-300 ease-apple-ease gpu-accelerated will-animate-transform flex-shrink-0"
        aria-label="Scroll Left"
      >
        <ChevronLeft className="-rotate-45 w-3.5 h-3.5 text-amber-950 stroke-[2.5]" />
      </button>

      {/* Snap Scroll View Container */}
      <div
        ref={scrollRef}
        className="flex-grow flex gap-3 overflow-x-auto scroll-snap-x scroll-smooth scroll-momentum no-scrollbar py-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {medallions.map((med, idx) => (
          <div
            key={idx}
            className="snap-start shrink-0 group relative w-[155px] sm:w-[170px] h-[75px] sm:h-[82px] rounded-2xl flex items-center gap-2 p-3 overflow-hidden border border-amber-950/25 shadow-[0_5px_15px_rgba(0,0,0,0.55),_inset_0_1.5px_1.5px_rgba(255,255,255,0.4)] transition-all duration-300 ease-apple-ease gpu-accelerated will-animate-transform hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(0,0,0,0.7)]"
            style={{
              // Light Metallic Brass/Bronze Gradient to match the reference image
              background: "linear-gradient(135deg, #e8c99b 0%, #cba76d 40%, #ab8243 75%, #835d28 100%)",
            }}
          >
            {/* Inner Sheen Highlights */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.35)_0%,transparent_60%)] pointer-events-none group-hover:scale-110 transition-transform duration-500 ease-apple-ease" />

            {/* Traditional Engraved Filigree SVG Border Frame */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3.5" y="3.5" width="calc(100% - 7px)" height="calc(100% - 7px)" rx="12.5" stroke="rgba(74, 4, 4, 0.28)" strokeWidth="1.2" />
              <rect x="6" y="6" width="calc(100% - 12px)" height="calc(100% - 12px)" rx="10" stroke="rgba(74, 4, 4, 0.18)" strokeWidth="0.8" strokeDasharray="3 2" />
              {/* Traditional corner bracket details */}
              <path d="M 8.5 11.5 L 8.5 8.5 L 11.5 8.5" stroke="rgba(74, 4, 4, 0.35)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M calc(100% - 8.5px) 11.5 L calc(100% - 8.5px) 8.5 L calc(100% - 11.5px) 8.5" stroke="rgba(74, 4, 4, 0.35)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 8.5 calc(100% - 11.5px) L 8.5 calc(100% - 8.5px) L 11.5 calc(100% - 8.5px)" stroke="rgba(74, 4, 4, 0.35)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M calc(100% - 8.5px) calc(100% - 11.5px) L calc(100% - 8.5px) calc(100% - 8.5px) L calc(100% - 11.5px) calc(100% - 8.5px)" stroke="rgba(74, 4, 4, 0.35)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Embossed Silhouette (Left Side) */}
            <div className="relative z-10 flex-shrink-0 group-hover:scale-[1.03] transition-transform duration-300 ease-apple-ease">
              {med.svgIcon}
            </div>

            {/* Engraved Typography Title (Right Side) */}
            <div className="relative z-10 flex-grow text-left flex flex-col justify-center select-none">
              <span className="text-[9.5px] sm:text-[10px] font-serif font-black tracking-wide text-maroon-dark/95 uppercase leading-tight line-clamp-2 max-w-[95px] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                <Translate token={med.token} />
              </span>
            </div>

            {/* Inner bevel border highlight */}
            <div className="absolute inset-1 rounded-[14px] border border-white/20 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Right Navigation Arrow (Floating Gold Diamond) */}
      <button
        onClick={() => handleScroll("right")}
        className="w-7 h-7 rotate-45 border border-gold/45 flex items-center justify-center bg-gradient-to-br from-[#dfc08f] via-[#cba76d] to-[#825d26] shadow-md cursor-pointer hover:scale-[1.08] active:scale-95 transition-transform duration-300 ease-apple-ease gpu-accelerated will-animate-transform flex-shrink-0"
        aria-label="Scroll Right"
      >
        <ChevronRight className="-rotate-45 w-3.5 h-3.5 text-amber-950 stroke-[2.5]" />
      </button>

    </div>
  );
}
