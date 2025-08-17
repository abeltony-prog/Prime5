import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ApolloWrapper } from '@/components/apollo-provider'

export const metadata: Metadata = {
  title: 'Prime5 League - Professional Futsal',
  description: 'The premier futsal competition featuring the region\'s top teams competing for ultimate glory.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body 
        className="relative"
        style={{
          backgroundImage: 'url(/mainbg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Background overlay for better readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        <ApolloWrapper>
          <div className="relative z-10">
            {children}
          </div>
        </ApolloWrapper>
      </body>
    </html>
  )
}
