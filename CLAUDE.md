# 명운도(命運圖) — 개발 룰

## 기술 스택
- Next.js 14 App Router
- Prisma + NeonDB (PostgreSQL)
- Anthropic Claude API
- Vercel 배포
- Tailwind CSS

## 커밋 신원
kimeleven <kimeleven@users.noreply.github.com>

## 개발 원칙
1. DB 변경은 반드시 Prisma migrate/push만 사용
2. 수정 후 항상 push
3. env 파일 절대 커밋 금지 (.env, .env.local)
4. Claude API 프롬프트 변경 시 wiki에 사유 기록
5. 모든 텍스트는 한국어 전용
6. Server Component와 Client Component 명확히 구분 ('use client' 지시어 필수)

## 디렉토리 구조
```
app/
  layout.tsx          — 루트 레이아웃 (네비게이션 포함)
  page.tsx            — 메인 홈
  analysis/
    page.tsx          — 사주 분석 (Client Component)
  wiki/
    page.tsx          — 위키 목록 (Server Component)
    [slug]/
      page.tsx        — 위키 상세 (Server Component)
  horoscope/
    page.tsx          — 운세 페이지 (Client Component)
  api/
    analysis/
      route.ts        — 사주 분석 API
lib/
  prisma.ts           — Prisma 클라이언트 싱글턴
  claude.ts           — Anthropic 클라이언트
  saju.ts             — 만세력 계산 유틸
prisma/
  schema.prisma       — DB 스키마
```

## 환경 변수 (필수)
- `DATABASE_URL` — NeonDB 커넥션 풀링 URL
- `DIRECT_DATABASE_URL` — NeonDB 다이렉트 URL (Prisma migrate용)
- `ANTHROPIC_API_KEY` — Claude API 키

## 배포 절차
1. `.env.local` 생성 (`.env.example` 참고)
2. `npm install`
3. `npm run db:generate` (Prisma 클라이언트 생성)
4. `npm run db:push` (DB 스키마 적용)
5. `npm run dev` (로컬 개발)
6. Vercel에 환경 변수 설정 후 배포
