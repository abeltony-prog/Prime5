"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Trophy, AlertCircle, CheckCircle, RefreshCw, AlertCircle as AlertCircleIcon } from "lucide-react"
import { useQuery } from "@apollo/client"
import { GET_TEAM_MATCHES } from "@/lib/graphql/queries"
import { Button } from "@/components/ui/button"

interface Match {
  id: string
  created_at: string
  dateAndtime: string
  location: string
  season_id: string
  team1: string
  team1Goals: number
  team2: string
  team2Goals: number
  Team1?: {
    id: string
    location: string
    logo: string
    name: string
    shortname: string
    team_manager: string
  }
  Team2?: {
    id: string
    location: string
    logo: string
    name: string
    shortname: string
    team_manager: string
  }
}

interface MatchesTabProps {
  teamId: string
}

export function MatchesTab({ teamId }: MatchesTabProps) {
  // GraphQL query to get all matches
  const { data: matchesData, loading: matchesLoading, error: matchesError, refetch } = useQuery(GET_TEAM_MATCHES, {
    variables: { teamId: teamId }
  })

  // Filter matches for this team
  const teamMatches = matchesData?.matches || []

  // Debug: Log the data being received


  // Separate upcoming and completed matches
  const upcomingMatches = teamMatches.filter((match: Match) => {
    const matchDate = new Date(match.dateAndtime)
    return matchDate > new Date()
  })

  const completedMatches = teamMatches.filter((match: Match) => {
    const matchDate = new Date(match.dateAndtime)
    return matchDate <= new Date()
  })

  const formatDate = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return "Invalid Date"
    }
  }

  const formatTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return "Invalid Time"
    }
  }

  const getMatchStatusBadge = (match: Match) => {
    const matchDate = new Date(match.dateAndtime)
    const now = new Date()
    
    if (matchDate > now) {
      return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Scheduled</Badge>
    } else {
      // For completed matches, show the result
      const isHome = match.team1 === teamId
      const teamGoals = isHome ? (match.team1Goals || 0) : (match.team2Goals || 0)
      const opponentGoals = isHome ? (match.team2Goals || 0) : (match.team1Goals || 0)
      
      if (teamGoals > opponentGoals) {
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Won</Badge>
      } else if (teamGoals < opponentGoals) {
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Lost</Badge>
      } else {
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Drew</Badge>
      }
    }
  }

  const getOpponentName = (match: Match) => {
    if (match.team1 === teamId) {
      return match.Team2?.name || match.team2 || "Unknown Team"
    } else {
      return match.Team1?.name || match.team1 || "Unknown Team"
    }
  }

  const isHomeMatch = (match: Match) => {
    return match.team1 === teamId
  }

  // Show loading state
  if (matchesLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300 mx-auto mb-4"></div>
                <p>Loading matches from database...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state
  if (matchesError) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-red-300">
                <AlertCircleIcon className="h-12 w-12 mx-auto mb-4" />
                <p className="text-red-300 font-medium">Error loading matches from database</p>
                <p className="text-white/70 mt-2">{matchesError.message}</p>
                <Button 
                  onClick={() => refetch()} 
                  variant="outline" 
                  className="mt-4 bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Calendar className="h-5 w-5" />
              Match Schedule & Results
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs text-white/70">
                {teamMatches.length} total matches
              </Badge>
              <Badge variant="outline" className="text-xs text-green-300">
                ✓ Live Database
              </Badge>
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                disabled={matchesLoading}
                size="sm"
                className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
              >
                {matchesLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300 mr-2"></div>
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {matchesLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border-white/20">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 text-white">
                Upcoming Matches ({upcomingMatches.length})
              </TabsTrigger>
              <TabsTrigger value="results" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 text-white">
                Match Results ({completedMatches.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-6">
              <div className="space-y-4">
                {upcomingMatches.length === 0 ? (
                  <div className="text-center text-white/70 py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-white/40" />
                    <p className="text-lg">No upcoming matches scheduled</p>
                    <p className="text-sm">Check back later for new fixtures</p>
                  </div>
                ) : (
                  upcomingMatches.map((match: Match) => (
                    <div key={match.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-white/60 text-sm">Date</p>
                            <p className="text-white font-medium">{formatDate(match.dateAndtime)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/60 text-sm">Time</p>
                            <p className="text-white font-medium">{formatTime(match.dateAndtime)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/60 text-sm">Venue</p>
                            <p className="text-white font-medium">{match.location || "TBD"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-white/60" />
                            <span className="text-white/80 text-sm">{match.location || "Venue TBD"}</span>
                          </div>
                          {getMatchStatusBadge(match)}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-6">
                        <div className="text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                            isHomeMatch(match) 
                              ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20' 
                              : 'bg-gradient-to-br from-red-500/20 to-red-600/20'
                          }`}>
                            <span className="text-white font-bold text-lg">
                              {isHomeMatch(match) ? 'HOME' : 'AWAY'}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm">Your Team</p>
                        </div>
                        <div className="text-center">
                          <div className="text-white/60 text-2xl font-bold">VS</div>
                          <p className="text-white/60 text-xs">Match</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-lg">{getOpponentName(match)}</span>
                          </div>
                          <p className="text-white/80 text-sm">Opponent</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="results" className="mt-6">
              <div className="space-y-4">
                {completedMatches.length === 0 ? (
                  <div className="text-center text-white/70 py-8">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-white/40" />
                    <p className="text-lg">No completed matches yet</p>
                    <p className="text-sm">Results will appear here after matches are played</p>
                  </div>
                ) : (
                  completedMatches.map((match: Match) => (
                    <div key={match.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-white/60 text-sm">Date</p>
                            <p className="text-white font-medium">{formatDate(match.dateAndtime)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/60 text-sm">Venue</p>
                            <p className="text-white font-medium">{match.location || "TBD"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-white/60" />
                            <span className="text-white/80 text-sm">{match.location || "Venue TBD"}</span>
                          </div>
                          {getMatchStatusBadge(match)}
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                            isHomeMatch(match) 
                              ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20' 
                              : 'bg-gradient-to-br from-red-500/20 to-red-600/20'
                          }`}>
                            <span className="text-white font-bold text-lg">
                              {isHomeMatch(match) ? 'HOME' : 'AWAY'}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm">Your Team</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white">
                            {/* Display actual match scores */}
                            <div className="text-lg text-white/60">Score</div>
                            <div className="text-sm text-white/40">
                              {isHomeMatch(match) ? (
                                <>
                                  <span className="text-blue-300">{match.team1Goals || 0}</span>
                                  <span className="text-white/60 mx-1">-</span>
                                  <span className="text-red-300">{match.team2Goals || 0}</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-red-300">{match.team2Goals || 0}</span>
                                  <span className="text-white/60 mx-1">-</span>
                                  <span className="text-blue-300">{match.team1Goals || 0}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <p className="text-white/60 text-xs">Final Result</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-lg">{getOpponentName(match)}</span>
                          </div>
                          <p className="text-white/80 text-sm">Opponent</p>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-medium">Match completed</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 