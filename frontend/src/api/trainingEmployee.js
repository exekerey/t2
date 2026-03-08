import api from "./api"; 

// GET all trainings
export async function getTrainings() {
  const { data } = await api.get("/trainings/");
  return data;
}

// GET one training
export async function getTraining(id) {
  const { data } = await api.get(`/trainings/${id}`);
  return data;
}