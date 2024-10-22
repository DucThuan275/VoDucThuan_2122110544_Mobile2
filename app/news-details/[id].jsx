import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { fetchNewsDetail } from "./../../api/news"; // Hàm gọi API để lấy chi tiết bài báo
import { API_URL_IMAGE } from "./../../config";
import { useRoute } from "@react-navigation/native";

export default function NewsDetails() {
  const route = useRoute();
  const { id } = route.params;
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNewsDetail = async () => {
      try {
        const data = await fetchNewsDetail(id);
        setNews(data);
      } catch (error) {
        setError("Bài báo không tìm thấy.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadNewsDetail();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.description}>{item}</Text>
    </View>
  );

  // Prepare data for FlatList
  const data = [news.description, news.detail];

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `${API_URL_IMAGE}/news/${news.image}` }}
        style={styles.mainImage}
        resizeMode="cover"
      />
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.date}>
        {new Date(news.created_at).toLocaleDateString()}
      </Text>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()} // Unique key for each item
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn
        contentContainerStyle={styles.scrollContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  scrollContainer: {
    paddingBottom: 80, // Dự phòng cho nút hoặc thông báo
  },
  itemContainer: {
    marginBottom: 20, // Khoảng cách giữa các mục
  },
  description: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
});
