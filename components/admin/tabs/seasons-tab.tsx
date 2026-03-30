"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"
import Link from "next/link"

export function SeasonsTab() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">Season <span className="text-lime-400">Master</span></h2>
        <p className="text-white/40 font-bold tracking-widest uppercase text-xs mt-1">Initialize and govern league campaigns</p>
      </div>
      
      <Card className="glass-dark border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-none bg-black/40 backdrop-blur-xl">
        <CardContent className="p-16 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-lime-400/10 border border-lime-400/20 shadow-[0_0_30px_rgba(190,242,100,0.1)] flex items-center justify-center rounded-none mb-8">
            <Trophy className="h-10 w-10 text-lime-400 drop-shadow-md" />
          </div>
          <h3 className="text-3xl font-black italic uppercase tracking-widest text-white mb-2">Campaign Architecture</h3>
          <p className="text-white/60 font-bold max-w-lg mb-8 mx-auto">
            ACCESS THE DEDICATED SEASON MASTER TERMINAL TO FORGE NEW LEAGUE CAMPAIGNS, ENLIST SQUADS, AND PROGAM THE DIRECTORY GRID.
          </p>
          <Link href="/admin/season-scheduler">
            <Button className="h-14 px-8 bg-lime-400/20 text-lime-300 border border-lime-400/50 hover:bg-lime-400 hover:text-black font-black italic uppercase tracking-widest text-sm rounded-none transition-all duration-300 shadow-[0_0_20px_rgba(190,242,100,0.2)] hover:shadow-[0_0_30px_rgba(190,242,100,0.4)]">
              <Trophy className="h-5 w-5 mr-3" />
              Initialize Season Master
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
