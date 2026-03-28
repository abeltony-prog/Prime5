'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Target, Award, TrendingUp, Users, Trophy, TrendingDown, Calendar, Clock, MapPin, Loader2, XCircle, Shield } from "lucide-react"
import { useState } from "react"
import { useQuery } from '@apollo/client'
import { GET_TEAMS, GET_MATCH_SCHEDULES, GET_TEAM_STATISTICS, GET_TEAM_PLAYER_STATISTICS, GET_SEASONS } from "@/lib/graphql/queries"
import { Bracket } from "@/components/bracket"



export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'statistics' | 'standings' | 'fixtures' | 'bracket'>('leaderboard')
  const [selectedFixtureTab, setSelectedFixtureTab] = useState("upcoming")
  const [selectedGroup, setSelectedGroup] = useState("all")

  // Fetch real data from database
  const { data: seasonsData, loading: seasonsLoading, error: seasonsError } = useQuery(GET_SEASONS)
  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery(GET_TEAMS)
  const { data: matchesData, loading: matchesLoading, error: matchesError } = useQuery(GET_MATCH_SCHEDULES)
  const { data: teamStatsData, loading: teamStatsLoading, error: teamStatsError } = useQuery(GET_TEAM_STATISTICS)
  const { data: playerStatsData, loading: playerStatsLoading, error: playerStatsError } = useQuery(GET_TEAM_PLAYER_STATISTICS)

  // Loading state
  if (seasonsLoading || teamsLoading || matchesLoading || teamStatsLoading || playerStatsLoading) {
    return (
      <div className="min-h-screen relative">
        <Navigation />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-white/60 animate-spin mx-auto mb-4" />
              <p className="text-white/60 text-lg">Loading statistics data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (seasonsError || teamsError || matchesError || teamStatsError || playerStatsError) {
    return (
      <div className="min-h-screen relative">
        <Navigation />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-white/60 text-lg">Error loading statistics data</p>
              <p className="text-white/40 text-sm">Please try again later</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate real data from database
  const calculateLeagueStats = () => {
    const teams = teamsData?.Teams || []
    const matches = matchesData?.matches || []
    const teamStats = teamStatsData?.team_statistics || []

    // Calculate completed matches (only past matches with goals)
    const completedMatches = matches.filter((match: any) => {
      const matchDate = new Date(match.dateAndtime)
      const now = new Date()
      const isPastMatch = matchDate < now
      const hasGoals = match.team1Goals !== null && match.team2Goals !== null
      
      return isPastMatch && hasGoals
    })

    // Calculate total goals using team statistics if available, otherwise from matches
    let totalGoals = 0
    let totalMatchesPlayed = 0

    if (teamStats.length > 0) {
      // Use accumulated team statistics from database
      totalGoals = teamStats.reduce((sum: number, stat: any) => {
        const goalsFor = parseInt(stat.goals_for) || 0
        return sum + goalsFor
      }, 0)
      
      totalMatchesPlayed = teamStats.reduce((sum: number, stat: any) => {
        const played = parseInt(stat.played) || 0
        return sum + played
      }, 0)
    } else {
      // Fallback: Calculate from match results
      totalGoals = completedMatches.reduce((sum: number, match: any) => {
        const team1Goals = parseInt(match.team1Goals) || 0
        const team2Goals = parseInt(match.team2Goals) || 0
        
        // Safety check: if goals are unreasonably high, cap them
        const safeTeam1Goals = team1Goals > 100 ? 0 : team1Goals
        const safeTeam2Goals = team2Goals > 100 ? 0 : team2Goals
        
        return sum + safeTeam1Goals + safeTeam2Goals
      }, 0)
      
      totalMatchesPlayed = completedMatches.length
    }

    // Calculate average goals per match
    const avgGoalsPerMatch = totalMatchesPlayed > 0 ? (totalGoals / totalMatchesPlayed).toFixed(2) : "0.00"

    return [
      { label: "Total Goals", value: totalGoals.toString(), icon: Target },
      { label: "Total Matches", value: totalMatchesPlayed.toString(), icon: Users },
      { label: "Average Goals/Match", value: avgGoalsPerMatch, icon: TrendingUp },
      { label: "Total Teams", value: teams.length.toString(), icon: Award },
    ]
  }

  const calculateTopScorers = () => {
    const playerStats = playerStatsData?.player_statistics || []
    const teams = teamsData?.Teams || []

    // Group player statistics by player_id and sum goals
    const playerGoalsMap: {[key: string]: {goals: number, assists: number, matches: number, playerId: string}} = {}
    
    playerStats.forEach((stat: any) => {
      const playerId = stat.player_id
      if (!playerGoalsMap[playerId]) {
        playerGoalsMap[playerId] = { goals: 0, assists: 0, matches: 0, playerId }
      }
      playerGoalsMap[playerId].goals += parseInt(stat.goals) || 0
      playerGoalsMap[playerId].assists += parseInt(stat.assists) || 0
      playerGoalsMap[playerId].matches += 1
    })

    // Convert to array and sort by goals
    const topScorers = Object.values(playerGoalsMap)
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 5)
      .map((player: any) => {
        // Find team for this player (this is a simplified approach)
        const team = teams.find((t: any) => t.players?.some((p: any) => p.id === player.playerId))
        return {
          name: `Player ${player.playerId.slice(0, 8)}`, // Simplified name since we don't have player names in the current schema
          team: team?.name || "Unknown Team",
          goals: player.goals,
          matches: player.matches
        }
      })

    return topScorers
  }

  const calculateTeamStats = () => {
    const teams = teamsData?.Teams || []
    const teamStats = teamStatsData?.team_statistics || []

    if (teamStats.length === 0) {
      return [
        { team: "No Data", stat: "Most Goals", value: "0" },
        { team: "No Data", stat: "Best Defense", value: "0 GA" },
        { team: "No Data", stat: "Most Points", value: "0" },
        { team: "No Data", stat: "Best Goal Difference", value: "0" },
      ]
    }

    // Get team names
    const getTeamName = (teamId: string) => {
      const team = teams.find((t: any) => t.id === teamId)
      return team?.name || "Unknown Team"
    }

    // Find team with most goals
    const mostGoalsTeam = teamStats.reduce((max: any, stat: any) => {
      const currentGoals = parseInt(stat.goals_for) || 0
      const maxGoals = parseInt(max.goals_for) || 0
      return currentGoals > maxGoals ? stat : max
    })

    // Find team with best defense (least goals against)
    const bestDefenseTeam = teamStats.reduce((min: any, stat: any) => {
      const currentGoalsAgainst = parseInt(stat.goals_against) || 0
      const minGoalsAgainst = parseInt(min.goals_against) || 0
      return currentGoalsAgainst < minGoalsAgainst ? stat : min
    })

    // Find team with most points
    const mostPointsTeam = teamStats.reduce((max: any, stat: any) => {
      const currentPoints = parseInt(stat.points) || 0
      const maxPoints = parseInt(max.points) || 0
      return currentPoints > maxPoints ? stat : max
    })

    // Find team with best goal difference
    const bestGoalDiffTeam = teamStats.reduce((max: any, stat: any) => {
      const currentGoalDiff = parseInt(stat.goal_diff) || 0
      const maxGoalDiff = parseInt(max.goal_diff) || 0
      return currentGoalDiff > maxGoalDiff ? stat : max
    })

    // Calculate win rate for most points team
    const mostPointsPlayed = parseInt(mostPointsTeam.played) || 1
    const mostPointsWins = parseInt(mostPointsTeam.wins) || 0
    const winRate = mostPointsPlayed > 0 ? ((mostPointsWins / mostPointsPlayed) * 100).toFixed(1) : "0.0"

    return [
      { 
        team: getTeamName(mostGoalsTeam.team_id), 
        stat: "Most Goals Scored", 
        value: `${mostGoalsTeam.goals_for} goals` 
      },
      { 
        team: getTeamName(bestDefenseTeam.team_id), 
        stat: "Best Defense", 
        value: `${bestDefenseTeam.goals_against} goals conceded` 
      },
      { 
        team: getTeamName(mostPointsTeam.team_id), 
        stat: "Most Points", 
        value: `${mostPointsTeam.points} pts (${winRate}% win rate)` 
      },
      { 
        team: getTeamName(bestGoalDiffTeam.team_id), 
        stat: "Best Goal Difference", 
        value: `${bestGoalDiffTeam.goal_diff > 0 ? '+' : ''}${bestGoalDiffTeam.goal_diff}` 
      },
    ]
  }

  const calculateStandings = () => {
    const teams = teamsData?.Teams || []
    const teamStats = teamStatsData?.team_statistics || []

    if (teamStats.length === 0) {
      return { groupA: [], groupB: [] }
    }

    // Group teams by group (simplified - assuming we have 2 groups)
    const groupAStats = teamStats.filter((stat: any) => {
      // This is a simplified grouping - in reality you'd need to check the group_id
      const index = teamStats.indexOf(stat)
      return index < teamStats.length / 2
    })

    const groupBStats = teamStats.filter((stat: any) => {
      const index = teamStats.indexOf(stat)
      return index >= teamStats.length / 2
    })

    const formatStandings = (stats: any[]) => {
      return stats
        .map((stat: any) => {
          const team = teams.find((t: any) => t.id === stat.team_id)
          return {
            pos: 0, // Will be set after sorting
            team: team?.name || "Unknown Team",
            teamLogo: team?.logo || null,
            played: parseInt(stat.played) || 0,
            wins: parseInt(stat.wins) || 0,
            draws: parseInt(stat.draws) || 0,
            losses: parseInt(stat.losses) || 0,
            gf: parseInt(stat.goals_for) || 0,
            ga: parseInt(stat.goals_against) || 0,
            gd: parseInt(stat.goal_diff) || 0,
            points: parseInt(stat.points) || 0,
          }
        })
        .sort((a, b) => {
          // Sort by points, then goal difference, then goals for
          if (b.points !== a.points) return b.points - a.points
          if (b.gd !== a.gd) return b.gd - a.gd
          return b.gf - a.gf
        })
        .map((team, index) => ({ ...team, pos: index + 1 }))
    }

    return {
      groupA: formatStandings(groupAStats),
      groupB: formatStandings(groupBStats)
    }
  }

  const calculateFixtures = () => {
    const matches = matchesData?.matches || []
    const teams = teamsData?.Teams || []

    const now = new Date()
    
    const upcomingMatches = matches
      .filter((match: any) => {
        const matchDate = new Date(match.dateAndtime)
        // Show matches that haven't happened yet (include matches happening today)
        // Consider match as passed only if it's more than 2 hours after the scheduled time
        const matchEndTime = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000) // Add 2 hours to match time
        return now < matchEndTime && match.status !== 'completed'
      })
      .sort((a: any, b: any) => new Date(a.dateAndtime).getTime() - new Date(b.dateAndtime).getTime())
      .map((match: any) => {
        const team1 = teams.find((t: any) => t.id === match.team1)
        const team2 = teams.find((t: any) => t.id === match.team2)
        return {
          id: match.id,
          date: match.dateAndtime.split('T')[0],
          time: new Date(match.dateAndtime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          team1: team1?.name || "Unknown Team",
          team1Logo: team1?.logo || null,
          team2: team2?.name || "Unknown Team",
          team2Logo: team2?.logo || null,
          group: "A", // Simplified - would need proper group logic
          venue: match.location || "Prime Arena",
        }
      })

    const pastResults = matches
      .filter((match: any) => {
        const matchDate = new Date(match.dateAndtime)
        const isPastMatch = matchDate < now
        const hasGoals = match.team1Goals !== null && match.team2Goals !== null
        return isPastMatch && hasGoals
      })
      .sort((a: any, b: any) => new Date(b.dateAndtime).getTime() - new Date(a.dateAndtime).getTime())
      .map((match: any) => {
        const team1 = teams.find((t: any) => t.id === match.team1)
        const team2 = teams.find((t: any) => t.id === match.team2)
        return {
          id: match.id,
          date: match.dateAndtime.split('T')[0],
          team1: team1?.name || "Unknown Team",
          team1Logo: team1?.logo || null,
          team2: team2?.name || "Unknown Team",
          team2Logo: team2?.logo || null,
          score1: parseInt(match.team1Goals) || 0,
          score2: parseInt(match.team2Goals) || 0,
          group: "A", // Simplified - would need proper group logic
        }
      })

    return { upcomingMatches, pastResults }
  }

  // Find active season (including scheduled seasons)
  const findActiveSeason = () => {
    const seasons = seasonsData?.seasons || []
    const now = new Date()
    
    // Find season where current date is between startDate and EndDate, or season is scheduled (has teams)
    const activeSeason = seasons.find((season: any) => {
      const startDate = new Date(season.startDate)
      const endDate = new Date(season.EndDate)
      
      // Check if season is currently running
      const isCurrentlyRunning = now >= startDate && now <= endDate
      
      // Check if season is scheduled (has teams and hasn't ended yet)
      const hasTeams = season.teams && Object.keys(season.teams).length > 0
      const isScheduled = hasTeams && now <= endDate
      
      // Check if season is future scheduled (has teams and starts in the future)
      const isFutureScheduled = hasTeams && now < startDate
      
      return isCurrentlyRunning || isScheduled || isFutureScheduled
    })
    
    // If no season found with the primary logic, try fallback
    if (!activeSeason) {
      const fallbackSeason = seasons.find((season: any) => {
        const hasTeams = season.teams && Object.keys(season.teams).length > 0
        return hasTeams
      })
      return fallbackSeason
    }
    
    return activeSeason
  }

  const activeSeason = findActiveSeason()

  const calculateLeaderboard = () => {
    // If no active season, return empty array
    if (!activeSeason) {
      return []
    }

    const allTeams = teamsData?.Teams || []
    const allTeamStats = teamStatsData?.team_statistics || []
    
    // Filter teams that are part of the active season
    const seasonTeamIds = activeSeason.teams ? Object.keys(activeSeason.teams) : []
    const teams = allTeams.filter((team: any) => seasonTeamIds.includes(team.id.toString()))
    
    // Filter team statistics for the active season
    const teamStats = allTeamStats.filter((stat: any) => stat.season_id === activeSeason.id)

    if (teamStats.length === 0) {
      return teams.map((team: any, index: number) => ({
        position: index + 1,
        team: team.name,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        winRate: "0.0%",
        avgGoalsPerMatch: "0.0",
        form: "No matches"
      }))
    }

    // Create leaderboard data by combining team info with statistics
    const leaderboardData = teams.map((team: any) => {
      const teamStat = teamStats.find((stat: any) => stat.team_id === team.id)
      
      if (teamStat) {
        const played = parseInt(teamStat.played) || 0
        const wins = parseInt(teamStat.wins) || 0
        const draws = parseInt(teamStat.draws) || 0
        const losses = parseInt(teamStat.losses) || 0
        const goalsFor = parseInt(teamStat.goals_for) || 0
        const goalsAgainst = parseInt(teamStat.goals_against) || 0
        const goalDifference = parseInt(teamStat.goal_diff) || 0
        const points = parseInt(teamStat.points) || 0
        
        const winRate = played > 0 ? ((wins / played) * 100).toFixed(1) : "0.0"
        const avgGoalsPerMatch = played > 0 ? (goalsFor / played).toFixed(1) : "0.0"
        
        // Simple form calculation (last 5 matches would need more complex logic)
        const form = played > 0 ? `${wins}W-${draws}D-${losses}L` : "No matches"
        
        return {
          position: 0, // Will be set after sorting
          team: team.name,
          played,
          wins,
          draws,
          losses,
          goalsFor,
          goalsAgainst,
          goalDifference,
          points,
          winRate: `${winRate}%`,
          avgGoalsPerMatch,
          form
        }
      } else {
        return {
          position: 0,
          team: team.name,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
          winRate: "0.0%",
          avgGoalsPerMatch: "0.0",
          form: "No matches"
        }
      }
    })

    // Sort by points, then goal difference, then goals for
    const sortedLeaderboard = leaderboardData.sort((a: any, b: any) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })

    // Set positions
    return sortedLeaderboard.map((team: any, index: number) => ({
      ...team,
      position: index + 1
    }))
  }

  // Calculate all data
  const leagueStats = calculateLeagueStats()
  const topScorers = calculateTopScorers()
  const teamStats = calculateTeamStats()
  const standings = calculateStandings()
  const fixtures = calculateFixtures()
  const leaderboard = calculateLeaderboard()

  // Calculate knockout matches and group data
  const calculateKnockoutData = () => {
    if (!activeSeason) {
      // Return dummy data for design preview
      return {
        knockoutMatches: { 
          quarterfinals: [
            { team1: "Thunder FC", team2: "Electric FC", winner: "Thunder FC", team1Score: 3, team2Score: 1, date: "Dec 15" },
            { team1: "Lightning United", team2: "Phoenix United", winner: "Lightning United", team1Score: 2, team2Score: 0, date: "Dec 15" },
            { team1: "Rapid Fire", team2: "Dynamo FC", winner: "TBD", team1Score: 0, team2Score: 0, date: "Dec 16" },
            { team1: "Velocity FC", team2: "Storm Riders", winner: "TBD", team1Score: 0, team2Score: 0, date: "Dec 16" }
          ], 
          semifinals: [
            { team1: "Thunder FC", team2: "Lightning United", winner: "TBD", team1Score: 0, team2Score: 0, date: "Dec 22" },
            { team1: "TBD", team2: "TBD", winner: "TBD", team1Score: 0, team2Score: 0, date: "Dec 22" }
          ], 
          final: { team1: "TBD", team2: "TBD", winner: "TBD", team1Score: 0, team2Score: 0, date: "Dec 29" }
        },
        groupATeams: [
          { name: "Thunder FC", points: 12, goalDifference: 8, goalsFor: 15 },
          { name: "Rapid Fire", points: 9, goalDifference: 3, goalsFor: 12 },
          { name: "Storm Riders", points: 7, goalDifference: 1, goalsFor: 10 },
          { name: "Phoenix United", points: 6, goalDifference: -2, goalsFor: 8 }
        ],
        groupBTeams: [
          { name: "Lightning United", points: 11, goalDifference: 6, goalsFor: 14 },
          { name: "Velocity FC", points: 8, goalDifference: 2, goalsFor: 11 },
          { name: "Dynamo FC", points: 6, goalDifference: -1, goalsFor: 9 },
          { name: "Electric FC", points: 4, goalDifference: -3, goalsFor: 7 }
        ]
      }
    }

    const allTeams = teamsData?.Teams || []
    const allTeamStats = teamStatsData?.team_statistics || []
    const allMatches = matchesData?.matches || []
    
    // Filter teams and stats for active season
    const seasonTeamIds = activeSeason.teams ? Object.keys(activeSeason.teams) : []
    const seasonTeams = allTeams.filter((team: any) => seasonTeamIds.includes(team.id.toString()))
    const seasonTeamStats = allTeamStats.filter((stat: any) => stat.season_id === activeSeason.id)
    
    // Get group data from season groups or create from team stats
    let groupATeams = []
    let groupBTeams = []
    
    // For now, we'll create groups by splitting teams in half
    // This can be enhanced later to use actual group data from the database
    const sortedTeams = seasonTeams.map((team: any) => {
      const teamStat = seasonTeamStats.find((stat: any) => stat.team_id === team.id)
      return {
        ...team,
        points: teamStat ? parseInt(teamStat.points) || 0 : 0,
        goalDifference: teamStat ? parseInt(teamStat.goal_diff) || 0 : 0,
        goalsFor: teamStat ? parseInt(teamStat.goals_for) || 0 : 0
      }
    }).sort((a: any, b: any) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })

    // Split teams into two groups
    const midPoint = Math.ceil(sortedTeams.length / 2)
    groupATeams = sortedTeams.slice(0, midPoint)
    groupBTeams = sortedTeams.slice(midPoint)

    // Filter matches for the active season
    const seasonMatches = allMatches.filter((match: any) => {
      return match.season_id === activeSeason.id
    })

    // Filter knockout matches based on type
    const knockoutMatches = seasonMatches.filter((match: any) => {
      return match.type === 'quarterfinal' || 
             match.type === 'semifinal' || 
             match.type === 'final' ||
             match.type === 'knockout-qualifier'
    })

    // If no knockout matches found, return empty structure but still show groups
    if (knockoutMatches.length === 0) {
      return {
        knockoutMatches: { 
          quarterfinals: [],
          semifinals: [],
          final: null
        },
        groupATeams: groupATeams.map((team: any) => ({
          name: team.name,
          logo: team.logo || null,
          points: team.points || 0,
          goalDifference: team.goalDifference || 0,
          goalsFor: team.goalsFor || 0
        })),
        groupBTeams: groupBTeams.map((team: any) => ({
          name: team.name,
          logo: team.logo || null,
          points: team.points || 0,
          goalDifference: team.goalDifference || 0,
          goalsFor: team.goalsFor || 0
        }))
      }
    }

    // Create knockout matches from real data
    const quarterfinals = knockoutMatches
      .filter((match: any) => match.type === 'quarterfinal' || match.type === 'knockout-qualifier')
      .map((match: any) => {
        const team1 = allTeams.find((t: any) => t.id === match.team1_id) || { name: `Team ${match.team1_id}` }
        const team2 = allTeams.find((t: any) => t.id === match.team2_id) || { name: `Team ${match.team2_id}` }
        const winner = match.team1_goals > match.team2_goals ? team1.name : 
                      match.team2_goals > match.team1_goals ? team2.name : "TBD"
        
        return {
          team1: team1.name,
          team2: team2.name,
          winner,
          team1Score: match.team1_goals || 0,
          team2Score: match.team2_goals || 0,
          date: new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          venue: match.venue || 'Prime Arena'
        }
      })

    const semifinals = knockoutMatches
      .filter((match: any) => match.type === 'semifinal')
      .map((match: any) => {
        const team1 = allTeams.find((t: any) => t.id === match.team1_id) || { name: `Team ${match.team1_id}` }
        const team2 = allTeams.find((t: any) => t.id === match.team2_id) || { name: `Team ${match.team2_id}` }
        const winner = match.team1_goals > match.team2_goals ? team1.name : 
                      match.team2_goals > match.team1_goals ? team2.name : "TBD"
        
        return {
          team1: team1.name,
          team2: team2.name,
          winner,
          team1Score: match.team1_goals || 0,
          team2Score: match.team2_goals || 0,
          date: new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          venue: match.venue || 'Prime Arena'
        }
      })

    const finalMatch = knockoutMatches.find((match: any) => match.type === 'final')
    const final = finalMatch ? {
      team1: allTeams.find((t: any) => t.id === finalMatch.team1_id)?.name || `Team ${finalMatch.team1_id}`,
      team2: allTeams.find((t: any) => t.id === finalMatch.team2_id)?.name || `Team ${finalMatch.team2_id}`,
      winner: finalMatch.team1_goals > finalMatch.team2_goals ? 
              (allTeams.find((t: any) => t.id === finalMatch.team1_id)?.name || `Team ${finalMatch.team1_id}`) :
              finalMatch.team2_goals > finalMatch.team1_goals ? 
              (allTeams.find((t: any) => t.id === finalMatch.team2_id)?.name || `Team ${finalMatch.team2_id}`) : "TBD",
      team1Score: finalMatch.team1_goals || 0,
      team2Score: finalMatch.team2_goals || 0,
      date: new Date(finalMatch.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      venue: finalMatch.venue || 'Prime Arena'
    } : null

    return {
      knockoutMatches: { quarterfinals, semifinals, final },
      groupATeams: groupATeams.map((team: any) => ({
        name: team.name,
        logo: team.logo || null,
        points: team.points || 0,
        goalDifference: team.goalDifference || 0,
        goalsFor: team.goalsFor || 0
      })),
      groupBTeams: groupBTeams.map((team: any) => ({
        name: team.name,
        logo: team.logo || null,
        points: team.points || 0,
        goalDifference: team.goalDifference || 0,
        goalsFor: team.goalsFor || 0
      }))
    }
  }

  const knockoutData = calculateKnockoutData()
  const knockoutMatches = knockoutData.knockoutMatches
  const groupATeams = knockoutData.groupATeams
  const groupBTeams = knockoutData.groupBTeams

  const playerOfTheWeek = {
    name: topScorers[0]?.name || "No Data",
    team: topScorers[0]?.team || "No Team",
    stats: `${topScorers[0]?.goals || 0} goals`,
    week: "Current Week",
  }

  // Use calculated data instead of hardcoded data
  const groupAStandings = standings.groupA
  const groupBStandings = standings.groupB

  // Use calculated fixtures data
  const upcomingMatches = fixtures.upcomingMatches
  const pastResults = fixtures.pastResults

  // Show all matches without group filtering
  const filteredUpcoming = upcomingMatches

  const filteredResults = pastResults









  const StandingsTable = ({ standings, groupName }: { standings: typeof groupAStandings; groupName: string }) => (
    <div className="glass-dark rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl">
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h3 className="text-xl font-black text-white font-heading italic uppercase tracking-tighter flex items-center gap-3">
          <Trophy className="h-5 w-5 text-lime-300" />
          Group <span className="text-lime-300">{groupName}</span> Standings
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              <th className="p-4 text-left w-16">Pos</th>
              <th className="p-4 text-left">Team Name</th>
              <th className="p-4 text-center">P</th>
              <th className="p-4 text-center">GD</th>
              <th className="p-4 text-center">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.map((team, index) => (
              <tr
                key={team.team}
                className={`group hover:bg-white/[0.02] transition-colors duration-300 ${
                  index < 2 ? "bg-lime-400/[0.02]" : ""
                }`}
              >
                <td className="p-4 font-black font-heading italic text-white/20 group-hover:text-lime-300 transition-colors">
                  {(index + 1).toString().padStart(2, '0')}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-lime-300/30 transition-colors overflow-hidden">
                      {team.teamLogo ? (
                        <img src={team.teamLogo} alt={team.team} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-black text-white/40">{team.team.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="font-bold text-white uppercase tracking-tight group-hover:text-lime-300 transition-colors">{team.team}</span>
                  </div>
                </td>
                <td className="p-4 text-center text-white/60 font-bold">{team.played}</td>
                <td className={`p-4 text-center font-black ${team.gd >= 0 ? "text-lime-300" : "text-red-400"}`}>
                  {team.gd > 0 ? "+" : ""}{team.gd}
                </td>
                <td className="p-4 text-center">
                  <span className="text-xl font-black text-white font-heading italic">{team.points}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen relative">
      <Navigation />

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lime-400/10 blur-[100px] rounded-full -z-10"></div>
          <div className="inline-block px-4 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            League Center
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 font-heading italic uppercase tracking-tighter">
            Market <span className="text-lime-300">Statistics</span>
          </h1>
          <p className="text-lg text-white/50 uppercase font-bold tracking-[0.2em]">Detailed records & live standings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-16 px-4">
          <div className="glass-dark rounded-2xl p-1.5 flex flex-wrap justify-center gap-1 shadow-2xl border border-white/10 max-w-4xl w-full">
            {(['leaderboard', 'statistics', 'standings', 'fixtures', 'bracket'] as const).map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                onClick={() => setActiveTab(tab)}
                className={`h-12 px-8 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 ${
                  activeTab === tab 
                    ? "bg-lime-300 text-black shadow-[0_0_20px_rgba(190,242,100,0.3)] scale-105" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!activeSeason ? (
              <div className="glass-dark rounded-[2.5rem] p-16 text-center border border-white/10 shadow-3xl">
                <div className="w-20 h-20 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-lime-400/20">
                  <Trophy className="h-10 w-10 text-lime-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 font-heading italic uppercase tracking-tighter">No Active Season</h3>
                <p className="text-white/40 text-lg uppercase font-bold tracking-widest max-w-md mx-auto">
                  The leaderboard will be available once a season is created and teams are added.
                </p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="glass-dark rounded-[2.5rem] p-16 text-center border border-white/10 shadow-3xl">
                <div className="w-20 h-20 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-lime-400/20">
                  <Users className="h-10 w-10 text-lime-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 font-heading italic uppercase tracking-tighter">No Registered Teams</h3>
                <p className="text-white/40 text-lg uppercase font-bold tracking-widest max-w-md mx-auto">
                  The season "{activeSeason.name}" has no teams registered yet.
                </p>
              </div>
            ) : (
              <div className="glass-dark rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl">
                <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white font-heading italic uppercase tracking-tighter flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-lime-300" />
                    League <span className="text-lime-300">Standings</span>
                  </h3>
                  <Badge className="bg-lime-400/10 text-lime-400 border-lime-400/20 px-4 py-1 font-black uppercase tracking-widest text-[10px]">
                    {activeSeason.name}
                  </Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        <th className="p-6 text-left w-20">Pos</th>
                        <th className="p-6 text-left">Team Name</th>
                        <th className="p-6 text-center">P</th>
                        <th className="p-6 text-center">W</th>
                        <th className="p-6 text-center">D</th>
                        <th className="p-6 text-center">L</th>
                        <th className="p-6 text-center">GD</th>
                        <th className="p-6 text-center">Pts</th>
                        <th className="p-6 text-center">Form</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leaderboard.map((team: any, index: number) => (
                        <tr
                          key={team.team}
                          className={`group hover:bg-white/[0.02] transition-colors duration-300 ${
                            index === 0 ? "bg-lime-400/[0.03]" : ""
                          }`}
                        >
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <span className={`text-2xl font-black font-heading italic ${index === 0 ? "text-lime-300" : "text-white/20"}`}>
                                {(index + 1).toString().padStart(2, '0')}
                              </span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-lime-300/30 transition-colors">
                                <span className="text-xs font-black text-white/40 group-hover:text-lime-300 transition-colors">
                                  {team.team.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-black text-white uppercase tracking-tight text-lg group-hover:text-lime-300 transition-colors">{team.team}</p>
                                {index === 0 && <span className="text-[10px] font-black text-lime-400 uppercase tracking-widest">Current Leader</span>}
                              </div>
                            </div>
                          </td>
                          <td className="p-6 text-center text-white/60 font-bold">{team.played}</td>
                          <td className="p-6 text-center text-white font-black">{team.wins}</td>
                          <td className="p-6 text-center text-white/60 font-bold">{team.draws}</td>
                          <td className="p-6 text-center text-white/60 font-bold">{team.losses}</td>
                          <td className={`p-6 text-center font-black ${team.goalDifference >= 0 ? "text-lime-300" : "text-red-400"}`}>
                            {team.goalDifference > 0 ? "+" : ""}{team.goalDifference}
                          </td>
                          <td className="p-6 text-center">
                            <span className="text-2xl font-black text-white font-heading italic">{team.points}</span>
                          </td>
                          <td className="p-6">
                            <div className="flex justify-center gap-1">
                              {/* Mock form indicator */}
                              {[1, 1, 1, 0, 1].map((res, i) => (
                                <div key={i} className={`w-1.5 h-6 rounded-full ${res ? "bg-lime-400/40" : "bg-white/10"}`}></div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* League Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {leagueStats.map((stat, index) => (
                <div key={index} className="glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <stat.icon size={80} />
                  </div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 relative z-10">{stat.label}</p>
                  <h3 className="text-4xl md:text-6xl font-black text-white font-heading italic tracking-tighter relative z-10 group-hover:text-lime-300 transition-colors">
                    {stat.value}
                  </h3>
                  <div className="absolute bottom-0 left-0 h-1 bg-lime-300 w-0 group-hover:w-full transition-all duration-500"></div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Top Scorers */}
              <div className="glass-dark rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white font-heading italic uppercase tracking-tighter flex items-center gap-3">
                    <Target className="h-6 w-6 text-lime-300" />
                    Top <span className="text-lime-300">Scorers</span>
                  </h3>
                </div>
                <div className="divide-y divide-white/5">
                  {topScorers.map((player, index) => (
                    <div key={index} className="p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <span className={`text-2xl font-black font-heading italic ${index === 0 ? "text-lime-300" : "text-white/10"}`}>
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <div>
                          <p className="font-black text-white uppercase tracking-tight text-lg group-hover:text-lime-300 transition-colors">{player.name}</p>
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{player.team}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-white font-heading italic group-hover:text-lime-300 transition-colors">{player.goals}</p>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{player.matches} Matches</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Player & Team Performance */}
              <div className="space-y-8">
                <div className="glass-dark rounded-[2.5rem] border border-white/10 shadow-3xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Award size={120} />
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
                    M.V.P of the Week
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white font-heading italic uppercase tracking-tighter mb-2 group-hover:text-lime-300 transition-colors">
                    {playerOfTheWeek.name}
                  </h3>
                  <p className="text-lg text-white/50 uppercase font-black tracking-widest mb-6">{playerOfTheWeek.team}</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-24 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-white font-heading italic">{playerOfTheWeek.stats}</span>
                    </div>
                  </div>
                </div>

                <div className="glass-dark rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden">
                  <div className="p-6 border-b border-white/5 bg-white/5">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                       <TrendingUp className="h-4 w-4 text-lime-300" />
                       Team Records
                    </h3>
                  </div>
                  <div className="grid grid-cols-2">
                    {teamStats.map((stat, index) => (
                      <div key={index} className="p-6 border-r last:border-r-0 border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">{stat.stat}</p>
                        <p className="font-black text-white uppercase tracking-tight mb-1 group-hover:text-lime-300 transition-colors">{stat.team}</p>
                        <p className="text-xl font-black text-lime-400 font-heading italic">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Specialty Awards */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Most Disciplined", value: "Phoenix United", detail: "2 Yellow Cards", icon: Shield, color: "text-blue-400" },
                { title: "Golden Glove", value: "Roberto Martinez", detail: "4 Clean Sheets", icon: Award, color: "text-yellow-400" },
                { title: "Top Playmaker", value: "Luis Garcia", detail: "8 Assists", icon: Target, color: "text-lime-400" }
              ].map((award, i) => (
                <div key={i} className="glass rounded-[2rem] p-8 border border-white/5 text-center group hover:bg-white/5 transition-all">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform ${award.color}`}>
                    <award.icon size={24} />
                  </div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{award.title}</p>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{award.value}</h4>
                  <p className="text-xs font-bold text-white/50">{award.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standings Tab */}
        {activeTab === 'standings' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Group Selection */}
            <div className="flex justify-center">
              <div className="glass-dark rounded-2xl p-1.5 flex gap-1 border border-white/10">
                {(["all", "A", "B"] as const).map((group) => (
                  <Button
                    key={group}
                    variant="ghost"
                    onClick={() => setSelectedGroup(group)}
                    className={`h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                      selectedGroup === group 
                        ? "bg-lime-300 text-black shadow-lg" 
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {group === "all" ? "All Groups" : `Group ${group}`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Standings Tables */}
            {selectedGroup === "all" ? (
              <div className="grid lg:grid-cols-2 gap-8">
                <StandingsTable standings={groupAStandings} groupName="A" />
                <StandingsTable standings={groupBStandings} groupName="B" />
              </div>
            ) : selectedGroup === "A" ? (
              <div className="max-w-4xl mx-auto w-full">
                <StandingsTable standings={groupAStandings} groupName="A" />
              </div>
            ) : (
              <div className="max-w-4xl mx-auto w-full">
                <StandingsTable standings={groupBStandings} groupName="B" />
              </div>
            )}
          </div>
        )}

        {/* Fixtures Tab */}
        {activeTab === 'fixtures' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Fixture Type Toggle */}
            <div className="flex justify-center">
              <div className="glass-dark rounded-2xl p-1.5 flex gap-1 border border-white/10">
                {(["upcoming", "results"] as const).map((type) => (
                  <Button
                    key={type}
                    variant="ghost"
                    onClick={() => setSelectedFixtureTab(type)}
                    className={`h-10 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                      selectedFixtureTab === type 
                        ? "bg-lime-300 text-black shadow-lg" 
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {type === "upcoming" ? "Upcoming Matches" : "Past Results"}
                  </Button>
                ))}
              </div>
            </div>

            {selectedFixtureTab === "upcoming" ? (
              <div className="grid md:grid-cols-2 gap-8">
                {filteredUpcoming.length === 0 ? (
                  <div className="col-span-full glass-dark rounded-[2.5rem] p-16 text-center border border-white/10 opacity-50">
                    <Calendar className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40 font-black uppercase tracking-widest text-sm">No upcoming matches scheduled</p>
                  </div>
                ) : (
                  filteredUpcoming.map((match: any) => (
                    <div key={match.id} className="glass-dark rounded-[2rem] p-8 border border-white/10 group hover:border-lime-300/30 transition-all duration-500 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4">
                        <Badge className="bg-lime-400/10 text-lime-400 border-lime-400/20 font-black uppercase tracking-widest text-[8px]">Group {match.group}</Badge>
                      </div>
                      <div className="flex items-center justify-between gap-4 mb-8">
                        <div className="flex-1 text-center">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                            {match.team1Logo ? (
                              <img src={match.team1Logo} alt={match.team1} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-black text-white/20">{match.team1.substring(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <p className="font-black text-white uppercase tracking-tight text-sm line-clamp-1">{match.team1}</p>
                        </div>
                        <div className="flex flex-col items-center">
                           <div className="w-10 h-10 rounded-full bg-lime-300 flex items-center justify-center shadow-[0_0_20px_rgba(190,242,100,0.5)] z-10">
                              <span className="text-black font-black italic text-xs">VS</span>
                           </div>
                        </div>
                        <div className="flex-1 text-center">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                            {match.team2Logo ? (
                              <img src={match.team2Logo} alt={match.team2} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-black text-white/20">{match.team2.substring(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <p className="font-black text-white uppercase tracking-tight text-sm line-clamp-1">{match.team2}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 text-white/40">
                          <Clock size={14} className="text-lime-300" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{match.time} • {match.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/40">
                          <MapPin size={14} className="text-lime-300" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{match.venue}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {filteredResults.length === 0 ? (
                  <div className="col-span-full glass-dark rounded-[2.5rem] p-16 text-center border border-white/10 opacity-50">
                    <Award className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40 font-black uppercase tracking-widest text-sm">No match results available yet</p>
                  </div>
                ) : (
                  filteredResults.map((match: any) => (
                    <div key={match.id} className="glass rounded-[2rem] p-8 border border-white/5 group hover:bg-white/5 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{match.date}</span>
                      </div>
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex-1 flex items-center justify-end gap-4 text-right">
                          <p className="font-black text-white uppercase tracking-tight text-sm hidden sm:block">{match.team1}</p>
                          <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                            {match.team1Logo ? (
                              <img src={match.team1Logo} alt={match.team1} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-black text-white/20">{match.team1.substring(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 py-2 px-6 bg-white/5 rounded-2xl border border-white/10 group-hover:border-lime-300/30 transition-colors">
                          <span className={`text-3xl font-black font-heading italic ${match.score1 > match.score2 ? "text-lime-300" : "text-white/40"}`}>{match.score1}</span>
                          <span className="text-white/10 font-black">:</span>
                          <span className={`text-3xl font-black font-heading italic ${match.score2 > match.score1 ? "text-lime-300" : "text-white/40"}`}>{match.score2}</span>
                        </div>
                        <div className="flex-1 flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                            {match.team2Logo ? (
                              <img src={match.team2Logo} alt={match.team2} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-black text-white/20">{match.team2.substring(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <p className="font-black text-white uppercase tracking-tight text-sm hidden sm:block">{match.team2}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Bracket Tab */}
        {activeTab === 'bracket' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-16 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-lime-400/5 blur-[80px] rounded-full -z-10"></div>
              <h2 className="text-4xl font-black text-white mb-4 font-heading italic uppercase tracking-tighter">Knockout <span className="text-lime-300">Phase</span></h2>
              <p className="text-white/40 text-sm font-black uppercase tracking-[0.2em]">{activeSeason?.name || "Tournament Overview"}</p>
            </div>
            
            <div className="max-w-6xl mx-auto overflow-x-auto pb-12">
               <Bracket 
                knockoutMatches={knockoutMatches}
                groupATeams={groupATeams}
                groupBTeams={groupBTeams}
                activeSeason={activeSeason}
               />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
