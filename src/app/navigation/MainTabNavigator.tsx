/**
 * 메인 탭 네비게이터
 *
 * 기본 하단 탭바 대신 CustomTabBar를 사용
 * 가운데 RecordAdd 탭은 일반 탭 아이템이 아니라 플로팅 "+" 버튼으로 렌더링
 *
 * 하단 탭 바 구성:
 *   홈(HomeCalendar) · 통계(MonthlyReport) · [+ 소비 기록] · AI분석(AIAnalysis) · 마이(Settings)
 */

import React from 'react';

import { TabBar } from '@/components/common/TabBar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import Ionicons from '@expo/vector-icons/Ionicons';

import { HomeCalendarScreen } from '@/screens/home/HomeCalendarScreen';
import { MonthlyReportScreen } from '@/screens/report/MonthlyReportScreen';
import { AIAnalysisScreen } from '@/screens/ai/AIAnalysisScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { RecordAddScreen } from '@/screens/record/RecordAddScreen';
import { MainTabParamList } from './types';

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
  if (state.routes[state.index].name === 'RecordAdd') return null;
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
      onAdd={() => selectRoute('RecordAdd')}
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
      <Tab.Screen name="RecordAdd" component={RecordAddScreen} />
      <Tab.Screen name="AIAnalysis" component={AIAnalysisScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
