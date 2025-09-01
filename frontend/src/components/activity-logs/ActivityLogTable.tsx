"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ActivityIcon, UserIcon, ClockIcon } from "lucide-react"

interface ActivityLog {
  id: string
  userName: string
  actionType: string
  actionDetails: string
  createdAt: string
}

interface ActivityLogTableProps {
  logs: ActivityLog[]
}

function getActionTypeVariant(actionType: string) {
  switch (actionType.toUpperCase()) {
    case "CREATE":
      return "default"
    case "UPDATE":
      return "secondary"
    case "DELETE":
      return "destructive"
    default:
      return "outline"
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export function ActivityLogTable({ logs: initialLogs }: ActivityLogTableProps) {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs || [])

  // Listen for custom events to update logs
  useEffect(() => {
    const handleUpdateLogs = (event: CustomEvent) => {
      setLogs(event.detail.logs)
    }

    window.addEventListener('updateActivityLogs', handleUpdateLogs as EventListener)

    return () => {
      window.removeEventListener('updateActivityLogs', handleUpdateLogs as EventListener)
    }
  }, [])

  // Update logs when initialLogs prop changes
  useEffect(() => {
    if (initialLogs) {
      setLogs(initialLogs)
    }
  }, [initialLogs])

  if (!logs || !Array.isArray(logs) || logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="h-5 w-5" />
            Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ActivityIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No activity logs found</p>
            <p className="text-sm">Try adjusting your date range or check back later.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ActivityIcon className="h-5 w-5" />
          Activity Logs ({logs.length} {logs.length === 1 ? "entry" : "entries"})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Staff
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="min-w-[300px]">Action Details</TableHead>
                <TableHead className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{log.userName}</TableCell>
                  <TableCell>
                    <Badge variant={getActionTypeVariant(log.actionType)}>{log.actionType}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="break-words text-sm leading-relaxed">{log.actionDetails}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}