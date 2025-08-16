"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface CountdownTimerProps {
  targetDate: Date
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <Card key={unit} className="bg-white border shadow-sm">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {value.toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-600 font-medium capitalize">{unit}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
