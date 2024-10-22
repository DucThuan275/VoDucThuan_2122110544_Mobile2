import { API_URL } from "../config";

export const fetchBanners = async () => {
  try {
    const response = await fetch(`${API_URL}/banners`);
    if (!response.ok) {
      throw new Error("Failed to fetch Banners");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
