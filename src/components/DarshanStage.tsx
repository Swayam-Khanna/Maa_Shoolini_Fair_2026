"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Flower2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Translate } from "@/context/LanguageContext";

interface Petal {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  opacity: number;
  swaySpeed: number;
  swayOffset: number;
  swayAmplitude: number;
  type: "rose" | "marigold";
  color: string;
}

export default function DarshanStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const rafRef = useRef<number | null>(null);
  const isLoopActive = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Resize canvas to full viewport with device pixel ratio */
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [mounted]);

  /* rAF animation loop */
  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) { isLoopActive.current = false; return; }

    const W = window.innerWidth;
    const H = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) { isLoopActive.current = false; return; }

    ctx.clearRect(0, 0, W, H);

    const petals = petalsRef.current;
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];

      // Physics update
      p.y  += p.vy;
      p.x  += p.vx + Math.sin((time / 200) * p.swaySpeed + p.swayOffset) * p.swayAmplitude;
      p.angle += p.angularVelocity;

      // Fade in bottom 20% of viewport
      const fadeZone = H * 0.80;
      if (p.y > fadeZone) {
        p.opacity = Math.max(0, 1 - (p.y - fadeZone) / (H - fadeZone));
      }

      // Recycle off-screen petals
      if (p.opacity <= 0 || p.y > H + 20 || p.x < -40 || p.x > W + 40) {
        petals.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur  = 4;

      if (p.type === "rose") {
        // Teardrop petal shape
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
        ctx.bezierCurveTo( p.size,     p.size / 3,   p.size / 2, -p.size / 2, 0, 0);
        ctx.fill();
      } else {
        // Marigold — outer disc + inner ring
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size / 2, p.size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = p.color === "#f59e0b" ? "#d97706" : "#fbbf24";
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (petals.length > 0) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      isLoopActive.current = false;
      rafRef.current = null;
    }
  }, []);

  const spawnBurst = useCallback(() => {
    const W = window.innerWidth;

    const ROSE_COLORS     = ["#f43f5e", "#e11d48", "#fda4af", "#be123c", "#fb7185"];
    const MARIGOLD_COLORS = ["#f59e0b", "#fbbf24", "#f57c00", "#ffb74d", "#ff9800"];

    const newPetals: Petal[] = [];
    for (let i = 0; i < 90; i++) {
      const type   = Math.random() > 0.42 ? "rose" : "marigold";
      const colors = type === "rose" ? ROSE_COLORS : MARIGOLD_COLORS;
      newPetals.push({
        x:              Math.random() * W,
        y:              -20 - Math.random() * 120,   // start above viewport
        size:           8 + Math.random() * 10,
        vx:             -1.5 + Math.random() * 3,
        vy:             1.6 + Math.random() * 2.4,   // gravity
        angle:          Math.random() * Math.PI * 2,
        angularVelocity: -0.07 + Math.random() * 0.14,
        opacity:        1,
        swaySpeed:      0.6 + Math.random() * 1.8,
        swayOffset:     Math.random() * Math.PI * 2,
        swayAmplitude:  0.5 + Math.random() * 1.5,
        type,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    petalsRef.current = [...petalsRef.current, ...newPetals];

    if (!isLoopActive.current) {
      isLoopActive.current = true;
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  // Cleanup rAF on unmount
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section
      className="relative min-h-[calc(100vh-68px)] text-white flex flex-col items-center justify-between overflow-hidden py-8 px-4"
      style={{ background: "radial-gradient(circle at center, #4A000A 0%, #2A0005 100%)" }}
    >
      {/* Subtle bg texture */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10 pointer-events-none"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.10)_0%,rgba(42,0,5,0.95)_90%)] pointer-events-none" />

      {/* Top gold line */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gold via-yellow-200 to-gold opacity-75" />

      {/* ────── FULL-SCREEN PETAL CANVAS (pointer-events-none so buttons stay clickable) ────── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-30 pointer-events-none"
      />

      {/* Back link */}
      <div className="w-full max-w-4xl flex justify-start z-10 self-center">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 border border-gold/20 text-gold/80 hover:text-gold hover:bg-gold/10 hover:border-gold/45 transition-all duration-300 text-xs font-serif font-bold uppercase tracking-widest cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Stage */}
      <div className="relative z-10 w-full max-w-4xl flex-grow flex flex-col items-center justify-center gap-6 py-4">

        {/* Page title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-4xl font-serif font-black text-gold gold-glow tracking-widest uppercase">
            <Translate token="darshan_title" />
          </h1>
          <p className="text-stone-300 text-[10px] sm:text-xs tracking-wide font-sans max-w-md mx-auto">
            <Translate token="darshan_desc" />
          </p>
        </div>

        {/* Deity portrait — double gold-brimmed frame */}
        <div className="relative max-w-[220px] sm:max-w-[270px] w-full aspect-[3/4] border-2 border-gold/45 rounded-2xl p-1.5 sm:p-2 bg-gradient-to-br from-gold/15 to-amber-900/40 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.3),_0_10px_35px_rgba(0,0,0,0.9)] select-none">
          <div className="relative w-full h-full overflow-hidden rounded-2xl border border-gold/30">
            {/* ★ NEW deity image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('/deities.jpg')` }}
            />
            {/* Soft inner vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20 pointer-events-none" />

            {/* Shimmering gold corner filigrees */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
              <path d="M 12 25 L 12 12 L 25 12" stroke="rgba(212,175,55,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M calc(100% - 12px) 25 L calc(100% - 12px) 12 L calc(100% - 25px) 12" stroke="rgba(212,175,55,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M 12 calc(100% - 25px) L 12 calc(100% - 12px) L 25 calc(100% - 12px)" stroke="rgba(212,175,55,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M calc(100% - 12px) calc(100% - 25px) L calc(100% - 12px) calc(100% - 12px) L calc(100% - 25px) calc(100% - 12px)" stroke="rgba(212,175,55,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Flower-shower button – fixed at bottom center ── */}
      <div className="relative z-40 w-full max-w-md pb-6 flex flex-col items-center gap-3">
        <p className="text-[9px] sm:text-[10px] text-gold/50 font-serif tracking-widest uppercase">
          ॥ माँ शूलिनी देवी की जय ॥
        </p>
        <motion.button
          onClick={spawnBurst}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 500, damping: 14 }}
          className="px-8 py-3.5 sm:px-10 sm:py-4 rounded-full font-serif font-black text-xs sm:text-sm tracking-widest text-amber-950 uppercase shadow-[0_6px_22px_rgba(0,0,0,0.65),_inset_0_1.5px_1.5px_rgba(255,255,255,0.5)] border border-amber-800/60 cursor-pointer select-none flex items-center justify-center gap-2.5 active:brightness-90 hover:brightness-110 transition-[filter] duration-200"
          style={{
            background: "radial-gradient(circle at 50% 20%, #fef08a 0%, #caa97c 50%, #9a7532 95%, #543d0c 100%)",
          }}
        >
          <Flower2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950/80" />
          <Translate token="darshan_button" />
        </motion.button>
      </div>
    </section>
  );
}
