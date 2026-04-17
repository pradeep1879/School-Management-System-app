  import { Badge } from "@/components/ui/badge";
  import CollectPaymentDialog from "./CollectFeeDialog";
  import { useAuthStore } from "@/store/auth.store";

  interface Props {
    installments: any[];
    studentId: string;
  }

  const   InstallmentTable = ({ installments, studentId }: Props) => {
    const formatCurrency = (amount?: number) =>`₹${(amount || 0).toLocaleString()}`;
    const { role } = useAuthStore();
    

    return (
      <div className="space-y-3">
        {installments?.map((inst) => (
        <div
          key={inst.id}
          className="flex justify-between items-center border p-4 rounded-xl hover:bg-muted/30 transition"
        >
        {/* LEFT SIDE */}
        <div className="space-y-1">
          <p className="font-semibold text-sm md:text-lg">{inst.title}</p>

          <p className="text-xs text-muted-foreground">
            Due:{" "}
            {new Date(inst.dueDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>

          {/* Due amount */}
          <p className="text-xs">
            Due Amount:{" "}
            <span className="font-medium text-destructive">
              {formatCurrency(inst.dueAmount)}
            </span>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-left text-muted-foreground">Total</p>
            <p className="font-semibold text-sm md:text-md">{formatCurrency(inst.amount)}</p>
          </div>

          <Badge
            className={
              inst.status === "PAID"
                ? "bg-green-100 text-green-600"
                : inst.status === "OVERDUE"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-600"
            }
          >
            {inst.status}
          </Badge>

          {role === "admin" && inst.status !== "PAID" && (
            <CollectPaymentDialog
              installmentId={inst.id}
              maxAmount={inst.dueAmount}
              studentId={studentId}
            />
          )}
        </div>
      </div>
    ))}
  </div>
    );
  };

  export default InstallmentTable;