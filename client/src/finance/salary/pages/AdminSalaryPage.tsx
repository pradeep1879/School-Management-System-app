import PayrollGeneratorCard from "../components/PayrollGeneratorCard";
import SalarySummaryCards from "../components/SalarySummaryCards";
import SalaryTable from "../components/SalaryTable";

export default function AdminSalaryPage() {
  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Salary Management
        </h1>

        <p className="text-muted-foreground text-sm mt-1">
          Generate payroll, track teacher salaries and manage payments.
        </p>
      </div>

      {/* Payroll Generator */}
      <PayrollGeneratorCard />

      {/* Summary Cards */}
      <SalarySummaryCards />

      {/* Salary Table */}
      <SalaryTable />

    </div>
  );
}