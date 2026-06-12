/**
 * Static, canonical list of parking lots for Maa Shoolini Fair 2026 — Solan.
 *
 * This is the SINGLE SOURCE OF TRUTH for lot metadata (IDs, max capacities,
 * vehicle types, distances).  Both API routes and the frontend import from
 * here so that capacities are never out-of-sync between the client and the
 * database constraint checks.
 */

export type VehicleType = "Car & Bike" | "Car Only" | "All Vehicles" | "Bike Only";

export interface ParkingLotConfig {
  /** Stable identifier stored in MongoDB as `parkingId` */
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  type: VehicleType;
  /** Human-readable distance string shown on cards */
  distanceLabel: string;
  /** Numeric walk/shuttle minutes (for UI ordering/urgency cues) */
  distanceMinutes: number;
  /** True if a free RTO shuttle departs from this lot */
  shuttleAvailable: boolean;
  /** Designated route entry point */
  routeEntry: string;
  /** Description of the lot's suitability and access */
  description: string;
}

export const PARKING_LOTS: ParkingLotConfig[] = [
  {
    id: "old-bus-stand",
    name: "Old Bus Stand Multilevel Parking",
    address: "Old Bus Stand Complex, Solan",
    totalSpots: 250,
    type: "Car Only",
    distanceLabel: "5 mins walk to Mall Road",
    distanceMinutes: 5,
    shuttleAvailable: false,
    routeEntry: "Via Lower Bazar / Rajgarh Road Junction",
    description: "Primary municipal concrete structure. Best for general visitor cars entering Solan from the eastern suburbs and inner market links.",
  },
  {
    id: "thodo-ground",
    name: "Thodo Ground VIP & Staff Zone",
    address: "Thodo Ground, Solan",
    totalSpots: 120,
    type: "Car & Bike",
    distanceLabel: "0 mins (On-site / Central Stage)",
    distanceMinutes: 0,
    shuttleAvailable: false,
    routeEntry: "Via DC Office Complex Link",
    description: "Highly restricted perimeter surrounding the cultural exhibition stalls and wrestling arena. Open strictly for official press, emergency vehicles, and VIP pass holders.",
  },
  {
    id: "solan-bypass",
    name: "Solan Bypass Mega Overflow Grounds",
    address: "NH-5 Bypass, Near Chambaghat, Solan",
    totalSpots: 450,
    type: "All Vehicles",
    distanceLabel: "12 mins free administration shuttle",
    distanceMinutes: 12,
    shuttleAvailable: true,
    routeEntry: "Via Shimla-Chandigarh NH-5 Bypass cuts",
    description: "Massive outdoor terrain zone. Heavy tourist cruisers and commercial travelers coming from outside the state are diverted here by traffic police to prevent city gridlock.",
  },
  {
    id: "temple-lane",
    name: "Shoolini Mata Temple Lane",
    address: "Temple Lane, Subzi Mandi Road, Solan",
    totalSpots: 90,
    type: "Bike Only",
    distanceLabel: "2 mins walk to Main Shrine",
    distanceMinutes: 2,
    shuttleAvailable: false,
    routeEntry: "Via Temple Gate Road",
    description: "Strictly monitored sector. Because the main temple access roads are extremely narrow, cars are blocked, and this space is entirely reserved for local two-wheelers and bikes.",
  },
  {
    id: "saproon-chowk",
    name: "Saproon Chowk Buffer Lot",
    address: "Saproon Chowk, Solan",
    totalSpots: 180,
    type: "Car & Bike",
    distanceLabel: "10 mins walk / Local auto zone",
    distanceMinutes: 10,
    shuttleAvailable: false,
    routeEntry: "Via Chandigarh-Solan Entry Highway",
    description: "Strategic gateway buffer checkpoint. Captures incoming festival traffic arriving from Kalka/Chandigarh side before they enter the congested town core.",
  },
];

/** Quick lookup map: parkingId → config (O(1)) */
export const PARKING_LOT_MAP = new Map<string, ParkingLotConfig>(
  PARKING_LOTS.map((lot) => [lot.id, lot])
);
