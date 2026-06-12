"use client";

/**
 * /transportation — Automated Real-Time Parking Finder
 *
 * Polls /api/parking/live every 4 seconds to show exact sensor-driven
 * availability counts from MongoDB. Zero random math — every number
 * on this page originated from a physical gate counter.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Bike,
  Truck,
  MapPin,
  Navigation,
  Clock,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  Bus,
} from "lucide-react";
import Link from "next/link";
import type { VehicleType } from "@/lib/parkingConfig";

// ─────────────────────────────────────────────────────────────────────────────
// Types  (mirrors the shape returned by /api/parking/live)
// ─────────────────────────────────────────────────────────────────────────────
interface LiveLot {
  parkingId: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  type: VehicleType;
  distanceLabel: string;
  distanceMinutes: number;
  shuttleAvailable: boolean;
  lastPingedAt: string | null;
}

type FilterType = "All" | "Car Only" | "Bike Only";
type FetchStatus = "idle" | "loading" | "ok" | "error";

// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers
// ─────────────────────────────────────────────────────────────────────────────
function occupancyPct(lot: LiveLot): number {
  if (lot.totalSpots === 0) return 100;
  return Math.round(
    ((lot.totalSpots - lot.availableSpots) / lot.totalSpots) * 100
  );
}

type StatusTier = "housefull" | "critical" | "available";

function statusTier(lot: LiveLot): StatusTier {
  if (lot.availableSpots === 0) return "housefull";
  if (lot.availableSpots <= 5) return "critical";
  return "available";
}

function filterMatches(lot: LiveLot, filter: FilterType): boolean {
  if (filter === "All") return true;
  if (filter === "Car Only")
    return (
      lot.type === "Car Only" ||
      lot.type === "All Vehicles" ||
      lot.type === "Car & Bike"
    );
  // "Bike Only"
  return (
    lot.type === "Bike Only" ||
    lot.type === "All Vehicles" ||
    lot.type === "Car & Bike"
  );
}

function fmtTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Flashing green "SENSOR ACTIVE" header badge */
function SensorActiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-widest font-sans">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
      </span>
      Automated Sensor Interface Active
    </span>
  );
}

/** Connection status pill */
function ConnectionPill({ status }: { status: FetchStatus }) {
  if (status === "error")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold font-sans">
        <WifiOff className="w-3 h-3" /> Sensor Offline
      </span>
    );
  if (status === "loading")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold font-sans">
        <RefreshCw className="w-3 h-3 animate-spin" /> Syncing…
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold font-sans">
      <Wifi className="w-3 h-3" /> Live Feed Connected
    </span>
  );
}

/** Vehicle type icon(s) */
function VehicleIcon({ type }: { type: VehicleType }) {
  const cls = "w-4 h-4 shrink-0";
  if (type === "Car Only") return <Car className={cls} />;
  if (type === "Bike Only") return <Bike className={cls} />;
  if (type === "All Vehicles") return <Truck className={cls} />;
  return (
    <span className="flex gap-0.5 items-center">
      <Car className={cls} />
      <Bike className={cls} />
    </span>
  );
}

/** Status badge — 3-tier exact logic per spec */
function StatusBadge({ lot }: { lot: LiveLot }) {
  const tier = statusTier(lot);

  if (tier === "housefull") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-widest font-sans border border-red-700 shrink-0">
        <XCircle className="w-3.5 h-3.5" />
        HOUSEFULL
      </span>
    );
  }

  if (tier === "critical") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-black uppercase tracking-widest font-sans animate-pulse shrink-0">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        Critical: Only {lot.availableSpots} Left!
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-widest font-sans shrink-0">
      <CheckCircle2 className="w-3.5 h-3.5" />
      Spaces Available
    </span>
  );
}

/** Progress bar — colour-exact per tier */
function OccupancyBar({ lot }: { lot: LiveLot }) {
  const pct = occupancyPct(lot);
  const tier = statusTier(lot);

  const barColor =
    tier === "housefull"
      ? "bg-red-600"
      : tier === "critical"
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-sans">
        <span className="text-slate-500 font-medium">Live Occupancy</span>
        <span
          className={`font-bold tabular-nums ${
            tier === "housefull"
              ? "text-red-600"
              : tier === "critical"
              ? "text-amber-600"
              : "text-emerald-600"
          }`}
        >
          {pct}% full
        </span>
      </div>

      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Exact count string per spec */}
      <p className="text-xs font-sans font-semibold text-slate-700">
        <span
          className={
            tier === "housefull"
              ? "text-red-600"
              : tier === "critical"
              ? "text-amber-600"
              : "text-emerald-700"
          }
        >
          {lot.availableSpots} spaces remaining
        </span>{" "}
        <span className="text-slate-400 font-normal">
          out of {lot.totalSpots}
        </span>
      </p>
    </div>
  );
}

