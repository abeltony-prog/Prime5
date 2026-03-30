"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
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
import { CreateSeasonModal, EditSeasonModal } from "./modals"

interface Season {
  id: string
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


  const handleCreateSeason = async (seasonData: any) => {
    const { seasonName, startDate, endDate, selectedTeams } = seasonData

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
      const validTeamIds = selectedTeams.filter((teamId: any) => teamId !== undefined && teamId !== null)
      
      if (validTeamIds.length === 0) {
        toast({
          title: "Validation Error",
          description: "No valid team IDs found",
          variant: "destructive",
        })
        return
      }

      validTeamIds.forEach((teamId: any) => {
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

      if (result.data?.insert_seasons?.returning?.[0]) {
        const newSeason = result.data.insert_seasons.returning[0]
        console.log('New season created:', newSeason)
        toast({
          title: "Success",
          description: "Season created successfully",
        })
        setIsCreateDialogOpen(false)
        onSeasonCreated?.(newSeason)
        // Refetch the seasons data to show the new season
        await refetch()
      } else {
        console.error('No season returned from mutation:', result.data)
        toast({
          title: "Error",
          description: "Season creation failed - no data returned",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error('Error creating season:', err)
      toast({
        title: "Error",
        description: `Failed to create season: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive",
      })
    }
  }

  const handleEditSeason = async (seasonData: any) => {
    if (!editingSeason) return

    const { seasonName, startDate, endDate, selectedTeams } = seasonData

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
      const validTeamIds = selectedTeams.filter((teamId: any) => teamId !== undefined && teamId !== null)
      
      if (validTeamIds.length === 0) {
        toast({
          title: "Validation Error",
          description: "No valid team IDs found",
          variant: "destructive",
        })
        return
      }

      validTeamIds.forEach((teamId: any) => {
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
        setEditingSeason(null)
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

  const handleDeleteSeason = async (seasonId: string) => {
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
    <div className="space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">Campaign <span className="text-lime-400">Master</span></h2>
          <p className="text-white/40 font-bold tracking-widest uppercase text-xs mt-1">Initialize and govern league seasons</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white font-bold uppercase tracking-widest text-[10px] rounded-none transition-all">
            <Download className="h-4 w-4 mr-2" />
            DUMP CHRONICLE
          </Button>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-lime-400/20 text-lime-300 border border-lime-400/50 hover:bg-lime-400 hover:text-black font-black italic uppercase tracking-widest text-[10px] rounded-none transition-all shadow-[0_0_20px_rgba(190,242,100,0.2)]"
          >
            <Plus className="h-4 w-4 mr-2" />
            INITIALIZE CAMPAIGN
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Scan campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white placeholder-white/40 focus-visible:ring-0 focus-visible:border-lime-400/50 rounded-none h-12 font-mono text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-black/40 border-white/10 text-white focus:ring-0 rounded-none h-12 font-bold tracking-widest uppercase text-[10px]">
                <SelectValue placeholder="STATUS MODIFIER" />
              </SelectTrigger>
              <SelectContent className="bg-[#061B14] border-white/10 rounded-none">
                <SelectItem value="all" className="text-white hover:bg-lime-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none">ALL STATES</SelectItem>
                <SelectItem value="upcoming" className="text-cyan-300 hover:bg-cyan-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none">AWAITING COMMENCEMENT</SelectItem>
                <SelectItem value="active" className="text-yellow-300 hover:bg-yellow-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none">ACTIVE ENGAGEMENT</SelectItem>
                <SelectItem value="completed" className="text-lime-300 hover:bg-lime-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none">ARCHIVED</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-12 bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-white font-bold uppercase tracking-widest text-[10px] rounded-none transition-all flex items-center gap-2">
              <Filter className="h-4 w-4" />
              PURGE FILTERS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seasons Table */}
      <Card className="glass-dark border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-none overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-black/40 p-6">
          <CardTitle className="flex items-center gap-3 text-xl font-black italic uppercase tracking-widest text-lime-300 drop-shadow-sm">
            <Trophy className="h-6 w-6 text-lime-400" />
            Campaign Feed ({filteredSeasons.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 bg-[#061B14]/60 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin mb-6"></div>
              <p className="text-lime-400 font-mono uppercase tracking-widest text-sm animate-pulse">Syncing Matrix...</p>
            </div>
          ) : error ? (
            <div className="text-center p-12 glass-dark border border-red-500/20 m-6">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 font-black italic uppercase tracking-widest mb-2">Decryption Failed</p>
              <p className="text-white/60 font-mono text-xs">{error.message}</p>
            </div>
          ) : filteredSeasons.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="h-16 w-16 text-white/10 mx-auto mb-4" />
              <p className="text-white/60 font-black italic uppercase tracking-widest">No campaigns detected</p>
              <p className="text-[10px] text-lime-300/40 mt-3 font-mono uppercase tracking-widest">{">"} Initialize a new campaign to populate the grid</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-black/40">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Campaign Identity</TableHead>
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Operation Window</TableHead>
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Enlisted Squads</TableHead>
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Current State</TableHead>
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Initiated</TableHead>
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70 text-right">Overrides</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSeasons.map((season: Season) => {
                    const status = getSeasonStatus(season)
                    const teamNames = getTeamNames(season.teams)
                    
                    const statusStyles: Record<string, string> = {
                      'upcoming': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
                      'active': 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
                      'completed': 'bg-lime-500/10 text-lime-300 border-lime-500/30'
                    }
                    const activeStyle = statusStyles[status.status] || 'bg-white/10 text-white border-white/30'
                    
                    return (
                      <TableRow key={season.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                        <TableCell className="px-6 py-4">
                          <div>
                            <div className="font-bold text-white uppercase tracking-wider">{season.name}</div>
                            <div className="text-[10px] text-lime-400/50 font-mono mt-1">ID: {season.id}</div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-200 bg-cyan-950/40 border border-cyan-500/20 px-2 py-1 max-w-max rounded-none">
                              <CalendarDays className="h-3 w-3 text-cyan-400" />
                              <span className="opacity-50">START:</span> {formatDate(season.startDate)}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-purple-200 bg-purple-950/40 border border-purple-500/20 px-2 py-1 max-w-max rounded-none">
                              <Target className="h-3 w-3 text-purple-400" />
                              <span className="opacity-50">END:</span> {formatDate(season.EndDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="space-y-2">
                            <Badge variant="outline" className="font-black tracking-widest uppercase text-[9px] bg-white/5 text-white border-white/20 rounded-none">
                              {Object.keys(season.teams || {}).length} SQUADS ASSIGNED
                            </Badge>
                            {teamNames.length > 0 && (
                              <div className="text-[10px] font-mono text-lime-300/50 border-l border-white/10 pl-2">
                                {teamNames.slice(0, 2).map(n => n.toUpperCase()).join(', ')}
                                {teamNames.length > 2 && <span className="text-white/30"> +{teamNames.length - 2} OTHERS</span>}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge variant="outline" className={`font-bold uppercase tracking-widest text-[9px] border rounded-none ${activeStyle}`}>
                            {status.text}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-[10px] text-white/40 font-mono">
                          {formatDate(new Date().toISOString())}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-white hover:bg-lime-400/20 hover:text-lime-300 rounded-none transition-colors border border-transparent hover:border-lime-400/50">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#061B14] border-white/10 rounded-none shadow-[0_10px_40px_rgba(0,0,0,0.8)] min-w-[200px] p-0">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/season-scheduler/${season.id}`} className="flex w-full text-[10px] font-bold uppercase tracking-widest text-lime-300 hover:bg-lime-500/10 hover:text-lime-200 rounded-none p-4 border-b border-white/5 cursor-pointer">
                                  <Eye className="h-4 w-4 mr-3" />
                                  Inspect Matrix
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(season)} className="text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:text-white rounded-none p-4 border-b border-white/5 cursor-pointer">
                                <Edit className="h-4 w-4 mr-3 text-white/50" />
                                Modify Config
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteSeason(season.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-950 hover:text-red-400 rounded-none p-4 cursor-pointer focus:bg-red-950 focus:text-red-400">
                                <Trash2 className="h-4 w-4 mr-3" />
                                Abort & Purge
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

      {/* Create Season Modal */}
      <CreateSeasonModal
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateSeason={handleCreateSeason}
        teams={teams || []}
        isLoading={createLoading}
      />

      {/* Edit Season Modal */}
      <EditSeasonModal
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setEditingSeason(null)
        }}
        onUpdateSeason={handleEditSeason}
        season={editingSeason}
        teams={teams || []}
        isLoading={updateLoading}
      />
    </div>
  )
} 