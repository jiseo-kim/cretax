# CreTax App Architecture

## 프로젝트 개요
- **앱 이름**: CreTax
- **슬로건**: 크리에이터 세금, 혼자서도 쉽게
- **메인 컬러**: #7AF8BC
- **디자인 스타일**: Manus 미니멀리즘
- **플랫폼**: Web-based Mobile App

## 13개 플로우 구조

### Phase 1: 온보딩
1. **Splash** - 로고 + 슬로건
2. **Auth** - 카카오/네이버/구글/애플/이메일 로그인
3. **Onboarding** - 2개 화면 (문제 제시 + 앱 기능 소개)

### Phase 2: 진단 및 연결
4. **Diagnosis** - 크리에이터 유형 진단 (4개 질문)
5. **Income Connection** - 수익원 연결 (6가지 방식)
6. **Income Classification** - 수익 분류 확인
7. **Expense Connection** - 경비 자료 연결

### Phase 3: 분석 및 최적화
8. **Dashboard** - 세금 상태 대시보드 (메인 홈)
9. **Tax Check** - 절세 체크리스트
10. **Report Preparation** - 신고 준비 화면

### Phase 4: 신고
11. **Report Generation** - 신고서 생성
12. **HomeTax Guide** - 홈택스 제출 가이드
13. **Report Complete** - 신고 완료 리포트

## 상태 관리 (Context API)

### AppContext
- `currentUser`: 사용자 정보
- `currentFlow`: 현재 플로우 단계
- `userProfile`: 진단 결과
- `incomeData`: 수익 데이터
- `expenseData`: 경비 데이터
- `taxEstimate`: 세금 예측

### 라우팅 구조
```
/splash
/auth
  /login
  /signup
/onboarding
  /step1
  /step2
/diagnosis
/income
  /connection
  /classification
/expense
  /connection
  /review
/dashboard
/tax-check
/report
  /preparation
  /generation
  /homeTax-guide
  /complete
```

## 컴포넌트 구조

### Layouts
- `MobileLayout` - 모바일 앱 레이아웃
- `AuthLayout` - 인증 페이지 레이아웃
- `AppLayout` - 메인 앱 레이아웃

### Pages
- Splash, Auth, Onboarding, Diagnosis
- IncomeConnection, IncomeClassification
- ExpenseConnection, ExpenseReview
- Dashboard, TaxCheck, ReportPreparation
- ReportGeneration, HomeTaxGuide, ReportComplete

### Components
- `Card`, `Button`, `Input`, `Select`
- `ProgressBar`, `Tabs`, `Modal`
- `StatCard`, `ChartCard`, `ListItem`
- `Header`, `Footer`, `Navigation`

## 디자인 시스템

### 색상 팔레트
- **Primary**: #7AF8BC (Mint Green)
- **Background**: #FAFBFC
- **Text**: #2D3436
- **Border**: #E8EAED
- **Success**: #45CF88
- **Warning**: #FFB84D
- **Error**: #EF4444

### 타이포그래피
- **제목**: Pretendard Bold (32px)
- **부제목**: Pretendard SemiBold (20px)
- **본문**: Pretendard Regular (16px)
- **캡션**: Pretendard Regular (14px)

### 간격 시스템
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px

## 데이터 흐름

1. **사용자 인증** → 프로필 생성
2. **진단** → 사용자 유형 판단
3. **데이터 연결** → 수익/경비 수집
4. **분석** → 세금 예측 및 절세 제안
5. **신고 준비** → 필요 자료 확인
6. **신고** → 신고서 생성 및 제출 가이드

## 개발 우선순위

1. **Phase 1** (온보딩): Splash → Auth → Onboarding
2. **Phase 2** (진단): Diagnosis → Income/Expense Connection
3. **Phase 3** (분석): Dashboard → Tax Check
4. **Phase 4** (신고): Report Preparation → Complete
