"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Trophy, 
  Calendar, 
  Users, 
  Target, 
  MapPin, 
  Clock,
  Edit,
  Trash2,
  Plus,
  Eye,
  MoreHorizontal,
  X,
  RefreshCw,
  AlertCircle,
  ArrowRightLeft as Swap
} from "lucide-react"
import { useSeasons, useSeason, useUpdateSeason, useSeasonGroups, useSeasonTeamStatistics, useCreateGroup, useCreateTeamStatistics, useAddMatchScheduler, useMatchSchedules, useTeamsByIds, useDeleteTeamStatisticsForSeason, useDeleteGroupsForSeason } from '@/hooks/use-seasons'
import { useTeams } from "@/hooks/use-teams"
import Link from "next/link"
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface Season {
  id: string
  name: string
  startDate: string
  EndDate: string
  teams: Record<string | number, string>
}

interface Team {
  id: string
  name: string
  shortname: string
  team_manager: string
  manager?: {
    name: string
    email: string
    phone: string
  }
  players?: Array<{
    id: string
    name: string
    email: string
    phone: string
    gender: string
    dob: string
  }>
}

export default function SeasonDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const seasonId = params.id as string
  
  // Check if seasonId is valid
  if (!seasonId || typeof seasonId !== 'string') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Season ID</h2>
          <p className="text-gray-500">The season ID "{params.id}" is not valid.</p>
          <Button 
            onClick={() => router.push('/admin/season-scheduler')} 
            className="mt-4"
            variant="outline"
          >
            Back to Seasons
          </Button>
        </div>
      </div>
    )
  }
  
  const { season, loading, error, refetch } = useSeason(seasonId)
  
  // Get team IDs from the season
  const seasonTeamIds = React.useMemo(() => {
    if (!season?.teams) return []
    return Object.keys(season.teams)
  }, [season?.teams])
  
  // Fetch only the teams that are part of this season
  const { teams: seasonTeams, loading: teamsLoading, error: teamsError } = useTeamsByIds(seasonTeamIds)
  
  // Get all teams for inviting new ones
  const { teams: allTeams } = useTeams()
  
  const { updateSeason, loading: updateLoading } = useUpdateSeason()
  const { createGroup, loading: createGroupLoading } = useCreateGroup()
  const { deleteTeamStatistics, loading: deleteStatsLoading } = useDeleteTeamStatisticsForSeason()
  const { deleteGroups, loading: deleteGroupsLoading } = useDeleteGroupsForSeason()
  const { createTeamStatistics, loading: createTeamStatsLoading } = useCreateTeamStatistics()
  const { groups: seasonGroups, loading: groupsLoading, error: groupsError, refetch: refetchGroups } = useSeasonGroups(seasonId)
  const { teamStatistics: seasonTeamStatistics, loading: statsLoading, error: statsError, refetch: refetchStats } = useSeasonTeamStatistics(seasonId)
  const { addMatchScheduler, loading: addMatchLoading } = useAddMatchScheduler()
  const { matches: matchSchedules, loading: matchSchedulesLoading, error: matchSchedulesError, refetch: refetchMatchSchedules } = useMatchSchedules()

  // Calculate total teams for overview card
  const totalTeams = seasonTeams.length

  // Get teams that are NOT already in this season and are approved
  const availableTeamsToInvite = React.useMemo(() => {
    if (!allTeams || !season?.teams) return allTeams || []
    
    const seasonTeamIds = Object.keys(season.teams)
    return allTeams.filter((team: any) => {
      // Only use the actual id field from GraphQL response
      const teamId = team.id
      return teamId && 
             !seasonTeamIds.includes(teamId.toString()) && 
             team.approved === true
    })
  }, [allTeams, season?.teams])

  const handleInviteTeams = async () => {
    if (selectedTeamsToInvite.length === 0) {
      alert('Please select at least one team to invite')
      return
    }

    try {
      // Create new teams object with existing teams plus new ones
      const newTeamsObject = { ...season.teams }
      
      selectedTeamsToInvite.forEach(teamId => {
        // Generate a unique token for each new team
        const token = `e${Date.now()}${Math.random().toString(36).substr(2, 9)}`
        newTeamsObject[teamId] = token
      })

      // Validate that all required fields have values
      if (!season.name || !season.startDate || !season.EndDate) {
        alert('Season data is incomplete. Cannot update teams.')
        return
      }
      
      // Update the season in the database
      const result = await updateSeason({
        variables: {
          id: seasonId,
          name: season.name,
          startDate: season.startDate,
          EndDate: season.EndDate,
          teams: newTeamsObject
        }
      })

      if (result.data?.update_seasons_by_pk) {
        // Show success message
        alert(`Successfully invited ${selectedTeamsToInvite.length} team(s) to the season!`)
        
        // Reset and close modal
        setSelectedTeamsToInvite([])
        setIsInviteTeamsModalOpen(false)
        
        // Refetch the season data to show updated teams
        await refetch()
      } else {
        throw new Error('Failed to update season')
      }
      
    } catch (error) {
      alert('Failed to invite teams. Please try again.')
    }
  }

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      alert('Please enter a group name')
      return
    }

    try {
      // Create the group in the database using the simpler mutation
      const result = await createGroup({
        variables: {
          name: newGroupName.trim(),
          season_id: seasonId
        }
      })

      if (result.data?.insert_groups?.affected_rows > 0) {
        // Get the created group ID from the response
        const groupId = result.data.insert_groups.returning[0].id
        
        // Add the group to local state
        const newGroup = {
          id: groupId,
          name: newGroupName.trim(),
          teams: []
        }

        setGroups([...groups, newGroup])
        setNewGroupName("")
        
        toast({
          title: "Success",
          description: `Group "${newGroup.name}" created successfully!`,
        })
        
        // Refetch groups data to ensure consistency
        await refetchGroups()
        
        // Close the modal
        setIsCreateGroupModalOpen(false)
      } else {
        throw new Error('Failed to create group')
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleAddTeamToGroup = async (teamId: string, groupId: string) => {
    try {
      // Create team statistics in the database using the new mutation
      const result = await createTeamStatistics({
        variables: {
          team_id: teamId,
          group_id: groupId,
          season_id: seasonId
        }
      })

      if (result.data?.insert_team_statistics?.affected_rows > 0) {
        // Update local state
        setGroups(groups.map(group => {
          if (group.id === groupId) {
            // Remove team from other groups first
            const otherGroups = groups.filter(g => g.id !== groupId)
            otherGroups.forEach(g => {
              g.teams = g.teams.filter(t => t !== teamId)
            })
            
            // Add team to this group if not already there
            if (!group.teams.includes(teamId)) {
              return { ...group, teams: [...group.teams, teamId] }
            }
          }
          return group
        }))

        toast({
          title: "Success",
          description: "Team added to group successfully!",
        })
        
        // Refetch team statistics to ensure consistency
        await refetchStats()
        
        // Refetch groups to show updated state
        await refetchGroups()
      } else {
        throw new Error('Failed to create team statistics')
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add team to group. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleRemoveTeamFromGroup = (teamId: string, groupId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return { ...group, teams: group.teams.filter(t => t !== teamId) }
      }
      return group
    }))
  }

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('Are you sure you want to delete this group? All teams will be unassigned.')) {
      setGroups(groups.filter(g => g.id !== groupId))
    }
  }

  const getTeamById = (teamId: string | number) => {
    return seasonTeams.find((team: any) => {
      // Only use the actual id field from GraphQL response
      const teamIdFromTeam = team.id
      return teamIdFromTeam && teamIdFromTeam.toString() === teamId.toString()
    })
  }

  const getUnassignedTeams = () => {
    const assignedTeamIds = groups.flatMap(g => g.teams)
    return seasonTeams.filter((team: any) => {
      // Only use the actual id field from GraphQL response
      const teamId = team.id
      return teamId && !assignedTeamIds.includes(teamId)
    })
  }

  const randomizeTeamsIntoGroups = () => {
    if (numberOfGroups < 2) {
      alert('Please create at least 2 groups')
      return
    }

    if (seasonTeams.length === 0) {
      alert('No teams available to randomize')
      return
    }

    // Create group names if they don't exist
    const groupNames = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F']
    
    // Create or use existing groups
    const groupsToUse = groups.length >= numberOfGroups 
      ? groups.slice(0, numberOfGroups)
      : Array.from({ length: numberOfGroups }, (_, index) => ({
          id: `temp-${index}`,
          name: groupNames[index] || `Group ${String.fromCharCode(65 + index)}`,
          teams: []
        }))

    // Shuffle teams randomly
    const shuffledTeams = [...seasonTeams].sort(() => Math.random() - 0.5)
    
    // Distribute teams equally across groups
    const teamsPerGroup = Math.ceil(shuffledTeams.length / numberOfGroups)
    const randomized = groupsToUse.map((group, groupIndex) => {
      const startIndex = groupIndex * teamsPerGroup
      const endIndex = Math.min(startIndex + teamsPerGroup, shuffledTeams.length)
      const groupTeams = shuffledTeams.slice(startIndex, endIndex).map((team: any) => {
        // Only use the actual id field from GraphQL response
        return team.id
      }).filter(Boolean) // Remove any undefined/null values
      
      return {
        ...group,
        teams: groupTeams
      }
    })

    setRandomizedGroups(randomized)
    setIsRandomized(true)
    
    toast({
      title: "Teams Randomized!",
      description: `Teams have been randomly distributed into ${numberOfGroups} groups. Click 'Confirm' to save or make adjustments.`,
    })
  }

  const confirmRandomization = async () => {
    try {
      // If there are existing groups, delete them first (for re-randomization)
      if (seasonGroups.length > 0) {
        toast({
          title: "Re-randomizing groups...",
          description: "Deleting existing groups and creating new ones.",
        })
        
        // First delete team statistics (they reference groups)
        await deleteTeamStatistics({
          variables: { season_id: seasonId }
        })
        
        // Then delete the groups
        await deleteGroups({
          variables: { season_id: seasonId }
        })
        
        // Small delay to ensure database consistency
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      // Save all groups and team statistics to database
      const promises = randomizedGroups.map(async (group) => {
        // Create group first
        const groupResult = await createGroup({
          variables: {
            name: group.name,
            season_id: seasonId
          }
        })

        if (groupResult.data?.insert_groups?.affected_rows > 0) {
          const groupId = groupResult.data.insert_groups.returning[0].id
          
          // Create team statistics for each team in the group
          const teamPromises = group.teams.map(async (teamId) => {
            return createTeamStatistics({
              variables: {
                team_id: teamId,
                group_id: groupId,
                season_id: seasonId
              }
            })
          })

          await Promise.all(teamPromises)
          return { ...group, id: groupId }
        }
        
        throw new Error(`Failed to create group: ${group.name}`)
      })

      const savedGroups = await Promise.all(promises)
      
      // Update local state
      setGroups(savedGroups)
      setRandomizedGroups([])
      setIsRandomized(false)
      
      toast({
        title: "Success!",
        description: seasonGroups.length > 0 
          ? "Groups have been re-randomized and saved to the database!" 
          : "Groups and team assignments have been saved to the database!",
      })
      
      // Refetch data to ensure consistency
      await refetchGroups()
      await refetchStats()
      
      // Close modal
      setIsCreateGroupModalOpen(false)
      
    } catch (error) {
      console.error("Error in confirmRandomization:", error)
      toast({
        title: "Error",
        description: "Failed to save groups. Please try again.",
        variant: "destructive"
      })
    }
  }

  const resetRandomization = () => {
    setRandomizedGroups([])
    setIsRandomized(false)
  }

  const generateWeekendDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const weekends: string[] = []
    
    let current = new Date(start)
    
    while (current <= end) {
      // Check if it's a weekend (Saturday = 6, Sunday = 0)
      if (current.getDay() === 6 || current.getDay() === 0) {
        weekends.push(current.toISOString().split('T')[0])
      }
      current.setDate(current.getDate() + 1)
    }
    
    return weekends
  }
  
  // Function to find the last Saturday within the season dates
  const findLastSaturday = (weekendDates: string[]) => {
    // Find all Saturdays (even indices: 0, 2, 4, 6, ...)
    const saturdays = weekendDates.filter((date, index) => index % 2 === 0)
    return saturdays.length > 0 ? saturdays[saturdays.length - 1] : null
  }
  
  // Function to identify team with lowest stats
  const findTeamWithLowestStats = (teamIds: string[]) => {
    const teamStats = teamIds.map(teamId => {
      const stat = seasonTeamStatistics.find((s: any) => s.team_id === teamId)
      return {
        team_id: teamId,
        points: parseInt(stat?.points || '0'),
        goal_diff: parseInt(stat?.goal_diff || '0'),
        wins: parseInt(stat?.wins || '0')
      }
    })
    
    // Sort by points, goal difference, wins
    teamStats.sort((a, b) => {
      if (a.points !== b.points) return a.points - b.points
      if (a.goal_diff !== b.goal_diff) return a.goal_diff - b.goal_diff
      return a.wins - b.wins
    })
    
    return teamStats[0]?.team_id
  }

  const scheduleMatches = async () => {
    if (!season || seasonGroups.length === 0) {
      toast({
        title: "Groups Required",
        description: "Please create groups first before scheduling matches",
        variant: "destructive"
      })
      return
    }

    setIsScheduling(true)
    
    try {
      // Validate we have exactly 2 groups
      if (seasonGroups.length !== 2) {
        toast({
          title: "Invalid Group Structure",
          description: "This format requires exactly 2 groups",
          variant: "destructive"
        })
        return
      }

      const groupA = seasonGroups[0]
      const groupB = seasonGroups[1]

      // Get all teams from both groups
      const allTeams = seasonTeamStatistics
        .map((stat: any) => {
          const team = getTeamById(stat.team_id)
          return {
          team_id: stat.team_id,
            teamName: team?.name || `Team ${stat.team_id}`,
            groupId: stat.group_id,
            groupName: stat.group_id === groupA.id ? groupA.name : groupB.name
          }
        })

      const totalTeams = allTeams.length
      
      // Validate we have teams
      if (totalTeams === 0) {
        toast({
          title: "Invalid Team Distribution",
          description: "No teams available to schedule",
          variant: "destructive"
        })
        return
      }

      // Identify special teams (case-insensitive, handle variations)
      const titansFC = allTeams.find((t: any) => {
        const name = t.teamName.toLowerCase().trim()
        return name.includes("titan's fc") || 
               name.includes("titans fc") ||
               name === "titan's fc" ||
               name === "titans fc"
      })
      const aceTitans = allTeams.find((t: any) => {
        const name = t.teamName.toLowerCase().trim()
        return name.includes("ace titans") || name === "ace titans"
      })

      const weekendDates = generateWeekendDates(season.startDate, season.EndDate)
      const totalWeekends = weekendDates.length
      
      if (totalWeekends < 4) {
        toast({
          title: "Season Too Short",
          description: "Season must be at least 4 weeks long to schedule matches",
          variant: "destructive"
        })
        return
      }

      const defaultVenue = "Prime Arena"
      const matches = []

      // Calculate available weekends for scheduling
      const numWeekends = Math.ceil(totalWeekends / 2) // Each weekend has Sat + Sun
      const weekendsToSchedule = Math.min(4, numWeekends)

      // Generate all possible matchups within each group
      const groupATeams = allTeams.filter((t: any) => t.groupId === groupA.id)
      const groupBTeams = allTeams.filter((t: any) => t.groupId === groupB.id)
      
      // Generate matchups for both groups
      const allMatchups: Array<{
        team1_id: string
        team2_id: string
        team1Name: string
        team2Name: string
        groupId: string
        groupName: string
      }> = []
      
      // Group A matchups
      for (let i = 0; i < groupATeams.length; i++) {
        for (let j = i + 1; j < groupATeams.length; j++) {
          allMatchups.push({
            team1_id: groupATeams[i].team_id,
            team2_id: groupATeams[j].team_id,
            team1Name: groupATeams[i].teamName,
            team2Name: groupATeams[j].teamName,
            groupId: groupA.id,
            groupName: groupA.name
          })
        }
      }

      // Group B matchups
      for (let i = 0; i < groupBTeams.length; i++) {
        for (let j = i + 1; j < groupBTeams.length; j++) {
          allMatchups.push({
            team1_id: groupBTeams[i].team_id,
            team2_id: groupBTeams[j].team_id,
            team1Name: groupBTeams[i].teamName,
            team2Name: groupBTeams[j].teamName,
            groupId: groupB.id,
            groupName: groupB.name
          })
        }
      }

      // Shuffle all matchups for randomness
      const shuffledMatchups = [...allMatchups].sort(() => Math.random() - 0.5)
      
      // Helper function to check if team can play on a specific day
      const canPlayOnDay = (teamId: string, day: 'Saturday' | 'Sunday', isLastSaturday: boolean) => {
        if (isLastSaturday) return true // All teams can play on last Saturday
        const team = allTeams.find((t: any) => t.team_id === teamId)
        if (!team) return true
        
        // Titan's FC only plays on Sundays (except last Saturday)
        if (titansFC && teamId === titansFC.team_id) {
          return day === 'Sunday'
        }
        
        // Ace titans only plays on Saturdays
        if (aceTitans && teamId === aceTitans.team_id) {
          return day === 'Saturday'
        }
        
        return true
      }
      
      // Track opponents per team per weekend to avoid repeats in consecutive weekends
      const opponentsPerWeekend = new Map<number, Map<string, Set<string>>>()
      
      // Track ALL matchups across the entire season to prevent teams playing each other too many times
      const seasonMatchups = new Set<string>() // Store as "team1_id:team2_id" (sorted for consistency)
      
      // Helper to create matchup key (always sorted for consistency)
      const getMatchupKey = (team1Id: string, team2Id: string): string => {
        return team1Id < team2Id ? `${team1Id}:${team2Id}` : `${team2Id}:${team1Id}`
      }
      
      // Helper to check if teams have already played each other in the season
      const havePlayedInSeason = (team1Id: string, team2Id: string): boolean => {
        const key = getMatchupKey(team1Id, team2Id)
        return seasonMatchups.has(key)
      }
      
      // Helper to mark matchup as played in season
      const markMatchupPlayed = (team1Id: string, team2Id: string) => {
        const key = getMatchupKey(team1Id, team2Id)
        seasonMatchups.add(key)
      }
      
      // Helper to check how many times teams have played in season
      const getMatchupCount = (team1Id: string, team2Id: string): number => {
        const key = getMatchupKey(team1Id, team2Id)
        // Count occurrences (since Set only has one, we track separately if needed)
        // For now, just check if it exists (1 time) - we can enhance later
        return seasonMatchups.has(key) ? 1 : 0
      }
      
      // Helper to check if teams played in previous weekend
      const playedInPreviousWeekend = (team1Id: string, team2Id: string, weekend: number) => {
        if (weekend === 1) return false
        const prevWeekend = weekend - 1
        const prevOpponents = opponentsPerWeekend.get(prevWeekend)
        if (!prevOpponents) return false
        
        const team1Opponents = prevOpponents.get(team1Id)
        const team2Opponents = prevOpponents.get(team2Id)
        
        return (team1Opponents?.has(team2Id)) || (team2Opponents?.has(team1Id))
      }
      
      // Helper to find valid matchup for a day
      const findValidMatchup = (
        day: 'Saturday' | 'Sunday',
        weekend: number,
        teamsPlayedToday: Set<string>,
        isLastSaturday: boolean,
        matchupIndex: number
      ) => {
        // Try to find a matchup where:
        // 1. Both teams can play on this day
        // 2. Neither team has played today
        // 3. Teams didn't play each other in previous weekend (if weekend > 1)
        // 4. Teams haven't played each other in the season yet (PREFERRED)
        // 5. For 7 teams, we allow one team to play twice but not same opponent
        
        let attempts = 0
        const maxAttempts = shuffledMatchups.length * 3
        
        // First pass: Prefer matchups that haven't happened in the season
        while (attempts < maxAttempts) {
          const index = (matchupIndex + attempts) % shuffledMatchups.length
          const matchup = shuffledMatchups[index]
          
          const team1CanPlay = canPlayOnDay(matchup.team1_id, day, isLastSaturday)
          const team2CanPlay = canPlayOnDay(matchup.team2_id, day, isLastSaturday)
          const team1NotPlayed = !teamsPlayedToday.has(matchup.team1_id)
          const team2NotPlayed = !teamsPlayedToday.has(matchup.team2_id)
          const notPlayedLastWeekend = !playedInPreviousWeekend(matchup.team1_id, matchup.team2_id, weekend)
          const notPlayedInSeason = !havePlayedInSeason(matchup.team1_id, matchup.team2_id)
          
          // PREFERRED: Matchup that hasn't happened in season
          if (totalTeams === 7) {
            if (team1CanPlay && team2CanPlay) {
              if (team1NotPlayed && team2NotPlayed && notPlayedLastWeekend && notPlayedInSeason) {
                return { matchup, index }
              }
            }
          } else {
            // For 8 teams, both teams must not have played
            if (team1CanPlay && team2CanPlay && team1NotPlayed && team2NotPlayed && notPlayedLastWeekend && notPlayedInSeason) {
              return { matchup, index }
            }
          }
          
          attempts++
        }
        
        // Second pass: Allow matchups that played in season but not last weekend
        attempts = 0
        while (attempts < shuffledMatchups.length * 2) {
          const index = (matchupIndex + attempts) % shuffledMatchups.length
          const matchup = shuffledMatchups[index]
          
          const team1CanPlay = canPlayOnDay(matchup.team1_id, day, isLastSaturday)
          const team2CanPlay = canPlayOnDay(matchup.team2_id, day, isLastSaturday)
          const team1NotPlayed = !teamsPlayedToday.has(matchup.team1_id)
          const team2NotPlayed = !teamsPlayedToday.has(matchup.team2_id)
          const notPlayedLastWeekend = !playedInPreviousWeekend(matchup.team1_id, matchup.team2_id, weekend)
          
          // Relaxed: Allow even if played in season, but not last weekend
          if (totalTeams === 7) {
            if (team1CanPlay && team2CanPlay) {
              if (team1NotPlayed && team2NotPlayed && notPlayedLastWeekend) {
                return { matchup, index }
              }
            }
          } else {
            if (team1CanPlay && team2CanPlay && team1NotPlayed && team2NotPlayed && notPlayedLastWeekend) {
              return { matchup, index }
            }
          }
          
          attempts++
        }
        
        // Final pass: Last resort - allow any valid matchup (relax all constraints except day restrictions)
        attempts = 0
        while (attempts < shuffledMatchups.length) {
          const index = (matchupIndex + attempts) % shuffledMatchups.length
          const matchup = shuffledMatchups[index]
          
          const team1CanPlay = canPlayOnDay(matchup.team1_id, day, isLastSaturday)
          const team2CanPlay = canPlayOnDay(matchup.team2_id, day, isLastSaturday)
          const team1NotPlayed = !teamsPlayedToday.has(matchup.team1_id)
          const team2NotPlayed = !teamsPlayedToday.has(matchup.team2_id)
          
          if (totalTeams === 7) {
            if (team1CanPlay && team2CanPlay && team1NotPlayed && team2NotPlayed) {
              return { matchup, index }
            }
          } else {
            if (team1CanPlay && team2CanPlay && team1NotPlayed && team2NotPlayed) {
              return { matchup, index }
            }
          }
          
          attempts++
        }
        
        return null
      }
      
      // Track games per team
      const teamGameCounts = new Map<string, number>()
      allTeams.forEach((team: any) => teamGameCounts.set(team.team_id, 0))
      
      // For 7 teams: Track which team played twice each weekend (for rotation fairness)
      const teamsPlayedTwicePerWeekend = new Map<number, string>()
      
      let matchupIndex = 0
      const lastSaturday = findLastSaturday(weekendDates)
      
      // Helper to find which team should play twice this weekend (rotate fairly)
      // Excludes Titan's FC (Sunday only) and Ace titans (Saturday only) since they can't play both days
      const getTeamToPlayTwice = (weekend: number): string | null => {
        if (totalTeams !== 7) return null
        
        // Get available teams (exclude special teams that can only play one day)
        const availableTeams = allTeams.filter((t: any) => {
          const teamId = t.team_id
          // Exclude Titan's FC (can only play Sunday, so can't play twice Sat+Sun)
          if (titansFC && teamId === titansFC.team_id) return false
          // Exclude Ace titans (can only play Saturday, so can't play twice Sat+Sun)
          if (aceTitans && teamId === aceTitans.team_id) return false
          return true
        })
        
        if (availableTeams.length === 0) {
          // If no available teams (unlikely), return null
          return null
        }
        
        // For first weekend, start with first available team
        if (weekend === 1) {
          return availableTeams[0].team_id
        }
        
        // For subsequent weekends, rotate through available teams
        const prevWeekend = weekend - 1
        const prevTeamPlayedTwice = teamsPlayedTwicePerWeekend.get(prevWeekend)
        
        if (prevTeamPlayedTwice) {
          // Find the index of the previous team in available teams
          const prevIndex = availableTeams.findIndex((t: any) => t.team_id === prevTeamPlayedTwice)
          if (prevIndex !== -1) {
            // Rotate to next available team
            const nextIndex = (prevIndex + 1) % availableTeams.length
            return availableTeams[nextIndex].team_id
          }
        }
        
        // Fallback: rotate through available teams based on weekend number
        return availableTeams[(weekend - 1) % availableTeams.length].team_id
      }
      
      // Schedule matches for weekends 1-3
      for (let weekend = 1; weekend <= weekendsToSchedule - 1; weekend++) {
        const saturdayIndex = (weekend - 1) * 2
        const sundayIndex = (weekend - 1) * 2 + 1
        
        if (saturdayIndex < weekendDates.length && sundayIndex < weekendDates.length) {
          const saturday = weekendDates[saturdayIndex]
          const sunday = weekendDates[sundayIndex]
          const isLastSat = saturday === lastSaturday
          
          // Initialize opponent tracking for this weekend
          const weekendOpponents = new Map<string, Set<string>>()
          allTeams.forEach((team: any) => weekendOpponents.set(team.team_id, new Set()))
          
          // Saturday: 4 teams play (2 games)
          const saturdayTeams = new Set<string>()
          const saturdayMatches: any[] = []
          
          if (totalTeams === 8) {
            // Need exactly 4 teams to play
          for (let game = 0; game < 2; game++) {
              const result = findValidMatchup('Saturday', weekend, saturdayTeams, isLastSat, matchupIndex)
              if (result) {
                const { matchup, index } = result
                matchupIndex = (index + 1) % shuffledMatchups.length
                
                saturdayTeams.add(matchup.team1_id)
                saturdayTeams.add(matchup.team2_id)
                weekendOpponents.get(matchup.team1_id)?.add(matchup.team2_id)
                weekendOpponents.get(matchup.team2_id)?.add(matchup.team1_id)
                
                // Mark this matchup as played in the season
                markMatchupPlayed(matchup.team1_id, matchup.team2_id)
                
                saturdayMatches.push({
                  id: `match-${Date.now()}-w${weekend}-sat-${game}`,
                  team1_id: matchup.team1_id,
                  team2_id: matchup.team2_id,
                  date: saturday,
                  time: '',
                  group_id: matchup.groupId,
                  venue: defaultVenue,
                  status: 'scheduled',
                  weekend: weekend,
                  day: 'Saturday',
                  groupName: matchup.groupName,
                  type: 'group-stage' as const
                })
                
                teamGameCounts.set(matchup.team1_id, (teamGameCounts.get(matchup.team1_id) || 0) + 1)
                teamGameCounts.set(matchup.team2_id, (teamGameCounts.get(matchup.team2_id) || 0) + 1)
              }
            }
          } else if (totalTeams === 7) {
            // 7 teams: ONE team plays twice (Saturday + Sunday), rotating each weekend
            // Saturday: EXACTLY 2 games = 4 teams play (one will also play Sunday)
            // Sunday: EXACTLY 2 games = 4 teams play (one already played Saturday, three did NOT)
            // CRITICAL: Teams that play Saturday (except the designated one) MUST NOT play Sunday
            const teamToPlayTwice = getTeamToPlayTwice(weekend)
            
            // Saturday: Schedule EXACTLY 2 games
            // Ensure the designated team plays on Saturday
            let saturdayGamesScheduled = 0
            const saturdayTarget = 2
            let designatedTeamScheduled = false
            
            // Step 1: Try to schedule the designated team first
            if (teamToPlayTwice && canPlayOnDay(teamToPlayTwice, 'Saturday', isLastSat)) {
              let attempts = 0
              while (attempts < shuffledMatchups.length * 2 && !designatedTeamScheduled && saturdayGamesScheduled < saturdayTarget) {
                const index = (matchupIndex + attempts) % shuffledMatchups.length
                const matchup = shuffledMatchups[index]
                
                if (matchup.team1_id === teamToPlayTwice || matchup.team2_id === teamToPlayTwice) {
                  const opponentId = matchup.team1_id === teamToPlayTwice ? matchup.team2_id : matchup.team1_id
                  
                  if (!saturdayTeams.has(opponentId) && 
                      canPlayOnDay(opponentId, 'Saturday', isLastSat) &&
                      !playedInPreviousWeekend(teamToPlayTwice, opponentId, weekend)) {
                    designatedTeamScheduled = true
                    matchupIndex = (index + 1) % shuffledMatchups.length
                    
                    saturdayTeams.add(teamToPlayTwice)
                    saturdayTeams.add(opponentId)
                    weekendOpponents.get(teamToPlayTwice)?.add(opponentId)
                    weekendOpponents.get(opponentId)?.add(teamToPlayTwice)
                    
                    // Mark this matchup as played in the season
                    markMatchupPlayed(matchup.team1_id, matchup.team2_id)
                    
                    saturdayMatches.push({
                      id: `match-${Date.now()}-w${weekend}-sat-${saturdayGamesScheduled}`,
                      team1_id: matchup.team1_id,
                      team2_id: matchup.team2_id,
                      date: saturday,
                      time: '',
                      group_id: matchup.groupId,
                      venue: defaultVenue,
                      status: 'scheduled',
                      weekend: weekend,
                      day: 'Saturday',
                      groupName: matchup.groupName,
                      type: 'group-stage' as const
                    })
                    
                    teamGameCounts.set(matchup.team1_id, (teamGameCounts.get(matchup.team1_id) || 0) + 1)
                    teamGameCounts.set(matchup.team2_id, (teamGameCounts.get(matchup.team2_id) || 0) + 1)
                    saturdayGamesScheduled++
                  }
                }
                attempts++
              }
            }
            
            // Step 2: Schedule remaining Saturday games (must have 2 total)
            while (saturdayGamesScheduled < saturdayTarget) {
              let foundMatch = false
              let attempts = 0
              const maxAttempts = shuffledMatchups.length * 3
              
              while (attempts < maxAttempts && !foundMatch) {
                const index = (matchupIndex + attempts) % shuffledMatchups.length
                const matchup = shuffledMatchups[index]
                
                const team1CanPlay = canPlayOnDay(matchup.team1_id, 'Saturday', isLastSat)
                const team2CanPlay = canPlayOnDay(matchup.team2_id, 'Saturday', isLastSat)
                const team1NotPlayed = !saturdayTeams.has(matchup.team1_id)
                const team2NotPlayed = !saturdayTeams.has(matchup.team2_id)
                const notPlayedLastWeekend = !playedInPreviousWeekend(matchup.team1_id, matchup.team2_id, weekend)
                
                // Both teams must be available and not have played today
                if (team1CanPlay && team2CanPlay && team1NotPlayed && team2NotPlayed && notPlayedLastWeekend) {
                  foundMatch = true
                  matchupIndex = (index + 1) % shuffledMatchups.length
                  
                  saturdayTeams.add(matchup.team1_id)
                  saturdayTeams.add(matchup.team2_id)
                  weekendOpponents.get(matchup.team1_id)?.add(matchup.team2_id)
                  weekendOpponents.get(matchup.team2_id)?.add(matchup.team1_id)
                  
                  // Mark this matchup as played in the season
                  markMatchupPlayed(matchup.team1_id, matchup.team2_id)
                  
                  saturdayMatches.push({
                    id: `match-${Date.now()}-w${weekend}-sat-${saturdayGamesScheduled}`,
                    team1_id: matchup.team1_id,
                    team2_id: matchup.team2_id,
                    date: saturday,
                    time: '',
                    group_id: matchup.groupId,
                    venue: defaultVenue,
                    status: 'scheduled',
                    weekend: weekend,
                    day: 'Saturday',
                    groupName: matchup.groupName,
                    type: 'group-stage' as const
                  })
                  
                  teamGameCounts.set(matchup.team1_id, (teamGameCounts.get(matchup.team1_id) || 0) + 1)
                  teamGameCounts.set(matchup.team2_id, (teamGameCounts.get(matchup.team2_id) || 0) + 1)
                  saturdayGamesScheduled++
                }
                
                attempts++
              }
              
              if (!foundMatch) {
                // If we can't find a match with all constraints, we must still schedule
                // Try with relaxed constraints
                attempts = 0
                while (attempts < shuffledMatchups.length && !foundMatch) {
                  const index = (matchupIndex + attempts) % shuffledMatchups.length
                  const matchup = shuffledMatchups[index]
                  
                  const team1CanPlay = canPlayOnDay(matchup.team1_id, 'Saturday', isLastSat)
                  const team2CanPlay = canPlayOnDay(matchup.team2_id, 'Saturday', isLastSat)
                  const team1NotPlayed = !saturdayTeams.has(matchup.team1_id)
                  const team2NotPlayed = !saturdayTeams.has(matchup.team2_id)
                  
                  if (team1CanPlay && team2CanPlay && team1NotPlayed && team2NotPlayed) {
                    foundMatch = true
                    matchupIndex = (index + 1) % shuffledMatchups.length
                    
                    saturdayTeams.add(matchup.team1_id)
                    saturdayTeams.add(matchup.team2_id)
                    weekendOpponents.get(matchup.team1_id)?.add(matchup.team2_id)
                    weekendOpponents.get(matchup.team2_id)?.add(matchup.team1_id)
                    
                    // Mark this matchup as played in the season
                    markMatchupPlayed(matchup.team1_id, matchup.team2_id)
                    
                    saturdayMatches.push({
                      id: `match-${Date.now()}-w${weekend}-sat-${saturdayGamesScheduled}`,
                      team1_id: matchup.team1_id,
                      team2_id: matchup.team2_id,
                      date: saturday,
                      time: '',
                      group_id: matchup.groupId,
                      venue: defaultVenue,
                      status: 'scheduled',
                      weekend: weekend,
                      day: 'Saturday',
                      groupName: matchup.groupName,
                      type: 'group-stage' as const
                    })
                    
                    teamGameCounts.set(matchup.team1_id, (teamGameCounts.get(matchup.team1_id) || 0) + 1)
                    teamGameCounts.set(matchup.team2_id, (teamGameCounts.get(matchup.team2_id) || 0) + 1)
                    saturdayGamesScheduled++
                  }
                  attempts++
                }
              }
              
              if (!foundMatch) {
                // Last resort: we absolutely need 2 games, create one from available teams
                const availableTeams = allTeams.filter((t: any) => 
                  !saturdayTeams.has(t.team_id) && canPlayOnDay(t.team_id, 'Saturday', isLastSat)
                )
                
                if (availableTeams.length >= 2) {
                  // Create a match between first two available teams
                  const team1 = availableTeams[0]
                  const team2 = availableTeams[1]
                  
                  saturdayTeams.add(team1.team_id)
                  saturdayTeams.add(team2.team_id)
                  weekendOpponents.get(team1.team_id)?.add(team2.team_id)
                  weekendOpponents.get(team2.team_id)?.add(team1.team_id)
                  
                  // Mark this matchup as played in the season
                  markMatchupPlayed(team1.team_id, team2.team_id)
                  
                  saturdayMatches.push({
                    id: `match-${Date.now()}-w${weekend}-sat-${saturdayGamesScheduled}`,
                    team1_id: team1.team_id,
                    team2_id: team2.team_id,
                  date: saturday,
                time: '',
                    group_id: team1.groupId,
                  venue: defaultVenue,
                  status: 'scheduled',
                weekend: weekend,
                  day: 'Saturday',
                    groupName: team1.groupName,
                type: 'group-stage' as const
              })
              
                  teamGameCounts.set(team1.team_id, (teamGameCounts.get(team1.team_id) || 0) + 1)
                  teamGameCounts.set(team2.team_id, (teamGameCounts.get(team2.team_id) || 0) + 1)
                  saturdayGamesScheduled++
                  foundMatch = true
                }
              }
              
              if (!foundMatch) break
            }
            
            // Store which team played twice for this weekend
            if (teamToPlayTwice && designatedTeamScheduled) {
              teamsPlayedTwicePerWeekend.set(weekend, teamToPlayTwice)
            }
          }
          
          matches.push(...saturdayMatches)
          
          // Sunday: 4 different teams play (2 games)
          const sundayTeams = new Set<string>()
          const sundayMatches: any[] = []
          
          if (totalTeams === 8) {
            // Need exactly 4 different teams (not from Saturday)
          for (let game = 0; game < 2; game++) {
              const result = findValidMatchup('Sunday', weekend, sundayTeams, false, matchupIndex)
              if (result) {
                const { matchup, index } = result
                // Ensure these teams didn't play on Saturday
                if (!saturdayTeams.has(matchup.team1_id) && !saturdayTeams.has(matchup.team2_id)) {
                  matchupIndex = (index + 1) % shuffledMatchups.length
                  
                  sundayTeams.add(matchup.team1_id)
                  sundayTeams.add(matchup.team2_id)
                  weekendOpponents.get(matchup.team1_id)?.add(matchup.team2_id)
                  weekendOpponents.get(matchup.team2_id)?.add(matchup.team1_id)
                  
                  // Mark this matchup as played in the season
                  markMatchupPlayed(matchup.team1_id, matchup.team2_id)
                  
                  sundayMatches.push({
                    id: `match-${Date.now()}-w${weekend}-sun-${game}`,
                    team1_id: matchup.team1_id,
                    team2_id: matchup.team2_id,
                    date: sunday,
                    time: '',
                    group_id: matchup.groupId,
                    venue: defaultVenue,
                    status: 'scheduled',
                    weekend: weekend,
                    day: 'Sunday',
                    groupName: matchup.groupName,
                    type: 'group-stage' as const
                  })
                  
                  teamGameCounts.set(matchup.team1_id, (teamGameCounts.get(matchup.team1_id) || 0) + 1)
                  teamGameCounts.set(matchup.team2_id, (teamGameCounts.get(matchup.team2_id) || 0) + 1)
                } else {
                  // Skip this matchup and try next
                  matchupIndex = (index + 1) % shuffledMatchups.length
                  game-- // Retry this game
                }
              }
            }
          } else if (totalTeams === 7) {
            // 7 teams: Sunday scheduling
            // CRITICAL RULE: Teams that played Saturday (except the designated team) MUST NOT play Sunday
            // Sunday: EXACTLY 2 games = 4 teams total
            // - The designated team (who played Saturday) MUST play
            // - The other 3 teams MUST NOT have played Saturday
            const teamToPlayTwice = getTeamToPlayTwice(weekend)
            let sundayGamesScheduled = 0
            const sundayTarget = 2
            let designatedTeamPlayedSunday = false
            
            // Step 1: Schedule the designated team's game (it played Saturday, now plays Sunday)
            // We MUST schedule this game - it's critical for 7-team logic
            if (teamToPlayTwice && saturdayTeams.has(teamToPlayTwice) && canPlayOnDay(teamToPlayTwice, 'Sunday', false)) {
              // Try with strict constraints first
              let attempts = 0
              const maxAttempts = shuffledMatchups.length * 3
              
              while (attempts < maxAttempts && !designatedTeamPlayedSunday) {
                const index = (matchupIndex + attempts) % shuffledMatchups.length
                const matchup = shuffledMatchups[index]
                
                if (matchup.team1_id === teamToPlayTwice || matchup.team2_id === teamToPlayTwice) {
                  const opponentId = matchup.team1_id === teamToPlayTwice ? matchup.team2_id : matchup.team1_id
                  
                  // STRICT: Opponent MUST NOT have played Saturday (except the designated team)
                  const opponentNotPlayedSaturday = !saturdayTeams.has(opponentId)
                  const opponentCanPlay = canPlayOnDay(opponentId, 'Sunday', false)
                  const opponentNotPlayedSunday = !sundayTeams.has(opponentId)
                  const notPlayedLastWeekend = !playedInPreviousWeekend(teamToPlayTwice, opponentId, weekend)
                  
                  if (opponentNotPlayedSaturday && opponentCanPlay && opponentNotPlayedSunday && notPlayedLastWeekend) {
                    designatedTeamPlayedSunday = true
                    matchupIndex = (index + 1) % shuffledMatchups.length
                    
                    sundayTeams.add(teamToPlayTwice)
                    sundayTeams.add(opponentId)
                    weekendOpponents.get(teamToPlayTwice)?.add(opponentId)
                    weekendOpponents.get(opponentId)?.add(teamToPlayTwice)
                    
                    // Mark this matchup as played in the season
                    markMatchupPlayed(matchup.team1_id, matchup.team2_id)
                    
                    sundayMatches.push({
                      id: `match-${Date.now()}-w${weekend}-sun-${sundayGamesScheduled}`,
                      team1_id: matchup.team1_id,
                      team2_id: matchup.team2_id,
                      date: sunday,
                      time: '',
                      group_id: matchup.groupId,
                      venue: defaultVenue,
                      status: 'scheduled',
                      weekend: weekend,
                      day: 'Sunday',
                      groupName: matchup.groupName,
                      type: 'group-stage' as const
                    })
                    
                    teamGameCounts.set(matchup.team1_id, (teamGameCounts.get(matchup.team1_id) || 0) + 1)
                    teamGameCounts.set(matchup.team2_id, (teamGameCounts.get(matchup.team2_id) || 0) + 1)
                    sundayGamesScheduled++
                    teamsPlayedTwicePerWeekend.set(weekend, teamToPlayTwice)
                  }
                }
                attempts++
              }
              
              // Fallback: If strict constraints didn't work, relax the "last weekend" constraint
              if (!designatedTeamPlayedSunday) {
                attempts = 0
                while (attempts < shuffledMatchups.length * 2 && !designatedTeamPlayedSunday) {
                  const index = (matchupIndex + attempts) % shuffledMatchups.length
                  const matchup = shuffledMatchups[index]
                  
                  if (matchup.team1_id === teamToPlayTwice || matchup.team2_id === teamToPlayTwice) {
                    const opponentId = matchup.team1_id === teamToPlayTwice ? matchup.team2_id : matchup.team1_id
                    
                    const opponentNotPlayedSaturday = !saturdayTeams.has(opponentId)
                    const opponentCanPlay = canPlayOnDay(opponentId, 'Sunday', false)
                    const opponentNotPlayedSunday = !sundayTeams.has(opponentId)
                    
                    // Relaxed: allow even if played last weekend
                    if (opponentNotPlayedSaturday && opponentCanPlay && opponentNotPlayedSunday) {
                      designatedTeamPlayedSunday = true
                      matchupIndex = (index + 1) % shuffledMatchups.length
                      
                      sundayTeams.add(teamToPlayTwice)
                      sundayTeams.add(opponentId)
                      weekendOpponents.get(teamToPlayTwice)?.add(opponentId)
                      weekendOpponents.get(opponentId)?.add(teamToPlayTwice)
                      
                      sundayMatches.push({
                        id: `match-${Date.now()}-w${weekend}-sun-${sundayGamesScheduled}`,
                        team1_id: matchup.team1_id,
                        team2_id: matchup.team2_id,
                        date: sunday,
                        time: '',
                        group_id: matchup.groupId,
                        venue: defaultVenue,
                        status: 'scheduled',
                        weekend: weekend,
                        day: 'Sunday',
                        groupName: matchup.groupName,
                        type: 'group-stage' as const
                      })
                      
                      teamGameCounts.set(matchup.team1_id, (teamGameCounts.get(matchup.team1_id) || 0) + 1)
                      teamGameCounts.set(matchup.team2_id, (teamGameCounts.get(matchup.team2_id) || 0) + 1)
                      sundayGamesScheduled++
                      teamsPlayedTwicePerWeekend.set(weekend, teamToPlayTwice)
                    }
                  }
                  attempts++
                }
              }
              
              // Last resort: Find ANY team that didn't play Saturday to pair with designated team
              if (!designatedTeamPlayedSunday) {
                const availableOpponents = allTeams.filter((t: any) => 
                  t.team_id !== teamToPlayTwice &&
                  !saturdayTeams.has(t.team_id) && 
                  !sundayTeams.has(t.team_id) && 
                  canPlayOnDay(t.team_id, 'Sunday', false)
                )
                
                if (availableOpponents.length > 0) {
                  const opponent = availableOpponents[0]
                  designatedTeamPlayedSunday = true
                  
                  sundayTeams.add(teamToPlayTwice)
                  sundayTeams.add(opponent.team_id)
                  weekendOpponents.get(teamToPlayTwice)?.add(opponent.team_id)
                  weekendOpponents.get(opponent.team_id)?.add(teamToPlayTwice)
                  
                  sundayMatches.push({
                    id: `match-${Date.now()}-w${weekend}-sun-${sundayGamesScheduled}`,
                    team1_id: teamToPlayTwice,
                    team2_id: opponent.team_id,
                    date: sunday,
                    time: '',
                    group_id: opponent.groupId,
                    venue: defaultVenue,
                    status: 'scheduled',
                    weekend: weekend,
                    day: 'Sunday',
                    groupName: opponent.groupName,
                    type: 'group-stage' as const
                  })
                  
                  teamGameCounts.set(teamToPlayTwice, (teamGameCounts.get(teamToPlayTwice) || 0) + 1)
                  teamGameCounts.set(opponent.team_id, (teamGameCounts.get(opponent.team_id) || 0) + 1)
                  sundayGamesScheduled++
                  teamsPlayedTwicePerWeekend.set(weekend, teamToPlayTwice)
                }
              }
            }
            
            // Step 2: Schedule the second game with teams that did NOT play Saturday
            // STRICT: Both teams in this match MUST NOT have played Saturday
            while (sundayGamesScheduled < sundayTarget) {
              let foundMatch = false
              let attempts = 0
              const maxAttempts = shuffledMatchups.length * 3
              
              while (attempts < maxAttempts && !foundMatch) {
                const index = (matchupIndex + attempts) % shuffledMatchups.length
                const matchup = shuffledMatchups[index]
                
                // STRICT CHECK: Both teams MUST NOT have played Saturday
                const team1NotPlayedSat = !saturdayTeams.has(matchup.team1_id)
                const team2NotPlayedSat = !saturdayTeams.has(matchup.team2_id)
                const team1NotPlayedSun = !sundayTeams.has(matchup.team1_id)
                const team2NotPlayedSun = !sundayTeams.has(matchup.team2_id)
                const team1CanPlay = canPlayOnDay(matchup.team1_id, 'Sunday', false)
                const team2CanPlay = canPlayOnDay(matchup.team2_id, 'Sunday', false)
                const notPlayedLastWeekend = !playedInPreviousWeekend(matchup.team1_id, matchup.team2_id, weekend)
                
                // CRITICAL: Both teams must NOT have played Saturday
                if (team1NotPlayedSat && team2NotPlayedSat && 
                    team1NotPlayedSun && team2NotPlayedSun &&
                    team1CanPlay && team2CanPlay && notPlayedLastWeekend) {
                  foundMatch = true
                  matchupIndex = (index + 1) % shuffledMatchups.length
                  
                  sundayTeams.add(matchup.team1_id)
                  sundayTeams.add(matchup.team2_id)
                  weekendOpponents.get(matchup.team1_id)?.add(matchup.team2_id)
                  weekendOpponents.get(matchup.team2_id)?.add(matchup.team1_id)
                  
                  sundayMatches.push({
                    id: `match-${Date.now()}-w${weekend}-sun-${sundayGamesScheduled}`,
                    team1_id: matchup.team1_id,
                    team2_id: matchup.team2_id,
                    date: sunday,
                    time: '',
                    group_id: matchup.groupId,
                    venue: defaultVenue,
                    status: 'scheduled',
                    weekend: weekend,
                    day: 'Sunday',
                    groupName: matchup.groupName,
                    type: 'group-stage' as const
                  })
                  
                  teamGameCounts.set(matchup.team1_id, (teamGameCounts.get(matchup.team1_id) || 0) + 1)
                  teamGameCounts.set(matchup.team2_id, (teamGameCounts.get(matchup.team2_id) || 0) + 1)
                  sundayGamesScheduled++
                }
                
                attempts++
              }
              
              // If strict constraints don't work, relax only the "last weekend" constraint
              if (!foundMatch && sundayGamesScheduled < sundayTarget) {
                attempts = 0
                while (attempts < shuffledMatchups.length * 2 && !foundMatch) {
                  const index = (matchupIndex + attempts) % shuffledMatchups.length
                  const matchup = shuffledMatchups[index]
                  
                  // STILL STRICT: Both teams must NOT have played Saturday
                  const team1NotPlayedSat = !saturdayTeams.has(matchup.team1_id)
                  const team2NotPlayedSat = !saturdayTeams.has(matchup.team2_id)
                  const team1NotPlayedSun = !sundayTeams.has(matchup.team1_id)
                  const team2NotPlayedSun = !sundayTeams.has(matchup.team2_id)
                  const team1CanPlay = canPlayOnDay(matchup.team1_id, 'Sunday', false)
                  const team2CanPlay = canPlayOnDay(matchup.team2_id, 'Sunday', false)
                  
                  // Relaxed: allow even if played last weekend, but STILL must not have played Saturday
                  if (team1NotPlayedSat && team2NotPlayedSat && 
                      team1NotPlayedSun && team2NotPlayedSun &&
                      team1CanPlay && team2CanPlay) {
                    foundMatch = true
                    matchupIndex = (index + 1) % shuffledMatchups.length
                    
                    sundayTeams.add(matchup.team1_id)
                    sundayTeams.add(matchup.team2_id)
                    weekendOpponents.get(matchup.team1_id)?.add(matchup.team2_id)
                    weekendOpponents.get(matchup.team2_id)?.add(matchup.team1_id)
                    
                    sundayMatches.push({
                      id: `match-${Date.now()}-w${weekend}-sun-${sundayGamesScheduled}`,
                      team1_id: matchup.team1_id,
                      team2_id: matchup.team2_id,
                      date: sunday,
                      time: '',
                      group_id: matchup.groupId,
                      venue: defaultVenue,
                      status: 'scheduled',
                      weekend: weekend,
                      day: 'Sunday',
                      groupName: matchup.groupName,
                      type: 'group-stage' as const
                    })
                    
                    teamGameCounts.set(matchup.team1_id, (teamGameCounts.get(matchup.team1_id) || 0) + 1)
                    teamGameCounts.set(matchup.team2_id, (teamGameCounts.get(matchup.team2_id) || 0) + 1)
                    sundayGamesScheduled++
                  }
                  
                  attempts++
                }
              }
              
              // Last resort: create match from teams that didn't play Saturday
              // We MUST have at least 2 teams available since: 7 total - 4 Saturday = 3 didn't play Saturday
              // One might be used in first game, but we should still have 2 left
              if (!foundMatch && sundayGamesScheduled < sundayTarget) {
                const availableTeams = allTeams.filter((t: any) => 
                  !saturdayTeams.has(t.team_id) && 
                  !sundayTeams.has(t.team_id) && 
                  canPlayOnDay(t.team_id, 'Sunday', false)
                )
                
                if (availableTeams.length >= 2) {
                  // Pair up first two available teams
                  const team1 = availableTeams[0]
                  const team2 = availableTeams[1]
                  
                  sundayTeams.add(team1.team_id)
                  sundayTeams.add(team2.team_id)
                  weekendOpponents.get(team1.team_id)?.add(team2.team_id)
                  weekendOpponents.get(team2.team_id)?.add(team1.team_id)
                  
                  sundayMatches.push({
                    id: `match-${Date.now()}-w${weekend}-sun-${sundayGamesScheduled}`,
                    team1_id: team1.team_id,
                    team2_id: team2.team_id,
                    date: sunday,
                    time: '',
                    group_id: team1.groupId,
                    venue: defaultVenue,
                    status: 'scheduled',
                    weekend: weekend,
                    day: 'Sunday',
                    groupName: team1.groupName,
                    type: 'group-stage' as const
                  })
                  
                  teamGameCounts.set(team1.team_id, (teamGameCounts.get(team1.team_id) || 0) + 1)
                  teamGameCounts.set(team2.team_id, (teamGameCounts.get(team2.team_id) || 0) + 1)
                  sundayGamesScheduled++
                  foundMatch = true
                } else if (availableTeams.length === 1) {
                  // Edge case: only one team left, need to use it with the designated team or find another solution
                  // Actually, this shouldn't happen - we should have 2 teams left
                  // But if it does, we need to pair this one with... wait, designated team already played
                  // So we need to find any team that can play (maybe relax Saturday restriction?)
                  const remainingTeam = availableTeams[0]
                  
                  // Find any other team that hasn't played Sunday yet (even if they played Saturday)
                  // But wait - we can't do that because it violates our rule
                  // So we need to check if we can pair with a team that's in a different group or something
                  // Actually, the math should work: 7 teams - 4 Saturday = 3 for Sunday, so we should always have 2 left
                  console.warn(`Unexpected: Only 1 team available for second Sunday game on weekend ${weekend}`)
                }
              }
              
              // If we still don't have 2 games, we have a critical error
              // But let's try one more time with a completely different approach
              if (!foundMatch && sundayGamesScheduled < sundayTarget) {
                // Emergency: Check all teams and try to create a match
                // List teams that didn't play Saturday
                const teamsNotPlayedSaturday = allTeams.filter((t: any) => 
                  !saturdayTeams.has(t.team_id) && canPlayOnDay(t.team_id, 'Sunday', false)
                )
                
                // List teams already scheduled for Sunday
                const teamsPlayedSunday = Array.from(sundayTeams)
                
                // Find two teams that can play together
                for (let i = 0; i < teamsNotPlayedSaturday.length; i++) {
                  for (let j = i + 1; j < teamsNotPlayedSaturday.length; j++) {
                    const team1 = teamsNotPlayedSaturday[i]
                    const team2 = teamsNotPlayedSaturday[j]
                    
                    if (!teamsPlayedSunday.includes(team1.team_id) && !teamsPlayedSunday.includes(team2.team_id)) {
                      foundMatch = true
                      
                      sundayTeams.add(team1.team_id)
                      sundayTeams.add(team2.team_id)
                      weekendOpponents.get(team1.team_id)?.add(team2.team_id)
                      weekendOpponents.get(team2.team_id)?.add(team1.team_id)
                      
                      sundayMatches.push({
                        id: `match-${Date.now()}-w${weekend}-sun-${sundayGamesScheduled}`,
                        team1_id: team1.team_id,
                        team2_id: team2.team_id,
                        date: sunday,
                        time: '',
                        group_id: team1.groupId,
                        venue: defaultVenue,
                        status: 'scheduled',
                        weekend: weekend,
                        day: 'Sunday',
                        groupName: team1.groupName,
                        type: 'group-stage' as const
                      })
                      
                      teamGameCounts.set(team1.team_id, (teamGameCounts.get(team1.team_id) || 0) + 1)
                      teamGameCounts.set(team2.team_id, (teamGameCounts.get(team2.team_id) || 0) + 1)
                      sundayGamesScheduled++
                      break
                    }
                  }
                  if (foundMatch) break
                }
              }
              
              if (!foundMatch && sundayGamesScheduled < sundayTarget) {
                console.error(`CRITICAL: Could not schedule second Sunday game for weekend ${weekend}. Saturday teams: ${Array.from(saturdayTeams).join(', ')}, Sunday teams so far: ${Array.from(sundayTeams).join(', ')}`)
                // Break out of the loop to prevent infinite loop
                break
              }
            }
          }
          
          matches.push(...sundayMatches)
          
          // Store opponents for this weekend
          opponentsPerWeekend.set(weekend, weekendOpponents)
        }
      }
      
      // Log game counts for verification
      console.log("Game counts after weekends 1-3:")
      teamGameCounts.forEach((count, teamId) => {
        const team = getTeamById(teamId)
        console.log(`  ${team?.name || teamId}: ${count} games`)
      })
      const minGames = Math.min(...Array.from(teamGameCounts.values()))
      const maxGames = Math.max(...Array.from(teamGameCounts.values()))
      console.log(`  Min games: ${minGames}, Max games: ${maxGames}`)
      
      // Last Saturday of the month
      // For 8 teams: 4 games (all teams play once)
      // For 7 teams: 3 games (6 teams play) + 1 placeholder (1 team has no opponent)
      // CRITICAL: No team plays more than once on last Saturday
      if (lastSaturday) {
        const lastSaturdayTeams = new Set<string>()
        const lastSaturdayMatches: any[] = []
        
        if (totalTeams === 8) {
          // 8 teams: Schedule exactly 4 games, each team plays exactly once
          // Shuffle all teams for randomness
          const shuffledAllTeams = [...allTeams].sort(() => Math.random() - 0.5)
          
          // Create 4 matches from 8 teams
          for (let i = 0; i < 4; i++) {
            const team1 = shuffledAllTeams[i * 2]
            const team2 = shuffledAllTeams[i * 2 + 1]
            
            lastSaturdayTeams.add(team1.team_id)
            lastSaturdayTeams.add(team2.team_id)
            
            lastSaturdayMatches.push({
              id: `match-${Date.now()}-last-sat-${i}`,
              team1_id: team1.team_id,
              team2_id: team2.team_id,
              date: lastSaturday,
              time: '',
              group_id: null,
              venue: defaultVenue,
              status: 'scheduled',
              weekend: weekendsToSchedule,
              day: 'Saturday',
              groupName: 'Quarterfinals',
              type: 'quarterfinal' as const
            })
            
            teamGameCounts.set(team1.team_id, (teamGameCounts.get(team1.team_id) || 0) + 1)
            teamGameCounts.set(team2.team_id, (teamGameCounts.get(team2.team_id) || 0) + 1)
          }
        } else if (totalTeams === 7) {
          // 7 teams: Schedule exactly 3 games (6 teams) + 1 placeholder (1 team)
          // Shuffle all teams for randomness
          const shuffledAllTeams = [...allTeams].sort(() => Math.random() - 0.5)
          
          // Create 3 matches from first 6 teams
          for (let i = 0; i < 3; i++) {
            const team1 = shuffledAllTeams[i * 2]
            const team2 = shuffledAllTeams[i * 2 + 1]
            
            lastSaturdayTeams.add(team1.team_id)
            lastSaturdayTeams.add(team2.team_id)
            
            lastSaturdayMatches.push({
              id: `match-${Date.now()}-last-sat-${i}`,
              team1_id: team1.team_id,
              team2_id: team2.team_id,
              date: lastSaturday,
              time: '',
              group_id: null,
              venue: defaultVenue,
              status: 'scheduled',
              weekend: weekendsToSchedule,
              day: 'Saturday',
              groupName: 'Quarterfinals',
              type: 'quarterfinal' as const
            })
            
            teamGameCounts.set(team1.team_id, (teamGameCounts.get(team1.team_id) || 0) + 1)
            teamGameCounts.set(team2.team_id, (teamGameCounts.get(team2.team_id) || 0) + 1)
          }
          
          // The 7th team (index 6) gets a placeholder match
          const placeholderTeam = shuffledAllTeams[6]
          lastSaturdayTeams.add(placeholderTeam.team_id)
          
          lastSaturdayMatches.push({
            id: `match-${Date.now()}-placeholder`,
            team1_id: placeholderTeam.team_id,
            team2_id: null, // Placeholder - opponent to be determined
            date: lastSaturday,
            time: '',
            group_id: null,
            venue: defaultVenue,
            status: 'scheduled',
            weekend: weekendsToSchedule,
            day: 'Saturday',
            groupName: 'Pending Matchup',
            type: 'placeholder' as const
          })
          
          // Don't increment game count for placeholder (will be resolved later)
        }
        
        matches.push(...lastSaturdayMatches)
      }
      
      // Note: Weekend 4 Sunday is reserved for playoffs and is NOT included in randomization
      // Playoffs will be scheduled separately after league standings are finalized

      // Log final game counts
      console.log("Final game counts after all weekends:")
      teamGameCounts.forEach((count, teamId) => {
        const team = getTeamById(teamId)
        console.log(`  ${team?.name || teamId}: ${count} games`)
      })
      const finalMinGames = Math.min(...Array.from(teamGameCounts.values()))
      const finalMaxGames = Math.max(...Array.from(teamGameCounts.values()))
      console.log(`  Final - Min games: ${finalMinGames}, Max games: ${finalMaxGames}`)

      setScheduledMatches(matches)
      
      // Check if any placeholder matches were created (for 7 teams on last Saturday)
      const placeholderMatches = matches.filter(m => m.type === 'placeholder')
      let description = `${matches.length} matches have been scheduled: Group stage matches across weekends 1-3, and ${totalTeams === 8 ? 'all teams' : '3 games + 1 placeholder'} on the last Saturday.`
      
      if (placeholderMatches.length > 0) {
        const placeholderTeam = placeholderMatches[0] ? getTeamById(placeholderMatches[0].team1_id)?.name : 'Team'
        description += ` Note: ${placeholderTeam} has a placeholder match (vs ?) on the last Saturday.`
      }
      
      toast({
        title: "Matches Scheduled!",
        description: description,
      })
      
      return matches // Return matches for potential reshuffling
      
    } catch (error) {
      toast({
        title: "Scheduling Error",
        description: "An error occurred while scheduling matches. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsScheduling(false)
    }
  }

  const reshuffleMatches = async () => {
    // Reshuffle by calling scheduleMatches again - it will use fresh randomization
    // This ensures reshuffling uses the same updated logic as the initial schedule
    if (!season || seasonGroups.length === 0) {
      toast({
        title: "Cannot Reshuffle",
        description: "Groups are required to reshuffle matches",
        variant: "destructive"
      })
      return
    }

    // Call the same scheduleMatches function - it already handles randomization
    // The shuffle happens inside scheduleMatches, so calling it again will reshuffle
    // This ensures reshuffle uses all the updated logic (7-team rotation, special teams, etc.)
    await scheduleMatches()
  }

  const schedulePerformanceMatches = async () => {
    if (!season || seasonGroups.length === 0) {
      toast({
        title: "Groups Required",
        description: "Please create groups first before scheduling performance matches",
        variant: "destructive"
      })
      return
    }

    setIsSchedulingPerformance(true)
    
    try {
      // Validate we have exactly 2 groups
      if (seasonGroups.length !== 2) {
        toast({
          title: "Invalid Group Structure",
          description: "This format requires exactly 2 groups",
          variant: "destructive"
        })
        return
      }

      const weekendDates = generateWeekendDates(season.startDate, season.EndDate)
      const totalWeekends = weekendDates.length
      
      if (totalWeekends < 4) {
        toast({
          title: "Season Too Short",
          description: "Season must be at least 4 weeks long to schedule performance matches",
          variant: "destructive"
        })
        return
      }

      const performanceMatches: any[] = []
      const defaultVenue = "Prime Arena"
      
      // Get teams from each group with their complete statistics
      const groupTeamsWithStats = seasonGroups.map((group: any) => {
        const groupTeamStats = seasonTeamStatistics.filter((stat: any) => stat.group_id === group.id)
        return {
          groupId: group.id,
          groupName: group.name,
          teams: groupTeamStats.map((stat: any) => ({
            team_id: stat.team_id,
            teamName: getTeamById(stat.team_id)?.name || `Team ${stat.team_id}`,
            points: parseInt(stat.points || '0'),
            goalDiff: parseInt(stat.goal_diff || '0'),
            goalsFor: parseInt(stat.goals_for || '0'),
            goalsAgainst: parseInt(stat.goals_against || '0'),
            wins: parseInt(stat.wins || '0'),
            draws: parseInt(stat.draws || '0'),
            losses: parseInt(stat.losses || '0'),
            played: parseInt(stat.played || '0')
          }))
        }
      })

      // Ranking function based on team_statistics priority rules
      const rankTeams = (teams: any[]) => {
        return [...teams].sort((a, b) => {
          // 1. Points (highest first)
          if (a.points !== b.points) return b.points - a.points
          
          // 2. Goal difference (highest first)
          if (a.goalDiff !== b.goalDiff) return b.goalDiff - a.goalDiff
          
          // 3. Goals for (highest first)
          if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor
          
          // 4. Goals against (lowest first)
          if (a.goalsAgainst !== b.goalsAgainst) return a.goalsAgainst - b.goalsAgainst
          
          // 5. Wins (highest first)
          if (a.wins !== b.wins) return b.wins - a.wins
          
          // 6. Draws (highest first)
          if (a.draws !== b.draws) return b.draws - a.draws
          
          // 7. Random tie-breaker (if all above are equal)
          return Math.random() - 0.5
        })
      }

      // Get ranked teams for each group
      const groupARanked = rankTeams(groupTeamsWithStats[0].teams)
      const groupBRanked = rankTeams(groupTeamsWithStats[1].teams)

      // Weekend 4 - Saturday: Knockout Qualifier (based on rankings)
      const weekend4SaturdayIndex = 6
      
      if (weekend4SaturdayIndex < weekendDates.length) {
        const saturday = weekendDates[weekend4SaturdayIndex]
        
        // Group A knockout matches: 1st vs 4th, 2nd vs 3rd
        if (groupARanked.length >= 4) {
          // 1st vs 4th
                performanceMatches.push({
            id: `knockout-${Date.now()}-w4-sat-a1`,
            team1_id: groupARanked[0].team_id,
            team2_id: groupARanked[3].team_id,
                  date: saturday,
            time: '',
            group_id: groupTeamsWithStats[0].groupId,
                  venue: defaultVenue,
                  status: 'scheduled',
            weekend: 4,
                  day: 'Saturday',
            groupName: groupTeamsWithStats[0].groupName,
            type: 'knockout-qualifier',
            description: '1st vs 4th - Group A'
          })

          // 2nd vs 3rd
          performanceMatches.push({
            id: `knockout-${Date.now()}-w4-sat-a2`,
            team1_id: groupARanked[1].team_id,
            team2_id: groupARanked[2].team_id,
            date: saturday,
            time: '',
            group_id: groupTeamsWithStats[0].groupId,
            venue: defaultVenue,
            status: 'scheduled',
            weekend: 4,
            day: 'Saturday',
            groupName: groupTeamsWithStats[0].groupName,
            type: 'knockout-qualifier',
            description: '2nd vs 3rd - Group A'
          })
        }

        // Group B knockout matches: 1st vs 4th, 2nd vs 3rd
        if (groupBRanked.length >= 4) {
          // 1st vs 4th
          performanceMatches.push({
            id: `knockout-${Date.now()}-w4-sat-b1`,
            team1_id: groupBRanked[0].team_id,
            team2_id: groupBRanked[3].team_id,
            date: saturday,
            time: '',
            group_id: groupTeamsWithStats[1].groupId,
            venue: defaultVenue,
            status: 'scheduled',
            weekend: 4,
            day: 'Saturday',
            groupName: groupTeamsWithStats[1].groupName,
            type: 'knockout-qualifier',
            description: '1st vs 4th - Group B'
          })

          // 2nd vs 3rd
                performanceMatches.push({
            id: `knockout-${Date.now()}-w4-sat-b2`,
            team1_id: groupBRanked[1].team_id,
            team2_id: groupBRanked[2].team_id,
            date: saturday,
            time: '',
            group_id: groupTeamsWithStats[1].groupId,
                  venue: defaultVenue,
                  status: 'scheduled',
            weekend: 4,
            day: 'Saturday',
            groupName: groupTeamsWithStats[1].groupName,
            type: 'knockout-qualifier',
            description: '2nd vs 3rd - Group B'
          })
        }
      }

      // Note: Weekend 4 Sunday is reserved for manual scheduling of semifinals and finals
      // These will be scheduled manually after the knockout qualifier results are known

      setScheduledMatches(performanceMatches)
      
      toast({
        title: "Performance-Based Matches Scheduled!",
        description: `${performanceMatches.length} knockout qualifier matches scheduled for Weekend 4 Saturday based on team rankings (1st vs 4th, 2nd vs 3rd in each group). Weekend 4 Sunday is reserved for manual scheduling of semifinals and finals.`,
      })
      
    } catch (error) {
      toast({
        title: "Scheduling Error",
        description: "An error occurred while scheduling performance matches. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSchedulingPerformance(false)
    }
  }

  const updateAllVenues = () => {
    if (defaultVenue.trim() === '') {
      toast({
        title: "Venue Required",
        description: "Please enter a venue name before updating all matches.",
        variant: "destructive"
      })
      return
    }

    const updatedMatches = scheduledMatches.map(match => ({
      ...match,
      venue: defaultVenue
    }))
    
    setScheduledMatches(updatedMatches)
    
    toast({
      title: "Venues Updated!",
      description: `All ${updatedMatches.length} matches now have venue: ${defaultVenue}`,
    })
  }

  const saveMatchesToDatabase = async () => {
    if (scheduledMatches.length === 0) {
      toast({
        title: "No Matches to Save",
        description: "Please schedule matches first before saving to database.",
        variant: "destructive"
      })
      return
    }

    try {
      let savedCount = 0
      let errorCount = 0

      // Save each match to the database
      for (const match of scheduledMatches) {
        try {
          // Combine date and time for dateAndtime field
          const dateAndtime = match.time ? `${match.date}T${match.time}` : match.date
          
          const result = await addMatchScheduler({
            variables: {
              team1: match.team1_id,
              team2: match.team2_id,
              location: match.venue,
              dateAndtime: dateAndtime,
              season_id: seasonId
            }
          })

          if (result.data?.insert_matches?.affected_rows > 0) {
            savedCount++
          } else {
            errorCount++
          }
        } catch (error) {
          console.error(`Error saving match ${match.id}:`, error)
          errorCount++
        }
      }

      if (savedCount > 0) {
        toast({
          title: "Matches Saved!",
          description: `Successfully saved ${savedCount} matches to database${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
        })
        
        // Refetch match schedules to show updated data
        await refetchMatchSchedules()
        
        // Clear local scheduled matches since they're now in database
        setScheduledMatches([])
        
        // Close the modal
        setIsScheduleMatchesModalOpen(false)
      } else {
        toast({
          title: "Save Failed",
          description: `Failed to save any matches. Please check your data and try again.`,
          variant: "destructive"
        })
      }
      
    } catch (error) {
      console.error('Error saving matches:', error)
      toast({
        title: "Save Error",
        description: "An error occurred while saving matches. Please try again.",
        variant: "destructive"
      })
    }
  }

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [isInviteTeamsModalOpen, setIsInviteTeamsModalOpen] = useState(false)
  const [selectedTeamsToInvite, setSelectedTeamsToInvite] = useState<string[]>([])
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)
  const [isViewGroupsModalOpen, setIsViewGroupsModalOpen] = useState(false)
  const [isScheduleMatchesModalOpen, setIsScheduleMatchesModalOpen] = useState(false)
  const [scheduledMatches, setScheduledMatches] = useState<Array<{
    id: string
    team1_id: string | 'TBD'
    team2_id: string | 'TBD' | null
    date: string
    time: string
    group_id: string | null
    venue: string
    status: string
    weekend: number
    day: string
    groupName: string
    type?: 'performance' | 'knockout-qualifier' | 'playoff' | 'placeholder' | 'group-stage' | 'quarterfinal'
    description?: string
  }>>([])
  const [isScheduling, setIsScheduling] = useState(false)
  const [groups, setGroups] = useState<Array<{
    id: string
    name: string
    teams: string[]
  }>>([])
  const [newGroupName, setNewGroupName] = useState("")
  const [draggedTeam, setDraggedTeam] = useState<string | null>(null)
  const [randomizedGroups, setRandomizedGroups] = useState<Array<{
    id: string
    name: string
    teams: string[]
  }>>([])
  const [isRandomized, setIsRandomized] = useState(false)
  const [numberOfGroups, setNumberOfGroups] = useState(2)
  const [defaultVenue, setDefaultVenue] = useState("Prime Arena")
  const [isSchedulingPerformance, setIsSchedulingPerformance] = useState(false)
  
  // Match swapping state
  const [selectedMatchForSwap, setSelectedMatchForSwap] = useState<string | null>(null)
  
  // Edit opponent state
  const [matchBeingEdited, setMatchBeingEdited] = useState<string | null>(null)
  const [newOpponentId, setNewOpponentId] = useState<string>("")

  // Swap teams between two matches (on any day)
  const swapMatches = (matchId1: string, matchId2: string) => {
    const match1 = scheduledMatches.find(m => m.id === matchId1)
    const match2 = scheduledMatches.find(m => m.id === matchId2)
    
    if (!match1 || !match2) {
      toast({
        title: "Cannot Swap",
        description: "One or both matches not found",
        variant: "destructive"
      })
      return
    }
    
    // Check if either match is a placeholder
    if (!match1.team2_id || !match2.team2_id) {
      toast({
        title: "Cannot Swap",
        description: "Cannot swap placeholder matches",
        variant: "destructive"
      })
      return
    }
    
    // Swap the teams between matches (keeping their dates)
    const updatedMatches = scheduledMatches.map(m => {
      if (m.id === matchId1) {
        return {
          ...m,
          team1_id: match2.team1_id,
          team2_id: match2.team2_id
        }
      }
      if (m.id === matchId2) {
        return {
          ...m,
          team1_id: match1.team1_id,
          team2_id: match1.team2_id
        }
      }
      return m
    })
    
    setScheduledMatches(updatedMatches)
    setSelectedMatchForSwap(null)
    
    toast({
      title: "Matches Swapped!",
      description: "Teams have been swapped between the two matches.",
    })
  }

  const handleMatchClick = (matchId: string, match: any) => {
    // Only allow swapping for non-placeholder matches
    if (!match.team2_id) {
      toast({
        title: "Cannot Select",
        description: "Cannot select placeholder matches",
        variant: "destructive"
      })
      return
    }
    
    if (!selectedMatchForSwap) {
      // First match selected
      setSelectedMatchForSwap(matchId)
      toast({
        title: "Match Selected",
        description: "Click another match (any day) to swap teams",
      })
    } else {
      // Second match selected
      if (selectedMatchForSwap === matchId) {
        // Deselect if clicking the same match
        setSelectedMatchForSwap(null)
        toast({
          title: "Selection Cleared",
          description: "Match selection has been cleared.",
        })
        return
      }
      
      // Perform the swap
      swapMatches(selectedMatchForSwap, matchId)
    }
  }

  const changeOpponent = (matchId: string, newTeamId: string) => {
    const match = scheduledMatches.find(m => m.id === matchId)
    if (!match) {
      toast({
        title: "Error",
        description: "Match not found",
        variant: "destructive"
      })
      return
    }
    
    // Normalize IDs for comparison
    const normalizedNewTeamId = newTeamId?.toString()
    const normalizedTeam1Id = match.team1_id?.toString()
    const normalizedTeam2Id = match.team2_id?.toString()
    
    // Check if the new opponent is the same as the current team
    if (normalizedNewTeamId === normalizedTeam1Id || normalizedNewTeamId === normalizedTeam2Id) {
      toast({
        title: "Invalid Opponent",
        description: "Cannot set a team to play against itself",
        variant: "destructive"
      })
      return
    }
    
    // Update the match with the new opponent
    const updatedMatches = scheduledMatches.map(m => {
      if (m.id === matchId) {
        const updatedMatch = {
          ...m,
          team2_id: normalizedNewTeamId
        }
        console.log('Updating match:', {
          matchId,
          oldTeam2Id: m.team2_id,
          newTeam2Id: normalizedNewTeamId,
          updatedMatch
        })
        return updatedMatch
      }
      return m
    })
    
    setScheduledMatches(updatedMatches)
    setMatchBeingEdited(null)
    setNewOpponentId("")
    
    toast({
      title: "Opponent Changed!",
      description: "Match opponent has been updated successfully.",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Season</h2>
          <p className="text-red-500">{error.message}</p>
          <Button 
            onClick={() => router.back()} 
            className="mt-4"
            variant="outline"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!season) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Season Not Found</h2>
          <p className="text-gray-500">The season you're looking for doesn't exist.</p>
          <Button 
            onClick={() => router.back()} 
            className="mt-4"
            variant="outline"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const getSeasonStatus = (season: Season) => {
    const now = new Date()
    const startDate = new Date(season.startDate)
    const endDate = new Date(season.EndDate)

    if (now < startDate) {
      return { status: 'upcoming', color: 'bg-blue-100 text-blue-800', text: 'Upcoming' }
    } else if (now >= startDate && now <= endDate) {
      return { status: 'active', color: 'bg-green-100 text-green-800', text: 'Active' }
    } else {
      return { status: 'completed', color: 'bg-gray-100 text-gray-800', text: 'Completed' }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTeamDetails = (teamId: string | number) => {
    return getTeamById(teamId)
  }

  const getTeamNames = (teamsObject: Record<string | number, string>) => {
    if (!teamsObject || !seasonTeams) return []
    return Object.keys(teamsObject).map(teamId => {
      const team = getTeamDetails(teamId)
      return team?.name || team?.team_name || `Team ${teamId}`
    })
  }

  const status = getSeasonStatus(season)
  const teamNames = getTeamNames(season.teams)

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/mainbg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black/20"></div>
      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl shadow-2xl border-b border-white/20 rounded-b-3xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/season-scheduler">
                <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Seasons
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400/80 to-green-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">{season.name}</h1>
                <p className="text-sm text-white/80 drop-shadow-md">Season Details & Management</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(true)} className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                <Edit className="w-4 h-4 mr-2" />
                Edit Season
              </Button>
              <Button variant="outline" className="bg-red-500/20 backdrop-blur-sm border-red-400/30 text-red-300 hover:bg-red-500/30">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Season
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Season Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100/20 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium">Season Status</p>
                  <Badge className={status.color}>
                    {status.text}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium">Duration</p>
                  <p className="text-lg font-semibold text-white">
                    {formatDate(season.startDate)} - {formatDate(season.EndDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100/20 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium">Teams Participating</p>
                  <p className="text-2xl font-bold text-white">{totalTeams}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100/20 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-orange-300" />
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium">Days Remaining</p>
                  <p className="text-lg font-semibold text-white">
                    {Math.max(0, Math.ceil((new Date(season.EndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Season Information */}
        <Card className="mb-8 bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Trophy className="h-5 w-5" />
              Season Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-white mb-3">Basic Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Season ID:</span>
                    <span className="font-medium text-white">#{season.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Name:</span>
                    <span className="font-medium text-white">{season.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Status:</span>
                    <Badge className={status.color}>
                      {status.text}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-300" />
                    <span className="text-white/70">Start Date:</span>
                    <span className="font-medium text-white">{formatDate(season.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-300" />
                    <span className="text-white/70">End Date:</span>
                    <span className="font-medium text-white">{formatDate(season.EndDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teams Section */}
        <Card className="mb-8 bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Users className="h-5 w-5" />
              Participating Teams ({seasonTeams.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {seasonTeams.length === 0 ? (
              <div className="text-center text-white/60 py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-white/30" />
                <p>No teams have been invited to this season yet.</p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => setIsInviteTeamsModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Teams
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white/90">Team</TableHead>
                      <TableHead className="text-white/90">Manager</TableHead>
                      <TableHead className="text-white/90">Players</TableHead>
                      <TableHead className="text-white/90">Invitation Token</TableHead>
                      <TableHead className="text-white/90">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seasonTeams.map((team: any) => {
                      // Only use the actual id field from GraphQL response
                      const teamId = team.id
                      if (!teamId) return null
                      const invitationToken = season?.teams?.[teamId] || 'N/A'
                      
                      return (
                        <TableRow key={teamId} className="hover:bg-white/10">
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">
                                {team.name || team.team_name || `Team ${teamId}`}
                              </div>
                              <div className="text-sm text-white/70">
                                {team.shortname || team.short_name || 'N/A'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium text-white">
                                {team.manager?.name || 'N/A'}
                              </div>
                              <div className="text-white/70">
                                {team.manager?.email || 'N/A'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {team.players?.length || 0} players
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs font-mono bg-white/10 p-2 rounded text-white/80">
                              {invitationToken}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedTeam(team)
                                setIsTeamModalOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Team
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Matches Section */}
        <Card className="mb-8 bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Target className="h-5 w-5" />
              Season Matches
            </CardTitle>
            <Button 
              onClick={() => refetchMatchSchedules()}
              variant="outline"
              size="sm"
              disabled={matchSchedulesLoading}
              className="ml-auto bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
            >
              {matchSchedulesLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300 mr-2"></div>
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {matchSchedulesLoading ? (
              <div className="text-center py-8 text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300 mx-auto"></div>
                <p className="text-white/80 mt-2">Loading season matches...</p>
              </div>
            ) : matchSchedulesError ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-red-300 mx-auto" />
                <p className="text-red-300 mt-2">Error loading matches: {matchSchedulesError.message}</p>
              </div>
            ) : matchSchedules.filter((match: any) => match.season_id === seasonId).length === 0 ? (
              <div className="text-center text-white/60 py-8">
                <Target className="h-12 w-12 mx-auto mb-4 text-white/30" />
                <p>No matches have been scheduled for this season yet.</p>
                <Button 
                  className="mt-4 bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white" 
                  variant="outline"
                  onClick={() => setIsScheduleMatchesModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Matches
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {matchSchedules
                  .filter((match: any) => match.season_id === seasonId)
                  .map((match: any) => (
                    <div 
                      key={match.id} 
                      className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        {/* Teams with logos */}
                        <div className="flex items-center gap-6 flex-1">
                          {/* Team 1 */}
                          <div className="flex items-center gap-3">
                            {match.Team1?.logo ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
                                <img
                                  src={match.Team1.logo}
                                  alt={`${match.Team1.name} Logo`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg flex items-center justify-center border-2 border-white/20 shadow-lg flex-shrink-0">
                                <span className="text-sm font-bold text-white">
                                  {match.Team1?.name?.substring(0, 2).toUpperCase() || 'T1'}
                                </span>
                              </div>
                            )}
                            <div className="text-white font-semibold">
                              {match.Team1?.name || `Team ${match.team1}`}
                            </div>
                          </div>
                          
                          {/* VS */}
                          <div className="text-white/60 font-medium">vs</div>
                          
                          {/* Team 2 */}
                          <div className="flex items-center gap-3">
                            {match.Team2?.logo ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
                                <img
                                  src={match.Team2.logo}
                                  alt={`${match.Team2.name} Logo`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg flex items-center justify-center border-2 border-white/20 shadow-lg flex-shrink-0">
                                <span className="text-sm font-bold text-white">
                                  {match.Team2?.name?.substring(0, 2).toUpperCase() || 'T2'}
                                </span>
                              </div>
                            )}
                            <div className="text-white font-semibold">
                              {match.Team2?.name || `Team ${match.team2}`}
                            </div>
                          </div>
                        </div>
                        
                        {/* Date, Time, Venue */}
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm text-white/80">
                              {new Date(match.dateAndtime).toLocaleDateString('en-US', { 
                                month: 'short',
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="text-xs text-white/60 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(match.dateAndtime).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                          
                          <Badge 
                            variant="outline"
                            className="text-xs bg-white/10 backdrop-blur-sm text-white border-white/20 px-3 py-1"
                          >
                            {match.location}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white drop-shadow-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
                onClick={() => setIsInviteTeamsModalOpen(true)}
                disabled={availableTeamsToInvite.length === 0}
              >
                <Plus className="h-6 w-6 mb-2" />
                <span>Invite More Teams</span>
              </Button>
              {/* Only show Schedule Matches button when no regular matches have been scheduled */}
              {matchSchedules.filter((match: any) => match.season_id === seasonId).length === 0 && (
                <Button 
                  variant="outline" 
                  className="h-20 flex-col bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
                  onClick={() => setIsScheduleMatchesModalOpen(true)}
                  disabled={seasonGroups.length === 0}
                >
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Schedule Matches</span>
                  {seasonGroups.length === 0 && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Create groups first
                    </Badge>
                  )}
                </Button>
              )}
              
              {/* Show Schedule Performance Matches button when regular matches have been scheduled */}
              {matchSchedules.filter((match: any) => match.season_id === seasonId).length > 0 && (
                <Button 
                  variant="outline" 
                  className="h-20 flex-col bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
                  onClick={() => setIsScheduleMatchesModalOpen(true)}
                  disabled={isSchedulingPerformance}
                >
                  <Target className="h-6 w-6 mb-2" />
                  <span>Schedule Performance Matches</span>
                  {isSchedulingPerformance && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Scheduling...
                    </Badge>
                  )}
                </Button>
              )}
              
              {seasonGroups.length > 0 ? (
                <Button 
                  variant="outline" 
                  className="h-20 flex-col bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
                  onClick={() => setIsViewGroupsModalOpen(true)}
                >
                  <Users className="h-6 w-6 mb-2" />
                  <span>View Groups</span>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="h-20 flex-col bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
                  onClick={() => setIsCreateGroupModalOpen(true)}
                >
                  <Users className="h-6 w-6 mb-2" />
                  <span>Create Group</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Details Modal */}
      <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedTeam && (
            <div className="space-y-6">
              {/* Team Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-3">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Team Name:</span>
                      <span className="font-medium text-white">{selectedTeam.name || selectedTeam.team_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Short Name:</span>
                      <span className="font-medium text-white">{selectedTeam.shortname || selectedTeam.short_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Team ID:</span>
                      <span className="font-medium text-white">{selectedTeam.id || selectedTeam.team_id || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-3">Manager Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Name:</span>
                      <span className="font-medium text-white">{selectedTeam.manager?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Email:</span>
                      <span className="font-medium text-white">{selectedTeam.manager?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Phone:</span>
                      <span className="font-medium text-white">{selectedTeam.manager?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Players Section */}
              <div>
                <h3 className="font-semibold text-white mb-3">Players ({selectedTeam.players?.length || 0})</h3>
                {selectedTeam.players && selectedTeam.players.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white">Name</TableHead>
                          <TableHead className="text-white">Email</TableHead>
                          <TableHead className="text-white">Phone</TableHead>
                          <TableHead className="text-white">Gender</TableHead>
                          <TableHead className="text-white">Date of Birth</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTeam.players.map((player: any) => (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium text-white">{player.name}</TableCell>
                            <TableCell className="text-white/80">{player.email}</TableCell>
                            <TableCell className="text-white/80">{player.phone}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-white border-white/30">{player.gender}</Badge>
                            </TableCell>
                            <TableCell className="text-white/80">{player.dob ? new Date(player.dob).toLocaleDateString() : 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center text-white/70 py-4">
                    <Users className="h-8 w-8 mx-auto mb-2 text-white/50" />
                    <p>No players found for this team</p>
                  </div>
                )}
              </div>

              {/* Season Invitation */}
              <div>
                <h3 className="font-semibold text-white mb-3">Season Invitation</h3>
                <div className="bg-white/5 backdrop-blur-sm border border-white/20 p-3 rounded-md">
                  <div className="text-sm text-white/80 mb-2">Invitation Token:</div>
                  <div className="font-mono text-xs bg-white/10 backdrop-blur-sm text-white p-2 rounded border border-white/20">
                    {season?.teams?.[selectedTeam.id || selectedTeam.team_id] || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsTeamModalOpen(false)} className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Teams Modal */}
      <Dialog open={isInviteTeamsModalOpen} onOpenChange={setIsInviteTeamsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Invite Teams to Season
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/80 mb-3">
                Select teams to invite to "{season?.name}". Teams that are already in this season are not shown.
              </p>
              
              {availableTeamsToInvite.length === 0 ? (
                <div className="text-center text-white/70 py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-white/50" />
                  <p>No teams available to invite</p>
                  <p className="text-sm">All teams are already part of this season</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto border border-white/20 rounded-md p-3 bg-white/5">
                  {availableTeamsToInvite.map((team: any) => {
                    // Only use the actual id field from GraphQL response
                    const teamId = team.id
                    
                    if (!teamId) return null
                    
                    return (
                      <div key={teamId} className="flex items-center space-x-3">
                        <Checkbox
                          id={`invite-team-${teamId}`}
                          checked={selectedTeamsToInvite.includes(teamId)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTeamsToInvite([...selectedTeamsToInvite, teamId])
                            } else {
                              setSelectedTeamsToInvite(selectedTeamsToInvite.filter(id => id !== teamId))
                            }
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`invite-team-${teamId}`} className="text-sm font-medium">
                            {team.name || team.team_name || `Team ${teamId}`}
                          </Label>
                          <div className="text-xs text-white/60">
                            {team.shortname || team.short_name || 'N/A'} • Manager: {team.manager?.name || 'N/A'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              
              {selectedTeamsToInvite.length > 0 && (
                <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 p-3 rounded-md">
                  <p className="text-sm text-blue-200">
                    <strong>{selectedTeamsToInvite.length}</strong> team(s) selected for invitation
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => {
              setIsInviteTeamsModalOpen(false)
              setSelectedTeamsToInvite([])
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleInviteTeams}
              disabled={selectedTeamsToInvite.length === 0 || updateLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Invite {selectedTeamsToInvite.length > 0 ? `(${selectedTeamsToInvite.length})` : ''} Teams
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Group Modal */}
      <Dialog open={isCreateGroupModalOpen} onOpenChange={setIsCreateGroupModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Create & Manage Groups
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Create New Group */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Label htmlFor="groupName">New Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="e.g., Group A, Pool 1, Division 1"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateGroup} disabled={!newGroupName.trim() || createGroupLoading}>
                {createGroupLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Group
              </Button>
            </div>

            {/* Randomization Section */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-white mb-4">Quick Randomization</h3>
              <div className="flex gap-4 items-end">
                <div>
                  <Label htmlFor="numberOfGroups">Number of Groups</Label>
                  <Select value={numberOfGroups.toString()} onValueChange={(value) => setNumberOfGroups(parseInt(value))}>
                    <SelectTrigger className="w-32 bg-white/10 backdrop-blur-sm text-white border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Groups
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={randomizeTeamsIntoGroups}
                  disabled={seasonTeams.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  🎲 Randomize Teams
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                This will randomly distribute {seasonTeams.length} teams into {numberOfGroups} equal groups
              </p>
            </div>

            {/* Randomized Groups Preview */}
            {isRandomized && randomizedGroups.length > 0 && (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Randomized Groups Preview</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={resetRandomization}
                      className="bg-orange-500/20 backdrop-blur-sm text-orange-200 border-orange-400/30 hover:bg-orange-500/30 hover:text-orange-100"
                    >
                      🔄 Reset
                    </Button>
                    <Button 
                      onClick={confirmRandomization}
                      className="bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700/80 text-white border-blue-400/30"
                    >
                      ✅ Confirm & Save
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {randomizedGroups.map((group, index) => (
                    <div key={group.id} className="border border-white/20 rounded-lg p-4 bg-white/5 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">{group.name}</h4>
                        <Badge variant="secondary" className="bg-white/10 backdrop-blur-sm text-white border-white/20">{group.teams.length} teams</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {group.teams.map(teamId => {
                          const team = getTeamById(teamId)
                          return (
                            <div key={teamId} className="bg-white/10 backdrop-blur-sm p-2 rounded border border-white/20 text-sm text-white">
                              {team?.name || team?.team_name || `Team ${teamId}`}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg">
                  <p className="text-sm text-green-200">
                    <strong>Ready to save!</strong> Review the groups above. Click "Confirm & Save" to save to database, 
                    or "Reset" to randomize again.
                  </p>
                </div>
              </div>
            )}

            {/* Groups and Teams */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Existing Groups */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Groups ({groups.length})</h3>
                {groups.length === 0 ? (
                  <div className="text-center text-white/70 py-8 border-2 border-dashed border-white/30 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-white/50" />
                    <p>No groups created yet</p>
                    <p className="text-sm">Create a group to start organizing teams</p>
                  </div>
                ) : (
                  groups.map(group => (
                    <div key={group.id} className="border border-white/20 rounded-lg p-4 bg-white/5 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">{group.name}</h4>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGroup(group.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          {group.teams.length} team(s)
                        </div>
                        {group.teams.map(teamId => {
                          const team = getTeamById(teamId)
                          return (
                            <div key={teamId} className="flex items-center justify-between bg-white p-2 rounded border">
                              <span className="text-sm">
                                {team?.name || team?.team_name || `Team ${teamId}`}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveTeamFromGroup(teamId, group.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Available Teams */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Available Teams ({getUnassignedTeams().length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getUnassignedTeams().map((team: any) => {
                    // Only use the actual id field from GraphQL response
                    const teamId = team.id
                    
                    if (!teamId) return null
                    
                    return (
                      <div
                        key={teamId}
                        className="flex items-center justify-between bg-white/10 backdrop-blur-sm p-3 rounded border border-white/20 cursor-move hover:bg-white/20"
                        draggable
                        onDragStart={() => setDraggedTeam(teamId)}
                        onDragEnd={() => setDraggedTeam(null)}
                      >
                        <div>
                          <div className="font-medium text-white">
                            {team.name || team.team_name || `Team ${teamId}`}
                          </div>
                          <div className="text-sm text-white/70">
                            {team.shortname || team.short_name || 'N/A'}
                          </div>
                        </div>
                        
                        {/* Quick Add to Group */}
                        {groups.length > 0 && (
                          <Select onValueChange={(groupId) => handleAddTeamToGroup(teamId, groupId)}>
                            <SelectTrigger className="w-32 bg-white/10 backdrop-blur-sm text-white border-white/20">
                              <SelectValue placeholder="Add to..." />
                            </SelectTrigger>
                            <SelectContent>
                              {groups.map(group => (
                                <SelectItem key={group.id} value={group.id}>
                                  {group.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Drag and Drop Instructions */}
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <h4 className="font-medium text-white mb-2">💡 How to Use Groups</h4>
              <ul className="text-sm text-white/80 space-y-1">
                <li>• <strong>Create groups</strong> to organize teams for match scheduling</li>
                <li>• <strong>Drag and drop</strong> teams between groups or use the quick add dropdown</li>
                <li>• <strong>Groups will be used</strong> when scheduling matches to ensure fair competition</li>
                <li>• <strong>Teams can only be in one group</strong> at a time</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsCreateGroupModalOpen(false)} className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Groups Modal */}
      <Dialog open={isViewGroupsModalOpen} onOpenChange={setIsViewGroupsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              View Season Groups & Statistics
              </div>
              {/* Show Edit Groups button only if season hasn't started */}
              {status.status === 'upcoming' && (
                <Button
                  onClick={() => {
                    setIsViewGroupsModalOpen(false)
                    setIsCreateGroupModalOpen(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Groups
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {groupsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : seasonGroups.length === 0 ? (
              <div className="text-center text-white/70 py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-white/50" />
                <p>No groups found for this season</p>
              </div>
            ) : (
              <>
                {/* Groups Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {seasonGroups.map((group) => {
                    const groupTeamStats = seasonTeamStatistics.filter((stat: any) => stat.group_id === group.id)
                    const teamsInGroup = groupTeamStats.map((stat: any) => {
                      const team = getTeamById(stat.team_id)
                      return {
                        ...stat,
                        teamName: team?.name || team?.team_name || `Team ${stat.team_id}`,
                        teamShortName: team?.shortname || team?.short_name || 'N/A'
                      }
                    })
                    
                    return (
                      <Card key={group.id} className="bg-white/5 backdrop-blur-sm border border-white/20">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between text-white">
                            <span>{group.name}</span>
                            <Badge variant="secondary">{teamsInGroup.length} teams</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {teamsInGroup.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No teams assigned to this group</p>
                          ) : (
                            <div className="space-y-3">
                              {teamsInGroup.map((teamStat) => (
                                <div key={teamStat.id} className="border rounded-lg p-3 bg-gray-50">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <h4 className="font-medium text-gray-900">{teamStat.teamName}</h4>
                                      <p className="text-sm text-gray-500">{teamStat.teamShortName}</p>
                                    </div>
                                    <Badge variant="outline">{teamStat.points} pts</Badge>
                                  </div>
                                  
                                  {/* Team Statistics */}
                                  <div className="grid grid-cols-4 gap-2 text-xs">
                                    <div className="text-center">
                                      <div className="font-medium text-gray-900">{teamStat.played}</div>
                                      <div className="text-gray-500">Played</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-medium text-green-600">{teamStat.wins}</div>
                                      <div className="text-gray-500">Wins</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-medium text-yellow-600">{teamStat.draws}</div>
                                      <div className="text-gray-500">Draws</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-medium text-red-600">{teamStat.losses}</div>
                                      <div className="text-gray-500">Losses</div>
                                    </div>
                                  </div>
                                  
                                  {/* Goals */}
                                  <div className="mt-2 pt-2 border-t grid grid-cols-3 gap-2 text-xs">
                                    <div className="text-center">
                                      <div className="font-medium text-green-600">{teamStat.goals_for}</div>
                                      <div className="text-gray-500">GF</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-medium text-red-600">{teamStat.goals_against}</div>
                                      <div className="text-gray-500">GA</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="font-medium text-blue-600">{teamStat.goal_diff}</div>
                                      <div className="text-gray-500">GD</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Season Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Season Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{seasonGroups.length}</div>
                        <div className="text-sm text-gray-500">Total Groups</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{seasonTeamStatistics.length}</div>
                        <div className="text-sm text-gray-500">Teams with Stats</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {seasonTeamStatistics.reduce((total, stat) => total + parseInt(stat.points || '0'), 0)}
                        </div>
                        <div className="text-sm text-gray-500">Total Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {seasonTeamStatistics.reduce((total, stat) => total + parseInt(stat.goals_for || '0'), 0)}
                        </div>
                        <div className="text-sm text-gray-500">Total Goals</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsViewGroupsModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Matches Modal */}
      <Dialog open={isScheduleMatchesModalOpen} onOpenChange={setIsScheduleMatchesModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {scheduledMatches.length === 0 && matchSchedules.filter((match: any) => match.season_id === seasonId).length > 0 ? (
                <Target className="h-5 w-5" />
              ) : (
                <Calendar className="h-5 w-5" />
              )}
              {scheduledMatches.length === 0 && matchSchedules.filter((match: any) => match.season_id === seasonId).length > 0 
                ? 'Schedule Performance Matches' 
                : 'Schedule Season Matches'
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Show regular scheduling interface only when no matches are scheduled */}
            {scheduledMatches.length === 0 && matchSchedules.filter((match: any) => match.season_id === seasonId).length === 0 && (
              <>
                {/* Location Setting */}
                <div className="p-4 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-400/30">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="default-venue" className="text-sm font-medium text-blue-200">
                        Default Venue for All Games
                      </Label>
                      <Input
                        id="default-venue"
                        value={defaultVenue}
                        onChange={(e) => setDefaultVenue(e.target.value)}
                        placeholder="Enter venue name (e.g., Prime Arena, Stadium A)"
                        className="mt-1 bg-white/10 backdrop-blur-sm text-white border-white/20 placeholder:text-white/60"
                      />
                      <p className="text-xs text-blue-200/80 mt-1">
                        This venue will be applied to all scheduled matches. You can change individual match venues later.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scheduling Controls */}
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/20">
                  <div>
                    <h3 className="font-semibold text-white">Randomized Group Weekend Scheduling</h3>
                    <p className="text-sm text-white/80">
                      Weekend 1-3: Group stage matches. Weekend 4 Saturday: Quarterfinals (all 8 teams play). Weekend 4 Sunday: Semi-finals and finals.
                    </p>
                  </div>
                  <Button 
                    onClick={scheduleMatches}
                    disabled={isScheduling || seasonGroups.length === 0}
                    className="bg-green-600/80 backdrop-blur-sm hover:bg-green-700/80 text-white border-green-400/30"
                  >
                    {isScheduling ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Calendar className="h-4 w-4 mr-2" />
                    )}
                    {isScheduling ? 'Scheduling...' : 'Generate Matches'}
                  </Button>
                </div>
              </>
            )}

            {/* Show performance matches interface when regular matches are already scheduled */}
            {scheduledMatches.length === 0 && matchSchedules.filter((match: any) => match.season_id === seasonId).length > 0 && (
              <div className="p-6 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-400/30">
                <div className="text-center space-y-4">
                  <Target className="h-16 w-16 mx-auto text-purple-300" />
                  <h3 className="text-xl font-semibold text-purple-200">Performance Matches Ready to Schedule</h3>
                  <p className="text-purple-200/80 max-w-2xl mx-auto">
                    Regular season matches have already been scheduled. You can now schedule performance matches 
                    based on team statistics for weekends 3-4 to determine final standings.
                  </p>
                  <div className="flex justify-center">
                    <Button 
                      onClick={schedulePerformanceMatches}
                      disabled={isSchedulingPerformance}
                      size="lg"
                      className="bg-purple-600/80 backdrop-blur-sm hover:bg-purple-700/80 text-white border-purple-400/30"
                    >
                      {isSchedulingPerformance ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Target className="h-5 w-5 mr-2" />
                      )}
                      {isSchedulingPerformance ? 'Scheduling...' : 'Schedule Performance Matches'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Scheduled Matches Display */}
            {scheduledMatches.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">
                    Scheduled Matches ({scheduledMatches.length})
                  </h3>
                  <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20">
                    Weekend 1: {scheduledMatches.filter(m => m.weekend === 1).length} matches | 
                    Weekend 2: {scheduledMatches.filter(m => m.weekend === 2).length} matches
                  </Badge>
                </div>

                {/* Swap Instructions */}
                {selectedMatchForSwap && (
                  <div className="p-4 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-400/30 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-300 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-200">
                        Match selected for swap
                      </p>
                      <p className="text-xs text-blue-200/80 mt-0.5">
                        Click another match (any day) to swap teams. Click the selected match again to cancel.
                      </p>
                    </div>
                  </div>
                )}
                
                {!selectedMatchForSwap && scheduledMatches.some(m => m.team2_id) && (
                  <div className="p-3 bg-gray-500/10 backdrop-blur-sm rounded-lg border border-gray-400/20 flex items-center gap-2">
                    <Swap className="h-4 w-4 text-gray-300 flex-shrink-0" />
                    <p className="text-xs text-gray-300">
                      💡 <strong>Tip:</strong> Click any match to swap teams with another match from any day
                    </p>
                  </div>
                )}

                {/* Group matches by date */}
                {(() => {
                  const matchesByDate = scheduledMatches.reduce((acc: any, match) => {
                    const date = match.date
                    if (!acc[date]) acc[date] = []
                    acc[date].push(match)
                    return acc
                  }, {})

                  return Object.entries(matchesByDate).map(([date, dayMatches]: [string, any]) => (
                    <Card key={date} className="bg-white/5 backdrop-blur-sm border border-white/20">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-white">
                          <span>{new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                          <Badge variant="secondary" className="bg-white/10 backdrop-blur-sm text-white border-white/20">{dayMatches.length} matches</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {dayMatches.map((match: any) => {
                            const team1 = getTeamById(match.team1_id)
                            const team2 = match.team2_id ? getTeamById(match.team2_id) : null
                            const isPlaceholder = match.type === 'placeholder' || !match.team2_id
                            const isSelected = selectedMatchForSwap === match.id
                            const isSwapable = !isPlaceholder // Only non-placeholder matches can be swapped
                            
                            return (
                              <div 
                                key={match.id} 
                                onClick={() => isSwapable && handleMatchClick(match.id, match)}
                                className={`flex items-center justify-between p-3 border rounded-lg backdrop-blur-sm transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'border-blue-400 bg-blue-500/20 shadow-lg' 
                                    : isSwapable 
                                      ? 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10' 
                                      : 'border-white/20 bg-white/5 cursor-not-allowed'
                                }`}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    {isSwapable && (
                                      <Badge variant="outline" className={`text-xs ${isSelected ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70'}`}>
                                        {isSelected ? 'Selected' : 'Click to swap'}
                                      </Badge>
                                    )}
                                    <span className="font-medium text-white">
                                      {team1?.name || team1?.team_name || `Team ${match.team1_id}`}
                                    </span>
                                    <span className="text-white/60">vs</span>
                                    {isPlaceholder ? (
                                      <span className="font-medium text-yellow-300 text-lg">?</span>
                                    ) : (
                                    <span className="font-medium text-white">
                                      {team2?.name || team2?.team_name || `Team ${match.team2_id}`}
                                    </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-white/70 mt-1">
                                    {isPlaceholder ? (
                                      <Badge variant="secondary" className="bg-yellow-500/20 backdrop-blur-sm text-yellow-300 border-yellow-400/30">Pending Opponent</Badge>
                                    ) : (
                                      <>
                                                                         Group: {seasonGroups.find((g: any) => g.id === match.group_id)?.name || 'N/A'} | 
                                    Weekend {match.weekend} - {match.day}
                                    {match.type === 'performance' && (
                                      <Badge variant="secondary" className="ml-2 bg-white/10 backdrop-blur-sm text-white border-white/20">Performance</Badge>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                {matchBeingEdited === match.id ? (
                                  // Edit mode: show dropdown and buttons
                                  <div className="flex items-center space-x-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                    <Select value={newOpponentId} onValueChange={setNewOpponentId}>
                                      <SelectTrigger className="text-xs h-8 bg-white/10 backdrop-blur-sm text-white border-white/20">
                                        <SelectValue placeholder="Select opponent" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {seasonTeams.filter((t: any) => {
                                          const teamId = t.id || t.team_id
                                          return teamId && teamId.toString() !== match.team1_id?.toString() && teamId.toString() !== match.team2_id?.toString()
                                        }).map((team: any) => {
                                          const teamId = team.id || team.team_id
                                          return (
                                            <SelectItem key={teamId} value={teamId?.toString()}>
                                              {team.name || team.team_name}
                                            </SelectItem>
                                          )
                                        })}
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        if (newOpponentId) {
                                          changeOpponent(match.id, newOpponentId)
                                        } else {
                                          toast({
                                            title: "Please select an opponent",
                                            variant: "destructive"
                                          })
                                        }
                                      }}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setMatchBeingEdited(null)
                                        setNewOpponentId("")
                                      }}
                                      className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  // Normal mode: show venue/time and edit button
                                  <div className="flex items-center space-x-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                    <Input
                                      value={match.venue}
                                      onChange={(e) => {
                                        const updatedMatches = scheduledMatches.map(m => 
                                          m.id === match.id ? { ...m, venue: e.target.value } : m
                                        )
                                        setScheduledMatches(updatedMatches)
                                      }}
                                      placeholder="Venue"
                                      className="text-xs h-8 bg-white/10 backdrop-blur-sm text-white border-white/20 placeholder:text-white/60"
                                    />
                                    <span className="text-xs text-white/60">|</span>
                                    <Input
                                      type="time"
                                      value={match.time}
                                      onChange={(e) => {
                                        const updatedMatches = scheduledMatches.map(m => 
                                          m.id === match.id ? { ...m, time: e.target.value } : m
                                        )
                                        setScheduledMatches(updatedMatches)
                                      }}
                                      className="text-xs h-8 w-32 bg-white/10 backdrop-blur-sm text-white border-white/20"
                                    />
                                    {isSwapable && (
                                      <>
                                        <span className="text-xs text-white/60">|</span>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setMatchBeingEdited(match.id)
                                            setNewOpponentId("") // Reset when entering edit mode
                                          }}
                                          className="bg-orange-600/80 hover:bg-orange-700/80 text-white border-orange-400/30"
                                        >
                                          <Edit className="h-3 w-3 mr-1" />
                                          Edit Opponent
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                })()}

                {/* Summary */}
                <Card className="bg-white/5 backdrop-blur-sm border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Match Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-300">{scheduledMatches.length}</div>
                        <div className="text-sm text-white/70">Total Matches</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-300">
                          {scheduledMatches.filter(m => m.weekend === 1).length}
                        </div>
                        <div className="text-sm text-white/70">Weekend 1</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">
                          {scheduledMatches.filter(m => m.weekend === 2).length}
                        </div>
                        <div className="text-sm text-white/70">Weekend 2</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-300">
                          {scheduledMatches.filter(m => m.type === 'performance').length}
                        </div>
                        <div className="text-sm text-white/70">Performance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-300">
                          {new Set(scheduledMatches.map(m => m.date)).size}
                        </div>
                        <div className="text-sm text-white/70">Weekend Days</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* No matches scheduled - only show when no regular matches exist */}
            {scheduledMatches.length === 0 && matchSchedules.filter((match: any) => match.season_id === seasonId).length === 0 && !isScheduling && (
              <div className="text-center text-white/70 py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-white/50" />
                <p>No matches scheduled yet</p>
                <p className="text-sm">Click "Generate Matches" to create the season schedule</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsScheduleMatchesModalOpen(false)} className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white">
              Close
            </Button>
            {scheduledMatches.length > 0 && (
              <Button 
                onClick={reshuffleMatches}
                disabled={isScheduling}
                className="bg-purple-600/80 backdrop-blur-sm hover:bg-purple-700/80 text-white border-purple-400/30"
              >
                {isScheduling ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Reshuffle Matches
              </Button>
            )}
            {scheduledMatches.length > 0 && (
              <Button 
                onClick={updateAllVenues}
                className="bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700/80 text-white border-blue-400/30"
              >
                🏟️ Update All Venues
              </Button>
            )}
            {scheduledMatches.length > 0 && (
              <Button 
                onClick={saveMatchesToDatabase}
                disabled={addMatchLoading}
                className="bg-green-600/80 backdrop-blur-sm hover:bg-green-700/80 text-white border-green-400/30"
              >
                {addMatchLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Calendar className="h-4 w-4 mr-2" />
                )}
                {addMatchLoading ? 'Saving...' : 'Schedule Match'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Season Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Season
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="editSeasonName" className="text-white">Season Name *</Label>
              <Input
                id="editSeasonName"
                placeholder="e.g., Prime5 League 2024"
                value={season?.name || ''}
                onChange={(e) => {
                  // Update season name in local state if needed
                }}
                className="bg-white/10 backdrop-blur-sm text-white border-white/20 placeholder:text-white/60"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editStartDate" className="text-white">Start Date *</Label>
                <Input
                  id="editStartDate"
                  type="date"
                  value={season?.startDate || ''}
                  onChange={(e) => {
                    // Update start date in local state if needed
                  }}
                  className="bg-white/10 backdrop-blur-sm text-white border-white/20"
                />
              </div>
              <div>
                <Label htmlFor="editEndDate" className="text-white">End Date *</Label>
                <Input
                  id="editEndDate"
                  type="date"
                  value={season?.EndDate || ''}
                  onChange={(e) => {
                    // Update end date in local state if needed
                  }}
                  className="bg-white/10 backdrop-blur-sm text-white border-white/20"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-white">Add Teams</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-white/20 rounded-md p-3 bg-white/5">
                {allTeams?.filter((team: any) => team.approved === true).map((team: any) => {
                  const teamId = team.id
                  if (!teamId) return null
                  
                  const isAlreadyInSeason = season?.teams?.[teamId]
                  
                  return (
                    <div key={teamId} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-season-team-${teamId}`}
                        checked={!!isAlreadyInSeason}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            // Add team to season
                            const token = `e${Date.now()}${Math.random().toString(36).substr(2, 9)}`
                            const newTeamsObject = { ...season?.teams, [teamId]: token }
                            
                            updateSeason({
                              variables: {
                                id: seasonId,
                                name: season?.name,
                                startDate: season?.startDate,
                                EndDate: season?.EndDate,
                                teams: newTeamsObject
                              }
                            }).then(() => {
                              refetch()
                            })
                          } else {
                            // Remove team from season
                            const newTeamsObject = { ...season?.teams }
                            delete newTeamsObject[teamId]
                            
                            updateSeason({
                              variables: {
                                id: seasonId,
                                name: season?.name,
                                startDate: season?.startDate,
                                EndDate: season?.EndDate,
                                teams: newTeamsObject
                              }
                            }).then(() => {
                              refetch()
                            })
                          }
                        }}
                      />
                      <Label htmlFor={`edit-season-team-${teamId}`} className="text-sm text-white">
                        {team.name} ({team.shortname})
                      </Label>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-white/70 mt-1">
                {Object.keys(season?.teams || {}).length} team(s) in season
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Season Matches Section */}

    </div>
  )
} 