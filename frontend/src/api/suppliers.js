const API_URL = "http://localhost:8000"; // бэк

export async function fetchSuppliers({ skip = 0, limit = 100 } = {}) {
  const url = `${API_URL}/api/v1/suppliers/?skip=${skip}&limit=${limit}`; 

  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP error: ${res.status}`);
  }

  return res.json(); // List[Supplier]
}