// Custom entry point to suppress "Unable to activate keep awake" errors.
// expo-router calls SplashScreen._internal_preventAutoHideAsync() without a
// .catch(), causing unhandled promise rejections when expo-keep-awake fails
// on Android (CurrentActivityNotFoundException during early initialization).

const SplashScreenUtils = require('expo-router/build/utils/splash');
const origInternal = SplashScreenUtils._internal_preventAutoHideAsync;

SplashScreenUtils._internal_preventAutoHideAsync = async function (...args) {
  try {
    return await origInternal?.(...args);
  } catch {
    // Suppress "Unable to activate keep awake" – non-fatal, keep-awake is
    // best-effort and the app functions correctly without it.
  }
};

require('expo-router/entry');
