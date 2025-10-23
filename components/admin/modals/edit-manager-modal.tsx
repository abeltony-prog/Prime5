"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">Edit Manager Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault()
            handleSave()
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
                onClick={onClose}
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
