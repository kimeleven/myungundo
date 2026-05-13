import Anthropic from '@anthropic-ai/sdk';

// API key 형식 자동 감지:
// - `sk-ant-api-...`   : 정식 API 키 → apiKey 옵션 (x-api-key 헤더)
// - `sk-ant-oat-...`   : Claude Code OAuth 토큰 → authToken 옵션 (Authorization: Bearer)
//   주의: OAuth 토큰은 Claude Code 앱 전용 스코프라 일반 API 직접 호출은 401 가능.
//   개발 중 임시 사용. 정식 API 키 발급 후 교체.
const key = process.env.ANTHROPIC_API_KEY || '';
const isOAuth = key.startsWith('sk-ant-oat');

export const anthropic = new Anthropic(
  isOAuth
    ? {
        authToken: key,
        defaultHeaders: { 'anthropic-beta': 'oauth-2025-04-20' },
      }
    : { apiKey: key }
);
