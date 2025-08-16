import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Handshake, Star, Users, Trophy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SponsorsPage() {
  const mainSponsors = [
    {
      name: "SportTech Solutions",
      logo: "/placeholder.svg?height=100&width=200&text=SportTech",
      tier: "Title Sponsor",
      description: "Leading sports technology company providing innovative solutions for modern athletics.",
    },
    {
      name: "FutsalGear Pro",
      logo: "/placeholder.svg?height=100&width=200&text=FutsalGear",
      tier: "Official Equipment Partner",
      description: "Premium futsal equipment and apparel for professional and amateur players.",
    },
  ]

  const partnerSponsors = [
    { name: "Prime Sports", logo: "/placeholder.svg?height=80&width=160&text=Prime+Sports" },
    { name: "Athletic Pro", logo: "/placeholder.svg?height=80&width=160&text=Athletic+Pro" },
    { name: "Energy Drink Co", logo: "/placeholder.svg?height=80&width=160&text=Energy+Drink" },
    { name: "Local Fitness", logo: "/placeholder.svg?height=80&width=160&text=Local+Fitness" },
    { name: "Sports Media", logo: "/placeholder.svg?height=80&width=160&text=Sports+Media" },
    { name: "Health Plus", logo: "/placeholder.svg?height=80&width=160&text=Health+Plus" },
  ]

  const sponsorshipTiers = [
    {
      tier: "Title Sponsor",
      price: "$10,000",
      benefits: [
        "League naming rights",
        "Logo on all jerseys",
        "Stadium naming rights",
        "VIP hospitality package",
        "Social media promotion",
        "Website homepage placement",
      ],
      icon: Trophy,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      tier: "Official Partner",
      price: "$5,000",
      benefits: [
        "Logo on team jerseys",
        "Stadium advertising boards",
        "Match day announcements",
        "Social media mentions",
        "Website partner page",
      ],
      icon: Handshake,
      color: "from-blue-600 to-blue-700",
    },
    {
      tier: "Supporting Partner",
      price: "$2,500",
      benefits: ["Logo on website", "Social media mentions", "Match day programs", "Networking opportunities"],
      icon: Users,
      color: "from-green-600 to-green-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Our Sponsors & Partners</h1>
          <p className="text-lg text-gray-600">Supporting excellence in futsal</p>
        </div>

        {/* Main Sponsors */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">Main Sponsors</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {mainSponsors.map((sponsor, index) => (
              <Card key={index} className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardTitle className="text-center">{sponsor.tier}</CardTitle>
                </CardHeader>
                <CardContent className="p-8 text-center">
                  <Image
                    src={sponsor.logo || "/placeholder.svg"}
                    alt={sponsor.name}
                    width={200}
                    height={100}
                    className="mx-auto mb-6"
                  />
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">{sponsor.name}</h3>
                  <p className="text-gray-600">{sponsor.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partner Sponsors */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">Partner Network</h2>
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                {partnerSponsors.map((sponsor, index) => (
                  <div key={index} className="text-center">
                    <Image
                      src={sponsor.logo || "/placeholder.svg"}
                      alt={sponsor.name}
                      width={160}
                      height={80}
                      className="mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sponsorship Opportunities */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Partnership Opportunities</h2>
            <p className="text-lg text-gray-600">Join us in promoting futsal excellence</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sponsorshipTiers.map((tier, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader className={`bg-gradient-to-r ${tier.color} text-white`}>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <tier.icon className="h-6 w-6" />
                    {tier.tier}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-900 mb-2">{tier.price}</div>
                    <p className="text-gray-600">per season</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Partner with Us?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join Prime5 League and reach thousands of passionate futsal fans
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent"
              >
                <Link href="/sponsorship-package.pdf">Download Package</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
