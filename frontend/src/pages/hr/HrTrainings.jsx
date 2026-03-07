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
    type: "SEMINAR",
    trainer_name: "",
    date_start: "",
    date_end: "",
    location: "",
    pricing_model: "per_person",
    price_amount: 0,
    capacity: 0,
    supplier_id: "",
  });

  // edit states
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    type: "SEMINAR",
    trainer_name: "",
    date_start: "",
    date_end: "",
    location: "",
    pricing_model: "per_person",
    price_amount: 0,
    capacity: 0,
  });

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

  const canSaveEdit = useMemo(() => {
    return (
      editForm.title.trim() &&
      editForm.trainer_name.trim() &&
      editForm.date_start &&
      editForm.date_end &&
      editForm.location.trim()
    );
  }, [editForm]);

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

  function onEdit(training) {
    setEditId(training.id);
    setEditForm({
      title: training.title || "",
      type: training.type || "SEMINAR",
      trainer_name: training.trainer_name || "",
      date_start: toLocalDatetimeInputValue(training.date_start),
      date_end: toLocalDatetimeInputValue(training.date_end),
      location: training.location || "",
      pricing_model: training.pricing_model || "per_person",
      price_amount: training.price_amount ?? 0,
      capacity: training.capacity ?? 0,
    });
  }

  function onCancelEdit() {
    setEditId(null);
    setEditForm({
      title: "",
      type: "SEMINAR",
      trainer_name: "",
      date_start: "",
      date_end: "",
      location: "",
      pricing_model: "per_person",
      price_amount: 0,
      capacity: 0,
    });
  }

  async function onSaveEdit(id) {
    try {
      setErr("");
      setSaving(true);

      const payload = {
        title: editForm.title,
        type: editForm.type,
        trainer_name: editForm.trainer_name,
        date_start: editForm.date_start,
        date_end: editForm.date_end,
        location: editForm.location,
        pricing_model: editForm.pricing_model,
        price_amount: Number(editForm.price_amount) || 0,
        capacity: Number(editForm.capacity) || 0,
      };

      await updateTraining(id, payload);
      onCancelEdit();
      await load();
    } catch (e) {
      setErr(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="hr-page">
      <div className="hr-header">
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
              <option value="SEMINAR">seminar</option>
              <option value="TRAINING">training</option>
              <option value="CERTIFICATION">certification</option>
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

      <div className="card">
        <div className="card-head">
          <div className="card-title">Список тренингов</div>
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
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="empty">
                      Пока нет тренингов
                    </td>
                  </tr>
                ) : (
                  items.map((t) => {
                    const isEditing = editId === t.id;

                    return (
                      <tr key={t.id}>
                        <td className="strong">
                          {isEditing ? (
                            <input
                              className="input"
                              value={editForm.title}
                              onChange={(e) =>
                                setEditForm((p) => ({ ...p, title: e.target.value }))
                              }
                            />
                          ) : (
                            t.title
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <select
                              className="input"
                              value={editForm.type}
                              onChange={(e) =>
                                setEditForm((p) => ({ ...p, type: e.target.value }))
                              }
                            >
                              <option value="SEMINAR">seminar</option>
                              <option value="TRAINING">course</option>
                              <option value="CERTIFICATION">workshop</option>
                            </select>
                          ) : (
                            t.type
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              className="input"
                              value={editForm.trainer_name}
                              onChange={(e) =>
                                setEditForm((p) => ({ ...p, trainer_name: e.target.value }))
                              }
                            />
                          ) : (
                            t.trainer_name
                          )}
                        </td>

                        <td className="nowrap">
                          {isEditing ? (
                            <input
                              type="datetime-local"
                              className="input"
                              value={editForm.date_start}
                              onChange={(e) =>
                                setEditForm((p) => ({ ...p, date_start: e.target.value }))
                              }
                            />
                          ) : (
                            toLocalDatetimeInputValue(t.date_start)
                          )}
                        </td>

                        <td className="nowrap">
                          {isEditing ? (
                            <input
                              type="datetime-local"
                              className="input"
                              value={editForm.date_end}
                              onChange={(e) =>
                                setEditForm((p) => ({ ...p, date_end: e.target.value }))
                              }
                            />
                          ) : (
                            toLocalDatetimeInputValue(t.date_end)
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              className="input"
                              value={editForm.location}
                              onChange={(e) =>
                                setEditForm((p) => ({ ...p, location: e.target.value }))
                              }
                            />
                          ) : (
                            t.location
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <div style={{ display: "flex", gap: 8 }}>
                              <select
                                className="input"
                                value={editForm.pricing_model}
                                onChange={(e) =>
                                  setEditForm((p) => ({
                                    ...p,
                                    pricing_model: e.target.value,
                                  }))
                                }
                              >
                                <option value="per_person">per_person</option>
                                <option value="per_group">per_group</option>
                              </select>

                              <input
                                type="number"
                                className="input"
                                value={editForm.price_amount}
                                onChange={(e) =>
                                  setEditForm((p) => ({
                                    ...p,
                                    price_amount: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          ) : (
                            <>
                              {t.pricing_model} · {t.price_amount}
                            </>
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              className="input"
                              value={editForm.capacity}
                              onChange={(e) =>
                                setEditForm((p) => ({ ...p, capacity: e.target.value }))
                              }
                            />
                          ) : (
                            t.capacity
                          )}
                        </td>

                        <td>
                          <div className="btnGroup">
                            {isEditing ? (
                              <>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => onSaveEdit(t.id)}
                                  disabled={!canSaveEdit || saving}
                                >
                                  {saving ? "Saving..." : "Save"}
                                </button>

                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={onCancelEdit}
                                  disabled={saving}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => onQuickUpdateType(t.id, "SEMINAR")}
                                >
                                  set seminar
                                </button>

                                <button
                                  className="btn btn-dark btn-sm"
                                  onClick={() => onEdit(t)}
                                >
                                  Edit
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
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