"use client"

import { useState, useEffect } from "react"
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
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  Edit,
  X,
  Key,
  Copy,
  EyeOff,
  Trash2,
} from "lucide-react"
import { useMutation } from "@apollo/client"
import { UPDATE_MANAGER_PASSWORD, UPDATE_TEAM_APPROVAL, DELETE_MANAGER, DELETE_MANAGER_BY_EMAIL, CREATE_MANAGER, CREATE_TEAM } from "@/lib/graphql/mutations"
import { GET_ALL_MANAGERS_DETAILS } from "@/lib/graphql/queries"
import { generatePassword, hashPasswordForStorage } from "@/lib/utils/password"
import { useToast } from "@/hooks/use-toast"
import { EditManagerModal, DeleteManagerModal, AddTeamModal } from "./modals"

interface Manager {
  id: string
  name: string
  email: string
  phone: string
  gender: string
  photo?: string
  create_at: string
  password: string
  Teams: Team[]
}

interface Team {
  id: string
  name: string
  shortname: string
  location: string
  logo?: string
  team_manager: string
  approved: boolean
}

interface RegistrationsProps {
  managers: Manager[]
}

export function Registrations({ managers = [] }: RegistrationsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false)
  const [editingManager, setEditingManager] = useState<Manager | null>(null)
  const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null)
  const [generatedPasswords, setGeneratedPasswords] = useState<Record<string, string>>({})
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [localManagers, setLocalManagers] = useState<Manager[]>(managers)
  
  // New team creation state
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [showGeneratedPassword, setShowGeneratedPassword] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // GraphQL mutations
  const [updatePassword, { loading: passwordUpdating }] = useMutation(UPDATE_MANAGER_PASSWORD)
  const [updateTeamApproval, { loading: approvalUpdating }] = useMutation(UPDATE_TEAM_APPROVAL)
  const [deleteManager, { loading: deleteManagerLoading }] = useMutation(DELETE_MANAGER)
  const [deleteManagerByEmail, { loading: deleteByEmailLoading }] = useMutation(DELETE_MANAGER_BY_EMAIL)
  const [createManager] = useMutation(CREATE_MANAGER)
  const [createTeam] = useMutation(CREATE_TEAM)
  const { toast } = useToast()

  // Update local managers when prop changes
  useEffect(() => {
    setLocalManagers(managers)
  }, [managers])

  // Derive managers with only pending (unapproved) teams; drop managers with none pending
  const managersWithPendingTeams = (localManagers || [])
    .map((m) => ({ ...m, Teams: m.Teams.filter((t) => !t.approved) }))
    .filter((m) => m.Teams.length > 0)

  // Empty state when no pending teams exist
  if (!managersWithPendingTeams || managersWithPendingTeams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 glass-dark border border-white/10">
        <div className="w-16 h-16 bg-lime-400/10 border border-lime-400/30 flex items-center justify-center mb-6">
          <CheckCircle className="h-8 w-8 text-lime-400" />
        </div>
        <h3 className="text-xl font-black italic uppercase tracking-widest text-white mb-2">ALL_PROTOCOLS_AUTHORIZED</h3>
        <p className="text-white/40 font-mono text-xs">No pending recruitment applications detected in the mainframe.</p>
        <Button 
          onClick={() => setIsAddTeamModalOpen(true)}
          className="mt-8 bg-lime-400 text-black hover:bg-lime-500 rounded-none font-black italic uppercase tracking-widest text-[10px] h-10 px-8 transition-all"
        >
          INIT_NEW_SQUAD
        </Button>
      </div>
    )
  }

  const filteredManagers = (statusFilter === "pending" ? managersWithPendingTeams : localManagers).filter((manager) => {
    const matchesSearch = manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manager.Teams.some(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "approved" && manager.Teams.some(team => team.approved)) ||
                         (statusFilter === "pending" && manager.Teams.some(team => !team.approved))
    
    return matchesSearch && matchesStatus
  })

  const handleTeamApproval = async (teamId: string, approved: boolean) => {
    try {
      const result = await updateTeamApproval({
        variables: {
          id: teamId,
          approved: approved
        },
        refetchQueries: [{ query: GET_ALL_MANAGERS_DETAILS }]
      })

      if (result.data?.update_Teams_by_pk) {
        setLocalManagers(prev => prev.map(manager => ({
          ...manager,
          Teams: manager.Teams.map(team => 
            team.id === teamId ? { ...team, approved: approved } : team
          )
        })))

        toast({
          title: "SYSTEM_SIGNAL_AUTHORIZED",
          description: `Squad authorization protocol ${approved ? 'GRANTED' : 'REVOKED'} successfully.`,
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "PROTOCOL_FAILURE",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    }
  }

  const handleEditManager = (manager: Manager) => {
    setEditingManager(manager)
    setIsEditModalOpen(true)
  }

  const handleSaveManager = () => {
    setIsEditModalOpen(false)
    setEditingManager(null)
  }

  const handleDeleteManager = (manager: Manager) => {
    setManagerToDelete(manager)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteManager = async () => {
    if (!managerToDelete) return

    try {
      let result
      try {
        result = await deleteManager({
          variables: { id: managerToDelete.id },
          refetchQueries: [{ query: GET_ALL_MANAGERS_DETAILS }]
        })
      } catch (idError) {
        result = await deleteManagerByEmail({
          variables: { email: managerToDelete.email },
          refetchQueries: [{ query: GET_ALL_MANAGERS_DETAILS }]
        })
      }

      if (result.data?.delete_managers_by_pk || result.data?.delete_managers?.affected_rows > 0) {
        setLocalManagers(prev => prev.filter(manager => manager.id !== managerToDelete.id))
        toast({
          title: "NODE_PURGED",
          description: `Commander "${managerToDelete.name}" has been removed from the mainframe.`,
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "PURGE_ERROR",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsDeleteModalOpen(false)
      setManagerToDelete(null)
    }
  }

  const handleRegeneratePassword = async (managerId: string) => {
    try {
      const newPassword = generatePassword()
      const hashedPassword = hashPasswordForStorage(newPassword)
      
      const result = await updatePassword({
        variables: { id: managerId, password: hashedPassword },
        refetchQueries: [{ query: GET_ALL_MANAGERS_DETAILS }]
      })
      
      if (result.data?.update_managers_by_pk) {
        setLocalManagers(prev => prev.map(manager => 
          manager.id === managerId ? { ...manager, password: hashedPassword } : manager
        ))
        setGeneratedPasswords(prev => ({ ...prev, [managerId]: newPassword }))
        setShowPasswords(prev => ({ ...prev, [managerId]: true }))
        toast({
          title: "NEW_SECURITY_KEY_GENERATED",
          description: `Protocol updated successfully. Confirm key distribution.`,
          duration: 5000,
        })
      }
    } catch (error) {
      toast({
        title: "GENERATION_FAILURE",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    }
  }

  const handleCopyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password)
      toast({
        title: "KEY_CLONED",
        description: "Security sequence has been copied to tactical clipboard.",
        duration: 3000,
      })
    } catch (error) {
      console.error('Error copying password:', error)
    }
  }

  const togglePasswordVisibility = (managerId: string) => {
    setShowPasswords(prev => ({ ...prev, [managerId]: !prev[managerId] }))
  }

  const getDisplayPassword = (managerId: string, hashedPassword: string) => {
    if (generatedPasswords[managerId]) return generatedPasswords[managerId]
    return "••••••••"
  }

  const pendingCount = localManagers.filter(m => m.Teams.some(t => !t.approved)).length
  const approvedCount = localManagers.filter(m => m.Teams.some(t => t.approved)).length
  const totalManagers = localManagers.length

  const handleCreateTeam = async (managerData: any, teamData: any) => {
    if (!managerData.name || !managerData.email || !managerData.phone || !teamData.name || !teamData.shortname || !teamData.location) {
      toast({
        title: "TELEMETRY_MISSING",
        description: "Please fill in all required coordinates",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const password = generatePassword()
      const hashedPassword = hashPasswordForStorage(password)
      
      const managerResult = await createManager({
        variables: {
          manager: {
            name: managerData.name,
            email: managerData.email,
            phone: managerData.phone,
            gender: managerData.gender,
            photo: managerData.photo,
            password: hashedPassword
          }
        },
        refetchQueries: [{ query: GET_ALL_MANAGERS_DETAILS }]
      })

      if (managerResult.data?.insert_managers?.returning?.[0]) {
        const createdManager = managerResult.data.insert_managers.returning[0]
        
        const teamResult = await createTeam({
          variables: {
            team: {
              name: teamData.name,
              shortname: teamData.shortname,
              location: teamData.location,
              logo: teamData.logo,
              team_manager: createdManager.id,
              approved: true 
            }
          },
          refetchQueries: [{ query: GET_ALL_MANAGERS_DETAILS }]
        })

        if (teamResult.data?.insert_Teams?.returning?.[0]) {
          setGeneratedPassword(password)
          setShowGeneratedPassword(true)
          toast({
            title: "SQUADRON_INITIALIZED",
            description: `New unit authorized and deployed to the mainframe.`,
            duration: 5000,
          })
        }
      }
    } catch (error) {
      toast({
        title: "INITIALIZATION_FAILURE",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-widest text-white">RECRUITMENT <span className="text-lime-400">COMMAND</span></h2>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Review and authorize squadron enlistment applications</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-none font-black italic uppercase tracking-widest text-[10px] h-10 px-6 transition-all">
            <Download className="h-3 w-3 mr-2" />
            EXPORT_LOGS
          </Button>
          <Button 
            onClick={() => setIsAddTeamModalOpen(true)}
            className="bg-lime-400 text-black hover:bg-lime-500 rounded-none font-black italic uppercase tracking-widest text-[10px] h-10 px-6 transition-all"
          >
            <Users className="h-3 w-3 mr-2" />
            INIT_NEW_SQUAD
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-dark border border-white/10 p-6 rounded-none relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black italic uppercase tracking-[0.2em] text-white/40 mb-1">TOTAL_COMMANDERS</p>
              <p className="text-3xl font-black italic tracking-tighter text-white">{totalManagers}</p>
            </div>
            <div className="w-12 h-12 bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
              <Users className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="glass-dark border border-white/10 p-6 rounded-none relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black italic uppercase tracking-[0.2em] text-white/40 mb-1">PENDING_REVIEW</p>
              <p className="text-3xl font-black italic tracking-tighter text-yellow-400">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center animate-pulse">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="glass-dark border border-white/10 p-6 rounded-none relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-lime-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black italic uppercase tracking-[0.2em] text-white/40 mb-1">AUTHORIZED_SQUADS</p>
              <p className="text-3xl font-black italic tracking-tighter text-lime-400">{approvedCount}</p>
            </div>
            <div className="w-12 h-12 bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-lime-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-dark border border-white/10 p-6 rounded-none relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="SEARCH_COORDINATES..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white rounded-none font-mono text-xs placeholder:text-white/20 h-11 focus:border-lime-400/50 transition-all"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none font-black italic uppercase tracking-widest text-[10px] h-11">
              <SelectValue placeholder="FILTER_STATUS" />
            </SelectTrigger>
            <SelectContent className="bg-[#061B14] border-white/10 text-white rounded-none">
              <SelectItem value="all" className="font-black italic uppercase text-[10px] tracking-widest hover:bg-white/5 focus:bg-white/5">ALL_PROTOCOLS</SelectItem>
              <SelectItem value="pending" className="font-black italic uppercase text-[10px] tracking-widest hover:bg-white/5 focus:bg-white/5">PENDING_ONLY</SelectItem>
              <SelectItem value="approved" className="font-black italic uppercase text-[10px] tracking-widest hover:bg-white/5 focus:bg-white/5">AUTHORIZED_ONLY</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => {setSearchTerm(""); setStatusFilter("all")}}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-none font-black italic uppercase tracking-widest text-[10px] h-11 transition-all"
          >
            <Filter className="h-3 w-3" />
            RESET_FILTERS
          </Button>
        </div>
      </div>

      {/* Managers & Teams Table */}
      <div className="glass-dark border border-white/10 rounded-none relative overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-1 h-6 bg-lime-400" />
            <h3 className="text-lg font-black italic uppercase tracking-widest text-white">RECRUITMENT <span className="text-lime-400">LEDGER</span></h3>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono text-white/30 border-white/10 rounded-none uppercase tracking-widest">{filteredManagers.length} NODES DETECTED</Badge>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">COMMANDER</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">VECTORS</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">SQUADRONS</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">SECURITY_SCAN</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">ACCESS_KEY</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">ENLISTED</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14 text-right">PROTOCOLS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredManagers.map((manager) => (
                <TableRow key={manager.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-lime-400/30 transition-all">
                        <span className="text-[10px] font-black text-white/40 group-hover:text-lime-400">{(manager.name || "UN").substring(0,2).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-black italic uppercase text-sm text-white tracking-widest group-hover:text-lime-400 transition-colors">
                          {manager.name}
                        </div>
                        <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                          ID: {manager.id.substring(0,8)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-white/60">
                        <Mail className="h-3 w-3 text-white/20" />
                        {manager.email}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-white/60">
                        <Phone className="h-3 w-3 text-white/20" />
                        {manager.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-3">
                      {manager.Teams.map((team) => (
                        <div key={team.id}>
                          <div className="font-black italic uppercase text-[11px] text-white/80 tracking-widest">{team.name}</div>
                          <div className="text-[9px] font-mono text-white/30 uppercase tracking-tighter">{team.shortname} // {team.location}</div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                       {manager.Teams.map((team) => (
                        <Badge 
                          key={team.id} 
                          variant="outline"
                          className={`rounded-none border-0 font-mono text-[9px] uppercase py-1 px-2 flex items-center gap-1.5 w-fit ${team.approved ? 'bg-lime-400/10 text-lime-400' : 'bg-yellow-400/10 text-yellow-400'}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${team.approved ? 'bg-lime-400 animate-pulse' : 'bg-yellow-400'}`} />
                          {team.approved ? 'AUTHORIZED' : 'PENDING_REVIEW'}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {manager.password ? (
                        <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1.5 focus-within:border-cyan-400/50 transition-all">
                          <input
                            type={showPasswords[manager.id] ? "text" : "password"}
                            value={getDisplayPassword(manager.id, manager.password)}
                            readOnly
                            className="bg-transparent border-0 text-[10px] text-cyan-400 font-mono focus:ring-0 w-24 p-0 outline-none"
                          />
                          <button
                            onClick={() => togglePasswordVisibility(manager.id)}
                            className="text-white/20 hover:text-white transition-colors"
                          >
                            {showPasswords[manager.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                          <button
                            onClick={() => {
                              const passwordToCopy = generatedPasswords[manager.id] || getDisplayPassword(manager.id, manager.password)
                              if (passwordToCopy !== "••••••••") {
                                handleCopyPassword(passwordToCopy)
                              } else {
                                toast({
                                  title: "SYSTEM_ALERT",
                                  description: "Password sequence is encrypted and cannot be extracted.",
                                  variant: "destructive",
                                })
                              }
                            }}
                            className="text-white/20 hover:text-white transition-colors"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">NODATA_SEQUENCE_REQUIRED</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-[10px] font-mono text-white/40 uppercase">
                      {new Date(manager.create_at).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/40 hover:text-white hover:bg-white/5 rounded-none">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#061B14] border-white/10 text-white rounded-none">
                        <DropdownMenuItem onClick={() => handleEditManager(manager)} className="font-black italic uppercase text-[10px] tracking-widest hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                          <Edit className="h-3 w-3 mr-2 text-cyan-400" />
                          EDIT_PROFILE
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRegeneratePassword(manager.id)} className="font-black italic uppercase text-[10px] tracking-widest hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                          <Key className="h-3 w-3 mr-2 text-yellow-400" />
                          {passwordUpdating ? 'GENERATING...' : 'FORCE_REGEN_KEY'}
                        </DropdownMenuItem>
                        {manager.Teams.map((team) => (
                          <DropdownMenuItem 
                            key={team.id} 
                            onClick={() => handleTeamApproval(team.id, !team.approved)}
                            disabled={approvalUpdating}
                            className={`font-black italic uppercase text-[10px] tracking-widest hover:bg-white/5 focus:bg-white/5 cursor-pointer ${team.approved ? 'text-red-400' : 'text-lime-400'}`}
                          >
                            {approvalUpdating ? (
                               'SYNCHRONIZING...'
                            ) : team.approved ? (
                              <>
                                <XCircle className="h-3 w-3 mr-2" />
                                REVOKE_AUTH
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3 mr-2" />
                                GRANT_AUTHORIZATION
                              </>
                            )}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem className="font-black italic uppercase text-[10px] tracking-widest hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                          <Mail className="h-3 w-3 mr-2 text-purple-400" />
                          DISPATCH_COMMS
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="font-black italic uppercase text-[10px] tracking-widest hover:bg-red-400/20 focus:bg-red-400/20 text-red-500 cursor-pointer"
                          onClick={() => handleDeleteManager(manager)}
                          disabled={deleteManagerLoading || deleteByEmailLoading}
                        >
                          {(deleteManagerLoading || deleteByEmailLoading) ? (
                            'PURGING...'
                          ) : (
                            <>
                              <Trash2 className="h-3 w-3 mr-2" />
                              PURGE_NODE
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
      </div>

      {/* Edit Manager Modal */}
      <EditManagerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        manager={editingManager}
        onSave={handleSaveManager}
      />

      {/* Delete Manager Confirmation Modal */}
      <DeleteManagerModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
                    setIsDeleteModalOpen(false)
                    setManagerToDelete(null)
                  }}
        manager={managerToDelete}
        onConfirm={confirmDeleteManager}
        isLoading={deleteManagerLoading || deleteByEmailLoading}
      />

      {/* Add New Team Modal */}
      <AddTeamModal
        isOpen={isAddTeamModalOpen}
        onClose={() => {
          setIsAddTeamModalOpen(false)
          setGeneratedPassword("")
          setShowGeneratedPassword(false)
          setIsCreating(false)
        }}
        onCreateTeam={handleCreateTeam}
        isCreating={isCreating}
        generatedPassword={generatedPassword}
        showGeneratedPassword={showGeneratedPassword}
        onTogglePasswordVisibility={() => setShowGeneratedPassword(!showGeneratedPassword)}
        onCopyPassword={handleCopyPassword}
        onCopyEmail={(email) => navigator.clipboard.writeText(email)}
        managerEmail=""
      />
    </div>
  )
}