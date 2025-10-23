"use client"

import Image from "next/image"
import { useAuthSafe } from "@/contexts/auth-context"

export default function AuthLogo() {
  const { manager, isAuthenticated } = useAuthSafe()
  
  if (isAuthenticated && manager?.team?.logo) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
          <img 
            src={manager.team.logo} 
            alt={`${manager.team.name} Logo`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-white">
          <div className="text-sm font-medium">{manager.team.name}</div>
          <div className="text-xs opacity-80">Team Dashboard</div>
        </div>
      </div>
    )
  }
  
  return (
    <Image
      src="/logo/PrimeALLWhite.png"
      alt="Prime5 League"
      width={100}
      height={100}
      className="drop-shadow-lg"
    />
  )
}
