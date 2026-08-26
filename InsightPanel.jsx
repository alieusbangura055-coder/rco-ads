export default function InsightPanel({ indicatorLabel, trendData, comparisonGap, isSample }) {
  if (!trendData || trendData.length < 2) {
    return null;
  }

  const first = trendData[0];
  const last = trendData[trendData.length - 1];
  const change = (last.average - first.average).toFixed(1);
  const direction = change > 0 ? "increased" : change < 0 ? "decreased" : "held steady";

  return (
    <div className="insight-panel">
      <h4>What this shows</h4>
      <p>
        Between {first.year} and {last.year}, the national average for{" "}
        <strong>{indicatorLabel}</strong> {direction} by {Math.abs(change)} points.
        {comparisonGap !== undefined && (
          <> The urban–rural gap in the most recent year is {Math.abs(comparisonGap)} points,
          {comparisonGap > 0 ? " favoring urban areas" : " favoring rural areas"} — a pattern
          worth flagging for RC/UNCT equity discussions.</>
        )}
      </p>
      {isSample && (
        <p className="sample-warning">
          ⚠ This narrative is generated from synthetic sample data for demonstration purposes only.
        </p>
      )}
    </div>
  );
}
