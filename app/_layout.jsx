import { Stack } from "expo-router";
import { useFonts } from "expo-font";
export default function RootLayout() {
  useFonts({
    outfit: require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth/auth"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth/change-password"
        options={{
          title: "Change Password",
        }}
      />
      <Stack.Screen
        name="product/index"
        options={{
          title: "Product All",
        }}
      />
      <Stack.Screen
        name="product-details/[id]"
        options={{
          title: "Product detail",
        }}
      />
      <Stack.Screen
        name="product-categories/[id]"
        options={{
          title: "Product by categories",
        }}
      />
      <Stack.Screen
        name="cart/index"
        options={{
          title: "Cart",
        }}
      />
      <Stack.Screen
        name="checkout/index"
        options={{
          title: "Checkout",
        }}
      />
      <Stack.Screen
        name="checkout/checkout-success"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="news-details/[id]"
        options={{
          title: "News detail",
        }}
      />
      <Stack.Screen
        name="product/favorite-products"
        options={{
          title: "Favorite product",
        }}
      />
    </Stack>
  );
}
