import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { Search } from "lucide-react"
import { toast } from "sonner"

import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Skeleton } from "@/components/ui/skeleton"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import { useMarkAttendance } from "../hooks/useMarkAttendance"
import { useUpdateAttendanceSession } from "../hooks/useUpdateAttendanceSession"
import { useGetAttendanceByDate } from "../hooks/useGetAttendaceByDate"

interface Student {
  id: string
  studentName: string
  rollNumber: string
}

interface Props {
  classId: string
  students: Student[]
}

type StatusType = "ABSENT" | "LATE" | "LEAVE" | "HOLIDAY"

const statusOptions: StatusType[] = [
  "ABSENT",
  "LATE",
  "LEAVE",
  "HOLIDAY",
]

export default function MarkAttendanceDialog({
  classId,
  students,
}: Props) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const [exceptions, setExceptions] = useState<Record<string, StatusType>>({})
  const [search, setSearch] = useState("")

  const createMutation = useMarkAttendance()
  const updateMutation = useUpdateAttendanceSession()

  const { data, isLoading, isError, error } =
    useGetAttendanceByDate({
      classId,
      date: selectedDate,
      enabled: open,
    })

  const isEditMode = !!data?.sessionId
  const sessionId = data?.sessionId

  /**
   * Handle API error
   */
  useEffect(() => {
    if (!isError) return

    const err: any = error

    if (err?.response?.status === 404) return

    toast.error(
      err?.response?.data?.message ||
        "Failed to fetch attendance"
    )
  }, [isError, error])

  /**
   * Prefill attendance (Edit mode)
   */
  useEffect(() => {
    if (data?.attendance) {
      const existing: Record<string, StatusType> = {}

      data.attendance.forEach((item: any) => {
        if (item.status !== "PRESENT") {
          existing[item.student.id] = item.status
        }
      })

      setExceptions(existing)
    } else {
      setExceptions({})
    }
  }, [data])

  /**
   * Filter students
   */
  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.studentName
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [search, students])

  /**
   * Toggle status
   */
  const handleStatusChange = (
    studentId: string,
    status: StatusType
  ) => {
    setExceptions((prev) => {
      const copy = { ...prev }

      if (copy[studentId] === status) {
        delete copy[studentId]
      } else {
        copy[studentId] = status
      }

      return copy
    })
  }

  /**
   * Clear selection
   */
  const handleClear = () => {
    setExceptions({})
  }

  /**
   * Mark all absent
   */
  const handleMarkAllAbsent = () => {
    const allAbsent: Record<string, StatusType> = {}

    students.forEach((s) => {
      allAbsent[s.id] = "ABSENT"
    })

    setExceptions(allAbsent)
  }

  /**
   * Summary calculation
   */
  const summary = useMemo(() => {
    const total = students.length

    const counts = {
      ABSENT: 0,
      LATE: 0,
      LEAVE: 0,
      HOLIDAY: 0,
    }

    for (const status of Object.values(exceptions)) {
      counts[status]++
    }

    const present =
      total -
      (counts.ABSENT +
        counts.LATE +
        counts.LEAVE +
        counts.HOLIDAY)

    return {
      total,
      present,
      absent: counts.ABSENT,
      late: counts.LATE,
      leave: counts.LEAVE,
      holiday: counts.HOLIDAY,
    }
  }, [exceptions, students])

  /**
   * Submit attendance
   */
  const handleSubmit = () => {
    const exceptionArray = Object.entries(exceptions).map(
      ([studentId, status]) => ({
        studentId,
        status,
      })
    )

    const safeDate = new Date(selectedDate)
    safeDate.setHours(0, 0, 0, 0)

    if (isEditMode && sessionId) {
      updateMutation.mutate(
        {
          sessionId,
          exceptions: exceptionArray,
        },
        {
          onSuccess: () => {
            setOpen(false)
            setExceptions({})
          },
        }
      )
    } else {
      createMutation.mutate(
        {
          classId,
          date: format(safeDate, "yyyy-MM-dd"),
          exceptions: exceptionArray,
        },
        {
          onSuccess: () => {
            setOpen(false)
            setExceptions({})
          },
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          Mark Attendance
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh]  overflow-hidden flex flex-col">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? "Update Attendance"
              : "Mark Attendance"}
          </DialogTitle>
        </DialogHeader>

        {/* DATE PICKER */}
        <div className="flex flex-wrap gap-3 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
              >
                {format(
                  selectedDate,
                  "EEEE, dd MMM yyyy"
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) =>
                  date && setSelectedDate(date)
                }
                disabled={(date) =>
                  date > new Date() ||
                  date < new Date("2024-01-01")
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* SEARCH + ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">

          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search student..."
              className="pl-8"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <Button
            variant="secondary"
            onClick={handleClear}
          >
            Clear
          </Button>

          <Button
            variant="destructive"
            onClick={handleMarkAllAbsent}
          >
            Mark All Absent
          </Button>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">

          <Badge variant="outline">
            Total: {summary.total}
          </Badge>

          <Badge className="bg-green-500">
            Present: {summary.present}
          </Badge>

          <Badge className="bg-red-500">
            Absent: {summary.absent}
          </Badge>

          <Badge className="bg-yellow-500">
            Late: {summary.late}
          </Badge>

          <Badge className="bg-blue-500">
            Leave: {summary.leave}
          </Badge>

          <Badge className="bg-purple-500">
            Holiday: {summary.holiday}
          </Badge>
        </div>

        {/* STUDENT LIST */}
        <div className="custom-scrollbar mt-5 flex-1 space-y-3 overflow-y-auto pr-2">

          {isLoading ? (
            <>
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-lg p-3 gap-3"
              >
                {/* STUDENT INFO */}
                <div>
                  <p className="font-medium">
                    {student.studentName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Roll: {student.rollNumber}
                  </p>
                </div>

                {/* STATUS BUTTONS */}
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Badge
                      key={status}
                      variant={
                        exceptions[student.id] ===
                        status
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer select-none"
                      onClick={() =>
                        handleStatusChange(
                          student.id,
                          status
                        )
                      }
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER ACTION */}
        <div className="flex justify-end pt-4 border-t mt-4">

          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto"
            disabled={
              createMutation.isPending ||
              updateMutation.isPending
            }
          >
            {createMutation.isPending ||
            updateMutation.isPending
              ? "Submitting..."
              : isEditMode
              ? "Update Attendance"
              : "Submit Attendance"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}
