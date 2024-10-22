import { API_URL } from "../config";

// Hàm thanh toán
export const fetchCheckout = async (checkoutData) => {
  try {
    const response = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      throw new Error('Đã xảy ra lỗi khi thanh toán');
    }

    const data = await response.json();
    return data; // Trả về dữ liệu đơn hàng
  } catch (error) {
    console.error(error);
    throw error; // Ném lại lỗi để xử lý ở nơi khác nếu cần
  }
};
