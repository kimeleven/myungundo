'use client';

import { useState } from 'react';

const ZODIAC_LIST = [
  { name: '쥐', emoji: '🐭', year: '자(子)', element: '수(水)', years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020] },
  { name: '소', emoji: '🐮', year: '축(丑)', element: '토(土)', years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021] },
  { name: '호랑이', emoji: '🐯', year: '인(寅)', element: '목(木)', years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022] },
  { name: '토끼', emoji: '🐰', year: '묘(卯)', element: '목(木)', years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023] },
  { name: '용', emoji: '🐲', year: '진(辰)', element: '토(土)', years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024] },
  { name: '뱀', emoji: '🐍', year: '사(巳)', element: '화(火)', years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025] },
  { name: '말', emoji: '🐴', year: '오(午)', element: '화(火)', years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026] },
  { name: '양', emoji: '🐑', year: '미(未)', element: '토(土)', years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027] },
  { name: '원숭이', emoji: '🐒', year: '신(申)', element: '금(金)', years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028] },
  { name: '닭', emoji: '🐓', year: '유(酉)', element: '금(金)', years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029] },
  { name: '개', emoji: '🐶', year: '술(戌)', element: '토(土)', years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030] },
  { name: '돼지', emoji: '🐷', year: '해(亥)', element: '수(水)', years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031] },
];

const CURRENT_YEAR = 2026;

// 샘플 운세 콘텐츠 (DB에 데이터 없을 때 표시)
const SAMPLE_HOROSCOPES: Record<string, string> = {
  쥐: '병오년(丙午年) 2026년, 쥐띠에게는 변화와 도전의 해입니다. 오(午)의 화(火) 기운이 자(子)의 수(水)와 충(冲)을 이루어 긴장감이 높아질 수 있습니다. 상반기에는 신중한 판단이 필요하며, 하반기부터 기운이 안정됩니다. 재물운은 중간 수준이며 투자보다 저축이 유리합니다.',
  소: '병오년 소띠는 묵묵한 노력이 결실을 맺는 해입니다. 축(丑)과 오(午)의 합(合)으로 인해 좋은 인연을 만날 기회가 있습니다. 직장인은 승진·이직 기회가 생기고, 사업가는 새로운 파트너십이 유리합니다. 건강은 소화기 계통에 주의가 필요합니다.',
  호랑이: '병오년 호랑이띠는 왕성한 활동력이 돋보이는 해입니다. 인(寅)과 오(午)가 반합(半合)을 이루어 화(火) 기운이 강해집니다. 직업적으로 리더십을 발휘할 기회가 많으며, 도전적인 일에서 두각을 나타냅니다. 지나친 열정으로 무리하지 않도록 주의하세요.',
  토끼: '병오년 토끼띠는 안정 속에서 성장하는 해입니다. 묘(卯)와 오(午)의 관계가 활발한 사회생활을 예고합니다. 예술·창작 분야에서 영감이 넘치고, 대인관계가 원활해집니다. 연애운이 좋아 좋은 인연을 만날 가능성이 높습니다.',
  용: '병오년 용띠는 확장의 기운이 강한 해입니다. 진(辰)의 토(土) 기운과 오(午)의 화(火)가 상생하여 에너지가 풍부합니다. 사업 확장이나 새로운 프로젝트 시작에 좋은 시기입니다. 다만 과욕은 금물이며, 계획적인 접근이 중요합니다.',
  뱀: '병오년 뱀띠는 지혜를 발휘하는 해입니다. 사(巳)와 오(午)가 인접하여 화(火) 기운이 매우 강합니다. 지적 활동, 연구, 전문 분야에서 탁월한 성과를 기대할 수 있습니다. 건강은 심장과 혈액순환에 유의하고, 충분한 휴식이 필요합니다.',
  말: '병오년 말띠는 본명년(本命年)입니다. 오(午)년에 말띠가 겹치는 해로 강한 기운과 변화가 예상됩니다. 새로운 시작에 좋지만, 충동적인 결정은 피해야 합니다. 인내심을 가지고 꾸준히 노력한다면 큰 성취를 이룰 수 있는 해입니다.',
  양: '병오년 양띠에게는 조화와 협력이 키워드입니다. 미(未)와 오(午)가 인접하여 안정적인 흐름이 이어집니다. 팀워크가 필요한 분야에서 두각을 나타내고, 예술·문화 관련 활동이 길합니다. 재물운은 안정적이며 새로운 수입원이 생길 수 있습니다.',
  원숭이: '병오년 원숭이띠는 기지와 유연성이 필요한 해입니다. 신(申)과 오(午)의 관계에서 변화의 바람이 불어옵니다. 적응력이 뛰어난 원숭이띠에게 좋은 기회가 찾아오지만, 신중한 판단이 요구됩니다. 인간관계에서 오해가 생기지 않도록 소통에 주의하세요.',
  닭: '병오년 닭띠는 성실함이 빛을 발하는 해입니다. 유(酉)의 금(金)이 오(午)의 화(火)를 만나 단련의 과정을 거칩니다. 어려움이 있더라도 꾸준한 노력이 보상받는 해이며, 하반기에 좋은 결과가 나타납니다. 건강은 호흡기와 폐 기능에 주의하세요.',
  개: '병오년 개띠에게는 충성과 의리가 통하는 해입니다. 술(戌)의 토(土)와 오(午)의 화(火)가 상생하여 전반적인 운기가 좋습니다. 기존 인연에서 도움이 오고, 직장·사업 모두 안정적입니다. 가족 관계에도 화목함이 깃드는 좋은 해입니다.',
  돼지: '병오년 돼지띠는 풍요를 가꾸는 해입니다. 해(亥)의 수(水)와 오(午)의 화(火)가 대립하여 균형 감각이 중요합니다. 재물운은 지출이 많아질 수 있으니 계획적인 소비가 필요합니다. 여행이나 새로운 경험이 새로운 기회를 가져다줍니다.',
};

