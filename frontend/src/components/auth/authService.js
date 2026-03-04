import api from "../../api/api"

// Login (form-urlencoded)
export async function login({ username, password }) {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);

  const { data } = await api.post("/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("token_type", data.token_type);

  return data; // { access_token, token_type }
}

export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

// Me (Bearer required)
export async function me() {
  const { data } = await api.get("/auth/me");
  return data; 
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
}