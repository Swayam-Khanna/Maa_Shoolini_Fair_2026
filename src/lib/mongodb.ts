/**
 * MongoDB Singleton Client — shared across all API Route Handlers.
 *
 * Uses a module-level `global` cache so that during Next.js hot-reload in
 * development we never open more connections than needed. In production the
 * module is only evaluated once, so the cache is effectively a no-op there.
 *
 * Required environment variable (server-side only, never prefixed NEXT_PUBLIC_):
 *   MONGODB_URI  — e.g. "mongodb+srv://user:pass@cluster.mongodb.net/shoolini_parking"
 */

import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;
const DB_NAME = process.env.MONGODB_DB_NAME ?? "shoolini_parking";

if (!MONGODB_URI) {
  throw new Error(
    "[mongodb] MONGODB_URI environment variable is not set. " +
      "Add it to .env.local: MONGODB_URI=mongodb+srv://..."
  );
}

// ─── Global cache (survives HMR in development) ───────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Reuse across hot-reloads
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    console.log("🔌 [MongoDB] Initializing client connection...");
    global._mongoClientPromise = client.connect()
      .then((clientInstance) => {
        console.log("🟢 [MongoDB] Connected successfully!");
        return clientInstance;
      })
      .catch((err) => {
        console.error("🔴 [MongoDB] Connection failed:", err.message);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a fresh promise (module is loaded once)
  const client = new MongoClient(MONGODB_URI);
  console.log("🔌 [MongoDB] Connecting in production...");
  clientPromise = client.connect()
    .then((clientInstance) => {
      console.log("🟢 [MongoDB] Connected successfully (production)!");
      return clientInstance;
    })
    .catch((err) => {
      console.error("🔴 [MongoDB] Connection failed:", err.message);
      throw err;
    });
}

/**
 * Returns a connected MongoClient.
 * Await this in every Route Handler that needs the database.
 */
export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

/**
 * Returns the application Db handle.
 * Convenience wrapper around getMongoClient().
 */
export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(DB_NAME);
}

export default clientPromise;
