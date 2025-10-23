"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trophy, Plus } from "lucide-react"

interface Team {
  id: number
  name: string
  shortname: string
  team_manager: string
  approved?: boolean
}

interface CreateSeasonModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateSeason: (seasonData: any) => void
  teams: Team[]
  isLoading: boolean
}

export function CreateSeasonModal({ 
  isOpen, 
  onClose, 
  onCreateSeason, 
  teams, 
  isLoading 
}: CreateSeasonModalProps) {
  const [seasonName, setSeasonName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedTeams, setSelectedTeams] = useState<(string | number)[]>([])
  const [description, setDescription] = useState("")

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setSeasonName("")
    setStartDate("")
    setEndDate("")
    setSelectedTeams([])
    setDescription("")
  }

  const handleSubmit = () => {
    const seasonData = {
      seasonName,
      startDate,
      endDate,
      selectedTeams,
      description
    }
    onCreateSeason(seasonData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Create New Season
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="seasonName" className="text-white">Season Name *</Label>
            <Input
              id="seasonName"
              placeholder="e.g., Prime5 League 2024"
              value={seasonName}
              onChange={(e) => setSeasonName(e.target.value)}
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 placeholder:text-white/60"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-white">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white/10 backdrop-blur-sm text-white border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-white">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white/10 backdrop-blur-sm text-white border-white/20"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-white">Description</Label>
            <Textarea
              id="description"
              placeholder="Season description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 placeholder:text-white/60"
            />
          </div>
          
          <div>
            <Label className="text-white">Invite Teams</Label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-white/20 rounded-md p-3 bg-white/5">
              {teams?.filter((team: any) => team.approved === true).map((team: any) => {
                const teamId = team.id
                
                if (!teamId) return null
                
                return (
                  <div key={teamId} className="flex items-center space-x-2">
                    <Checkbox
                      id={`team-${teamId}`}
                      checked={selectedTeams.includes(teamId)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          const newSelectedTeams = [...selectedTeams, teamId]
                          setSelectedTeams(newSelectedTeams)
                        } else {
                          const newSelectedTeams = selectedTeams.filter(id => id !== teamId)
                          setSelectedTeams(newSelectedTeams)
                        }
                      }}
                    />
                    <Label htmlFor={`team-${teamId}`} className="text-sm text-white">
                      {team.name || team.team_name || 'Unknown Team'} ({team.shortname || team.short_name || 'N/A'})
                    </Label>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-white/70 mt-1">
              {selectedTeams.length} team(s) selected
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700/80 text-white border-blue-400/30"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Create Season
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
