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
    <div className="min-h-screen relative font-['Outfit'] bg-transparent overflow-x-hidden">
      
      {/* Tactical Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-lime-400/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Professional Header */}
      <div className="relative z-20 bg-[#061B14]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3 sm:gap-4 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-lime-400/10 border border-lime-400/20 backdrop-blur-md rounded-none flex items-center justify-center group-hover:scale-105 group-hover:bg-lime-400/20 transition-all shadow-[0_0_15px_rgba(190,242,100,0.1)]">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-lime-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl truncate">
                  Prime5 <span className="text-lime-300">Protocol</span>
                </h1>
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/40 drop-shadow-xl hidden sm:block">Central Mainframe Level 4</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              <Link href="/admin/store">
                <Button variant="outline" size="sm" className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white font-bold uppercase tracking-widest text-[10px] h-10 rounded-none transition-all hidden sm:flex">
                  <Target className="w-4 h-4 mr-2" />
                  Store
                </Button>
              </Link>
              <Link href="/admin/upcoming-games">
                <Button variant="outline" size="sm" className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white font-bold uppercase tracking-widest text-[10px] h-10 rounded-none transition-all hidden sm:flex">
                  <Clock className="w-4 h-4 mr-2" />
                  Games
                </Button>
              </Link>
              <Link href="/admin/jobs">
                <Button variant="outline" size="sm" className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white font-bold uppercase tracking-widest text-[10px] h-10 rounded-none transition-all hidden sm:flex">
                  <Award className="w-4 h-4 mr-2" />
                  Jobs
                </Button>
              </Link>
              <Button variant="outline" size="icon" className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white h-10 w-10 rounded-none transition-all">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white h-10 w-10 rounded-none transition-all">
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold uppercase tracking-widest text-[10px] h-10 rounded-none transition-all"
              >
                <span className="hidden sm:inline">Terminate</span>
                <span className="sm:hidden">Exit</span>
              </Button>
              <div className="hidden xl:flex items-center gap-2 text-xs ml-4">
                <span className={`font-bold tracking-widest uppercase text-[10px] ${(() => {
                  const loginTime = localStorage.getItem("adminLoginTime")
                  if (loginTime) {
                    const loginDate = new Date(loginTime)
                    const now = new Date()
                    const hoursDiff = 24 - Math.ceil((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60))
                    if (hoursDiff <= 1) return "text-red-400"
                    if (hoursDiff <= 4) return "text-yellow-400"
                    return "text-lime-300"
                  }
                  return "text-lime-300"
                })()}`}>
                  Link: {(() => {
                    const loginTime = localStorage.getItem("adminLoginTime")
                    if (loginTime) {
                      const loginDate = new Date(loginTime)
                      const now = new Date()
                      const hoursDiff = 24 - Math.ceil((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60))
                      return `${hoursDiff}h`
                    }
                    return "Unknown"
                  })()}
                </span>
              </div>
              <div className="w-10 h-10 bg-lime-400/20 backdrop-blur-sm rounded-none border border-lime-400/50 flex items-center justify-center ml-2">
                <span className="text-[10px] font-black italic uppercase text-lime-300">AD</span>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                <span className={`${(() => {
                  const loginTime = localStorage.getItem("adminLoginTime")
                  if (loginTime) {
                    const loginDate = new Date(loginTime)
                    const now = new Date()
                    const hoursDiff = 24 - Math.ceil((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60))
                    if (hoursDiff <= 1) return "text-red-400"
                    if (hoursDiff <= 4) return "text-yellow-400"
                    return "text-lime-300"
                  }
                  return "text-lime-300"
                })()}`}>
                  {(() => {
                    const loginTime = localStorage.getItem("adminLoginTime")
                    if (loginTime) {
                      const loginDate = new Date(loginTime)
                      const now = new Date()
                      const hoursDiff = 24 - Math.ceil((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60))
                      return `${hoursDiff}h`
                    }
                    return "?"
                  })()}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Link href="/admin/store">
                  <Button variant="outline" size="sm" className="bg-white/5 border border-white/10 hover:border-lime-400/50 text-white h-10 w-10 p-0 rounded-none flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/admin/upcoming-games">
                  <Button variant="outline" size="sm" className="bg-white/5 border border-white/10 hover:border-lime-400/50 text-white h-10 w-10 p-0 rounded-none flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="bg-white/5 border border-white/10 hover:border-lime-400/50 text-white h-10 w-10 p-0 rounded-none flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 font-bold uppercase tracking-widest text-[10px] h-10 px-3 rounded-none"
                >
                  <span className="text-xs">Exit</span>
                </Button>
              </div>
              
              <div className="w-10 h-10 bg-lime-400/20 backdrop-blur-sm rounded-none border border-lime-400/50 flex items-center justify-center ml-1">
                <span className="text-[10px] font-black italic uppercase text-lime-300">AD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <TabsList className="flex flex-wrap w-full glass-dark border border-white/10 p-2 lg:h-auto rounded-none mb-8 gap-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'teams', label: 'Teams' },
              { id: 'matches', label: 'Matches' },
              { id: 'seasons', label: 'Seasons' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'registrations', label: 'Registrations' },
              { id: 'settings', label: 'Settings' }
            ].map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-lime-400 data-[state=active]:text-black data-[state=active]:shadow-[0_0_15px_rgba(190,242,100,0.2)] text-white hover:bg-white/10 hover:text-white font-black italic uppercase tracking-widest text-[10px] sm:text-xs rounded-none h-12 px-6 flex-1 lg:flex-none transition-all duration-300"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="data-[state=active]:animate-in data-[state=active]:slide-in-from-right data-[state=inactive]:animate-out data-[state=inactive]:slide-out-to-left">
            <Overview />
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="data-[state=active]:animate-in data-[state=active]:slide-in-from-right data-[state=inactive]:animate-out data-[state=inactive]:slide-out-to-left">
            <Teams teams={teams} />
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="data-[state=active]:animate-in data-[state=active]:slide-in-from-right data-[state=inactive]:animate-out data-[state=inactive]:slide-out-to-left">
            <Matches />
          </TabsContent>

          {/* Seasons Tab */}
          <TabsContent value="seasons" className="data-[state=active]:animate-in data-[state=active]:slide-in-from-right data-[state=inactive]:animate-out data-[state=inactive]:slide-out-to-left">
            <SeasonsTab />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="data-[state=active]:animate-in data-[state=active]:slide-in-from-right data-[state=inactive]:animate-out data-[state=inactive]:slide-out-to-left">
            <Analytics />
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations" className="data-[state=active]:animate-in data-[state=active]:slide-in-from-right data-[state=inactive]:animate-out data-[state=inactive]:slide-out-to-left">
            {managersLoading ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin mb-6"></div>
                <p className="text-white/40 font-black tracking-widest uppercase text-xs">Accessing target directory...</p>
              </div>
            ) : managersError ? (
              <div className="text-center py-20 glass-dark border border-red-500/20 max-w-xl mx-auto">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-black italic uppercase text-red-400 mb-4">Connection Failed</h3>
                <p className="text-white/60 font-bold mb-4">Could not decrypt the requested manager logs.</p>
                <p className="text-red-400/60 text-xs font-mono">{managersError.message}</p>
              </div>
            ) : (
              <Registrations managers={managersData?.managers || []} />
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="data-[state=active]:animate-in data-[state=active]:slide-in-from-right data-[state=inactive]:animate-out data-[state=inactive]:slide-out-to-left">
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
