"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, Calendar, Check } from "lucide-react"

interface DailyCheckInProps {
  updateBalance: (amount: number) => void
}

export default function DailyCheckIn({ updateBalance }: DailyCheckInProps) {
  const [open, setOpen] = useState(false)
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null)
  const [canCheckIn, setCanCheckIn] = useState(false)
  const [checkInStreak, setCheckInStreak] = useState(0)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [animation, setAnimation] = useState(false)

  // Helper function to get today's date as YYYY-MM-DD in UTC
  const getTodayString = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: string, date2: string) => {
    return date1 === date2
  }

  // Helper function to get yesterday's date as YYYY-MM-DD in UTC
  const getYesterdayString = () => {
    const yesterday = new Date()
    yesterday.setUTCDate(yesterday.getUTCDate() - 1)
    return yesterday.toISOString().split("T")[0]
  }

  // Load check-in data from localStorage on component mount
  useEffect(() => {
    const loadCheckInData = () => {
      const storedLastCheckIn = localStorage.getItem("piggyWorldLastCheckIn")
      const storedStreak = localStorage.getItem("piggyWorldCheckInStreak")
      const todayString = getTodayString()

      if (storedLastCheckIn) {
        setLastCheckIn(storedLastCheckIn)

        // Check if already checked in today
        if (isSameDay(storedLastCheckIn, todayString)) {
          setIsCheckedIn(true)
          setCanCheckIn(false)
        } else {
          setIsCheckedIn(false)
          setCanCheckIn(true)
        }
      } else {
        // First time user, can check in
        setCanCheckIn(true)
        setIsCheckedIn(false)
      }

      if (storedStreak) {
        setCheckInStreak(Number.parseInt(storedStreak, 10))
      }
    }

    loadCheckInData()
  }, [])

  // Reload data when dialog opens
  useEffect(() => {
    if (open) {
      const storedLastCheckIn = localStorage.getItem("piggyWorldLastCheckIn")
      const todayString = getTodayString()

      if (storedLastCheckIn && isSameDay(storedLastCheckIn, todayString)) {
        setIsCheckedIn(true)
        setCanCheckIn(false)
      } else {
        setIsCheckedIn(false)
        setCanCheckIn(true)
      }
    }
  }, [open])

  // Perform check-in
  const handleCheckIn = () => {
    if (!canCheckIn) return

    const todayString = getTodayString()

    // Double-check to prevent multiple check-ins
    const storedLastCheckIn = localStorage.getItem("piggyWorldLastCheckIn")
    if (storedLastCheckIn && isSameDay(storedLastCheckIn, todayString)) {
      setIsCheckedIn(true)
      setCanCheckIn(false)
      return
    }

    // Save check-in date
    localStorage.setItem("piggyWorldLastCheckIn", todayString)
    setLastCheckIn(todayString)
    setCanCheckIn(false)
    setIsCheckedIn(true)

    // Update streak
    let newStreak = 1

    if (lastCheckIn) {
      const yesterdayString = getYesterdayString()

      // If last check-in was yesterday, increment streak
      if (isSameDay(lastCheckIn, yesterdayString)) {
        newStreak = checkInStreak + 1
      }
    }

    localStorage.setItem("piggyWorldCheckInStreak", newStreak.toString())
    setCheckInStreak(newStreak)

    // Award OINK
    const baseReward = 10
    // Bonus for streaks (every 5 days)
    const streakBonus = Math.floor(newStreak / 5) * 5
    const totalReward = baseReward + streakBonus

    updateBalance(totalReward)

    // Trigger animation
    setAnimation(true)
    setTimeout(() => setAnimation(false), 2000)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date()
    const currentMonth = today.getUTCMonth()
    const currentYear = today.getUTCFullYear()

    // First day of the month
    const firstDay = new Date(Date.UTC(currentYear, currentMonth, 1))
    // Last day of the month
    const lastDay = new Date(Date.UTC(currentYear, currentMonth + 1, 0))

    const days = []
    const startingDayOfWeek = firstDay.getUTCDay()

    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getUTCDate(); i++) {
      days.push(i)
    }

    return days
  }

  // Check if a specific day has been checked in
  const isCheckedInDay = (day: number | null) => {
    if (!day || !lastCheckIn) return false

    const checkInDate = new Date(lastCheckIn)
    const today = new Date()

    // If check-in was this month and on this day
    return (
      checkInDate.getUTCMonth() === today.getUTCMonth() &&
      checkInDate.getUTCFullYear() === today.getUTCFullYear() &&
      checkInDate.getUTCDate() === day
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10 text-xs relative"
        onClick={() => setOpen(true)}
      >
        <Calendar className="h-3 w-3 mr-1" />
        <span>Daily Oink</span>
        {isCheckedIn && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            <Check className="h-3 w-3" />
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black border-[#ff1493] text-white max-w-[350px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#ff1493] flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Oink
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Check-in status */}
            <Card className="bg-black border-[#ff1493]/30">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Current streak</h3>
                  <p className="text-2xl font-bold">{checkInStreak} days</p>
                </div>
                <div className={`${animation ? "animate-bounce" : ""}`}>
                  <div className="bg-[#ff1493]/20 rounded-full p-3">
                    <Sparkles className="h-6 w-6 text-[#ff1493]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card className="bg-black border-[#ff00ff]/30">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-base text-white">
                  {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  <span className="text-xs text-gray-400 ml-2">(UTC)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i} className="text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 flex items-center justify-center rounded-full text-sm
                        ${day === null ? "" : "border border-[#ff1493]/20"}
                        ${day === new Date().getUTCDate() ? "border-[#ff1493]" : ""}
                        ${isCheckedInDay(day) ? "bg-[#ff1493]/30 text-white" : ""}
                      `}
                    >
                      {day}
                      {isCheckedInDay(day) && <Check className="h-3 w-3 absolute text-[#ff00ff]" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Check-in button */}
            <Button
              className={`w-full ${canCheckIn ? "bg-[#ff1493] hover:bg-[#ff1493]/80" : "bg-gray-700 cursor-not-allowed"}`}
              disabled={!canCheckIn}
              onClick={handleCheckIn}
            >
              {canCheckIn ? (
                <>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Check-in and get 10 OINK
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Already checked in today
                </>
              )}
            </Button>

            {lastCheckIn && (
              <div className="text-xs text-center text-gray-400">Last check-in: {formatDate(lastCheckIn)}</div>
            )}

            {checkInStreak >= 5 && (
              <div className="text-xs text-center text-[#ff1493]">
                Streak bonus: +{Math.floor(checkInStreak / 5) * 5} OINK
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
