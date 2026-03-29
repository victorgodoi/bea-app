import { Provider } from '@ant-design/react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { NotificationProvider } from '@/src/contexts/NotificationContext';

const { width } = Dimensions.get('window');

function AuthGuard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      router.replace('/auth');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, isLoading, segments]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);
  const translateX = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      translateX.value = withTiming(-width, { duration: 500 }, () => {
        runOnJS(setShowSplash)(false);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NotificationProvider>
          <Provider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <AuthGuard />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="auth" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </Provider>
        </NotificationProvider>
      </AuthProvider>
      
      {showSplash && (
        <Animated.View style={[styles.splashContainer, animatedStyle]}>
          <Image
            source={require('@/assets/images/BEA_Launch.png')}
            style={styles.splashImage}
            contentFit="cover"
          />
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: '#000',
    zIndex: 1000,
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
});
