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
import Link from "next/link"

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
                    <p className="text-white/90">prime5leaguerw@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-6 w-6 text-white" />
                  <div>
                    <p className="font-semibold text-white drop-shadow-md">Phone</p>
                    <p className="text-white/90">+250 788 829 084</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-6 w-6 text-white" />
                  <div>
                    <p className="font-semibold text-white drop-shadow-md">Address</p>
                    <p className="text-white/90">
                      Kigali, Rwanda
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-4 drop-shadow-lg">Follow Us</h3>
                <div className="flex justify-center space-x-4">
                  <Button 
                    asChild
                    variant="outline" 
                    size="sm" 
                    className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105"
                  >
                    <Link href="https://www.instagram.com/prime5ports/?hl=en" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Instagram
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    size="sm" 
                    className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105"
                  >
                    <Link href="#" className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      Twitter
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    size="sm" 
                    className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105"
                  >
                    <Link href="#" className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </Link>
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
