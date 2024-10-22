import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchBanners } from "../../api/banners";
import { API_URL_IMAGE } from "./../../config";

const screenWidth = Dimensions.get("screen").width * 0.45;

export default function AutoSlider() {
  const [sliderData, setSliderData] = useState([]);
  const translateX = useSharedValue(0);
  const currentIndex = useRef(0);

  const changeSlide = (index) => {
    currentIndex.current = index;
    translateX.value = withSpring(-currentIndex.current * screenWidth);
  };

  useEffect(() => {
    const fetchData = async () => {
      const banners = await fetchBanners();
      if (banners) {
        setSliderData(banners); // Cập nhật state với dữ liệu từ API
      }
    };

    fetchData(); // Gọi hàm fetchData để lấy dữ liệu
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex.current + 1) % sliderData.length;
      changeSlide(nextIndex);
    }, 3000); // Thay đổi mỗi 3 giây

    return () => clearInterval(interval); // Dọn dẹp khi component bị hủy
  }, [sliderData.length]); // Chỉ chạy lại khi length của sliderData thay đổi

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handlePress = (index) => {
    // Xử lý hành động khi nhấp vào banner
    console.log(`Clicked on banner ${index + 1}`);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.sliderContainer, animatedStyle]}>
        {sliderData.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemContainer}
            onPress={() => handlePress(index)} // Thêm sự kiện nhấp
          >
            <Image
              source={{ uri: `${API_URL_IMAGE}/banners/${item.image}` }} // Sử dụng API_URL_IMAGE để tạo URL cho hình ảnh
              style={styles.sliderImage}
              resizeMode="cover" // Hoặc "contain" tùy thuộc vào nhu cầu
            />
          </TouchableOpacity>
        ))}
      </Animated.View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            changeSlide(
              (currentIndex.current - 1 + sliderData.length) % sliderData.length
            )
          }
          style={styles.button}
        >
          <Icon name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            changeSlide((currentIndex.current + 1) % sliderData.length)
          }
          style={styles.button}
        >
          <Icon name="chevron-forward" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  sliderContainer: {
    flexDirection: "row",
  },
  sliderImage: {
    width: screenWidth,
    height: 200,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: "65%",
    width: "100%",
    transform: [{ translateY: -50 }],
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
});
