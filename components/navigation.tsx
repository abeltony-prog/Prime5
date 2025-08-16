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
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/placeholder.svg?height=40&width=40&text=P5"
              alt="Prime5 League"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <div className="text-2xl font-bold text-gray-900">Prime5 League</div>
              <div className="text-xs text-gray-600">Professional Futsal</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/register">Register Team</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="bg-green-600 hover:bg-green-700 w-fit">
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  Register Team
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
