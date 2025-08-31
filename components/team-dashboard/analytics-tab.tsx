"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { TrendingUp, Target, Shield, Zap, Activity, Star, Trophy, Users, Calendar, BarChart3 } from "lucide-react"

interface AnalyticsData {
  teamStats: {
    totalMatches: number
    winPercentage: number
    drawPercentage: number
    lossPercentage: number
    goalsScored: number
    goalsConceded: number
    cleanSheets: number
    avgGoalsPerMatch: number
    possession: number
    passAccuracy: number
    shotsOnTarget: number
    fouls: number
    yellowCards: number
    redCards: number
  }
  monthlyPerformance: Array<{
    month: string
    wins: number
    draws: number
    losses: number
    goals: number
    points: number
  }>
  playerStats: Array<{
    name: string
    goals: number
    assists: number
    matches: number
    rating: number
  }>
  formData: Array<{
    match: string
    result: 'W' | 'D' | 'L'
    goalsFor: number
    goalsAgainst: number
  }>
}

interface AnalyticsTabProps {
  analyticsData: AnalyticsData
}

export function AnalyticsTab({ analyticsData }: AnalyticsTabProps) {
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500'
      case 'D': return 'bg-yellow-500'
      case 'L': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-white">{analyticsData.teamStats.winPercentage}%</p>
              </div>
            </div>
            <Progress value={analyticsData.teamStats.winPercentage} className="mt-3" />
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
                <p className="text-2xl font-bold text-white">{analyticsData.teamStats.avgGoalsPerMatch}</p>
              </div>
            </div>
            <Progress value={analyticsData.teamStats.avgGoalsPerMatch * 10} className="mt-3" />
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
                <p className="text-2xl font-bold text-white">{analyticsData.teamStats.cleanSheets}</p>
              </div>
            </div>
            <Progress value={(analyticsData.teamStats.cleanSheets / analyticsData.teamStats.totalMatches) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Possession</p>
                <p className="text-2xl font-bold text-white">{analyticsData.teamStats.possession}%</p>
              </div>
            </div>
            <Progress value={analyticsData.teamStats.possession} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Activity className="h-5 w-5" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Line 
                  type="monotone" 
                  dataKey="points" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="goals" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <BarChart3 className="h-5 w-5" />
              Match Results Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Bar dataKey="wins" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="draws" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Form and Player Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Calendar className="h-5 w-5" />
              Recent Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 justify-center">
              {analyticsData.formData.map((match, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getFormColor(match.result)}`}
                  title={`${match.match}: ${match.result} (${match.goalsFor}-${match.goalsAgainst})`}
                >
                  {match.result}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-white/60 text-sm">
              <p>Last {analyticsData.formData.length} matches</p>
              <p className="mt-2">
                <span className="text-green-400">W</span> = Win, 
                <span className="text-yellow-400"> D</span> = Draw, 
                <span className="text-red-400"> L</span> = Loss
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Users className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.playerStats.slice(0, 5).map((player, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{player.name}</p>
                      <p className="text-white/60 text-sm">{player.goals} goals, {player.assists} assists</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">{player.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Statistics */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Zap className="h-5 w-5" />
            Advanced Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Attacking</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Shots on Target</span>
                  <span className="text-white font-medium">{analyticsData.teamStats.shotsOnTarget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Pass Accuracy</span>
                  <span className="text-white font-medium">{analyticsData.teamStats.passAccuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Goals Scored</span>
                  <span className="text-white font-medium">{analyticsData.teamStats.goalsScored}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Defending</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Clean Sheets</span>
                  <span className="text-white font-medium">{analyticsData.teamStats.cleanSheets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Goals Conceded</span>
                  <span className="text-white font-medium">{analyticsData.teamStats.goalsConceded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Possession</span>
                  <span className="text-white font-medium">{analyticsData.teamStats.possession}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Discipline</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Yellow Cards</span>
                  <span className="text-white font-medium">{analyticsData.teamStats.yellowCards}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Red Cards</span>
                  <span className="text-white font-medium">{analyticsData.teamStats.redCards}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Fouls</span>
                  <span className="text-white font-medium">{analyticsData.teamStats.fouls}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 