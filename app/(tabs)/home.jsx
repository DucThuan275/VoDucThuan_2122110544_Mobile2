import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import ListByCategories from "../../components/Home/ListByCategories";
import ListByProducts from "../../components/Home/ListByProducts";
import News from "../../components/Home/News";

export default function Home() {
  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* Header */}
      <Header />
      {/* Slider */}
      <Slider />
      {/* Categories */}

      <ListByCategories />
      {/* Products List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <ListByProducts />
        {/* News*/}
        <News />
      </ScrollView>
    </View>
  );
}
