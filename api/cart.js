import { API_URL } from "../config";

export async function fetchGetCart(userId) {
  try {
    const response = await fetch(`${API_URL}/cart?user_id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error fetching cart");
    }

    const data = await response.json();
    return data.cart_items; // Trả về danh sách sản phẩm trong giỏ hàng
  } catch (error) {
    console.error("Error:", error.message);
    // Xử lý lỗi như thông báo cho người dùng
    throw error; // Ném lỗi ra ngoài để có thể xử lý tại nơi gọi hàm
  }
}

export const fetchAddToCart = async (userId, productId, quantity, pricebuy) => {
    try {
      const response = await fetch('http://localhost/pet-adopt-app/public/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          quantity: quantity,
          pricebuy: pricebuy,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Error adding to cart');
      }
  
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.' };
    }
  };
  