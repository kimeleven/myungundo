/**
 * 명운도 — 사주(四柱) 계산 유틸리티
 *
 * 만세력(萬歲曆) 기초 로직:
 * - 생년월일 → 년주(年柱) / 월주(月柱) / 일주(日柱) 계산
 * - 태어난 시간 → 시주(時柱) 계산
 * - 일간(日干) 추출
 *
 * 참고: 실제 만세력은 절기(節氣) 기준으로 월이 바뀌므로,
 * 정밀 구현 시 절기 테이블이 필요합니다.
 * 여기서는 양력 → 갑자년 기준 육십갑자 매핑 방식을 사용합니다.
 */

// 천간 (天干) 10개
export const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
export type Cheongan = (typeof CHEONGAN)[number];

// 지지 (地支) 12개
export const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;
export type Jiji = (typeof JIJI)[number];

// 60갑자 (六十甲子) 배열
export const SIXTY_GAPJA = CHEONGAN.flatMap((gan, gi) =>
  JIJI.map((ji, ji_i) => {
    if ((gi % 2 === 0 && ji_i % 2 === 0) || (gi % 2 === 1 && ji_i % 2 === 1)) {
      return `${gan}${ji}`;
    }
    return null;
  }).filter(Boolean)
) as string[];

// 실제 60갑자 순서 (순환)
export const GAPJA_CYCLE: string[] = [
  '갑자', '을축', '병인', '정묘', '무진', '기사', '경오', '신미', '임신', '계유',
  '갑술', '을해', '병자', '정축', '무인', '기묘', '경진', '신사', '임오', '계미',
  '갑신', '을유', '병술', '정해', '무자', '기축', '경인', '신묘', '임진', '계사',
  '갑오', '을미', '병신', '정유', '무술', '기해', '경자', '신축', '임인', '계묘',
  '갑진', '을사', '병오', '정미', '무신', '기유', '경술', '신해', '임자', '계축',
  '갑인', '을묘', '병진', '정사', '무오', '기미', '경신', '신유', '임술', '계해',
];

/**
 * 연도 → 년주 계산
 * 기준: 갑자년은 4년 (1984년이 갑자년)
 */
export function getYearPillar(year: number): string {
  // 1984년이 갑자년(甲子年) — 갑자 = index 0
  const idx = ((year - 1984) % 60 + 60) % 60;
  return GAPJA_CYCLE[idx];
}

/**
 * 연도 + 월(1-12) → 월주 계산
 * 월간(月干)은 연간(年干)에 따라 정해집니다 (오호둔월법, 五虎遁月法).
 * 월지(月支)는 인(寅)부터 시작 (1월=인, 2월=묘 ... 단 절기 기준)
 * 양력 기준 근사값 사용
 */
export function getMonthPillar(year: number, month: number): string {
  // 월지: 1월=인(index 2), 2월=묘(3), ... 12월=축(1)
  const monthJijiIndex = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1]; // 양력 1월 ~ 12월
  const jiji = JIJI[monthJijiIndex[month - 1]];

  // 오호둔월법: 년간의 인(寅)월 천간 기준
  // 갑·기년 → 인월은 병인(丙寅) → 월간 시작: 병(丙)
  const yearGanIdx = ((year - 1984) % 10 + 10) % 10;
  const yearGan = CHEONGAN[yearGanIdx];

  const monthGanStartMap: Record<string, number> = {
    갑: 2, // 병
    기: 2,
    을: 4, // 무
    경: 4,
    병: 6, // 경
    신: 6,
    정: 8, // 임
    임: 8,
    무: 0, // 갑
    계: 0,
  };

  const startGanIdx = monthGanStartMap[yearGan] ?? 0;
  // 인월이 1월 기준이므로 (month-1) 오프셋
  const monthGanIdx = (startGanIdx + (month - 1)) % 10;
  const gan = CHEONGAN[monthGanIdx];

  return `${gan}${jiji}`;
}

