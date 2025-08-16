"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Navigation } from "@/components/navigation"
import { Upload, Users, FileText, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [players, setPlayers] = useState(Array(10).fill(""))

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players]
    newPlayers[index] = value
    setPlayers(newPlayers)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center border-0 shadow-xl">
            <CardContent className="p-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-blue-900 mb-4">Registration Successful!</h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for registering your team with Prime5 League. We'll review your application and contact you
                within 48 hours.
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <a href="/">Return to Home</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Team Registration</h1>
            <p className="text-lg text-gray-600">Join Prime5 League and showcase your skills</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Team Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="teamName">Team Name *</Label>
                    <Input id="teamName" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="shortName">Short Name (3 letters) *</Label>
                    <Input id="shortName" maxLength={3} required className="mt-2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="logo">Team Logo</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                    <Input type="file" accept="image/*" className="hidden" id="logo" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manager Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-yellow-500 text-black">
                <CardTitle>Manager Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="managerName">Manager Name *</Label>
                    <Input id="managerName" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input type="email" id="email" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                    <Input type="tel" id="whatsapp" required className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Player List */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle>Player List (10 Players)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {players.map((player, index) => (
                    <div key={index}>
                      <Label htmlFor={`player${index + 1}`}>Player {index + 1} *</Label>
                      <Input
                        id={`player${index + 1}`}
                        value={player}
                        onChange={(e) => handlePlayerChange(index, e.target.value)}
                        required
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Proof */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-yellow-500 text-black">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Registration Fee: $200</h3>
                  <p className="text-sm text-blue-700">
                    Please transfer the registration fee to: <br />
                    Bank: Prime Bank <br />
                    Account: 1234567890 <br />
                    Name: Prime5 League
                  </p>
                </div>

                <div>
                  <Label htmlFor="payment">Upload Proof of Payment *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload payment receipt</p>
                    <Input type="file" accept="image/*,.pdf" required className="hidden" id="payment" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" required />
                  <div className="text-sm">
                    <Label htmlFor="terms" className="cursor-pointer">
                      I agree to the{" "}
                      <a href="/terms" className="text-blue-600 hover:underline">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/rules" className="text-blue-600 hover:underline">
                        League Rules
                      </a>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 px-12">
                Submit Registration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
