"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useLazyQuery } from "@apollo/client"
import { GET_MANAGER_BY_EMAIL } from "@/lib/graphql/queries"
import { checkPasswordMatch } from "@/lib/utils/password"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const { login } = useAuth()
  
  // GraphQL query to get manager by email
  const [getManagerByEmail, { loading: queryLoading }] = useLazyQuery(GET_MANAGER_BY_EMAIL)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Check if user exists with the provided email
      const result = await getManagerByEmail({
        variables: { email }
      })

      if (result.data?.managers && result.data.managers.length > 0) {
        const manager = result.data.managers[0]
        
        // Use the password matching function that handles both formats
        if (checkPasswordMatch(password, manager.password)) {
          // Password matches - create manager data for dashboard
          const managerData = {
            id: manager.id,
            name: manager.name,
            email: manager.email,
            team: manager.Teams && manager.Teams.length > 0 ? {
              id: manager.Teams[0].id,
              name: manager.Teams[0].name,
              shortName: manager.Teams[0].shortname,
              logo: manager.Teams[0].logo
            } : null
          }
          
          login(managerData)
          
          toast({
            title: "Login Successful",
            description: `Welcome back, ${manager.name}!`,
            duration: 3000,
          })
        } else {
          setError("Invalid password. Please try again.")
        }
      } else {
        setError("No account found with this email address.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900/20 via-blue-900/20 to-purple-900/20 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600/90 to-green-700/90 backdrop-blur-md rounded-full flex items-center justify-center">
            <Shield className="w-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white drop-shadow-2xl">
              Team Manager Login
            </CardTitle>
            <p className="text-white/80 mt-2">
              Access your team dashboard and manage your squad
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white drop-shadow-md">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@team.com"
                required
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70 focus:border-green-500/50"
                disabled={isLoading || queryLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white drop-shadow-md">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70 focus:border-green-500/50 pr-10"
                  disabled={isLoading || queryLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-white/70 hover:text-white hover:bg-white/20"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || queryLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert className="border-red-500/30 bg-red-500/20 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              disabled={isLoading || queryLoading}
            >
              {isLoading || queryLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-white/20">
            <p className="text-sm text-white/70">
              Having trouble signing in?
            </p>
            <Button
              variant="link"
              className="text-green-400 hover:text-green-300 p-0 h-auto"
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 