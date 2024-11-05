import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchGetCart } from "./../../api/cart";
import { fetchCheckout, fetchCheckoutVNPAY } from "./../../api/checkout";
import { useRouter } from "expo-router";
import { API_URL_IMAGE } from "./../../config";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    id: "",
    address: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

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
        address: "",
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
      let response;
      if (paymentMethod === "online") {
        response = await fetchCheckoutVNPAY(orderData);
      } else {
        response = await fetchCheckout(orderData);
      }

      const data = await response.json();

      console.log("API response:", data);

      if (response.ok) {
        setSuccessMessage(
          `Thanh toán thành công! Mã đơn hàng: ${data.order_id}`
        );
        setCartItems([]);

        if (paymentMethod === "online") {
          Linking.openURL(data.url); // Open the VNPAY URL
          setTimeout(() => {
            router.push("checkout/checkout-success");
          }, 3000); // Delay before navigating (3 seconds)
        } else {
          router.push("checkout/checkout-success");
        }
      } else {
        setSuccessMessage(
          "Lỗi thanh toán: " + (data.message || "Không rõ lỗi.")
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setSuccessMessage("Lỗi thanh toán: " + error.message);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: `${API_URL_IMAGE}/products/${item.image}` }}
        style={styles.cartItemImage}
      />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>
          ${item.pricebuy} x {item.quantity}
        </Text>
      </View>
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.cartList}
      />

      <Text style={styles.label}>Total: ${totalAmount}</Text>

      <Text style={styles.label}>Payment Method:</Text>
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => setPaymentMethod("cash")}
      >
        <Text
          style={paymentMethod === "cash" ? styles.selected : styles.unselected}
        >
          Cash on Delivery
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => setPaymentMethod("online")}
      >
        <Text
          style={
            paymentMethod === "online" ? styles.selected : styles.unselected
          }
        >
          Online Payment
        </Text>
      </TouchableOpacity>

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
        placeholder="Phone Number"
        value={userData.phone}
        onChangeText={(text) => setUserData({ ...userData, phone: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={userData.address}
        onChangeText={(text) => setUserData({ ...userData, address: text })}
      />

      <TouchableOpacity onPress={handleCheckout} style={styles.button}>
        <Text style={styles.buttonText}>Hoàn tất mua hàng</Text>
      </TouchableOpacity>

      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  cartItemImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 15,
  },
  cartItemDetails: {
    flex: 1,
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
  paymentButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  selected: {
    color: "#28a745",
    fontWeight: "bold",
  },
  unselected: {
    color: "#333",
  },
  successMessage: {
    marginTop: 20,
    fontSize: 16,
    color: "green",
    textAlign: "center",
  },
});
