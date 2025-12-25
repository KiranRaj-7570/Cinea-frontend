import {
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WatchTimeChart = ({ data = [], loading }) => {
  if (loading) {
    return <p className="text-sm text-slate-400">Loading watch time...</p>;
  }

  if (!data.length) {
    return <p className="text-sm text-slate-500">No watch data yet</p>;
  }

  const chartData = data.map((d) => ({
    day: d.date.slice(5), // MM-DD
    value: d.hours, // HOURS (already computed)
  }));

  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="watchAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF7A1A" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#FF7A1A" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="day" stroke="#aaa" />
          <YAxis stroke="#aaa" unit="h" />
          <Tooltip
            cursor={false}
            formatter={(v) => [`${v} hrs`, "Watch time"]}
            contentStyle={{
              backgroundColor: "#0b0b0b",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontSize: "12px",
            }}
            labelStyle={{
              color: "#F6E7C6",
              fontWeight: 500,
            }}
            itemStyle={{
              color: "#FF7A1A",
            }}
          />

          <Area
            type="monotone"
            dataKey="value"
            fill="url(#watchAreaGradient)"
            stroke="none"
            tooltipType="none"
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#ff7a18"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WatchTimeChart;
