import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { StartupGate } from './src/app/startup/StartupGate';
import { holdNativeSplash, hideNativeSplash } from './src/app/startup/nativeSplash';
import { FontProvider } from './src/app/providers/FontProvider';
import { DesignSystemScreen } from './src/screens/dev/DesignSystemScreen';

import { RootNavigator } from './src/app/navigation/RootNavigator';

holdNativeSplash();

export default function App() {
  return (
    <SafeAreaProvider>
      <FontProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          {__DEV__ && process.env.EXPO_PUBLIC_DESIGN_SYSTEM_PREVIEW === '1' ? (
            <View style={styles.fill} onLayout={() => void hideNativeSplash()}>
              <DesignSystemScreen />
            </View>
          ) : (
            <StartupGate>
              <RootNavigator />
            </StartupGate>
          )}
        </NavigationContainer>
      </FontProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
