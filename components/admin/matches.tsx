"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Play,
  CheckCircle,
  XCircle,
  Trophy,
  MapPin,
  RefreshCw,
  AlertCircle,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useMatchSchedules } from "@/hooks/use-matches"
import { toast } from "@/components/ui/use-toast"
import { useLazyQuery } from "@apollo/client"
import { GET_ALL_PLAYERS_WHERE_TEAM_ID } from "@/lib/graphql/queries"

interface Match {
  id: string
  created_at: string
  dateAndtime: string
  location: string
  season_id: string
  team1: string
  team2: string
  team1Goals?: number
  team2Goals?: number
  Team1?: {
    id: string
    location: string
    logo: string
    name: string
    shortname: string
    team_manager: string
  }
  Team2?: {
    id: string
    location: string
    logo: string
    name: string
    shortname: string
    team_manager: string
  }
}

export function Matches() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [groupFilter, setGroupFilter] = useState("all")
  const [isExporting, setIsExporting] = useState(false)
  const [exportingMatchId, setExportingMatchId] = useState<string | null>(null)

  // Use the hook to get matches from database
  const { matches, loading, error, refetch } = useMatchSchedules()
  
  // Lazy query to fetch players for teams
  const [getTeam1Players, { loading: loadingTeam1Players }] = useLazyQuery(GET_ALL_PLAYERS_WHERE_TEAM_ID)
  const [getTeam2Players, { loading: loadingTeam2Players }] = useLazyQuery(GET_ALL_PLAYERS_WHERE_TEAM_ID)

  const filteredMatches = matches.filter((match: Match) => {
    const team1Name = match.Team1?.name || match.team1 || ""
    const team2Name = match.Team2?.name || match.team2 || ""
    
    const matchesSearch = team1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team2Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Since status field doesn't exist in database, use default "scheduled"
    const matchStatus = "scheduled"
    const matchesStatus = statusFilter === "all" || matchStatus === statusFilter
    
    // Since groups field doesn't exist in database, use default "A"
    const matchGroup = "A"
    const matchesGroup = groupFilter === "all" || matchGroup === groupFilter
    
    return matchesSearch && matchesStatus && matchesGroup
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGroupColor = (group: string) => {
    return group === "A" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
  }

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    } catch {
      return { date: "Invalid Date", time: "Invalid Time" }
    }
  }

  const formatCreatedAt = (createdAt: string) => {
    try {
      return new Date(createdAt).toLocaleDateString()
    } catch {
      return "Invalid Date"
    }
  }

  const exportSeasonCalendar = async () => {
    setIsExporting(true)
    try {
      // Sort matches by date
      const sortedMatches = [...matches].sort((a: Match, b: Match) => {
        const dateA = new Date(a.dateAndtime).getTime()
        const dateB = new Date(b.dateAndtime).getTime()
        return dateA - dateB
      })

    // Process matches (no need to fetch images)
    const processedMatches = sortedMatches.map((match: Match) => {
      const matchDate = new Date(match.dateAndtime)
      // Combine date and time in one string
      const dateTimeStr = matchDate.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      const team1Name = match.Team1?.name || match.team1 || "Unknown Team"
      const team2Name = match.Team2?.name || match.team2 || "Unknown Team"
      // Combine teams in one cell: "Team A vs Team B"
      const teamsPlaying = `${team1Name} vs ${team2Name}`
      const location = match.location || "TBD"

      return {
        dateTime: dateTimeStr,
        teamsPlaying,
        location
      }
    })

    // Helper function to escape CSV cell values
    const escapeCSV = (value: string) => {
      if (!value) return ''
      // Replace double quotes with two double quotes (CSV escaping)
      const escaped = value.toString().replace(/"/g, '""')
      return `"${escaped}"`
    }

    // Create CSV content
    const headers = ['Date & Time', 'Teams Playing', 'Arena']
    const csvRows = processedMatches.map(match => [
      match.dateTime,
      match.teamsPlaying,
      match.location
    ])

    // Combine headers and rows
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...csvRows.map(row => row.map(cell => escapeCSV(cell.toString())).join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    // Generate filename with current date
    const exportDate = new Date().toISOString().split('T')[0]
    link.setAttribute('href', url)
    link.setAttribute('download', `season-calendar-${exportDate}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
    
      // Show success notification
      toast({
        title: "Calendar Exported!",
        description: `Successfully exported ${sortedMatches.length} matches to CSV file.`,
      })
    } catch (error: any) {
      console.error('Error exporting calendar:', error)
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export calendar. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportMatchPlayers = async (match: Match) => {
    setExportingMatchId(match.id)
    setIsExporting(true)
    
    try {
      const team1Id = match.Team1?.id || match.team1
      const team2Id = match.Team2?.id || match.team2
      
      if (!team1Id || !team2Id) {
        toast({
          title: "Export Failed",
          description: "Team information is missing for this match.",
          variant: "destructive"
        })
        return
      }

      // Fetch players for both teams
      const [team1Result, team2Result] = await Promise.all([
        getTeam1Players({ variables: { teamId: team1Id } }),
        getTeam2Players({ variables: { teamId: team2Id } })
      ])

      const team1Players = team1Result.data?.players || []
      const team2Players = team2Result.data?.players || []

      // Format date and time
      const matchDate = new Date(match.dateAndtime)
      const dateTimeStr = matchDate.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })

      // Prepare data for export
      const exportData: any[] = []

      // Add team 1 players
      team1Players.forEach((player: any) => {
        exportData.push({
          matchDate: dateTimeStr,
          matchLocation: match.location || "TBD",
          teamName: match.Team1?.name || "Unknown Team",
          teamShortName: match.Team1?.shortname || "",
          teamLocation: match.Team1?.location || "",
          teamManager: match.Team1?.team_manager || "",
          playerName: player.name || "Unknown Player",
          playerEmail: player.email || "",
          playerPhone: player.phone || "",
          playerDOB: player.dob || "",
          playerGender: player.gender || "",
          playerPosition: player.position || "N/A",
        })
      })

      // Add team 2 players
      team2Players.forEach((player: any) => {
        exportData.push({
          matchDate: dateTimeStr,
          matchLocation: match.location || "TBD",
          teamName: match.Team2?.name || "Unknown Team",
          teamShortName: match.Team2?.shortname || "",
          teamLocation: match.Team2?.location || "",
          teamManager: match.Team2?.team_manager || "",
          playerName: player.name || "Unknown Player",
          playerEmail: player.email || "",
          playerPhone: player.phone || "",
          playerDOB: player.dob || "",
          playerGender: player.gender || "",
          playerPosition: player.position || "N/A",
        })
      })

      // Helper function to escape CSV cell values
      const escapeCSV = (value: string) => {
        if (!value) return ''
        const escaped = value.toString().replace(/"/g, '""')
        return `"${escaped}"`
      }

      // Create CSV content
      const headers = [
        'Match Date & Time',
        'Match Location',
        'Team Name',
        'Team Short Name',
        'Team Location',
        'Team Manager',
        'Player Name',
        'Player Email',
        'Player Phone',
        'Player Date of Birth',
        'Player Gender',
        'Player Position'
      ]

      const csvRows = exportData.map(row => [
        row.matchDate,
        row.matchLocation,
        row.teamName,
        row.teamShortName,
        row.teamLocation,
        row.teamManager,
        row.playerName,
        row.playerEmail,
        row.playerPhone,
        row.playerDOB,
        row.playerGender,
        row.playerPosition,
      ])

      // Combine headers and rows
      const csvContent = [
        headers.map(escapeCSV).join(','),
        ...csvRows.map(row => row.map(cell => escapeCSV(cell.toString())).join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      // Generate filename
      const team1Name = (match.Team1?.name || match.team1 || "Team1").replace(/\s+/g, '-')
      const team2Name = (match.Team2?.name || match.team2 || "Team2").replace(/\s+/g, '-')
      const matchDateStr = matchDate.toISOString().split('T')[0]
      link.setAttribute('href', url)
      link.setAttribute('download', `match-players-${team1Name}-vs-${team2Name}-${matchDateStr}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      URL.revokeObjectURL(url)
      
      toast({
        title: "Players Exported!",
        description: `Successfully exported ${exportData.length} players (${team1Players.length} from ${match.Team1?.name || 'Team 1'} and ${team2Players.length} from ${match.Team2?.name || 'Team 2'}) to CSV file.`,
      })
    } catch (error: any) {
      console.error('Error exporting players:', error)
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export players. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
      setExportingMatchId(null)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin mb-8"></div>
            <p className="text-white/40 font-black tracking-widest uppercase text-sm">Accessing Satellite Link...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center p-12 glass-dark border border-red-500/20 max-w-xl mx-auto backdrop-blur-xl bg-black/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <span className="text-5xl text-red-500 drop-shadow-md">⚠️</span>
            </div>
            <h3 className="text-3xl font-black italic uppercase text-white drop-shadow-lg mb-4">CONNECTION <span className="text-red-500">FAILED</span></h3>
            <p className="text-white/60 font-bold mb-4">Could not decrypt the requested match logs.</p>
            <p className="text-red-400/60 text-xs font-mono mb-8 border border-red-500/10 bg-red-500/5 p-4">{error.message}</p>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="w-full h-12 bg-white/5 border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-white font-bold uppercase tracking-widest text-xs rounded-none transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-Establish Link
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">Match <span className="text-lime-400">Chronicle</span></h2>
          <p className="text-white/40 font-bold tracking-widest uppercase text-xs mt-1">Schedule and monitor active engagements</p>
          <div className="flex items-center gap-3 mt-3">
            <Badge variant="outline" className="text-[10px] bg-lime-400/10 text-lime-300 border-lime-400/30 uppercase tracking-widest font-black rounded-none">
              {matches.length} Total Logs
            </Badge>
            <span className="text-[10px] text-lime-300/60 font-mono uppercase tracking-widest animate-pulse border-l border-white/20 pl-3">Live Feed Online</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={loading}
            className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white font-bold uppercase tracking-widest text-[10px] rounded-none transition-all"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {loading ? 'SYNCING...' : 'SYNC FEED'}
          </Button>
          <Button 
            variant="outline" 
            onClick={exportSeasonCalendar}
            className="bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-lime-400/10 hover:text-lime-300 text-white font-bold uppercase tracking-widest text-[10px] rounded-none transition-all"
            disabled={matches.length === 0 || isExporting}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                DUMPING...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                DUMP CHRONICLE
              </>
            )}
          </Button>
          <Link href="/admin/season-scheduler">
            <Button variant="outline" className="bg-lime-400/10 text-lime-300 border border-lime-400/30 hover:bg-lime-400/20 hover:text-lime-200 font-black italic uppercase tracking-widest text-[10px] rounded-none transition-all shadow-[0_0_15px_rgba(190,242,100,0.1)]">
              <Trophy className="h-4 w-4 mr-2" />
              SEASON MASTER
            </Button>
          </Link>
          <Button className="bg-lime-400/20 text-lime-300 border border-lime-400/50 hover:bg-lime-400 hover:text-black font-black italic uppercase tracking-widest text-[10px] rounded-none transition-all shadow-[0_0_20px_rgba(190,242,100,0.2)]">
            <Plus className="h-4 w-4 mr-2" />
            INITIALIZE MATCH
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-dark border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-none bg-black/40 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Scan logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white placeholder-white/40 focus-visible:ring-0 focus-visible:border-lime-400/50 rounded-none h-12 font-mono text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-black/40 border-white/10 text-white focus:ring-0 rounded-none h-12 font-bold tracking-widest uppercase text-[10px]">
                <SelectValue placeholder="STATUS MODIFIER" />
              </SelectTrigger>
              <SelectContent className="bg-[#061B14] border-white/10 rounded-none">
                <SelectItem value="all" className="text-white hover:bg-lime-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none">ALL STATES</SelectItem>
                <SelectItem value="scheduled" className="text-blue-300 hover:bg-blue-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none">QUEUED</SelectItem>
                <SelectItem value="in_progress" className="text-yellow-300 hover:bg-yellow-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none">ACTIVE</SelectItem>
                <SelectItem value="completed" className="text-lime-300 hover:bg-lime-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none">ARCHIVED</SelectItem>
                <SelectItem value="cancelled" className="text-red-400 hover:bg-red-500/20 font-bold uppercase tracking-widest text-[10px] rounded-none">ABORTED</SelectItem>
              </SelectContent>
            </Select>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="bg-black/40 border-white/10 text-white focus:ring-0 rounded-none h-12 font-bold tracking-widest uppercase text-[10px]">
                <SelectValue placeholder="DIV FILTERS" />
              </SelectTrigger>
              <SelectContent className="bg-[#061B14] border-white/10 rounded-none">
                <SelectItem value="all" className="text-white hover:bg-lime-400/20 font-bold uppercase tracking-widest text-[10px] rounded-none">ALL DIVISIONS</SelectItem>
                <SelectItem value="A" className="text-cyan-400 hover:bg-cyan-500/20 font-bold uppercase tracking-widest text-[10px] rounded-none">DIVISION A</SelectItem>
                <SelectItem value="B" className="text-purple-400 hover:bg-purple-500/20 font-bold uppercase tracking-widest text-[10px] rounded-none">DIVISION B</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-12 bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-white font-bold uppercase tracking-widest text-[10px] rounded-none transition-all flex items-center gap-2">
              <Filter className="h-4 w-4" />
              PURGE FILTERS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Matches Table */}
      <Card className="glass-dark border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-none overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-black/40 p-6">
          <CardTitle className="flex items-center gap-3 text-xl font-black italic uppercase tracking-widest text-lime-300 drop-shadow-sm">
            <Calendar className="h-6 w-6 text-lime-400" />
            Live Chronicle ({filteredMatches.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 bg-[#061B14]/60">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-white/10 mx-auto mb-4" />
              <p className="text-white/60 font-black italic uppercase tracking-widest">No matching logs detected</p>
              <p className="text-[10px] text-lime-300/40 mt-3 font-mono uppercase tracking-widest">
                {searchTerm || statusFilter !== "all" || groupFilter !== "all" 
                  ? ">> Adjust filter directives to locate records" 
                  : ">> Initialize a new match to begin logging"}
              </p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Data / T-Minus</TableHead>
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Versus Target</TableHead>
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70 text-center">Score Log</TableHead>
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Coordinates</TableHead>
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Campaign</TableHead>
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Current State</TableHead>
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70">Registered</TableHead>
                    <TableHead className="py-4 px-6 text-[10px] font-black italic uppercase tracking-widest text-lime-300/70 text-right">Overrides</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredMatches.map((match: Match) => {
                    const { date, time } = formatDateTime(match.dateAndtime)
                    const team1Name = match.Team1?.name || match.team1 || "Unknown Team"
                    const team2Name = match.Team2?.name || match.team2 || "Unknown Team"
                    
                    return (
                      <TableRow key={match.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                        <TableCell className="px-6 py-4">
                          <div>
                            <div className="font-bold text-white tracking-widest uppercase">{date}</div>
                            <div className="text-[10px] text-lime-300 flex items-center gap-1 mt-1 font-mono">
                              <Clock className="h-3 w-3" />
                              {time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="font-bold text-white uppercase tracking-wider text-sm">{team1Name}</div>
                            <div className="text-[9px] font-black text-lime-400/50 uppercase italic px-2 py-0.5 bg-lime-400/10 self-start border border-lime-400/20">VS</div>
                            <div className="font-bold text-white uppercase tracking-wider text-sm">{team2Name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="text-center flex items-center justify-center">
                            {match.team1Goals !== undefined && match.team2Goals !== undefined ? (
                              <div className="font-black itertools text-2xl tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                {match.team1Goals} <span className="text-lime-400 mx-2 text-xl">-</span> {match.team2Goals}
                              </div>
                            ) : (
                              <span className="text-white/30 font-mono text-xs uppercase tracking-widest border border-dashed border-white/20 px-3 py-1">TBD</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-mono text-cyan-200 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1.5 rounded-none max-w-max">
                            <MapPin className="h-3 w-3 text-cyan-400" />
                            {match.location || "TBD"}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge variant="outline" className="font-bold tracking-widest uppercase text-[9px] bg-purple-500/10 text-purple-400 border-purple-500/30 rounded-none">
                            {match.season_id ? `S-${match.season_id.substring(0, 4)}...` : "NO SEASON"}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <Badge className="font-bold uppercase tracking-widest text-[9px] bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-none">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              QUEUED
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="text-[10px] text-white/40 font-mono pt-1">
                            {formatCreatedAt(match.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-white hover:bg-lime-400/20 hover:text-lime-300 rounded-none transition-colors border border-transparent hover:border-lime-400/50">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#061B14] border-white/10 rounded-none shadow-[0_10px_40px_rgba(0,0,0,0.8)] min-w-[200px] p-0">
                              <DropdownMenuItem
                                onClick={() => exportMatchPlayers(match)}
                                disabled={exportingMatchId === match.id || loadingTeam1Players || loadingTeam2Players}
                                className="text-[10px] font-bold uppercase tracking-widest text-lime-300 hover:bg-lime-500/10 hover:text-lime-200 rounded-none p-4 border-b border-white/5 cursor-pointer"
                              >
                                {exportingMatchId === match.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-3"></div>
                                    EXPORTING...
                                  </>
                                ) : (
                                  <>
                                    <Users className="h-4 w-4 mr-3" />
                                    Dump Player Logs
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:text-white rounded-none p-4 border-b border-white/5 cursor-pointer">
                                <Eye className="h-4 w-4 mr-3 text-white/50" />
                                Inspect Log
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:text-white rounded-none p-4 border-b border-white/5 cursor-pointer">
                                <Edit className="h-4 w-4 mr-3 text-white/50" />
                                Modify Matrix
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:bg-cyan-950 hover:text-cyan-300 rounded-none p-4 border-b border-white/5 cursor-pointer">
                                <Play className="h-4 w-4 mr-3" />
                                Initiate Combat
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-950 hover:text-red-400 rounded-none p-4 cursor-pointer focus:bg-red-950 focus:text-red-400">
                                <Trash2 className="h-4 w-4 mr-3" />
                                Abort & Purge
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 