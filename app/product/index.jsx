import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";
import { fetchAllProducts } from "./../../api/products";
import { API_URL_IMAGE } from "./../../config";

export default function ListByProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchAllProducts();
      if (data) {
        setProducts(
          data.map((product) => ({
            id: product.id,
            name: product.name,
            price: `$${product.pricebuy}`,
            image: { uri: `${API_URL_IMAGE}/products/${product.image}` },
          }))
        );
      }
    };

    loadProducts();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {products.map((product) => (
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
            source={product.image}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{product.price}</Text>
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
    marginBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    width: "48%",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontFamily: "outfit-medium",
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  productPrice: {
    fontFamily: "outfit-regular",
    fontSize: 16,
    color: "#666",
  },
});
