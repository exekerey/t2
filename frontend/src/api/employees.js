const API_URL = ""; // Relative path to use Vite proxy

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

export async function fetchEmployees({ skip = 0, limit = 100 } = {}) {
    const params = new URLSearchParams();
    params.set("skip", String(skip));
    params.set("limit", String(limit));

    const url = `${API_URL}/api/v1/employees/?${params.toString()}`;
    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
            ...authHeaders(),
        },
    });
    return handle(res);
}
