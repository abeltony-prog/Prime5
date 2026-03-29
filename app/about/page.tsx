"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { Globe, Trophy, CheckCircle, Mail, Phone, MapPin, Send, Target, Users, LayoutList, Building2, Compass, Rocket } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  const accomplishments = [
    "Successfully organized competitive local futsal tournaments",
    "Built a growing network of teams and players in Kigali",
    "Created a structured and engaging match experience",
    "Established a recognizable and fast-rising sports brand",
    "Developed a platform focused on talent exposure and growth",
    "Hosted multiple competitive tournaments with strong team participation and audience engagement, establishing Prime5 as an emerging force in Rwanda’s futsal scene."
  ]

  return (
    <div className="min-h-screen bg-transparent font-['Outfit'] overflow-x-hidden">
      <Navigation />

      {/* Cinematic Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Tactical Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-lime-400/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-lime-400/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Globe className="w-4 h-4 text-lime-400" />
            <span className="text-lime-300 font-black italic uppercase tracking-widest text-[10px]">Prime5 Movement</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 leading-[0.8] animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            Beyond <br />
            <span className="text-lime-300">A Tournament.</span>
          </h1>

          <p className="text-xl text-white/40 uppercase font-bold tracking-widest max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-left-4 duration-700 delay-200 leading-relaxed">
            Redefining futsal through innovation, structure, and opportunity.
          </p>
          
          <div className="flex justify-center group animate-bounce duration-[2000ms]">
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-lime-400 to-transparent" />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#061B14] to-transparent" />
      </section>

      {/* Story / Intro Section */}
      <section className="py-24 bg-[#061B14]/80 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-lime-400" />
                <span className="text-lime-400 font-black uppercase tracking-[0.3em] text-[10px]">The Movement</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-8">
                More Than <br />
                <span className="text-lime-300">A Match.</span>
              </h2>
              <div className="space-y-6 text-white/60 font-bold leading-relaxed text-lg">
                <p>
                  Prime5 League is a fast-growing sports platform focused on redefining futsal through innovation, structure, and opportunity. 
                </p>
                <p>
                  Our mission is to build a competitive ecosystem where talent is discovered, teams are empowered, and the game is elevated to a professional standard. From organizing impactful tournaments to building a recognizable sports brand, we are laying the foundation for long-term growth in the industry.
                </p>
                <p>
                  With a clear roadmap to scale across the region and onto the continental stage, Prime5 is positioned to become a key player in the future of African sports.
                </p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden animate-in fade-in scale-in-95 duration-1000 shadow-2xl">
              <div className="absolute inset-0 bg-lime-400/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Image
                src="/assets/about_more_than_match.jpg"
                alt="More Than A Match"
                width={800}
                height={1000}
                className="object-cover w-full h-[600px] grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 left-0 p-12 z-20">
                <div className="glass-dark border border-white/10 p-6">
                  <p className="text-white font-black italic uppercase text-lg mt-2">Elevating The Game</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 bg-[#061B14] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative group overflow-hidden animate-in fade-in scale-in-95 duration-1000 shadow-2xl lg:order-1">
              <div className="absolute inset-0 bg-lime-400/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Image
                src="/assets/about_mission.jpg"
                alt="Mission & Vision"
                width={800}
                height={1000}
                className="object-cover w-full h-[600px] grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 right-0 p-12 z-20">
                <div className="glass-dark border border-white/10 p-6 text-right">
                  <span className="text-lime-300 font-black uppercase tracking-widest text-[10px]">Core Directives</span>
                  <p className="text-white font-black italic uppercase text-lg mt-2">Vision & Mission</p>
                </div>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-right-8 duration-1000 lg:order-2 space-y-16">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-lime-400/10 rounded-full flex items-center justify-center border border-lime-400/20">
                    <Compass className="w-6 h-6 text-lime-400" />
                  </div>
                  <h3 className="text-4xl font-black italic uppercase text-white">Vision</h3>
                </div>
                <p className="text-white/60 font-bold leading-relaxed text-xl border-l-2 border-lime-400 pl-6 border-dashed">
                  To become a leading futsal platform in Africa, discovering and elevating talent while building a strong, competitive, and entertaining football culture across the continent.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-lime-400/10 rounded-full flex items-center justify-center border border-lime-400/20">
                    <Target className="w-6 h-6 text-lime-400" />
                  </div>
                  <h3 className="text-4xl font-black italic uppercase text-white">Mission</h3>
                </div>
                <p className="text-white/60 font-bold leading-relaxed text-xl border-l-2 border-lime-400 pl-6 border-dashed">
                  To create a high-quality, well-organized competition that provides players and teams with exposure, opportunity, and a professional match experience—while promoting discipline, fair play, and community through sport.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accomplishments */}
      <section className="py-32 bg-[#061B14]/80 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-400/5 rounded-full blur-[120px] animate-pulse" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
              <span className="text-lime-300">Accomplishments.</span>
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {accomplishments.map((item, index) => (
              <div key={index} className="glass-dark border border-white/5 p-6 flex flex-col md:flex-row items-center md:items-start gap-6 hover:border-lime-300/30 transition-all group hover:bg-lime-400/5 cursor-default">
                <div className="w-12 h-12 shrink-0 bg-lime-400/10 rounded-full flex items-center justify-center border border-lime-400/20 xl:group-hover:-translate-y-1 transition-transform">
                  <Trophy className="w-5 h-5 text-lime-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-white/70 font-bold text-center md:text-left text-lg group-hover:text-white transition-colors">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasons Structure */}
      <section className="py-32 bg-[#061B14] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-24 flex flex-col lg:flex-row gap-12 items-center justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-lime-400" />
                <span className="text-lime-400 font-black uppercase tracking-[0.3em] text-[10px]">Season Layout</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-tight mb-8">
                Current <br/>
                <span className="text-lime-300">Seasons Structure.</span>
              </h2>
              <p className="text-white/60 font-bold text-lg leading-relaxed">
                Prime5 hosts multiple competitive seasons each year, designed to include different communities and expand the game:
              </p>
            </div>
            
            <div className="relative group w-full lg:w-1/2 overflow-hidden animate-in fade-in scale-in-95 duration-1000 shadow-2xl">
              <div className="absolute inset-0 bg-lime-400/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Image
                src="/assets/about_seasons.jpg"
                alt="Seasons Structure"
                width={800}
                height={500}
                className="object-cover w-full h-[400px] grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="glass-dark border border-white/5 p-10 hover:border-lime-300/30 transition-all group group/card hover:bg-lime-400/5">
              <div className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center mb-8 group-hover/card:scale-110 transition-transform shadow-[0_0_15px_rgba(190,242,100,0.1)]">
                <Users className="w-8 h-8 text-lime-400" />
              </div>
              <h3 className="text-3xl font-black italic uppercase text-white mb-4">Community Season</h3>
              <p className="text-white/50 font-bold leading-relaxed group-hover/card:text-white/80 transition-colors">
                Open to grassroots and competitive local teams, focused on talent discovery and high-level competition.
              </p>
            </div>

            <div className="glass-dark border border-white/5 p-10 hover:border-lime-300/30 transition-all group group/card hover:bg-lime-400/5">
              <div className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center mb-8 group-hover/card:scale-110 transition-transform shadow-[0_0_15px_rgba(190,242,100,0.1)]">
                <Building2 className="w-8 h-8 text-lime-400" />
              </div>
              <h3 className="text-3xl font-black italic uppercase text-white mb-4">Corporate Season</h3>
              <p className="text-white/50 font-bold leading-relaxed group-hover/card:text-white/80 transition-colors">
                Brings together companies and organizations, promoting team building, networking, and workplace engagement through sport.
              </p>
            </div>

            <div className="glass-dark border border-white/5 p-10 hover:border-lime-300/30 transition-all group group/card hover:bg-lime-400/5">
              <div className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center mb-8 group-hover/card:scale-110 transition-transform shadow-[0_0_15px_rgba(190,242,100,0.1)]">
                <LayoutList className="w-8 h-8 text-lime-400" />
              </div>
              <h3 className="text-3xl font-black italic uppercase text-white mb-4">Women's Season</h3>
              <p className="text-white/50 font-bold leading-relaxed group-hover/card:text-white/80 transition-colors">
                Dedicated to empowering women in sports by creating opportunities for female players to compete, grow, and gain visibility.
              </p>
            </div>
          </div>

          <div className="text-center border-t border-white/10 pt-16 mt-8">
            <p className="text-2xl text-lime-300 font-bold tracking-widest uppercase italic max-w-4xl mx-auto leading-relaxed px-4">
              "Through these seasons, Prime5 is building an inclusive and dynamic football ecosystem that supports talent at all levels."
            </p>
          </div>
        </div>
      </section>

      {/* Vision Arena Section (Kept Background Image) */}
      <section className="relative px-6 py-48 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/about_vision_arena.png"
            alt="Futuristic Futsal Arena"
            fill
            className="object-cover opacity-30 grayscale blur-sm"
          />
          <div className="absolute inset-0 bg-[#061B14]/80" />
        </div>

        <div className="relative z-10 container mx-auto text-center max-w-4xl">
          <div className="w-20 h-20 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-lime-400/20">
            <Rocket className="w-10 h-10 text-lime-400" />
          </div>
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-12">
            Shaping <br />
            <span className="text-lime-300 underline underline-offset-[12px] decoration-lime-300/30">The Future.</span>
          </h2>
          <p className="text-2xl text-white font-bold leading-relaxed italic">
            "We’re building something that will shape the future of the game — creating a platform where raw talent meets opportunity."
          </p>
        </div>
      </section>

      {/* Contact Console Section */}
      <section className="py-32 bg-transparent relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24">
            <div className="glass-dark border border-white/10 p-12">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-12">
                Initiate <br />
                <span className="text-lime-300">Contact Protocol.</span>
              </h2>
              
              {formSubmitted ? (
                <div className="text-center py-20 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-lime-400/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="h-10 w-10 text-lime-400" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase text-white mb-4">Transmission Confirmed</h3>
                  <p className="text-white/40 uppercase font-black tracking-widest text-xs">Our operatives will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2 group">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">First Name</Label>
                      <Input required className="bg-white/5 border-white/10 rounded-none h-14 text-white font-bold focus:border-lime-400/50" />
                    </div>
                    <div className="space-y-2 group">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Last Name</Label>
                      <Input required className="bg-white/5 border-white/10 rounded-none h-14 text-white font-bold focus:border-lime-400/50" />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Comm-Link (Email)</Label>
                    <Input type="email" required className="bg-white/5 border-white/10 rounded-none h-14 text-white font-bold focus:border-lime-400/50" />
                  </div>
                  <div className="space-y-2 group">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Mission Subject</Label>
                    <Input required className="bg-white/5 border-white/10 rounded-none h-14 text-white font-bold focus:border-lime-400/50" />
                  </div>
                  <div className="space-y-2 group">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Briefing Details</Label>
                    <Textarea rows={5} required className="bg-white/5 border-white/10 rounded-none text-white font-bold focus:border-lime-400/50" />
                  </div>
                  <Button type="submit" className="w-full bg-lime-300 hover:bg-lime-400 text-black font-black italic uppercase tracking-widest h-16 text-lg rounded-none transition-all duration-300 shadow-[0_10px_30px_rgba(190,242,100,0.1)] group">
                    Send Transmission
                    <Send className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </form>
              )}
            </div>

            <div className="flex flex-col justify-between py-12">
              <div className="space-y-12">
                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 bg-white/5 rounded-none flex items-center justify-center border border-white/10 group-hover:border-lime-400/30 transition-all">
                    <Mail className="h-6 w-6 text-lime-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Email Protocol</p>
                    <p className="text-2xl font-black italic uppercase text-white hover:text-lime-300 transition-colors cursor-pointer">prime5leaguerw@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 bg-white/5 rounded-none flex items-center justify-center border border-white/10 group-hover:border-lime-400/30 transition-all">
                    <Phone className="h-6 w-6 text-lime-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Direct Command Line</p>
                    <p className="text-2xl font-black italic uppercase text-white group-hover:text-lime-300 transition-colors">+250 788 829 084</p>
                  </div>
                </div>

                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 bg-white/5 rounded-none flex items-center justify-center border border-white/10 group-hover:border-lime-400/30 transition-all">
                    <MapPin className="h-6 w-6 text-lime-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Deployment Hub</p>
                    <p className="text-2xl font-black italic uppercase text-white group-hover:text-lime-300 transition-colors tracking-tight">Kigali, Rwanda</p>
                  </div>
                </div>
              </div>

              <div className="glass-dark border border-white/10 p-10 mt-12">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-8">Signal Network</h3>
                <div className="flex gap-4">
                  {[
                    { name: 'Instagram', url: 'https://www.instagram.com/prime5ports/?hl=en' },
                    { name: 'Twitter', url: '#' },
                    { name: 'Facebook', url: '#' }
                  ].map((social) => (
                    <Link key={social.name} href={social.url} target="_blank" className="flex-1">
                      <Button variant="outline" className="w-full border-white/10 hover:bg-lime-300 hover:text-black hover:border-lime-300 text-white font-black italic uppercase tracking-widest text-[10px] h-12 rounded-none transition-all">
                        {social.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
