"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
} from "lucide-react"

interface Registration {
  id: number
  teamName: string
  managerName: string
  email: string
  phone: string
  submittedDate: string
  status: "pending" | "approved" | "rejected"
  group: string
  location: string
  reviewNotes?: string
}

interface RegistrationsProps {
  registrations: Registration[]
}

export function Registrations({ registrations }: RegistrationsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [groupFilter, setGroupFilter] = useState("all")

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch = reg.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter
    const matchesGroup = groupFilter === "all" || reg.group === groupFilter
    
    return matchesSearch && matchesStatus && matchesGroup
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGroupColor = (group: string) => {
    return group === "A" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleStatusChange = (registrationId: number, newStatus: string) => {
    // Here you would update the registration status in the database
    console.log(`Changing registration ${registrationId} to ${newStatus}`)
  }

  const pendingCount = registrations.filter(r => r.status === "pending").length
  const approvedCount = registrations.filter(r => r.status === "approved").length
  const rejectedCount = registrations.filter(r => r.status === "rejected").length

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Registration Management</h2>
          <p className="text-white/80">Review and manage team registration applications</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Users className="h-4 w-4 mr-2" />
            View All Applications
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-300">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Approved</p>
                <p className="text-2xl font-bold text-green-300">{approvedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Rejected</p>
                <p className="text-2xl font-bold text-red-300">{rejectedCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="A">Group A</SelectItem>
                <SelectItem value="B">Group B</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Users className="h-5 w-5" />
            Registration Applications ({filteredRegistrations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white/90">Team & Manager</TableHead>
                  <TableHead className="text-white/90">Contact Info</TableHead>
                  <TableHead className="text-white/90">Group</TableHead>
                  <TableHead className="text-white/90">Location</TableHead>
                  <TableHead className="text-white/90">Submitted</TableHead>
                  <TableHead className="text-white/90">Status</TableHead>
                  <TableHead className="text-white/90">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id} className="hover:bg-white/10">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{registration.teamName}</div>
                        <div className="text-sm text-white/70">{registration.managerName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-white/80">
                          <Mail className="h-3 w-3" />
                          {registration.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-white/80">
                          <Phone className="h-3 w-3" />
                          {registration.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getGroupColor(registration.group)}>
                        Group {registration.group}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-white/80">{registration.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-white/70">
                        <Calendar className="h-3 w-3" />
                        {registration.submittedDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(registration.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(registration.status)}
                          {registration.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {registration.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusChange(registration.id, "approved")}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(registration.id, "rejected")}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 