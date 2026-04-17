import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGenerateInstallments } from "../hooks/useGenerateInstallments";

interface Props {
  structureId: string;
}

const GenerateInstallmentButton = ({ structureId }: Props) => {
  const { mutate, isPending } = useGenerateInstallments();

  const handleGenerate = () => {
    if (!structureId) return;
    mutate(structureId);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Button
          onClick={handleGenerate}
          disabled={!structureId || isPending}
          className="w-full"
        >
          {isPending
            ? "Generating..."
            : "Generate Installments"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GenerateInstallmentButton;