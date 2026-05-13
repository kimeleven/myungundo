import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden py-24 sm:py-32 px-4">
        {/* 배경 장식 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-amber-900/10 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          {/* 한자 장식 */}
          <div className="flex justify-center gap-4 mb-8 text-amber-400/30 text-5xl sm:text-6xl font-light tracking-widest select-none">
            <span>命</span>
            <span>運</span>
            <span>圖</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            당신의 운명을
            <br />
            <span className="text-amber-400">명리학으로</span> 읽다
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
            수천 년의 명리학 지식 체계를 바탕으로<br />
            AI가 당신만의 사주를 공감하며 풀어드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analysis" className="btn-primary text-center text-base">
              지금 사주 분석받기
            </Link>
            <Link href="/wiki" className="btn-secondary text-center text-base">
              명리학 위키 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 구분선 */}
      <div className="max-w-5xl mx-auto px-4 w-full">
        <div className="border-t border-slate-800" />
      </div>

      {/* 주요 기능 카드 */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12 text-slate-200">
            명운도가 제공하는 것
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 사주분석 */}
            <Link href="/analysis" className="card group hover:border-amber-400/50 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4 text-amber-400">☯</div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-amber-400 transition-colors">
                사주 분석
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                생년월일시를 입력하면 일간(日干) 기준 성격, 사주 강약, 용신 방향을 분석합니다.
                직업·연애·재물·건강 4개 영역별 맞춤 조언을 받아보세요.
              </p>
              <div className="mt-4 text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                분석 시작하기 →
              </div>
            </Link>

            {/* 명리학 위키 */}
            <Link href="/wiki" className="card group hover:border-amber-400/50 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4 text-amber-400">📚</div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-amber-400 transition-colors">
                명리학 위키
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                천간·지지·오행·신살·격국 등 명리학의 핵심 개념을 체계적으로 정리한
                위키 문서를 탐색해보세요.
              </p>
              <div className="mt-4 text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                위키 보기 →
              </div>
            </Link>

            {/* 오늘의 운세 */}
            <Link href="/horoscope" className="card group hover:border-amber-400/50 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4 text-amber-400">🌙</div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-amber-400 transition-colors">
                오늘의 운세
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                12띠별 연간 운세를 확인하세요. 띠를 선택하면 올해의 전반적인 운세와
                주의사항을 알려드립니다.
              </p>
              <div className="mt-4 text-amber-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                운세 확인하기 →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 신뢰 요소 */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-semibold mb-8 text-slate-300">명운도의 철학</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-400">
            <div>
              <div className="text-amber-400 text-2xl font-bold mb-2">명리학 기반</div>
              <p>수천 년의 동양 철학인 명리학 이론을 체계적으로 정리한 위키 지식을 AI에 결합했습니다.</p>
            </div>
            <div>
              <div className="text-amber-400 text-2xl font-bold mb-2">공감형 풀이</div>
              <p>딱딱한 한자 해석이 아닌, 현대인의 언어로 당신의 상황에 공감하는 풀이를 제공합니다.</p>
            </div>
            <div>
              <div className="text-amber-400 text-2xl font-bold mb-2">개인 맞춤</div>
              <p>일간(日干) 기준 개인 성향을 분석하여 직업·연애·재물·건강 영역별 맞춤 조언을 드립니다.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
