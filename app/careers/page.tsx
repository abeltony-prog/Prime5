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
import { Briefcase, MapPin, Clock, Users, DollarSign, Calendar, Send, CheckCircle } from "lucide-react"
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
    <div className="min-h-screen relative">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center" style={{
        backgroundImage: 'url(/mainbg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
            Join Our Team
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-xl">
            Be part of the premier futsal league in the region. Help us grow the sport and create amazing experiences for players and fans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Briefcase className="mr-2 h-5 w-5" />
              View Open Positions
            </Button>
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Current Openings</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover exciting career opportunities with Prime5 League. We're looking for passionate individuals to join our growing team.
            </p>
          </div>

          {jobsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading job openings...</p>
            </div>
          ) : jobsError ? (
            <div className="text-center py-12">
              <p className="text-red-600">Failed to load job openings. Please try again later.</p>
            </div>
          ) : jobOpenings.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No job openings at the moment</h3>
              <p className="text-slate-600">Check back later for new opportunities!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobOpenings.map((job) => (
                <Card key={job.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-green-100 text-green-800">
                        Available
                      </Badge>
                      <span className="text-sm text-slate-500">
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-xl text-slate-900 group-hover:text-green-600 transition-colors">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {job.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {job.amount}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {job.experience}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {job.description}
                    </p>
                    <div className="pt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => setSelectedJob(job)}
                          >
                            Apply Now
                          </Button>
                        </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
                          <DialogDescription>
                            {job.location}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Job Details */}
                          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2 text-slate-600" />
                              <span className="text-sm font-medium">{job.amount}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-slate-600" />
                              <span className="text-sm font-medium">{job.experience}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-slate-600" />
                              <span className="text-sm font-medium">{job.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-slate-600" />
                              <span className="text-sm font-medium">Posted {new Date(job.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Job Description */}
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Job Description</h3>
                            <p className="text-slate-700">{job.description}</p>
                          </div>

                          {/* Requirements */}
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                            <div className="text-slate-700">
                              {Array.isArray(job.Requirements) ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {job.Requirements.map((req, index) => (
                                    <li key={index} className="text-sm">{req}</li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="whitespace-pre-line text-sm">{job.Requirements}</div>
                              )}
                            </div>
                          </div>

                          {/* Benefits */}
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Benefits</h3>
                            <div className="text-slate-700">
                              {Array.isArray(job.Benefits) ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {job.Benefits.map((benefit, index) => (
                                    <li key={index} className="text-sm">{benefit}</li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="whitespace-pre-line text-sm">{job.Benefits}</div>
                              )}
                            </div>
                          </div>

                          {/* Application Form */}
                          <div className="border-t pt-6">
                            <h3 className="font-semibold text-lg mb-4">Apply for this Position</h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="fullName">Full Name *</Label>
                                  <Input
                                    id="fullName"
                                    value={applicationForm.fullName}
                                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                                    placeholder="Your full name"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="email">Email *</Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={applicationForm.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="your.email@example.com"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="phone">Phone Number *</Label>
                                  <Input
                                    id="phone"
                                    value={applicationForm.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    placeholder="+250 XXX XXX XXX"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="experience">Years of Experience</Label>
                                  <Select onValueChange={(value) => handleInputChange("experience", value)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select experience level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="0-1">0-1 years</SelectItem>
                                      <SelectItem value="1-3">1-3 years</SelectItem>
                                      <SelectItem value="3-5">3-5 years</SelectItem>
                                      <SelectItem value="5+">5+ years</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="resume">Resume/CV</Label>
                                <Input
                                  id="resume"
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={handleFileChange}
                                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                              </div>
                              <div>
                                <Label htmlFor="coverLetter">Cover Letter *</Label>
                                <Textarea
                                  id="coverLetter"
                                  value={applicationForm.coverLetter}
                                  onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                                  rows={4}
                                />
                              </div>
                              <Button 
                                onClick={handleSubmitApplication}
                                disabled={isSubmitting}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                              >
                                {isSubmitting ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Application
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="py-20 relative" style={{
        backgroundImage: 'url(/mainbg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Work With Us?</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Join a dynamic team that's passionate about growing futsal and creating memorable experiences for our community.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center p-8 border-0 shadow-lg bg-white/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Collaborative Environment</h3>
              <p className="text-slate-300">
                Work with passionate professionals who share your love for sports and community building.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg bg-white/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Growth Opportunities</h3>
              <p className="text-slate-300">
                Advance your career with professional development opportunities and industry networking.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg bg-white/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Impact & Purpose</h3>
              <p className="text-slate-300">
                Make a real difference in the sports community and help grow futsal across the region.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our Team?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Don't see a position that matches your skills? We're always looking for talented individuals to join our growing team.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            onClick={() => {
              const subject = encodeURIComponent('General Application - Prime5 League');
              const body = encodeURIComponent(`Dear Prime5 League Team,

I am interested in joining your team and would like to submit my resume for consideration.

Please find my resume attached.

Thank you for your time and consideration.

Best regards,`);
              window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=prime5leaguerw@gmail.com&su=${subject}&body=${body}`, '_blank');
            }}
          >
            Send Us Your Resume
          </Button>
        </div>
      </section>
    </div>
  )
}
