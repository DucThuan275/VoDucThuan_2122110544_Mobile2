import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constants/Colors";
import { View, StyleSheet, Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: Colors.GRAY,
        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          position: "absolute",
          bottom: 0,
          borderTopWidth: 0,
          backgroundColor: "#fff",
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 5,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="newspaper-outline" size={24} color={color} />
          ),
          tabBarLabel: "News",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.searchIconContainer,
                focused
                  ? { backgroundColor: Colors.PRIMARY }
                  : { backgroundColor: "#3399FF" },
              ]}
            >
              <Ionicons name="search" size={32} color="#fff" />
            </View>
          ),
          tabBarLabel: "Search",
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="reorder-four" size={24} color={color} />
          ),
          tabBarLabel: "Order",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  searchIconContainer: {
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 5,
  },
});
