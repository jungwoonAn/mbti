import { MBTIType, MBTIAnalysisResult, RelationshipContext } from '../types';
import { MBTI_DETAILS } from './mbtiData';

export function getFallbackAnalysis(
  user_mbti: MBTIType,
  relationship_type: RelationshipContext = 'love',
  partner_mbti?: MBTIType
): MBTIAnalysisResult {
  const relText = relationship_type === 'love' ? '연애 및 로맨스' :
                  relationship_type === 'work' ? '직장 동료 및 비즈니스' :
                  relationship_type === 'friend' ? '친구 및 사교' : '전반적 대인관계';

  const mbtiMap: Record<MBTIType, { best: MBTIType; worst: MBTIType; traits: string[]; summary: string }> = {
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
  const bestInfo = MBTI_DETAILS[best] || MBTI_DETAILS.ENFP;
  const worstInfo = MBTI_DETAILS[worst] || MBTI_DETAILS.ESFP;

  const result: MBTIAnalysisResult = {
    user_mbti,
    relationship_type,
    summary: `${user_mbti}는 ${current.summary}입니다. (${relText} 관점)`,
    traits: current.traits,
    best_match: {
      mbti: best,
      reason: `${user_mbti}의 구조적 시각과 ${best}(${bestInfo.nameKr})의 유연하고 역동적인 에너지가 상호 보완되어 시너지를 냅니다.`,
      synergy_point: `${relText} 상황에서 서로의 사각지대를 자연스럽게 채워주며 깊은 신뢰와 발전을 이끌어냅니다.`
    },
    worst_match: {
      mbti: worst,
      reason: `판단 기준과 대화 템포(${user_mbti[1]} vs ${worst[1]}, ${user_mbti[3]} vs ${worst[3]})의 현격한 차이로 인해 초기 오해가 발생하기 쉽습니다.`,
      conflict_point: `서로의 우선순위 설정 방식과 갈등 상황 시 스트레스 해소 속도의 불일치`,
      solution_tip: `${worst}(${worstInfo.nameKr})의 방식을 성급히 판단하지 않고, 서로가 선호하는 소통 리듬을 명확히 확인하는 배려가 필요합니다.`
    },
    action_guides: [
      `상대방의 의견에 즉각 반박하기 전 3초간 경청하고 핵심 감정을 먼저 인정하기`,
      `중요한 결정 시 자신의 기준만 고집하지 않고 상대방이 편안한 방식을 사전에 확인하기`,
      `서로 다른 소통 템포를 인정하고 핵심적인 의도를 명확하고 부드러운 언어로 전달하기`
    ]
  };

  if (partner_mbti) {
    const isBest = partner_mbti === best;
    const isWorst = partner_mbti === worst;
    const score = isBest ? 96 : isWorst ? 54 : 79;
    result.partner_match = {
      partner_mbti,
      score,
      chemistry_title: isBest ? '환상의 상호보완 찰떡궁합' : isWorst ? '이해와 존중이 필요한 성장형 궁합' : '균형 잡힌 시너지 파트너',
      summary: `${user_mbti}와 ${partner_mbti}는 ${relText}에서 서로에게 신선한 자극과 새로운 시각을 주는 발전적인 관계입니다.`,
      strengths: [
        `각자의 고유한 강점과 관점을 인정할 때 놀라운 상호 보완 효과 발휘`,
        `서로 다른 사고 패턴을 통해 상황을 다각도에서 입체적으로 조망 가능`
      ],
      friction_points: [
        `갈등 상황 시 표현 방식(직설 vs 완곡)의 차이로 인한 감정적 거리감`,
        `의사결정 속도 및 세부 실행 방식의 템포 차이`
      ],
      communication_guide: [
        `상대방의 의견에 '왜 그렇게 생각해?'보다는 '그런 관점도 있겠네'로 시작하기`,
        `갈등이 생겼을 땐 즉각적인 결론보다 각자 생각할 쿨다운 시간 가지기`,
        `서로가 선호하는 소통 채널과 피드백 방식을 사전에 편안하게 공유하기`
      ]
    };
  }

  return result;
}
