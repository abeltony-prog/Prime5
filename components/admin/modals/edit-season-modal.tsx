"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit } from "lucide-react"

interface Season {
  id: string
  name: string
  startDate: string
  EndDate: string
  teams: Record<string | number, string>
}

interface Team {
  id: number
  name: string
  shortname: string
  team_manager: string
  approved?: boolean
}

interface EditSeasonModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdateSeason: (seasonData: any) => void
  season: Season | null
  teams: Team[]
  isLoading: boolean
}

export function EditSeasonModal({ 
  isOpen, 
  onClose, 
  onUpdateSeason, 
  season, 
  teams, 
  isLoading 
}: EditSeasonModalProps) {
  const [seasonName, setSeasonName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedTeams, setSelectedTeams] = useState<(string | number)[]>([])

  // Update form when season changes
  useEffect(() => {
    if (season) {
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
    }
  }, [season])

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
  }

  const handleSubmit = () => {
    const seasonData = {
      seasonName,
      startDate,
      endDate,
      selectedTeams
    }
    onUpdateSeason(seasonData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Season
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="editSeasonName" className="text-white">Season Name *</Label>
            <Input
              id="editSeasonName"
              placeholder="e.g., Prime5 League 2024"
              value={seasonName}
              onChange={(e) => setSeasonName(e.target.value)}
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 placeholder:text-white/60"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editStartDate" className="text-white">Start Date *</Label>
              <Input
                id="editStartDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white/10 backdrop-blur-sm text-white border-white/20"
              />
            </div>
            <div>
              <Label htmlFor="editEndDate" className="text-white">End Date *</Label>
              <Input
                id="editEndDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white/10 backdrop-blur-sm text-white border-white/20"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-white">Invite Teams</Label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-white/20 rounded-md p-3 bg-white/5">
              {teams?.filter((team: any) => team.approved === true).map((team: any) => (
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
                  <Label htmlFor={`edit-team-${team.id}`} className="text-sm text-white">
                    {team.name} ({team.shortname})
                  </Label>
                </div>
              ))}
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
              <Edit className="h-4 w-4 mr-2" />
            )}
            Update Season
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
