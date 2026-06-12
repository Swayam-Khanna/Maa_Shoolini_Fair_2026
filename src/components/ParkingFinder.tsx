/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useRef } from "react";
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

export default function ParkingFinder() {
  const [zones, setZones] = useState<LiveParkingZone[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [simulatorStatus, setSimulatorStatus] = useState<string | null>(null);

  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const pollerRef = useRef<NodeJS.Timeout | null>(null);
  const polylinesRef = useRef<any[]>([]);

  const statuses = calculateRouteStatuses(zones, lastUpdated ? lastUpdated.getHours() : new Date().getHours());

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

  // Fetch live database values from Next.js API route /api/parking/live
  const fetchLiveParking = async () => {
    try {
      const res = await fetch("/api/parking/live");
      if (!res.ok) throw new Error("Failed to fetch live parking feeds");
      const data = await res.json();
      if (data.ok && Array.isArray(data.lots)) {
        setZones(data.lots);
        setError(null);
      } else {
        throw new Error(data.error || "Malformed live data response");
      }
    } catch (err) {
      console.error("Error fetching live parking data:", err);
      setError("Unable to sync live parking feeds. Showing cached values.");
      
      // Fallback
      if (zones.length === 0) {
        const now = new Date();
        const hour = now.getHours();
        const fallback = PARKING_LOTS.map((lot) => ({
          ...lot,
          parkingId: lot.id,
          availableSpots: getPredictiveAvailableSpots(lot.id, lot.totalSpots, hour),
          lastPingedAt: null,
          isPredictive: true,
          isCommunityVerified: false,
        }));
        setZones(fallback);
      }
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  };

  // Start the 3-second database polling pipeline
  useEffect(() => {
    fetchLiveParking();
    pollerRef.current = setInterval(fetchLiveParking, 3000);

    return () => {
      if (pollerRef.current) clearInterval(pollerRef.current);
    };
  }, []);

  // Initialize and redraw Leaflet Map & markers when Leaflet is ready or data updates
  useEffect(() => {
    const L = (window as any).L;
    if (!isLeafletLoaded || !L || zones.length === 0) return;

    // 1. Initialize Map container if not already initialized
    if (!mapRef.current) {
      mapRef.current = L.map("solan-map", {
        zoomControl: false,
        attributionControl: false
      }).setView([30.9082, 77.1031], 14);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 20
      }).addTo(mapRef.current);

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

  // Handle emulator ping post calls to /api/parking/sensor-ping
  const handleSimulatePing = async (parkingId: string, event: "INFLOW" | "OUTFLOW") => {
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
        // Instantly update the UI local state for awesome responsiveness
        setZones((prev) =>
          prev.map((zone) =>
            zone.parkingId === parkingId
              ? {
                  ...zone,
                  availableSpots: data.availableSpots,
                  lastPingedAt: data.lastPingedAt,
                }
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
  };

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

  // Filter list of displayed zones in the right column card list
  const filteredZones = zones.filter((zone) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Car Only") {
      return zone.type === "Car Only" || zone.type === "All Vehicles" || zone.type === "Car & Bike";
    }
    if (activeFilter === "Bike Only") {
      return zone.type === "Bike Only" || zone.type === "All Vehicles" || zone.type === "Car & Bike";
    }
    return true;
  });

  return (
    <section className="min-h-screen bg-[#fcfbf9] py-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative background vectors */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Back navigation */}
        <Link
          href="/visitor-info"
          className="inline-flex items-center gap-2 text-xs font-sans font-bold text-stone-500 hover:text-red-950 transition-colors duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Logistics Guide
        </Link>

        {/* ─── Header Panel ─── */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-3">
              
              {/* High visibility blue stream indicator dot */}
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/60 px-4 py-1.5 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                REAL-TIME SENSOR STREAM DEPLOYED
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-black text-red-950">
                🅿️ Live Map Traffic & Parking Tracker
              </h1>
              <p className="text-stone-600 text-xs sm:text-sm font-sans leading-relaxed max-w-3xl">
                Observe live vehicle entries and exits mapped in real-time across Solan. Use the **Developer Sensor Simulator** to trigger hardware inflow/outflow events and watch the map popups and stats recompute instantly.
              </p>
            </div>

            {/* Sync Status Badge */}
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/50 p-2.5 rounded-xl shrink-0 self-start text-[11px] font-sans font-semibold text-stone-500 shadow-sm">
              <Wifi className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              {lastUpdated ? (
                <span>
                  Last Poll: {lastUpdated.toLocaleTimeString("en-IN", { hour12: false })}
                </span>
              ) : (
                <span>Connecting…</span>
              )}
              <button
                onClick={fetchLiveParking}
                className="hover:text-red-950 p-1 cursor-pointer transition-transform duration-300 hover:rotate-180"
                aria-label="Refresh data"
              >
                <RefreshCw className="w-3 h-3 text-stone-400" />
              </button>
            </div>
          </div>

          {/* Quick Info Advisory */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200/60 rounded-2xl">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block font-serif">
                Traffic Advisory
              </span>
              <p className="text-[11px] sm:text-xs text-amber-700 font-sans leading-relaxed">
                Central Mall Road is strictly pedestrian-only from 12:00 PM – 11:00 PM. Follow the designated access routes (highlighted inside cards) to bypass city gridlocks.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Split-Pane Layout Framework ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Pane: Interactive Map Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 relative">
              
              {/* Map Holder */}
              <div
                id="solan-map"
                className="w-full h-[450px] md:h-[500px] rounded-2xl overflow-hidden relative z-0"
                style={{ background: "#f5f3f0" }}
              >
                {/* Fallback while Leaflet JS script tags load */}
                {!isLeafletLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-stone-100 rounded-2xl z-10">
                    <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-stone-500 font-serif">Initializing Solan Map Coordinates...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Map Status Legend Box */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap justify-between items-center gap-3">
              <span className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest">
                Map Markers:
              </span>
              <div className="flex flex-wrap gap-4">
                {[
                  { color: "bg-emerald-500", label: "Spaces Available (> 5 spots)", text: "text-emerald-700" },
                  { color: "bg-orange-500 border-orange-200", label: "Critical Space (1-5 left)", text: "text-orange-700" },
                  { color: "bg-rose-600", label: "HOUSEFULL (0 spots left)", text: "text-rose-700" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-[10px] font-sans font-bold text-stone-600">
                    <span className={`w-3.5 h-3.5 rounded-full ${item.color} border-2 border-white shadow-sm shrink-0`} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 🎯 Smart Routing Assistant */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <h3 className="font-serif font-black text-xs sm:text-sm text-red-950 uppercase tracking-wider">
                  🎯 Shoolini Fair Smart Routing Assistant
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Route 1 status */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100/50 space-y-1.5">
                  <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Route 1: Chambaghat</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${statuses.route1 === "Red" ? "bg-red-500 animate-pulse" : statuses.route1 === "Orange" ? "bg-orange-500" : "bg-emerald-500"}`} />
                    <span className="text-[11px] font-black text-stone-700">{statuses.route1}</span>
                  </div>
                </div>

                {/* Route 2 status */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100/50 space-y-1.5">
                  <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Route 2: Saproon</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${statuses.route2 === "Red" ? "bg-red-500 animate-pulse" : statuses.route2 === "Orange" ? "bg-orange-500" : "bg-emerald-500"}`} />
                    <span className="text-[11px] font-black text-stone-700">{statuses.route2}</span>
                  </div>
                </div>

                {/* Route 3 status */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100/50 space-y-1.5">
                  <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Route 3: NH-5 Bypass</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${statuses.route3 === "Red" ? "bg-red-500 animate-pulse" : statuses.route3 === "Orange" ? "bg-orange-500" : "bg-emerald-500"}`} />
                    <span className="text-[11px] font-black text-stone-700">{statuses.route3}</span>
                  </div>
                </div>

                {/* Route 4 status */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100/50 space-y-1.5">
                  <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Route 4: Rajgarh Shortcut</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${statuses.route4 === "Red" ? "bg-red-500 animate-pulse" : statuses.route4 === "Orange" ? "bg-orange-500" : "bg-emerald-500"}`} />
                    <span className="text-[11px] font-black text-stone-700">{statuses.route4}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic recommendation advisory */}
              <div className={`p-4 rounded-xl border ${
                (statuses.route1 === "Red" && statuses.route2 === "Red" && statuses.route3 === "Red") || (statuses.route2 === "Red" && statuses.route3 === "Red")
                  ? "bg-red-50/60 border-red-100 text-red-800"
                  : statuses.route2 === "Red" || statuses.route3 === "Red"
                  ? "bg-amber-50/60 border-amber-200/50 text-amber-900"
                  : "bg-emerald-50/60 border-emerald-100 text-emerald-800"
              } text-[11px] sm:text-xs font-medium font-sans leading-relaxed`}>
                {(() => {
                  const saproonChowkRed = statuses.route2 === "Red";
                  const oldBusStandFull = zones.find(z => z.parkingId === "old-bus-stand")?.availableSpots === 0;
                  const rajgarhShortcutGreen = statuses.route4 === "Green";

                  if (saproonChowkRed && oldBusStandFull && rajgarhShortcutGreen) {
                    return (
                      <div className="flex gap-2 animate-pulse">
                        <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 animate-spin" />
                        <span>🎯 <b>Shoolini Mela Smart Route Advice:</b> Absolute bottleneck detected near the Old Bus Stand entry. Drivers looking to exit the town toward Chandigarh or outer parking fields are highly advised to take the Rajgarh Road Bypass Shortcut. This lane bypasses Mall Road entirely and drops you directly onto the clear NH-5 Bypass.</span>
                      </div>
                    );
                  }

                  if (statuses.route1 === "Red" && statuses.route2 === "Red" && statuses.route3 === "Red") {
                    return (
                      <div className="flex gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                        <span>🚘 <b>Peak Festival Rush Active:</b> High congestion across all town entry gates. Please utilize the outer bypass/buffer overflow lots and free RTO shuttles.</span>
                      </div>
                    );
                  }
                  if (statuses.route3 === "Red" && statuses.route1 === "Green") {
                    return (
                      <div className="flex gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                        <span>⚠️ <b>Traffic Alert:</b> The NH-5 Bypass entry is currently gridlocked. Tourists arriving from Shimla/Chandigarh side are highly advised to divert through Chambaghat Chowk for faster access to vacant multi-level slots.</span>
                      </div>
                    );
                  }
                  if (statuses.route2 === "Red") {
                    return (
                      <div className="flex gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                        <span>⚠️ <b>Traffic Alert:</b> The Southern Saproon Entry past the Old Bus Stand is highly congested. If you are arriving from the bypass, consider parking at Solan Bypass Mega Overflow and using the free RTO shuttle.</span>
                      </div>
                    );
                  }
                  return (
                    <div className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                      <span>🟢 <b>Traffic Flow Normal:</b> Primary entry routes into Solan Mall Road are clear. Multi-level and local parking zones are fully accessible.</span>
                    </div>
                  );
                })()}
              </div>

              {/* Leaflet permanent tooltips styling overlay */}
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
                .leaflet-tooltip-left:before, .leaflet-tooltip-right:before {
                  border: none !important;
                }
              `}} />
            </div>
          </div>

          {/* Right Pane: Filter Tabs & Active Occupancy Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Filter and Simulator Triggers */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {(["All", "Car Only", "Bike Only"] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans border transition-all duration-200 cursor-pointer shadow-sm ${
                      activeFilter === f
                        ? "bg-amber-600 border-amber-600 text-white"
                        : "bg-white text-stone-600 border-slate-100 hover:border-amber-400"
                    }`}
                  >
                    {f === "All" ? "🚗 All" : f === "Car Only" ? "🚗 Cars" : "🏍️ Bikes"}
                  </button>
                ))}
              </div>

              {/* Developer Emulator Panel Toggle */}
              <button
                onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-extrabold font-sans border cursor-pointer shadow-sm transition-all duration-200 ${
                  isSimulatorOpen
                    ? "bg-slate-900 border-slate-900 text-amber-400 font-black"
                    : "bg-white text-stone-700 border-slate-100 hover:border-slate-300"
                }`}
              >
                <Sliders className="w-3.5 h-3.5 shrink-0" />
                <span>Sensor Emulator</span>
              </button>
            </div>

            {/* Collapsible Developer Sensor Simulator Panel */}
            <AnimatePresence>
              {isSimulatorOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md space-y-4 overflow-hidden"
                >
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                    <h3 className="font-serif font-black text-xs text-amber-400 uppercase tracking-widest">
                      Developer Sensor Simulator
                    </h3>
                  </div>

                  {simulatorStatus && (
                    <div className="text-[10px] font-mono text-emerald-400 bg-black/40 p-2 rounded-lg border border-slate-800">
                      {simulatorStatus}
                    </div>
                  )}

                  <div className="space-y-3 divide-y divide-slate-800/50">
                    {zones.map((zone) => (
                      <div key={zone.parkingId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 first:pt-0">
                        <span className="text-[11px] font-serif font-black truncate max-w-[170px]">
                          {zone.name}
                        </span>
                        
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleSimulatePing(zone.parkingId, "INFLOW")}
                            className="bg-red-900/40 border border-red-800/80 hover:bg-red-900/60 active:scale-95 text-red-200 text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-all leading-tight"
                          >
                            + INFLOW
                          </button>
                          <button
                            onClick={() => handleSimulatePing(zone.parkingId, "OUTFLOW")}
                            className="bg-emerald-900/40 border border-emerald-800/80 hover:bg-emerald-900/60 active:scale-95 text-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-all leading-tight"
                          >
                            - OUTFLOW
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List of Active Lot Cards */}
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
              {filteredZones.map((zone) => {
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
                    key={zone.parkingId}
                    className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-serif font-black text-red-950">
                          {zone.name}
                        </h3>
                        <span className="text-[10px] text-stone-500 block truncate mt-0.5">
                          {zone.address}
                        </span>

                        {/* Data Source Badge */}
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

                      {/* Status badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider border uppercase ${badgeClass}`}>
                        {statusBadge}
                      </span>
                    </div>

                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {zone.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-stone-500">
                        <span>Lot Capacity Occupancy</span>
                        <span>{available === 0 ? 100 : pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                           className={`h-full rounded-full ${progressColor} transition-all duration-300`}
                          style={{ width: `${available === 0 ? 100 : pct}%` }}
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

                    {/* Access point route warning */}
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
                          onClick={() => handleCommunityVote(zone.parkingId, "COMMUNITY_EMPTY")}
                          className="flex-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer text-center"
                        >
                          🟢 Looking Empty
                        </button>
                        <button
                          onClick={() => handleCommunityVote(zone.parkingId, "COMMUNITY_ALMOST_FULL")}
                          className="flex-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer text-center"
                        >
                          🟡 Almost Full
                        </button>
                        <button
                          onClick={() => handleCommunityVote(zone.parkingId, "COMMUNITY_FULL")}
                          className="flex-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[10px] font-bold py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer text-center"
                        >
                          🔴 Looking Full!
                        </button>
                      </div>
                    </div>

                    {/* Last Sensor Ping Timestamp */}
                    {zone.lastPingedAt && (
                      <div className="text-[9px] font-mono text-stone-400 text-right">
                        Last ping: {new Date(zone.lastPingedAt).toLocaleTimeString("en-IN", { hour12: false })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
