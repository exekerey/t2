import api from "../../api/api";

// OAuth2 login (form-urlencoded)
export async function login({ username, password }) {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);

  const { data } = await api.post("/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("token_type", data.token_type);
  return data;
}

export async function register(payload) {
  const body = {
    full_name: payload.full_name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    department_id: payload.department_id ?? null,
  };

  const { data } = await api.post("/auth/register", body);
  return data;
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}