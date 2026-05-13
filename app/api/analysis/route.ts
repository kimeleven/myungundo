import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSajuPillars } from '@/lib/saju';

/**
 * POST /api/analysis
 * 입력을 받아 AnalysisJob(PENDING)을 생성하고 jobId만 반환.
 * 실제 분석은 로컬 myungundo-agent 데몬이 polling으로 처리.
 * 웹은 GET /api/analysis/[jobId]로 결과 polling.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, birthdate, birthtime, gender } = body as {
      name?: string;
      birthdate: string;
      birthtime?: string;
      gender: string;
    };

    if (!birthdate || !gender) {
      return NextResponse.json(
        { error: '생년월일과 성별은 필수입니다.' },
        { status: 400 }
      );
    }

    // 사주 미리 계산 — 에이전트는 이 결과를 그대로 사용 (web/agent 양쪽 일관성)
    const sajuInfo = getSajuPillars(birthdate, birthtime);

    const job = await prisma.analysisJob.create({
      data: {
        name: name || null,
        birthdate,
        birthtime: birthtime || null,
        gender,
        sajuInfo: sajuInfo as unknown as Prisma.InputJsonValue,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ jobId: job.id, status: 'PENDING' });
  } catch (err) {
    console.error('[analysis POST error]', err);
    const message = err instanceof Error ? err.message : '서버 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
