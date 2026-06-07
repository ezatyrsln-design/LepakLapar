// app/(tabs)/_layout.tsx — Tab Navigation Layout
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

// Tab bar icon using emoji
const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <Text style={{ fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.6 }}>
    {emoji}
  </Text>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6161',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 80 : 60,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" focused={focused} />
          ),
        }}
      />

      {/* Search Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔍" focused={focused} />
          ),
        }}
      />

      {/* Favourites Tab */}
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="❤️" focused={focused} />
          ),
        }}
      />

      {/* Help Tab */}
      <Tabs.Screen
        name="help"
        options={{
          title: 'Help',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="❓" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}