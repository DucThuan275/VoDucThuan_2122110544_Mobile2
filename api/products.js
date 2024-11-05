import { API_URL } from "../config";

// Lấy tất cả sản phẩm
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/product-all/latest`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
export const fetchAllProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Lấy chi tiết một sản phẩm và sản phẩm liên quan
export const fetchProductById = async (id) => {
  const response = await fetch(`${API_URL}/product-detail/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product details and related products");
  }
  return await response.json();
};

export const fetchProductByCategories = async (categoryId) => {
  try {
    const response = await fetch(
      `${API_URL}/products/categories/${categoryId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return []; // Hoặc có thể ném lỗi tùy theo cách bạn muốn xử lý
  }
};

export const fetchSearchProducts = async (query) => {
  try {
    const response = await fetch(`${API_URL}/products-search?query=${query}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
