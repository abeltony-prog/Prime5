"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { isAuthenticated, login } = useAuth()

  // Check if already authenticated on component mount
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      // Use the AuthContext login method
      const success = login(formData.username, formData.password)
      
      if (success) {
        toast.success("Logging in...")
        // The AuthContext will handle the redirect via useEffect
      } else {
        toast.error("Invalid clearance credentials")
      }
    } catch (error) {
      toast.error("Login protocol failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#061B14] font-['Outfit'] overflow-x-hidden relative flex items-center justify-center">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/mainbg.jpg"
          alt="Prime5 Arena"
          fill
          className="object-cover opacity-20 grayscale mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-[#061B14]/80" />
      </div>

      {/* Tactical Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[800px] md:h-[800px] bg-lime-400/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg p-4">
        <Card className="glass-dark border-white/10 shadow-[0_20px_50px_rgba(190,242,100,0.05)] rounded-none p-4 md:p-8 animate-in fade-in zoom-in-95 duration-700">
          <CardHeader className="text-center space-y-4 mb-2">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-lime-400/10 border border-lime-400/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(190,242,100,0.1)]">
                <Shield className="h-10 w-10 text-lime-400" />
              </div>
            </div>
            <CardTitle className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Admin <span className="text-lime-300">Protocol.</span>
            </CardTitle>
            <CardDescription className="text-white/50 font-bold tracking-widest uppercase text-xs">
              Enter clearance credentials to access the central mainframe
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              <div className="space-y-3 group">
                <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">
                  Identification (Username)
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Enter username"
                  className="bg-white/5 border-white/10 rounded-none h-14 text-white text-lg font-bold placeholder:text-white/20 focus:border-lime-400/50 transition-colors"
                  required
                />
              </div>
              
              <div className="space-y-3 group">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-lime-300 transition-colors">
                  Clearance Key (Password)
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter password"
                    className="bg-white/5 border-white/10 rounded-none h-14 text-white text-lg font-bold placeholder:text-white/20 focus:border-lime-400/50 transition-colors pr-14"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-14 w-14 rounded-none hover:bg-white/5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-white/40 hover:text-lime-300 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/40 hover:text-lime-300 transition-colors" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-lime-300 hover:bg-lime-400 text-black h-16 px-12 font-black italic uppercase tracking-widest text-lg rounded-none transition-all shadow-[0_10px_30px_rgba(190,242,100,0.1)] hover:scale-105 mt-6 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                    Authenticating...
                  </>
                ) : (
                  "Initiate Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
