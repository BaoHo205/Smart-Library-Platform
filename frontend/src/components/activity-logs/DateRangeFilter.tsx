"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, SearchIcon, ChevronDownIcon } from "lucide-react"
import { toast } from "sonner"

interface DateRangeFilterProps {
  defaultStartDate?: string
  defaultEndDate?: string
}

interface ActivityLog {
  id: string
  userName: string
  actionType: string
  actionDetails: string
  createdAt: string
}

export function DateRangeFilter({ defaultStartDate, defaultEndDate }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    defaultStartDate ? new Date(defaultStartDate) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    defaultEndDate ? new Date(defaultEndDate) : undefined
  )
  const [isLoading, setIsLoading] = useState(false)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  // Function to fetch filtered logs
  const fetchFilteredLogs = async (start?: Date, end?: Date): Promise<ActivityLog[]> => {
    try {
      let url = "http://localhost:5000/api/v1/staff/logs"

      if (start || end) {
        console.log("Fetching logs with filters:", { start, end })
        const queryParams = new URLSearchParams()

        if (start) {
          // Fix timezone issue by using local date components
          const year = start.getFullYear()
          const month = String(start.getMonth() + 1).padStart(2, '0')
          const day = String(start.getDate()).padStart(2, '0')
          const startDateStr = `${year}-${month}-${day}`
          queryParams.append('startDate', startDateStr)
        }

        if (end) {
          // Fix timezone issue and add 1 day to end date
          const endDateObj = new Date(end)
          endDateObj.setDate(endDateObj.getDate() + 1)
          const year = endDateObj.getFullYear()
          const month = String(endDateObj.getMonth() + 1).padStart(2, '0')
          const day = String(endDateObj.getDate()).padStart(2, '0')
          const adjustedEndDate = `${year}-${month}-${day}`
          queryParams.append('endDate', adjustedEndDate)
        }
        url += `?${queryParams.toString()}`
      }

      console.log("Fetching logs from URL:", url)
      const response = await fetch(url, {
        cache: "no-store",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      console.log("Fetched filtered activity logs:", data)
      return data.data || []
    } catch (error) {
      console.log("Error fetching activity logs:", error)
      toast.error("Error fetching activity logs")
      return []
    }
  }

  // Function to fetch all logs
  const fetchAllLogs = async (): Promise<ActivityLog[]> => {
    return fetchFilteredLogs() // Call without parameters to get all logs
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const filteredLogs = await fetchFilteredLogs(startDate, endDate)

      // Dispatch custom event to update the table
      const event = new CustomEvent('updateActivityLogs', {
        detail: { logs: filteredLogs }
      })
      window.dispatchEvent(event)

      toast.success("Logs filtered successfully")
    } catch (error) {
      console.error("Error filtering logs:", error)
      toast.error("Error filtering logs")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    setIsLoading(true)
    setStartDate(undefined)
    setEndDate(undefined)

    try {
      const allLogs = await fetchAllLogs()

      // Dispatch custom event to update the table with all logs
      const event = new CustomEvent('updateActivityLogs', {
        detail: { logs: allLogs }
      })
      window.dispatchEvent(event)

      toast.success("Filter reset, showing all logs")
    } catch (error) {
      console.error("Error resetting filter:", error)
      toast.error("Error resetting filter")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Date Range Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center sm:flex-row gap-4 sm:items-end">

            <div className="flex-1 space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="start-date"
                    className="w-full justify-between font-normal"
                  >
                    {startDate ? startDate.toLocaleDateString() : "Select start date"}
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date)
                      setStartDateOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="end-date"
                    className="w-full justify-between font-normal"
                  >
                    {endDate ? endDate.toLocaleDateString() : "Select end date"}
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date)
                      setEndDateOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                <SearchIcon className="h-4 w-4" />
                {isLoading ? "Loading..." : "View Logs"}
              </Button>

              <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
                Reset
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}