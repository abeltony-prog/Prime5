"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { 
  Handshake, 
  Star, 
  Users, 
  Trophy, 
  Target, 
  Award, 
  ArrowRight, 
  Zap, 
  Shield, 
  Briefcase,
  TrendingUp,
  Globe,
  Sparkles
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SponsorsPage() {
  const mainSponsors = [
    {
      name: "Plasera",
      logo: "/logo/plasera.png",
      tier: "Title Sponsor",
      description: "Leading sports technology company providing innovative solutions for modern athletics. Plasera is the heartbeat of Prime5 innovation.",
      impact: "1M+ Monthly Reach",
      color: "from-lime-400 to-lime-600"
    },
    {
      name: "Planet Events",
      logo: "/logo/planetevents.png",
      tier: "Equipment Partner",
      description: "Premium futsal equipment and apparel for professional players. Defining the physical state of the universe.",
      impact: "Official Ball Provider",
      color: "from-emerald-400 to-emerald-600"
    },
  ]

  const partnerSponsors = [
    { name: "Zaria Coart", logo: "https://cdn.prod.website-files.com/682a572382c4d682bcc2fcfa/682a572382c4d682bcc2fd45_Logo.svg" },
    { name: "Officeats", logo: "/logo/officeeats.png" },
    { name: "Minisports", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTryrY6LNsvwa8EeKSOpVa8mWm4NuE48vW57g&s" },
    { name: "Isimbi Designs", logo: "/logo/isimb.png" },
    { name: "BM", logo: "/logo/BM.png" },
    { name: "Plas", logo: "/logo/plas.png" },
  ]

  const sponsorshipTiers = [
    {
      tier: "Galaxy Titan",
      price: "RWF 500,000",
      type: "Title Sponsor",
      benefits: [
        "League naming rights",
        "Logo on all jerseys",
        "Stadium naming rights",
        "VIP hospitality package",
        "Global media coverage",
        "Prime placement on Digital Hub",
      ],
      icon: Trophy,
      theme: "lime",
      tag: "ELITE"
    },
    {
      tier: "Orbital Partner",
      price: "RWF 150,000",
      type: "Official Partner",
      benefits: [
        "Logo on team jerseys",
        "Stadium digital boards",
        "Match day announcements",
        "Social media integrations",
        "Website partner portal",
      ],
      icon: Handshake,
      theme: "emerald",
      tag: "PRO"
    },
    {
      tier: "Star Support",
      price: "RWF 100,000",
      type: "Supporter",
      benefits: [
        "Logo on official website",
        "Social media mentions",
        "Match day programs",
        "Network access",
      ],
      icon: Users,
      theme: "forest",
      tag: "FOUNDER"
    },
  ]

  return (
    <div className="min-h-screen text-white selection:bg-lime-400 selection:text-black font-heading">
      <Navigation />

      {/* Decorative Blur Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-lime-400/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-lime-400/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 pt-32 pb-24">
        {/* Cinematic Hero */}
        <section className="container mx-auto px-4 mb-32">
          <div className="max-w-5xl">
            <div className="flex flex-wrap items-center gap-4 mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
              <Badge className="bg-lime-400/10 text-lime-400 border-lime-400/20 px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px]">
                Strategic Alliances
              </Badge>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <Globe size={14} className="text-lime-300" />
                Global Partner Network
              </div>
            </div>
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 leading-[0.8] animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
              Powering the <br />
              <span className="text-lime-300">Prime5 League.</span>
            </h1>
            <p className="text-xl text-white/40 uppercase font-bold tracking-widest max-w-2xl animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
              Celebrating the visionary brands that fuel the Prime5 revolution. 
              Together, we define the future of high-performance sport.
            </p>
          </div>
        </section>

        {/* Title Sponsor Spotlight */}
        <section className="container mx-auto px-4 mb-40">
           <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div className="relative group animate-in fade-in slide-in-from-left-10 duration-1000">
               <div className="absolute -inset-4 bg-gradient-to-r from-lime-400/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               <div className="relative glass-dark rounded-[4rem] p-16 border border-lime-400/20 overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                   <Sparkles size={200} className="text-lime-300" />
                 </div>
                 <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="bg-white/5 rounded-3xl p-8 mb-12 shadow-[0_0_50px_rgba(190,242,100,0.1)] border border-white/10 group-hover:scale-105 transition-transform duration-700">
                     <Image
                       src="/logo/plasera.png"
                       alt="Plasera"
                       width={280}
                       height={140}
                       className="object-contain"
                     />
                   </div>
                   <Badge className="bg-lime-400 text-black px-6 py-2 font-black uppercase tracking-[0.3em] text-[10px] mb-6 italic">
                     Title Sponsor
                   </Badge>
                   <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-6">Plasera</h2>
                   <p className="text-lg text-white/50 font-bold uppercase tracking-widest max-w-sm mb-12 leading-relaxed">
                     The core architectural partner of the Prime5 League development engine.
                   </p>
                   <div className="flex items-center gap-8 border-t border-white/5 pt-12 w-full">
                     <div className="flex-1 text-center">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Network Impact</p>
                       <p className="text-2xl font-black text-lime-300 italic">1.2M+</p>
                     </div>
                     <div className="h-12 w-px bg-white/5"></div>
                     <div className="flex-1 text-center">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Protocol Status</p>
                       <p className="text-2xl font-black text-white italic">Active</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
                <div className="flex items-center gap-4 text-lime-300 mb-4">
                  <div className="h-px w-12 bg-lime-300/30"></div>
                  <span className="text-xs font-black uppercase tracking-[0.4em]">The Engine of Innovation</span>
                </div>
                <h3 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-8">
                  Defining the <br />
                  <span className="text-white/20">Standard.</span>
                </h3>
                <p className="text-lg text-white/40 font-bold uppercase tracking-widest leading-relaxed mb-12">
                  Plasera doesn't just sponsor the league—they build it. As our title partner, 
                  they provide the technological backbone that allows our tactical systems 
                  to operate at the speed of the universe.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Shield, label: "Security", desc: "Hardened Auth" },
                    { icon: Zap, label: "Speed", desc: "Low Latency" },
                    { icon: Target, label: "Precision", desc: "Tactical Data" },
                    { icon: Globe, label: "Scale", desc: "Global Reach" }
                  ].map((feat, i) => (
                    <div key={i} className="glass-dark rounded-3xl p-6 border border-white/5 hover:border-lime-300/20 transition-all group">
                      <feat.icon size={20} className="text-lime-300 mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{feat.label}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/30">{feat.desc}</p>
                    </div>
                  ))}
                </div>
             </div>
           </div>
        </section>

        {/* Partners Grid */}
        <section className="container mx-auto px-4 mb-40">
          <div className="flex items-center justify-between gap-8 mb-16 px-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Official <span className="text-lime-300">Allies</span></h2>
            <div className="h-px flex-1 bg-white/5"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Authorized Partners List</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Planet Events - Special Treatment as Equipment Partner */}
             <div className="group relative glass-dark rounded-[3rem] p-12 border border-white/10 hover:border-emerald-400/30 transition-all duration-500 overflow-hidden lg:col-span-1">
                <div className="absolute top-0 right-0 p-8 opacity-5 scale-125">
                   <Briefcase size={120} className="text-emerald-400" />
                </div>
                <div className="relative z-10">
                  <Badge className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20 px-3 py-1 font-black uppercase tracking-widest text-[8px] mb-8">
                    Equipment Partner
                  </Badge>
                  <div className="bg-white/10 rounded-2xl p-6 mb-8 w-fit shadow-xl group-hover:scale-105 transition-transform border border-white/5">
                    <Image
                      src="/logo/planetevents.png"
                      alt="Planet Events"
                      width={160}
                      height={80}
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                  <h4 className="text-3xl font-black italic uppercase tracking-tight mb-4 group-hover:text-emerald-400 transition-colors">Planet Events</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 leading-relaxed mb-8">
                    Providing the physical gear that stands up to the pressure of the arena.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <TrendingUp size={14} />
                    Verified Supplier
                  </div>
                </div>
             </div>

             {/* Partner Network Grid */}
             <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {partnerSponsors.map((partner, i) => (
                  <div 
                    key={i} 
                    className="group relative glass-dark rounded-3xl p-8 border border-white/5 hover:border-lime-300/30 transition-all duration-500 flex flex-col items-center justify-center text-center animate-in fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className={`relative h-20 w-full mb-6 filter transition-all duration-700 opacity-40 group-hover:opacity-100 scale-90 group-hover:scale-110 ${
                      partner.name === "Minisports" || partner.name === "Isimbi Designs" || partner.name === "BM" || partner.name === "Plas"
                        ? "invert brightness-200"
                        : partner.name === "Officeats" 
                          ? "" 
                          : "grayscale group-hover:grayscale-0"
                    }`}>
                      <Image
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-lime-300 transition-colors">
                      {partner.name}
                    </span>
                  </div>
                ))}
                <div className="glass-dark rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-lime-400/5 transition-all">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-lime-300 group-hover:text-black transition-all">
                      <Plus size={20} />
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">Your Brand</span>
                </div>
             </div>
          </div>
        </section>

        {/* Sponsorship Packages */}
        <section className="container mx-auto px-4 mb-40">
           <div className="text-center mb-24">
             <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
               Expansion Packs
             </div>
             <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4">
               Partnership <span className="text-lime-300">Tiers.</span>
             </h2>
             <p className="text-lg text-white/40 uppercase font-bold tracking-widest max-w-xl mx-auto">
               Available deployment protocols for strategic allies.
             </p>
           </div>

           <div className="grid lg:grid-cols-3 gap-8">
             {sponsorshipTiers.map((pkg, i) => (
               <div 
                key={i}
                className={`group relative glass-dark rounded-[3rem] p-12 border transition-all duration-500 flex flex-col ${
                  pkg.theme === 'lime' 
                    ? "border-lime-400/30 bg-lime-400/[0.02]" 
                    : "border-white/10 hover:border-white/30"
                }`}
               >
                 <div className="flex items-start justify-between mb-12">
                   <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 ${
                     pkg.theme === 'lime' ? "bg-lime-300 text-black" : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white"
                   }`}>
                     <pkg.icon size={32} />
                   </div>
                   <Badge className={`${
                     pkg.theme === 'lime' ? "bg-lime-300 text-black" : "bg-white/10 text-white/40"
                   } px-4 py-1 font-black uppercase tracking-widest text-[8px] italic`}>
                     {pkg.tag}
                   </Badge>
                 </div>

                 <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">{pkg.type}</p>
                 <h4 className="text-4xl font-black italic uppercase tracking-tighter mb-6">{pkg.tier}</h4>
                 
                 <div className="mb-12">
                    <p className="text-xl font-black text-white italic">{pkg.price}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Per Battle Season</p>
                 </div>

                 <ul className="space-y-4 mb-12 flex-1">
                   {pkg.benefits.map((benefit, bi) => (
                     <li key={bi} className="flex items-center gap-3 group/item">
                       <Star size={12} className={`transition-all duration-300 ${
                         pkg.theme === 'lime' ? "text-lime-300" : "text-white/20 group-hover/item:text-white"
                       }`} />
                       <span className="text-xs font-bold uppercase tracking-widest text-white/50 group-hover/item:text-white transition-colors">{benefit}</span>
                     </li>
                   ))}
                 </ul>

                 <Button className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs italic transition-all duration-500 overflow-hidden relative group/btn ${
                   pkg.theme === 'lime' 
                     ? "bg-lime-300 text-black hover:scale-[1.02] shadow-[0_0_30px_rgba(190,242,100,0.2)]" 
                     : "bg-white/5 text-white hover:bg-white/10"
                 }`}>
                   <span className="relative z-10 flex items-center justify-center gap-2">
                     Initiate Protocol <ArrowRight size={16} />
                   </span>
                 </Button>
               </div>
             ))}
           </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
           <div className="relative glass-dark rounded-[4rem] p-12 md:p-24 border border-lime-400/20 overflow-hidden">
             <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-lime-400/10 to-transparent pointer-events-none"></div>
             <div className="relative z-10 max-w-3xl">
               <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-tight mb-8">
                 Joint <span className="text-lime-300 text-6xl md:text-9xl">Operations.</span>
               </h2>
               <p className="text-xl text-white/40 font-bold uppercase tracking-widest max-w-xl mb-12">
                 Join the most aggressive sport expansion in Rwanda. 
                 Deploy your brand into the Prime5 ecosystem today.
               </p>
               <div className="flex flex-col sm:flex-row gap-6">
                 <Button asChild className="h-20 px-12 bg-lime-300 text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs italic group">
                   <Link href="/contact" className="flex items-center gap-3">
                     Contact HQ <Briefcase size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                   </Link>
                 </Button>
                 <Button asChild variant="outline" className="h-20 px-12 border-white/10 hover:border-white/30 hover:bg-white/5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs italic text-white/60 hover:text-white">
                   <Link href="/sponsorship-package.pdf" className="flex items-center gap-3">
                     Download Briefing <Shield size={18} />
                   </Link>
                 </Button>
               </div>
             </div>
           </div>
        </section>
      </div>
    </div>
  )
}

function Plus({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  )
}
