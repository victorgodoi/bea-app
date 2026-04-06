import { Drawer } from '@ant-design/react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
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
      <View style={styles.drawerHeader}>
        <MaterialCommunityIcons name="account-circle" size={52} color="#fff" />
        <Text style={styles.drawerTitle}>Olá, {profile?.name}!</Text>
        <Text style={styles.drawerSubtitle}>{profile?.email || user?.email}</Text>
      </View>
      <View style={styles.drawerSpacer}>
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
          <MaterialCommunityIcons name="account-circle-outline" size={20} color="#c43edf" style={styles.drawerItemIcon} />
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
            <MaterialCommunityIcons name="account-group-outline" size={20} color="#c43edf" style={styles.drawerItemIcon} />
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
          <MaterialCommunityIcons name="credit-card-outline" size={20} color="#c43edf" style={styles.drawerItemIcon} />
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
          <MaterialCommunityIcons name="shape-outline" size={20} color="#c43edf" style={styles.drawerItemIcon} />
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
          <MaterialCommunityIcons name="tag-outline" size={20} color="#c43edf" style={styles.drawerItemIcon} />
          <Text style={styles.drawerItemText}>Tags</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => {
          closeDrawer();
          router.push('/settings' as any);
        }}>
          <MaterialCommunityIcons name="cog-outline" size={20} color="#c43edf" style={styles.drawerItemIcon} />
          <Text style={styles.drawerItemText}>Configurações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={closeDrawer}>
          <MaterialCommunityIcons name="information-outline" size={20} color="#c43edf" style={styles.drawerItemIcon} />
          <Text style={styles.drawerItemText}>Sobre</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#c43edf" style={styles.drawerItemIcon} />
          <Text style={styles.logoutText}>Sair</Text>
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
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
          tabBarStyle: {
            backgroundColor: '#c43edf',
            borderTopWidth: 1,
            borderTopColor: '#f0e0f8',
            elevation: 8,
            shadowColor: '#c43edf',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            height: 64,
            paddingBottom: 8,
            marginBottom: 48,
            paddingTop: 4,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Principal',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-outline" size={26} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explorar',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="compass-outline" size={26} color={color} />,
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
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  drawerHeader: {
    backgroundColor: '#c43edf',
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
    gap: 4,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  drawerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  drawerSpacer: {
    paddingHorizontal: 8,
    paddingTop: 8,
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 1,
  },
  drawerItemIcon: {
    marginRight: 14,
  },
  drawerItemText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0e0f8',
    marginHorizontal: 8,
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    color: '#c43edf',
    fontWeight: '600',
  },
});
