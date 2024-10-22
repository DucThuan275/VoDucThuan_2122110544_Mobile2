import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Header() {
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || "User");
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <TouchableOpacity onPress={() => router.push("/cart")}>
        <Image
          source={require("@/assets/images/cart.png")}
          style={styles.cartIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  welcomeText: {
    fontFamily: "outfit",
    fontSize: 18,
  },
  userName: {
    fontFamily: "outfit-medium",
    fontSize: 25,
  },
  cartIcon: {
    height: 40,
    width: 40,
  },
});
