import { API_URL } from "../config";

// Function to add a product to favorites
export const addProductToFavorites = async (userId, productId) => {
  try {
    const response = await fetch(`${API_URL}/add-products-favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user_id: userId, product_id: productId }), // Send user_id and product_id in the body
    });

    if (!response.ok) {
      throw new Error("Failed to add product to favorites");
    }

    return await response.json(); // Optionally, return the response if needed
  } catch (error) {
    console.error(error);
  }
};

// Function to fetch favorite products
export const fetchFavoriteProducts = async (userId) => {
  try {
    const response = await fetch(
      `${API_URL}/products-favorites?user_id=${userId}`,
      {
        method: "GET",
        headers: {
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch favorite products");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
