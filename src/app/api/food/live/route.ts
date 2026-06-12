import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const SEED_FOOD_ITEMS = [
  {
    id: "ghee-siddu",
    name: "Ghee Siddu",
    price: 80,
    category: "Traditional Steamed",
    shop: "Tribal Lovers (Siddu Specialists)",
    location: "Mall Road / Anand Vihar Canopy",
    description: "Traditional walnut and poppy seed stuffed steamed wheat bread, served dripping with hot local ghee.",
  },
  {
    id: "jalebi-rabri",
    name: "Famous Jalebi & Rabri",
    price: 50,
    category: "Festive Sweet",
    shop: "Paddu Halwai (Famous Jalebi Shop)",
    location: "Upper Bazar Lane",
    description: "Crispy, hot local jalebis fried fresh in pure ghee, a historic Solan sweet specialty.",
  },
  {
    id: "samosa-chana",
    name: "Samosa & Local Chana Chutney",
    price: 40,
    category: "Deep Fried Snacks",
    shop: "Rattanjee's Sweets",
    location: "The Mall Road (Opp. Hanuman Temple)",
    description: "Solan's iconic heavy-stuffed potato samosas served with traditional spicy mint and tamarind chickpeas.",
  },
  {
    id: "himachali-dham",
    name: "Authentic Himachali Dham",
    price: 150,
    category: "Festive Feast",
    shop: "Premjee's Cultural Pandal",
    location: "Opposite Old Bus Stand Complex",
    description: "Traditional slow-cooked festive community feast featuring Madra, Sepu Badi, and Khatta served on authentic leaf plates.",
  },
  {
    id: "gulab-jamun",
    name: "Traditional Gulab Jamun",
    price: 40,
    category: "Festive Sweet",
    shop: "Narinder Sweets",
    location: "Chambaghat Chowk / Mall Road Branch",
    description: "Soft, warm melt-in-your-mouth mawa gulab jamuns, an absolute local staple post-dinner.",
  },
  {
    id: "chowmein",
    name: "Spicy Hill Chowmein",
    price: 70,
    category: "Fast Food",
    shop: "Solan Fast Food Corner",
    location: "Thodo Ground Food Court",
    description: "Stir-fried noodles with crisp local mountain vegetables and spicy Himalayan sauces.",
  },
  {
    id: "momos",
    name: "Steamed Momos",
    price: 60,
    category: "Fast Food",
    shop: "Tibetan Food Corner",
    location: "Mall Road Food Street",
    description: "Steamed vegetable or paneer dumplings served with spicy red chili chutney.",
  },
  {
    id: "burger",
    name: "Solan Special Burger",
    price: 50,
    category: "Fast Food",
    shop: "Chambaghat Cafe & Fast Food",
    location: "Chambaghat Chowk Corner",
    description: "Crisp potato patty with fresh cucumber, tomato slices, and local green chutney in a toasted bun.",
  },
  {
    id: "kurkure",
    name: "Masala Kurkure",
    price: 30,
    category: "Snacks",
    shop: "Local Mela Snack Stall",
    location: "Children's Park Gate",
    description: "Crispy, spicy local potato and gram flour sticks seasoned with tangy Himachali chaat masala.",
  },
  {
    id: "spring-roll",
    name: "Crispy Spring Rolls",
    price: 80,
    category: "Fast Food",
    shop: "Tibetan Food Corner",
    location: "Mall Road Food Street",
    description: "Deep-fried wrappers filled with crunchily stir-fried spring vegetables and glass noodles.",
  },
  {
    id: "fried-momos",
    name: "Crispy Fried Momos",
    price: 75,
    category: "Fast Food",
    shop: "Tibetan Food Corner",
    location: "Thodo Ground Food Court",
    description: "Deep-fried golden momos stuffed with paneer and vegetables, served with creamy mayo and fiery hot chutney.",
  },
  {
    id: "fried-rice",
    name: "Mountain Veg Fried Rice",
    price: 80,
    category: "Fast Food",
    shop: "Solan Fast Food Corner",
    location: "Thodo Ground Food Court",
    description: "Wok-tossed rice with crisp mountain vegetables, garlic, and rich soy sauce.",
  },
  {
    id: "pav-bhaji",
    name: "Mumbai Pav Bhaji",
    price: 60,
    category: "Fast Food",
    shop: "Premjee's Food Pandal",
    location: "Opposite Old Bus Stand Complex",
    description: "Spicy mashed mixed vegetable curry served hot with butter-toasted soft bread rolls.",
  },
  {
    id: "pizza",
    name: "Paneer Tikka Pizza",
    price: 140,
    category: "Fast Food",
    shop: "The Pizza Slice Solan",
    location: "Mall Road Food Street",
    description: "Freshly baked woodfired-style pizza topped with spiced paneer tikka cubes, capsicum, and loaded cheese.",
  },
  {
    id: "cold-coffee",
    name: "Creamy Cold Coffee",
    price: 50,
    category: "Beverages",
    shop: "Solan Coffee House",
    location: "Chambaghat Chowk Corner",
    description: "Chilled whipped milk with rich espresso coffee and topped with a scoop of chocolate syrup.",
  },
  {
    id: "cold-drinks",
    name: "Assorted Cold Drinks",
    price: 20,
    category: "Beverages",
    shop: "Mela Refreshments",
    location: "Children's Park Gate",
    description: "Chilled carbonated soft drinks to beat the heat at the fairgrounds.",
  },
  {
    id: "shakes",
    name: "Mango & Strawberry Shakes",
    price: 60,
    category: "Beverages",
    shop: "Solan Coffee House",
    location: "Chambaghat Chowk Corner",
    description: "Thick and creamy shakes prepared with fresh mango pulp or strawberry syrup and chilled milk.",
  },
  {
    id: "pasta",
    name: "Cheesy White Sauce Pasta",
    price: 90,
    category: "Fast Food",
    shop: "The Pizza Slice Solan",
    location: "Mall Road Food Street",
    description: "Penne pasta tossed in rich, velvety cheese sauce, garlic, herbs, and sweet corn.",
  },
  {
    id: "fries",
    name: "Masala French Fries",
    price: 40,
    category: "Fast Food",
    shop: "Mela Refreshments",
    location: "Children's Park Gate",
    description: "Golden-fried potato fingers tossed with spicy local red chili powder and peri-peri seasoning.",
  },
];

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("food_menu");

    // Retrieve and return all menu items (excluding MongoDB _id in response)
    const items = await collection.find({}, { projection: { _id: 0 } }).toArray();

    // If empty for some reason, insert seed items
    if (items.length === 0) {
      await collection.insertMany(SEED_FOOD_ITEMS);
      const reFetched = await collection.find({}, { projection: { _id: 0 } }).toArray();
      return NextResponse.json({ ok: true, menu: reFetched }, { status: 200 });
    }

    return NextResponse.json({ ok: true, menu: items }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ [GET /api/food/live] Error:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
