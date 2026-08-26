import { useEffect, useState } from "react";
import { api } from "./api";
import DistrictBreakdown from "./components/DistrictBreakdown";
import TrendView from "./components/TrendView";
import ComparisonView from "./components/ComparisonView";
import InsightPanel from "./components/InsightPanel";
import "./App.css";

export default function App() {
  const [indicators, setIndicators] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fullData, setFullData] = useState(null);
  const [latestData, setLatestData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .indicators()
      .then((list) => {
        setIndicators(list);
        if (list.length) setSelected(list[0].indicator);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    Promise.all([api.data(selected), api.districtLatest(selected)])
      .then(([full, latest]) => {
        setFullData(full);
        setLatestData(latest);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selected]);

  const trendSeries = (() => {
    if (!fullData) return [];
    const byYear = {};
    for (const row of fullData.data) {
      if (!byYear[row.year]) byYear[row.year] = [];
      byYear[row.year].push(row.value);
    }
    return Object.entries(byYear)
      .map(([year, values]) => ({
        year: Number(year),
        average: values.reduce((a, b) => a + b, 0) / values.length,
      }))
      .sort((a, b) => a.year - b.year);
  })();

  const comparisonGap = (() => {
    if (!latestData) return undefined;
    const urban = latestData.data.filter((d) => d.area_type === "urban");
    const rural = latestData.data.filter((d) => d.area_type === "rural");
    if (!urban.length || !rural.length) return undefined;
    const avg = (arr) => arr.reduce((a, b) => a + b.value, 0) / arr.length;
    return +(avg(urban) - avg(rural)).toFixed(1);
  })();

  return (
    <div className="app">
      <header>
        <h1>Sierra Leone Education Access Dashboard</h1>
        <p className="subtitle">
          Portfolio demo modeled on RC/UNCT-style indicator monitoring — district-level
          breakdown, multi-year trend, and urban/rural equity comparison.
        </p>
        <p className="sample-banner">
          ⚠ Currently loaded with <strong>synthetic sample data</strong> — see README to swap in
          real data from World Bank / UNICEF / DHS / HDX.
        </p>
      </header>

      <div className="controls">
        <label htmlFor="indicator-select">Indicator:</label>
        <select
          id="indicator-select"
          value={selected || ""}
          onChange={(e) => setSelected(e.target.value)}
        >
          {indicators.map((ind) => (
            <option key={ind.indicator} value={ind.indicator}>
              {ind.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error-banner">Error: {error}</p>}
      {loading && <p className="loading">Loading…</p>}

      {!loading && fullData && latestData && (
        <main className="grid">
          <section className="card">
            <h2>District Breakdown</h2>
            <DistrictBreakdown data={latestData.data} unit={latestData.indicator.unit} />
          </section>

          <section className="card">
            <h2>Trend Over Time</h2>
            <TrendView data={fullData.data} unit={fullData.indicator.unit} />
          </section>

          <section className="card">
            <h2>Urban vs Rural</h2>
            <ComparisonView data={latestData.data} unit={latestData.indicator.unit} />
          </section>

          <section className="card insight-card">
            <InsightPanel
              indicatorLabel={fullData.indicator.label}
              trendData={trendSeries}
              comparisonGap={comparisonGap}
              isSample={true}
            />
          </section>
        </main>
      )}
    </div>
  );
}
