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
import { GET_ALL_PLAYERS_WHERE_TEAM_ID } from "@/lib/graphql/queries"
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

  // Mock team data - in real app, this would come from the authenticated manager
  const teamData = {
    name: manager?.team.name || "Thunder FC",
    shortName: manager?.team.shortName || "TFC",
    manager: manager?.name || "John Smith",
    email: manager?.email || "john@thunderfc.com",
    phone: "+1 234 567 8900",
    founded: "2020",
    group: "A",
    position: 1,
    points: 16,
    played: 6,
    wins: 5,
    draws: 1,
    losses: 0,
    goalsFor: 18,
    goalsAgainst: 8,
    goalDifference: 10,
    winRate: 83.3,
    cleanSheets: 2,
    avgGoalsPerMatch: 3.0,
  }

  const performanceData = [
    { match: "Match 1", goals: 2, goalsAgainst: 1, points: 3 },
    { match: "Match 2", goals: 4, goalsAgainst: 1, points: 3 },
    { match: "Match 3", goals: 2, goalsAgainst: 2, points: 1 },
    { match: "Match 4", goals: 3, goalsAgainst: 0, points: 3 },
    { match: "Match 5", goals: 4, goalsAgainst: 2, points: 3 },
    { match: "Match 6", goals: 3, goalsAgainst: 2, points: 3 },
  ]

  const players = [
    {
      id: 1,
      name: "Marcus Silva",
      position: "Forward",
      goals: 8,
      assists: 3,
      yellowCards: 1,
      redCards: 0,
      matchesPlayed: 6,
      rating: 8.5,
      status: "available",
    },
    {
      id: 2,
      name: "Diego Rodriguez",
      position: "Midfielder",
      goals: 5,
      assists: 6,
      yellowCards: 2,
      redCards: 0,
      matchesPlayed: 6,
      rating: 8.2,
      status: "available",
    },
    {
      id: 3,
      name: "Alex Thompson",
      position: "Defender",
      goals: 1,
      assists: 2,
      yellowCards: 3,
      redCards: 0,
      matchesPlayed: 6,
      rating: 7.8,
      status: "available",
    },
    {
      id: 4,
      name: "Sam Wilson",
      position: "Goalkeeper",
      goals: 0,
      assists: 0,
      yellowCards: 1,
      redCards: 0,
      matchesPlayed: 6,
      rating: 8.0,
      status: "available",
    },
  ]

  const upcomingMatches = [
    {
      id: 1,
      opponent: "Lightning United",
      date: "2024-02-15",
      time: "15:00",
      venue: "Prime5 Stadium",
      type: "League Match",
    },
    {
      id: 2,
      opponent: "Storm Riders",
      date: "2024-02-22",
      time: "18:30",
      venue: "Community Field",
      type: "Cup Match",
    },
    {
      id: 3,
      opponent: "Dynamo FC",
      date: "2024-03-01",
      time: "16:00",
      venue: "Prime5 Stadium",
      type: "League Match",
    },
  ]

  const recentResults = [
    {
      id: 1,
      opponent: "Velocity FC",
      result: "W 3-1",
      date: "2024-02-08",
      goals: 3,
      goalsAgainst: 1,
      points: 3,
    },
    {
      id: 2,
      opponent: "Fire Hawks",
      result: "W 2-0",
      date: "2024-02-01",
      goals: 2,
      goalsAgainst: 0,
      points: 3,
    },
    {
      id: 3,
      opponent: "Golden Eagles",
      result: "D 2-2",
      date: "2024-01-25",
      goals: 2,
      goalsAgainst: 2,
      points: 1,
    },
  ]

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
                <h1 className="text-2xl font-bold text-white drop-shadow-2xl">{teamData.name}</h1>
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
              teamData={teamData}
              performanceData={performanceData}
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
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                    <Calendar className="h-5 w-5" />
                    Match Schedule & Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border-white/20">
                      <TabsTrigger value="upcoming" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 text-white">
                        Upcoming Matches
                      </TabsTrigger>
                      <TabsTrigger value="results" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 text-white">
                        Match Results
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upcoming" className="mt-6">
                      <div className="space-y-4">
                        {upcomingMatches.map((match) => (
                          <div key={match.id} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-semibold text-white">{match.opponent}</h3>
                              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                {match.type}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {match.date}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {match.time}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {match.venue}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="results" className="mt-6">
                      <div className="space-y-4">
                        {recentResults.map((result) => (
                          <div key={result.id} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-semibold text-white">{result.opponent}</h3>
                              <Badge 
                                variant="secondary" 
                                className={`${
                                  result.points === 3 
                                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                    : result.points === 1
                                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                                }`}
                              >
                                {result.result}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {result.date}
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Goals: {result.goals} - {result.goalsAgainst}
                              </div>
                              <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4" />
                                {result.points} points
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                    <TrendingUp className="h-5 w-5" />
                    Team Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="match" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Bar dataKey="goals" fill="#10b981" />
                      <Bar dataKey="goalsAgainst" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                      <Shield className="h-5 w-5" />
                      Defensive Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Clean Sheets</span>
                      <span className="text-white font-semibold">{teamData.cleanSheets}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Goals Against</span>
                      <span className="text-white font-semibold">{teamData.goalsAgainst}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Goal Difference</span>
                      <span className="text-white font-semibold">{teamData.goalDifference}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                      <Zap className="h-5 w-5" />
                      Offensive Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Goals Scored</span>
                      <span className="text-white font-semibold">{teamData.goalsFor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Avg Goals/Match</span>
                      <span className="text-white font-semibold">{teamData.avgGoalsPerMatch}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Win Rate</span>
                      <span className="text-white font-semibold">{teamData.winRate}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                    <Settings className="h-5 w-5" />
                    Team Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="teamName" className="text-white drop-shadow-md">Team Name</Label>
                        <Input
                          id="teamName"
                          value={teamData.name}
                          className="bg-white/20 backdrop-blur-sm border-white/30 text-white"
                          readOnly={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shortName" className="text-white drop-shadow-md">Short Name</Label>
                        <Input
                          id="shortName"
                          value={teamData.shortName}
                          className="bg-white/20 backdrop-blur-sm border-white/30 text-white"
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="manager" className="text-white drop-shadow-md">Manager</Label>
                        <Input
                          id="manager"
                          value={teamData.manager}
                          className="bg-white/20 backdrop-blur-sm border-white/30 text-white"
                          readOnly={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white drop-shadow-md">Email</Label>
                        <Input
                          id="email"
                          value={teamData.email}
                          className="bg-white/20 backdrop-blur-sm border-white/30 text-white"
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {isEditing ? (
                        <>
                          <Button className="bg-green-600 hover:bg-green-700">
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Information
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                    <User className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/20">
                      <Mail className="h-4 w-4 mr-2" />
                      Change Email
                    </Button>
                    <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/20">
                      <Shield className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/20">
                      <Bell className="h-4 w-4 mr-2" />
                      Notification Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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
