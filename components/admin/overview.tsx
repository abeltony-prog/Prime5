"use client"

import { useQuery } from '@apollo/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
} from "recharts"
import {
  Users,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { GET_TEAMS, GET_MATCH_SCHEDULES, GET_ALL_MANAGERS_DETAILS, GET_TEAM_STATISTICS } from "@/lib/graphql/queries"

export function Overview() {
  // Fetch real data from database
  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery(GET_TEAMS)
  const { data: matchesData, loading: matchesLoading, error: matchesError } = useQuery(GET_MATCH_SCHEDULES)
  const { data: managersData, loading: managersLoading, error: managersError } = useQuery(GET_ALL_MANAGERS_DETAILS)
  const { data: teamStatsData, loading: teamStatsLoading, error: teamStatsError } = useQuery(GET_TEAM_STATISTICS)

  // Loading state
  if (teamsLoading || matchesLoading || managersLoading || teamStatsLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center flex flex-col items-center">
          <div className="w-20 h-20 border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin mb-8"></div>
          <p className="text-white/40 font-black tracking-widest uppercase text-sm">Accessing Mainframe Data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (teamsError || matchesError || managersError || teamStatsError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center p-12 glass-dark border border-red-500/20 max-w-xl mx-auto">
          <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-3xl font-black italic uppercase text-red-400 mb-4">Connection Failed</h3>
          <p className="text-white/60 font-bold mb-4">Could not decrypt the requested dashboard logs.</p>
          <p className="text-red-400/60 text-xs font-mono">Please retry initialization sequence.</p>
        </div>
      </div>
    )
  }

  // Calculate real KPIs from database data
  const calculateKPIs = () => {
    const teams = teamsData?.Teams || []
    const matches = matchesData?.matches || []
    const managers = managersData?.managers || []
    const teamStats = teamStatsData?.team_statistics || []

    // Calculate total teams
    const totalTeams = teams.length

    // Calculate total matches
    const totalMatches = matches.length

    // Calculate completed matches (only past matches with goals)
    const completedMatches = matches.filter((match: any) => {
      const matchDate = new Date(match.dateAndtime)
      const now = new Date()
      const isPastMatch = matchDate < now
      const hasGoals = match.team1Goals !== null && match.team2Goals !== null
      
      return isPastMatch && hasGoals
    })

    // Calculate total goals using team statistics if available, otherwise from matches
    let totalGoals = 0
    let totalMatchesPlayed = 0

    if (teamStats.length > 0) {
      // Use accumulated team statistics from database
      totalGoals = teamStats.reduce((sum: number, stat: any) => {
        const goalsFor = parseInt(stat.goals_for) || 0
        return sum + goalsFor
      }, 0)
      
      totalMatchesPlayed = teamStats.reduce((sum: number, stat: any) => {
        const played = parseInt(stat.played) || 0
        return sum + played
      }, 0)
    } else {
      // Fallback: Calculate from match results
      totalGoals = completedMatches.reduce((sum: number, match: any) => {
        const team1Goals = parseInt(match.team1Goals) || 0
        const team2Goals = parseInt(match.team2Goals) || 0
        
        // Debug: log any suspicious goal values
        if (team1Goals > 100 || team2Goals > 100) {
          console.warn('Suspicious goal values found:', {
            matchId: match.id,
            team1Goals: match.team1Goals,
            team2Goals: match.team2Goals,
            parsedTeam1: team1Goals,
            parsedTeam2: team2Goals
          })
        }
        
        // Safety check: if goals are unreasonably high, cap them
        const safeTeam1Goals = team1Goals > 100 ? 0 : team1Goals
        const safeTeam2Goals = team2Goals > 100 ? 0 : team2Goals
        
        return sum + safeTeam1Goals + safeTeam2Goals
      }, 0)
      
      totalMatchesPlayed = completedMatches.length
    }

    // Calculate average goals per match
    const avgGoalsPerMatch = totalMatchesPlayed > 0 ? (totalGoals / totalMatchesPlayed).toFixed(2) : "0.00"

    // Calculate approved vs pending teams
    const approvedTeams = teams.filter((team: any) => team.approved).length
    const pendingTeams = totalTeams - approvedTeams

    // Calculate recent activity (last 5 matches)
    const recentMatches = [...matches]
      .filter((match: any) => {
        const matchDate = new Date(match.dateAndtime)
        const now = new Date()
        const isPastMatch = matchDate < now
        const hasGoals = match.team1Goals !== null && match.team2Goals !== null
        
        return isPastMatch && hasGoals
      })
      .sort((a: any, b: any) => new Date(b.dateAndtime).getTime() - new Date(a.dateAndtime).getTime())
      .slice(0, 5)

    return {
      totalTeams,
      totalMatches,
      completedMatches: totalMatchesPlayed,
      totalGoals,
      avgGoalsPerMatch,
      approvedTeams,
      pendingTeams,
      recentMatches
    }
  }

  // Calculate team performance data
  const calculateTeamPerformance = () => {
    const teams = teamsData?.Teams || []
    const teamStats = teamStatsData?.team_statistics || []

    return teams.map((team: any) => {
      // Find team statistics from database
      const teamStat = teamStats.find((stat: any) => stat.team_id === team.id)
      
      if (teamStat) {
        // Use database statistics
        const points = parseInt(teamStat.points) || 0
        const wins = parseInt(teamStat.wins) || 0
        const draws = parseInt(teamStat.draws) || 0
        const losses = parseInt(teamStat.losses) || 0
        const played = parseInt(teamStat.played) || 0

        return {
          name: team.name,
          points,
          matches: played,
          wins,
          draws,
          losses
        }
      } else {
        // Fallback: Calculate from match results
        const matches = matchesData?.matches || []
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
      }
    }).sort((a: any, b: any) => b.points - a.points).slice(0, 5)
  }

  // Calculate matches and goals trend by week
  const calculateMatchesTrend = () => {
    const matches = matchesData?.matches || []
    
    // Filter completed matches (past matches with goals)
    const completedMatches = matches.filter((match: any) => {
      const matchDate = new Date(match.dateAndtime)
      const now = new Date()
      const isPastMatch = matchDate < now
      const hasGoals = match.team1Goals !== null && match.team2Goals !== null
      
      return isPastMatch && hasGoals
    })

    // Helper function to get week number and year
    const getWeekKey = (date: Date) => {
      const year = date.getFullYear()
      const startOfYear = new Date(year, 0, 1)
      const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
      const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
      return `Week ${weekNumber}, ${year}`
    }

    // If no completed matches, show all matches for trend
    if (completedMatches.length === 0) {
      // Show all matches (including future ones) for trend visualization
      const allMatches = matches.filter((match: any) => {
        return match.dateAndtime // Just check if date exists
      })

      if (allMatches.length === 0) {
        return []
      }

      const weeklyData: {[key: string]: {week: string, matches: number, goals: number}} = {}
      
      allMatches.forEach((match: any) => {
        const date = new Date(match.dateAndtime)
        const weekKey = getWeekKey(date)
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = { week: weekKey, matches: 0, goals: 0 }
        }
        
        weeklyData[weekKey].matches++
        
        // For matches without goals, show 0 goals
        const team1Goals = parseInt(match.team1Goals) || 0
        const team2Goals = parseInt(match.team2Goals) || 0
        const safeTeam1Goals = team1Goals > 100 ? 0 : team1Goals
        const safeTeam2Goals = team2Goals > 100 ? 0 : team2Goals
        
        weeklyData[weekKey].goals += safeTeam1Goals + safeTeam2Goals
      })

      const sortedData = [...Object.values(weeklyData)].sort((a, b) => {
        const weekA = parseInt(a.week.match(/Week (\d+)/)?.[1] || '0')
        const weekB = parseInt(b.week.match(/Week (\d+)/)?.[1] || '0')
        const yearA = parseInt(a.week.match(/(\d{4})/)?.[1] || '0')
        const yearB = parseInt(b.week.match(/(\d{4})/)?.[1] || '0')
        
        if (yearA !== yearB) return yearA - yearB
        return weekA - weekB
      })



      return sortedData
    }

    const weeklyData: {[key: string]: {week: string, matches: number, goals: number}} = {}
    
    // Group matches by week and calculate goals
    completedMatches.forEach((match: any) => {
      const date = new Date(match.dateAndtime)
      const weekKey = getWeekKey(date)
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { week: weekKey, matches: 0, goals: 0 }
      }
      
      weeklyData[weekKey].matches++
      
      // Calculate goals for this match
      const team1Goals = parseInt(match.team1Goals) || 0
      const team2Goals = parseInt(match.team2Goals) || 0
      
      // Safety check: if goals are unreasonably high, cap them
      const safeTeam1Goals = team1Goals > 100 ? 0 : team1Goals
      const safeTeam2Goals = team2Goals > 100 ? 0 : team2Goals
      
      weeklyData[weekKey].goals += safeTeam1Goals + safeTeam2Goals
    })

    // Convert to array and sort by date
    const sortedData = [...Object.values(weeklyData)].sort((a, b) => {
      const weekA = parseInt(a.week.match(/Week (\d+)/)?.[1] || '0')
      const weekB = parseInt(b.week.match(/Week (\d+)/)?.[1] || '0')
      const yearA = parseInt(a.week.match(/(\d{4})/)?.[1] || '0')
      const yearB = parseInt(b.week.match(/(\d{4})/)?.[1] || '0')
      
      if (yearA !== yearB) return yearA - yearB
      return weekA - weekB
    })



    return sortedData
  }

  // Calculate registration status
  const calculateRegistrationStatus = () => {
    const teams = teamsData?.Teams || []
    const approved = teams.filter((team: any) => team.approved).length
    const pending = teams.filter((team: any) => !team.approved).length

    return [
      { name: "Approved", value: approved, color: "#10b981" },
      { name: "Pending", value: pending, color: "#f59e0b" },
    ]
  }

  // Generate recent activity
  const generateRecentActivity = () => {
    const kpis = calculateKPIs()
    const activities: Array<{
    type: string
    description: string
    time: string
    status: "success" | "pending" | "info" | "warning"
    }> = []

    // Add recent match activities
    kpis.recentMatches.forEach((match: any) => {
      const date = new Date(match.dateAndtime)
      const timeAgo = getTimeAgo(date)
      
      activities.push({
        type: "match",
        description: `${match.Team1?.name || 'Team 1'} vs ${match.Team2?.name || 'Team 2'} completed`,
        time: timeAgo,
        status: "success" as const
      })
    })

    // Add team registration activities
    const teams = teamsData?.Teams || []
    const recentTeams = [...teams]
      .filter((team: any) => team.created_at) // Only include teams with created_at
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3)

    recentTeams.forEach((team: any) => {
      const date = new Date(team.created_at)
      const timeAgo = getTimeAgo(date)
      
      activities.push({
        type: "registration",
        description: `New team registration: ${team.name}`,
        time: timeAgo,
        status: team.approved ? "success" as const : "pending" as const
      })
    })

    return [...activities].sort((a, b) => {
      const timeA = getTimeFromAgo(a.time)
      const timeB = getTimeFromAgo(b.time)
      return timeB - timeA
    }).slice(0, 4)
  }

  // Helper function to get time ago
  const getTimeAgo = (date: Date) => {
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date provided to getTimeAgo:', date)
      return 'Unknown time'
    }
    
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    
    // Handle future dates
    if (diffInMs < 0) {
      return 'In the future'
    }
    
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  // Helper function to get time from ago string
  const getTimeFromAgo = (timeAgo: string) => {
    const now = new Date()
    if (timeAgo.includes('day')) {
      const days = parseInt(timeAgo.split(' ')[0])
      return now.getTime() - (days * 24 * 60 * 60 * 1000)
    } else if (timeAgo.includes('hour')) {
      const hours = parseInt(timeAgo.split(' ')[0])
      return now.getTime() - (hours * 60 * 60 * 1000)
    }
    return now.getTime()
  }

  // Calculate all data
  const kpis = calculateKPIs()
  const teamPerformanceData = calculateTeamPerformance()
  const matchesTrendData = calculateMatchesTrend()
  const registrationStatusData = calculateRegistrationStatus()
  const recentActivity = generateRecentActivity()

  // Debug logging for chart data
  

  // KPI data
  const kpiData = [
    {
      title: "Total Squads",
      value: kpis.totalTeams.toString(),
      change: `+${kpis.approvedTeams}`,
      trend: "up" as const,
      icon: Users,
      color: "text-lime-400",
      bgColor: "bg-lime-400/10 border-lime-400/20 text-lime-400",
    },
    {
      title: "Clashes Logged",
      value: kpis.completedMatches.toString(),
      change: `+${kpis.totalMatches - kpis.completedMatches}`,
      trend: "up" as const,
      icon: Trophy,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
    {
      title: "Total Points Scored",
      value: kpis.totalGoals.toString(),
      change: `+${Math.floor(kpis.totalGoals / Math.max(kpis.completedMatches, 1))}`,
      trend: "up" as const,
      icon: Target,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    },
    {
      title: "Strike Rate (Avg)",
      value: kpis.avgGoalsPerMatch,
      change: "0.0",
      trend: "up" as const,
      icon: TrendingUp,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-lime-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "info":
        return <Award className="h-4 w-4 text-blue-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      default:
        return <CheckCircle className="h-4 w-4 text-white/50" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-lime-400/10 text-lime-300 border-lime-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none"
      case "pending":
        return "bg-yellow-400/10 text-yellow-300 border-yellow-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none"
      case "info":
        return "bg-blue-400/10 text-blue-300 border-blue-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none"
      case "warning":
        return "bg-red-400/10 text-red-300 border-red-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none"
      default:
        return "bg-white/5 text-white/70 border-white/20 font-bold uppercase tracking-widest text-[10px] rounded-none"
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(190,242,100,0.05)] hover:border-lime-400/30 group transition-all duration-500 rounded-none bg-black/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{kpi.title}</p>
                  <p className="text-3xl font-black italic tracking-tighter text-white mt-1 drop-shadow-md">{kpi.value}</p>
                  <div className="flex items-center mt-3">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-lime-400 mr-2" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span className={`text-[10px] font-black tracking-widest uppercase ${kpi.trend === "up" ? "text-lime-300" : "text-red-400"}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`w-14 h-14 border ${kpi.bgColor} rounded-none flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.05)]`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Matches & Goals Chart */}
        <Card className="glass-dark border border-white/10 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-black/40 p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-black italic uppercase tracking-widest text-lime-300 drop-shadow-sm">
              <Trophy className="h-6 w-6 text-lime-400" />
              Clash & Score Velocity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#061B14]/60">
            <div className="w-full h-[350px]">
              {matchesTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={matchesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold'}} />
                  <ChartTooltip contentStyle={{backgroundColor: '#061B14', border: '1px solid rgba(190,242,100,0.2)', borderRadius: 0, color: 'white'}} />
                  <Line type="monotone" dataKey="matches" stroke="#a3e635" strokeWidth={3} dot={{r: 4, fill: '#a3e635'}} activeDot={{r: 6, fill: '#BEF264', stroke: '#061B14', strokeWidth: 2}} />
                  <Line type="monotone" dataKey="goals" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} activeDot={{r: 6, fill: '#34d399', stroke: '#061B14', strokeWidth: 2}} />
                </LineChart>
              </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Trophy className="w-16 h-16 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 font-black tracking-widest uppercase text-sm">Awaiting Datastream</p>
                    <p className="text-white/20 text-xs mt-2 uppercase">Zero clash records located</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team Performance Chart */}
        <Card className="glass-dark border border-white/10 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-black/40 p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-black italic uppercase tracking-widest text-lime-300 drop-shadow-sm">
              <Users className="h-6 w-6 text-lime-400" />
              Squad Combat Ratings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#061B14]/60">
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold'}} />
                  <ChartTooltip contentStyle={{backgroundColor: '#061B14', border: '1px solid rgba(190,242,100,0.2)', borderRadius: 0, color: 'white'}} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="points" fill="#a3e635" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registration Status & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Registration Status */}
        <Card className="glass-dark border border-white/10 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-black/40 p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-black italic uppercase tracking-widest text-lime-300 drop-shadow-sm">
              <Target className="h-6 w-6 text-lime-400" />
              Squad Onboarding
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#061B14]/60">
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={registrationStatusData.map(d => ({ ...d, color: d.name === "Approved" ? "#a3e635" : "#eab308" }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
                    outerRadius={100}
                    innerRadius={60}
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth={2}
                    dataKey="value"
                  >
                    {registrationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === "Approved" ? "#a3e635" : "#eab308"} />
                    ))}
                  </Pie>
                  <ChartTooltip contentStyle={{backgroundColor: '#061B14', border: '1px solid rgba(190,242,100,0.2)', borderRadius: 0, color: 'white'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-dark border border-white/10 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
          <CardHeader className="border-b border-white/5 bg-black/40 p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-black italic uppercase tracking-widest text-lime-300 drop-shadow-sm">
              <Clock className="h-6 w-6 text-lime-400" />
              Global Telemetry Stream
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#061B14]/60 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border-l-2 border-transparent hover:border-lime-400 hover:bg-white/5 transition-all duration-300">
                  <div className="mt-1 bg-black/40 p-2 rounded-none border border-white/5">{getStatusIcon(activity.status)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white uppercase tracking-wider">{activity.description}</p>
                    <p className="text-[10px] text-lime-300/60 mt-2 font-mono uppercase">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(activity.status)}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-white/40 font-black tracking-widest uppercase text-sm">No recent telemetry nodes identified.</p>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-6 bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white font-black italic uppercase tracking-widest h-14 rounded-none transition-all">
              Initialize Full Log sequence
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 