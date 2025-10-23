"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, Target, XCircle } from "lucide-react"

export function SettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white drop-shadow-2xl">System Settings</h2>
        <p className="text-white/90 drop-shadow-xl">Manage system configuration and database connections</p>
      </div>
      
      {/* Database Status */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Settings className="h-5 w-5" />
            Database Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <span className="font-medium text-white/90">Database Status: </span>
              <span className="text-green-300">Connected</span>
            </div>
            <div>
              <span className="font-medium text-white/90">Teams Found: </span>
              <span className="text-white">1</span>
            </div>
            <div>
              <span className="font-medium text-white/90">Loading: </span>
              <span className="text-white">No</span>
            </div>
            <div>
              <span className="font-medium text-white/90">Fallback Teams: </span>
              <span className="text-white">3</span>
            </div>
          </div>
          
          {/* Connection Details */}
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <h4 className="font-medium text-white mb-3 drop-shadow-md">Connection Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-white/90">Error: </span>
                <span className="text-green-300">None</span>
              </div>
              <div>
                <span className="font-medium text-white/90">Network Status: </span>
                <span className="text-green-300">Connected</span>
              </div>
            </div>
            
            {/* Connection Test */}
            <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded text-sm border border-white/20">
              <span className="font-medium text-white/90">Last Test: </span>
              <span className="text-white/80">
                Click "Test Connection" to check your setup
              </span>
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:text-white"
                >
                  <Target className="h-4 h-4 mr-2" />
                  Test Connection
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Configuration */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Settings className="h-5 w-5" />
            Environment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2 drop-shadow-md">GraphQL Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1">
                    GraphQL URL
                  </label>
                  <Input 
                    value={process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql'}
                    readOnly
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1">
                    Admin Secret Status
                  </label>
                  <div className="flex items-center gap-2">
                    <Badge variant={process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET ? "outline" : "destructive"}>
                      {process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET ? 'Set' : 'Not Set'}
                    </Badge>
                    {!process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET && (
                      <span className="text-xs text-red-300">Required for database access</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/20">
              <h4 className="font-medium text-white mb-2 drop-shadow-md">Setup Instructions</h4>
              <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-yellow-300 text-lg">ℹ️</div>
                  <span className="font-medium text-yellow-200 drop-shadow-md">To connect to your database:</span>
                </div>
                <ol className="text-sm text-yellow-100 space-y-1 list-decimal list-inside">
                  <li>Create a <code className="bg-yellow-500/20 backdrop-blur-sm px-1 rounded border border-yellow-500/30">.env.local</code> file in your project root</li>
                  <li>Add your Hasura GraphQL URL: <code className="bg-yellow-500/20 backdrop-blur-sm px-1 rounded border border-yellow-500/30">NEXT_PUBLIC_HASURA_GRAPHQL_URL=your_url_here</code></li>
                  <li>Add your admin secret: <code className="bg-yellow-500/20 backdrop-blur-sm px-1 rounded border border-yellow-500/30">NEXT_PUBLIC_HASURA_ADMIN_SECRET=your_secret_here</code></li>
                  <li>Restart your development server</li>
                  <li>Click "Test Connection" to verify the setup</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
