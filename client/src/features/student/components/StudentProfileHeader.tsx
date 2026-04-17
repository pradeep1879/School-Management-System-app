import { Mail, Phone, Users, Pencil } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/store/auth.store"

interface Props {
  student: any
}

export default function StudentProfileHeader({ student }: Props) {
  const role = useAuthStore((state) => state.role)

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        {/* LEFT SECTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

          {/* Avatar */}
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
            <AvatarImage src={student.imageUrl} />
            <AvatarFallback className="text-lg">
              {student.studentName
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          {/* Student Info */}
          <div className="space-y-2">

            <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">
              {student.studentName}
            </h1>

            <p className="text-sm text-muted-foreground">
              Class {student.class?.slug} • Roll No: {student.rollNumber}
            </p>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="secondary">Active</Badge>

              <Badge variant="outline">
                Admission:{" "}
                {new Date(student.admissionDate).toLocaleDateString()}
              </Badge>
            </div>

            {/* Contact Information */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mt-3">

              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span className="break-all">{student.userName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={14} />
                {student.contactNo}
              </div>

              <div className="flex items-center gap-2">
                <Users size={14} />
                Parent: {student.fatherName}
              </div>

            </div>

          </div>
        </div>

        {/* ACTIONS */}
        {role === "admin" && (
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Pencil size={14} />
              Edit
            </Button>
          </div>
        )}

      </div>
    </Card>
  )
}