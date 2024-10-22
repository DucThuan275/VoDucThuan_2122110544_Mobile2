import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
} from "react-native";
import { fetchGetListNew } from "./../../api/news";
import Colors from "../../constants/Colors";
import { API_URL_IMAGE } from "./../../config";

export default function ListByNews() {
  const router = useRouter();
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchGetListNew();
      if (data) {
        setNewsList(data);
      }
    };

    loadNews();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.suggestionContainer}>
        <Text style={styles.suggestionText}>Latest News</Text>
      </View>
      {newsList.map((news) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/news-details/[id]",
              params: { id: news.id },
            })
          }
          key={news.id}
          style={styles.card}
        >
          <Image
            source={{ uri: `${API_URL_IMAGE}/news/${news.image}` }}
            style={styles.image}
          />
          <Text style={styles.newsTitle}>{news.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    marginTop: 10,
    marginBottom: 100,
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  newsTitle: {
    fontFamily: "outfit-medium",
    fontSize: 18,
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  newsDescription: {
    fontFamily: "outfit-regular",
    fontSize: 16,
    color: "#666",
  },
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  suggestionText: {
    paddingBottom: 10,
    fontSize: 24,
    color: Colors.WHITE,
    fontFamily: "outfit-medium",
    flex: 1,
  },
  suggestionViewAll: {
    paddingTop: 10,
    paddingRight: 5,
    fontSize: 18,
    color: Colors.PRIMARY,
    fontFamily: "outfit-medium",
    textDecorationLine: "underline",
  },
});
