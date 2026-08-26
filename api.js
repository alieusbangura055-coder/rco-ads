const BASE_URL = "http://localhost:8000";

async function getJSON(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  indicators: () => getJSON("/api/indicators"),
  districts: () => getJSON("/api/districts"),
  data: (indicator, { district, areaType } = {}) => {
    const params = new URLSearchParams({ indicator });
    if (district) params.set("district", district);
    if (areaType) params.set("area_type", areaType);
    return getJSON(`/api/data?${params.toString()}`);
  },
  districtLatest: (indicator) =>
    getJSON(`/api/district-latest?indicator=${encodeURIComponent(indicator)}`),
};
