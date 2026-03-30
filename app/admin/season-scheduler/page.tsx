"use client"

import { useState, useEffect } from "react"
import { SeasonScheduler } from "@/components/admin/season-scheduler"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, Calendar, Users, Target, RefreshCw, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { useSeasons } from "@/hooks/use-seasons"
import { useMatchSchedules } from "@/hooks/use-matches"
import { Badge } from "@/components/ui/badge"

export default function SeasonSchedulerPage() {
  const { seasons, loading, error } = useSeasons()
  const { matches, loading: matchesLoading, error: matchesError, refetch: refetchMatches } = useMatchSchedules()
  
  // Calculate statistics
  const totalSeasons = seasons?.length || 0
  const activeSeasons = seasons?.filter((season: any) => {
    const now = new Date()
    const startDate = new Date(season.startDate)
    const endDate = new Date(season.EndDate)
    return now >= startDate && now <= endDate
  }).length || 0
  
  const upcomingSeasons = seasons?.filter((season: any) => {
    const now = new Date()
    const startDate = new Date(season.startDate)
    return now < startDate
  }).length || 0
  
  const totalTeams = seasons?.reduce((total: number, season: any) => {
    return total + Object.keys(season.teams || {}).length
  }, 0) || 0

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    } catch {
      return { date: "Invalid Date", time: "Invalid Time" }
    }
  }

  return (
    <div className="min-h-screen relative font-['Outfit'] bg-transparent overflow-x-hidden">
      {/* Tactical Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-lime-400/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Header */}
      <div className="glass-dark border-b border-white/5 relative z-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white font-bold uppercase tracking-widest text-[10px] rounded-none transition-all">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  RETURN TO BASE
                </Button>
              </Link>
              <div className="w-12 h-12 bg-black/40 border border-lime-500/30 rounded-none flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                <Trophy className="w-6 h-6 text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.8)]" />
              </div>
              <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">Campaign <span className="text-lime-400">Master</span> Node</h1>
                <p className="text-white/40 font-bold tracking-widest uppercase text-xs mt-1">Global League Overview & Strategic Planning</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40 backdrop-blur-xl group hover:border-lime-400/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-none flex items-center justify-center group-hover:bg-lime-400/10 group-hover:border-lime-400/30 transition-all">
                  <Trophy className="h-5 w-5 text-white/60 group-hover:text-lime-400 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Total Campaigns</p>
                  <p className="text-3xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    {loading ? "..." : totalSeasons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40 backdrop-blur-xl group hover:border-cyan-400/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-none flex items-center justify-center group-hover:bg-cyan-400/10 group-hover:border-cyan-400/30 transition-all">
                  <Calendar className="h-5 w-5 text-white/60 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Active Engagements</p>
                  <p className="text-3xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    {loading ? "..." : activeSeasons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40 backdrop-blur-xl group hover:border-purple-400/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-none flex items-center justify-center group-hover:bg-purple-400/10 group-hover:border-purple-400/30 transition-all">
                  <Users className="h-5 w-5 text-white/60 group-hover:text-purple-400 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Enlisted Squadrons</p>
                  <p className="text-3xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    {loading ? "..." : totalTeams}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40 backdrop-blur-xl group hover:border-yellow-400/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-none flex items-center justify-center group-hover:bg-yellow-400/10 group-hover:border-yellow-400/30 transition-all">
                  <Target className="h-5 w-5 text-white/60 group-hover:text-yellow-400 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Awaiting Initialization</p>
                  <p className="text-3xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    {loading ? "..." : upcomingSeasons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Info */}
        {error && (
          <Card className="glass-dark border border-red-500/20 bg-black/40 mb-6 rounded-none">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <span className="text-xl text-red-500 drop-shadow-md">⚠️</span>
              </div>
              <div>
                <h3 className="text-red-400 font-black italic uppercase tracking-widest text-sm">Decryption Failed</h3>
                <p className="text-white/60 font-mono text-xs mt-1">{error.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40 mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin mb-4"></div>
                <span className="text-lime-400 font-mono uppercase tracking-widest text-xs animate-pulse">Syncing Global Matrices...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Season Scheduler Component */}
        <SeasonScheduler />

        {/* Season Matches Section */}
        <div className="mt-8 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-black italic uppercase tracking-widest text-lime-400 drop-shadow-sm flex items-center gap-3">
              <span className="w-8 h-8 bg-lime-400/10 flex items-center justify-center border border-lime-400/30">
                <Target className="w-4 h-4 text-lime-400" />
              </span>
              Global Match Ledger
            </h2>
            <Button 
              onClick={() => refetchMatches()}
              variant="outline"
              size="sm"
              className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white font-bold uppercase tracking-widest text-[10px] rounded-none transition-all"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              SYNC LOGS
            </Button>
          </div>

          {matchesLoading ? (
            <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40">
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center text-white">
                  <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
                  <span className="text-cyan-400 font-mono uppercase tracking-widest text-xs animate-pulse">Downloading Match Data...</span>
                </div>
              </CardContent>
            </Card>
          ) : matchesError ? (
            <Card className="glass-dark border border-red-500/20 bg-black/40 mb-6 rounded-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <span className="text-xl text-red-500 drop-shadow-md">⚠️</span>
                  </div>
                  <div>
                    <h3 className="text-red-400 font-black italic uppercase tracking-widest text-sm">Match Data Corrupted</h3>
                    <p className="text-white/60 font-mono text-xs mt-1">{matchesError.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : matches.length === 0 ? (
            <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40">
              <CardContent className="p-16">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/60 font-black italic uppercase tracking-widest">No match telemetry found</p>
                  <p className="text-[10px] text-lime-300/40 mt-3 font-mono uppercase tracking-widest">
                    {">"} INITIATE SCHEDULER ABOVE TO GENERATE FIXTURES
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {matches.map((match: any) => {
                const { date, time } = formatDateTime(match.dateAndtime)
                const team1Name = match.Team1?.name || match.team1 || "Unknown Team"
                const team2Name = match.Team2?.name || match.team2 || "Unknown Team"
                
                return (
                  <div key={match.id} className="group relative overflow-hidden bg-black/40 glass-dark border border-white/10 hover:border-lime-500/50 rounded-none transition-all p-5 flex flex-col justify-between h-full min-h-[220px]">
                    {/* Glowing Accent Top Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lime-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="space-y-4 relative z-10 w-full">
                      {/* Sub ID / Date Row */}
                      <div className="flex justify-between items-start w-full">
                        <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-widest bg-white/5 text-white/50 border-white/10 rounded-none px-2 py-0.5">
                          {match.season_id ? `SZ-${match.season_id.substring(0, 4)}` : "STANDALONE"}
                        </Badge>
                        <div className="text-right">
                          <div className="text-[10px] text-lime-400/70 font-mono tracking-widest">{date}</div>
                          <div className="text-lg font-black tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{time}</div>
                        </div>
                      </div>

                      {/* vs Block */}
                      <div className="py-4 flex flex-col items-center justify-center gap-2 border-y border-white/5 my-2 w-full">
                        <div className="text-center w-full">
                          <span className="block font-black uppercase text-sm text-white tracking-widest truncate">{team1Name}</span>
                        </div>
                        <div className="mx-auto w-6 h-6 flex items-center justify-center bg-lime-400/10 border border-lime-400/30 text-[9px] font-black text-lime-400 rotate-45">
                          <span className="-rotate-45 block">VS</span>
                        </div>
                        <div className="text-center w-full">
                          <span className="block font-black uppercase text-sm text-white/70 tracking-widest truncate">{team2Name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Location Footer */}
                    <div className="mt-auto pt-3 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-200 uppercase tracking-widest">
                        <MapPin className="h-3 w-3 text-cyan-400" />
                        <span className="truncate max-w-[150px]">{match.location || "TBD VENUE"}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 