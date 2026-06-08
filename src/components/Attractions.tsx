"use client";

import { motion } from "framer-motion";
import { Music, Trophy, Users, ShoppingBag, ArrowUpRight, Sparkles } from "lucide-react";

export default function Attractions() {
  const categories = [
    {
      title: "Cultural Nights",
      icon: Music,
      bgGradient: "from-amber-500/10 to-maroon/10 hover:to-maroon/20",
      accentColor: "text-saffron border-saffron/20 bg-saffron/5",
      description: "As dusk falls over Solan, Thodo Ground turns into a glowing amphitheater celebrating Himachali culture.",
      highlights: [
        "Traditional Nati, Dandras, and Rasa dance showcases",
        "Performances by popular Himachali folk and classical musicians",
        "Energetic regional theatre performances & skits",
        "Grand sound, light, and spiritual laser shows"
      ],
      tag: "Live Stages"
    },
    {
      title: "Sports Tournaments",
      icon: Trophy,
      bgGradient: "from-yellow-600/10 to-maroon-light/10 hover:to-maroon-light/20",
      accentColor: "text-gold border-gold/20 bg-gold/5",
      description: "A celebration of athletic prowess, displaying historic combat games and modern competitive matches.",
      highlights: [
        "The Historic Thoda Archery Martial Arts tournament",
        "Wrestling (Dangal) championship attracting national Pehlwans",
        "State-level Volleyball & Kabaddi matches",
        "Open Badminton tournament for local youths"
      ],
      tag: "Valor & Games"
    },
    {
      title: "Family Activities",
      icon: Users,
      bgGradient: "from-orange-500/10 to-maroon/10 hover:to-maroon/20",
      accentColor: "text-orange-500 border-orange-500/20 bg-orange-50/5",
      description: "Engaging and joyous exhibitions tailored for families, children, and creative enthusiasts.",
      highlights: [
        "The Solan Flower Show showcasing Himalayan flora",
        "Baby Show & Children's fancy dress competitions",
        "Creative Slogan Writing & Painting competitions",
        "Community Pet Show showcasing local dogs"
      ],
      tag: "Joy & Creativity"
    },
    {
      title: "The Himachali Bazaar",
      icon: ShoppingBag,
      bgGradient: "from-amber-600/10 to-maroon-dark/10 hover:to-maroon-dark/20",
      accentColor: "text-amber-700 border-amber-700/20 bg-amber-50/5",
      description: "A sensory feast featuring regional crafts, artisanal products, and authentic Himachali culinary treats.",
      highlights: [
        "Handcrafted Kullu shawls, Kinnauri caps, & woolens",
        "Local wooden crafts, basketry, and stone carvings",
        "Himachali Dham food stalls serving authentic Siddu and Madra",
        "Spiritual community Bhandaras serving free blessed meals"
      ],
      tag: "Crafts & Feasts"
    }
  ];

  return (
    <section id="attractions" className="py-20 bg-stone-100 text-stone-900 border-t border-stone-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-saffron font-bold text-xs uppercase tracking-widest block font-serif">
            Highlights & Parallel Events
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-maroon">
            Festival Attractions
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
          <p className="text-stone-600 max-w-xl mx-auto text-sm">
            Beyond the spiritual processions, Maa Shoolini Mela hosts a variety of athletic, musical, and commercial gatherings celebrating Himachal's vibrant spirit.
          </p>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative group bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 overflow-hidden flex flex-col justify-between`}
              >
                {/* Radial Glow on hover */}
                <div className="absolute -inset-px bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />

                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl border ${cat.accentColor} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cat.accentColor}`}>
                      {cat.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-900 group-hover:text-maroon transition-colors duration-200 mb-3 flex items-center gap-1.5">
                    {cat.title}
                    <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-maroon opacity-0 group-hover:opacity-100 transition-all duration-200" />
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {cat.description}
                  </p>

                  {/* Sub-Event Bullet Points */}
                  <div className="border-t border-stone-100 pt-5 space-y-3">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block mb-2">
                      Key Highlights:
                    </span>
                    <ul className="space-y-2.5">
                      {cat.highlights.map((highlight, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2 text-xs text-stone-700">
                          <Sparkles className="w-3.5 h-3.5 text-saffron mt-0.5 shrink-0 opacity-80" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Decorative Bottom Corner Arch Accent */}
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-maroon/5 rounded-full border border-gold/10 group-hover:scale-125 transition-transform duration-500 opacity-60" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
