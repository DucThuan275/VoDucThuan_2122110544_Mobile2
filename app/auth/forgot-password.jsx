import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { requestOtp, resetPassword } from "../../api/auth";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const router = useRouter();

  useEffect(() => {
    let timer;
    if (isCountdownActive && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
      setCountdown(60);
    }
    return () => clearInterval(timer);
  }, [isCountdownActive, countdown]);

  const handleRequestOtp = async () => {
    if (isCountdownActive) return;

    try {
      await requestOtp(email);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "OTP has been sent to your email.",
        visibilityTime: 1000,
      });
      setIsCountdownActive(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        visibilityTime: 1000,
      });
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match.",
        visibilityTime: 1000,
      });
      return;
    }

    try {
      await resetPassword(email, otp, newPassword);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password has been reset successfully.",
        visibilityTime: 1000,
      });
      setTimeout(() => router.push("/auth/auth"), 1000);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        visibilityTime: 1000,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🐾 Forgot Password 🐾</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={[styles.button, isCountdownActive && styles.disabledButton]}
        onPress={handleRequestOtp}
        disabled={isCountdownActive}
      >
        <Text style={styles.buttonText}>
          {isCountdownActive ? `Wait ${countdown}s` : "Request OTP"}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter your OTP"
        placeholderTextColor="#aaa"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <Toast />
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
  disabledButton: {
    backgroundColor: Colors.GRAY,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
