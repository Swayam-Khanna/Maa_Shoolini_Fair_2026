"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Utensils, Check, MapPin, Sparkles, Trash2, ArrowRight, Store } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  price: number;
  category: string;
  shop: string;
  location: string;
  description: string;
}

// Translations for UI headings and localized menu texts
const UI_TRANSLATIONS = {
  en: {
    title: "Himachali Food Fest Guide",
    subtitle: "Explore authentic Solan establishments at the Maa Shoolini Fair 2026. Calculate your budget and plan your walk through the local street food trails.",
    liveBadge: "LIVE FESTIVAL FLAVORS STREAM ACTIVE",
    loading: "Streaming menu data from MongoDB...",
    errorText: "Failed to stream menu data. Displaying cached version.",
    category: "Category",
    shop: "Shop Name",
    location: "Location",
    selectedItems: "Selected Delicacies",
    totalBudget: "Your Food Budget Summary",
    totalCost: "Total Estimated Cost",
    clearAll: "Clear Selection",
    rupee: "₹",
    itemsText: "item(s) selected",
    itineraryTitle: "Your Route",
    recommendationTitle: "Organizer Guide & Tips",
    recommendation0: "Select some local treats to plan your Shoolini Fair culinary trail!",
    recommendationLight: "Perfect for a light evening walk along Mall Road!",
    recommendationHeavy: "A full local gastronomic feast! Make sure to wear comfortable shoes for the Upper/Lower Bazar crowds.",
    
    // Delicacies
    "Ghee Siddu": "Ghee Siddu",
    "Famous Jalebi & Rabri": "Famous Jalebi & Rabri",
    "Samosa & Local Chana Chutney": "Samosa & Local Chana Chutney",
    "Authentic Himachali Dham": "Authentic Himachali Dham",
    "Traditional Gulab Jamun": "Traditional Gulab Jamun",
    "Spicy Hill Chowmein": "Spicy Hill Chowmein",
    "Steamed Momos": "Steamed Momos",
    "Solan Special Burger": "Solan Special Burger",
    "Masala Kurkure": "Masala Kurkure",
    "Crispy Spring Rolls": "Crispy Spring Rolls",
    "Crispy Fried Momos": "Crispy Fried Momos",
    "Mountain Veg Fried Rice": "Mountain Veg Fried Rice",
    "Mumbai Pav Bhaji": "Mumbai Pav Bhaji",
    "Paneer Tikka Pizza": "Paneer Tikka Pizza",
    "Creamy Cold Coffee": "Creamy Cold Coffee",
    "Assorted Cold Drinks": "Assorted Cold Drinks",
    "Mango & Strawberry Shakes": "Mango & Strawberry Shakes",
    "Cheesy White Sauce Pasta": "Cheesy White Sauce Pasta",
    "Masala French Fries": "Masala French Fries",

    // Categories
    "Traditional Steamed": "Traditional Steamed",
    "Festive Sweet": "Festive Sweet",
    "Deep Fried Snacks": "Deep Fried Snacks",
    "Festive Feast": "Festive Feast",
    "Fast Food": "Fast Food",
    "Snacks": "Snacks",
    "Beverages": "Beverages",

    // Shops
    "Tribal Lovers (Siddu Specialists)": "Tribal Lovers (Siddu Specialists)",
    "Paddu Halwai (Famous Jalebi Shop)": "Paddu Halwai (Famous Jalebi Shop)",
    "Rattanjee's Sweets": "Rattanjee's Sweets",
    "Premjee's Cultural Pandal": "Premjee's Cultural Pandal",
    "Narinder Sweets": "Narinder Sweets",
    "Solan Fast Food Corner": "Solan Fast Food Corner",
    "Tibetan Food Corner": "Tibetan Food Corner",
    "Chambaghat Cafe & Fast Food": "Chambaghat Cafe & Fast Food",
    "Local Mela Snack Stall": "Local Mela Snack Stall",
    "Premjee's Food Pandal": "Premjee's Food Pandal",
    "The Pizza Slice Solan": "The Pizza Slice Solan",
    "Solan Coffee House": "Solan Coffee House",
    "Mela Refreshments": "Mela Refreshments",

    // Locations
    "Mall Road / Anand Vihar Canopy": "Mall Road / Anand Vihar Canopy",
    "Upper Bazar Lane": "Upper Bazar Lane",
    "The Mall Road (Opp. Hanuman Temple)": "The Mall Road (Opp. Hanuman Temple)",
    "Opposite Old Bus Stand Complex": "Opposite Old Bus Stand Complex",
    "Chambaghat Chowk / Mall Road Branch": "Chambaghat Chowk / Mall Road Branch",
    "Thodo Ground Food Court": "Thodo Ground Food Court",
    "Mall Road Food Street": "Mall Road Food Street",
    "Chambaghat Chowk Corner": "Chambaghat Chowk Corner",
    "Children's Park Gate": "Children's Park Gate",

    // Descriptions
    "Traditional walnut and poppy seed stuffed steamed wheat bread, served dripping with hot local ghee.": "Traditional walnut and poppy seed stuffed steamed wheat bread, served dripping with hot local ghee.",
    "Crispy, hot local jalebis fried fresh in pure ghee, a historic Solan sweet specialty.": "Crispy, hot local jalebis fried fresh in pure ghee, a historic Solan sweet specialty.",
    "Solan's iconic heavy-stuffed potato samosas served with traditional spicy mint and tamarind chickpeas.": "Solan's iconic heavy-stuffed potato samosas served with traditional spicy mint and tamarind chickpeas.",
    "Traditional slow-cooked festive community feast featuring Madra, Sepu Badi, and Khatta served on authentic leaf plates.": "Traditional slow-cooked festive community feast featuring Madra, Sepu Badi, and Khatta served on authentic leaf plates.",
    "Soft, warm melt-in-your-mouth mawa gulab jamuns, an absolute local staple post-dinner.": "Soft, warm melt-in-your-mouth mawa gulab jamuns, an absolute local staple post-dinner.",
    "Stir-fried noodles with crisp local mountain vegetables and spicy Himalayan sauces.": "Stir-fried noodles with crisp local mountain vegetables and spicy Himalayan sauces.",
    "Steamed vegetable or paneer dumplings served with spicy red chili chutney.": "Steamed vegetable or paneer dumplings served with spicy red chili chutney.",
    "Crisp potato patty with fresh cucumber, tomato slices, and local green chutney in a toasted bun.": "Crisp potato patty with fresh cucumber, tomato slices, and local green chutney in a toasted bun.",
    "Crispy, spicy local potato and gram flour sticks seasoned with tangy Himachali chaat masala.": "Crispy, spicy local potato and gram flour sticks seasoned with tangy Himachali chaat masala.",
    "Deep-fried wrappers filled with crunchily stir-fried spring vegetables and glass noodles.": "Deep-fried wrappers filled with crunchily stir-fried spring vegetables and glass noodles.",
    "Deep-fried golden momos stuffed with paneer and vegetables, served with creamy mayo and fiery hot chutney.": "Deep-fried golden momos stuffed with paneer and vegetables, served with creamy mayo and fiery hot chutney.",
    "Wok-tossed rice with crisp mountain vegetables, garlic, and rich soy sauce.": "Wok-tossed rice with crisp mountain vegetables, garlic, and rich soy sauce.",
    "Spicy mashed mixed vegetable curry served hot with butter-toasted soft bread rolls.": "Spicy mashed mixed vegetable curry served hot with butter-toasted soft bread rolls.",
    "Freshly baked woodfired-style pizza topped with spiced paneer tikka cubes, capsicum, and loaded cheese.": "Freshly baked woodfired-style pizza topped with spiced paneer tikka cubes, capsicum, and loaded cheese.",
    "Chilled whipped milk with rich espresso coffee and topped with a scoop of chocolate syrup.": "Chilled whipped milk with rich espresso coffee and topped with a scoop of chocolate syrup.",
    "Chilled carbonated soft drinks to beat the heat at the fairgrounds.": "Chilled carbonated soft drinks to beat the heat at the fairgrounds.",
    "Thick and creamy shakes prepared with fresh mango pulp or strawberry syrup and chilled milk.": "Thick and creamy shakes prepared with fresh mango pulp or strawberry syrup and chilled milk.",
    "Penne pasta tossed in rich, velvety cheese sauce, garlic, herbs, and sweet corn.": "Penne pasta tossed in rich, velvety cheese sauce, garlic, herbs, and sweet corn.",
    "Golden-fried potato fingers tossed with spicy local red chili powder and peri-peri seasoning.": "Golden-fried potato fingers tossed with spicy local red chili powder and peri-peri seasoning.",
  },
  hi: {
    title: "हिमाचली व्यंजन उत्सव मार्गदर्शिका",
    subtitle: "माँ शूलिनी मेला २०२६ में सोलन के प्रामाणिक और प्रसिद्ध प्रतिष्ठानों का पता लगाएं। अपने बजट की गणना करें और स्थानीय स्ट्रीट फूड ट्रेल्स की योजना बनाएं।",
    liveBadge: "लाइव मेला स्टॉल सक्रिय हैं",
    loading: "डेटाबेस से खाद्य सूची लोड की जा रही है...",
    errorText: "खाद्य सूची लोड करने में विफल। पुराना डेटा दिखाया जा रहा है।",
    category: "श्रेणी",
    shop: "दुकान का नाम",
    location: "स्थान",
    selectedItems: "चयनित व्यंजन",
    totalBudget: "आपका भोजन बजट सारांश",
    totalCost: "कुल अनुमानित लागत",
    clearAll: "चयन साफ़ करें",
    rupee: "₹",
    itemsText: "व्यंजन चयनित",
    itineraryTitle: "आपका मार्ग (रूट)",
    recommendationTitle: "आयोजक गाइड और सुझाव",
    recommendation0: "अपने शूलिनी मेला फूड ट्रेल की योजना बनाने के लिए व्यंजनों पर टैप करें!",
    recommendationLight: "मॉल रोड पर शाम की हल्की सैर के लिए बिल्कुल सही!",
    recommendationHeavy: "एक संपूर्ण स्थानीय पाक यात्रा! लोअर/अपर बाज़ार के लिए आरामदायक चलने वाले जूते पहनें।",

    // Delicacies
    "Ghee Siddu": "घी सिड्डू",
    "Famous Jalebi & Rabri": "प्रसिद्ध जलेबी और रबड़ी",
    "Samosa & Local Chana Chutney": "समोसा और स्थानीय चना चटनी",
    "Authentic Himachali Dham": "प्रामाणिक हिमाचली धाम",
    "Traditional Gulab Jamun": "पारंपरिक गुलाब जामुन",
    "Spicy Hill Chowmein": "स्पाइसी हिल चाउमीन",
    "Steamed Momos": "स्टीम्ड मोमोज",
    "Solan Special Burger": "सोलन स्पेशल बर्गर",
    "Masala Kurkure": "मसाला कुरकुरे",
    "Crispy Spring Rolls": "क्रिस्पी स्प्रिंग रोल",
    "Crispy Fried Momos": "कुरकुरे फ्राइड मोमोज",
    "Mountain Veg Fried Rice": "पहाड़ी वेज फ्राइड राइस",
    "Mumbai Pav Bhaji": "मुंबई पाव भाजी",
    "Paneer Tikka Pizza": "पनीर टिक्का पिज्जा",
    "Creamy Cold Coffee": "क्रीमी कोल्ड कॉफी",
    "Assorted Cold Drinks": "ठंडी शीतल पेय",
    "Mango & Strawberry Shakes": "मैंगो और स्ट्रॉबेरी शेक",
    "Cheesy White Sauce Pasta": "चीजी व्हाइट सॉस पास्ता",
    "Masala French Fries": "मसाला फ्रेंच फ्राइज",

    // Categories
    "Traditional Steamed": "पारंपरिक भाप पकाया",
    "Festive Sweet": "उत्सव की मिठाई",
    "Deep Fried Snacks": "तले हुए स्नैक्स",
    "Festive Feast": "पारंपरिक उत्सव भोज",
    "Fast Food": "फास्ट फूड",
    "Snacks": "स्नैक्स (नाश्ता)",
    "Beverages": "पेय पदार्थ",

    // Shops
    "Tribal Lovers (Siddu Specialists)": "ट्राइबल लवर्स (सिड्डू स्पेशलिस्ट्स)",
    "Paddu Halwai (Famous Jalebi Shop)": "पद्दु हलवाई (प्रसिद्ध जलेबी की दुकान)",
    "Rattanjee's Sweets": "रतनजी स्वीट्स",
    "Premjee's Cultural Pandal": "प्रेमजी सांस्कृतिक पंडाल",
    "Narinder Sweets": "नरेंद्र स्वीट्स",
    "Solan Fast Food Corner": "सोलन फास्ट फूड कॉर्नर",
    "Tibetan Food Corner": "तिब्बती फूड कॉर्नर",
    "Chambaghat Cafe & Fast Food": "चम्बाघाट कैफे एंड फास्ट फूड",
    "Local Mela Snack Stall": "स्थानीय मेला स्नैक स्टॉल",
    "Premjee's Food Pandal": "प्रेमजी फूड पंडाल",
    "The Pizza Slice Solan": "द पिज्जा स्लाइस सोलन",
    "Solan Coffee House": "सोलन कॉफी हाउस",
    "Mela Refreshments": "मेला रिफ्रेशमेंट्स",

    // Locations
    "Mall Road / Anand Vihar Canopy": "मॉल रोड / आनंद विहार कैनोपी",
    "Upper Bazar Lane": "अपर बाज़ार लेन",
    "The Mall Road (Opp. Hanuman Temple)": "मॉल रोड (हनुमान मंदिर के सामने)",
    "Opposite Old Bus Stand Complex": "पुराने बस स्टैंड कॉम्प्लेक्स के सामने",
    "Chambaghat Chowk / Mall Road Branch": "चम्बाघाट चौक / मॉल रोड शाखा",
    "Thodo Ground Food Court": "ठोडो ग्राउंड फूड कोर्ट",
    "Mall Road Food Street": "मॉल रोड फूड स्ट्रीट",
    "Chambaghat Chowk Corner": "चम्बाघाट चौक कॉर्नर",
    "Children's Park Gate": "चिल्ड्रन्स पार्क गेट",

    // Descriptions
    "Traditional walnut and poppy seed stuffed steamed wheat bread, served dripping with hot local ghee.": "अखरोट और पोस्ता दाने से भरा पारंपरिक उबला हुआ गेहूं का सिड्डू, गर्म स्थानीय घी में डुबोकर परोसा जाता है।",
    "Crispy, hot local jalebis fried fresh in pure ghee, a historic Solan sweet specialty.": "शुद्ध देसी घी में तली हुई गरमा-गरम कुरकुरी जलेबियां, सोलन की एक ऐतिहासिक मिठाई विशेषता।",
    "Solan's iconic heavy-stuffed potato samosas served with traditional spicy mint and tamarind chickpeas.": "सोलन के प्रसिद्ध आलू समोसे, तीखे पुदीने और इमली वाले चनों के साथ परोसे जाते हैं।",
    "Traditional slow-cooked festive community feast featuring Madra, Sepu Badi, and Khatta served on authentic leaf plates.": "पत्तल पर परोसा जाने वाला पारंपरिक उत्सव भोज जिसमें मदरा, सेपू बड़ी और खट्टा शामिल हैं।",
    "Soft, warm melt-in-your-mouth mawa gulab jamuns, an absolute local staple post-dinner.": "मुँह में पिघलने वाले बेहद नर्म, गर्म मावा गुलाब जामुन, रात के खाने के बाद यहाँ के लोगों का पसंदीदा मीठा।",
    "Stir-fried noodles with crisp local mountain vegetables and spicy Himalayan sauces.": "ताज़ी पहाड़ी सब्जियों और तीखे हिमाचली सॉस के साथ तले हुए नूडल्स (चाउमीन)।",
    "Steamed vegetable or paneer dumplings served with spicy red chili chutney.": "सब्जी या पनीर के मोमोज, तीखी लाल मिर्च की कटोरे के साथ परोसे जाते हैं।",
    "Crisp potato patty with fresh cucumber, tomato slices, and local green chutney in a toasted bun.": "बन में कुरकुरी आलू टिक्की, ताजा खीरा, टमाटर और तीखी हरी चटनी।",
    "Crispy, spicy local potato and gram flour sticks seasoned with tangy Himachali chaat masala.": "आलू और बेसन से बने कुरकुरे और तीखे स्नैक्स, चटपटे हिमाचली चाट मसाला के साथ।",
    "Deep-fried wrappers filled with crunchily stir-fried spring vegetables and glass noodles.": "कुरकुरी तली हुई स्प्रिंग रोल शीट, जिसमें पत्तागोभी, गाजर और नूडल्स की स्टफिंग है।",
    "Deep-fried golden momos stuffed with paneer and vegetables, served with creamy mayo and fiery hot chutney.": "तले हुए सुनहरे वेज और पनीर मोमोज, मेयोनेज़ और तीखी चटनी के साथ।",
    "Wok-tossed rice with crisp mountain vegetables, garlic, and rich soy sauce.": "कढ़ाई में भुने हुए चावल, ताजी पहाड़ी सब्जियों, लहसुन और सोया सॉस के साथ।",
    "Spicy mashed mixed vegetable curry served hot with butter-toasted soft bread rolls.": "मक्खन में सेके हुए नर्म पाव के साथ परोसी जाने वाली तीखी और चटपटी मैश की हुई मिश्रित सब्जियों की भाजी।",
    "Freshly baked woodfired-style pizza topped with spiced paneer tikka cubes, capsicum, and loaded cheese.": "स्पाइसी पनीर टिक्का क्यूब्स, शिमला मिर्च और ढेर सारे पनीर (चीज़) से बना ताजा पिज्जा।",
    "Chilled whipped milk with rich espresso coffee and topped with a scoop of chocolate syrup.": "दूध और रिच एस्प्रेसो कॉफी का ठंडा मिश्रण, ऊपर से चॉकलेट सिरप के साथ।",
    "Chilled carbonated soft drinks to beat the heat at the fairgrounds.": "मेला क्षेत्र में गर्मी दूर करने के लिए ठंडे शीतल पेय पदार्थ।",
    "Thick and creamy shakes prepared with fresh mango pulp or strawberry syrup and chilled milk.": "ताजे आम के गूदे या स्ट्रॉबेरी सिरप और ठंडे दूध से बने गाढ़े और मलाईदार शेक।",
    "Penne pasta tossed in rich, velvety cheese sauce, garlic, herbs, and sweet corn.": "क्रीमी चीज़ सॉस, लहसुन, जड़ी-बूटियों और स्वीट कॉर्न के साथ पकाया गया पेने पास्ता।",
    "Golden-fried potato fingers tossed with spicy local red chili powder and peri-peri seasoning.": "सुनहरे तले हुए आलू के फिंगर्स, तीखे स्थानीय लाल मिर्च पाउडर और पेरी-पेरी मसाले के साथ।"
  }
};

