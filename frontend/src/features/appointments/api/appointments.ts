const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const fetchAppointments = async (token?: string): Promise<any[]> => {
    const response = await fetch(`${API_URL}/api/v1/appointments`, {
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch appointments");
    }

    return response.json();
};
