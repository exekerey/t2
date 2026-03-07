import "../Dashboard.css";

import DashboardSidebar from "../components/Sidebar";
import DashboardTopbar from "../components/Topbar";

import DashboardIcon from "../assets/icons/icon.svg?react";
import ScheduleIcon from "../assets/icons/schedule.svg?react";
import TvIcon from "../assets/icons/tvv.svg?react";
import CertificateIcon from "../assets/icons/certi.svg?react";

import SettingsIcon from "../assets/icons/settings.svg?react";
import LogoutIcon from "../assets/icons/logout.svg?react";

import BellIcon from "../assets/icons/notification.svg?react";
import UserIcon from "../assets/icons/user.svg?react";
import SearchIcon from "../assets/icons/search.svg?react";

const navItems = [
  { label: "Dashboard", icon: DashboardIcon },
  { label: "Мои обучения", icon: TvIcon },
  { label: "Расписание", icon: ScheduleIcon },
  { label: "Сертификаты", icon: CertificateIcon },
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

        <div className="employeeStats">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="card employeeStatCard" />
          ))}
        </div>

        <div className="grid2">
          <section>
            <div className="sectionHeader">
              <h2>Предстоящие обучения</h2>
              <button className="linkBtn">Расписание</button>
            </div>
            <div className="card bigCard" />
          </section>

          <section>
            <div className="sectionHeader">
              <h2>Мой прогресс</h2>
            </div>
            <div className="card bigCard2" />
          </section>
        </div>

        <section className="contracts">
          <div className="sectionHeader">
            <h2>Последние обучения</h2>
            <button className="historyBtn">Вся история</button>
          </div>

          <div className="grid2Bottom">
            <div className="card midCard2" />
          </div>
        </section>
      </main>
    </div>
  );
}