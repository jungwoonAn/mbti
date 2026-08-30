import React, { useState } from 'react';
import { MBTIType } from '../types';
import { MBTI_DETAILS } from '../data/mbtiData';
import { Check } from 'lucide-react';

interface MBTISelectorProps {
  selected: MBTIType | null;
  onSelect: (type: MBTIType) => void;
  label?: string;
  subLabel?: string;
}

export const MBTISelector: React.FC<MBTISelectorProps> = ({
  selected,
  onSelect,
  label = '나의 MBTI 유형 선택',
  subLabel = '16가지 성격 유형 중 분석하고 싶은 본인의 MBTI를 선택해 주세요',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'ALL (16)' },
    { id: 'analysts', name: 'NT Analysts' },
    { id: 'diplomats', name: 'NF Diplomats' },
    { id: 'sentinels', name: 'SJ Sentinels' },
    { id: 'explorers', name: 'SP Explorers' },
  ];

  const allTypes: MBTIType[] = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
  ];

  const filteredTypes = activeCategory === 'all'
    ? allTypes
    : allTypes.filter(t => MBTI_DETAILS[t].category === activeCategory);

  const selectedDetail = selected ? MBTI_DETAILS[selected] : null;

  return (
    <div className="bg-[#FFFFFF] p-6 sm:p-8 border border-[#E5E5E1] relative">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-6 pb-4 border-b border-[#E5E5E1]">
        <div>
          <p className="text-[10px] tracking-[0.25em] font-bold uppercase text-[#888] mb-1">
            Section 01 • Subject Persona
          </p>
          <h2 className="text-xl sm:text-2xl font-serif italic font-semibold text-[#1A1A1A] tracking-tight">
            {label}
          </h2>
          <p className="text-xs text-[#666] mt-0.5">{subLabel}</p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#1A1A1A] text-white border border-[#1A1A1A]'
                  : 'bg-white text-[#666] border border-[#E5E5E1] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 16 MBTI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2.5 sm:gap-3">
        {filteredTypes.map((type) => {
          const detail = MBTI_DETAILS[type];
          const isSelected = selected === type;

          return (
            <button
              key={type}
              type="button"
              id={`mbti-btn-${type}`}
              onClick={() => onSelect(type)}
              className={`relative text-left p-3.5 sm:p-4 border transition-all duration-150 flex flex-col justify-between group ${
                isSelected
                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white ring-1 ring-[#1A1A1A]'
                  : 'border-[#E5E5E1] bg-[#FFFFFF] hover:border-[#1A1A1A] text-[#1A1A1A]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-lg sm:text-xl font-serif font-bold tracking-tight ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    {type}
                  </span>
                  <span className={`block text-[11px] leading-tight mt-0.5 font-medium ${isSelected ? 'text-white/80' : 'text-[#666]'}`}>
                    {detail.nameKr}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 bg-white text-[#1A1A1A] flex items-center justify-center text-[10px] shrink-0 font-bold">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between">
                <span className={`text-[9px] uppercase tracking-wider font-semibold ${
                  isSelected ? 'text-white/70' : 'text-[#888]'
                }`}>
                  {detail.categoryName}
                </span>
                <span className={`text-[9px] italic font-serif ${
                  isSelected ? 'text-white/70' : 'text-[#888]'
                }`}>
                  {detail.alias}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Preview Banner (Editorial Specimen Card) */}
      {selectedDetail && (
        <div className="mt-6 p-4 sm:p-5 border border-[#1A1A1A] bg-[#F9F9F7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="px-3.5 py-2 bg-[#1A1A1A] text-white text-base font-serif font-bold tracking-widest uppercase">
              {selectedDetail.type}
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-sm font-bold text-[#1A1A1A]">{selectedDetail.nameKr}</span>
                <span className="text-xs font-serif italic text-[#666]">{selectedDetail.alias}</span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-[#888] ml-2">
                  • {selectedDetail.categoryName}
                </span>
              </div>
              <p className="text-xs text-[#555] line-clamp-1 sm:line-clamp-none mt-1 leading-relaxed">
                {selectedDetail.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto shrink-0">
            {selectedDetail.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 border border-[#E5E5E1] bg-white text-[#555] font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

