import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { fetchSuppliers } from "../../api/suppliers";

const navItems = [
    { label: "Dashboard", icon: DashboardIcon, to: "/manager", end: true },
    { label: "Каталог", icon: CatalogIcon, to: "/manager/catalog" },
    { label: "Подать заявку", icon: TimeIcon, to: "/manager/request" },
    { label: "Заявки", icon: RequestsIcon, to: "/manager/requests" },
];

function toLocalDateString(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("ru-RU", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatPrice(amount, model) {
    if (!amount) return "Бесплатно";
    const modelText = model === "per_group" ? "за группу" : "за чел.";
    return `${amount} ₸ (${modelText})`;
}

export default function ManagerCatalog() {
    const navigate = useNavigate();
    const [trainings, setTrainings] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters
    const [filters, setFilters] = useState({
        type: "",
        city: "",
        date_from: "",
        date_to: "",
        supplier_id: "",
    });

    useEffect(() => {
        // Load suppliers once for the filter dropdown
        fetchSuppliers()
            .then(setSuppliers)
            .catch(err => console.error("Failed to load suppliers:", err));
    }, []);

    const loadTrainings = async () => {
        setLoading(true);
        setError("");
        try {
            // Pass non-empty filters to the API
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== "")
            );

            const data = await fetchTrainings({ limit: 100, ...activeFilters });
            setTrainings(data);
        } catch (err) {
            setError(err.message || "Ошибка загрузки списка тренингов");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrainings();
    }, [filters]); // Re-fetch when filters change automatically

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            type: "",
            city: "",
            date_from: "",
            date_to: "",
            supplier_id: "",
        });
    };

    return (
        <div className="layout">
            <DashboardSidebar
                navItems={navItems}
                activeIndex={1} // "Каталог" is index 1
                SettingsIcon={SettingsIcon}
                LogoutIcon={LogoutIcon}
            />

            <main className="main">
                <DashboardTopbar
                    title="Каталог тренингов"
                    SearchIcon={SearchIcon}
                    BellIcon={BellIcon}
                    UserIcon={UserIcon}
                    searchPlaceholder="Поиск..."
                />

                {/* Filters Section */}
                <div className="card" style={{ marginBottom: "20px", display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap", padding: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>Тип</label>
                        <select
                            className="input"
                            style={{ minWidth: "120px" }}
                            value={filters.type}
                            onChange={e => handleFilterChange("type", e.target.value)}
                        >
                            <option value="">Все</option>
                            <option value="SEMINAR">Семинар</option>
                            <option value="TRAINING">Курс</option>
                            <option value="CERTIFICATION">Воркшоп</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>Город</label>
                        <input
                            className="input"
                            placeholder="Напр. Astana"
                            value={filters.city}
                            onChange={e => handleFilterChange("city", e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>С даты</label>
                        <input
                            type="date"
                            className="input"
                            value={filters.date_from}
                            onChange={e => handleFilterChange("date_from", e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>По дату</label>
                        <input
                            type="date"
                            className="input"
                            value={filters.date_to}
                            onChange={e => handleFilterChange("date_to", e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>Поставщик</label>
                        <select
                            className="input"
                            value={filters.supplier_id}
                            onChange={e => handleFilterChange("supplier_id", e.target.value)}
                            style={{ minWidth: "180px" }}
                        >
                            <option value="">Все поставщики</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name || s.contact_name}</option>
                            ))}
                        </select>
                    </div>

                    <button className="btn btn-ghost" onClick={handleClearFilters} style={{ marginLeft: "auto" }}>
                        Сбросить
                    </button>
                </div>

                {/* Catalog Table */}
                <div className="card">
                    <div className="tableWrap">
                        {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}

                        <table className="table hr-req-table">
                            <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Тип</th>
                                    <th>Тренер</th>
                                    <th>Дата начала</th>
                                    <th>Локация</th>
                                    <th>Стоимость</th>
                                    <th>Места</th>
                                    <th>Действие</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="empty" style={{ textAlign: "center" }}>
                                            Загрузка...
                                        </td>
                                    </tr>
                                ) : trainings.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="empty" style={{ textAlign: "center" }}>
                                            По вашему запросу не найдено ни одного тренинга.
                                        </td>
                                    </tr>
                                ) : (
                                    trainings.map(t => (
                                        <tr key={t.id}>
                                            <td>{t.title}</td>
                                            <td>
                                                <span className="badge badge--submitted" style={{ textTransform: "capitalize" }}>
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td>{t.trainer_name || "—"}</td>
                                            <td className="hr-req-date">
                                                {toLocalDateString(t.date_start)}
                                                <div className="hr-req-dash">до {toLocalDateString(t.date_end)}</div>
                                            </td>
                                            <td>{t.location || "—"}</td>
                                            <td>{formatPrice(t.price_amount, t.pricing_model)}</td>
                                            <td>{t.capacity > 0 ? t.capacity : "—"}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ fontSize: "13px", padding: "6px 14px" }}
                                                    onClick={() => navigate(`/manager/request?training_id=${t.id}`)}
                                                >
                                                    Подать заявку
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
}
