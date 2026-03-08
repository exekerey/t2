import { useEffect, useState } from "react";
import { fetchContracts } from "../../api/contracts";

export default function HrContracts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [status, setStatus] = useState(""); // "", "active", "expired", "closed"


  async function load() {
    try {
      setLoading(true);
      setErr("");
      const data = await fetchContracts({
        status: status || undefined,
        skip: 0,
        limit: 100,
      });
      setItems(data);
    } catch (e) {
      setErr(e.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page">
      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <label>
            Статус:&nbsp;
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Все</option>
              <option value="active">active</option>
              <option value="expired">expired</option>
              <option value="closed">closed</option>
            </select>
          </label>

          <button className="linkBtn" onClick={load}>
            Применить
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          {loading && <div>Загрузка...</div>}
          {err && <div style={{ color: "crimson" }}>Ошибка: {err}</div>}

          {!loading && !err && (
            <table className="table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Date start</th>
                  <th>Date end</th>
                  <th>Budget limit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 12, opacity: 0.7 }}>
                      Пока нет договоров
                    </td>
                  </tr>
                ) : (
                  items.map((c) => (
                    <tr key={c.id}>
                      <td>{c.number}</td>
                      <td>{c.date_start}</td>
                      <td>{c.date_end}</td>
                      <td>{c.budget_limit}</td>
                      <td>{c.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}