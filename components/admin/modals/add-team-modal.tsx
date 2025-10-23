"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Users, Key, Copy, Eye, EyeOff } from "lucide-react"

interface AddTeamModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateTeam: (managerData: any, teamData: any) => void
  isCreating: boolean
  generatedPassword: string
  showGeneratedPassword: boolean
  onTogglePasswordVisibility: () => void
  onCopyPassword: (password: string) => void
  onCopyEmail: (email: string) => void
  managerEmail: string
}

export function AddTeamModal({ 
  isOpen, 
  onClose, 
  onCreateTeam, 
  isCreating,
  generatedPassword,
  showGeneratedPassword,
  onTogglePasswordVisibility,
  onCopyPassword,
  onCopyEmail,
  managerEmail
}: AddTeamModalProps) {
  const [newManager, setNewManager] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    photo: ""
  })
  const [newTeam, setNewTeam] = useState({
    name: "",
    shortname: "",
    location: "",
    logo: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateTeam(newManager, newTeam)
  }

  const handleClose = () => {
    setNewManager({ name: "", email: "", phone: "", gender: "", photo: "" })
    setNewTeam({ name: "", shortname: "", location: "", logo: "" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">Add New Team</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Generated Password Display */}
          {showGeneratedPassword && generatedPassword && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-5 w-5 text-green-400" />
                <h3 className="text-lg font-semibold text-green-200">Generated Login Credentials</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-200 font-medium">Email:</span>
                  <span className="text-white font-mono">{managerEmail}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCopyEmail(managerEmail)}
                    className="text-green-400 hover:bg-green-500/20"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-200 font-medium">Password:</span>
                  <Input
                    type={showGeneratedPassword ? "text" : "password"}
                    value={generatedPassword}
                    readOnly
                    className="text-xs bg-white/20 backdrop-blur-sm border-white/30 text-white font-mono w-48"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onTogglePasswordVisibility}
                    className="text-green-400 hover:bg-green-500/20"
                  >
                    {showGeneratedPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCopyPassword(generatedPassword)}
                    className="text-green-400 hover:bg-green-500/20"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-green-200/80 text-sm">
                  Share these credentials with the team manager for login access.
                </p>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleClose}
                    className="bg-green-600/80 hover:bg-green-700/80 text-white"
                  >
                    Close Modal
                  </Button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Manager Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">Manager Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="managerName" className="text-white drop-shadow-md">Manager Name *</Label>
                  <Input
                    id="managerName"
                    required
                    value={newManager.name}
                    onChange={(e) => setNewManager({...newManager, name: e.target.value})}
                    className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                    placeholder="Enter manager's full name"
                  />
                </div>
                <div>
                  <Label htmlFor="managerEmail" className="text-white drop-shadow-md">Email *</Label>
                  <Input
                    id="managerEmail"
                    type="email"
                    required
                    value={newManager.email}
                    onChange={(e) => setNewManager({...newManager, email: e.target.value})}
                    className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                    placeholder="Enter manager's email"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="managerPhone" className="text-white drop-shadow-md">Phone *</Label>
                  <Input
                    id="managerPhone"
                    type="tel"
                    required
                    value={newManager.phone}
                    onChange={(e) => setNewManager({...newManager, phone: e.target.value})}
                    className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                    placeholder="Enter manager's phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="managerGender" className="text-white drop-shadow-md">Gender</Label>
                  <select 
                    id="managerGender" 
                    value={newManager.gender}
                    onChange={(e) => setNewManager({...newManager, gender: e.target.value})}
                    className="mt-2 w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-white/20 backdrop-blur-sm text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Team Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">Team Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teamName" className="text-white drop-shadow-md">Team Name *</Label>
                  <Input
                    id="teamName"
                    required
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                    className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <Label htmlFor="teamShortname" className="text-white drop-shadow-md">Team Short Name *</Label>
                  <Input
                    id="teamShortname"
                    required
                    value={newTeam.shortname}
                    onChange={(e) => setNewTeam({...newTeam, shortname: e.target.value})}
                    className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                    placeholder="Enter team short name (e.g., FC)"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teamLocation" className="text-white drop-shadow-md">Location *</Label>
                  <Input
                    id="teamLocation"
                    required
                    value={newTeam.location}
                    onChange={(e) => setNewTeam({...newTeam, location: e.target.value})}
                    className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                    placeholder="Enter team location"
                  />
                </div>
                <div>
                  <Label htmlFor="teamLogo" className="text-white drop-shadow-md">Logo URL</Label>
                  <Input
                    id="teamLogo"
                    value={newTeam.logo}
                    onChange={(e) => setNewTeam({...newTeam, logo: e.target.value})}
                    className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
                    placeholder="Enter logo URL (optional)"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1 bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Team...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Create Team & Manager
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isCreating}
                className="flex-1 border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
