import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";

const AdminCharts = () => {
  const [data, setData] = useState({
  revenueByDate: [],
  seatsByDate: [],
  topMovies: [],
});
const [movieTitles, setMovieTitles] = useState({});

  useEffect(() => {
    api.get("/admin/charts/overview").then((res) => {
      setData(res.data);
    });
  }, []);
  useEffect(() => {
  if (!data.topMovies?.length) return;

  const loadTitles = async () => {
    const map = {};

    await Promise.all(
      data.topMovies.map(async (m) => {
        try {
          const res = await api.get(`/movies/details/${m._id}`);
          map[m._id] = res.data.title;
        } catch {
          map[m._id] = `Movie ${m._id}`;
        }
      })
    );

    setMovieTitles(map);
  };

  loadTitles();
}, [data.topMovies]);


  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Revenue */}
      <div className="bg-[#111] rounded-2xl p-5 border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.revenueByDate}>
            <defs>
              <linearGradient
                id="revenueAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#FF7A1A" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#FF7A1A" stopOpacity={0.08} />
              </linearGradient>
            </defs>

            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />

            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: "#0b0b0b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#F6E7C6" }}
              itemStyle={{ color: "#FF7A1A" }}
            />

            {/* 🌊 AREA (NOW VISIBLE) */}
            <Area
              type="monotone"
              dataKey="total"
              fill="url(#revenueAreaGradient)"
              stroke="none"
              isAnimationActive
              tooltipType="none"
            />

            {/* 📈 LINE ON TOP */}
            <Line
              type="monotone"
              dataKey="total"
              stroke="#FF7A1A"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Seats */}
      <div className="bg-[#111] rounded-2xl p-5 border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Seats Booked Per Day</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.seatsByDate}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: "#0b0b0b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#F6E7C6" }}
              itemStyle={{ color: "#F6E7C6" }}
            />
            <Bar dataKey="seats" fill="#F6E7C6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Movies */}
      <div className="bg-[#111] rounded-2xl p-5 border border-white/10 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Top Movies by Seats Sold</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data.topMovies}
            layout="vertical"
            margin={{ left: 40 }} // ✅ space for long IDs
          >
            <XAxis type="number" stroke="#aaa" />

            <YAxis
              type="category"
              dataKey="_id"
              tickFormatter={(id) => movieTitles[id] || id}
              width={120} // ✅ prevents cropping
              stroke="#aaa"
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: "#0b0b0b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#F6E7C6" }}
              itemStyle={{ color: "#FF7A1A" }}
            />

            <Bar dataKey="seats" fill="#FF7A1A" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminCharts;
