# PlanUs 디자인 시스템 · #19

## 범위와 실행

새 화면 이미지의 디자인을 공통 컴포넌트와 토큰으로 구성했다. 업무 화면의 전체 배치, 신규 화면, API, 카테고리 및 프로필/기록 데이터 구조는 이 작업의 범위가 아니다.

```sh
npm ci
npm run preview
```

미리보기는 `scripts/preview.cjs`가 `EXPO_PUBLIC_DESIGN_SYSTEM_PREVIEW=1`로 Expo Web을 실행한다. Windows에서도 별도의 환경 변수 문법이 필요 없다. 개발용 mock 예시에 API 환경 파일이 섞이지 않도록 `.env` 파일 로딩을 끈다. `__DEV__`와 플래그가 모두 참일 때만 갤러리가 표시된다. 일반 앱은 `npm start`/`npm run web`으로 실행하며, preview 서버를 종료한 뒤 새 서버로 실행한다. 배포 빌드에서는 플래그가 있어도 갤러리에 진입하지 않는다.

추가 인자는 예를 들어 `npm run preview -- --offline --port 8082 --max-workers 2`로 전달한다. PowerShell의 npm 래퍼가 인자를 누락하면 `npm.cmd`를 사용한다.

```sh
npm run typecheck
npm run lint
npx expo export --platform web --output-dir dist/design-system-web --max-workers 2
```

## 디자인 토큰과 폰트

- `src/constants/colors.ts`: 대표 파랑 `#1DA7E0`, 강조 글자 `#087FB5`, 선택 배경 `#E7F5FE`, 지출/삭제 `#F0445C`, 수입 `#0BAE84`, 표면/테두리/비활성 상태.
- `src/constants/typography.ts`: Pretendard Regular 400, Medium 500, SemiBold 600, Bold 700. `caption`, `label`, `body`, `button`, `section`, `title`, `amount` 역할 제공.
- `src/constants/layout.ts`: 간격, 모서리, 최소 터치 영역, 화면 최대 너비, 모달 너비와 그림자.

색상과 치수는 통이미지 기준의 추정값이다. 향후 정확한 Figma 변수나 수치를 받으면 이 토큰을 먼저 조정한다. 색상은 의미별 토큰을, 글자 크기는 타이포 역할과 크기 스케일을 사용한다.

Pretendard는 공식 저장소의 **v1.3.9** 정적 TTF 4종을 로컬 번들에 포함했다. 출처는 https://github.com/orioncactus/pretendard 이며 SIL Open Font License 전문은 `assets/fonts/LICENSE.txt`에 있다. CDN 접속 없이 동작한다. `FontProvider`는 로딩을 기다리고 실패 시 재시도 화면을 표시한다.

화면의 `Text`와 직접 사용하던 `TextInput`은 공통 primitive로 연결했다. 굵기는 `weight="regular|medium|semibold|bold"` 또는 `fontFamily` 토큰으로 지정한다. 숫자 굵기를 해석하는 호환 처리는 없다. 중첩 강조는 `variant="inherit"`로 부모 크기·색을 상속한다. 폰트 로딩 실패 안내만 시스템 폰트를 사용한다. 달력 내부 폰트도 Pretendard로 지정했다.

## 컴포넌트 사용 규칙

모든 공통 UI는 `src/components/common/<Name>`의 named export를 사용한다. 업무 목록·계산·조회는 호출자에게 둔다. 화면에는 필요한 부분만 연결하고, 전체 화면 개편은 후속 이슈에서 진행한다.

