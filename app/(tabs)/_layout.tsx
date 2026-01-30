import { Drawer } from '@ant-design/react-native';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DrawerProvider, useDrawer } from '@/src/contexts/DrawerContext';

function TabLayoutContent() {
  const colorScheme = useColorScheme();
  const { isDrawerOpen, closeDrawer } = useDrawer();

  const sidebar = (
    <View style={styles.drawerContent}>
      <Text style={styles.drawerTitle}>Olá, UserName!</Text>
      <TouchableOpacity style={styles.drawerItem} onPress={closeDrawer}>
        <Text style={styles.drawerItemText}>Dependentes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={closeDrawer}>
        <Text style={styles.drawerItemText}>Configurações</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={closeDrawer}>
        <Text style={styles.drawerItemText}>Sobre</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Drawer
      sidebar={sidebar}
      open={isDrawerOpen}
      onOpenChange={(open) => !open && closeDrawer()}
      position="left"
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
      </Tabs>
    </Drawer>
  );
}

export default function TabLayout() {
  return (
    <DrawerProvider>
      <TabLayoutContent />
    </DrawerProvider>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 28,
    color: "#c43edf",
  },
  drawerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  drawerItemText: {
    fontSize: 16,
    color: "#333",
  },
});
