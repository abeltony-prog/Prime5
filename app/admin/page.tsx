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
        </Tabs>
      </div>
    </div>
  )
}
