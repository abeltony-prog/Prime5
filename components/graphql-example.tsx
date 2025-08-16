'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTeams } from '@/hooks/use-teams'
import { useCreateTeam } from '@/hooks/use-teams'
import { useUpcomingMatches } from '@/hooks/use-matches'
import { useStandings } from '@/hooks/use-standings'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Type definitions for GraphQL data
interface Team {
  id: number
  name: string
  short_name: string
  group: string
  manager?: string
  founded_year?: number
  logo_url?: string
  points: number
  played: number
  wins: number
  draws: number
  losses: number
  goals_for: number
  goals_against: number
  goal_difference: number
  position: number
}

interface Match {
  id: number
  date: string
  time: string
  team1_id: number
  team2_id: number
  team1_score?: number
  team2_score?: number
  group: string
  venue?: string
  status: string
  team1?: {
    name: string
    short_name: string
    logo_url?: string
  }
  team2?: {
    name: string
    short_name: string
    logo_url?: string
  }
}

export function GraphQLExample() {
  const [activeTab, setActiveTab] = useState<'teams' | 'matches' | 'standings'>('teams')
  
  // GraphQL hooks
  const { teams, loading: teamsLoading, error: teamsError } = useTeams()
  const { createTeam, loading: createLoading } = useCreateTeam()
  const { upcomingMatches, loading: matchesLoading, error: matchesError } = useUpcomingMatches()
  const { standings: groupAStandings, loading: standingsLoading, error: standingsError } = useStandings('A')

  const handleCreateTeam = async () => {
    try {
      await createTeam({
        variables: {
          team: {
            name: 'New Team FC',
            short_name: 'NTFC',
            group: 'A',
            manager: 'John Doe',
            founded_year: 2024
          }
        }
      })
    } catch (error) {
      console.error('Error creating team:', error)
    }
  }

  if (teamsLoading || matchesLoading || standingsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Loading GraphQL data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">GraphQL Integration Demo</h2>
        <p className="text-gray-600">This component demonstrates the GraphQL functionality</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-2">
        <Button
          variant={activeTab === 'teams' ? 'default' : 'outline'}
          onClick={() => setActiveTab('teams')}
        >
          Teams ({teams.length})
        </Button>
        <Button
          variant={activeTab === 'matches' ? 'default' : 'outline'}
          onClick={() => setActiveTab('matches')}
        >
          Upcoming Matches ({upcomingMatches.length})
        </Button>
        <Button
          variant={activeTab === 'standings' ? 'default' : 'outline'}
          onClick={() => setActiveTab('standings')}
        >
          Group A Standings ({groupAStandings.length})
        </Button>
      </div>

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Teams</h3>
            <Button onClick={handleCreateTeam} disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create Sample Team'}
            </Button>
          </div>
          
          {teamsError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-800">Error loading teams: {teamsError.message}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team: Team) => (
              <Card key={team.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <Badge variant="outline">{team.short_name}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Group:</strong> {team.group}</p>
                    <p><strong>Manager:</strong> {team.manager || 'N/A'}</p>
                    <p><strong>Points:</strong> {team.points}</p>
                    <p><strong>Position:</strong> #{team.position}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Upcoming Matches</h3>
          
          {matchesError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-800">Error loading matches: {matchesError.message}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {upcomingMatches.map((match: Match) => (
              <Card key={match.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">{match.team1?.name}</div>
                      <div className="text-gray-500 font-medium">VS</div>
                      <div className="text-lg font-semibold">{match.team2?.name}</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{new Date(match.date).toLocaleDateString()}</p>
                      <p>{match.time}</p>
                      <p>{match.venue}</p>
                    </div>
                    <Badge variant="outline">Group {match.group}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Standings Tab */}
      {activeTab === 'standings' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Group A Standings</h3>
          
          {standingsError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-800">Error loading standings: {standingsError.message}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-sm font-medium text-gray-700">
                      <th className="p-3">Pos</th>
                      <th className="p-3">Team</th>
                      <th className="p-3 text-center">P</th>
                      <th className="p-3 text-center">W</th>
                      <th className="p-3 text-center">D</th>
                      <th className="p-3 text-center">L</th>
                      <th className="p-3 text-center">GF</th>
                      <th className="p-3 text-center">GA</th>
                      <th className="p-3 text-center">GD</th>
                      <th className="p-3 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupAStandings.map((team: Team, index: number) => (
                      <tr key={team.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">{index + 1}</td>
                        <td className="p-3 font-medium">{team.name}</td>
                        <td className="p-3 text-center">{team.played}</td>
                        <td className="p-3 text-center text-green-600">{team.wins}</td>
                        <td className="p-3 text-center text-yellow-600">{team.draws}</td>
                        <td className="p-3 text-center text-red-600">{team.losses}</td>
                        <td className="p-3 text-center">{team.goals_for}</td>
                        <td className="p-3 text-center">{team.goals_against}</td>
                        <td className="p-3 text-center font-medium">
                          {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="font-bold">
                            {team.points}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 