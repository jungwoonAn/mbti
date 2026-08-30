import React, { useEffect, useState } from 'react';
import { MBTIType, RelationshipContext } from '../types';
import { MBTI_DETAILS } from '../data/mbtiData';
import { Check } from 'lucide-react';

interface LoadingStateProps {
  userMbti: MBTIType;
  relationshipType: RelationshipContext;
  partnerMbti?: MBTIType | '';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  userMbti,
  relationshipType,
  partnerMbti,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    '고유 성향 데이터 매트릭스 로딩 (Subject Matrix)',
    '최상(Synergy) 및 긴장(Tension) 궁합 매칭 분석 (Dyad Assessment)',
    '상황별 맞춤형 시너지 & 갈등 해소 지침 도출 (Actionable Protocol)',
    '심층 에디토리얼 분석 리포트 조판 중 (Report Typesetting)',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  const userDetail = MBTI_DETAILS[userMbti];

  return (
    <div className="min-h-[460px] flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-[#E5E5E1]">
      {/* Editorial Laboratory Badge */}
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#888] block mb-2">
          Synthesis in Progress • 001_F
        </span>
        <div className="w-16 h-16 border-2 border-[#1A1A1A] flex items-center justify-center mx-auto mb-4 relative">
          <span className="font-serif italic text-2xl font-bold text-[#1A1A1A]">
            {userMbti.substring(0, 2)}
          </span>
          <div className="absolute -bottom-2 -right-2 bg-[#1A1A1A] text-white text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-widest">
            {userMbti}
          </div>
        </div>
      </div>

      {/* Main Status Text */}
      <h3 className="text-2xl sm:text-3xl font-serif italic font-semibold text-[#1A1A1A] tracking-tight mb-2">
        Compiling Psychological Dossier...
      </h3>
      <p className="text-xs sm:text-sm text-[#666] max-w-md mx-auto mb-8 font-serif leading-relaxed">
        Google AI Studio Gemini가 <span className="font-bold text-[#1A1A1A]">{userMbti}</span> ({userDetail.nameKr})
        {partnerMbti && <> 및 <span className="font-bold text-[#1A1A1A]">{partnerMbti}</span></>}의
        심리학적 궁합과 소통 프로토콜을 정밀 분석하고 있습니다.
      </p>

      {/* Editorial Step Tracker */}
      <div className="w-full max-w-md space-y-2 text-left">
        {steps.map((step, idx) => {
          const isActive = idx === stepIndex;
          const isDone = idx < stepIndex;

          return (
            <div
              key={idx}
              className={`p-3 border transition-all duration-200 flex items-center justify-between ${
                isActive
                  ? 'border-[#1A1A1A] bg-[#F5F5F2] text-[#1A1A1A]'
                  : isDone
                  ? 'border-[#E5E5E1] bg-[#FFFFFF] text-[#888]'
                  : 'border-[#EEE] bg-white/40 text-[#BBB]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-[9px] tracking-widest uppercase font-bold w-12">
                  [0{idx + 1}]
                </span>
                <span className={`text-xs font-medium ${isActive ? 'font-bold text-[#1A1A1A]' : ''}`}>
                  {step}
                </span>
              </div>

              {isDone ? (
                <span className="text-[10px] font-bold text-[#1A1A1A] flex items-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              ) : isActive ? (
                <span className="w-2 h-2 bg-[#1A1A1A] animate-pulse" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
