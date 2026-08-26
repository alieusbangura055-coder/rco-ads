import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ComparisonView({ data, unit }) {
  // latest-year urban vs rural average, grouped
  const grouped = {};
  for (const row of data) {
    const key = row.area_type;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row.value);
  }
  const chartData = [
    {
      name: "Urban vs Rural (latest year avg.)",
      urban: grouped.urban
        ? +(grouped.urban.reduce((a, b) => a + b, 0) / grouped.urban.length).toFixed(2)
        : 0,
      rural: grouped.rural
        ? +(grouped.rural.reduce((a, b) => a + b, 0) / grouped.rural.length).toFixed(2)
        : 0,
    },
  ];

  const gap = (chartData[0].urban - chartData[0].rural).toFixed(1);

  return (
    <div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip formatter={(v) => `${v}${unit === "%" ? "%" : ""}`} />
          <Legend />
          <Bar dataKey="urban" name="Urban" fill="#2f6f4f" radius={[4, 4, 0, 0]} />
          <Bar dataKey="rural" name="Rural" fill="#c9a24b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="gap-note">
        Urban–rural gap (national, latest year): <strong>{gap}{unit === "%" ? " points" : ""}</strong>
      </p>
    </div>
  );
}
