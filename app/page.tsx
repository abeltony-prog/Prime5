"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, Users, Star, ArrowRight, Play, Clock, MapPin, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CountdownTimer } from "@/components/countdown-timer"
import { Navigation } from "@/components/navigation"
import { useQuery } from '@apollo/client'
import { GET_MATCH_SCHEDULES, GET_TEAMS } from "@/lib/graphql/queries"

export default function HomePage() {
  const nextMatchDate = new Date("2024-02-15T19:00:00")

  // Fetch real match data from database
  const { data: matchesData, loading: matchesLoading, error: matchesError } = useQuery(GET_MATCH_SCHEDULES)
  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery(GET_TEAMS)

  const sponsors = [
    { name: "Plasera", logo: "/logo/plasera.png" },
    { name: "Zaria Coart", logo: "https://cdn.prod.website-files.com/682a572382c4d682bcc2fcfa/682a572382c4d682bcc2fd45_Logo.svg" },
    { name: "Planet Events", logo: "/logo/planetevents.png" },
    { name: "miniistry of sports", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTryrY6LNsvwa8EeKSOpVa8mWm4NuE48vW57g&s" },
  ]

  // Process completed matches from database
  const completedMatches = matchesData?.matches
    ?.filter((match: any) => match.status === 'completed')
    ?.slice(0, 6) // Show only the 6 most recent completed matches
    ?.map((match: any) => {
      const matchDate = new Date(match.dateAndtime)
      return {
        id: match.id,
        team1: match.Team1?.name || match.team1 || "Unknown Team",
        team2: match.Team2?.name || match.team2 || "Unknown Team",
        team1Logo: match.Team1?.logo || null,
        team2Logo: match.Team2?.logo || null,
        team1Score: match.team1Goals || 0,
        team2Score: match.team2Goals || 0,
        date: matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        venue: match.location || "Prime Arena",
        fullDate: matchDate
      }
    }) || []

  // Process upcoming matches from database
  const upcomingMatches = matchesData?.matches
    ?.filter((match: any) => {
      const matchDate = new Date(match.dateAndtime)
      const now = new Date()
      // Show matches that haven't happened yet (include matches happening today)
      // Consider match as passed only if it's more than 2 hours after the scheduled time
      const matchEndTime = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000) // Add 2 hours to match time
      return now < matchEndTime && match.status !== 'completed'
    })
    ?.sort((a: any, b: any) => new Date(a.dateAndtime).getTime() - new Date(b.dateAndtime).getTime())
    ?.slice(0, 4) // Show only the next 4 upcoming matches
    ?.map((match: any) => {
      const matchDate = new Date(match.dateAndtime)
      return {
        id: match.id,
        team1: match.Team1?.name || match.team1 || "Unknown Team",
        team2: match.Team2?.name || match.team2 || "Unknown Team",
        team1Logo: match.Team1?.logo || null,
        team2Logo: match.Team2?.logo || null,
        date: matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        venue: match.location || "Prime Arena",
        fullDate: matchDate
      }
    }) || []

  // Calculate real league statistics
  const calculateLeagueStats = () => {
    // Count all teams regardless of status
    const teams = teamsData?.Teams || []
    const totalTeams = teams.length

    // Count all matches that have happened (completed matches)
    const allMatches = matchesData?.matches || []
    const completedMatches = allMatches.filter((match: any) => match.status === 'completed')
    const totalMatches = completedMatches.length

    // Calculate total goals from completed matches
    const totalGoals = completedMatches.reduce((sum: number, match: any) => {
      const team1Goals = parseInt(match.team1Goals) || 0
      const team2Goals = parseInt(match.team2Goals) || 0
      return sum + team1Goals + team2Goals
    }, 0)

    // Estimate fans based on matches (assume average attendance)
    const fansPerMatch = 250 // Estimated average attendance
    const estimatedFans = totalMatches * fansPerMatch
    const fansDisplay = estimatedFans >= 1000 ? `${(estimatedFans / 1000).toFixed(1)}K+` : `${estimatedFans}+`

    return [
      { label: "Teams", value: totalTeams.toString(), icon: Users },
      { label: "Matches", value: totalMatches.toString(), icon: Calendar },
      { label: "Goals", value: totalGoals.toString(), icon: Trophy },
      { label: "Fans", value: fansDisplay, icon: Star },
    ]
  }

  const leagueStats = calculateLeagueStats()

  return (
    <div className="min-h-screen relative">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-lime-400/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-green-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-2xl mb-8 border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
              </span>
              <span className="text-sm font-bold tracking-wider text-lime-400 uppercase">Season 2025 • Registrations Open</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 leading-[0.9] tracking-tighter font-heading italic uppercase animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              Where <span className="text-lime-300">Legends</span> <br /> Are Born.
            </h1>

            <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              The premier futsal competition featuring the region's top teams competing for ultimate glory and a share of the <span className="text-white font-bold">$50,000</span> prize pool.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
              <Button asChild size="lg" className="h-16 px-10 bg-lime-300 hover:bg-lime-400 text-black font-black text-lg rounded-2xl shadow-[0_0_40px_rgba(190,242,100,0.3)] hover:scale-105 transition-all duration-300 uppercase">
                <Link href="/register">Register Your Team</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-16 px-10 border-white/10 text-white hover:bg-white/5 glass rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 uppercase"
              >
                <Link href="https://www.youtube.com/@Prime5League" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Play className="w-6 h-6 fill-current" />
                  Watch Highlights
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-6 h-10 rounded-full border-2 border-white flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-20 z-20">
        <div className="container mx-auto px-6">
          <div className="glass rounded-[2.5rem] p-8 shadow-2xl border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
            {leagueStats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center justify-center px-4 group">
                <div className="mb-4 p-3 bg-lime-400/10 rounded-2xl group-hover:scale-110 group-hover:bg-lime-400 group-hover:text-black transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-lime-400 transition-colors duration-300 group-hover:text-inherit" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-1 font-heading tracking-tight italic">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Match Countdown */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-[0.3em] mb-4">
              Next Match Day
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading italic uppercase tracking-tighter">
              Don't Miss <span className="text-lime-300">The Action</span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto uppercase font-bold tracking-widest">
              The next round of matches is approaching. Get your tickets now.
            </p>
          </div>
          <div className="glass-dark rounded-[3rem] p-12 border border-white/10 shadow-3xl">
            <CountdownTimer targetDate={new Date("2026-11-01T00:00:00")} />
          </div>
        </div>
      </section>      {/* Upcoming Matches */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-lime-400 font-black uppercase tracking-[0.3em] text-xs mb-4">Live & Upcoming</div>
              <h2 className="text-4xl md:text-6xl font-black text-white font-heading italic uppercase tracking-tighter">
                Coming Up <span className="text-lime-300">Games</span>
              </h2>
            </div>
            <Button asChild variant="outline" className="h-12 border-white/10 text-white hover:bg-white/5 glass rounded-xl font-bold uppercase tracking-wider">
              <Link href="/statistics">View All Fixtures</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {matchesLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-[400px] glass-dark rounded-[2.5rem] animate-pulse"></div>
              ))
            ) : matchesError ? (
              <div className="col-span-full text-center py-20 glass-dark rounded-[3rem]">
                <div className="text-white/50 mb-6 font-bold uppercase tracking-widest">Unable to load match data</div>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="border-lime-300/50 text-lime-300 hover:bg-lime-300 hover:text-black rounded-xl px-8"
                >
                  Try Again
                </Button>
              </div>
            ) : upcomingMatches.length === 0 ? (
              <div className="col-span-full text-center py-20 glass-dark rounded-[3rem]">
                <div className="text-white/50 mb-4 font-bold uppercase tracking-widest">No upcoming matches scheduled</div>
                <p className="text-white/30 text-sm uppercase tracking-tighter">Check back for upcoming fixtures!</p>
              </div>
            ) : (
              upcomingMatches.map((match: any, index: number) => (
                <div key={match.id || index} className="group relative glass-dark rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-lime-300/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(190,242,100,0.1)] hover:-translate-y-2">
                  <div className="p-8 pb-32">
                    {/* Compact Date/Time Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-lime-400" />
                        <span className="text-xs font-black text-white/70 uppercase tracking-tighter">{match.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-lime-400" />
                        <span className="text-xs font-black text-white/70 uppercase tracking-tighter">{match.time}</span>
                      </div>
                    </div>

                    {/* Matchup Layout */}
                    <div className="flex flex-col items-center gap-6 relative">
                      {/* Team 1 */}
                      <div className="flex flex-col items-center gap-3 transition-transform duration-500 group-hover:-translate-y-2">
                        <div className="w-20 h-20 relative">
                          <div className="absolute inset-0 bg-lime-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          {match.team1Logo ? (
                            <img src={match.team1Logo} alt={match.team1} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                          ) : (
                            <div className="w-full h-full glass rounded-2xl flex items-center justify-center relative z-10 border-white/10">
                              <span className="text-2xl font-black text-white">{match.team1.substring(0, 2).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-black text-white text-center uppercase tracking-tighter line-clamp-1">{match.team1}</span>
                      </div>

                      {/* VS Divider */}
                      <div className="relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-lime-300 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center relative z-10 shadow-xl group-hover:scale-110 transition-transform">
                          <span className="text-[10px] font-black text-lime-300">VS</span>
                        </div>
                      </div>

                      {/* Team 2 */}
                      <div className="flex flex-col items-center gap-3 transition-transform duration-500 group-hover:translate-y-2">
                        <div className="w-20 h-20 relative">
                          <div className="absolute inset-0 bg-lime-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          {match.team2Logo ? (
                            <img src={match.team2Logo} alt={match.team2} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                          ) : (
                            <div className="w-full h-full glass rounded-2xl flex items-center justify-center relative z-10 border-white/10">
                              <span className="text-2xl font-black text-white">{match.team2.substring(0, 2).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-black text-white text-center uppercase tracking-tighter line-clamp-1">{match.team2}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Ticket Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 glass border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-lime-400" />
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{match.venue}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-[0.2em] text-lime-300 hover:text-white hover:bg-white/5 rounded-lg px-3">
                        Tickets <ArrowRight className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Latest News */}
      {/* <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">Latest News</h2>
              <p className="text-lg text-white/90 drop-shadow-md">Stay updated with league developments</p>
            </div>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
              <Link href="/news">View All News</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Championship Race Heats Up",
                excerpt: "With only 4 matches remaining, three teams are still in contention for the title.",
                image: "/placeholder.svg?height=200&width=400&text=News+1",
                date: "Feb 10, 2024",
              },
              {
                title: "Player of the Month: Marcus Silva",
                excerpt: "Lightning United's striker has been in exceptional form this month.",
                image: "/placeholder.svg?height=200&width=400&text=News+2",
                date: "Feb 8, 2024",
              },
              {
                title: "New Stadium Opens Next Season",
                excerpt: "Prime5 League announces partnership for new 5,000-capacity venue.",
                image: "/placeholder.svg?height=200&width=400&text=News+3",
                date: "Feb 5, 2024",
              },
            ].map((article, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="text-sm text-white/70 mb-2">{article.date}</div>
                  <h3 className="text-xl font-semibold text-white mb-3 drop-shadow-md">{article.title}</h3>
                  <p className="text-white/90 mb-4">{article.excerpt}</p>
                  <Button variant="ghost" className="p-0 h-auto text-green-400 hover:text-green-300 hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-300">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}      {/* Sponsors */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            Global Partners
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-16 font-heading italic uppercase tracking-tighter">
            Supported By <span className="text-lime-300">The Best</span>
          </h2>
 
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="group relative">
                <div className="glass rounded-3xl p-8 h-32 flex items-center justify-center border border-white/5 hover:border-lime-300/20 hover:bg-white/5 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-lime-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img
                    src={sponsor.logo || "/placeholder.svg"}
                    alt={sponsor.name}
                    className="max-w-[140px] max-h-[60px] object-contain opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 relative z-10"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* CTA Section */}
      <section className="py-24 relative px-6">
        <div className="container mx-auto">
          <div className="relative glass-dark rounded-[3.5rem] p-12 md:p-24 overflow-hidden border border-white/10 shadow-3xl text-center">
            {/* Background Glows */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-lime-400/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-green-500/20 blur-[100px] rounded-full"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 font-heading italic uppercase tracking-tighter leading-tight">
                Ready to <span className="text-lime-300">Join The</span> <br /> Prime5 League?
              </h2>
              <p className="text-xl text-white/50 mb-12 uppercase font-bold tracking-widest max-w-xl mx-auto">
                Register your team today and compete against the best in the region for the ultimate prize.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg" className="h-16 px-12 bg-lime-300 hover:bg-lime-400 text-black font-black text-lg rounded-2xl shadow-[0_0_40px_rgba(190,242,100,0.2)] hover:scale-105 transition-all duration-300 uppercase">
                  <Link href="/register">Join the League</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-16 px-12 border-white/10 text-white hover:bg-white/5 glass rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 uppercase">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
