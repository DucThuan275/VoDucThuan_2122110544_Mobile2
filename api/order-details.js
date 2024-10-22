import { API_URL } from "../config";

export const fetchGetUserOrders = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/orders/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch orders!");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};
