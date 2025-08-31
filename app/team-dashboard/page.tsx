"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Trophy,
  Calendar,
  Edit,
  Upload,
  Target,
  Clock,
  MapPin,
  TrendingUp,
  User,
  Settings,
  Bell,
  Download,
  Activity,
  Star,
  Shield,
  Zap,
  Users,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  MoreHorizontal,
  Trash2,
  LogOut,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useMutation, useQuery } from "@apollo/client"
import { GET_ALL_PLAYERS_WHERE_TEAM_ID, GET_TEAM_COMPLETE_DATA, GET_TEAM_MATCHES, GET_CURRENT_SEASON_WITH_GROUPS, GET_TEAM_PLAYER_STATISTICS } from "@/lib/graphql/queries"
import { ADD_TEAM_PLAYER_DETAILS } from "@/lib/graphql/mutations"
import { OverviewTab, PlayersTab, MatchesTab, AnalyticsTab, SettingsTab } from "@/components/team-dashboard"

function TeamDashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [showAddPlayerDialog, setShowAddPlayerDialog] = useState(false)
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: ""
  })
  const { manager, logout } = useAuth()

  // GraphQL hooks
  const [addPlayer] = useMutation(ADD_TEAM_PLAYER_DETAILS, {
    refetchQueries: [{ query: GET_ALL_PLAYERS_WHERE_TEAM_ID, variables: { teamId: manager?.team?.id || "" } }]
  })

  const { data: playersData, loading: playersLoading } = useQuery(GET_ALL_PLAYERS_WHERE_TEAM_ID, {
    variables: { teamId: manager?.team?.id || "" },
    skip: !manager?.team?.id
  })

  const { data: teamData, loading: teamLoading } = useQuery(GET_TEAM_COMPLETE_DATA, {
    variables: { teamId: manager?.team?.id || "" },
    skip: !manager?.team?.id
  })

  const { data: matchesData, loading: matchesLoading } = useQuery(GET_TEAM_MATCHES, {
    variables: { teamId: manager?.team?.id || "" },
    skip: !manager?.team?.id
  })

  const { data: seasonData, loading: seasonLoading } = useQuery(GET_CURRENT_SEASON_WITH_GROUPS, {
    skip: !manager?.team?.id
  })

  const { data: playerStatsData, loading: playerStatsLoading } = useQuery(GET_TEAM_PLAYER_STATISTICS, {
    variables: { teamId: manager?.team?.id || "" },
    skip: !manager?.team?.id
  })

  // Extract data from queries
  const currentTeam = teamData?.Teams?.[0]
  const currentSeason = seasonData?.seasons?.[0]
  const teamMatches = matchesData?.matches || [] // Now filtered by team in the query
  
  // Filter player statistics for this team only
  const allPlayerStats = playerStatsData?.player_statistics?.filter((stat: any) => {
    // Check if this player belongs to the current team
    return currentTeam?.players?.some((player: any) => player.id === stat.player_id)
  }) || []

  // Function to handle adding a new player
  const handleAddPlayer = async () => {
    if (!manager?.team?.id) {
      console.error("No team ID found")
      return
    }
    
    try {
      await addPlayer({
        variables: {
          team_id: manager.team.id,
          name: newPlayer.name,
          email: newPlayer.email,
          phone: newPlayer.phone,
          gender: newPlayer.gender,
          dob: newPlayer.dob
        }
      })
      
      // Reset form and close dialog
      setNewPlayer({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dob: ""
      })
      setShowAddPlayerDialog(false)
    } catch (error) {
      console.error("Error adding player:", error)
    }
  }

  // Real data functions using GraphQL queries
  const getRealTeamData = () => {
    if (!currentTeam || !currentSeason) {
      // Return fallback data if team data is not available
      return {
        name: manager?.team?.name || "Team Dashboard",
        shortName: manager?.team?.shortName || "TFC",
        manager: manager?.name || "Unknown Manager",
        email: manager?.email || null,
        phone: null,
        founded: null, // Not available in current database
        group: currentSeason?.groups?.[0]?.name || null,
        position: null, // Will be calculated from match results
        points: 0,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        winRate: 0,
        cleanSheets: 0,
        avgGoalsPerMatch: 0,
      }
    }
    
    // Get current season and group
    const currentSeasonId = currentSeason.id
    const currentGroupId = currentSeason.groups?.[0]?.id
    
    // Filter matches for current season and group
    const seasonGroupMatches = teamMatches.filter((match: any) => 
      match.season_id === currentSeasonId
    )
    
    // Calculate statistics from actual match results
    let wins = 0
    let draws = 0
    let losses = 0
    let goalsFor = 0
    let goalsAgainst = 0
    let cleanSheets = 0
    
    seasonGroupMatches.forEach((match: any) => {
      const isHome = match.team1 === manager?.team?.id
      const teamGoals = isHome ? (match.team1Goals || 0) : (match.team2Goals || 0)
      const opponentGoals = isHome ? (match.team2Goals || 0) : (match.team1Goals || 0)
      
      // Count goals
      goalsFor += teamGoals
      goalsAgainst += opponentGoals
      
      // Determine match result
      if (teamGoals > opponentGoals) {
        wins++
      } else if (teamGoals < opponentGoals) {
        losses++
      } else {
        draws++
      }
      
      // Count clean sheets
      if (opponentGoals === 0) {
        cleanSheets++
      }
    })
    
    const played = wins + draws + losses
    const points = (wins * 3) + draws
    const goalDifference = goalsFor - goalsAgainst
    const winRate = played > 0 ? ((wins / played) * 100).toFixed(1) : 0
    const avgGoalsPerMatch = played > 0 ? (goalsFor / played).toFixed(1) : 0
    
    // Calculate position based on points and goal difference
    // This would need to be compared with other teams in the same group
    // For now, we'll use the team_statistics position if available
    const position = currentTeam.team_statistics?.[0]?.position || null
    
    return {
      name: currentTeam.name || manager?.team?.name || "Team Dashboard",
      shortName: currentTeam.shortname || manager?.team?.shortName || "TFC",
      manager: manager?.name || "Unknown Manager",
      email: manager?.email || null,
      phone: null,
      founded: null, // Not available in current database
      group: currentSeason?.groups?.[0]?.name || null,
      position, // From team_statistics or calculated from standings
      points, // Calculated from match results
      played, // Calculated from match results
      wins, // Calculated from match results
      draws, // Calculated from match results
      losses, // Calculated from match results
      goalsFor, // Calculated from match results
      goalsAgainst, // Calculated from match results
      goalDifference, // Calculated from match results
      winRate, // Calculated from match results
      cleanSheets, // Calculated from match results
      avgGoalsPerMatch, // Calculated from match results
    }
  }

  const getRealAnalyticsData = () => {
    if (!currentTeam || !currentSeason) return null
    
    // Get current season and group
    const currentSeasonId = currentSeason.id
    
    // Filter matches for current season only (groups not accessible from matches)
    const seasonGroupMatches = teamMatches.filter((match: any) => 
      match.season_id === currentSeasonId
    )
    
    // Calculate statistics from actual match results
    let wins = 0
    let draws = 0
    let losses = 0
    let goalsFor = 0
    let goalsAgainst = 0
    let cleanSheets = 0
    
    seasonGroupMatches.forEach((match: any) => {
      const isHome = match.team1 === manager?.team?.id
      const teamGoals = isHome ? (match.team1Goals || 0) : (match.team2Goals || 0)
      const opponentGoals = isHome ? (match.team2Goals || 0) : (match.team1Goals || 0)
      
      // Count goals
      goalsFor += teamGoals
      goalsAgainst += opponentGoals
      
      // Determine match result
      if (teamGoals > opponentGoals) {
        wins++
      } else if (teamGoals < opponentGoals) {
        losses++
      } else {
        draws++
      }
      
      // Count clean sheets
      if (opponentGoals === 0) {
        cleanSheets++
      }
    })
    
    const played = wins + draws + losses
    
    // Calculate player statistics from database
    const playerStats = currentTeam.players?.map((player: any) => {
      const playerStats = allPlayerStats.filter((stat: any) => stat.player_id === player.id)
      const totalGoals = playerStats.reduce((sum: number, stat: any) => sum + parseInt(stat.goals || "0"), 0)
      const totalAssists = playerStats.reduce((sum: number, stat: any) => sum + parseInt(stat.assists || "0"), 0)
      const totalYellowCards = playerStats.reduce((sum: number, stat: any) => sum + parseInt(stat.yellow_cards || "0"), 0)
      const totalRedCards = playerStats.reduce((sum: number, stat: any) => sum + parseInt(stat.red_cards || "0"), 0)
      
      return {
        name: player.name,
        goals: totalGoals,
        assists: totalAssists,
        matches: played,
        yellowCards: totalYellowCards,
        redCards: totalRedCards,
        rating: 7.0, // Not in current database
      }
    }) || []
    
    // Calculate team discipline from player statistics
    const totalYellowCards = allPlayerStats
      .filter((stat: any) => currentTeam.players?.some((player: any) => player.id === stat.player_id))
      .reduce((sum: number, stat: any) => sum + parseInt(stat.yellow_cards || "0"), 0)
    
    const totalRedCards = allPlayerStats
      .filter((stat: any) => currentTeam.players?.some((player: any) => player.id === stat.player_id))
      .reduce((sum: number, stat: any) => sum + parseInt(stat.red_cards || "0"), 0)
    
    return {
      teamStats: {
        totalMatches: played,
        winPercentage: played > 0 ? ((wins / played) * 100).toFixed(1) : 0,
        drawPercentage: played > 0 ? ((draws / played) * 100).toFixed(1) : 0,
        lossPercentage: played > 0 ? ((losses / played) * 100).toFixed(1) : 0,
        goalsScored: goalsFor,
        goalsConceded: goalsAgainst,
        cleanSheets, // Calculated from actual match results
        avgGoalsPerMatch: played > 0 ? (goalsFor / played).toFixed(1) : 0,
        possession: null, // Not in current database
        passAccuracy: null, // Not in current database
        shotsOnTarget: null, // Not in current database
        fouls: null, // Not in current database
        yellowCards: totalYellowCards,
        redCards: totalRedCards,
      },
      monthlyPerformance: [
        { month: "Current", wins, draws, losses, goals: goalsFor, points: (wins * 3) + draws },
      ],
      playerStats,
      formData: getRealPerformanceData(),
    }
  }

  const getRealTeamSettings = () => {
    if (!currentTeam || !currentSeason) return null
    
    return {
      name: currentTeam.name || null,
      shortName: currentTeam.shortname || null,
      location: currentTeam.location || null,
      founded: null, // Not available in current database
      description: "A competitive football team focused on excellence and sportsmanship.",
      website: null, // Not available in current database
      socialMedia: {
        facebook: null, // Not available in current database
        twitter: null, // Not available in current database
        instagram: null, // Not available in current database
      },
    }
  }

  const getRealPerformanceData = () => {
    if (!teamMatches || teamMatches.length === 0) return []
    
    // Get current season and group
    const currentSeasonId = currentSeason?.id
    
    // Filter matches for current season only (groups not accessible from matches)
    const seasonGroupMatches = teamMatches.filter((match: any) => 
      match.season_id === currentSeasonId
    )
    
    return seasonGroupMatches.slice(0, 6).map((match, index) => {
      const isHome = match.team1 === manager?.team?.id
      // Use actual goals from the match instead of team statistics
      const teamGoals = isHome ? (match.team1Goals || 0) : (match.team2Goals || 0)
      const teamGoalsAgainst = isHome ? (match.team2Goals || 0) : (match.team1Goals || 0)
      
      // Calculate points based on actual match result
      let points = 0
      if (teamGoals > teamGoalsAgainst) {
        points = 3 // Win
      } else if (teamGoals === teamGoalsAgainst) {
        points = 1 // Draw
      } else {
        points = 0 // Loss
      }
      
      return {
        match: `Match ${index + 1}`,
        goals: teamGoals,
        goalsAgainst: teamGoalsAgainst,
        points,
      }
    })
  }

  // Use real data instead of mock data
  const realTeamData = getRealTeamData()
  const realAnalyticsData = getRealAnalyticsData()
  const realTeamSettings = getRealTeamSettings()
  const realPerformanceData = getRealPerformanceData()

  // Manager settings using real data
  const managerSettings = {
    name: manager?.name || null,
    email: manager?.email || null,
    phone: null, // Phone not available in current Manager type
    photo: manager?.photo || null,
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      profilePublic: true,
      showContactInfo: false,
      showStats: true,
    },
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen relative">
      {/* Professional Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl shadow-2xl border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600/90 to-green-700/90 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-2xl">{realTeamData?.name || "Team Dashboard"}</h1>
                <p className="text-sm text-white/90 drop-shadow-xl">Team Manager Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-white/80">Welcome back,</p>
                <p className="text-white font-medium">{manager?.name}</p>
              </div>
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                <Bell className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white">
              Players
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white">
              Matches
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <OverviewTab 
              teamData={realTeamData || {}}
              performanceData={realPerformanceData || []}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                  <Users className="h-5 w-5" />
                  Squad Management
                </CardTitle>
                  <Dialog open={showAddPlayerDialog} onOpenChange={setShowAddPlayerDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={!manager?.team?.id}
                        title={!manager?.team?.id ? "No team associated with this manager" : "Add a new player to your team"}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Player
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white/95 backdrop-blur-xl border-white/20">
                      <DialogHeader>
                        <DialogTitle className="text-gray-800">Add New Player</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="player-name" className="text-gray-700">Name</Label>
                          <Input
                            id="player-name"
                            value={newPlayer.name}
                            onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                            placeholder="Player's full name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="player-email" className="text-gray-700">Email</Label>
                          <Input
                            id="player-email"
                            type="email"
                            value={newPlayer.email}
                            onChange={(e) => setNewPlayer({...newPlayer, email: e.target.value})}
                            placeholder="player@example.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="player-phone" className="text-gray-700">Phone</Label>
                          <Input
                            id="player-phone"
                            value={newPlayer.phone}
                            onChange={(e) => setNewPlayer({...newPlayer, phone: e.target.value})}
                            placeholder="+1234567890"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="player-gender" className="text-gray-700">Gender</Label>
                          <Select value={newPlayer.gender} onValueChange={(value) => setNewPlayer({...newPlayer, gender: value})}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="player-dob" className="text-gray-700">Date of Birth</Label>
                          <Input
                            id="player-dob"
                            type="date"
                            value={newPlayer.dob}
                            onChange={(e) => setNewPlayer({...newPlayer, dob: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={handleAddPlayer}
                            className="bg-green-600 hover:bg-green-700 text-white flex-1"
                          >
                            Add Player
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowAddPlayerDialog(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white/90">Player</TableHead>
                        <TableHead className="text-white/90">Email</TableHead>
                        <TableHead className="text-white/90">Phone</TableHead>
                        <TableHead className="text-white/90">Gender</TableHead>
                        <TableHead className="text-white/90">Date of Birth</TableHead>
                        <TableHead className="text-white/90">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {playersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-white/70 py-8">
                            Loading players...
                          </TableCell>
                        </TableRow>
                      ) : playersData?.players?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-white/70 py-8">
                            No players found. Add your first player!
                          </TableCell>
                        </TableRow>
                      ) : (
                        playersData?.players?.map((player: any) => (
                        <TableRow key={player.id} className="hover:bg-white/10">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-600/90 to-green-700/90 backdrop-blur-md rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-white">{player.name}</div>
                                <div className="text-sm text-white/70">#{player.id}</div>
                              </div>
                            </div>
                          </TableCell>
                            <TableCell className="text-white">{player.email || "N/A"}</TableCell>
                            <TableCell className="text-white">{player.phone || "N/A"}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                {player.gender || "N/A"}
                            </Badge>
                          </TableCell>
                            <TableCell className="text-white">{player.dob || "N/A"}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Player
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove Player
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <MatchesTab teamId={manager?.team?.id || ""} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsTab analyticsData={realAnalyticsData || {}} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsTab 
              teamSettings={realTeamSettings || {}}
              managerSettings={managerSettings}
              onSaveTeamSettings={(settings) => console.log('Save team settings:', settings)}
              onSaveManagerSettings={(settings) => console.log('Save manager settings:', settings)}
              onLogout={handleLogout}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function TeamDashboard() {
  return (
    <ProtectedRoute>
      <TeamDashboardContent />
    </ProtectedRoute>
  )
}
