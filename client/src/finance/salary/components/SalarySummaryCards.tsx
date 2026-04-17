import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Banknote, CheckCircle2, Clock, Users } from "lucide-react";

import { useTeacherSalaries } from "../hooks/useTeacherSalaries";

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export default function SalarySummaryCards() {
  const { data, isLoading } = useTeacherSalaries();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    );
  }

  const salaries = data || [];

  const totalPayroll = salaries.reduce(
    (acc: number, item: any) => acc + item.finalSalary,
    0
  );

  const paidPayroll = salaries
    .filter((s: any) => s.status === "PAID")
    .reduce((acc: number, item: any) => acc + item.finalSalary, 0);

  const pendingPayroll = salaries
    .filter((s: any) => s.status !== "PAID")
    .reduce((acc: number, item: any) => acc + item.finalSalary, 0);

  const teachersCount = salaries.length;

  const cards = [
    {
      title: "Total Payroll",
      value: formatCurrency(totalPayroll),
      icon: Banknote,
    },
    {
      title: "Paid",
      value: formatCurrency(paidPayroll),
      icon: CheckCircle2,
    },
    {
      title: "Pending",
      value: formatCurrency(pendingPayroll),
      icon: Clock,
    },
    {
      title: "Teachers",
      value: teachersCount,
      icon: Users,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {card.title}
              </CardTitle>

              <Icon size={18} className="text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-2xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}