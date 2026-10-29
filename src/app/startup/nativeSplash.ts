/** 네이티브 시작 화면을 실제 콘텐츠가 준비될 때까지 유지한다. */
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export function holdNativeSplash() {
  if (Platform.OS !== 'web') {
    void SplashScreen.preventAutoHideAsync().catch(() => {
      console.warn('네이티브 시작 화면을 유지하지 못했어요.');
    });
  }
}

export async function hideNativeSplash() {
  if (Platform.OS !== 'web') {
    try {
      await SplashScreen.hideAsync();
    } catch {
      console.warn('네이티브 시작 화면을 닫지 못했어요.');
    }
  }
}
