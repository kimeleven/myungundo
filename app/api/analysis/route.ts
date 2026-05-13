import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@/lib/claude';
import { prisma } from '@/lib/prisma';
import { getSajuPillars } from '@/lib/saju';

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

    // 사주 계산
    const sajuInfo = getSajuPillars(birthdate, birthtime);

    const prompt = `당신은 한국의 명리학 전문가입니다. 다음 사주 정보를 바탕으로 깊이 있고 공감 가는 풀이를 해주세요.

【의뢰인 정보】
- 이름: ${name || '익명'}
- 생년월일: ${birthdate}
- 태어난 시간: ${birthtime || '미상'}
- 성별: ${gender}

【사주 (四柱)】
- 년주(年柱): ${sajuInfo.yearPillar}
- 월주(月柱): ${sajuInfo.monthPillar}
- 일주(日柱): ${sajuInfo.dayPillar}
- 시주(時柱): ${sajuInfo.hourPillar || '미정'}
- 일간(日干): ${sajuInfo.ilgan}

【명리학 분석 원칙】
1. 일간(日干)을 중심으로 성격과 기질을 분석하세요
2. 사주 전체의 오행(木火土金水) 강약을 판단하세요
3. 용신(用神) 방향을 제시하고, 어떤 오행이 도움이 되는지 설명하세요
4. 현대인의 일상적 언어로 공감형 표현을 사용하세요
5. 직업/연애/재물/건강 4개 영역별로 구체적 조언을 주세요

다음 JSON 형식으로 응답해주세요. 반드시 유효한 JSON만 반환하세요:
{
  "summary": "종합 분석 (200자 내외, 이 사람의 사주를 관통하는 핵심 특성과 인생 방향)",
  "personality": "성격 분석 (일간 기준 성격, 장점, 주의할 점 - 200자 내외)",
  "career": "직업/사업 조언 (적합한 직업군, 성공 포인트 - 150자 내외)",
  "love": "연애/관계 조언 (연애 스타일, 좋은 파트너 조건 - 150자 내외)",
  "wealth": "재물/금전 조언 (재물운 흐름, 재테크 방향 - 150자 내외)",
  "health": "건강 조언 (약한 오행 기준 주의 건강 영역 - 150자 내외)"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Claude 응답 형식이 올바르지 않습니다.');
    }

    // JSON 파싱
    const rawText = content.text.trim();
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('응답에서 JSON을 찾을 수 없습니다.');
    }

    const parsedResult = JSON.parse(jsonMatch[0]) as {
      summary: string;
      personality: string;
      career: string;
      love: string;
      wealth: string;
      health: string;
    };

    const fullResult = {
      ...parsedResult,
      sajuInfo,
    };

    // DB 저장
    const saved = await prisma.sajuReading.create({
      data: {
        name: name || null,
        birthdate,
        birthtime: birthtime || null,
        gender,
        result: fullResult,
      },
    });

    return NextResponse.json({ result: fullResult, id: saved.id });
  } catch (err) {
    console.error('[analysis API error]', err);
    const message = err instanceof Error ? err.message : '서버 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
