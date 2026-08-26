import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TrendView({ data, unit }) {
  // national average per year (mean across all districts + area types)
  const byYear = {};
  for (const row of data) {
    if (!byYear[row.year]) byYear[row.year] = [];
    byYear[row.year].push(row.value);
  }
  const chartData = Object.entries(byYear)
    .map(([year, values]) => ({
      year: Number(year),
      average: +(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
    }))
    .sort((a, b) => a.year - b.year);

  if (chartData.length === 0) {
    return <p className="empty-state">No trend data available for this selection.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData} margin={{ left: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip formatter={(v) => `${v}${unit === "%" ? "%" : ""}`} />
        <Legend />
        <Line type="monotone" dataKey="average" name="National average" stroke="#2f6f4f" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
