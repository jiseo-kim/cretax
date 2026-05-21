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
} from "lucide-react";

/**
 * CreTax App - 크리에이터 세금, 혼자서도 쉽게
 * 
 * Design Philosophy: Manus Minimalism
 * - Primary Color: #7AF8BC (Mint Green)
 * - Clean, professional, accessible interface
 * - Mobile-first responsive design
 * - Smooth transitions and micro-interactions
 * - LocalStorage-based persistence for user progress
 */

type AppFlow = 
  | "splash"
  | "auth"
  | "onboarding"
  | "diagnosis"
  | "income-connection"
  | "income-classification"
  | "expense-connection"
  | "dashboard"
  | "tax-check"
  | "tax-simulation"
  | "tax-comparison"
  | "business-analysis"
  | "risk-engine"
  | "report-preparation"
  | "report-generation"
  | "homeTax-guide"
  | "homeTax-input"
  | "report-rehearsal"
  | "report-complete"
  | "monthly-report"
  | "annual-report"
  | "document-storage"
  | "notifications"
  | "tax-advisor";

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
      if (now - state.timestamp > 60 * 60 * 1000) {
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
  const [selectedIncomeSource, setSelectedIncomeSource] = useState<string | null>(null);

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

  // 로딩 시뮬레이션 - 자연스러운 진행 상태바
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
          // 자연스러운 진행: 처음엔 빠르고 나중엔 느려짐
          const increment = prev < 30 ? Math.random() * 15 : prev < 70 ? Math.random() * 8 : Math.random() * 3;
          return Math.min(prev + increment, 99);
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isLoadingIncome]);

  // 스켈레톤 로더 컴포넌트
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

  // 진행 상태바 컴포넌트
  const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">데이터 로딩 중</p>
        <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-3 overflow-hidden shadow-sm">
        <div
          className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full transition-all duration-300 ease-out shadow-lg"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );

  // 스플래시 화면
  const SplashScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary/5 flex items-center justify-center p-4">
      <div className="text-center">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663680512968/7Jzaja3V5zt52djpUN3p39/cretax-logo-5nj6dB9vzbhvm8vpHWFLc5.webp"
          alt="CreTax Logo"
          className="w-24 h-24 mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-foreground mb-2">CreTax</h1>
        <p className="text-lg text-muted-foreground mb-12">크리에이터 세금, 혼자서도 쉽게</p>
        <button
          onClick={() => setCurrentFlow("auth")}
          className="btn-primary"
        >
          시작하기
        </button>
      </div>
    </div>
  );

  // 로그인/회원가입
  const AuthScreen = () => (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">로그인</h1>
          <p className="text-muted-foreground">CreTax에 오신 것을 환영합니다</p>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { name: "카카오", icon: "☕" },
            { name: "네이버", icon: "🔗" },
            { name: "구글", icon: "🔍" },
            { name: "애플", icon: "🍎" },
          ].map((provider) => (
            <button
              key={provider.name}
              className="w-full py-3 px-4 border border-border rounded-xl hover:bg-secondary transition-colors flex items-center justify-center gap-2"
            >
              <span>{provider.icon}</span>
              <span className="font-medium">{provider.name} 로그인</span>
            </button>
          ))}
        </div>

        <div className="relative mb-6">
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
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            onClick={() => {
              setIsLoggedIn(true);
              setCurrentFlow("onboarding");
            }}
            className="btn-primary w-full"
          >
            로그인
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          세금 신고 자료는 암호화되어 안전하게 보관됩니다.
        </p>
      </div>
    </div>
  );

  // 온보딩
  const OnboardingScreen = () => (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {onboardingStep === 1 ? (
          <div className="text-center">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663680512968/7Jzaja3V5zt52djpUN3p39/cretax-onboarding-1-RtdcwcnHs393kZCGhGvv8F.webp"
              alt="Onboarding 1"
              className="w-full h-64 object-cover rounded-2xl mb-8"
            />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              인스타, 유튜브, 협찬 수익…<br />
              어디까지 신고해야 할지 헷갈리셨죠?
            </h1>
            <button
              onClick={() => setOnboardingStep(2)}
              className="btn-primary mt-8"
            >
              내 세금 상태 확인하기
            </button>
          </div>
        ) : (
          <div className="text-center">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663680512968/7Jzaja3V5zt52djpUN3p39/cretax-onboarding-2-5RnTD9XA8rdkmsQMxejN5e.webp"
              alt="Onboarding 2"
              className="w-full h-64 object-cover rounded-2xl mb-8"
            />
            <h1 className="text-3xl font-bold text-foreground mb-6">
              CreTax가 해주는 일
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: "📊", title: "수익 자동 정리" },
                { icon: "💡", title: "경비 추천" },
                { icon: "🧮", title: "예상 세금 계산" },
                { icon: "✅", title: "신고 체크리스트" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-primary/10 rounded-xl">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="font-medium text-sm">{item.title}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setCurrentFlow("diagnosis")}
              className="btn-primary w-full"
            >
              시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // 진단 화면
  const DiagnosisScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">크리에이터 유형 진단</h1>
            <span className="text-sm text-muted-foreground">{diagnosisStep}/4</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(diagnosisStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {diagnosisStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">어떤 활동을 하나요?</h2>
            <div className="space-y-3">
              {["유튜브", "인스타그램", "틱톡", "블로그", "스트리밍", "강의/전자책", "기타"].map((activity) => (
                <label key={activity} className="flex items-center p-4 border border-border rounded-xl cursor-pointer hover:bg-secondary/50">
                  <input
                    type="checkbox"
                    checked={selectedDiagnosis.activities.includes(activity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDiagnosis({
                          ...selectedDiagnosis,
                          activities: [...selectedDiagnosis.activities, activity],
                        });
                      } else {
                        setSelectedDiagnosis({
                          ...selectedDiagnosis,
                          activities: selectedDiagnosis.activities.filter((a) => a !== activity),
                        });
                      }
                    }}
                    className="w-5 h-5 accent-primary rounded"
                  />
                  <span className="ml-3 font-medium text-foreground">{activity}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setDiagnosisStep(2)}
              disabled={selectedDiagnosis.activities.length === 0}
              className="btn-primary w-full mt-8 disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}

        {diagnosisStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">수익이 있나요?</h2>
            <div className="space-y-3">
              {["아직 없음", "가끔 있음", "매월 있음", "전업 수준"].map((level) => (
                <label key={level} className="flex items-center p-4 border border-border rounded-xl cursor-pointer hover:bg-secondary/50">
                  <input
                    type="radio"
                    name="income-level"
                    checked={selectedDiagnosis.incomeLevel === level}
                    onChange={() => setSelectedDiagnosis({ ...selectedDiagnosis, incomeLevel: level })}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="ml-3 font-medium text-foreground">{level}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setDiagnosisStep(1)} className="btn-secondary flex-1">
                이전
              </button>
              <button
                onClick={() => setDiagnosisStep(3)}
                disabled={!selectedDiagnosis.incomeLevel}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {diagnosisStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">어떤 수익이 있나요?</h2>
            <div className="space-y-3">
              {["애드센스", "브랜드 협찬", "광고/PPL", "후원/도네이션", "외주 제작", "강의/콘텐츠 판매"].map((type) => (
                <label key={type} className="flex items-center p-4 border border-border rounded-xl cursor-pointer hover:bg-secondary/50">
                  <input
                    type="checkbox"
                    checked={selectedDiagnosis.incomeTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDiagnosis({
                          ...selectedDiagnosis,
                          incomeTypes: [...selectedDiagnosis.incomeTypes, type],
                        });
                      } else {
                        setSelectedDiagnosis({
                          ...selectedDiagnosis,
                          incomeTypes: selectedDiagnosis.incomeTypes.filter((t) => t !== type),
                        });
                      }
                    }}
                    className="w-5 h-5 accent-primary rounded"
                  />
                  <span className="ml-3 font-medium text-foreground">{type}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setDiagnosisStep(2)} className="btn-secondary flex-1">
                이전
              </button>
              <button
                onClick={() => setDiagnosisStep(4)}
                disabled={selectedDiagnosis.incomeTypes.length === 0}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {diagnosisStep === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">사업자등록 했나요?</h2>
            <div className="space-y-3">
              {["아니요", "네", "잘 모르겠어요"].map((option) => (
                <label key={option} className="flex items-center p-4 border border-border rounded-xl cursor-pointer hover:bg-secondary/50">
                  <input
                    type="radio"
                    name="business-registered"
                    checked={selectedDiagnosis.businessRegistered === option}
                    onChange={() => setSelectedDiagnosis({ ...selectedDiagnosis, businessRegistered: option })}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="ml-3 font-medium text-foreground">{option}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setDiagnosisStep(3)} className="btn-secondary flex-1">
                이전
              </button>
              <button
                onClick={() => {
                  setUserProfile({
                    name: "지현님",
                    activities: selectedDiagnosis.activities,
                    incomeLevel: selectedDiagnosis.incomeLevel,
                    businessRegistered: selectedDiagnosis.businessRegistered === "네",
                  });
                  setCurrentFlow("income-connection");
                }}
                className="btn-primary flex-1"
              >
                진단 완료
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 수익 연결
  const IncomeConnectionScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">수익원 연결</h1>

        {isLoadingIncome ? (
          <div className="space-y-6">
            <ProgressBar progress={loadingProgress} />
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center mb-4">데이터를 불러오는 중입니다...</p>
              <SkeletonLoader />
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-8">
              {[
                { icon: "🔗", title: "구글 애드센스 연결", desc: "자동으로 수익 가져오기", id: "adsense" },
                { icon: "▶️", title: "유튜브 수익 가져오기", desc: "채널 연결하기", id: "youtube" },
                { icon: "🏦", title: "은행 계좌 연결", desc: "입금 내역 자동 분류", id: "bank" },
                { icon: "💳", title: "카드 내역 연결", desc: "거래 기록 동기화", id: "card" },
                { icon: "✏️", title: "직접 입력하기", desc: "수동으로 입력", id: "manual" },
                { icon: "📁", title: "CSV 업로드", desc: "파일로 일괄 등록", id: "csv" },
              ].map((option, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedIncomeSource(option.id);
                    setIsLoadingIncome(true);
                  }}
                  className="w-full p-4 border border-border rounded-xl hover:bg-secondary/50 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{option.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{option.title}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-primary/10 p-6 rounded-xl mb-8">
              <h3 className="font-semibold text-foreground mb-4">✅ 확인된 수익</h3>
              <div className="space-y-3">
                {incomeData.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                    style={{
                      animation: "fadeInUp 0.5s ease-out forwards",
                      animationDelay: `${index * 100}ms`,
                      opacity: 0,
                    }}
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.source}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <p className="font-semibold text-primary">₩{item.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4">
                <p className="text-sm text-muted-foreground mb-2">총 수익</p>
                <p className="text-2xl font-bold text-foreground">
                  ₩{incomeData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentFlow("income-classification")}
              className="btn-primary w-full"
            >
              수익 분류 확인하기
            </button>
          </>
        )}
      </div>
    </div>
  );

  // 수익 분류
  const IncomeClassificationScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">수익 분류 확인</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["전체", "애드센스", "광고/협찬", "후원", "외주", "미분류"].map((tab) => (
            <button
              key={tab}
              className="px-4 py-2 rounded-full whitespace-nowrap bg-secondary text-foreground font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-8">
          {incomeData.map((item) => (
            <div key={item.id} className="p-4 border border-border rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground">{item.source}</p>
                  <p className="text-sm text-muted-foreground">₩{item.amount.toLocaleString()}</p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                  {item.category}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20">
                  맞아요
                </button>
                <button className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary">
                  수정
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentFlow("expense-connection")}
          className="btn-primary w-full"
        >
          경비 자료 연결하기
        </button>
      </div>
    </div>
  );

  // 경비 연결
  const ExpenseConnectionScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">경비 자료 연결</h1>

        <div className="space-y-3 mb-8">
          {[
            { icon: "💳", title: "카드 연결", desc: "신용카드 거래내역 자동 분류" },
            { icon: "📸", title: "영수증 촬영", desc: "카메라로 영수증 인식" },
            { icon: "✏️", title: "직접 입력", desc: "수동으로 경비 등록" },
            { icon: "📁", title: "CSV 업로드", desc: "파일로 일괄 등록" },
          ].map((option, i) => (
            <button
              key={i}
              className="w-full p-4 border border-border rounded-xl hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <p className="font-semibold text-foreground">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-primary/10 p-6 rounded-xl mb-8">
          <h3 className="font-semibold text-foreground mb-4">업무 경비 후보</h3>
          <div className="space-y-3">
            {[
              { name: "Apple Store", amount: 2890000, category: "촬영/편집 장비", likelihood: "높음" },
              { name: "Adobe", amount: 77000, category: "편집 소프트웨어", likelihood: "높음" },
              { name: "스타벅스", amount: 18000, category: "미팅비", likelihood: "보통" },
            ].map((expense, i) => (
              <div key={i} className="p-3 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{expense.name}</p>
                  <p className="font-semibold text-primary">₩{expense.amount.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">{expense.category}</p>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                    인정 가능성: {expense.likelihood}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCurrentFlow("dashboard")}
          className="btn-primary w-full"
        >
          대시보드로 이동
        </button>
      </div>
    </div>
  );

  // 대시보드
  const DashboardScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary/5 pb-24">
      <div className="sticky top-0 bg-white border-b border-border p-4 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">대시보드</h1>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setCurrentFlow("splash");
              clearAppState();
            }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="로그아웃 및 진행 상태 초기화"
          >
            <LogOut size={20} className="text-foreground" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* 요약 카드 */}
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 rounded-2xl">
            <p className="text-sm opacity-90 mb-2">2025년 예상 종합소득세</p>
            <p className="text-4xl font-bold mb-4">3,240,000원</p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-sm opacity-75">절세 가능 금액</p>
                <p className="text-xl font-semibold">1,180,000원</p>
              </div>
              <div>
                <p className="text-sm opacity-75">신고 준비율</p>
                <p className="text-xl font-semibold">72%</p>
              </div>
            </div>
          </div>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "💰", title: "올해 총수익", value: "25,900,000원", color: "from-blue-500" },
            { icon: "📊", title: "인정 경비", value: "8,450,000원", color: "from-purple-500" },
            { icon: "🧮", title: "과세 예상 소득", value: "17,450,000원", color: "from-orange-500" },
            { icon: "⚠️", title: "부족한 자료", value: "3개", color: "from-red-500" },
          ].map((card, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-border">
              <p className="text-2xl mb-2">{card.icon}</p>
              <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
              <p className="text-lg font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        {/* CTA 버튼 */}
        <div className="space-y-3">
          <button
            onClick={() => setCurrentFlow("tax-check")}
            className="btn-primary w-full"
          >
            절세 체크 시작하기
          </button>
          <button
            onClick={() => setCurrentFlow("report-preparation")}
            className="btn-secondary w-full"
          >
            신고 준비 계속하기
          </button>
        </div>
      </div>
    </div>
  );

  // 절세 체크
  const TaxCheckScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">절세 체크리스트</h1>

        <div className="space-y-3 mb-8">
          {[
            { title: "장비 구매내역 반영", status: "complete" },
            { title: "소프트웨어 구독료 반영", status: "complete" },
            { title: "통신비 업무 비율 입력", status: "pending" },
            { title: "집 작업공간 사용 여부 확인", status: "pending" },
            { title: "외주 편집자 지급내역 입력", status: "pending" },
            { title: "현금 협찬 내역 확인 필요", status: "warning" },
          ].map((item, i) => (
            <div key={i} className="p-4 border border-border rounded-xl flex items-center gap-3">
              {item.status === "complete" && <CheckCircle2 size={24} className="text-primary flex-shrink-0" />}
              {item.status === "pending" && <div className="w-6 h-6 border-2 border-border rounded-full flex-shrink-0"></div>}
              {item.status === "warning" && <AlertCircle size={24} className="text-orange-500 flex-shrink-0" />}
              <span className="font-medium text-foreground">{item.title}</span>
            </div>
          ))}
        </div>

        <div className="bg-primary/10 p-6 rounded-xl mb-8">
          <h3 className="font-semibold text-foreground mb-4">💡 추천 카드</h3>
          <p className="text-foreground font-medium mb-3">통신비를 경비로 반영할 수 있어요</p>
          <div className="bg-white p-4 rounded-lg mb-4">
            <p className="text-sm text-muted-foreground mb-2">최근 1년 통신비</p>
            <p className="text-2xl font-bold text-foreground mb-4">1,320,000원</p>
            <p className="text-sm text-muted-foreground">업무 사용 비율 50% 적용 시</p>
            <p className="text-lg font-semibold text-primary">예상 절세 효과: 약 99,000원</p>
          </div>
          <button className="btn-primary w-full">반영하기</button>
        </div>

        <button
          onClick={() => setCurrentFlow("tax-simulation")}
          className="btn-primary w-full mt-8"
        >
          절세 시뮬레이션 보기
        </button>
        <button
          onClick={() => setCurrentFlow("report-preparation")}
          className="btn-secondary w-full mt-3"
        >
          신고 준비로 이동
        </button>
      </div>
    </div>
  );

  // 절세 시뮬레이션
  const TaxSimulationScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">절세 시뮬레이션</h1>

        <div className="space-y-6 mb-8">
          {/* 경비 반영 비교 */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-6">경비 반영 효과</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">반영 전</p>
                <p className="text-2xl font-bold text-foreground">4,120,000원</p>
                <p className="text-xs text-muted-foreground mt-2">예상 세금</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">반영 후</p>
                <p className="text-2xl font-bold text-primary">3,240,000원</p>
                <p className="text-xs text-muted-foreground mt-2">예상 세금</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-semibold">💰 절세액: 880,000원</p>
            </div>
          </div>

          {/* 추가 절세 기회 */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">추가 절세 기회</h3>
            <div className="space-y-3">
              {[
                { item: "통신비 (50% 반영)", amount: 660000, status: "미반영" },
                { item: "외주비 증빙", amount: 1200000, status: "미반영" },
                { item: "작업공간 임차료", amount: 2400000, status: "미반영" },
              ].map((expense, i) => (
                <div key={i} className="p-3 border border-border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{expense.item}</p>
                    <p className="text-sm text-muted-foreground">₩{expense.amount.toLocaleString()}</p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">
                    {expense.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentFlow("tax-comparison")}
          className="btn-primary w-full"
        >
          신고 방식 비교하기
        </button>
      </div>
    </div>
  );

  // 신고 방식 비교
  const TaxComparisonScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">신고 방식 비교</h1>

        <div className="space-y-4 mb-8">
          {[
            {
              name: "단순경비율",
              tax: 4120000,
              pros: ["간단한 신고", "최소 증빙"],
              cons: ["높은 세금"],
              recommended: false,
            },
            {
              name: "기준경비율",
              tax: 3680000,
              pros: ["중간 수준 세금", "일부 경비 인정"],
              cons: ["제한된 경비"],
              recommended: false,
            },
            {
              name: "장부신고",
              tax: 3240000,
              pros: ["최저 세금", "모든 경비 인정"],
              cons: ["복잡한 신고"],
              recommended: true,
            },
          ].map((method, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl border-2 ${
                method.recommended
                  ? "border-primary bg-primary/5"
                  : "border-border bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">{method.name}</h3>
                {method.recommended && (
                  <span className="px-3 py-1 bg-primary text-white text-xs rounded-full font-semibold">
                    추천
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-foreground mb-4">₩{method.tax.toLocaleString()}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">장점</p>
                  {method.pros.map((pro, j) => (
                    <p key={j} className="text-sm text-foreground">✓ {pro}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">단점</p>
                  {method.cons.map((con, j) => (
                    <p key={j} className="text-sm text-foreground">✗ {con}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentFlow("business-analysis")}
          className="btn-primary w-full"
        >
          사업자 전환 분석
        </button>
      </div>
    </div>
  );

  // 사업자 전환 분석
  const BusinessAnalysisScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">사업자 전환 분석</h1>

        <div className="bg-primary/10 p-6 rounded-xl mb-8">
          <h3 className="text-lg font-bold text-foreground mb-4">현재 수익 규모에서는</h3>
          <p className="text-foreground mb-6">
            사업자등록을 검토하는 것이 좋아요.
          </p>

          <div className="space-y-3 mb-6">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">현재 수익</p>
              <p className="text-2xl font-bold text-foreground">25,900,000원</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">사업자등록 기준</p>
              <p className="text-2xl font-bold text-foreground">24,000,000원</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-700 font-semibold">✓ 사업자등록 대상입니다</p>
            <p className="text-xs text-green-600 mt-1">부가세 신고 의무 발생</p>
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded-xl mb-8">
          <h3 className="font-semibold text-foreground mb-4">법인전환 시뮬레이터</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                연 수익 (₩)
              </label>
              <input
                type="number"
                defaultValue="25900000"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                예상 이익률 (%)
              </label>
              <input
                type="number"
                defaultValue="65"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="p-4 bg-white border border-border rounded-xl">
            <p className="text-sm text-muted-foreground mb-2">개인사업자 예상세</p>
            <p className="text-2xl font-bold text-foreground">3,240,000원</p>
          </div>
          <div className="p-4 bg-white border border-border rounded-xl">
            <p className="text-sm text-muted-foreground mb-2">법인 예상세</p>
            <p className="text-2xl font-bold text-foreground">2,890,000원</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-700 mb-2">예상 절세액</p>
            <p className="text-2xl font-bold text-green-700">350,000원</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentFlow("risk-engine")}
          className="btn-primary w-full"
        >
          세무 리스크 분석
        </button>
      </div>
    </div>
  );

  // 세무 리스크 엔진
  const RiskEngineScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">세무 리스크 엔진</h1>

        <div className="bg-white border border-border p-6 rounded-xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">세무 안정도</h3>
            <span className="text-4xl font-bold text-primary">78점</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div className="bg-primary h-3 rounded-full" style={{ width: "78%" }}></div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">양호 (70~85점)</p>
        </div>

        <div className="bg-white border border-border p-6 rounded-xl mb-8">
          <h3 className="font-semibold text-foreground mb-4">리스크 분석</h3>
          <div className="space-y-3">
            {[
              { risk: "현금입금 과다", level: "높음", icon: "⚠️" },
              { risk: "증빙 부족", level: "중간", icon: "⚠️" },
              { risk: "외주 지급 미증빙", level: "높음", icon: "⚠️" },
              { risk: "개인계좌 사용", level: "낮음", icon: "✓" },
              { risk: "협찬 누락", level: "중간", icon: "⚠️" },
            ].map((item, i) => (
              <div key={i} className="p-3 border border-border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <p className="font-medium text-foreground">{item.risk}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    item.level === "높음"
                      ? "bg-red-100 text-red-700"
                      : item.level === "중간"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl mb-8">
          <h3 className="font-semibold text-foreground mb-3">🔧 리스크 해결 가이드</h3>
          <p className="text-sm text-foreground mb-4">
            외주 지급 증빙 업로드를 권장해요.
          </p>
          <button className="btn-primary w-full">증빙 업로드하기</button>
        </div>

        <button
          onClick={() => setCurrentFlow("report-preparation")}
          className="btn-secondary w-full"
        >
          신고 준비로 이동
        </button>
      </div>
    </div>
  );

  // 신고 준비
  const ReportPreparationScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">신고 준비</h1>

        <div className="bg-primary/10 p-6 rounded-xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">신고 준비율</h3>
            <span className="text-2xl font-bold text-primary">86%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div className="bg-primary h-3 rounded-full" style={{ width: "86%" }}></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-foreground mb-4">남은 항목</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• 원천징수 내역 확인</p>
            <p>• 협찬 2건 시가 입력</p>
            <p>• 고액 장비 증빙 추가</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {[
            { icon: "💰", title: "수익 자료", status: "✓" },
            { icon: "📊", title: "경비 자료", status: "✓" },
            { icon: "🤝", title: "협찬 자료", status: "⚠️" },
            { icon: "📄", title: "원천징수 자료", status: "⚠️" },
            { icon: "🏢", title: "사업자 정보", status: "✓" },
            { icon: "👨‍👩‍👧", title: "부양가족/공제 정보", status: "-" },
          ].map((item, i) => (
            <div key={i} className="p-4 border border-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium text-foreground">{item.title}</span>
              </div>
              <span className="text-lg">{item.status}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentFlow("report-generation")}
          className="btn-primary w-full mb-3"
        >
          신고서 생성하기
        </button>
        <button className="btn-secondary w-full">
          사업자등록 가이드
        </button>
      </div>
    </div>
  );

  // 신고서 생성
  const ReportGenerationScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">신고 방식 추천</h1>

        <div className="bg-primary/10 p-6 rounded-xl mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">장부 신고 추천</h3>
          <p className="text-muted-foreground mb-6">
            이유: 장비 구입비가 크고, 소프트웨어/외주비 경비가 많으며, 단순경비율보다 예상 세금이 낮습니다.
          </p>

          <div className="bg-white p-4 rounded-lg mb-4">
            <p className="text-sm text-muted-foreground mb-2">단순경비율 신고 예상세액</p>
            <p className="text-2xl font-bold text-foreground mb-4">4,120,000원</p>
            <p className="text-sm text-muted-foreground mb-2">장부 신고 예상세액</p>
            <p className="text-2xl font-bold text-primary mb-4">3,240,000원</p>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-1">예상 절세액</p>
              <p className="text-xl font-bold text-primary">880,000원</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentFlow("homeTax-guide")}
          className="btn-primary w-full mb-3"
        >
          장부 신고로 진행
        </button>
        <button className="btn-secondary w-full">
          다른 방식 보기
        </button>
      </div>
    </div>
  );

  // 홈택스 가이드
  const HomeTaxGuideScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">홈택스 제출 가이드</h1>

        <div className="space-y-4 mb-8">
          {[
            {
              step: 1,
              title: "홈택스 접속",
              desc: "www.hometax.go.kr에 접속하여 공인인증서로 로그인",
            },
            {
              step: 2,
              title: "신고 준비",
              desc: "신고 > 종합소득세 신고 > 장부신고 선택",
            },
            {
              step: 3,
              title: "정보 입력",
              desc: "기본정보, 수익, 경비 정보 입력",
            },
            {
              step: 4,
              title: "검증",
              desc: "입력 정보 검증 및 오류 확인",
            },
            {
              step: 5,
              title: "제출",
              desc: "신고서 최종 확인 후 제출",
            },
          ].map((item) => (
            <div key={item.step} className="p-4 border border-border rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentFlow("report-complete")}
          className="btn-primary w-full"
        >
          신고 완료 리포트 보기
        </button>
      </div>
    </div>
  );

  // 신고 완료
  const ReportCompleteScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-white flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-foreground mb-4">신고 완료!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          지현님의 2025년 종합소득세 신고가 완료되었습니다.
        </p>

        <div className="bg-white p-8 rounded-2xl border border-border mb-8 text-left">
          <h3 className="font-semibold text-foreground mb-6">신고 요약</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-muted-foreground">총 수익</span>
              <span className="font-semibold text-foreground">25,900,000원</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-muted-foreground">인정 경비</span>
              <span className="font-semibold text-foreground">8,450,000원</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-muted-foreground">과세 소득</span>
              <span className="font-semibold text-foreground">17,450,000원</span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-muted-foreground">예상 납부세액</span>
              <span className="font-bold text-primary text-lg">3,240,000원</span>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 p-6 rounded-xl mb-8">
          <p className="text-sm text-muted-foreground mb-2">절세 효과</p>
          <p className="text-2xl font-bold text-primary">1,180,000원 절감</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setCurrentFlow("dashboard")}
            className="btn-primary w-full"
          >
            대시보드로 돌아가기
          </button>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setCurrentFlow("splash");
              clearAppState();
            }}
            className="btn-secondary w-full"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );

  // 홈택스 입력 패키지
  const HomeTaxInputScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">홈택스 입력 패키지</h1>

        <div className="bg-white border border-border p-6 rounded-xl mb-8">
          <h3 className="font-semibold text-foreground mb-6">최종 신고 데이터</h3>
          <div className="space-y-4">
            {[
              { label: "총수입금액", value: "₩42,300,000" },
              { label: "필요경비", value: "₩15,200,000" },
              { label: "사업소득금액", value: "₩27,100,000" },
              { label: "기납부세액", value: "₩1,200,000" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <p className="text-foreground font-medium">{item.label}</p>
                <p className="text-foreground font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <button className="btn-primary w-full">전체 복사</button>
          <button className="btn-secondary w-full">항목별 복사</button>
        </div>

        <button
          onClick={() => setCurrentFlow("report-rehearsal")}
          className="btn-primary w-full"
        >
          신고 리허설 시작
        </button>
      </div>
    </div>
  );

  // 신고 리허설
  const ReportRehearsalScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">신고 리허설</h1>

        <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-8">
          <h3 className="font-semibold text-green-900 mb-2">✅ 현재 상태로 신고 가능해요</h3>
          <p className="text-sm text-green-700">모든 필수 항목이 준비되었습니다.</p>
        </div>

        <div className="bg-white border border-border p-6 rounded-xl mb-8">
          <h3 className="font-semibold text-foreground mb-4">리스크 평가</h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">낮음</p>
              <p className="text-sm text-muted-foreground mt-2">세무 리스크</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">안정도 점수</p>
              <div className="w-full bg-secondary rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: "85%" }}></div>
              </div>
              <p className="text-sm text-foreground font-semibold mt-2">85/100</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-foreground">Step-by-step 가이드</h3>
          {[
            { step: 1, title: "홈택스 접속", desc: "www.hometax.go.kr 방문" },
            { step: 2, title: "신고 메뉴 선택", desc: "종합소득세 신고 > 장부신고" },
            { step: 3, title: "데이터 입력", desc: "준비된 데이터 복사 후 입력" },
            { step: 4, title: "검증", desc: "오류 확인 및 수정" },
            { step: 5, title: "제출", desc: "최종 확인 후 제출" },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 p-4 border border-border rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
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
          onClick={() => setCurrentFlow("report-complete")}
          className="btn-primary w-full"
        >
          신고 완료 리포트 보기
        </button>
      </div>
    </div>
  );

  // 월간 리포트
  const MonthlyReportScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">월간 리포트</h1>

        <div className="space-y-6 mb-8">
          <div className="bg-white border border-border p-6 rounded-xl">
            <h3 className="font-semibold text-foreground mb-4">5월 요약</h3>
            <div className="space-y-3">
              {[
                { label: "수익 변화", value: "+12.5%", color: "text-green-600" },
                { label: "비용 변화", value: "-3.2%", color: "text-green-600" },
                { label: "세금 예상 변화", value: "+8.1%", color: "text-orange-600" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <p className="text-foreground font-medium">{item.label}</p>
                  <p className={`font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-border p-6 rounded-xl">
            <h3 className="font-semibold text-foreground mb-4">플랫폼별 수익</h3>
            <div className="space-y-2">
              {[
                { name: "유튜브", amount: 4200000, percent: 45 },
                { name: "인스타그램", amount: 2800000, percent: 30 },
                { name: "협찬", amount: 2100000, percent: 25 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-sm font-semibold text-foreground">₩{item.amount.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="btn-primary w-full">PDF 다운로드</button>
      </div>
    </div>
  );

  // 연간 리포트
  const AnnualReportScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">연간 리포트</h1>

        <div className="space-y-6 mb-8">
          {[
            { label: "총매출", value: "₩42,300,000" },
            { label: "총경비", value: "₩15,200,000" },
            { label: "순이익", value: "₩27,100,000" },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-border p-6 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">{item.label}</p>
              <p className="text-3xl font-bold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button className="btn-primary w-full">세금 준비 리포트 다운로드</button>
          <button className="btn-secondary w-full">수익 리포트 다운로드</button>
          <button className="btn-secondary w-full">경비 리포트 다운로드</button>
        </div>
      </div>
    </div>
  );

  // 자료 보관함
  const DocumentStorageScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">자료 보관함</h1>

        <div className="space-y-3 mb-8">
          {[
            { icon: "📋", title: "계약서", count: 3 },
            { icon: "🧾", title: "영수증", count: 24 },
            { icon: "📄", title: "세금계산서", count: 8 },
            { icon: "🤝", title: "협찬 내역", count: 5 },
            { icon: "💼", title: "외주 계약", count: 2 },
            { icon: "📑", title: "원천징수영수증", count: 1 },
          ].map((item, i) => (
            <div key={i} className="p-4 border border-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <p className="font-medium text-foreground">{item.title}</p>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold text-sm">
                {item.count}
              </span>
            </div>
          ))}
        </div>

        <button className="btn-primary w-full">자료 추가하기</button>
      </div>
    </div>
  );

  // 알림 시스템
  const NotificationsScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">알림</h1>

        <div className="space-y-3">
          {[
            { type: "urgent", icon: "🚨", title: "신고 마감", desc: "5월 31일까지 신고해주세요", time: "2시간 전" },
            { type: "warning", icon: "⚠️", title: "증빙 누락", desc: "협찬 2건의 증빙이 부족해요", time: "1일 전" },
            { type: "info", icon: "💡", title: "스마트 알림", desc: "최근 장비 구매가 감지됐어요. 경비 등록할까요?", time: "3일 전" },
            { type: "success", icon: "✅", title: "데이터 동기화", desc: "은행 계좌 데이터 동기화 완료", time: "1주일 전" },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-4 border rounded-xl ${
                item.type === "urgent"
                  ? "border-red-200 bg-red-50"
                  : item.type === "warning"
                  ? "border-orange-200 bg-orange-50"
                  : item.type === "success"
                  ? "border-green-200 bg-green-50"
                  : "border-border bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  <p className="text-xs text-muted-foreground mt-2">{item.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 세무사 연결
  const TaxAdvisorScreen = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">세무사 연결</h1>

        <div className="bg-primary/10 border border-primary/30 p-6 rounded-xl mb-8">
          <h3 className="font-semibold text-foreground mb-3">🎯 AI 분석 결과</h3>
          <p className="text-foreground mb-4">
            고위험 항목이 발견됐어요. 전문가 검토를 추천해요.
          </p>
          <div className="space-y-2 text-sm text-foreground mb-4">
            <p>• 현금입금 과다 (₩5,200,000)</p>
            <p>• 외주 지급 미증빙 (₩2,100,000)</p>
            <p>• 협찬 누락 가능성</p>
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded-xl mb-8">
          <h3 className="font-semibold text-foreground mb-4">이용 가능한 서비스</h3>
          <div className="space-y-3">
            {[
              { icon: "📋", title: "신고 검토", desc: "신고 내용 전문가 검토" },
              { icon: "📊", title: "장부 검토", desc: "장부 작성 및 검증" },
              { icon: "💬", title: "세무 상담", desc: "1:1 세무사 상담" },
              { icon: "🔍", title: "리스크 분석", desc: "세무 리스크 심층 분석" },
            ].map((item, i) => (
              <button
                key={i}
                className="w-full p-4 border border-border rounded-xl hover:bg-secondary/50 transition-colors text-left"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary w-full">세무사 연결하기</button>
      </div>
    </div>
  );

  // 플로우 렌더링
  const renderFlow = () => {
    switch (currentFlow) {
      case "splash":
        return <SplashScreen />;
      case "auth":
        return isLoggedIn ? <OnboardingScreen /> : <AuthScreen />;
      case "onboarding":
        return <OnboardingScreen />;
      case "diagnosis":
        return <DiagnosisScreen />;
      case "income-connection":
        return <IncomeConnectionScreen />;
      case "income-classification":
        return <IncomeClassificationScreen />;
      case "expense-connection":
        return <ExpenseConnectionScreen />;
      case "dashboard":
        return <DashboardScreen />;
      case "tax-check":
        return <TaxCheckScreen />;
      case "tax-simulation":
        return <TaxSimulationScreen />;
      case "tax-comparison":
        return <TaxComparisonScreen />;
      case "business-analysis":
        return <BusinessAnalysisScreen />;
      case "risk-engine":
        return <RiskEngineScreen />;
      case "report-preparation":
        return <ReportPreparationScreen />;
      case "report-generation":
        return <ReportGenerationScreen />;
      case "homeTax-guide":
        return <HomeTaxGuideScreen />;
      case "homeTax-input":
        return <HomeTaxInputScreen />;
      case "report-rehearsal":
        return <ReportRehearsalScreen />;
      case "report-complete":
        return <ReportCompleteScreen />;
      case "monthly-report":
        return <MonthlyReportScreen />;
      case "annual-report":
        return <AnnualReportScreen />;
      case "document-storage":
        return <DocumentStorageScreen />;
      case "notifications":
        return <NotificationsScreen />;
      case "tax-advisor":
        return <TaxAdvisorScreen />;
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
      {renderFlow()}
    </div>
  );
}
