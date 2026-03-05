const API_URL = "http://localhost:8000";

function authHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP error: ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

// HR/Manager: список заявок
// scope: "inbox" (для HR) | "mine" (для Manager)
export async function fetchRequests({ scope = "inbox", status, skip = 0, limit = 100 } = {}) {
  const params = new URLSearchParams();
  params.set("scope", scope);
  if (status) params.set("status", status); // submitted | approved | rejected (если у тебя так)
  params.set("skip", String(skip));
  params.set("limit", String(limit));

  const url = `${API_URL}/api/v1/requests/requests/?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });
  return handle(res);
}

export async function fetchRequestById(request_id) {
  const url = `${API_URL}/api/v1/requests/requests/${request_id}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });
  return handle(res);
}

// HR: approve (нужен contract_id)
export async function approveRequest(request_id, contract_id) {
  const url = `${API_URL}/api/v1/requests/requests/${request_id}/approve`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ contract_id }),
  });
  return handle(res);
}

// HR: reject (нужен reject_reason)
export async function rejectRequest(request_id, reject_reason) {
  const url = `${API_URL}/api/v1/requests/requests/${request_id}/reject`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ reject_reason }),
  });
  return handle(res);
}

// Manager: create draft request (если тебе надо будет)
export async function createRequest({ training_id, participant_ids }) {
  const url = `${API_URL}/api/v1/requests/requests/`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ training_id, participant_ids }),
  });
  return handle(res);
}