/** Individual parking lot card */
function ParkingCard({ lot, index }: { lot: LiveLot; index: number }) {
  const tier = statusTier(lot);

  const cardBorderAccent =
    tier === "housefull"
      ? "border-red-200"
      : tier === "critical"
      ? "border-amber-200"
      : "border-slate-100";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className={`bg-white rounded-2xl border ${cardBorderAccent} shadow-sm p-6 flex flex-col gap-5 hover:shadow-md transition-shadow duration-300`}
      aria-label={`${lot.name}: ${lot.availableSpots} spaces remaining`}
    >
      {/* ── Card header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-[15px] font-bold text-slate-900 font-sans leading-snug">
            {lot.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-[11px] font-sans">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{lot.address}</span>
          </div>
        </div>
        <StatusBadge lot={lot} />
      </div>

      {/* ── Occupancy bar + exact count ── */}
      <OccupancyBar lot={lot} />

      {/* ── Meta chips ── */}
      <div className="grid grid-cols-2 gap-2">
        {/* Vehicle type */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 min-h-[44px]">
          <span className="text-slate-500">
            <VehicleIcon type={lot.type} />
          </span>
          <span className="text-[11px] font-semibold text-slate-700 font-sans leading-tight">
            {lot.type}
          </span>
        </div>

        {/* Distance */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 min-h-[44px]">
          <Navigation className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px] font-semibold text-slate-700 font-sans leading-tight">
            {lot.distanceLabel}
          </span>
        </div>
      </div>

      {/* ── Shuttle notice ── */}
      {lot.shuttleAvailable && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl min-h-[44px]">
          <Bus className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-[11px] text-blue-700 font-sans font-semibold leading-tight">
            Free RTO Shuttle · departs every 15 min
          </span>
        </div>
      )}

      {/* ── Last sensor ping time ── */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-sans pt-1 border-t border-slate-50">
        <Clock className="w-3 h-3 shrink-0" />
        <span>Last gate ping: {fmtTime(lot.lastPingedAt)}</span>
      </div>
    </motion.article>
  );
}

