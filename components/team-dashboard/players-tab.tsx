"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, Plus, User, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { useMutation, useQuery } from "@apollo/client"
import { GET_ALL_PLAYERS_WHERE_TEAM_ID } from "@/lib/graphql/queries"
import { ADD_TEAM_PLAYER_DETAILS } from "@/lib/graphql/mutations"

interface Player {
  id: string
  name: string
  email: string
  phone: string
  gender: string
  dob: string
  team_id: string
  create_at: string
}

interface PlayersTabProps {
  teamId: string
}

export function PlayersTab({ teamId }: PlayersTabProps) {
  const [showAddPlayerDialog, setShowAddPlayerDialog] = useState(false)
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: ""
  })

  // GraphQL hooks
  const [addPlayer] = useMutation(ADD_TEAM_PLAYER_DETAILS, {
    refetchQueries: [{ query: GET_ALL_PLAYERS_WHERE_TEAM_ID, variables: { teamId } }]
  })

  const { data: playersData, loading: playersLoading } = useQuery(GET_ALL_PLAYERS_WHERE_TEAM_ID, {
    variables: { teamId },
    skip: !teamId
  })

  // Function to handle adding a new player
  const handleAddPlayer = async () => {
    if (!teamId) {
      console.error("No team ID found")
      return
    }
    
    try {
      await addPlayer({
        variables: {
          team_id: teamId,
          name: newPlayer.name,
          email: newPlayer.email,
          phone: newPlayer.phone,
          gender: newPlayer.gender,
          dob: newPlayer.dob
        }
      })
      
      // Reset form and close dialog
      setNewPlayer({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dob: ""
      })
      setShowAddPlayerDialog(false)
    } catch (error) {
      console.error("Error adding player:", error)
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Users className="h-5 w-5" />
            Squad Management
          </CardTitle>
          <Dialog open={showAddPlayerDialog} onOpenChange={setShowAddPlayerDialog}>
            <DialogTrigger asChild>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!teamId}
                title={!teamId ? "No team associated with this manager" : "Add a new player to your team"}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-xl border-white/20">
              <DialogHeader>
                <DialogTitle className="text-gray-800">Add New Player</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="player-name" className="text-gray-700">Name</Label>
                  <Input
                    id="player-name"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                    placeholder="Player's full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="player-email" className="text-gray-700">Email</Label>
                  <Input
                    id="player-email"
                    type="email"
                    value={newPlayer.email}
                    onChange={(e) => setNewPlayer({...newPlayer, email: e.target.value})}
                    placeholder="player@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="player-phone" className="text-gray-700">Phone</Label>
                  <Input
                    id="player-phone"
                    value={newPlayer.phone}
                    onChange={(e) => setNewPlayer({...newPlayer, phone: e.target.value})}
                    placeholder="+1234567890"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="player-gender" className="text-gray-700">Gender</Label>
                  <Select value={newPlayer.gender} onValueChange={(value) => setNewPlayer({...newPlayer, gender: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="player-dob" className="text-gray-700">Date of Birth</Label>
                  <Input
                    id="player-dob"
                    type="date"
                    value={newPlayer.dob}
                    onChange={(e) => setNewPlayer({...newPlayer, dob: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleAddPlayer}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    Add Player
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddPlayerDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white/90">Player</TableHead>
                <TableHead className="text-white/90">Email</TableHead>
                <TableHead className="text-white/90">Phone</TableHead>
                <TableHead className="text-white/90">Gender</TableHead>
                <TableHead className="text-white/90">Date of Birth</TableHead>
                <TableHead className="text-white/90">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playersLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-white/70 py-8">
                    Loading players...
                  </TableCell>
                </TableRow>
              ) : playersData?.players?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-white/70 py-8">
                    No players found. Add your first player!
                  </TableCell>
                </TableRow>
              ) : (
                playersData?.players?.map((player: Player) => (
                  <TableRow key={player.id} className="hover:bg-white/10">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-600/90 to-green-700/90 backdrop-blur-md rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{player.name}</div>
                          <div className="text-sm text-white/70">#{player.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{player.email || "N/A"}</TableCell>
                    <TableCell className="text-white">{player.phone || "N/A"}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {player.gender || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{player.dob || "N/A"}</TableCell>
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
                            Edit Player
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Player
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 