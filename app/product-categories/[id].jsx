import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { fetchProductByCategories } from "../../api/products";
import { useRoute } from "@react-navigation/native";
import { API_URL_IMAGE } from "./../../config";

export default function CategoryProducts({}) {
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params; // Lấy id từ params
  const [categoryProducts, setCategoryProducts] = useState([]); // State để lưu danh sách sản phẩm
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading

  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProductByCategories(id);
      setCategoryProducts(products);
      setLoading(false);
    };

    loadProducts();
  }, [id]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false} // Ẩn scrollbar
    >
      {categoryProducts.map((product) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/product-details/[id]",
              params: { id: product.id },
            })
          }
          key={product.id}
          style={styles.card}
        >
          <Image
            source={{ uri: `${API_URL_IMAGE}/products/${product.image}` }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>$ {product.pricebuy}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 5, // Tăng hiệu ứng bóng
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    width: "48%", // Chiếm 48% chiều rộng để tạo khoảng cách
    overflow: "hidden", // Ngăn ngừa tràn nội dung
  },
  image: {
    width: "100%",
    height: 120, // Tăng chiều cao cho hình ảnh
    borderRadius: 10,
    marginBottom: 10, // Khoảng cách giữa hình ảnh và văn bản
  },
  productName: {
    fontFamily: "outfit-medium",
    fontSize: 18, // Tăng kích thước font
    color: "#333",
    marginBottom: 5, // Khoảng cách giữa tên và giá
  },
  productPrice: {
    fontFamily: "outfit-regular",
    fontSize: 16, // Tăng kích thước font
    color: "#666",
  },
});
