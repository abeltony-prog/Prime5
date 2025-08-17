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
import Link from "next/link"

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

  const kpiData = [
    {
      title: "Total Revenue",
      value: "$24,500",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Teams",
      value: "16",
      change: "+2",
      trend: "up" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Matches Played",
      value: "48",
      change: "+8",
      trend: "up" as const,
      icon: Trophy,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg Goals/Match",
      value: "3.25",
      change: "-0.1",
      trend: "down" as const,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const recentActivity = [
    { type: "match", description: "Thunder FC vs Storm Riders completed", time: "2 hours ago", status: "success" as const },
    {
      type: "registration",
      description: "New team registration from Fire Hawks",
      time: "4 hours ago",
      status: "pending" as const,
    },
    {
      type: "update",
      description: "Player statistics updated for Lightning United",
      time: "6 hours ago",
      status: "info" as const,
    },
    { type: "alert", description: "Payment overdue for Velocity FC", time: "1 day ago", status: "warning" as const },
  ]

  const teams = [
    {
      id: 1,
      name: "Thunder FC",
      shortname: "TFC",
      team_manager: "John Smith",
      manager: {
        id: 1,
        name: "John Smith",
        email: "john@thunderfc.com",
        phone: "+250 123 456 789",
        gender: "male",
        photo: undefined,
        create_at: "2024-01-01T00:00:00Z"
      },
      matche1: [],
      matche2: [],
      players: []
    },
    {
      id: 2,
      name: "Lightning United",
      shortname: "LUN",
      team_manager: "Mike Johnson",
      manager: {
        id: 2,
        name: "Mike Johnson",
        email: "mike@lightning.com",
        phone: "+250 987 654 321",
        gender: "male",
        photo: undefined,
        create_at: "2024-01-01T00:00:00Z"
      },
      matche1: [],
      matche2: [],
      players: []
    },
    {
      id: 3,
      name: "Storm Riders",
      shortname: "SRD",
      team_manager: "David Wilson",
      manager: {
        id: 3,
        name: "David Wilson",
        email: "david@stormriders.com",
        phone: "+250 555 123 456",
        gender: "male",
        photo: undefined,
        create_at: "2024-01-01T00:00:00Z"
      },
      matche1: [],
      matche2: [],
      players: []
    },
    {
      id: 4,
      name: "Velocity FC",
      shortname: "VFC",
      team_manager: "Chris Brown",
      manager: {
        id: 4,
        name: "Chris Brown",
        email: "chris@velocityfc.com",
        phone: "+250 111 222 333",
        gender: "male",
        photo: undefined,
        create_at: "2024-01-01T00:00:00Z"
      },
      matche1: [],
      matche2: [],
      players: []
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
                <h1 className="text-2xl font-bold text-white drop-shadow-2xl">Prime5 League</h1>
                <p className="text-sm text-white/90 drop-shadow-xl">Administrative Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-500/30">
                <span className="text-sm font-semibold text-green-300">JD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-7 lg:w-fit lg:grid-cols-7 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white">
              Teams
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white">
              Matches
            </TabsTrigger>
            <TabsTrigger value="seasons" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white">
              Seasons
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="registrations"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
            >
              Registrations
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
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
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <Matches />
          </TabsContent>

          {/* Seasons Tab */}
          <TabsContent value="seasons">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-2xl">Season Management</h2>
                <p className="text-white/90 drop-shadow-xl">Create and manage league seasons</p>
              </div>
              
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Trophy className="h-16 w-16 text-white/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2 drop-shadow-lg">Season Scheduler</h3>
                    <p className="text-white/80 mb-4 drop-shadow-md">
                      Use the dedicated Season Scheduler to create seasons, invite teams, and plan your league.
                    </p>
                    <Link href="/admin/season-scheduler">
                      <Button className="bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <Trophy className="h-4 h-4 mr-2" />
                        Open Season Scheduler
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
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

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-2xl">System Settings</h2>
                <p className="text-white/90 drop-shadow-xl">Manage system configuration and database connections</p>
              </div>
              
              {/* Database Status */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                    <Settings className="h-5 w-5" />
                    Database Connection Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-white/90">Database Status: </span>
                      <span className="text-green-300">Connected</span>
                    </div>
                    <div>
                      <span className="font-medium text-white/90">Teams Found: </span>
                      <span className="text-white">1</span>
                    </div>
                    <div>
                      <span className="font-medium text-white/90">Loading: </span>
                      <span className="text-white">No</span>
                    </div>
                    <div>
                      <span className="font-medium text-white/90">Fallback Teams: </span>
                      <span className="text-white">3</span>
                    </div>
                  </div>
                  
                  {/* Connection Details */}
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <h4 className="font-medium text-white mb-3 drop-shadow-md">Connection Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-white/90">Error: </span>
                        <span className="text-green-300">None</span>
                      </div>
                      <div>
                        <span className="font-medium text-white/90">Network Status: </span>
                        <span className="text-green-300">Connected</span>
                      </div>
                    </div>
                    
                    {/* Connection Test */}
                    <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded text-sm border border-white/20">
                      <span className="font-medium text-white/90">Last Test: </span>
                      <span className="text-white/80">
                        Click "Test Connection" to check your setup
                      </span>
                      <div className="mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
                        >
                          <Target className="h-4 h-4 mr-2" />
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environment Configuration */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                    <Settings className="h-5 w-5" />
                    Environment Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-2 drop-shadow-md">GraphQL Configuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-1">
                            GraphQL URL
                          </label>
                          <Input 
                            value={process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql'}
                            readOnly
                            className="bg-white/20 backdrop-blur-sm border-white/30 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-1">
                            Admin Secret Status
                          </label>
                          <div className="flex items-center gap-2">
                            <Badge variant={process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET ? "outline" : "destructive"}>
                              {process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET ? 'Set' : 'Not Set'}
                            </Badge>
                            {!process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET && (
                              <span className="text-xs text-red-300">Required for database access</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/20">
                      <h4 className="font-medium text-white mb-2 drop-shadow-md">Setup Instructions</h4>
                      <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-yellow-300 text-lg">ℹ️</div>
                          <span className="font-medium text-yellow-200 drop-shadow-md">To connect to your database:</span>
                        </div>
                        <ol className="text-sm text-yellow-100 space-y-1 list-decimal list-inside">
                          <li>Create a <code className="bg-yellow-500/20 backdrop-blur-sm px-1 rounded border border-yellow-500/30">.env.local</code> file in your project root</li>
                          <li>Add your Hasura GraphQL URL: <code className="bg-yellow-500/20 backdrop-blur-sm px-1 rounded border border-yellow-500/30">NEXT_PUBLIC_HASURA_GRAPHQL_URL=your_url_here</code></li>
                          <li>Add your admin secret: <code className="bg-yellow-500/20 backdrop-blur-sm px-1 rounded border border-yellow-500/30">NEXT_PUBLIC_HASURA_ADMIN_SECRET=your_secret_here</code></li>
                          <li>Restart your development server</li>
                          <li>Click "Test Connection" to verify the setup</li>
                        </ol>
                      </div>
                    </div>
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
