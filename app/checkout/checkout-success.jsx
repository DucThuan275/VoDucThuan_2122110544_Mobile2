import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";

export default function CheckoutSuccess() {
  const router = useRouter(); // Gọi useRouter bên trong component
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 2,
      tension: 160,
      useNativeDriver: true,
    }).start();
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.emoji}>🎉</Text>
      </Animated.View>
      <Text style={styles.title}>Thank You for Your Purchase!</Text>
      <Text style={styles.message}>
        Your order has been placed successfully.
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/home")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  emoji: {
    fontSize: 100,
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#E8B20E",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
