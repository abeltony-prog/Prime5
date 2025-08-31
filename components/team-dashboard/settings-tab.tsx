"use client"

import { useState } from "react"
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
  AlertCircle
} from "lucide-react"

interface TeamSettings {
  name: string
  shortName: string
  location: string
  founded: string
  description: string
  website: string
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
  }
}

interface ManagerSettings {
  name: string
  email: string
  phone: string
  photo: string
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
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [teamForm, setTeamForm] = useState(teamSettings)
  const [managerForm, setManagerForm] = useState(managerSettings)

  const handleSaveTeamSettings = () => {
    onSaveTeamSettings(teamForm)
    setEditingTeam(false)
  }

  const handleSaveManagerSettings = () => {
    onSaveManagerSettings(managerForm)
    setEditingManager(false)
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!")
      return
    }
    // Handle password change logic here
    alert("Password changed successfully!")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
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
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{teamSettings.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="team-shortname" className="text-white/80">Short Name</Label>
                {editingTeam ? (
                  <Input
                    id="team-shortname"
                    value={teamForm.shortName}
                    onChange={(e) => setTeamForm({...teamForm, shortName: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{teamSettings.shortName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="team-location" className="text-white/80">Location</Label>
                {editingTeam ? (
                  <Input
                    id="team-location"
                    value={teamForm.location}
                    onChange={(e) => setTeamForm({...teamForm, location: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{teamSettings.location}</p>
                )}
              </div>
              <div>
                <Label htmlFor="team-founded" className="text-white/80">Founded</Label>
                {editingTeam ? (
                  <Input
                    id="team-founded"
                    value={teamForm.founded}
                    onChange={(e) => setTeamForm({...teamForm, founded: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{teamSettings.founded}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-description" className="text-white/80">Description</Label>
                {editingTeam ? (
                  <Textarea
                    id="team-description"
                    value={teamForm.description}
                    onChange={(e) => setTeamForm({...teamForm, description: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                    rows={3}
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{teamSettings.description}</p>
                )}
              </div>
              <div>
                <Label htmlFor="team-website" className="text-white/80">Website</Label>
                {editingTeam ? (
                  <Input
                    id="team-website"
                    value={teamForm.website}
                    onChange={(e) => setTeamForm({...teamForm, website: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{teamSettings.website}</p>
                )}
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <User className="h-5 w-5" />
              Manager Settings
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingManager(!editingManager)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Edit className="h-4 w-4 mr-2" />
              {editingManager ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="manager-name" className="text-white/80">Full Name</Label>
                {editingManager ? (
                  <Input
                    id="manager-name"
                    value={managerForm.name}
                    onChange={(e) => setManagerForm({...managerForm, name: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{managerSettings.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="manager-email" className="text-white/80">Email</Label>
                {editingManager ? (
                  <Input
                    id="manager-email"
                    type="email"
                    value={managerForm.email}
                    onChange={(e) => setManagerForm({...managerForm, email: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{managerSettings.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="manager-phone" className="text-white/80">Phone</Label>
                {editingManager ? (
                  <Input
                    id="manager-phone"
                    value={managerForm.phone}
                    onChange={(e) => setManagerForm({...managerForm, phone: e.target.value})}
                    className="mt-1 bg-white/10 border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white font-medium mt-1">{managerSettings.phone}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-white/80">Profile Photo</Label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  {editingManager && (
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {editingManager && (
            <div className="mt-6 flex gap-2">
              <Button onClick={handleSaveManagerSettings} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-white/60 text-sm">Receive updates via email</p>
              </div>
              <Switch 
                checked={managerSettings.notifications.email}
                onCheckedChange={(checked) => setManagerForm({
                  ...managerForm,
                  notifications: { ...managerForm.notifications, email: checked }
                })}
              />
            </div>
            <Separator className="bg-white/20" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">SMS Notifications</p>
                <p className="text-white/60 text-sm">Receive updates via SMS</p>
              </div>
              <Switch 
                checked={managerSettings.notifications.sms}
                onCheckedChange={(checked) => setManagerForm({
                  ...managerForm,
                  notifications: { ...managerForm.notifications, sms: checked }
                })}
              />
            </div>
            <Separator className="bg-white/20" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-white/60 text-sm">Receive updates in the app</p>
              </div>
              <Switch 
                checked={managerSettings.notifications.push}
                onCheckedChange={(checked) => setManagerForm({
                  ...managerForm,
                  notifications: { ...managerForm.notifications, push: checked }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Lock className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Public Profile</p>
                <p className="text-white/60 text-sm">Allow others to view your profile</p>
              </div>
              <Switch 
                checked={managerSettings.privacy.profilePublic}
                onCheckedChange={(checked) => setManagerForm({
                  ...managerForm,
                  privacy: { ...managerForm.privacy, profilePublic: checked }
                })}
              />
            </div>
            <Separator className="bg-white/20" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Show Contact Info</p>
                <p className="text-white/60 text-sm">Display your contact information</p>
              </div>
              <Switch 
                checked={managerSettings.privacy.showContactInfo}
                onCheckedChange={(checked) => setManagerForm({
                  ...managerForm,
                  privacy: { ...managerForm.privacy, showContactInfo: checked }
                })}
              />
            </div>
            <Separator className="bg-white/20" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Show Statistics</p>
                <p className="text-white/60 text-sm">Display your team statistics</p>
              </div>
              <Switch 
                checked={managerSettings.privacy.showStats}
                onCheckedChange={(checked) => setManagerForm({
                  ...managerForm,
                  privacy: { ...managerForm.privacy, showStats: checked }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password" className="text-white/80">Current Password</Label>
              <div className="relative mt-1">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="new-password" className="text-white/80">New Password</Label>
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-white/80">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 bg-white/10 border-white/20 text-white"
              />
            </div>
            <Button onClick={handlePasswordChange} className="bg-blue-600 hover:bg-blue-700">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
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