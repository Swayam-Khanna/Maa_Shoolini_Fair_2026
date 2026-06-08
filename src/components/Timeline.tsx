"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Compass, Award, ShieldAlert } from "lucide-react";

interface TimelineEvent {
  time: string;
  title: string;
  location: string;
  description: string;
  tag: string;
}

export default function Timeline() {
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);

  const daysInfo = {
    1: {
      date: "June 26, 2026",
      title: "Day 1: Grand Shobha Yatra",
      theme: "Spiritual Commencement",
      color: "border-saffron bg-saffron/5",
    },
    2: {
      date: "June 27, 2026",
      title: "Day 2: Cultural Showcase & Crafts",
      theme: "Heritage & Traditions",
      color: "border-maroon bg-maroon/5",
    },
    3: {
      date: "June 28, 2026",
      title: "Day 3: Dangal, Thoda Arts & Closing",
      theme: "Athletic Valor & Farewells",
      color: "border-gold bg-gold/5",
    },
  };

  const events: Record<1 | 2 | 3, TimelineEvent[]> = {
    1: [
      {
        time: "09:00 AM",
        title: "Maha Abhishek & Special Puja",
        location: "Shoolini Mata Temple",
        description: "The mela officially begins with early morning divine rituals, Maha Abhishek, and consecration prayers to Goddess Shoolini by temple priests.",
        tag: "Ritual",
      },
      {
        time: "11:00 AM",
        title: "Arrival of Palki Sahib",
        location: "Temple Courtyard",
        description: "The beautifully decorated golden palanquin (Palki) of Maa Shoolini is brought out of the inner sanctum amidst sacred chants and conch shells.",
        tag: "Spiritual",
      },
      {
        time: "01:30 PM",
        title: "The Grand Shobha Yatra",
        location: "From Shoolini Temple to Solan Town Centre via Mall Road",
        description: "The royal procession commences. The deity travels in the Palki to visit her sister. Thousands of devotees accompany the procession along Mall Road, singing hymns with traditional Himachali musical ensembles (Karnal, Turhi, and Dhol-Nagada) and regional dancers.",
        tag: "Highlight",
      },
      {
        time: "06:30 PM",
        title: "Welcome Aarti & Deity Installation",
        location: "Ganj Bazaar / Town Centre Temple",
        description: "A grand community Aarti welcomes the deity to her temporary abode. Public viewing and prayer offerings begin.",
        tag: "Community",
      },
      {
        time: "08:00 PM",
        title: "Inaugural Cultural Night",
        location: "Thodo Ground Main Stage",
        description: "Spectacular opening ceremony featuring classic Pahari dances and folk music performances by Himachali artists under sparkling lights.",
        tag: "Cultural",
      },
    ],
    2: [
      {
        time: "10:00 AM",
        title: "Himachali Crafts Fair & Bazaar Open",
        location: "Mall Road & Thodo Ground",
        description: "Traditional artisans from Shimla, Kinnaur, Kullu, and Solan display regional goods including handwoven woolens, woodwork, Pahari miniature paintings, and local spices.",
        tag: "Exhibition",
      },
      {
        time: "12:30 PM",
        title: "Folk Troupes Live Performance",
        location: "Thodo Ground Secondary Stage",
        description: "Folk ensembles from across Himachal Pradesh present traditional regional dances including the Nati, Dandras, and Rasa, celebrating regional diversity.",
        tag: "Cultural",
      },
      {
        time: "03:00 PM",
        title: "Himachali Dham & Food Festival",
        location: "Bhandara Enclosures",
        description: "Devotees and visitors feast on the authentic Himachali Dham (traditional feast served on leaf plates) featuring specialty dishes like Siddu, Sepu Badi, Madra, and Sweet Rice.",
        tag: "Feast",
      },
      {
        time: "07:30 PM",
        title: "Grand Himachali Musical Night",
        location: "Thodo Ground Main Stage",
        description: "A celebratory evening showcase with legendary folk singers, performance artists, and energetic modern Himachali pop bands performing live under the stars.",
        tag: "Cultural",
      },
    ],
    3: [
      {
        time: "11:00 AM",
        title: "Historic Thoda Martial Arts Tournament",
        location: "Thodo Ground Arena",
        description: "A thrilling exhibition of the traditional martial art 'Thoda'—an ancient archery combat sport dating back to the Mahabharata, played between rival groups 'Shangri' and 'Pashri'.",
        tag: "Sports",
      },
      {
        time: "02:00 PM",
        title: "The Grand Shoolini Dangal (Wrestling)",
        location: "Thodo Ground Dangal Pit",
        description: "The flagship athletic event of the mela. Renowned traditional wrestlers (Pehlwans) from Himachal, Punjab, Haryana, and Delhi compete for the prestigious Shoolini Mela Title and cash awards.",
        tag: "Sports",
      },
      {
        time: "05:30 PM",
        title: "Prize Distribution & Valedictory Ceremony",
        location: "Thodo Ground Main Stage",
        description: "Felicitation of wrestlers, martial artists, craft exhibitors, and local volunteers by state dignitaries.",
        tag: "Ceremony",
      },
      {
        time: "07:00 PM",
        title: "Divine Palki Return Procession",
        location: "From Town Centre back to Shoolini Temple",
        description: "A emotional, spiritual procession carrying Goddess Shoolini back to her permanent temple. Devotees shower flower petals along the route as she returns.",
        tag: "Highlight",
      },
      {
        time: "08:30 PM",
        title: "Closing Maha Aarti & Fireworks",
        location: "Shoolini Temple Complex",
        description: "The grand 3-day celebration concludes with a stunning multi-lamp Maha Aarti at the temple, followed by spectacular firework displays lighting up the Solan sky.",
        tag: "Ritual",
      },
    ],
  };

  return (
    <section id="schedule" className="py-20 bg-cream text-stone-900 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-saffron font-bold text-xs uppercase tracking-widest block font-serif">
            Day-by-Day Itinerary
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-maroon">
            Mela Schedule Timeline
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
          <p className="text-stone-600 max-w-xl mx-auto text-sm">
            Plan your visit to Solan around the key events. From divine processions and traditional martial archery to cultural nights and delicious food feasts.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-stone-200/60 p-1.5 rounded-2xl border border-stone-300/40 relative">
            {([1, 2, 3] as const).map((day) => {
              const isActive = activeDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`relative px-5 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-serif font-bold transition-colors duration-300 z-10 ${
                    isActive ? "text-white" : "text-stone-600 hover:text-maroon"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-maroon rounded-xl -z-10 shadow-md"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  Day {day} ({day === 1 ? "June 26" : day === 2 ? "June 27" : "June 28"})
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Info Card */}
        <div className="mb-12 max-w-3xl mx-auto">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-l-4 p-5 rounded-r-2xl shadow-sm transition-all duration-300 ${daysInfo[activeDay].color}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-saffron font-bold font-serif">
                  {daysInfo[activeDay].date}
                </span>
                <h3 className="text-xl font-serif font-bold text-maroon mt-1">
                  {daysInfo[activeDay].title}
                </h3>
              </div>
              <span className="px-3 py-1 bg-white border border-stone-200 text-stone-700 text-xs font-semibold rounded-full shadow-sm">
                Theme: {daysInfo[activeDay].theme}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Timeline Events List */}
        <div className="max-w-3xl mx-auto relative border-l border-stone-300/80 ml-4 sm:ml-32 pl-6 sm:pl-10 space-y-10">
          <AnimatePresence mode="wait">
            {events[activeDay].map((event, index) => (
              <motion.div
                key={`${activeDay}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative group"
              >
                {/* Timeline Node Point */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-maroon group-hover:border-saffron group-hover:scale-125 transition-all duration-300 shadow" />

                {/* Left Side Floating Time (Only visible on larger screens) */}
                <div className="hidden sm:block absolute -left-[160px] top-0.5 w-28 text-right pr-6">
                  <span className="text-sm font-serif font-bold text-maroon block">
                    {event.time}
                  </span>
                  <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
                    IST
                  </span>
                </div>

                {/* Main Content Box */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200/80 hover:border-gold/40 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                  {/* Floating decorative corner glow */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 rounded-full blur-xl group-hover:bg-saffron/10 transition-colors" />

                  {/* Mobile Time Header (Only visible under sm size) */}
                  <div className="sm:hidden flex items-center gap-1.5 text-maroon font-bold text-xs mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <h4 className="text-lg font-serif font-bold text-stone-900 group-hover:text-maroon transition-colors duration-200">
                      {event.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      event.tag === "Highlight"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : event.tag === "Ritual"
                        ? "bg-saffron/5 text-saffron-deep border border-saffron/10"
                        : event.tag === "Sports"
                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                        : "bg-stone-100 text-stone-600 border border-stone-200"
                    }`}>
                      {event.tag}
                    </span>
                  </div>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-saffron" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
