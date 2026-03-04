import "./Dashboard.css";
import DashboardSidebar from "../components/Sidebar";
import DashboardTopbar from "../components/Topbar";
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

const navItems = [
  { label: "Dashboard", icon: DashboardIcon },
  { label: "Поставщики", icon: SuppliersIcon },
  { label: "Договоры", icon: ContractsIcon },
  { label: "Тренинги", icon: TrainingsIcon },
  { label: "Слушатели", icon: ListenersIcon },
  { label: "Заявки", icon: RequestsIcon },
];

export default function HrDashboard() {
  return (
    <div className="layout">
      <DashboardSidebar
        brandText="VirtualSchool"
        userName="Айгерим Маратова"
        userRole="HR-менеджер"
        navItems={navItems}
        activeIndex={0}
        SettingsIcon={SettingsIcon}
        LogoutIcon={LogoutIcon}
      />

      <main className="main">
        <DashboardTopbar
          title="Dashboard"
          SearchIcon={SearchIcon}
          BellIcon={BellIcon}
          UserIcon={UserIcon}
          searchPlaceholder="Поиск..."
        />

        <div className="stats">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="card statCard" />
          ))}
        </div>

        <div className="grid2">
          <section>
            <div className="sectionHeader">
              <h2>Последние заявки</h2>
              <button className="linkBtn">Все заявки</button>
            </div>
            <div className="card bigCard" />
          </section>

          <section>
            <div className="sectionHeader">
              <h2>Активность</h2>
            </div>
            <div className="card bigCard2" />
          </section>
        </div>

        <section className="contracts">
          <div className="sectionHeader">
            <h2>Договоры - освоение бюджета</h2>
            <button className="linkBtn">Все договоры</button>
          </div>

          <div className="grid2Bottom">
            <div className="card midCard" />
            <div className="card midCard2" />
          </div>
        </section>
      </main>
    </div>
  );
}