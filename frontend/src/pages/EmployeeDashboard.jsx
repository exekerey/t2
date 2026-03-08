import { useEffect, useState } from "react";
import { getTrainings } from "../api/trainingEmployee";

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

export default function EmployeeDashboard() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrainings() {
      try {
        const data = await getTrainings();
        setTrainings(data || []);
      } catch (err) {
        console.error("Error loading trainings", err);
      } finally {
        setLoading(false);
      }
    }

    loadTrainings();
  }, []);

  return (
    <div className="layout">
      <DashboardSidebar
        brandText="Nexus"
        userName="Employee Name"
        userRole="Employee"
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

        <section className="contracts">
          <div className="sectionHeader">
            <h2>Предстоящие обучения</h2>
          </div>

          {loading && <p className="loading">Loading trainings...</p>}

          {!loading && trainings.length === 0 && (
            <p className="empty">Нет доступных обучений</p>
          )}

          <div className="grid2Bottom">
            {trainings.map((training) => (
              <div key={training.id} className="card trainingCard">
                <h3 className="trainingTitle">{training.title}</h3>

                <div className="trainingInfo">
                  <p>
                    <strong>Trainer:</strong>{" "}
                    {training.trainer_name || "Unknown"}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {training.location || "Online"}
                  </p>

                  <p>
                    <strong>Start:</strong>{" "}
                    {training.date_start
                      ? new Date(training.date_start).toLocaleDateString()
                      : "TBA"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}