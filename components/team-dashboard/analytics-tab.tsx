"use client"

import { useQuery } from '@apollo/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { TrendingUp, Target, Shield, Zap, Activity, Star, Trophy, Users, Calendar, BarChart3, Loader2 } from "lucide-react"
import { GET_TEAM_COMPLETE_DATA, GET_TEAM_MATCHES, GET_TEAM_PLAYER_STATISTICS } from "@/lib/graphql/queries"

interface AnalyticsTabProps {
  teamId: string
}

export function AnalyticsTab({ teamId }: AnalyticsTabProps) {
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white/60 animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-lg">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (teamError || matchesError || playerStatsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-white/60 text-lg">Error loading analytics data</p>
          <p className="text-white/40 text-sm">Please try again later</p>
        </div>
      </div>
    )
  }

  // No data state
  if (!teamData?.Teams?.[0] || !matchesData?.matches) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-white/60" />
          </div>
          <p className="text-white/60 text-lg">No analytics data available</p>
          <p className="text-white/40 text-sm">Please check back later</p>
        </div>
      </div>
    )
  }

  const team = teamData.Teams[0]
  const matches = matchesData.matches || []
  const teamStats = team.team_statistics?.[0]
  const players = team.players || []
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
    const drawPercentage = totalMatches > 0 ? (draws / totalMatches) * 100 : 0
    const lossPercentage = totalMatches > 0 ? (losses / totalMatches) * 100 : 0
    const avgGoalsPerMatch = totalMatches > 0 ? goalsScored / totalMatches : 0
    
    // Calculate season performance
    const seasonData: {[key: string]: {period: string, wins: number, draws: number, losses: number, goals: number, points: number}} = {}
    completedMatches.forEach((match: any) => {
      const date = new Date(match.dateAndtime)
      const period = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      if (!seasonData[period]) {
        seasonData[period] = { period, wins: 0, draws: 0, losses: 0, goals: 0, points: 0 }
      }
      
      const isTeam1 = match.team1 === teamId
      const teamGoals = isTeam1 ? match.team1Goals : match.team2Goals
      const opponentGoals = isTeam1 ? match.team2Goals : match.team1Goals
      
      seasonData[period].goals += teamGoals
      
      if (teamGoals > opponentGoals) {
        seasonData[period].wins++
        seasonData[period].points += 3
      } else if (teamGoals === opponentGoals) {
        seasonData[period].draws++
        seasonData[period].points += 1
      } else {
        seasonData[period].losses++
      }
    })
    
    const seasonPerformance = Object.values(seasonData)
    
    // Calculate player statistics
    const playerStatsMap: {[key: string]: {goals: number, assists: number, matches: number, rating: number}} = {}
    playerStats.forEach((stat: any) => {
      if (!playerStatsMap[stat.player_id]) {
        playerStatsMap[stat.player_id] = { goals: 0, assists: 0, matches: 0, rating: 0 }
      }
      playerStatsMap[stat.player_id].goals += stat.goals || 0
      playerStatsMap[stat.player_id].assists += stat.assists || 0
      playerStatsMap[stat.player_id].matches++
    })
    
    // Calculate ratings after all stats are collected
    Object.keys(playerStatsMap).forEach((playerId: string) => {
      const player = playerStatsMap[playerId]
      const totalGoals = player.goals || 0
      const totalAssists = player.assists || 0
      const totalMatches = player.matches || 1
      
      // Calculate rating with safety checks
      player.rating = totalMatches > 0 ? (totalGoals * 2 + totalAssists) / totalMatches : 0
    })
    
    const topPlayers = players.map((player: any) => ({
      name: player.name,
      ...playerStatsMap[player.id]
    })).sort((a: any, b: any) => b.rating - a.rating).slice(0, 5)
    
    return {
      teamStats: {
        totalMatches,
        winPercentage: isNaN(winPercentage) ? 0 : Math.round(winPercentage * 10) / 10,
        drawPercentage: isNaN(drawPercentage) ? 0 : Math.round(drawPercentage * 10) / 10,
        lossPercentage: isNaN(lossPercentage) ? 0 : Math.round(lossPercentage * 10) / 10,
        goalsScored,
        goalsConceded,
        cleanSheets,
        avgGoalsPerMatch: isNaN(avgGoalsPerMatch) ? 0 : Math.round(avgGoalsPerMatch * 10) / 10,
        possession: teamStats?.possession || 50,
        passAccuracy: teamStats?.pass_accuracy || 75,
        shotsOnTarget: teamStats?.shots_on_target || 0,
        fouls: teamStats?.fouls || 0,
        yellowCards: teamStats?.yellow_cards || 0,
        redCards: teamStats?.red_cards || 0
      },
      seasonPerformance,
      playerStats: topPlayers,
      formData: formData.slice(-5) // Last 5 matches
    }
  }

  const analyticsData = calculateAnalyticsData()

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500'
      case 'D': return 'bg-yellow-500'
      case 'L': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-xs sm:text-sm">Win Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{analyticsData.teamStats.winPercentage}%</p>
              </div>
            </div>
            <Progress value={analyticsData.teamStats.winPercentage} className="mt-2 sm:mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-xs sm:text-sm">Goals Per Match</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{analyticsData.teamStats.avgGoalsPerMatch}</p>
              </div>
            </div>
            <Progress value={analyticsData.teamStats.avgGoalsPerMatch * 10} className="mt-2 sm:mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-xs sm:text-sm">Clean Sheets</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{analyticsData.teamStats.cleanSheets}</p>
              </div>
            </div>
            <Progress value={analyticsData.teamStats.totalMatches > 0 ? (analyticsData.teamStats.cleanSheets / analyticsData.teamStats.totalMatches) * 100 : 0} className="mt-2 sm:mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-xs sm:text-sm">Possession</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{analyticsData.teamStats.possession}%</p>
              </div>
            </div>
            <Progress value={analyticsData.teamStats.possession} className="mt-2 sm:mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg text-base sm:text-lg">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              Season Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsData.seasonPerformance || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="period" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Line 
                  type="monotone" 
                  dataKey="points" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="goals" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg text-base sm:text-lg">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              Match Results Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData.seasonPerformance || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="period" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Bar dataKey="wins" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="draws" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Form and Player Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg text-base sm:text-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Form
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
              {(analyticsData.formData || []).map((match, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg ${getFormColor(match.result)}`}
                  title={`${match.match}: ${match.result} (${match.goalsFor}-${match.goalsAgainst})`}
                >
                  {match.result}
                </div>
              ))}
            </div>
            <div className="mt-3 sm:mt-4 text-center text-white/60 text-xs sm:text-sm">
              <p>Last {(analyticsData.formData || []).length} matches</p>
              <p className="mt-1 sm:mt-2">
                <span className="text-green-400">W</span> = Win, 
                <span className="text-yellow-400"> D</span> = Draw, 
                <span className="text-red-400"> L</span> = Loss
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg text-base sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 sm:space-y-3">
              {(analyticsData.playerStats || []).slice(0, 5).map((player: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs sm:text-sm">{index + 1}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{player.name}</p>
                      <p className="text-white/60 text-xs sm:text-sm">{player.goals || 0} goals, {player.assists || 0} assists</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                    <span className="text-white font-medium text-sm sm:text-base">
                      {isNaN(player.rating) ? '0.0' : (Math.round(player.rating * 10) / 10).toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Statistics */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg text-base sm:text-lg">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
            Advanced Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-white font-semibold text-base sm:text-lg">Attacking</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm sm:text-base">Shots on Target</span>
                  <span className="text-white font-medium text-sm sm:text-base">{analyticsData.teamStats.shotsOnTarget}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm sm:text-base">Pass Accuracy</span>
                  <span className="text-white font-medium text-sm sm:text-base">{analyticsData.teamStats.passAccuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm sm:text-base">Goals Scored</span>
                  <span className="text-white font-medium text-sm sm:text-base">{analyticsData.teamStats.goalsScored}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-white font-semibold text-base sm:text-lg">Defending</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm sm:text-base">Clean Sheets</span>
                  <span className="text-white font-medium text-sm sm:text-base">{analyticsData.teamStats.cleanSheets}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm sm:text-base">Goals Conceded</span>
                  <span className="text-white font-medium text-sm sm:text-base">{analyticsData.teamStats.goalsConceded}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm sm:text-base">Possession</span>
                  <span className="text-white font-medium text-sm sm:text-base">{analyticsData.teamStats.possession}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-white font-semibold text-base sm:text-lg">Discipline</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm sm:text-base">Yellow Cards</span>
                  <span className="text-white font-medium text-sm sm:text-base">{analyticsData.teamStats.yellowCards}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm sm:text-base">Red Cards</span>
                  <span className="text-white font-medium text-sm sm:text-base">{analyticsData.teamStats.redCards}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm sm:text-base">Fouls</span>
                  <span className="text-white font-medium text-sm sm:text-base">{analyticsData.teamStats.fouls}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 