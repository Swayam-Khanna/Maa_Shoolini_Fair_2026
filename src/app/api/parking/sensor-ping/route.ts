/**
 * POST /api/parking/sensor-ping
 *
 * Receives automated HTTP POST requests from physical gate counters
 * (infrared beam relays, RFID barriers, or any IoT device) installed
 * at parking lot entry/exit points.
 *
 * Request body (JSON):
 * {
 *   parkingId : string,               // matches a known lot ID from parkingConfig.ts
 *   event     : "INFLOW" | "OUTFLOW"  // vehicle entered or left
 * }
 *
 * Behaviour:
 *  • INFLOW  → atomically decrements availableSpots by 1, floor-clamped at 0
 *  • OUTFLOW → atomically increments availableSpots by 1, ceiling-clamped at totalSpots
 *
 * The MongoDB `$inc` + `$max`/`$min` pair guarantees that NO concurrent
 * sensor ping can push availableSpots outside [0, totalSpots] — even under
 * high-throughput parallel writes at a busy gate.
 *
 * Response:
 *  201 { ok: true,  parkingId, event, availableSpots, totalSpots }
 *  400 { ok: false, error: "<reason>" }
 *  404 { ok: false, error: "Unknown parkingId" }
 *  500 { ok: false, error: "<db error>" }
 *
 * Security note: In production, add an Authorization header check
 * (Bearer token or HMAC-SHA256 signature) to ensure only trusted
 * physical devices can mutate counts.
 */

import { type NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { PARKING_LOT_MAP } from "@/lib/parkingConfig";

export const dynamic = "force-dynamic";

// ─── Payload schema ───────────────────────────────────────────────────────────
type SensorEvent = "INFLOW" | "OUTFLOW" | "COMMUNITY_EMPTY" | "COMMUNITY_FULL" | "COMMUNITY_ALMOST_FULL";

interface SensorPingPayload {
  parkingId: string;
  event: SensorEvent;
}

function isValidPayload(body: unknown): body is SensorPingPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.parkingId === "string" &&
    b.parkingId.trim().length > 0 &&
    (b.event === "INFLOW" ||
      b.event === "OUTFLOW" ||
      b.event === "COMMUNITY_EMPTY" ||
      b.event === "COMMUNITY_FULL" ||
      b.event === "COMMUNITY_ALMOST_FULL")
  );
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { ok: false, error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  // 2. Validate shape
  if (!isValidPayload(body)) {
    return Response.json(
      {
        ok: false,
        error:
          'Payload must be { parkingId: string, event: "INFLOW" | "OUTFLOW" }',
      },
      { status: 400 }
    );
  }

  const { parkingId, event } = body;

  // 3. Validate parkingId against the static lot config
  const lotConfig = PARKING_LOT_MAP.get(parkingId);
  if (!lotConfig) {
    return Response.json(
      {
        ok: false,
        error: `Unknown parkingId "${parkingId}". Valid IDs: ${[...PARKING_LOT_MAP.keys()].join(", ")}`,
      },
      { status: 404 }
    );
  }

  const { totalSpots } = lotConfig;

  try {
    const db = await getDb();
    const collection = db.collection("parking_live");

    let result;
    if (event === "COMMUNITY_FULL" || event === "COMMUNITY_EMPTY" || event === "COMMUNITY_ALMOST_FULL") {
      let communityStatus = "EMPTY";
      let targetAvailable = totalSpots;
      if (event === "COMMUNITY_FULL") {
        communityStatus = "FULL";
        targetAvailable = 0;
      } else if (event === "COMMUNITY_ALMOST_FULL") {
        communityStatus = "ALMOST_FULL";
        targetAvailable = Math.min(3, totalSpots);
      }

      const communityExpiresAt = new Date(Date.now() + 45 * 60 * 1000); // 45 minutes

      result = await collection.findOneAndUpdate(
        { parkingId },
        {
          $set: {
            parkingId,
            totalSpots,
            availableSpots: targetAvailable,
            lastPingedAt: new Date(),
            communityStatus,
            communityExpiresAt,
          },
        },
        {
          upsert: true,
          returnDocument: "after",
        }
      );
    } else {
      // 4. Compute the $inc delta: INFLOW decreases available spots, OUTFLOW increases
      const delta = event === "INFLOW" ? -1 : 1;

      // 5. Atomically update with boundary clamping
      result = await collection.findOneAndUpdate(
        { parkingId },
        [
          {
            $set: {
              parkingId,
              totalSpots,
              lastPingedAt: "$$NOW",
              // Clear community override on physical hardware ping
              communityStatus: null,
              communityExpiresAt: null,
              availableSpots: {
                $min: [
                  totalSpots,
                  {
                    $max: [
                      0,
                      {
                        $add: [
                          { $ifNull: ["$availableSpots", totalSpots] },
                          delta,
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
        {
          upsert: true,
          returnDocument: "after",
        }
      );
    }

    // `result` is the updated document
    const updatedDoc = result;
    const updatedAvailable =
      typeof updatedDoc?.availableSpots === "number"
        ? updatedDoc.availableSpots
        : totalSpots;

    return Response.json(
      {
        ok: true,
        parkingId,
        name: lotConfig.name,
        event,
        availableSpots: updatedAvailable,
        totalSpots,
        lastPingedAt: updatedDoc?.lastPingedAt ?? new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown database error";
    console.error("[POST /api/parking/sensor-ping] Error:", message);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
