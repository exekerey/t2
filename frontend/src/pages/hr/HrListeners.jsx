import { useEffect, useState } from "react";
import { getHrListeners } from "../../api/listeners";

export default function HrListeners() {
  const [listeners, setListeners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListeners = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const data = await getHrListeners(token);
        const employees = data.filter((item) => item.role === "EMPLOYEE");

        setListeners(employees);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchListeners();
  }, []);

  if (loading) {
    return <div className="loading">Loading listeners...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="page">
      {listeners.length === 0 ? (
        <p className="empty">No listeners found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {listeners.map((listener) => (
              <tr key={listener.id}>
                <td>{listener.full_name}</td>
                <td>{listener.email}</td>
                <td>{listener.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}