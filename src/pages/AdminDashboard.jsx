import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 rounded-full bg-[#FF7A1A] text-black font-semibold"
        >
          ← Back to Site
        </button>
      </div>

      <p className="text-gray-400">
        Manage theatres, shows, pricing and schedules.
      </p>
    </div>
  );
};

export default AdminDashboard;
