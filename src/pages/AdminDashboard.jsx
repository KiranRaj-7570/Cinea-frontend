import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>

        <button
          onClick={() => navigate("/home")}
          className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#FF7A1A] hover:bg-orange-500 text-black font-semibold transition"
        >
          ← Back to Site
        </button>
      </div>

      <p className="text-slate-400 text-sm sm:text-base">
        Manage theatres, shows, pricing and schedules.
      </p>
    </div>
  );
};

export default AdminDashboard;
