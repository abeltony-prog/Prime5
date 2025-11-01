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
        groupATeams: groupATeams.map(team => ({
          name: team.name,
          logo: team.logo || null,
          points: team.points || 0,
          goalDifference: team.goalDifference || 0,
          goalsFor: team.goalsFor || 0
        })),
        groupBTeams: groupBTeams.map(team => ({
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
      groupATeams: groupATeams.map(team => ({
        name: team.name,
        logo: team.logo || null,
        points: team.points || 0,
        goalDifference: team.goalDifference || 0,
        goalsFor: team.goalsFor || 0
      })),
      groupBTeams: groupBTeams.map(team => ({
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
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-md text-white">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Group {groupName} Standings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/20 backdrop-blur-sm">
              <tr className="text-left text-sm font-medium text-white">
                <th className="p-3">Pos</th>
                <th className="p-3">Team</th>
                <th className="p-3 text-center">P</th>
                <th className="p-3 text-center">W</th>
                <th className="p-3 text-center">D</th>
                <th className="p-3 text-center">L</th>
                <th className="p-3 text-center">GF</th>
                <th className="p-3 text-center">GA</th>
                <th className="p-3 text-center">GD</th>
                <th className="p-3 text-center">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, index) => (
                <tr
                  key={team.team}
                  className={`border-b border-white/20 hover:bg-white/10 transition-all duration-300 ${
                    index < 2 ? "bg-green-500/20 backdrop-blur-sm" : index >= standings.length - 2 ? "bg-red-500/20 backdrop-blur-sm" : ""
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{team.pos}</span>
                      {index < 2 && <TrendingUp className="h-4 w-4 text-green-300" />}
                      {index >= standings.length - 2 && <TrendingDown className="h-4 w-4 text-red-300" />}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {team.teamLogo ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                          <img 
                            src={team.teamLogo} 
                            alt={`${team.team} Logo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full flex items-center justify-center border border-white/20">
                          <span className="text-xs font-bold text-white">
                            {team.team.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-white drop-shadow-md">{team.team}</span>
                      {index === 0 && <Badge className="bg-yellow-500/90 backdrop-blur-md text-black">Leader</Badge>}
                    </div>
                  </td>
                  <td className="p-3 text-center text-white">{team.played}</td>
                  <td className="p-3 text-center text-green-300 font-medium">{team.wins}</td>
                  <td className="p-3 text-center text-yellow-300 font-medium">{team.draws}</td>
                  <td className="p-3 text-center text-red-300 font-medium">{team.losses}</td>
                  <td className="p-3 text-center text-white">{team.gf}</td>
                  <td className="p-3 text-center text-white">{team.ga}</td>
                  <td className={`p-3 text-center font-medium ${team.gd >= 0 ? "text-green-300" : "text-red-300"}`}>
                    {team.gd > 0 ? "+" : ""}
                    {team.gd}
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className="font-bold text-white border-white/50 bg-white/20 backdrop-blur-sm">
                      {team.points}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen relative">
      <Navigation />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">League Center</h1>
          <p className="text-lg text-white/90 drop-shadow-xl">Statistics, standings, and fixtures</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-lg p-1 shadow-2xl border border-white/20">
            <Button
              variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('leaderboard')}
              className={activeTab === 'leaderboard' ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg' : 'text-white hover:bg-white/20 hover:text-white'}
            >
              Leaderboard
            </Button>
            <Button
              variant={activeTab === 'statistics' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('statistics')}
              className={activeTab === 'statistics' ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg' : 'text-white hover:bg-white/20 hover:text-white'}
            >
              Statistics
            </Button>
            <Button
              variant={activeTab === 'standings' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('standings')}
              className={activeTab === 'standings' ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg' : 'text-white hover:bg-white/20 hover:text-white'}
            >
              Standings
            </Button>
            <Button
              variant={activeTab === 'fixtures' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('fixtures')}
              className={activeTab === 'fixtures' ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg' : 'text-white hover:bg-white/20 hover:text-white'}
            >
              Fixtures
            </Button>
            <Button
              variant={activeTab === 'bracket' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('bracket')}
              className={activeTab === 'bracket' ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg' : 'text-white hover:bg-white/20 hover:text-white'}
            >
              Bracket
            </Button>

          </div>
        </div>

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-2xl">League Leaderboard</h2>
              <p className="text-lg text-white/90 drop-shadow-xl">
                {activeSeason ? `Complete team rankings and statistics - ${activeSeason.name}` : "No active or scheduled season"}
              </p>
            </div>

            {!activeSeason ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">No Active Season</h3>
                  <p className="text-white/80 text-lg mb-6">
                    There is currently no active or scheduled season. The leaderboard will be available once a season is created and teams are added.
                  </p>
                  <div className="text-white/60">
                    <p>• Create a season in the admin panel</p>
                    <p>• Add teams to the season</p>
                    <p>• The leaderboard will appear here automatically</p>
                  </div>
                </CardContent>
              </Card>
            ) : leaderboard.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">No Teams in Active Season</h3>
                  <p className="text-white/80 text-lg mb-6">
                    The active season "{activeSeason.name}" has no teams registered yet.
                  </p>
                  <div className="text-white/60">
                    <p>• Teams need to be registered for this season</p>
                    <p>• Leaderboard will populate once teams are added</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-600/90 to-purple-700/90 backdrop-blur-md text-white">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Complete League Table
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/20 backdrop-blur-sm">
                      <tr className="text-left text-sm font-medium text-white">
                        <th className="p-4">Pos</th>
                        <th className="p-4">Team</th>
                        <th className="p-4 text-center">P</th>
                        <th className="p-4 text-center">W</th>
                        <th className="p-4 text-center">D</th>
                        <th className="p-4 text-center">L</th>
                        <th className="p-4 text-center">GF</th>
                        <th className="p-4 text-center">GA</th>
                        <th className="p-4 text-center">GD</th>
                        <th className="p-4 text-center">Pts</th>
                        <th className="p-4 text-center">Win%</th>
                        <th className="p-4 text-center">Avg Goals</th>
                        <th className="p-4 text-center">Form</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((team: any, index: number) => (
                        <tr
                          key={team.team}
                          className={`border-b border-white/20 hover:bg-white/10 transition-all duration-300 ${
                            index === 0 ? "bg-yellow-500/20 backdrop-blur-sm" : 
                            index < 3 ? "bg-green-500/20 backdrop-blur-sm" : 
                            index >= leaderboard.length - 2 ? "bg-red-500/20 backdrop-blur-sm" : ""
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-lg">{team.position}</span>
                              {index === 0 && <Trophy className="h-5 w-5 text-yellow-400" />}
                              {index === 1 && <Award className="h-5 w-5 text-gray-400" />}
                              {index === 2 && <Award className="h-5 w-5 text-orange-400" />}
                              {index < 3 && <TrendingUp className="h-4 w-4 text-green-300" />}
                              {index >= leaderboard.length - 2 && <TrendingDown className="h-4 w-4 text-red-300" />}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-white drop-shadow-md text-lg">{team.team}</span>
                              {index === 0 && <Badge className="bg-yellow-500/90 backdrop-blur-md text-black font-bold">Champion</Badge>}
                              {index === 1 && <Badge className="bg-gray-400/90 backdrop-blur-md text-white">2nd</Badge>}
                              {index === 2 && <Badge className="bg-orange-400/90 backdrop-blur-md text-white">3rd</Badge>}
                            </div>
                          </td>
                          <td className="p-4 text-center text-white font-medium">{team.played}</td>
                          <td className="p-4 text-center text-green-300 font-bold">{team.wins}</td>
                          <td className="p-4 text-center text-yellow-300 font-medium">{team.draws}</td>
                          <td className="p-4 text-center text-red-300 font-medium">{team.losses}</td>
                          <td className="p-4 text-center text-white font-medium">{team.goalsFor}</td>
                          <td className="p-4 text-center text-white font-medium">{team.goalsAgainst}</td>
                          <td className={`p-4 text-center font-bold ${team.goalDifference >= 0 ? "text-green-300" : "text-red-300"}`}>
                            {team.goalDifference > 0 ? "+" : ""}{team.goalDifference}
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline" className="font-bold text-white border-white/50 bg-white/20 backdrop-blur-sm text-lg px-3 py-1">
                              {team.points}
                            </Badge>
                          </td>
                          <td className="p-4 text-center text-white font-medium">{team.winRate}</td>
                          <td className="p-4 text-center text-white font-medium">{team.avgGoalsPerMatch}</td>
                          <td className="p-4 text-center">
                            <Badge variant="outline" className="text-xs bg-white/10 backdrop-blur-sm border-white/30 text-white">
                              {team.form}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats - Only show when there are teams */}
            {leaderboard.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">League Leader</h3>
                  <p className="text-white/90 drop-shadow-md">{leaderboard[0]?.team || "No Data"}</p>
                  <p className="text-sm text-white/70 mt-1">{leaderboard[0]?.points || 0} points</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">Top Scorer</h3>
                  <p className="text-white/90 drop-shadow-md">{leaderboard[0]?.team || "No Data"}</p>
                  <p className="text-sm text-white/70 mt-1">{leaderboard[0]?.goalsFor || 0} goals</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">Best Defense</h3>
                  <p className="text-white/90 drop-shadow-md">
                    {leaderboard.reduce((min: any, team: any) => team.goalsAgainst < min.goalsAgainst ? team : min, leaderboard[0] || {goalsAgainst: 0, team: "No Data"}).team}
                  </p>
                  <p className="text-sm text-white/70 mt-1">
                    {leaderboard.reduce((min: any, team: any) => team.goalsAgainst < min.goalsAgainst ? team : min, leaderboard[0] || {goalsAgainst: 0}).goalsAgainst} goals conceded
                  </p>
                </CardContent>
              </Card>
            </div>
            )}
              </>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="space-y-12">
            {/* League Overview Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              {leagueStats.map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl text-center hover:shadow-3xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{stat.value}</h3>
                    <p className="text-white/90 drop-shadow-md">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Top Scorers */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-yellow-500/90 to-yellow-600/90 backdrop-blur-md text-black">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Top Scorers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {topScorers.map((player, index) => (
                      <div
                        key={index}
                        className={`p-4 border-b border-white/20 last:border-b-0 hover:bg-white/10 transition-all duration-300 ${index === 0 ? "bg-yellow-500/20 backdrop-blur-sm" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0
                                  ? "bg-yellow-500 text-black"
                                  : index === 1
                                    ? "bg-gray-400 text-white"
                                    : index === 2
                                      ? "bg-orange-400 text-white"
                                      : "bg-blue-100/80 backdrop-blur-sm text-blue-600"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-white drop-shadow-md">{player.name}</p>
                              <p className="text-sm text-white/80">{player.team}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white drop-shadow-lg">{player.goals}</p>
                            <p className="text-sm text-white/70">{player.matches} matches</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Player of the Week */}
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-md text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Player of the Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center">
                    <Badge className="mb-4 bg-yellow-500/90 backdrop-blur-md text-black">{playerOfTheWeek.week}</Badge>
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{playerOfTheWeek.name}</h3>
                    <p className="text-lg text-white/90 mb-4 drop-shadow-md">{playerOfTheWeek.team}</p>
                    <p className="text-white font-semibold drop-shadow-md">{playerOfTheWeek.stats}</p>
                  </CardContent>
                </Card>

                {/* Team Performance Stats */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-green-600/90 to-green-700/90 backdrop-blur-md text-white">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Team Performance Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {teamStats.map((stat, index) => (
                        <div
                          key={index}
                          className="p-4 border-b border-white/20 last:border-b-0 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-white drop-shadow-md">{stat.team}</p>
                              <p className="text-sm text-white/80">{stat.stat}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white drop-shadow-lg">{stat.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional Statistics */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardHeader className="bg-blue-600/90 backdrop-blur-md text-white">
                  <CardTitle className="text-center">Most Disciplined</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">Phoenix United</h3>
                  <p className="text-white/90 drop-shadow-md">Only 2 yellow cards</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardHeader className="bg-yellow-500/90 backdrop-blur-md text-black">
                  <CardTitle className="text-center">Best Goalkeeper</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">Roberto Martinez</h3>
                  <p className="text-white/90 drop-shadow-md">Thunder FC • 4 clean sheets</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardHeader className="bg-green-600/90 backdrop-blur-md text-white">
                  <CardTitle className="text-center">Most Assists</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">Luis Garcia</h3>
                  <p className="text-white/90 drop-shadow-md">Velocity FC • 8 assists</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Standings Tab */}
        {activeTab === 'standings' && (
          <div className="space-y-8">
            {/* Group Selection */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-xl rounded-lg p-1 shadow-2xl border border-white/20">
                <Button
                  variant={selectedGroup === "all" ? "default" : "ghost"}
                  onClick={() => setSelectedGroup("all")}
                  className={selectedGroup === "all" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  All Groups
                </Button>
                <Button
                  variant={selectedGroup === "A" ? "default" : "ghost"}
                  onClick={() => setSelectedGroup("A")}
                  className={selectedGroup === "A" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  Group A
                </Button>
                <Button
                  variant={selectedGroup === "B" ? "default" : "ghost"}
                  onClick={() => setSelectedGroup("B")}
                  className={selectedGroup === "B" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  Group B
                </Button>
                  </div>
            </div>

            {/* Standings Tables */}
            {selectedGroup === "all" && (
            <div className="grid lg:grid-cols-2 gap-8">
              <StandingsTable standings={groupAStandings} groupName="A" />
              <StandingsTable standings={groupBStandings} groupName="B" />
            </div>
            )}
            {selectedGroup === "A" && <StandingsTable standings={groupAStandings} groupName="A" />}
            {selectedGroup === "B" && <StandingsTable standings={groupBStandings} groupName="B" />}
          </div>
        )}

        {/* Bracket Tab */}
        {activeTab === 'bracket' && (
          <div className="space-y-8">
            {/* Knockout Stage */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-2xl">Knockout Stage</h2>
              <p className="text-lg text-white/90 drop-shadow-xl">Tournament progression and results</p>
              {(!activeSeason || knockoutMatches.quarterfinals.length === 0) && (
                <Badge className="mt-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Design Preview
                </Badge>
              )}
            </div>

            <Bracket 
              knockoutMatches={knockoutMatches}
              groupATeams={groupATeams}
              groupBTeams={groupBTeams}
              activeSeason={activeSeason}
            />
          </div>
        )}

        {/* Fixtures Tab */}
        {activeTab === 'fixtures' && (
          <div className="space-y-8">
            {/* Fixture Type Selection */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-xl rounded-lg p-1 shadow-2xl border border-white/20">
                <Button
                  variant={selectedFixtureTab === "upcoming" ? "default" : "ghost"}
                  onClick={() => setSelectedFixtureTab("upcoming")}
                  className={selectedFixtureTab === "upcoming" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  Upcoming Matches
                </Button>
                <Button
                  variant={selectedFixtureTab === "results" ? "default" : "ghost"}
                  onClick={() => setSelectedFixtureTab("results")}
                  className={selectedFixtureTab === "results" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  Past Results
                </Button>
              </div>
            </div>


            {/* Upcoming Matches */}
            {selectedFixtureTab === "upcoming" && (
              <div className="space-y-3">
                {filteredUpcoming.map((match: any) => (
                  <div 
                    key={match.id} 
                    className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      {/* Teams with logos */}
                      <div className="flex items-center gap-6 flex-1">
                        {/* Team 1 */}
                        <div className="flex items-center gap-3">
                          {match.team1Logo ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
                              <img 
                                src={match.team1Logo} 
                                alt={`${match.team1} Logo`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg flex items-center justify-center border-2 border-white/20 shadow-lg flex-shrink-0">
                              <span className="text-sm font-bold text-white">
                                {match.team1.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="text-white font-semibold">
                            {match.team1}
                          </div>
                        </div>
                        
                        {/* VS */}
                        <div className="text-white/60 font-medium">vs</div>
                        
                        {/* Team 2 */}
                        <div className="flex items-center gap-3">
                          {match.team2Logo ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
                              <img 
                                src={match.team2Logo} 
                                alt={`${match.team2} Logo`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg flex items-center justify-center border-2 border-white/20 shadow-lg flex-shrink-0">
                              <span className="text-sm font-bold text-white">
                                {match.team2.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="text-white font-semibold">
                            {match.team2}
                          </div>
                        </div>
                      </div>
                      
                      {/* Date, Time, Venue */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-white/80">
                            {new Date(match.date).toLocaleDateString('en-US', { 
                              month: 'short',
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="text-xs text-white/60 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {match.time}
                          </div>
                        </div>
                        
                        <Badge 
                          variant="outline"
                          className="text-xs bg-white/10 backdrop-blur-sm text-white border-white/20 px-3 py-1"
                        >
                          {match.venue}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Past Results */}
            {selectedFixtureTab === "results" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((match: any) => (
                  <Card key={match.id} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <Badge variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                          {new Date(match.date).toLocaleDateString()}
                        </Badge>
                        <Badge className="mt-2 bg-blue-600/90 backdrop-blur-md text-white">Group {match.group}</Badge>
                      </div>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            {match.team1Logo ? (
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                                <img 
                                  src={match.team1Logo} 
                                  alt={`${match.team1} Logo`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full flex items-center justify-center border border-white/20">
                                <span className="text-xs font-bold text-white">
                                  {match.team1.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="font-semibold text-white drop-shadow-md">{match.team1}</p>
                          <p className="text-3xl font-bold text-white drop-shadow-lg">{match.score1}</p>
                        </div>
                        <div className="text-center text-sm text-white/80 font-medium">VS</div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            {match.team2Logo ? (
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                                <img 
                                  src={match.team2Logo} 
                                  alt={`${match.team2} Logo`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full flex items-center justify-center border border-white/20">
                                <span className="text-xs font-bold text-white">
                                  {match.team2.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="font-semibold text-white drop-shadow-md">{match.team2}</p>
                          <p className="text-3xl font-bold text-white drop-shadow-lg">{match.score2}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
