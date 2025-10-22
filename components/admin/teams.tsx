"use client"

import { useState } from "react"
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
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  X,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  Upload,
  CheckCircle,
  Clock,
} from "lucide-react"
import { useTeams } from "@/hooks/use-teams"
import { useMutation } from "@apollo/client"
import { DELETE_TEAM } from "@/lib/graphql/mutations"
import { useToast } from "@/hooks/use-toast"
import { TeamDetails } from "./team-details"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Player {
  id: string
  name: string
  create_at: string
  dob: string
  email: string
  gender: string
  phone: string
  team_id: string
}

interface Manager {
  id: string
  name: string
  email: string
  phone: string
  gender: string
  photo?: string
  create_at: string
}

interface Match {
  id: number
  date: string
  location: string
  team1?: string
  team2?: string
  created_at: string
}

interface Team {
  id: string
  name: string
  shortname: string
  team_manager: string
  manager: Manager
  matche1: Match[]
  matche2: Match[]
  players: Player[]
  approved: boolean
}

interface TeamsProps {
  teams: Team[]
}


export function Teams({ teams: initialTeams }: TeamsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [groupFilter, setGroupFilter] = useState("all")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null)
  const [newTeam, setNewTeam] = useState({
    teamName: "",
    shortname: "",
    managerName: "",
    email: "",
    phone: "",
    gender: "",
    location: "",
    photo: null as File | null,
    logo: null as File | null
  })

  // Use the hook to get teams from database
  const { teams: dbTeams, loading, error, refetch } = useTeams()
  
  // Delete team mutation
  const [deleteTeam, { loading: deleteLoading }] = useMutation(DELETE_TEAM)
  const { toast } = useToast()
  
  // Use database teams
  const teams = dbTeams || []


  const filteredTeams = teams.filter((team: Team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.team_manager.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGroup = groupFilter === "all" || team.shortname.includes(groupFilter)
    const isApproved = team.approved === true
    
    return matchesSearch && matchesGroup && isApproved
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGroupColor = (group: string) => {
    return group === "A" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
  }

  const handleViewDetails = (team: Team) => {
    setSelectedTeam(team)
    setIsDetailsOpen(true)
  }

  const handleDeleteTeam = (team: Team) => {
    setTeamToDelete(team)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return

    try {
      const result = await deleteTeam({
        variables: {
          id: teamToDelete.id
        }
      })

      if (result.data?.delete_Teams_by_pk) {
        toast({
          title: "Team Deleted",
          description: `Team "${teamToDelete.name}" has been deleted successfully`,
          duration: 3000,
        })
        
        // Refresh the teams list
        refetch()
      } else {
        throw new Error('Failed to delete team')
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsDeleteModalOpen(false)
      setTeamToDelete(null)
    }
  }

  const getGenderIcon = (gender: string) => {
    return gender === "male" ? "👨" : gender === "female" ? "👩" : "👤"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading teams from database...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">Error loading teams from database</p>
            <p className="text-gray-600 mt-2">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  // Show no teams message
  if (teams.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="h-16 w-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Approved Teams</h3>
            <p className="text-white/70">There are no approved teams to display.</p>
            <p className="text-white/50 text-sm mt-2">Teams need to be approved in the Registrations tab first.</p>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Team Management</h2>
          <p className="text-white/80">Manage approved teams and their information</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
              ✓ Approved Teams Only
            </Badge>
              <span className="text-xs text-green-300">✓ Live Database</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            ) : (
            <Download className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsAddTeamModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-300 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Showing approved teams only</span>
            </div>
            <p className="text-green-200/80 text-xs mt-1">
              To manage pending teams, go to the Registrations tab
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search approved teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="A">Group A</SelectItem>
                <SelectItem value="B">Group B</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teams Table */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Users className="h-5 w-5" />
            Approved Teams ({filteredTeams.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white/90">Team</TableHead>
                  <TableHead className="text-white/90">Manager</TableHead>
                  <TableHead className="text-white/90">Group</TableHead>
                  <TableHead className="text-white/90">Status</TableHead>
                  <TableHead className="text-white/90">Players</TableHead>
                  <TableHead className="text-white/90">Matches</TableHead>
                  <TableHead className="text-white/90">Created</TableHead>
                  <TableHead className="text-white/90">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team: Team) => (
                  <TableRow key={team.name} className="hover:bg-white/10">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{team.shortname || team.name.substring(0, 2)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{team.name}</div>
                          <div className="text-sm text-white/70">Short: {team.shortname}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{team.manager.name}</div>
                        <div className="text-sm text-white/70">{team.manager.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getGroupColor(team.shortname)}>
                        {team.shortname}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={team.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        <div className="flex items-center gap-1">
                          {team.approved ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              Approved
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3" />
                              Pending
                            </>
                          )}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-medium">
                        {team.players?.length || 0} players
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-medium">
                        {(team.matche1?.length || 0) + (team.matche2?.length || 0)} matches
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-white/70">
                      {formatDate(team.manager?.create_at || new Date().toISOString())}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(team)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Team
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteTeam(team)}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                Deleting...
                              </>
                            ) : (
                              <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Team
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Team Details Dialog */}
      <TeamDetails
        team={selectedTeam as any}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        loading={false}
      />

      {/* Add Team Modal */}
      {isAddTeamModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">Add New Team</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddTeamModalOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                // Handle form submission here
                console.log('New team data:', newTeam)
                setIsAddTeamModalOpen(false)
              }} className="space-y-6">
                <div>
                  <Label htmlFor="teamName" className="text-white drop-shadow-md">Team Name *</Label>
                  <Input
                    id="teamName"
                    required
                    value={newTeam.teamName}
                    onChange={(e) => setNewTeam({...newTeam, teamName: e.target.value})}
                    className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                    placeholder="Enter team name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="managerName" className="text-white drop-shadow-md">Manager Name *</Label>
                    <Input
                      id="managerName"
                      required
                      value={newTeam.managerName}
                      onChange={(e) => setNewTeam({...newTeam, managerName: e.target.value})}
                      className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                      placeholder="Enter manager name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white drop-shadow-md">Email *</Label>
                    <Input
                      type="email"
                      id="email"
                      required
                      value={newTeam.email}
                      onChange={(e) => setNewTeam({...newTeam, email: e.target.value})}
                      className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                      placeholder="manager@team.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-white drop-shadow-md">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={newTeam.phone}
                      onChange={(e) => setNewTeam({...newTeam, phone: e.target.value})}
                      className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                      placeholder="+250 788 123 456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender" className="text-white drop-shadow-md">Gender</Label>
                    <select 
                      id="gender" 
                      value={newTeam.gender}
                      onChange={(e) => setNewTeam({...newTeam, gender: e.target.value})}
                      className="mt-2 w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-white/20 backdrop-blur-sm text-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="text-white drop-shadow-md">Team Location *</Label>
                    <Input
                      id="location"
                      required
                      value={newTeam.location}
                      onChange={(e) => setNewTeam({...newTeam, location: e.target.value})}
                      className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                      placeholder="Kigali, Rwanda"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shortname" className="text-white drop-shadow-md">Short Name (3 letters) *</Label>
                    <Input
                      id="shortname"
                      maxLength={3}
                      required
                      value={newTeam.shortname}
                      onChange={(e) => setNewTeam({...newTeam, shortname: e.target.value})}
                      className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                      placeholder="e.g., MUFC"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="photo" className="text-white drop-shadow-md">Manager Photo</Label>
                    <div className="mt-2 border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-green-400/50 transition-colors bg-white/10 backdrop-blur-sm">
                      <Upload className="h-8 w-8 text-white/70 mx-auto mb-2" />
                      <p className="text-sm text-white/90">Click to upload or drag and drop</p>
                      <p className="text-xs text-white/70 mt-1">PNG, JPG up to 2MB</p>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setNewTeam({...newTeam, photo: e.target.files?.[0] || null})}
                        className="hidden" 
                        id="photo" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="logo" className="text-white drop-shadow-md">Team Logo</Label>
                    <div className="mt-2 border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-green-400/50 transition-colors bg-white/10 backdrop-blur-sm">
                      <Upload className="h-8 w-8 text-white/70 mx-auto mb-2" />
                      <p className="text-sm text-white/90">Click to upload or drag and drop</p>
                      <p className="text-xs text-white/70 mt-1">PNG, JPG up to 2MB</p>
                      <Input
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setNewTeam({...newTeam, logo: e.target.files?.[0] || null})}
                        className="hidden" 
                        id="logo" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddTeamModalOpen(false)}
                    className="flex-1 border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && teamToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Delete Team</h2>
                  <p className="text-white/70">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-white/90 mb-2">
                  Are you sure you want to delete the team <strong>"{teamToDelete.name}"</strong>?
                </p>
                <p className="text-sm text-white/60">
                  This will permanently remove the team and all associated data from the system.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={confirmDeleteTeam}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600/90 backdrop-blur-md hover:bg-red-700/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Team
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setTeamToDelete(null)
                  }}
                  disabled={deleteLoading}
                  className="flex-1 border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 