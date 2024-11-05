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
        new_password_confirmation: newPassword,
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

// Thay đổi thông tin người dùng
export const changeProfile = async (id, name, email, phone) => {
  try {
    const response = await fetch(`${API_URL}/auth/change-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name,
        email,
        phone,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Change profile failed!");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
// Gửi yêu cầu OTP
export const requestOtp = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/request-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send OTP.");
    }

    const data = await response.json();
    console.log(data.message); // Hiển thị thông báo thành công
    return data; // Trả về dữ liệu nếu cần
  } catch (error) {
    console.error("Error:", error.message); // Xử lý lỗi
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
}

// Đặt lại mật khẩu
export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        otp: otp,
        new_password: newPassword,
        new_password_confirmation: newPassword // Nếu cần xác nhận mật khẩu
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reset password.");
    }

    const data = await response.json();
    console.log(data.message); // Hiển thị thông báo thành công
    return data; // Trả về dữ liệu nếu cần
  } catch (error) {
    console.error("Error:", error.message); // Xử lý lỗi
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
}
