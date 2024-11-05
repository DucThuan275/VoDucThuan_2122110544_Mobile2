import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeProfile } from '../../api/auth';
import Colors from '../../constants/Colors'; // Ensure this file contains your color definitions
import { router } from 'expo-router';

export default function ChangeProfileScreen() {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
          setName(user.name);
          setEmail(user.email);
          setPhone(user.phone || '');
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    try {
      // Gọi API để cập nhật thông tin người dùng
      const response = await changeProfile(userId, name, email, phone);

      // Cập nhật thông tin người dùng trong AsyncStorage
      const updatedUserData = { id: userId, name, email, phone };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));

      setMessage(response.message);
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (error) {
      setMessage(error.message || 'Failed to update profile');
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.LIGHT, // Light background color
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.PRIMARY, // Primary color for title
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff', // White background for input fields
  },
  button: {
    backgroundColor: Colors.PRIMARY, // Primary color for button
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text for button
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    color: 'green',
  },
});
