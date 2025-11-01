"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Target,
  Trophy,
  Users,
  Calendar,
  MapPin,
  ArrowLeft,
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
} from "lucide-react"
import { useQuery, useMutation } from "@apollo/client"
import { GET_MATCH_SCHEDULES, GET_TEAM_PLAYER_STATISTICS, GET_TEAM_STATISTICS, GET_ALL_PLAYERS_WHERE_TEAM_ID } from "@/lib/graphql/queries"
import { UPDATE_PLAYER_STATS, UPDATE_TEAM_STATISTICS, UPDATE_MATCH_RESULT, CREATE_TEAM_STATISTICS, CREATE_PLAYER_STATISTICS } from "@/lib/graphql/mutations"
import Link from "next/link"

export default function UpcomingGamesPage() {
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [team1Goals, setTeam1Goals] = useState<number>(0)
  const [team2Goals, setTeam2Goals] = useState<number>(0)
  const [matchNotes, setMatchNotes] = useState<string>("")
  const [playerStats, setPlayerStats] = useState<any>({})

  // Fetch matches data
  const { data: matchesData, loading: matchesLoading, error: matchesError, refetch: refetchMatches } = useQuery(GET_MATCH_SCHEDULES)
  
  // Fetch player statistics
  const { data: playerStatsData, loading: playerStatsLoading, error: playerStatsError, refetch: refetchPlayerStats } = useQuery(GET_TEAM_PLAYER_STATISTICS)
  
  // Fetch team statistics
  const { data: teamStatsData, loading: teamStatsLoading, error: teamStatsError } = useQuery(GET_TEAM_STATISTICS)

  // Fetch players for team 1
  const { data: team1PlayersData, loading: team1PlayersLoading } = useQuery(GET_ALL_PLAYERS_WHERE_TEAM_ID, {
    variables: { teamId: selectedMatch?.team1 || "" },
    skip: !selectedMatch?.team1
  })

  // Fetch players for team 2
  const { data: team2PlayersData, loading: team2PlayersLoading } = useQuery(GET_ALL_PLAYERS_WHERE_TEAM_ID, {
    variables: { teamId: selectedMatch?.team2 || "" },
    skip: !selectedMatch?.team2
  })

  // Mutations
  const [updatePlayerStats] = useMutation(UPDATE_PLAYER_STATS)
  const [createPlayerStatistics] = useMutation(CREATE_PLAYER_STATISTICS)
  const [updateTeamStatistics] = useMutation(UPDATE_TEAM_STATISTICS)
  const [updateMatchResult] = useMutation(UPDATE_MATCH_RESULT)
  const [createTeamStatistics] = useMutation(CREATE_TEAM_STATISTICS)

  // Filter matches based on status
  const upcomingMatches = matchesData?.matches?.filter((match: any) => {
    // Show as upcoming if status is "pending" or null/undefined
    return !match.status || match.status === "pending" || match.status !== "completed"
  }) || []

  const completedMatches = matchesData?.matches?.filter((match: any) => {
    // Show as completed if status is "completed"
    return match.status === "completed"
  }) || []

  const handleMatchSelect = (match: any) => {
    setSelectedMatch(match)
    setTeam1Goals(match.team1Goals || 0)
    setTeam2Goals(match.team2Goals || 0)
    setMatchNotes("")
    
    // Load existing player statistics for this match if available
    const existingPlayerStats: any = {}
    if (playerStatsData?.player_statistics && match.id) {
      playerStatsData.player_statistics
        .filter((stat: any) => stat.match_id === match.id)
        .forEach((stat: any) => {
          existingPlayerStats[stat.player_id] = {
            goals: stat.goals || "0",
            assists: stat.assists || "0",
            minutes_played: stat.minutes_played || "0",
            yellow_cards: stat.yellow_cards || "0",
            red_cards: stat.red_cards || "0"
          }
        })
    }
    setPlayerStats(existingPlayerStats)
  }

  // Update player stats when playerStatsData or selectedMatch changes
  useEffect(() => {
    if (selectedMatch?.id && playerStatsData?.player_statistics) {
      const existingPlayerStats: any = {}
      playerStatsData.player_statistics
        .filter((stat: any) => stat.match_id === selectedMatch.id)
        .forEach((stat: any) => {
          existingPlayerStats[stat.player_id] = {
            goals: stat.goals || "0",
            assists: stat.assists || "0",
            minutes_played: stat.minutes_played || "0",
            yellow_cards: stat.yellow_cards || "0",
            red_cards: stat.red_cards || "0"
          }
        })
      // Only update if we found stats (don't overwrite user input if they're currently editing)
      if (Object.keys(existingPlayerStats).length > 0) {
        // Merge with existing playerStats to preserve any unsaved user input
        setPlayerStats((prev: any) => {
          const merged = { ...prev }
          Object.keys(existingPlayerStats).forEach((playerId) => {
            // Only update if this player doesn't have unsaved changes
            // or if we're viewing a completed match (where we want to show saved stats)
            if (!prev[playerId] || selectedMatch.status === "completed") {
              merged[playerId] = existingPlayerStats[playerId]
            }
          })
          return merged
        })
      }
    }
  }, [playerStatsData, selectedMatch?.id, selectedMatch?.status])

  const handlePlayerStatChange = (playerId: string, field: string, value: string) => {
    setPlayerStats((prev: any) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value
      }
    }))
  }

  // Check if team statistics exist for a team
  const teamStatisticsExist = (teamId: string) => {
    return teamStatsData?.team_statistics?.some((stat: any) => stat.team_id === teamId)
  }

  // Get existing team statistics for a team
  const getExistingTeamStats = (teamId: string) => {
    return teamStatsData?.team_statistics?.find((stat: any) => stat.team_id === teamId) || {
      played: "0",
      wins: "0",
      draws: "0",
      losses: "0",
      goals_for: "0",
      goals_against: "0",
      goal_diff: "0",
      points: "0"
    }
  }

  // Calculate match result and points
  const calculateMatchResult = (team1Goals: number, team2Goals: number) => {
    if (team1Goals > team2Goals) {
      return { team1Result: 'Win', team2Result: 'Loss', team1Points: 3, team2Points: 0 }
    } else if (team1Goals < team2Goals) {
      return { team1Result: 'Loss', team2Result: 'Win', team1Points: 0, team2Points: 3 }
    } else {
      return { team1Result: 'Draw', team2Result: 'Draw', team1Points: 1, team2Points: 1 }
    }
  }

  // Get players for a specific team (team1 or team2)
  const getTeamPlayerStats = (teamId: string) => {
    // Get players from the appropriate team query
    let players: any[] = []
    
    if (teamId === selectedMatch?.team1 && team1PlayersData?.players) {
      players = team1PlayersData.players
    } else if (teamId === selectedMatch?.team2 && team2PlayersData?.players) {
      players = team2PlayersData.players
    }
    
    // Map players and merge with any existing statistics
    return players.map((player: any) => {
      // Find existing statistics for this player if any
      const existingStats = playerStatsData?.player_statistics?.find((stat: any) => 
        stat.player_id === player.id && stat.match_id === selectedMatch?.id
      )
      
      // Get default position if not in player data (you might need to add position field)
      return {
        id: player.id,
        name: player.name || player.player_name || "Unknown Player",
        position: player.position || "N/A",
        goals: existingStats?.goals || playerStats[player.id]?.goals || 0,
        assists: existingStats?.assists || playerStats[player.id]?.assists || 0,
        minutes_played: existingStats?.minutes_played || playerStats[player.id]?.minutes_played || 0,
        yellow_cards: existingStats?.yellow_cards || playerStats[player.id]?.yellow_cards || 0,
        red_cards: existingStats?.red_cards || playerStats[player.id]?.red_cards || 0,
        rating: 0 // Default rating
      }
    })
  }

  const handleSaveMatchData = async () => {
    try {
      const matchResult = calculateMatchResult(team1Goals, team2Goals)
      
      console.log("Match Result Calculation:", {
        team1Goals,
        team2Goals,
        team1Result: matchResult.team1Result,
        team2Result: matchResult.team2Result,
        team1Points: matchResult.team1Points,
        team2Points: matchResult.team2Points
      })
      
      // Update match result with status "completed"
      await updateMatchResult({
        variables: {
          matchId: selectedMatch.id,
          status: "completed",
          team1Goals: team1Goals.toString(),
          team2Goals: team2Goals.toString()
        }
      })

      // Update player statistics - create if doesn't exist, update and accumulate if exists
      for (const [playerId, enteredStats] of Object.entries(playerStats)) {
        const statsData = enteredStats as any
        
        // Get new values entered by user
        const newGoals = parseInt(statsData.goals || "0")
        const newAssists = parseInt(statsData.assists || "0")
        const newYellowCards = parseInt(statsData.yellow_cards || "0")
        const newRedCards = parseInt(statsData.red_cards || "0")
        const newMinutes = parseInt(statsData.minutes_played || "0")
        
        // Check if player statistics already exist for this player and match from the query
        const existingStats = playerStatsData?.player_statistics?.find((stat: any) => 
          stat.player_id === playerId && stat.match_id === selectedMatch.id
        )
        
        if (existingStats) {
          // If statistics exist, add new values to existing values (accumulate)
          const accumulatedGoals = (parseInt(existingStats.goals || "0") + newGoals).toString()
          const accumulatedAssists = (parseInt(existingStats.assists || "0") + newAssists).toString()
          const accumulatedYellowCards = (parseInt(existingStats.yellow_cards || "0") + newYellowCards).toString()
          const accumulatedRedCards = (parseInt(existingStats.red_cards || "0") + newRedCards).toString()
          const accumulatedMinutes = (parseInt(existingStats.minutes_played || "0") + newMinutes).toString()
          
          // Update existing record with accumulated values
          await updatePlayerStats({
            variables: {
              player_id: playerId,
              match_id: selectedMatch.id,
              goals: accumulatedGoals,
              assists: accumulatedAssists,
              yellow_cards: accumulatedYellowCards,
              red_cards: accumulatedRedCards,
              minutes_played: accumulatedMinutes
            }
          })
        } else {
          // If statistics don't exist, create new record with entered values
          await createPlayerStatistics({
            variables: {
              player_id: playerId,
              match_id: selectedMatch.id,
              season_id: selectedMatch.season_id,
              goals: newGoals.toString(),
              assists: newAssists.toString(),
              yellow_cards: newYellowCards.toString(),
              red_cards: newRedCards.toString(),
              minutes_played: newMinutes.toString()
            }
          })
        }
      }

      // Get existing team statistics and calculate new accumulated stats
      const existingTeam1Stats = getExistingTeamStats(selectedMatch.team1)
      const existingTeam2Stats = getExistingTeamStats(selectedMatch.team2)

      // Calculate accumulated team statistics for Team 1
      const team1Stats = {
        wins: (parseInt(existingTeam1Stats.wins) + (matchResult.team1Result === 'Win' ? 1 : 0)).toString(),
        draws: (parseInt(existingTeam1Stats.draws) + (matchResult.team1Result === 'Draw' ? 1 : 0)).toString(),
        losses: (parseInt(existingTeam1Stats.losses) + (matchResult.team1Result === 'Loss' ? 1 : 0)).toString(),
        goals_for: (parseInt(existingTeam1Stats.goals_for) + team1Goals).toString(),        // Add to existing goals scored
        goals_against: (parseInt(existingTeam1Stats.goals_against) + team2Goals).toString(), // Add to existing goals conceded
        goal_diff: (parseInt(existingTeam1Stats.goals_for) + team1Goals - (parseInt(existingTeam1Stats.goals_against) + team2Goals)).toString(), // Recalculate total goal difference
        points: (parseInt(existingTeam1Stats.points) + matchResult.team1Points).toString(), // Add to existing points
        played: (parseInt(existingTeam1Stats.played) + 1).toString()                        // Add 1 to games played
      }

      // Calculate accumulated team statistics for Team 2
      const team2Stats = {
        wins: (parseInt(existingTeam2Stats.wins) + (matchResult.team2Result === 'Win' ? 1 : 0)).toString(),
        draws: (parseInt(existingTeam2Stats.draws) + (matchResult.team2Result === 'Draw' ? 1 : 0)).toString(),
        losses: (parseInt(existingTeam2Stats.losses) + (matchResult.team2Result === 'Loss' ? 1 : 0)).toString(),
        goals_for: (parseInt(existingTeam2Stats.goals_for) + team2Goals).toString(),        // Add to existing goals scored
        goals_against: (parseInt(existingTeam2Stats.goals_against) + team1Goals).toString(), // Add to existing goals conceded
        goal_diff: (parseInt(existingTeam2Stats.goals_for) + team2Goals - (parseInt(existingTeam2Stats.goals_against) + team1Goals)).toString(), // Recalculate total goal difference
        points: (parseInt(existingTeam2Stats.points) + matchResult.team2Points).toString(), // Add to existing points
        played: (parseInt(existingTeam2Stats.played) + 1).toString()                        // Add 1 to games played
      }

      console.log("Team 1 - Existing:", existingTeam1Stats, "New Match:", {
        wins: matchResult.team1Result === 'Win' ? 1 : 0,
        draws: matchResult.team1Result === 'Draw' ? 1 : 0,
        losses: matchResult.team1Result === 'Loss' ? 1 : 0,
        goals_for: team1Goals,
        goals_against: team2Goals,
        points: matchResult.team1Points
      }, "Accumulated:", team1Stats)
      
      console.log("Team 1 Points Breakdown:", {
        existingPoints: existingTeam1Stats.points,
        newPoints: matchResult.team1Points,
        totalPoints: (parseInt(existingTeam1Stats.points) + matchResult.team1Points).toString(),
        calculation: `${existingTeam1Stats.points} + ${matchResult.team1Points} = ${parseInt(existingTeam1Stats.points) + matchResult.team1Points}`
      })

      console.log("Team 2 - Existing:", existingTeam2Stats, "New Match:", {
        wins: matchResult.team2Result === 'Win' ? 1 : 0,
        draws: matchResult.team2Result === 'Draw' ? 1 : 0,
        losses: matchResult.team2Result === 'Loss' ? 1 : 0,
        goals_for: team2Goals,
        goals_against: team1Goals,
        points: matchResult.team2Points
      }, "Accumulated:", team2Stats)
      
      console.log("Team 2 Points Breakdown:", {
        existingPoints: existingTeam2Stats.points,
        newPoints: matchResult.team2Points,
        totalPoints: (parseInt(existingTeam2Stats.points) + matchResult.team2Points).toString(),
        calculation: `${existingTeam2Stats.points} + ${matchResult.team2Points} = ${parseInt(existingTeam2Stats.points) + matchResult.team2Points}`
      })

      // Update Team 1 statistics
      console.log("Updating Team 1 stats:", {
        teamid: selectedMatch.team1,
        stats: team1Stats,
        exists: teamStatisticsExist(selectedMatch.team1)
      })
      
      if (teamStatisticsExist(selectedMatch.team1)) {
        // Update existing record
        try {
          await updateTeamStatistics({
            variables: {
              teamid: selectedMatch.team1,
              ...team1Stats
            }
          })
          console.log("Team 1 statistics updated successfully")
        } catch (error) {
          console.error("Error updating Team 1 statistics:", error)
        }
      } else {
        // Create new record with accumulated stats
        try {
          await createTeamStatistics({
            variables: {
              team_id: selectedMatch.team1,
              group_id: selectedMatch.group_id || null,
              season_id: selectedMatch.season_id,
              ...team1Stats
            }
          })
          console.log("Created new Team 1 statistics record with accumulated stats:", team1Stats)
        } catch (createError) {
          console.error("Error creating Team 1 statistics:", createError)
        }
      }

      // Update Team 2 statistics  
      console.log("Updating Team 2 stats:", {
        teamid: selectedMatch.team2,
        stats: team2Stats,
        exists: teamStatisticsExist(selectedMatch.team2)
      })
      
      if (teamStatisticsExist(selectedMatch.team2)) {
        // Update existing record
        try {
          await updateTeamStatistics({
            variables: {
              teamid: selectedMatch.team2,
              ...team2Stats
            }
          })
          console.log("Team 2 statistics updated successfully")
        } catch (error) {
          console.error("Error updating Team 2 statistics:", error)
        }
      } else {
        // Create new record with accumulated stats
        try {
          await createTeamStatistics({
            variables: {
              team_id: selectedMatch.team2,
              group_id: selectedMatch.group_id || null,
              season_id: selectedMatch.season_id,
              ...team2Stats
            }
          })
          console.log("Created new Team 2 statistics record with accumulated stats:", team2Stats)
        } catch (createError) {
          console.error("Error creating Team 2 statistics:", createError)
        }
      }

      console.log("Match data saved successfully:", {
        match: selectedMatch,
        team1Goals,
        team2Goals,
        matchResult,
        team1Stats,
        team2Stats,
        playerStats,
        notes: matchNotes
      })

      // Reset form
      setTeam1Goals(0)
      setTeam2Goals(0)
      setMatchNotes("")
      setPlayerStats({})
      setSelectedMatch(null)

      // Refresh the matches data to show updated status
      await refetchMatches()
      
      // Refresh player statistics to show updated data
      await refetchPlayerStats()

    } catch (error) {
      console.error("Error saving match data:", error)
    }
  }

  if (matchesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
            <p className="text-white/70">Loading upcoming games...</p>
          </div>
        </div>
      </div>
    )
  }

  if (matchesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Error Loading Matches</h3>
            <p className="text-white/70">Failed to load matches data. Please try again.</p>
            <p className="text-red-400 text-sm mt-2">{matchesError.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      {/* Header */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600/90 to-green-700/90 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-2xl">Upcoming Games</h1>
                <p className="text-sm text-white/90 drop-shadow-xl">Manage and track game data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Match List */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                  <Calendar className="h-5 w-5" />
                  Match Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-xl border-white/20">
                    <TabsTrigger 
                      value="upcoming" 
                      className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
                    >
                      Upcoming ({upcomingMatches.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="completed" 
                      className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
                    >
                      Completed ({completedMatches.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="space-y-4">
                    {upcomingMatches.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-white/50 mx-auto mb-4" />
                        <p className="text-white/70">No upcoming matches scheduled</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {upcomingMatches.map((match: any) => (
                          <Card 
                            key={match.id} 
                            className={`bg-white/5 backdrop-blur-md border-white/10 cursor-pointer transition-all duration-200 hover:bg-white/10 ${
                              selectedMatch?.id === match.id ? 'ring-2 ring-green-500/50 bg-white/15' : ''
                            }`}
                            onClick={() => handleMatchSelect(match)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-300">
                                      {new Date(match.dateAndtime).toLocaleDateString()}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-300">
                                      {new Date(match.dateAndtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Badge>
                                  </div>
                                  <h4 className="font-medium text-white mb-1">
                                    {match.Team1?.name || 'Team 1'} vs {match.Team2?.name || 'Team 2'}
                                  </h4>
                                  <p className="text-sm text-white/70">{match.location}</p>
                                </div>
                                                                 <div className="text-right">
                                   <Badge className={`${
                                     match.status === "completed" 
                                       ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                       : match.status === "pending"
                                       ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                       : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                   }`}>
                                     {match.status === "completed" ? 'Completed' : 
                                      match.status === "pending" ? 'Pending' : 'Scheduled'}
                                   </Badge>
                                 </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4">
                    {completedMatches.length === 0 ? (
                      <div className="text-center py-8">
                        <Trophy className="h-12 w-12 text-white/50 mx-auto mb-4" />
                        <p className="text-white/70">No completed matches found</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {completedMatches.map((match: any) => (
                          <Card 
                            key={match.id} 
                            className={`bg-white/5 backdrop-blur-md border-white/10 cursor-pointer transition-all duration-200 hover:bg-white/10 ${
                              selectedMatch?.id === match.id ? 'ring-2 ring-green-500/50 bg-white/15' : ''
                            }`}
                            onClick={() => handleMatchSelect(match)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-300">
                                      {new Date(match.dateAndtime).toLocaleDateString()}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-300">
                                      {new Date(match.dateAndtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Badge>
                                  </div>
                                  <h4 className="font-medium text-white mb-1">
                                    {match.Team1?.name || 'Team 1'} vs {match.Team2?.name || 'Team 2'}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-white/70">{match.location}</span>
                                    {match.team1Goals !== null && match.team2Goals !== null && (
                                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                        {match.team1Goals} - {match.team2Goals}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                                                 <div className="text-right">
                                   <Badge className={`${
                                     match.status === "completed" 
                                       ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                       : match.status === "pending"
                                       ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                       : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                   }`}>
                                     {match.status === "completed" ? 'Completed' : 
                                      match.status === "pending" ? 'Pending' : 'Scheduled'}
                                   </Badge>
                                 </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Match Details & Data Entry */}
          <div className="space-y-6">
            {selectedMatch ? (
              <>
                {/* Match Details */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                      <Eye className="h-5 w-5" />
                      Match Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white/80 text-sm">Date & Time</Label>
                        <p className="text-white font-medium">
                          {new Date(selectedMatch.dateAndtime).toLocaleDateString()} at {new Date(selectedMatch.dateAndtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div>
                        <Label className="text-white/80 text-sm">Location</Label>
                        <p className="text-white font-medium">{selectedMatch.location}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/80 text-sm">Teams</Label>
                      <p className="text-white font-medium">
                        {selectedMatch.Team1?.name || 'Team 1'} vs {selectedMatch.Team2?.name || 'Team 2'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-white/80 text-sm">Season ID</Label>
                      <p className="text-white font-medium">{selectedMatch.season_id}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Score Entry & Match Result */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                      <Target className="h-5 w-5" />
                      Score Entry & Match Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="team1Goals" className="text-white/80 text-sm">
                          {selectedMatch.Team1?.name || 'Team 1'} Goals
                        </Label>
                        <Input
                          id="team1Goals"
                          type="number"
                          min="0"
                          value={team1Goals}
                          onChange={(e) => setTeam1Goals(parseInt(e.target.value) || 0)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="team2Goals" className="text-white/80 text-sm">
                          {selectedMatch.Team2?.name || 'Team 2'} Goals
                        </Label>
                        <Input
                          id="team2Goals"
                          type="number"
                          min="0"
                          value={team2Goals}
                          onChange={(e) => setTeam2Goals(parseInt(e.target.value) || 0)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    {/* Match Result Display */}
                    {team1Goals > 0 || team2Goals > 0 ? (
                      <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-white font-semibold mb-3">Match Result</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-white/70 text-sm">{selectedMatch.Team1?.name || 'Team 1'}</p>
                            <p className="text-white font-bold text-lg">{team1Goals}</p>
                            <Badge className={`mt-1 ${
                              team1Goals > team2Goals 
                                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                                : team1Goals < team2Goals 
                                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            }`}>
                              {team1Goals > team2Goals ? 'Win' : team1Goals < team2Goals ? 'Loss' : 'Draw'}
                            </Badge>
                            <p className="text-white/70 text-sm mt-1">
                              {team1Goals > team2Goals ? '3' : team1Goals < team2Goals ? '0' : '1'} points
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/70 text-sm">{selectedMatch.Team2?.name || 'Team 2'}</p>
                            <p className="text-white font-bold text-lg">{team2Goals}</p>
                            <Badge className={`mt-1 ${
                              team2Goals > team1Goals 
                                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                                : team2Goals < team1Goals 
                                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            }`}>
                              {team2Goals > team1Goals ? 'Win' : team2Goals < team1Goals ? 'Loss' : 'Draw'}
                            </Badge>
                            <p className="text-white/70 text-sm mt-1">
                              {team2Goals > team1Goals ? '3' : team2Goals < team1Goals ? '0' : '1'} points
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>

                {/* Player Statistics */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                      <Users className="h-5 w-5" />
                      Player Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="team1" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-xl border-white/20">
                        <TabsTrigger 
                          value="team1" 
                          className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
                        >
                          {selectedMatch.Team1?.name || 'Team 1'}
                        </TabsTrigger>
                        <TabsTrigger 
                          value="team2" 
                          className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
                        >
                          {selectedMatch.Team2?.name || 'Team 2'}
                        </TabsTrigger>
                      </TabsList>

                                             <TabsContent value="team1" className="space-y-3">
                         {team1PlayersLoading ? (
                           <div className="text-center py-4">
                             <Loader2 className="h-6 w-6 animate-spin text-white mx-auto mb-2" />
                             <p className="text-white/70 text-sm">Loading players...</p>
                           </div>
                         ) : getTeamPlayerStats(selectedMatch.team1).length === 0 ? (
                           <div className="text-center py-4">
                             <Users className="h-6 w-6 text-white/50 mx-auto mb-2" />
                             <p className="text-white/70 text-sm">No players found for this team</p>
                           </div>
                         ) : (
                           <div className="space-y-2 max-h-48 overflow-y-auto">
                             {getTeamPlayerStats(selectedMatch.team1).map((player: any) => (
                               <div key={player.id} className="p-3 bg-white/5 rounded-lg">
                                 <div className="flex items-center justify-between mb-2">
                                   <div>
                                     <p className="text-white font-medium">{player.name}</p>
                                     <p className="text-white/70 text-sm">{player.position}</p>
                                   </div>
                                   <div className="text-right">
                                     <span className="text-white/70 text-sm">Rating: {player.rating.toFixed(1)}</span>
                                   </div>
                                 </div>
                                 <div className="grid grid-cols-5 gap-2">
                                   <div>
                                     <Label className="text-white/70 text-xs">Goals</Label>
                                     <Input
                                       type="number"
                                       min="0"
                                       value={playerStats[player.id]?.goals || player.goals || 0}
                                       onChange={(e) => handlePlayerStatChange(player.id, 'goals', e.target.value)}
                                       className="bg-white/10 border-white/20 text-white text-xs h-8"
                                     />
                                   </div>
                                   <div>
                                     <Label className="text-white/70 text-xs">Assists</Label>
                                     <Input
                                       type="number"
                                       min="0"
                                       value={playerStats[player.id]?.assists || player.assists || 0}
                                       onChange={(e) => handlePlayerStatChange(player.id, 'assists', e.target.value)}
                                       className="bg-white/10 border-white/20 text-white text-xs h-8"
                                     />
                                   </div>
                                   <div>
                                     <Label className="text-white/70 text-xs">Yellow</Label>
                                     <Input
                                       type="number"
                                       min="0"
                                       value={playerStats[player.id]?.yellow_cards || 0}
                                       onChange={(e) => handlePlayerStatChange(player.id, 'yellow_cards', e.target.value)}
                                       className="bg-white/10 border-white/20 text-white text-xs h-8"
                                     />
                                   </div>
                                   <div>
                                     <Label className="text-white/70 text-xs">Red</Label>
                                     <Input
                                       type="number"
                                       min="0"
                                       value={playerStats[player.id]?.red_cards || 0}
                                       onChange={(e) => handlePlayerStatChange(player.id, 'red_cards', e.target.value)}
                                       className="bg-white/10 border-white/20 text-white text-xs h-8"
                                     />
                                   </div>
                                   <div>
                                     <Label className="text-white/70 text-xs">Minutes</Label>
                                     <Input
                                       type="number"
                                       min="0"
                                       value={playerStats[player.id]?.minutes_played || player.minutes_played || 0}
                                       onChange={(e) => handlePlayerStatChange(player.id, 'minutes_played', e.target.value)}
                                       className="bg-white/10 border-white/20 text-white text-xs h-8"
                                     />
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                         )}
                       </TabsContent>

                                             <TabsContent value="team2" className="space-y-3">
                         {team2PlayersLoading ? (
                           <div className="text-center py-4">
                             <Loader2 className="h-6 w-6 animate-spin text-white mx-auto mb-2" />
                             <p className="text-white/70 text-sm">Loading players...</p>
                           </div>
                         ) : getTeamPlayerStats(selectedMatch.team2).length === 0 ? (
                           <div className="text-center py-4">
                             <Users className="h-6 w-6 text-white/50 mx-auto mb-2" />
                             <p className="text-white/70 text-sm">No players found for this team</p>
                           </div>
                         ) : (
                           <div className="space-y-2 max-h-48 overflow-y-auto">
                             {getTeamPlayerStats(selectedMatch.team2).map((player: any) => (
                               <div key={player.id} className="p-3 bg-white/5 rounded-lg">
                                 <div className="flex items-center justify-between mb-2">
                                   <div>
                                     <p className="text-white font-medium">{player.name}</p>
                                     <p className="text-white/70 text-sm">{player.position}</p>
                                   </div>
                                   <div className="text-right">
                                     <span className="text-white/70 text-sm">Rating: {player.rating.toFixed(1)}</span>
                                   </div>
                                 </div>
                                 <div className="grid grid-cols-5 gap-2">
                                   <div>
                                     <Label className="text-white/70 text-xs">Goals</Label>
                                     <Input
                                       type="number"
                                       min="0"
                                       value={playerStats[player.id]?.goals || player.goals || 0}
                                       onChange={(e) => handlePlayerStatChange(player.id, 'goals', e.target.value)}
                                       className="bg-white/10 border-white/20 text-white text-xs h-8"
                                     />
                                   </div>
                                   <div>
                                     <Label className="text-white/70 text-xs">Assists</Label>
                                     <Input
                                       type="number"
                                       min="0"
                                       value={playerStats[player.id]?.assists || player.assists || 0}
                                       onChange={(e) => handlePlayerStatChange(player.id, 'assists', e.target.value)}
                                       className="bg-white/10 border-white/20 text-white text-xs h-8"
                                     />
                                   </div>
                                   <div>
                                     <Label className="text-white/70 text-xs">Yellow</Label>
                                     <Input
                                       type="number"
                                       min="0"
                                       value={playerStats[player.id]?.yellow_cards || 0}
                                       onChange={(e) => handlePlayerStatChange(player.id, 'yellow_cards', e.target.value)}
                                       className="bg-white/10 border-white/20 text-white text-xs h-8"
                                     />
                                   </div>
                                   <div>
                                     <Label className="text-white/70 text-xs">Red</Label>
                                     <Input
                                       type="number"
                                       min="0"
                                       value={playerStats[player.id]?.red_cards || 0}
                                       onChange={(e) => handlePlayerStatChange(player.id, 'red_cards', e.target.value)}
                                       className="bg-white/10 border-white/20 text-white text-xs h-8"
                                     />
                                   </div>
                                   <div>
                                     <Label className="text-white/70 text-xs">Minutes</Label>
                                     <Input
                                       type="number"
                                       min="0"
                                       value={playerStats[player.id]?.minutes_played || player.minutes_played || 0}
                                       onChange={(e) => handlePlayerStatChange(player.id, 'minutes_played', e.target.value)}
                                       className="bg-white/10 border-white/20 text-white text-xs h-8"
                                     />
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                         )}
                       </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Match Statistics */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                      <TrendingUp className="h-5 w-5" />
                      Match Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <p className="text-white/70 text-sm">Total Goals</p>
                        <p className="text-white font-bold text-2xl">{team1Goals + team2Goals}</p>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <p className="text-white/70 text-sm">Goal Difference</p>
                        <p className="text-white font-bold text-2xl">{Math.abs(team1Goals - team2Goals)}</p>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <p className="text-white/70 text-sm">Match Status</p>
                        <Badge className={`mt-1 ${
                          team1Goals > 0 || team2Goals > 0 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        }`}>
                          {team1Goals > 0 || team2Goals > 0 ? 'Completed' : 'Scheduled'}
                        </Badge>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <p className="text-white/70 text-sm">Result Type</p>
                        <p className="text-white font-bold text-lg">
                          {team1Goals === team2Goals && team1Goals > 0 ? 'Draw' : 
                           team1Goals > team2Goals ? 'Home Win' : 
                           team2Goals > team1Goals ? 'Away Win' : 'TBD'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Match Notes */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                      <Edit className="h-5 w-5" />
                      Match Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={matchNotes}
                      onChange={(e) => setMatchNotes(e.target.value)}
                      placeholder="Add match notes, highlights, or observations..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                    />
                  </CardContent>
                </Card>

                {/* Save Button */}
                <Button 
                  onClick={handleSaveMatchData}
                  className="w-full bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Match Data
                </Button>
              </>
            ) : (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <Target className="h-16 w-16 text-white/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Select a Match</h3>
                  <p className="text-white/70">
                    Choose a match from the list to view details and enter data
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