/**
 * 생년월일 → 일주 계산
 * 기준일: 1900-01-01 = 갑술일(甲戌) — gapja index 10
 * (실제 만세력과 오차가 있을 수 있음, 정밀도 요구 시 절기 테이블 필요)
 */
export function getDayPillar(dateStr: string): string {
  const date = new Date(dateStr);
  const baseDate = new Date('1900-01-01');
  const diffMs = date.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 1900-01-01이 갑술(甲戌) = index 10
  const idx = ((diffDays + 10) % 60 + 60) % 60;
  return GAPJA_CYCLE[idx];
}

/**
 * 시간(HH:MM) → 시주 계산
 * 시지(時支): 자시(子時) 23:00 ~ 01:00 부터 시작
 * 시간 기준:
 *   자(子) 23:00-01:00, 축(丑) 01:00-03:00, 인(寅) 03:00-05:00
 *   묘(卯) 05:00-07:00, 진(辰) 07:00-09:00, 사(巳) 09:00-11:00
 *   오(午) 11:00-13:00, 미(未) 13:00-15:00, 신(申) 15:00-17:00
 *   유(酉) 17:00-19:00, 술(戌) 19:00-21:00, 해(亥) 21:00-23:00
 */
export function getHourPillar(timeStr: string, dayPillar: string): string | null {
  if (!timeStr) return null;

  const [hStr, mStr] = timeStr.split(':');
  const hour = parseInt(hStr, 10);

  // 시지 결정
  let jijiIdx: number;
  if (hour >= 23 || hour < 1) jijiIdx = 0;       // 자(子)
  else if (hour < 3) jijiIdx = 1;                 // 축(丑)
  else if (hour < 5) jijiIdx = 2;                 // 인(寅)
  else if (hour < 7) jijiIdx = 3;                 // 묘(卯)
  else if (hour < 9) jijiIdx = 4;                 // 진(辰)
  else if (hour < 11) jijiIdx = 5;                // 사(巳)
  else if (hour < 13) jijiIdx = 6;                // 오(午)
  else if (hour < 15) jijiIdx = 7;                // 미(未)
  else if (hour < 17) jijiIdx = 8;                // 신(申)
  else if (hour < 19) jijiIdx = 9;                // 유(酉)
  else if (hour < 21) jijiIdx = 10;               // 술(戌)
  else jijiIdx = 11;                              // 해(亥)

  const jiji = JIJI[jijiIdx];

  // 오자둔시법(五子遁時法): 일간에 따라 자시 천간 결정
  const dayGan = dayPillar[0];
  const hourGanStartMap: Record<string, number> = {
    갑: 0, // 갑자시
    기: 0,
    을: 2, // 병자시
    경: 2,
    병: 4, // 무자시
    신: 4,
    정: 6, // 경자시
    임: 6,
    무: 8, // 임자시
    계: 8,
  };

  const startGanIdx = hourGanStartMap[dayGan] ?? 0;
  const hourGanIdx = (startGanIdx + jijiIdx) % 10;
  const gan = CHEONGAN[hourGanIdx];

  return `${gan}${jiji}`;
}

/**
 * 일간(日干) 추출 — 일주의 첫 번째 글자
 */
export function getIlgan(dayPillar: string): string {
  return dayPillar[0];
}

/**
 * 생년월일시 → 사주 4주 계산
 */
export interface SajuPillars {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string | null;
  ilgan: string;
}

export function getSajuPillars(birthdate: string, birthtime?: string): SajuPillars {
  const date = new Date(birthdate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-indexed → 1-indexed

  const yearPillar = getYearPillar(year);
  const monthPillar = getMonthPillar(year, month);
  const dayPillar = getDayPillar(birthdate);
  const hourPillar = birthtime ? getHourPillar(birthtime, dayPillar) : null;
  const ilgan = getIlgan(dayPillar);

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    ilgan,
  };
}
