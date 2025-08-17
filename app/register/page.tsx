"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Navigation } from "@/components/navigation"
import { Users, CheckCircle, Upload } from "lucide-react"
import { useCreateManager } from "@/hooks/use-managers"
import { useCreateTeam } from "@/hooks/use-teams"
import { generatePassword, hashPassword } from "@/lib/utils/password"

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [managerData, setManagerData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    photo: null as File | null
  })
  const [teamData, setTeamData] = useState({
    name: "",
    shortname: "",
    location: "",
    logo: null as File | null
  })
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // GraphQL hooks
  const { createManager, loading: managerLoading, error: managerError } = useCreateManager()
  const { createTeam, loading: teamLoading, error: teamError } = useCreateTeam()

  const handleManagerChange = (field: string, value: string) => {
    setManagerData(prev => ({ ...prev, [field]: value }))
  }

  const handleTeamChange = (field: string, value: string) => {
    setTeamData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: 'photo' | 'logo', file: File | null) => {
    if (field === 'photo') {
      setManagerData(prev => ({ ...prev, photo: file }))
    } else {
      setTeamData(prev => ({ ...prev, logo: file }))
    }
  }

  const handleNextStep = () => {
    if (currentStep === 1 && managerData.name && managerData.email && managerData.phone) {
      setCurrentStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if terms are agreed to
    if (!agreedToTerms) {
      alert("Please agree to the Terms and Conditions before submitting.")
      return
    }
    
    try {
      // Generate and hash password
      const plainPassword = generatePassword()
      const hashedPassword = hashPassword(plainPassword)
      setGeneratedPassword(plainPassword)
      
      // Step 1: Create manager
      const managerResult = await createManager({
        variables: {
          manager: {
            name: managerData.name,
            email: managerData.email,
            phone: managerData.phone,
            gender: managerData.gender || null,
            photo: managerData.photo ? managerData.photo.name : null,
            password: hashedPassword,
            create_at: new Date().toISOString()
          }
        }
      })

            if (managerResult.data?.insert_managers?.returning?.[0]) {
        const managerId = managerResult.data.insert_managers.returning[0].id
        
        // Step 2: Create team with manager reference
        const teamResult = await createTeam({
          variables: {
            team: {
              name: teamData.name,
              shortname: teamData.shortname,
              location: teamData.location,
              team_manager: managerId,
              logo: teamData.logo ? teamData.logo.name : null
            }
          }
        })

        if (teamResult.data?.insert_Teams?.returning?.[0]) {
          console.log('Registration successful!')
          console.log('Manager ID:', managerId)
          console.log('Team ID:', teamResult.data.insert_Teams.returning[0].id)
          setIsSubmitted(true)
        } else {
          console.error('Failed to create team:', teamResult.errors)
        }
      } else {
        console.error('Failed to create manager:', managerResult.errors)
      }
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative">
        <Navigation />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-12">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-2xl">Registration Successful!</h1>
              <p className="text-lg text-white/90 mb-6 drop-shadow-xl">
                Thank you for registering your team with Prime5 League. We'll review your application and contact you
                within 48 hours.
              </p>
              
              {/* Generated Password Display */}
              {generatedPassword && (
                <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-yellow-200 mb-2 drop-shadow-md">Your Login Credentials</h3>
                  <p className="text-sm text-yellow-100 mb-3 drop-shadow-md">
                    Please save this password - it won't be shown again!
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-lg font-bold bg-white/20 backdrop-blur-sm px-3 py-2 rounded border border-white/30 text-white">
                      {generatedPassword}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(generatedPassword)}
                      className="border-yellow-300/50 text-yellow-200 hover:bg-yellow-500/20 bg-white/10 backdrop-blur-md"
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-yellow-100 mt-2 drop-shadow-md">
                    Email: {managerData.email}
                  </p>
                </div>
              )}
              
              <Button asChild className="bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <a href="/">Return to Home</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <Navigation />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">Team Registration</h1>
            <p className="text-lg text-white/90 drop-shadow-xl">Join Prime5 League and showcase your skills</p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-green-400' : 'text-white/60'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-green-400 bg-green-400/90 backdrop-blur-md text-white' : 'border-white/30 bg-white/10 backdrop-blur-sm'}`}>
                  1
                </div>
                <span className="ml-2 font-medium drop-shadow-md">Manager</span>
              </div>
              <div className="w-16 h-0.5 bg-white/30"></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-green-400' : 'text-white/60'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-green-400 bg-green-400/90 backdrop-blur-md text-white' : 'border-white/30 bg-white/10 backdrop-blur-sm'}`}>
                  2
                </div>
                <span className="ml-2 font-medium drop-shadow-md">Team</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Manager Information */}
            {currentStep === 1 && (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-yellow-500/90 backdrop-blur-md text-black">
                  <CardTitle>Manager Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="managerName" className="text-white drop-shadow-md">Manager Name *</Label>
                      <Input 
                        id="managerName" 
                        value={managerData.name}
                        onChange={(e) => handleManagerChange('name', e.target.value)}
                        required 
                        className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white drop-shadow-md">Email *</Label>
                      <Input 
                        type="email" 
                        id="email" 
                        value={managerData.email}
                        onChange={(e) => handleManagerChange('email', e.target.value)}
                        required 
                        className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70" 
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-white drop-shadow-md">Phone Number *</Label>
                      <Input 
                        type="tel" 
                        id="phone" 
                        value={managerData.phone}
                        onChange={(e) => handleManagerChange('phone', e.target.value)}
                        required 
                        className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender" className="text-white drop-shadow-md">Gender</Label>
                      <select 
                        id="gender" 
                        value={managerData.gender}
                        onChange={(e) => handleManagerChange('gender', e.target.value)}
                        className="mt-2 w-full px-3 py-2 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-white/20 backdrop-blur-sm text-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="photo" className="text-white drop-shadow-md">Manager Photo</Label>
                    <div className="mt-2 border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-green-400/50 transition-colors bg-white/10 backdrop-blur-sm">
                      <Upload className="h-8 w-8 text-white/70 mx-auto mb-2" />
                      <p className="text-sm text-white/90">Click to upload or drag and drop</p>
                      <p className="text-xs text-white/70 mt-1">PNG, JPG up to 2MB</p>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
                        className="hidden" 
                        id="photo" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Team Information */}
            {currentStep === 2 && (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-blue-600/90 backdrop-blur-md text-white">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="teamName" className="text-white drop-shadow-md">Team Name *</Label>
                      <Input 
                        id="teamName" 
                        value={teamData.name}
                        onChange={(e) => handleTeamChange('name', e.target.value)}
                        required 
                        className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="shortName" className="text-white drop-shadow-md">Short Name (3 letters) *</Label>
                      <Input 
                        id="shortName" 
                        maxLength={3} 
                        value={teamData.shortname}
                        onChange={(e) => handleTeamChange('shortname', e.target.value)}
                        required 
                        className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-white drop-shadow-md">Team Location *</Label>
                    <Input 
                      id="location" 
                      value={teamData.location}
                      onChange={(e) => handleTeamChange('location', e.target.value)}
                      required 
                      className="mt-2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70" 
                    />
                  </div>
                <div>
                  <Label htmlFor="logo" className="text-white drop-shadow-md">Team Logo</Label>
                  <div className="mt-2 border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-green-400/50 transition-colors bg-white/10 backdrop-blur-sm">
                    <Upload className="h-8 w-8 text-white/70 mx-auto mb-2" />
                    <p className="text-sm text-white/90">Click to upload or drag and drop</p>
                    <p className="text-xs text-white/70 mt-1">PNG, JPG up to 2MB</p>
                      <Input
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                        className="hidden" 
                        id="logo" 
                      />
                    </div>
                </div>
              </CardContent>
            </Card>
            )}





            {/* Error Display */}
            {(managerError || teamError) && (
              <Card className="border-red-500/30 bg-red-500/20 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6">
                  <div className="text-red-200">
                    <h3 className="font-semibold mb-2 drop-shadow-md">Registration Error:</h3>
                    {managerError && <p>Manager Error: {managerError.message}</p>}
                    {teamError && <p>Team Error: {teamError.message}</p>}
                </div>
              </CardContent>
            </Card>
            )}

            {/* Terms and Conditions */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    required 
                  />
                  <div className="text-sm">
                    <Label htmlFor="terms" className="cursor-pointer text-white/90 drop-shadow-md">
                      I agree to the{" "}
                      <a href="/terms" className="text-green-300 hover:text-green-200 hover:underline">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/rules" className="text-green-300 hover:text-green-200 hover:underline">
                        League Rules
                      </a>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              {currentStep === 1 ? (
                <div></div>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)}
                  className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md"
                >
                  ← Back to Manager
                </Button>
              )}
              
              {currentStep === 1 ? (
                <Button 
                  type="button" 
                  onClick={handleNextStep}
                  disabled={!managerData.name || !managerData.email || !managerData.phone}
                  className="bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Team Information →
                </Button>
              ) : (
                                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={teamLoading || managerLoading || !agreedToTerms}
                  className="bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 px-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {teamLoading || managerLoading ? 'Creating...' : 'Submit Registration'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
