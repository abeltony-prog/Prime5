"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"

// Dynamically import the auth logo component to ensure it only renders on client side
const DynamicAuthLogo = dynamic(() => import('./auth-logo'), {
  ssr: false,
  loading: () => (
    <Image
      src="/logo/PrimeALLWhite.png"
      alt="Prime5 League"
      width={100}
      height={100}
      className="drop-shadow-lg"
    />
  )
})

// Client-only component for auth-dependent logo
function AuthLogo() {
  return <DynamicAuthLogo />
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/statistics", label: "League Center" },
    { href: "/tickets", label: "Tickets" },
    { href: "/store", label: "Store" },
    { href: "/rules", label: "Rules" },
    { href: "/sponsors", label: "Partners" },
    { href: "/careers", label: "Careers" },
    { href: "/about", label: "About" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4">
      <div className="container mx-auto">
        <div className="glass-dark rounded-2xl px-6 py-2 flex justify-between items-center shadow-2xl border border-white/10">
          <Link href="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
            <AuthLogo />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-lime-300 hover:bg-white/5 rounded-xl transition-all duration-300"
              >
                {item.label}
              </Link>
            ))}
            <div className="w-px h-6 bg-white/10 mx-4" />
            <Button asChild size="sm" className="bg-lime-300 hover:bg-lime-400 text-black font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all duration-300 hover:scale-105">
              <Link href="/register">Register Team</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 glass-dark rounded-2xl p-4 shadow-2xl border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-white/70 hover:text-lime-300 hover:bg-white/5 rounded-xl transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2">
                <Button asChild className="w-full bg-lime-300 hover:bg-lime-400 text-black font-bold rounded-xl" onClick={() => setIsOpen(false)}>
                  <Link href="/register">Register Team</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
