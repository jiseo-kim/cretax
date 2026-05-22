import { useState, useEffect } from "react";
import {
  ChevronRight,
  LogOut,
  Home as HomeIcon,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  FileText,
  Smartphone,
  ArrowLeft,
  Settings,
  Bell,
  FileCheck,
  PieChart,
  Briefcase,
} from "lucide-react";

/**
 * CreTax App - 크리에이터 세금, 혼자서도 쉽게
 * 
 * Design Philosophy: Notion-Inspired Minimalism
 * - Primary Color: #FC6226 (Warm Orange)
 * - Clean, professional, accessible interface
 * - Mobile-first responsive design
 * - Smooth transitions and micro-interactions
 * - LocalStorage-based persistence for user progress
 * 
 * User Flow (After Login):
 * 1. Onboarding → Diagnosis → Initial Setup (First time only)
 * 2. Main Dashboard (Daily/Regular use)
 * 3. Income/Expense Management (Ongoing)
 * 4. Tax Optimization (Continuous)
 * 5. Tax Filing (Seasonal - when needed)
 * 6. Supporting Features (Anytime access)
 */

type AppFlow = 
  | "splash"
  | "auth"
  | "onboarding"
  | "diagnosis"
  | "income-connection"
  | "expense-connection"
  | "dashboard"
  | "income-expense-management"
  | "tax-optimization"
  | "tax-filing-preparation"
  | "tax-filing-comparison"
  | "tax-filing-risk-analysis"
  | "tax-filing-generation"
  | "tax-filing-guide"
  | "tax-filing-rehearsal"
  | "tax-filing-complete"
  | "reports"
  | "document-storage"
  | "notifications"
  | "settings";

interface UserProfile {
  name: string;
  activities: string[];
  incomeLevel: string;
  businessRegistered: boolean;
}

interface IncomeItem {
  id: string;
  source: string;
  amount: number;
  category: string;
  date: string;
}

interface AppState {
  currentFlow: AppFlow;
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
  selectedDiagnosis: {
    activities: string[];
    incomeLevel: string;
    incomeTypes: string[];
    businessRegistered: string;
  };
  onboardingStep: number;
  diagnosisStep: number;
  timestamp: number;
}

// 로컬스토리지 유틸리티
const STORAGE_KEY = "cretax_app_state";

const loadAppState = (): Partial<AppState> | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      // 1시간 이상 지난 데이터는 초기화
      const now = Date.now();
      if (now - state.timestamp > 3600000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return state;
    }
  } catch (error) {
    console.error("Failed to load app state:", error);
  }
  return null;
};

const saveAppState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save app state:", error);
  }
};

const clearAppState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear app state:", error);
  }
};

