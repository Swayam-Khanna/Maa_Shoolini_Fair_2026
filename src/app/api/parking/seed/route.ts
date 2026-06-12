/**
 * GET /api/parking/seed
 *
 * One-time database seeder — creates or resets the `parking_live` collection
 * with the initial availableSpots equal to each lot's totalSpots (empty lots).
 *
 * Usage:
 *   curl http://localhost:3000/api/parking/seed
 *
 * IMPORTANT: Protect this route with a secret key in production.
 * Example check included below (disabled by default for dev convenience).
 */

import { type NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { PARKING_LOTS } from "@/lib/parkingConfig";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // ── Optional production guard ─────────────────────────────────────────────
  // Uncomment in production to protect this endpoint:
  //
  // const secret = req.headers.get("x-seed-secret");
  // if (secret !== process.env.SEED_SECRET) {
  //   return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const db = await getDb();
    const collection = db.collection("parking_live");

    // Upsert each lot — preserves existing availableSpots if already seeded
    const ops = PARKING_LOTS.map((lot) =>
      collection.updateOne(
        { parkingId: lot.id },
        {
          $setOnInsert: {
            parkingId: lot.id,
            totalSpots: lot.totalSpots,
            availableSpots: lot.totalSpots, // starts fully empty
            lastPingedAt: null,
          },
        },
        { upsert: true }
      )
    );

    const results = await Promise.all(ops);
    const seeded = results.filter((r) => r.upsertedCount > 0).length;
    const skipped = results.filter((r) => r.matchedCount > 0).length;

    return Response.json(
      {
        ok: true,
        message: `Seed complete. Created: ${seeded} lots, Skipped (already existed): ${skipped} lots.`,
        lots: PARKING_LOTS.map((l) => ({ id: l.id, name: l.name, totalSpots: l.totalSpots })),
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[GET /api/parking/seed] Error:", message);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
