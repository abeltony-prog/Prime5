"use client"

import { useState } from "react"
import { useQuery } from '@apollo/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Trophy,
  Target,
  Calendar,
  Download,
  Filter,
  Loader2,
  XCircle,
} from "lucide-react"
import { GET_TEAMS, GET_MATCH_SCHEDULES, GET_ALL_MANAGERS_DETAILS, GET_PLAYER_STATISTICS_WITH_NAMES } from "@/lib/graphql/queries"

export function Analytics() {
  const [timeRange, setTimeRange] = useState("6months")
  const [groupFilter, setGroupFilter] = useState("all")

  // Fetch real data from database
  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery(GET_TEAMS)
  const { data: matchesData, loading: matchesLoading, error: matchesError } = useQuery(GET_MATCH_SCHEDULES)
  const { data: managersData, loading: managersLoading, error: managersError } = useQuery(GET_ALL_MANAGERS_DETAILS)
  const { data: playerStatsData, loading: playerStatsLoading, error: playerStatsError } = useQuery(GET_PLAYER_STATISTICS_WITH_NAMES)

  // Loading state
  if (teamsLoading || matchesLoading || managersLoading || playerStatsLoading) {
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
  if (teamsError || matchesError || managersError || playerStatsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-white/60 text-lg">Error loading analytics data</p>
          <p className="text-white/40 text-sm">Please try again later</p>
        </div>
      </div>
    )
  }

  // Calculate real data from database
  const calculateMatchesData = () => {
    const matches = matchesData?.matches || []
    const completedMatches = matches.filter((match: any) => {
      const matchDate = new Date(match.dateAndtime)
      const now = new Date()
      const isPastMatch = matchDate < now
      const hasGoals = match.team1Goals !== null && match.team2Goals !== null
      
      return isPastMatch && hasGoals
    })

    const monthlyData: {[key: string]: {month: string, matches: number, goals: number}} = {}
    
    completedMatches.forEach((match: any) => {
      const date = new Date(match.dateAndtime)
      const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      if (!monthlyData[month]) {
        monthlyData[month] = { month, matches: 0, goals: 0 }
      }
      
      monthlyData[month].matches++
      
      // Safety check for goals calculation
      const team1Goals = parseInt(match.team1Goals) || 0
      const team2Goals = parseInt(match.team2Goals) || 0
      const safeTeam1Goals = team1Goals > 100 ? 0 : team1Goals
      const safeTeam2Goals = team2Goals > 100 ? 0 : team2Goals
      
      monthlyData[month].goals += safeTeam1Goals + safeTeam2Goals
    })

    return Object.values(monthlyData).sort((a, b) => {
      const dateA = new Date(a.month)
      const dateB = new Date(b.month)
      return dateA.getTime() - dateB.getTime()
    })
  }

  const calculateTeamPerformanceData = () => {
    const teams = teamsData?.Teams || []
    const matches = matchesData?.matches || []

    return teams.map((team: any) => {
      const teamMatches = matches.filter((match: any) => {
        const matchDate = new Date(match.dateAndtime)
        const now = new Date()
        const isPastMatch = matchDate < now
        const isTeamMatch = (match.team1 === team.id || match.team2 === team.id)
        const hasGoals = match.team1Goals !== null && match.team2Goals !== null
        
        return isPastMatch && isTeamMatch && hasGoals
      })

      let points = 0
      let wins = 0
      let draws = 0
      let losses = 0

      teamMatches.forEach((match: any) => {
        const isTeam1 = match.team1 === team.id
        const teamGoals = isTeam1 ? match.team1Goals : match.team2Goals
        const opponentGoals = isTeam1 ? match.team2Goals : match.team1Goals

        if (teamGoals > opponentGoals) {
          wins++
          points += 3
        } else if (teamGoals === opponentGoals) {
          draws++
          points += 1
        } else {
          losses++
        }
      })

      return {
        name: team.name,
        points,
        matches: teamMatches.length,
        wins,
        draws,
        losses
      }
    }).sort((a: any, b: any) => b.points - a.points).slice(0, 5)
  }

  const calculateRegistrationStatusData = () => {
    const teams = teamsData?.Teams || []
    const approved = teams.filter((team: any) => team.approved).length
    const pending = teams.filter((team: any) => !team.approved).length

    return [
      { name: "Approved", value: approved, color: "#10b981" },
      { name: "Pending", value: pending, color: "#f59e0b" },
    ]
  }

  // Calculate real data
  const matchesDataReal = calculateMatchesData()
  const teamPerformanceData = calculateTeamPerformanceData()
  const registrationStatusData = calculateRegistrationStatusData()

  // Calculate attendance and revenue data based on approved teams
  const calculateAttendanceRevenueData = () => {
    const approvedTeams = teamsData?.Teams?.filter((team: any) => team.approved) || []
    const approvedTeamsCount = approvedTeams.length
    const revenuePerTeam = 250000 // 250,000 FRWs per approved team
    
    // Generate monthly data for the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const currentMonth = new Date().getMonth()
    
    return months.map((month, index) => {
      // Calculate attendance based on approved teams (assuming each team brings ~200-300 fans)
      const baseAttendance = approvedTeamsCount * 250
      const attendanceVariation = Math.floor(Math.random() * 100) - 50 // ±50 variation
      const attendance = Math.max(0, baseAttendance + attendanceVariation)
      
      // Revenue is fixed at 250,000 FRWs per approved team
      const totalRevenue = approvedTeamsCount * revenuePerTeam
      
      return {
        month,
        attendance,
        revenue: totalRevenue
      }
    })
  }

  const attendanceData = calculateAttendanceRevenueData()

  // Calculate top players from real database data
  const calculateTopPlayers = () => {
    const playerStats = playerStatsData?.player_statistics || []
    
    // Group statistics by player
    const playerStatsMap: {[key: string]: {name: string, team: string, goals: number, assists: number, matches: number, rating: number}} = {}
    
    playerStats.forEach((stat: any) => {
      if (!stat.players) return // Skip if no player data
      
      const playerId = stat.player_id
      const playerName = stat.players.name
      const teamName = stat.players.teams?.name || 'Unknown Team'
      
      if (!playerStatsMap[playerId]) {
        playerStatsMap[playerId] = {
          name: playerName,
          team: teamName,
          goals: 0,
          assists: 0,
          matches: 0,
          rating: 0
        }
      }
      
      playerStatsMap[playerId].goals += stat.goals || 0
      playerStatsMap[playerId].assists += stat.assists || 0
      playerStatsMap[playerId].matches += 1
    })
    
    // Calculate rating for each player
    Object.keys(playerStatsMap).forEach((playerId: string) => {
      const player = playerStatsMap[playerId]
      const totalGoals = player.goals || 0
      const totalAssists = player.assists || 0
      const totalMatches = player.matches || 1
      
      // Calculate rating: (goals * 2 + assists) / matches
      player.rating = totalMatches > 0 ? (totalGoals * 2 + totalAssists) / totalMatches : 0
    })
    
    // Sort by rating and return top 5
    return Object.values(playerStatsMap)
      .sort((a: any, b: any) => b.rating - a.rating)
      .slice(0, 5)
  }

  const playerStats = calculateTopPlayers()

  const financialData = [
    { category: "Ticket Sales", amount: 125000, percentage: 45 },
    { category: "Sponsorships", amount: 89000, percentage: 32 },
    { category: "Merchandise", amount: 42000, percentage: 15 },
    { category: "Other", amount: 22000, percentage: 8 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Analytics Dashboard</h2>
          <p className="text-white/80">Comprehensive insights into league performance and metrics</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Group Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="groupA">Group A</SelectItem>
              <SelectItem value="groupB">Group B</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Total Teams</p>
                <p className="text-2xl font-bold text-white mt-1">{teamsData?.Teams?.length || 0}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-300">+2 this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Matches Played</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {matchesData?.matches?.filter((m: any) => {
                    const matchDate = new Date(m.dateAndtime)
                    const now = new Date()
                    const isPastMatch = matchDate < now
                    const hasGoals = m.team1Goals !== null && m.team2Goals !== null
                    
                    return isPastMatch && hasGoals
                  }).length || 0}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-300">+8 this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Total Goals</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {matchesData?.matches?.reduce((sum: number, match: any) => {
                    const matchDate = new Date(match.dateAndtime)
                    const now = new Date()
                    const isPastMatch = matchDate < now
                    const hasGoals = match.team1Goals !== null && match.team2Goals !== null
                    
                    if (isPastMatch && hasGoals) {
                      const team1Goals = parseInt(match.team1Goals) || 0
                      const team2Goals = parseInt(match.team2Goals) || 0
                      const safeTeam1Goals = team1Goals > 100 ? 0 : team1Goals
                      const safeTeam2Goals = team2Goals > 100 ? 0 : team2Goals
                      return sum + safeTeam1Goals + safeTeam2Goals
                    }
                    return sum
                  }, 0) || 0}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-300">+15 this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Total Revenue</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {(() => {
                    const approvedTeams = teamsData?.Teams?.filter((team: any) => team.approved) || []
                    const totalRevenue = approvedTeams.length * 250000
                    return totalRevenue.toLocaleString('en-US')
                  })()} FRWs
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-300">
                    {teamsData?.Teams?.filter((team: any) => team.approved).length || 0} approved teams
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Matches & Goals Chart */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Trophy className="h-5 w-5" />
              Matches & Goals Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={matchesDataReal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="matches" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="goals" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance Chart */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Users className="h-5 w-5" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <ChartTooltip />
                  <Bar dataKey="points" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Registration Status */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Target className="h-5 w-5" />
              Registration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={registrationStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {registrationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendance & Revenue */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Calendar className="h-5 w-5" />
              Attendance & Revenue
            </CardTitle>
            <p className="text-white/60 text-sm mt-2">
              Revenue: 250,000 FRWs per approved team
            </p>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <ChartTooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [`${Number(value).toLocaleString('en-US')} FRWs`, 'Revenue']
                      }
                      return [value, name === 'attendance' ? 'Attendance' : name]
                    }}
                  />
                  <Area type="monotone" dataKey="attendance" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="revenue" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player Statistics */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Users className="h-5 w-5" />
            Top Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            {playerStats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playerStats.map((player, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{player.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {player.team}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Goals:</span>
                        <span className="text-white font-medium">{player.goals}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Assists:</span>
                        <span className="text-white font-medium">{player.assists}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Matches:</span>
                        <span className="text-white font-medium">{player.matches}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Rating:</span>
                        <span className="text-white font-medium">
                          {isNaN(player.rating) ? '0.0' : player.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white/60" />
                </div>
                <p className="text-white/60 text-lg">No player statistics available</p>
                <p className="text-white/40 text-sm">Player data will appear here once matches are played</p>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
} 