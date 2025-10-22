"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, Users, Star, ArrowRight, Play, Clock, MapPin, Ticket, CreditCard, Shield, CheckCircle, X, Gift, User, Phone, Mail, MessageCircle, QrCode } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { useState } from "react"
import { useQuery } from '@apollo/client'
import { GET_MATCH_SCHEDULES } from "@/lib/graphql/queries"
import { generateTicketPDF, generateTicketId, getValidUntilDate, TicketData } from "@/lib/utils/ticket-generator"

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showFreeForm, setShowFreeForm] = useState(false)
  const [freeFormData, setFreeFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const [isGeneratingTicket, setIsGeneratingTicket] = useState(false)
  const [ticketGenerated, setTicketGenerated] = useState(false)
  const [generatedTicketData, setGeneratedTicketData] = useState<TicketData | null>(null)
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)

  // Function to generate QR code for modal display
  const generateQRCode = async (ticketData: TicketData): Promise<string> => {
    try {
      const QRCode = await import('qrcode')
      const qrCodeData = JSON.stringify({
        ticketId: ticketData.id,
        name: ticketData.name,
        phone: ticketData.phone,
        type: ticketData.ticketType,
        validUntil: ticketData.validUntil
      })
      
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#FFFFFF'
        }
      })
      
      return qrCodeDataURL
    } catch (error) {
      console.error('Error generating QR code for modal:', error)
      return ''
    }
  }

  // Test function to verify PDF generation
  const testPDFGeneration = async () => {
    try {
      console.log('Testing PDF generation...')
      const testTicketData: TicketData = {
        id: 'TEST-123',
        name: 'Test User',
        phone: '+250788123456',
        email: 'test@example.com',
        ticketType: 'free',
        matches: [
          {
            id: '1',
            team1: 'Team A',
            team2: 'Team B',
            date: 'Nov 15, 2025',
            time: '7:00 PM',
            venue: 'Prime Arena'
          }
        ],
        generatedAt: new Date().toLocaleString(),
        validUntil: getValidUntilDate('free')
      }
      
      const pdfUrl = await generateTicketPDF(testTicketData)
      const qrUrl = await generateQRCode(testTicketData)
      setGeneratedTicketData(testTicketData)
      setPdfDataUrl(pdfUrl)
      setQrCodeDataUrl(qrUrl)
      setTicketGenerated(true)
      console.log('Test PDF generated successfully')
    } catch (error) {
      console.error('Test PDF generation failed:', error)
    }
  }

  // Fetch real match data from database
  const { data: matchesData, loading: matchesLoading, error: matchesError } = useQuery(GET_MATCH_SCHEDULES)

  // Function to get the start and end of current week
  const getCurrentWeekRange = () => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay()) // Start from Sunday
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6) // End on Saturday
    endOfWeek.setHours(23, 59, 59, 999)
    
    return { startOfWeek, endOfWeek }
  }

  // Process upcoming matches for current week
  const upcomingMatches = matchesData?.matches
    ?.filter((match: any) => {
      const matchDate = new Date(match.dateAndtime)
      const { startOfWeek, endOfWeek } = getCurrentWeekRange()
      return match.status === 'scheduled' && matchDate >= startOfWeek && matchDate <= endOfWeek
    })
    ?.sort((a: any, b: any) => new Date(a.dateAndtime).getTime() - new Date(b.dateAndtime).getTime())
    ?.map((match: any) => {
      const matchDate = new Date(match.dateAndtime)
      return {
        id: match.id,
        team1: match.Team1?.name || match.team1 || "Unknown Team",
        team2: match.Team2?.name || match.team2 || "Unknown Team",
        team1Logo: match.Team1?.logo || "/placeholder.svg",
        team2Logo: match.Team2?.logo || "/placeholder.svg",
        date: matchDate.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        time: matchDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        venue: match.location || "Prime Arena",
        fullDate: matchDate,
        price: 2000 // Single match ticket price
      }
    }) || []

  const ticketTypes = [
    {
      id: "free",
      name: "Free Pass",
      price: 0,
      originalPrice: null,
      icon: Gift,
      color: "green-dark",
      features: [
        "Access to all matches",
        "General seating",
        "Prime Arena access",
        "Match program included",
        "Registration required"
      ],
      popular: false,
      isFree: true
    },
    {
      id: "single",
      name: "Single Match",
      price: 2000,
      originalPrice: null,
      icon: Ticket,
      color: "green",
      features: [
        "Access to one match",
        "Secure seating",
        "Prime Arena access",
        "Match program included"
      ],
      popular: false
    },
    {
      id: "season",
      name: "Season Pass",
      price: 15000,
      originalPrice: 24000,
      icon: Trophy,
      color: "yellow",
      features: [
        "Access to all matches",
        "VIP seating priority",
        "Exclusive merchandise",
        "Playoff access included",
        "Free parking",
        "Meet & greet opportunities"
      ],
      popular: true
    },
    {
      id: "group",
      name: "Group Package",
      price: 8000,
      originalPrice: 10000,
      icon: Users,
      color: "blue",
      features: [
        "Access to all matches",
        "Group seating together",
        "Special group discounts",
        "Flexible scheduling",
        "Group photo opportunity"
      ],
      popular: false,
      minPeople: 5
    }
  ]


  const handleFreeRegistration = async () => {
    if (!freeFormData.name || !freeFormData.phone || !freeFormData.email) {
      return
    }

    console.log('Starting ticket generation...')
    setIsGeneratingTicket(true)
    
    try {
      // Generate ticket data
      const ticketId = generateTicketId()
      console.log('Generated ticket ID:', ticketId)
      
      const ticketData: TicketData = {
        id: ticketId,
        name: freeFormData.name,
        phone: freeFormData.phone,
        email: freeFormData.email,
        ticketType: 'free',
        matches: upcomingMatches.map((match: any) => ({
          id: match.id,
          team1: match.team1,
          team2: match.team2,
          date: match.date,
          time: match.time,
          venue: match.venue
        })),
        generatedAt: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        validUntil: getValidUntilDate('free')
      }

      console.log('Ticket data:', ticketData)
      console.log('Upcoming matches:', upcomingMatches)

      // Generate PDF data URL
      console.log('Generating PDF...')
      const pdfUrl = await generateTicketPDF(ticketData)
      console.log('PDF generation completed')
      
      // Generate QR code for modal display
      console.log('Generating QR code for modal...')
      const qrUrl = await generateQRCode(ticketData)
      console.log('QR code generated')
      
      // Store the generated data
      setGeneratedTicketData(ticketData)
      setPdfDataUrl(pdfUrl)
      setQrCodeDataUrl(qrUrl)
      setTicketGenerated(true)
      setShowFreeForm(false)
      setFreeFormData({name: '', phone: '', email: ''})
      
    } catch (error) {
      console.error('Error generating ticket:', error)
    } finally {
      setIsGeneratingTicket(false)
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        bg: "bg-green-600/20",
        text: "text-green-400",
        button: "bg-green-600/90 hover:bg-green-700/90",
        border: "border-green-400/50"
      },
      "green-dark": {
        bg: "bg-green-800/20",
        text: "text-green-300",
        button: "bg-green-800/90 hover:bg-green-900/90",
        border: "border-green-600/50"
      },
      yellow: {
        bg: "bg-yellow-600/20",
        text: "text-yellow-400",
        button: "bg-yellow-600/90 hover:bg-yellow-700/90",
        border: "border-yellow-400/50"
      },
      blue: {
        bg: "bg-blue-600/20",
        text: "text-blue-400",
        button: "bg-blue-600/90 hover:bg-blue-700/90",
        border: "border-blue-400/50"
      },
      purple: {
        bg: "bg-purple-600/20",
        text: "text-purple-400",
        button: "bg-purple-600/90 hover:bg-purple-700/90",
        border: "border-purple-400/50"
      }
    }
    return colors[color as keyof typeof colors] || colors.green
  }

  return (
    <div className="min-h-screen relative">
      <Navigation />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center gap-4 mb-6">
            <Badge className="bg-green-100/90 backdrop-blur-sm text-green-800 px-4 py-2 rounded-full font-semibold border border-green-200/50">
              Get Your Tickets
            </Badge>
            <Link href="/tickets/scan">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
            Prime5 League Tickets
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-xl">
            Experience the most exciting futsal action in Rwanda. Choose your ticket package and secure your spot for an unforgettable season.
          </p>
          
        </div>

        {/* Ticket Packages */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 drop-shadow-lg">
            Choose Your Package
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {ticketTypes.map((ticket) => {
              const colors = getColorClasses(ticket.color)
              const IconComponent = ticket.icon
              
              return (
                <Card 
                  key={ticket.id}
                  className={`bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 ${
                    ticket.popular ? `border-2 ${colors.border} relative` : ''
                  } ${selectedTicket === ticket.id ? 'ring-2 ring-white/50' : ''}`}
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  {ticket.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-yellow-500 text-black px-4 py-1 font-bold">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto mb-4 p-3 ${colors.bg} rounded-full w-fit`}>
                      <IconComponent className={`h-8 w-8 ${colors.text}`} />
                    </div>
                    <CardTitle className="text-2xl text-white">{ticket.name}</CardTitle>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className={`text-4xl font-bold ${colors.text}`}>
                        {ticket.isFree ? 'FREE' : `RWF ${ticket.price.toLocaleString()}`}
                      </div>
                      {ticket.originalPrice && (
                        <div className="text-lg text-white/50 line-through">
                          RWF {ticket.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <p className="text-white/70 text-sm">
                      {ticket.isFree ? 'registration required' : (ticket.minPeople ? `per person (min ${ticket.minPeople} people)` : 'per person')}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {ticket.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-white/90">
                          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${colors.button} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                        ticket.color === 'yellow' ? 'text-black font-bold' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (ticket.isFree) {
                          setShowFreeForm(true)
                        } else {
                          setSelectedTicket(ticket.id)
                        }
                      }}
                    >
                      {ticket.isFree ? 'Register for Free' : (selectedTicket === ticket.id ? 'Selected' : 'Select Package')}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quantity Selector */}
          {selectedTicket && (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl max-w-md mx-auto mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Select Quantity</h3>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-white/20 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-bold text-white min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="border-white/20 text-white hover:bg-white/20"
                  >
                    +
                  </Button>
                </div>
                <div className="text-center mt-4">
                  <p className="text-white/70">
                    Total: RWF {(ticketTypes.find(t => t.id === selectedTicket)?.price || 0) * quantity}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Free Registration Form Modal */}
          {showFreeForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl max-w-md w-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-green-800/20 rounded-full w-fit">
                    <Gift className="h-8 w-8 text-green-300" />
                  </div>
                  <CardTitle className="text-2xl text-white drop-shadow-lg">Get Your Free Pass</CardTitle>
                  <p className="text-white/90 drop-shadow-md">Register to watch all games for free!</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-md">
                        <User className="h-4 w-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={freeFormData.name}
                        onChange={(e) => setFreeFormData({...freeFormData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-md">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={freeFormData.phone}
                        onChange={(e) => setFreeFormData({...freeFormData, phone: e.target.value})}
                        className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                        placeholder="+250 788 123 456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow-md">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={freeFormData.email}
                        onChange={(e) => setFreeFormData({...freeFormData, email: e.target.value})}
                        className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-white/30 text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm"
                      onClick={() => {
                        setShowFreeForm(false)
                        setFreeFormData({name: '', phone: '', email: ''})
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-green-800/90 backdrop-blur-md hover:bg-green-900/90 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleFreeRegistration}
                      disabled={isGeneratingTicket}
                    >
                      {isGeneratingTicket ? 'Generating Ticket...' : 'Register for Free'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ticket Generated Success Message */}
          {ticketGenerated && generatedTicketData && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl max-w-2xl w-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-green-600/20 rounded-full w-fit">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">Ticket Generated Successfully!</CardTitle>
                  <p className="text-gray-600">Your free pass is ready. Download the PDF below.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Ticket Card Preview */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg">
                    {/* Ticket Header */}
                    <div className="bg-gray-800 text-white p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Prime5 League</h3>
                        <span className="text-sm">ID: {generatedTicketData.id}</span>
                      </div>
                    </div>
                    
                    {/* Ticket Body */}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        {/* Left side - Details */}
                        <div className="flex-1 pr-4">
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">
                            {generatedTicketData.ticketType.toUpperCase()}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-semibold text-gray-600">Name:</span>
                              <p className="text-gray-800">{generatedTicketData.name}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-600">Phone:</span>
                              <p className="text-gray-800">{generatedTicketData.phone}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-600">Valid Until:</span>
                              <p className="text-gray-800">{generatedTicketData.validUntil}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right side - QR Code */}
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          {qrCodeDataUrl ? (
                            <div className="mb-2">
                              <img 
                                src={qrCodeDataUrl} 
                                alt="QR Code" 
                                className="w-20 h-20 mx-auto rounded"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center mb-2">
                              <div className="text-xs text-gray-500 text-center">
                                QR<br/>CODE
                              </div>
                            </div>
                          )}
                          <p className="text-xs text-gray-600 font-semibold">SCAN FOR</p>
                          <p className="text-xs text-gray-600 font-semibold">VERIFICATION</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ticket Footer */}
                    <div className="bg-gray-800 text-white p-2 text-center">
                      <p className="text-xs">Present this ticket at entrance • Non-transferable</p>
                    </div>
                  </div>
                  
                  {/* Download Button */}
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = pdfDataUrl || ''
                        link.download = `prime5-ticket-${generatedTicketData.id}.pdf`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Download PDF Ticket
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setTicketGenerated(false)
                        setGeneratedTicketData(null)
                        setPdfDataUrl(null)
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Purchase Button */}
          {selectedTicket && (
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Proceed to Payment
              </Button>
            </div>
          )}
        </div>

        {/* Upcoming Matches */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 drop-shadow-lg">
            This Week's Matches
          </h2>
          
          {matchesLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="text-white/70 mt-4">Loading upcoming matches...</p>
            </div>
          ) : matchesError ? (
            <div className="text-center py-12">
              <p className="text-red-400">Error loading matches. Please try again later.</p>
            </div>
          ) : upcomingMatches.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70 text-lg">No matches scheduled for this week</p>
              <p className="text-white/50 text-sm mt-2">Check back later for upcoming matches</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map((match: any) => (
                <Card key={match.id} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-white/70" />
                        <span className="text-white/70 text-sm">{match.date}</span>
                      </div>
                      <Badge className="bg-green-600/90 text-white">RWF {match.price}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{match.team1}</div>
                        </div>
                        <div className="text-white/50">VS</div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{match.team2}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {match.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {match.venue}
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-blue-600/90 backdrop-blur-md hover:bg-blue-700/90"
                      onClick={() => {
                        // Set single match as selected and show quantity selector
                        setSelectedTicket('single')
                        setQuantity(1)
                      }}
                    >
                      Get Tickets
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Secure Payment Methods</h3>
            <div className="flex justify-center items-center gap-8 flex-wrap mb-6">
              <div className="flex items-center gap-2 text-white/90">
                <CreditCard className="h-6 w-6 text-green-400" />
                <span>Mobile Money</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <CreditCard className="h-6 w-6 text-blue-400" />
                <span>Bank Transfer</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <CreditCard className="h-6 w-6 text-purple-400" />
                <span>Cash on Arrival</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
              <Shield className="h-4 w-4" />
              <span>All payments are secure and encrypted</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gradient-to-r from-green-800/90 to-green-900/90 backdrop-blur-xl text-white shadow-2xl hover:shadow-3xl transition-all duration-300 border border-green-600/50 mt-12">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 drop-shadow-2xl">Need Help?</h2>
            <p className="text-xl mb-8 text-white/90 drop-shadow-xl">
              Contact our support team for assistance with ticket purchases
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
        
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/50 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link href="tel:+250788829084">Call Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-green-500/90 backdrop-blur-md hover:bg-green-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link href="https://chat.whatsapp.com/BI9CD8copL59aQnpCTrRtz?text=Hi%20Prime5%20support%2C%20I%20need%20help%20with%20tickets" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
