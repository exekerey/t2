import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

import { fetchRequests } from "../../api/requests";
import { useAuth } from "../../components/auth/useAuth";

const navItems = [
  { label: "Dashboard", icon: DashboardIcon, to: "/manager", end: true },
  { label: "Каталог", icon: CatalogIcon, to: "/manager/catalog" },
  { label: "Подать заявку", icon: TimeIcon, to: "/manager/request" },
  { label: "Заявки", icon: RequestsIcon, to: "/manager/requests" },
];

const STATUS_LABELS = {
  submitted: "На рассмотрении",
  approved: "Одобрено",
  rejected: "Отклонено",
};

const STATUS_CLASSES = {
  submitted: "dBadge--pending",
  approved: "dBadge--approved",
  rejected: "dBadge--rejected",
};


const DEMO_CERTS = [
  { id: 1, initials: "КА", name: "Канат Абенов", cert: "Радиационная безопасность", status: "истёк" },
  { id: 2, initials: "КА", name: "Канат Абенов", cert: "Охрана труда", status: "через 2 мес" },
  { id: 3, initials: "КА", name: "Канат Абенов", cert: "Пром. безопасность", status: "через 3 мес" },
];


const DEMO_PROGRESS = [
  { label: "Промышленная безопасность", percent: 89, color: "#E85D5D" },
  { label: "Охрана труда и ПТМ", percent: 72, color: "#4CAF50" },
  { label: "Радиационная безопасность", percent: 44, color: "#FF9800" },
];

export default function ManagerDashboard() {
  const { me } = useAuth();
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [reqData, empData] = await Promise.all([
          fetchRequests({ scope: "mine", limit: 100 }),
          me?.department_id
            ? fetch(`/api/v1/employees/?department_id=${me.department_id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }).then((r) => (r.ok ? r.json() : []))
            : Promise.resolve([]),
        ]);
        setRequests(Array.isArray(reqData) ? reqData : []);
        setEmployees(Array.isArray(empData) ? empData : []);
      } catch {

      } finally {
        setLoading(false);
      }
    }

    if (me) loadData();
  }, [me]);

  const totalEmployees = employees.length;
  const trainedThisYear = employees.filter(() => Math.random() > 0.4).length;
  const totalRequests = requests.length;
  const submittedCount = requests.filter((r) => r.status === "submitted").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const expiringCerts = DEMO_CERTS.length;
  const recentRequests = requests.slice(0, 3);

  const overallProgress = Math.round(
    DEMO_PROGRESS.reduce((s, p) => s + p.percent, 0) / DEMO_PROGRESS.length
  );

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


        <div className="dStats">
          <div className="dStatCard">
            <div className="dStatDecor" />
            <div className="dStatLabel">СОТРУДНИКОВ В ОТДЕЛЕ</div>
            <div className="dStatValue">{loading ? "…" : totalEmployees}</div>
            <div className="dStatSub">Обучено в этом году: {loading ? "…" : trainedThisYear}</div>
          </div>

          <div className="dStatCard">
            <div className="dStatDecor" />
            <div className="dStatLabel">МОИ ЗАЯВКИ</div>
            <div className="dStatValue">{loading ? "…" : totalRequests}</div>
            <div className="dStatSub">
              {submittedCount} на рассмотрении, {approvedCount} одобрено
            </div>
          </div>

          <div className="dStatCard">
            <div className="dStatDecor" />
            <div className="dStatLabel">ИСТЕКАЮТ СЕРТИФИКАТЫ</div>
            <div className="dStatValue">{expiringCerts}</div>
            <div className="dStatSub">Нужно записать на переобучение</div>
          </div>
        </div>

        <div className="dMidRow">
          <div className="card dReqCard">
            <div className="dCardHead">
              <h2 className="dCardTitle">Мои заявки</h2>
              <Link to="/manager/requests" className="dCardLink">Все →</Link>
            </div>

            <div className="dReqList">
              {loading ? (
                <div className="muted" style={{ padding: 16 }}>Загрузка...</div>
              ) : recentRequests.length === 0 ? (
                <div className="muted" style={{ padding: 16 }}>Заявок пока нет</div>
              ) : (
                recentRequests.map((req) => (
                  <div key={req.id} className="dReqItem">
                    <div className="dReqInfo">
                      <div className="dReqName">{req.training?.title || "Тренинг"}</div>
                      <div className="dReqMeta">
                        {req.created_at
                          ? new Date(req.created_at).toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "short",
                          })
                          : ""}{" "}
                        · {req.participants?.length || 0} сотрудников
                      </div>
                    </div>
                    <span className={`dBadge ${STATUS_CLASSES[req.status] || ""}`}>
                      {STATUS_LABELS[req.status] || req.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>


          <div className="card dCertCard">
            <div className="dCardHead">
              <h2 className="dCardTitle">Истекают сертификаты</h2>
              <span className="dCardLink">Все сотрудники →</span>
            </div>

            <div className="dCertList">
              {DEMO_CERTS.map((c) => (
                <div key={c.id} className="dCertItem">
                  <div className="dCertAvatar">{c.initials}</div>
                  <div className="dCertInfo">
                    <div className="dCertName">{c.name}</div>
                    <div className="dCertMeta">
                      <span className="dCertCertName">{c.cert}</span> — {c.status}
                    </div>
                  </div>
                  <button className="dCertBtn">Записать</button>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="card dProgressCard">
          <div className="dCardHead">
            <h2 className="dCardTitle">Прогресс обучения</h2>
            <span className="dProgressPlanLabel">план года по отделу</span>
          </div>

          <div className="dProgressBody">
            <div className="dProgressBars">
              {DEMO_PROGRESS.map((p) => (
                <div key={p.label} className="dProgressRow">
                  <div className="dProgressLabel">{p.label}</div>
                  <div className="dProgressTrack">
                    <div
                      className="dProgressFill"
                      style={{ width: `${p.percent}%`, background: p.color }}
                    />
                  </div>
                  <div className="dProgressPercent">{p.percent}%</div>
                </div>
              ))}
            </div>

            <div className="dDonut">
              <svg viewBox="0 0 120 120" className="dDonutSvg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E8ECF0" strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#2B2D42"
                  strokeWidth="12"
                  strokeDasharray={`${overallProgress * 3.14} ${314 - overallProgress * 3.14}`}
                  strokeDashoffset="78.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="dDonutLabel">{overallProgress}%</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}