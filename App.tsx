import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontProvider } from './src/app/providers/FontProvider';
import { DesignSystemScreen } from './src/screens/dev/DesignSystemScreen';

import { RootNavigator } from './src/app/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <FontProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          {__DEV__ && process.env.EXPO_PUBLIC_DESIGN_SYSTEM_PREVIEW === '1' ? (
            <DesignSystemScreen />
          ) : (
            <RootNavigator />
          )}
        </NavigationContainer>
      </FontProvider>
    </SafeAreaProvider>
  );
}
