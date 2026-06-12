/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Bike,
  Truck,
  MapPin,
  Navigation,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Wifi,
  Sparkles,
  RefreshCw,
  Sliders,
  Radio,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { PARKING_LOTS, type VehicleType, type ParkingLotConfig } from "@/lib/parkingConfig";

type FilterType = "All" | "Car Only" | "Bike Only";

interface LiveParkingZone extends ParkingLotConfig {
  parkingId: string;
  availableSpots: number;
  lastPingedAt: string | null;
  isPredictive?: boolean;
  isCommunityVerified?: boolean;
}

function getPredictiveAvailableSpots(parkingId: string, totalSpots: number, hour: number): number {
  let occupancyPct = 0.40; // Default base

  if (parkingId === "temple-lane") {
    // Peak at 10:00 AM - 2:00 PM (10 to 14): 85% occupancy.
    // Drop to 30% by late afternoon (15:00 - 20:00).
    if (hour >= 10 && hour <= 14) {
      occupancyPct = 0.85;
    } else if (hour >= 15 && hour <= 20) {
      occupancyPct = 0.30;
    } else {
      occupancyPct = 0.40;
    }
  } else if (parkingId === "thodo-ground") {
    // Peak at 4:00 PM - 10:00 PM (16 to 22): 95% occupancy (HOUSEFULL status).
    // Drop to 15% after midnight (0:00 AM to 6:00 AM).
    if (hour >= 16 && hour <= 22) {
      occupancyPct = 0.95;
    } else if (hour >= 0 && hour <= 6) {
      occupancyPct = 0.15;
    } else {
      occupancyPct = 0.50;
    }
  } else if (parkingId === "old-bus-stand") {
    // Steady high volume from 2:00 PM - 9:00 PM (14 to 21): 75%-90%.
    if (hour >= 14 && hour <= 21) {
      occupancyPct = 0.85;
    } else {
      occupancyPct = 0.50;
    }
  } else if (parkingId === "solan-bypass") {
    // Peak later in the evening (5:00 PM - 11:00 PM / 17 to 23): 80% occupancy.
    if (hour >= 17 && hour <= 23) {
      occupancyPct = 0.80;
    } else {
      occupancyPct = 0.30;
    }
  } else if (parkingId === "saproon-chowk") {
    // Peak hours: 9:00 AM - 6:00 PM: 70%
    if (hour >= 9 && hour <= 18) {
      occupancyPct = 0.70;
    } else {
      occupancyPct = 0.30;
    }
  }

  const occupied = Math.round(totalSpots * occupancyPct);
  return totalSpots - occupied;
}


// Map latitude & longitude coordinates for Solan lots
const LOT_COORDINATES: { [key: string]: [number, number] } = {
  "old-bus-stand": [30.9095, 77.1064],
  "thodo-ground": [30.9082, 77.1031],
  "solan-bypass": [30.9122, 77.0911],
  "temple-lane": [30.9038, 77.1147],
  "saproon-chowk": [30.9015, 77.0970],
};

// Traffic transit corridors coordinates
const TRAFFIC_ROUTES = {
  "route-1": {
    name: "Route 1: The Chambaghat Entry (Northern Corridor)",
    coords: [
      [30.9195, 77.1182],
      [30.9160, 77.1145],
      [30.9132, 77.1110],
      [30.9102, 77.1085],
    ] as [number, number][],
  },
  "route-2": {
    name: "Route 2: The Saproon Chowk Entry (Southern Corridor)",
    coords: [
      [30.8981, 77.1015],
      [30.9020, 77.1032],
      [30.9065, 77.1048],
      [30.9095, 77.1064],
    ] as [number, number][],
  },
  "route-3": {
    name: "Route 3: The NH-5 Outer Bypass Channel (Western Perimeter)",
    coords: [
      [30.9122, 77.0911],
      [30.9080, 77.0925],
      [30.9045, 77.0960],
      [30.9082, 77.1031],
    ] as [number, number][],
  },
  "route-4": {
    name: "Route 4: The Rajgarh Road Shortcut (New City-to-Bypass Escape Link)",
    coords: [
      [30.8975, 77.1035],
      [30.8992, 77.0998],
      [30.9015, 77.0965],
      [30.9045, 77.0960],
    ] as [number, number][],
  },
};

function calculateRouteStatuses(zones: LiveParkingZone[], hour: number) {
  const bypassZone = zones.find(z => z.parkingId === "solan-bypass");
  const busStandZone = zones.find(z => z.parkingId === "old-bus-stand");

  // Route 1: Chambaghat Entry (Northern Corridor)
  let route1 = "Green";
  if ((hour >= 9 && hour <= 11) || (hour >= 17 && hour <= 20)) {
    route1 = "Orange";
  }

  // Route 2: Saproon Chowk Entry (Southern Corridor)
  let route2 = "Green";
  if (busStandZone && busStandZone.availableSpots === 0) {
    route2 = "Red";
  } else if (hour >= 14 && hour <= 21) {
    route2 = "Orange";
  }

  // Route 3: NH-5 Outer Bypass Channel (Western Perimeter)
  let route3 = "Green";
  if ((bypassZone && bypassZone.availableSpots <= 5) || (hour >= 17 && hour <= 23)) {
    route3 = "Red";
  } else if (hour >= 12 && hour <= 16) {
    route3 = "Orange";
  }

  // Route 4: Rajgarh Road Shortcut (New City-to-Bypass Escape Link)
  let route4 = "Green";
  if (hour >= 17 && hour <= 21) {
    route4 = "Orange";
  }

  return { route1, route2, route3, route4 };
}

