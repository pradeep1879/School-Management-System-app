import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClassDropdown } from "@/features/class/hooks/useClassDropDown";
import { useAuthStore } from "@/store/auth.store";
import { useCreateAnnouncement } from "../hooks/useCreateAnnouncement";
import type { AnnouncementTargetType } from "../types/announcement.types";

type ClassOption = {
  id: string;
  slug: string;
  section: string;
  session: string;
};

export const AnnouncementForm = () => {
  const role = useAuthStore((state) => state.role);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] =
    useState<AnnouncementTargetType>("SCHOOL");
  const [classId, setClassId] = useState("");
  const { data: classData } = useClassDropdown();
  const createMutation = useCreateAnnouncement();
  const classes = (classData?.classes ?? []) as ClassOption[];

  useEffect(() => {
    if (role === "teacher") {
      setTargetType("CLASS");
    }
  }, [role]);

  if (role === "student") {
    return null;
  }

  const isClassTarget = targetType === "CLASS";
  const isSubmitDisabled =
    createMutation.isPending ||
    !title.trim() ||
    !message.trim() ||
    (role === "admin" && isClassTarget && !classId);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createMutation.mutate(
      {
        title: title.trim(),
        message: message.trim(),
        targetType,
        classId: isClassTarget ? classId || null : null,
      },
      {
        onSuccess: () => {
          setTitle("");
          setMessage("");
          setClassId("");
          if (role === "admin") {
            setTargetType("SCHOOL");
          }
          toast.success("Announcement sent");
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to send announcement");
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create announcement</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="announcement-title">Title</Label>
            <Input
              id="announcement-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Fee reminder, exam update, holiday notice..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="announcement-message">Message</Label>
            <Textarea
              id="announcement-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write the announcement details"
              rows={5}
            />
          </div>

          {role === "admin" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Target</Label>
                <Select
                  value={targetType}
                  onValueChange={(value) =>
                    setTargetType(value as AnnouncementTargetType)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCHOOL">Entire school</SelectItem>
                    <SelectItem value="CLASS">Specific class</SelectItem>
                    <SelectItem value="TEACHERS">Teachers only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isClassTarget && (
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select value={classId} onValueChange={setClassId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.slug} {classItem.section} ·{" "}
                          {classItem.session}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ) : (
            <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              This will be sent to students in your assigned class.
            </p>
          )}

          <Button type="submit" disabled={isSubmitDisabled}>
            {createMutation.isPending ? "Sending..." : "Send announcement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
