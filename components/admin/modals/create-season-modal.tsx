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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black/80 backdrop-blur-2xl border border-white/10 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)] text-white p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl font-black italic uppercase tracking-widest text-white drop-shadow-sm">
            <Trophy className="h-6 w-6 text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.5)]" />
            INITIALIZE <span className="text-lime-400">NEW CAMPAIGN</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="seasonName" className="text-[10px] font-black uppercase tracking-widest text-white/50">CAMPAIGN IDENTITY *</Label>
            <Input
              id="seasonName"
              placeholder="E.G., PRIME5 LEAGUE S4"
              value={seasonName}
              onChange={(e) => setSeasonName(e.target.value.toUpperCase())}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-[10px] font-black uppercase tracking-widest text-white/50">COMMENCEMENT DATE *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-[10px] font-black uppercase tracking-widest text-white/50">TERMINATION DATE *</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 [color-scheme:dark]"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/50">MISSION PROTOCOL</Label>
            <Textarea
              id="description"
              placeholder="OUTLINE THE SEASON OBJECTIVES..."
              value={description}
              onChange={(e) => setDescription(e.target.value.toUpperCase())}
              rows={3}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm min-h-[100px] transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/50">ENLIST SQUADRONS</Label>
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto border border-white/10 rounded-none p-4 bg-black/40 backdrop-blur-xl custom-scrollbar scrollbar-none">
              {teams?.filter((team: any) => team.approved === true).map((team: any) => {
                const teamId = team.id
                
                if (!teamId) return null
                
                const isSelected = selectedTeams.includes(teamId)
                
                return (
                  <label 
                    key={teamId} 
                    className={`flex items-center p-3 cursor-pointer transition-all border-l-2 ${isSelected ? 'bg-lime-400/10 border-lime-400' : 'hover:bg-white/5 border-transparent'}`}
                  >
                    <Checkbox
                      id={`team-${teamId}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTeams([...selectedTeams, teamId])
                        } else {
                          setSelectedTeams(selectedTeams.filter(id => id !== teamId))
                        }
                      }}
                      className="border-white/20 data-[state=checked]:bg-lime-400 data-[state=checked]:text-black rounded-none"
                    />
                    <div className="ml-4 flex-1">
                      <span className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-lime-400' : 'text-white/70'}`}>
                        {team.name || team.team_name}
                      </span>
                      <span className="ml-2 text-[9px] font-mono text-white/30">
                        [{team.shortname || team.short_name || 'N/A'}]
                      </span>
                    </div>
                  </label>
                )
              })}
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
              <p className="text-[9px] font-black uppercase tracking-tighter text-lime-400/60 transition-all">
                {selectedTeams.length} SQUAD{selectedTeams.length !== 1 ? 'S' : ''} READY FOR DEPLOYMENT
              </p>
              {selectedTeams.length > 0 && (
                 <button 
                  onClick={() => setSelectedTeams([])} 
                  className="text-[9px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400"
                >
                  PURGE SELECTION
                 </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-8 mt-4 border-t border-white/5">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="bg-transparent border-white/10 text-white/50 hover:bg-white/5 hover:text-white rounded-none tracking-[0.2em] uppercase font-bold text-[10px] h-11 px-8 transition-all"
          >
            ABORT
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !seasonName || !startDate || !endDate}
            className="bg-lime-400 text-black hover:bg-lime-500 rounded-none tracking-[0.2em] uppercase font-black italic text-[10px] h-11 px-10 shadow-[0_0_30px_rgba(163,230,53,0.2)] hover:shadow-[0_0_40px_rgba(163,230,53,0.4)] transition-all disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              "INITIALIZE CAMPAIGN"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
