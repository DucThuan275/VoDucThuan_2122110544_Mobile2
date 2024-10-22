import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchGetCart } from "./../../api/cart";
import { API_URL } from "./../../config";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // Trạng thái thông báo
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem("user");
      const user = JSON.parse(userData);
      if (user) {
        const items = await fetchGetCart(user.id);
        setCartItems(items);
      }
    } catch (error) {
      console.error("Error loading cart:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItemQuantity = (itemId, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + change }
          : item
      )
    );
  };

  const handleIncrease = async (itemId) => {
    try {
      await fetch(`${API_URL}/cart/increase/${itemId}`, { method: "POST" });
      updateCartItemQuantity(itemId, 1);
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const handleDecrease = async (itemId) => {
    try {
      await fetch(`${API_URL}/cart/decrease/${itemId}`, { method: "POST" });
      updateCartItemQuantity(itemId, -1);
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await fetch(`${API_URL}/cart/remove/${itemId}`, { method: "DELETE" });
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.quantity * item.pricebuy,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setMessage(
        "Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán."
      );
      return;
    }
    setMessage(""); // Xóa thông báo nếu giỏ hàng không trống
    router.push({ pathname: "/checkout" });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          ${item.pricebuy} x {item.quantity}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleDecrease(item.id)}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => handleIncrease(item.id)}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRemove(item.id)}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {message ? <Text style={styles.messageText}>{message}</Text> : null}
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Empty Cart</Text>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${totalAmount}</Text>
        <TouchableOpacity
          onPress={handleCheckout}
          style={styles.checkoutButton}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  messageText: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    color: "#fff",
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  totalContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
