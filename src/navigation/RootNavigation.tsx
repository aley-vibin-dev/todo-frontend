import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Global navigation helper
 * @param name
 * @param params
 */
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  } else {
    console.warn('Navigation attempted before NavigationContainer is ready:', name);
  }
}
