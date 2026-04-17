import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { Loader2 } from "lucide-react"
import { useUpdateTeacherUsername } from "../../hooks/useUpdateTeacherProfile"


interface Props {
  teacher: any
}

interface FormData {
  email: string
}

const TeacherAccountSetting = ({ teacher }: Props) => {

  const { mutate, isPending } = useUpdateTeacherUsername()

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: teacher?.email
    }
  })

  const onSubmit = (data: FormData) => {
    mutate(data.email)
  }

  return (

    <Card>

      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>

      <CardContent>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >

          <div>
            <label className="text-sm font-medium">
              Username
            </label>

            <Input {...register("email")} required/>
          </div>

          <div>
            <label className="text-sm font-medium">
              Teacher Name
            </label>

            <Input value={teacher?.teacherName} disabled />

            <p className="text-xs text-muted-foreground">
              Name cannot be changed
            </p>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving
                </span>
              ) : (
                "Save Changes"
              )}
          </Button>

        </form>

      </CardContent>

    </Card>
  )
}

export default TeacherAccountSetting