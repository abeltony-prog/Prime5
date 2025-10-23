"use client"

import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Target,
  Clock,
  Bell,
  Settings,
  Award,
  Trophy,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useQuery } from "@apollo/client"
import { GET_ALL_MANAGERS_DETAILS } from "@/lib/graphql/queries"

// Import admin components
import { Overview } from "@/components/admin/overview"
import { Teams } from "@/components/admin/teams"
import { Matches } from "@/components/admin/matches"
import { Analytics } from "@/components/admin/analytics"
import { Registrations } from "@/components/admin/registrations"
import { SeasonsTab, SettingsTab } from "@/components/admin/tabs"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { logout } = useAuth()

  // Fetch managers data using GraphQL
  const { data: managersData, loading: managersLoading, error: managersError } = useQuery(GET_ALL_MANAGERS_DETAILS)



  const teams = [
    {
      id: "1",
      name: "Thunder FC",
      shortname: "TFC",
      team_manager: "John Smith",
      approved: true,
      manager: {
        id: "1",
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
      id: "2",
      name: "Lightning United",
      shortname: "LUN",
      team_manager: "Mike Johnson",
      approved: true,
      manager: {
        id: "2",
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
      id: "3",
      name: "Storm Riders",
      shortname: "SRD",
      team_manager: "David Wilson",
      approved: true,
      manager: {
        id: "3",
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
      id: "4",
      name: "Velocity FC",
      shortname: "VFC",
      team_manager: "Chris Brown",
      approved: true,
      manager: {
        id: "4",
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
              <Link href="/admin/store">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                  <Target className="w-4 h-4 mr-2" />
                  Store
                </Button>
              </Link>
              <Link href="/admin/upcoming-games">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                  <Clock className="w-4 h-4 mr-2" />
                   Games
                </Button>
              </Link>
              <Link href="/admin/jobs">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                  <Award className="w-4 h-4 mr-2" />
                  Jobs
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="border-red-500/30 text-red-300 hover:bg-red-500/20 hover:text-red-200 bg-red-500/10 backdrop-blur-md"
              >
                Logout
              </Button>
              <div className="flex items-center gap-2 text-xs">
                <span className={`${(() => {
                  const loginTime = localStorage.getItem("adminLoginTime")
                  if (loginTime) {
                    const loginDate = new Date(loginTime)
                    const now = new Date()
                    const hoursDiff = 24 - Math.ceil((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60))
                    if (hoursDiff <= 1) return "text-red-400"
                    if (hoursDiff <= 4) return "text-yellow-400"
                    return "text-slate-300"
                  }
                  return "text-slate-300"
                })()}`}>
                  Session: {(() => {
                    const loginTime = localStorage.getItem("adminLoginTime")
                    if (loginTime) {
                      const loginDate = new Date(loginTime)
                      const now = new Date()
                      const hoursDiff = 24 - Math.ceil((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60))
                      return `${hoursDiff}h left`
                    }
                    return "Unknown"
                  })()}
                </span>
              </div>
              <div className="w-8 h-8 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-500/30">
                <span className="text-sm font-semibold text-green-300">AD</span>
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
            <Overview />
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
            <SeasonsTab />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            {managersLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/70">Loading managers...</p>
              </div>
            ) : managersError ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">
                  <XCircle className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Error Loading Managers</h3>
                <p className="text-white/70">Failed to load managers data. Please try again.</p>
                <p className="text-red-400 text-sm mt-2">{managersError.message}</p>
              </div>
            ) : (
              <Registrations managers={managersData?.managers || []} />
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
