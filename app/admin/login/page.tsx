"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Check if already authenticated on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuthenticated")
      const loginTime = localStorage.getItem("adminLoginTime")
      
      if (authStatus === "true" && loginTime) {
        // Check if login is not older than 24 hours
        const loginDate = new Date(loginTime)
        const now = new Date()
        const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
        
        if (hoursDiff < 24) {
          // Already authenticated, redirect to admin
          router.push("/admin")
        }
      }
    }

    checkAuth()
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    // Check credentials
    if (formData.username === "adminPrime5" && formData.password === "123Prime5ports!") {
      try {
        // Store authentication in localStorage
        localStorage.setItem("adminAuthenticated", "true")
        localStorage.setItem("adminLoginTime", new Date().toISOString())
        
        toast.success("Login successful! Welcome to Admin Panel")
        
        // Add a small delay to ensure toast shows
        setTimeout(() => {
          router.push("/admin")
        }, 1000)
      } catch (error) {
        toast.error("Login failed. Please try again.")
        setIsLoading(false)
      }
    } else {
      toast.error("Invalid username or password")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/mainbg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/10 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
            <CardDescription className="text-slate-300">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Enter username"
                  className="bg-white/10 border-white/30 text-white placeholder:text-slate-400 focus:border-white/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter password"
                    className="bg-white/10 border-white/30 text-white placeholder:text-slate-400 focus:border-white/50 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
            

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
