const API_URL = "http://localhost:8000";

export async function fetchContracts({
  status,
  supplier_id,
  skip = 0,
  limit = 100,
} = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status); // active | expired | closed
  if (supplier_id) params.set("supplier_id", supplier_id);
  params.set("skip", String(skip));
  params.set("limit", String(limit));

  const url = `${API_URL}/api/v1/contracts/?${params.toString()}`;

  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP error: ${res.status}`);
  }

  return res.json(); // List[Contract]
}