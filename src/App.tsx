import React, { useState } from 'react';
import { MBTIType, RelationshipContext, MBTIAnalysisResult } from './types';
import { Header } from './components/Header';
import { MBTISelector } from './components/MBTISelector';
import { RelationshipSelector } from './components/RelationshipSelector';
import { PartnerSelector } from './components/PartnerSelector';
import { LoadingState } from './components/LoadingState';
import { ResultView } from './components/ResultView';
import { MBTIModal } from './components/MBTIModal';
import { ArrowRight, AlertCircle } from 'lucide-react';

export default function App() {
  const [userMbti, setUserMbti] = useState<MBTIType | null>('INTJ');
  const [relationshipType, setRelationshipType] = useState<RelationshipContext>('love');
  const [partnerMbti, setPartnerMbti] = useState<MBTIType | ''>('ENFP');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MBTIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const handleAnalyze = async () => {
    if (!userMbti) {
      setError('본인의 MBTI를 먼저 선택해 주세요.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/mbti/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_mbti: userMbti,
          relationship_type: relationshipType,
          partner_mbti: partnerMbti || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`분석 요청 실패 (상태 코드: ${response.status})`);
      }

      const data: MBTIAnalysisResult = await response.json();
      setResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error analyzing MBTI:', err);
      setError('분석 도중 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFromGuide = (type: MBTIType) => {
    setUserMbti(type);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-white">
      {/* Top Editorial Navigation */}
      <Header 
        onOpenGuide={() => setIsGuideOpen(true)}
        onReset={result ? handleReset : undefined}
        isResult={!!result}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-[#FFF1F0] border border-[#FADAD8] text-[#A4161A] flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-[#A4161A] shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-[10px] uppercase tracking-widest font-bold text-[#A4161A] hover:underline ml-3"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. Loading View */}
        {isLoading ? (
          <LoadingState 
            userMbti={userMbti!}
            relationshipType={relationshipType}
            partnerMbti={partnerMbti}
          />
        ) : result ? (
          /* 2. Result View */
          <ResultView 
            result={result}
            onReset={handleReset}
          />
        ) : (
          /* 3. Input & Configuration Form View */
          <div className="space-y-8 animate-fadeIn">
            {/* Editorial Hero Banner */}
            <div className="bg-[#FFFFFF] p-8 sm:p-12 border border-[#E5E5E1] text-[#1A1A1A] relative">
              <div className="max-w-2xl">
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#888] block mb-3">
                  Google AI Studio Gemini Laboratory • Vol. 04
                </span>

                <h1 className="text-3xl sm:text-5xl font-serif font-normal leading-[1.1] tracking-tight mb-4">
                  나와 가장 잘 맞는 MBTI와<br />
                  <span className="italic font-normal text-[#555]">
                    현명한 관계 소통의 지혜
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-[#666] leading-relaxed font-serif">
                  16가지 성격 유형의 인지 기능과 심리학적 특성을 기반으로 최상의 궁합(Best)과 긴장 요소(Worst)를 엄밀하게 진단하고 실천 가능한 대화 프로토콜을 제안합니다.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-[#E5E5E1] text-[11px] text-[#666] uppercase tracking-wider font-bold">
                  <span>• Romantic / Workplace / Social Context</span>
                  <span>• Actionable Communication Protocol</span>
                  <span>• 1:1 Dyad Assessment</span>
                </div>
              </div>
            </div>

            {/* Step 1: User MBTI Selector */}
            <MBTISelector 
              selected={userMbti}
              onSelect={(type) => {
                setUserMbti(type);
                if (error) setError(null);
              }}
            />

            {/* Step 2: Relationship Context Selector */}
            <RelationshipSelector 
              selected={relationshipType}
              onSelect={setRelationshipType}
            />

            {/* Step 3: Optional Partner MBTI Selector */}
            <PartnerSelector 
              partnerMbti={partnerMbti}
              onSelect={setPartnerMbti}
              userMbti={userMbti}
            />

            {/* Submit Action Button */}
            <div className="pt-2 pb-6">
              <button
                type="button"
                id="submit-analysis-btn"
                onClick={handleAnalyze}
                disabled={!userMbti}
                className="w-full py-5 px-8 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white bg-[#1A1A1A] hover:bg-black transition-all flex items-center justify-center space-x-3 group disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                <span>
                  {userMbti ? `Generate Compatibility Dossier for ${userMbti}` : 'Select Persona to Begin'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-[11px] text-[#888] font-serif italic mt-3">
                Google AI Studio Gemini가 실시간으로 구조화된 심리 분석 리포트를 조판합니다.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* MBTI Guide Modal */}
      <MBTIModal 
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectType={handleSelectFromGuide}
      />

      {/* Editorial Footer */}
      <footer className="w-full bg-[#FFFFFF] border-t border-[#E5E5E1] py-8 text-center text-[11px] text-[#888]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="uppercase tracking-widest font-bold text-[#1A1A1A]">
            MBTI Lab. • Editorial Psychological Compendium
          </span>
          <span className="font-serif italic">
            Powered by Google AI Studio Gemini
          </span>
        </div>
      </footer>
    </div>
  );
}

