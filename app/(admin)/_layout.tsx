import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";

export default function AdminLayout() {
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/(admin)");
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}