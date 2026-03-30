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
  LayoutGrid,
  ArrowRightLeft as Swap,
  Shield,
  User,
  Mail,
  Phone
} from "lucide-react"
import { useSeasons, useSeason, useUpdateSeason, useSeasonGroups, useSeasonTeamStatistics, useCreateGroup, useCreateTeamStatistics, useAddMatchScheduler, useMatchSchedules, useTeamsByIds, useDeleteTeamStatisticsForSeason, useDeleteGroupsForSeason } from '@/hooks/use-seasons'
import { useTeams } from "@/hooks/use-teams"
import { useUpdateMatchScheduler } from "@/hooks/use-matches"
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
  const { updateMatchScheduler, loading: updateMatchLoading } = useUpdateMatchScheduler()

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
  
  // Edit match state (for Season Matches section)
  const [editingMatch, setEditingMatch] = useState<any>(null)
  const [editMatchForm, setEditMatchForm] = useState({
    team1_id: "",
    team2_id: "",
    location: "",
    dateAndtime: ""
  })
  const [isEditMatchModalOpen, setIsEditMatchModalOpen] = useState(false)

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

  const handleEditMatch = (match: any) => {
    const matchDate = new Date(match.dateAndtime)
    const dateStr = matchDate.toISOString().split('T')[0]
    const timeStr = matchDate.toTimeString().slice(0, 5)
    
    setEditingMatch(match)
    setEditMatchForm({
      team1_id: match.team1 || "",
      team2_id: match.team2 || "",
      location: match.location || "",
      dateAndtime: `${dateStr}T${timeStr}`
    })
    setIsEditMatchModalOpen(true)
  }

  const handleSaveMatchEdit = async () => {
    if (!editingMatch) return

    try {
      const matchDate = new Date(editMatchForm.dateAndtime)
      const dateAndtimeStr = matchDate.toISOString()

      await updateMatchScheduler({
        variables: {
          matchId: editingMatch.id,
          team1: editMatchForm.team1_id || null,
          team2: editMatchForm.team2_id || null,
          location: editMatchForm.location || null,
          dateAndtime: dateAndtimeStr || null
        }
      })

      toast({
        title: "Match Updated!",
        description: "Match details have been updated successfully.",
      })

      setIsEditMatchModalOpen(false)
      setEditingMatch(null)
      setEditMatchForm({
        team1_id: "",
        team2_id: "",
        location: "",
        dateAndtime: ""
      })

      // Refetch matches to show updated data
      refetchMatchSchedules()
    } catch (error: any) {
      console.error('Error updating match:', error)
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update match. Please try again.",
        variant: "destructive"
      })
    }
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
    <div className="min-h-screen relative font-['Outfit'] bg-transparent overflow-x-hidden">
      {/* Tactical Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-lime-400/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Header */}
      <div className="glass-dark border-b border-white/5 relative z-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link href="/admin/season-scheduler">
                <Button variant="outline" size="sm" className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white font-bold uppercase tracking-widest text-[10px] rounded-none transition-all">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  RETURN TO BASE
                </Button>
              </Link>
              <div className="w-12 h-12 bg-black/40 border border-lime-500/30 rounded-none flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                <Trophy className="w-6 h-6 text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.8)]" />
              </div>
              <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">{season.name}</h1>
                <p className="text-white/40 font-bold tracking-widest uppercase text-xs mt-1">Campaign Node Management</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setIsEditDialogOpen(true)} className="bg-lime-400/20 text-lime-300 border border-lime-400/50 hover:bg-lime-400 hover:text-black font-black italic uppercase tracking-widest text-[10px] rounded-none transition-all shadow-[0_0_20px_rgba(190,242,100,0.2)]">
                <Edit className="w-4 h-4 mr-2" />
                MODIFY CONFIG
              </Button>
              <Button variant="outline" className="h-10 bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-white font-bold uppercase tracking-widest text-[10px] rounded-none transition-all flex items-center gap-2">
                <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                ABORT CAMPAIGN
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Season Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40 backdrop-blur-xl group hover:border-lime-400/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-none flex items-center justify-center group-hover:bg-lime-400/10 group-hover:border-lime-400/30 transition-all">
                  <Trophy className="h-5 w-5 text-white/60 group-hover:text-lime-400 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-2">Campaign Status</p>
                  <Badge variant="outline" className={`font-bold uppercase tracking-widest text-[9px] border rounded-none ${status.color}`}>
                    {status.text}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40 backdrop-blur-xl group hover:border-cyan-400/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-none flex items-center justify-center group-hover:bg-cyan-400/10 group-hover:border-cyan-400/30 transition-all">
                  <Calendar className="h-5 w-5 text-white/60 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Operation Window</p>
                  <p className="text-sm font-mono tracking-widest text-cyan-200 bg-cyan-950/40 border border-cyan-500/20 px-2 flex items-center h-6 max-w-max rounded-none">
                    {formatDate(season.startDate)} - {formatDate(season.EndDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40 backdrop-blur-xl group hover:border-purple-400/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-none flex items-center justify-center group-hover:bg-purple-400/10 group-hover:border-purple-400/30 transition-all">
                  <Users className="h-5 w-5 text-white/60 group-hover:text-purple-400 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Enlisted Squads</p>
                  <p className="text-3xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{totalTeams}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40 backdrop-blur-xl group hover:border-yellow-400/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-none flex items-center justify-center group-hover:bg-yellow-400/10 group-hover:border-yellow-400/30 transition-all">
                  <Target className="h-5 w-5 text-white/60 group-hover:text-yellow-400 transition-colors" />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-dark border border-white/10 rounded-none overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-1 bg-lime-400 h-full opacity-50 shadow-[0_0_15px_rgba(163,230,53,0.5)]" />
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-lime-400" />
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-widest text-white">INTELLIGENCE <span className="text-lime-400">REPORT</span></h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">OPERATIONAL ID</span>
                      <span className="font-mono text-sm text-lime-300 bg-lime-400/5 border border-lime-400/10 px-3 py-1 self-start">#{season.id}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">CODENAME</span>
                      <span className="font-black italic uppercase text-lg text-white tracking-widest">{season.name}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/30">DEPLOYMENT WINDOW</span>
                       <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-white/40 uppercase">INITIATION</span>
                          <span className="font-mono text-xs text-white">{formatDate(season.startDate)}</span>
                        </div>
                        <div className="w-8 h-px bg-white/10" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-white/40 uppercase">TERMINATION</span>
                          <span className="font-mono text-xs text-white">{formatDate(season.EndDate)}</span>
                        </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Integration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex-col bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 text-white rounded-none transition-all group"
                onClick={() => setIsInviteTeamsModalOpen(true)}
                disabled={availableTeamsToInvite.length === 0}
              >
                <Plus className="h-5 w-5 mb-2 text-lime-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">ENLIST SQUADRONS</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex-col bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 text-white rounded-none transition-all group"
                onClick={() => setIsScheduleMatchesModalOpen(true)}
              >
                <Target className="h-5 w-5 mb-2 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">GENERATE FIXTURES</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex-col bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-purple-400/10 text-white rounded-none transition-all group"
                onClick={() => seasonGroups.length > 0 ? setIsViewGroupsModalOpen(true) : setIsCreateGroupModalOpen(true)}
              >
                <Users className="h-5 w-5 mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{seasonGroups.length > 0 ? 'VIEW PROTOCOLS' : 'INIT GROUPS'}</span>
              </Button>
            </div>
          </div>

          {/* Side Metrics */}
          <div className="space-y-6">
            <div className="glass-dark border border-white/10 p-6 flex flex-col items-center justify-center text-center rounded-none aspect-square">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-none flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white/20" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">OPERATIONAL SQUADS</span>
              <span className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{seasonTeams.length}</span>
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-lime-400" />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-widest text-white">ACTIVE <span className="text-lime-400">ENLISTMENTS</span></h3>
            </div>
            <div className="h-px flex-1 bg-white/5 mx-8 hidden md:block" />
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-white/10 text-white/50 px-4 py-2 rounded-none">{seasonTeams.length} SQUADS DETECTED</Badge>
          </div>

          <div className="glass-dark border border-white/10 rounded-none overflow-hidden">
            {seasonTeams.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-white/10" />
                </div>
                <p className="text-white/40 font-black italic uppercase tracking-widest text-sm">No squad telemetry found on this node</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">SQUADRON</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">COMMANDER</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14 text-center">ASSETS</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">INVITATION TOKEN</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14 text-right">PROTOCOLS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seasonTeams.map((team: any) => {
                      const teamId = team.id
                      if (!teamId) return null
                      const invitationToken = season?.teams?.[teamId] || 'N/A'
                      
                      return (
                        <TableRow key={teamId} className="border-white/5 hover:bg-white/5 transition-colors group">
                          <TableCell className="py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-lime-400/30 transition-all">
                                <span className="text-[10px] font-black text-white/40 group-hover:text-lime-400">{(team.name || "UN").substring(0,2).toUpperCase()}</span>
                              </div>
                              <div>
                                <div className="font-black italic uppercase text-sm text-white tracking-widest group-hover:text-lime-400 transition-colors">
                                  {team.name || team.team_name || `Team ${teamId}`}
                                </div>
                                <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                                  TAG: {team.shortname || team.short_name || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-bold text-xs text-white/80 group-hover:text-white transition-colors">
                                {team.manager?.name || 'N/A'}
                              </div>
                              <div className="text-[9px] font-mono text-white/20">
                                {team.manager?.email || 'N/A'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-mono text-xs text-lime-400/60">{team.players?.length || 0}</span>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-[10px] bg-cyan-400/5 px-3 py-1.5 border border-cyan-400/20 text-cyan-400 font-bold shadow-[0_0_10px_rgba(34,211,238,0.05)] tracking-wider">
                              {invitationToken}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedTeam(team)
                                setIsTeamModalOpen(true)
                              }}
                              className="text-white/40 hover:text-lime-400 hover:bg-lime-400/10 rounded-none font-black uppercase text-[9px] tracking-widest"
                            >
                              <Eye className="h-3 w-3 mr-2" />
                              INSPECT
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        {/* Season Matches Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                <Target className="h-5 w-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-widest text-white">STRATEGIC <span className="text-cyan-400">FIXTURES</span></h3>
            </div>
            <div className="h-px flex-1 bg-white/5 mx-8 hidden md:block" />
            <Button 
              onClick={() => refetchMatchSchedules()}
              variant="outline"
              size="sm"
              disabled={matchSchedulesLoading}
              className="bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-300 text-white font-black italic uppercase tracking-widest text-[10px] rounded-none h-10 px-6 transition-all"
            >
              {matchSchedulesLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400/50 border-t-cyan-400"></div>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  RE-SYNC LOGS
                </>
              )}
            </Button>
          </div>

          {matchSchedulesLoading ? (
             <div className="glass-dark border border-white/10 p-20 text-center rounded-none">
              <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-cyan-400 font-black italic uppercase tracking-widest text-xs">Accessing Match Data...</p>
            </div>
          ) : matchSchedulesError ? (
            <div className="glass-dark border border-red-500/20 p-12 text-center rounded-none">
              <p className="text-red-400 font-black italic uppercase tracking-widest text-sm mb-2">TELEMETRY ERROR</p>
              <p className="text-white/40 font-mono text-xs">{matchSchedulesError.message}</p>
            </div>
          ) : matchSchedules.filter((match: any) => match.season_id === seasonId).length === 0 ? (
            <div className="glass-dark border border-white/10 p-20 text-center rounded-none">
              <Calendar className="h-12 w-12 text-white/5 mx-auto mb-6" />
              <p className="text-white/30 font-black italic uppercase tracking-widest text-sm mb-8">No scheduled engagements detected</p>
              <Button 
                className="bg-cyan-400 text-black hover:bg-cyan-500 rounded-none font-black italic uppercase tracking-widest text-[11px] h-12 px-8"
                onClick={() => setIsScheduleMatchesModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                INITIATE SCHEDULER
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchSchedules
                .filter((match: any) => match.season_id === seasonId)
                .map((match: any) => (
                  <div key={match.id} className="group relative glass-dark border border-white/10 hover:border-cyan-400/40 transition-all p-6 rounded-none flex flex-col justify-between h-full bg-black/40 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-widest bg-white/5 text-white/40 border-white/10 rounded-none">
                          REF: {match.id.substring(0, 8)}
                        </Badge>
                        <div className="text-right">
                          <div className="text-[10px] text-cyan-400 font-mono tracking-widest leading-none mb-1">
                            {new Date(match.dateAndtime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                          </div>
                          <div className="text-xl font-black italic tracking-tighter text-white">
                            {new Date(match.dateAndtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 py-4 border-y border-white/5 my-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] text-white/30">
                            {(match.Team1?.name || "T1").substring(0,2).toUpperCase()}
                          </div>
                          <span className="font-black italic uppercase text-xs text-white tracking-widest truncate">{match.Team1?.name || `Team ${match.team1}`}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] text-white/30">
                            {(match.Team2?.name || "T2").substring(0,2).toUpperCase()}
                          </div>
                          <span className="font-black italic uppercase text-xs text-white/70 tracking-widest truncate">{match.Team2?.name || `Team ${match.team2}`}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">{match.location || "TBD ARENA"}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditMatch(match)}
                          className="h-8 text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-none font-black uppercase text-[9px] tracking-widest"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          OVERRIDE
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Team Details Modal (Team Intelligence Profile) */}
      <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-black/90 backdrop-blur-3xl border border-white/10 rounded-none shadow-2xl text-white p-0 flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />
          
          {selectedTeam && (
            <div className="p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
              <DialogHeader className="mb-8">
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center relative group">
                      <div className="absolute inset-0 bg-lime-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {selectedTeam.logo ? (
                        <img 
                          src={selectedTeam.logo} 
                          alt={`${selectedTeam.name} Logo`}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <Shield className="h-6 w-6 text-lime-400/60" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black italic uppercase tracking-[0.2em] text-white leading-none">
                        {selectedTeam.name || selectedTeam.team_name}
                      </h2>
                      <p className="text-[10px] font-mono text-lime-400/60 uppercase tracking-widest mt-1">
                        TEAM_INTELLIGENCE_PROFILE // {selectedTeam.shortname || selectedTeam.short_name || "N/A"}
                      </p>
                    </div>
                  </DialogTitle>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Basic Intelligence */}
                <div className="glass-dark border border-white/10 p-6 rounded-none relative">
                   <div className="absolute top-0 left-0 w-full p-2 bg-white/5 border-b border-white/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-white/40 animate-pulse rounded-full" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">BASIC_IDENTITY_NODE</span>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">DESIGNATION</span>
                      <span className="text-[11px] font-black italic uppercase text-white tracking-widest">{selectedTeam.name || selectedTeam.team_name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">SHORT_NAME</span>
                      <span className="text-[11px] font-black italic uppercase text-lime-400 tracking-widest">{selectedTeam.shortname || selectedTeam.short_name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">CORE_ID</span>
                      <span className="text-[10px] font-mono text-white/60">{selectedTeam.id || selectedTeam.team_id}</span>
                    </div>
                  </div>
                </div>

                {/* Manager Command Profile */}
                <div className="glass-dark border border-lime-400/20 bg-lime-400/5 p-6 rounded-none relative">
                  <div className="absolute top-0 left-0 w-full p-2 bg-lime-400/10 border-b border-lime-400/20 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-lime-400 animate-pulse rounded-full" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-lime-400/60">COMMAND_OVERRIDE_AUTH</span>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-black/40 border border-lime-400/30 flex items-center justify-center">
                        <User className="h-5 w-5 text-lime-400/40" />
                      </div>
                      <div>
                        <h3 className="font-black italic uppercase text-[12px] text-white tracking-widest leading-none">
                          {selectedTeam.manager?.name || "UNKNOWN_CMD"}
                        </h3>
                        <p className="text-[8px] font-mono text-lime-400 uppercase mt-1">CHIEF_SQUADRON_OFFICER</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-white/60">
                        <Mail className="h-3 w-3 text-lime-400/40" />
                        {selectedTeam.manager?.email || "OFFLINE"}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                        <Phone className="h-3 w-3 text-lime-400/20" />
                        {selectedTeam.manager?.phone || "UNCERTAIN"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personnel Manifest */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">PERSONNEL_MANIFEST</span>
                  <div className="h-px flex-1 bg-white/5" />
                  <Badge variant="outline" className="rounded-none border-white/10 font-mono text-[9px] text-white/30 text-[8px] h-5">
                    {selectedTeam.players?.length || 0} UNITS
                  </Badge>
                </div>
                
                {selectedTeam.players && selectedTeam.players.length > 0 ? (
                  <div className="glass-dark border border-white/10 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-white/5">
                        <TableRow className="border-white/10 hover:bg-transparent h-10">
                          <TableHead className="text-[8px] font-black uppercase tracking-widest text-white/40">OPERATIVE_ID</TableHead>
                          <TableHead className="text-[8px] font-black uppercase tracking-widest text-white/40">CONTACT_VECTOR</TableHead>
                          <TableHead className="text-[8px] font-black uppercase tracking-widest text-white/40">GENOTYPE</TableHead>
                          <TableHead className="text-[8px] font-black uppercase tracking-widest text-white/40">BIRTH_NODE</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTeam.players.map((player: any) => (
                          <TableRow key={player.id} className="border-white/5 hover:bg-lime-400/10 transition-colors group h-12">
                            <TableCell className="py-2">
                              <span className="font-black italic uppercase text-[11px] text-white tracking-[0.2em]">{player.name}</span>
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="text-[10px] font-mono text-white/60">{player.email}</div>
                              <div className="text-[9px] font-mono text-white/40">{player.phone}</div>
                            </TableCell>
                            <TableCell className="py-2">
                              <Badge variant="outline" className={`rounded-none border-white/20 font-mono text-[9px] uppercase py-0.5 px-2 ${player.gender === 'male' ? 'text-cyan-400 border-cyan-400/30' : 'text-purple-400 border-purple-400/30'}`}>
                                {player.gender}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 text-[10px] font-mono text-white/40">
                              {player.dob ? new Date(player.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase() : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 text-center glass-dark border border-dashed border-white/10 bg-white/5">
                    <Users className="h-8 w-8 text-white/10 mx-auto mb-3" />
                    <p className="text-[9px] font-black italic uppercase tracking-widest text-white/30">No active personnel detected</p>
                  </div>
                )}
              </div>

              {/* Security Protocol (Token) */}
              <div className="glass-dark border border-cyan-400/20 bg-cyan-400/5 p-6 rounded-none relative">
                 <div className="absolute top-0 left-0 w-full p-2 bg-cyan-400/10 border-b border-cyan-400/20 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 animate-pulse rounded-full" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400/60">SECURITY_TOKEN_V3</span>
                  </div>
                   <div className="mt-6">
                    <p className="text-[10px] font-black italic uppercase text-white/80 tracking-[0.2em] mb-4 flex items-center gap-2">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                      ACTIVE SEASON INVITATION HASH
                    </p>
                    <div className="bg-black/90 border border-cyan-400/30 p-6 rounded-none relative group overflow-hidden shadow-[inset_0_0_30px_rgba(34,211,238,0.05)]">
                       <div className="absolute inset-0 bg-cyan-400/5 opacity-100" />
                       <code className="text-sm font-mono font-bold text-cyan-400 break-all relative z-10 block text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                         {season?.teams?.[selectedTeam.id || selectedTeam.team_id] || 'NODE_NULL_AUTH_REQUIRED'}
                       </code>
                    </div>
                  </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end p-8 mt-auto bg-black/40 border-t border-white/10">
            <Button 
              onClick={() => setIsTeamModalOpen(false)} 
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-none font-black italic uppercase tracking-widest text-[11px] h-12 px-12 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              DISCONNECT_PROFILE
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Teams Modal */}
      <Dialog open={isInviteTeamsModalOpen} onOpenChange={setIsInviteTeamsModalOpen}>
        <DialogContent className="max-w-2xl bg-black/80 backdrop-blur-2xl border border-white/10 rounded-none shadow-2xl text-white p-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />
          
          <div className="p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-lime-400" />
                </div>
                <span className="text-xl font-black italic uppercase tracking-widest">SQUADRON <span className="text-lime-400">ENLISTMENT</span></span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="p-4 bg-lime-400/5 border border-lime-400/10 flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-lime-400 mt-0.5" />
                <p className="text-[11px] font-bold text-lime-400/70 leading-relaxed uppercase tracking-wider">
                  Select available squadrons to enlist in this campaign. Teams must be approved by high command before appearing in this ledger.
                </p>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {availableTeamsToInvite.length === 0 ? (
                  <div className="py-12 text-center border border-white/5 bg-white/5">
                    <p className="text-white/30 font-black italic uppercase tracking-widest text-xs">No eligible squadrons available</p>
                  </div>
                ) : (
                  availableTeamsToInvite.map((team: any) => {
                    const teamId = team.id
                    if (!teamId) return null
                    return (
                      <div 
                        key={teamId} 
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-lime-400/30 transition-all group"
                      >
                        <div className="flex items-center gap-4">
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
                            className="border-white/20 data-[state=checked]:bg-lime-400 data-[state=checked]:border-lime-400 rounded-none w-5 h-5"
                          />
                          <div className="flex flex-col">
                            <label 
                              htmlFor={`invite-team-${teamId}`} 
                              className="font-black italic uppercase text-sm tracking-widest text-white group-hover:text-lime-400 transition-colors cursor-pointer"
                            >
                              {team.name || team.team_name || `Team ${teamId}`}
                            </label>
                            <span className="text-[10px] font-mono text-white/30 uppercase">SIG: {team.shortname || 'N/A'}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="font-mono text-[9px] border-white/10 text-white/40 rounded-none bg-white/5 px-2">
                          MANAGER: {team.manager?.name || 'N/A'}
                        </Badge>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-10">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsInviteTeamsModalOpen(false)
                  setSelectedTeamsToInvite([])
                }}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-none font-black italic uppercase tracking-widest text-[11px] h-12 px-8 transition-all"
              >
                ABORT
              </Button>
              <Button 
                onClick={handleInviteTeams}
                disabled={selectedTeamsToInvite.length === 0 || updateLoading}
                className="bg-lime-400 text-black hover:bg-lime-500 rounded-none font-black italic uppercase tracking-widest text-[11px] h-12 px-8 shadow-[0_0_20px_rgba(163,230,53,0.3)]"
              >
                {updateLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    ENLIST {selectedTeamsToInvite.length > 0 ? `(${selectedTeamsToInvite.length})` : ''} SQUADRONS
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Group Modal */}
      <Dialog open={isCreateGroupModalOpen} onOpenChange={setIsCreateGroupModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-black/90 backdrop-blur-3xl border border-white/10 rounded-none shadow-2xl text-white p-0 flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
          
          <div className="p-8 flex flex-col h-full">
            <DialogHeader className="mb-8">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-400/10 border border-purple-400/30 flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-xl font-black italic uppercase tracking-widest text-white">GROUP <span className="text-purple-400">INITIATION</span></span>
                </DialogTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">SQUADRON STATUS</span>
                    <Badge variant="outline" className="font-mono text-[10px] border-lime-400/30 text-lime-400 rounded-none bg-lime-400/5">
                      {getUnassignedTeams().length} UNASSIGNED
                    </Badge>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-12">
                {/* Protocol Creation Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-dark border border-white/10 p-8 rounded-none relative">
                    <div className="absolute top-0 left-0 w-full p-2 bg-white/5 border-b border-white/5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 animate-pulse rounded-full" />
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">PROTOCOL_CREATE_NEW</span>
                    </div>
                    <div className="flex gap-4 items-end mt-4">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="groupName" className="text-[10px] font-black uppercase tracking-widest text-white/40">NEW GROUP DESIGNATION</Label>
                        <Input
                          id="groupName"
                          placeholder="e.g. ALPHA_CLUSTER, BRAVO_SECTOR"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          className="bg-black/40 border border-white/10 rounded-none h-12 text-white font-black italic uppercase tracking-widest placeholder:text-white/10 focus:border-purple-400/50 transition-all"
                        />
                      </div>
                      <Button 
                        onClick={handleCreateGroup} 
                        disabled={!newGroupName.trim() || createGroupLoading}
                        className="bg-white/5 border border-white/20 hover:border-purple-400/50 hover:bg-purple-400/10 text-white rounded-none h-12 font-black italic uppercase tracking-widest text-[11px] transition-all"
                      >
                        {createGroupLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        CREATE
                      </Button>
                    </div>
                  </div>

                  <div className="glass-dark border border-white/10 p-8 rounded-none relative">
                    <div className="absolute top-0 left-0 w-full p-2 bg-white/5 border-b border-white/5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-lime-400 animate-pulse rounded-full" />
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">TACTICAL_RANDOMIZATION</span>
                    </div>
                    <div className="flex gap-4 items-end mt-4">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="numberOfGroups" className="text-[10px] font-black uppercase tracking-widest text-white/40">SECTOR COUNT</Label>
                        <Select value={numberOfGroups.toString()} onValueChange={(value) => setNumberOfGroups(parseInt(value))}>
                          <SelectTrigger className="bg-black/40 border border-white/10 rounded-none h-12 text-white font-black italic uppercase tracking-widest focus:border-lime-400/50 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border border-white/10 rounded-none">
                            {[2, 3, 4, 5, 6].map(num => (
                              <SelectItem key={num} value={num.toString()} className="font-black uppercase text-[10px] text-white focus:bg-white/10">
                                {num} SECTORS
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={randomizeTeamsIntoGroups}
                        disabled={seasonTeams.length === 0}
                        className="bg-lime-400 text-black hover:bg-lime-500 rounded-none h-12 font-black italic uppercase tracking-widest text-[11px] px-6 shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                      >
                        🎲 RANDOMIZE
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Randomized Preview */}
                {isRandomized && randomizedGroups.length > 0 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-400 border-l-2 border-lime-400 pl-4 h-4 flex items-center">THEORETICAL SECTOR PREVIEW</h3>
                      <div className="flex gap-4">
                        <Button 
                          variant="outline" 
                          onClick={resetRandomization}
                          className="bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-white rounded-none font-black italic uppercase tracking-widest text-[10px] h-10 px-6 transition-all"
                        >
                          🔄 RE-CALCULATE
                        </Button>
                        <Button 
                          onClick={confirmRandomization}
                          className="bg-blue-600 text-white hover:bg-blue-700 rounded-none font-black italic uppercase tracking-widest text-[10px] h-10 px-6 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                        >
                          ✅ CONFIRM DEPLOYMENT
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {randomizedGroups.map((group, index) => (
                        <div key={group.id} className="glass-dark border border-white/10 p-6 rounded-none relative">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-black italic uppercase text-lg text-white tracking-widest">{group.name}</h4>
                            <Badge variant="outline" className="font-mono text-[10px] border-white/10 text-white/40 rounded-none bg-white/5">
                              {group.teams.length} SQUADS
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            {group.teams.map(teamId => {
                              const team = getTeamById(teamId)
                              return (
                                <div key={teamId} className="bg-white/5 p-3 border border-white/5 text-[10px] font-black italic uppercase tracking-widest text-white/60">
                                  {team?.name || team?.team_name || `Team ${teamId}`}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Groups Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Existing Groups Ledger */}
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-l-2 border-purple-400 pl-4 h-4 flex items-center">ACTIVE SECTORS ({groups.length})</h3>
                    {groups.length === 0 ? (
                      <div className="p-20 text-center border border-dashed border-white/10 bg-white/5">
                        <Users className="h-8 w-8 mx-auto mb-4 text-white/10" />
                        <p className="text-[10px] font-black italic uppercase tracking-widest text-white/30">No active sectors detected</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {groups.map(group => (
                          <div 
                            key={group.id} 
                            className="glass-dark border border-white/10 p-6 rounded-none relative group"
                            onDragOver={(e) => {
                              e.preventDefault()
                              const target = e.currentTarget
                              target.style.borderColor = 'rgba(168, 85, 247, 0.5)'
                              target.style.background = 'rgba(168, 85, 247, 0.05)'
                            }}
                            onDragLeave={(e) => {
                              const target = e.currentTarget
                              target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                              target.style.background = 'transparent'
                            }}
                            onDrop={() => {
                              if (draggedTeam) {
                                handleAddTeamToGroup(draggedTeam, group.id)
                              }
                            }}
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h4 className="font-black italic uppercase text-lg text-white tracking-widest group-hover:text-purple-400 transition-colors">{group.name}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteGroup(group.id)}
                                className="text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-none h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              {group.teams.length === 0 && (
                                <div className="py-8 text-center border border-dashed border-white/5 rounded-none">
                                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Drop squadron data here</p>
                                </div>
                              )}
                              {group.teams.map(teamId => {
                                const team = getTeamById(teamId)
                                return (
                                  <div key={teamId} className="flex items-center justify-between bg-white/5 p-3 border border-white/5 group/team">
                                    <span className="text-[10px] font-black italic uppercase tracking-widest text-white/80 group-hover/team:text-white transition-colors">
                                      {team?.name || team?.team_name || `Team ${teamId}`}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveTeamFromGroup(teamId, group.id)}
                                      className="text-white/20 hover:text-red-500 rounded-none h-6 w-6 p-0"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Available Manifest */}
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-l-2 border-lime-400 pl-4 h-4 flex items-center">UNASSIGNED SQUADRONS ({getUnassignedTeams().length})</h3>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {getUnassignedTeams().map((team: any) => {
                        const teamId = team.id
                        if (!teamId) return null
                        
                        return (
                          <div
                            key={teamId}
                            className="flex items-center justify-between bg-white/5 p-4 border border-white/10 hover:border-white/30 cursor-move transition-all group"
                            draggable
                            onDragStart={() => setDraggedTeam(teamId)}
                            onDragEnd={() => setDraggedTeam(null)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center font-black text-[9px] text-white/20">
                                {(team.name || "UN").substring(0,2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-black italic uppercase text-xs text-white tracking-widest group-hover:text-lime-400 transition-colors">
                                  {team.name || team.team_name || `Team ${teamId}`}
                                </div>
                                <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                                  TAG: {team.shortname || 'N/A'}
                                </div>
                              </div>
                            </div>
                            
                            {groups.length > 0 && (
                              <Select onValueChange={(groupId) => handleAddTeamToGroup(teamId, groupId)}>
                                <SelectTrigger className="w-28 h-8 bg-white/5 text-[9px] font-black uppercase tracking-widest border-white/10 rounded-none text-white/40">
                                  <SelectValue placeholder="DEPLOY TO..." />
                                </SelectTrigger>
                                <SelectContent className="bg-black/90 border border-white/10 rounded-none">
                                  {groups.map(group => (
                                    <SelectItem key={group.id} value={group.id} className="font-black uppercase text-[10px] text-white focus:bg-white/10">
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
              </div>
            </div>
            
            <div className="flex justify-end pt-8 mt-auto px-8 pb-8">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateGroupModalOpen(false)} 
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-none font-black italic uppercase tracking-widest text-[11px] h-12 px-12 transition-all"
              >
                DISCONNECT
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Groups Modal */}
      <Dialog open={isViewGroupsModalOpen} onOpenChange={setIsViewGroupsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-black/90 backdrop-blur-3xl border border-white/10 rounded-none shadow-2xl text-white p-0 flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          
          <div className="p-8 flex flex-col h-full">
            <DialogHeader className="mb-8">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                    <LayoutGrid className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-xl font-black italic uppercase tracking-widest text-white">SECTOR <span className="text-cyan-400">INTELLIGENCE</span></span>
                </DialogTitle>
                
                {status.status === 'upcoming' && (
                  <Button
                    onClick={() => {
                      setIsViewGroupsModalOpen(false)
                      setIsCreateGroupModalOpen(true)
                    }}
                    className="bg-white/5 border border-white/20 hover:border-cyan-400/50 hover:bg-cyan-400/10 text-white rounded-none font-black italic uppercase tracking-widest text-[10px] h-10 px-6 transition-all"
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    MODIFY PROTOCOLS
                  </Button>
                )}
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {groupsLoading ? (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 bg-white/5">
                  <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">DECRYPTING SECTOR DATA...</p>
                </div>
              ) : seasonGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 bg-white/5">
                  <Users className="h-12 w-12 text-white/10 mb-6" />
                  <p className="text-[10px] font-black italic uppercase tracking-widest text-white/30">No active sectors detected in this campaign</p>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {seasonGroups.map((group: any) => {
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
                        <div key={group.id} className="glass-dark border border-white/10 p-0 rounded-none overflow-hidden group">
                          <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
                            <h4 className="font-black italic uppercase text-lg text-white tracking-widest group-hover:text-cyan-400 transition-colors">
                              {group.name}
                            </h4>
                            <Badge variant="outline" className="font-mono text-[10px] border-cyan-400/30 text-cyan-400 rounded-none bg-cyan-400/5">
                              {teamsInGroup.length} SQUADS ACTIVE
                            </Badge>
                          </div>
                          
                          <div className="p-6">
                            {teamsInGroup.length === 0 ? (
                              <div className="py-12 text-center border border-dashed border-white/5 rounded-none">
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Zero squadrons assigned to sector</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {teamsInGroup.map((teamStat: any) => (
                                  <div key={teamStat.id} className="bg-black/40 border border-white/5 p-4 hover:border-white/20 transition-all flex items-center justify-between group/team">
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center font-black text-[12px] text-white/40">
                                        {(teamStat.teamName || "UN").substring(0,2).toUpperCase()}
                                      </div>
                                      <div>
                                        <h5 className="font-black italic uppercase text-xs text-white tracking-widest group-hover/team:text-cyan-400 transition-colors">{teamStat.teamName}</h5>
                                        <div className="flex items-center gap-3">
                                          <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">SIG: {teamStat.teamShortName}</span>
                                          <span className="text-[8px] font-bold text-cyan-400/50 uppercase tracking-widest bg-cyan-400/5 px-1.5 py-0.5 border border-cyan-400/10">LVL: {teamStat.played}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xl font-black italic text-cyan-400 tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                                        {teamStat.points}
                                      </div>
                                      <div className="text-[8px] font-black uppercase text-white/20 tracking-widest">PTS</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Operational Summary Ledger */}
                  <div className="glass-dark border border-white/10 p-8 rounded-none relative">
                    <div className="absolute top-0 left-0 w-full p-2 bg-white/5 border-b border-white/5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 animate-pulse rounded-full" />
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">ANALYTICS_AGGREGATION_MAIN</span>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-4 pt-4">
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase text-white/30 tracking-[0.2em] block">SECTORS</span>
                        <div className="text-3xl font-black italic uppercase text-white tracking-tighter">{seasonGroups.length}</div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase text-white/30 tracking-[0.2em] block">SQUADRONS</span>
                        <div className="text-3xl font-black italic uppercase text-cyan-400 tracking-tighter">{seasonTeamStatistics.length}</div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase text-white/30 tracking-[0.2em] block">TOTAL_PTS</span>
                        <div className="text-3xl font-black italic uppercase text-white tracking-tighter">
                          {seasonTeamStatistics.reduce((total: number, stat: any) => total + (parseInt(stat.points) || 0), 0)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase text-white/30 tracking-[0.2em] block">MUNITIONS_EXPENDED (GOALS)</span>
                        <div className="text-3xl font-black italic uppercase text-lime-400 tracking-tighter">
                          {seasonTeamStatistics.reduce((total: number, stat: any) => total + (parseInt(stat.goals_for) || 0), 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-8 mt-auto px-8 pb-8">
              <Button 
                variant="outline" 
                onClick={() => setIsViewGroupsModalOpen(false)}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-none font-black italic uppercase tracking-widest text-[11px] h-12 px-12 transition-all"
              >
                DISCONNECT
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Matches Modal */}
      <Dialog open={isScheduleMatchesModalOpen} onOpenChange={setIsScheduleMatchesModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-black/90 backdrop-blur-3xl border border-white/10 rounded-none shadow-2xl text-white p-0 flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />
          
          <div className="p-8 flex flex-col h-full">
            <DialogHeader className="mb-8">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-lime-400" />
                  </div>
                  <span className="text-xl font-black italic uppercase tracking-widest text-white">SCHEDULING <span className="text-lime-400">HUB</span></span>
                </DialogTitle>
                
                {scheduledMatches.length > 0 && (
                  <Button 
                    onClick={saveMatchesToDatabase}
                    disabled={addMatchLoading}
                    className="bg-lime-400 text-black hover:bg-lime-500 rounded-none h-10 px-6 font-black italic uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all"
                  >
                    {addMatchLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    EXECUTE BATCH UPLOAD
                  </Button>
                )}
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-8">
                {/* Initial Configuration */}
                {scheduledMatches.length === 0 && matchSchedules.filter((match: any) => match.season_id === seasonId).length === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 glass-dark border border-white/10 p-8 rounded-none relative">
                      <div className="absolute top-0 left-0 w-full p-2 bg-white/5 border-b border-white/5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-lime-400 animate-pulse rounded-full" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">OPERATIONAL_VENUE_CONFIG</span>
                      </div>
                      <div className="mt-4 space-y-4">
                        <Label htmlFor="default-venue" className="text-[10px] font-black uppercase tracking-widest text-white/40">DEFAULT SECTOR VENUE</Label>
                        <Input
                          id="default-venue"
                          value={defaultVenue}
                          onChange={(e) => setDefaultVenue(e.target.value)}
                          placeholder="ENTER VENUE DESIGNATION"
                          className="bg-black/40 border border-white/10 rounded-none h-12 text-white font-black italic uppercase tracking-widest focus:border-lime-400/50 transition-all"
                        />
                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Global override for all generated engagement coordinates</p>
                      </div>
                    </div>

                    <div className="glass-dark border border-lime-400/20 bg-lime-400/5 p-8 rounded-none relative flex flex-col justify-between">
                      <div className="absolute top-0 left-0 w-full p-2 bg-lime-400/10 border-b border-lime-400/20 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-lime-400 animate-pulse rounded-full" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-lime-400/60">INITIATE_PROTOCOL</span>
                      </div>
                      <div className="mt-4">
                        <h3 className="font-black italic uppercase text-sm text-white mb-2 tracking-widest">GENERATE MATRIX</h3>
                        <p className="text-[9px] text-white/40 leading-relaxed uppercase font-bold">Calculate weekend engagement nodes for all defined sectors (Group stage + Finals).</p>
                      </div>
                      <Button 
                        onClick={scheduleMatches}
                        disabled={isScheduling || seasonGroups.length === 0}
                        className="bg-lime-400 text-black hover:bg-lime-500 rounded-none h-12 font-black italic uppercase tracking-widest text-[11px] shadow-[0_0_20px_rgba(163,230,53,0.3)] mt-6"
                      >
                        {isScheduling ? <RefreshCw className="h-4 w-4 animate-spin" /> : "START GENERATION"}
                      </Button>
                    </div>
                  </div>
                )}
                {scheduledMatches.length > 0 && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">GENERATED_MATRIX_NODES</span>
                        <Badge variant="outline" className="font-mono text-[11px] border-lime-400/30 text-lime-400 rounded-none bg-lime-400/5">
                          {scheduledMatches.length} NODES CREATED
                        </Badge>
                      </div>
                      <div className="flex gap-4">
                         <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5">
                           <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">WK1</span>
                           <span className="text-[10px] font-mono font-bold text-white/60">{scheduledMatches.filter(m => m.weekend === 1).length}</span>
                         </div>
                         <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5">
                           <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">WK2</span>
                           <span className="text-[10px] font-mono font-bold text-white/60">{scheduledMatches.filter(m => m.weekend === 2).length}</span>
                         </div>
                      </div>
                    </div>

                    {selectedMatchForSwap && (
                      <div className="bg-cyan-400/10 border border-cyan-400/30 p-4 rounded-none flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
                        <div className="w-10 h-10 bg-cyan-400/20 border border-cyan-400 flex items-center justify-center">
                          <Swap className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black italic uppercase text-cyan-400 tracking-widest">NODE SWAP PROTOCOL ACTIVE</p>
                          <p className="text-[9px] text-white/60 uppercase font-bold tracking-widest">Select secondary engagement node to initiate squadron coordinates exchange</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => setSelectedMatchForSwap(null)}
                          className="ml-auto text-white/40 hover:text-white rounded-none text-[10px] font-black uppercase"
                        >
                          ABORT SWAP
                        </Button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-12">
                      {(() => {
                        const matchesByDate = scheduledMatches.reduce((acc: any, match) => {
                          const date = match.date
                          if (!acc[date]) acc[date] = []
                          acc[date].push(match)
                          return acc
                        }, {})

                        return Object.entries(matchesByDate).map(([date, dayMatches]: [string, any]) => (
                          <div key={date} className="space-y-6">
                            <div className="flex items-center gap-4">
                              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white border-l-2 border-lime-400 pl-4 py-1">
                                {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                              </h4>
                              <div className="h-px flex-1 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                              {dayMatches.map((match: any) => {
                                const team1 = getTeamById(match.team1_id)
                                const team2 = match.team2_id ? getTeamById(match.team2_id) : null
                                const isPlaceholder = match.type === 'placeholder' || !match.team2_id
                                const isSelected = selectedMatchForSwap === match.id
                                const isSwapable = !isPlaceholder
                                
                                return (
                                  <div 
                                    key={match.id} 
                                    onClick={() => isSwapable && handleMatchClick(match.id, match)}
                                    className={`glass-dark border p-4 rounded-none transition-all cursor-pointer group relative overflow-hidden ${
                                      isSelected 
                                        ? 'border-cyan-400 bg-cyan-400/5 shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
                                        : isSwapable 
                                          ? 'border-white/10 hover:border-white/30 hover:bg-white/5' 
                                          : 'border-white/5 opacity-60 cursor-not-allowed'
                                    }`}
                                  >
                                    <div className="absolute top-0 right-0 p-1.5 bg-white/5 border-b border-l border-white/10">
                                      <span className="text-[7px] font-mono text-white/40 uppercase tracking-widest">{match.day} | WK{match.weekend}</span>
                                    </div>

                                    <div className="flex items-center justify-between mb-4 mt-2">
                                      <div className="text-center flex-1">
                                        <div className="text-[10px] font-black italic uppercase text-white/70 truncate mb-1">
                                          {team1?.name || team1?.team_name || "???"}
                                        </div>
                                        <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">{team1?.shortname || "UNK"}</div>
                                      </div>
                                      
                                      <div className="px-3 flex flex-col items-center">
                                        <span className="text-[9px] font-black text-lime-400/40 italic">VS</span>
                                      </div>

                                      <div className="text-center flex-1">
                                        <div className={`text-[10px] font-black italic uppercase truncate mb-1 ${isPlaceholder ? 'text-orange-400' : 'text-white/70'}`}>
                                          {isPlaceholder ? "TBD_NODE" : (team2?.name || team2?.team_name || "???")}
                                        </div>
                                        <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">{isPlaceholder ? "???" : (team2?.shortname || "UNK")}</div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
                                      <div className="space-y-1">
                                        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">OPERATIONAL_VENUE</span>
                                        <div className="text-[9px] font-black text-white/60 truncate italic uppercase">
                                           <Input
                                              value={match.venue}
                                              onChange={(e) => {
                                                const updatedMatches = scheduledMatches.map(m => 
                                                  m.id === match.id ? { ...m, venue: e.target.value } : m
                                                )
                                                setScheduledMatches(updatedMatches)
                                              }}
                                              onClick={e => e.stopPropagation()}
                                              className="h-6 bg-transparent border-none p-0 text-[10px] font-black text-white/60 uppercase focus-visible:ring-0 focus-visible:ring-offset-0"
                                            />
                                        </div>
                                      </div>
                                      <div className="space-y-1 text-right">
                                        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">DEPLOYMENT_TIME</span>
                                        <div className="text-[10px] font-black text-cyan-400 italic tabular-nums">
                                           <Input
                                              type="time"
                                              value={match.time}
                                              onChange={(e) => {
                                                const updatedMatches = scheduledMatches.map(m => 
                                                  m.id === match.id ? { ...m, time: e.target.value } : m
                                                )
                                                setScheduledMatches(updatedMatches)
                                              }}
                                              onClick={e => e.stopPropagation()}
                                              className="h-6 bg-transparent border-none p-0 text-[10px] font-black text-cyan-400 text-right focus-visible:ring-0 focus-visible:ring-offset-0"
                                            />
                                        </div>
                                      </div>
                                    </div>

                                    {matchBeingEdited === match.id && (
                                      <div className="absolute inset-0 bg-black/95 backdrop-blur-md p-4 flex flex-col justify-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                                        <Label className="text-[8px] font-black uppercase text-white/40 mb-2 tracking-[0.2em]">RE-ASSIGN OPPONENT</Label>
                                        <Select value={newOpponentId} onValueChange={setNewOpponentId}>
                                          <SelectTrigger className="h-8 bg-white/5 border-white/10 text-[9px] font-black italic uppercase tracking-widest text-white rounded-none">
                                            <SelectValue placeholder="SELECT SQUADRON" />
                                          </SelectTrigger>
                                          <SelectContent className="bg-black/90 border border-white/10 rounded-none">
                                            {seasonTeams.filter((t: any) => (t.id || t.team_id).toString() !== match.team1_id?.toString()).map((team: any) => (
                                              <SelectItem key={team.id || team.team_id} value={(team.id || team.team_id).toString()} className="font-black uppercase text-[10px] text-white focus:bg-white/10">
                                                {team.name || team.team_name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <div className="flex gap-2 mt-4">
                                          <Button size="sm" onClick={() => changeOpponent(match.id, newOpponentId)} className="flex-1 bg-lime-400 text-black rounded-none h-8 font-black text-[9px] uppercase tracking-widest">CONFIRM</Button>
                                          <Button size="sm" variant="outline" onClick={() => setMatchBeingEdited(null)} className="flex-1 border-white/10 text-white rounded-none h-8 font-black text-[9px] uppercase tracking-widest">ABORT</Button>
                                        </div>
                                      </div>
                                    )}

                                    {isSwapable && (
                                       <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setMatchBeingEdited(match.id)
                                          }}
                                          className="absolute top-1 left-1 h-5 w-5 p-0 text-white/10 hover:text-white/60"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                )}

                {scheduledMatches.length === 0 && matchSchedules.filter((match: any) => match.season_id === seasonId).length === 0 && !isScheduling && (
                  <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 bg-white/5 mt-8">
                    <Calendar className="h-12 w-12 text-white/10 mb-6" />
                    <p className="text-[10px] font-black italic uppercase tracking-widest text-white/30">No active matrix detected</p>
                    <p className="text-[8px] font-mono text-white/20 mt-2 uppercase">Initiate protocol to generate engagement nodes</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-8 mt-auto px-8 pb-8 gap-4">
              <Button 
                variant="outline" 
                onClick={() => setIsScheduleMatchesModalOpen(false)}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-none font-black italic uppercase tracking-widest text-[11px] h-12 px-8 transition-all"
              >
                DISCONNECT
              </Button>
              
              {scheduledMatches.length > 0 && (
                <>
                  <Button 
                    onClick={reshuffleMatches}
                    disabled={isScheduling}
                    className="bg-white/5 border border-white/10 hover:bg-purple-600/20 hover:border-purple-400 hover:text-white text-white/60 rounded-none h-12 px-8 font-black italic uppercase tracking-widest text-[11px] transition-all"
                  >
                    {isScheduling ? <RefreshCw className="h-4 w-4 animate-spin" /> : "RE-CALC"}
                  </Button>
                  <Button 
                    onClick={saveMatchesToDatabase}
                    disabled={addMatchLoading}
                    className="bg-lime-400 text-black hover:bg-lime-500 rounded-none h-12 px-12 font-black italic uppercase tracking-widest text-[11px] shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all"
                  >
                    {addMatchLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "FINALIZE NODES"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Match Modal */}
      <Dialog open={isEditMatchModalOpen} onOpenChange={setIsEditMatchModalOpen}>
        <DialogContent className="max-w-2xl overflow-hidden bg-black/90 backdrop-blur-3xl border border-white/10 rounded-none shadow-2xl text-white p-0 flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
          
          <div className="p-8 flex flex-col h-full">
            <DialogHeader className="mb-8">
              <DialogTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-400/10 border border-orange-400/30 flex items-center justify-center">
                  <Edit className="h-4 w-4 text-orange-400" />
                </div>
                <span className="text-xl font-black italic uppercase tracking-widest text-white">MANUAL <span className="text-orange-400">OVERRIDE</span></span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">SQUADRON ALPHA</Label>
                  <Select 
                    value={editMatchForm.team1_id} 
                    onValueChange={(value) => setEditMatchForm({ ...editMatchForm, team1_id: value })}
                  >
                    <SelectTrigger className="bg-black/40 border border-white/10 rounded-none h-12 text-white font-black italic uppercase tracking-widest focus:border-orange-400/50 transition-all">
                      <SelectValue placeholder="SELECT TEAM" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-white/10 rounded-none">
                      {seasonTeams.map((team: any) => (
                        <SelectItem key={team.id || team.team_id} value={(team.id || team.team_id).toString()} className="font-black uppercase text-[10px] text-white focus:bg-white/10">
                          {team.name || team.team_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">SQUADRON BRAVO</Label>
                  <Select 
                    value={editMatchForm.team2_id} 
                    onValueChange={(value) => setEditMatchForm({ ...editMatchForm, team2_id: value })}
                  >
                    <SelectTrigger className="bg-black/40 border border-white/10 rounded-none h-12 text-white font-black italic uppercase tracking-widest focus:border-orange-400/50 transition-all">
                      <SelectValue placeholder="SELECT TEAM" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-white/10 rounded-none">
                      {seasonTeams.filter((team: any) => (team.id || team.team_id).toString() !== editMatchForm.team1_id).map((team: any) => (
                        <SelectItem key={team.id || team.team_id} value={(team.id || team.team_id).toString()} className="font-black uppercase text-[10px] text-white focus:bg-white/10">
                          {team.name || team.team_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">COORDINATE VECTOR (LOCATION)</Label>
                <Input
                  placeholder="e.g. ALPHA_SECTION_7"
                  value={editMatchForm.location}
                  onChange={(e) => setEditMatchForm({ ...editMatchForm, location: e.target.value })}
                  className="bg-black/40 border border-white/10 rounded-none h-12 text-white font-black italic uppercase tracking-widest focus:border-orange-400/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">CALENDAR_NODE</Label>
                  <Input
                    type="date"
                    value={editMatchForm.dateAndtime.split('T')[0]}
                    onChange={(e) => {
                      const currentTime = editMatchForm.dateAndtime.split('T')[1] || '12:00'
                      setEditMatchForm({ ...editMatchForm, dateAndtime: `${e.target.value}T${currentTime}` })
                    }}
                    className="bg-black/40 border border-white/10 rounded-none h-12 text-white font-black italic uppercase tracking-widest focus:border-orange-400/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">TIME_STAMP</Label>
                  <Input
                    type="time"
                    value={editMatchForm.dateAndtime.split('T')[1] || '12:00'}
                    onChange={(e) => {
                      const currentDate = editMatchForm.dateAndtime.split('T')[0]
                      setEditMatchForm({ ...editMatchForm, dateAndtime: `${currentDate}T${e.target.value}` })
                    }}
                    className="bg-black/40 border border-white/10 rounded-none h-12 text-white font-black italic uppercase tracking-widest focus:border-orange-400/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-12 pb-8">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditMatchModalOpen(false)
                  setEditingMatch(null)
                  setEditMatchForm({ team1_id: "", team2_id: "", location: "", dateAndtime: "" })
                }}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-none font-black italic uppercase tracking-widest text-[11px] h-12 px-8 transition-all"
              >
                ABORT_MISSION
              </Button>
              <Button 
                onClick={handleSaveMatchEdit}
                disabled={updateMatchLoading || !editMatchForm.team1_id || !editMatchForm.team2_id || !editMatchForm.location || !editMatchForm.dateAndtime}
                className="bg-orange-500 text-black hover:bg-orange-600 rounded-none h-12 px-8 font-black italic uppercase tracking-widest text-[11px] shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              >
                {updateMatchLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "OVERWRITE_NODE"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Season Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl overflow-hidden bg-black/90 backdrop-blur-3xl border border-white/10 rounded-none shadow-2xl text-white p-0 flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
          
          <div className="p-8 flex flex-col h-full">
            <DialogHeader className="mb-8">
              <DialogTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-400/10 border border-blue-400/30 flex items-center justify-center">
                  <Edit className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-xl font-black italic uppercase tracking-widest text-white">SYSTEM <span className="text-blue-400">RECONFIG</span></span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">CAMPAIGN DESIGNATION</Label>
                    <Input
                      value={season?.name || ''}
                      className="bg-black/40 border border-white/10 rounded-none h-12 text-white font-black italic uppercase tracking-widest focus:border-blue-400/50 transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">START_WINDOW</Label>
                      <Input
                        type="date"
                        value={season?.startDate || ''}
                        className="bg-black/40 border border-white/10 rounded-none h-10 text-[10px] text-white font-black italic uppercase tracking-widest focus:border-blue-400/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">END_WINDOW</Label>
                      <Input
                        type="date"
                        value={season?.EndDate || ''}
                        className="bg-black/40 border border-white/10 rounded-none h-10 text-[10px] text-white font-black italic uppercase tracking-widest focus:border-blue-400/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">SQUADRON MANIFEST ({Object.keys(season?.teams || {}).length} TOTAL)</Label>
                  <div className="bg-black/40 border border-white/10 rounded-none p-4 h-[240px] overflow-y-auto custom-scrollbar space-y-2">
                    {allTeams?.filter((team: any) => team.approved === true).map((team: any) => {
                      const teamId = team.id
                      if (!teamId) return null
                      const isAlreadyInSeason = season?.teams?.[teamId]
                      
                      return (
                        <div key={teamId} className="flex items-center justify-between p-2 bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={`edit-season-team-${teamId}`}
                              checked={!!isAlreadyInSeason}
                              onCheckedChange={(checked) => {
                                 // Logic preserved from original
                                 if (checked) {
                                   const token = `e${Date.now()}${Math.random().toString(36).substr(2, 9)}`
                                   const newTeamsObject = { ...season?.teams, [teamId]: token }
                                   updateSeason({ variables: { id: seasonId, name: season?.name, startDate: season?.startDate, EndDate: season?.EndDate, teams: newTeamsObject } }).then(() => refetch())
                                 } else {
                                   const newTeamsObject = { ...season?.teams }
                                   delete newTeamsObject[teamId]
                                   updateSeason({ variables: { id: seasonId, name: season?.name, startDate: season?.startDate, EndDate: season?.EndDate, teams: newTeamsObject } }).then(() => refetch())
                                 }
                              }}
                              className="border-white/20 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 rounded-none"
                            />
                            <Label htmlFor={`edit-season-team-${teamId}`} className="text-[10px] font-black italic uppercase tracking-widest text-white/70 cursor-pointer">
                              {team.name}
                            </Label>
                          </div>
                          <span className="text-[8px] font-mono text-white/20">{team.shortname}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-8 pb-8">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)} 
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-none font-black italic uppercase tracking-widest text-[11px] h-12 px-12 transition-all"
              >
                CLOSE_PROTOCOL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Season Matches Section */}

    </div>
  )
} 