import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Eye, EyeOff, Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { useCreateTeacher } from "@/features/teacher/hooks/useCreateTeacher"

interface AddTeacherProps {
  setOpen: (value: boolean) => void
}

interface TeacherFormData {
  teacherName: string
  email: string
  password: string
  contactNo: string
  experience: string
  baseSalary: string
  perDaySalary: string
  image: FileList
}

const AddTeacher = ({ setOpen }: AddTeacherProps) => {
  const { register, handleSubmit, reset, watch } = useForm<TeacherFormData>()

  const { mutate, isPending } = useCreateTeacher()
  const [showPassword, setShowPassword] = useState(false)

  const imageFile = watch("image")

  const onSubmit = (data: TeacherFormData) => {
    if (!data.image?.[0]) {
      toast.error("Please select an image")
      return
    }

    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "image") formData.append(key, value as string)
    })

    formData.append("image", data.image[0])

    mutate(formData, {
      onSuccess: (res: any) => {
        toast.success(res.message)
        reset()
        setOpen(false)
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Something went wrong"
        )
      },
    })
  }

  return (
    <DialogContent className="max-h-[60vh] overflow-y-auto custom-scrollbar sm:max-w-130">

      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          Add New Teacher
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <FieldGroup>

          {/* Name */}
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              {...register("teacherName")}
              placeholder="Teacher name"
              disabled={isPending}
            />
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              {...register("email")}
              placeholder="teacher@email.com"
              disabled={isPending}
            />
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel>Password</FieldLabel>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                disabled={isPending}
                placeholder="Enter password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

          </Field>

          {/* Phone */}
          <Field>
            <FieldLabel>Phone Number</FieldLabel>
            <Input
              {...register("contactNo")}
              placeholder="9876543210"
              disabled={isPending}
            />
          </Field>

          {/* Experience */}
          <Field>
            <FieldLabel>Experience</FieldLabel>
            <Input
              {...register("experience")}
              placeholder="e.g. 5 years"
              disabled={isPending}
            />
          </Field>

          {/* Salary Section */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Salary Details</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Base Salary</FieldLabel>
                <Input
                  type="number"
                  {...register("baseSalary")}
                  placeholder="30000"
                  disabled={isPending}
                />
              </Field>

              <Field>
                <FieldLabel>Per Day Salary</FieldLabel>
                <Input
                  type="number"
                  {...register("perDaySalary")}
                  placeholder="1000"
                  disabled={isPending}
                />
              </Field>
            </div>
          </div>

          {/* Image Upload */}
          <Field>
            <FieldLabel>Profile Image</FieldLabel>

            <div className="flex items-center gap-4">

              <Input
                type="file"
                accept="image/png, image/jpeg"
                {...register("image")}
                disabled={isPending}
                className="cursor-pointer"
              />

              <Upload className="h-4 w-4 text-muted-foreground" />

            </div>
          </Field>

          {/* Image Preview */}
          {imageFile?.[0] && (
            <div className="flex items-center gap-3 mt-2 p-3 border rounded-lg bg-muted/30 w-fit">
              <img
                src={URL.createObjectURL(imageFile[0])}
                alt="preview"
                className="h-16 w-16 rounded-md object-cover"
              />
              <p className="text-sm text-muted-foreground">
                Image preview
              </p>
            </div>
          )}

        </FieldGroup>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2"
        >
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {isPending ? "Creating Teacher..." : "Create Teacher"}
        </Button>

      </form>
    </DialogContent>
  )
}

export default AddTeacher