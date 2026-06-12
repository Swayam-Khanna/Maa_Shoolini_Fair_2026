/**
 * Quick standalone MongoDB connection test.
 * Run: node src/scripts/test-mongo.mjs
 */
import { MongoClient } from "mongodb";

const URI = process.env.MONGODB_URI || "mongodb://swayam30:swayam30@ac-w2dnsop-shard-00-00.u1yqg0q.mongodb.net:27017,ac-w2dnsop-shard-00-01.u1yqg0q.mongodb.net:27017,ac-w2dnsop-shard-00-02.u1yqg0q.mongodb.net:27017/shoolini_parking?ssl=true&authSource=admin&replicaSet=atlas-i63n84-shard-0";

console.log("🔌 Attempting MongoDB connection...");
console.log("   URI:", URI.replace(/:([^:@]+)@/, ":****@")); // hide password

const client = new MongoClient(URI, {
  serverSelectionTimeoutMS: 10000, // 10 second timeout
  connectTimeoutMS: 10000,
});

try {
  await client.connect();
  console.log("✅ Connected successfully!");

  const db = client.db("shoolini_parking");
  const ping = await db.command({ ping: 1 });
  console.log("✅ Ping response:", ping);

  const collections = await db.listCollections().toArray();
  console.log("📦 Collections in DB:", collections.map((c) => c.name));

  await client.close();
  console.log("🔒 Connection closed.");
} catch (err) {
  console.error("❌ Connection FAILED:");
  console.error("   Name   :", err.name);
  console.error("   Message:", err.message);

  if (err.message.includes("ECONNREFUSED")) {
    console.error("\n💡 DIAGNOSIS: querySrv ECONNREFUSED");
    console.error("   Most likely causes:");
    console.error("   1. ⏸️  Your Atlas cluster is PAUSED (most common on free M0 tier)");
    console.error("      → Go to cloud.mongodb.com → Clusters → click RESUME");
    console.error("   2. 🔑 Wrong username/password in the URI");
    console.error("   3. 🌐 Corporate firewall/VPN blocking port 27017 or SRV DNS");
  }

  if (err.message.includes("Authentication failed")) {
    console.error("\n💡 DIAGNOSIS: Wrong credentials");
    console.error("   → Check username 'swayam30' and password in Atlas → Database Access");
  }

  process.exit(1);
}
