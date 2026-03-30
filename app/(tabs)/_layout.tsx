import { Drawer } from '@ant-design/react-native';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProfile } from '@/hooks/use-profile';
import { useAuth } from '@/src/contexts/AuthContext';
import { DrawerProvider, useDrawer } from '@/src/contexts/DrawerContext';

function TabLayoutContent() {
  const colorScheme = useColorScheme();
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { profile } = useProfile();

  const handleLogout = async () => {
    await setUser(null);
    closeDrawer();
    router.replace('/auth');
  };

  const sidebar = (
    <View style={styles.drawerContent}>
      <View style={styles.drawerSpacer}>
        <Text style={styles.drawerTitle}>Olá, {profile?.name}!</Text>
        <TouchableOpacity style={styles.drawerItem} onPress={() => {
          closeDrawer();
          router.push({
            pathname: '/profile/edit',
            params: { 
              name: profile?.name || '',
              email: profile?.email || user?.email || '',
              id: profile?.id || '',
            }
          });
        }}>
          <Text style={styles.drawerItemText}>Meus Dados</Text>
        </TouchableOpacity>
        {profile?.role === "owner" && (
          <TouchableOpacity style={styles.drawerItem} onPress={() => {
            closeDrawer();
            router.push({
              pathname: '/dependents',
              params: { 
                companyId: profile?.company_id || ''
              }
            });
          }}>
            <Text style={styles.drawerItemText}>Dependentes</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.drawerItem} onPress={() => {
          closeDrawer();
          router.push({
            pathname: '/payment-methods',
            params: { 
              companyId: profile?.company_id || '',
            }
          });
        }}>
          <Text style={styles.drawerItemText}>Métodos de Pagamento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => {
          closeDrawer();
          router.push({
            pathname: '/categories',
            params: { 
              companyId: profile?.company_id || '',
            }
          });
        }}>
          <Text style={styles.drawerItemText}>Categorias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => {
          closeDrawer();
          router.push({
            pathname: '/purposes',
            params: { 
              companyId: profile?.company_id || '',
            }
          });
        }}>
          <Text style={styles.drawerItemText}>Tags</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={closeDrawer}>
          <Text style={styles.drawerItemText}>Configurações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={closeDrawer}>
          <Text style={styles.drawerItemText}>Sobre</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          style={{ marginBottom: 65, paddingVertical: 15, paddingHorizontal: 20, backgroundColor: '#ffe6e6'}}
          onPress={handleLogout}
        >
          <Text style={{ fontSize: 16, color: "red", fontWeight: "bold" }}>Deslogar</Text>
        </TouchableOpacity>
      </View>
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
            title: 'Principal',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        {/* <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transações',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        /> */}
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
    paddingTop: 60,
    justifyContent: "space-between",
  },
  drawerSpacer: {
    paddingHorizontal: 20,
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
