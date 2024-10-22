import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchCategories } from "./../../api/categories";
import { API_URL_IMAGE } from "./../../config";

export default function Category() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      if (data) {
        // Thêm mục "All" vào danh sách danh mục
        const allCategories = [
          {
            id: "all",
            source: {
              uri: "https://cdn-icons-png.flaticon.com/128/9411/9411889.png",
            },
            title: "All Pet",
          },
          ...data.map((cat) => ({
            id: cat.id,
            source: { uri: `${API_URL_IMAGE}/categories/${cat.image}` }, // Cập nhật đường dẫn
            title: cat.name,
          })),
        ];
        setCategories(allCategories);
      }
    };

    loadCategories();
  }, []);

  return (
    <View>
      <Text style={styles.title}>Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {categories.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() =>
                item.id === "all"
                  ? router.push("/product") // Chuyển hướng đến trang tất cả sản phẩm
                  : router.push({
                      pathname: "/product-categories/[id]",
                      params: { id: item.id },
                    })
              }
              style={styles.container}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={item.source}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    marginTop: 10,
    fontFamily: "outfit-medium",
    fontSize: 18,
    color: "#333",
  },
  itemContainer: {
    alignItems: "center",
    marginRight: 20,
  },
  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#FFFFCC",
    borderWidth: 2,
    borderColor: "#FFCC00",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "70%",
    height: "70%",
    borderRadius: 15,
  },
  itemTitle: {
    textAlign: "center",
    marginTop: 5,
    fontFamily: "outfit-medium",
    fontSize: 14,
    color: "#555",
  },
});
