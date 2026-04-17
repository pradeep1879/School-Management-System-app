

import GlobalFinanceCards from "../components/GlobalFinanceCards";
import ClassCollectionTable from "../components/ClassCollectionTable";
import OverdueStudentsCard from "../components/OverdueStudentsCard";

import { useAdminFinanceSummary } from "../hooks/useAdminFinanceSummary";


import AdminFeeDashboardSkeleton from "../skeletons/AdminFeeDashboardSkeleton";
import { useFinanceDashboard } from "../hooks/analytics/useFinanceDashboard";
import ClassCollectionChart from "../analytics/ClassCollectionChart";
import MonthlyCollectionChart from "../analytics/MonthlyCollectionChart";
import PaymentMethodChart from "../analytics/PaymentMethodChart";
import RecentPayments from "../analytics/RecentPayments";




const AdminFeeDashboard = () => {

  const { data, isLoading } = useAdminFinanceSummary();

  const {
    isLoading: chartsLoading,
  } = useFinanceDashboard();

  console.log("admin fee DAshboard", data);

  if (isLoading) return <AdminFeeDashboardSkeleton />;

  return (
    <div className="sm:px-3 space-y-6">

      <h1 className="text-3xl font-bold">Finance Dashboard</h1>

      {/* FINANCE CARDS */}

      <GlobalFinanceCards
        totalRevenue={data?.totalRevenue}
        totalCollected={data?.totalCollected}
        totalDue={data?.totalDue}
        todayCollection={data?.todayCollection}
      />

      {/* CHARTS */}

      {!chartsLoading && (
        <div className="grid lg:grid-cols-2 gap-6">

          <ClassCollectionChart
          data={data?.classes}
          />

          <PaymentMethodChart
          payments={data?.recentPayments}
          />

          <MonthlyCollectionChart
          payments={data?.recentPayments}
          />

          <RecentPayments
          data={data?.recentPayments}
          />

          </div>
      )}

      {/* TABLES */}

      <ClassCollectionTable classes={data?.classes} />

      <OverdueStudentsCard overdueList={data?.overdueList} />

    </div>
  );
};

export default AdminFeeDashboard;