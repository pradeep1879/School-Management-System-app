import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useUpdateUsername } from "../../hooks/useUpdateStudentProfile"
import { Loader2 } from "lucide-react"


interface Props {
  student: any
}

interface FormData {
  userName: string
}

const AccountSettingsCard = ({ student }: Props) => {

  const { mutate, isPending } = useUpdateUsername()

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      userName: student?.userName
    }
  })

  const onSubmit = (data: FormData) => {
    mutate(data.userName)
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

            <Input {...register("userName")} required/>
          </div>

          <div>
            <label className="text-sm font-medium">
              Student Name
            </label>

            <Input value={student?.studentName} disabled />

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

export default AccountSettingsCard