import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Fixed order: light → dark orange
const CATEGORIES = [
  "Comedy",
  "Romance / Drama",
  "Sci-Fi",
  "Action / Adventure",
];

const COLORS = [
  "#FFF7ED", // Comedy (very light)
  "#FFEDD5", // Romance / Drama
  "#FDBA74", // Sci-Fi
  "#FF7A1A", // Action / Adventure
];

// TMDB → category mapping
const mapGenreToCategory = (genre) => {
  const g = genre.toLowerCase();

  if (g.includes("comedy")) return "Comedy";
  if (g.includes("romance") || g.includes("drama")) return "Romance / Drama";
  if (g.includes("sci") || g.includes("fantasy")) return "Sci-Fi";
  if (g.includes("action") || g.includes("adventure"))
    return "Action / Adventure";

  return null;
};

const GenreDonutChart = ({ data = [], loading }) => {
  if (loading) {
    return <p className="text-sm text-slate-400">Loading genres...</p>;
  }

  if (!data.length) {
    return <p className="text-sm text-slate-500">No genre data yet</p>;
  }

  // Aggregate into the 4 buckets
  const bucket = {
    Comedy: 0,
    "Romance / Drama": 0,
    "Sci-Fi": 0,
    "Action / Adventure": 0,
  };

  data.forEach(({ label, value }) => {
    const category = mapGenreToCategory(label);
    if (category) {
      bucket[category] += value;
    }
  });

  const chartData = CATEGORIES.map((c) => ({
    label: c,
    value: bucket[c],
  })).filter((c) => c.value > 0);

  const total = chartData.reduce((sum, i) => sum + i.value, 0);

  return (
    <>
      {/* DONUT */}
      <div style={{ height: 240 }}>
        <ResponsiveContainer>
          <PieChart margin={{ top: 20, right: 0, bottom: 10, left: 0 }}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              label={({ percent }) => `${Math.round(percent * 100)}%`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* TEXT LIST */}
      <ul className="mt-9 space-y-1">
        {chartData.map((g, i) => (
          <li
            key={g.label}
            className="flex justify-between text-sm text-slate-300"
          >
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              {g.label}
            </span>
            <span style={{ color: COLORS[i] }}>
              {Math.round((g.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default GenreDonutChart;
