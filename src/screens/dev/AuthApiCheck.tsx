import React, { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '@/components/common/Button';
import { authenticatedRequest, refreshSession } from '@/services/api/apiClient';

export function AuthApiCheck() {
  const pending = useRef(false);
  const [loading, setLoading] = useState(false);

  if (!__DEV__ || process.env.EXPO_PUBLIC_AUTH_API_CHECK !== '1') return null;

  async function run() {
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    try {
      await refreshSession();
      await authenticatedRequest('/home/recent');
      Alert.alert('인증 확인 완료', '토큰 재발급과 인증 API 요청에 성공했어요.');
    } catch (error) {
      Alert.alert('인증 확인 실패', error instanceof Error ? error.message : '다시 시도해주세요.');
    } finally {
      pending.current = false;
      setLoading(false);
    }
  }

  return <Button label="토큰 재발급 확인 (개발용)" onPress={run} loading={loading} />;
}
