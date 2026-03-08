import { useEffect, useMemo, useState } from "react";
import { approveRequest, fetchRequests, rejectRequest } from "../../api/requests";


export default function HrRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [status, setStatus] = useState(""); // "" | submitted | approved | rejected
  const scope = "inbox";

  const [approveContractId, setApproveContractId] = useState({}); // { [requestId]: "uuid" }
  const [rejectReason, setRejectReason] = useState({}); // { [requestId]: "text" }
  const [actionLoading, setActionLoading] = useState({}); // { [requestId]: true/false }

  const countByStatus = useMemo(() => {
    const c = { submitted: 0, approved: 0, rejected: 0 };
    for (const r of items) if (r?.status && c[r.status] !== undefined) c[r.status]++;
    return c;
  }, [items]);

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const data = await fetchRequests({
        scope,
        status: status || undefined,
        skip: 0,
        limit: 100,
      });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  async function onApprove(id) {
    const contract_id = (approveContractId[id] || "").trim();
    if (!contract_id) {
      setErr("Для approve нужен contract_id (UUID).");
      return;
    }

    try {
      setErr("");
      setActionLoading((p) => ({ ...p, [id]: true }));
      await approveRequest(id, contract_id);
      await load();
    } catch (e) {
      setErr(e.message || "Approve failed");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  }

  async function onReject(id) {
    const reason = (rejectReason[id] || "").trim();
    if (!reason) {
      setErr("Для reject нужен reject_reason.");
      return;
    }

    try {
      setErr("");
      setActionLoading((p) => ({ ...p, [id]: true }));
      await rejectRequest(id, reason);
      await load();
    } catch (e) {
      setErr(e.message || "Reject failed");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const badgeClass = (s) =>
    s === "submitted"
      ? "badge badge--submitted"
      : s === "approved"
      ? "badge badge--approved"
      : "badge badge--rejected";

  return (
    <div className="hr-req-page">
      <div className="hr-req-head">
        <div>
          <div className="hr-req-subtitle">{/* HR Inbox: approve/reject submitted */}</div>
        </div>

        <div className="hr-req-stats">
          <span className={badgeClass("submitted")}>submitted: {countByStatus.submitted}</span>
          <span className={badgeClass("approved")}>approved: {countByStatus.approved}</span>
          <span className={badgeClass("rejected")}>rejected: {countByStatus.rejected}</span>
        </div>
      </div>

      <div className="hr-req-card">
        <div className="hr-req-toolbar">
          <div className="hr-req-tools">
            <label className="hr-req-label">
              Статус:
              <select
                className="hr-req-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Все</option>
                <option value="submitted">submitted</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
              </select>
            </label>

            <button className="btn btn--primary" onClick={load}>
              Обновить
            </button>
          </div>

          <div className="hr-req-note">
            
          </div>
        </div>

        <div className="hr-req-body">
          {loading && <div>Загрузка...</div>}
          {err && <div className="hr-req-error">Ошибка: {err}</div>}

          {!loading && !err && (
            <div className="hr-req-tableWrap">
              <table className="hr-req-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Training</th>
                    <th>Manager</th>
                    <th>Status</th>
                    <th>Cost</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="hr-req-empty">
                        Пока нет заявок
                      </td>
                    </tr>
                  ) : (
                    items.map((r) => {
                      const isSubmitted = r.status === "submitted";
                      const busy = !!actionLoading[r.id];

                      return (
                        <tr key={r.id}>
                          <td className="mono mono--id">{r.id}</td>

                          <td className="mono">{r.training_id}</td>

                          <td className="mono">{r.manager_id}</td>

                          <td>
                            <span className={badgeClass(r.status)}>{r.status}</span>
                            {r.reject_reason ? (
                              <div className="hr-req-reason">reason: {r.reject_reason}</div>
                            ) : null}
                          </td>

                          <td>{r.cost_amount ?? 0}</td>

                          <td className="hr-req-date">
                            {r.submitted_at ? String(r.submitted_at).replace("T", " ").slice(0, 19) : "-"}
                          </td>

                          <td>
                            {isSubmitted ? (
                              <div className="hr-req-actions">
                                <div className="hr-req-actionRow">
                                  <input
                                    className="hr-req-input"
                                    value={approveContractId[r.id] || ""}
                                    onChange={(e) =>
                                      setApproveContractId((p) => ({ ...p, [r.id]: e.target.value }))
                                    }
                                    placeholder="contract_id (UUID)"
                                  />
                                  <button
                                    className="btn btn--primary"
                                    onClick={() => onApprove(r.id)}
                                    disabled={busy}
                                  >
                                    Approve
                                  </button>
                                </div>

                                <div className="hr-req-actionRow">
                                  <input
                                    className="hr-req-input"
                                    value={rejectReason[r.id] || ""}
                                    onChange={(e) =>
                                      setRejectReason((p) => ({ ...p, [r.id]: e.target.value }))
                                    }
                                    placeholder="reject_reason"
                                  />
                                  <button
                                    className="btn btn--danger"
                                    onClick={() => onReject(r.id)}
                                    disabled={busy}
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="hr-req-dash">—</div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}