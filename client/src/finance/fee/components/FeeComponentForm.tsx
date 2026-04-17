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
  const [isOptional, setIsOptional] = useState(false);

  const handleSubmit = () => {
    if (!name || !amount) return;

    mutate({
      feeStructureId,
      name,
      amount,
      frequency,
      isOptional,
    });
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
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(Number(e.target.value))
          }
        />

        <Select
          value={frequency}
          onValueChange={(val: any) =>
            setFrequency(val)
          }
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

        <div className="flex items-center gap-2">
          <Switch
            checked={isOptional}
            onCheckedChange={setIsOptional}
          />
          <Label>Optional Component</Label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Adding..." : "Add Component"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeeComponentForm;