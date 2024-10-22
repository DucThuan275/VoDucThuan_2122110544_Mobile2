import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { fetchSearchProducts } from "./../../api/products";
import Colors from "../../constants/Colors";
import { API_URL_IMAGE } from "./../../config";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

export default function Search() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term) {
      setIsLoading(true);
      const results = await fetchSearchProducts(term);
      setFilteredData(results);
      setIsLoading(false);
    } else {
      setFilteredData([]);
    }
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredData([]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/product-details/[id]",
          params: { id: item.id },
        })
      }
      key={item.id}
      style={styles.item}
    >
      <Image
        source={{ uri: `${API_URL_IMAGE}/products/${item.image}` }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemPrice}>$ {item.pricebuy}</Text>
      </View>
    </TouchableOpacity>
  );

  useFocusEffect(
    React.useCallback(() => {
      resetSearch();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 Search for Your Perfect Pet! 🐾</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter pet name..."
          placeholderTextColor="#aaa"
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    paddingBottom: 10,
    fontSize: 28,
    color: Colors.PRIMARY,
    fontFamily: "outfit-medium",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFEBEE", // Màu nền dễ thương cho từng mục
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    color: "#666",
  },
});
