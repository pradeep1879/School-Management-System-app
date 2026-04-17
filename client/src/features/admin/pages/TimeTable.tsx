import {
  Clock,
  Sun,
  Coffee,
  School,
  Bus,
  Pencil,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const schoolSchedule = [
  {
    title: "School Opens",
    time: "08:00 AM",
    icon: Sun,
  },
  {
    title: "Morning Assembly",
    time: "08:10 AM - 08:30 AM",
    icon: School,
  },
  {
    title: "Classes Start",
    time: "08:30 AM",
    icon: Clock,
  },
  {
    title: "Short Break",
    time: "10:30 AM - 10:45 AM",
    icon: Coffee,
  },
  {
    title: "Lunch Break",
    time: "12:30 PM - 01:00 PM",
    icon: Coffee,
  },
  {
    title: "School Ends",
    time: "03:00 PM",
    icon: Clock,
  },
  {
    title: "Bus Departure",
    time: "03:15 PM",
    icon: Bus,
  },
]

export default function SchoolDailySchedulePage() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            School Daily Schedule
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage school working hours and bell timings
          </p>
        </div>

        <Button variant="outline" className="gap-2">
          <Pencil size={16} />
          Edit Schedule
        </Button>
      </div>

      {/* TIMELINE CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
        </CardHeader>

        <CardContent>
    <div className=" border-l-2 border-muted pl-4 space-y-6">

    {schoolSchedule.map((item, index) => (
      <div key={index} className="relative bg-muted/30 rounded-lg">

        {/* Content */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl hover:shadow-md transition">
          <p className="font-medium items-center flex gap-4">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 ">
              <item.icon className="h-5 w-5 text-primary " />
              </div>
            {item.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {item.time}
          </p>
        </div>
      </div>
    ))}

  </div>
</CardContent>
      </Card>

    </div>
  )
}