/** 업무 데이터에 의존하지 않는 선택 UI의 공용 타입. */
import { Ionicons } from '@expo/vector-icons';
export type IconName = keyof typeof Ionicons.glyphMap;
export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  icon?: IconName;
  disabled?: boolean;
}
