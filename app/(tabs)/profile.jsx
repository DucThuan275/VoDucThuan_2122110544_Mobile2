import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../../constants/Colors";

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  // Fetch user data on screen focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      router.push("/auth");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleChangePassword = () => {
    router.push("/auth/change-password");
  };

  const handleFavorites = () => {
    router.push("/product/favorite-products");
  };

  const handleChangeProfile = () => {
    router.push("/auth/change-profile");
  };

  const menuItems = [
    {
      title: "Favorite Products",
      icon: "heart-outline",
      onPress: handleFavorites,
    },
    {
      title: "Change Profile",
      icon: "person-outline",
      onPress: handleChangeProfile,
    },
    {
      title: "Change Password",
      icon: "lock-closed-outline",
      onPress: handleChangePassword,
    },
    {
      title: "Logout",
      icon: "log-out-outline",
      onPress: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 My Profile 🐾</Text>
      <Image source={require("./../../assets/images/logo.jpg")} style={styles.image} />

      {user ? (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Name: <Text style={styles.boldText}>{user.name}</Text>
          </Text>
          <Text style={styles.infoText}>
            Email: <Text style={styles.boldText}>{user.email}</Text>
          </Text>
          <Text style={styles.infoText}>
            Phone: <Text style={styles.boldText}>{user.phone || "N/A"}</Text>
          </Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading user information...</Text>
      )}

      <FlatList
        data={menuItems}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={item.onPress} style={styles.menuItem}>
            <Ionicons name={item.icon} size={24} color="#333" style={styles.icon} />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.menuContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: Colors.PRIMARY,
    alignSelf: "center",
  },
  title: {
    paddingBottom: 20,
    fontSize: 24,
    color: Colors.PRIMARY,
    fontFamily: "outfit-medium",
    textAlign: "center",
  },
  infoContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#FFF8E1",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  boldText: {
    fontFamily: "outfit-medium",
    color: Colors.GRAY,
  },
  loadingText: {
    fontSize: 18,
    color: "#696969",
    textAlign: "center",
    marginVertical: 10,
  },
  menuContainer: {
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 18,
    color: "#333",
  },
});
