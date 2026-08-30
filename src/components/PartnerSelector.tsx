import React, { useState } from 'react';
import { MBTIType } from '../types';
import { MBTI_DETAILS } from '../data/mbtiData';
import { X } from 'lucide-react';

interface PartnerSelectorProps {
  partnerMbti: MBTIType | '';
  onSelect: (type: MBTIType | '') => void;
  userMbti: MBTIType | null;
}

export const PartnerSelector: React.FC<PartnerSelectorProps> = ({
  partnerMbti,
  onSelect,
  userMbti,
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(!!partnerMbti);

  const allTypes: MBTIType[] = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
  ];

  const handleToggle = () => {
    if (isEnabled) {
      setIsEnabled(false);
      onSelect('');
    } else {
      setIsEnabled(true);
    }
  };

  const partnerDetail = partnerMbti ? MBTI_DETAILS[partnerMbti] : null;

  return (
    <div className="bg-[#FFFFFF] p-6 sm:p-8 border border-[#E5E5E1]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-[0.25em] font-bold uppercase text-[#888] mb-1">
            Section 03 • 1:1 Dyad Comparison (Optional)
          </p>
          <h2 className="text-xl sm:text-2xl font-serif italic font-semibold text-[#1A1A1A] tracking-tight">
            상대방 MBTI 직접 비교
          </h2>
          <p className="text-xs text-[#666] mt-0.5">
            특정 인물과의 1:1 심층 궁합 점수 및 맞춤 소통 팁을 분석할 수 있습니다.
          </p>
        </div>

        {/* Minimalist Switch */}
        <button
          type="button"
          onClick={handleToggle}
          id="partner-toggle-btn"
          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all ${
            isEnabled 
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
              : 'bg-white text-[#888] border-[#E5E5E1] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
          }`}
          role="switch"
          aria-checked={isEnabled}
        >
          {isEnabled ? 'Enabled • ON' : 'Disabled • OFF'}
        </button>
      </div>

      {isEnabled && (
        <div className="mt-6 pt-5 border-t border-[#E5E5E1] animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#888]">
              Select Partner Persona:
            </span>
            {partnerMbti && (
              <button
                type="button"
                onClick={() => onSelect('')}
                className="text-[11px] text-[#666] hover:text-[#1A1A1A] flex items-center gap-1 font-medium"
              >
                <X className="w-3.5 h-3.5" />
                Clear selection
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {allTypes.map((type) => {
              const isSelected = partnerMbti === type;
              const isSameAsUser = userMbti === type;

              return (
                <button
                  key={type}
                  type="button"
                  id={`partner-btn-${type}`}
                  onClick={() => onSelect(type)}
                  className={`p-2.5 text-center border transition-all ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white font-bold border-[#1A1A1A]'
                      : 'bg-white hover:border-[#1A1A1A] border-[#E5E5E1] text-[#1A1A1A]'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-serif font-bold block">{type}</span>
                  {isSameAsUser && (
                    <span className={`text-[8px] tracking-tight uppercase block font-sans ${isSelected ? 'text-white/70' : 'text-[#888]'}`}>
                      (Same)
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {partnerDetail && (
            <div className="mt-4 p-4 border border-[#1A1A1A] bg-[#F9F9F7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-serif font-bold text-white bg-[#1A1A1A] px-2.5 py-1 uppercase tracking-wider">
                  {partnerDetail.type}
                </span>
                <span className="text-xs font-serif italic text-[#1A1A1A]">
                  {partnerDetail.nameKr} ({partnerDetail.alias})
                </span>
                <span className="text-xs text-[#666] hidden sm:inline">
                  — {partnerDetail.description}
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#1A1A1A] px-2 py-0.5 border border-[#1A1A1A]">
                Dyad Target
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

