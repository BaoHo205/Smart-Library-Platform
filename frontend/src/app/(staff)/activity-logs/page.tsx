import { ActivityLogTable } from "@/components/activity-logs/ActivityLogTable"
import { DateRangeFilter } from "@/components/activity-logs/DateRangeFilter"
import { cookies } from "next/headers"

interface ActivityLog {
  id: string
  userName: string
  actionType: string
  actionDetails: string
  createdAt: string
}

async function fetchAllLogs(): Promise<ActivityLog[]> {
  try {
    const url = "http://localhost:5000/api/v1/staff/logs"
    
    // Get cookies from the server request
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')

    const response = await fetch(url, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `accessToken=${accessToken?.value || ''}` 
      }
    })

    const data = await response.json()
    console.log("Fetched all activity logs:", data)
    return data.data || []
  } catch (error) {
    console.log("Error fetching activity logs:", error)
    return []
  }
}


export default async function ActivityLogPage() {
  // Fetch all logs by default on initial page load
  const logs = await fetchAllLogs()

  return (
    <div className="container mx-auto py-8 px-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
      </div>

      <DateRangeFilter />

      <ActivityLogTable logs={logs} />
    </div>
  )
}