"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Edit } from "lucide-react"

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

interface EditManagerModalProps {
  isOpen: boolean
  onClose: () => void
  manager: Manager | null
  onSave: (manager: Manager) => void
}

export function EditManagerModal({ isOpen, onClose, manager, onSave }: EditManagerModalProps) {
  const [editingManager, setEditingManager] = useState<Manager | null>(manager)

  if (!isOpen || !editingManager) return null

  const handleSave = () => {
    onSave(editingManager)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-none shadow-[0_0_80px_rgba(0,0,0,1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-1">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-lime-400/10 border border-lime-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.1)]">
                <Edit className="h-5 w-5 text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-widest text-white drop-shadow-sm">EDIT <span className="text-lime-400">OPERATOR DATA</span></h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/40 hover:text-white hover:bg-white/5 rounded-none"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="editName" className="text-[10px] font-black uppercase tracking-widest text-white/50">CODENAME *</Label>
                <Input
                  id="editName"
                  required
                  value={editingManager.name}
                  onChange={(e) => setEditingManager({...editingManager, name: e.target.value.toUpperCase()})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail" className="text-[10px] font-black uppercase tracking-widest text-white/50">LINK (EMAIL) *</Label>
                <Input
                  type="email"
                  id="editEmail"
                  required
                  value={editingManager.email}
                  onChange={(e) => setEditingManager({...editingManager, email: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="editPhone" className="text-[10px] font-black uppercase tracking-widest text-white/50">TELEMETRY LINK (PHONE) *</Label>
                <Input
                  id="editPhone"
                  type="tel"
                  required
                  value={editingManager.phone}
                  onChange={(e) => setEditingManager({...editingManager, phone: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editGender" className="text-[10px] font-black uppercase tracking-widest text-white/50">BIOMETRIC TYPE</Label>
                <select 
                  id="editGender" 
                  value={editingManager.gender}
                  onChange={(e) => setEditingManager({...editingManager, gender: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white/70 font-black uppercase tracking-widest text-[10px] h-12 px-4 rounded-none focus:outline-none focus:border-lime-400/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#061B14]">N/A</option>
                  <option value="male" className="bg-[#061B14]">MALE</option>
                  <option value="female" className="bg-[#061B14]">FEMALE</option>
                  <option value="other" className="bg-[#061B14]">OTHER</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-8 border-t border-white/5">
              <Button
                type="submit"
                className="flex-1 bg-lime-400 text-black hover:bg-lime-500 rounded-none tracking-[0.2em] uppercase font-black italic text-[11px] h-14 shadow-[0_0_30px_rgba(163,230,53,0.2)] hover:shadow-[0_0_40px_rgba(163,230,53,0.4)] transition-all order-2 md:order-1"
              >
                SAVE OVERRIDE
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent border-white/10 text-white/50 hover:bg-white/5 hover:text-white rounded-none tracking-[0.2em] uppercase font-bold text-[11px] h-14 transition-all order-1 md:order-2"
              >
                ABORT CHANGES
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
