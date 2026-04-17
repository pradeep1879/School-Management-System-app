import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Percent,
  CheckCircle,
  XCircle,
} from "lucide-react";

const OverviewCards = ({ overview }: any) => {

  const cards = [
    {
      title: "Students",
      value: overview.totalStudents,
      icon: Users,
      color: "border-blue-500",
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Average",
      value: `${overview.average.toFixed(1)}%`,
      icon: Percent,
      color: "border-indigo-500",
      iconBg: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Pass",
      value: overview.passCount,
      icon: CheckCircle,
      color: "border-green-500",
      iconBg: "bg-green-100 text-green-600",
    },
    {
      title: "Fail",
      value: overview.failCount,
      icon: XCircle,
      color: "border-red-500",
      iconBg: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <Card
            key={index}
            className={`border-l-4 ${card.color} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <CardContent className="p-2 px-3 md:p-4 flex items-center justify-between">

              <div>
                <p className="md:text-sm text-xs text-muted-foreground">
                  {card.title}
                </p>

                <p className="text-lg md:text-2xl  font-bold mt-1">
                  {card.value}
                </p>
              </div>

              <div
                className={`p-2 md:p-3 rounded-xl ${card.iconBg}`}
              >
                <Icon size={20} />
              </div>

            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OverviewCards;