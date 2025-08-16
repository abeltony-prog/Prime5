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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">About Prime5 League</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Where passion meets competition. Prime5 League is the premier futsal competition bringing together the best
            teams and players in the region.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Founded in 2020, Prime5 League emerged from a simple vision: to create the most competitive and
                professionally organized futsal league in the region. What started as a small tournament between local
                teams has grown into a premier sporting event that attracts the best talent from across the area.
              </p>
              <p>
                Our league has become a launching pad for many players who have gone on to represent their countries and
                play professionally. We take pride in maintaining the highest standards of competition while fostering a
                community spirit that makes futsal accessible to everyone.
              </p>
              <p>
                Today, Prime5 League features 16 teams competing across two groups, with matches played in
                state-of-the-art facilities and broadcast to thousands of fans online and in person.
              </p>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=400&width=500&text=League+History"
              alt="Prime5 League History"
              width={500}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                To provide a world-class futsal competition that develops talent, builds community, and promotes the
                beautiful game of futsal. We are committed to creating opportunities for players of all levels to
                compete, improve, and achieve their dreams.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black">
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                To be recognized as the premier futsal league in the region, known for our professionalism, competitive
                excellence, and positive impact on the community. We envision a future where Prime5 League serves as a
                model for futsal development worldwide.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <value.icon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="text-green-600 mb-4">
                    <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for contacting us. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" required className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" required className="mt-2" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input type="email" id="email" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" rows={5} required className="mt-2" />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black">
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Email</p>
                    <p className="text-gray-600">info@prime5league.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Phone</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Address</p>
                    <p className="text-gray-600">
                      123 Sports Complex Drive
                      <br />
                      Prime City, PC 12345
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Follow Us</h3>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm">
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    Instagram
                  </Button>
                  <Button variant="outline" size="sm">
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
