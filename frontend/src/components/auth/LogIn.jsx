import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "./Login.css";

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
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <form className="loginForm" onSubmit={onSubmit}>
        <h2 className="loginTitle">Login</h2>

        <input
          className="loginInput"
          name="username"
          placeholder="username (or email)"
          value={form.username}
          onChange={onChange}
          autoComplete="username"
        />

        <input
          className="loginInput"
          name="password"
          type="password"
          placeholder="password"
          value={form.password}
          onChange={onChange}
          autoComplete="current-password"
        />

        <button className="loginButton" disabled={loading} type="submit">
          {loading ? "Loading..." : "Login"}
        </button>

        {error && <div className="loginError">{error}</div>}
      </form>
    </div>
  );
}