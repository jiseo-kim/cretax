import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * TaxEase Landing Page
 * Design Philosophy: Notion-Inspired Minimalism with Playful Accents
 * 
 * Key Design Elements:
 * - Primary Color: #7AF8BC (Mint Green) - Trust, Growth, Positive Change
 * - Typography: Pretendard (Korean) + Plus Jakarta Sans (English)
 * - Layout: Asymmetric, card-based sections with generous whitespace
 * - Interaction: Smooth transitions, hover effects, fade-in animations
 */

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-lg text-foreground">TaxEase</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">
              기능
            </a>
            <a href="#benefits" className="text-foreground hover:text-primary transition-colors">
              이점
            </a>
            <a href="#cta" className="text-foreground hover:text-primary transition-colors">
              시작하기
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-white via-white to-primary/5">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`${isVisible ? "fade-in" : "opacity-0"}`}>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                크리에이터, 프리랜서의 <span className="text-gradient">세금 고민</span> 끝내기
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                복잡한 종합소득세 신고, 이제 스마트하게 해결하세요. 자동 계산부터 절세 가이드까지 모든 것을 한 곳에서 관리합니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary">
                  무료로 시작하기
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </button>
                <button className="btn-secondary">
                  데모 보기
                </button>
              </div>
              <div className="mt-12 flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>가입 없이 시작</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>완전 무료</span>
                </div>
              </div>
            </div>
            <div className={`${isVisible ? "fade-in" : "opacity-0"} delay-200`}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663680512968/7Jzaja3V5zt52djpUN3p39/hero-illustration-b2U5BpGYHoSxDrMP35NBDN.webp"
                alt="Hero Illustration"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="benefits" className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">이런 고민 많으시죠?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              크리에이터와 프리랜서들이 가장 많이 겪는 세금 관련 문제들을 TaxEase가 해결해드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "세금 계산이 복잡해요",
                description: "소득, 지출, 공제 항목이 많아서 정확한 세금을 계산하기 어렵습니다.",
              },
              {
                title: "절세 방법을 몰라요",
                description: "어떻게 하면 합법적으로 세금을 줄일 수 있는지 알 수 없습니다.",
              },
              {
                title: "신고 기한을 놓쳐요",
                description: "바쁜 일정 속에서 신고 기한을 깜빡하기 쉽습니다.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="card-hover p-8 bg-gradient-to-br from-white to-primary/5 rounded-2xl border border-border"
              >
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663680512968/7Jzaja3V5zt52djpUN3p39/problem-icons-Szhq9BuZiL5QrkU5pyETk3.webp"
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-lg mb-6"
                />
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="section-padding bg-gradient-to-b from-white to-primary/5">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">TaxEase가 해결해드립니다</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              4가지 핵심 기능으로 세금 관리를 완벽하게 자동화하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "자동 계산",
                description: "정확한 세금 계산",
                icon: "🧮",
              },
              {
                title: "절세 가이드",
                description: "맞춤형 절세 전략",
                icon: "💡",
              },
              {
                title: "신고 도움",
                description: "단계별 신고 가이드",
                icon: "📋",
              },
              {
                title: "기록 관리",
                description: "수입/지출 통합 관리",
                icon: "📁",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card-hover p-6 bg-white rounded-2xl border border-border text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Detail Section 1 */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                자동 계산으로 정확한 세금을 한 번에
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                복잡한 세금 계산 공식은 잊으세요. TaxEase가 자동으로 정확하게 계산해드립니다.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "소득과 지출 자동 분류",
                  "공제 항목 자동 인식",
                  "실시간 세금 예측",
                  "오류 자동 감지",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="btn-primary">
                지금 시작하기
              </button>
            </div>
            <div>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663680512968/7Jzaja3V5zt52djpUN3p39/feature-detail-1-kzdYV3MhazwBjD5AKiPKBr.webp"
                alt="Auto Calculation Feature"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail Section 2 */}
      <section className="section-padding bg-gradient-to-b from-white to-primary/5">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663680512968/7Jzaja3V5zt52djpUN3p39/feature-detail-2-DTer6CL6AxM7pk7bWBbJfj.webp"
                alt="Tax Savings Feature"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                맞춤형 절세 전략으로 더 많이 남기세요
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                당신의 소득 구조에 맞춘 절세 방법을 추천받으세요.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "개인 맞춤 절세 전략",
                  "합법적인 공제 항목 제안",
                  "절세 효과 시뮬레이션",
                  "세법 변경 자동 반영",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="btn-primary">
                절세 전략 보기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "50,000+", label: "활용 중인 크리에이터" },
              { number: "평균 35%", label: "세금 절감 효과" },
              { number: "4.9/5", label: "사용자 만족도" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <p className="text-lg text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="section-padding bg-gradient-to-r from-primary/10 to-primary/5 border-t border-border">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            복잡한 세금 신고, 더 이상 고민하지 마세요. TaxEase와 함께 스마트하게 관리하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              무료 가입하기
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
            <button className="btn-secondary">
              문의하기
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">T</span>
                </div>
                <span className="font-bold text-lg">TaxEase</span>
              </div>
              <p className="text-white/70">크리에이터와 프리랜서를 위한 스마트 세금 관리 솔루션</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">기능</a></li>
                <li><a href="#" className="hover:text-white transition-colors">요금</a></li>
                <li><a href="#" className="hover:text-white transition-colors">블로그</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">소개</a></li>
                <li><a href="#" className="hover:text-white transition-colors">채용</a></li>
                <li><a href="#" className="hover:text-white transition-colors">문의</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">법률</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
                <li><a href="#" className="hover:text-white transition-colors">개인정보</a></li>
                <li><a href="#" className="hover:text-white transition-colors">쿠키 정책</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/70">
            <p>&copy; 2024 TaxEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
