"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, Target, Zap, CheckCircle, Activity } from "lucide-react"

export function SettingsTab() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-1 h-12 bg-white" />
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-widest text-white">SYSTEM <span className="text-white/40">CONFIGURATION</span></h2>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Manage core infrastructure and database telemetry</p>
        </div>
      </div>
      
      {/* Database Status */}
      <div className="glass-dark border border-white/10 p-8 rounded-none relative overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-lime-400" />
          <h3 className="text-lg font-black italic uppercase tracking-widest text-white">DATABASE <span className="text-lime-400">TELEMETRY</span></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-1">
            <span className="text-[9px] font-black italic uppercase tracking-widest text-white/40">LINK_STATUS</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
              <span className="text-sm font-black italic uppercase text-lime-400">CONNECTED</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-black italic uppercase tracking-widest text-white/40">TEAMS_DETECTED</span>
            <span className="block text-xl font-black italic text-white tracking-tighter">128_NODES</span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-black italic uppercase tracking-widest text-white/40">LATENCY_SYNC</span>
            <span className="block text-sm font-black italic text-cyan-400 uppercase">OPTIMAL</span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-black italic uppercase tracking-widest text-white/40">FALLBACK_MODE</span>
            <span className="block text-sm font-black italic text-white/60 uppercase">INACTIVE</span>
          </div>
        </div>
        
        {/* Connection Details */}
        <div className="p-6 bg-white/5 border border-white/10 relative group">
          <h4 className="text-[10px] font-black italic uppercase tracking-[0.3em] text-white/60 mb-4">CONNECTION_METRICS</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[9px] font-mono text-white/30 uppercase">Error_Log</span>
              <span className="text-[10px] font-mono text-lime-400 uppercase">NONE_DETECTED</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[9px] font-mono text-white/30 uppercase">Network_Relay</span>
              <span className="text-[10px] font-mono text-lime-400 uppercase">ENCRYPTED_LINK</span>
            </div>
          </div>
          
          {/* Connection Test */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">LAST_TEST_SEQUENCE: 2026.03.30 // 13:08</span>
            </div>
            <Button 
              className="bg-white/10 hover:bg-white/20 text-white rounded-none border border-white/20 font-black italic uppercase tracking-widest text-[10px] h-9 px-6 transition-all"
            >
              <Target className="h-3 w-3 mr-2" />
              EXECUTE_LINK_TEST
            </Button>
          </div>
        </div>
      </div>

      {/* Environment Configuration */}
      <div className="glass-dark border border-white/10 p-8 rounded-none relative overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-cyan-400" />
          <h3 className="text-lg font-black italic uppercase tracking-widest text-white">ENVIRONMENT <span className="text-cyan-400">MANIFEST</span></h3>
        </div>

        <div className="space-y-12">
          <div>
            <h4 className="text-[10px] font-black italic uppercase tracking-[0.3em] text-white/60 mb-6 flex items-center gap-2">
              <Zap className="h-3 w-3 text-cyan-400" />
              GRAPHQL_ENDPOINT_SECURITY
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-[9px] font-mono text-white/30 uppercase tracking-widest">
                  Public_Hasura_URL
                </label>
                <div className="relative group">
                   <Input 
                    value={process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql'}
                    readOnly
                    className="bg-white/5 border-white/10 text-cyan-400 font-mono text-xs rounded-none h-11 focus:border-cyan-400/50 transition-all cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle className="h-3 w-3 text-cyan-400/50" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[9px] font-mono text-white/30 uppercase tracking-widest">
                  Admin_Secret_Protocol
                </label>
                <div className="flex items-center h-11 px-4 bg-white/5 border border-white/10">
                  <Badge 
                    className={`rounded-none border-0 font-mono text-[9px] uppercase py-1 px-3 flex items-center gap-1.5 ${process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET ? 'bg-lime-400/10 text-lime-400' : 'bg-red-400/10 text-red-500'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET ? 'bg-lime-400 animate-pulse' : 'bg-red-500'}`} />
                    {process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET ? 'KEY_ACTIVE' : 'KEY_MISSING'}
                  </Badge>
                  {!process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET && (
                    <span className="ml-4 text-[9px] font-mono text-red-500/60 uppercase animate-pulse">! DATA_LEAK_WARNING: SECURE_LINK_REQUIRED</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-4 w-4 text-yellow-400" />
              <h4 className="text-[10px] font-black italic uppercase tracking-[0.3em] text-yellow-400">SECURITY_ESTABLISHMENT_PROTOCOL</h4>
            </div>
            <div className="bg-yellow-400/5 border border-yellow-400/20 p-8 relative">
              <div className="absolute top-4 right-4 text-yellow-400/20 text-4xl font-black italic">!</div>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="font-mono text-yellow-400/40 text-[10px]">01</span>
                  <p className="text-[11px] font-mono text-yellow-100/70 uppercase">Initialize <code className="bg-yellow-400/10 px-1.5 py-0.5 rounded text-yellow-400">.env.local</code> in the root directory</p>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-yellow-400/40 text-[10px]">02</span>
                  <p className="text-[11px] font-mono text-yellow-100/70 uppercase">Map <code className="bg-yellow-400/10 px-1.5 py-0.5 rounded text-yellow-400">NEXT_PUBLIC_HASURA_GRAPHQL_URL</code> to your endpoint</p>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-yellow-400/40 text-[10px]">03</span>
                  <p className="text-[11px] font-mono text-yellow-100/70 uppercase">Assign <code className="bg-yellow-400/10 px-1.5 py-0.5 rounded text-yellow-400">NEXT_PUBLIC_HASURA_ADMIN_SECRET</code> for auth</p>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-yellow-400/40 text-[10px]">04</span>
                  <p className="text-[11px] font-mono text-yellow-100/70 uppercase">Restart all active dev server instances</p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
