import { useEffect, useState } from "react";
import { fetchSuppliers } from "../../api/suppliers"; 

export default function HrSuppliers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await fetchSuppliers({ skip: 0, limit: 100 });
        if (alive) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setErr(e?.message || "Failed to fetch");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  return (
    <div className="card" style={{ padding: 20 }}>

      {loading && <div>Загрузка...</div>}
      {!loading && err && <div style={{ color: "crimson" }}>Ошибка: {err}</div>}

      {!loading && !err && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>BIN</th>
                <th style={th}>Email</th>
                <th style={th}>Phone</th>
                <th style={th}>Website</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id ?? `${s.name}-${s.bin}`}>
                  <td style={td}>{s.name}</td>
                  <td style={td}>{s.bin}</td>
                  <td style={td}>{s?.contacts?.email ?? "-"}</td>
                  <td style={td}>{s?.contacts?.phone_number ?? "-"}</td>
                  <td style={td}>
                    {s?.contacts?.website ? (
                      <a href={s.contacts.website} target="_blank" rel="noreferrer">
                        {s.contacts.website}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td style={td} colSpan={5}>Пока нет поставщиков</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = { textAlign: "left", padding: "10px 8px", borderBottom: "1px solid #e5e7eb" };
const td = { padding: "10px 8px", borderBottom: "1px solid #eef2f7" };