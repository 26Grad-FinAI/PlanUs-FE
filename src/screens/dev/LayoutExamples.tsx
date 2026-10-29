/** 안전 영역/키보드/하단 고정 CTA를 실제 화면 크기로 확인하는 예시. */
import React, { useState } from 'react';
import { ScreenLayout, BottomActionBar } from '@/components/common/Layout';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/common/Card';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ListRow } from '@/components/common/ListRow';
import { Divider } from '@/components/common/Divider';
import { MonthNavigator } from '@/components/common/MonthNavigator';
import { ExpandableSection } from '@/components/common/ExpandableSection';
import { TabBar } from '@/components/common/TabBar';
interface LayoutExamplesProps {
  onClose: () => void;
}
export function LayoutExamples({ onClose }: LayoutExamplesProps) {
  const [month, setMonth] = useState(new Date(2026, 7, 1));
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState('home');
  const [action, setAction] = useState('선택한 작업이 여기에 표시돼요.');
  return (
    <ScreenLayout
      header={<Header title="레이아웃 미리보기" onClose={onClose} />}
      footer={
        <BottomActionBar>
          <Button label="미리보기로 돌아가기" onPress={onClose} fullWidth />
        </BottomActionBar>
      }
    >
      <SectionHeader
        title="공통 레이아웃"
        description="스크롤과 하단 고정 액션을 확인해보세요."
        actionLabel="초기화"
        onAction={() => setMonth(new Date(2026, 7, 1))}
      />
      <Card tone="info">
        <Text>AI가 추천하는 예산을 확인해보세요.</Text>
      </Card>
      <Card>
        <MonthNavigator
          year={month.getFullYear()}
          month={month.getMonth() + 1}
          onPrevious={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          onNext={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
        />
        <ListRow label="닉네임" value="알뜰한다람쥐" />
        <Divider />
        <ListRow label="이메일" value="long-example-account@email.com" />
        <ListRow
          label="프로필 편집"
          icon="person-outline"
          onPress={() => setAction('프로필 편집 선택')}
        />
        <ExpandableSection
          label="전체 수입·지출 보기"
          expanded={expanded}
          onToggle={() => setExpanded(!expanded)}
        >
          <ListRow label="수입" value="2,600,000원" />
          <ListRow label="지출" value="713,500원" />
        </ExpandableSection>
      </Card>
      <Divider section />
      <Input label="키보드와 스크롤 확인" placeholder="내용을 입력하세요" />
      <Text accessibilityLiveRegion="polite">{action}</Text>
      <TabBar
        items={[
          { id: 'home', label: '홈', activeIcon: 'home', inactiveIcon: 'home-outline' },
          {
            id: 'report',
            label: '통계',
            activeIcon: 'bar-chart',
            inactiveIcon: 'bar-chart-outline',
          },
          { id: 'ai', label: 'AI분석', activeIcon: 'sparkles', inactiveIcon: 'sparkles-outline' },
          { id: 'my', label: '마이', activeIcon: 'person', inactiveIcon: 'person-outline' },
        ]}
        value={tab}
        onSelect={setTab}
        onAdd={() => setAction('소비 기록 추가 선택')}
      />
    </ScreenLayout>
  );
}
