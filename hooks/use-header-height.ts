import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Height of the visible content area inside the header (below the status bar
 * on Android, full visible height on iOS since the safe area is above the header).
 *
 * Derived from the Android design: 130px total − ~24px typical status bar = 106px.
*/

const HEADER_CONTENT_HEIGHT = 90;

/**
 * Returns the correct header height for the current platform:
 *
 * - Android (edgeToEdgeEnabled): HEADER_CONTENT_HEIGHT + insets.top
 *   → the header background extends behind the status bar, matching the design.
 *
 * - iOS: HEADER_CONTENT_HEIGHT
 *   → the safe area is reserved above the header by the system, so no extra
 *     space is needed. This makes both platforms appear visually balanced.
*/

export function useHeaderHeight(): number {
  const { top } = useSafeAreaInsets();
  return Platform.OS === 'android' ? HEADER_CONTENT_HEIGHT + top : HEADER_CONTENT_HEIGHT;
}
