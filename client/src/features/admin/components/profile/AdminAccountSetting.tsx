import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { Loader2 } from "lucide-react"
import { useUpdateAdminEmail } from "../../hooks/useAdminUpdateProfile"



interface Props {
  admin: any
}

interface FormData {
  email: string
}

const AdminAccountSetting = ({ admin }: Props) => {

  const { mutate, isPending } = useUpdateAdminEmail()

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: admin?.email
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
              Email
            </label>

            <Input  {...register("email")} required/>
          </div>

          <div>
            <label className="text-sm font-medium">
              Admin Name
            </label>

            <Input value={admin?.name} disabled />

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

export default AdminAccountSetting