"use client"

import { useState } from "react"
import { useQuery, useMutation } from '@apollo/client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Briefcase, MapPin, DollarSign, Clock, Eye } from "lucide-react"
import { GET_ALL_JOBS, GET_ALL_APPLICATIONS } from "@/lib/graphql/queries"
import { CREATE_JOB, UPDATE_JOB, DELETE_JOB } from "@/lib/graphql/mutations"
import { toast } from "sonner"

interface Job {
  id: string
  title: string
  description: string
  location: string
  experience: string
  amount: string
  Requirements: string[]
  Benefits: string[]
  created_at: string
}

interface Application {
  id: string
  name: string
  email: string
  phone: string
  years: string
  cover_letter: string
  file: string
  job_id: string
  created_at: string
  job: {
    title: string
    location: string
  }
}

export default function AdminJobsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs')

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    experience: "",
    amount: "",
    requirements: "",
    benefits: ""
  })

  // Queries
  const { data: jobsData, loading: jobsLoading, refetch: refetchJobs } = useQuery(GET_ALL_JOBS)
  const { data: applicationsData, loading: applicationsLoading, refetch: refetchApplications } = useQuery(GET_ALL_APPLICATIONS)

  // Mutations
  const [createJob] = useMutation(CREATE_JOB)
  const [updateJob] = useMutation(UPDATE_JOB)
  const [deleteJob] = useMutation(DELETE_JOB)

  const jobs: Job[] = jobsData?.jobs || []
  const applications: Application[] = applicationsData?.applications || []

  const handleInputChange = (field: string, value: string) => {
    setJobForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateJob = async () => {
    try {
      const jobData = {
        title: jobForm.title,
        description: jobForm.description,
        location: jobForm.location,
        experience: jobForm.experience,
        amount: jobForm.amount,
        Requirements: jobForm.requirements.split('\n').filter(req => req.trim()),
        Benefits: jobForm.benefits.split('\n').filter(benefit => benefit.trim())
      }

      await createJob({
        variables: { job: jobData }
      })

      toast.success("Job created successfully!")
      setIsCreateDialogOpen(false)
      setJobForm({
        title: "",
        description: "",
        location: "",
        experience: "",
        amount: "",
        requirements: "",
        benefits: ""
      })
      refetchJobs()
    } catch (error) {
      toast.error("Failed to create job")
      console.error(error)
    }
  }

  const handleEditJob = async () => {
    if (!selectedJob) return

    try {
      const jobData = {
        title: jobForm.title,
        description: jobForm.description,
        location: jobForm.location,
        experience: jobForm.experience,
        amount: jobForm.amount,
        Requirements: jobForm.requirements.split('\n').filter(req => req.trim()),
        Benefits: jobForm.benefits.split('\n').filter(benefit => benefit.trim())
      }

      await updateJob({
        variables: { 
          id: selectedJob.id,
          updates: jobData
        }
      })

      toast.success("Job updated successfully!")
      setIsEditDialogOpen(false)
      setSelectedJob(null)
      refetchJobs()
    } catch (error) {
      toast.error("Failed to update job")
      console.error(error)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return

    try {
      await deleteJob({
        variables: { id: jobId }
      })

      toast.success("Job deleted successfully!")
      refetchJobs()
    } catch (error) {
      toast.error("Failed to delete job")
      console.error(error)
    }
  }

  const openEditDialog = (job: Job) => {
    setSelectedJob(job)
    setJobForm({
      title: job.title,
      description: job.description,
      location: job.location,
      experience: job.experience,
      amount: job.amount,
      requirements: job.Requirements.join('\n'),
      benefits: job.Benefits.join('\n')
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (application: Application) => {
    setSelectedApplication(application)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Jobs & Applications</h1>
          <p className="text-slate-300">Manage job postings and review applications</p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-transparent border border-white/30 text-white hover:bg-white/20 hover:text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Job
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 backdrop-blur-sm p-1 rounded-lg w-fit border border-white/20">
        <Button
          variant="ghost"
          onClick={() => setActiveTab('jobs')}
          className={activeTab === 'jobs' ? 'bg-white/20 text-white shadow-sm' : 'text-white hover:bg-white/10 hover:text-white'}
        >
          <Briefcase className="mr-2 h-4 w-4" />
          Jobs ({jobs.length})
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab('applications')}
          className={activeTab === 'applications' ? 'bg-white/20 text-white shadow-sm' : 'text-white hover:bg-white/10 hover:text-white'}
        >
          <Eye className="mr-2 h-4 w-4" />
          Applications ({applications.length})
        </Button>
      </div>

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {jobsLoading ? (
            <div className="text-center py-8 text-white">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="text-center py-8">
                <Briefcase className="h-12 w-12 text-white/60 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No jobs posted yet</h3>
                <p className="text-slate-300 mb-4">Create your first job posting to start receiving applications.</p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-transparent border border-white/30 text-white hover:bg-white/20 hover:text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Job
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-white">{job.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1 text-slate-300">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(job)}
                          className="border-white/30 text-white hover:bg-white/20 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteJob(job.id)}
                          className="border-white/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-300">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {job.amount}
                      </div>
                      <div className="flex items-center text-sm text-slate-300">
                        <Clock className="h-4 w-4 mr-2" />
                        {job.experience}
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                        {job.Requirements.length} requirements
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applicationsLoading ? (
            <div className="text-center py-8 text-white">Loading applications...</div>
          ) : applications.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="text-center py-8">
                <Eye className="h-12 w-12 text-white/60 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No applications yet</h3>
                <p className="text-slate-300">Applications will appear here once candidates start applying.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Phone</TableHead>
                    <TableHead className="text-white">Job Position</TableHead>
                    <TableHead className="text-white">Experience</TableHead>
                    <TableHead className="text-white">Applied</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id} className="border-white/20">
                      <TableCell className="font-medium text-white">{application.name}</TableCell>
                      <TableCell className="text-slate-300">{application.email}</TableCell>
                      <TableCell className="text-slate-300">{application.phone}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{application.job.title}</div>
                          <div className="text-sm text-slate-300">{application.job.location}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{application.years} years</TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(application.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openViewDialog(application)}
                          className="border-white/30 text-white hover:bg-white/20 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      )}

      {/* Create Job Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new job posting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={jobForm.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Marketing Manager"
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={jobForm.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Kigali, Rwanda"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience">Experience Required *</Label>
                <Input
                  id="experience"
                  value={jobForm.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="e.g., 3-5 years"
                />
              </div>
              <div>
                <Label htmlFor="amount">Salary Range *</Label>
                <Input
                  id="amount"
                  value={jobForm.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="e.g., RWF 800,000 - 1,200,000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={jobForm.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the role and responsibilities..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (one per line) *</Label>
              <Textarea
                id="requirements"
                value={jobForm.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                placeholder="Bachelor's degree in Marketing...&#10;3-5 years of experience...&#10;Strong communication skills..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="benefits">Benefits (one per line) *</Label>
              <Textarea
                id="benefits"
                value={jobForm.benefits}
                onChange={(e) => handleInputChange("benefits", e.target.value)}
                placeholder="Competitive salary...&#10;Health insurance...&#10;Professional development..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateJob} className="bg-green-600 hover:bg-green-700">
                Create Job
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update the job details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Job Title *</Label>
                <Input
                  id="edit-title"
                  value={jobForm.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Marketing Manager"
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location *</Label>
                <Input
                  id="edit-location"
                  value={jobForm.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Kigali, Rwanda"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-experience">Experience Required *</Label>
                <Input
                  id="edit-experience"
                  value={jobForm.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="e.g., 3-5 years"
                />
              </div>
              <div>
                <Label htmlFor="edit-amount">Salary Range *</Label>
                <Input
                  id="edit-amount"
                  value={jobForm.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="e.g., RWF 800,000 - 1,200,000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Job Description *</Label>
              <Textarea
                id="edit-description"
                value={jobForm.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the role and responsibilities..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="edit-requirements">Requirements (one per line) *</Label>
              <Textarea
                id="edit-requirements"
                value={jobForm.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                placeholder="Bachelor's degree in Marketing...&#10;3-5 years of experience...&#10;Strong communication skills..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="edit-benefits">Benefits (one per line) *</Label>
              <Textarea
                id="edit-benefits"
                value={jobForm.benefits}
                onChange={(e) => handleInputChange("benefits", e.target.value)}
                placeholder="Competitive salary...&#10;Health insurance...&#10;Professional development..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditJob} className="bg-green-600 hover:bg-green-700">
                Update Job
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the candidate's application.
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Name</Label>
                  <p className="text-lg font-semibold">{selectedApplication.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Email</Label>
                  <p className="text-lg">{selectedApplication.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Phone</Label>
                  <p className="text-lg">{selectedApplication.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Experience</Label>
                  <p className="text-lg">{selectedApplication.years} years</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-600">Applied for</Label>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="font-semibold">{selectedApplication.job.title}</p>
                  <p className="text-slate-600">{selectedApplication.job.location}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-600">Cover Letter</Label>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                </div>
              </div>

              {selectedApplication.file && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Resume/CV</Label>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <a 
                      href={selectedApplication.file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Download Resume
                    </a>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-slate-600">Applied on</Label>
                <p className="text-lg">
                  {new Date(selectedApplication.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    const subject = encodeURIComponent(`Re: Application for ${selectedApplication.job.title}`);
                    const body = encodeURIComponent(`Dear ${selectedApplication.name},\n\nThank you for your interest in the ${selectedApplication.job.title} position at Prime5 League.\n\nBest regards,\nPrime5 League Team`);
                    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedApplication.email}&su=${subject}&body=${body}`, '_blank');
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Reply via Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
