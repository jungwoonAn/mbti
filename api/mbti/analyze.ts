import type { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { getFallbackAnalysis } from '../../src/data/fallbackAnalysis';
import { MBTIType, RelationshipContext } from '../../src/types';

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set on Vercel. Using fallback analyzer.');
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

export default async function handler(req: Request, res: Response) {
  // Enable CORS if accessed externally
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { user_mbti, relationship_type, partner_mbti } = req.body || {};

    if (!user_mbti) {
      return res.status(400).json({ error: 'user_mbti is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      const fallback = getFallbackAnalysis(user_mbti as MBTIType, relationship_type as RelationshipContext, partner_mbti as MBTIType);
      return res.status(200).json(fallback);
    }

    const relContextStr = relationship_type === 'love' ? '연애 및 로맨스 궁합' :
                          relationship_type === 'work' ? '직장 동료 및 비즈니스 협업' :
                          relationship_type === 'friend' ? '친구 및 사교적 교류' : '전반적 대인관계 및 성향';

    const partnerPrompt = partner_mbti
      ? `상대방 MBTI: ${partner_mbti}과의 1:1 상세 궁합 분석도 반드시 포함하세요.`
      : `특정 상대방은 미지정 상태이므로, ${user_mbti} 기준의 전반 분석 및 최상/최악 궁합을 중점으로 분석하세요.`;

    const systemInstruction = `당신은 MBTI(Myers-Briggs Type Indicator) 및 심리학 전문 수석 컨설턴트입니다.
사용자가 MBTI 유형을 입력하면, 해당 유형의 특성을 분석하고 최고의 궁합(Best Match)과 최악의 궁합(Worst Match/갈등 주의) 유형을 선정하여 명확하고 건설적인 조언을 제공합니다.
분석 목적: ${relContextStr}
${partnerPrompt}

[분석 요구사항]
1. user_mbti의 3가지 핵심 특성(traits)과 한 줄 요약(summary)을 날카롭고 매력적이게 작성하세요.
2. best_match: 가장 상성이 좋은 MBTI 유형, 이유, 시너지 효과를 낼 수 있는 구체적 상황(synergy_point).
3. worst_match: 가장 상충하기 쉬운 MBTI 유형, 상충 이유, 주요 갈등 요소(conflict_point), 갈등 시 관계 개선 대화 팁(solution_tip).
4. action_guides: 상극이거나 어려운 유형을 마주했을 때 유용한 구체적인 대화법 및 행동 지침 3가지.
5. partner_mbti가 주어진 경우 partner_match 필드에 0~100점 점수(score), 궁합 한 줄 타이틀(chemistry_title), 요약, 강점(strengths 2~3개), 주의할 점(friction_points 2~3개), 소통 가이드(communication_guide 3개)를 충실하게 생성하세요.

반드시 정해진 JSON 스키마에 맞추어 한국어로 정중하고 전문적이면서도 흥미롭게 응답하세요.`;

    const promptText = `사용자 MBTI: ${user_mbti}
분석 카테고리: ${relContextStr}
${partner_mbti ? `비교 대상 상대방 MBTI: ${partner_mbti}` : ''}

위 정보를 바탕으로 전문적인 MBTI 성향 및 궁합 분석 결과를 JSON으로 출력하세요.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        user_mbti: { type: Type.STRING, description: '사용자의 MBTI 유형' },
        summary: { type: Type.STRING, description: '해당 유형의 명쾌한 한 줄 요약' },
        traits: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '핵심 특성 3가지 키워드/문구',
        },
        best_match: {
          type: Type.OBJECT,
          properties: {
            mbti: { type: Type.STRING, description: '최고의 궁합 MBTI' },
            reason: { type: Type.STRING, description: '잘 맞는 심층 이유' },
            synergy_point: { type: Type.STRING, description: '시너지 효과가 발휘되는 상황 및 포인트' },
          },
          required: ['mbti', 'reason', 'synergy_point'],
        },
        worst_match: {
          type: Type.OBJECT,
          properties: {
            mbti: { type: Type.STRING, description: '최악/주의할 궁합 MBTI' },
            reason: { type: Type.STRING, description: '상충하거나 안 맞는 이유' },
            conflict_point: { type: Type.STRING, description: '주요 갈등 요인' },
            solution_tip: { type: Type.STRING, description: '원활한 소통을 위한 관계 개선 대화 팁' },
          },
          required: ['mbti', 'reason', 'conflict_point', 'solution_tip'],
        },
        partner_match: {
          type: Type.OBJECT,
          properties: {
            partner_mbti: { type: Type.STRING },
            score: { type: Type.INTEGER, description: '1:1 궁합 점수 (0-100)' },
            chemistry_title: { type: Type.STRING, description: '궁합 한줄 별칭/타이틀' },
            summary: { type: Type.STRING, description: '1:1 관계 전반 요약' },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '관계의 강점 2-3가지',
            },
            friction_points: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '갈등 및 마찰 포인트 2-3가지',
            },
            communication_guide: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '1:1 맞춤 소통 팁 3가지',
            },
          },
          required: ['partner_mbti', 'score', 'chemistry_title', 'summary', 'strengths', 'friction_points', 'communication_guide'],
        },
        action_guides: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '관계 개선을 위한 실천 행동 지침 3가지',
        },
      },
      required: ['user_mbti', 'summary', 'traits', 'best_match', 'worst_match', 'action_guides'],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(text);
    parsed.relationship_type = relationship_type || 'general';
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Error in Vercel API /api/mbti/analyze:', error);
    const { user_mbti, relationship_type, partner_mbti } = req.body || {};
    const fallback = getFallbackAnalysis(
      (user_mbti as MBTIType) || 'INTJ',
      (relationship_type as RelationshipContext) || 'love',
      partner_mbti as MBTIType
    );
    return res.status(200).json(fallback);
  }
}
