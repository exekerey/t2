import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../Dashboard.css"; // Reuse existing layout styles

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

import { fetchTrainings } from "../../api/trainings";
import { fetchEmployees } from "../../api/employees";
import { createRequest } from "../../api/requests";

const navItems = [
    { label: "Dashboard", icon: DashboardIcon, to: "/manager", end: true },
    { label: "Каталог", icon: CatalogIcon, to: "/manager/catalog" },
    { label: "Подать заявку", icon: TimeIcon, to: "/manager/request" },
    { label: "Заявки", icon: RequestsIcon, to: "/manager/requests" },
];

export default function ManagerCreateRequest() {
    const navigate = useNavigate();
    const location = useLocation();

    const [trainings, setTrainings] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [selectedTraining, setSelectedTraining] = useState("");
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            setError("");
            try {
                const [trainingsData, employeesData] = await Promise.all([
                    fetchTrainings({ limit: 100 }),
                    fetchEmployees({ limit: 100 })
                ]);
                setTrainings(trainingsData);
                setEmployees(employeesData);
            } catch (err) {
                setError(err.message || "Ошибка загрузки данных");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Check query params for training_id to pre-select it
    useEffect(() => {
        if (!loading && trainings.length > 0) {
            const params = new URLSearchParams(location.search);
            const tId = params.get("training_id");
            if (tId && trainings.some(t => t.id === tId)) {
                setSelectedTraining(tId);
            }
        }
    }, [loading, trainings, location]);

    const handleToggleEmployee = (id) => {
        setSelectedEmployees((prev) =>
            prev.includes(id) ? prev.filter(eId => eId !== id) : [...prev, id]
        );
    };

    const handleToggleAll = (e) => {
        if (e.target.checked) {
            setSelectedEmployees(employees.map(emp => emp.id));
        } else {
            setSelectedEmployees([]);
        }
    };

    const isFormValid = selectedTraining && selectedEmployees.length > 0;

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            await createRequest({
                training_id: selectedTraining,
                participant_ids: selectedEmployees
            });
            setSuccess("Заявка успешно отправлена!");
            setSelectedTraining("");
            setSelectedEmployees([]);
            // Optional: auto-redirect after a few seconds
            // setTimeout(() => navigate("/manager/requests"), 2000);
        } catch (err) {
            setError(err.message || "Ошибка при отправке заявки");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="layout">
            <DashboardSidebar
                navItems={navItems}
                activeIndex={2} // "Подать заявку" index
                SettingsIcon={SettingsIcon}
                LogoutIcon={LogoutIcon}
            />

            <main className="main">
                <DashboardTopbar
                    title="Подать заявку"
                    SearchIcon={SearchIcon}
                    BellIcon={BellIcon}
                    UserIcon={UserIcon}
                    searchPlaceholder="Поиск..."
                />

                <section>
                    <div className="sectionHeader" style={{ marginBottom: "16px" }}>
                        <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#111827", margin: 0 }}>Создание заявки на обучение</h1>
                    </div>

                    <div className="card" style={{ padding: "16px" }}>
                        {loading ? (
                            <div className="muted" style={{ padding: "20px", textAlign: "center" }}>Загрузка данных...</div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                                {/* Training Selection */}
                                <div>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", opacity: 0.8, marginBottom: "6px" }}>
                                        Выберите тренинг
                                    </label>
                                    <select
                                        className="input"
                                        style={{ width: "100%", maxWidth: "450px" }}
                                        value={selectedTraining}
                                        onChange={(e) => setSelectedTraining(e.target.value)}
                                    >
                                        <option value="" disabled>-- Выберите тренинг --</option>
                                        {trainings.map(t => (
                                            <option key={t.id} value={t.id}>{t.title} ({t.type})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Employee Selection */}
                                <div>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", opacity: 0.8, marginBottom: "6px" }}>
                                        Выберите сотрудников
                                    </label>
                                    <div className="tableWrap" style={{ maxHeight: "350px", overflowY: "auto" }}>
                                        <table className="table hr-req-table">
                                            <thead style={{ position: "sticky", top: 0, background: "#F9FAFB", zIndex: 1 }}>
                                                <tr>
                                                    <th style={{ width: "40px", textAlign: "center" }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={employees.length > 0 && selectedEmployees.length === employees.length}
                                                            onChange={handleToggleAll}
                                                        />
                                                    </th>
                                                    <th>ФИО Сотрудника</th>
                                                    <th>Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employees.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={3} className="empty" style={{ textAlign: "center" }}>Сотрудники не найдены</td>
                                                    </tr>
                                                ) : (
                                                    employees.map(emp => (
                                                        <tr key={emp.id} onClick={() => handleToggleEmployee(emp.id)} style={{ cursor: "pointer" }}>
                                                            <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedEmployees.includes(emp.id)}
                                                                    onChange={() => handleToggleEmployee(emp.id)}
                                                                />
                                                            </td>
                                                            <td>{emp.full_name}</td>
                                                            <td className="muted">{emp.email || "—"}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{ marginTop: "8px", fontSize: "12px", color: "#6B7280" }}>
                                        Выбрано сотрудников: {selectedEmployees.length}
                                    </div>
                                </div>

                                {/* Alerts */}
                                {error && <div className="error">{error}</div>}
                                {success && <div style={{ padding: "12px", background: "#D1FAE5", color: "#065F46", borderRadius: "6px", fontSize: "14px" }}>{success}</div>}

                                {/* Submit Action */}
                                <div className="row" style={{ marginTop: "10px" }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSubmit}
                                        disabled={!isFormValid || submitting}
                                    >
                                        {submitting ? "Отправка..." : "Отправить заявку"}
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
