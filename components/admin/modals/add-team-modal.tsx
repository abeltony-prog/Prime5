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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-none shadow-[0_0_80px_rgba(0,0,0,1)] max-w-4xl w-full max-h-[95vh] overflow-y-auto custom-scrollbar p-1">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-lime-400/10 border border-lime-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.1)]">
                <Users className="h-5 w-5 text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-widest text-white drop-shadow-sm">ENLIST <span className="text-lime-400">NEW SQUADRON</span></h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white/40 hover:text-white hover:bg-white/5 rounded-none"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Generated Password Display - SECURE ACCESS PANEL */}
          {showGeneratedPassword && generatedPassword && (
            <div className="mb-10 p-6 bg-lime-400/5 border border-lime-400/20 relative group overflow-hidden">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 rotate-45 translate-x-16 -translate-y-16 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-lime-400/20 border border-lime-400/30 flex items-center justify-center">
                  <Key className="h-4 w-4 text-lime-400" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-lime-400">SECURE ACCESS CREDENTIALS GENERATED</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-lime-400/50">OPERATOR EMAIL</Label>
                    <div className="flex items-center gap-2 bg-black/40 border border-white/5 p-3 group-hover:border-lime-400/30 transition-all">
                      <span className="text-sm font-mono text-white/90 overflow-hidden text-ellipsis flex-1">{managerEmail}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCopyEmail(managerEmail)}
                        className="h-8 w-8 p-0 text-lime-400 hover:bg-lime-400/10 hover:text-white transition-all rounded-none"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-lime-400/50">DECRYPTED PASSPHRASE</Label>
                    <div className="flex items-center gap-2 bg-black/40 border border-white/5 p-1 px-3 group-hover:border-lime-400/30 transition-all h-[46px]">
                      <Input
                        type={showGeneratedPassword ? "text" : "password"}
                        value={generatedPassword}
                        readOnly
                        className="bg-transparent border-none text-lime-400 font-mono text-sm focus:ring-0 p-0 h-full flex-1"
                      />
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={onTogglePasswordVisibility}
                          className="h-8 w-8 p-0 text-lime-400/60 hover:text-white hover:bg-lime-400/10 transition-all rounded-none"
                        >
                          {showGeneratedPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onCopyPassword(generatedPassword)}
                          className="h-8 w-8 p-0 text-lime-400 hover:bg-lime-400/10 hover:text-white transition-all rounded-none"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-lime-400/10 pt-6">
                <p className="text-[10px] font-mono text-lime-400/40 uppercase tracking-widest leading-relaxed">
                  {">"} SATELLITE HANDSHAKE COMPLETE. <br/>
                  {">"} DEPLOY CREDENTIALS TO SQUADRON COMMANDER.
                </p>
                <Button
                  onClick={handleClose}
                  className="bg-lime-400 text-black hover:bg-lime-500 rounded-none tracking-[0.2em] uppercase font-black italic text-[10px] h-10 px-8 shadow-[0_0_20px_rgba(163,230,53,0.2)] transition-all"
                >
                  DISMISS LOGS
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Manager Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-lime-400 drop-shadow-sm">OPERATOR INTELLIGENCE</h3>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-lime-400/30 to-transparent" />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="managerName" className="text-[10px] font-black uppercase tracking-widest text-white/50">FULL CODENAME *</Label>
                  <Input
                    id="managerName"
                    required
                    value={newManager.name}
                    onChange={(e) => setNewManager({...newManager, name: e.target.value.toUpperCase()})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 transition-all"
                    placeholder="ENTER OPERATOR NAME"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerEmail" className="text-[10px] font-black uppercase tracking-widest text-white/50">COMMUNICATION FREQUENCY (EMAIL) *</Label>
                  <Input
                    id="managerEmail"
                    type="email"
                    required
                    value={newManager.email}
                    onChange={(e) => setNewManager({...newManager, email: e.target.value})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 transition-all"
                    placeholder="OPERATOR@PRIME5.GG"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="managerPhone" className="text-[10px] font-black uppercase tracking-widest text-white/50">TELEMETRY LINK (PHONE) *</Label>
                  <Input
                    id="managerPhone"
                    type="tel"
                    required
                    value={newManager.phone}
                    onChange={(e) => setNewManager({...newManager, phone: e.target.value})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 transition-all"
                    placeholder="+233 XXX XXX XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerGender" className="text-[10px] font-black uppercase tracking-widest text-white/50">BIOMETRIC TYPE</Label>
                  <select 
                    id="managerGender" 
                    value={newManager.gender}
                    onChange={(e) => setNewManager({...newManager, gender: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white/70 font-black uppercase tracking-widest text-[10px] h-12 px-4 rounded-none focus:outline-none focus:border-lime-400/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#061B14]">N/A</option>
                    <option value="male" className="bg-[#061B14]">MALE</option>
                    <option value="female" className="bg-[#061B14]">FEMALE</option>
                    <option value="other" className="bg-[#061B14]">OTHER</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Team Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-lime-400 drop-shadow-sm">SQUADRON ARCHITECTURE</h3>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-lime-400/30 to-transparent" />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="teamName" className="text-[10px] font-black uppercase tracking-widest text-white/50">SQUADRON DESIGNATION *</Label>
                  <Input
                    id="teamName"
                    required
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({...newTeam, name: e.target.value.toUpperCase()})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 transition-all"
                    placeholder="E.G., NOCTURNAL WARRIORS"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamShortname" className="text-[10px] font-black uppercase tracking-widest text-white/50">TACTICAL ACRONYM *</Label>
                  <Input
                    id="teamShortname"
                    required
                    maxLength={4}
                    value={newTeam.shortname}
                    onChange={(e) => setNewTeam({...newTeam, shortname: e.target.value.toUpperCase()})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 transition-all"
                    placeholder="E.G., NWA"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="teamLocation" className="text-[10px] font-black uppercase tracking-widest text-white/50">SECTOR LOCATION *</Label>
                  <Input
                    id="teamLocation"
                    required
                    value={newTeam.location}
                    onChange={(e) => setNewTeam({...newTeam, location: e.target.value.toUpperCase()})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 transition-all"
                    placeholder="ACCRA S-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamLogo" className="text-[10px] font-black uppercase tracking-widest text-white/50">INSIGNIA DATA (URL)</Label>
                  <Input
                    id="teamLogo"
                    value={newTeam.logo}
                    onChange={(e) => setNewTeam({...newTeam, logo: e.target.value})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-none focus:border-lime-400/50 focus:ring-0 font-mono text-sm h-12 transition-all"
                    placeholder="HTTPS://INSIGNIA.PRIME5.GG/LOGO.PNG"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-8 border-t border-white/5">
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1 bg-lime-400 text-black hover:bg-lime-500 rounded-none tracking-[0.2em] uppercase font-black italic text-[11px] h-14 shadow-[0_0_30px_rgba(163,230,53,0.2)] hover:shadow-[0_0_40px_rgba(163,230,53,0.4)] transition-all order-2 md:order-1"
              >
                {isCreating ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    INITIALIZING SQUADRON...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4" />
                    COMMIT DEPLOYMENT
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isCreating}
                className="flex-1 bg-transparent border-white/10 text-white/50 hover:bg-white/5 hover:text-white rounded-none tracking-[0.2em] uppercase font-bold text-[11px] h-14 transition-all order-1 md:order-2"
              >
                ABORT PROTOCOL
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
