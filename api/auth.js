import { API_URL } from "../config";

// Đăng ký người dùng
export const registerUser = async (name, email, password, phone) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed!");
    }

    return await response.json();
  } catch (error) {}
};

// Đăng nhập người dùng
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed!");
    }

    return await response.json();
  } catch (error) {}
};
// Thay đổi mật khẩu người dùng
export const changePassword = async (id, email, oldPassword, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/user/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        email,
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword, // Xác nhận mật khẩu mới
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Change password failed!");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};