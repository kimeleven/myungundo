'use client';

import { useState } from 'react';

interface AnalysisResult {
  summary: string;
  personality: string;
  career: string;
  love: string;
  wealth: string;
  health: string;
  sajuInfo: {
    yearPillar: string;
    monthPillar: string;
    dayPillar: string;
    hourPillar: string | null;
    ilgan: string;
  };
}

interface ApiResponse {
  result: AnalysisResult;
  id: string;
}

export default function AnalysisPage() {
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    birthtime: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.birthdate || !formData.gender) {
      setError('생년월일과 성별은 필수 입력 항목입니다.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || '분석 중 오류가 발생했습니다.');
      }

      const data: ApiResponse = await res.json();
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3">
          <span className="text-amber-400">사주</span> 분석
        </h1>
        <p className="text-slate-400">생년월일을 입력하면 AI가 명리학 원칙에 따라 사주를 풀어드립니다.</p>
      </div>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="card mb-8 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            이름 <span className="text-slate-500">(선택)</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="birthdate" className="block text-sm font-medium text-slate-300 mb-2">
            생년월일 <span className="text-red-400">*</span>
          </label>
          <input
            id="birthdate"
            name="birthdate"
            type="date"
            value={formData.birthdate}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="birthtime" className="block text-sm font-medium text-slate-300 mb-2">
            태어난 시간 <span className="text-slate-500">(선택 — 입력 시 시주까지 분석)</span>
          </label>
          <input
            id="birthtime"
            name="birthtime"
            type="time"
            value={formData.birthtime}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-slate-300 mb-2">
            성별 <span className="text-red-400">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="select-field"
          >
            <option value="" disabled>성별을 선택하세요</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              분석 중...
            </span>
          ) : (
            '분석하기'
          )}
        </button>
      </form>

      {/* 결과 영역 */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* 사주 정보 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 text-amber-400">사주팔자 (四柱八字)</h2>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: '년주', value: result.sajuInfo.yearPillar },
                { label: '월주', value: result.sajuInfo.monthPillar },
                { label: '일주', value: result.sajuInfo.dayPillar },
                { label: '시주', value: result.sajuInfo.hourPillar ?? '미정' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">{label}</div>
                  <div className="text-xl font-bold text-slate-100">{value}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate-400">
              일간(日干): <span className="text-amber-400 font-semibold">{result.sajuInfo.ilgan}</span>
            </p>
          </div>

          {/* 종합 분석 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-3 text-amber-400">종합 분석</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{result.summary}</p>
          </div>

          {/* 성격 */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-3 text-amber-400">성격 분석</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{result.personality}</p>
          </div>

          {/* 4개 영역 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: '직업 / 사업', icon: '💼', content: result.career },
              { label: '연애 / 관계', icon: '💕', content: result.love },
              { label: '재물 / 금전', icon: '💰', content: result.wealth },
              { label: '건강', icon: '🌿', content: result.health },
            ].map(({ label, icon, content }) => (
              <div key={label} className="card">
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <span>{icon}</span>
                  <span className="text-slate-200">{label}</span>
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm whitespace-pre-wrap">{content}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-600 mt-4">
            * 본 분석은 명리학 이론을 바탕으로 AI가 생성한 참고용 콘텐츠입니다.
          </p>
        </div>
      )}
    </div>
  );
}
