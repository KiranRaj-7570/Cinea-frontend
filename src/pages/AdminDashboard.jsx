import { useNavigate } from "react-router-dom";
import AdminCharts from "../components/AdminCharts";
import AdminKpis from "../components/AdminKpis";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full pt-10">
      {/* TOP BAR (only button added) */}
      <div className="flex justify-end mb-6 px-4">
        <button
          onClick={() => navigate("/home")}
          className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#FF7A1A] hover:bg-orange-500 text-black font-semibold transition"
        >
          Go to Site
        </button>
      </div>

      {/* EXISTING CONTENT (UNCHANGED) */}
      <AdminKpis />
      <AdminCharts />
    </div>
  );
};

export default AdminDashboard;
