# Dondothat

> Vue.js와 Pinia를 기반

## 시작하기

### 1. 프로젝트 클론

```bash
git clone [저장소_URL]
cd [프로젝트_폴더]
```

### 2. 의존성 설치

Node.js (v18.x 이상) 환경에서 아래 명령어를 실행하여 필요한 라이브러리를 설치.

```bash
npm install
```

### 3. 개발 서버 실행

아래 명령어를 실행하면 `http://localhost:5173` 주소에서 개발 서버가 실행

```bash
npm run dev
```

## 주요 기술 스택

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS
- **API Client**: Axios

## 폴더 구조

```
src/
├── assets/         # CSS, 이미지 등 정적 에셋
├── components/     # 공용 UI 컴포넌트
│   ├── analytics/  # 분석 페이지 관련 컴포넌트
│   └── modals/     # 모달 관련 컴포넌트
├── pages/          # 라우팅되는 페이지 컴포넌트
│   ├── auth/       # 인증 관련 페이지 (로그인, 회원가입)
│   ├── main/       # 핵심 기능 페이지 (대시보드, 거래내역)
│   └── profile/    # 프로필 관련 페이지
├── router/         # Vue Router 설정
├── services/       # API 서비스 로직
├── stores/         # Pinia 상태 관리 스토어
├── utils/          # 유틸리티 함수 (Axios 인스턴스 등)
├── App.vue         # 최상위 App 컴포넌트
└── main.js         # 애플리케이션 진입점
```

## 코드 품질 및 컨벤션

프로젝트의 일관성과 코드 품질을 유지하기 위해 아래 도구들을 사용

### 주요 도구

- **ESLint**: JavaScript 및 Vue 코드의 문법 오류와 스타일을 검사
- **Prettier**: 코드 포맷팅을 자동화하여 일관된 코드 스타일을 유지
- **Husky**: Git hook을 관리하며, `pre-commit` 시점에 자동으로 린트와 포맷팅을 검사

### 사용 가능한 스크립트

```bash
# 코드 린트 검사 및 자동 수정
npm run lint

# 코드 포맷팅 적용
npm run format
```

### 개발 워크플로우

1.  코드를 작성
2.  파일 저장 시 VS Code 확장 프로그램에 의해 코드가 자동으로 포맷팅
3.  `git commit` 시점에 Husky가 자동으로 코드 품질을 검사

> VS Code 사용자는 `Vue.volar` (Volar)와 `ESLint`, `Prettier` 확장 프로그램을 설치해주세요. `.vscode/extensions.json` 파일에 추천 확장 프로그램이 정의되어 있습니다.

## 📡 API 연동 가이드 (Axios)

API 통신을 위해 Axios를 사용하며, 관련 설정은 `src/utils/api.js` 파일에 정의되어 있음

### 기본 설정

- **기본 URL**: `.env` 파일의 `VITE_API_URL`을 사용
- **타임아웃**: 10초.
- **인증 헤더 자동 추가**: 로그인 시 발급된 토큰이 `localStorage`에 저장되며, 모든 API 요청에 `Authorization` 헤더가 자동으로 포함
- **에러 처리**: 401 Unauthorized 에러 발생 시 자동으로 로그아웃 처리 후 로그인 페이지로 이동

### 사용 방법

API 호출은 `stores` 또는 컴포넌트 내에서 `services` 레이어를 통해 이루어짐

**1. 서비스 레이어 사용 (`/services`)**

API 명세에 따라 `services` 디렉터리에 파일을 생성하고, `src/utils/api.js`에서 정의된 API 메서드를 호출하는 함수를 작성.

```javascript
// 예시: src/services/transactionService.js
import { transactionsAPI } from '@/utils/api'

export const transactionService = {
  async fetchTransactions(filters = {}) {
    try {
      return await transactionsAPI.getAll(filters)
    } catch (error) {
      throw new Error(`거래 내역 조회 실패: ${error.message}`)
    }
  }
}
```

**2. 스토어에서 서비스 사용 (`/stores`)**

Pinia 스토어의 `actions`에서 서비스 함수를 호출하여 상태를 업데이트

```javascript
// 예시: src/stores/transactions.js
import { defineStore } from 'pinia'
import transactionService from '@/services/transactionService'

export const useTransactionsStore = defineStore('transactions', {
  actions: {
    async fetchTransactions() {
      this.loading = true
      try {
        this.transactions = await transactionService.fetchTransactions()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})
```
