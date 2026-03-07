const API_URL = ""; // Relative path to use Vite proxy

function getToken() {
  return localStorage.getItem("access_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// GET /api/v1/trainings/?skip&limit&type&city&date_from&date_to&supplier_id
export async function fetchTrainings({
  skip = 0,
  limit = 100,
  type,
  city,
  date_from,
  date_to,
  supplier_id,
} = {}) {
  const params = new URLSearchParams();
  params.set("skip", String(skip));
  params.set("limit", String(limit));

  if (type) params.set("type", type);
  if (city) params.set("city", city);
  if (date_from) params.set("date_from", date_from);
  if (date_to) params.set("date_to", date_to);
  if (supplier_id) params.set("supplier_id", supplier_id);

  const url = `${API_URL}/api/v1/trainings/?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      ...authHeaders(), // если эндпоинт вдруг защищён
    },
  });

  if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
  return res.json();
}

// GET /api/v1/trainings/{id}
export async function fetchTrainingById(id) {
  const res = await fetch(`${API_URL}/api/v1/trainings/${id}`, {
    headers: { accept: "application/json", ...authHeaders() },
  });
  if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
  return res.json();
}

// POST /api/v1/trainings/  (HR only)
export async function createTraining(payload) {
  const res = await fetch(`${API_URL}/api/v1/trainings/`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
  return res.json();
}

// PUT /api/v1/trainings/{id} (HR only)
export async function updateTraining(id, payload) {
  const res = await fetch(`${API_URL}/api/v1/trainings/${id}`, {
    method: "PUT",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
  return res.json();
}