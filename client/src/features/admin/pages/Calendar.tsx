import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"


const eventColors: any = {
  holiday: "bg-red-500/10 text-red-600",
  exam: "bg-blue-500/10 text-blue-600",
  activity: "bg-green-500/10 text-green-600",
}

const initialEvents: any = {
  5: [
    { title: "Math Exam", type: "exam" },
    { title: "Science Project", type: "activity" },
  ],
  12: [{ title: "School Holiday", type: "holiday" }],
}

export default function SchoolCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, ] = useState(initialEvents)

  const { user } = useAuth();
  const isAdmin = user.role === "admin"

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  const prevMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    )
  }

  const nextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    )
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">
          School Calendar
        </h1>

       {isAdmin && (
         <Button className="gap-2">
          <Plus size={16} />
          Add Event
        </Button>
       )}
      </div>

      {/* CALENDAR CARD */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft size={18} />
          </Button>

          <CardTitle>{monthName}</CardTitle>

          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight size={18} />
          </Button>
        </CardHeader>

        <CardContent>
          {/* DAYS HEADER */}
          <div className="grid grid-cols-7 text-sm font-medium text-muted-foreground mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div key={day} className="text-center">
                  {day}
                </div>
              )
            )}
          </div>

          {/* DATE GRID */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty Cells */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={i}></div>
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const dayEvents = events[day] || []

              return (
                <div
                  key={day}
                  className="border rounded-xl p-2 min-h-22.5 hover:bg-muted/40 transition cursor-pointer"
                >
                  <div className="text-sm font-medium mb-1">
                    {day}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.map((event: any, idx: number) => (
                      <Badge
                        key={idx}
                        className={`${eventColors[event.type]} text-xs w-full justify-start`}
                      >
                        {event.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}