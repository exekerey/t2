import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function roleToHome(role) {
  if (role === "HR") return "/";
  if (role === "MANAGER") return "/manager";
  return "/employee";
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const profile = await login(form);
      navigate(roleToHome(profile.role), { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form onSubmit={onSubmit} style={{ width: 360, display: "grid", gap: 12 }}>
        <h2>Login</h2>

        <input
          name="username"
          placeholder="username (or email)"
          value={form.username}
          onChange={onChange}
          autoComplete="username"
        />

        <input
          name="password"
          type="password"
          placeholder="password"
          value={form.password}
          onChange={onChange}
          autoComplete="current-password"
        />

        <button disabled={loading} type="submit">
          {loading ? "Loading..." : "Login"}
        </button>

        {error ? <div style={{ color: "crimson" }}>{error}</div> : null}
      </form>
    </div>
  );
}