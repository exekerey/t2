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
  const [showPass, setShowPass] = useState(false);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const profile = await login(form); // expects {username, password}
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
      <div className="loginFrame">
        <div className="loginShell">
          {/* LEFT PANEL */}
          <aside className="loginLeft">
            <div className="loginBrand">
              <div className="loginBrandIcon" aria-hidden="true">
                <span className="vsBadge">VS</span>
              </div>
              <div className="loginBrandText">
                <div className="loginBrandName">Nexus</div>
                <div className="loginBrandSub">CORPORATE LEARNING</div>
              </div>
            </div>

            <div className="loginLeftContent">
              <h1 className="loginLeftTitle">
                Добро пожаловать <br />
                в обучение <br />
                <span className="loginAccent">нового уровня</span>
              </h1>

              <p className="loginLeftDesc">
                Платформа для управления корпоративным обучением. Ваши знания —
                наш приоритет.
              </p>

              <div className="loginStats">
                <div className="stat">
                  <div className="statVal">2 400+</div>
                  <div className="statLab">Сотрудников</div>
                </div>
                <div className="stat">
                  <div className="statVal">180+</div>
                  <div className="statLab">Курсов</div>
                </div>
                <div className="stat">
                  <div className="statVal">98%</div>
                  <div className="statLab">Успешность</div>
                </div>
              </div>
            </div>

            <div className="loginLeftGlow" />
          </aside>

          {/* RIGHT PANEL */}
          <main className="loginRight">
            <div className="loginCard">
              <h2 className="loginTitle">Вход в систему</h2>
              <p className="loginSubtitle">
                Введите данные — роль определится автоматически
              </p>

              <form className="loginForm" onSubmit={onSubmit}>
                <div className="field">
                  <label className="label">Username</label>
                  <div className="inputWrap">
                    <span className="icon" aria-hidden="true">
                      👤
                    </span>
                    <input
                      className="loginInput withIcon"
                      name="username"
                      placeholder="username"
                      value={form.username}
                      onChange={onChange}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Пароль</label>
                  <div className="inputWrap rightIcon">
                    <span className="icon" aria-hidden="true">
                      🔒
                    </span>
                    <input
                      className="loginInput withIcon"
                      name="password"
                      type={showPass ? "text" : "password"}
                      placeholder="password"
                      value={form.password}
                      onChange={onChange}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="eyeBtn"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label="toggle password"
                    >
                      👁️
                    </button>
                  </div>
                </div>

                <div className="loginRow">
                  <span />
                  <button
                    type="button"
                    className="linkBtn"
                    onClick={() => alert("TODO: forgot password")}
                  >
                    Забыли пароль?
                  </button>
                </div>

                <button className="loginButton" disabled={loading} type="submit">
                  {loading ? "Loading..." : "→ Войти в систему"}
                </button>

                {error && <div className="loginError">{error}</div>}

                <div className="loginBottom">
                  Нет аккаунта?{" "}
                  <button
                    type="button"
                    className="linkBtn strong"
                    onClick={() => navigate("/register")}
                  >
                    Зарегистрироваться
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}