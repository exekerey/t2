import { NavLink } from "react-router-dom";

export default function DashboardSidebar({
  brandText = "VirtualSchool",
  userName,
  userRole,
  navItems,
  SettingsIcon,
  LogoutIcon,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo" />
        <div className="brandText">{brandText}</div>
      </div>

      <div className="divider" />

      <div className="profile">
        <div className="avatar" />
        <div className="profileText">
          <div className="name">{userName}</div>
          <div className="role">{userRole}</div>
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

        <button className="bottomItem" type="button">
          <span className="navIcon">
            <LogoutIcon />
          </span>
          Выйти
        </button>
      </div>
    </aside>
  );
}