import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { useAddFeeComponent } from "../hooks/useAddFeeComponent";

interface Props {
  feeStructureId: string;
}

const FeeComponentForm = ({ feeStructureId }: Props) => {
  const { mutate, isPending } = useAddFeeComponent();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [frequency, setFrequency] = useState<
    "MONTHLY" | "QUARTERLY" | "YEARLY" | "ONE_TIME"
  >("MONTHLY");
  const [dueDay, setDueDay] = useState(10);
  const [dueMonth, setDueMonth] = useState(3);
  const [isOptional, setIsOptional] = useState(false);

  const requiresDueMonth = frequency !== "MONTHLY";
  const isFormValid =
    name.trim() !== "" &&
    amount > 0 &&
    dueDay >= 1 &&
    dueDay <= 31 &&
    (!requiresDueMonth ||
      (dueMonth >= 1 && dueMonth <= 12));

  const handleSubmit = () => {
    if (!isFormValid) return;

    mutate(
      {
        feeStructureId,
        name: name.trim(),
        amount,
        frequency,
        dueDay,
        dueMonth: requiresDueMonth ? dueMonth : undefined,
        isOptional,
      },
      {
        onSuccess: () => {
          setName("");
          setAmount(0);
          setFrequency("MONTHLY");
          setDueDay(10);
          setDueMonth(3);
          setIsOptional(false);
        },
      }
    );
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <Input
          placeholder="Component Name (e.g. Tuition)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          type="text"
          inputMode="numeric"
          placeholder="Amount"
          value={amount === 0 ? "" : String(amount)}
          onChange={(e) => {
            const numericValue =
              e.target.value.replace(/[^\d]/g, "");

            setAmount(
              numericValue === ""
                ? 0
                : Number(numericValue)
            );
          }}
        />

        <Select
          value={frequency}
          onValueChange={(val: any) => {
            setFrequency(val);

            if (val === "MONTHLY") {
              setDueDay(10);
            } else if (val === "QUARTERLY") {
              setDueDay(20);
              setDueMonth(3);
            } else {
              setDueDay(20);
              setDueMonth(3);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MONTHLY">
              Monthly
            </SelectItem>
            <SelectItem value="QUARTERLY">
              Quarterly
            </SelectItem>
            <SelectItem value="YEARLY">
              Yearly
            </SelectItem>
            <SelectItem value="ONE_TIME">
              One Time
            </SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Due Day (1-31)"
          value={dueDay}
          min={1}
          max={31}
          step={1}
          onWheel={(e) =>
            (e.currentTarget as HTMLInputElement).blur()
          }
          onChange={(e) =>
            setDueDay(Number(e.target.value))
          }
        />

        {requiresDueMonth && (
          <Select
            value={String(dueMonth)}
            onValueChange={(value) =>
              setDueMonth(Number(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Due Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">January</SelectItem>
              <SelectItem value="2">February</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">June</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
            </SelectContent>
          </Select>
        )}

        <p className="text-sm text-muted-foreground">
          {frequency === "MONTHLY" &&
            "This component will be due on the selected day every month."}
          {frequency === "QUARTERLY" &&
            "This component will be generated every 3 months starting from the selected month."}
          {frequency === "YEARLY" &&
            "This component will be due once a year on the selected month and day."}
          {frequency === "ONE_TIME" &&
            "This component will be due once on the selected month and day."}
        </p>

        <div className="flex items-center gap-2">
          <Switch
            checked={isOptional}
            onCheckedChange={setIsOptional}
          />
          <Label>Optional Component</Label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isPending}
          className="w-full"
        >
          {isPending ? "Adding..." : "Add Component"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeeComponentForm;
