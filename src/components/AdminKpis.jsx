import { useEffect, useState } from "react";
import api from "../api/axios";
import KpiCard from "./KpiCard";

const AdminKpis = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/kpis")
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[90px] bg-[#111] rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <KpiCard label="Total Bookings" value={data.totalBookings} />
      <KpiCard label="Total Revenue" value={`₹ ${data.totalRevenue}`} />
      <KpiCard label="Active Movies" value={data.activeMovies} />
      <KpiCard label="Active Theatres" value={data.activeTheatres} />
    </div>
  );
};

export default AdminKpis;
