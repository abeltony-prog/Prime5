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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-red-500/20 rounded-none shadow-[0_0_100px_rgba(239,68,68,0.2)] max-w-md w-full overflow-hidden relative group">
        {/* Warning Stripe */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <Trash2 className="h-8 w-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-[0.2em] text-white">TERMINATION <span className="text-red-500">PROTOCOL</span></h2>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-2">{">"} CRITICAL SYSTEM OVERRIDE DETECTED</p>
          </div>
          
          <div className="space-y-6 mb-10">
            <div className="bg-white/5 border-l-2 border-red-500 p-4">
              <p className="text-xs font-bold text-white/90 leading-relaxed uppercase tracking-wider">
                CONFIRM PERMANENT ERASURE OF OPERATOR: <br/>
                <span className="text-red-500 text-lg font-black italic mt-1 block">"{manager.name.toUpperCase()}"</span>
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest leading-relaxed">
                ERASING THIS NODE WILL RESULT IN THE CASCADING DELETION OF ALL LINKED SQUADRONS AND HISTORICAL DATA.
              </p>
              
              <div className="bg-red-500/5 border border-red-500/20 p-4 relative overflow-hidden">
                 <div className="flex items-start gap-3 relative z-10">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-red-500 animate-pulse" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-tighter text-red-400">
                    SQUADRON ASSETS REDUCED TO NULL. DATA RECOVERY WILL BE IMPOSSIBLE UPON EXECUTION.
                  </p>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
             <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="bg-transparent border-white/10 text-white/50 hover:bg-white/5 hover:text-white rounded-none tracking-[0.2em] uppercase font-bold text-[10px] h-12 transition-all"
            >
              ABORT
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-red-600 text-white hover:bg-red-700 rounded-none tracking-[0.2em] uppercase font-black italic text-[10px] h-12 shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                 <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                "EXECUTE"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
