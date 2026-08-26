import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DistrictBreakdown({ data, unit }) {
  // average urban+rural per district for a single "district value" bar
  const byDistrict = {};
  for (const row of data) {
    if (!byDistrict[row.district]) byDistrict[row.district] = [];
    byDistrict[row.district].push(row.value);
  }
  const chartData = Object.entries(byDistrict)
    .map(([district, values]) => ({
      district,
      value: +(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
    }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return <p className="empty-state">No district data available for this selection.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" unit={unit === "%" ? "%" : ""} />
        <YAxis type="category" dataKey="district" width={130} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => `${v}${unit === "%" ? "%" : ""}`} />
        <Bar dataKey="value" fill="#2f6f4f" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
