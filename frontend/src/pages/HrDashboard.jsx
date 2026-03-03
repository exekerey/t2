import "./HrDashboard.css";
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
    <div className="hrLayout">
      {/* SIDEBAR */}
      <aside className="hrSidebar">
        <div className="hrBrand">
          <div className="hrLogo" />
          <div className="hrBrandText">VirtualSchool</div>
        </div>
        <div className="hrDivider" />

        <div className="hrProfile">
          <div className="hrAvatar" />
          <div className="hrProfileText">
            <div className="hrName">Айгерим Маратова</div>
            <div className="hrRole">HR-менеджер</div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="hrNav">
        {navItems.map((item, index) => {
            const IconComponent = item.icon;

            return (
            <button
                key={index}
                className={`hrNavItem ${index === 0 ? "active" : ""}`}
            >
                <span className="hrNavIcon">
                <IconComponent />
                </span>
                <span>{item.label}</span>
            </button>
            );
        })}
        </nav>

        {/* BOTTOM */}
        <div className="hrSidebarBottom">
            <button className="hrBottomItem">
            <span className="hrNavIcon">
                <SettingsIcon />
            </span>
            Настройки
            </button>

            <button className="hrBottomItem">
            <span className="hrNavIcon">
                <LogoutIcon />
            </span>
            Выйти
            </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="hrMain">
        {/* TOP BAR */}
        <div className="hrTopbar">
          <h1 className="hrTitle">Dashboard</h1>

          <div className="hrTopRight">
            <div className="hrSearch">
                <span className="hrSearchIcon" aria-hidden="true">
                    <SearchIcon />
                </span>
            <input placeholder="Поиск..." />
            </div>
            <button className="hrIconBtn">
                <BellIcon />
            </button>

            <button className="hrIconBtn">
                <UserIcon />
            </button>
          </div>
        </div>

        {/* 5 STAT CARDS */}
        <div className="hrStats">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="hrCard hrStatCard" />
          ))}
        </div>

        {/* ROW: Requests + Activity */}
        <div className="hrGrid2">
          <section>
            <div className="hrSectionHeader">
              <h2>Последние заявки</h2>
              <button className="hrLinkBtn">Все заявки</button>
            </div>
            <div className="hrCard hrBigCard" />
          </section>

          <section>
            <div className="hrSectionHeader">
              <h2>Активность</h2>
            </div>
            <div className="hrCard hrBigCard2" />
          </section>
        </div>

        {/* Contracts */}
        <section className="hrContracts">
          <div className="hrSectionHeader">
            <h2>Договоры - освоение бюджета</h2>
            <button className="hrLinkBtn">Все договоры</button>
          </div>

          <div className="hrGrid2Bottom">
            <div className="hrCard hrMidCard" />
            <div className="hrCard hrMidCard" />
          </div>
        </section>
      </main>
    </div>
  );
}