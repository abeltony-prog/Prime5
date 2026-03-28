"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Target, 
  Shield, 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Star, 
  Timer, 
  Gamepad2, 
  Trophy,
  ArrowRight,
  Info,
  Dna,
  ShieldCheck,
  MousePointer2
} from "lucide-react"

export default function RulesPage() {
  const gamechangerModes = [
    {
      title: "PlusOne",
      icon: Users,
      description: "Game starts with 1 vs 1 plus goalkeepers. After every goal, one player is added to each side. Goalkeepers cannot leave penalty area or engage in build-up play. Violation results in penalty.",
      effect: "Dramatically increases intensity as teams grow larger with each goal",
      color: "border-red-500/50 from-red-500/10 to-transparent",
      accent: "text-red-400"
    },
    {
      title: "FairPlay",
      icon: Shield,
      description: "Every foul results in being sent off for the remainder of the game along with a free kick or penalty. Deliberate handball and unsporting behavior also result in being sent off.",
      effect: "Forces players to play clean and fair, raising the stakes significantly",
      color: "border-blue-500/50 from-blue-500/10 to-transparent",
      accent: "text-blue-400"
    },
    {
      title: "3PLAY",
      icon: Gamepad2,
      description: "3 vs 3 (teams may but not have to select a goalkeeper). Substitution errors are penalized if they affect the game. Each attacking phase may last for a maximum of 30 seconds.",
      effect: "Creates fast-paced, high-intensity gameplay with strict time limits",
      color: "border-purple-500/50 from-purple-500/10 to-transparent",
      accent: "text-purple-400"
    },
    {
      title: "1-On-1",
      icon: Target,
      description: "One at a time, single player from each team shoots from behind the halfway line. Opposing player stands in their half and may try to stop the goal (no hands allowed). Players must shoot from within the centre circle and must complete the shot within 15 seconds.",
      effect: "Tests individual skill and nerve under extreme pressure",
      color: "border-green-500/50 from-green-500/10 to-transparent",
      accent: "text-green-400"
    },
    {
      title: "Fast Forward",
      icon: Zap,
      description: "After crossing the centreline, players may not play or dribble back into their own half. If they do, a free-kick is given from where the ball was last touched.",
      effect: "Forces attacking play and prevents defensive retreating",
      color: "border-yellow-500/50 from-yellow-500/10 to-transparent",
      accent: "text-yellow-400"
    },
  ]

  const standardRules = [
    {
      category: "Team Composition",
      icon: Users,
      rules: [
        "5 players per team on the court (4 outfield + 1 goalkeeper)",
        "Maximum 10 players per squad",
        "Unlimited substitutions during play",
        "Substitutions must occur in designated areas",
      ],
    },
    {
      category: "Match Duration",
      icon: Timer,
      rules: [
        "Two halves of 15 minutes each (30 minutes total)",
        "Running clock (stops only for timeouts)",
        "2-minute break between halves",
        "Gamechanger activates in final 3 minutes of each half",
      ],
    },
    {
      category: "Court & Equipment",
      icon: Target,
      rules: [
        "Court size: 40m x 20m (FIFA Futsal standard)",
        "Goals: 3m x 2m",
        "Ball: Size 4, low bounce futsal ball",
        "Shin guards and non-marking shoes required",
      ],
    },
    {
      category: "Gameplay Rules",
      icon: Gamepad2,
      rules: [
        "Kick-ins instead of throw-ins",
        "4-second rule for all restarts",
        "Goalkeeper has 4 seconds ball control",
        "Strict back-pass rule enforcement",
      ],
    },
  ]

  const gamechangerPurpose = [
    {
      title: "Entertainment Value",
      description: "Boost excitement for fans in the arena and online viewers",
      icon: Star,
    },
    {
      title: "Player Adaptability",
      description: "Test strategy and adaptability of players under pressure",
      icon: MousePointer2,
    },
    {
      title: "Match Intensity",
      description: "Ensure every match stays alive until the final whistle",
      icon: Zap,
    },
  ]

  return (
    <div className="min-h-screen text-white selection:bg-lime-400 selection:text-black font-heading">
      <Navigation />

      {/* Decorative Blur Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-lime-400/5 blur-[120px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-lime-400/5 blur-[120px] rounded-full opacity-50"></div>
      </div>

      <div className="relative z-10 pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-32">
          <div className="max-w-5xl">
            <div className="flex flex-wrap items-center gap-4 mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
               <Badge className="bg-lime-400/10 text-lime-400 border-lime-400/20 px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px]">
                Official Handbook
              </Badge>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <Dna size={14} className="text-lime-300" />
                Evolution of Futsal
              </div>
            </div>
            <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
              The Law of the <span className="text-lime-300">Universe.</span>
            </h1>
            <p className="text-xl text-white/40 uppercase font-bold tracking-widest max-w-3xl animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
              A revolutionary ruleset designed for the elite athlete. Engineered to test skill, speed, and strategic dominance.
            </p>
          </div>
        </section>

        {/* Gamechanger Introduction */}
        <section className="container mx-auto px-4 mb-24">
          <div className="group relative glass-dark rounded-[3rem] p-12 md:p-20 border border-white/5 overflow-hidden transition-all duration-700 hover:border-lime-400/30">
            <div className="absolute top-0 right-0 p-20 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
              <Zap size={500} />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-lime-300 text-black rounded-3xl mb-12 shadow-[0_0_50px_rgba(190,242,100,0.3)] rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Zap size={40} className="fill-current" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-8">
                The Gamechanger <span className="text-lime-300">System</span>
              </h2>
              <p className="text-xl text-white/40 font-bold uppercase tracking-widest leading-relaxed mb-12">
                In the last 3 minutes of every half, the standard laws of physics cease to exist. A randomized tactical module is deployed, forcing teams to adapt instantly or fall to the universe.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                  <Clock className="text-lime-300" size={20} />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Active: Min 12-15 & 27-30</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                  <Gamepad2 className="text-lime-300" size={20} />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Random Selection Pool</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gamechanger Modes Grid */}
        <section className="container mx-auto px-4 mb-32">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">Tactical Modules</h3>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/20">Authorized deployment only</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gamechangerModes.map((mode, index) => (
              <div 
                key={index}
                className={`group relative glass-dark rounded-[2.5rem] border border-white/5 p-10 overflow-hidden transition-all duration-500 hover:border-lime-300/30 bg-gradient-to-br ${mode.color} animate-in fade-in slide-in-from-bottom-4 duration-700`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-10">
                  <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${mode.accent} group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-black/20`}>
                    <mode.icon size={32} />
                  </div>
                  <Badge className="bg-white/5 text-white/20 border-white/5 px-3 py-1 font-black uppercase tracking-widest text-[8px]">
                    MOD {index + 1}
                  </Badge>
                </div>
                
                <h4 className="text-2xl font-black italic uppercase tracking-tight text-white mb-6 group-hover:text-lime-300 transition-colors">
                  {mode.title}
                </h4>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-3">Protocol</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/60 leading-relaxed">
                      {mode.description}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-400/40 mb-3 underline">Field Impact</p>
                    <p className="text-[11px] font-black uppercase tracking-widest text-lime-300 leading-relaxed">
                      {mode.effect}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pressure Point */}
        <section className="container mx-auto px-4 mb-32">
           <div className="relative group glass-dark rounded-[3rem] p-12 md:p-24 border border-red-500/20 overflow-hidden bg-gradient-to-br from-red-500/5 to-transparent">
            <div className="absolute top-0 right-0 p-20 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
              <Trophy size={400} />
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                  Special Formation
                </Badge>
                <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-8">
                  Pressure <span className="text-red-500">Point</span>
                </h2>
                <p className="text-lg text-white/40 font-bold uppercase tracking-widest leading-relaxed mb-10">
                  Reserved for the Semi-Finals and Grand Final. An elimination shootout format that turns the arena into a survival cage.
                </p>
                <Button className="h-16 px-10 bg-red-500 text-white hover:bg-red-600 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-none">
                  Learn Shootout Mechanics <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {[
                  "One designated striker per team",
                  "Sequential 1-on-1 elimination",
                  "Survivor continues to next round",
                  "Bonus points awarded to final team standing",
                  "Mental composure threshold: Critical"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-black text-xs">
                      {idx + 1}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Standard Rules Grid */}
        <section className="container mx-auto px-4 mb-32">
          <div className="flex items-end justify-between mb-16 px-4">
            <div className="max-w-xl">
               <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-4">
                Core <span className="text-lime-300">Directives</span>
              </h2>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/20">Universal Futsal Authorization Rules</p>
            </div>
            <div className="hidden lg:block text-right">
              <Badge className="bg-white/5 text-white/40 border-white/10 px-4 py-2 font-black uppercase tracking-widest text-[10px]">
                FIFA Compliant v2.0
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {standardRules.map((section, index) => (
              <div key={index} className="group glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-lime-300/30">
                <div className="p-10 border-b border-white/5 flex items-center justify-between group-hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-lime-300 text-black flex items-center justify-center shadow-lg">
                      <section.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black italic uppercase tracking-tight text-white">
                        {section.category}
                      </h4>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Protocol 0{index + 1}</p>
                    </div>
                  </div>
                  <Target size={20} className="text-white/10 group-hover:text-lime-300 transition-colors" />
                </div>
                <div className="p-10 bg-black/20">
                  <ul className="space-y-6">
                    {section.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start gap-5">
                        <CheckCircle className="text-lime-300 mt-1 flex-shrink-0" size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-white/60 leading-relaxed">
                          {rule}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Match Timeline Slider */}
        <section className="container mx-auto px-4 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-4">
              Match <span className="text-lime-300">Dynamics</span>
            </h2>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/20">Temporal evolution of legal gameplay</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="glass-dark rounded-[3rem] p-12 border border-white/5 relative overflow-hidden">
              <div className="relative mb-20 px-8">
                {/* Timeline Bar */}
                <div className="h-4 bg-white/5 rounded-full relative overflow-hidden border border-white/10">
                  <div className="absolute left-0 top-0 h-full w-[80%] bg-gradient-to-r from-lime-300/20 to-lime-300/80"></div>
                  <div className="absolute right-0 top-0 h-full w-[20%] bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
                </div>
                
                {/* Time Indicators */}
                <div className="flex justify-between mt-10">
                  <div className="text-center group">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white transition-colors">Start</div>
                    <div className="text-2xl font-black font-heading italic text-white/80 mt-2">00'</div>
                  </div>
                  <div className="text-center group border-x border-white/5 px-12">
                     <div className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-400 group-hover:text-lime-300 transition-colors underline underline-offset-8">Engagement</div>
                    <div className="text-2xl font-black font-heading italic text-lime-300 mt-2">12'</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 group-hover:text-red-400 transition-colors">Terminal</div>
                    <div className="text-2xl font-black font-heading italic text-red-500 mt-2">15'</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center pt-10 border-t border-white/5">
                <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-lime-300/10 flex items-center justify-center text-lime-300 border border-lime-300/20">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Standard Play</h5>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Minutes 0-12: Full FIFA Regs</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">Anomaly Period</h5>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-red-500/60">Minutes 12-15: Gamechanger Mode</p>
                  </div>
                </div>
              </div>
            </div>
             <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Note: Sequence repeats for the second 15-minute interval (27-30')</p>
          </div>
        </section>

        {/* Legal Disclaimer / Important */}
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto glass rounded-[2.5rem] p-12 border border-white/5 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <div className="w-20 h-20 bg-lime-300/10 rounded-full flex items-center justify-center text-lime-300 border border-lime-400/20 shadow-2xl">
              <ShieldCheck size={40} />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-black italic uppercase tracking-tight text-white mb-4">Official Verification</h4>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 leading-loose">
                These rules are the intellectual property of Prime5 League. Any unauthorized variation or field deployment result in automatic disqualification. Officials have absolute zero-tolerance policy on code of conduct violations.
              </p>
            </div>
            <Button variant="ghost" className="h-14 px-8 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[9px] text-white/40 hover:text-white hover:bg-white/5 transition-all">
              Download PDF <ArrowRight className="ml-2" size={14} />
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
