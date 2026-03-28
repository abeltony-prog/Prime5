import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ApolloWrapper } from '@/components/apollo-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'
import { Outfit } from 'next/font/google'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Prime5 League - Professional Futsal',
  description: 'The premier futsal competition featuring the region\'s top teams competing for ultimate glory.',
  generator: 'Next.js',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo/Prime5IconGreen.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/Prime5IconGreen.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/logo/Prime5IconGreen.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo/Prime5IconGreen.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo/Prime5IconGreen.png" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body 
        className={`${GeistSans.variable} ${GeistMono.variable} ${outfit.variable} font-sans antialiased selection:bg-lime-300 selection:text-black`}
        style={{
          backgroundImage: 'url(/mainbg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Advanced Background overlay with gradient for depth */}
        <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/80 pointer-events-none"></div>
        <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        
        <ApolloWrapper>
          <AuthProvider>
            <div className="relative z-10">
              {children}
            </div>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  )
}
