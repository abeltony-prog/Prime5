"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/statistics", label: "League Center" },
    { href: "/store", label: "Store" },
    { href: "/rules", label: "Rules" },
    { href: "/sponsors", label: "Partners" },
    { href: "/about", label: "About" },
  ]

  return (
    <nav className="bg-white/20 backdrop-blur-xl shadow-2xl border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo/PrimeALLWhite.png"
              alt="Prime5 League"
              width={60}
              height={60}
              className="drop-shadow-lg"
            />
            <div>
        
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="block px-4 py-2 text-white font-medium transition-all duration-300 hover:scale-105"
                >
                  {item.label}
                </Link>
                {/* Glass glow effect on hover */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            ))}
            <Button asChild className="bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-green-500/30">
              <Link href="/register">Register Team</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-white/20 bg-white/10 backdrop-blur-xl rounded-b-lg shadow-2xl">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className="block px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white font-medium transition-all duration-300 hover:bg-white/20 hover:shadow-xl mx-4"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {/* Glass glow effect on hover */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 mx-4"></div>
                </div>
              ))}
              <div className="px-4">
                <Button asChild className="bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 w-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-green-500/30">
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    Register Team
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
