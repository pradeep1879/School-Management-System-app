import GradeDistributionChart from "../../analytics/GradeDistributionChart";


const ClassAnalyticsSection = ({ examId }: { examId: string }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <GradeDistributionChart examId={examId} />
    </div>
  );
};

export default ClassAnalyticsSection;