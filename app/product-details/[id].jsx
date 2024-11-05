import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { fetchProductById } from "./../../api/products";
import { fetchAddToCart } from "./../../api/cart";
import { addProductToFavorites } from "../../api/favourite";
import { API_URL_IMAGE } from "./../../config";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function ProductDetails() {
  const route = useRoute();
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // State for related products
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data.product); // Set main product data
        setRelatedProducts(data.related_products); // Set related products data
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Failed to load user info:", error);
      }
    };

    loadProductDetails();
    loadUser();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert(
        "Thông báo",
        "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng."
      );
      return;
    }

    const result = await fetchAddToCart(
      user.id,
      product.id,
      1,
      product.pricebuy
    );

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      Alert.alert("Lỗi", result.message);
    }
  };
  const handleBuyNow = async () => {
    if (!user) {
      Alert.alert(
        "Thông báo",
        "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng."
      );
      return;
    }

    const result = await fetchAddToCart(
      user.id,
      product.id,
      1,
      product.pricebuy
    );

    if (result.success) {
      router.push("cart");
    } else {
      Alert.alert("Lỗi", result.message);
    }
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      Alert.alert(
        "Thông báo",
        "Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích."
      );
      return;
    }

    const result = await addProductToFavorites(user.id, product.id);

    if (result && result.message) {
      setSuccessMessage(result.message);
      setIsFavorite(true);
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      Alert.alert("Lỗi", "Không thể thêm sản phẩm vào danh sách yêu thích.");
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!product) {
    return <Text>Product not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `${API_URL_IMAGE}/products/${product.image}` }}
        style={styles.mainImage}
        resizeMode="cover"
      />
      <View style={styles.header}>
        <Text style={styles.productName}>{product.name}</Text>
        <TouchableOpacity onPress={handleAddToFavorites}>
          <Icon
            name="heart"
            size={24}
            color={isFavorite ? "#ff4d4d" : "#ccc"}
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.productPrice}>$ {product.pricebuy}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.productDescription}>{product.description}</Text>
        <View style={styles.gridContainer}>{/* Product feature cards */}</View>
        <View style={styles.gridContainer}>
          <View style={styles.featureCard}>
            <Image
              source={require("@/assets/images/sex.png")}
              style={styles.featureImage}
              resizeMode="contain"
            />
            <View style={styles.featureInfo}>
              <Text style={styles.featureName}>Sex</Text>
              <Text style={styles.featureDetails}>{product.sex}</Text>
            </View>
          </View>
          <View style={styles.featureCard}>
            <Image
              source={require("@/assets/images/weight.png")}
              style={styles.featureImage}
              resizeMode="contain"
            />
            <View style={styles.featureInfo}>
              <Text style={styles.featureName}>Weight</Text>
              <Text style={styles.featureDetails}>{product.weight} kg</Text>
            </View>
          </View>
          <View style={styles.featureCard}>
            <Image
              source={require("@/assets/images/bone.png")}
              style={styles.featureImage}
              resizeMode="contain"
            />
            <View style={styles.featureInfo}>
              <Text style={styles.featureName}>Breed</Text>
              <Text style={styles.featureDetails}>{product.breed}</Text>
            </View>
          </View>
          <View style={styles.featureCard}>
            <Image
              source={require("@/assets/images/calendar.png")}
              style={styles.featureImage}
              resizeMode="contain"
            />
            <View style={styles.featureInfo}>
              <Text style={styles.featureName}>Age</Text>
              <Text style={styles.featureDetails}>{product.age} months</Text>
            </View>
          </View>
        </View>
        <View style={styles.additionalDetails}>
          <Text style={styles.detailsHeader}>Additional Product Details:</Text>
          <Text style={styles.detailsText}>{product.detail}</Text>
        </View>

        {/* Related Products Section */}
        <View style={styles.relatedProductsContainer}>
          <Text style={styles.relatedHeader}>Related Products</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedProducts.map((relatedProduct) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/product-details/[id]",
                    params: { id: relatedProduct.id }, // Use relatedProduct.id for navigation
                  })
                }
                key={relatedProduct.id} // Use relatedProduct.id as the unique key here
                style={styles.card}
              >
                <View style={styles.relatedProductCard}>
                  <Image
                    source={{
                      uri: `${API_URL_IMAGE}/products/${relatedProduct.image}`,
                    }}
                    style={styles.relatedProductImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.relatedProductName}>
                    {relatedProduct.name}
                  </Text>
                  <Text style={styles.relatedProductPrice}>
                    $ {relatedProduct.pricebuy}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleAddToCart} style={styles.adoptButton}>
          <Text style={styles.adoptButtonText}>Add To Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBuyNow} style={styles.adoptNowButton}>
          <Text style={styles.adoptButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {successMessage ? (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessage}>{successMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  mainImage: {
    width: "100%",
    height: 250,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 260,
  },
  productName: { fontSize: 24, fontWeight: "bold", color: "#333" },
  productPrice: { fontSize: 18, color: "#333", marginBottom: 10 },
  productDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    marginTop: 10,
  },
  scrollContainer: { paddingTop: 10, paddingBottom: 80 },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%", // Adjust width to fit two items per row
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
  },

  adoptNowButton: {
    width: "40%", // Adjust width to fit next to the other button
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 10,
    left: 220,
    alignItems: "center",
    justifyContent: "center",
  },

  featureImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  featureDetails: {
    fontSize: 14,
    color: "#666",
  },
  additionalDetails: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  detailsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  detailsText: { fontSize: 14, color: "#666" },
  adoptButton: {
    width: "50%",
    position: "absolute",
    justifyContent: "center",
    left: 10,
    right: 10,
    backgroundColor: "#ff4d4d",
    padding: 15,
    backgroundColor: "#28a745",
    borderRadius: 10,
    alignItems: "center",
  },
  adoptButtonText: { color: "#fff", fontSize: 20, fontFamily: "outfit-bold" },
  successMessageContainer: {
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    backgroundColor: "#d4edda",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  successMessage: { color: "#155724", fontSize: 16, fontWeight: "bold" },
  relatedProductsContainer: { marginTop: 20 },
  relatedHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  relatedProductCard: {
    width: 120,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  relatedProductImage: { width: 100, height: 100, borderRadius: 10 },
  relatedProductName: { fontSize: 14, color: "#333", marginTop: 5 },
  relatedProductPrice: { fontSize: 14, color: "#666", marginTop: 3 },
});
