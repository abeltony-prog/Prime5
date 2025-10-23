"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Upload, 
  Download,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"

interface TeamSettings {
  name: string | null
  shortName: string | null
  location: string | null
  founded: string | null
  description: string | null
  logo: string | null
  socialMedia: {
    facebook: string | null
    twitter: string | null
    instagram: string | null
  }
}

interface ManagerSettings {
  name: string | null
  email: string | null
  phone: string | null
  photo?: string | null
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  privacy: {
    profilePublic: boolean
    showContactInfo: boolean
    showStats: boolean
  }
}

interface SettingsTabProps {
  teamSettings: TeamSettings
  managerSettings: ManagerSettings
  onSaveTeamSettings: (settings: TeamSettings) => void
  onSaveManagerSettings: (settings: ManagerSettings) => void
  onLogout: () => void
}

export function SettingsTab({ 
  teamSettings, 
  managerSettings, 
  onSaveTeamSettings, 
  onSaveManagerSettings, 
  onLogout 
}: SettingsTabProps) {
  const [editingTeam, setEditingTeam] = useState(false)
  const [editingManager, setEditingManager] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(teamSettings.logo)
  const [isUploading, setIsUploading] = useState(false)

  const [teamForm, setTeamForm] = useState(teamSettings)
  const [managerForm, setManagerForm] = useState(managerSettings)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSaveTeamSettings = () => {
    onSaveTeamSettings(teamForm)
    setEditingTeam(false)
  }

  const handleSaveManagerSettings = () => {
    onSaveManagerSettings(managerForm)
    setEditingManager(false)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)

    // Convert to base64 for storage
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target?.result as string
      setTeamForm({...teamForm, logo: base64String})
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    setTeamForm({...teamForm, logo: null})
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Team Settings */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Shield className="h-5 w-5" />
              Team Settings
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingTeam(!editingTeam)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Edit className="h-4 w-4 mr-2" />
              {editingTeam ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-name" className="text-white/80">Team Name</Label>
                {editingTeam ? (
                  <Input
                    id="team-name"
                    value={teamForm.name || ""}
                    onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{teamSettings.name || "Team Name Not Set"}</p>
                )}
              </div>
              <div>
                <Label htmlFor="team-shortname" className="text-white/80">Short Name</Label>
                {editingTeam ? (
                  <Input
                    id="team-shortname"
                    value={teamForm.shortName || ""}
                    onChange={(e) => setTeamForm({...teamForm, shortName: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{teamSettings.shortName || "Short Name Not Set"}</p>
                )}
              </div>
              <div>
                <Label htmlFor="team-location" className="text-white/80">Location</Label>
                {editingTeam ? (
                  <Input
                    id="team-location"
                    value={teamForm.location || ""}
                    onChange={(e) => setTeamForm({...teamForm, location: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{teamSettings.location || "Location Not Set"}</p>
                )}
              </div>
              <div>
                <Label htmlFor="team-founded" className="text-white/80">Founded</Label>
                {editingTeam ? (
                  <Input
                    id="team-founded"
                    value={teamForm.founded || ""}
                    onChange={(e) => setTeamForm({...teamForm, founded: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{teamSettings.founded || "Founded Date Not Set"}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-description" className="text-white/80">Description</Label>
                {editingTeam ? (
                  <Textarea
                    id="team-description"
                    value={teamForm.description || ""}
                    onChange={(e) => setTeamForm({...teamForm, description: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                    rows={3}
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{teamSettings.description || "No description available"}</p>
                )}
              </div>
              <div>
                <Label htmlFor="team-logo" className="text-white/80">Team Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative">
                      <img 
                        src={logoPreview} 
                        alt="Team Logo" 
                        className="w-20 h-20 rounded-lg object-cover border-2 border-white/20"
                      />
                      {editingTeam && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                          onClick={handleRemoveLogo}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border-2 border-white/20">
                      <Upload className="w-8 h-8 text-white/60" />
                    </div>
                  )}
                  
                  {editingTeam && (
                    <div className="flex flex-col gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            {logoPreview ? 'Change Logo' : 'Upload Logo'}
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-white/60">Max 5MB, JPG/PNG</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {editingTeam && (
            <div className="mt-6 flex gap-2">
              <Button onClick={handleSaveTeamSettings} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manager Settings */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <User className="h-5 w-5" />
              Manager Settings
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="manager-name" className="text-white/80">Full Name</Label>
                  <p className="text-white font-medium mt-1">{managerSettings.name || "Full Name Not Set"}</p>
              </div>
              <div>
                <Label htmlFor="manager-email" className="text-white/80">Email</Label>
                  <p className="text-white font-medium mt-1">{managerSettings.email || "Email Not Set"}</p>
              </div>
              <div>
                <Label htmlFor="manager-phone" className="text-white/80">Phone</Label>
                  <p className="text-white font-medium mt-1">{managerSettings.phone || "Phone Not Set"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-white/80">Profile Photo</Label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-500/10 backdrop-blur-xl border-red-500/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400 drop-shadow-lg">
            <AlertCircle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div>
                <p className="text-red-400 font-medium">Logout</p>
                <p className="text-red-400/60 text-sm">Sign out of your account</p>
              </div>
              <Button variant="outline" onClick={onLogout} className="border-red-500/30 text-red-400 hover:bg-red-500/20">
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 