import React from "react";
import { Tabs } from "expo-router";
import { View, Platform } from "react-native";
import {
  Compass,
  Map,
  Coins,
  BookOpen,
  Backpack,
} from "lucide-react-native";
import { colors } from "@/theme";

export default function TabLayout() {
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
          title: "Viagem",
          tabBarIcon: ({ color, focused }) => (
            <Compass size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="itinerary"
        options={{
          title: "Roteiro",
          tabBarIcon: ({ color, focused }) => (
            <Map size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Gastos",
          tabBarIcon: ({ color, focused }) => (
            <Coins size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Diário",
          tabBarIcon: ({ color, focused }) => (
            <BookOpen size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="packing"
        options={{
          title: "Mochila",
          tabBarIcon: ({ color, focused }) => (
            <Backpack size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}

