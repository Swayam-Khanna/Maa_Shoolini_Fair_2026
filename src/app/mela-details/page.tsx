import { Sparkles, Calendar, Compass, ShieldCheck } from "lucide-react";

export default function MelaDetails() {
  return (
    <section className="py-20 bg-cream text-stone-900 flex-grow scroll-mt-16 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-maroon/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Breadcrumb/Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-saffron font-bold text-xs uppercase tracking-widest block font-serif">
            History & Heritage
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-black text-maroon">
            Mela Legends & Solan Origin
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Historical Narrative */}
          <div className="lg:col-span-7 space-y-8 bg-white p-8 rounded-3xl border border-stone-200/60 shadow-sm relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 text-saffron font-bold text-xs uppercase tracking-widest font-serif">
              <Sparkles className="w-4 h-4 text-saffron animate-pulse" />
              Sacred Protectors of the Valley
            </div>

            <div className="space-y-6 text-stone-700 text-sm leading-relaxed font-sans">
              <p>
                Solan, often hailed as the "Mushroom City of India," is deeply steeped in spiritual history. The entire valley and the name of the town itself—<strong>Solan</strong>—derives directly from <strong>Maa Shoolini Devi</strong>, the presiding deity who has blessed and safeguarded this region for centuries.
              </p>
              
              <div className="border-l-4 border-saffron pl-4 my-6 italic text-stone-800 bg-saffron/5 p-4 rounded-r-xl">
                "According to local lore, Maa Shoolini is an incarnation of Goddess Durga, carrying the holy Shoola (Trident) to ward off demonic forces and shield her devotees from adversity."
              </div>

              <h3 className="text-xl font-serif font-bold text-maroon pt-2">The Legacy of the Baghat Dynasty</h3>
              <p>
                The historic mela traces its roots back over a hundred years to the era of the princely rulers of the <strong>Baghat State</strong>. Solan served as the capital of this ancient kingdom.
              </p>
              <p>
                In times of drought, harvest failure, and outbreaks of plagues, the local Baghat kings turned to Maa Shoolini for protection. Following the eradication of a severe epidemic in the valley, the ruling monarch initiated an annual celebration to pay homage to the Goddess. 
              </p>
              <p>
                This celebration marks the sacred journey of the deity from her permanent temple to visit her sister, Goddess Durga, situated at the central Solan town market temple (Ganj Bazaar).
              </p>

              <h3 className="text-xl font-serif font-bold text-maroon pt-2">The Modern-Day Celebration</h3>
              <p>
                Today, the Maa Shoolini Mela has evolved into a State-Level Festival that draws hundreds of thousands of pilgrims, artisans, and tourists from Himachal Pradesh, Punjab, Haryana, and beyond.
              </p>
              <p>
                During these three days, Solan turns into a canvas of colors. The streets are adorned with festive lights, saffron banners, and marigold garlands, accompanied by the echo of traditional wind instruments (Karnal, Turhi) and local drums. It serves as a reminder of Solan's enduring spiritual lineage and local Pahari pride.
              </p>
            </div>
          </div>

          {/* Right Column: Quick Facts Widget */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Fact Card */}
            <div className="bg-white border-2 border-gold/30 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gold/10 rounded-full blur-xl pointer-events-none" />
              <h3 className="text-lg font-serif font-bold text-maroon mb-6 border-b border-stone-100 pb-3">
                Festival Quick Facts
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: "Dates & Duration",
                    value: "June 26 – June 28 (Annual 3-Days)",
                    icon: Calendar
                  },
                  {
                    title: "Historic Origin",
                    value: "Baghat Princely Dynasty of Solan",
                    icon: Compass
                  },
                  {
                    title: "Deity Manifestation",
                    value: "Goddess Durga (wielding the Shoola/Trident)",
                    icon: ShieldCheck
                  }
                ].map((fact, i) => {
                  const Icon = fact.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                      <Icon className="w-5 h-5 text-saffron shrink-0" />
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase block font-semibold">
                          {fact.title}
                        </span>
                        <strong className="text-stone-800 text-xs font-serif block">
                          {fact.value}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 text-center text-[10px] text-stone-500 font-serif border-t border-stone-100 pt-4">
                ॥ जय माँ शूलिनी देवी - सदा सहायते ॥
              </div>
            </div>

            {/* Quote Card */}
            <div className="bg-gradient-to-b from-maroon-dark to-stone-900 text-white rounded-3xl p-6 border border-gold/20 shadow-md text-center">
              <Sparkles className="w-6 h-6 text-gold mx-auto mb-2 opacity-80 animate-pulse" />
              <p className="text-xs italic text-stone-300 leading-relaxed font-serif">
                "Blessed is the valley of Solan, where the holy footsteps of Maa Shoolini reside. May the Goddess bless all with abundance and joy."
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
