"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Navigation } from "@/components/navigation"
import { Users, CheckCircle, Upload, Shield } from "lucide-react"
import { useCreateManager } from "@/hooks/use-managers"
import { useCreateTeam } from "@/hooks/use-teams"
import { generatePassword, hashPassword } from "@/lib/utils/password"
import Image from "next/image"

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
      alert("Please authorize the Deployment Terms before submitting.")
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
      <div className="min-h-screen font-['Outfit'] overflow-x-hidden relative bg-transparent">
        
        <div className="relative z-20">
          <Navigation />
        </div>
        
        {/* Tactical Overlays */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-lime-400/10 rounded-full blur-[120px] animate-pulse" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-32 flex justify-center">
          <Card className="max-w-2xl w-full text-center glass-dark border-white/10 shadow-[0_20px_50px_rgba(190,242,100,0.05)] rounded-none">
            <CardContent className="p-16">
              <div className="w-24 h-24 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-lime-400/20">
                <CheckCircle className="h-12 w-12 text-lime-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-6">
                Transmission <span className="text-lime-300">Confirmed.</span>
              </h1>
              <p className="text-lg text-white/60 font-bold mb-10 leading-relaxed">
                Your squad protocol has been recorded. Our operatives will review your application and establish the comm-link within 48 hours.
              </p>
              
              {/* Generated Password Display */}
              {generatedPassword && (
                <div className="bg-lime-400/5 border border-lime-400/20 p-8 mb-10 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-lime-300" />
                    <h3 className="font-black italic uppercase tracking-widest text-lime-300 text-sm">Clearance Credentials</h3>
                  </div>
                  <p className="text-sm text-white/50 font-bold mb-6">
                    WARNING: Save this authorization key. It cannot be recovered once this channel closes.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="bg-black/40 px-6 py-4 border border-white/5 flex-grow">
                      <span className="font-mono text-2xl font-bold tracking-widest text-white">
                        {generatedPassword}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(generatedPassword)}
                      className="border-lime-400/30 text-lime-300 hover:bg-lime-400 hover:text-black hover:border-lime-400 h-16 rounded-none font-black italic uppercase tracking-widest px-8 transition-all"
                    >
                      Copy Key
                    </Button>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-[10px] text-white/40 font-black tracking-widest uppercase">
                      Target Comm-Link: <span className="text-white/80 text-sm ml-2">{managerData.email}</span>
                    </p>
                  </div>
                </div>
              )}
              
              <Button asChild className="w-full sm:w-auto bg-lime-300 hover:bg-lime-400 text-black h-16 px-12 font-black italic uppercase tracking-widest text-lg rounded-none transition-all shadow-[0_10px_30px_rgba(190,242,100,0.1)] hover:scale-105">
                <a href="/">Return To Base</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent font-['Outfit'] overflow-x-hidden relative pb-32">
      <div className="relative z-20">
        <Navigation />
      </div>

      {/* Tactical Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-lime-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-3/4 -right-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-24 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-lime-400/20 mb-6 bg-black/50 backdrop-blur-sm">
              <span className="text-lime-300 font-black italic uppercase tracking-widest text-[10px]">Enrollment Protocol</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-6 leading-none drop-shadow-2xl">
              Enter <br/>
              <span className="text-lime-300">The Arena.</span>
            </h1>
            <p className="text-lg text-white/80 font-bold uppercase tracking-widest max-w-xl mx-auto drop-shadow-md">
              Initialize your team and manager identity to compete in Prime5.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            
            {/* Step Indicator */}
            <div className="flex justify-center mb-8 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-0.5 bg-white/10 z-0"></div>
              <div className="flex items-center justify-between w-64 relative z-10">
                <div className="flex flex-col items-center gap-4 cursor-pointer" onClick={() => setCurrentStep(1)}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black italic text-xl transition-all duration-500 border ${currentStep === 1 ? 'bg-lime-400 text-black border-lime-400 shadow-[0_0_30px_rgba(190,242,100,0.3)] scale-110' : 'bg-[#061B14] text-white/40 border-white/10 hover:border-lime-300/30'}`}>
                    01
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentStep === 1 ? 'text-lime-300' : 'text-white/40'}`}>Manager</span>
                </div>
                <div className="flex flex-col items-center gap-4 cursor-pointer" onClick={() => { if(managerData.name && managerData.email && managerData.phone) setCurrentStep(2) }}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black italic text-xl transition-all duration-500 border ${currentStep === 2 ? 'bg-lime-400 text-black border-lime-400 shadow-[0_0_30px_rgba(190,242,100,0.3)] scale-110' : 'bg-[#061B14] text-white/40 border-white/10 hover:border-lime-300/30'}`}>
                    02
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentStep === 2 ? 'text-lime-300' : 'text-white/40'}`}>Squad</span>
                </div>
              </div>
            </div>

            {/* Step 1: Manager Information */}
            {currentStep === 1 && (
              <Card className="glass-dark border-white/10 shadow-2xl rounded-none bg-black/40 backdrop-blur-xl">
                <CardHeader className="bg-white/5 p-8 border-b border-white/5">
                  <CardTitle className="text-3xl font-black italic uppercase tracking-tight text-white flex items-center gap-4">
                    <Users className="w-8 h-8 text-lime-400" />
                    Manager Initialization
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 md:p-12 space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4 group">
                      <Label htmlFor="managerName" className="text-xs font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Manager Name *</Label>
                      <Input 
                        id="managerName" 
                        value={managerData.name}
                        onChange={(e) => handleManagerChange('name', e.target.value)}
                        required 
                        className="bg-white/5 border-white/10 rounded-none h-16 text-white text-lg font-bold focus:border-lime-400/50 transition-colors" 
                      />
                    </div>
                    <div className="space-y-4 group">
                      <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Comm-Link (Email) *</Label>
                      <Input 
                        type="email" 
                        id="email" 
                        value={managerData.email}
                        onChange={(e) => handleManagerChange('email', e.target.value)}
                        required 
                        className="bg-white/5 border-white/10 rounded-none h-16 text-white text-lg font-bold focus:border-lime-400/50 transition-colors" 
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4 group">
                      <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Direct Line (Phone) *</Label>
                      <Input 
                        type="tel" 
                        id="phone" 
                        value={managerData.phone}
                        onChange={(e) => handleManagerChange('phone', e.target.value)}
                        required 
                        className="bg-white/5 border-white/10 rounded-none h-16 text-white text-lg font-bold focus:border-lime-400/50 transition-colors" 
                      />
                    </div>
                    <div className="space-y-4 group">
                      <Label htmlFor="gender" className="text-xs font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Ident (Gender)</Label>
                      <select 
                        id="gender" 
                        value={managerData.gender}
                        onChange={(e) => handleManagerChange('gender', e.target.value)}
                        className="w-full px-4 h-16 border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-lime-400/50 focus:border-lime-400/50 bg-white/5 text-white text-lg font-bold transition-colors appearance-none"
                      >
                        <option value="" className="bg-[#061B14] text-white/40">Select Ident</option>
                        <option value="male" className="bg-[#061B14] text-white">Male</option>
                        <option value="female" className="bg-[#061B14] text-white">Female</option>
                        <option value="other" className="bg-[#061B14] text-white">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4 group">
                    <Label htmlFor="photo" className="text-xs font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Visual ID (Photo)</Label>
                    <div className="border border-dashed border-white/20 hover:border-lime-400/50 bg-white/5 rounded-none p-12 text-center transition-all group-hover:bg-lime-400/5 flex flex-col items-center justify-center cursor-pointer" onClick={() => document.getElementById('photo')?.click()}>
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-lime-400/10 transition-colors">
                        <Upload className="h-8 w-8 text-white/40 group-hover:text-lime-300 transition-colors" />
                      </div>
                      <p className="text-white text-lg font-bold mb-3">{managerData.photo ? managerData.photo.name : 'Target file to deploy'}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">PNG, JPG up to 2MB</p>
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
            <Card className="glass-dark border-white/10 shadow-2xl rounded-none bg-black/40 backdrop-blur-xl animate-in fade-in slide-in-from-right-8 duration-500">
              <CardHeader className="bg-lime-400/10 p-8 border-b border-lime-400/20">
                <CardTitle className="text-3xl font-black italic uppercase tracking-tight text-white flex items-center gap-4">
                  <Shield className="w-8 h-8 text-lime-400" />
                  Squad Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 md:p-12 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4 group">
                    <Label htmlFor="teamName" className="text-xs font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Squad Designation (Name) *</Label>
                    <Input 
                      id="teamName" 
                      value={teamData.name}
                      onChange={(e) => handleTeamChange('name', e.target.value)}
                      required 
                      className="bg-white/5 border-white/10 rounded-none h-16 text-white text-lg font-bold focus:border-lime-400/50 transition-colors" 
                    />
                  </div>
                  <div className="space-y-4 group">
                    <Label htmlFor="shortName" className="text-xs font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Callsign (3 Letters) *</Label>
                    <Input 
                      id="shortName" 
                      maxLength={3} 
                      value={teamData.shortname}
                      onChange={(e) => handleTeamChange('shortname', e.target.value.toUpperCase())}
                      required 
                      className="bg-white/5 border-white/10 rounded-none h-16 text-white text-lg font-bold focus:border-lime-400/50 transition-colors uppercase tracking-widest" 
                    />
                  </div>
                </div>
                <div className="space-y-4 group">
                  <Label htmlFor="location" className="text-xs font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Sector / Location *</Label>
                  <Input 
                    id="location" 
                    value={teamData.location}
                    onChange={(e) => handleTeamChange('location', e.target.value)}
                    required 
                    className="bg-white/5 border-white/10 rounded-none h-16 text-white text-lg font-bold focus:border-lime-400/50 transition-colors" 
                  />
                </div>
                <div className="space-y-4 group">
                  <Label htmlFor="logo" className="text-xs font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">Crest / Insignia (Logo)</Label>
                  <div className="border border-dashed border-white/20 hover:border-lime-400/50 bg-white/5 rounded-none p-12 text-center transition-all group-hover:bg-lime-400/5 flex flex-col items-center justify-center cursor-pointer" onClick={() => document.getElementById('logo')?.click()}>
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-lime-400/10 transition-colors">
                      <Upload className="h-8 w-8 text-white/40 group-hover:text-lime-300 transition-colors" />
                    </div>
                    <p className="text-white text-lg font-bold mb-3">{teamData.logo ? teamData.logo.name : 'Target crest to deploy'}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">PNG, JPG up to 2MB</p>
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
              <div className="bg-red-500/10 border border-red-500/30 p-8 flex items-start gap-4 animate-in fade-in zoom-in duration-300 bg-black/40 backdrop-blur-md">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <span className="text-red-400 font-bold text-xl">!</span>
                </div>
                <div>
                  <h3 className="text-red-400 font-black italic uppercase tracking-widest mb-2 text-lg">System Error</h3>
                  {managerError && <p className="text-red-200/80 font-bold mb-1">Manager Protocol: {managerError.message}</p>}
                  {teamError && <p className="text-red-200/80 font-bold">Team Protocol: {teamError.message}</p>}
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="glass-dark border border-white/5 p-8 flex flex-col lg:flex-row items-center justify-between gap-8 h-auto lg:h-32 bg-black/40 backdrop-blur-xl">
              <div className="flex items-start space-x-6">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  required 
                  className="mt-1 w-6 h-6 border-white/30 data-[state=checked]:bg-lime-400 data-[state=checked]:border-lime-400 data-[state=checked]:text-black"
                />
                <Label htmlFor="terms" className="cursor-pointer text-white/60 font-bold text-lg leading-relaxed">
                  I confirm authorization of the{" "}
                  <a href="/terms" className="text-lime-300 hover:text-white underline underline-offset-4 decoration-lime-300/30 transition-colors">
                    Deployment Terms
                  </a>{" "}
                  and{" "}
                  <a href="/rules" className="text-lime-300 hover:text-white underline underline-offset-4 decoration-lime-300/30 transition-colors">
                    Arena Regulations
                  </a>
                </Label>
              </div>

              {/* Navigation Buttons inline at desktop */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 w-full lg:w-auto shrink-0">
                {currentStep === 2 && (
                  <Button 
                    type="button" 
                    onClick={() => setCurrentStep(1)}
                    className="h-16 px-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black italic uppercase tracking-widest text-lg rounded-none transition-colors"
                  >
                    Back
                  </Button>
                )}
                
                {currentStep === 1 ? (
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    disabled={!managerData.name || !managerData.email || !managerData.phone}
                    className="h-16 px-16 bg-lime-300 hover:bg-lime-400 text-black font-black italic uppercase tracking-widest text-lg rounded-none transition-all shadow-[0_10px_30px_rgba(190,242,100,0.1)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                  >
                    Proceed →
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={teamLoading || managerLoading || !agreedToTerms}
                    className="h-16 px-16 bg-lime-300 hover:bg-lime-400 text-black font-black italic uppercase tracking-widest text-lg rounded-none transition-all shadow-[0_10px_30px_rgba(190,242,100,0.1)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                  >
                    {teamLoading || managerLoading ? 'Processing...' : 'Deploy Squad'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
