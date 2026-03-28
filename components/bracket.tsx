'use client'

import { Trophy, Calendar, MapPin } from "lucide-react"

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
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 border ${
        isWinner
          ? "bg-lime-300 text-black font-black shadow-[0_0_20px_rgba(190,242,100,0.3)] border-lime-300"
          : "glass-dark text-white/70 border-white/10 hover:border-white/20"
      }`}
    >
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
        {team.logo ? (
          <img
            src={team.logo}
            alt={`${team.name} Logo`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[10px] font-black uppercase">{team.name.substring(0, 2)}</span>
        )}
      </div>
      <span className="text-[11px] font-black uppercase tracking-tight truncate flex-1">{team.name}</span>
      {team.points !== undefined && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isWinner ? "bg-black/10" : "bg-white/5"}`}>
          {team.points} pts
        </span>
      )}
    </div>
  )
}

// MatchCard Component
function MatchCard({ match }: { match: Match }) {
  if (!match) {
    return (
      <div className="glass-dark rounded-2xl p-6 text-center border border-white/5 opacity-50">
        <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">Match TBD</p>
      </div>
    )
  }

  return (
    <div className="glass-dark border border-white/10 rounded-[2rem] p-5 shadow-2xl hover:border-lime-300/30 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
        <Trophy size={40} />
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between gap-4">
          <span className="bg-lime-400/10 text-lime-400 text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md border border-lime-400/20">
            {match.round}
          </span>
          <div className="flex items-center gap-1.5 text-white/30 text-[9px] font-black uppercase tracking-widest">
             <Calendar size={10} className="text-lime-300" />
             {match.date}
          </div>
        </div>

        <div className="space-y-2">
          <TeamCard team={match.team1} isWinner={match.winner?.code === match.team1.code} />
          <TeamCard team={match.team2} isWinner={match.winner?.code === match.team2.code} />
        </div>

        {match.team1Score !== undefined && match.team2Score !== undefined && (
          <div className="flex items-center justify-center gap-4 py-2 px-4 bg-white/5 rounded-xl border border-white/10">
            <span className={`text-xl font-black font-heading italic ${match.team1Score > match.team2Score ? "text-lime-300" : "text-white/40"}`}>{match.team1Score}</span>
            <span className="text-white/10 font-black">:</span>
            <span className={`text-xl font-black font-heading italic ${match.team2Score > match.team1Score ? "text-lime-300" : "text-white/40"}`}>{match.team2Score}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 text-white/20 text-[8px] font-black uppercase tracking-[0.2em]">
          <MapPin size={10} className="text-lime-300/50" />
          {match.venue}
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
      venue?: string
    }>
    semifinals: Array<{
      team1: string
      team2: string
      winner: string
      team1Score: number
      team2Score: number
      date: string
      venue?: string
    }>
    final: {
      team1: string
      team2: string
      winner: string
      team1Score: number
      team2Score: number
      date: string
      venue?: string
    } | null
  }
  groupATeams: Array<{
    name: string
    points: number
    goalDifference: number
    goalsFor: number
    logo?: string | null
  }>
  groupBTeams: Array<{
    name: string
    points: number
    goalDifference: number
    goalsFor: number
    logo?: string | null
  }>
  activeSeason: any
}

export const Bracket = ({ knockoutMatches, groupATeams, groupBTeams, activeSeason }: BracketProps) => {
  const convertToMatch = (match: any, round: string): Match => {
    return {
      id: `${round}-${match.team1}-${match.team2}`,
      team1: { name: match.team1, flag: "⚽", code: match.team1.substring(0, 3).toUpperCase(), points: 0 },
      team2: { name: match.team2, flag: "⚽", code: match.team2.substring(0, 3).toUpperCase(), points: 0 },
      winner: match.winner && match.winner !== "TBD" ? 
        { name: match.winner, flag: "⚽", code: match.winner.substring(0, 3).toUpperCase(), points: 0 } : undefined,
      date: match.date,
      venue: match.venue || "Prime Arena",
      round: round,
      team1Score: match.team1Score,
      team2Score: match.team2Score,
    }
  }

  const quarterFinals = knockoutMatches.quarterfinals.map(match => convertToMatch(match, "Quarter Final"))
  const semiFinals = knockoutMatches.semifinals.map(match => convertToMatch(match, "Semi Final"))
  const final = knockoutMatches.final ? convertToMatch(knockoutMatches.final, "Final") : null

  const groupATeamsFormatted = groupATeams.map((team, index) => ({
    name: team.name,
    flag: "⚽",
    logo: team.logo || null,
    code: team.name.substring(0, 3).toUpperCase(),
    points: team.points,
    position: index + 1
  }))

  const groupBTeamsFormatted = groupBTeams.map((team, index) => ({
    name: team.name,
    flag: "⚽",
    logo: team.logo || null,
    code: team.name.substring(0, 3).toUpperCase(),
    points: team.points,
    position: index + 1
  }))

  if (!activeSeason) {
    return (
      <div className="glass-dark border border-white/10 shadow-3xl rounded-[3rem] p-16 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-lime-400/5 blur-[60px] rounded-full"></div>
        <div className="w-20 h-20 bg-lime-400/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-lime-400/20">
          <Trophy className="h-10 w-10 text-lime-400" />
        </div>
        <h3 className="text-3xl font-black text-white mb-6 font-heading italic uppercase tracking-tighter">No Active Season</h3>
        <p className="text-white/40 text-sm font-black uppercase tracking-widest max-w-sm mx-auto">
          Playoff brackets will be available once the season starts and knockout stages are determined.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <div className="min-w-[1400px] mx-auto py-12 px-8">
        <div className="grid grid-cols-7 gap-12 items-center relative">
          {/* Group A */}
          <div className="space-y-8">
            <h3 className="text-center font-black text-white/30 text-[10px] uppercase tracking-[0.4em] mb-8">Group A Leaders</h3>
            {groupATeamsFormatted.map((team, index) => (
              <div key={team.code} className="relative group">
                <div className="glass-dark border border-white/10 rounded-2xl p-4 hover:border-lime-300/30 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-lime-400/10 flex items-center justify-center border border-lime-400/20">
                      <span className="text-lime-400 font-black text-[10px] italic">{index + 1}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-black uppercase text-white/20">{team.name.substring(0, 2)}</span>
                      )}
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-tight">{team.name}</span>
                  </div>
                </div>
                <div className="hidden lg:block absolute top-1/2 -right-6 w-6 h-px bg-white/10 group-hover:bg-lime-300/30 transition-colors"></div>
              </div>
            ))}
          </div>

          {/* Quarter Finals Left */}
          <div className="space-y-24">
            <h3 className="text-center font-black text-white/30 text-[10px] uppercase tracking-[0.4em] mb-8">Quarter Finals</h3>
            {quarterFinals.slice(0, 2).map((match) => (
              <div key={match.id} className="relative group">
                <MatchCard match={match} />
                <div className="hidden lg:block absolute top-1/2 -right-6 w-6 h-px bg-white/10 group-hover:bg-lime-300/30 transition-colors"></div>
              </div>
            ))}
          </div>

          {/* Semi Finals Left */}
          <div className="space-y-32">
            <h3 className="text-center font-black text-white/30 text-[10px] uppercase tracking-[0.4em] mb-8">Semi Finals</h3>
            <div className="relative group">
              {semiFinals[0] ? <MatchCard match={semiFinals[0]} /> : (
                <div className="glass-dark border border-white/5 rounded-2xl p-8 text-center opacity-30">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">Semi Final 1</p>
                </div>
              )}
              <div className="hidden lg:block absolute top-1/2 -right-6 w-6 h-px bg-white/10 group-hover:bg-lime-300/30 transition-colors"></div>
            </div>
          </div>

          {/* GRAND FINAL */}
          <div className="flex flex-col items-center">
            <div className="mb-8 p-4 bg-lime-400/5 rounded-full border border-lime-400/10 animate-pulse">
               <Trophy className="h-12 w-12 text-lime-300" />
            </div>
            <h2 className="text-6xl font-black text-white mb-8 font-heading italic uppercase tracking-tighter">FINAL</h2>
            {final && (
              <div className="relative w-full max-w-sm">
                <MatchCard match={final} />
                {final.winner && (
                  <div className="mt-12 text-center animate-in zoom-in duration-1000">
                    <div className="bg-lime-300 text-black text-sm font-black px-10 py-5 rounded-[2rem] shadow-[0_0_50px_rgba(190,242,100,0.5)] border-4 border-white/20 uppercase tracking-widest italic scale-110">
                      🏆 {final.winner.name} - Champions
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Semi Finals Right */}
          <div className="space-y-32">
            <h3 className="text-center font-black text-white/30 text-[10px] uppercase tracking-[0.4em] mb-8">Semi Finals</h3>
            <div className="relative group">
              {semiFinals[1] ? <MatchCard match={semiFinals[1]} /> : (
                <div className="glass-dark border border-white/5 rounded-2xl p-8 text-center opacity-30">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">Semi Final 2</p>
                </div>
              )}
              <div className="hidden lg:block absolute top-1/2 -left-6 w-6 h-px bg-white/10 group-hover:bg-lime-300/30 transition-colors"></div>
            </div>
          </div>

          {/* Quarter Finals Right */}
          <div className="space-y-24">
            <h3 className="text-center font-black text-white/30 text-[10px] uppercase tracking-[0.4em] mb-8">Quarter Finals</h3>
            {quarterFinals.slice(2, 4).map((match) => (
              <div key={match.id} className="relative group">
                <MatchCard match={match} />
                <div className="hidden lg:block absolute top-1/2 -left-6 w-6 h-px bg-white/10 group-hover:bg-lime-300/30 transition-colors"></div>
              </div>
            ))}
          </div>

          {/* Group B */}
          <div className="space-y-8">
            <h3 className="text-center font-black text-white/30 text-[10px] uppercase tracking-[0.4em] mb-8">Group B Leaders</h3>
            {groupBTeamsFormatted.map((team, index) => (
              <div key={team.code} className="relative group">
                <div className="glass-dark border border-white/10 rounded-2xl p-4 hover:border-lime-300/30 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-400/10 flex items-center justify-center border border-blue-400/20">
                      <span className="text-blue-400 font-black text-[10px] italic">{index + 1}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-black uppercase text-white/20">{team.name.substring(0, 2)}</span>
                      )}
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-tight">{team.name}</span>
                  </div>
                </div>
                <div className="hidden lg:block absolute top-1/2 -left-6 w-6 h-px bg-white/10 group-hover:bg-lime-300/30 transition-colors"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
