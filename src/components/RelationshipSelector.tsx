import React from 'react';
import { RelationshipContext } from '../types';
import { Heart, Briefcase, Users, Compass } from 'lucide-react';

interface RelationshipSelectorProps {
  selected: RelationshipContext;
  onSelect: (context: RelationshipContext) => void;
}

export const RelationshipSelector: React.FC<RelationshipSelectorProps> = ({
  selected,
  onSelect,
}) => {
  const options: Array<{
    id: RelationshipContext;
    label: string;
    subLabel: string;
    tag: string;
    icon: React.ElementType;
  }> = [
    {
      id: 'love',
      label: 'Romance & Chemistry',
      subLabel: '연애 & 로맨스 • 감정 교감 및 연인 케미',
      tag: 'CONTEXT 01',
      icon: Heart,
    },
    {
      id: 'work',
      label: 'Workplace Dynamics',
      subLabel: '직장 & 동료 • 업무 스타일 및 협업 시너지',
      tag: 'CONTEXT 02',
      icon: Briefcase,
    },
    {
      id: 'friend',
      label: 'Social Circle',
      subLabel: '친구 & 사교 • 티키타카와 일상적 유대감',
      tag: 'CONTEXT 03',
      icon: Users,
    },
    {
      id: 'general',
      label: 'General Archetype',
      subLabel: '전반적 성향 • 기본 심리 메커니즘 & 소통',
      tag: 'CONTEXT 04',
      icon: Compass,
    },
  ];

  return (
    <div className="bg-[#FFFFFF] p-6 sm:p-8 border border-[#E5E5E1]">
      <div className="mb-6 pb-4 border-b border-[#E5E5E1]">
        <p className="text-[10px] tracking-[0.25em] font-bold uppercase text-[#888] mb-1">
          Section 02 • Environmental Context
        </p>
        <h2 className="text-xl sm:text-2xl font-serif italic font-semibold text-[#1A1A1A] tracking-tight">
          관계 분석 맥락 설정
        </h2>
        <p className="text-xs text-[#666] mt-0.5">
          궁합을 분석하고 싶은 구체적인 관계 맥락을 선택하면 더 정확한 맞춤 팁이 생성됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              id={`rel-tab-${opt.id}`}
              onClick={() => onSelect(opt.id)}
              className={`text-left p-4 sm:p-5 border transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#1A1A1A] border-l-4 border-l-[#1A1A1A] bg-[#F5F5F2] text-[#1A1A1A]'
                  : 'border-[#E5E5E1] border-l-4 border-l-transparent bg-white hover:border-[#1A1A1A] hover:border-l-[#1A1A1A] text-[#666]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[9px] uppercase tracking-widest font-bold ${
                  isSelected ? 'text-[#1A1A1A]' : 'text-[#888]'
                }`}>
                  {opt.tag}
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#1A1A1A]' : 'text-[#888]'}`} />
              </div>

              <div>
                <h3 className={`text-sm font-serif font-bold ${isSelected ? 'text-[#1A1A1A]' : 'text-[#333]'}`}>
                  {opt.label}
                </h3>
                <p className="text-xs text-[#666] mt-1 leading-relaxed">
                  {opt.subLabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

