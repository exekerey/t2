import { Outlet, useLocation } from "react-router-dom";
import "../Dashboard.css"; 

import { useAuth } from "../components/auth/useAuth";

import DashboardSidebar from "../components/Sidebar";
import DashboardTopbar from "../components/Topbar";

import Logo from "../assets/logo.svg?react";

import DashboardIcon from "../assets/icons/icon.svg?react";
import SuppliersIcon from "../assets/icons/dom.svg?react";
import ContractsIcon from "../assets/icons/file.svg?react";
import TrainingsIcon from "../assets/icons/tvv.svg?react";
import ListenersIcon from "../assets/icons/listeners.svg?react";
import RequestsIcon from "../assets/icons/check.svg?react";

import SettingsIcon from "../assets/icons/settings.svg?react";
import LogoutIcon from "../assets/icons/logout.svg?react";

import BellIcon from "../assets/icons/notification.svg?react";
import UserIcon from "../assets/icons/user.svg?react";
import SearchIcon from "../assets/icons/search.svg?react";

function roleLabel(role) {
  if (role === "HR") return "HR-менеджер";
  if (role === "MANAGER") return "Начальник отдела";
  if (role === "EMPLOYEE") return "Сотрудник";
  return role;
}

export default function HrLayout() {
  const { pathname } = useLocation();
  const { me } = useAuth();

  const navItems = [
    { label: "Dashboard", to: "/hr", icon: DashboardIcon, end: true },
    { label: "Поставщики", to: "/hr/suppliers", icon: SuppliersIcon },
    { label: "Договоры", to: "/hr/contracts", icon: ContractsIcon },
    { label: "Тренинги", to: "/hr/trainings", icon: TrainingsIcon },
    { label: "Слушатели", to: "/hr/listeners", icon: ListenersIcon },
    { label: "Заявки", to: "/hr/requests", icon: RequestsIcon },
  ];

  const titleByPath = {
    "/hr": "Dashboard",
    "/hr/suppliers": "Поставщики",
    "/hr/contracts": "Договоры",
    "/hr/trainings": "Тренинги",
    "/hr/listeners": "Слушатели",
    "/hr/requests": "Заявки",
  };

  return (
    <div className="layout">
      <DashboardSidebar
        brandText="Nexus"
        Logo={Logo}
        userName={me?.full_name || ""}
        userRole={roleLabel(me?.role)}
        navItems={navItems}
        SettingsIcon={SettingsIcon}
        LogoutIcon={LogoutIcon}
      />


      <main className="main">
        <DashboardTopbar
          title={titleByPath[pathname] ?? "Dashboard"}
          SearchIcon={SearchIcon}
          BellIcon={BellIcon}
          UserIcon={UserIcon}
          searchPlaceholder="Поиск..."
        />
        <Outlet />
      </main>
    </div>
  );
}