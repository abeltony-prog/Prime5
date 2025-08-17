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
} from "lucide-react"

interface Player {
  id: number
  name: string
  create_at: string
  dob: string
  email: string
  gender: string
  phone: string
  team_id: number
}

interface Manager {
  id: number
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
  id?: number
  name: string
  shortname: string
  team_manager: string
  manager: Manager
  matche1: Match[]
  matche2: Match[]
  players: Player[]
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Loading Team Details...
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!team) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Not Found
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Team information not available</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const totalMatches = (team.matche1?.length || 0) + (team.matche2?.length || 0)
  const allMatches = [...(team.matche1 || []), ...(team.matche2 || [])]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            {team.name} - Team Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Team Overview */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                <Trophy className="h-5 w-5" />
                Team Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{team.players?.length || 0}</div>
                  <div className="text-sm text-gray-600">Players</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{team.shortname || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Short Name</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{totalMatches}</div>
                  <div className="text-sm text-gray-600">Total Matches</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatDate(team.manager?.create_at || new Date().toISOString())}
                  </div>
                  <div className="text-sm text-gray-600">Created</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-green-300" />
                    <span className="font-medium text-white">Manager</span>
                  </div>
                  <div className="text-lg font-bold text-green-300">{team.manager?.name || 'N/A'}</div>
                  <div className="text-sm text-white/70 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {team.manager?.email || 'N/A'}
                  </div>
                  <div className="text-sm text-white/60 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {team.manager?.phone || 'N/A'}
                  </div>
                  <div className="mt-2">
                    <Badge className={getGenderColor(team.manager?.gender || 'unknown')}>
                      {team.manager?.gender || 'N/A'}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-300" />
                    <span className="font-medium text-white">Team Info</span>
                  </div>
                  <div className="text-lg font-bold text-blue-300">{team.name || 'N/A'}</div>
                  <div className="text-sm text-white/70">Short: {team.shortname || 'N/A'}</div>
                  <div className="text-sm text-white/60">Manager: {team.team_manager || 'N/A'}</div>
                  <div className="mt-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Active Team
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Players Section */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                <Users className="h-5 w-5" />
                Players ({team.players?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {team.players && team.players.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white/90">Player</TableHead>
                        <TableHead className="text-white/90">Contact</TableHead>
                        <TableHead className="text-white/90">Gender</TableHead>
                        <TableHead className="text-white/90">Date of Birth</TableHead>
                        <TableHead className="text-white/90">Joined</TableHead>
                        <TableHead className="text-white/90">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team.players.map((player: Player) => (
                        <TableRow key={player.id} className="hover:bg-white/10">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{getGenderIcon(player.gender || 'unknown')}</span>
                              <span className="font-medium text-white">{player.name || 'N/A'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm text-white flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {player.email || 'N/A'}
                              </div>
                              <div className="text-xs text-white/70 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {player.phone || 'N/A'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getGenderColor(player.gender || 'unknown')}>
                              {player.gender || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-white/80">
                            {formatDate(player.dob || new Date().toISOString())}
                          </TableCell>
                          <TableCell className="text-sm text-white/70">
                            {formatDate(player.create_at || new Date().toISOString())}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <User className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Users className="h-12 w-12 text-white/50 mx-auto mb-4" />
                  <p className="text-white mb-2">No players found for this team</p>
                  <p className="text-sm text-white/70">Players will appear here once they're added to the team</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Matches Section */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                <Calendar className="h-5 w-5" />
                Matches ({totalMatches})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allMatches.length > 0 ? (
                <div className="space-y-3">
                  {allMatches.map((match: Match) => {
                    const matchStatus = getMatchStatus(match)
                    return (
                      <div key={match.id} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="font-medium text-white">Match #{match.id}</div>
                              <Badge className={matchStatus.color}>
                                {matchStatus.text}
                              </Badge>
                            </div>
                            <div className="text-sm text-white/80 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {match.location || 'N/A'}
                            </div>
                            {match.team1 && match.team2 && (
                              <div className="text-sm text-white/90 mt-1">
                                <span className="font-medium">{match.team1}</span>
                                <span className="mx-2">vs</span>
                                <span className="font-medium">{match.team2}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-white">
                              {formatDate(match.date || new Date().toISOString())}
                            </div>
                            <div className="text-xs text-white/70 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Created: {formatDate(match.created_at || new Date().toISOString())}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-white/50 mx-auto mb-4" />
                  <p className="text-white mb-2">No matches found for this team</p>
                  <p className="text-sm text-white/70">Matches will appear here once they're scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Statistics */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                <Target className="h-5 w-5" />
                Team Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{team.players?.length || 0}</div>
                  <div className="text-sm text-gray-600">Total Players</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalMatches}</div>
                  <div className="text-sm text-gray-600">Total Matches</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {team.manager ? '1' : '0'}
                  </div>
                  <div className="text-sm text-gray-600">Manager</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {team.shortname ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 