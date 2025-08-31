"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Trophy, AlertCircle, CheckCircle } from "lucide-react"

interface Match {
  id: string
  date: string
  time: string
  team1: string
  team2: string
  team1_score?: number
  team2_score?: number
  venue: string
  status: 'scheduled' | 'completed' | 'cancelled'
  group: string
}

interface MatchesTabProps {
  upcomingMatches: Match[]
  completedMatches: Match[]
}

export function MatchesTab({ upcomingMatches, completedMatches }: MatchesTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getMatchStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Scheduled</Badge>
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Calendar className="h-5 w-5" />
            Match Schedule & Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border-white/20">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 text-white">
                Upcoming Matches
              </TabsTrigger>
              <TabsTrigger value="results" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 text-white">
                Match Results
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
                  upcomingMatches.map((match) => (
                    <div key={match.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-white/60 text-sm">Date</p>
                            <p className="text-white font-medium">{formatDate(match.date)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/60 text-sm">Time</p>
                            <p className="text-white font-medium">{formatTime(match.time)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/60 text-sm">Group</p>
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              {match.group}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-white/60" />
                            <span className="text-white/80 text-sm">{match.venue}</span>
                          </div>
                          {getMatchStatusBadge(match.status)}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-lg">{match.team1}</span>
                          </div>
                          <p className="text-white/80 text-sm">Home Team</p>
                        </div>
                        <div className="text-center">
                          <div className="text-white/60 text-2xl font-bold">VS</div>
                          <p className="text-white/60 text-xs">Match</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-lg">{match.team2}</span>
                          </div>
                          <p className="text-white/80 text-sm">Away Team</p>
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
                  completedMatches.map((match) => (
                    <div key={match.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-white/60 text-sm">Date</p>
                            <p className="text-white font-medium">{formatDate(match.date)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/60 text-sm">Group</p>
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              {match.group}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-white/60" />
                            <span className="text-white/80 text-sm">{match.venue}</span>
                          </div>
                          {getMatchStatusBadge(match.status)}
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-lg">{match.team1}</span>
                          </div>
                          <p className="text-white/80 text-sm">Home Team</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white">
                            {match.team1_score} - {match.team2_score}
                          </div>
                          <p className="text-white/60 text-xs">Final Score</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-lg">{match.team2}</span>
                          </div>
                          <p className="text-white/80 text-sm">Away Team</p>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        {match.team1_score && match.team2_score && (
                          <div className="inline-flex items-center gap-2">
                            {match.team1_score > match.team2_score ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 font-medium">{match.team1} won</span>
                              </>
                            ) : match.team1_score < match.team2_score ? (
                              <>
                                <AlertCircle className="w-4 h-4 text-red-400" />
                                <span className="text-red-400 font-medium">{match.team2} won</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-400 font-medium">Draw</span>
                              </>
                            )}
                          </div>
                        )}
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