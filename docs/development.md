# 개발 환경 및 실행

## 실행 환경

- Expo SDK 58 / React Native 0.88 / React 19.3
- TypeScript 6, strict 모드
- Node.js 22.13 이상(22.x) 또는 24.3 이상(24.x), 또는 26 이상. 홀수 메이저 버전은 지원하지 않는다.
- 패키지 관리자는 npm이며, `package-lock.json`을 함께 관리한다.

## 설치와 실행

프로젝트 루트에서 실행한다.

```sh
npm ci
npm start
```

Web은 `npm run web`, 디자인 시스템 미리보기는 `npm run preview`로 실행한다. PowerShell에서 인자 전달 문제가 있으면 `npm.cmd`를 사용한다.

## 휴대폰에서 디자인 시스템 확인

PC와 휴대폰을 같은 Wi-Fi에 연결하고 SDK 58을 지원하는 Expo Go를 준비한다.

```sh
npm run preview -- --go --lan --port 8083
```

터미널의 QR 코드를 Expo Go로 연다. iPhone에서는 기본 카메라로 스캔할 수 있다. 계정 인증을 요구하면 PC의 `npx expo login`과 휴대폰 Expo Go에서 같은 Expo 계정을 사용한다. 확인하는 동안 개발 서버를 실행 상태로 유지한다.

미리보기는 mock UI이며, 실제 백엔드를 호출하지 않는다. 폰트는 앱에 포함된 Pretendard 파일을 사용한다.

## Expo Go에서 개발 서버 인증 확인

PC와 휴대폰을 같은 Wi-Fi에 연결하고 프론트 폴더에서 실행한다.

```powershell
$env:EXPO_PUBLIC_AUTH_API_CHECK = '1'
npm.cmd start -- --go --lan
```

QR 코드를 Expo Go로 열고 개발용 이메일로 회원가입한다. 가입 후 프로필 화면의 **토큰 재발급 확인 (개발용)** 버튼을 누르면 토큰 재발급과 인증 요청을 바로 확인할 수 있다. 프로필을 완료한 계정에서는 마이페이지에 같은 버튼이 표시된다. 프로필 입력 첫 화면에서 뒤로 가거나 앱을 다시 열어 같은 계정으로 로그인해 본다. 토큰은 앱을 실행하는 동안 메모리에 보관한다.

프론트 루트의 `.env.local`에 `EXPO_PUBLIC_API_BASE_URL=https://planus-dev.p-e.kr/api`를 추가한다. `.env.local`은 Git에서 제외된다. 현재 개발 서버 회원가입 요청에는 별도 체크박스 없이 `agreeToTerms: true`를 전달한다. 확인 버튼이 필요 없으면 `EXPO_PUBLIC_AUTH_API_CHECK` 설정 없이 실행한다.

## 검사

```sh
npm run typecheck
npm run lint
npx expo install --check
npx expo-doctor
npx expo export --platform all --output-dir dist/build
```

`expo export`는 JavaScript 번들 및 Hermes 바이트코드를 검증한다. 서명된 iOS·Android 앱 빌드나 실기기 실행 검증을 대체하지 않는다.

## 앱 설정

폰트·상태 표시줄·스플래시는 `app.json`의 Expo config plugin으로 설정한다. 스플래시 이미지는 `expo-splash-screen` 플러그인에 지정한다. SDK 58은 New Architecture와 Android edge-to-edge를 기본 사용하므로 이전 활성화 옵션을 별도로 지정하지 않는다.

SDK를 변경할 때는 [Expo 공식 업그레이드 안내](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)에 따라 호환 의존성을 정렬하고 검사를 다시 수행한다.
