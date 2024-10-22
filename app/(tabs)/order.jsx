import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { fetchGetUserOrders } from "../../api/order-details";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constants/Colors";

const UserOrdersComponent = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const getOrders = async () => {
      if (userId) {
        try {
          const ordersData = await fetchGetUserOrders(userId);
          setOrders(ordersData);
        } catch (error) {
          setError(error.message);
        }
      }
    };

    getOrders();
  }, [userId]);

  if (error) {
    Alert.alert("Error", error);
    return null;
  }

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderId}>Order ID: {item.order_id}</Text>
      <Text style={styles.totalAmount}>Total: ${item.total_amount}</Text>
      <FlatList
        data={item.items}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              Price: ${item.pricebuy} x {item.quantity}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 My Orders 🐾</Text>
      {orders.length === 0 ? (
        <Text style={styles.noOrders}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.order_id.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 70,
  },
  title: {
    paddingBottom: 20,
    fontSize: 24,
    color: Colors.PRIMARY,
    fontFamily: "outfit-medium",
    textAlign: "center",
  },
  orderItem: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
  },
  orderId: {
    fontWeight: "bold",
    color: "#ff6347",
    fontSize: 20,
  },
  totalAmount: {
    color: "#696969",
    fontSize: 18,
  },
  item: {
    backgroundColor: "#FFF8E1", // Light background for items
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  itemName: {
    fontWeight: "bold",
    color: Colors.GRAY,
    fontSize: 18,
  },
  itemDetails: {
    color: "#555",
    fontSize: 16,
  },
  noOrders: {
    textAlign: "center",
    color: "#696969",
    marginTop: 20,
    fontSize: 20,
  },
});

export default UserOrdersComponent;
