import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '명운도 | 명리학 위키 기반 AI 사주 분석',
  description: '명리학 지식 체계를 기반으로 AI가 당신의 사주를 깊이 있게 풀어드립니다. 사주팔자, 운세, 궁합, 명리학 위키까지.',
  keywords: '사주, 명리학, 운세, 사주팔자, 사주분석, AI사주, 명운도',
  openGraph: {
    title: '명운도 | 명리학 위키 기반 AI 사주 분석',
    description: '명리학 지식 체계를 기반으로 AI가 당신의 사주를 깊이 있게 풀어드립니다.',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-50">
          <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-amber-400 text-2xl">命</span>
              <span className="text-xl font-semibold tracking-tight">명운도</span>
            </Link>
            <ul className="flex items-center gap-6 text-sm font-medium text-slate-300">
              <li>
                <Link href="/analysis" className="hover:text-amber-400 transition-colors">
                  사주분석
                </Link>
              </li>
              <li>
                <Link href="/wiki" className="hover:text-amber-400 transition-colors">
                  위키
                </Link>
              </li>
              <li>
                <Link href="/horoscope" className="hover:text-amber-400 transition-colors">
                  운세
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>

        <footer className="border-t border-slate-800 mt-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center text-slate-500 text-sm">
            <p>© 2026 명운도(命運圖). 명리학 위키 기반 AI 사주 분석 서비스.</p>
            <p className="mt-1 text-xs">본 서비스의 운세 결과는 참고용이며, 실제 의사결정에 맹목적으로 활용하지 마세요.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
