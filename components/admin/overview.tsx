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
import { GET_TEAMS, GET_MATCH_SCHEDULES, GET_ALL_MANAGERS_DETAILS } from "@/lib/graphql/queries"

export function Overview() {
  // Fetch real data from database
  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery(GET_TEAMS)
  const { data: matchesData, loading: matchesLoading, error: matchesError } = useQuery(GET_MATCH_SCHEDULES)
  const { data: managersData, loading: managersLoading, error: managersError } = useQuery(GET_ALL_MANAGERS_DETAILS)

  // Loading state
  if (teamsLoading || matchesLoading || managersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white/60 animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (teamsError || matchesError || managersError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-white/60 text-lg">Error loading dashboard data</p>
          <p className="text-white/40 text-sm">Please try again later</p>
        </div>
      </div>
    )
  }

  // Calculate real KPIs from database data
  const calculateKPIs = () => {
    const teams = teamsData?.Teams || []
    const matches = matchesData?.matches || []
    const managers = managersData?.managers || []

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

    // Calculate total goals with safety checks
    const totalGoals = completedMatches.reduce((sum: number, match: any) => {
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

    // Calculate average goals per match
    const avgGoalsPerMatch = completedMatches.length > 0 ? (totalGoals / completedMatches.length).toFixed(2) : "0.00"

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
      completedMatches: completedMatches.length,
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

  // Calculate matches and goals trend by month
  const calculateMatchesTrend = () => {
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

    return [...Object.values(monthlyData)].sort((a, b) => {
      const dateA = new Date(a.month)
      const dateB = new Date(b.month)
      return dateA.getTime() - dateB.getTime()
    })
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

  // KPI data
  const kpiData = [
    {
      title: "Total Teams",
      value: kpis.totalTeams.toString(),
      change: `+${kpis.approvedTeams}`,
      trend: "up" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Matches Played",
      value: kpis.completedMatches.toString(),
      change: `+${kpis.totalMatches - kpis.completedMatches}`,
      trend: "up" as const,
      icon: Trophy,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Goals",
      value: kpis.totalGoals.toString(),
      change: `+${Math.floor(kpis.totalGoals / kpis.completedMatches)}`,
      trend: "up" as const,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Goals/Match",
      value: kpis.avgGoalsPerMatch,
      change: "0.0",
      trend: "up" as const,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Award className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-50 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "warning":
        return "bg-orange-50 text-orange-700 border-orange-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">{kpi.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${kpi.trend === "up" ? "text-green-300" : "text-red-300"}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
                <LineChart data={matchesTrendData}>
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

      {/* Registration Status & Recent Activity */}
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

        {/* Recent Activity */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10">
                  <div className="mt-1">{getStatusIcon(activity.status)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{activity.description}</p>
                    <p className="text-xs text-white/70 mt-1">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(activity.status)}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 