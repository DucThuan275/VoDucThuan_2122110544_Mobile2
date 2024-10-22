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
import { fetchProducts } from "./../../api/products";
import { API_URL_IMAGE } from "./../../config";
import Colors from "../../constants/Colors";

export default function ListByProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
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
      <View style={styles.suggestionContainer}>
        <Text style={styles.suggestionText}>You might also like!</Text>
      </View>
      <TouchableOpacity
        style={styles.suggestionIcon}
        onPress={() => router.push("/product")}
      >
        <Text style={styles.suggestionViewAll}> View all pets</Text>
      </TouchableOpacity>
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
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  suggestionText: {
    paddingBottom: 10,
    fontSize: 18,
    color: "#333",
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
