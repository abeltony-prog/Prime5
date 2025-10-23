"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"
import Link from "next/link"

export function SeasonsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white drop-shadow-2xl">Season Management</h2>
        <p className="text-white/90 drop-shadow-xl">Create and manage league seasons</p>
      </div>
      
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="text-center">
            <Trophy className="h-16 w-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2 drop-shadow-lg">Season Scheduler</h3>
            <p className="text-white/80 mb-4 drop-shadow-md">
              Use the dedicated Season Scheduler to create seasons, invite teams, and plan your league.
            </p>
            <Link href="/admin/season-scheduler">
              <Button className="bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Trophy className="h-4 h-4 mr-2" />
                Open Season Scheduler
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
