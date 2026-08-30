import React from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onReset?: () => void;
  isResult?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide, onReset, isResult }) => {
  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#E5E5E1] sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        <div 
          onClick={onReset}
          className="flex items-center space-x-4 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center font-serif text-base italic font-bold group-hover:bg-[#333] transition-colors">
            M
          </div>
          <div>
            <h1 className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#888] mb-0.5">
              Google AI Studio • Gemini
            </h1>
            <div className="flex items-baseline space-x-2">
              <p className="text-xl sm:text-2xl font-serif italic font-semibold tracking-tight text-[#1A1A1A]">
                MBTI Lab.
              </p>
              <span className="text-[11px] text-[#666] font-medium tracking-tight hidden sm:inline">
                성격 궁합 & 소통 연구소
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isResult && (
            <button
              onClick={onReset}
              id="header-reset-btn"
              className="inline-flex items-center px-3.5 py-2 text-[11px] font-bold tracking-[0.1em] uppercase text-[#1A1A1A] border border-[#E5E5E1] bg-white hover:border-[#1A1A1A] hover:bg-[#F9F9F7] transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2 text-[#666]" />
              New Analysis
            </button>
          )}

          <button
            onClick={onOpenGuide}
            id="header-guide-btn"
            className="inline-flex items-center px-3.5 py-2 text-[11px] font-bold tracking-[0.1em] uppercase text-white bg-[#1A1A1A] hover:bg-black transition-all"
            title="16개 MBTI 도감 보기"
          >
            <BookOpen className="w-3.5 h-3.5 mr-2" />
            <span>Index Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};