export default function HoroscopePage() {
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);

  const selected = ZODIAC_LIST.find(z => z.name === selectedZodiac);
  const horoscopeContent = selectedZodiac ? SAMPLE_HOROSCOPES[selectedZodiac] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3">
          <span className="text-amber-400">{CURRENT_YEAR}년</span> 띠별 운세
        </h1>
        <p className="text-slate-400">병오년(丙午年) — 당신의 띠를 선택하세요.</p>
      </div>

      {/* 12띠 그리드 */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-10">
        {ZODIAC_LIST.map((zodiac) => (
          <button
            key={zodiac.name}
            onClick={() => setSelectedZodiac(zodiac.name === selectedZodiac ? null : zodiac.name)}
            className={`card text-center py-4 cursor-pointer transition-all duration-200 hover:border-amber-400/50 ${
              selectedZodiac === zodiac.name
                ? 'border-amber-400 bg-amber-400/10'
                : ''
            }`}
          >
            <div className="text-3xl mb-2">{zodiac.emoji}</div>
            <div className={`font-semibold text-sm ${selectedZodiac === zodiac.name ? 'text-amber-400' : 'text-slate-200'}`}>
              {zodiac.name}띠
            </div>
            <div className="text-xs text-slate-500 mt-1">{zodiac.year}</div>
          </button>
        ))}
      </div>

      {/* 선택된 띠 운세 */}
      {selected && horoscopeContent && (
        <div className="card animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{selected.emoji}</span>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">
                {selected.name}띠 <span className="text-amber-400">{CURRENT_YEAR}년 운세</span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {selected.year} · {selected.element} · 해당 출생년도: {selected.years.slice(-4).join(', ')}년
              </p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-5">
            <p className="text-slate-300 leading-8 whitespace-pre-wrap">{horoscopeContent}</p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-600 text-center">
              * 위 내용은 명리학 이론을 바탕으로 한 참고용 운세입니다.
            </p>
          </div>
        </div>
      )}

      {!selectedZodiac && (
        <div className="text-center text-slate-500 py-8">
          <p>위에서 띠를 선택하면 {CURRENT_YEAR}년 운세를 확인할 수 있습니다.</p>
        </div>
      )}

      {/* 병오년 전체 운세 해설 */}
      <div className="mt-12 card">
        <h2 className="text-lg font-semibold text-amber-400 mb-4">병오년(丙午年) 2026년이란?</h2>
        <div className="space-y-3 text-sm text-slate-400 leading-6">
          <p>
            <span className="text-slate-200 font-medium">천간 병(丙)</span>은 태양의 기운을 상징합니다.
            밝고 강렬한 화(火)의 기운이 넘쳐 적극성과 열정이 높아지는 해입니다.
          </p>
          <p>
            <span className="text-slate-200 font-medium">지지 오(午)</span>는 12지 중 화(火)가 가장 강한 지지입니다.
            병화(丙火)와 오화(午火)가 겹쳐 뜨겁고 역동적인 에너지가 지배합니다.
          </p>
          <p>
            전반적으로 <span className="text-slate-200 font-medium">도전, 변화, 열정</span>의 기운이 강한 해입니다.
            새로운 시작에는 좋지만, 감정 조절과 과욕을 경계해야 합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
