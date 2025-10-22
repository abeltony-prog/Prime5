import jsPDF from 'jspdf'

export interface TicketData {
  id: string
  name: string
  phone: string
  email: string
  ticketType: 'free' | 'single' | 'season' | 'group'
  matches: Array<{
    id: string
    team1: string
    team2: string
    date: string
    time: string
    venue: string
  }>
  generatedAt: string
  validUntil: string
}

export const generateTicketPDF = async (ticketData: TicketData): Promise<string> => {
  try {
    console.log('Creating PDF document...')
    // Create landscape orientation ticket (width > height)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [210, 105] // Ticket size: 210mm wide x 105mm tall
    })
    
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    
    console.log('Page dimensions:', { pageWidth, pageHeight })
    
    // Colors
    const primaryColor = '#1f2937' // Dark gray
    const accentColor = '#10b981' // Green
    const textColor = '#374151' // Gray
    const lightGray = '#f3f4f6'
    
    // Main ticket background
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')
    
    // Left side - Ticket details (60% of width)
    const leftWidth = pageWidth * 0.6
    const rightWidth = pageWidth * 0.4
    
    // Header section
    doc.setFillColor(primaryColor)
    doc.rect(0, 0, leftWidth, 25, 'F')
    
    // Logo/Title
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Prime5 League', 10, 15)
    
    // Ticket ID
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`ID: ${ticketData.id}`, leftWidth - 60, 15)
    
    // Ticket type badge
    doc.setFillColor(accentColor)
    doc.rect(10, 30, 40, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(ticketData.ticketType.toUpperCase(), 15, 38)
    
    // User details section
    let yPos = 50
    doc.setTextColor(textColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Ticket Holder:', 10, yPos)
    yPos += 8
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Name: ${ticketData.name}`, 10, yPos)
    yPos += 6
    doc.text(`Phone: ${ticketData.phone}`, 10, yPos)
    yPos += 6
    doc.text(`Email: ${ticketData.email}`, 10, yPos)
    yPos += 12
    
    // Matches section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Match Details:', 10, yPos)
    yPos += 8
    
    if (ticketData.matches && ticketData.matches.length > 0) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      
      if (ticketData.ticketType === 'free' || ticketData.ticketType === 'season' || ticketData.ticketType === 'group') {
        // Show first 3 matches for space
        const matchesToShow = ticketData.matches.slice(0, 3)
        matchesToShow.forEach((match, index) => {
          doc.text(`${index + 1}. ${match.team1} vs ${match.team2}`, 15, yPos)
          yPos += 5
          doc.text(`   ${match.date} at ${match.time}`, 15, yPos)
          yPos += 5
          doc.text(`   ${match.venue}`, 15, yPos)
          yPos += 8
        })
        
        if (ticketData.matches.length > 3) {
          doc.text(`... and ${ticketData.matches.length - 3} more matches`, 15, yPos)
          yPos += 8
        }
      } else {
        // Single match
        const match = ticketData.matches[0]
        if (match) {
          doc.text(`${match.team1} vs ${match.team2}`, 15, yPos)
          yPos += 5
          doc.text(`${match.date} at ${match.time}`, 15, yPos)
          yPos += 5
          doc.text(`${match.venue}`, 15, yPos)
          yPos += 8
        }
      }
    } else {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text('All upcoming matches', 15, yPos)
      yPos += 8
    }
    
    // Validity info
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(`Valid until: ${ticketData.validUntil}`, 10, yPos)
    yPos += 5
    doc.text(`Generated: ${ticketData.generatedAt}`, 10, yPos)
    
    // Right side - QR Code and branding (40% of width)
    const rightX = leftWidth + 5
    
    // QR Code section background
    doc.setFillColor(lightGray)
    doc.rect(rightX, 10, rightWidth - 10, 60, 'F')
    
    // Generate QR Code
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
        width: 120,
        margin: 1,
        color: {
          dark: primaryColor,
          light: '#FFFFFF'
        }
      })
      
      // Add QR Code
      doc.addImage(qrCodeDataURL, 'PNG', rightX + 5, 15, 50, 50)
      
      // QR Code label
      doc.setTextColor(textColor)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('SCAN FOR', rightX + 20, 70)
      doc.text('VERIFICATION', rightX + 15, 75)
      
    } catch (error) {
      console.error('Error generating QR code:', error)
      // Fallback QR code placeholder
      doc.setFillColor(240, 240, 240)
      doc.rect(rightX + 5, 15, 50, 50, 'F')
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(8)
      doc.text('QR Code', rightX + 20, 40)
      doc.text('Error', rightX + 22, 50)
    }
    
    // Bottom section with terms
    doc.setFillColor(primaryColor)
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('Present this ticket at entrance • Non-transferable • Prime5 League', 10, pageHeight - 8)
    
    // Decorative border
    doc.setDrawColor(accentColor)
    doc.setLineWidth(2)
    doc.rect(2, 2, pageWidth - 4, pageHeight - 4)
    
    console.log('Generating PDF data URL...')
    const pdfDataUrl = doc.output('dataurlstring')
    console.log('PDF generated successfully')
    
    return pdfDataUrl
    
  } catch (error) {
    console.error('Error in generateTicketPDF:', error)
    throw error
  }
}

export const generateTicketId = (): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `P5-${timestamp}-${random}`.toUpperCase()
}

export const getValidUntilDate = (ticketType: string): string => {
  const now = new Date()
  let validUntil: Date
  
  switch (ticketType) {
    case 'free':
    case 'season':
    case 'group':
      // Valid for 3 months
      validUntil = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000))
      break
    case 'single':
      // Valid for 1 week
      validUntil = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000))
      break
    default:
      validUntil = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
  }
  
  return validUntil.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
