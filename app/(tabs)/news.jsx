import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
  Image,
} from "react-native";
import { fetchGetAllNews } from "./../../api/news"; // Ensure the path is correct
import Colors from "../../constants/Colors";
import { API_URL_IMAGE } from "./../../config";

export default function ListByNews() {
  const router = useRouter();
  const [newsList, setNewsList] = useState([]);
  const [expandedItems, setExpandedItems] = useState({}); // Quản lý trạng thái của các mục

  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchGetAllNews();
      if (data) {
        setNewsList(data);
      }
    };

    loadNews();
  }, []);

  // Hàm rút gọn mô tả
  const getShortDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
  };

  // Hàm để mở rộng hoặc thu gọn mô tả
  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle trạng thái của mục với id tương ứng
    }));
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedItems[item.id]; // Lấy trạng thái của mục này

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/news-details/[id]",
            params: { id: item.id },
          })
        }
        key={item.id}
        style={styles.card}
      >
        <Image
          source={{ uri: `${API_URL_IMAGE}/news/${item.image}` }}
          style={styles.image}
        />
        <Text style={styles.newsTitle}>{item.title}</Text>

        <Text style={styles.newsDescription}>
          {isExpanded
            ? item.description
            : getShortDescription(item.description, 20)}{" "}
          {/* Giới hạn 20 từ */}
        </Text>

        <TouchableOpacity
          onPress={() => toggleExpand(item.id)} // Toggle trạng thái khi nhấn
        >
          <Text style={styles.viewMoreText}>
            {isExpanded ? "View Less" : "View More"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.suggestionContainer}>
        <Text style={styles.suggestionText}>🐾 All Latest News 🐾</Text>
      </View>
      <FlatList
        data={newsList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} // Ensure the key is a string
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Add padding to the bottom
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes full height
    padding: 10,
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  newsTitle: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  newsDescription: {
    fontFamily: "outfit-regular",
    fontSize: 16,
    color: "#666",
  },
  viewMoreText: {
    color: Colors.PRIMARY,
    marginTop: 5,
    fontFamily: "outfit-medium",
    fontSize: 16,
  },
  suggestionContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  suggestionText: {
    paddingBottom: 10,
    fontSize: 24,
    color: Colors.PRIMARY,
    fontFamily: "outfit-medium",
    textAlign: "center",
  },
});
