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
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Download,
} from "lucide-react"
import { useTeams } from "@/hooks/use-teams"
import { useCreateTeam } from "@/hooks/use-teams"
import { TeamDetails } from "./team-details"

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
  id: number
  name: string
  shortname: string
  team_manager: string
  manager: Manager
  matche1: Match[]
  matche2: Match[]
  players: Player[]
}

interface TeamsProps {
  teams: Team[]
}

// Sample fallback data for when database is not connected
const fallbackTeams: Team[] = [
  {
    id: 1,
    name: "Manchester United",
    shortname: "MUFC",
    team_manager: "Erik ten Hag",
    manager: {
      id: 1,
      name: "Erik ten Hag",
      email: "erik.tenhag@manutd.com",
      phone: "+44 161 123 4567",
      gender: "male",
      photo: undefined,
      create_at: "2023-01-01T00:00:00Z"
    },
    matche1: [
      {
        id: 1,
        date: "2024-01-15T15:00:00Z",
        location: "Old Trafford",
        team1: "Manchester United",
        created_at: "2024-01-01T00:00:00Z"
      }
    ],
    matche2: [
      {
        id: 2,
        date: "2024-01-22T15:00:00Z",
        location: "Emirates Stadium",
        team2: "Arsenal",
        created_at: "2024-01-01T00:00:00Z"
      }
    ],
    players: [
      {
        id: 1,
        name: "Marcus Rashford",
        create_at: "2023-01-01T00:00:00Z",
        dob: "1997-10-31T00:00:00Z",
        email: "m.rashford@manutd.com",
        gender: "male",
        phone: "+44 161 123 4568",
        team_id: 1
      },
      {
        id: 2,
        name: "Bruno Fernandes",
        create_at: "2023-01-01T00:00:00Z",
        dob: "1994-09-08T00:00:00Z",
        email: "b.fernandes@manutd.com",
        gender: "male",
        phone: "+44 161 123 4569",
        team_id: 1
      }
    ]
  },
  {
    id: 2,
    name: "Arsenal FC",
    shortname: "ARS",
    team_manager: "Mikel Arteta",
    manager: {
      id: 2,
      name: "Mikel Arteta",
      email: "m.arteta@arsenal.com",
      phone: "+44 20 123 4567",
      gender: "male",
      photo: undefined,
      create_at: "2023-01-01T00:00:00Z"
    },
    matche1: [
      {
        id: 3,
        date: "2024-01-29T15:00:00Z",
        location: "Emirates Stadium",
        team1: "Arsenal",
        created_at: "2024-01-01T00:00:00Z"
      }
    ],
    matche2: [],
    players: [
      {
        id: 3,
        name: "Bukayo Saka",
        create_at: "2023-01-01T00:00:00Z",
        dob: "2001-09-05T00:00:00Z",
        email: "b.saka@arsenal.com",
        gender: "male",
        phone: "+44 20 123 4568",
        team_id: 2
      }
    ]
  },
  {
    id: 3,
    name: "Chelsea FC",
    shortname: "CHE",
    team_manager: "Mauricio Pochettino",
    manager: {
      id: 3,
      name: "Mauricio Pochettino",
      email: "m.pochettino@chelsea.com",
      phone: "+44 20 123 4569",
      gender: "male",
      photo: undefined,
      create_at: "2023-01-01T00:00:00Z"
    },
    matche1: [],
    matche2: [],
    players: [
      {
        id: 4,
        name: "Cole Palmer",
        create_at: "2023-01-01T00:00:00Z",
        dob: "2002-05-06T00:00:00Z",
        email: "c.palmer@chelsea.com",
        gender: "male",
        phone: "+44 20 123 4570",
        team_id: 3
      }
    ]
  }
]

