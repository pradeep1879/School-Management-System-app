import { useState } from "react";

import { useNavigate } from "react-router-dom";
// import { adminSignup } from "../../services/admin.service";

const AdminSignup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    // await adminSignup(form);
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Admin Register</h2>

        <input
          className="border w-full p-2 mb-3"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border w-full p-2 mb-3"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="border w-full p-2 mb-4"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white w-full p-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default AdminSignup;
