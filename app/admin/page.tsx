"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  Plus,
  Edit,
  Trash2,
  Eye,
  Target,
  Clock,
  TrendingUp,
  Download,
  Search,
  MoreHorizontal,
  Bell,
  Settings,
  DollarSign,
  Award,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Import admin components
import { Overview } from "@/components/admin/overview"
import { Teams } from "@/components/admin/teams"
import { Matches } from "@/components/admin/matches"
import { Analytics } from "@/components/admin/analytics"
import { Registrations } from "@/components/admin/registrations"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for charts
  const matchesData = [
    { month: "Jan", matches: 12, goals: 38 },
    { month: "Feb", matches: 16, goals: 52 },
    { month: "Mar", matches: 14, goals: 45 },
    { month: "Apr", matches: 18, goals: 61 },
    { month: "May", matches: 20, goals: 68 },
    { month: "Jun", matches: 15, goals: 48 },
  ]

  const teamPerformanceData = [
    { name: "Thunder FC", points: 16, matches: 6 },
    { name: "Lightning United", points: 15, matches: 6 },
    { name: "Velocity FC", points: 14, matches: 6 },
    { name: "Storm Riders", points: 11, matches: 6 },
    { name: "Dynamo FC", points: 11, matches: 6 },
  ]

  const registrationStatusData = [
    { name: "Approved", value: 13, color: "#10b981" },
    { name: "Pending", value: 3, color: "#f59e0b" },
    { name: "Rejected", value: 2, color: "#ef4444" },
  ]

  const teams = [
    {
      id: 1,
      name: "Thunder FC",
      manager: "John Smith",
      players: 10,
      group: "A",
      points: 16,
      status: "active",
      lastActive: "2024-02-10",
      email: "john@thunderfc.com",
    },
    {
      id: 2,
      name: "Lightning United",
      manager: "Mike Johnson",
      players: 12,
      group: "B",
      points: 15,
      status: "active",
      lastActive: "2024-02-09",
      email: "mike@lightning.com",
    },
    {
      id: 3,
      name: "Storm Riders",
      manager: "David Wilson",
      players: 11,
      group: "A",
      points: 11,
      status: "active",
      lastActive: "2024-02-08",
      email: "david@stormriders.com",
    },
    {
      id: 4,
      name: "Velocity FC",
      manager: "Chris Brown",
      players: 10,
      group: "B",
      points: 14,
      status: "inactive",
      lastActive: "2024-02-05",
      email: "chris@velocityfc.com",
    },
  ]

  const recentActivity = [
    { type: "match", description: "Thunder FC vs Storm Riders completed", time: "2 hours ago", status: "success" },
    {
      type: "registration",
      description: "New team registration from Fire Hawks",
      time: "4 hours ago",
      status: "pending",
    },
    {
      type: "update",
      description: "Player statistics updated for Lightning United",
      time: "6 hours ago",
      status: "info",
    },
    { type: "alert", description: "Payment overdue for Velocity FC", time: "1 day ago", status: "warning" },
  ]

  const matches = [
    {
      id: 1,
      date: "2024-02-15",
      time: "19:00",
      team1: "Thunder FC",
      team2: "Storm Riders",
      team1Score: 3,
      team2Score: 2,
      group: "A",
      venue: "Prime Arena 1",
      status: "completed",
    },
    {
      id: 2,
      date: "2024-02-15",
      time: "20:00",
      team1: "Lightning United",
      team2: "Velocity FC",
      group: "B",
      venue: "Prime Arena 2",
      status: "scheduled",
    },
    {
      id: 3,
      date: "2024-02-16",
      time: "18:30",
      team1: "Rapid Fire",
      team2: "Blaze FC",
      group: "A",
      venue: "Prime Arena 1",
      status: "scheduled",
    },
    {
      id: 4,
      date: "2024-02-16",
      time: "19:30",
      team1: "Phoenix United",
      team2: "Dynamo FC",
      group: "B",
      venue: "Prime Arena 2",
      status: "scheduled",
    },
  ]

  const registrations = [
    {
      id: 1,
      teamName: "Fire Hawks",
      managerName: "Sarah Johnson",
      email: "sarah@firehawks.com",
      phone: "+250 123 456 789",
      submittedDate: "2024-02-10",
      status: "pending" as const,
      group: "A",
      location: "Kigali",
    },
    {
      id: 2,
      teamName: "Golden Eagles",
      managerName: "Michael Chen",
      email: "michael@goldeneagles.com",
      phone: "+250 987 654 321",
      submittedDate: "2024-02-09",
      status: "approved" as const,
      group: "B",
      location: "Kigali",
    },
    {
      id: 3,
      teamName: "Silver Lions",
      managerName: "Emma Wilson",
      email: "emma@silverlions.com",
      phone: "+250 555 123 456",
      submittedDate: "2024-02-08",
      status: "rejected" as const,
      group: "A",
      location: "Kigali",
      reviewNotes: "Incomplete documentation",
    },
  ]

  const kpiData = [
    {
      title: "Total Revenue",
      value: "$24,500",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Teams",
      value: "16",
      change: "+2",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Matches Played",
      value: "48",
      change: "+8",
      trend: "up",
      icon: Trophy,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg Goals/Match",
      value: "3.25",
      change: "-0.1",
      trend: "down",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Prime5 League</h1>
                <p className="text-sm text-gray-600">Administrative Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-green-600">JD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6 bg-white border shadow-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              Teams
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
              value="registrations"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            >
              Registrations
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Overview
              kpiData={kpiData}
              matchesData={matchesData}
              teamPerformanceData={teamPerformanceData}
              registrationStatusData={registrationStatusData}
              recentActivity={recentActivity}
            />
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams">
            <Teams teams={teams} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
                <p className="text-gray-600">Manage all registered teams and their information</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Team
              </Button>
            </div>

            {/* Search and Filter */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search teams..." className="pl-10" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      <SelectItem value="A">Group A</SelectItem>
                      <SelectItem value="B">Group B</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="active">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Teams Table */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Team</TableHead>
                      <TableHead className="font-semibold">Manager</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Players</TableHead>
                      <TableHead className="font-semibold">Group</TableHead>
                      <TableHead className="font-semibold">Points</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Last Active</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow key={team.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-green-600">{team.name.substring(0, 2)}</span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{team.name}</div>
                              <div className="text-sm text-gray-500">ID: {team.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{team.manager}</TableCell>
                        <TableCell className="text-sm text-gray-600">{team.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-medium">
                            {team.players} players
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Group {team.group}</Badge>
                        </TableCell>
                        <TableCell className="font-bold text-green-600">{team.points}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              team.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {team.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{team.lastActive}</TableCell>
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
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Team
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Team
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

          {/* Matches Tab */}
          <TabsContent value="matches">
            <Matches matches={matches} />
          </TabsContent>

                    {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Analytics
              matchesData={matchesData}
              teamPerformanceData={teamPerformanceData}
              registrationStatusData={registrationStatusData}
            />
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            <Registrations registrations={registrations} />
          </TabsContent>

              {/* Advanced Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Match Completion Rate",
                  value: "94.2%",
                  icon: CheckCircle,
                  color: "text-green-600",
                  bgColor: "bg-green-50",
                },
                {
                  title: "Average Attendance",
                  value: "1,247",
                  icon: Users,
                  color: "text-blue-600",
                  bgColor: "bg-blue-50",
                },
                {
                  title: "Goals per Match",
                  value: "3.25",
                  icon: Target,
                  color: "text-purple-600",
                  bgColor: "bg-purple-50",
                },
                {
                  title: "Fair Play Score",
                  value: "8.7/10",
                  icon: Award,
                  color: "text-orange-600",
                  bgColor: "bg-orange-50",
                },
              ].map((metric, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                        <metric.icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                      <div className="text-sm text-gray-600">{metric.title}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Analytics Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Monthly Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      revenue: { label: "Revenue", color: "#10b981" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { month: "Jan", revenue: 4200 },
                          { month: "Feb", revenue: 4800 },
                          { month: "Mar", revenue: 3900 },
                          { month: "Apr", revenue: 5200 },
                          { month: "May", revenue: 5800 },
                          { month: "Jun", revenue: 4500 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Player Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      players: { label: "Players", color: "#3b82f6" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { category: "Top Scorers", players: 12 },
                          { category: "Playmakers", players: 18 },
                          { category: "Defenders", players: 24 },
                          { category: "Goalkeepers", players: 16 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="category" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="players" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs remain similar but with improved styling... */}
          <TabsContent value="registrations" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Registration Management</h2>
                <p className="text-gray-600">Review and manage team registration applications</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Manual Registration
                </Button>
              </div>
            </div>

            {/* Registration Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-green-50">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">+2 this week</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-gray-900">13</div>
                    <div className="text-sm text-gray-600">Approved Teams</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-yellow-50">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Needs review</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-gray-900">3</div>
                    <div className="text-sm text-gray-600">Pending Review</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-red-50">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">This month</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-gray-900">2</div>
                    <div className="text-sm text-gray-600">Rejected</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Registrations Table */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Pending Registrations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Team Details</TableHead>
                      <TableHead className="font-semibold">Manager</TableHead>
                      <TableHead className="font-semibold">Submitted</TableHead>
                      <TableHead className="font-semibold">Documents</TableHead>
                      <TableHead className="font-semibold">Payment</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        team: "Fire Hawks",
                        manager: "Tom Wilson",
                        email: "tom@firehawks.com",
                        submitted: "2024-02-12",
                        documents: "Complete",
                        payment: "Verified",
                      },
                      {
                        team: "Ice Wolves",
                        manager: "Sarah Davis",
                        email: "sarah@icewolves.com",
                        submitted: "2024-02-11",
                        documents: "Incomplete",
                        payment: "Pending",
                      },
                    ].map((registration, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900">{registration.team}</div>
                            <div className="text-sm text-gray-500">{registration.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{registration.manager}</TableCell>
                        <TableCell className="text-sm text-gray-600">{registration.submitted}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              registration.documents === "Complete"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {registration.documents}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              registration.payment === "Verified"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {registration.payment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
