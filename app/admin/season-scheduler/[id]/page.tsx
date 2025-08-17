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
  X
} from "lucide-react"
import { useSeason, useUpdateSeason, useCreateGroup, useCreateTeamStatistics, useSeasonGroups, useSeasonTeamStatistics } from "@/hooks/use-seasons"
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
  
  // Debug logging
  console.log('Route params:', params)
  console.log('Season ID from params:', seasonId)
  console.log('Season ID type:', typeof seasonId)
  
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
  
  // Debug logging for hook results
  console.log('useSeason hook results:', { season, loading, error })
  console.log('Season data:', season)
  console.log('Loading state:', loading)
  console.log('Error state:', error)
  
  const { teams } = useTeams()
  const { updateSeason, loading: updateLoading } = useUpdateSeason()
  const { createGroup, loading: createGroupLoading } = useCreateGroup()
  const { createTeamStatistics, loading: createTeamStatsLoading } = useCreateTeamStatistics()
  const { groups: seasonGroups, loading: groupsLoading, error: groupsError, refetch: refetchGroups } = useSeasonGroups(seasonId)
  const { teamStatistics: seasonTeamStatistics, loading: statsLoading, error: statsError, refetch: refetchStats } = useSeasonTeamStatistics(seasonId)

  // Get the specific teams that are part of this season
  const seasonTeams = React.useMemo(() => {
    if (!season?.teams || !teams) return []
    
    const seasonTeamIds = Object.keys(season.teams)
    console.log('Season team IDs:', seasonTeamIds)
    
    return teams.filter((team: any) => {
      const teamIdentifier = team.id || team.team_id || team._id || Object.keys(team)[0]
      return seasonTeamIds.includes(teamIdentifier?.toString())
    })
  }, [season?.teams, teams])

  console.log('Season teams found:', seasonTeams)
  console.log('All teams:', teams)

  // Get teams that are NOT already in this season
  const availableTeamsToInvite = React.useMemo(() => {
    if (!teams || !season?.teams) return teams || []
    
    const seasonTeamIds = Object.keys(season.teams)
    return teams.filter((team: any) => {
      const teamIdentifier = team.id || team.team_id || team._id || Object.keys(team)[0]
      return !seasonTeamIds.includes(teamIdentifier?.toString())
    })
  }, [teams, season?.teams])

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

      console.log('Inviting teams:', selectedTeamsToInvite)
      console.log('New teams object:', newTeamsObject)
      
      // Validate that all required fields have values
      if (!season.name || !season.startDate || !season.EndDate) {
        alert('Season data is incomplete. Cannot update teams.')
        console.error('Missing season data:', { name: season.name, startDate: season.startDate, EndDate: season.EndDate })
        return
      }
      
      console.log('Updating season with data:', {
        id: seasonId,
        name: season.name,
        startDate: season.startDate,
        EndDate: season.EndDate,
        teams: newTeamsObject
      })

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

      console.log('Update result:', result)

      if (result.data?.update_seasons_by_pk) {
        // Show success message
        alert(`Successfully invited ${selectedTeamsToInvite.length} team(s) to the season!`)
        
        // Reset and close modal
        setSelectedTeamsToInvite([])
        setIsInviteTeamsModalOpen(false)
        
        // Refetch the season data to show updated teams
        await refetch()
        
        console.log('Season updated successfully:', result.data.update_seasons_by_pk)
      } else {
        throw new Error('Failed to update season')
      }
      
    } catch (error) {
      console.error('Error inviting teams:', error)
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
        
        console.log('Group created successfully:', newGroup)
      } else {
        throw new Error('Failed to create group')
      }
      
    } catch (error) {
      console.error('Error creating group:', error)
      alert('Failed to create group. Please try again.')
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
        
        console.log('Team statistics created successfully for team:', teamId, 'in group:', groupId)
      } else {
        throw new Error('Failed to create team statistics')
      }
      
    } catch (error) {
      console.error('Error adding team to group:', error)
      alert('Failed to add team to group. Please try again.')
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

  const getTeamById = (teamId: string) => {
    return seasonTeams.find((team: any) => {
      const teamIdentifier = team.id || team.team_id || team._id || Object.keys(team)[0]
      return teamIdentifier === teamId
    })
  }

  const getUnassignedTeams = () => {
    const assignedTeamIds = groups.flatMap(g => g.teams)
    return seasonTeams.filter((team: any) => {
      const teamIdentifier = team.id || team.team_id || team._id || Object.keys(team)[0]
      return !assignedTeamIds.includes(teamIdentifier)
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
        const teamIdentifier = team.id || team.team_id || team._id || Object.keys(team)[0]
        return teamIdentifier
      })
      
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
        description: "Groups and team assignments have been saved to the database!",
      })
      
      // Close modal
      setIsCreateGroupModalOpen(false)
      
      console.log('Randomization confirmed and saved:', savedGroups)
      
    } catch (error) {
      console.error('Error confirming randomization:', error)
      alert('Failed to save groups. Please try again.')
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

  const scheduleMatches = async () => {
    if (!season || seasonGroups.length === 0) {
      alert('Please create groups first before scheduling matches')
      return
    }

    setIsScheduling(true)
    
    try {
      const weekendDates = generateWeekendDates(season.startDate, season.EndDate)
      const totalWeekends = weekendDates.length
      
      if (totalWeekends < 2) {
        alert('Season must be at least 2 weeks long to schedule matches')
        setIsScheduling(false)
        return
      }

      const matches: any[] = []
      
      // Get teams from each group
      const groupTeams = seasonGroups.map(group => {
        const groupTeamStats = seasonTeamStatistics.filter((stat: any) => stat.group_id === group.id)
        return {
          groupId: group.id,
          groupName: group.name,
          teams: groupTeamStats.map((stat: any) => ({
            team_id: stat.team_id,
            teamName: getTeamById(stat.team_id)?.name || `Team ${stat.team_id}`
          }))
        }
      })

      // Schedule matches for first 2 weekends
      for (let weekend = 0; weekend < Math.min(2, Math.floor(totalWeekends / 2)); weekend++) {
        const saturdayIndex = weekend * 2
        const sundayIndex = weekend * 2 + 1
        
        if (saturdayIndex < weekendDates.length && sundayIndex < weekendDates.length) {
          const saturday = weekendDates[saturdayIndex]
          const sunday = weekendDates[sundayIndex]
          
          // Randomize which group plays on Saturday vs Sunday for fairness
          const saturdayGroupIndex = Math.random() < 0.5 ? 0 : 1
          const sundayGroupIndex = saturdayGroupIndex === 0 ? 1 : 0
          
          const weekendNumber = weekend + 1
          
          // Schedule Saturday matches
          const saturdayGroup = groupTeams[saturdayGroupIndex]
          if (saturdayGroup && saturdayGroup.teams.length >= 2) {
            const shuffledTeams = [...saturdayGroup.teams].sort(() => Math.random() - 0.5)
            const maxGamesPerDay = Math.min(4, Math.floor(saturdayGroup.teams.length / 2))
            
            for (let game = 0; game < maxGamesPerDay; game++) {
              const team1Index = game * 2
              const team2Index = game * 2 + 1
              
              if (team2Index < shuffledTeams.length) {
                matches.push({
                  id: `match-${Date.now()}-w${weekendNumber}-sat-${game}`,
                  team1_id: shuffledTeams[team1Index].team_id,
                  team2_id: shuffledTeams[team2Index].team_id,
                  date: saturday,
                  time: '', // Will be set manually
                  group_id: saturdayGroup.groupId,
                  venue: defaultVenue,
                  status: 'scheduled',
                  weekend: weekendNumber,
                  day: 'Saturday',
                  groupName: saturdayGroup.groupName
                })
              }
            }
          }
          
          // Schedule Sunday matches
          const sundayGroup = groupTeams[sundayGroupIndex]
          if (sundayGroup && sundayGroup.teams.length >= 2) {
            const shuffledTeams = [...sundayGroup.teams].sort(() => Math.random() - 0.5)
            const maxGamesPerDay = Math.min(4, Math.floor(sundayGroup.teams.length / 2))
            
            for (let game = 0; game < maxGamesPerDay; game++) {
              const team1Index = game * 2
              const team2Index = game * 2 + 1
              
              if (team2Index < shuffledTeams.length) {
                matches.push({
                  id: `match-${Date.now()}-w${weekendNumber}-sun-${game}`,
                  team1_id: shuffledTeams[team1Index].team_id,
                  team2_id: shuffledTeams[team2Index].team_id,
                  date: sunday,
                  time: '', // Will be set manually
                  group_id: sundayGroup.groupId,
                  venue: defaultVenue,
                  status: 'scheduled',
                  weekend: weekendNumber,
                  day: 'Sunday',
                  groupName: sundayGroup.groupName
                })
              }
            }
          }
        }
      }

      setScheduledMatches(matches)
      
      toast({
        title: "Matches Scheduled!",
        description: `${matches.length} matches have been scheduled for the first 2 weekends. Groups are randomly assigned to Saturday vs Sunday for fairness.`,
      })
      
      console.log('Scheduled matches:', matches)
      
    } catch (error) {
      console.error('Error scheduling matches:', error)
      alert('Failed to schedule matches. Please try again.')
    } finally {
      setIsScheduling(false)
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
    team1_id: string
    team2_id: string
    date: string
    time: string
    group_id: string
    venue: string
    status: string
    weekend: number
    day: string
    groupName: string
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

  const getTeamDetails = (teamId: string) => {
    return teams?.find((team: any) => {
      const teamIdentifier = team.id || team.team_id || team._id || Object.keys(team)[0]
      return teamIdentifier && teamIdentifier.toString() === teamId.toString()
    })
  }

  const getTeamNames = (teamsObject: Record<string | number, string>) => {
    if (!teamsObject || !teams) return []
    return Object.keys(teamsObject).map(teamId => {
      const team = getTeamDetails(teamId)
      return team?.name || team?.team_name || `Team ${teamId}`
    })
  }

  const status = getSeasonStatus(season)
  const teamNames = getTeamNames(season.teams)
  const totalTeams = seasonTeams.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/season-scheduler">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Seasons
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{season.name}</h1>
                <p className="text-sm text-gray-600">Season Details & Management</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Season
              </Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Season
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Season Status</p>
                  <Badge className={status.color}>
                    {status.text}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(season.startDate)} - {formatDate(season.EndDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teams Participating</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTeams}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Days Remaining</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {Math.max(0, Math.ceil((new Date(season.EndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Season Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Season Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Basic Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Season ID:</span>
                    <span className="font-medium">#{season.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{season.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={status.color}>
                      {status.text}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{formatDate(season.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-600" />
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{formatDate(season.EndDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teams Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participating Teams ({seasonTeams.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {seasonTeams.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No teams have been invited to this season yet.</p>
                <Button className="mt-4" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Teams
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Players</TableHead>
                      <TableHead>Invitation Token</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seasonTeams.map((team: any) => {
                      const teamId = team.id || team.team_id || team._id || Object.keys(team)[0]
                      const invitationToken = season?.teams?.[teamId] || 'N/A'
                      
                      return (
                        <TableRow key={teamId}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">
                                {team.name || team.team_name || `Team ${teamId}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {team.shortname || team.short_name || 'N/A'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">
                                {team.manager?.name || 'N/A'}
                              </div>
                              <div className="text-gray-500">
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
                            <div className="text-xs font-mono bg-gray-100 p-2 rounded">
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Season Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No matches have been scheduled for this season yet.</p>
              <Button className="mt-4" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Matches
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => setIsInviteTeamsModalOpen(true)}
                disabled={availableTeamsToInvite.length === 0}
              >
                <Plus className="h-6 w-6 mb-2" />
                <span>Invite More Teams</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
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
              {seasonGroups.length > 0 ? (
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => setIsViewGroupsModalOpen(true)}
                >
                  <Users className="h-6 w-6 mb-2" />
                  <span>View Groups</span>
          
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Team Name:</span>
                      <span className="font-medium">{selectedTeam.name || selectedTeam.team_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Short Name:</span>
                      <span className="font-medium">{selectedTeam.shortname || selectedTeam.short_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Team ID:</span>
                      <span className="font-medium">{selectedTeam.id || selectedTeam.team_id || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Manager Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedTeam.manager?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedTeam.manager?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedTeam.manager?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Players Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Players ({selectedTeam.players?.length || 0})</h3>
                {selectedTeam.players && selectedTeam.players.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Date of Birth</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTeam.players.map((player: any) => (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium">{player.name}</TableCell>
                            <TableCell>{player.email}</TableCell>
                            <TableCell>{player.phone}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{player.gender}</Badge>
                            </TableCell>
                            <TableCell>{player.dob ? new Date(player.dob).toLocaleDateString() : 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No players found for this team</p>
                  </div>
                )}
              </div>

              {/* Season Invitation */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Season Invitation</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-600 mb-2">Invitation Token:</div>
                  <div className="font-mono text-xs bg-white p-2 rounded border">
                    {season?.teams?.[selectedTeam.id || selectedTeam.team_id] || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsTeamModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Teams Modal */}
      <Dialog open={isInviteTeamsModalOpen} onOpenChange={setIsInviteTeamsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Invite Teams to Season
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Select teams to invite to "{season?.name}". Teams that are already in this season are not shown.
              </p>
              
              {availableTeamsToInvite.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No teams available to invite</p>
                  <p className="text-sm">All teams are already part of this season</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto border rounded-md p-3">
                  {availableTeamsToInvite.map((team: any) => {
                    const teamId = team.id || team.team_id || team._id || Object.keys(team)[0]
                    
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
                          <div className="text-xs text-gray-500">
                            {team.shortname || team.short_name || 'N/A'} • Manager: {team.manager?.name || 'N/A'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              
              {selectedTeamsToInvite.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <h3 className="font-semibold text-gray-900 mb-4">Quick Randomization</h3>
              <div className="flex gap-4 items-end">
                <div>
                  <Label htmlFor="numberOfGroups">Number of Groups</Label>
                  <Select value={numberOfGroups.toString()} onValueChange={(value) => setNumberOfGroups(parseInt(value))}>
                    <SelectTrigger className="w-32">
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
                  <h3 className="font-semibold text-gray-900">Randomized Groups Preview</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={resetRandomization}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      🔄 Reset
                    </Button>
                    <Button 
                      onClick={confirmRandomization}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      ✅ Confirm & Save
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {randomizedGroups.map((group, index) => (
                    <div key={group.id} className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-blue-900">{group.name}</h4>
                        <Badge variant="secondary">{group.teams.length} teams</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {group.teams.map(teamId => {
                          const team = getTeamById(teamId)
                          return (
                            <div key={teamId} className="bg-white p-2 rounded border text-sm">
                              {team?.name || team?.team_name || `Team ${teamId}`}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
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
                <h3 className="font-semibold text-gray-900">Groups ({groups.length})</h3>
                {groups.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No groups created yet</p>
                    <p className="text-sm">Create a group to start organizing teams</p>
                  </div>
                ) : (
                  groups.map(group => (
                    <div key={group.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{group.name}</h4>
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
                <h3 className="font-semibold text-gray-900">Available Teams ({getUnassignedTeams().length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getUnassignedTeams().map((team: any) => {
                    const teamId = team.id || team.team_id || team._id || Object.keys(team)[0]
                    
                    return (
                      <div
                        key={teamId}
                        className="flex items-center justify-between bg-white p-3 rounded border cursor-move hover:bg-gray-50"
                        draggable
                        onDragStart={() => setDraggedTeam(teamId)}
                        onDragEnd={() => setDraggedTeam(null)}
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {team.name || team.team_name || `Team ${teamId}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {team.shortname || team.short_name || 'N/A'}
                          </div>
                        </div>
                        
                        {/* Quick Add to Group */}
                        {groups.length > 0 && (
                          <Select onValueChange={(groupId) => handleAddTeamToGroup(teamId, groupId)}>
                            <SelectTrigger className="w-32">
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
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 How to Use Groups</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Create groups</strong> to organize teams for match scheduling</li>
                <li>• <strong>Drag and drop</strong> teams between groups or use the quick add dropdown</li>
                <li>• <strong>Groups will be used</strong> when scheduling matches to ensure fair competition</li>
                <li>• <strong>Teams can only be in one group</strong> at a time</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsCreateGroupModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Groups Modal */}
      <Dialog open={isViewGroupsModalOpen} onOpenChange={setIsViewGroupsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              View Season Groups & Statistics
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {groupsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : seasonGroups.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
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
                      <Card key={group.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Season Matches
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Location Setting */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label htmlFor="default-venue" className="text-sm font-medium text-blue-900">
                    Default Venue for All Games
                  </Label>
                  <Input
                    id="default-venue"
                    value={defaultVenue}
                    onChange={(e) => setDefaultVenue(e.target.value)}
                    placeholder="Enter venue name (e.g., Prime Arena, Stadium A)"
                    className="mt-1"
                  />
                  <p className="text-xs text-blue-700 mt-1">
                    This venue will be applied to all scheduled matches. You can change individual match venues later.
                  </p>
                </div>
                {scheduledMatches.length > 0 && (
                  <Button 
                    onClick={updateAllVenues}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    🏟️ Apply to All
                  </Button>
                )}
              </div>
            </div>

            {/* Scheduling Controls */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Randomized Group Weekend Scheduling</h3>
                <p className="text-sm text-gray-600">
                  Weekend 1 & 2: Groups are randomly assigned to Saturday vs Sunday for fairness. Each group gets equal opportunities.
                </p>
              </div>
              <Button 
                onClick={scheduleMatches}
                disabled={isScheduling || seasonGroups.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isScheduling ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Calendar className="h-4 w-4 mr-2" />
                )}
                {isScheduling ? 'Scheduling...' : 'Generate Matches'}
              </Button>
            </div>

            {/* Scheduled Matches Display */}
            {scheduledMatches.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Scheduled Matches ({scheduledMatches.length})
                  </h3>
                  <Badge variant="outline">
                    Weekend 1: {scheduledMatches.filter(m => m.weekend === 1).length} matches | 
                    Weekend 2: {scheduledMatches.filter(m => m.weekend === 2).length} matches
                  </Badge>
                </div>

                {/* Group matches by date */}
                {(() => {
                  const matchesByDate = scheduledMatches.reduce((acc: any, match) => {
                    const date = match.date
                    if (!acc[date]) acc[date] = []
                    acc[date].push(match)
                    return acc
                  }, {})

                  return Object.entries(matchesByDate).map(([date, dayMatches]: [string, any]) => (
                    <Card key={date}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                          <Badge variant="secondary">{dayMatches.length} matches</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {dayMatches.map((match: any) => {
                            const team1 = getTeamById(match.team1_id)
                            const team2 = getTeamById(match.team2_id)
                            
                            return (
                              <div key={match.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium">
                                      {team1?.name || team1?.team_name || `Team ${match.team1_id}`}
                                    </span>
                                    <span className="text-gray-400">vs</span>
                                    <span className="font-medium">
                                      {team2?.name || team2?.team_name || `Team ${match.team2_id}`}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    Group: {seasonGroups.find(g => g.id === match.group_id)?.name || 'N/A'} | 
                                    Weekend {match.weekend} - {match.day}
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 mt-2">
                                  <Input
                                    value={match.venue}
                                    onChange={(e) => {
                                      const updatedMatches = scheduledMatches.map(m => 
                                        m.id === match.id ? { ...m, venue: e.target.value } : m
                                      )
                                      setScheduledMatches(updatedMatches)
                                    }}
                                    placeholder="Venue"
                                    className="text-xs h-8"
                                  />
                                  <span className="text-xs text-gray-500">|</span>
                                  <Input
                                    value={match.time}
                                    onChange={(e) => {
                                      const updatedMatches = scheduledMatches.map(m => 
                                        m.id === match.id ? { ...m, time: e.target.value } : m
                                      )
                                      setScheduledMatches(updatedMatches)
                                    }}
                                    placeholder="Time (e.g., 14:00)"
                                    className="text-xs h-8 w-24"
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                })()}

                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Match Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{scheduledMatches.length}</div>
                        <div className="text-sm text-gray-500">Total Matches</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {scheduledMatches.filter(m => m.weekend === 1).length}
                        </div>
                        <div className="text-sm text-gray-500">Weekend 1</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {scheduledMatches.filter(m => m.weekend === 2).length}
                        </div>
                        <div className="text-sm text-gray-500">Weekend 2</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {new Set(scheduledMatches.map(m => m.date)).size}
                        </div>
                        <div className="text-sm text-gray-500">Weekend Days</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* No matches scheduled */}
            {scheduledMatches.length === 0 && !isScheduling && (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No matches scheduled yet</p>
                <p className="text-sm">Click "Generate Matches" to create the season schedule</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsScheduleMatchesModalOpen(false)}>
              Close
            </Button>
            {scheduledMatches.length > 0 && (
              <Button 
                onClick={updateAllVenues}
                className="bg-blue-600 hover:bg-blue-700"
              >
                🏟️ Update All Venues
              </Button>
            )}
            {scheduledMatches.length > 0 && (
              <Button 
                onClick={() => {
                  // TODO: Save matches to database
                  alert('Matches will be saved to database (implementation pending)')
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                💾 Save to Database
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 