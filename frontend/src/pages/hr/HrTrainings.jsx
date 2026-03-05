import { useEffect, useMemo, useState } from "react";
import { createTraining, fetchTrainings, updateTraining } from "../../api/trainings";


function toLocalDatetimeInputValue(iso) {
  if (!iso) return "";
  return iso.slice(0, 16);
}

export default function HrTraining() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // pagination
  const [skip, setSkip] = useState(0);
  const limit = 100;

  // create form
  const [form, setForm] = useState({
    title: "",
    type: "seminar", // seminar | course | workshop
    trainer_name: "",
    date_start: "",
    date_end: "",
    location: "",
    pricing_model: "per_person", // per_person | per_group
    price_amount: 0,
    capacity: 0,
    supplier_id: "",
  });

  const [editId, setEditId] = useState(null);

  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.trainer_name.trim() &&
      form.date_start &&
      form.date_end &&
      form.location.trim() &&
      form.supplier_id.trim()
    );
  }, [form]);

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const data = await fetchTrainings({ skip, limit });
      setItems(data);
    } catch (e) {
      setErr(e.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  async function onCreate() {
    try {
      setErr("");
      const payload = {
        ...form,
        price_amount: Number(form.price_amount) || 0,
        capacity: Number(form.capacity) || 0,
      };

      await createTraining(payload);

      setForm((p) => ({
        ...p,
        title: "",
        trainer_name: "",
        location: "",
        supplier_id: "",
        price_amount: 0,
        capacity: 0,
      }));

      await load();
    } catch (e) {
      setErr(e.message || "Create failed");
    }
  }

  async function onQuickUpdateType(id, newType) {
    try {
      setErr("");
      await updateTraining(id, { type: newType });
      await load();
    } catch (e) {
      setErr(e.message || "Update failed");
    }
  }

  return (
    <div className="hr-page">
      <div className="hr-header">
        {/* <div>
          <h1 className="hr-title">Тренинги</h1>
          <div className="hr-subtitle">Управление тренингами (создание и список)</div>
        </div> */}

        <div className="hr-actions">
          <button
            className="btn btn-ghost"
            onClick={() => setSkip((s) => Math.max(0, s - limit))}
          >
            ← Назад
          </button>

          <button className="btn btn-ghost" onClick={() => setSkip((s) => s + limit)}>
            Вперёд →
          </button>
        </div>
      </div>

      {/* Create card */}
      <div className="card">
        <div className="card-title">Создать тренинг</div>

        <div className="grid-3">
          <div className="field">
            <div className="label">Title</div>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Напр. JavaScript Basics"
            />
          </div>

          <div className="field">
            <div className="label">Type</div>
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            >
              <option value="seminar">seminar</option>
              <option value="course">course</option>
              <option value="workshop">workshop</option>
            </select>
          </div>

          <div className="field">
            <div className="label">Trainer name</div>
            <input
              className="input"
              value={form.trainer_name}
              onChange={(e) => setForm((p) => ({ ...p, trainer_name: e.target.value }))}
              placeholder="Имя тренера"
            />
          </div>

          <div className="field">
            <div className="label">Date start</div>
            <input
              type="datetime-local"
              className="input"
              value={form.date_start}
              onChange={(e) => setForm((p) => ({ ...p, date_start: e.target.value }))}
            />
          </div>

          <div className="field">
            <div className="label">Date end</div>
            <input
              type="datetime-local"
              className="input"
              value={form.date_end}
              onChange={(e) => setForm((p) => ({ ...p, date_end: e.target.value }))}
            />
          </div>

          <div className="field">
            <div className="label">Location</div>
            <input
              className="input"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              placeholder="Напр. Astana, Hall A"
            />
          </div>

          <div className="field">
            <div className="label">Pricing model</div>
            <select
              className="input"
              value={form.pricing_model}
              onChange={(e) => setForm((p) => ({ ...p, pricing_model: e.target.value }))}
            >
              <option value="per_person">per_person</option>
              <option value="per_group">per_group</option>
            </select>
          </div>

          <div className="field">
            <div className="label">Price amount</div>
            <input
              type="number"
              className="input"
              value={form.price_amount}
              onChange={(e) => setForm((p) => ({ ...p, price_amount: e.target.value }))}
            />
          </div>

          <div className="field">
            <div className="label">Capacity</div>
            <input
              type="number"
              className="input"
              value={form.capacity}
              onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
            />
          </div>

          <div className="field span-3">
            <div className="label">Supplier ID</div>
            <input
              className="input mono"
              value={form.supplier_id}
              onChange={(e) => setForm((p) => ({ ...p, supplier_id: e.target.value }))}
              placeholder="UUID поставщика"
            />
          </div>
        </div>

        <div className="row">
          <button className="btn btn-primary" onClick={onCreate} disabled={!canSubmit}>
            Создать
          </button>

          <button className="btn btn-ghost" onClick={load}>
            Обновить
          </button>

          {err && <div className="error">Ошибка: {err}</div>}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">Список тренингов</div>
          <div className="muted">skip={skip}, limit={limit}</div>
        </div>

        <div className="tableWrap">
          {loading && <div className="muted">Загрузка...</div>}

          {!loading && !err && (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Trainer</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Capacity</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="empty">
                      Пока нет тренингов
                    </td>
                  </tr>
                ) : (
                  items.map((t) => (
                    <tr key={t.id}>
                      <td className="strong">{t.title}</td>
                      <td>{t.type}</td>
                      <td>{t.trainer_name}</td>
                      <td className="nowrap">{toLocalDatetimeInputValue(t.date_start)}</td>
                      <td className="nowrap">{toLocalDatetimeInputValue(t.date_end)}</td>
                      <td>{t.location}</td>
                      <td>
                        {t.pricing_model} · {t.price_amount}
                      </td>
                      <td>{t.capacity}</td>
                      <td className="mono small">{t.supplier_id}</td>
                      <td>
                        <div className="btnGroup">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => onQuickUpdateType(t.id, "seminar")}
                          >
                            set seminar
                          </button>
                          <button
                            className="btn btn-dark btn-sm"
                            onClick={() => {
                              setEditId(t.id);
                              alert("Редактирование можно сделать модалкой (позже добавим)");
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {editId && (
          <div className="selected">
            selected id: <span className="mono">{editId}</span>
          </div>
        )}
      </div>
    </div>
  );
}