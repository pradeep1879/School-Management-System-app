import { useState } from "react";
import FeeStructureForm from "../components/FeeStructureForm";
import FeeComponentForm from "../components/FeeComponentForm";
import GenerateInstallmentButton from "../components/GenerateInstallmentButton";

const AdminFeeSetupPage = () => {
  const [structureId, setStructureId] = useState("");

  return (
    <div className="px-3 space-y-6">
      <h1 className="text-3xl font-bold">
        Finance · Setup
      </h1>

      {/* 1️⃣ Create Structure */}
      <FeeStructureForm onCreated={setStructureId} />
      {/*  Add Component */}
      {structureId && (
        <FeeComponentForm feeStructureId={structureId} />
      )}

      {structureId && (
      <GenerateInstallmentButton structureId={structureId} />
      )}
    </div>
  );
};

export default AdminFeeSetupPage;