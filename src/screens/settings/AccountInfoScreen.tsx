import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/navigation/types';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Header } from '@/components/common/Header';
import { Text } from '@/components/common/Text';
import { colors } from '@/constants/colors';
import { metrics, spacing } from '@/constants/layout';
import { useSettingsQuery } from '@/hooks/useSettingsQuery';
import { logout } from '@/services/api/authApi';
import { fetchAccountInfo } from '@/services/api/profileApi';
import { useAuthStore } from '@/store/useAuthStore';

export function AccountInfoScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'AccountInfo'>) {
  const { result, retry } = useSettingsQuery(fetchAccountInfo);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [logoutError, setLogoutError] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const logoutPending = useRef(false);
  const account = result.status === 'success' ? result.data : undefined;
  const rows = account
    ? [
        { label: '닉네임', value: account.nickname },
        { label: '이메일', value: account.email },
        { label: '가입일', value: account.createdAt?.slice(0, 10).replaceAll('-', '.') },
      ]
    : [];

  function closeLogout() {
    if (logoutPending.current) return;
    setLogoutVisible(false);
    setLogoutError(false);
  }

  async function confirmLogout() {
    const sessionId = useAuthStore.getState().session?.id;
    if (!sessionId || logoutPending.current) return;

    logoutPending.current = true;
    setLogoutLoading(true);
    setLogoutError(false);
    try {
      await logout();
      const auth = useAuthStore.getState();
      if (auth.session?.id === sessionId) auth.signOut();
    } catch {
      if (useAuthStore.getState().session?.id === sessionId) setLogoutError(true);
    } finally {
      logoutPending.current = false;
      if (useAuthStore.getState().session?.id === sessionId) setLogoutLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="계정 정보" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {result.status === 'loading' && (
          <View style={styles.status}>
            <ActivityIndicator color={colors.primary} accessibilityLabel="계정 정보 조회 중" />
          </View>
        )}
        {result.status === 'error' && (
          <View style={styles.status}>
            <Text accessibilityRole="alert">계정 정보를 불러오지 못했어요.</Text>
            <Button label="다시 시도" onPress={retry} variant="ghost" size="sm" />
          </View>
        )}
        {rows.map(({ label, value }) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text weight="semibold" style={styles.value}>
              {value || '—'}
            </Text>
          </View>
        ))}
        <Pressable
          accessibilityRole="button"
          onPress={() => setLogoutVisible(true)}
          style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={colors.textSecondary}
            accessible={false}
          />
          <Text style={styles.logoutLabel}>로그아웃</Text>
        </Pressable>
      </ScrollView>
      <ConfirmModal
        visible={logoutVisible}
        title="로그아웃할까요?"
        description={logoutError ? '로그아웃하지 못했어요. 다시 시도해주세요.' : undefined}
        confirmLabel="로그아웃"
        loading={logoutLoading}
        onCancel={closeLogout}
        onConfirm={confirmLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  status: { alignItems: 'center', paddingVertical: spacing.section, gap: spacing.sm },
  content: {
    width: '100%',
    maxWidth: metrics.contentMax,
    alignSelf: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
    paddingVertical: spacing.sm,
  },
  label: { color: colors.textTertiary },
  value: { flexShrink: 1, textAlign: 'right' },
  logout: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: metrics.touch,
    marginTop: spacing.xl,
  },
  logoutLabel: { color: colors.textSecondary },
  pressed: { opacity: 0.65 },
});
