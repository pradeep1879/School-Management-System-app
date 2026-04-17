import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Props {
  teacher: any
}

const TeacherProfileHeader = ({ teacher }: Props) => {
  return (
    <div className="flex items-center gap-4">

      <Avatar className="h-20 w-20">
        <AvatarImage src={teacher?.imageUrl} />
        <AvatarFallback>
          {teacher?.teacherName?.slice(0,2)}
        </AvatarFallback>
      </Avatar>

      <div>
        <h2 className="text-xl font-semibold">
          {teacher?.teacherName}
        </h2>

        <p className="text-sm text-muted-foreground">
        {teacher?.email}
        </p>
      </div>

    </div>
  )
}

export default TeacherProfileHeader