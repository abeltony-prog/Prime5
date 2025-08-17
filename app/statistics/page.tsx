'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Target, Award, TrendingUp, Users, Trophy, TrendingDown, Calendar, Clock, MapPin } from "lucide-react"
import { useState } from "react"


export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState<'statistics' | 'standings' | 'fixtures' | 'bracket'>('statistics')

  const topScorers = [
    { name: "Marcus Silva", team: "Lightning United", goals: 12, matches: 6 },
    { name: "Diego Rodriguez", team: "Thunder FC", goals: 10, matches: 6 },
    { name: "Alex Johnson", team: "Velocity FC", goals: 9, matches: 6 },
    { name: "Carlos Santos", team: "Rapid Fire", goals: 8, matches: 6 },
    { name: "Ahmed Hassan", team: "Dynamo FC", goals: 7, matches: 6 },
  ]

  const playerOfTheWeek = {
    name: "Marcus Silva",
    team: "Lightning United",
    stats: "Hat-trick + 2 assists",
    week: "Week 6",
  }

  const teamStats = [
    { team: "Lightning United", stat: "Most Goals", value: "19" },
    { team: "Thunder FC", stat: "Best Defense", value: "8 GA" },
    { team: "Velocity FC", stat: "Most Assists", value: "15" },
    { team: "Rapid Fire", stat: "Most Shots", value: "87" },
  ]

  const leagueStats = [
    { label: "Total Goals", value: "156", icon: Target },
    { label: "Total Matches", value: "48", icon: Users },
    { label: "Average Goals/Match", value: "3.25", icon: TrendingUp },
    { label: "Clean Sheets", value: "12", icon: Award },
  ]

  const groupAStandings = [
    { pos: 1, team: "Thunder FC", played: 6, wins: 5, draws: 1, losses: 0, gf: 18, ga: 8, gd: 10, points: 16 },
    { pos: 2, team: "Rapid Fire", played: 6, wins: 4, draws: 1, losses: 1, gf: 15, ga: 10, gd: 5, points: 13 },
    { pos: 3, team: "Storm Riders", played: 6, wins: 3, draws: 2, losses: 1, gf: 12, ga: 9, gd: 3, points: 11 },
    { pos: 4, team: "Phoenix United", played: 6, wins: 2, draws: 3, losses: 1, gf: 11, ga: 10, gd: 1, points: 9 },
    { pos: 5, team: "Blaze FC", played: 6, wins: 2, draws: 1, losses: 3, gf: 9, ga: 12, gd: -3, points: 7 },
    { pos: 6, team: "Fire Hawks", played: 6, wins: 1, draws: 2, losses: 3, gf: 8, ga: 13, gd: -5, points: 5 },
    { pos: 7, team: "Red Devils", played: 6, wins: 1, draws: 1, losses: 4, gf: 7, ga: 14, gd: -7, points: 4 },
    { pos: 8, team: "Flame United", played: 6, wins: 0, draws: 1, losses: 5, gf: 5, ga: 16, gd: -11, points: 1 },
  ]

  const groupBStandings = [
    { pos: 1, team: "Lightning United", played: 6, wins: 5, draws: 0, losses: 1, gf: 19, ga: 7, gd: 12, points: 15 },
    { pos: 2, team: "Velocity FC", played: 6, wins: 4, draws: 2, losses: 0, gf: 16, ga: 8, gd: 8, points: 14 },
    { pos: 3, team: "Dynamo FC", played: 6, wins: 3, draws: 2, losses: 1, gf: 13, ga: 9, gd: 4, points: 11 },
    { pos: 4, team: "Electric FC", played: 6, wins: 3, draws: 1, losses: 2, gf: 12, ga: 11, gd: 1, points: 10 },
    { pos: 5, team: "Bolt United", played: 6, wins: 2, draws: 2, losses: 2, gf: 10, ga: 11, gd: -1, points: 8 },
    { pos: 6, team: "Power FC", played: 6, wins: 1, draws: 3, losses: 2, gf: 9, ga: 12, gd: -3, points: 6 },
    { pos: 7, team: "Shock FC", played: 6, wins: 1, draws: 1, losses: 4, gf: 8, ga: 15, gd: -7, points: 4 },
    { pos: 8, team: "Spark United", played: 6, wins: 0, draws: 1, losses: 5, gf: 6, ga: 17, gd: -11, points: 1 },
  ]

  const [selectedFixtureTab, setSelectedFixtureTab] = useState("upcoming")
  const [selectedGroup, setSelectedGroup] = useState("all")

  const upcomingMatches = [
    {
      id: 1,
      date: "2024-02-15",
      time: "19:00",
      team1: "Thunder FC",
      team2: "Lightning United",
      group: "A",
      venue: "Prime Arena 1",
    },
    {
      id: 2,
      date: "2024-02-15",
      time: "20:00",
      team1: "Storm Riders",
      team2: "Velocity FC",
      group: "B",
      venue: "Prime Arena 2",
    },
    {
      id: 3,
      date: "2024-02-16",
      time: "18:30",
      team1: "Rapid Fire",
      team2: "Blaze FC",
      group: "A",
      venue: "Prime Arena 1",
    },
    {
      id: 4,
      date: "2024-02-16",
      time: "19:30",
      team1: "Phoenix United",
      team2: "Dynamo FC",
      group: "B",
      venue: "Prime Arena 2",
    },
  ]

  const pastResults = [
    {
      id: 1,
      date: "2024-02-08",
      team1: "Thunder FC",
      team2: "Storm Riders",
      score1: 3,
      score2: 2,
      group: "A",
    },
    {
      id: 2,
      date: "2024-02-08",
      team2: "Lightning United",
      team1: "Velocity FC",
      score1: 1,
      score2: 4,
      group: "B",
    },
    {
      id: 3,
      date: "2024-02-09",
      team1: "Rapid Fire",
      team2: "Phoenix United",
      score1: 2,
      score2: 2,
      group: "A",
    },
  ]

  const filteredUpcoming =
    selectedGroup === "all" ? upcomingMatches : upcomingMatches.filter((match) => match.group === selectedGroup)

  const filteredResults =
    selectedGroup === "all" ? pastResults : pastResults.filter((match) => match.group === selectedGroup)

  const groupATeams = [
    { name: "Thunder FC", position: 1 },
    { name: "Rapid Fire", position: 2 },
    { name: "Storm Riders", position: 3 },
    { name: "Phoenix United", position: 4 },
  ]

  const groupBTeams = [
    { name: "Lightning United", position: 1 },
    { name: "Velocity FC", position: 2 },
    { name: "Dynamo FC", position: 3 },
    { name: "Electric FC", position: 4 },
  ]

  const knockoutMatches = {
    quarterfinals: [
      { team1: "Thunder FC", team2: "Electric FC", winner: "Thunder FC" },
      { team1: "Lightning United", team2: "Phoenix United", winner: "Lightning United" },
      { team1: "Rapid Fire", team2: "Dynamo FC", winner: "TBD" },
      { team1: "Velocity FC", team2: "Storm Riders", winner: "TBD" },
    ],
    semifinals: [
      { team1: "Thunder FC", team2: "Lightning United", winner: "TBD" },
      { team1: "TBD", team2: "TBD", winner: "TBD" },
    ],
    final: { team1: "TBD", team2: "TBD", winner: "TBD" },
  }



  const MatchCard = ({
    team1,
    team2,
    winner,
    stage,
  }: { team1: string; team2: string; winner: string; stage: string }) => (
    <Card className={`bg-white/10 backdrop-blur-xl border-2 ${winner !== "TBD" ? "border-green-500/50 bg-green-500/20" : "border-white/20"} shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105`}>
      <CardContent className="p-4">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="mb-2 bg-white/20 backdrop-blur-sm border-white/30 text-white">
            {stage}
          </Badge>
          <div className="space-y-1">
            <p className={`font-semibold drop-shadow-md ${winner === team1 ? "text-green-300" : "text-white"}`}>{team1}</p>
            <p className="text-white/80 text-sm">VS</p>
            <p className={`font-semibold drop-shadow-md ${winner === team2 ? "text-green-300" : "text-white"}`}>{team2}</p>
          </div>
          {winner !== "TBD" && <Badge className="bg-green-500/90 backdrop-blur-md text-white mt-2">Winner: {winner}</Badge>}
        </div>
      </CardContent>
    </Card>
  )

  const TeamCard = ({ team, group }: { team: { name: string; position: number }; group: string }) => (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
      <CardContent className="p-4 text-center">
        <Badge variant="outline" className="mb-2 bg-white/20 backdrop-blur-sm border-white/30 text-white">
          #{team.position}
        </Badge>
        <p className="font-semibold text-white drop-shadow-md">{team.name}</p>
        <p className="text-sm text-white/80">Group {group}</p>
      </CardContent>
    </Card>
  )

  const StandingsTable = ({ standings, groupName }: { standings: typeof groupAStandings; groupName: string }) => (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-md text-white">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Group {groupName} Standings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/20 backdrop-blur-sm">
              <tr className="text-left text-sm font-medium text-white">
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
              {standings.map((team, index) => (
                <tr
                  key={team.team}
                  className={`border-b border-white/20 hover:bg-white/10 transition-all duration-300 ${
                    index < 2 ? "bg-green-500/20 backdrop-blur-sm" : index >= standings.length - 2 ? "bg-red-500/20 backdrop-blur-sm" : ""
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{team.pos}</span>
                      {index < 2 && <TrendingUp className="h-4 w-4 text-green-300" />}
                      {index >= standings.length - 2 && <TrendingDown className="h-4 w-4 text-red-300" />}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white drop-shadow-md">{team.team}</span>
                      {index === 0 && <Badge className="bg-yellow-500/90 backdrop-blur-md text-black">Leader</Badge>}
                    </div>
                  </td>
                  <td className="p-3 text-center text-white">{team.played}</td>
                  <td className="p-3 text-center text-green-300 font-medium">{team.wins}</td>
                  <td className="p-3 text-center text-yellow-300 font-medium">{team.draws}</td>
                  <td className="p-3 text-center text-red-300 font-medium">{team.losses}</td>
                  <td className="p-3 text-center text-white">{team.gf}</td>
                  <td className="p-3 text-center text-white">{team.ga}</td>
                  <td className={`p-3 text-center font-medium ${team.gd >= 0 ? "text-green-300" : "text-red-300"}`}>
                    {team.gd > 0 ? "+" : ""}
                    {team.gd}
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className="font-bold text-white border-white/50 bg-white/20 backdrop-blur-sm">
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
  )

  return (
    <div className="min-h-screen relative">
      <Navigation />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">League Center</h1>
          <p className="text-lg text-white/90 drop-shadow-xl">Statistics, standings, and fixtures</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-lg p-1 shadow-2xl border border-white/20">
            <Button
              variant={activeTab === 'statistics' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('statistics')}
              className={activeTab === 'statistics' ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg' : 'text-white hover:bg-white/20 hover:text-white'}
            >
              Statistics
            </Button>
            <Button
              variant={activeTab === 'standings' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('standings')}
              className={activeTab === 'standings' ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg' : 'text-white hover:bg-white/20 hover:text-white'}
            >
              Standings
            </Button>
            <Button
              variant={activeTab === 'fixtures' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('fixtures')}
              className={activeTab === 'fixtures' ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg' : 'text-white hover:bg-white/20 hover:text-white'}
            >
              Fixtures
            </Button>
            <Button
              variant={activeTab === 'bracket' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('bracket')}
              className={activeTab === 'bracket' ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-lg' : 'text-white hover:bg-white/20 hover:text-white'}
            >
              Bracket
            </Button>

          </div>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="space-y-12">
            {/* League Overview Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              {leagueStats.map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl text-center hover:shadow-3xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{stat.value}</h3>
                    <p className="text-white/90 drop-shadow-md">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Top Scorers */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-yellow-500/90 to-yellow-600/90 backdrop-blur-md text-black">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Top Scorers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {topScorers.map((player, index) => (
                      <div
                        key={index}
                        className={`p-4 border-b border-white/20 last:border-b-0 hover:bg-white/10 transition-all duration-300 ${index === 0 ? "bg-yellow-500/20 backdrop-blur-sm" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0
                                  ? "bg-yellow-500 text-black"
                                  : index === 1
                                    ? "bg-gray-400 text-white"
                                    : index === 2
                                      ? "bg-orange-400 text-white"
                                      : "bg-blue-100/80 backdrop-blur-sm text-blue-600"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-white drop-shadow-md">{player.name}</p>
                              <p className="text-sm text-white/80">{player.team}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white drop-shadow-lg">{player.goals}</p>
                            <p className="text-sm text-white/70">{player.matches} matches</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Player of the Week */}
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-md text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Player of the Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center">
                    <Badge className="mb-4 bg-yellow-500/90 backdrop-blur-md text-black">{playerOfTheWeek.week}</Badge>
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{playerOfTheWeek.name}</h3>
                    <p className="text-lg text-white/90 mb-4 drop-shadow-md">{playerOfTheWeek.team}</p>
                    <p className="text-white font-semibold drop-shadow-md">{playerOfTheWeek.stats}</p>
                  </CardContent>
                </Card>

                {/* Team Performance Stats */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-green-600/90 to-green-700/90 backdrop-blur-md text-white">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Team Performance Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {teamStats.map((stat, index) => (
                        <div
                          key={index}
                          className="p-4 border-b border-white/20 last:border-b-0 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-white drop-shadow-md">{stat.team}</p>
                              <p className="text-sm text-white/80">{stat.stat}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white drop-shadow-lg">{stat.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional Statistics */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardHeader className="bg-blue-600/90 backdrop-blur-md text-white">
                  <CardTitle className="text-center">Most Disciplined</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">Phoenix United</h3>
                  <p className="text-white/90 drop-shadow-md">Only 2 yellow cards</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardHeader className="bg-yellow-500/90 backdrop-blur-md text-black">
                  <CardTitle className="text-center">Best Goalkeeper</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">Roberto Martinez</h3>
                  <p className="text-white/90 drop-shadow-md">Thunder FC • 4 clean sheets</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardHeader className="bg-green-600/90 backdrop-blur-md text-white">
                  <CardTitle className="text-center">Most Assists</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">Luis Garcia</h3>
                  <p className="text-white/90 drop-shadow-md">Velocity FC • 8 assists</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Standings Tab */}
        {activeTab === 'standings' && (
          <div className="space-y-8">
            {/* Group Selection */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-xl rounded-lg p-1 shadow-2xl border border-white/20">
                <Button
                  variant={selectedGroup === "all" ? "default" : "ghost"}
                  onClick={() => setSelectedGroup("all")}
                  className={selectedGroup === "all" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  All Groups
                </Button>
                <Button
                  variant={selectedGroup === "A" ? "default" : "ghost"}
                  onClick={() => setSelectedGroup("A")}
                  className={selectedGroup === "A" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  Group A
                </Button>
                <Button
                  variant={selectedGroup === "B" ? "default" : "ghost"}
                  onClick={() => setSelectedGroup("B")}
                  className={selectedGroup === "B" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  Group B
                </Button>
              </div>
            </div>

            {/* Standings Tables */}
            {selectedGroup === "all" && (
              <div className="grid lg:grid-cols-2 gap-8">
                <StandingsTable standings={groupAStandings} groupName="A" />
                <StandingsTable standings={groupBStandings} groupName="B" />
              </div>
            )}
            {selectedGroup === "A" && <StandingsTable standings={groupAStandings} groupName="A" />}
            {selectedGroup === "B" && <StandingsTable standings={groupBStandings} groupName="B" />}
          </div>
        )}

        {/* Bracket Tab */}
        {activeTab === 'bracket' && (
          <div className="space-y-8">
            {/* Knockout Stage */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-2xl">Knockout Stage</h2>
              <p className="text-lg text-white/90 drop-shadow-xl">Tournament progression and results</p>
            </div>

            {/* Quarterfinals */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">Quarterfinals</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {knockoutMatches.quarterfinals.map((match, index) => (
                  <MatchCard
                    key={index}
                    team1={match.team1}
                    team2={match.team2}
                    winner={match.winner}
                    stage="Quarterfinal"
                  />
                ))}
              </div>
            </div>

            {/* Semifinals */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">Semifinals</h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {knockoutMatches.semifinals.map((match, index) => (
                  <MatchCard
                    key={index}
                    team1={match.team1}
                    team2={match.team2}
                    winner={match.winner}
                    stage="Semifinal"
                  />
                ))}
              </div>
            </div>

            {/* Final */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">Final</h3>
              <div className="max-w-md mx-auto">
                <MatchCard
                  team1={knockoutMatches.final.team1}
                  team2={knockoutMatches.final.team2}
                  winner={knockoutMatches.final.winner}
                  stage="Final"
                />
              </div>
            </div>

            {/* Group Winners */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white text-center drop-shadow-lg">Group A Winners</h3>
                <div className="grid grid-cols-2 gap-4">
                  {groupATeams.slice(0, 4).map((team, index) => (
                    <TeamCard key={index} team={team} group="A" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white text-center drop-shadow-lg">Group B Winners</h3>
                <div className="grid grid-cols-2 gap-4">
                  {groupBTeams.slice(0, 4).map((team, index) => (
                    <TeamCard key={index} team={team} group="B" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fixtures Tab */}
        {activeTab === 'fixtures' && (
          <div className="space-y-8">
            {/* Fixture Type Selection */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-xl rounded-lg p-1 shadow-2xl border border-white/20">
                <Button
                  variant={selectedFixtureTab === "upcoming" ? "default" : "ghost"}
                  onClick={() => setSelectedFixtureTab("upcoming")}
                  className={selectedFixtureTab === "upcoming" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  Upcoming Matches
                </Button>
                <Button
                  variant={selectedFixtureTab === "results" ? "default" : "ghost"}
                  onClick={() => setSelectedFixtureTab("results")}
                  className={selectedFixtureTab === "results" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  Past Results
                </Button>
              </div>
            </div>

            {/* Group Filter */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-xl rounded-lg p-1 shadow-2xl border border-white/20">
                <Button
                  variant={selectedGroup === "all" ? "default" : "ghost"}
                  onClick={() => setSelectedGroup("all")}
                  className={selectedGroup === "all" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  All Groups
                </Button>
                <Button
                  variant={selectedGroup === "A" ? "default" : "ghost"}
                  onClick={() => setSelectedGroup("A")}
                  className={selectedGroup === "A" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  Group A
                </Button>
                <Button
                  variant={selectedGroup === "B" ? "default" : "ghost"}
                  onClick={() => setSelectedGroup("B")}
                  className={selectedGroup === "B" ? "bg-blue-600/90 backdrop-blur-md text-white shadow-lg" : "text-white hover:bg-white/20 hover:text-white"}
                >
                  Group B
                </Button>
              </div>
            </div>

            {/* Upcoming Matches */}
            {selectedFixtureTab === "upcoming" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcoming.map((match) => (
                  <Card key={match.id} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <Badge variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                          {new Date(match.date).toLocaleDateString()}
                        </Badge>
                        <p className="text-sm text-white/80 mt-2">{match.time}</p>
                      </div>
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="font-semibold text-white drop-shadow-md">{match.team1}</p>
                        </div>
                        <div className="text-center text-sm text-white/80 font-medium">VS</div>
                        <div className="text-center">
                          <p className="font-semibold text-white drop-shadow-md">{match.team2}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/20 text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-white/80">
                          <MapPin className="w-4 h-4" />
                          {match.venue}
                        </div>
                        <Badge className="mt-2 bg-blue-600/90 backdrop-blur-md text-white">Group {match.group}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Past Results */}
            {selectedFixtureTab === "results" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((match) => (
                  <Card key={match.id} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <Badge variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                          {new Date(match.date).toLocaleDateString()}
                        </Badge>
                        <Badge className="mt-2 bg-blue-600/90 backdrop-blur-md text-white">Group {match.group}</Badge>
                      </div>
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="font-semibold text-white drop-shadow-md">{match.team1}</p>
                          <p className="text-3xl font-bold text-white drop-shadow-lg">{match.score1}</p>
                        </div>
                        <div className="text-center text-sm text-white/80 font-medium">VS</div>
                        <div className="text-center">
                          <p className="font-semibold text-white drop-shadow-md">{match.team2}</p>
                          <p className="text-3xl font-bold text-white drop-shadow-lg">{match.score2}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}


