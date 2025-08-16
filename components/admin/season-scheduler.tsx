"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Users,
  Trophy,
  CalendarDays,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { useSeasons, useCreateSeason, useUpdateSeason, useDeleteSeason } from "@/hooks/use-seasons"
import { useTeams } from "@/hooks/use-teams"
import { toast } from "@/hooks/use-toast"

interface Season {
  id: number
  name: string
  startDate: string
  EndDate: string
  teams: Record<string | number, string> // JSONB object with team IDs as keys and tokens as values
}

interface Team {
  id: number
  name: string
  shortname: string
  team_manager: string
}

interface SeasonSchedulerProps {
  onSeasonCreated?: (season: Season) => void
}

export function SeasonScheduler({ onSeasonCreated }: SeasonSchedulerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSeason, setEditingSeason] = useState<Season | null>(null)
  
  // Form state
  const [seasonName, setSeasonName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedTeams, setSelectedTeams] = useState<(string | number)[]>([])
  const [description, setDescription] = useState("")

  // Hooks
  const { seasons, loading, error, refetch } = useSeasons()
  const { teams } = useTeams()
  const { createSeason, loading: createLoading } = useCreateSeason()
  const { updateSeason, loading: updateLoading } = useUpdateSeason()
  const { deleteSeason, loading: deleteLoading } = useDeleteSeason()

  // Filter seasons based on search and status
  const filteredSeasons = seasons.filter((season: Season) => {
    const matchesSearch = season.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && new Date(season.EndDate) > new Date()) ||
      (statusFilter === "completed" && new Date(season.EndDate) <= new Date())
    
    return matchesSearch && matchesStatus
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!isCreateDialogOpen && !isEditDialogOpen) {
      resetForm()
    }
  }, [isCreateDialogOpen, isEditDialogOpen])

  const resetForm = () => {
    setSeasonName("")
    setStartDate("")
    setEndDate("")
    setSelectedTeams([])
    setDescription("")
    setEditingSeason(null)
  }

  const handleCreateSeason = async () => {
    if (!seasonName || !startDate || !endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date",
        variant: "destructive",
      })
      return
    }

    // Validate that teams are selected
    if (!selectedTeams || selectedTeams.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one team",
        variant: "destructive",
      })
      return
    }

    try {
      // Create teams object with team IDs as keys and generated tokens as values
      const teamsObject: Record<string, string> = {}
      
      // Filter out any undefined or invalid team IDs
      const validTeamIds = selectedTeams.filter(teamId => teamId !== undefined && teamId !== null)
      
      if (validTeamIds.length === 0) {
        toast({
          title: "Validation Error",
          description: "No valid team IDs found",
          variant: "destructive",
        })
        return
      }

      validTeamIds.forEach(teamId => {
        if (teamId !== undefined && teamId !== null) {
          // Generate a unique token for each team (you can customize this format)
          const token = `e${Date.now()}${Math.random().toString(36).substr(2, 9)}`
          teamsObject[teamId.toString()] = token
        }
      })

      const result = await createSeason({
        variables: {
          name: seasonName,
          startDate,
          EndDate: endDate,
          teams: teamsObject
        }
      })

      if (result.data?.insert_seasons_one) {
        toast({
          title: "Success",
          description: "Season created successfully",
        })
        setIsCreateDialogOpen(false)
        resetForm()
        onSeasonCreated?.(result.data.insert_seasons_one)
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create season",
        variant: "destructive",
      })
      console.error('Error creating season:', err)
    }
  }

  const handleEditSeason = async () => {
    if (!editingSeason) return

    // Validate that teams are selected
    if (!selectedTeams || selectedTeams.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one team",
        variant: "destructive",
      })
      return
    }

    try {
      // Create teams object with team IDs as keys and generated tokens as values
      const teamsObject: Record<string, string> = {}
      
      // Filter out any undefined or invalid team IDs
      const validTeamIds = selectedTeams.filter(teamId => teamId !== undefined && teamId !== null)
      
      if (validTeamIds.length === 0) {
        toast({
          title: "Validation Error",
          description: "No valid team IDs found",
          variant: "destructive",
        })
        return
      }

      validTeamIds.forEach(teamId => {
        if (teamId !== undefined && teamId !== null) {
          // Generate a unique token for each team (you can customize this format)
          const token = `e${Date.now()}${Math.random().toString(36).substr(2, 9)}`
          teamsObject[teamId.toString()] = token
        }
      })

      const result = await updateSeason({
        variables: {
          id: editingSeason.id,
          name: seasonName,
          startDate,
          EndDate: endDate,
          teams: teamsObject
        }
      })

      if (result.data?.update_seasons_by_pk) {
        toast({
          title: "Success",
          description: "Season updated successfully",
        })
        setIsEditDialogOpen(false)
        resetForm()
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update season",
        variant: "destructive",
      })
      console.error('Error updating season:', err)
    }
  }

  const handleDeleteSeason = async (seasonId: number) => {
    if (!confirm("Are you sure you want to delete this season?")) return

    try {
      await deleteSeason({
        variables: { id: seasonId }
      })
      toast({
        title: "Success",
        description: "Season deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete season",
        variant: "destructive",
      })
      console.error('Error deleting season:', err)
    }
  }

  const openEditDialog = (season: Season) => {
    setEditingSeason(season)
    setSeasonName(season.name)
    setStartDate(season.startDate)
    setEndDate(season.EndDate)
    
    // Convert JSONB keys back to numbers, filtering out invalid values
    const teamIds = Object.keys(season.teams || {})
      .map(key => {
        const parsed = parseInt(key)
        return isNaN(parsed) ? key : parsed // Keep as string if not a valid number
      })
      .filter(id => id !== null && id !== undefined)
    
    setSelectedTeams(teamIds)
    
    setIsEditDialogOpen(true)
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
      month: 'short',
      day: 'numeric'
    })
  }

  const getTeamNames = (teamsObject: Record<string | number, string>) => {
    if (!teamsObject || !teams) return []
    return Object.keys(teamsObject).map(teamId => {
      // Try to find the team using the same identifier logic
      const team = teams.find((t: any) => {
        const teamIdentifier = t.id || t.team_id || t._id || Object.keys(t)[0]
        return teamIdentifier && teamIdentifier.toString() === teamId.toString()
      })
      return team?.name || team?.team_name || `Team ${teamId}`
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Season Management</h2>
          <p className="text-gray-600">Create and manage league seasons</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Season
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Create New Season
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="seasonName">Season Name *</Label>
                  <Input
                    id="seasonName"
                    placeholder="e.g., Prime5 League 2024"
                    value={seasonName}
                    onChange={(e) => setSeasonName(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Season description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label>Invite Teams</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {teams?.map((team: any) => {
                      
                      // Try to find a valid identifier for the team
                      const teamIdentifier = team.id || team.team_id || team._id || Object.keys(team)[0]
                      
                      if (!teamIdentifier) {
                        return null
                      }
                      
                      return (
                        <div key={teamIdentifier} className="flex items-center space-x-2">
                          <Checkbox
                            id={`team-${teamIdentifier}`}
                            checked={selectedTeams.includes(teamIdentifier)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                const newSelectedTeams = [...selectedTeams, teamIdentifier]
                                setSelectedTeams(newSelectedTeams)
                              } else {
                                const newSelectedTeams = selectedTeams.filter(id => id !== teamIdentifier)
                                setSelectedTeams(newSelectedTeams)
                              }
                            }}
                          />
                          <Label htmlFor={`team-${teamIdentifier}`} className="text-sm">
                            {team.name || team.team_name || 'Unknown Team'} ({team.shortname || team.short_name || 'N/A'})
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedTeams.length} team(s) selected
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateSeason}
                  disabled={createLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Create Season
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search seasons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seasons Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Seasons ({filteredSeasons.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <p>Error loading seasons: {error.message}</p>
            </div>
          ) : filteredSeasons.length === 0 ? (
            <div className="text-center text-gray-500 p-8">
              <Trophy className="h-12 w-12 mx-auto mb-4" />
              <p>No seasons found</p>
              <p className="text-sm">Create your first season to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Season</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Teams</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSeasons.map((season: Season) => {
                    const status = getSeasonStatus(season)
                    const teamNames = getTeamNames(season.teams)
                    
                    return (
                      <TableRow key={season.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{season.name}</div>
                            <div className="text-sm text-gray-500">ID: {season.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {formatDate(season.startDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {formatDate(season.EndDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="font-medium">
                              {Object.keys(season.teams || {}).length} teams
                            </Badge>
                            {teamNames.length > 0 && (
                              <div className="text-xs text-gray-500">
                                {teamNames.slice(0, 2).join(', ')}
                                {teamNames.length > 2 && ` +${teamNames.length - 2} more`}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>
                            {status.text}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(new Date().toISOString())}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(season)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Season
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteSeason(season.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Season
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Edit Season Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Season
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="editSeasonName">Season Name *</Label>
              <Input
                id="editSeasonName"
                placeholder="e.g., Prime5 League 2024"
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editStartDate">Start Date *</Label>
                <Input
                  id="editStartDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editEndDate">End Date *</Label>
                <Input
                  id="editEndDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label>Invite Teams</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                {teams?.map((team: any) => (
                  <div key={team.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-team-${team.id}`}
                      checked={selectedTeams.includes(team.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTeams([...selectedTeams, team.id])
                        } else {
                          setSelectedTeams(selectedTeams.filter(id => id !== team.id))
                        }
                      }}
                    />
                    <Label htmlFor={`edit-team-${team.id}`} className="text-sm">
                      {team.name} ({team.shortname})
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {selectedTeams.length} team(s) selected
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditSeason}
              disabled={updateLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Edit className="h-4 w-4 mr-2" />
              )}
              Update Season
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 