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
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { HomeCalendarScreen } from '@/screens/home/HomeCalendarScreen';
import { MonthlyReportScreen } from '@/screens/report/MonthlyReportScreen';
import { AIAnalysisScreen } from '@/screens/ai/AIAnalysisScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { MainTabParamList } from './types';
import { colors } from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/typography';

/**
 * 소비 기록 추가 화면 (Placeholder)
 * 추후 모달 또는 전용 화면으로 교체 예정
 */
function RecordAddScreen() {
  return (
    <View style={placeholderStyles.container}>
      <Text style={placeholderStyles.emoji}>➕</Text>
      <Text style={placeholderStyles.title}>소비 기록 추가</Text>
      <Text style={placeholderStyles.subtitle}>소비 기록 추가 화면 (추후 구현 예정)</Text>
    </View>
  );
}

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 8,
  },
  emoji: { fontSize: 48, marginBottom: 8 },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: { fontSize: fontSize.sm, color: colors.textTertiary },
});

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
  // iOS 홈 인디케이터, Android 제스처 바 등 기기별 하단 안전 영역 높이
  const { bottom: bottomInset } = useSafeAreaInsets();

  // RecordAdd는 가운데 플로팅 + 버튼으로 별도 렌더링 → route를 직접 찾아 현재 활성 상태인지 확인
  const recordAddRoute = state.routes.find((r) => r.name === 'RecordAdd');

  // 현재 선택된 탭이 RecordAdd인지 확인
  const isRecordAddFocused = recordAddRoute
    ? state.index === state.routes.indexOf(recordAddRoute)
    : false;

  /**
   * 탭 클릭 시 실행되는 공통 이동 함수
   * React Navigation 이벤트 시스템을 통해 navigate 처리
   */
  function handleTabPress(routeName: string, routeKey: string) {
    const isFocused = state.routes[state.index].name === routeName;
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  }

  return (
    <View style={tabBarStyles.wrapper}>
      <View style={tabBarStyles.container}>
        {/* 왼쪽 탭 2개: 홈, 통계 */}
        {TAB_CONFIGS.slice(0, 2).map((tabConfig) => {
          const route = state.routes.find((r) => r.name === tabConfig.name);
          if (!route) return null;
          const isFocused = state.routes[state.index].name === tabConfig.name;

          return (
            <TouchableOpacity
              key={tabConfig.name}
              style={tabBarStyles.tabItem}
              onPress={() => handleTabPress(tabConfig.name, route.key)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={tabConfig.label}
              accessibilityState={{ selected: isFocused }}
            >
              <Ionicons
                name={isFocused ? tabConfig.activeIcon : tabConfig.inactiveIcon}
                size={24}
                color={isFocused ? colors.primary : colors.textDisabled}
              />
              <Text
                style={[
                  tabBarStyles.label,
                  { color: isFocused ? colors.primary : colors.textDisabled },
                ]}
              >
                {tabConfig.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* 가운데 플로팅 "+" 버튼 (RecordAdd 탭) */}
        <View style={tabBarStyles.centerTabArea}>
          <TouchableOpacity
            style={[
              tabBarStyles.centerButton,
              isRecordAddFocused && tabBarStyles.centerButtonActive,
            ]}
            onPress={() => {
              if (recordAddRoute) {
                handleTabPress('RecordAdd', recordAddRoute.key);
              }
            }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="소비 기록 추가"
          >
            <Ionicons name="add" size={30} color={colors.background} />
          </TouchableOpacity>
        </View>

        {/* 오른쪽 탭 2개: AI분석, 마이 */}
        {TAB_CONFIGS.slice(2).map((tabConfig) => {
          const route = state.routes.find((r) => r.name === tabConfig.name);
          if (!route) return null;
          const isFocused = state.routes[state.index].name === tabConfig.name;

          return (
            <TouchableOpacity
              key={tabConfig.name}
              style={tabBarStyles.tabItem}
              onPress={() => handleTabPress(tabConfig.name, route.key)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={tabConfig.label}
              accessibilityState={{ selected: isFocused }}
            >
              <Ionicons
                name={isFocused ? tabConfig.activeIcon : tabConfig.inactiveIcon}
                size={24}
                color={isFocused ? colors.primary : colors.textDisabled}
              />
              <Text
                style={[
                  tabBarStyles.label,
                  { color: isFocused ? colors.primary : colors.textDisabled },
                ]}
              >
                {tabConfig.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={[tabBarStyles.safeAreaFill, { height: bottomInset }]} />
    </View>
  );
}

const tabBarStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    // iOS 그림자
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    // Android 그림자
    elevation: 12,

    height: 70,
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 2,
  },
  label: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.medium,
    marginTop: 2,
  },
  centerTabArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -36,
    overflow: 'visible',
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',

    // iOS 그림자
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,

    // Android 그림자
    elevation: 10,
  },
  centerButtonActive: {
    borderWidth: 3,
    borderColor: colors.background,
  },
  safeAreaFill: {
    backgroundColor: colors.background,
  },
});

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
