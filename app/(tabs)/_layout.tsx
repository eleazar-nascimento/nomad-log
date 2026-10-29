import React from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import {
  Compass,
  Map,
  Coins,
  BookOpen,
  Backpack,
} from "lucide-react-native";
import { colors } from "@/theme";
import { useTranslation } from "@/i18n";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[100],
        tabBarInactiveTintColor: colors.grayscale[300],
        tabBarStyle: {
          backgroundColor: colors.grayscale[800],
          borderTopColor: colors.grayscale[500],
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 82 : 66,
          paddingBottom: Platform.OS === "ios" ? 22 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "SpaceGrotesk_600SemiBold",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.trip,
          tabBarIcon: ({ color, focused }) => (
            <Compass size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="itinerary"
        options={{
          title: t.tabs.itinerary,
          tabBarIcon: ({ color, focused }) => (
            <Map size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: t.tabs.expenses,
          tabBarIcon: ({ color, focused }) => (
            <Coins size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: t.tabs.journal,
          tabBarIcon: ({ color, focused }) => (
            <BookOpen size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="packing"
        options={{
          title: t.tabs.packing,
          tabBarIcon: ({ color, focused }) => (
            <Backpack size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}

