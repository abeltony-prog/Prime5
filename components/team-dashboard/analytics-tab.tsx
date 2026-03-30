"use client"

import { useQuery } from '@apollo/client'
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Tooltip,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ComposedChart,
  Area
} from "recharts"
import { 
  TrendingUp, 
  Target, 
  Shield, 
  Zap, 
  Activity, 
  Star, 
  Trophy, 
  Users, 
  Calendar, 
  BarChart3, 
  Loader2, 
  Hexagon,
  Scan,
  Database,
  Crosshair
} from "lucide-react"
import { GET_TEAM_COMPLETE_DATA, GET_TEAM_MATCHES, GET_TEAM_PLAYER_STATISTICS } from "@/lib/graphql/queries"

interface AnalyticsTabProps {
  teamId: string
}

export function AnalyticsTab({ teamId }: AnalyticsTabProps) {
  // Fetch team complete data
  const { data: teamData, loading: teamLoading, error: teamError } = useQuery(GET_TEAM_COMPLETE_DATA, {
    variables: { teamId },
    fetchPolicy: 'cache-and-network'
  })

  // Fetch team matches
  const { data: matchesData, loading: matchesLoading, error: matchesError } = useQuery(GET_TEAM_MATCHES, {
    variables: { teamId },
    fetchPolicy: 'cache-and-network'
  })

  // Fetch player statistics
  const { data: playerStatsData, loading: playerStatsLoading, error: playerStatsError } = useQuery(GET_TEAM_PLAYER_STATISTICS, {
    fetchPolicy: 'cache-and-network'
  })

  // Loading state
  if (teamLoading || matchesLoading || playerStatsLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] glass-dark border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10" />
        <div className="text-center relative z-10">
          <div className="relative inline-block mb-6">
            <Loader2 className="w-12 h-12 text-lime-400 animate-spin" />
            <Scan className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-white/40 font-black italic uppercase tracking-[0.3em] text-[10px]">ACCESSING_TACTICAL_MAINFRAME...</p>
          <div className="mt-4 flex gap-1 justify-center">
            <div className="w-1 h-1 bg-lime-400 animate-bounce" />
            <div className="w-1 h-1 bg-lime-400 animate-bounce [animation-delay:-0.1s]" />
            <div className="w-1 h-1 bg-lime-400 animate-bounce [animation-delay:-0.2s]" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (teamError || matchesError || playerStatsError) {
    return (
      <div className="flex items-center justify-center h-[600px] glass-dark border border-red-500/20">
        <div className="text-center p-12 bg-red-500/5 border border-red-500/10">
          <Activity className="w-12 h-12 text-red-500 mx-auto mb-6 animate-pulse" />
          <h3 className="text-red-500 font-black italic uppercase tracking-widest text-lg">TELEMETRY_FAILURE</h3>
          <p className="text-white/40 font-mono text-[10px] mt-2 uppercase tracking-widest">CRITICAL_ERROR: DATA_NODE_UNREACHABLE_INTERMITTENT_LINK</p>
          <div className="mt-8 text-[9px] font-mono text-white/20 uppercase">RETRYING_CONNECTION_PROTOCOL...</div>
        </div>
      </div>
    )
  }

  const team = teamData?.Teams?.[0]
  const matches = matchesData?.matches || []
  const teamStats = team?.team_statistics?.[0]
  const players = team?.players || []
  const playerStats = playerStatsData?.player_statistics || []

  // Calculate analytics data from database
  const calculateAnalyticsData = () => {
    const totalMatches = matches.length
    const completedMatches = matches.filter((match: any) => 
      match.team1Goals !== null && match.team2Goals !== null
    )
    
    let wins = 0, draws = 0, losses = 0
    let goalsScored = 0, goalsConceded = 0, cleanSheets = 0
    const formData: Array<{match: string, result: 'W' | 'D' | 'L', goalsFor: number, goalsAgainst: number}> = []
    
    completedMatches.forEach((match: any) => {
      const isTeam1 = match.team1 === teamId
      const teamGoals = isTeam1 ? match.team1Goals : match.team2Goals
      const opponentGoals = isTeam1 ? match.team2Goals : match.team1Goals
      
      goalsScored += teamGoals
      goalsConceded += opponentGoals
      
      if (teamGoals > opponentGoals) {
        wins++
        formData.push({ match: `vs ${isTeam1 ? match.Team2?.name : match.Team1?.name}`, result: 'W', goalsFor: teamGoals, goalsAgainst: opponentGoals })
      } else if (teamGoals === opponentGoals) {
        draws++
        formData.push({ match: `vs ${isTeam1 ? match.Team2?.name : match.Team1?.name}`, result: 'D', goalsFor: teamGoals, goalsAgainst: opponentGoals })
      } else {
        losses++
        formData.push({ match: `vs ${isTeam1 ? match.Team2?.name : match.Team1?.name}`, result: 'L', goalsFor: teamGoals, goalsAgainst: opponentGoals })
      }
      
      if (opponentGoals === 0) cleanSheets++
    })
    
    const winPercentage = totalMatches > 0 ? (wins / totalMatches) * 100 : 0
    const avgGoalsPerMatch = totalMatches > 0 ? goalsScored / totalMatches : 0
    
    // Performance Matrix (Radar Chart Data)
    const normalizedGoals = Math.min((avgGoalsPerMatch / 3) * 100, 100)
    const normalizedDefense = totalMatches > 0 ? (cleanSheets / totalMatches) * 100 : 0
    const normalizedDiscipline = 85 // Mock or calculate from cards if available
    const normalizedPossession = teamStats?.possession || 50
    const normalizedAccuracy = teamStats?.pass_accuracy || 75

    const capabilityMatrix = [
      { subject: 'ATTACK', A: normalizedGoals, fullMark: 100 },
      { subject: 'DEFENSE', A: normalizedDefense, fullMark: 100 },
      { subject: 'DISCIPLINE', A: normalizedDiscipline, fullMark: 100 },
      { subject: 'POSSESSION', A: normalizedPossession, fullMark: 100 },
      { subject: 'ACCURACY', A: normalizedAccuracy, fullMark: 100 },
    ]
    
    // Season Points/Goals Trend
    const seasonData: {[key: string]: {period: string, wins: number, draws: number, losses: number, goals: number, points: number}} = {}
    completedMatches.forEach((match: any) => {
      const date = new Date(match.dateAndtime)
      const period = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!seasonData[period]) seasonData[period] = { period, wins: 0, draws: 0, losses: 0, goals: 0, points: 0 }
      const isTeam1 = match.team1 === teamId
      const teamGoals = isTeam1 ? match.team1Goals : match.team2Goals
      const opponentGoals = isTeam1 ? match.team2Goals : match.team1Goals
      seasonData[period].goals += teamGoals
      if (teamGoals > opponentGoals) { seasonData[period].wins++; seasonData[period].points += 3; }
      else if (teamGoals === opponentGoals) { seasonData[period].draws++; seasonData[period].points += 1; }
      else seasonData[period].losses++
    })
    
    const topPlayers = players.map((player: any) => {
      const pStat = playerStats.filter((ps: any) => ps.player_id === player.id)
      const goals = pStat.reduce((acc: number, cur: any) => acc + (cur.goals || 0), 0)
      const assists = pStat.reduce((acc: number, cur: any) => acc + (cur.assists || 0), 0)
      return {
        name: player.name,
        goals,
        assists,
        rating: (goals * 2 + assists) / (pStat.length || 1)
      }
    }).sort((a: any, b: any) => b.rating - a.rating).slice(0, 5)

    return {
      teamStats: {
        totalMatches,
        winPercentage: Math.round(winPercentage * 10) / 10,
        goalsScored,
        goalsConceded,
        cleanSheets,
        avgGoalsPerMatch: Math.round(avgGoalsPerMatch * 10) / 10,
        possession: normalizedPossession,
        passAccuracy: normalizedAccuracy,
        shotsOnTarget: teamStats?.shots_on_target || 0,
        fouls: teamStats?.fouls || 0,
        yellowCards: teamStats?.yellow_cards || 0,
        redCards: teamStats?.red_cards || 0
      },
      capabilityMatrix,
      seasonPerformance: Object.values(seasonData),
      playerStats: topPlayers,
      formData: formData.slice(-5)
    }
  }

  const analyticsData = calculateAnalyticsData()

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Tactical Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 border-l-4 border-lime-400 p-6 glass-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 -rotate-45 translate-x-12 translate-y-12" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Scan className="w-4 h-4 text-lime-400 animate-pulse" />
            <h2 className="text-xl font-black italic uppercase tracking-[0.2em] text-white">TACTICAL_UNIT_TELEMETRY</h2>
          </div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">SQUADRON_ID: {teamId.substring(0,12)} // STATUS: ACTIVE_ENGAGEMENT</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="text-right">
            <p className="text-[10px] font-black italic uppercase text-white/40 tracking-widest">DEPLOYMENT_TIMESTAMP</p>
            <p className="text-[11px] font-mono text-lime-400 uppercase">{new Date().toISOString().replace('T', ' // ').substring(0, 22)}</p>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'WIN_FACTOR', val: `${analyticsData.teamStats.winPercentage}%`, icon: Trophy, color: 'lime', norm: analyticsData.teamStats.winPercentage },
          { label: 'STRIKE_RATE', val: analyticsData.teamStats.avgGoalsPerMatch, icon: Target, color: 'cyan', norm: Math.min((analyticsData.teamStats.avgGoalsPerMatch / 3) * 100, 100) },
          { label: 'DEFENSE_SYNC', val: analyticsData.teamStats.cleanSheets, icon: Shield, color: 'purple', norm: (analyticsData.teamStats.cleanSheets / (analyticsData.teamStats.totalMatches || 1)) * 100 },
          { label: 'SQUAD_CONTROL', val: `${analyticsData.teamStats.possession}%`, icon: Activity, color: 'orange', norm: analyticsData.teamStats.possession }
        ].map((kpi, i) => (
          <div key={i} className="glass-dark border border-white/5 p-6 relative group overflow-hidden hover:bg-white/10 transition-all duration-300">
             <div className="absolute top-0 left-0 w-1 h-full bg-white/5 group-hover:bg-current transition-colors" style={{ color: `var(--${kpi.color}-400)` }} />
             <div className="flex items-center justify-between mb-4">
               <div className={`p-3 bg-${kpi.color}-400/10 border border-${kpi.color}-400/20`}>
                 <kpi.icon className={`w-5 h-5 text-${kpi.color}-400`} />
               </div>
               <div className="text-right">
                 <p className="text-[9px] font-black italic uppercase tracking-[0.2em] text-white/30">{kpi.label}</p>
                 <p className="text-2xl font-black italic tracking-tighter text-white">{kpi.val}</p>
               </div>
             </div>
             <div className="h-1 bg-white/5 relative overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full bg-${kpi.color}-400 transition-all duration-1000 ease-out`}
                  style={{ width: `${kpi.norm}%` }}
                />
             </div>
          </div>
        ))}
      </div>

      {/* Tactical Matrix and Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capability Matrix (Radar) */}
        <div className="lg:col-span-1 glass-dark border border-white/10 p-8 rounded-none relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-lime-400" />
            <h3 className="text-lg font-black italic uppercase tracking-widest text-white">UNIT_CAPABILITY <span className="text-lime-400">MATRIX</span></h3>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analyticsData.capabilityMatrix}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold', fontFamily: 'monospace' }} 
                />
                <Radar
                  name="Capability"
                  dataKey="A"
                  stroke="#a3e635"
                  fill="#a3e635"
                  fillOpacity={0.1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 text-center">
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">NORM_DISTRIBUTION_SCORE: 8.42_DELTA</p>
          </div>
        </div>

        {/* Engagement History (Composed Chart) */}
        <div className="lg:col-span-2 glass-dark border border-white/10 p-8 rounded-none relative">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-cyan-400" />
              <h3 className="text-lg font-black italic uppercase tracking-widest text-white">SEASON <span className="text-cyan-400">TELEMETRY</span></h3>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-lime-400" />
                 <span className="text-[9px] font-black italic text-white/40 tracking-widest">POINTS</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-cyan-400" />
                 <span className="text-[9px] font-black italic text-white/40 tracking-widest">GOALS</span>
               </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={analyticsData.seasonPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="period" 
                  stroke="rgba(255,255,255,0.1)" 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.1)" 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'monospace' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#061B14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0' }}
                  itemStyle={{ fontSize: '10px', color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', fontWeight: '900' }}
                />
                <Area type="monotone" dataKey="points" fill="rgba(163,230,53,0.05)" stroke="none" />
                <Line type="monotone" dataKey="points" stroke="#a3e635" strokeWidth={4} dot={{ r: 4, fill: '#a3e635' }} activeDot={{ r: 6 }} />
                <Bar dataKey="goals" fill="#22d3ee" barSize={12} radius={[2, 2, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Advanced Instrumentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Battle Log (Form) */}
        <div className="glass-dark border border-white/10 p-8 rounded-none flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <Database className="w-24 h-24 stroke-[1]" />
           </div>
           <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-white" />
            <h3 className="text-lg font-black italic uppercase tracking-widest text-white">BATTLE <span className="text-white/40">OPERATIONS_LOG</span></h3>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {(analyticsData.formData || []).reverse().map((match, idx) => (
              <div key={idx} className="flex items-center gap-6 p-4 bg-white/5 border border-white/5 hover:border-lime-400/30 group transition-all">
                <div className={`w-10 h-10 flex items-center justify-center font-black italic border ${match.result === 'W' ? 'bg-lime-400/20 border-lime-400 text-lime-400' : match.result === 'D' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400' : 'bg-red-400/20 border-red-400 text-red-500'}`}>
                  {match.result}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black italic uppercase text-white tracking-widest truncate">{match.match}</p>
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-tighter">FINAL_SEQUENCE: {match.goalsFor}-{match.goalsAgainst}</p>
                </div>
                <Badge variant="outline" className="rounded-none border-white/10 text-[9px] font-mono text-white/20 uppercase">ARCHIVE_NODE_{idx + 1}</Badge>
              </div>
            ))}
            {analyticsData.formData.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-12 border border-dashed border-white/10 opacity-30">
                <Crosshair className="w-8 h-8 mb-4" />
                <p className="text-[10px] font-mono uppercase tracking-[0.3em]">NO_ENGAGEMENT_HISTORY_FOUND</p>
              </div>
            )}
          </div>
        </div>

        {/* Unit Performance (Top Players) */}
        <div className="glass-dark border border-white/10 p-8 rounded-none relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-purple-400" />
            <h3 className="text-lg font-black italic uppercase tracking-widest text-white">UNIT <span className="text-purple-400">PERFORMANCE_READOUT</span></h3>
          </div>
          <div className="space-y-4">
            {analyticsData.playerStats.map((p, idx) => (
              <div key={idx} className="p-4 glass-dark border border-white/5 hover:border-purple-400/40 group transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 flex items-center justify-center relative">
                      <div className="absolute inset-0 border border-white/10 group-hover:border-purple-400/50 transition-colors" />
                      <span className="text-white/40 font-black italic text-xs">P_{idx+1}</span>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black italic uppercase tracking-widest text-white group-hover:text-purple-400 transition-colors">{p.name}</h4>
                      <div className="flex gap-3 mt-1">
                         <span className="text-[9px] font-mono text-lime-400/60 uppercase">{p.goals} G</span>
                         <span className="text-[9px] font-mono text-cyan-400/60 uppercase">{p.assists} A</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Hexagon className="w-3 h-3 text-purple-400 fill-purple-400/20" />
                      <span className="text-lg font-black italic text-white tracking-tighter">{p.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.1em]">UNIT_SCORE</p>
                  </div>
                </div>
                <div className="h-1 bg-white/5 relative">
                  <div className="absolute left-0 top-0 h-full bg-purple-400/50" style={{ width: `${(p.rating / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}