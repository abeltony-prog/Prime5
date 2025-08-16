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
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 to-green-800/95"></div>
        <div className="relative">
          <Image
            src="/mainbg.jpg"
            alt="Prime5 League Futsal Background"
            width={1920}
            height={800}
            className="w-full h-[800px] object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-transparent"></div>
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <Badge className="bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold mb-6">
                Season 2024 • Now Live
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">Prime5 League</h1>

              <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
                The premier futsal competition featuring the region's top teams competing for ultimate glory.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8">
                  <Link href="/register">Register Your Team</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-green-900 bg-transparent"
                >
                  <Link href="/fixtures" className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Watch Highlights
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {leagueStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3 mx-auto">
                  <stat.icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Match Countdown */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold mb-4">Next Match Day</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Don't Miss the Action</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The next round of matches is approaching. Get your tickets now.
            </p>
          </div>
          <CountdownTimer targetDate={nextMatchDate} />
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Upcoming Matches</h2>
              <p className="text-lg text-gray-600">This week's fixtures</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/fixtures">View All Fixtures</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingMatches.map((match, index) => (
              <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Badge variant="outline" className="text-xs">
                      {match.date}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
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
                      <span className="font-semibold text-gray-900">{match.team1}</span>
                    </div>

                    <div className="text-center text-sm text-gray-500 font-medium">VS</div>

                    {/* Team 2 */}
                    <div className="flex items-center gap-3">
                      <Image
                        src={match.team2Logo || "/placeholder.svg"}
                        alt={match.team2}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span className="font-semibold text-gray-900">{match.team2}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {match.venue}
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Latest News</h2>
              <p className="text-lg text-gray-600">Stay updated with league developments</p>
            </div>
            <Button asChild variant="outline">
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
                className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{article.date}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <Button variant="ghost" className="p-0 h-auto text-green-600 hover:text-green-700">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Partners</h2>
            <p className="text-lg text-gray-600">Proudly supported by leading brands</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
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
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Join Prime5 League?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Register your team today and compete against the best in the region.
          </p>
          <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8">
            <Link href="/register">Register Your Team</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
