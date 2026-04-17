import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Props {
  student: any
}

const ProfileHeader = ({ student }: Props) => {
  return (
    <div className="flex items-center gap-4">

      <Avatar className="h-20 w-20">
        <AvatarImage src={student?.imageUrl} />
        <AvatarFallback>
          {student?.studentName?.slice(0,2)}
        </AvatarFallback>
      </Avatar>

      <div>
        <h2 className="text-xl font-semibold">
          {student?.studentName}
        </h2>

        <p className="text-sm text-muted-foreground">
          Roll No: {student?.rollNumber}
        </p>

        <p className="text-sm text-muted-foreground">
          Class {student?.class?.slug} - {student?.class?.section}
        </p>
      </div>

    </div>
  )
}

export default ProfileHeader