"use client";

import { motion } from "framer-motion";
import { Bus, Ban, MapPin, PhoneCall, HelpCircle, ShieldAlert, Train } from "lucide-react";

export default function VisitorInfo() {
  const transitDetails = [
    {
      title: "Free Local RTO Bus Services",
      icon: Bus,
      text: "Special free shuttle buses will operate continuously from June 26 to June 28. These services connect the main Solan bypass, old bus stand, new bus stand, and the outer parking points to Thodo Ground. Running every 15 minutes from 08:00 AM to 11:00 PM."
    },
    {
      title: "Designated Parking Hubs",
      icon: MapPin,
      text: "Vehicular entry is blocked inside the core town. Please park your vehicles at designated parking spots: Solan Bypass Parking, Chambaghat Police Ground, or near the DC Office complex. From there, hop on the free RTO shuttle buses."
    },
    {
      title: "The Kalka-Solan Toy Train",
      icon: Train,
      text: "For a scenic arrival, tourists can board the historic UNESCO World Heritage Kalka-Shimla Toy Train. The Solan Railway Station is just 1.5 km away from Mall Road, and local taxis/shuttles are available at the station."
    }
  ];

  const regulations = [
    {
      title: "Mall Road Pedestrian Zone",
      icon: Ban,
      text: "Mall Road will be strictly closed to all motorized vehicles (including two-wheelers) between 12:00 PM and 11:00 PM daily. This ensures safety for the Grand Shobha Yatra and pedestrian fair-goers."
    },
    {
      title: "Single-Use Plastic Ban",
      icon: ShieldAlert,
      text: "Solan enforces a strict ban on single-use plastics. Please use biodegradable plates, cups, and carry cotton or jute bags for shopping at the Himachali Bazaar. Keep the valley clean!"
    }
  ];

  return (
    <section id="visitor-info" className="py-20 bg-cream text-stone-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-saffron font-bold text-xs uppercase tracking-widest block font-serif">
            Travel & Logistics Guide
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-maroon">
            Visitor Guidelines
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
          <p className="text-stone-600 max-w-xl mx-auto text-sm">
            Make your pilgrimage and holiday stress-free. Review transportation services, parking hubs, and local regulations enforced during the 3-day mela.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Transport & Logistics */}
          <div className="lg:col-span-7 space-y-8">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-950 border-b border-stone-200 pb-3 flex items-center gap-2">
              <Bus className="w-5 h-5 text-saffron" />
              Transit & Commute
            </h3>

            <div className="space-y-6">
              {transitDetails.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-sm"
                  >
                    <div className="p-3 bg-saffron/10 border border-saffron/20 rounded-xl text-saffron h-fit shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-stone-950">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Regulations & Emergency Contacts */}
          <div className="lg:col-span-5 space-y-8">
            {/* Regulations Block */}
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-950 border-b border-stone-200 pb-3 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-maroon" />
                Regulations & Safety
              </h3>

              <div className="space-y-4">
                {regulations.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 25 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="p-5 bg-maroon/5 border-l-4 border-maroon rounded-r-xl space-y-2"
                    >
                      <div className="flex items-center gap-2 text-maroon font-bold text-sm">
                        <Icon className="w-4 h-4 shrink-0" />
                        <h5>{item.title}</h5>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                        {item.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Helpline Numbers Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-stone-900 text-white rounded-3xl p-6 border border-gold/30 shadow-lg space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <h4 className="text-lg font-serif font-bold text-gold flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-gold animate-bounce" />
                  Mela Help Desks & Emergency
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Available 24/7 during the festival. Dial local assistance lines.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="border border-stone-800 p-3 rounded-xl bg-black/25">
                  <span className="text-stone-400 block mb-0.5">Mela Control Room</span>
                  <span className="text-gold font-bold font-serif">+91 1792 220200</span>
                </div>
                <div className="border border-stone-800 p-3 rounded-xl bg-black/25">
                  <span className="text-stone-400 block mb-0.5">Solan Police Helpline</span>
                  <span className="text-gold font-bold font-serif">112 / +91 1792 220224</span>
                </div>
                <div className="border border-stone-800 p-3 rounded-xl bg-black/25">
                  <span className="text-stone-400 block mb-0.5">Regional Health Centre</span>
                  <span className="text-gold font-bold font-serif">+91 1792 220650</span>
                </div>
                <div className="border border-stone-800 p-3 rounded-xl bg-black/25">
                  <span className="text-stone-400 block mb-0.5">RTO Shuttle Inquiry</span>
                  <span className="text-gold font-bold font-serif">+91 1792 220033</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
