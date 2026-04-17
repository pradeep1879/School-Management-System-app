import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClassDropdown } from "@/features/class/hooks/useClassDropDown";
import { useCreateFeeStructure } from "../hooks/useCreateFeeStructure";

interface Props {
  onCreated?: (id: string) => void;
}

const FeeStructureForm = ({ onCreated }: Props) => {
  const { data, isLoading } = useClassDropdown();
  const { mutate, isPending } = useCreateFeeStructure();

  const [classId, setClassId] = useState("");
  const [session, setSession] = useState("");
  const [lateFeeType, setLateFeeType] =
    useState<"NONE" | "FIXED" | "DAILY">("NONE");
  const [lateFeeAmount, setLateFeeAmount] = useState(0);

  const isFormValid =
    classId !== "" &&
    session.trim() !== "" &&
    (lateFeeType === "NONE" || lateFeeAmount > 0);

  const handleSubmit = () => {
    if (!isFormValid) return;

    mutate(
      {
        classId,
        session,
        lateFeeType,
        lateFeeAmount:
          lateFeeType === "NONE" ? 0 : lateFeeAmount,
      },
      {
        onSuccess: (data: any) => {
          onCreated?.(data?.structure.id);
        },
      }
    );
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle>Create Fee Structure</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure fee structure for a specific class and session.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">

        {/* Structure Name */}

        {/* Class Select */}
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {data?.classes?.map((cls: any) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.slug} - {cls.section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Session */}
        <Input
          placeholder="Session (e.g. 2025-26)"
          value={session}
          onChange={(e) => setSession(e.target.value)}
        />

        {/* Late Fee Type */}
        <Select
          value={lateFeeType}
          onValueChange={(val: any) => {
            setLateFeeType(val);
            if (val === "NONE") setLateFeeAmount(0);
          }}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Late Fee Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">No Late Fee</SelectItem>
            <SelectItem value="FIXED">Fixed Amount</SelectItem>
            <SelectItem value="DAILY">Daily Charge</SelectItem>
          </SelectContent>
        </Select>

        {/* Late Fee Amount */}
        <Input
          type="number"
          placeholder="Late Fee Amount"
          value={lateFeeAmount}
          onChange={(e) =>
            setLateFeeAmount(Number(e.target.value))
          }
          disabled={lateFeeType === "NONE"}
          className={
            lateFeeType === "NONE"
              ? "opacity-50 cursor-not-allowed"
              : ""
          }
        />

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isPending}
          className="w-full h-11"
        >
          {isPending ? "Creating..." : "Create Structure"}
        </Button>

      </CardContent>
    </Card>
  );
};

export default FeeStructureForm;