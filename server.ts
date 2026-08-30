import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Using fallback heuristic analyzer.');
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

// Fallback generator for offline/unconfigured environments
function getFallbackAnalysis(
  user_mbti: string,
  relationship_type?: string,
  partner_mbti?: string
) {
  const relText = relationship_type === 'love' ? '연애' :
                  relationship_type === 'work' ? '직장 동료' :
                  relationship_type === 'friend' ? '친구 관계' : '전반적 대인관계';

  const mbtiMap: Record<string, { best: string; worst: string; traits: string[]; summary: string }> = {
    INTJ: { best: 'ENFP', worst: 'ESFP', traits: ['전략적 비전', '철저한 독립성', '지적 완성도'], summary: '목표 지향적이고 통찰력 높은 합리주의 전략가' },
    INTP: { best: 'ENTJ', worst: 'ESFJ', traits: ['논리적 탐구', '자유로운 사고', '객관적 분석'], summary: '이론과 본질을 파고드는 지적 호기심의 탐구자' },
    ENTJ: { best: 'INTP', worst: 'ISFP', traits: ['강력한 추진력', '전략적 통솔', '체계적 결단'], summary: '원대한 비전을 현실화하는 대담한 리더' },
    ENTP: { best: 'INFJ', worst: 'ISFJ', traits: ['창의적 발상', '지적 유연성', '도전적 변론'], summary: '새로운 가능성과 변화를 주도하는 혁신가' },
    INFJ: { best: 'ENTP', worst: 'ESTP', traits: ['깊은 통찰력', '진정성 있는 공감', '이상적 신념'], summary: '사람의 내면과 미래를 꿰뚫어 보는 혜안의 조력자' },
    INFP: { best: 'ENFJ', worst: 'ESTJ', traits: ['풍부한 감수성', '진솔한 가치관', '따뜻한 중재'], summary: '자신만의 가치를 소중히 품는 낭만적 중재자' },
    ENFJ: { best: 'INFP', worst: 'ISTP', traits: ['탁월한 포용력', '긍정적 동기부여', '조화로운 리더십'], summary: '타인의 성장을 돕고 화합을 이끄는 따뜻한 주인공' },
    ENFP: { best: 'INTJ', worst: 'ISTJ', traits: ['무한한 열정', '풍부한 상상력', '사교적 친화력'], summary: '빛나는 에너지로 영감을 불어넣는 활동가' },
    ISTJ: { best: 'ESFP', worst: 'ENFP', traits: ['철저한 신뢰성', '체계적 계획', '원칙 준수'], summary: '묵묵히 책임을 다하며 질서를 세우는 현실주의자' },
    ISFJ: { best: 'ESTP', worst: 'ENTP', traits: ['헌신적 배려', '섬세한 기억력', '조용한 지지'], summary: '주변을 따뜻하게 보살피는 든든한 수호자' },
    ESTJ: { best: 'ISFP', worst: 'INFP', traits: ['명확한 실행력', '체계적 조직화', '실용적 관리'], summary: '효율과 규율로 결과를 만들어내는 관리자' },
    ESFJ: { best: 'ISTP', worst: 'INTP', traits: ['따뜻한 친화력', '화합 중시', '실질적 봉사'], summary: '주변 사람들을 챙기고 조화를 이루는 사교가' },
    ISTP: { best: 'ESFJ', worst: 'ENFJ', traits: ['침착한 관찰', '즉각적 문제해결', '실용적 장인정신'], summary: '냉철한 상황 판단과 유연한 손재주의 실용주의자' },
    ISFP: { best: 'ESTJ', worst: 'ENTJ', traits: ['온화한 공감', '자유로운 감성', '현재의 조화'], summary: '따뜻한 마음으로 일상의 미를 가꾸는 예술가' },
    ESTP: { best: 'ISFJ', worst: 'INFJ', traits: ['순발력 넘치는 행동', '현실적 문제해결', '위기 대처력'], summary: '짜릿한 도전과 역동적인 행동을 즐기는 활동가' },
    ESFP: { best: 'ISTJ', worst: 'INTJ', traits: ['유쾌한 에너지', '순간의 즐거움', '탁월한 사교성'], summary: '주변에 웃음과 활력을 선물하는 분위기 메이커' },
  };

  const current = mbtiMap[user_mbti] || mbtiMap.INTJ;
  const best = current.best;
  const worst = current.worst;

  const result: any = {
    user_mbti,
    relationship_type: relationship_type || 'general',
    summary: `${user_mbti}는 ${current.summary}입니다. (${relText} 관점)`,
    traits: current.traits,
    best_match: {
      mbti: best,
      reason: `${user_mbti}의 장점과 ${best}의 유연한 에너지가 상호 보완되어 서로의 사각지대를 메꿔줍니다.`,
      synergy_point: `${relText} 상황에서 깊은 신뢰와 자연스러운 의사소통으로 높은 시너지를 창출합니다.`
    },
    worst_match: {
      mbti: worst,
      reason: `판단 기준과 소통 방식(직관 vs 감각, 계획 vs 즉흥)에서 관점 차이로 오해가 발생하기 쉽습니다.`,
      conflict_point: `서로의 우선순위와 스트레스 대처 방식의 현격한 차이`,
      solution_tip: `상대방의 방식을 비판하기보다 있는 그대로의 특성을 인정하고 감정적인 템포를 맞추는 노력이 필요합니다.`
    },
    action_guides: [
      `상대방의 피드백을 들을 때 즉각 반박하기 전 3초간 경청하고 감정을 수용하기`,
      `중요한 결정 시 자신의 기준만 강요하지 말고 상대가 편안한 방식을 먼저 물어보기`,
      `서로 다른 소통 템포를 인정하고 명확하면서도 부드러운 언어로 의도 전달하기`
    ]
  };

  if (partner_mbti) {
    const isBest = partner_mbti === best;
    const isWorst = partner_mbti === worst;
    const score = isBest ? 95 : isWorst ? 52 : 78;
    result.partner_match = {
      partner_mbti,
      score,
      chemistry_title: isBest ? '환상의 상호보완 찰떡궁합' : isWorst ? '이해와 배려가 필요한 성장형 궁합' : '균형 잡힌 시너지 파트너',
      summary: `${user_mbti}와 ${partner_mbti}는 ${relText}에서 서로에게 신선한 자극과 새로운 시각을 주는 관계입니다.`,
      strengths: [
        `각자의 고유한 강점을 인정할 때 놀라운 보완 효과 발생`,
        `서로 다른 관점을 통해 상황을 입체적으로 조망 가능`
      ],
      friction_points: [
        `갈등 상황 시 표현 방식의 차이로 인한 감정적 거리감`,
        `의사결정 속도 및 세부 실행 방식의 템포 차이`
      ],
      communication_guide: [
        `상대방의 의견에 '왜 그렇게 생각해?'보다는 '그런 점도 있겠네'로 시작하기`,
        `갈등이 생겼을 땐 즉각적인 결론보다 각자 생각할 쿨다운 시간 가지기`,
        `서로가 선호하는 소통 채널과 피드백 방식을 사전에 가볍게 공유하기`
      ]
    };
  }

  return result;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// MBTI Analysis endpoint
app.post('/api/mbti/analyze', async (req: Request, res: Response) => {
  const { user_mbti, relationship_type, partner_mbti } = req.body;

  if (!user_mbti) {
    return res.status(400).json({ error: 'user_mbti is required' });
  }

  const ai = getGenAI();
  if (!ai) {
    const fallback = getFallbackAnalysis(user_mbti, relationship_type, partner_mbti);
    return res.json(fallback);
  }

  try {
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
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/mbti/analyze:', error);
    // Fallback on error to keep app interactive
    const fallback = getFallbackAnalysis(user_mbti, relationship_type, partner_mbti);
    return res.json(fallback);
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MBTI Analyzer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
