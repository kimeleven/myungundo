import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

const CATEGORY_LABELS: Record<string, string> = {
  BASICS: '기초이론',
  SAJU: '사주팔자',
  SINSAL: '신살',
  UNSE: '운세흐름',
  GUNGAP: '궁합',
  SEO: '띠별운세',
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await prisma.wikiArticle.findUnique({
    where: { slug: params.slug },
    select: { title: true, category: true },
  });

  if (!article) return { title: '문서를 찾을 수 없습니다' };

  return {
    title: `${article.title} | 명운도 명리학 위키`,
    description: `명운도 명리학 위키 - ${CATEGORY_LABELS[article.category]} 카테고리의 ${article.title} 문서`,
  };
}

export default async function WikiArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.wikiArticle.findUnique({
    where: { slug: params.slug },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/wiki" className="hover:text-amber-400 transition-colors">
          위키
        </Link>
        <span>›</span>
        <Link
          href={`/wiki?category=${article.category}`}
          className="hover:text-amber-400 transition-colors"
        >
          {CATEGORY_LABELS[article.category]}
        </Link>
        <span>›</span>
        <span className="text-slate-300">{article.title}</span>
      </nav>

      {/* 헤더 */}
      <div className="mb-8">
        <span className="inline-block text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-full px-3 py-1 mb-4">
          {CATEGORY_LABELS[article.category]}
        </span>
        <h1 className="text-3xl font-bold text-slate-100 mb-3">{article.title}</h1>
        <p className="text-xs text-slate-500">
          최종 수정: {new Date(article.updatedAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* 구분선 */}
      <div className="border-t border-slate-800 mb-8" />

      {/* 본문 */}
      <article
        className="prose-wiki text-slate-300 leading-8 space-y-4"
        dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
      />

      {/* 하단 네비게이션 */}
      <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between items-center">
        <Link
          href="/wiki"
          className="text-sm text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
        >
          ← 위키 목록으로
        </Link>
        <Link
          href={`/wiki?category=${article.category}`}
          className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
        >
          {CATEGORY_LABELS[article.category]} 더 보기
        </Link>
      </div>
    </div>
  );
}

/**
 * 마크다운 스타일 텍스트를 간단히 HTML로 변환
 * 실제 프로덕션에서는 remark/rehype 사용 권장
 */
function formatContent(content: string): string {
  return content
    // 제목
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-slate-200 mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-amber-400 mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-slate-100 mt-8 mb-4">$1</h1>')
    // 굵게
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
    // 기울임
    .replace(/\*(.+?)\*/g, '<em class="text-slate-300">$1</em>')
    // 인라인 코드
    .replace(/`(.+?)`/g, '<code class="bg-slate-800 text-amber-300 px-1 rounded text-sm">$1</code>')
    // 수평선
    .replace(/^---$/gm, '<hr class="border-slate-700 my-6">')
    // 목록
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-slate-400">$1</li>')
    // 단락
    .replace(/\n\n/g, '</p><p class="text-slate-300 leading-8">')
    // 래핑
    .replace(/^(?!<[h|l|h])/gm, '')
    .replace(/^/, '<p class="text-slate-300 leading-8">')
    .replace(/$/, '</p>');
}
