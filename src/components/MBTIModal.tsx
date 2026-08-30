import React, { useState } from 'react';
import { MBTI_CATEGORIES, MBTI_DETAILS } from '../data/mbtiData';
import { MBTIType } from '../types';
import { X, ArrowRight } from 'lucide-react';

interface MBTIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: MBTIType) => void;
}

export const MBTIModal: React.FC<MBTIModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const allTypes: MBTIType[] = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
  ];

  const filteredTypes = selectedCategory === 'all'
    ? allTypes
    : allTypes.filter(t => MBTI_DETAILS[t].category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-[#FFFFFF] max-w-3xl w-full max-h-[88vh] flex flex-col border border-[#E5E5E1] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E5E5E1] flex items-center justify-between bg-[#F9F9F7]">
          <div>
            <p className="text-[10px] tracking-[0.25em] font-bold uppercase text-[#888] mb-1">
              Index of 16 Archetypes • Typology Catalog
            </p>
            <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-[#1A1A1A]">
              16가지 MBTI 성격 유형 도감
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#888] hover:text-[#1A1A1A] border border-transparent hover:border-[#E5E5E1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-6 py-3 border-b border-[#E5E5E1] flex items-center gap-2 overflow-x-auto scrollbar-none bg-white">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
              selectedCategory === 'all'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-[#666] border-[#E5E5E1] hover:border-[#1A1A1A]'
            }`}
          >
            All Archetypes (16)
          </button>
          {MBTI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                selectedCategory === cat.id
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-[#666] border-[#E5E5E1] hover:border-[#1A1A1A]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* MBTI Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-3 scrollbar-thin bg-[#F9F9F7]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredTypes.map((type) => {
              const detail = MBTI_DETAILS[type];
              return (
                <div
                  key={type}
                  className="p-4 border border-[#E5E5E1] hover:border-[#1A1A1A] transition-all bg-white flex flex-col justify-between group cursor-pointer"
                  onClick={() => {
                    onSelectType(type);
                    onClose();
                  }}
                >
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="flex items-baseline space-x-2">
                        <span className="font-serif font-bold text-lg text-[#1A1A1A]">
                          {detail.type}
                        </span>
                        <span className="text-xs font-serif italic text-[#555]">
                          {detail.nameKr}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#888] font-serif italic">
                        "{detail.alias}"
                      </span>
                    </div>

                    <p className="text-xs font-serif text-[#666] line-clamp-2 leading-relaxed mb-3">
                      {detail.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#F0F0EE]">
                    <div className="flex flex-wrap gap-1">
                      {detail.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 border border-[#E5E5E1] bg-[#F9F9F7] text-[#555] uppercase">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Select <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E5E1] bg-white flex items-center justify-between text-xs text-[#888]">
          <span className="font-serif italic">카드를 클릭하면 분석 대상 MBTI로 즉시 지정됩니다.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-[11px] uppercase font-bold tracking-widest text-[#1A1A1A] border border-[#E5E5E1] hover:border-[#1A1A1A] bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