| 영역      | 컴포넌트와 인터페이스                                                                                                                                           |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 타이포    | `Text`: `variant`, `weight`, Native Text props. `TextInput`: `weight`, ref/이벤트/입력 props                                                                    |
| 액션      | `Button`: `label`, `variant`, `size`, `disabled`, `loading`, `fullWidth`. `IconButton`: `name`, `label` 필수                                                    |
| 폼        | `FormField`: `label`, `required`, `hint`, `error`. 오류는 도움말보다 우선                                                                                       |
| 입력      | `Input`: `variant="box"/"underline"`, `suffix`, `rightIcon`, `onRightPress`. `style`은 입력 글자, `containerStyle`은 테두리 영역                                |
| 금액      | `AmountInput`: `value`와 `onChangeText`는 콤마 없는 숫자 문자열. 화면에만 콤마 표시, 최대 15자리. 비어 있는 값과 0을 구분                                       |
| 긴 글     | `TextArea`: 폼 속성·기본 입력 이벤트·`minHeight` 지원                                                                                                           |
| 선택      | `ToggleGroup`: `options`, `selectedValue`, `onSelect`. `SegmentedControl`: `options`, `value`, `onChange`                                                       |
| 칩        | `Chip`, `ChipGroup`: 선택값·콜백·옵션별 아이콘·비활성 지원. 그룹은 단일 선택                                                                                    |
| 상태      | `Checkbox`: `checked`, `onChange`, 설명·비활성. `Badge`: primary/danger/neutral                                                                                 |
| 진행      | `ProgressBar`: 원래 단위의 `value`, `max`, 접근성 `label`. 표시만 0~100%로 제한. 0원 예산·NaN·Infinity 방어. `StepIndicator`: 1부터 시작하는 `current`, `total` |
| 레이아웃  | `ScreenLayout`: `header`, `footer`, `scroll`, `contentStyle`. `BottomActionBar`: 고정 CTA와 하단 안전 영역                                                      |
| 제목/표면 | `Header`: 제목·뒤로·닫기·우측 액션. `Card`: white/muted/info. `SectionHeader`: 제목·설명·우측 액션. `Divider`: 일반/구역 구분                                   |
| 목록      | `ListRow`: `label`, `value`, `icon`, `onPress`. `ExpandableSection`: `expanded`, `onToggle`로 호출자가 상태 소유                                                |
| 탐색      | `MonthNavigator`: 연도·월·이전/다음 콜백. `TabBar`: 표시용 items/선택값/콜백. 실제 React Navigation 이벤트는 기존 navigator가 담당                              |
| 모달      | `ConfirmModal`: 제목·강조문·설명·버튼 문구·콜백. `confirmVariant="destructive"`로 삭제 강조, `loading` 중 중복 확인 방지                                        |
| 팝업      | `ActionMenu`: 항목별 id/문구/삭제 강조/비활성/콜백. 어두운 배경 없이 우상단 표시, 선택 시 먼저 닫기                                                             |
| 날짜      | `DateField`: `Date` 값과 확정 콜백. 날짜만 임시 선택 후 확인해야 반영. 취소/배경/뒤로가기는 원래 값 유지                                                        |

```tsx
import { AmountInput } from '@/components/common/AmountInput';
import { Text } from '@/components/common/Text';

<Text variant="section">목표 저축액</Text>
<AmountInput
  label="매달 저축할 금액"
  required
  variant="underline"
  value={amount}
  onChangeText={setAmount}
/>
```

`ScreenLayout`의 footer에는 `BottomActionBar` 또는 `TabBar`를 전달한다. 두 컴포넌트 모두 하단 안전 영역을 처리하므로 같은 footer에 중첩하지 않는다. 미리보기의 TabBar 예시는 독립된 UI 확인용이며 업무 화면 이동을 수행하지 않는다.

### 기존 코드 전환

- `FloatingInput`은 삭제했다. 로그인 사용처를 `Input`으로 전환했다. `label`은 이제 입력창 위에 고정 표시한다.
- `Button`, `Input`, `TextArea`, `ToggleGroup`, `ConfirmModal`은 직접 개편했다. `ConfirmModal`의 기존 icon 관련 props는 제거했고 예산 화면 호출부도 수정했다.
- 소비 등록의 중복 탭·칩·날짜 모달을 공통 UI로 교체하고 금액을 `AmountInput`에 연결했다.
- 프로필 카테고리 선택은 `ChipGroup`을 직접 사용한다. 별도 `CategoryChipSelect` 어댑터는 제거했다.
- 화면별 헤더·월 선택과 하단 탭, 예산/통계/홈의 진행 바를 공통화했다. 사용하지 않는 기존 스타일을 함께 삭제했다.
- 기존 `BudgetComparison`의 퍼센트 너비 타입 오류는 공통 진행 바로 교체하면서 해소했다. 기존 배열 타입 lint 경고도 동일한 구조의 `T[]` 표기로 정리했다.
- Ionicons는 패키지 루트 대신 `@expo/vector-icons/Ionicons`에서 직접 import한다. 사용하지 않는 다른 아이콘 폰트의 Web 번들 포함을 방지한다.

## 이미지와 개발 환경 정리

첨부한 PNG는 **가공하지 않고 이름만 변경**했다. 원본과 복사본의 SHA-256이 네 파일 모두 일치한다.

| 내용      | 저장 파일                                               |
| --------- | ------------------------------------------------------- |
| 파란색 P  | `assets/images/brand/planus-logo-3d.png`                |
| 분석 문서 | `assets/images/illustrations/budget-analysis-3d.png`    |
| 저금통    | `assets/images/illustrations/savings-piggy-bank-3d.png` |
| 달력      | `assets/images/illustrations/budget-calendar-3d.png`    |

새 이미지는 아직 화면이나 app.json에 적용하지 않았다. 기존 app icon/adaptive icon/splash/favicon은 설정에서 사용 중이므로 유지한다.

