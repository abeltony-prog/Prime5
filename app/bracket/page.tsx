"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Trophy, Users } from "lucide-react"

export default function BracketPage() {
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
    <Card className={`border-2 ${winner !== "TBD" ? "border-green-500 bg-green-50" : "border-gray-300"} shadow-lg`}>
      <CardContent className="p-4">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="mb-2">
            {stage}
          </Badge>
          <div className="space-y-1">
            <p className={`font-semibold ${winner === team1 ? "text-green-600" : "text-blue-900"}`}>{team1}</p>
            <p className="text-gray-500 text-sm">VS</p>
            <p className={`font-semibold ${winner === team2 ? "text-green-600" : "text-blue-900"}`}>{team2}</p>
          </div>
          {winner !== "TBD" && <Badge className="bg-green-500 text-white mt-2">Winner: {winner}</Badge>}
        </div>
      </CardContent>
    </Card>
  )

  const TeamCard = ({ team, group }: { team: { name: string; position: number }; group: string }) => (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-4 text-center">
        <Badge variant="outline" className="mb-2">
          #{team.position}
        </Badge>
        <p className="font-semibold text-blue-900">{team.name}</p>
        <p className="text-sm text-gray-600">Group {group}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Tournament Bracket</h1>
          <p className="text-lg text-gray-600">Knockout stage progression</p>
        </div>

        {/* Group Stage Qualifiers */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Group A Qualifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {groupATeams.map((team, index) => (
                  <TeamCard key={index} team={team} group="A" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Group B Qualifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {groupBTeams.map((team, index) => (
                  <TeamCard key={index} team={team} group="B" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Knockout Bracket */}
        <div className="space-y-12">
          {/* Quarterfinals */}
          <div>
            <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">Quarterfinals</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {knockoutMatches.quarterfinals.map((match, index) => (
                <MatchCard key={index} team1={match.team1} team2={match.team2} winner={match.winner} stage="QF" />
              ))}
            </div>
          </div>

          {/* Semifinals */}
          <div>
            <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">Semifinals</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {knockoutMatches.semifinals.map((match, index) => (
                <MatchCard key={index} team1={match.team1} team2={match.team2} winner={match.winner} stage="SF" />
              ))}
            </div>
          </div>

          {/* Final */}
          <div>
            <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">Final</h2>
            <div className="max-w-sm mx-auto">
              <MatchCard
                team1={knockoutMatches.final.team1}
                team2={knockoutMatches.final.team2}
                winner={knockoutMatches.final.winner}
                stage="FINAL"
              />
            </div>
          </div>

          {/* Champion */}
          <div className="text-center">
            <Card className="max-w-md mx-auto border-4 border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Trophy className="h-6 w-6" />
                  Prime5 League Champion
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-blue-900 mb-2">TBD</h3>
                <p className="text-lg text-gray-600">Tournament in Progress</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tournament Progress */}
        <div className="mt-12">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="text-center">Tournament Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Group Stage</h3>
                  <Badge className="bg-green-500 text-white">Completed</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Quarterfinals</h3>
                  <Badge className="bg-yellow-500 text-black">In Progress</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Final</h3>
                  <Badge variant="outline">Upcoming</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
