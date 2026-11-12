/**
 * 메인 탭 네비게이터
 *
 * 기본 하단 탭바 대신 CustomTabBar를 사용
 * 가운데 플로팅 "+" 버튼은 루트 스택의 기록 폼을 연다.
 *
 * 하단 탭 바 구성:
 *   홈(HomeCalendar) · 통계(MonthlyReport) · [+ 소비 기록] · AI분석(AIAnalysis) · 마이(Settings)
 */

import React, { useEffect } from 'react';

import { TabBar } from '@/components/common/TabBar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import Ionicons from '@expo/vector-icons/Ionicons';

import { HomeCalendarScreen } from '@/screens/home/HomeCalendarScreen';
import { MonthlyReportScreen } from '@/screens/report/MonthlyReportScreen';
import { AIAnalysisScreen } from '@/screens/ai/AIAnalysisScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { currentBudgetMonth, fetchBudgetSummary } from '@/services/api/budgetApi';
import { fetchSavedProfile } from '@/services/api/profileApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { MainTabParamList, RootStackParamList } from './types';

/**
 * 각 탭의 아이콘 이름(Ionicons)과 라벨을 정의
 */
type TabConfig = {
  name: keyof MainTabParamList;
  label: string;
  // 활성/비활성 아이콘 이름 (Ionicons)
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
};

const TAB_CONFIGS: TabConfig[] = [
  {
    name: 'HomeCalendar',
    label: '홈',
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
  },
  {
    name: 'MonthlyReport',
    label: '통계',
    activeIcon: 'bar-chart',
    inactiveIcon: 'bar-chart-outline',
  },
  {
    name: 'AIAnalysis',
    label: 'AI분석',
    activeIcon: 'sparkles',
    inactiveIcon: 'sparkles-outline',
  },
  {
    name: 'Settings',
    label: '마이',
    activeIcon: 'person',
    inactiveIcon: 'person-outline',
  },
];

/**
 * 커스텀 탭 바 컴포넌트
 *
 * React Navigation의 기본 탭바 대신 렌더링되는 컴포넌트
 * state를 통해 현재 선택된 탭을 확인, navigation을 통해 탭 이동을 처리
 */
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  function selectRoute(name: string) {
    const route = state.routes.find((item) => item.name === name);
    if (!route) return;
    // React Navigation의 tabPress 방지/구독 동작을 UI 분리 후에도 유지한다.
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!event.defaultPrevented && state.routes[state.index].key !== route.key)
      navigation.navigate(route.name);
  }
  return (
    <TabBar
      items={TAB_CONFIGS.map((tab) => ({ ...tab, id: tab.name }))}
      value={state.routes[state.index].name}
      onSelect={selectRoute}
      onAdd={() =>
        navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate('RecordAdd')
      }
    />
  );
}

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * 메인 탭 네비게이터
 *
 * 앱의 메인 화면 하단 탭 구조를 정의
 * tabBar 옵션에 CustomTabBar를 전달해 기본 탭바를 커스텀 탭바로 교체
 */
export function MainTabNavigator() {
  const sessionId = useAuthStore((state) => state.session?.id);
  const { year, month } = currentBudgetMonth();

  useEffect(() => {
    if (!sessionId) return;
    const { confirmedBudget } = useBudgetStore.getState();
    if (confirmedBudget?.year === year && confirmedBudget.month === month) return;

    const controller = new AbortController();
    const { signal } = controller;
    const isActive = () => !signal.aborted && useAuthStore.getState().session?.id === sessionId;

    async function loadBudget() {
      const recommendation = await fetchBudgetSummary({ year, month }, signal);
      if (!recommendation || !isActive()) return;
      const profile = await fetchSavedProfile(signal);
      if (isActive()) {
        useBudgetStore.getState().confirmBudget({ year, month, profile, recommendation });
      }
    }

    void loadBudget().catch(() => {
      if (isActive() && __DEV__) console.warn('홈 화면의 예산 정보를 불러오지 못했어요.');
    });
    return () => controller.abort();
  }, [sessionId, year, month]);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      // 기본 진입 탭 : 홈
      initialRouteName="HomeCalendar"
    >
      <Tab.Screen name="HomeCalendar" component={HomeCalendarScreen} />
      <Tab.Screen name="MonthlyReport" component={MonthlyReportScreen} />
      <Tab.Screen name="AIAnalysis" component={AIAnalysisScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
