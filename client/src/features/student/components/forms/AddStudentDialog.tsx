import  { useForm } from "react-hook-form"
import { useState } from "react"
import { Eye, EyeOff, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useCreateStudent } from "../../hooks/useCreateStudent"
import { useClassDropdown } from "@/features/class/hooks/useClassDropDown"
import { formatClassLabel } from "@/features/class/utils/classLabels"

interface Props {
  setOpen: (v: boolean) => void
}

const AddStudentDialog = ({ setOpen }: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedSession, setSelectedSession] =
    useState("ALL")

  const { register, handleSubmit, setValue, reset, watch } =
    useForm()
  const { mutate, isPending } = useCreateStudent()
  const { data, isLoading } = useClassDropdown()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const sessionOptions: string[] = Array.from(
    new Set(
      (data?.classes || []).map(
        (cls: any) => cls.session
      )
    )
  )
  const filteredClasses = (data?.classes || []).filter(
    (cls: any) =>
      selectedSession === "ALL" ||
      cls.session === selectedSession
  )

  const onSubmit = (data: any) => {
    if (!imageFile) {
      toast.error("Please upload student photo")
      return
    }

    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })

    formData.append("image", imageFile)

    mutate(formData, {
      onSuccess: () => {
        reset()
        setPreview(null)
        setOpen(false)
      },
    })
  }

  return (
    <DialogContent className="max-w-3xl max-h-[60vh]  overflow-y-auto custom-scrollbar">

      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          Add New Student
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* ACCOUNT INFO */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input {...register("studentName")} placeholder="Student name" />
            </Field>

            <Field>
              <FieldLabel>User Name</FieldLabel>
              <Input {...register("userName")} placeholder="Unique username" />
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  disabled={isPending}
                  placeholder="Strong password"
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

            <Field>
              <FieldLabel>Roll Number</FieldLabel>
              <Input {...register("rollNumber")} placeholder="01" />
            </Field>

          </div>
        </div>

        {/* PERSONAL INFO */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Personal Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <Field>
              <FieldLabel>Parent Name</FieldLabel>
              <Input {...register("fatherName")} placeholder="Parent name" />
            </Field>

            <Field>
              <FieldLabel>Date of Birth</FieldLabel>
              <Input type="date" {...register("dateOfBirth")} />
            </Field>

            <Field>
              <FieldLabel>Gender</FieldLabel>
              <Select onValueChange={(v) => setValue("gender", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Phone</FieldLabel>
              <Input {...register("contactNo")} placeholder="9876543210" />
            </Field>

          </div>
        </div>

        {/* ACADEMIC INFO */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Academic Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <Field>
              <FieldLabel>Session Filter</FieldLabel>
              <Select
                value={selectedSession}
                onValueChange={(value) => {
                  setSelectedSession(value)
                  setValue("classId", "")
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by session" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">
                    All Sessions
                  </SelectItem>
                  {sessionOptions.map((session) => (
                    <SelectItem
                      key={session}
                      value={session}
                    >
                      {session}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Class / Session</FieldLabel>

              <Select
                value={watch("classId")}
                onValueChange={(v) => setValue("classId", v)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>

                <SelectContent>
                  {filteredClasses.map((cls: any) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {formatClassLabel(cls)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </Field>

            <Field>
              <FieldLabel>Admission Date</FieldLabel>
              <Input type="date" {...register("admissionDate")} />
            </Field>

          </div>
        </div>

        {/* ADDRESS */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Address
          </h3>

          <Field>
            <FieldLabel>Full Address</FieldLabel>
            <Input {...register("address")} placeholder="Full address" />
          </Field>
        </div>

        {/* IMAGE */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Profile Image
          </h3>

          <Field>
            <div className="flex items-center gap-4">

              <Input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setImageFile(file)
                    setPreview(URL.createObjectURL(file))
                  }
                }}
                className="cursor-pointer"
              />

              <Upload className="h-4 w-4 text-muted-foreground" />

            </div>

            {preview && (
              <div className="mt-3 flex items-center gap-3 p-3 border rounded-lg bg-muted/30 w-fit">
                <img
                  src={preview}
                  alt="preview"
                  className="h-16 w-16 rounded-md object-cover"
                />
                <span className="text-sm text-muted-foreground">
                  Image preview
                </span>
              </div>
            )}

          </Field>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">

          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Creating Student..." : "Create Student"}
          </Button>

        </div>

      </form>
    </DialogContent>
  )
}

export default AddStudentDialog
