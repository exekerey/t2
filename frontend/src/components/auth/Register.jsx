import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { getDepartments } from "./departmentService";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // steps: 1 Role, 2 Data, 3 Access
  const [step, setStep] = useState(1);

  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);

  // backend payload (must stay compatible)
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    department_id: null, // UUID string
  });

  // UI-only fields (not sent directly)
  const [ui, setUi] = useState({
    first_name: "",
    last_name: "",
    confirm_password: "",
    showPassword: false,
    showConfirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // load departments on mount
  useEffect(() => {
    const load = async () => {
      setDeptLoading(true);
      try {
        const list = await getDepartments({ skip: 0, limit: 100 });
        setDepartments(Array.isArray(list) ? list : []);
      } catch (e) {
        console.log("departments load failed", e);
        setError("Failed to load departments");
      } finally {
        setDeptLoading(false);
      }
    };
    load();
  }, []);

  const syncFullName = (first, last) => {
    const full = `${(first || "").trim()} ${(last || "").trim()}`.trim();
    setForm((p) => ({ ...p, full_name: full }));
  };

  const handleUiChange = (e) => {
    const { name, value } = e.target;

    setUi((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "first_name" || name === "last_name") {
        const first = name === "first_name" ? value : prev.first_name;
        const last = name === "last_name" ? value : prev.last_name;
        syncFullName(first, last);
      }

      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // special handling for department_id: "" -> null, else UUID string
    if (name === "department_id") {
      setForm((prev) => ({ ...prev, department_id: value === "" ? null : value }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const goToStep = (nextStep) => {
    setError("");

    // minimal step validation (UX)
    if (nextStep === 2) {
      // Step1 -> Step2: role already exists, nothing required
      setStep(2);
      return;
    }

    if (nextStep === 3) {
      // Step2 -> Step3: require name + department (as per screenshots flow)
      if (!ui.first_name.trim() || !ui.last_name.trim()) {
        setError("Please fill in first name and last name");
        return;
      }
      if (!form.department_id) {
        setError("Please select a department");
        return;
      }
      setStep(3);
      return;
    }

    setStep(nextStep);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // final validations
    if (!ui.first_name.trim() || !ui.last_name.trim()) {
      setError("Please fill in first name and last name");
      setStep(2);
      return;
    }
    if (!form.department_id) {
      setError("Please select a department");
      setStep(2);
      return;
    }
    if (ui.confirm_password !== form.password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg =
        Array.isArray(detail)
          ? detail.map((e) => e.msg).join(", ")
          : (typeof detail === "string" ? detail : null) ||
            err?.response?.data?.message ||
            "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authFrame">
        <div className="authShell">
          {/* LEFT PANEL */}
          <aside className="authLeft">
            <div className="brand">
              <div className="brandLogo">VS</div>
              <div className="brandText">
                <div className="brandName">Nexus</div>
                <div className="brandSub">CORPORATE LEARNING</div>
              </div>
            </div>

            <div className="leftContent">
              <h1 className="leftTitle">
                Создайте аккаунт и <span className="leftAccent">начните учиться</span>
              </h1>
              <p className="leftDesc">
                Выберите свою роль — каждый получит персональный кабинет с нужными
                инструментами.
              </p>

              <div className="leftRoleList">
                <div className={`leftRoleItem ${form.role === "HR" ? "active" : ""}`}>
                  <span className="roleDot">🎓</span>
                  <div>
                    <div className="leftRoleTitle">HR-менеджер</div>
                    <div className="leftRoleSub">Управление обучением</div>
                  </div>
                </div>

                <div
                  className={`leftRoleItem ${form.role === "MANAGER" ? "active" : ""}`}
                >
                  <span className="roleDot">💼</span>
                  <div>
                    <div className="leftRoleTitle">Руководитель</div>
                    <div className="leftRoleSub">Заявки и контроль</div>
                  </div>
                </div>

                <div
                  className={`leftRoleItem ${form.role === "EMPLOYEE" ? "active" : ""}`}
                >
                  <span className="roleDot">👤</span>
                  <div>
                    <div className="leftRoleTitle">Сотрудник</div>
                    <div className="leftRoleSub">Обучение и сертификаты</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="leftFooter" />
          </aside>

          {/* RIGHT PANEL */}
          <main className="authRight">
            <div className="authCard">
              <header className="authHeader">
                <h2 className="authTitle">Регистрация</h2>
                <p className="authSubtitle">Заполните данные для создания аккаунта</p>

                {/* STEPPER */}
                <div className="stepper">
                  <div className={`step ${step === 1 ? "current" : step > 1 ? "done" : ""}`}>
                    <span className="stepBadge">
                      {step > 1 ? "✓" : "1"}
                    </span>
                    <span className={`stepLabel ${step > 1 ? "green" : ""}`}>Роль</span>
                  </div>

                  <div className={`stepLine ${step > 1 ? "greenLine" : ""}`} />

                  <div className={`step ${step === 2 ? "current" : step > 2 ? "done" : ""}`}>
                    <span className="stepBadge">
                      {step > 2 ? "✓" : "2"}
                    </span>
                    <span className={`stepLabel ${step > 2 ? "green" : ""}`}>Данные</span>
                  </div>

                  <div className={`stepLine ${step > 2 ? "greenLine" : ""}`} />

                  <div className={`step ${step === 3 ? "current" : ""}`}>
                    <span className="stepBadge">{step === 3 ? "3" : "3"}</span>
                    <span className="stepLabel">Доступ</span>
                  </div>
                </div>
              </header>

              <form className="authForm" onSubmit={handleSubmit}>
                {/* STEP 1: ROLE */}
                {step === 1 && (
                  <>
                    <div className="roleCards">
                      <button
                        type="button"
                        className={`roleCard ${form.role === "HR" ? "selected" : ""}`}
                        onClick={() => setForm((p) => ({ ...p, role: "HR" }))}
                      >
                        <div className="roleIcon">🎓</div>
                        <div className="roleCardTitle">HR-менеджер</div>
                        <div className="roleCardSub">
                          Управление поставщиками, договорами и обучением
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`roleCard ${form.role === "MANAGER" ? "selected" : ""}`}
                        onClick={() => setForm((p) => ({ ...p, role: "MANAGER" }))}
                      >
                        <div className="roleIcon">💼</div>
                        <div className="roleCardTitle">Руководитель</div>
                        <div className="roleCardSub">
                          Подача заявок и контроль обучения команды
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`roleCard ${form.role === "EMPLOYEE" ? "selected" : ""}`}
                        onClick={() => setForm((p) => ({ ...p, role: "EMPLOYEE" }))}
                      >
                        <div className="roleIcon">👤</div>
                        <div className="roleCardTitle">Сотрудник</div>
                        <div className="roleCardSub">
                          Просмотр обучения, расписания и сертификатов
                        </div>
                      </button>
                    </div>

                    {/* KEEP YOUR SELECT  */}
                    <div className="field">
                      <label className="label">Роль (select)</label>
                      <select
                        className="registerInput"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                      >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="MANAGER">Manager</option>
                        <option value="HR">HR</option>
                      </select>
                    </div>

                    <div className="actionsBar single">
                      <button
                        type="button"
                        className="primaryWideBtn"
                        onClick={() => goToStep(2)}
                      >
                        Продолжить <span className="arrow">→</span>
                      </button>
                    </div>

                    <div className="linkRow">
                      Уже есть аккаунт?{" "}
                      <button type="button" className="linkBtn" onClick={() => navigate("/login")}>
                        Войти
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 2: DATA */}
                {step === 2 && (
                  <>
                    <div className="grid2">
                      <div className="field">
                        <label className="label">Имя</label>
                        <div className="inputWrap">
                          <span className="inputIcon">👤</span>
                          <input
                            className="registerInput withIcon"
                            name="first_name"
                            placeholder="Введите имя"
                            value={ui.first_name}
                            onChange={handleUiChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="field">
                        <label className="label">Фамилия</label>
                        <div className="inputWrap">
                          <span className="inputIcon">👤</span>
                          <input
                            className="registerInput withIcon"
                            name="last_name"
                            placeholder="Введите фамилию"
                            value={ui.last_name}
                            onChange={handleUiChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="field span2">
                        <label className="label">Department</label>
                        <div className="inputWrap">
                          <span className="inputIcon">🏢</span>
                          <select
                            className="registerInput withIcon"
                            name="department_id"
                            value={form.department_id ?? ""}
                            onChange={handleChange}
                            disabled={deptLoading}
                            required
                          >
                            <option value="">
                              {deptLoading ? "Loading departments..." : "Select department"}
                            </option>
                            {departments.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="actionsBar">
                      <button type="button" className="backBtn" onClick={() => goToStep(1)}>
                        ← Назад
                      </button>

                      <button
                        type="button"
                        className="primaryWideBtn"
                        onClick={() => goToStep(3)}
                        disabled={deptLoading}
                      >
                        Продолжить <span className="arrow">→</span>
                      </button>
                    </div>

                    <div className="linkRow">
                      Уже есть аккаунт?{" "}
                      <button type="button" className="linkBtn" onClick={() => navigate("/login")}>
                        Войти
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 3: ACCESS */}
                {step === 3 && (
                  <>
                    <div className="field">
                      <label className="label">Email</label>
                      <div className="inputWrap">
                        <span className="inputIcon">✉️</span>
                        <input
                          className="registerInput withIcon"
                          name="email"
                          type="email"
                          placeholder="Email"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Пароль</label>
                      <div className="inputWrap rightIcon">
                        <span className="inputIcon">🔒</span>
                        <input
                          className="registerInput withIcon"
                          name="password"
                          type={ui.showPassword ? "text" : "password"}
                          placeholder="Минимум 8 символов"
                          value={form.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="eyeBtn"
                          onClick={() => setUi((p) => ({ ...p, showPassword: !p.showPassword }))}
                          aria-label="toggle password"
                        >
                          👁️
                        </button>
                      </div>

                      <div className="strengthBar">
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Подтвердите пароль</label>
                      <div className="inputWrap rightIcon">
                        <span className="inputIcon">🔒</span>
                        <input
                          className="registerInput withIcon"
                          name="confirm_password"
                          type={ui.showConfirm ? "text" : "password"}
                          placeholder="Повторите пароль"
                          value={ui.confirm_password}
                          onChange={handleUiChange}
                          required
                        />
                        <button
                          type="button"
                          className="eyeBtn"
                          onClick={() => setUi((p) => ({ ...p, showConfirm: !p.showConfirm }))}
                          aria-label="toggle confirm"
                        >
                          👁️
                        </button>
                      </div>
                    </div>

                    <div className="actionsBar">
                      <button type="button" className="backBtn" onClick={() => goToStep(2)}>
                        ← Назад
                      </button>

                      <button
                        className="primaryWideBtn"
                        type="submit"
                        disabled={loading || deptLoading}
                      >
                        {loading ? "Registering..." : "✓ Создать аккаунт"}
                      </button>
                    </div>

                    <div className="linkRow">
                      Уже есть аккаунт?{" "}
                      <button type="button" className="linkBtn" onClick={() => navigate("/login")}>
                        Войти
                      </button>
                    </div>
                  </>
                )}

                {error && <p className="registerError">{error}</p>}
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}