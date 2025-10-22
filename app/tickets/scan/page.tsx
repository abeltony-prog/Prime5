"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, ArrowLeft, User, Calendar, MapPin, Clock, Trophy, CheckCircle, X } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useQuery } from '@apollo/client'
import { GET_MATCH_SCHEDULES } from "@/lib/graphql/queries"
import jsQR from 'jsqr'

interface ScannedTicketData {
  ticketId: string
  name: string
  phone: string
  type: string
  validUntil: string
}

interface Match {
  id: string
  team1: string
  team2: string
  date: string
  time: string
  venue: string
}

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<ScannedTicketData | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | false>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Fetch real match data from database
  const { data: matchesData, loading: matchesLoading, error: matchesError } = useQuery(GET_MATCH_SCHEDULES)

  // Process match data from database
  const processMatches = (matches: any[]): Match[] => {
    if (!matches) return []
    
    return matches.map((match: any) => ({
      id: match.id,
      team1: match.team1?.name || match.team1 || 'Team A',
      team2: match.team2?.name || match.team2 || 'Team B',
      date: new Date(match.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: new Date(match.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      venue: match.venue?.name || match.venue || 'Prime Arena'
    }))
  }

  // Get current week matches
  const getCurrentWeekMatches = () => {
    if (!matchesData?.matchSchedules) return []
    
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)
    
    const currentWeekMatches = matchesData.matchSchedules.filter((match: any) => {
      const matchDate = new Date(match.date)
      return matchDate >= startOfWeek && matchDate <= endOfWeek
    })
    
    return processMatches(currentWeekMatches)
  }

  const startScanning = async () => {
    try {
      setError(null)
      setIsScanning(true)
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        videoRef.current.play()
        
        // Start scanning for QR codes
        scanQRCode()
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera access to scan QR codes.')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    const scanFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        
        // Use jsQR to detect QR codes
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert"
        })

        if (code) {
          try {
            // Parse the QR code data
            const ticketData = JSON.parse(code.data)
            
            // Validate ticket data structure
            if (ticketData.ticketId && ticketData.name && ticketData.phone) {
              setScannedData(ticketData)
              setMatches(getCurrentWeekMatches()) // Get real matches from database
              setIsValid(true)
              stopScanning()
              return
            } else {
              setError('Invalid QR code format')
              stopScanning()
              return
            }
          } catch (err) {
            setError('Invalid QR code data')
            stopScanning()
            return
          }
        }
      }

      if (isScanning) {
        requestAnimationFrame(scanFrame)
      }
    }

    scanFrame()
  }

  const handleManualScan = () => {
    // For testing purposes - simulate a manual scan with real data
    const testScannedData: ScannedTicketData = {
      ticketId: "P5-TEST-123",
      name: "Test User", 
      phone: "+250788123456",
      type: "free",
      validUntil: "February 15, 2026"
    }

    setScannedData(testScannedData)
    setMatches(getCurrentWeekMatches())
    setIsValid(true)
  }

  const resetScan = () => {
    setScannedData(null)
    setMatches([])
    setIsValid(null)
    setError(null)
    stopScanning()
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="min-h-screen relative">
      <Navigation />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link href="/tickets">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tickets
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl">
            QR Code Scanner
          </h1>
          <p className="text-lg text-white/90 drop-shadow-xl">
            Scan ticket QR codes to verify entry and view match details
          </p>
        </div>

        {!scannedData ? (
          <div className="max-w-2xl mx-auto">
            {/* Scanner Interface */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Scan Ticket QR Code</CardTitle>
                <p className="text-white/80">Point your camera at the QR code on the ticket</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Camera View */}
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    playsInline
                    muted
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                  
                  {/* Scanning Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-green-400 rounded-lg animate-pulse">
                        <div className="w-full h-full border-2 border-white/50 rounded-lg"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-200 text-center">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  {!isScanning ? (
                    <Button
                      onClick={startScanning}
                      className="bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <QrCode className="h-5 w-5 mr-2" />
                      Start Scanning
                    </Button>
                  ) : (
                    <Button
                      onClick={stopScanning}
                      variant="outline"
                      size="lg"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Stop Scanning
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleManualScan}
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/20"
                  >
                    Test with Real Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Scan Results */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {isValid ? (
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  ) : (
                    <X className="h-8 w-8 text-red-400" />
                  )}
                  <CardTitle className="text-2xl text-white">
                    {isValid ? 'Valid Ticket' : 'Invalid Ticket'}
                  </CardTitle>
                </div>
                <Badge className={`${isValid ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                  {isValid ? 'Entry Allowed' : 'Entry Denied'}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Ticket Holder Info */}
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Ticket Holder Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-white/70 text-sm">Name:</span>
                      <p className="text-white font-semibold">{scannedData.name}</p>
                    </div>
                    <div>
                      <span className="text-white/70 text-sm">Phone:</span>
                      <p className="text-white font-semibold">{scannedData.phone}</p>
                    </div>
                    <div>
                      <span className="text-white/70 text-sm">Ticket Type:</span>
                      <p className="text-white font-semibold uppercase">{scannedData.type}</p>
                    </div>
                    <div>
                      <span className="text-white/70 text-sm">Valid Until:</span>
                      <p className="text-white font-semibold">{scannedData.validUntil}</p>
                    </div>
                    <div>
                      <span className="text-white/70 text-sm">Ticket ID:</span>
                      <p className="text-white font-semibold font-mono text-sm">{scannedData.ticketId}</p>
                    </div>
                  </div>
                </div>

                {/* Matches Information */}
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Matches
                  </h3>
                  
                  {matchesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-white/70">Loading matches...</p>
                    </div>
                  ) : matchesError ? (
                    <div className="text-center py-8">
                      <p className="text-red-400">Error loading matches: {matchesError.message}</p>
                    </div>
                  ) : matches.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-white/70">No matches scheduled for this week</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {matches.map((match) => (
                        <div key={match.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-bold text-white">
                              {match.team1} vs {match.team2}
                            </h4>
                            <Badge className="bg-green-600 text-white">
                              <Trophy className="h-3 w-3 mr-1" />
                              Match
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-white/80">
                              <Calendar className="h-4 w-4" />
                              <span>{match.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                              <Clock className="h-4 w-4" />
                              <span>{match.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                              <MapPin className="h-4 w-4" />
                              <span>{match.venue}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={resetScan}
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/20"
                  >
                    Scan Another Ticket
                  </Button>
                  <Button
                    onClick={() => window.print()}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Print Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
