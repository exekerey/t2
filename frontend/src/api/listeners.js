const API_BASE_URL = "http://localhost:8000"; 


export async function getHrListeners(token) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/employees?role=EMPLOYEE`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    let errorMessage = "Failed to fetch listeners";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch (error) {
     
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}