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
  MoreHorizontal
} from "lucide-react"
import { useSeason } from "@/hooks/use-seasons"
import { useTeams } from "@/hooks/use-teams"
import Link from "next/link"
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  
  const { season, loading, error } = useSeason(seasonId)
  
  // Debug logging for hook results
  console.log('useSeason hook results:', { season, loading, error })
  console.log('Season data:', season)
  console.log('Loading state:', loading)
  console.log('Error state:', error)
  
  const { teams } = useTeams()

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

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)

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
              <Button variant="outline" className="h-20 flex-col">
                <Plus className="h-6 w-6 mb-2" />
                <span>Invite More Teams</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                <span>Schedule Matches</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span>Manage Teams</span>
              </Button>
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
    </div>
  )
} 