처음 설치된 Expo 57/React Native 0.86/TypeScript 6 환경을 잠금 파일의 Expo 54/React Native 0.81/TypeScript 5.9로 복구했다. TypeScript 6용 `ignoreDeprecations` 옵션을 제거했다. 기존 직접 의존성은 소스·Babel·ESLint·Expo·Web 또는 peer 요구로 사용 중이어서 삭제하지 않았다. 새 직접 의존성은 `expo-font` 하나다.

재생성 가능한 `.expo/web`, `dist/export`, `dist/export-ios`를 정리했다. 작업 중 필요한 캐시와 새 검증 빌드는 다시 생성될 수 있다. 용도가 확실하지 않은 `dist/sdk54-backup`, 로컬 환경 파일과 Downloads 원본은 유지했다.

Windows에서 삭제가 잠긴 native resolver 파일 하나는 프로젝트 밖의 OS 임시 폴더로 이동했다. `node_modules.previous` 폴더와 관련 Git/TypeScript 제외 설정은 제거했다. 잠긴 파일은 편집기를 강제 종료하지 않고 OS 임시 폴더에 남겨 두었다. 이 파일은 코드나 구현 백업이 아니라 설치 도구의 native 바이너리다.

Expo 54의 로컬 의존성 검사에서 `eslint-config-expo@55.0.0`이 요구 버전과 다름을 확인해 `~10.0.0`으로 수정했다. 온라인 검사에서 권장한 Expo SDK 54 패치 `54.0.37`도 적용했다. SDK 메이저 버전은 바꾸지 않았고 최종 온라인 의존성 검사를 통과했다. Prettier의 폐기된 `jsxBracketSameLine` 옵션은 `bracketSameLine`으로 교체했다.

프로젝트는 `my-app`을 작업 폴더로 열어 사용한다. 상위 폴더에서 발생하는 별칭 해석을 우회하기 위한 ESLint resolver 설정은 추가하지 않았다.

## 검증 결과 · 2026-10-30

- TypeScript `--noEmit`: 통과.
- `my-app` 작업 폴더 기준 ESLint, Prettier 전체 검사와 Expo 온라인 의존성 검사: 통과.
- 타이포는 variant/weight 기반 API이며, 숫자 굵기 해석/Context 호환 계층과 카테고리 선택 어댑터는 제거했다.
- ESLint 전체 src: 오류 0, 경고 0. 최초 기준은 오류 0, 경고 3이었다.
- 미리보기 실행 스크립트: Windows에서 실제 시작 확인.
- 미리보기 비활성 Web 배포 빌드: 통과. JS 번들은 아이콘 import 변경 전 약 1.90 MB에서 최종 약 1.47 MB, 내보내는 에셋은 46개에서 28개로 감소했다. 압축 전 Expo 출력 기준이다.
- 브라우저에서 Pretendard Regular/Bold가 실제 입력에 적용되는 것과 나머지 굵기 전시를 확인했다.
- 금액 콤마 표시/15자리 제한, 오류 전환, 비활성/로딩 표시, 체크/라디오/탭 선택, 접근성 선택값과 진행률, 펼침 영역을 확인했다.
- 날짜 취소 시 원래 값 유지, 확인 시 반영, 삭제 확인 결과, 수정 메뉴 선택, 메뉴의 투명 배경을 확인했다.
- 390px 레이아웃과 320px 달력 모달을 시각 확인하고 DOM의 가로 화면 넘침이 없는 것을 확인했다.
- 실제 앱에서 홈 → 소비 등록 → 6,500원 외식 기록 저장 → 홈 합계/최근 내역 반영 → 통계 이동을 확인했다. 이 기록은 mock 메모리에만 저장된다.
- 기존 앱은 로그인/온보딩 완료 mock 상태로 시작한다. 이 기본값을 변경하지 않았으므로 로그인/회원가입/온보딩의 전체 사용자 흐름은 브라우저에서 별도로 수행하지 않았다. 관련 파일은 타입/빌드 검사에 포함됐다.
- iOS/Android 실기기, OS 글자 확대, 가상 키보드와 실제 안전 영역, 폰트 로딩 실패 재시도는 구현했으나 실기기/장애 상황 검증은 수행하지 않았다.
- react-native-web/달력에서 기존 shadow/pointerEvents/tintColor 관련 deprecation 경고가 발생할 수 있다. 플랫폼/라이브러리 전환은 이번 작업에서 진행하지 않았다.

후속 작업은 새 화면 전체 배치 적용, 프로필 2단계/월 저축 목표/자기소개 반영, 소비 성격/반복 기록, 카테고리 변경 및 신규 AI/마이페이지 구성이다. 데이터 구조와 API 합의 후 별도 이슈로 진행한다.
