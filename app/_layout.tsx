import "../global.css";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "@/theme";
import { AppStoreProvider } from "@/store";
import { DeviceFrame } from "@/components/ui";
import { SideControlPanel, ModalProvider, useModals } from "@/components/layout";
import { TripManagerModal } from "@/modules/pro/screens/TripManagerModal";
import { ProUpgradeModal } from "@/modules/pro/screens/ProUpgradeModal";

SplashScreen.preventAutoHideAsync().catch(() => {});

function InnerFrame() {
  const {
    tripModalOpen,
    proModalOpen,
    openTripModal,
    openProModal,
    closeTripModal,
    closeProModal,
  } = useModals();

  return (
    <DeviceFrame
      sidePanel={
        <SideControlPanel
          onOpenTripModal={openTripModal}
          onOpenProModal={openProModal}
        />
      }
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.grayscale[700] },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </Stack>

      <TripManagerModal
        visible={tripModalOpen}
        onClose={closeTripModal}
        onOpenProModal={openProModal}
      />

      <ProUpgradeModal
        visible={proModalOpen}
        onClose={closeProModal}
      />
    </DeviceFrame>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.grayscale[700],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[100]} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <ModalProvider>
          <StatusBar style="light" />
          <InnerFrame />
        </ModalProvider>
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
