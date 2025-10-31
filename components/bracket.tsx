'use client'

import { Trophy } from "lucide-react"

interface Team {
  name: string
  flag: string
  code: string
  logo?: string | null
  points?: number
}

interface Match {
  id: string
  team1: Team
  team2: Team
  winner?: Team
  date: string
  venue: string
  round: string
  team1Score?: number
  team2Score?: number
}



// TeamCard Component
function TeamCard({ team, isWinner = false }: { team: Team; isWinner?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 border ${
        isWinner
          ? "bg-white text-emerald-800 font-semibold border-emerald-300 shadow-md"
          : "bg-white/90 hover:bg-white text-slate-700 border-slate-200 hover:shadow-sm"
      }`}
    >
      {team.logo ? (
        <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-slate-300 shadow-md flex-shrink-0">
          <img
            src={team.logo}
            alt={`${team.name} Logo`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <span className="text-xl">{team.flag}</span>
      )}
      <span className="text-sm font-medium">{team.name}</span>
      {team.points && (
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full ml-auto">
          {team.points} pts
        </span>
      )}
    </div>
  )
}

// MatchCard Component
function MatchCard({ match }: { match: Match }) {
  // Safety check for undefined match
  if (!match) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
        <p className="text-white/70">Match TBD</p>
      </div>
    )
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-emerald-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
            {match.round}
          </span>
          <span className="text-xs text-slate-500 font-medium">{match.date}</span>
        </div>

        <div className="space-y-2">
          <TeamCard team={match.team1} isWinner={match.winner?.code === match.team1.code} />
          <TeamCard team={match.team2} isWinner={match.winner?.code === match.team2.code} />
        </div>

        {match.team1Score !== undefined && match.team2Score !== undefined && (
          <div className="text-center text-sm font-bold text-slate-700 bg-slate-50 py-2 px-3 rounded">
            {match.team1Score} - {match.team2Score}
          </div>
        )}

        <div className="text-xs text-slate-500 text-center font-medium bg-slate-50 py-1 px-2 rounded">
          📍 {match.venue}
        </div>
      </div>
    </div>
  )
}

interface BracketProps {
  knockoutMatches: {
    quarterfinals: Array<{
      team1: string
      team2: string
      winner: string
      team1Score: number
      team2Score: number
      date: string
    }>
    semifinals: Array<{
      team1: string
      team2: string
      winner: string
      team1Score: number
      team2Score: number
      date: string
    }>
    final: {
      team1: string
      team2: string
      winner: string
      team1Score: number
      team2Score: number
      date: string
    } | null
  }
  groupATeams: Array<{
    name: string
    points: number
    goalDifference: number
    goalsFor: number
  }>
  groupBTeams: Array<{
    name: string
    points: number
    goalDifference: number
    goalsFor: number
  }>
  activeSeason: any
}

export const Bracket = ({ knockoutMatches, groupATeams, groupBTeams, activeSeason }: BracketProps) => {
  // Convert real data to match format
  const convertToMatch = (match: any, round: string): Match => {
    return {
      id: `${round}-${match.team1}-${match.team2}`,
      team1: { name: match.team1, flag: "⚽", code: match.team1.substring(0, 3).toUpperCase(), points: 0 },
      team2: { name: match.team2, flag: "⚽", code: match.team2.substring(0, 3).toUpperCase(), points: 0 },
      winner: match.winner && match.winner !== "TBD" ? 
        { name: match.winner, flag: "⚽", code: match.winner.substring(0, 3).toUpperCase(), points: 0 } : undefined,
      date: match.date,
      venue: "Prime Arena",
      round: round,
      team1Score: match.team1Score,
      team2Score: match.team2Score,
    }
  }

  // Convert knockout matches to proper format
  const quarterFinals = knockoutMatches.quarterfinals.map(match => convertToMatch(match, "Quarter Final"))
  const semiFinals = knockoutMatches.semifinals.map(match => convertToMatch(match, "Semi Final"))
  const final = knockoutMatches.final ? convertToMatch(knockoutMatches.final, "Final") : null

  // Convert group teams to proper format
  const groupATeamsFormatted = groupATeams.map((team, index) => ({
    name: team.name,
    flag: "⚽",
    logo: (team as any).logo || null,
    code: team.name.substring(0, 3).toUpperCase(),
    points: team.points,
    position: index + 1
  }))

  const groupBTeamsFormatted = groupBTeams.map((team, index) => ({
    name: team.name,
    flag: "⚽",
    logo: (team as any).logo || null,
    code: team.name.substring(0, 3).toUpperCase(),
    points: team.points,
    position: index + 1
  }))

  // If no active season, show empty state
  if (!activeSeason) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="h-8 w-8 text-yellow-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">No Active Season</h3>
        <p className="text-white/80 text-lg mb-6">
          There is currently no active season. The playoff bracket will be available once a season is active.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1400px] mx-auto">
        {/* Tournament Bracket Layout */}
        <div className="grid grid-cols-7 gap-6 items-center relative">
          {/* Group A - Left Side */}
          <div className="space-y-6">
            <h3 className="text-center font-bold text-white text-lg mb-6 drop-shadow">Group A</h3>
            {groupATeamsFormatted.map((team: any, index: number) => (
              <div key={team.code} className="relative">
                <div className="bg-white/95 backdrop-blur-sm border border-emerald-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold text-sm">{index + 1}</span>
                    </div>
                    {team.logo ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-slate-300 shadow-md flex-shrink-0">
                        <img
                          src={team.logo}
                          alt={`${team.name} Logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-xl">{team.flag}</span>
                    )}
                    <span className="text-sm font-medium text-slate-700">{team.name}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full ml-auto">
                      {team.points} pts
                    </span>
                  </div>
                </div>
                {/* Connection line to quarterfinals */}
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-white/30 transform -translate-y-1/2"></div>
              </div>
            ))}
          </div>

          {/* Quarter Finals - Left Side */}
          <div className="space-y-12">
            <h3 className="text-center font-bold text-white text-lg mb-6 drop-shadow">Quarter Finals</h3>
            {quarterFinals.slice(0, 2).map((match) => (
              <div key={match.id} className="relative">
                <MatchCard match={match} />
                {/* Connection line to semifinals */}
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-white/30 transform -translate-y-1/2"></div>
              </div>
            ))}
          </div>

          {/* Semi Finals - Left Side */}
          <div className="space-y-24">
            <h3 className="text-center font-bold text-white text-lg mb-6 drop-shadow">Semi Finals</h3>
            <div className="relative">
              {semiFinals[0] ? (
                <MatchCard match={semiFinals[0]} />
              ) : (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                  <p className="text-white/70">Semi Final 1 - TBD</p>
                </div>
              )}
              {/* Connection line to final */}
              <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-white/30 transform -translate-y-1/2"></div>
            </div>
          </div>

          {/* Final */}
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">FINAL</h2>
            {final && (
              <div className="relative">
                <MatchCard match={final} />
                {final.winner && (
                  <div className="mt-6 text-center">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 text-lg font-bold px-6 py-3 rounded-full shadow-lg border-2 border-yellow-300">
                      🏆 {final.winner.flag} {final.winner.name} - Champions!
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Semi Finals - Right Side */}
          <div className="space-y-24">
            <h3 className="text-center font-bold text-white text-lg mb-6 drop-shadow">Semi Finals</h3>
            <div className="relative">
              {semiFinals[1] ? (
                <MatchCard match={semiFinals[1]} />
              ) : (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                  <p className="text-white/70">Semi Final 2 - TBD</p>
                </div>
              )}
              {/* Connection line to final */}
              <div className="hidden lg:block absolute top-1/2 -left-3 w-6 h-0.5 bg-white/30 transform -translate-y-1/2"></div>
            </div>
          </div>

          {/* Quarter Finals - Right Side */}
          <div className="space-y-12">
            <h3 className="text-center font-bold text-white text-lg mb-6 drop-shadow">Quarter Finals</h3>
            {quarterFinals.slice(2, 4).map((match) => (
              <div key={match.id} className="relative">
                <MatchCard match={match} />
                {/* Connection line to semifinals */}
                <div className="hidden lg:block absolute top-1/2 -left-3 w-6 h-0.5 bg-white/30 transform -translate-y-1/2"></div>
              </div>
            ))}
          </div>

          {/* Group B - Right Side */}
          <div className="space-y-6">
            <h3 className="text-center font-bold text-white text-lg mb-6 drop-shadow">Group B</h3>
            {groupBTeamsFormatted.map((team: any, index: number) => (
              <div key={team.code} className="relative">
                <div className="bg-white/95 backdrop-blur-sm border border-emerald-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-sm">{index + 1}</span>
                    </div>
                    {team.logo ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-slate-300 shadow-md flex-shrink-0">
                        <img
                          src={team.logo}
                          alt={`${team.name} Logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-xl">{team.flag}</span>
                    )}
                    <span className="text-sm font-medium text-slate-700">{team.name}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full ml-auto">
                      {team.points} pts
                    </span>
                  </div>
                </div>
                {/* Connection line to quarterfinals */}
                <div className="hidden lg:block absolute top-1/2 -left-3 w-6 h-0.5 bg-white/30 transform -translate-y-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Show message if no knockout matches are scheduled yet */}
      {quarterFinals.length === 0 && semiFinals.length === 0 && !final && (
        <div className="mt-8 text-center">
          <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-200 mb-2">Knockout Matches Not Yet Scheduled</h4>
            <p className="text-blue-200/80">
              The knockout stage matches will be scheduled after the group stage is completed. 
              Check back once the season begins and group matches are played.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
