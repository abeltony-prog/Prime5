import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, Users, Star, ArrowRight, Play, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CountdownTimer } from "@/components/countdown-timer"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  const nextMatchDate = new Date("2024-02-15T19:00:00")

  const sponsors = [
    { name: "SportTech", logo: "/placeholder.svg?height=60&width=120&text=SportTech" },
    { name: "FutsalGear", logo: "/placeholder.svg?height=60&width=120&text=FutsalGear" },
    { name: "Prime Sports", logo: "/placeholder.svg?height=60&width=120&text=Prime+Sports" },
    { name: "Athletic Pro", logo: "/placeholder.svg?height=60&width=120&text=Athletic+Pro" },
  ]

  const upcomingMatches = [
    {
      team1: "Thunder FC",
      team2: "Lightning United",
      team1Logo: "/placeholder.svg?height=60&width=60&text=TFC",
      team2Logo: "/placeholder.svg?height=60&width=60&text=LU",
      date: "Feb 15",
      time: "19:00",
      venue: "Prime Arena",
    },
    {
      team1: "Storm Riders",
      team2: "Velocity FC",
      team1Logo: "/placeholder.svg?height=60&width=60&text=SR",
      team2Logo: "/placeholder.svg?height=60&width=60&text=VFC",
      date: "Feb 16",
      time: "20:00",
      venue: "Sports Complex",
    },
    {
      team1: "Rapid Fire",
      team2: "Blaze FC",
      team1Logo: "/placeholder.svg?height=60&width=60&text=RF",
      team2Logo: "/placeholder.svg?height=60&width=60&text=BFC",
      date: "Feb 17",
      time: "18:30",
      venue: "Elite Stadium",
    },
  ]

  const leagueStats = [
    { label: "Teams", value: "16", icon: Users },
    { label: "Matches", value: "48", icon: Calendar },
    { label: "Goals", value: "156", icon: Trophy },
    { label: "Fans", value: "10K+", icon: Star },
  ]

  return (
    <div className="min-h-screen relative">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center" style={{
        backgroundImage: 'url(/mainbg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-2xl">
            <Badge className="bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold mb-6">
              Season 2024 • Now Live
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">Prime5 League</h1>

            <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed drop-shadow-xl">
              The premier futsal competition featuring the region's top teams competing for ultimate glory.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <Link href="/register">Register Your Team</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/fixtures" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Highlights
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {leagueStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-3 mx-auto border border-white/30 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
                <div className="text-4xl font-bold text-white mb-1 drop-shadow-lg">{stat.value}</div>
                <div className="text-sm text-white/90 font-medium drop-shadow-md">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Match Countdown */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="bg-red-100/90 backdrop-blur-sm text-red-800 px-4 py-2 rounded-full font-semibold mb-4 border border-red-200/50">Next Match Day</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Don't Miss the Action</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
              The next round of matches is approaching. Get your tickets now.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                  <div className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">00</div>
                  <div className="text-sm text-white/90 font-medium uppercase tracking-wider">days</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                  <div className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">00</div>
                  <div className="text-sm text-white/90 font-medium uppercase tracking-wider">hours</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                  <div className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">00</div>
                  <div className="text-sm text-white/90 font-medium uppercase tracking-wider">minutes</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                  <div className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">00</div>
                  <div className="text-sm text-white/90 font-medium uppercase tracking-wider">seconds</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">Upcoming Matches</h2>
              <p className="text-lg text-white/90 drop-shadow-md">This week's fixtures</p>
            </div>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
              <Link href="/fixtures">View All Fixtures</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingMatches.map((match, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Badge variant="outline" className="text-xs bg-white/20 backdrop-blur-sm border-white/30 text-white">
                      {match.date}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-white/90">
                      <Clock className="w-4 h-4" />
                      {match.time}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Team 1 */}
                    <div className="flex items-center gap-3">
                      <Image
                        src={match.team1Logo || "/placeholder.svg"}
                        alt={match.team1}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span className="font-semibold text-white drop-shadow-md">{match.team1}</span>
                    </div>

                    <div className="text-center text-sm text-white/80 font-medium">VS</div>

                    {/* Team 2 */}
                    <div className="flex items-center gap-3">
                      <Image
                        src={match.team2Logo || "/placeholder.svg"}
                        alt={match.team2}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span className="font-semibold text-white drop-shadow-md">{match.team2}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-white/80">
                        <MapPin className="w-4 h-4" />
                        {match.venue}
                      </div>
                      <Button size="sm" className="bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 border border-green-500/30 shadow-lg">
                        Tickets
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 relative">
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
      </section>

      {/* Sponsors */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Our Partners</h2>
            <p className="text-lg text-white/90 drop-shadow-md">Proudly supported by leading brands</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-lg p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border border-white/20">
                  <Image
                    src={sponsor.logo || "/placeholder.svg"}
                    alt={sponsor.name}
                    width={120}
                    height={60}
                    className="mx-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-green-600/20 backdrop-blur-xl rounded-2xl p-12 border border-green-500/20 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Ready to Join Prime5 League?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
              Register your team today and compete against the best in the region.
            </p>
            <Button asChild size="lg" className="bg-yellow-500/90 backdrop-blur-md hover:bg-yellow-600/90 text-black font-semibold px-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-yellow-400/30">
              <Link href="/register">Register Your Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
