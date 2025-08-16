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
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

export default function TeamDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)

  // Mock team data
  const teamData = {
    name: "Thunder FC",
    shortName: "TFC",
    manager: "John Smith",
    email: "john@thunderfc.com",
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
      name: "Alex Johnson",
      position: "Defender",
      goals: 2,
      assists: 2,
      yellowCards: 0,
      redCards: 0,
      matchesPlayed: 5,
      rating: 7.8,
      status: "injured",
    },
    {
      id: 4,
      name: "Roberto Martinez",
      position: "Goalkeeper",
      goals: 0,
      assists: 1,
      yellowCards: 1,
      redCards: 0,
      matchesPlayed: 6,
      rating: 8.0,
      status: "available",
    },
  ]

  const upcomingMatches = [
    {
      opponent: "Lightning United",
      date: "2024-02-15",
      time: "19:00",
      venue: "Prime Arena",
      importance: "high",
      opponentRank: 2,
    },
    {
      opponent: "Velocity FC",
      date: "2024-02-22",
      time: "20:00",
      venue: "Sports Complex",
      importance: "medium",
      opponentRank: 4,
    },
  ]

  const teamStats = [
    {
      label: "League Position",
      value: `#${teamData.position}`,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Win Rate",
      value: `${teamData.winRate}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    { label: "Goals Scored", value: teamData.goalsFor, icon: Target, color: "text-red-600", bgColor: "bg-red-50" },
    { label: "Clean Sheets", value: teamData.cleanSheets, icon: Shield, color: "text-blue-600", bgColor: "bg-blue-50" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Team Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">{teamData.shortName}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{teamData.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Group {teamData.group} • Position #{teamData.position}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {players.length} Players
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    {teamData.manager}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{teamData.points}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5 bg-white border shadow-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              Squad
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              Matches
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {teamStats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Performance Chart & Upcoming Matches */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      goals: { label: "Goals Scored", color: "#10b981" },
                      goalsAgainst: { label: "Goals Conceded", color: "#ef4444" },
                    }}
                    className="h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="match" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="goals"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="goalsAgainst"
                          stroke="#ef4444"
                          strokeWidth={3}
                          dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Fixtures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingMatches.map((match, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-semibold text-gray-900">vs {match.opponent}</div>
                          <Badge
                            className={
                              match.importance === "high"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : match.importance === "medium"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : "bg-green-100 text-green-800 hover:bg-green-100"
                            }
                          >
                            {match.importance} priority
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {match.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {match.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {match.venue}
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            Rank #{match.opponentRank}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Performance Metrics */}
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600">{teamData.winRate}%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                    <Progress value={teamData.winRate} className="h-3" />
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-semibold text-green-600">{teamData.wins}</div>
                        <div className="text-gray-600">Wins</div>
                      </div>
                      <div>
                        <div className="font-semibold text-yellow-600">{teamData.draws}</div>
                        <div className="text-gray-600">Draws</div>
                      </div>
                      <div>
                        <div className="font-semibold text-red-600">{teamData.losses}</div>
                        <div className="text-gray-600">Losses</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Goal Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Goals Scored</span>
                      <span className="font-semibold text-green-600">{teamData.goalsFor}</span>
                    </div>
                    <Progress value={(teamData.goalsFor / 25) * 100} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Goals Conceded</span>
                      <span className="font-semibold text-red-600">{teamData.goalsAgainst}</span>
                    </div>
                    <Progress value={(teamData.goalsAgainst / 25) * 100} className="h-2" />

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Goal Difference</span>
                        <span className="font-bold text-green-600">+{teamData.goalDifference}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Target className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Top Scorer</div>
                          <div className="text-xs text-gray-600">Marcus Silva</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">8 goals</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Most Assists</div>
                          <div className="text-xs text-gray-600">Diego Rodriguez</div>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">6 assists</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Highest Rating</div>
                          <div className="text-xs text-gray-600">Marcus Silva</div>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">8.5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Squad Tab */}
          <TabsContent value="players" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Squad Management</h2>
                <p className="text-gray-600">Manage your team roster and player statistics</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Squad
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Player
                </Button>
              </div>
            </div>

            {/* Squad Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  label: "Total Players",
                  value: players.length,
                  icon: Users,
                  color: "text-blue-600",
                  bgColor: "bg-blue-50",
                },
                {
                  label: "Available",
                  value: players.filter((p) => p.status === "available").length,
                  icon: CheckCircle,
                  color: "text-green-600",
                  bgColor: "bg-green-50",
                },
                {
                  label: "Injured",
                  value: players.filter((p) => p.status === "injured").length,
                  icon: AlertCircle,
                  color: "text-red-600",
                  bgColor: "bg-red-50",
                },
                { label: "Avg Rating", value: "8.1", icon: Star, color: "text-yellow-600", bgColor: "bg-yellow-50" },
              ].map((stat, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Players Table */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Player</TableHead>
                      <TableHead className="font-semibold">Position</TableHead>
                      <TableHead className="font-semibold">Matches</TableHead>
                      <TableHead className="font-semibold">Goals</TableHead>
                      <TableHead className="font-semibold">Assists</TableHead>
                      <TableHead className="font-semibold">Rating</TableHead>
                      <TableHead className="font-semibold">Cards</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player) => (
                      <TableRow key={player.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-green-600">
                                {player.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{player.name}</div>
                              <div className="text-sm text-gray-500">#{player.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{player.position}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{player.matchesPlayed}</TableCell>
                        <TableCell className="font-bold text-green-600">{player.goals}</TableCell>
                        <TableCell className="font-bold text-blue-600">{player.assists}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold">{player.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {player.yellowCards > 0 && (
                              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">
                                {player.yellowCards}Y
                              </Badge>
                            )}
                            {player.redCards > 0 && (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">
                                {player.redCards}R
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Player
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove Player
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Team Analytics</h2>
              <p className="text-gray-600">Detailed performance insights and statistics</p>
            </div>

            {/* Advanced Analytics */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Match Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      points: { label: "Points", color: "#10b981" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="match" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="points" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Player Contribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {players.slice(0, 4).map((player, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-green-600">
                              {player.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{player.name}</div>
                            <div className="text-sm text-gray-600">{player.position}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{player.goals + player.assists} contributions</div>
                          <div className="text-sm text-gray-600">
                            {player.goals}G • {player.assists}A
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Attacking Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Goals per Match</span>
                      <span className="font-bold text-green-600">{teamData.avgGoalsPerMatch}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Shots on Target</span>
                      <span className="font-bold">68%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                      <span className="font-bold">24%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Defensive Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Clean Sheets</span>
                      <span className="font-bold text-blue-600">{teamData.cleanSheets}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Goals Conceded/Match</span>
                      <span className="font-bold">1.3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Save Percentage</span>
                      <span className="font-bold">78%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Discipline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Yellow Cards</span>
                      <span className="font-bold text-yellow-600">4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Red Cards</span>
                      <span className="font-bold text-red-600">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fair Play Score</span>
                      <span className="font-bold text-green-600">9.2/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Team Settings</h2>
                <p className="text-gray-600">Manage your team information and preferences</p>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className={isEditing ? "" : "bg-green-600 hover:bg-green-700"}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel Editing" : "Edit Information"}
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Team Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Team Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">{teamData.shortName}</span>
                      </div>
                      {isEditing && (
                        <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                          <Upload className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label>Team Name</Label>
                        <Input
                          defaultValue={teamData.name}
                          disabled={!isEditing}
                          className={isEditing ? "" : "bg-gray-50"}
                        />
                      </div>
                      <div>
                        <Label>Short Name</Label>
                        <Input
                          defaultValue={teamData.shortName}
                          disabled={!isEditing}
                          className={isEditing ? "" : "bg-gray-50"}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Founded Year</Label>
                    <Input
                      defaultValue={teamData.founded}
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-gray-50"}
                    />
                  </div>

                  <div>
                    <Label>Team Description</Label>
                    <Textarea
                      placeholder="Tell us about your team's history, achievements, and playing style..."
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-gray-50"}
                      rows={4}
                    />
                  </div>

                  {isEditing && (
                    <Button className="w-full bg-green-600 hover:bg-green-700">Save Team Information</Button>
                  )}
                </CardContent>
              </Card>

              {/* Manager & Contact Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Manager & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Manager Name</Label>
                    <Input
                      defaultValue={teamData.manager}
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-gray-50"}
                    />
                  </div>

                  <div>
                    <Label>Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        defaultValue={teamData.email}
                        disabled={!isEditing}
                        className={`pl-10 ${isEditing ? "" : "bg-gray-50"}`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        defaultValue={teamData.phone}
                        disabled={!isEditing}
                        className={`pl-10 ${isEditing ? "" : "bg-gray-50"}`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Team Address</Label>
                    <Textarea
                      placeholder="Training ground or team headquarters address..."
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-gray-50"}
                      rows={3}
                    />
                  </div>

                  {isEditing && (
                    <Button className="w-full bg-green-600 hover:bg-green-700">Update Contact Information</Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notification Preferences */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Match Notifications</h4>
                    <div className="space-y-3">
                      {["Match reminders (24h before)", "Match results", "Fixture updates", "Venue changes"].map(
                        (item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{item}</span>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">League Updates</h4>
                    <div className="space-y-3">
                      {["Standings updates", "Player statistics", "League announcements", "Registration deadlines"].map(
                        (item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{item}</span>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button className="bg-green-600 hover:bg-green-700">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
