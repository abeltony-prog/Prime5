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
} from "lucide-react"
import Link from "next/link"
import { useMatchSchedules } from "@/hooks/use-matches"

interface Match {
  id: string
  created_at: string
  dateAndtime: string
  location: string
  season_id: string
  team1: string
  team2: string
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

  // Use the hook to get matches from database
  const { matches, loading, error, refetch } = useMatchSchedules()

  const filteredMatches = matches.filter((match) => {
    const team1Name = match.Team1?.name || match.team1 || ""
    const team2Name = match.Team2?.name || match.team2 || ""
    
    const matchesSearch = team1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team2Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    // For now, we'll use a default status since it's not in the current query
    const matchStatus = "scheduled" // This could be enhanced when status is added to the query
    const matchesStatus = statusFilter === "all" || matchStatus === statusFilter
    
    // For now, we'll use a default group since it's not in the current query
    const matchGroup = "A" // This could be enhanced when group is added to the query
    const matchesGroup = groupFilter === "all" || matchGroup === statusFilter
    
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

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300 mx-auto mb-4"></div>
            <p>Loading matches from database...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-300">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p className="text-red-300 font-medium">Error loading matches from database</p>
            <p className="text-white/70 mt-2">{error.message}</p>
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              className="mt-4 bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Match Management</h2>
          <p className="text-white/80">Schedule and manage all league matches</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs text-white/70">
              {matches.length} total matches
            </Badge>
            <Badge variant="outline" className="text-xs text-green-300">
              ✓ Live Database
            </Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={loading}
            className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300 mr-2"></div>
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/admin/season-scheduler">
            <Button variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
              <Trophy className="h-4 w-4 mr-2" />
              Season Scheduler
            </Button>
          </Link>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Match
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search matches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="A">Group A</SelectItem>
                <SelectItem value="B">Group B</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Matches Table */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Calendar className="h-5 w-5" />
            Matches ({filteredMatches.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMatches.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/80">No matches found</p>
              <p className="text-sm text-white/60 mt-1">
                {searchTerm || statusFilter !== "all" || groupFilter !== "all" 
                  ? "Try adjusting your filters" 
                  : "Create your first match to get started"}
              </p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                    <TableHead className="text-white/90">Date & Time</TableHead>
                    <TableHead className="text-white/90">Teams</TableHead>
                    <TableHead className="text-white/90">Location</TableHead>
                    <TableHead className="text-white/90">Season</TableHead>
                    <TableHead className="text-white/90">Created</TableHead>
                    <TableHead className="text-white/90">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredMatches.map((match) => {
                    const { date, time } = formatDateTime(match.dateAndtime)
                    const team1Name = match.Team1?.name || match.team1 || "Unknown Team"
                    const team2Name = match.Team2?.name || match.team2 || "Unknown Team"
                    
                    return (
                      <TableRow key={match.id} className="hover:bg-white/10">
                    <TableCell>
                      <div>
                            <div className="font-medium text-white">{date}</div>
                            <div className="text-sm text-white/70 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                              {time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                            <div className="text-white">{team1Name}</div>
                            <div className="text-white/70">vs</div>
                            <div className="text-white">{team2Name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                          <div className="flex items-center gap-1 text-sm text-white/80">
                            <MapPin className="h-3 w-3" />
                            {match.location || "TBD"}
                        </div>
                    </TableCell>
                    <TableCell>
                          <Badge variant="outline" className="font-medium">
                            {match.season_id ? `Season ${match.season_id.substring(0, 8)}...` : "No Season"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                          <div className="text-sm text-white/70">
                            {formatCreatedAt(match.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Match
                          </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Start Match
                            </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Match
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