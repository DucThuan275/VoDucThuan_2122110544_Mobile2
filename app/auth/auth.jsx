import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import { registerUser, loginUser } from "./../../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      if (data && data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        setMessage(data.message);
        setIsSuccess(true);

        setTimeout(() => {
          router.push("/home");
        }, 2000);
      } else {
        setMessage("Invalid email or password!");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage(error.message || "Login failed! Please try again.");
      setIsSuccess(false);
    }
  };

  const handleRegister = async () => {
    if (!name) {
      setMessage("Name is required!");
      setIsSuccess(false);
      return;
    }
    if (!email) {
      setMessage("Email is required!");
      setIsSuccess(false);
      return;
    }
    if (!password) {
      setMessage("Password is required!");
      setIsSuccess(false);
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setIsSuccess(false);
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long!");
      setIsSuccess(false);
      return;
    }

    try {
      const data = await registerUser(name, email, password, phone);
      if (data && data.message) {
        setMessage(data.message);
        setIsSuccess(true);
        setIsLogin(true);
      } else {
        setMessage("Registration failed! Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage(error.message || "Registration failed! Please try again.");
      setIsSuccess(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("./../../assets/images/login.png")}
        style={styles.image}
      />
      <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

      {!isLogin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#aaa"
            value={phone}
            onChangeText={setPhone}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      )}

      {message ? (
        <Text style={[styles.message, { color: isSuccess ? "green" : "red" }]}>
          {message}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={isLogin ? handleLogin : handleRegister}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{isLogin ? "Login" : "Register"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsLogin(!isLogin)}
        activeOpacity={0.7}
      >
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  switchText: {
    color: Colors.PRIMARY,
    fontSize: 16,
    textAlign: "center",
  },
  message: {
    marginVertical: 10,
    fontSize: 16,
    textAlign: "center",
  },
});