export function Teams({ teams: initialTeams }: TeamsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [groupFilter, setGroupFilter] = useState("all")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Use the hook to get teams from database
  const { teams: dbTeams, loading, error, refetch } = useTeams()
  
  // Create team mutation
  const { createTeam, loading: createLoading } = useCreateTeam()
  
  // Use database teams if available, otherwise fall back to fallback teams
  const teams = dbTeams && dbTeams.length > 0 ? dbTeams : fallbackTeams
  
  // Determine data source
  const isUsingFallbackData = !dbTeams || dbTeams.length === 0
  const dataSource = isUsingFallbackData ? "Fallback Data" : "Database"
  
  // Show warning if using fallback data
  const showFallbackWarning = isUsingFallbackData && !loading

  const handleAddSampleTeam = async () => {
    try {
      const sampleTeam = {
        name: "Test Team FC",
        shortname: "TTFC",
        team_manager: "Test Manager",
        location: "Test City",
        logo: null
      }
      
      await createTeam({ variables: { team: sampleTeam } })
      // Refresh the teams list
      refetch()
    } catch (err) {
      console.error('Error creating sample team:', err)
    }
  }

  const filteredTeams = teams.filter((team: Team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.team_manager.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGroup = groupFilter === "all" || team.shortname.includes(groupFilter)
    
    return matchesSearch && matchesGroup
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGroupColor = (group: string) => {
    return group === "A" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
  }

  const handleViewDetails = (team: Team) => {
    setSelectedTeam(team)
    setIsDetailsOpen(true)
  }

  const getGenderIcon = (gender: string) => {
    return gender === "male" ? "👨" : gender === "female" ? "👩" : "👤"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Show loading state only when fetching from database and no initial teams
  if (loading && fallbackTeams.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading teams from database...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state only when there's an error and no fallback teams
  if (error && fallbackTeams.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">Error loading teams from database</p>
            <p className="text-gray-600 mt-2">{error.message}</p>
            <p className="text-sm text-gray-500 mt-2">Using fallback data</p>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="space-y-6">
      {/* Fallback Data Warning */}
      {showFallbackWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="text-yellow-600 text-lg">⚠️</div>
            <div>
              <h3 className="text-yellow-800 font-medium">Using Fallback Data</h3>
              <p className="text-yellow-700 text-sm">
                Unable to connect to database. Showing sample data for demonstration purposes.
              </p>
              <div className="mt-3 p-3 bg-white rounded border">
                <h4 className="font-medium text-yellow-800 mb-2">To connect to your database:</h4>
                <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root</li>
                  <li>Add your Hasura GraphQL URL: <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_HASURA_GRAPHQL_URL=your_url_here</code></li>
                  <li>Add your admin secret: <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_HASURA_ADMIN_SECRET=your_secret_here</code></li>
                  <li>Restart your development server</li>
                  <li>Click "Test Connection" to verify the setup</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Team Management</h2>
          <p className="text-white/80">Manage all registered teams and their information</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={isUsingFallbackData ? "destructive" : "outline"} className="text-xs">
              {dataSource}
            </Badge>
            {!isUsingFallbackData && (
              <span className="text-xs text-green-300">✓ Live Database</span>
            )}
            {isUsingFallbackData && (
              <span className="text-xs text-yellow-300">⚠️ Sample Data</span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            ) : (
            <Download className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleAddSampleTeam}
            disabled={createLoading}
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            {createLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Add Sample Team
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Team
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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

      {/* Teams Table */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Users className="h-5 w-5" />
            Teams ({filteredTeams.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white/90">Team</TableHead>
                  <TableHead className="text-white/90">Manager</TableHead>
                  <TableHead className="text-white/90">Group</TableHead>
                  <TableHead className="text-white/90">Players</TableHead>
                  <TableHead className="text-white/90">Matches</TableHead>
                  <TableHead className="text-white/90">Created</TableHead>
                  <TableHead className="text-white/90">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team: Team) => (
                  <TableRow key={team.name} className="hover:bg-white/10">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{team.shortname || team.name.substring(0, 2)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{team.name}</div>
                          <div className="text-sm text-white/70">Short: {team.shortname}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{team.manager.name}</div>
                        <div className="text-sm text-white/70">{team.manager.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getGroupColor(team.shortname)}>
                        {team.shortname}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-medium">
                        {team.players?.length || 0} players
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-medium">
                        {(team.matche1?.length || 0) + (team.matche2?.length || 0)} matches
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-white/70">
                      {formatDate(team.manager?.create_at || new Date().toISOString())}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(team)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Team
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Team Details Dialog */}
      <TeamDetails
        team={selectedTeam}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        loading={false}
      />
    </div>
  )
} 