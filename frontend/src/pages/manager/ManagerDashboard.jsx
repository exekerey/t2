import "../../Dashboard.css";

import DashboardSidebar from "../../components/Sidebar";
import DashboardTopbar from "../../components/Topbar";

import DashboardIcon from "../../assets/icons/icon.svg?react";
import TimeIcon from "../../assets/icons/time2.svg?react";
import CatalogIcon from "../../assets/icons/catalog.svg?react";
import RequestsIcon from "../../assets/icons/check.svg?react";

import SettingsIcon from "../../assets/icons/settings.svg?react";
import LogoutIcon from "../../assets/icons/logout.svg?react";

import BellIcon from "../../assets/icons/notification.svg?react";
import UserIcon from "../../assets/icons/user.svg?react";
import SearchIcon from "../../assets/icons/search.svg?react";

const navItems = [
  { label: "Dashboard", icon: DashboardIcon, to: "/manager", end: true },
  { label: "Каталог", icon: CatalogIcon, to: "/manager/catalog" },
  { label: "Подать заявку", icon: TimeIcon, to: "/manager/request" },
  { label: "Заявки", icon: RequestsIcon, to: "/manager/requests" },
];

export default function ManagerDashboard() {
  return (
    <div className="layout">
      <DashboardSidebar
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
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="card statCard" />
          ))}
        </div>

        <div className="grid2">
          <section>
            <div className="sectionHeader">
              <h2>Мои заявки</h2>
              <button className="linkBtn">Все заявки</button>
            </div>
            <div className="card bigCard" />
          </section>

          <section>
            <div className="sectionHeader">
              <h2>Истикают сертификаты</h2>
            </div>
            <div className="card bigCard2" />
          </section>
        </div>

        <section className="contracts">
          <div className="sectionHeader">
            <h2>Прогресс обучения</h2>
          </div>

          <div className="grid2Bottom">
            <div className="card midCard" />
          </div>
        </section>
      </main>
    </div>
  );
}