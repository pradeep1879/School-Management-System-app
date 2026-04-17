import { useState } from "react"
import {
  BookOpen,
  CalendarDays,
  Pencil,
  Trash2,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function HomeworkTab() {
  const [homeworks] = useState([
    {
      id: 1,
      subject: "Mathematics",
      title: "Algebra Practice",
      dueDate: "2026-03-05",
      status: "Active",
    },
  ])

  return (
    <div className="space-y-8">

      {/* ================= ASSIGN HOMEWORK ================= */}
      <Card className="shadow-md border-border/60">
        <CardHeader>
          <CardTitle>Assign Homework</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-6">

          <div className="space-y-4">
            <Input placeholder="Homework Title" />

            <Input placeholder="Subject" />

            <Textarea
              placeholder="Homework Description..."
              className="min-h-25"
            />

            <Input type="date" />

            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <BookOpen size={16} />
              Assign Homework
            </Button>
          </div>

          {/* Decorative Side */}
          <div className="hidden md:flex items-center justify-center bg-muted/30 rounded-xl">
            <BookOpen className="h-24 w-24 text-muted-foreground/40" />
          </div>

        </CardContent>
      </Card>

      {/* ================= HOMEWORK LIST ================= */}
      <Card className="shadow-md border-border/60">
        <CardHeader>
          <CardTitle>Assigned Homework</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {homeworks.map((hw) => (
            <div
              key={hw.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-xl bg-muted/30 hover:shadow-md transition"
            >
              {/* Left Info */}
              <div>
                <h3 className="font-semibold text-lg">
                  {hw.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Subject: {hw.subject}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <CalendarDays size={14} />
                  Due: {hw.dueDate}
                </p>
              </div>

              {/* Status + Actions */}
              <div className="flex items-center gap-4">

                <Badge className="bg-green-500/10 text-green-600">
                  {hw.status}
                </Badge>

                <Button size="icon" variant="outline">
                  <Pencil size={14} />
                </Button>

                <Button size="icon" variant="destructive">
                  <Trash2 size={14} />
                </Button>

              </div>
            </div>
          ))}

        </CardContent>
      </Card>

    </div>
  )
}