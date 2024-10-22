import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchGetCart } from "./../../api/cart";
import { fetchCheckout } from "./../../api/checkout";
import { useRouter } from "expo-router";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Gọi useRouter bên trong component
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    id: "",
    address: "", // Thêm trường địa chỉ vào state
  });
  const [successMessage, setSuccessMessage] = useState(""); // Trạng thái để quản lý thông báo thành công

  useEffect(() => {
    loadCart();
    loadUserData();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const userStoredData = await AsyncStorage.getItem("user");
      const user = JSON.parse(userStoredData);
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

  const loadUserData = async () => {
    const userStoredData = await AsyncStorage.getItem("user");
    const user = JSON.parse(userStoredData);
    if (user) {
      setUserData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        id: user.id,
        address: "", // Địa chỉ có thể thêm sau
      });
    }
  };

  const handleCheckout = async () => {
    const orderData = {
      user_id: userData.id,
      name: userData.name,
      address: userData.address,
      phone: userData.phone,
      email: userData.email,
    };

    try {
      const response = await fetchCheckout(orderData);
      setSuccessMessage(`Thanh toán thành công! Mã đơn hàng: ${response.order_id}`);
      setCartItems([]);
      router.push("checkout/checkout-success")
    } catch (error) {
      console.error("Checkout error:", error);
      setSuccessMessage("Lỗi thanh toán: " + error.message);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.cartItemName}>{item.name}</Text>
      <Text style={styles.cartItemPrice}>${item.pricebuy} x {item.quantity}</Text>
    </View>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.quantity * item.pricebuy,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.cartList}
      />

      <Text style={styles.label}>Tổng tiền: ${totalAmount}</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={userData.name}
        onChangeText={(text) => setUserData({ ...userData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userData.email}
        onChangeText={(text) => setUserData({ ...userData, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={userData.phone}
        onChangeText={(text) => setUserData({ ...userData, phone: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={userData.address}
        onChangeText={(text) => setUserData({ ...userData, address: text })}
      />

      <TouchableOpacity onPress={handleCheckout} style={styles.button}>
        <Text style={styles.buttonText}>Hoàn tất mua hàng</Text>
      </TouchableOpacity>

      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text>
      ) : null}
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
  cartList: {
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cartItemName: {
    fontSize: 16,
    color: "#333",
  },
  cartItemPrice: {
    fontSize: 16,
    color: "#333",
  },
  label: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#28a745",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  successMessage: {
    marginTop: 20,
    fontSize: 16,
    color: "green",
    textAlign: "center",
  },
});
