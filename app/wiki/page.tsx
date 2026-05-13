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

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  BASICS: '천간, 지지, 오행, 음양 등 명리학의 기본 개념',
  SAJU: '년주, 월주, 일주, 시주와 사주팔자 해석법',
  SINSAL: '도화살, 역마살, 귀문관살 등 신살 해석',
  UNSE: '대운, 세운, 월운의 흐름과 운세 읽는 법',
  GUNGAP: '궁합 보는 법, 합충형파해 원리',
  SEO: '12띠별 특성과 운세',
};

export default async function WikiPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selectedCategory = searchParams.category || 'ALL';

  const articles = await prisma.wikiArticle.findMany({
    where: selectedCategory !== 'ALL' ? { category: selectedCategory as 'BASICS' | 'SAJU' | 'SINSAL' | 'UNSE' | 'GUNGAP' | 'SEO' } : undefined,
    orderBy: { updatedAt: 'desc' },
    select: { id: true, slug: true, title: true, category: true, updatedAt: true },
  });

  const categories = ['ALL', ...Object.keys(CATEGORY_LABELS)];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">
          <span className="text-amber-400">명리학</span> 위키
        </h1>
        <p className="text-slate-400">수천 년의 동양 철학, 명리학의 핵심 개념을 체계적으로 정리했습니다.</p>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={cat === 'ALL' ? '/wiki' : `/wiki?category=${cat}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat === 'ALL' ? '전체' : CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </div>

      {/* 카테고리 설명 */}
      {selectedCategory !== 'ALL' && CATEGORY_DESCRIPTIONS[selectedCategory] && (
        <div className="mb-6 p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-slate-400">
          {CATEGORY_DESCRIPTIONS[selectedCategory]}
        </div>
      )}

      {/* 문서 목록 */}
      {articles.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <div className="text-4xl mb-4">📚</div>
          <p>아직 등록된 위키 문서가 없습니다.</p>
          <p className="text-sm mt-2">곧 명리학 지식이 채워질 예정입니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/wiki/${article.slug}`}
              className="card flex items-center justify-between hover:border-amber-400/50 transition-all group"
            >
              <div>
                <span className="text-xs font-medium text-amber-400/80 mb-1 block">
                  {CATEGORY_LABELS[article.category]}
                </span>
                <h3 className="font-medium text-slate-200 group-hover:text-amber-400 transition-colors">
                  {article.title}
                </h3>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <span className="text-xs text-slate-500">
                  {new Date(article.updatedAt).toLocaleDateString('ko-KR')}
                </span>
                <span className="block text-amber-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 카테고리 그리드 (전체 탭일 때) */}
      {selectedCategory === 'ALL' && articles.length === 0 && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Link
              key={key}
              href={`/wiki?category=${key}`}
              className="card hover:border-amber-400/50 transition-all group"
            >
              <h3 className="font-semibold text-slate-200 group-hover:text-amber-400 transition-colors mb-2">
                {label}
              </h3>
              <p className="text-xs text-slate-500">{CATEGORY_DESCRIPTIONS[key]}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
