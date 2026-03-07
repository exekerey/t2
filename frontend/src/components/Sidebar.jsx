import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import logoImg from "../assets/logo.svg";

const ROLE_LABELS = {
  HR: "HR-менеджер",
  MANAGER: "Начальник отдела",
  EMPLOYEE: "Сотрудник",
};

export default function DashboardSidebar({
  navItems,
  SettingsIcon,
  LogoutIcon,
}) {
  const { me, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const roleLabel = ROLE_LABELS[me?.role] || me?.role || "";

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logoCircle">
          <img src={logoImg} alt="Logo" className="logo" />
        </div>
        <div className="brandText">Nexus</div>
      </div>

      <div className="divider" />

      <div className="profile">
        <div className="avatar" />
        <div className="profileText">
          <div className="name">{me?.full_name || "Загрузка..."}</div>
          <div className="role">{roleLabel}</div>
        </div>
      </div>

      <nav className="nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `navItem ${isActive ? "active" : ""}`
              }
            >
              <span className="navIcon">
                <IconComponent />
              </span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebarBottom">
        <button className="bottomItem" type="button">
          <span className="navIcon">
            <SettingsIcon />
          </span>
          Настройки
        </button>

        <button
          className="bottomItem"
          type="button"
          onClick={handleLogout}
        >
          <span className="navIcon">
            <LogoutIcon />
          </span>
          Выйти
        </button>
      </div>
    </aside>
  );
}