/** Summary stat row across all visible lots */
function SummaryRow({ lots }: { lots: LiveLot[] }) {
  const totalFree = lots.reduce((s, l) => s + l.availableSpots, 0);
  const totalCapacity = lots.reduce((s, l) => s + l.totalSpots, 0);
  const openLots = lots.filter((l) => l.availableSpots > 0).length;
  const overallPct =
    totalCapacity > 0
      ? Math.round(((totalCapacity - totalFree) / totalCapacity) * 100)
      : 0;

  const stats = [
    {
      label: "Free Spaces",
      value: totalFree.toLocaleString("en-IN"),
      sub: `of ${totalCapacity.toLocaleString("en-IN")} total`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      valueColor:
        totalFree === 0
          ? "text-red-600"
          : totalFree <= 10
          ? "text-amber-600"
          : "text-emerald-600",
    },
    {
      label: "Overall Load",
      value: `${overallPct}%`,
      sub: "across all lots",
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      valueColor:
        overallPct > 85
          ? "text-red-600"
          : overallPct > 50
          ? "text-amber-600"
          : "text-emerald-600",
    },
    {
      label: "Lots Open",
      value: `${openLots}/${lots.length}`,
      sub: "accepting vehicles",
      icon: <MapPin className="w-5 h-5 text-blue-500" />,
      valueColor: openLots > 0 ? "text-blue-600" : "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col items-center text-center gap-1"
        >
          <div className="mb-1">{s.icon}</div>
          <div
            className={`text-xl sm:text-2xl font-black font-sans tabular-nums ${s.valueColor}`}
          >
            {s.value}
          </div>
          <div className="text-[10px] font-sans font-semibold text-slate-500 leading-tight">
            {s.label}
          </div>
          <div className="text-[9px] font-sans text-slate-400">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
const FILTERS: FilterType[] = ["All", "Car Only", "Bike Only"];
const POLL_INTERVAL_MS = 4000;

export default function TransportationPage() {
  const [lots, setLots] = useState<LiveLot[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── Poll /api/parking/live every 4 seconds ───────────────────────────────
  const fetchLive = useCallback(async () => {
    // Cancel any in-flight request from a previous tick
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setFetchStatus("loading");
      const res = await fetch("/api/parking/live", {
        signal: controller.signal,
        cache: "no-store",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "API returned ok:false");

      setLots(data.lots as LiveLot[]);
      setLastFetchedAt(new Date());
      setFetchStatus("ok");
      setErrorMsg(null);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setFetchStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Unknown fetch error"
      );
    }
  }, []);

  useEffect(() => {
    fetchLive(); // immediate first load
    const interval = setInterval(fetchLive, POLL_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchLive]);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const visibleLots = lots.filter((l) => filterMatches(l, activeFilter));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back link */}
        <Link
          href="/visitor-info"
          className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-slate-500 hover:text-maroon transition-colors duration-200 min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Visitor Info
        </Link>

        {/* ─── Header Panel ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5"
        >
          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black font-sans text-slate-900">
                  🅿️ Real-Time Parking Finder
                </h1>
              </div>

              <SensorActiveBadge />

              <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed max-w-lg pt-1">
                Counts sourced directly from physical infrared gate counters at
                each lot barrier. Every vehicle entry/exit updates this display
                within seconds.{" "}
                <span className="font-semibold text-maroon">
                  Maa Shoolini Fair 2026 — Solan, HP.
                </span>
              </p>
            </div>

            {/* Fetch status + timestamp */}
            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
              <ConnectionPill status={fetchStatus} />
              {lastFetchedAt && (
                <span className="text-[10px] text-slate-400 font-sans tabular-nums">
                  Updated{" "}
                  {lastFetchedAt.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Error banner */}
          <AnimatePresence>
            {fetchStatus === "error" && errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl overflow-hidden"
              >
                <WifiOff className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-700 font-sans">
                    Sensor Feed Unavailable
                  </p>
                  <p className="text-[11px] text-red-600 font-sans mt-0.5">
                    {errorMsg} — Retrying automatically every{" "}
                    {POLL_INTERVAL_MS / 1000} s.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Traffic advisory */}
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs text-amber-700 font-sans leading-relaxed">
              <span className="font-bold">Traffic Advisory:</span> Mall Road
              is closed to all vehicles 12 PM – 11 PM daily. Use designated
              lots and free RTO shuttles. Arrive early — lots fill rapidly
              during Shobha Yatra procession hours.
            </p>
          </div>
        </motion.div>

        {/* ─── Summary row ──────────────────────────────────────────────── */}
        {lots.length > 0 && <SummaryRow lots={lots} />}

        {/* ─── Filter buttons ───────────────────────────────────────────── */}
        <div
          className="flex items-center gap-2 flex-wrap"
          role="group"
          aria-label="Filter parking by vehicle type"
        >
          <span className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wide mr-1">
            Filter:
          </span>
          {FILTERS.map((f) => (
            <button
              key={f}
              id={`parking-filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold font-sans border transition-all duration-200 cursor-pointer min-h-[44px] ${
                activeFilter === f
                  ? "bg-maroon text-white border-maroon shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-maroon/40 hover:text-maroon"
              }`}
              aria-pressed={activeFilter === f}
            >
              {f === "All"
                ? "🚗🏍️  All Vehicles"
                : f === "Car Only"
                ? "🚗  Car Only"
                : "🏍️  Bike Only"}
            </button>
          ))}
        </div>

        {/* ─── Cards grid ───────────────────────────────────────────────── */}
        <AnimatePresence mode="popLayout">
          {fetchStatus === "idle" || (fetchStatus === "loading" && lots.length === 0) ? (
            /* Skeleton loading state */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 animate-pulse"
                >
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-2.5 bg-slate-100 rounded-full" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 bg-slate-100 rounded-xl" />
                    <div className="h-10 bg-slate-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleLots.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {visibleLots.map((lot, i) => (
                  <ParkingCard key={lot.parkingId} lot={lot} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center text-slate-400 font-sans text-sm"
            >
              No parking zones match this filter.
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Legend ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wide mb-3">
            Status Guide
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              {
                color: "bg-emerald-500",
                label: "Spaces Available",
                desc: "> 5 spots free",
              },
              {
                color: "bg-amber-500",
                label: "Critical",
                desc: "1 – 5 spots remaining",
                pulse: true,
              },
              {
                color: "bg-red-600",
                label: "HOUSEFULL",
                desc: "0 spots — lot closed",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-[11px] font-sans text-slate-600"
              >
                <span
                  className={`w-3 h-3 rounded-full ${item.color} shrink-0 ${
                    item.pulse ? "animate-pulse" : ""
                  }`}
                />
                <span className="font-semibold">{item.label}</span>
                <span className="text-slate-400">— {item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Footer note ──────────────────────────────────────────────── */}
        <p className="text-center text-[10px] font-sans text-slate-400 pb-6">
          Data accuracy depends on gate sensor uptime. For emergencies call
          the Mela Control Room:{" "}
          <a
            href="tel:+911792220200"
            className="font-bold text-maroon hover:underline"
          >
            +91 1792 220200
          </a>
          <br />
          RTO Shuttle Inquiry:{" "}
          <a
            href="tel:+911792220033"
            className="font-bold text-maroon hover:underline"
          >
            +91 1792 220033
          </a>
        </p>
      </div>
    </main>
  );
}