function VehicleIcon({ type }: { type: VehicleType }) {
  const cls = "w-4 h-4 shrink-0 text-amber-700";
  if (type === "Car Only") return <Car className={cls} />;
  if (type === "Bike Only") return <Bike className={cls} />;
  if (type === "All Vehicles") return <Truck className={cls} />;
  return (
    <span className="flex gap-0.5">
      <Car className={cls} />
      <Bike className={cls} />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ZoneCard — memoised so only the card whose zone data changed re-renders on
// each 3-second poll tick. Stable onSimulatePing / onCommunityVote props
// (from useCallback) ensure React.memo's shallow equality check actually works.
// ─────────────────────────────────────────────────────────────────────────────
interface ZoneCardProps {
  zone: LiveParkingZone;
  onSimulatePing: (parkingId: string, event: "INFLOW" | "OUTFLOW") => void;
  onCommunityVote: (
    parkingId: string,
    event: "COMMUNITY_EMPTY" | "COMMUNITY_FULL" | "COMMUNITY_ALMOST_FULL"
  ) => void;
}

const ZoneCard = memo(function ZoneCard({
  zone,
  onSimulatePing,
  onCommunityVote,
}: ZoneCardProps) {
  const available = zone.availableSpots;
  const capacity = zone.totalSpots;
  const occupied = capacity - available;
  const pct = Math.round((occupied / capacity) * 100);

  let statusBadge = "Spaces Available";
  let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
  let progressColor = "bg-emerald-500";

  if (available === 0) {
    statusBadge = "HOUSEFULL";
    badgeClass = "bg-rose-600 text-white border-rose-600";
    progressColor = "bg-rose-600";
  } else if (available > 0 && available <= 5) {
    statusBadge = `CRITICAL: Only ${available} Left!`;
    badgeClass = "bg-amber-50 text-amber-700 border-amber-200/50";
    progressColor = "bg-orange-500";
  }

  return (
    <div
      className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4
                 transform-gpu will-change-transform
                 hover:shadow-md transition-[box-shadow] duration-300
                 ease-[cubic-bezier(0.25,1,0.5,1)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-serif font-black text-red-950">{zone.name}</h3>
          <span className="text-[10px] text-stone-500 block truncate mt-0.5">{zone.address}</span>
          <div className="mt-2 flex flex-wrap gap-1">
            {zone.isCommunityVerified ? (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                👥 Community Verified
              </span>
            ) : zone.isPredictive ? (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                🕒 Predictive Traffic Estimate
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/50 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                📡 Automated Ground Counts Active
              </span>
            )}
          </div>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider border uppercase ${badgeClass}`}>
          {statusBadge}
        </span>
      </div>

      <p className="text-stone-600 text-[11px] leading-relaxed">{zone.description}</p>

      {/* GPU-composited progress bar — scaleX avoids layout recalculation on every poll tick */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-bold text-stone-500">
          <span>Lot Capacity Occupancy</span>
          <span>{available === 0 ? 100 : pct}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${progressColor} transform-gpu will-change-transform transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] origin-left`}
            style={{ transform: `scaleX(${(available === 0 ? 100 : pct) / 100})` }}
          />
        </div>
        <div className="flex items-center justify-between text-[9px] text-stone-400 font-semibold">
          <span>{available} free spots</span>
          <span>{capacity} total spots</span>
        </div>
      </div>

      {/* Meta Row & Entry Details */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold pt-1">
        <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-xl border border-slate-100">
          <VehicleIcon type={zone.type} />
          <span className="truncate">{zone.type}</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-xl border border-slate-100">
          <Navigation className="w-3.5 h-3.5 text-stone-400" />
          <span className="truncate">{zone.distanceLabel}</span>
        </div>
      </div>

      {/* Access point route entry */}
      <div className="flex gap-2 p-2.5 bg-amber-50/20 border border-amber-200/20 rounded-xl text-[10px] font-semibold text-stone-700 leading-snug">
        <ArrowRight className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block">Official Gate Access Link</span>
          <span className="text-amber-900">{zone.routeEntry}</span>
        </div>
      </div>

      {/* Community Voting Panel */}
      <div className="bg-stone-50 border border-stone-100 rounded-xl p-3 space-y-2">
        <span className="text-[10px] font-sans font-bold text-stone-600 block">
          Are you physically here? Help other drivers!
        </span>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onCommunityVote(zone.parkingId, "COMMUNITY_EMPTY")}
            className="flex-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer text-center"
          >
            🟢 Looking Empty
          </button>
          <button
            onClick={() => onCommunityVote(zone.parkingId, "COMMUNITY_ALMOST_FULL")}
            className="flex-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer text-center"
          >
            🟡 Almost Full
          </button>
          <button
            onClick={() => onCommunityVote(zone.parkingId, "COMMUNITY_FULL")}
            className="flex-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[10px] font-bold py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer text-center"
          >
            🔴 Looking Full!
          </button>
        </div>
      </div>

      {/* Last Sensor Ping Timestamp */}
      {zone.lastPingedAt && (
        <div className="text-[9px] font-mono text-stone-400 text-right">
          Last ping:{" "}
          {new Date(zone.lastPingedAt).toLocaleTimeString("en-IN", { hour12: false })}
        </div>
      )}
    </div>
  );
});

export default function ParkingFinder() {
  const [zones, setZones] = useState<LiveParkingZone[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [simulatorStatus, setSimulatorStatus] = useState<string | null>(null);
  // Bottom-sheet drawer state for mobile — collapsed = advisory only, expanded = full cards
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const polylinesRef = useRef<any[]>([]);
  // AbortController ref — cancels in-flight requests before each new poll tick
  const abortRef = useRef<AbortController | null>(null);

  // Memoised — route status only recomputes when zone data or timestamp changes,
  // not on every isSimulatorOpen / simulatorStatus state update
  const statuses = useMemo(
    () =>
      calculateRouteStatuses(
        zones,
        lastUpdated ? lastUpdated.getHours() : new Date().getHours()
      ),
    [zones, lastUpdated]
  );

  // Initialize and load Leaflet CSS & JS dynamically (Client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Inject CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.id = "leaflet-css";
    if (!document.getElementById("leaflet-css")) {
      document.head.appendChild(link);
    }

    // Inject JS script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.id = "leaflet-js";
    script.onload = () => {
      setIsLeafletLoaded(true);
    };
    if (!document.getElementById("leaflet-js")) {
      document.body.appendChild(script);
    } else {
      setIsLeafletLoaded(true);
    }

    return () => {
      // Clean up map instance on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Stable fetch function — AbortController cancels previous in-flight request
  // before each new tick so stale responses never overwrite fresh data
  const fetchLiveParking = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/parking/live", {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch live parking feeds");
      const data = await res.json();
      if (data.ok && Array.isArray(data.lots)) {
        setZones(data.lots);
        setError(null);
      } else {
        throw new Error(data.error || "Malformed live data response");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Error fetching live parking data:", err);
      setError("Unable to sync live parking feeds. Showing cached values.");
      // Functional updater: only populate fallback when zones is still empty
      setZones((prev) => {
        if (prev.length > 0) return prev;
        const hour = new Date().getHours();
        return PARKING_LOTS.map((lot) => ({
          ...lot,
          parkingId: lot.id,
          availableSpots: getPredictiveAvailableSpots(lot.id, lot.totalSpots, hour),
          lastPingedAt: null,
          isPredictive: true,
          isCommunityVerified: false,
        }));
      });
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  }, []);

  // Visibility-aware polling — pauses when tab is hidden to prevent background
  // fetch storms that cause UI stuttering when the user switches back on mobile
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const startPolling = () => {
      fetchLiveParking();
      intervalId = setInterval(fetchLiveParking, 3000);
    };

    const stopPolling = () => {
      clearInterval(intervalId);
      abortRef.current?.abort();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stopPolling();
      else startPolling();
    };

    startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchLiveParking]);

  // Initialize and redraw Leaflet Map & markers when Leaflet is ready or data updates
  useEffect(() => {
    const L = (window as any).L;
    if (!isLeafletLoaded || !L || zones.length === 0) return;

    // 1. Initialize Map container — pick the visible container based on viewport.
    //    Mobile (<lg) uses solan-map-mobile; desktop uses solan-map-desktop.
    //    We destroy and re-create if the active container changes (e.g. on resize).
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const containerId = isMobile ? "solan-map-mobile" : "solan-map-desktop";
    const containerEl = document.getElementById(containerId);

    if (!containerEl) return; // container not yet in DOM (wrong breakpoint branch)

    // If map already exists but is attached to a different container, destroy it
    if (mapRef.current && mapRef.current.getContainer().id !== containerId) {
      mapRef.current.remove();
      mapRef.current = null;
      markersRef.current = {};
      polylinesRef.current = [];
    }

    if (!mapRef.current) {
      mapRef.current = L.map(containerId, {
        zoomControl: false,
        attributionControl: false,
        // GPU canvas rendering — avoids hundreds of SVG DOM nodes on mobile
        preferCanvas: true,
      }).setView([30.9082, 77.1031], 14);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 20
      }).addTo(mapRef.current);

      // Zoom controls top-right — avoids overlap with mobile notch and bottom drawer
      L.control.zoom({ position: "topright" }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear old polylines
    polylinesRef.current.forEach((pl) => map.removeLayer(pl));
    polylinesRef.current = [];

    // Calculate route statuses
    const nowTemp = new Date();
    const hourTemp = nowTemp.getHours();
    const statuses = calculateRouteStatuses(zones, hourTemp);

    // Draw Route 1
    const route1Color = statuses.route1 === "Red" ? "#EF4444" : statuses.route1 === "Orange" ? "#F59E0B" : "#10B981";
    const route1Weight = statuses.route1 === "Red" ? 7 : 6;
    const route1Polyline = L.polyline(TRAFFIC_ROUTES["route-1"].coords, {
      color: route1Color,
      weight: route1Weight,
      opacity: 0.85,
      dashArray: statuses.route1 === "Red" ? "10, 15" : undefined,
      className: statuses.route1 === "Red" ? "animate-pulse" : undefined,
    }).addTo(map);
    route1Polyline.bindTooltip("Route 1: Chambaghat Entry", { permanent: true, direction: "center", className: "leaflet-route-tooltip" });
    polylinesRef.current.push(route1Polyline);

    // Draw Route 2
    const route2Color = statuses.route2 === "Red" ? "#EF4444" : statuses.route2 === "Orange" ? "#F59E0B" : "#10B981";
    const route2Weight = statuses.route2 === "Red" ? 7 : 6;
    const route2Polyline = L.polyline(TRAFFIC_ROUTES["route-2"].coords, {
      color: route2Color,
      weight: route2Weight,
      opacity: 0.85,
      dashArray: statuses.route2 === "Red" ? "10, 15" : undefined,
      className: statuses.route2 === "Red" ? "animate-pulse" : undefined,
    }).addTo(map);
    route2Polyline.bindTooltip("Route 2: Saproon Chowk Entry", { permanent: true, direction: "center", className: "leaflet-route-tooltip" });
    polylinesRef.current.push(route2Polyline);

    // Draw Route 3
    const route3Color = statuses.route3 === "Red" ? "#EF4444" : statuses.route3 === "Orange" ? "#F59E0B" : "#10B981";
    const route3Weight = statuses.route3 === "Red" ? 7 : 6;
    const route3Polyline = L.polyline(TRAFFIC_ROUTES["route-3"].coords, {
      color: route3Color,
      weight: route3Weight,
      opacity: 0.85,
      dashArray: statuses.route3 === "Red" ? "10, 15" : undefined,
      className: statuses.route3 === "Red" ? "animate-pulse" : undefined,
    }).addTo(map);
    route3Polyline.bindTooltip("Route 3: NH-5 Outer Bypass", { permanent: true, direction: "center", className: "leaflet-route-tooltip" });
    polylinesRef.current.push(route3Polyline);

    // Draw Route 4
    const route4Color = statuses.route4 === "Red" ? "#EF4444" : statuses.route4 === "Orange" ? "#F59E0B" : "#10B981";
    const route4Weight = statuses.route4 === "Red" ? 7 : 6;
    const route4Polyline = L.polyline(TRAFFIC_ROUTES["route-4"].coords, {
      color: route4Color,
      weight: route4Weight,
      opacity: 0.85,
      dashArray: statuses.route4 === "Red" ? "10, 15" : undefined,
      className: statuses.route4 === "Red" ? "animate-pulse" : undefined,
    }).addTo(map);
    const route4TooltipText = statuses.route4 === "Green" 
      ? "Rajgarh Road Shortcut - Highly Recommended Exit" 
      : "Rajgarh Road Shortcut";
    route4Polyline.bindTooltip(route4TooltipText, { permanent: true, direction: "center", className: "leaflet-route-tooltip" });
    polylinesRef.current.push(route4Polyline);

    // 2. Loop through zones and render custom pulsing markers
    zones.forEach((zone) => {
      const coords = LOT_COORDINATES[zone.parkingId];
      if (!coords) return;

      const available = zone.availableSpots;
      const total = zone.totalSpots;
      
      // Calculate occupied percentages
      const occupied = total - available;
      const pct = Math.round((occupied / total) * 100);

      // Marker Color Metrics
      let colorClass = "emerald";
      let statusLabel = "AVAILABLE";
      if (available === 0) {
        colorClass = "rose";
        statusLabel = "HOUSEFULL";
      } else if (available > 0 && available <= 5) {
        colorClass = "orange";
        statusLabel = "CRITICAL";
      }

      // Create Custom Pulse DivIcon
      const markerHtml = 
        colorClass === "rose" 
          ? `<div class="relative flex items-center justify-center w-7 h-7 bg-red-600 rounded-full border-2 border-white shadow-md text-[7px] font-black text-white hover:scale-110 transition-all duration-300">
               <span>FULL</span>
               <span class="absolute -inset-0.5 rounded-full border border-red-500 animate-pulse"></span>
             </div>`
          : colorClass === "orange"
          ? `<div class="relative flex items-center justify-center w-7 h-7 bg-orange-500 rounded-full border-2 border-white shadow-md text-[10px] font-sans font-black text-white hover:scale-110 transition-all duration-300">
               <span>${available}</span>
               <span class="absolute -inset-1.5 rounded-full border border-orange-400 animate-ping opacity-75"></span>
             </div>`
          : `<div class="relative flex items-center justify-center w-7 h-7 bg-emerald-500 rounded-full border-2 border-white shadow-md text-[10px] font-sans font-black text-white hover:scale-110 transition-all duration-300">
               <span>${available}</span>
               <span class="absolute -inset-0.5 rounded-full border border-emerald-400 animate-ping opacity-30"></span>
             </div>`;

      const customIcon = L.divIcon({
        className: "custom-pulse-marker",
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      // Source badge HTML for Leaflet popup
      let sourceLabelHtml = `<span style="display: inline-block; padding: 2px 4px; border-radius: 3px; font-size: 8px; font-weight: bold; background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; text-transform: uppercase;">📡 Automated Ground Counts Active</span>`;
      if (zone.isCommunityVerified) {
        sourceLabelHtml = `<span style="display: inline-block; padding: 2px 4px; border-radius: 3px; font-size: 8px; font-weight: bold; background: #fffbeb; border: 1px solid #fde68a; color: #b45309; text-transform: uppercase;">👥 Community Verified</span>`;
      } else if (zone.isPredictive) {
        sourceLabelHtml = `<span style="display: inline-block; padding: 2px 4px; border-radius: 3px; font-size: 8px; font-weight: bold; background: #fffbeb; border: 1px solid #fde68a; color: #b45309; text-transform: uppercase;">🕒 Predictive Traffic Estimate</span>`;
      }

      const votingPanelHtml = `
        <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #f3f4f6; display: flex; flex-direction: column; gap: 4px;">
          <span style="font-size: 9px; font-weight: bold; color: #4b5563; display: block;">Are you physically here? Help other drivers!</span>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            <button 
              onclick="if(window.handleCommunityVote){window.handleCommunityVote('${zone.parkingId}', 'COMMUNITY_EMPTY')}"
              style="flex: 1; min-width: 45px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; font-size: 8px; font-weight: bold; padding: 4px 6px; border-radius: 4px; cursor: pointer; text-align: center; white-space: nowrap;"
            >
              🟢 Empty
            </button>
            <button 
              onclick="if(window.handleCommunityVote){window.handleCommunityVote('${zone.parkingId}', 'COMMUNITY_ALMOST_FULL')}"
              style="flex: 1.2; min-width: 60px; background: #fffbeb; border: 1px solid #fde68a; color: #92400e; font-size: 8px; font-weight: bold; padding: 4px 6px; border-radius: 4px; cursor: pointer; text-align: center; white-space: nowrap;"
            >
              🟡 Almost Full
            </button>
            <button 
              onclick="if(window.handleCommunityVote){window.handleCommunityVote('${zone.parkingId}', 'COMMUNITY_FULL')}"
              style="flex: 1; min-width: 45px; background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239; font-size: 8px; font-weight: bold; padding: 4px 6px; border-radius: 4px; cursor: pointer; text-align: center; white-space: nowrap;"
            >
              🔴 Full
            </button>
          </div>
        </div>
      `;

      // Render or Update Marker
      if (markersRef.current[zone.parkingId]) {
        const marker = markersRef.current[zone.parkingId];
        marker.setIcon(customIcon);
        
        // Update popup info on the fly
        const updatedPopupContent = `
          <div class="font-sans p-2 space-y-1.5 text-stone-900 min-w-[170px]">
            <h4 class="font-serif font-black text-xs uppercase border-b pb-1 border-stone-100 text-red-950">${zone.name}</h4>
            <div class="text-[10px] leading-relaxed space-y-1">
              <span class="block"><b>Status:</b> ${statusLabel}</span>
              <span class="block"><b>Free Spots:</b> ${available} of ${total}</span>
              <div style="margin-top: 2px; margin-bottom: 2px;">${sourceLabelHtml}</div>
              <span class="block text-stone-500"><b>Address:</b> ${zone.address}</span>
            </div>
            ${votingPanelHtml}
          </div>
        `;
        marker.getPopup().setContent(updatedPopupContent);
      } else {
        const popupContent = `
          <div class="font-sans p-2 space-y-1.5 text-stone-900 min-w-[170px]">
            <h4 class="font-serif font-black text-xs uppercase border-b pb-1 border-stone-100 text-red-950">${zone.name}</h4>
            <div class="text-[10px] leading-relaxed space-y-1">
              <span class="block"><b>Status:</b> ${statusLabel}</span>
              <span class="block"><b>Free Spots:</b> ${available} of ${total}</span>
              <div style="margin-top: 2px; margin-bottom: 2px;">${sourceLabelHtml}</div>
              <span class="block text-stone-500"><b>Address:</b> ${zone.address}</span>
            </div>
            ${votingPanelHtml}
          </div>
        `;
        const marker = L.marker(coords, { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent, { closeButton: false });
        
        markersRef.current[zone.parkingId] = marker;
      }
    });
  }, [isLeafletLoaded, zones]);

  // Stable callback — passed down to ZoneCard memo; must not change on re-renders
  const handleSimulatePing = useCallback(async (parkingId: string, event: "INFLOW" | "OUTFLOW") => {
    setSimulatorStatus(`Pinging gate sensor for ${parkingId}...`);
    try {
      const res = await fetch("/api/parking/sensor-ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parkingId, event }),
      });
      const data = await res.json();
      if (data.ok) {
        setSimulatorStatus(`Sensor Ping Success! ${event} registered. Available: ${data.availableSpots}`);
        setZones((prev) =>
          prev.map((zone) =>
            zone.parkingId === parkingId
              ? { ...zone, availableSpots: data.availableSpots, lastPingedAt: data.lastPingedAt }
              : zone
          )
        );
      } else {
        setSimulatorStatus(`Emulator Failed: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setSimulatorStatus("Failed to communicate with sensor API.");
    }
  }, []);

  // Handle community feedback vote posting to /api/parking/sensor-ping
  const handleCommunityVote = React.useCallback(async (parkingId: string, event: "COMMUNITY_EMPTY" | "COMMUNITY_FULL" | "COMMUNITY_ALMOST_FULL") => {
    try {
      const res = await fetch("/api/parking/sensor-ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parkingId, event }),
      });
      const data = await res.json();
      if (data.ok) {
        // Instantly update the UI local state for awesome responsiveness
        setZones((prev) =>
          prev.map((zone) =>
            zone.parkingId === parkingId
              ? {
                  ...zone,
                  availableSpots: data.availableSpots,
                  lastPingedAt: data.lastPingedAt,
                  isCommunityVerified: true,
                  isPredictive: false,
                }
              : zone
          )
        );
      }
    } catch (err) {
      console.error("Error submitting community report:", err);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).handleCommunityVote = handleCommunityVote;
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).handleCommunityVote;
      }
    };
  }, [handleCommunityVote]);

  // Memoised — prevents re-filtering on isSimulatorOpen toggles and simulatorStatus updates
  const filteredZones = useMemo(() => zones.filter((zone) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Car Only") {
      return zone.type === "Car Only" || zone.type === "All Vehicles" || zone.type === "Car & Bike";
    }
    if (activeFilter === "Bike Only") {
      return zone.type === "Bike Only" || zone.type === "All Vehicles" || zone.type === "Car & Bike";
    }
    return true;
  }), [zones, activeFilter]);

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          MOBILE LAYOUT  (hidden on lg+)
          Full-screen map + sliding bottom-sheet drawer
      ════════════════════════════════════════════════════════════════ */}
      <div className="block lg:hidden relative w-full" style={{ height: "calc(100vh - 64px)" }}>

        {/* Decorative blobs — pointer-events off so they never steal touches */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none z-0" />

        {/* ── Full-screen Leaflet map ── */}
        <div
          id="solan-map-mobile"
          className="absolute inset-0 w-full h-full z-0"
          style={{ background: "#f5f3f0" }}
        >
          {!isLeafletLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-stone-100 z-10">
              <div className="w-8 h-8 border-[3px] border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-stone-500 font-serif">Initializing Solan Map...</p>
            </div>
          )}
        </div>

        {/* ── Floating header strip over the map ── */}
        <div className="absolute top-0 left-0 right-0 z-[500] px-4 pt-3 pb-2 flex items-center justify-between gap-3 bg-gradient-to-b from-white/90 to-white/0 backdrop-blur-[2px]">
          <div className="flex items-center gap-2">
            <Link
              href="/visitor-info"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 border border-slate-200 shadow-sm text-stone-600"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-sm font-serif font-black text-red-950">🅿️ Live Parking</span>
          </div>

          {/* Live status pill */}
          <div className="inline-flex items-center gap-1.5 bg-white/90 border border-blue-200/60 px-3 py-1.5 rounded-full text-[9px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
            </span>
            Live
          </div>
        </div>

        {/* ── Bottom sheet drawer ── */}
        <AnimatePresence initial={false}>
          <motion.div
            key="mobile-drawer"
            initial={{ y: "calc(100% - 120px)" }}
            animate={{ y: isDrawerOpen ? 0 : "calc(100% - 120px)" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.09)] flex flex-col"
            style={{ maxHeight: "calc(100vh - 64px - 48px)" }}
          >
            {/* Drag pill + tap-to-toggle */}
            <button
              className="w-full flex flex-col items-center pt-2 pb-1 cursor-pointer focus:outline-none min-h-[44px]"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label={isDrawerOpen ? "Collapse drawer" : "Expand drawer"}
            >
              <div className="w-12 h-1 bg-slate-200 rounded-full mb-1" />
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pb-1">
                {isDrawerOpen ? "▾ Collapse" : "▴ Route Info"}
              </span>
            </button>

            {/* ── Collapsed preview: Advisory + 4-route chips ── */}
            <div className="px-5 pb-3 space-y-3 border-b border-slate-100">
              {/* 4-route traffic chips */}
              <div className="grid grid-cols-2 gap-2">
                {([
                  { key: "route1", label: "Chambaghat", status: statuses.route1 },
                  { key: "route2", label: "Saproon", status: statuses.route2 },
                  { key: "route3", label: "NH-5 Bypass", status: statuses.route3 },
                  { key: "route4", label: "Rajgarh Link", status: statuses.route4 },
                ] as const).map(({ key, label, status }) => (
                  <div key={key} className="flex items-center gap-2 px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-100/60 min-h-[44px]">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        status === "Red" ? "bg-red-500 animate-pulse" : status === "Orange" ? "bg-orange-400" : "bg-emerald-500"
                      }`}
                    />
                    <div className="min-w-0">
                      <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block truncate">{label}</span>
                      <span className="text-xs font-black text-stone-700">{status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Smart advisory banner */}
              <div className={`px-3 py-2.5 rounded-xl border text-xs font-medium font-sans leading-relaxed ${
                (statuses.route2 === "Red" && statuses.route3 === "Red")
                  ? "bg-red-50/70 border-red-100 text-red-800"
                  : (statuses.route2 === "Red" || statuses.route3 === "Red")
                  ? "bg-amber-50/70 border-amber-200/50 text-amber-900"
                  : "bg-emerald-50/70 border-emerald-100 text-emerald-800"
              }`}>
                {statuses.route2 === "Red" && statuses.route3 === "Red"
                  ? "⚠️ High congestion on main corridors. Use bypass routes & free shuttle."
                  : statuses.route2 === "Red"
                  ? "⚠️ Saproon entry congested. Consider Solan Bypass + RTO shuttle."
                  : statuses.route3 === "Red"
                  ? "⚠️ NH-5 Bypass gridlocked. Enter via Chambaghat for faster access."
                  : "🟢 All entry corridors flowing normally. Parking accessible."}
              </div>
            </div>

            {/* ── Expanded content: Filter tabs + Zone cards ── */}
            {isDrawerOpen && (
              <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4 space-y-4">
                {/* Vehicle filter buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {(["All", "Car Only", "Bike Only"] as FilterType[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-4 rounded-xl text-xs font-bold font-sans border transition-all duration-200 cursor-pointer shadow-sm min-h-[44px] ${
                        activeFilter === f
                          ? "bg-amber-600 border-amber-600 text-white"
                          : "bg-white text-stone-600 border-slate-200 hover:border-amber-400"
                      }`}
                    >
                      {f === "All" ? "🚗 All" : f === "Car Only" ? "🚗 Cars" : "🏍️ Bikes"}
                    </button>
                  ))}
                </div>

                {/* Zone lot cards */}
                <div className="space-y-4">
                  {filteredZones.map((zone) => (
                    <ZoneCard
                      key={zone.parkingId}
                      zone={zone}
                      onSimulatePing={handleSimulatePing}
                      onCommunityVote={handleCommunityVote}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Leaflet tooltip CSS — injected once per mount */}
        <style dangerouslySetInnerHTML={{ __html: `
          .leaflet-route-tooltip {
            background-color: rgba(30, 41, 59, 0.9) !important;
            border: 1px solid rgba(255,255,255,0.15) !important;
            border-radius: 4px !important;
            color: #ffffff !important;
            font-size: 8px !important;
            font-weight: 800 !important;
            padding: 2px 4px !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
            white-space: nowrap !important;
            pointer-events: none !important;
          }
          .leaflet-tooltip-left:before, .leaflet-tooltip-right:before { border: none !important; }
          .custom-pulse-marker { background: transparent !important; border: none !important; }
        `}} />
      </div>

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT  (hidden below lg)
          Traditional 3-column scrollable page
      ════════════════════════════════════════════════════════════════ */}
      <section className="hidden lg:block min-h-screen bg-[#fcfbf9] py-8 px-6 relative overflow-hidden">
        {/* Decorative background vectors */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">

          {/* Back navigation */}
          <Link
            href="/visitor-info"
            className="inline-flex items-center gap-2 text-xs font-sans font-bold text-stone-500 hover:text-red-950 transition-colors duration-200 min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Logistics Guide
          </Link>

          {/* ─── Header Panel ─── */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 xl:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/60 px-4 py-1.5 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                  </span>
                  REAL-TIME SENSOR STREAM DEPLOYED
                </div>
                <h1 className="text-3xl xl:text-4xl font-serif font-black text-red-950">
                  🅿️ Live Map Traffic &amp; Parking Tracker
                </h1>
                <p className="text-stone-600 text-sm font-sans leading-relaxed max-w-3xl">
                  Observe live vehicle entries and exits mapped in real-time across Solan. Use the Developer Sensor Simulator to trigger hardware inflow/outflow events and watch the map popups and stats recompute instantly.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/50 p-2.5 rounded-xl shrink-0 self-start text-[11px] font-sans font-semibold text-stone-500 shadow-sm min-h-[44px]">
                <Wifi className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {lastUpdated ? (
                  <span>Last Poll: {lastUpdated.toLocaleTimeString("en-IN", { hour12: false })}</span>
                ) : (
                  <span>Connecting…</span>
                )}
                <button
                  onClick={fetchLiveParking}
                  className="hover:text-red-950 p-1 cursor-pointer transition-transform duration-300 hover:rotate-180 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Refresh data"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200/60 rounded-2xl">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block font-serif">Traffic Advisory</span>
                <p className="text-xs text-amber-700 font-sans leading-relaxed">
                  Central Mall Road is strictly pedestrian-only from 12:00 PM – 11:00 PM. Follow the designated access routes (highlighted inside cards) to bypass city gridlocks.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Desktop 3-column grid: map (2 cols) + panel (1 col) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* ── Left: Map (spans 2 of 3 cols) ── */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3">
                <div
                  id="solan-map-desktop"
                  className="w-full h-[480px] xl:h-[560px] rounded-2xl overflow-hidden relative z-0"
                  style={{ background: "#f5f3f0" }}
                >
                  {!isLeafletLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-stone-100 rounded-2xl z-10">
                      <div className="w-8 h-8 border-[3px] border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-stone-500 font-serif">Initializing Solan Map Coordinates...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Map marker legend */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap justify-between items-center gap-3">
                <span className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest">Map Markers:</span>
                <div className="flex flex-wrap gap-4">
                  {[
                    { color: "bg-emerald-500", label: "Available (> 5 spots)" },
                    { color: "bg-orange-500", label: "Critical (1-5 left)" },
                    { color: "bg-rose-600", label: "HOUSEFULL" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-[10px] font-sans font-bold text-stone-600">
                      <span className={`w-3.5 h-3.5 rounded-full ${item.color} border-2 border-white shadow-sm shrink-0`} />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Routing Assistant */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <h3 className="font-serif font-black text-sm text-red-950 uppercase tracking-wider">
                    🎯 Shoolini Fair Smart Routing Assistant
                  </h3>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                  {([
                    { key: "route1", label: "Route 1: Chambaghat", status: statuses.route1 },
                    { key: "route2", label: "Route 2: Saproon", status: statuses.route2 },
                    { key: "route3", label: "Route 3: NH-5 Bypass", status: statuses.route3 },
                    { key: "route4", label: "Route 4: Rajgarh Shortcut", status: statuses.route4 },
                  ] as const).map(({ key, label, status }) => (
                    <div key={key} className="p-3 bg-stone-50 rounded-xl border border-stone-100/50 space-y-1.5 min-h-[44px]">
                      <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider truncate">{label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          status === "Red" ? "bg-red-500 animate-pulse" : status === "Orange" ? "bg-orange-500" : "bg-emerald-500"
                        }`} />
                        <span className="text-xs font-black text-stone-700">{status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dynamic advisory */}
                <div className={`p-4 rounded-xl border text-xs font-medium font-sans leading-relaxed ${
                  (statuses.route1 === "Red" && statuses.route2 === "Red" && statuses.route3 === "Red") || (statuses.route2 === "Red" && statuses.route3 === "Red")
                    ? "bg-red-50/60 border-red-100 text-red-800"
                    : statuses.route2 === "Red" || statuses.route3 === "Red"
                    ? "bg-amber-50/60 border-amber-200/50 text-amber-900"
                    : "bg-emerald-50/60 border-emerald-100 text-emerald-800"
                }`}>
                  {(() => {
                    const saproonRed = statuses.route2 === "Red";
                    const busFull = zones.find(z => z.parkingId === "old-bus-stand")?.availableSpots === 0;
                    const rajgarhGreen = statuses.route4 === "Green";
                    if (saproonRed && busFull && rajgarhGreen) return (
                      <div className="flex gap-2"><Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                        <span>🎯 <b>Smart Route Advice:</b> Bottleneck at Old Bus Stand. Use Rajgarh Road Bypass — bypasses Mall Road entirely onto clear NH-5.</span></div>
                    );
                    if (statuses.route1 === "Red" && statuses.route2 === "Red" && statuses.route3 === "Red") return (
                      <div className="flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                        <span>🚘 <b>Peak Festival Rush:</b> High congestion on all entry gates. Use outer bypass lots and free RTO shuttles.</span></div>
                    );
                    if (statuses.route3 === "Red" && statuses.route1 === "Green") return (
                      <div className="flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                        <span>⚠️ <b>Traffic Alert:</b> NH-5 Bypass gridlocked. Divert via Chambaghat Chowk for faster access.</span></div>
                    );
                    if (statuses.route2 === "Red") return (
                      <div className="flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                        <span>⚠️ <b>Traffic Alert:</b> Saproon Entry congested. Park at Bypass Mega Overflow and take the free RTO shuttle.</span></div>
                    );
                    return (
                      <div className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                        <span>🟢 <b>Traffic Flow Normal:</b> All primary entry routes into Solan Mall Road are clear and accessible.</span></div>
                    );
                  })()}
                </div>

                {/* Leaflet tooltip styles */}
                <style dangerouslySetInnerHTML={{ __html: `
                  .leaflet-route-tooltip {
                    background-color: rgba(30, 41, 59, 0.9) !important;
                    border: 1px solid rgba(255, 255, 255, 0.15) !important;
                    border-radius: 4px !important;
                    color: #ffffff !important;
                    font-size: 8px !important;
                    font-weight: 800 !important;
                    padding: 2px 4px !important;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
                    white-space: nowrap !important;
                    pointer-events: none !important;
                  }
                  .leaflet-tooltip-left:before, .leaflet-tooltip-right:before { border: none !important; }
                  .custom-pulse-marker { background: transparent !important; border: none !important; }
                `}} />
              </div>
            </div>

            {/* ── Right panel: Filter + Simulator + Zone cards ── */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto">

              {/* Filter + Simulator trigger row */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {(["All", "Car Only", "Bike Only"] as FilterType[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-3 rounded-xl text-xs font-bold font-sans border transition-all duration-200 cursor-pointer shadow-sm min-h-[44px] ${
                        activeFilter === f
                          ? "bg-amber-600 border-amber-600 text-white"
                          : "bg-white text-stone-600 border-slate-100 hover:border-amber-400"
                      }`}
                    >
                      {f === "All" ? "🚗 All" : f === "Car Only" ? "🚗 Cars" : "🏍️ Bikes"}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
                  className={`flex items-center gap-2 px-3 rounded-xl text-xs font-extrabold font-sans border cursor-pointer shadow-sm transition-all duration-200 min-h-[44px] ${
                    isSimulatorOpen
                      ? "bg-slate-900 border-slate-900 text-amber-400 font-black"
                      : "bg-white text-stone-700 border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 shrink-0" />
                  <span>Sensor Emulator</span>
                </button>
              </div>

              {/* Collapsible Simulator Panel */}
              <AnimatePresence>
                {isSimulatorOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md space-y-4 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                      <h3 className="font-serif font-black text-xs text-amber-400 uppercase tracking-widest">Developer Sensor Simulator</h3>
                    </div>

                    {simulatorStatus && (
                      <div className="text-[10px] font-mono text-emerald-400 bg-black/40 p-2 rounded-lg border border-slate-800">
                        {simulatorStatus}
                      </div>
                    )}

                    <div className="space-y-3 divide-y divide-slate-800/50">
                      {zones.map((zone) => (
                        <div key={zone.parkingId} className="flex items-center justify-between gap-3 pt-3 first:pt-0">
                          <span className="text-[11px] font-serif font-black truncate max-w-[140px] xl:max-w-[160px]">{zone.name}</span>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleSimulatePing(zone.parkingId, "INFLOW")}
                              className="bg-red-900/40 border border-red-800/80 hover:bg-red-900/60 active:scale-95 text-red-200 text-[10px] font-bold px-2.5 min-h-[44px] rounded-lg cursor-pointer transition-all"
                            >
                              +IN
                            </button>
                            <button
                              onClick={() => handleSimulatePing(zone.parkingId, "OUTFLOW")}
                              className="bg-emerald-900/40 border border-emerald-800/80 hover:bg-emerald-900/60 active:scale-95 text-emerald-200 text-[10px] font-bold px-2.5 min-h-[44px] rounded-lg cursor-pointer transition-all"
                            >
                              −OUT
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Zone lot cards */}
              <div className="space-y-4">
                {filteredZones.map((zone) => (
                  <ZoneCard
                    key={zone.parkingId}
                    zone={zone}
                    onSimulatePing={handleSimulatePing}
                    onCommunityVote={handleCommunityVote}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

