/** 내역 상세의 수정/삭제 선택 메뉴. 선택 후 닫고 호출자에게 전달한다. */
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { ModalSurface } from '@/components/common/ModalSurface';
import { colors } from '@/constants/colors';
import { spacing, metrics } from '@/constants/layout';
interface ActionMenuItem {
  id: string;
  label: string;
  destructive?: boolean;
  disabled?: boolean;
  onPress: () => void;
}
interface ActionMenuProps {
  visible: boolean;
  onClose: () => void;
  items: readonly ActionMenuItem[];
}
export function ActionMenu({ visible, onClose, items }: ActionMenuProps) {
  return (
    <ModalSurface
      visible={visible}
      onClose={onClose}
      placement="topRight"
      dim={false}
      animationType="none"
      slideFromTop
    >
      <ActionMenuContent items={items} onClose={onClose} />
    </ModalSurface>
  );
}

/** 같은 Modal 안에서 삭제 확인으로 전환할 수 있도록 메뉴 본문을 분리한다. */
export function ActionMenuContent({ onClose, items }: Omit<ActionMenuProps, 'visible'>) {
  return (
    <>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          accessibilityRole="button"
          disabled={item.disabled}
          accessibilityState={{ disabled: !!item.disabled }}
          onPress={() => {
            onClose();
            item.onPress();
          }}
          style={styles.item}
        >
          <Text
            style={{
              color: item.disabled
                ? colors.textDisabled
                : item.destructive
                  ? colors.error
                  : colors.textPrimary,
            }}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </>
  );
}
const styles = StyleSheet.create({
  item: {
    minHeight: metrics.input,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    justifyContent: 'center',
  },
});
