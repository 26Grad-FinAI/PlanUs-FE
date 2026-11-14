import React, { useRef } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { MainTabParamList, RootStackParamList } from '@/app/navigation/types';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { metrics, radius, spacing } from '@/constants/layout';
import { useScrollToTopOnFocus } from '@/hooks/useScrollToTopOnFocus';
import { useSettingsQuery } from '@/hooks/useSettingsQuery';
import { AuthApiCheck } from '@/screens/dev/AuthApiCheck';
import { fetchAccountInfo } from '@/services/api/profileApi';
import appConfig from '../../../app.json';

const menuSections = [
  { title: '맞춤 예산', items: ['프로필 편집', '이번 달 예산'] },
  { title: '정보', items: ['데이터 출처 안내', '이용약관', '개인정보 처리방침'] },
];

export function SettingsScreen({ navigation }: BottomTabScreenProps<MainTabParamList, 'Settings'>) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  useScrollToTopOnFocus(scrollRef);
  const profile = useSettingsQuery(fetchAccountInfo);
  const email = profile.result.status === 'success' ? profile.result.data.email : undefined;

  function openDetail(screen: 'AccountInfo' | 'SavingsStatus') {
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate(screen);
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <Header title="마이페이지" divider={false} />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <View style={styles.overview}>
          <View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={email ? `내 계정 정보, ${email}` : '내 계정 정보'}
              onPress={() => openDetail('AccountInfo')}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <View style={styles.avatar} accessible={false}>
                {email ? (
                  <Text variant="section" style={styles.initial}>
                    {email.charAt(0).toUpperCase()}
                  </Text>
                ) : (
                  <Ionicons name="person-outline" size={metrics.icon} color={colors.primaryDark} />
                )}
              </View>
              <View style={styles.rowText}>
                {email && (
                  <Text variant="section" numberOfLines={1}>
                    {email}
                  </Text>
                )}
                <Text variant="label" style={styles.muted}>
                  내 계정 정보
                </Text>
                {profile.result.status === 'loading' && (
                  <ActivityIndicator
                    color={colors.primary}
                    accessibilityLabel="계정 정보 조회 중"
                    style={styles.loading}
                  />
                )}
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textDisabled}
                accessible={false}
              />
            </Pressable>
            {profile.result.status === 'error' && (
              <View style={styles.accountError}>
                <Text variant="caption" accessibilityRole="alert">
                  계정 정보를 불러오지 못했어요.
                </Text>
                <Button label="다시 시도" onPress={profile.retry} variant="ghost" size="sm" />
              </View>
            )}
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => openDetail('SavingsStatus')}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <Image
              source={require('../../../assets/images/illustrations/savings-piggy-bank-3d.png')}
              style={styles.illustration}
              resizeMode="contain"
              accessible={false}
            />
            <View style={styles.rowText}>
              <Text variant="section">저축 현황</Text>
              <Text variant="label" style={styles.description}>
                플래너스와 함께 저축한 금액을 확인해보세요
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.primaryDark}
              accessible={false}
            />
          </Pressable>
        </View>

        {menuSections.map(({ title, items }) => (
          <View key={title} style={[styles.sectionDivider, styles.menuSection]}>
            <Text variant="label" weight="bold" style={styles.muted} accessibilityRole="header">
              {title}
            </Text>
            {items.map((item) => (
              <View key={item} style={styles.menuRow}>
                <Text>{item}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.textDisabled}
                  accessible={false}
                />
              </View>
            ))}
            {title === '정보' && (
              <View style={styles.menuRow}>
                <Text>버전 정보</Text>
                <Text style={styles.description}>{appConfig.expo.version}</Text>
              </View>
            )}
          </View>
        ))}
        <View style={styles.devActions}>
          <AuthApiCheck />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: metrics.contentMax, alignSelf: 'center' },
  overview: { paddingHorizontal: spacing.xxl, paddingVertical: spacing.lg, gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 68 },
  rowText: { flex: 1, minWidth: 0 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  initial: { color: colors.primaryDark },
  illustration: { width: 52, height: 52 },
  muted: { color: colors.textDisabled },
  description: { color: colors.textTertiary },
  loading: { alignSelf: 'flex-start', marginTop: spacing.xs },
  accountError: { alignItems: 'flex-start', paddingLeft: 52 + spacing.md },
  pressed: { opacity: 0.65 },
  sectionDivider: { borderTopWidth: spacing.sm, borderTopColor: colors.surfaceMuted },
  menuSection: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xxl,
    gap: spacing.xs,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 52,
    gap: spacing.md,
  },
  devActions: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xl },
});
