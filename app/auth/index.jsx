import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import Colors from "../../constants/Colors";
import { Link, useRouter } from "expo-router";
export default function LoginScreen() {
  const router = useRouter();
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: Colors.WHITE,
      }}
    >
      <Image
        source={require("./../../assets/images/login.png")}
        style={{
          width: "100%",
          height: 500,
        }}
      />
      <View
        style={{
          padding: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 30,
            textAlign: "center",
          }}
        >
          Ready buy a new item for my pet?
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 18,
            textAlign: "center",
            color: Colors.GRAY,
          }}
        >
          Want to come up with your own unique phrase for your pet store?
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/auth/auth")}
          style={{
            padding: 14,
            marginTop: 50,
            backgroundColor: Colors.PRIMARY,
            width: "100%",
            borderRadius: 10,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 18,
              color: "#000",
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: 0.5,
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
