export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type MBTICategory = 'analysts' | 'diplomats' | 'sentinels' | 'explorers';

export type RelationshipContext = 'love' | 'work' | 'friend' | 'general';

export interface MBTIInfo {
  type: MBTIType;
  nameKr: string;
  alias: string;
  category: MBTICategory;
  categoryName: string;
  description: string;
  tags: string[];
  color: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    accent: string;
  };
}

export interface BestMatchInfo {
  mbti: string;
  reason: string;
  synergy_point: string;
}

export interface WorstMatchInfo {
  mbti: string;
  reason: string;
  conflict_point: string;
  solution_tip: string;
}

export interface PartnerMatchDetail {
  partner_mbti: string;
  score: number; // 0 ~ 100
  chemistry_title: string;
  summary: string;
  strengths: string[];
  friction_points: string[];
  communication_guide: string[];
}

export interface MBTIAnalysisResult {
  user_mbti: MBTIType;
  relationship_type?: RelationshipContext;
  summary: string;
  traits: string[];
  best_match: BestMatchInfo;
  worst_match: WorstMatchInfo;
  partner_match?: PartnerMatchDetail;
  action_guides: string[];
}

export interface AnalysisRequest {
  user_mbti: MBTIType;
  relationship_type?: RelationshipContext;
  partner_mbti?: MBTIType | '';
}
