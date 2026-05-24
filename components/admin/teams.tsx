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
  RefreshCw,
  Key,
  Copy,
  Check,
} from "lucide-react"
import { useTeams } from "@/hooks/use-teams"
import { useMutation } from "@apollo/client"
import { DELETE_TEAM, UPDATE_MANAGER_PASSWORD } from "@/lib/graphql/mutations"
import { useToast } from "@/hooks/use-toast"
import { generatePassword, hashPasswordForStorage } from "@/lib/utils/password"
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
  logo?: string
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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [teamForPassword, setTeamForPassword] = useState<Team | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [isPasswordCopied, setIsPasswordCopied] = useState(false)
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
  // Password regeneration mutation
  const [updateManagerPassword, { loading: passwordLoading }] = useMutation(UPDATE_MANAGER_PASSWORD)
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

  const handleRegeneratePassword = (team: Team) => {
    setTeamForPassword(team)
    setIsPasswordModalOpen(true)
  }

  const regeneratePassword = async () => {
    if (!teamForPassword) return

    try {
      // Generate new password
      const newPassword = generatePassword()
      setGeneratedPassword(newPassword)

      // Hash the password for storage
      const hashedPassword = hashPasswordForStorage(newPassword)

      // Update manager password in database
      await updateManagerPassword({
        variables: {
          id: teamForPassword.manager.id,
          password: hashedPassword
        }
      })

      toast({
        title: "Password Regenerated",
        description: `New password generated for ${teamForPassword.manager.name}`,
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Password Update Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword)
      setIsPasswordCopied(true)
      toast({
        title: "Password Copied",
        description: "Password has been copied to clipboard",
        duration: 2000,
      })
      
      // Reset copied state after 2 seconds
      setTimeout(() => setIsPasswordCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy password to clipboard",
        variant: "destructive",
        duration: 3000,
      })
    }
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
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin mb-8"></div>
            <p className="text-white/40 font-black tracking-widest uppercase text-sm">Accessing Directory...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center p-12 glass-dark border border-red-500/20 max-w-xl mx-auto">
            <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl text-red-500">⚠️</span>
            </div>
            <h3 className="text-3xl font-black italic uppercase text-red-400 mb-4">Connection Failed</h3>
            <p className="text-white/60 font-bold mb-4">Could not decrypt the requested logs.</p>
            <p className="text-red-400/60 text-xs font-mono">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  // Show no teams message
  if (teams.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center p-12 glass-dark border border-white/10 max-w-xl mx-auto rounded-none bg-black/40">
            <Users className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-black italic uppercase tracking-widest text-white mb-2">No Squads Active</h3>
            <p className="text-white/60 text-sm font-bold">Zero active teams on the radar.</p>
            <p className="text-lime-300/40 text-[10px] mt-4 font-mono uppercase tracking-widest">Awaiting registrations approval inside control panel</p>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">Squad <span className="text-lime-400">Directory</span></h2>
          <p className="text-white/40 font-bold tracking-widest uppercase text-xs mt-1">Manage active prime5 deployments</p>
          <div className="flex items-center gap-3 mt-3">
            <Badge variant="outline" className="text-[10px] bg-lime-400/10 text-lime-300 border-lime-400/30 uppercase tracking-widest font-black rounded-none">
              <CheckCircle className="w-3 h-3 mr-1" /> Verified Active
            </Badge>
            <span className="text-[10px] text-lime-300/60 font-mono uppercase tracking-widest animate-pulse border-l border-white/20 pl-3">Live Stream</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={loading}
            className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white font-bold uppercase tracking-widest text-[10px] rounded-none transition-all"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {loading ? 'SYNCING...' : 'SYNC'}
          </Button>
          <Button variant="outline" className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white font-bold uppercase tracking-widest text-[10px] rounded-none transition-all">
            <Download className="h-4 w-4 mr-2" />
            DUMP
          </Button>
          <Button 
            onClick={() => setIsAddTeamModalOpen(true)}
            className="bg-lime-400/20 text-lime-300 border border-lime-400/50 hover:bg-lime-400 hover:text-black font-black italic uppercase tracking-widest text-[10px] rounded-none transition-all shadow-[0_0_20px_rgba(190,242,100,0.2)]"
          >
            <Plus className="h-4 w-4 mr-2" />
            DEPLOY NEW
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="mb-6 p-4 bg-lime-400/5 border border-lime-400/20 rounded-none">
            <div className="flex items-center gap-2 text-lime-300 text-xs font-black uppercase tracking-widest">
              <CheckCircle className="h-4 w-4" />
              <span>Filtering strictly active squads</span>
            </div>
            <p className="text-lime-300/50 text-[10px] mt-2 font-mono uppercase tracking-widest">
              Access Registrations terminal to process pending deployments
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Query database..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white placeholder-white/40 focus-visible:ring-0 focus-visible:border-lime-400/50 rounded-none h-12 font-mono text-sm"
              />
            </div>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="bg-black/40 border-white/10 text-white focus:ring-0 rounded-none h-12 font-bold tracking-widest uppercase text-[10px]">
                <SelectValue placeholder="FILTER BY GROUP" />
              </SelectTrigger>
              <SelectContent className="bg-[#061B14] border-white/10 rounded-none">
                <SelectItem value="all" className="text-white hover:bg-lime-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none">ALL DIVISIONS</SelectItem>
                <SelectItem value="A" className="text-white hover:bg-lime-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none">DIVISION A</SelectItem>
                <SelectItem value="B" className="text-white hover:bg-lime-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none">DIVISION B</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-12 bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-white font-bold uppercase tracking-widest text-[10px] rounded-none transition-all flex items-center gap-2">
              <Filter className="h-4 w-4" />
              PURGE FILTERS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teams Table */}
      <Card className="glass-dark border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-none overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-black/40 p-6">
          <CardTitle className="flex items-center gap-3 text-xl font-black italic uppercase tracking-widest text-lime-300 drop-shadow-sm">
            <Users className="h-6 w-6 text-lime-400" />
            Squad Roster ({filteredTeams.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 bg-[#061B14]/60">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Squad</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Commander</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Div</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Status</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70 text-center">Roster Size</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70 text-center">Clashes</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Init Date</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70 text-right">Overrides</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team: Team) => (
                  <TableRow key={team.name} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {team.logo ? (
                          <div className="w-12 h-12 rounded-none border border-white/20 bg-black overflow-hidden group-hover:border-lime-400/50 transition-colors">
                            <img 
                              src={team.logo} 
                              alt={`${team.name} Logo`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-lime-400/10 border border-lime-400/20 rounded-none flex items-center justify-center group-hover:bg-lime-400/20 group-hover:border-lime-400/50 transition-colors">
                            <span className="text-sm font-black italic uppercase tracking-tighter text-lime-400">{team.shortname || team.name.substring(0, 2)}</span>
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white uppercase tracking-wider">{team.name}</div>
                          <div className="text-[10px] font-mono text-lime-300/50 mt-1">ID: {team.shortname}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div>
                        <div className="font-bold text-white tracking-wide uppercase text-sm">{team.manager.name}</div>
                        <div className="text-[10px] text-white/50 mt-1">{team.manager.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="outline" className={`rounded-none font-bold uppercase tracking-widest text-[9px] ${
                        team.shortname === "A" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                      }`}>
                        DIV {team.shortname}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="outline" className={`rounded-none font-bold uppercase tracking-widest text-[9px] ${
                        team.approved ? "bg-lime-400/10 text-lime-300 border-lime-400/30" : "bg-yellow-400/10 text-yellow-300 border-yellow-400/30"
                      }`}>
                        <div className="flex items-center gap-1.5">
                          {team.approved ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              ACTIVE
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3" />
                              PENDING
                            </>
                          )}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Badge variant="outline" className="bg-black/40 border-white/10 text-white rounded-none font-mono">
                        {String(team.players?.length || 0).padStart(2, '0')}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Badge variant="outline" className="bg-black/40 border-white/10 text-white rounded-none font-mono">
                        {String((team.matche1?.length || 0) + (team.matche2?.length || 0)).padStart(2, '0')}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-[10px] font-mono text-white/50">
                      {formatDate(team.manager?.create_at || new Date().toISOString())}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-lime-400/20 hover:text-lime-300 rounded-none transition-colors border border-transparent hover:border-lime-400/50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#061B14] border-white/10 rounded-none shadow-[0_10px_40px_rgba(0,0,0,0.8)] min-w-[200px] p-0">
                          <DropdownMenuItem onClick={() => handleViewDetails(team)} className="text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:text-white rounded-none p-4 border-b border-white/5 cursor-pointer">
                            <Eye className="h-4 w-4 mr-3 text-white/50" />
                            Inspect Data
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:text-white rounded-none p-4 border-b border-white/5 cursor-pointer">
                            <Edit className="h-4 w-4 mr-3 text-white/50" />
                            Modify
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRegeneratePassword(team)}
                            disabled={passwordLoading}
                            className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:bg-cyan-950 hover:text-cyan-300 rounded-none p-4 border-b border-white/5 cursor-pointer"
                          >
                            {passwordLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-3"></div>
                                GENERATING...
                              </>
                            ) : (
                              <>
                                <Key className="h-4 w-4 mr-3" />
                                Reboot Access Key
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-950 hover:text-red-400 rounded-none p-4 cursor-pointer focus:bg-red-950 focus:text-red-400"
                            onClick={(e) => { e.preventDefault(); handleDeleteTeam(team); }}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-3"></div>
                                PURGING...
                              </>
                            ) : (
                              <>
                            <Trash2 className="h-4 w-4 mr-3" />
                            Purge Record
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTeams.length === 0 && (
                  <TableRow className="border-b-0 hover:bg-transparent">
                    <TableCell colSpan={8} className="py-12 text-center text-white/40 font-bold uppercase tracking-widest text-xs">
                      No squads match the current filter directive
                    </TableCell>
                  </TableRow>
                )}
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-dark border border-white/20 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[#04120D]/95">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg flex items-center gap-3">
                  <div className="w-8 h-8 bg-lime-400/20 flex items-center justify-center border border-lime-400/50">
                     <Plus className="w-5 h-5 text-lime-400" />
                  </div>
                  Deploy Squad
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAddTeamModalOpen(false)}
                  className="text-white/50 hover:text-white hover:bg-white/10 rounded-none border border-transparent hover:border-white/20 transition-all"
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
                  <Label htmlFor="teamName" className="text-[10px] font-black uppercase tracking-widest text-white/70">Squad Identity *</Label>
                  <Input
                    id="teamName"
                    required
                    value={newTeam.teamName}
                    onChange={(e) => setNewTeam({...newTeam, teamName: e.target.value})}
                    className="mt-2 bg-black/40 border-white/20 text-white placeholder-white/30 focus-visible:ring-0 focus-visible:border-lime-400/50 rounded-none font-bold"
                    placeholder="Enter full squad designation"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="managerName" className="text-[10px] font-black uppercase tracking-widest text-white/70">Commander Identity *</Label>
                    <Input
                      id="managerName"
                      required
                      value={newTeam.managerName}
                      onChange={(e) => setNewTeam({...newTeam, managerName: e.target.value})}
                      className="mt-2 bg-black/40 border-white/20 text-white placeholder-white/30 focus-visible:ring-0 focus-visible:border-lime-400/50 rounded-none font-bold"
                      placeholder="Manager designation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-white/70">Comm Link (Email) *</Label>
                    <Input
                      type="email"
                      id="email"
                      required
                      value={newTeam.email}
                      onChange={(e) => setNewTeam({...newTeam, email: e.target.value})}
                      className="mt-2 bg-black/40 border-white/20 text-white placeholder-white/30 focus-visible:ring-0 focus-visible:border-lime-400/50 rounded-none font-bold"
                      placeholder="commander@network.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-white/70">Comm Code (Phone) *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={newTeam.phone}
                      onChange={(e) => setNewTeam({...newTeam, phone: e.target.value})}
                      className="mt-2 bg-black/40 border-white/20 text-white placeholder-white/30 focus-visible:ring-0 focus-visible:border-lime-400/50 rounded-none font-bold"
                      placeholder="+X XX XXX XXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender" className="text-[10px] font-black uppercase tracking-widest text-white/70">Profile Type</Label>
                    <select 
                      id="gender" 
                      value={newTeam.gender}
                      onChange={(e) => setNewTeam({...newTeam, gender: e.target.value})}
                      className="mt-2 w-full px-4 h-10 border border-white/20 focus:outline-none focus:ring-0 focus:border-lime-400/50 bg-black/40 text-white rounded-none font-bold appearance-none"
                    >
                      <option value="" className="bg-[#061B14]">SELECT TYPE</option>
                      <option value="male" className="bg-[#061B14]">MALE VALIDATED</option>
                      <option value="female" className="bg-[#061B14]">FEMALE VALIDATED</option>
                      <option value="other" className="bg-[#061B14]">OTHER / UNDEFINED</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-white/70">Deployment Zone *</Label>
                    <Input
                      id="location"
                      required
                      value={newTeam.location}
                      onChange={(e) => setNewTeam({...newTeam, location: e.target.value})}
                      className="mt-2 bg-black/40 border-white/20 text-white placeholder-white/30 focus-visible:ring-0 focus-visible:border-lime-400/50 rounded-none font-bold"
                      placeholder="e.g., Sector 4"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shortname" className="text-[10px] font-black uppercase tracking-widest text-white/70">Registry ID (3 chars) *</Label>
                    <Input
                      id="shortname"
                      maxLength={3}
                      required
                      value={newTeam.shortname}
                      onChange={(e) => setNewTeam({...newTeam, shortname: e.target.value})}
                      className="mt-2 bg-black/40 border-white/20 text-white placeholder-white/30 focus-visible:ring-0 focus-visible:border-lime-400/50 rounded-none font-bold uppercase"
                      placeholder="e.g., S4D"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="photo" className="text-[10px] font-black uppercase tracking-widest text-white/70">Commander Bio-Scan</Label>
                    <div className="mt-2 border border-dashed border-white/20 bg-black/30 p-8 text-center hover:border-lime-400/50 transition-colors backdrop-blur-sm cursor-pointer group">
                      <Upload className="h-8 w-8 text-white/30 mx-auto mb-3 group-hover:text-lime-400 transition-colors" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/90">TRANSMIT DATA</p>
                      <p className="text-[10px] text-white/40 mt-1 font-mono hover:text-white/60">Limit 2MB / Frame</p>
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
                    <Label htmlFor="logo" className="text-[10px] font-black uppercase tracking-widest text-white/70">Squad Insignia</Label>
                    <div className="mt-2 border border-dashed border-white/20 bg-black/30 p-8 text-center hover:border-lime-400/50 transition-colors backdrop-blur-sm cursor-pointer group">
                      <Upload className="h-8 w-8 text-white/30 mx-auto mb-3 group-hover:text-lime-400 transition-colors" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/90">TRANSMIT INSIGNIA</p>
                      <p className="text-[10px] text-white/40 mt-1 font-mono hover:text-white/60">Limit 2MB / PNG-JPG</p>
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

                <div className="flex gap-4 pt-6 border-t border-white/10 mt-6">
                  <Button
                    type="submit"
                    className="flex-1 bg-lime-400 border-none text-black hover:bg-lime-300 font-black italic uppercase tracking-widest text-xs h-12 rounded-none shadow-[0_0_20px_rgba(190,242,100,0.3)] hover:shadow-[0_0_30px_rgba(190,242,100,0.5)] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    APPROVE DEPLOYMENT
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddTeamModalOpen(false)}
                    className="flex-1 border-white/20 text-white/70 hover:bg-white/10 hover:text-white font-bold uppercase tracking-widest text-xs h-12 rounded-none bg-transparent hover:border-white/40 transition-all"
                  >
                    ABORT
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && teamToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-dark border border-white/20 rounded-none shadow-[0_0_50px_rgba(255,0,0,0.15)] max-w-lg w-full bg-[#0B0404]">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-red-500/20">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <Trash2 className="h-8 w-8 text-red-500 drop-shadow-md" />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase text-white drop-shadow-md">PURGE PROTOCOL</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mt-1 animate-pulse">Destructive Override Confirmed</p>
                </div>
              </div>
              
              <div className="mb-8">
                <p className="text-white/90 mb-4 font-bold text-lg">
                  Confirm permanent purge of <span className="text-red-400 font-black tracking-widest uppercase">[{teamToDelete.name}]</span>
                </p>
                <div className="bg-red-500/5 border border-red-500/20 p-4">
                  <p className="text-xs text-red-400/80 font-mono tracking-wide leading-relaxed">
                    WARNING: Execution of this directive will systematically unbind and delete all relational records, roster data, and metadata logs. Restoration string impossible.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={confirmDeleteTeam}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 border-none text-white hover:bg-red-500 font-black italic uppercase tracking-widest text-xs h-12 rounded-none shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-300"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-none h-4 w-4 border-2 border-dashed border-white mr-2"></div>
                      PURGING...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      EXECUTE PURGE
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
                  className="flex-1 border-white/20 text-white/70 hover:bg-white/10 hover:text-white font-bold uppercase tracking-widest text-xs h-12 rounded-none bg-transparent transition-all"
                >
                  ABORT OVERRIDE
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Regeneration Modal */}
      {isPasswordModalOpen && teamForPassword && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-dark border border-cyan-500/20 rounded-none shadow-[0_0_50px_rgba(6,182,212,0.1)] max-w-lg w-full bg-[#040B12]">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-cyan-500/20">
                <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <Key className="h-8 w-8 text-cyan-400 drop-shadow-md" />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase text-white drop-shadow-md border-b-[3px] border-cyan-500 inline-block pb-1">REBOOT KEY</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mt-2">Authority Token Reset</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-white/90 mb-2 font-bold text-lg">
                  Overwrite auth credentials for commander <span className="text-cyan-400 font-black uppercase">[{teamForPassword.manager.name}]</span>
                </p>
                <p className="text-xs text-white/50 font-mono tracking-wide">
                  System will generate a highly secure bypass block. Transmission to the commander layer remains your responsibility.
                </p>
              </div>

              {generatedPassword && (
                <div className="mb-8 p-6 bg-cyan-950/40 border-l-[3px] border-cyan-400 shadow-[inset_0_0_30px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-cyan-400">ACCESS BYPASS COMPILED</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 bg-black text-cyan-200 border border-cyan-500/30 p-4 text-lg font-mono tracking-widest shadow-inner">
                      {generatedPassword}
                    </code>
                    <Button
                      size="lg"
                      onClick={copyPassword}
                      className="bg-cyan-500 text-black hover:bg-cyan-400 font-black uppercase rounded-none h-16 w-16 px-0 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    >
                      {isPasswordCopied ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <Copy className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                  <p className="text-[10px] text-cyan-400/60 font-mono tracking-wider mt-4">
                    [ COPY DIRECTIVE REQUIRED INSTANTLY ]
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={regeneratePassword}
                  disabled={passwordLoading}
                  className="flex-1 bg-cyan-500 border-none text-black hover:bg-cyan-400 font-black italic uppercase tracking-widest text-xs h-12 rounded-none shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300"
                >
                  {passwordLoading ? (
                    <>
                      <div className="animate-spin rounded-none h-4 w-4 border-2 border-dashed border-black mr-2"></div>
                      COMPILE...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      COMPILE BYPASS
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsPasswordModalOpen(false)
                    setTeamForPassword(null)
                    setGeneratedPassword("")
                    setIsPasswordCopied(false)
                  }}
                  disabled={passwordLoading}
                  className="flex-1 border-white/20 text-white/70 hover:bg-white/10 hover:text-white font-bold uppercase tracking-widest text-xs h-12 rounded-none bg-transparent transition-all"
                >
                  CLOSE PORT
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}