import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCollectPayment } from "../hooks/useCollectPayment"

interface Props {
  installmentId: string
  maxAmount: number
  studentId: string
}
type PaymentMethod = "CASH" | "BANK_TRANSFER" | "UPI" | "CARD"
  


const CollectPaymentDialog = ({
  installmentId,
  maxAmount,
  studentId,
}: Props) => {
  const [open, setOpen] = useState(false)
  const [amountPaid, setAmountPaid] = useState<number>(maxAmount)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH")

  const { mutate, isPending } =
    useCollectPayment(studentId)

  useEffect(() => {
    if (open) {
      setAmountPaid(maxAmount)
    }
  }, [open, maxAmount])

  const handleSubmit = () => {
    if (amountPaid <= 0 || amountPaid > maxAmount) {
      return
    }

    mutate(
      {
        installmentId,
        amountPaid,
        paymentMethod,
      },
      {
        onSuccess: () => {
          setOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          Collect
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Collect Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <p className="text-sm text-muted-foreground">
              Installment Amount
            </p>
            <Input
              type="number"
              value={amountPaid}
              min={0}
              max={maxAmount}
              step={1}
              onWheel={(e) =>
                (e.currentTarget as HTMLInputElement).blur()
              }
              onChange={(e) =>
                setAmountPaid(Number(e.target.value))
              }
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Payment Method
            </p>
            <Select
              onValueChange={(value: PaymentMethod) =>
                setPaymentMethod(value)
              }
              defaultValue="CASH"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">
                  Cash
                </SelectItem>
                <SelectItem value="UPI">
                  UPI
                </SelectItem>
                <SelectItem value="CARD">
                  Card
                </SelectItem>
                <SelectItem value="BANK_TRANSFER">
                  Bank Transfer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={
              isPending ||
              amountPaid <= 0 ||
              amountPaid > maxAmount
            }
            className="w-full"
          >
            {isPending
              ? "Processing..."
              : "Confirm Payment"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CollectPaymentDialog
