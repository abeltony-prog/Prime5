"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
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
import { UPDATE_MANAGER_PASSWORD, UPDATE_TEAM_APPROVAL, DELETE_MANAGER, DELETE_MANAGER_BY_EMAIL } from "@/lib/graphql/mutations"
import { GET_ALL_MANAGERS_DETAILS } from "@/lib/graphql/queries"
import { generatePassword, hashPasswordForStorage } from "@/lib/utils/password"
import { useToast } from "@/hooks/use-toast"

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
  const [statusFilter, setStatusFilter] = useState("all")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null)
  const [editingManager, setEditingManager] = useState<Manager | null>(null)
  const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null)
  const [generatedPasswords, setGeneratedPasswords] = useState<Record<string, string>>({})
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [localManagers, setLocalManagers] = useState<Manager[]>(managers)

  // GraphQL mutations
  const [updatePassword, { loading: passwordUpdating }] = useMutation(UPDATE_MANAGER_PASSWORD)
  const [updateTeamApproval, { loading: approvalUpdating }] = useMutation(UPDATE_TEAM_APPROVAL)
  const [deleteManager, { loading: deleteManagerLoading }] = useMutation(DELETE_MANAGER)
  const [deleteManagerByEmail, { loading: deleteByEmailLoading }] = useMutation(DELETE_MANAGER_BY_EMAIL)
  const { toast } = useToast()

  // Update local managers when prop changes
  useEffect(() => {
    setLocalManagers(managers)
  }, [managers])

  // Handle case when managers is undefined or null
  if (!localManagers || localManagers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Managers Found</h3>
          <p className="text-white/70">There are no registered managers to display.</p>
        </div>
      </div>
    )
  }

  const filteredManagers = localManagers.filter((manager) => {
    const matchesSearch = manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manager.Teams.some(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "approved" && manager.Teams.some(team => team.approved)) ||
                         (statusFilter === "pending" && manager.Teams.some(team => !team.approved))
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (approved: boolean) => {
    return approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  const getStatusIcon = (approved: boolean) => {
    return approved ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />
  }

  const handleTeamApproval = async (teamId: string, approved: boolean) => {
    try {
      const result = await updateTeamApproval({
        variables: {
          id: teamId,
          approved: approved
        },
        refetchQueries: [
          {
            query: GET_ALL_MANAGERS_DETAILS
          }
        ]
      })

      if (result.data?.update_Teams_by_pk) {
        // Update local state
        setLocalManagers(prev => prev.map(manager => ({
          ...manager,
          Teams: manager.Teams.map(team => 
            team.id === teamId 
              ? { ...team, approved: approved }
              : team
          )
        })))

        toast({
          title: "Team Status Updated",
          description: `Team has been ${approved ? 'approved' : 'rejected'} successfully`,
          duration: 3000,
        })
      } else {
        throw new Error('Failed to update team approval status')
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleEditManager = (manager: Manager) => {
    setEditingManager(manager)
    setIsEditModalOpen(true)
  }

  const handleSaveManager = () => {
    // Here you would save the manager details to the database
    console.log('Saving manager:', editingManager)
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
      // Try deleting by ID first, then by email as fallback
      let result
      try {
        result = await deleteManager({
          variables: {
            id: managerToDelete.id
          },
          refetchQueries: [
            {
              query: GET_ALL_MANAGERS_DETAILS
            }
          ]
        })
      } catch (idError) {
        // If ID deletion fails, try by email
        result = await deleteManagerByEmail({
          variables: {
            email: managerToDelete.email
          },
          refetchQueries: [
            {
              query: GET_ALL_MANAGERS_DETAILS
            }
          ]
        })
      }

      if (result.data?.delete_managers_by_pk || result.data?.delete_managers?.affected_rows > 0) {
        // Update local state
        setLocalManagers(prev => prev.filter(manager => manager.id !== managerToDelete.id))

        toast({
          title: "Manager Deleted",
          description: `Manager "${managerToDelete.name}" has been deleted successfully`,
          duration: 3000,
        })
      } else {
        throw new Error('Failed to delete manager')
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
      setManagerToDelete(null)
    }
  }

    const handleRegeneratePassword = async (managerId: string) => {
    try {
      // Generate new password
      const newPassword = generatePassword()
      
      // Hash the password for storage
      const hashedPassword = hashPasswordForStorage(newPassword)
      
      // Update password in database
      const result = await updatePassword({
        variables: {
          id: managerId,
          password: hashedPassword
        },
        refetchQueries: [
          {
            query: GET_ALL_MANAGERS_DETAILS
          }
        ]
      })
      
      if (result.data?.update_managers_by_pk) {
        // Update local managers state with new password
        setLocalManagers(prev => prev.map(manager => 
          manager.id === managerId 
            ? { ...manager, password: hashedPassword }
            : manager
        ))
        
        // Store the plain text password temporarily for display
        setGeneratedPasswords(prev => ({
          ...prev,
          [managerId]: newPassword
        }))
        
        // Show the password
        setShowPasswords(prev => ({
          ...prev,
          [managerId]: true
        }))
        
        // Show success toast
        toast({
          title: "Password Regenerated Successfully",
          description: `New password has been generated and saved for ${localManagers.find(m => m.id === managerId)?.name || 'manager'}`,
          duration: 5000,
        })
      } else if (result.errors && result.errors.length > 0) {
        throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(', ')}`)
      } else {
        throw new Error('Failed to update password in database - no data returned')
      }
    } catch (error) {
      // Show error toast
      toast({
        title: "Password Regeneration Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleCopyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password)
      toast({
        title: "Password Copied",
        description: "Password has been copied to clipboard",
        duration: 3000,
      })
    } catch (error) {
      console.error('Error copying password:', error)
      toast({
        title: "Copy Failed",
        description: "Failed to copy password to clipboard",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const togglePasswordVisibility = (managerId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [managerId]: !prev[managerId]
    }))
  }

  // Function to decode/decrypt password from database
  const decodePassword = (hashedPassword: string) => {
    // For now, we'll show a placeholder since we can't decrypt hashed passwords
    // In a real system, you might have a way to temporarily decrypt or show a masked version
    return "••••••••"
  }

  // Function to get display password (either generated or from database)
  const getDisplayPassword = (managerId: string, hashedPassword: string) => {
    if (generatedPasswords[managerId]) {
      return generatedPasswords[managerId]
    }
    // If we have a hashed password from database, show masked version
    if (hashedPassword) {
      return decodePassword(hashedPassword)
    }
    return "••••••••"
  }

  const pendingCount = localManagers.filter(m => m.Teams.some(t => !t.approved)).length
  const approvedCount = localManagers.filter(m => m.Teams.some(t => t.approved)).length
  const totalManagers = localManagers.length

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Managers & Teams Management</h2>
          <p className="text-white/80">Review and manage managers and their team applications</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Users className="h-4 w-4 mr-2" />
            View All Applications
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Total Managers</p>
                <p className="text-2xl font-bold text-blue-300">{totalManagers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-300">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Approved Teams</p>
                <p className="text-2xl font-bold text-green-300">{approvedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search managers and teams..."
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
                <SelectItem value="pending">Pending Approval</SelectItem>
                <SelectItem value="approved">Approved Teams</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Managers & Teams Table */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Users className="h-5 w-5" />
            Managers & Teams ({filteredManagers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white/90">Manager Details</TableHead>
                  <TableHead className="text-white/90">Contact Info</TableHead>
                  <TableHead className="text-white/90">Teams</TableHead>
                  <TableHead className="text-white/90">Team Status</TableHead>
                  <TableHead className="text-white/90">Password Status</TableHead>
                  <TableHead className="text-white/90">Created</TableHead>
                  <TableHead className="text-white/90">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManagers.map((manager) => (
                  <TableRow key={manager.id} className="hover:bg-white/10">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{manager.name}</div>
                        <div className="text-sm text-white/70">Gender: {manager.gender || 'Not specified'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-white/80">
                          <Mail className="h-3 w-3" />
                          {manager.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-white/80">
                          <Phone className="h-3 w-3" />
                          {manager.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {manager.Teams.map((team) => (
                          <div key={team.id} className="text-sm">
                            <div className="font-medium text-white">{team.name}</div>
                            <div className="text-white/70">({team.shortname}) - {team.location}</div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {manager.Teams.map((team) => (
                          <Badge key={team.id} className={getStatusColor(team.approved)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(team.approved)}
                              {team.approved ? 'Approved' : 'Pending'}
                            </div>
                      </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {manager.password ? (
                          <>
                            <div className="flex items-center gap-2">
                              <Input
                                type={showPasswords[manager.id] ? "text" : "password"}
                                value={getDisplayPassword(manager.id, manager.password)}
                                readOnly
                                className="text-xs bg-white/20 backdrop-blur-sm border-white/30 text-white font-mono"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => togglePasswordVisibility(manager.id)}
                                className="text-white hover:bg-white/20"
                              >
                                {showPasswords[manager.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const passwordToCopy = generatedPasswords[manager.id] || getDisplayPassword(manager.id, manager.password)
                                  if (passwordToCopy !== "••••••••") {
                                    handleCopyPassword(passwordToCopy)
                                  } else {
                                    toast({
                                      title: "Cannot Copy",
                                      description: "Password is hashed and cannot be copied",
                                      variant: "destructive",
                                      duration: 3000,
                                    })
                                  }
                                }}
                                className="text-white hover:bg-white/20"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            {!generatedPasswords[manager.id] && (
                              <div className="text-xs text-white/40 text-center">
                                Password exists (hashed) - regenerate to view
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-xs text-white/50">
                            <div>No password set</div>
                            <div className="text-white/40 text-[10px]">Click regenerate to create one</div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-white/70">
                        {new Date(manager.create_at).toLocaleDateString()}
                        </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditManager(manager)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Manager
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRegeneratePassword(manager.id)}>
                            <Key className="h-4 w-4 mr-2" />
                            {passwordUpdating ? 'Regenerating...' : 'Regenerate Password'}
                          </DropdownMenuItem>
                          {manager.Teams.map((team) => (
                            <DropdownMenuItem 
                              key={team.id} 
                              onClick={() => handleTeamApproval(team.id, !team.approved)}
                              disabled={approvalUpdating}
                            >
                              {approvalUpdating ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                  Updating...
                                </>
                              ) : team.approved ? (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Revoke Approval
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve Team
                                </>
                              )}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteManager(manager)}
                            disabled={deleteManagerLoading || deleteByEmailLoading}
                          >
                            {(deleteManagerLoading || deleteByEmailLoading) ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Manager
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

      {/* Edit Manager Modal */}
      {isEditModalOpen && editingManager && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">Edit Manager Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                handleSaveManager()
              }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editName" className="text-white drop-shadow-md">Manager Name *</Label>
                    <Input
                      id="editName"
                      required
                      value={editingManager.name}
                      onChange={(e) => setEditingManager({...editingManager, name: e.target.value})}
                      className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEmail" className="text-white drop-shadow-md">Email *</Label>
                    <Input
                      type="email"
                      id="editEmail"
                      required
                      value={editingManager.email}
                      onChange={(e) => setEditingManager({...editingManager, email: e.target.value})}
                      className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editPhone" className="text-white drop-shadow-md">Phone *</Label>
                    <Input
                      id="editPhone"
                      type="tel"
                      required
                      value={editingManager.phone}
                      onChange={(e) => setEditingManager({...editingManager, phone: e.target.value})}
                      className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editGender" className="text-white drop-shadow-md">Gender</Label>
                    <select 
                      id="editGender" 
                      value={editingManager.gender}
                      onChange={(e) => setEditingManager({...editingManager, gender: e.target.value})}
                      className="mt-2 w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-white/20 backdrop-blur-sm text-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
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

      {/* Delete Manager Confirmation Modal */}
      {isDeleteModalOpen && managerToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Delete Manager</h2>
                  <p className="text-white/70">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-white/90 mb-2">
                  Are you sure you want to delete the manager <strong>"{managerToDelete.name}"</strong>?
                </p>
                <p className="text-sm text-white/60 mb-3">
                  This will permanently remove the manager and all associated teams from the system.
                </p>
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-200 text-sm">
                    <strong>Warning:</strong> This will also delete all teams associated with this manager.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={confirmDeleteManager}
                  disabled={deleteManagerLoading || deleteByEmailLoading}
                  className="flex-1 bg-red-600/90 backdrop-blur-md hover:bg-red-700/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {(deleteManagerLoading || deleteByEmailLoading) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Manager
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setManagerToDelete(null)
                  }}
                  disabled={deleteManagerLoading || deleteByEmailLoading}
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