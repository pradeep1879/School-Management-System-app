import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Pencil,
  Trash2,
  Eye,
  Users,
  GraduationCap,
  User,
} from "lucide-react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import UpdateClass from "./UpdateClass"
import { useState } from "react"
import DeleteClassDialog from "./DeleteClassDialog"

import { useDeleteClass } from "../hooks/useDeleteClass"

interface ClassCardProps {
  className: string
  classId: string,
  section: string
  session: string
  classTeacher: string
  students?: number
  onUpdate?: () => void
  onDelete?: () => void
  onView?: () => void
}

const ClassCard = ({
  className,
  classId,
  section,
  session,
  classTeacher,
  students,
  onView,
}: ClassCardProps) => {

  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutateAsync: handleDeleteClass, isPending }  = useDeleteClass();

  return (
    <Card className="group relative overflow-hidden border border-border/50 bg-linear-to-br from-background to-muted/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      
      {/* Subtle Hover Glow */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardContent className="p-6 space-y-6 relative z-10">

        {/* Header Section */}
        <div className="flex items-start justify-between">

          {/* Left Side */}
          <div className="flex items-start gap-4">

            {/* Class Icon */}
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap size={22} />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-semibold">
                {className}
              </h3>

              <p className="text-sm text-muted-foreground">
                Section {section}
              </p>

              <p className="text-sm text-muted-foreground">
                Session {session}
              </p>

              {/* Class Teacher */}
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs bg-muted">
                    {classTeacher
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User size={14} />
                  {classTeacher}
                </div>
              </div>
            </div>
          </div>

          {/* Students Badge */}
          {students !== undefined && (
            <Badge variant="secondary" className="gap-1">
              <Users size={14} />
              {students} Students
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2"
            onClick={onView}
          >
            <Eye size={16} />
            View
          </Button>

          <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 gap-2"
              >
                <Pencil size={16} />
                Update
              </Button>
            </DialogTrigger>

            <UpdateClass classId={classId} setOpen={setUpdateOpen} />
          </Dialog>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 gap-2"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </DialogTrigger>

            <DeleteClassDialog
              className={className}
              setOpen={setDeleteOpen}
              isLoading={isPending}
              onConfirm={async () => {
                await handleDeleteClass(classId);
                setDeleteOpen(false);
              }}
            />
          </Dialog>

        </div>

      </CardContent>
    </Card>
  )
}

export default ClassCard
