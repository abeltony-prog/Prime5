"use client"

import { useState, useEffect } from "react"
import { SeasonScheduler } from "@/components/admin/season-scheduler"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, Calendar, Users, Target, RefreshCw, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { useSeasons } from "@/hooks/use-seasons"
import { useMatchSchedules } from "@/hooks/use-matches"
import { Badge } from "@/components/ui/badge"

export default function SeasonSchedulerPage() {
  const { seasons, loading, error } = useSeasons()
  const { matches, loading: matchesLoading, error: matchesError, refetch: refetchMatches } = useMatchSchedules()
  
  // Calculate statistics
  const totalSeasons = seasons?.length || 0
  const activeSeasons = seasons?.filter((season: any) => {
    const now = new Date()
    const startDate = new Date(season.startDate)
    const endDate = new Date(season.EndDate)
    return now >= startDate && now <= endDate
  }).length || 0
  
  const upcomingSeasons = seasons?.filter((season: any) => {
    const now = new Date()
    const startDate = new Date(season.startDate)
    return now < startDate
  }).length || 0
  
  const totalTeams = seasons?.reduce((total: number, season: any) => {
    return total + Object.keys(season.teams || {}).length
  }, 0) || 0

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    } catch {
      return { date: "Invalid Date", time: "Invalid Time" }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">Season Scheduler</h1>
                <p className="text-sm text-white/80">Plan and manage league seasons</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Total Seasons</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "..." : totalSeasons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Active Seasons</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "..." : activeSeasons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Teams Participating</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "..." : totalTeams}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Upcoming Seasons</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "..." : upcomingSeasons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Info */}
        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-red-600 text-lg">❌</div>
                <div>
                  <h3 className="text-red-800 font-medium">Error Loading Seasons</h3>
                  <p className="text-red-700 text-sm">{error.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300 mr-3"></div>
                <span>Loading seasons...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Season Scheduler Component */}
        <SeasonScheduler />

        {/* Season Matches Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white drop-shadow-lg">All Season Matches</h2>
            <Button 
              onClick={() => refetchMatches()}
              variant="outline"
              size="sm"
              className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {matchesLoading ? (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-center text-white">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300 mr-3"></div>
                  <span>Loading matches...</span>
                </div>
              </CardContent>
            </Card>
          ) : matchesError ? (
            <Card className="bg-red-50 border-red-200 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="text-red-600 text-lg">❌</div>
                  <div>
                    <h3 className="text-red-800 font-medium">Error Loading Matches</h3>
                    <p className="text-red-700 text-sm">{matchesError.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : matches.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-white/50 mx-auto mb-2" />
                  <p className="text-white/80">No matches found</p>
                  <p className="text-sm text-white/60 mt-1">
                    Create matches in the season scheduler above
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {matches.map((match: any) => {
                    const { date, time } = formatDateTime(match.dateAndtime)
                    const team1Name = match.Team1?.name || match.team1 || "Unknown Team"
                    const team2Name = match.Team2?.name || match.team2 || "Unknown Team"
                    
                    return (
                      <div key={match.id} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        <div className="text-center space-y-3">
                          <div>
                            <div className="text-sm text-white/70">Date</div>
                            <div className="font-medium text-white">{date}</div>
                          </div>
                          <div>
                            <div className="text-sm text-white/70">Time</div>
                            <div className="font-medium text-white flex items-center justify-center gap-1">
                              <Clock className="h-3 w-3" />
                              {time}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-white/70">Teams</div>
                            <div className="font-medium text-white text-sm">
                              {team1Name} vs {team2Name}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-white/70">Location</div>
                            <div className="font-medium text-white flex items-center justify-center gap-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              {match.location || "TBD"}
                            </div>
                          </div>
                          <div>
                            <Badge variant="outline" className="font-medium text-xs">
                              {match.season_id ? `Season ${match.season_id.substring(0, 8)}...` : "No Season"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 