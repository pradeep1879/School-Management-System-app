import { Card, CardContent } from "@/components/ui/card";

const AnalyticsOverviewCards = ({ overview }: any) => {
  return (
    <div className="grid md:grid-cols-4 gap-4">

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Students</p>
          <p className="text-2xl font-bold">{overview?.totalStudents}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Pass</p>
          <p className="text-2xl font-bold">{overview?.passCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Fail</p>
          <p className="text-2xl font-bold">{overview?.failCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Average</p>
          <p className="text-2xl font-bold">
            {overview?.average?.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

    </div>
  );
};

export default AnalyticsOverviewCards;