import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/analysis/[jobId]
 * 분석 작업 상태와 결과 조회. 웹 프론트엔드가 polling으로 호출.
 * status:
 *   PENDING    — 에이전트 대기 중
 *   PROCESSING — 에이전트가 처리 중
 *   DONE       — 완료, result 포함
 *   ERROR      — 실패, error 메시지 포함
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    const job = await prisma.analysisJob.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        status: true,
        result: true,
        error: true,
        sajuInfo: true,
        createdAt: true,
        startedAt: true,
        finishedAt: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job 없음' }, { status: 404 });
    }

    if (job.status === 'DONE' && job.result) {
      // result + sajuInfo 합쳐서 반환
      const fullResult = {
        ...(job.result as Record<string, unknown>),
        sajuInfo: job.sajuInfo,
      };
      return NextResponse.json({
        id: job.id,
        status: job.status,
        result: fullResult,
        finishedAt: job.finishedAt,
      });
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      error: job.error,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
    });
  } catch (err) {
    console.error('[analysis GET error]', err);
    const message = err instanceof Error ? err.message : '서버 오류';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
