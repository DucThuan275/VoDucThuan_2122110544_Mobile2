import { API_URL } from "../config";

export const fetchGetAllNews = async () => {
  try {
    const response = await fetch(`${API_URL}/news/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch all news");
    }
    const data = await response.json();
    return data; // Trả về danh sách tất cả tin tức
  } catch (error) {
    console.error(error);
    throw error; // Để xử lý lỗi bên ngoài
  }
};

export const fetchGetListNew = async () => {
  try {
    const response = await fetch(`${API_URL}/news/latest`);
    if (!response.ok) {
      throw new Error("Failed to fetch latest news");
    }
    const data = await response.json();
    return data; // Trả về 2 mẫu tin mới nhất
  } catch (error) {
    console.error(error);
    throw error; // Để xử lý lỗi bên ngoài
  }
};

export const fetchNewsDetail = async (id) => {
  try {
    const response = await fetch(`${API_URL}/news/${id}`);

    // Kiểm tra mã phản hồi
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch news detail:", error);
    throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm
  }
};