// Fallback dataset mapped to famous Solan establishments
const FALLBACK_MENU: FoodItem[] = [
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

export default function FoodPage() {
  const { language } = useLanguage();
  const [foodMenu, setFoodMenu] = useState<FoodItem[]>(FALLBACK_MENU);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Stable translation helper — only re-creates when language switches
  const translateMeta = useCallback((text: string): string => {
    const dict = UI_TRANSLATIONS[language] as Record<string, string>;
    return dict[text] || text;
  }, [language]);

  const ui = UI_TRANSLATIONS[language];

  // Runs once on mount — language switches only affect display text, not data fetching
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function loadMenu() {
      try {
        const response = await fetch("/api/food/live");
        if (response.ok) {
          const data = await response.json();
          if (data.ok && Array.isArray(data.menu) && data.menu.length > 0) {
            setFoodMenu(data.menu);
            setError(null);
          } else {
            throw new Error("No items returned from database.");
          }
        } else {
          throw new Error("API responded with an error status.");
        }
      } catch (err) {
        console.error("Failed to fetch food items from live API, using fallback:", err);
        // Read translation at call-time to avoid stale closure
        setError(UI_TRANSLATIONS[language]?.errorText ?? "Failed to load menu.");
      } finally {
        setIsLoading(false);
      }
    }
    loadMenu();
  }, []); // intentional: fetch runs once; language is display-only

  // ── Memoised derivations ─────────────────────────────────────────────────
  // Re-compute only when foodMenu array reference or selectedIds array changes
  const selectedItems = useMemo(
    () => foodMenu.filter((item) => selectedIds.includes(item.id)),
    [foodMenu, selectedIds]
  );

  const totalCost = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price, 0),
    [selectedItems]
  );

  // Stable toggle — functional updater form means zero external dependencies
  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // Unique shop list for the route itinerary panel
  const uniqueShops = useMemo(
    () => Array.from(new Set(selectedItems.map((item) => translateMeta(item.shop)))),
    [selectedItems, translateMeta]
  );

  // Smart recommendation — depends only on totalCost value and current UI strings
  const recommendationText = useMemo(() => {
    if (totalCost === 0) return ui.recommendation0;
    return totalCost <= 100 ? ui.recommendationLight : ui.recommendationHeavy;
  }, [totalCost, ui]);

  return (
    <div className="w-full bg-[#fcfbf9] text-stone-900 min-h-screen py-12 md:py-20 relative">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-red-800/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Pulsing Active Header badge */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/60 px-4 py-1.5 rounded-full text-[10px] font-black text-orange-600 uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            {ui.liveBadge}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-serif font-black text-red-950 flex items-center justify-center gap-3">
            <Utensils className="w-8 h-8 text-amber-600 inline-block" />
            {ui.title}
          </h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-stone-600 text-sm md:text-base leading-relaxed font-sans mt-2">
            {ui.subtitle}
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs text-center font-semibold">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-stone-500 text-sm font-serif">{ui.loading}</p>
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Responsive Grid Layout */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {foodMenu.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggle(item.id)}
                    style={{ contentVisibility: "auto", containIntrinsicSize: "1px 220px" }}
                    className={`bg-white rounded-2xl border p-5 shadow-sm cursor-pointer flex flex-col justify-between relative overflow-hidden group select-none
                      transform-gpu will-change-transform
                      transition-[box-shadow,border-color,transform] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]
                      hover:shadow-md ${
                      isSelected
                        ? "border-amber-500 ring-2 ring-amber-500/10 bg-amber-50/5"
                        : "border-slate-100 hover:border-amber-300"
                    }`}
                  >
                    {/* Active Select Checkbox */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center
                          transform-gpu will-change-transform
                          transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                          isSelected
                            ? "bg-amber-500 border-amber-500 text-white scale-105"
                            : "border-slate-300 bg-white group-hover:border-amber-500"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="space-y-3 pr-6">
                      {/* Category Badge */}
                      <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider block w-fit">
                        {translateMeta(item.category)}
                      </span>

                      {/* Dish Name */}
                      <h3 className="text-lg font-serif font-black text-red-950 group-hover:text-amber-800 transition-colors duration-200">
                        {translateMeta(item.name)}
                      </h3>

                      {/* Famous Local Shop Name */}
                      <div className="flex items-center gap-1.5 text-xs text-amber-900 font-semibold bg-amber-50/45 py-1 px-2 rounded-lg w-fit border border-amber-100/50">
                        <Store className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{translateMeta(item.shop)}</span>
                      </div>

                      {/* Description */}
                      <p className="text-stone-600 text-xs leading-relaxed font-sans min-h-[44px] pt-1">
                        {translateMeta(item.description)}
                      </p>
                    </div>

                    {/* Footer Location and Price Badges */}
                    <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between text-xs text-stone-500">
                      <div className="flex items-center gap-1.5 min-w-0 pr-2">
                        <MapPin className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span className="truncate block font-medium" title={translateMeta(item.location)}>
                          {translateMeta(item.location)}
                        </span>
                      </div>
                      
                      {/* Price Badge */}
                      <div className="bg-amber-50 text-amber-700 font-extrabold px-3 py-1 rounded-xl text-sm flex-shrink-0">
                        {ui.rupee}{item.price}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Sticky Food Trail Summary Box */}
            <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                
                <h2 className="text-lg font-serif font-black text-red-950 mb-4 pb-3 border-b border-stone-200/60">
                  {ui.totalBudget}
                </h2>

                {/* Selected Items List */}
                {selectedItems.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-6">
                    {selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-stone-200/40 text-xs hover:bg-stone-50"
                      >
                        <div className="truncate pr-2">
                          <span className="font-serif font-bold text-stone-800 block truncate">
                            {translateMeta(item.name)}
                          </span>
                          <span className="text-[10px] text-stone-500 block truncate">
                            {translateMeta(item.shop)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-bold text-amber-700">{ui.rupee}{item.price}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggle(item.id);
                            }}
                            className="text-stone-400 hover:text-red-700 p-1 transition-colors duration-200 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-stone-400 text-xs font-sans">
                    {ui.recommendation0}
                  </div>
                )}

                {/* Automated Itinerary Path */}
                {uniqueShops.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50/40 rounded-2xl border border-red-950/5 space-y-2">
                    <span className="text-[10px] font-serif font-black text-red-900 uppercase tracking-widest block">
                      {ui.itineraryTitle}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-sans font-bold text-stone-800">
                      {uniqueShops.map((shopName, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <span className="text-amber-500 font-sans mx-0.5">➔</span>}
                          <span className="bg-white text-stone-800 px-2 py-0.5 rounded-md border border-stone-200/80 shadow-sm">
                            {shopName}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dashboard budget counter */}
                <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/60 mb-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>{ui.selectedItems}</span>
                    <span className="font-bold text-stone-800 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-sm">
                      {selectedIds.length} {ui.itemsText}
                    </span>
                  </div>

                  <div className="flex items-end justify-between border-t border-amber-200/40 pt-3">
                    <span className="text-xs font-serif font-black text-red-950 uppercase tracking-wider">
                      {ui.totalCost}
                    </span>
                    <span className="text-3xl font-black text-amber-700 font-serif leading-none">
                      {ui.rupee}{totalCost}
                    </span>
                  </div>
                </div>

                {/* Smart Budget Feedback Message */}
                <div className="bg-white rounded-2xl p-4 border border-stone-200/40 flex gap-3 items-start">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                      {ui.recommendationTitle}
                    </h4>
                    <p className="text-stone-700 text-xs font-sans leading-relaxed">
                      {recommendationText}
                    </p>
                  </div>
                </div>

                {/* Clear Selection Button */}
                {selectedIds.length > 0 && (
                  <button
                    onClick={() => setSelectedIds([])}
                    className="w-full mt-4 py-2.5 rounded-xl border border-red-200 text-red-700 text-xs font-bold hover:bg-red-50 active:scale-[0.98] transform-gpu will-change-transform transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer text-center block bg-white"
                  >
                    {ui.clearAll}
                  </button>
                )}
              </div>

              {/* Informative Walk Box */}
              <div className="bg-gradient-to-br from-red-950 to-stone-900 text-white rounded-3xl p-5 border border-amber-500/10 shadow-md">
                <p className="text-xs italic text-stone-300 leading-relaxed font-serif text-center">
                  "Solan's traditional food map guides you to the original culinary roots in Upper and Lower Bazar. Stalls operate all 3 days of Shoolini Fair."
                </p>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  <span>Interactive Route Planner Active</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
