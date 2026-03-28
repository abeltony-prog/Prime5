"use client"

import { useState } from "react"
import { useQuery, useMutation } from '@apollo/client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Briefcase, MapPin, Clock, Users, DollarSign, Calendar, Send, CheckCircle, Target, Zap, Shield, Sparkles } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { toast } from "sonner"
import { GET_ALL_JOBS } from "@/lib/graphql/queries"
import { CREATE_APPLICATION } from "@/lib/graphql/mutations"

interface JobOpening {
  id: string
  title: string
  location: string
  experience: string
  amount: string
  description: string
  Requirements: string | string[]
  Benefits: string | string[]
  created_at: string
}



export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null)
  const [applicationForm, setApplicationForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    coverLetter: "",
    resume: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // GraphQL queries and mutations
  const { data: jobsData, loading: jobsLoading, error: jobsError } = useQuery(GET_ALL_JOBS)
  const [createApplication] = useMutation(CREATE_APPLICATION)

  const jobOpenings: JobOpening[] = jobsData?.jobs || []

  const handleInputChange = (field: string, value: string) => {
    setApplicationForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setApplicationForm(prev => ({
      ...prev,
      resume: file
    }))
  }

  const handleSubmitApplication = async () => {
    if (!selectedJob) return

    // Validate form
    if (!applicationForm.fullName || !applicationForm.email || !applicationForm.phone || !applicationForm.coverLetter) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      let fileUrl = null
      
      // Handle file upload
      if (applicationForm.resume) {
        const file = applicationForm.resume
        const fileName = `${Date.now()}_${file.name}`
        
        // For now, we'll store the file as base64 in the database
        // In production, you'd upload to a file storage service
        const reader = new FileReader()
        const fileData = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        
        fileUrl = `data:${file.type};base64,${fileData.split(',')[1]}`
      }

      const applicationData = {
        name: applicationForm.fullName,
        email: applicationForm.email,
        phone: applicationForm.phone,
        years: applicationForm.experience,
        cover_letter: applicationForm.coverLetter,
        file: fileUrl,
        job_id: selectedJob.id
      }

      await createApplication({
        variables: { application: applicationData }
      })

      toast.success("Application submitted successfully! We'll get back to you soon.")
      setApplicationForm({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        coverLetter: "",
        resume: null
      })
      setSelectedJob(null)
    } catch (error) {
      toast.error("Failed to submit application. Please try again.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <div className="min-h-screen bg-transparent font-['Outfit'] overflow-x-hidden">
      <Navigation />

      {/* Cinematic Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Tactical Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-lime-400/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-lime-400/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Target className="w-4 h-4 text-lime-400" />
            <span className="text-lime-300 font-black italic uppercase tracking-widest text-[10px]">Active Recruitment Protocol</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 leading-[0.8] animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            Join the <br />
            <span className="text-lime-300">Elite Squad.</span>
          </h1>

          <p className="text-xl text-white/40 uppercase font-bold tracking-widest max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
            Help us build the most elite futsal ecosystem in the universe. 
            The revolution starts with your talent.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button 
              size="lg" 
              className="bg-lime-300 hover:bg-lime-400 text-black font-black italic uppercase tracking-tighter px-10 h-16 text-lg shadow-[0_0_20px_rgba(190,242,100,0.3)] hover:scale-105 transition-all duration-300 rounded-none group"
              onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Initialize Deployment
              <Briefcase className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="border-white/10 hover:bg-white/5 text-white font-black italic uppercase tracking-tighter px-10 h-16 text-lg rounded-none group"
              onClick={() => {
                const subject = encodeURIComponent('General Application - Prime5 League');
                const body = encodeURIComponent(`Dear Prime5 League Team,

I am interested in joining your team and would like to submit my resume for consideration.

Best regards,`);
                window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=prime5leaguerw@gmail.com&su=${subject}&body=${body}`, '_blank');
              }}
            >
              Submit Protocol
              <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#061B14] to-transparent" />
      </section>

      {/* Job Openings Section */}
      <section id="openings" className="py-24 bg-[#061B14]/80 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-3xl">
              <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-6">
                Active <br />
                <span className="text-lime-300">Missions.</span>
              </h2>
              <p className="text-xl text-white/40 uppercase font-bold tracking-widest leading-relaxed">
                Analyze our current personnel needs and choose your deployment point. 
                We are building the future of African Sports.
              </p>
            </div>
            <div className="flex items-center gap-4 text-lime-300/60 font-black italic uppercase tracking-wider text-sm border-b border-lime-300/20 pb-2">
              <Zap className="w-4 h-4" />
              <span>Real-time Vacancy Updates</span>
            </div>
          </div>

          {jobsLoading ? (
            <div className="text-center py-20 glass-dark rounded-[2rem] border border-white/5">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
              <p className="text-white/40 font-black italic uppercase tracking-widest text-xs">Accessing Job Database...</p>
            </div>
          ) : jobsError ? (
            <div className="text-center py-20 glass-dark rounded-[2rem] border border-red-500/20">
              <p className="text-red-400 font-black italic uppercase tracking-widest">Database Sync Failure</p>
            </div>
          ) : jobOpenings.length === 0 ? (
            <div className="text-center py-20 glass-dark rounded-[2rem] border border-white/5">
              <Briefcase className="h-16 w-16 text-white/10 mx-auto mb-6" />
              <h3 className="text-2xl font-black italic uppercase text-white mb-2">No Active Missions</h3>
              <p className="text-white/40 uppercase font-bold tracking-widest text-sm">Stand by for new deployment orders.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {jobOpenings.map((job, i) => (
                <Card 
                  key={job.id} 
                  className="group relative glass-dark rounded-none p-0 border border-white/5 hover:border-lime-300/30 transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <Badge className="bg-lime-400/10 text-lime-400 border-lime-400/20 px-3 py-1 font-black uppercase tracking-widest text-[8px]">
                        Active
                      </Badge>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                        ID: {job.id.slice(0, 8)}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2 group-hover:text-lime-300 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-8 border-l-2 border-lime-300/30 pl-4">
                      {job.location}
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                        <DollarSign className="h-3 w-3 mr-3 text-lime-400" />
                        {job.amount}
                      </div>
                      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                        <Clock className="h-3 w-3 mr-3 text-lime-400" />
                        {job.experience}
                      </div>
                    </div>

                    <p className="text-white/40 text-xs font-bold leading-relaxed mb-8 line-clamp-3">
                      {job.description}
                    </p>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-transparent hover:bg-lime-300 text-white hover:text-black border border-white/10 hover:border-lime-300 font-black italic uppercase tracking-widest text-xs h-12 transition-all duration-300"
                          onClick={() => setSelectedJob(job)}
                        >
                          Initiate Application
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-dark border-lime-400/20 text-white rounded-none p-0">
                        <div className="relative">
                          {/* Modal Header */}
                          <div className="bg-lime-300 p-12 text-black">
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-2">{job.title}</h2>
                            <div className="flex flex-wrap items-center gap-6 mt-6">
                              <div className="flex items-center bg-black/10 px-4 py-2 rounded-full border border-black/5 hover:bg-black/20 transition-colors">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span className="font-black italic uppercase tracking-widest text-[10px]">{job.location}</span>
                              </div>
                              <div className="flex items-center bg-black/10 px-4 py-2 rounded-full border border-black/5 hover:bg-black/20 transition-colors">
                                <DollarSign className="w-4 h-4 mr-2" />
                                <span className="font-black italic uppercase tracking-widest text-[10px]">{job.amount}</span>
                              </div>
                              <div className="flex items-center bg-black/10 px-4 py-2 rounded-full border border-black/5 hover:bg-black/20 transition-colors">
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="font-black italic uppercase tracking-widest text-[10px]">{job.experience}</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-12">
                            <div className="grid gap-12 lg:grid-cols-2">
                              {/* Left Column: Job Info */}
                              <div className="space-y-12">
                                <div>
                                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-lime-400 mb-6 flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    Mission Objective
                                  </h3>
                                  <p className="text-white/70 font-bold leading-relaxed">{job.description}</p>
                                </div>

                                <div>
                                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-lime-400 mb-6 flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    Personnel Requirements
                                  </h3>
                                  <div className="space-y-4">
                                    {Array.isArray(job.Requirements) ? (
                                      job.Requirements.map((req, index) => (
                                        <div key={index} className="flex items-start gap-4 group">
                                          <div className="mt-1.5 w-1.5 h-1.5 bg-lime-400 rounded-full group-hover:scale-150 transition-transform" />
                                          <p className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{req}</p>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm font-bold text-white/60 whitespace-pre-line leading-relaxed">{job.Requirements}</p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-lime-400 mb-6 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Deployment Perks
                                  </h3>
                                  <div className="space-y-4">
                                    {Array.isArray(job.Benefits) ? (
                                      job.Benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-start gap-4 group">
                                          <div className="mt-1.5 w-1.5 h-1.5 bg-lime-400 rounded-full group-hover:scale-150 transition-transform" />
                                          <p className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{benefit}</p>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm font-bold text-white/60 whitespace-pre-line leading-relaxed">{job.Benefits}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right Column: Form */}
                              <div className="glass-dark border border-white/5 p-10 rounded-none h-fit sticky top-6">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-8">Initiate Protocol</h3>
                                
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 gap-6">
                                    <div className="relative group">
                                      <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-lime-400 transition-colors">Personnel Name</Label>
                                      <Input
                                        id="fullName"
                                        value={applicationForm.fullName}
                                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                                        className="bg-white/5 border-white/10 rounded-none h-12 text-white font-bold focus:border-lime-400/50 transition-all"
                                        placeholder="Full Name"
                                      />
                                    </div>
                                    <div className="relative group">
                                      <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-lime-400 transition-colors">Comm-Link (Email)</Label>
                                      <Input
                                        id="email"
                                        type="email"
                                        value={applicationForm.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="bg-white/5 border-white/10 rounded-none h-12 text-white font-bold focus:border-lime-400/50 transition-all"
                                        placeholder="Email Address"
                                      />
                                    </div>
                                  </div>

                                  <div className="relative group">
                                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-lime-400 transition-colors">Direct Sequence (Phone)</Label>
                                    <Input
                                      id="phone"
                                      value={applicationForm.phone}
                                      onChange={(e) => handleInputChange("phone", e.target.value)}
                                      className="bg-white/5 border-white/10 rounded-none h-12 text-white font-bold focus:border-lime-400/50 transition-all"
                                      placeholder="+250 XXX XXX XXX"
                                    />
                                  </div>

                                  <div className="relative group">
                                    <Label htmlFor="experience" className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-lime-400 transition-colors">Field Experience</Label>
                                    <Select onValueChange={(value) => handleInputChange("experience", value)}>
                                      <SelectTrigger className="bg-white/5 border-white/10 rounded-none h-12 text-white font-bold focus:border-lime-400/50">
                                        <SelectValue placeholder="Select level" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#1a3a2a] border-white/10 text-white rounded-none">
                                        <SelectItem value="0-1">0-1 Years</SelectItem>
                                        <SelectItem value="1-3">1-3 Years</SelectItem>
                                        <SelectItem value="3-5">3-5 Years</SelectItem>
                                        <SelectItem value="5+">5+ Years</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="relative group">
                                    <Label htmlFor="resume" className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-lime-400 transition-colors">Personnel Dossier (Resume)</Label>
                                    <Input
                                      id="resume"
                                      type="file"
                                      accept=".pdf,.doc,.docx"
                                      onChange={handleFileChange}
                                      className="bg-white/5 border-white/10 rounded-none h-auto py-2 text-white font-bold focus:border-lime-400/50 file:bg-lime-300 file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:mr-4 file:px-4 cursor-pointer"
                                    />
                                  </div>

                                  <div className="relative group">
                                    <Label htmlFor="coverLetter" className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-lime-400 transition-colors">Mission Briefing (Cover Letter)</Label>
                                    <Textarea
                                      id="coverLetter"
                                      value={applicationForm.coverLetter}
                                      onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                                      rows={4}
                                      className="bg-white/5 border-white/10 rounded-none text-white font-bold focus:border-lime-400/50 transition-all"
                                      placeholder="Why you? Why now?"
                                    />
                                  </div>

                                  <Button 
                                    onClick={handleSubmitApplication}
                                    disabled={isSubmitting}
                                    className="w-full bg-lime-300 hover:bg-lime-400 text-black font-black italic uppercase tracking-widest h-14 transition-all duration-300 shadow-[0_4px_20px_rgba(190,242,100,0.2)] disabled:opacity-50"
                                  >
                                    {isSubmitting ? (
                                      <span className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-3"></div>
                                        Transmitting...
                                      </span>
                                    ) : (
                                      <span className="flex items-center">
                                        <Send className="mr-3 h-4 w-4" />
                                        Confirm Deployment
                                      </span>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-8">
              Core <br />
              <span className="text-lime-300">Directives.</span>
            </h2>
            <p className="text-xl text-white/40 uppercase font-bold tracking-widest max-w-3xl mx-auto">
              We aren't just building a league; we're building a legacy. 
              Here is what fuels our mission.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { 
                icon: <Users className="h-8 w-8" />, 
                title: "Squad Synergy", 
                desc: "Work with elite professionals who share a high-performance mindset.",
                color: "lime"
              },
              { 
                icon: <Briefcase className="h-8 w-8" />, 
                title: "Career Evolution", 
                desc: "Advance through professional development and industry networking.",
                color: "emerald"
              },
              { 
                icon: <Target className="h-8 w-8" />, 
                title: "Impact Protocol", 
                desc: "Every move you make directly influences the growth of African sports.",
                color: "lime"
              }
            ].map((directive, i) => (
              <div 
                key={i} 
                className="group p-10 glass-dark border border-white/5 hover:border-lime-300/30 transition-all duration-500 rounded-none relative overflow-hidden text-center"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  {directive.icon}
                </div>
                <div className={`w-16 h-16 ${directive.color === 'lime' ? 'bg-lime-400/10 text-lime-400' : 'bg-emerald-400/10 text-emerald-400'} rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  {directive.icon}
                </div>
                <h3 className="text-2xl font-black italic uppercase text-white mb-6 tracking-tight">{directive.title}</h3>
                <p className="text-white/40 uppercase font-bold tracking-widest text-[10px] leading-loose">
                  {directive.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 bg-lime-300 relative overflow-hidden group">
        <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 pointer-events-none opacity-5" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-black mb-8 leading-none">
            Join the <br />
            Revolution.
          </h2>
          <p className="text-xl text-black/60 font-black italic uppercase tracking-widest mb-12 max-w-2xl mx-auto">
            Ready to deploy your talents? Start your application protocol now.
          </p>
          <Button 
            size="lg" 
            className="bg-black text-lime-300 hover:bg-zinc-900 font-black italic uppercase tracking-widest px-12 h-16 text-lg rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:scale-105 transition-all duration-300"
            onClick={() => {
              const subject = encodeURIComponent('General Application - Prime5 League');
              const body = encodeURIComponent(`Dear Prime5 League Team,

I am interested in joining your team and would like to submit my resume for consideration.`);
              window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=prime5leaguerw@gmail.com&su=${subject}&body=${body}`, '_blank');
            }}
          >
            Launch Sequence
          </Button>
        </div>
      </section>
    </div>
  )
}
