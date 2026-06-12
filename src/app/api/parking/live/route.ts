/**
 * GET /api/parking/live
 *
 * Returns the current live state of all parking lots from the MongoDB
 * `parking_live` collection.  Called by the visitor-facing dashboard
 * every 4 seconds via a setInterval fetch loop.
 *
 * Response shape:
 * {
 *   ok: true,
 *   fetchedAt: string,          // ISO timestamp of this read
 *   lots: LiveLotDocument[]
 * }
 *
 * Error shape:
 * { ok: false, error: string }
 *
 * Caching: `dynamic = "force-dynamic"` ensures Next.js never caches
 * this response — every visitor poll hits the live database.
 */

import { type NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { PARKING_LOTS } from "@/lib/parkingConfig";

// Never cache — always read fresh counts from MongoDB
export const dynamic = "force-dynamic";

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

export async function GET(_req: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection("parking_live");

    // Pull all known lot IDs in a single query
    const lotIds = PARKING_LOTS.map((l) => l.id);
    const docs = await collection
      .find({ parkingId: { $in: lotIds } })
      .toArray();

    // Index the DB results by parkingId for O(1) lookup
    const dbMap = new Map(docs.map((d) => [d.parkingId as string, d]));

    const now = new Date();
    // Convert current UTC time to Asia/Kolkata (IST, UTC+5:30) for local hour calculation
    const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const currentHour = istTime.getUTCHours();

    // Merge static config with live availableSpots.
    const lots = PARKING_LOTS.map((lot) => {
      const live = dbMap.get(lot.id);

      let availableSpots = lot.totalSpots;
      let lastPingedAt = null;
      let isPredictive = false;
      let isCommunityVerified = false;

      // Check if there is an active community override (valid for 45 mins)
      if (live && live.communityStatus && live.communityExpiresAt && new Date(live.communityExpiresAt).getTime() > now.getTime()) {
        if (live.communityStatus === "FULL") {
          availableSpots = 0;
        } else if (live.communityStatus === "ALMOST_FULL") {
          availableSpots = Math.min(3, lot.totalSpots);
        } else {
          availableSpots = lot.totalSpots;
        }
        lastPingedAt = live.lastPingedAt;
        isCommunityVerified = true;
      }
      // If there is a recent hardware sensor count in DB (no active community override)
      else if (live && live.lastPingedAt && !live.communityStatus) {
        availableSpots = live.availableSpots;
        lastPingedAt = live.lastPingedAt;
        isPredictive = false;
      }
      // Fallback: Time-based Predictive Estimation
      else {
        availableSpots = getPredictiveAvailableSpots(lot.id, lot.totalSpots, currentHour);
        lastPingedAt = null;
        isPredictive = true;
      }

      return {
        ...lot,
        parkingId: lot.id,
        availableSpots,
        lastPingedAt,
        isPredictive,
        isCommunityVerified,
      };
    });

    return Response.json(
      { ok: true, fetchedAt: now.toISOString(), lots },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[GET /api/parking/live] Error:", message);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
