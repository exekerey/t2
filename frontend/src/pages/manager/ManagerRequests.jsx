import { useState, useEffect } from "react";
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
    submitted: "badge--submitted",
    approved: "badge--approved",
    rejected: "badge--rejected",
};

export default function ManagerRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await fetchRequests({
                    scope: "mine",
                    status: statusFilter || undefined,
                });
                setRequests(data);
            } catch (err) {
                setError(err.message || "Ошибка при загрузке заявок");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [statusFilter]);

    const handleRowClick = (request) => {
        setSelectedRequest(request);
    };

    const closeModal = () => {
        setSelectedRequest(null);
    };

    return (
        <div className="layout">
            <DashboardSidebar
                navItems={navItems}
                activeIndex={3}
                SettingsIcon={SettingsIcon}
                LogoutIcon={LogoutIcon}
            />

            <main className="main">
                <DashboardTopbar
                    title="Мои заявки"
                    SearchIcon={SearchIcon}
                    BellIcon={BellIcon}
                    UserIcon={UserIcon}
                    searchPlaceholder="Поиск..."
                />

                <section>
                    <div className="sectionHeader" style={{ marginBottom: "16px" }}>
                        <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>Список ваших заявок</h1>
                    </div>

                    <div className="card" style={{ padding: "16px", marginBottom: "20px" }}>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <label style={{ fontSize: "13px", fontWeight: "600", opacity: 0.8 }}>Фильтр по статусу:</label>
                            <select
                                className="input"
                                style={{ width: "200px" }}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Все статусы</option>
                                <option value="submitted">На рассмотрении</option>
                                <option value="approved">Одобрено</option>
                                <option value="rejected">Отклонено</option>
                            </select>
                        </div>
                    </div>

                    <div className="card" style={{ padding: "16px" }}>
                        <div className="tableWrap">
                            {error && <div className="error" style={{ marginBottom: "12px" }}>{error}</div>}
                            <table className="table hr-req-table">
                                <thead>
                                    <tr>
                                        <th>Название тренинга</th>
                                        <th>Дата подачи</th>
                                        <th>Статус</th>
                                        <th>Участников</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="empty" style={{ textAlign: "center" }}>Загрузка...</td>
                                        </tr>
                                    ) : requests.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="empty" style={{ textAlign: "center" }}>Заявки не найдены</td>
                                        </tr>
                                    ) : (
                                        requests.map((req) => (
                                            <tr key={req.id} onClick={() => handleRowClick(req)} style={{ cursor: "pointer" }}>
                                                <td>{req.training?.title || "—"}</td>
                                                <td className="muted">
                                                    {req.created_at ? new Date(req.created_at).toLocaleDateString("ru-RU") : "—"}
                                                </td>
                                                <td>
                                                    <span className={`badge ${STATUS_CLASSES[req.status] || ""}`}>
                                                        {STATUS_LABELS[req.status] || req.status}
                                                    </span>
                                                </td>
                                                <td>{req.participants?.length || 0} чел.</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>

            {/* Details Modal */}
            {selectedRequest && (
                <div className="modal-overlay" onClick={closeModal} style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
                    justifyContent: "center", alignItems: "center", zIndex: 1000
                }}>
                    <div className="card" onClick={(e) => e.stopPropagation()} style={{
                        width: "100%", maxWidth: "600px", borderRadius: "16px",
                        padding: "24px", position: "relative"
                    }}>
                        <button onClick={closeModal} style={{
                            position: "absolute", top: "16px", right: "16px",
                            background: "none", border: "none", fontSize: "20px", cursor: "pointer"
                        }}>×</button>

                        <h2 style={{ marginBottom: "20px" }}>Детали заявки</h2>

                        <div style={{ marginBottom: "16px" }}>
                            <div className="muted" style={{ fontSize: "12px", marginBottom: "4px" }}>Тренинг:</div>
                            <div className="strong" style={{ fontSize: "18px" }}>{selectedRequest.training?.title}</div>
                        </div>

                        <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
                            <div>
                                <div className="muted" style={{ fontSize: "12px", marginBottom: "4px" }}>Дата подачи:</div>
                                <div>{selectedRequest.created_at ? new Date(selectedRequest.created_at).toLocaleDateString("ru-RU") : "—"}</div>
                            </div>
                            <div>
                                <div className="muted" style={{ fontSize: "12px", marginBottom: "4px" }}>Статус:</div>
                                <span className={`badge ${STATUS_CLASSES[selectedRequest.status]}`}>
                                    {STATUS_LABELS[selectedRequest.status]}
                                </span>
                            </div>
                        </div>

                        <div className="sectionHeader" style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: "8px", marginBottom: "12px" }}>
                            <h3 style={{ fontSize: "16px", margin: 0 }}>Список участников</h3>
                        </div>

                        <div className="tableWrap" style={{ maxHeight: "250px", overflowY: "auto" }}>
                            <table className="table hr-req-table">
                                <thead>
                                    <tr>
                                        <th>ФИО</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedRequest.participants?.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.employee?.full_name || "—"}</td>
                                            <td className="muted">{p.employee?.email || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="row" style={{ marginTop: "24px", justifyContent: "flex-end" }}>
                            <button className="btn btn-primary" onClick={closeModal}>Закрыть</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
