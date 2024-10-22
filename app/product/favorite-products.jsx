import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { fetchFavoriteProducts } from "./../../api/favourite";
import { API_URL_IMAGE } from "./../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function FavoriteProducts() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserAndFavorites = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Failed to load user info:", error);
      }
    };

    loadUserAndFavorites();
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const data = await fetchFavoriteProducts(user.id);
          setFavorites(data); // Assuming the API returns an array of favorite products
        } catch (error) {
          console.error("Failed to load favorite products:", error);
          Alert.alert("Error", "Failed to load favorite products.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadFavorites();
  }, [user]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!favorites.length) {
    return <Text>No favorite products found.</Text>;
  }

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/product-details/[id]",
          params: { id: item.id },
        })
      }
      style={styles.favoriteItem}
    >
      <Image
        source={{ uri: `${API_URL_IMAGE}/products/${item.product.image}` }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productPrice}>$ {item.product.pricebuy}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()} // Use the appropriate key from your favorite item
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  favoriteItem: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
  },
});
