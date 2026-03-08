import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchSuppliers } from "../../api/suppliers";

export default function HrSuppliers() {
  const [items, setItems] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await fetchSuppliers({ skip: 0, limit: 100 });
        if (alive) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setErr(e?.message || "Failed to fetch");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const options = items.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.bin})`,
    supplier: s
  }));

  return (
    <div className="card" style={{ padding: 30 }}>

      <h2 style={{ marginBottom: 20 }}>Suppliers</h2>

      {loading && <div>Loading suppliers...</div>}
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      {!loading && !err && (
        <>
          {/* Beautiful Dropdown */}
          <div style={{ maxWidth: 400, marginBottom: 30 }}>
            <Select
              options={options}
              placeholder="Select supplier..."
              onChange={(option) => setSelectedSupplier(option?.supplier)}
              isClearable
            />
          </div>

          {/* Selected supplier card */}
          {selectedSupplier && (
            <div
              style={{
                padding: 20,
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                marginBottom: 30,
                background: "#fafafa"
              }}
            >
              <h3 style={{ marginBottom: 10 }}>{selectedSupplier.name}</h3>

              <p><b>BIN:</b> {selectedSupplier.bin}</p>
              <p><b>Email:</b> {selectedSupplier?.contacts?.email ?? "-"}</p>
              <p><b>Phone:</b> {selectedSupplier?.contacts?.phone_number ?? "-"}</p>

              {selectedSupplier?.contacts?.website && (
                <p>
                  <b>Website:</b>{" "}
                  <a
                    href={selectedSupplier.contacts.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selectedSupplier.contacts.website}
                  </a>
                </p>
              )}
            </div>
          )}

          {/* Suppliers table */}
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
                <tr key={s.id}>
                  <td style={td}>{s.name}</td>
                  <td style={td}>{s.bin}</td>
                  <td style={td}>{s?.contacts?.email ?? "-"}</td>
                  <td style={td}>{s?.contacts?.phone_number ?? "-"}</td>
                  <td style={td}>
                    {s?.contacts?.website ? (
                      <a href={s.contacts.website} target="_blank" rel="noreferrer">
                        {s.contacts.website}
                      </a>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #e5e7eb"
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #f1f5f9"
};