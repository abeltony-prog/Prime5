"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { Target, Users, Trophy, Heart, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for the highest standards in every aspect of our league operations.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building strong connections between players, teams, and fans across the region.",
    },
    {
      icon: Trophy,
      title: "Competition",
      description: "Providing a platform for fair, exciting, and competitive futsal matches.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Celebrating the love of futsal and the dedication of our players.",
    },
  ]

  return (
    <div className="min-h-screen relative">
      <Navigation />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-2xl">About Prime5 League</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-xl">
            Where passion meets the pavement. Prime5 League is more than just a futsal competition — it's the revival of street football culture, reimagined and brought to life in Kigali.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-2xl">Our Story</h2>
            <div className="space-y-4 text-white/90">
              <p>
                Born in 2024 from a love of the game, Prime5 League began on the streets, where football has always been about creativity, flair, and community. What started as small, gritty 5v5 matchups has grown into the region's premier futsal competition — a stage where raw street talent meets professional organization.
              </p>
              <p>
                The league has quickly become a launchpad for dreamers — players who once played barefoot on local courts now chase opportunities to represent their countries and even play professionally. Yet, at its core, Prime5 remains faithful to its roots: football for the people, football for the streets.
              </p>
              <p>
                Today, Prime5 League hosts 16 teams, divided across two groups, playing electrifying matches in facilities that bring street culture into the spotlight. Every game is more than competition — it's a showcase of skill, hustle, and passion that connects fans in the arena and thousands watching online.
              </p>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/streetfootballImage.jpg"
              alt="Street football culture - young players on dusty field"
              width={500}
              height={400}
              className="rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <CardHeader className="bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-md text-white">
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-white/90 text-lg leading-relaxed drop-shadow-md">
                To bring street football to life — providing a platform where talent is discovered, nurtured, and celebrated. Prime5 exists to build community, inspire the next generation, and prove that the streets produce stars.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <CardHeader className="bg-gradient-to-r from-yellow-500/90 to-yellow-600/90 backdrop-blur-md text-black">
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-white/90 text-lg leading-relaxed drop-shadow-md">
                To be the heartbeat of futsal in the region, blending professionalism with street culture. We aim to inspire a future where Prime5 League is not only the top futsal competition locally, but also a symbol of how grassroots football can transform lives and communities worldwide.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12 drop-shadow-2xl">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl text-center hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 drop-shadow-lg">{value.title}</h3>
                  <p className="text-white/90 drop-shadow-md">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-md text-white">
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="text-green-400 mb-4">
                    <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">Message Sent!</h3>
                  <p className="text-white/90 drop-shadow-md">Thank you for contacting us. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white drop-shadow-md">First Name *</Label>
                      <Input id="firstName" required className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white drop-shadow-md">Last Name *</Label>
                      <Input id="lastName" required className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white drop-shadow-md">Email *</Label>
                    <Input type="email" id="email" required className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70" />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-white drop-shadow-md">Subject *</Label>
                    <Input id="subject" required className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70" />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-white drop-shadow-md">Message *</Label>
                    <Textarea id="message" rows={5} required className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70" />
                  </div>
                  <Button type="submit" className="w-full bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-yellow-500/90 to-yellow-600/90 backdrop-blur-md text-black">
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-white" />
                  <div>
                    <p className="font-semibold text-white drop-shadow-md">Email</p>
                    <p className="text-white/90">info@prime5league.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-6 w-6 text-white" />
                  <div>
                    <p className="font-semibold text-white drop-shadow-md">Phone</p>
                    <p className="text-white/90">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-6 w-6 text-white" />
                  <div>
                    <p className="font-semibold text-white drop-shadow-md">Address</p>
                    <p className="text-white/90">
                      123 Sports Complex Drive
                      <br />
                      Prime City, PC 12345
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-4 drop-shadow-lg">Follow Us</h3>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                    Instagram
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                    Twitter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
