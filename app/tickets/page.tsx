"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Trophy, 
  Users, 
  Star, 
  Clock, 
  MapPin, 
  Ticket, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  MessageCircle, 
  QrCode,
  Gift,
  User,
  Phone,
  Mail,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useState } from "react"
import { useQuery, useMutation } from '@apollo/client'
import { GET_MATCH_SCHEDULES } from "@/lib/graphql/queries"
import { ADD_FAN_DETAILS } from "@/lib/graphql/mutations"
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
  
  const [addFan] = useMutation(ADD_FAN_DETAILS)

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
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      return qrCodeDataURL
    } catch (error) {
      console.error('Error generating QR code:', error)
      return ''
    }
  }

  const { data: matchesData } = useQuery(GET_MATCH_SCHEDULES)

  const upcomingMatches = matchesData?.matches
    ?.filter((match: any) => {
      const matchDate = new Date(match.dateAndtime)
      const now = new Date()
      const matchEndTime = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000)
      return (match.status === 'scheduled' || match.status === 'Pending') && now < matchEndTime && match.status !== 'completed'
    })
    ?.sort((a: any, b: any) => new Date(a.dateAndtime).getTime() - new Date(b.dateAndtime).getTime())
    ?.map((match: any) => {
      const matchDate = new Date(match.dateAndtime)
      return {
        id: match.id,
        team1: match.Team1?.name || match.team1 || "Unknown Team",
        team2: match.Team2?.name || match.team2 || "Unknown Team",
        team1Logo: match.Team1?.logo || null,
        team2Logo: match.Team2?.logo || null,
        date: matchDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        time: matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        venue: match.location || "Prime Arena",
        price: 2000
      }
    }) || []

  const ticketTypes = [
    {
      id: "free",
      name: "Kigal Universe",
      tagline: "Unlimited Access",
      price: 0,
      icon: Gift,
      color: "lime",
      features: [
        "Registration Entry",
        "Access to All Matches",
        "General Seating",
        "Prime Arena Access",
        "Digital Program"
      ],
      popular: true,
      isFree: true,
      soldOut: false
    },
    {
      id: "single",
      name: "Single Match",
      tagline: "One Day Pass",
      price: 2000,
      icon: Ticket,
      color: "white",
      features: [
        "Access to One Match",
        "Standard Seating",
        "Prime Arena Access",
        "Digital Program"
      ],
      popular: false,
      soldOut: true
    },
    {
      id: "season",
      name: "Season Pass",
      tagline: "Ultimate Experience",
      price: 15000,
      originalPrice: 24000,
      icon: Award,
      color: "lime-glow",
      features: [
        "All Season Matches",
        "VIP Seating Priority",
        "Exclusive Merchandise",
        "Playoff Access",
        "Free Parking",
        "Meet & Greets"
      ],
      popular: false,
      soldOut: true
    },
    {
      id: "group",
      name: "Group Pack",
      tagline: "Team Spirit",
      price: 8000,
      originalPrice: 10000,
      icon: Users,
      color: "white",
      features: [
        "Access for 5 People",
        "Group Seating",
        "Special Discounts",
        "Photo Opportunity"
      ],
      popular: false,
      soldOut: true
    }
  ]

  const handleFreeRegistration = async () => {
    if (!freeFormData.name || !freeFormData.phone || !freeFormData.email) return

    setIsGeneratingTicket(true)
    try {
      const ticketId = generateTicketId()
      const ticketData: TicketData = {
        id: ticketId,
        name: freeFormData.name,
        phone: freeFormData.phone,
        email: freeFormData.email,
        ticketType: 'free',
        matches: upcomingMatches.slice(0, 5).map((match: any) => ({
          id: match.id,
          team1: match.team1,
          team2: match.team2,
          date: match.date,
          time: match.time,
          venue: match.venue
        })),
        generatedAt: new Date().toLocaleString(),
        validUntil: getValidUntilDate('free')
      }

      await addFan({
        variables: {
          fullname: freeFormData.name,
          phone: freeFormData.phone,
          email: freeFormData.email,
          TicketNumber: ticketId
        }
      })

      const pdfUrl = await generateTicketPDF(ticketData)
      const qrUrl = await generateQRCode(ticketData)
      
      setGeneratedTicketData(ticketData)
      setPdfDataUrl(pdfUrl)
      setQrCodeDataUrl(qrUrl)
      setTicketGenerated(true)
      setShowFreeForm(false)
    } catch (error) {
      console.error('Error generating ticket:', error)
    } finally {
      setIsGeneratingTicket(false)
    }
  }

  return (
    <div className="min-h-screen text-white selection:bg-lime-400 selection:text-black">
      <Navigation />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lime-400/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-lime-400/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-24">
        {/* Hero Section */}
        <div className="max-w-4xl mb-24">
          <div className="flex flex-wrap items-center gap-4 mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <Badge className="bg-lime-400/10 text-lime-400 border-lime-400/20 px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px]">
              Available Now
            </Badge>
            <Link href="/tickets/scan">
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-lime-300 transition-colors">
                 <QrCode size={14} className="text-lime-300" />
                 Scan QR Code
               </button>
            </Link>
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-heading italic uppercase tracking-tighter mb-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            Secure Your <span className="text-lime-300">Territory.</span>
          </h1>
          <p className="text-xl text-white/40 uppercase font-bold tracking-widest max-w-2xl animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
            Experience the most high-octane futsal league in Rwanda. 
            Choose your path to the Prime5 Arena.
          </p>
        </div>

        {/* Ticket Grid */}
        <div className="grid lg:grid-cols-4 gap-8 mb-32">
          {ticketTypes.map((ticket, index) => (
            <div 
              key={ticket.id}
              onClick={() => !ticket.soldOut && setSelectedTicket(ticket.id)}
              className={`group relative glass-dark rounded-[2.5rem] p-8 border transition-all duration-500 cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700 ${
                selectedTicket === ticket.id ? "border-lime-300 shadow-[0_0_30px_rgba(190,242,100,0.1)]" : "border-white/10 hover:border-white/20"
              } ${ticket.soldOut ? "opacity-40 grayscale pointer-events-none" : ""}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ticket.icon size={80} />
              </div>

              {ticket.popular && (
                <div className="absolute -top-3 left-8">
                  <Badge className="bg-lime-300 text-black px-4 py-1 font-black uppercase tracking-widest text-[8px] italic shadow-lg">
                    Recommended
                  </Badge>
                </div>
              )}

              {ticket.soldOut && (
                <div className="absolute -top-3 left-8">
                  <Badge className="bg-white/10 text-white/40 border-white/5 px-4 py-1 font-black uppercase tracking-widest text-[8px]">
                    Sold Out
                  </Badge>
                </div>
              )}

              <div className="mb-12 relative z-10">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">{ticket.tagline}</p>
                <h3 className="text-3xl font-black font-heading italic uppercase tracking-tight mb-2 group-hover:text-lime-300 transition-colors">
                  {ticket.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white font-heading italic">
                    {ticket.isFree ? "Free" : `RWF ${ticket.price.toLocaleString()}`}
                  </span>
                  {ticket.originalPrice && (
                    <span className="text-sm text-white/20 line-through font-bold">
                      {ticket.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-12 relative z-10">
                {ticket.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={14} className="text-lime-400/50" />
                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest leading-none">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={(e) => {
                  e.stopPropagation()
                  if (ticket.isFree) setShowFreeForm(true)
                  else setSelectedTicket(ticket.id)
                }}
                className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-500 overflow-hidden relative group/btn ${
                  ticket.isFree ? "bg-lime-300 text-black hover:bg-white" : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <span className="relative z-10">{ticket.isFree ? "Register Now" : "Select Pass"}</span>
              </Button>
            </div>
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="glass-dark rounded-[2.5rem] p-10 border border-white/10 group hover:border-lime-300/30 transition-all duration-500">
            <div className="w-14 h-14 bg-lime-400/10 rounded-2xl flex items-center justify-center mb-8 border border-lime-400/20 group-hover:scale-110 transition-transform">
              <Shield className="text-lime-400" size={24} />
            </div>
            <h4 className="text-xl font-black uppercase tracking-tight mb-4">Secure Access</h4>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed">
              Every digital ticket is encrypted with a unique QR code for verified arena entry.
            </p>
          </div>

          <div className="glass-dark rounded-[2.5rem] p-10 border border-white/10 group hover:border-lime-300/30 transition-all duration-500">
            <div className="w-14 h-14 bg-blue-400/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-400/20 group-hover:scale-110 transition-transform">
              <CreditCard className="text-blue-400" size={24} />
            </div>
            <h4 className="text-xl font-black uppercase tracking-tight mb-4">Payment Methods</h4>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed">
              Accepting Mobile Money, Bank Transfers, and secure card payments.
            </p>
          </div>

          <div className="glass-dark rounded-[2.5rem] p-10 border border-white/10 group hover:border-lime-300/30 transition-all duration-500">
            <div className="w-14 h-14 bg-purple-400/10 rounded-2xl flex items-center justify-center mb-8 border border-purple-400/20 group-hover:scale-110 transition-transform">
              <MessageCircle className="text-purple-400" size={24} />
            </div>
            <h4 className="text-xl font-black uppercase tracking-tight mb-4">Live Support</h4>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed">
              Need help? Our team is available on WhatsApp 24/7 for ticketing assistance.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 glass rounded-[3rem] p-12 md:p-24 border border-white/5 relative overflow-hidden text-center group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <Trophy size={400} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black font-heading italic uppercase tracking-tighter mb-8 relative z-10">
            Ready for <span className="text-lime-300">Next Level?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <Button asChild size="lg" className="h-16 px-10 bg-lime-300 text-black hover:bg-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl hover:shadow-lime-400/20">
              <Link href="https://chat.whatsapp.com/BI9CD8copL59aQnpCTrRtz" target="_blank">WhatsApp Support</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-10 border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs rounded-2xl transition-all backdrop-blur-md">
              <Link href="tel:+250788829084">Call Direct</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Free Registration Modal */}
      {showFreeForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowFreeForm(false)}></div>
          <div className="relative w-full max-w-xl glass-dark rounded-[3rem] border border-white/10 p-12 shadow-3xl overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Gift size={120} />
            </div>
            
            <div className="text-center mb-12">
              <Badge className="bg-lime-400/10 text-lime-400 border-lime-400/20 px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-6">
                Universe Pass
              </Badge>
              <h3 className="text-4xl font-black font-heading italic uppercase tracking-tighter mb-4 text-white">Free Registration</h3>
              <p className="text-white/40 text-xs font-black uppercase tracking-widest">Access granted to the Prime5 Universe.</p>
            </div>

            <div className="space-y-6 mb-12">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-4">Full Name</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-lime-300" size={18} />
                  <input
                    type="text"
                    value={freeFormData.name}
                    onChange={(e) => setFreeFormData({...freeFormData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-white font-black uppercase tracking-widest text-xs focus:border-lime-300/50 outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-4">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-lime-300" size={18} />
                  <input
                    type="tel"
                    value={freeFormData.phone}
                    onChange={(e) => setFreeFormData({...freeFormData, phone: e.target.value})}
                    placeholder="+250 788 000 000"
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-white font-black uppercase tracking-widest text-xs focus:border-lime-300/50 outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-4">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-lime-300" size={18} />
                  <input
                    type="email"
                    value={freeFormData.email}
                    onChange={(e) => setFreeFormData({...freeFormData, email: e.target.value})}
                    placeholder="name@prime5.com"
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-white font-black uppercase tracking-widest text-xs focus:border-lime-300/50 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowFreeForm(false)}
                className="h-16 rounded-2xl font-black uppercase tracking-widest text-xs text-white/40 hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                disabled={isGeneratingTicket}
                onClick={handleFreeRegistration}
                className="h-16 rounded-2xl bg-lime-300 text-black hover:bg-white font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:shadow-lime-400/20"
              >
                {isGeneratingTicket ? "Generating..." : "Get Free Pass"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Success Modal */}
      {ticketGenerated && generatedTicketData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in zoom-in duration-500">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setTicketGenerated(false)}></div>
          <div className="relative w-full max-w-4xl">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-lime-300/20 blur-[100px] rounded-full"></div>
            
            <div className="text-center mb-12 relative z-10">
              <div className="w-20 h-20 bg-lime-400/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-lime-400/20">
                <CheckCircle className="h-10 w-10 text-lime-400" />
              </div>
              <h3 className="text-5xl font-black font-heading italic uppercase tracking-tighter mb-4 text-white">Success Unleashed!</h3>
              <p className="text-white/40 text-xs font-black uppercase tracking-widest">Your Prime5 Digital Identity has been forged.</p>
            </div>

            {/* Premium Ticket Card */}
            <div className="glass shadow-3xl rounded-[3rem] overflow-hidden border border-white/10 relative group mb-12">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Trophy size={160} />
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-12 border-b md:border-b-0 md:border-r border-white/10">
                  <div className="flex items-center gap-4 mb-12">
                     <div className="bg-lime-300 text-black text-[9px] font-black italic px-3 py-1 rounded-full uppercase tracking-widest">
                       {generatedTicketData.ticketType} Pass
                     </div>
                     <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">#{generatedTicketData.id}</span>
                  </div>
                  
                  <div className="space-y-12">
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Ticket Holder</p>
                      <h4 className="text-3xl font-black font-heading italic uppercase tracking-tight text-white">{generatedTicketData.name}</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                         <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Validity</p>
                         <p className="font-black text-sm uppercase tracking-widest text-white/60">{generatedTicketData.validUntil}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Arena Entry</p>
                         <p className="font-black text-sm uppercase tracking-widest text-lime-300">All Matches</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-80 bg-white/5 p-12 flex flex-col items-center justify-center text-center">
                  {qrCodeDataUrl && (
                    <div className="p-4 bg-white rounded-3xl mb-6 shadow-2xl">
                       <img src={qrCodeDataUrl} alt="Ticket QR" className="w-32 h-32" />
                    </div>
                  )}
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] mb-1">Scan for Entry</p>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Verified Digital Asset</p>
                </div>
              </div>

              <div className="bg-white/5 py-4 px-12 border-t border-white/10">
                 <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] text-center">Non-Transferable • Primary Entry Only • Prime Arena Kigali</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
               <Button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = pdfDataUrl || ''
                  link.download = `prime5-ticket-${generatedTicketData.id}.pdf`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
                className="h-16 px-12 bg-white text-black hover:bg-lime-300 font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-2xl"
              >
                <CreditCard className="mr-2" size={16} />
                Download PDF Ticket
              </Button>
              <Button
                variant="ghost"
                onClick={() => setTicketGenerated(false)}
                className="h-16 px-12 text-white/40 hover:text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all"
              >
                Close Portal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
