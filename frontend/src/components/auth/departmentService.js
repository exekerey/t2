// src/pages/auth/departmentService.js  (adjust path to your project)
import api from "../../api/api";

export async function getDepartments({ skip = 0, limit = 100 } = {}) {
  const { data } = await api.get("/departments/", { params: { skip, limit } });
  return data; // expected: [{ id, name }]
}