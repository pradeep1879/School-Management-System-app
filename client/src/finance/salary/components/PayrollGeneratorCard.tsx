import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Wallet } from "lucide-react";

import { useGeneratePayroll } from "../hooks/useGeneratePayroll";

export default function PayrollGeneratorCard() {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());

  const { mutate, isPending } = useGeneratePayroll();

  const handleGenerate = () => {
    if (!month || !year) return;

    mutate({
      month: Number(month),
      year: Number(year),
    });
  };

  const months = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const years = [
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet size={18} />
          Generate Payroll
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row gap-4">

        {/* Month */}
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>

          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year */}
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-full md:w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>

          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isPending}
          className="gap-2"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          Generate
        </Button>
      </CardContent>
    </Card>
  );
}