export default function Home() {
  // 저장된 상태 로드
  const savedState = loadAppState();

  const [currentFlow, setCurrentFlow] = useState<AppFlow>(savedState?.currentFlow || "splash");
  const [isLoggedIn, setIsLoggedIn] = useState(savedState?.isLoggedIn || false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(savedState?.userProfile || null);
  const [incomeData, setIncomeData] = useState<IncomeItem[]>([
    { id: "1", source: "Google AdSense", amount: 1240000, category: "애드센스", date: "2025-01-15" },
    { id: "2", source: "Brand A", amount: 2000000, category: "광고/협찬", date: "2025-01-10" },
    { id: "3", source: "Sponsorship", amount: 1500000, category: "협찬", date: "2025-01-05" },
  ]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(
    savedState?.selectedDiagnosis || {
      activities: [] as string[],
      incomeLevel: "",
      incomeTypes: [] as string[],
      businessRegistered: "",
    }
  );
  const [onboardingStep, setOnboardingStep] = useState(savedState?.onboardingStep || 1);
  const [diagnosisStep, setDiagnosisStep] = useState(savedState?.diagnosisStep || 1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingIncome, setIsLoadingIncome] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 상태 변경 시 자동 저장
  useEffect(() => {
    const state: AppState = {
      currentFlow,
      isLoggedIn,
      userProfile,
      selectedDiagnosis,
      onboardingStep,
      diagnosisStep,
      timestamp: Date.now(),
    };
    saveAppState(state);
  }, [currentFlow, isLoggedIn, userProfile, selectedDiagnosis, onboardingStep, diagnosisStep]);

  // 로딩 시뮬레이션
  useEffect(() => {
    if (isLoadingIncome) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsLoadingIncome(false);
              setLoadingProgress(0);
            }, 500);
            return 100;
          }
          const increment = prev < 30 ? Math.random() * 15 : prev < 70 ? Math.random() * 8 : Math.random() * 3;
          return Math.min(prev + increment, 99);
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isLoadingIncome]);

  // 단계별 프로그레스바 계산
  const getProgressPercentage = (): number => {
    const stages: AppFlow[] = [
      "splash",
      "auth",
      "onboarding",
      "diagnosis",
      "income-connection",
      "expense-connection",
      "dashboard",
      "income-expense-management",
      "tax-optimization",
      "tax-filing-preparation",
      "tax-filing-comparison",
      "tax-filing-risk-analysis",
      "tax-filing-generation",
      "tax-filing-guide",
      "tax-filing-rehearsal",
      "tax-filing-complete",
    ];
    const currentIndex = stages.indexOf(currentFlow);
    return currentIndex >= 0 ? ((currentIndex + 1) / stages.length) * 100 : 0;
  };

  // 헤더 컴포넌트
  const Header = () => {
    const shouldShowHeader = ![
      "splash",
      "auth",
      "onboarding",
    ].includes(currentFlow);

    if (!shouldShowHeader) return null;

    const getStageTitle = (): string => {
      const titles: Record<AppFlow, string> = {
        diagnosis: "크리에이터 유형 진단",
        "income-connection": "수익원 연결",
        "expense-connection": "경비 자료 연결",
        dashboard: "세금 상태 대시보드",
        "income-expense-management": "수익/경비 정리",
        "tax-optimization": "절세 최적화",
        "tax-filing-preparation": "신고 준비",
        "tax-filing-comparison": "신고 방식 비교",
        "tax-filing-risk-analysis": "세무 리스크 분석",
        "tax-filing-generation": "신고서 생성",
        "tax-filing-guide": "홈택스 제출 가이드",
        "tax-filing-rehearsal": "신고 리허설",
        "tax-filing-complete": "신고 완료",
        reports: "리포트",
        "document-storage": "자료 보관함",
        notifications: "알림",
        settings: "설정",
        splash: "",
        auth: "",
        onboarding: "",
      };
      return titles[currentFlow] || "CreTax";
    };

    return (
      <div className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {currentFlow !== "dashboard" && (
                <button
                  onClick={() => {
                    const stages: AppFlow[] = [
                      "splash",
                      "auth",
                      "onboarding",
                      "diagnosis",
                      "income-connection",
                      "expense-connection",
                      "dashboard",
                      "income-expense-management",
                      "tax-optimization",
                      "tax-filing-preparation",
                      "tax-filing-comparison",
                      "tax-filing-risk-analysis",
                      "tax-filing-generation",
                      "tax-filing-guide",
                      "tax-filing-rehearsal",
                      "tax-filing-complete",
                    ];
                    const currentIndex = stages.indexOf(currentFlow);
                    if (currentIndex > 0) {
                      setCurrentFlow(stages[currentIndex - 1]);
                    }
                  }}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
              )}
              <div>
                <p className="text-xs text-muted-foreground font-medium">CreTax</p>
                <p className="font-semibold text-foreground text-sm">{getStageTitle()}</p>
              </div>
            </div>
            {isLoggedIn && (
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setUserProfile(null);
                  clearAppState();
                  setCurrentFlow("splash");
                }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-foreground" />
              </button>
            )}
          </div>

          {/* 프로그레스바 */}
          <div className="space-y-2">
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-[#FC6226] h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {Math.round(getProgressPercentage())}% 완료
            </p>
          </div>
        </div>
      </div>
    );
  };

  // 스켈레톤 로더
  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border border-border rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-secondary rounded-lg animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-secondary rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-secondary rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // 스플래시 화면
  const SplashScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FC6226]/5 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-[#FC6226] rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">C</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-3">CreTax</h1>
        <p className="text-lg text-muted-foreground mb-12">크리에이터 세금, 혼자서도 쉽게</p>
        <button
          onClick={() => setCurrentFlow("auth")}
          className="w-full py-4 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
        >
          시작하기
        </button>
      </div>
    </div>
  );

  // 로그인/회원가입 화면
  const AuthScreen = () => (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-foreground mb-2">로그인</h1>
        <p className="text-muted-foreground mb-8">계정으로 로그인하세요</p>

        <div className="space-y-3 mb-8">
          {[
            { name: "카카오", bg: "bg-[#FFE812]", text: "text-black" },
            { name: "네이버", bg: "bg-[#00C73C]", text: "text-white" },
            { name: "구글", bg: "bg-white", text: "text-foreground border border-border" },
          ].map((provider) => (
            <button
              key={provider.name}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${provider.bg} ${provider.text}`}
            >
              {provider.name}로 로그인
            </button>
          ))}
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">또는</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="email"
            placeholder="이메일"
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC6226]"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC6226]"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setIsLoggedIn(true);
            setUserProfile({ name: "지현", activities: ["유튜브", "인스타그램"], incomeLevel: "매월 있음", businessRegistered: false });
            setCurrentFlow("onboarding");
          }}
          className="w-full py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors mb-4"
        >
          로그인
        </button>

        <p className="text-center text-muted-foreground text-sm">
          계정이 없으신가요? <span className="text-[#FC6226] font-semibold cursor-pointer">회원가입</span>
        </p>

        <p className="text-center text-xs text-muted-foreground mt-8">
          세금 신고 자료는 암호화되어 안전하게 보관됩니다.
        </p>
      </div>
    </div>
  );

  // 온보딩 화면
  const OnboardingScreen = () => {
    const slides = [
      {
        title: "인스타, 유튜브, 협찬 수익…",
        subtitle: "어디까지 신고해야 할지 헷갈리셨죠?",
        cta: "내 세금 상태 확인하기",
      },
      {
        title: "CreTax가 해주는 일",
        items: ["수익 자동 정리", "경비 추천", "예상 세금 계산", "신고 준비 체크리스트"],
        cta: "시작하기",
      },
    ];

    const slide = slides[onboardingStep - 1];

    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">{slide.title}</h1>
            {slide.subtitle && <p className="text-lg text-muted-foreground">{slide.subtitle}</p>}
            {slide.items && (
              <div className="mt-8 space-y-3">
                {slide.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#FC6226]/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[#FC6226]" />
                    </div>
                    <p className="font-medium text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (onboardingStep < 2) {
                setOnboardingStep(onboardingStep + 1);
              } else {
                setCurrentFlow("diagnosis");
              }
            }}
            className="w-full py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
          >
            {slide.cta}
          </button>
        </div>
      </div>
    );
  };

  // 진단 화면
  const DiagnosisScreen = () => {
    const questions = [
      {
        title: "어떤 활동을 하나요?",
        options: ["유튜브", "인스타그램", "틱톡", "블로그", "스트리밍", "강의/전자책", "기타"],
        key: "activities",
      },
      {
        title: "수익이 있나요?",
        options: ["아직 없음", "가끔 있음", "매월 있음", "전업 수준"],
        key: "incomeLevel",
      },
      {
        title: "어떤 수익이 있나요?",
        options: ["애드센스", "브랜드 광고", "협찬", "제휴", "구독/멤버십", "강의/상품판매"],
        key: "incomeTypes",
      },
      {
        title: "사업자등록이 있나요?",
        options: ["있음", "없음", "검토 중"],
        key: "businessRegistered",
      },
    ];

    const question = questions[diagnosisStep - 1];

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-8">크리에이터 유형 진단</h1>

          <div className="mb-8">
            <p className="text-lg font-semibold text-foreground mb-6">{question.title}</p>
            <div className="space-y-3">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  className="w-full p-4 border-2 border-border rounded-xl hover:border-[#FC6226] hover:bg-[#FC6226]/5 transition-colors text-left font-medium text-foreground"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            {diagnosisStep > 1 && (
              <button
                onClick={() => setDiagnosisStep(diagnosisStep - 1)}
                className="flex-1 py-3 border-2 border-border rounded-xl font-semibold hover:bg-secondary transition-colors"
              >
                이전
              </button>
            )}
            <button
              onClick={() => {
                if (diagnosisStep < questions.length) {
                  setDiagnosisStep(diagnosisStep + 1);
                } else {
                  setCurrentFlow("income-connection");
                }
              }}
              className="flex-1 py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
            >
              {diagnosisStep === questions.length ? "다음" : "다음"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 수익원 연결
  const IncomeConnectionScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">수익원 연결</h1>

        {isLoadingIncome ? (
          <>
            <div className="mb-8">
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-[#FC6226] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{Math.round(loadingProgress)}% 로드 중...</p>
            </div>
            <SkeletonLoader />
          </>
        ) : (
          <div className="space-y-3 mb-8">
            {[
              { name: "Google AdSense", icon: "G", connected: true },
              { name: "은행 계좌", icon: "B", connected: false },
              { name: "신용카드", icon: "C", connected: false },
              { name: "Stripe", icon: "S", connected: false },
              { name: "Toss", icon: "T", connected: false },
              { name: "수동 입력", icon: "M", connected: false },
            ].map((source, i) => (
              <div key={i} className="p-4 border border-border rounded-xl flex items-center justify-between hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FC6226]/10 rounded-lg flex items-center justify-center font-bold text-[#FC6226]">
                    {source.icon}
                  </div>
                  <p className="font-medium text-foreground">{source.name}</p>
                </div>
                {source.connected ? (
                  <CheckCircle2 className="w-5 h-5 text-[#FC6226]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            setIsLoadingIncome(true);
            setTimeout(() => setIsLoadingIncome(false), 3000);
          }}
          disabled={isLoadingIncome}
          className="w-full py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors disabled:opacity-50"
        >
          {isLoadingIncome ? "로드 중..." : "다음"}
        </button>
      </div>
    </div>
  );

  // 경비 자료 연결
  const ExpenseConnectionScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">경비 자료 연결</h1>

        <div className="space-y-3 mb-8">
          {[
            { name: "신용카드", desc: "신용카드 거래 내역 자동 분류" },
            { name: "영수증", desc: "사진 인식으로 자동 등록" },
            { name: "세금계산서", desc: "B2B 거래 내역 관리" },
            { name: "수동 입력", desc: "직접 입력으로 경비 등록" },
          ].map((source, i) => (
            <button
              key={i}
              onClick={() => setCurrentFlow("dashboard")}
              className="w-full p-4 border border-border rounded-xl hover:border-[#FC6226] hover:bg-[#FC6226]/5 transition-colors text-left"
            >
              <p className="font-semibold text-foreground">{source.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{source.desc}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentFlow("dashboard")}
          className="w-full py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
        >
          대시보드로 이동
        </button>
      </div>
    </div>
  );

  // 메인 대시보드
  const DashboardScreen = () => (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-muted-foreground text-sm">안녕하세요</p>
          <h1 className="text-3xl font-bold text-foreground">{userProfile?.name}님</h1>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-white border border-border rounded-2xl">
            <p className="text-sm text-muted-foreground mb-2">예상 세금</p>
            <p className="text-3xl font-bold text-foreground">3.24M</p>
            <p className="text-xs text-muted-foreground mt-2">단순경비율 대비 880K 절감</p>
          </div>
          <div className="p-6 bg-white border border-border rounded-2xl">
            <p className="text-sm text-muted-foreground mb-2">신고 준비율</p>
            <p className="text-3xl font-bold text-[#FC6226]">86%</p>
            <p className="text-xs text-muted-foreground mt-2">3개 항목 남음</p>
          </div>
        </div>

        {/* 액션 카드 */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => setCurrentFlow("income-expense-management")}
            className="w-full p-4 bg-white border border-border rounded-xl hover:border-[#FC6226] hover:bg-[#FC6226]/5 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">수익/경비 정리</p>
                <p className="text-sm text-muted-foreground mt-1">월별 거래 내역 관리</p>
              </div>
              <DollarSign className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>

          <button
            onClick={() => setCurrentFlow("tax-optimization")}
            className="w-full p-4 bg-white border border-border rounded-xl hover:border-[#FC6226] hover:bg-[#FC6226]/5 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">절세 최적화</p>
                <p className="text-sm text-muted-foreground mt-1">절세 기회 발굴 및 추천</p>
              </div>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>

          <button
            onClick={() => setCurrentFlow("tax-filing-preparation")}
            className="w-full p-4 bg-white border border-border rounded-xl hover:border-[#FC6226] hover:bg-[#FC6226]/5 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">신고 준비</p>
                <p className="text-sm text-muted-foreground mt-1">신고 준비 상태 확인</p>
              </div>
              <FileCheck className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
        </div>

        {/* 보조 기능 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCurrentFlow("reports")}
            className="p-4 bg-white border border-border rounded-xl hover:border-[#FC6226] transition-colors text-center"
          >
            <PieChart className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">리포트</p>
          </button>
          <button
            onClick={() => setCurrentFlow("document-storage")}
            className="p-4 bg-white border border-border rounded-xl hover:border-[#FC6226] transition-colors text-center"
          >
            <FileText className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">자료</p>
          </button>
          <button
            onClick={() => setCurrentFlow("notifications")}
            className="p-4 bg-white border border-border rounded-xl hover:border-[#FC6226] transition-colors text-center"
          >
            <Bell className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">알림</p>
          </button>
          <button
            onClick={() => setCurrentFlow("settings")}
            className="p-4 bg-white border border-border rounded-xl hover:border-[#FC6226] transition-colors text-center"
          >
            <Settings className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">설정</p>
          </button>
        </div>
      </div>
    </div>
  );

  // 수익/경비 정리
  const IncomeExpenseManagementScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">수익/경비 정리</h1>

        <div className="space-y-4 mb-8">
          <div className="p-6 bg-white border border-border rounded-2xl">
            <p className="text-sm text-muted-foreground mb-2">이번 달 수익</p>
            <p className="text-3xl font-bold text-foreground">4.23M</p>
          </div>
          <div className="p-6 bg-white border border-border rounded-2xl">
            <p className="text-sm text-muted-foreground mb-2">이번 달 경비</p>
            <p className="text-3xl font-bold text-foreground">1.52M</p>
          </div>
        </div>

        <h3 className="font-semibold text-foreground mb-4">최근 거래</h3>
        <div className="space-y-3">
          {incomeData.map((item) => (
            <div key={item.id} className="p-4 border border-border rounded-xl flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{item.source}</p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
              <p className="font-semibold text-foreground">₩{item.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentFlow("dashboard")}
          className="w-full mt-8 py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
        >
          대시보드로 돌아가기
        </button>
      </div>
    </div>
  );

  // 절세 최적화
  const TaxOptimizationScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">절세 최적화</h1>

        <div className="space-y-4 mb-8">
          <div className="p-4 border-l-4 border-[#FC6226] bg-[#FC6226]/5 rounded-r-xl">
            <p className="font-semibold text-foreground">장비 반영 완료</p>
            <p className="text-sm text-muted-foreground mt-1">카메라, 마이크 등 장비비 반영됨</p>
          </div>
          <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-xl">
            <p className="font-semibold text-foreground">통신비 미반영</p>
            <p className="text-sm text-muted-foreground mt-1">월 110K 절세 가능</p>
          </div>
          <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-xl">
            <p className="font-semibold text-foreground">외주비 누락 가능성</p>
            <p className="text-sm text-muted-foreground mt-1">편집자 지급내역 확인 필요</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentFlow("tax-filing-preparation")}
          className="w-full py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
        >
          신고 준비로 이동
        </button>
      </div>
    </div>
  );

  // 신고 준비
  const TaxFilingPreparationScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">신고 준비</h1>

        <div className="bg-white border border-border p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">신고 준비율</h3>
            <span className="text-3xl font-bold text-[#FC6226]">86%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div className="bg-[#FC6226] h-3 rounded-full" style={{ width: "86%" }}></div>
          </div>
        </div>

        <h3 className="font-semibold text-foreground mb-4">남은 항목</h3>
        <div className="space-y-3 mb-8">
          {[
            "원천징수 내역 확인",
            "협찬 2건 시가 입력",
            "고액 장비 증빙 추가",
          ].map((item, i) => (
            <div key={i} className="p-4 border border-border rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <p className="text-foreground">{item}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentFlow("tax-filing-comparison")}
          className="w-full py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
        >
          신고 방식 비교
        </button>
      </div>
    </div>
  );

  // 신고 방식 비교
  const TaxFilingComparisonScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">신고 방식 비교</h1>

        <div className="space-y-4 mb-8">
          {[
            { name: "단순경비율", tax: 4120000, recommended: false },
            { name: "기준경비율", tax: 3680000, recommended: false },
            { name: "장부신고", tax: 3240000, recommended: true },
          ].map((method, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl border-2 ${
                method.recommended ? "border-[#FC6226] bg-[#FC6226]/5" : "border-border bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">{method.name}</h3>
                {method.recommended && (
                  <span className="px-3 py-1 bg-[#FC6226] text-white text-xs rounded-full font-semibold">
                    추천
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-foreground">₩{method.tax.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentFlow("tax-filing-risk-analysis")}
          className="w-full py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
        >
          리스크 분석
        </button>
      </div>
    </div>
  );

  // 세무 리스크 분석
  const TaxFilingRiskAnalysisScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">세무 리스크 분석</h1>

        <div className="bg-white border border-border p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">세무 안정도</h3>
            <span className="text-4xl font-bold text-[#FC6226]">78점</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div className="bg-[#FC6226] h-3 rounded-full" style={{ width: "78%" }}></div>
          </div>
        </div>

        <h3 className="font-semibold text-foreground mb-4">감지된 리스크</h3>
        <div className="space-y-3 mb-8">
          {[
            { risk: "현금입금 과다", level: "높음" },
            { risk: "증빙 부족", level: "중간" },
            { risk: "협찬 누락", level: "중간" },
          ].map((item, i) => (
            <div key={i} className="p-4 border border-border rounded-xl flex items-center justify-between">
              <p className="font-medium text-foreground">{item.risk}</p>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  item.level === "높음"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.level}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentFlow("tax-filing-generation")}
          className="w-full py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
        >
          신고서 생성
        </button>
      </div>
    </div>
  );

  // 신고서 생성
  const TaxFilingGenerationScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">신고서 생성</h1>

        <div className="bg-white border border-border p-6 rounded-2xl mb-8">
          <h3 className="font-semibold text-foreground mb-6">최종 신고 데이터</h3>
          <div className="space-y-4">
            {[
              { label: "총수입금액", value: "42,300,000" },
              { label: "필요경비", value: "15,200,000" },
              { label: "사업소득금액", value: "27,100,000" },
              { label: "기납부세액", value: "1,200,000" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <p className="text-foreground font-medium">{item.label}</p>
                <p className="text-foreground font-bold">₩{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <button className="w-full py-3 border-2 border-[#FC6226] text-[#FC6226] rounded-xl font-semibold hover:bg-[#FC6226]/5 transition-colors">
            전체 복사
          </button>
          <button className="w-full py-3 border-2 border-[#FC6226] text-[#FC6226] rounded-xl font-semibold hover:bg-[#FC6226]/5 transition-colors">
            PDF 다운로드
          </button>
        </div>

        <button
          onClick={() => setCurrentFlow("tax-filing-guide")}
          className="w-full py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
        >
          홈택스 제출 가이드
        </button>
      </div>
    </div>
  );

  // 홈택스 제출 가이드
  const TaxFilingGuideScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">홈택스 제출 가이드</h1>

        <div className="space-y-4 mb-8">
          {[
            { step: 1, title: "홈택스 접속", desc: "www.hometax.go.kr 방문" },
            { step: 2, title: "신고 메뉴 선택", desc: "종합소득세 신고 > 장부신고" },
            { step: 3, title: "데이터 입력", desc: "준비된 데이터 복사 후 입력" },
            { step: 4, title: "검증", desc: "오류 확인 및 수정" },
            { step: 5, title: "제출", desc: "최종 확인 후 제출" },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 p-4 border border-border rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#FC6226] text-white flex items-center justify-center font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentFlow("tax-filing-rehearsal")}
          className="w-full py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
        >
          신고 리허설
        </button>
      </div>
    </div>
  );

  // 신고 리허설
  const TaxFilingRehearsalScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">신고 리허설</h1>

        <div className="bg-green-50 border border-green-200 p-6 rounded-2xl mb-8">
          <p className="font-semibold text-green-900 mb-2">현재 상태로 신고 가능합니다</p>
          <p className="text-sm text-green-700">모든 필수 항목이 준비되었습니다.</p>
        </div>

        <div className="bg-white border border-border p-6 rounded-2xl mb-8">
          <p className="text-sm text-muted-foreground mb-2">리스크 평가</p>
          <p className="text-3xl font-bold text-green-600">낮음</p>
          <p className="text-sm text-muted-foreground mt-2">세무 리스크</p>
        </div>

        <button
          onClick={() => setCurrentFlow("tax-filing-complete")}
          className="w-full py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
        >
          신고 완료
        </button>
      </div>
    </div>
  );

  // 신고 완료
  const TaxFilingCompleteScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FC6226]/5 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">신고 완료</h1>
        <p className="text-lg text-muted-foreground mb-8">
          2025년 종합소득세 신고가 완료되었습니다.
        </p>

        <div className="bg-white p-6 rounded-2xl border border-border mb-8 text-left">
          <h3 className="font-semibold text-foreground mb-6">신고 요약</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-muted-foreground">총 수익</span>
              <span className="font-semibold text-foreground">25,900,000</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-muted-foreground">인정 경비</span>
              <span className="font-semibold text-foreground">8,450,000</span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-muted-foreground">예상 납부세액</span>
              <span className="font-bold text-[#FC6226] text-lg">3,240,000</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentFlow("dashboard")}
          className="w-full py-3 bg-[#FC6226] text-white rounded-xl font-semibold hover:bg-[#E55A1F] transition-colors"
        >
          대시보드로 돌아가기
        </button>
      </div>
    </div>
  );

  // 리포트
  const ReportsScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">리포트</h1>

        <div className="space-y-3">
          <button className="w-full p-4 bg-white border border-border rounded-xl hover:border-[#FC6226] transition-colors text-left">
            <p className="font-semibold text-foreground">월간 리포트</p>
            <p className="text-sm text-muted-foreground mt-1">5월 수익/경비 요약</p>
          </button>
          <button className="w-full p-4 bg-white border border-border rounded-xl hover:border-[#FC6226] transition-colors text-left">
            <p className="font-semibold text-foreground">연간 리포트</p>
            <p className="text-sm text-muted-foreground mt-1">2025년 전체 통계</p>
          </button>
        </div>

        <button
          onClick={() => setCurrentFlow("dashboard")}
          className="w-full mt-8 py-3 border-2 border-[#FC6226] text-[#FC6226] rounded-xl font-semibold hover:bg-[#FC6226]/5 transition-colors"
        >
          대시보드로 돌아가기
        </button>
      </div>
    </div>
  );

  // 자료 보관함
  const DocumentStorageScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">자료 보관함</h1>

        <div className="space-y-3">
          {[
            { name: "계약서", count: 3 },
            { name: "영수증", count: 24 },
            { name: "세금계산서", count: 8 },
            { name: "협찬 내역", count: 5 },
            { name: "외주 계약", count: 2 },
            { name: "원천징수영수증", count: 1 },
          ].map((item, i) => (
            <div key={i} className="p-4 border border-border rounded-xl flex items-center justify-between hover:border-[#FC6226] transition-colors">
              <p className="font-medium text-foreground">{item.name}</p>
              <span className="px-3 py-1 bg-[#FC6226]/10 text-[#FC6226] rounded-full font-semibold text-sm">
                {item.count}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentFlow("dashboard")}
          className="w-full mt-8 py-3 border-2 border-[#FC6226] text-[#FC6226] rounded-xl font-semibold hover:bg-[#FC6226]/5 transition-colors"
        >
          대시보드로 돌아가기
        </button>
      </div>
    </div>
  );

  // 알림
  const NotificationsScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">알림</h1>

        <div className="space-y-3">
          {[
            { title: "신고 마감", desc: "5월 31일까지 신고해주세요", time: "2시간 전" },
            { title: "증빙 누락", desc: "협찬 2건의 증빙이 부족해요", time: "1일 전" },
            { title: "데이터 동기화", desc: "은행 계좌 데이터 동기화 완료", time: "1주일 전" },
          ].map((item, i) => (
            <div key={i} className="p-4 border border-border rounded-xl">
              <p className="font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              <p className="text-xs text-muted-foreground mt-2">{item.time}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentFlow("dashboard")}
          className="w-full mt-8 py-3 border-2 border-[#FC6226] text-[#FC6226] rounded-xl font-semibold hover:bg-[#FC6226]/5 transition-colors"
        >
          대시보드로 돌아가기
        </button>
      </div>
    </div>
  );

  // 설정
  const SettingsScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">설정</h1>

        <div className="space-y-3">
          <button className="w-full p-4 bg-white border border-border rounded-xl hover:border-[#FC6226] transition-colors text-left flex items-center justify-between">
            <p className="font-medium text-foreground">계정 정보</p>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full p-4 bg-white border border-border rounded-xl hover:border-[#FC6226] transition-colors text-left flex items-center justify-between">
            <p className="font-medium text-foreground">알림 설정</p>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full p-4 bg-white border border-border rounded-xl hover:border-[#FC6226] transition-colors text-left flex items-center justify-between">
            <p className="font-medium text-foreground">개인정보 보호</p>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <button
          onClick={() => setCurrentFlow("dashboard")}
          className="w-full mt-8 py-3 border-2 border-[#FC6226] text-[#FC6226] rounded-xl font-semibold hover:bg-[#FC6226]/5 transition-colors"
        >
          대시보드로 돌아가기
        </button>
      </div>
    </div>
  );

  // 플로우 렌더링
  const renderFlow = () => {
    switch (currentFlow) {
      case "splash":
        return <SplashScreen />;
      case "auth":
        return <AuthScreen />;
      case "onboarding":
        return <OnboardingScreen />;
      case "diagnosis":
        return <DiagnosisScreen />;
      case "income-connection":
        return <IncomeConnectionScreen />;
      case "expense-connection":
        return <ExpenseConnectionScreen />;
      case "dashboard":
        return <DashboardScreen />;
      case "income-expense-management":
        return <IncomeExpenseManagementScreen />;
      case "tax-optimization":
        return <TaxOptimizationScreen />;
      case "tax-filing-preparation":
        return <TaxFilingPreparationScreen />;
      case "tax-filing-comparison":
        return <TaxFilingComparisonScreen />;
      case "tax-filing-risk-analysis":
        return <TaxFilingRiskAnalysisScreen />;
      case "tax-filing-generation":
        return <TaxFilingGenerationScreen />;
      case "tax-filing-guide":
        return <TaxFilingGuideScreen />;
      case "tax-filing-rehearsal":
        return <TaxFilingRehearsalScreen />;
      case "tax-filing-complete":
        return <TaxFilingCompleteScreen />;
      case "reports":
        return <ReportsScreen />;
      case "document-storage":
        return <DocumentStorageScreen />;
      case "notifications":
        return <NotificationsScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
      <Header />
      {renderFlow()}
    </div>
  );
}
