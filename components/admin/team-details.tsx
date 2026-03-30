"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  Trophy,
  Calendar,
  Target,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Award,
  Shield,
  Star,
  RefreshCw,
  ArrowRightLeft as Swap
} from "lucide-react"

interface Player {
  id: string
  name: string
  create_at: string
  dob: string
  email: string
  gender: string
  phone: string
  team_id: string
}

interface Manager {
  id: string
  name: string
  email: string
  phone: string
  gender: string
  photo?: string
  create_at: string
}

interface Match {
  id: number
  date: string
  location: string
  team1?: string
  team2?: string
  created_at: string
}

interface Team {
  id?: string
  name: string
  shortname: string
  team_manager: string
  manager: Manager
  matche1: Match[]
  matche2: Match[]
  players: Player[]
  approved: boolean
}

interface TeamDetailsProps {
  team: Team | null
  isOpen: boolean
  onClose: () => void
  loading?: boolean
}

export function TeamDetails({ team, isOpen, onClose, loading = false }: TeamDetailsProps) {
  const getGenderIcon = (gender: string) => {
    return gender === "male" ? "👨" : gender === "female" ? "👩" : "👤"
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  const getGenderColor = (gender: string) => {
    return gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  const getMatchStatus = (match: Match) => {
    const matchDate = new Date(match.date)
    const now = new Date()
    
    if (matchDate > now) {
      return { status: 'upcoming', color: 'bg-blue-100 text-blue-800', text: 'Upcoming' }
    } else {
      return { status: 'completed', color: 'bg-green-100 text-green-800', text: 'Completed' }
    }
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl overflow-hidden bg-black/90 backdrop-blur-3xl border border-white/10 rounded-none shadow-2xl text-white p-12 flex flex-col items-center justify-center min-h-[400px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />
          <RefreshCw className="h-12 w-12 text-lime-400 animate-spin mb-6" />
          <p className="text-[10px] font-black italic uppercase tracking-[0.3em] text-white/40">INITIALIZING_INTELLIGENCE_STREAM</p>
          <div className="mt-8 flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-lime-400/20 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!team) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl overflow-hidden bg-black/90 backdrop-blur-3xl border border-white/10 rounded-none shadow-2xl text-white p-12 flex flex-col items-center justify-center min-h-[400px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-red-500/40" />
          </div>
          <h3 className="text-xl font-black italic uppercase tracking-widest text-white mb-2">SIGNAL <span className="text-red-500">LOST</span></h3>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Team intelligence signature not found in central database</p>
          <Button 
            onClick={onClose}
            className="mt-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-none font-black italic uppercase tracking-widest text-[10px] h-10 px-8 transition-all"
          >
            ABORT_REQUEST
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  const totalMatches = (team.matche1?.length || 0) + (team.matche2?.length || 0)
  const allMatches = [...(team.matche1 || []), ...(team.matche2 || [])]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-black/90 backdrop-blur-3xl border border-white/10 rounded-none shadow-2xl text-white p-0 flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />
        
        <div className="p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <DialogHeader className="mb-8">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-lime-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {team.logo ? (
                    <img 
                      src={team.logo} 
                      alt={`${team.name} Logo`}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <Shield className="h-6 w-6 text-lime-400/60" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-[0.2em] text-white leading-none">
                    {team.name}
                  </h2>
                  <p className="text-[10px] font-mono text-lime-400/60 uppercase tracking-widest mt-1">TEAM_INTELLIGENCE_PROFILE // {team.shortname || "N/A"}</p>
                </div>
              </DialogTitle>
              
              <div className="flex gap-2">
                <Badge variant="outline" className={`rounded-none border-white/10 text-[10px] font-black uppercase tracking-widest px-3 py-1 ${team.approved ? 'text-lime-400 bg-lime-400/10 border-lime-400/20' : 'text-orange-400 bg-orange-400/10 border-orange-400/20'}`}>
                  {team.approved ? 'STRATEGIC_READY' : 'PENDING_VALIDATION'}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
            {/* Tactical Stats Matrix */}
            <div className="xl:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-dark border border-white/10 p-6 rounded-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-1.5 bg-white/5 border-b border-l border-white/10 text-[7px] font-black opacity-20 group-hover:opacity-40 transition-opacity">SQUADRON_SIZE</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">PERSONNEL</div>
                <div className="text-3xl font-black italic text-lime-400 flex items-baseline gap-2">
                  {team.players?.length || 0}
                  <span className="text-[10px] font-mono text-white/20 uppercase">UNITS</span>
                </div>
              </div>
              
              <div className="glass-dark border border-white/10 p-6 rounded-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-1.5 bg-white/5 border-b border-l border-white/10 text-[7px] font-black opacity-20 group-hover:opacity-40 transition-opacity">MATCH_MATRIX</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">ENGAGEMENTS</div>
                <div className="text-3xl font-black italic text-cyan-400 flex items-baseline gap-2">
                  {totalMatches}
                  <span className="text-[10px] font-mono text-white/20 uppercase">NODES</span>
                </div>
              </div>

              <div className="glass-dark border border-white/10 p-6 rounded-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-1.5 bg-white/5 border-b border-l border-white/10 text-[7px] font-black opacity-20 group-hover:opacity-40 transition-opacity">DEPLOYMENT_AGE</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">SINCE</div>
                <div className="text-lg font-black italic text-white mt-2">
                  {formatDate(team.manager?.create_at || new Date().toISOString()).toUpperCase()}
                </div>
              </div>

              <div className="glass-dark border border-white/10 p-6 rounded-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-1.5 bg-white/5 border-b border-l border-white/10 text-[7px] font-black opacity-20 group-hover:opacity-40 transition-opacity">CORE_STATUS</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">OPERATIONAL</div>
                <div className="text-lg font-black italic text-lime-400 mt-2">
                  ACTIVE_MODE
                </div>
              </div>
            </div>

            {/* Command Profile (Manager) */}
            <div className="glass-dark border border-lime-400/20 bg-lime-400/5 p-6 rounded-none relative">
              <div className="absolute top-0 left-0 w-full p-2 bg-lime-400/10 border-b border-lime-400/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-lime-400 animate-pulse rounded-full" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-lime-400/60">COMMAND_OVERRIDE_AUTH</span>
              </div>
              <div className="mt-6 flex items-start gap-4">
                <div className="w-16 h-16 bg-black/40 border border-lime-400/30 flex items-center justify-center p-1">
                  {team.manager?.photo ? (
                    <img src={team.manager.photo} alt="Commander" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all" />
                  ) : (
                    <User className="h-8 w-8 text-lime-400/20" />
                  )}
                </div>
                <div>
                  <h3 className="font-black italic uppercase text-lg text-white leading-none tracking-widest">{team.manager?.name || 'UNKNOWN_CMD'}</h3>
                  <p className="text-[10px] font-mono text-lime-400 uppercase mt-1">CHIEF_SQUADRON_OFFICER</p>
                  
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/60">
                      <Mail className="h-3 w-3 text-lime-400/40" />
                      {team.manager?.email || 'OFFLINE'}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                      <Phone className="h-3 w-3 text-lime-400/20" />
                      {team.manager?.phone || 'UNCERTAIN'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Players Section (Squadron Personnel) */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white border-l-2 border-lime-400 pl-4 py-1">
                SQUADRON_PERSONNEL_MANIFEST
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
              <Badge variant="outline" className="rounded-none border-white/10 font-mono text-[10px] text-white/40">
                {team.players?.length || 0} UNITS_DETECTED
              </Badge>
            </div>

            {team.players && team.players.length > 0 ? (
              <div className="glass-dark border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40 h-10">OPERATIVE_ID</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40 h-10">CONTACT_VECTOR</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40 h-10">GENOTYPE</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40 h-10">BIRTH_NODE</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40 h-10">ENLISTED</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.players.map((player: Player) => (
                      <TableRow key={player.id} className="border-white/5 hover:bg-lime-400/5 transition-colors group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-xs group-hover:border-lime-400/30 transition-colors">
                              {getGenderIcon(player.gender)}
                            </div>
                            <div className="font-black italic uppercase text-[11px] text-white tracking-widest">{player.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="text-[10px] font-mono text-lime-400/70">{player.email}</div>
                            <div className="text-[9px] font-mono text-white/30">{player.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`rounded-none border-white/10 font-mono text-[9px] uppercase ${player.gender === 'male' ? 'text-cyan-400' : 'text-purple-400'}`}>
                            {player.gender}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px] font-mono text-white/40">
                          {formatDate(player.dob).toUpperCase()}
                        </TableCell>
                        <TableCell className="text-[10px] font-mono text-white/20">
                          {formatDate(player.create_at).toUpperCase()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-12 text-center glass-dark border border-dashed border-white/10 bg-white/5">
                <Users className="h-12 w-12 text-white/10 mx-auto mb-4" />
                <p className="text-[10px] font-black italic uppercase tracking-widest text-white/30">No active personnel detected</p>
                <p className="text-[8px] font-mono text-white/20 mt-2 uppercase">Awaiting squadron enlistment protocols</p>
              </div>
            )}
          </div>

          {/* Engagement Logs (Matches) */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white border-l-2 border-cyan-400 pl-4 py-1">
                COMBAT_ENGAGEMENT_LOGS
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
              <Badge variant="outline" className="rounded-none border-white/10 font-mono text-[10px] text-white/40">
                {totalMatches} LOGS_RECORDED
              </Badge>
            </div>

            {allMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allMatches.map((match: Match) => {
                  const matchStatus = getMatchStatus(match)
                  return (
                    <div key={match.id} className="glass-dark border border-white/10 p-5 rounded-none group hover:border-cyan-400/30 transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1.5 bg-white/5 border-b border-l border-white/10 text-[7px] font-mono text-white/20 uppercase tracking-widest">
                        NODE_{match.id}
                      </div>

                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                          <Badge className={`rounded-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${matchStatus.status === 'upcoming' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20' : 'bg-lime-400/10 text-lime-400 border border-lime-400/20'}`}>
                            {matchStatus.text}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                           <div className="text-[10px] font-black italic uppercase text-white/80 tracking-widest flex-1 truncate">
                             {match.team1 || "UNKNOWN_SQ"}
                           </div>
                           <span className="text-[8px] font-black text-white/20">VS</span>
                           <div className="text-[10px] font-black italic uppercase text-white/80 tracking-widest flex-1 truncate text-right">
                             {match.team2 || "UNKNOWN_SQ"}
                           </div>
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                           <div className="space-y-1">
                             <span className="text-[7px] font-black text-white/20 uppercase tracking-widest block">VECTOR</span>
                             <div className="flex items-center gap-1 text-[9px] font-black text-white/60 truncate uppercase italic">
                               <MapPin className="h-2.5 w-2.5 text-cyan-400/40" />
                               {match.location || 'N/A'}
                             </div>
                           </div>
                           <div className="space-y-1 text-right">
                             <span className="text-[7px] font-black text-white/20 uppercase tracking-widest block">TIMESTAMP</span>
                             <div className="text-[10px] font-black text-cyan-400 italic tabular-nums">
                               {formatDate(match.date).toUpperCase()}
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-12 text-center glass-dark border border-dashed border-white/10 bg-white/5">
                <Calendar className="h-12 w-12 text-white/10 mx-auto mb-4" />
                <p className="text-[10px] font-black italic uppercase tracking-widest text-white/30">No engagement records found</p>
                <p className="text-[8px] font-mono text-white/20 mt-2 uppercase">Tactical matrix currently clear</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end pt-8 mt-auto px-8 pb-8 gap-4 bg-black/40 border-t border-white/10">
          <Button 
            onClick={onClose}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-none font-black italic uppercase tracking-widest text-[11px] h-12 px-12 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          >
            DISCONNECT_PROFILE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 