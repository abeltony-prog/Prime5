"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

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

interface DeleteManagerModalProps {
  isOpen: boolean
  onClose: () => void
  manager: Manager | null
  onConfirm: () => void
  isLoading: boolean
}

export function DeleteManagerModal({ isOpen, onClose, manager, onConfirm, isLoading }: DeleteManagerModalProps) {
  if (!isOpen || !manager) return null

  return (
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
              Are you sure you want to delete the manager <strong>"{manager.name}"</strong>?
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
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-red-600/90 backdrop-blur-md hover:bg-red-700/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
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
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
