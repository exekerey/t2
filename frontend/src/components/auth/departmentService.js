import api from "../../api/api";

export async function getDepartments({ skip = 0, limit = 100 } = {}) {
  const { data } = await api.get("/departments/", { params: { skip, limit } });
  return data; 
}