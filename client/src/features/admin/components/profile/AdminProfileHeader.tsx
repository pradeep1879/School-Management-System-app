import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Props {
  admin: any
}

const AdminProfileHeader = ({ admin }: Props) => {
  return (
    <div className="flex items-center gap-4">

      <Avatar className="h-20 w-20">
        <AvatarImage src={admin?.imageUrl} />
        <AvatarFallback className="text-3xl font-bold">
          {admin?.name?.split(" ").map((word:string) => word.charAt(0).toUpperCase()).join("")}
        </AvatarFallback>
      </Avatar>

      <div>
        <h2 className="text-xl font-semibold">
          {admin?.name}
        </h2>

        <p className="text-sm text-muted-foreground">
        {admin?.email}
        </p>
      </div>

    </div>
  )
}

export default AdminProfileHeader