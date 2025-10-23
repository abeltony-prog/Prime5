"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import {
  Trophy,
  Target,
  Clock,
  MapPin,
  TrendingUp,
  Star,
  Shield,
  Zap,
  Activity,
  CheckCircle,
  AlertCircle,
  Edit,
  Settings,
} from "lucide-react"

interface TeamData {
  name: string
  shortName: string
  manager: string
  email: string
  phone: string
  founded: string
  group: string
  position: number
  points: number
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  winRate: number
  cleanSheets: number
  avgGoalsPerMatch: number
}

interface OverviewTabProps {
  teamData: TeamData
  performanceData: Array<{
    match: string
    goals: number
    goalsAgainst: number
    points: number
  }>
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  teamLogo?: string | null
}

export function OverviewTab({ teamData, performanceData, isEditing, setIsEditing, teamLogo }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Team Header Card */}
      <Card className="bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {teamLogo ? (
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                  <img 
                    src={teamLogo} 
                    alt={`${teamData.name} Logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              )}
              <div>
                <CardTitle className="text-3xl font-bold text-black drop-shadow-lg">
                  {teamData.name}
                </CardTitle>
                <p className="text-black/80 text-lg">{teamData.shortName}</p>
                <p className="text-black/60">Managed by {teamData.manager}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-lg px-4 py-2">
                Group {teamData.group}
              </Badge>
              <div className="text-black/80 mt-2">
                <p>Position: #{teamData.position}</p>
                <p>Points: {teamData.points}</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-white">{teamData.winRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Goals Per Match</p>
                <p className="text-2xl font-bold text-white">{teamData.avgGoalsPerMatch}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Clean Sheets</p>
                <p className="text-2xl font-bold text-white">{teamData.cleanSheets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Goal Difference</p>
                <p className="text-2xl font-bold text-white">{teamData.goalDifference > 0 ? '+' : ''}{teamData.goalDifference}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Activity className="h-5 w-5" />
              Match Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="match" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Line 
                  type="monotone" 
                  dataKey="goals" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="goalsAgainst" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <BarChart className="h-5 w-5" />
              Points Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="match" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Bar dataKey="points" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Details */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Settings className="h-5 w-5" />
              Team Information
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Founded</p>
                  <p className="text-white font-medium">{teamData.founded}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Matches Played</p>
                  <p className="text-white font-medium">{teamData.played}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Wins</p>
                  <p className="text-white font-medium">{teamData.wins}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Draws</p>
                  <p className="text-white font-medium">{teamData.draws}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Losses</p>
                  <p className="text-white font-medium">{teamData.losses}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Goals For</p>
                  <p className="text-white font-medium">{teamData.goalsFor}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 