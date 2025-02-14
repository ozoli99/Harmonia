const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const fetchAppointments = async (
    token: string | null
): Promise<any[]> => {
    const authToken = token || undefined;
    const response = await fetch(`${API_URL}/api/appointments`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: authToken ? `Bearer ${authToken}` : "",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch appointments");
    }
    return response.json();
};
