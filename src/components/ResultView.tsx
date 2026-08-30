import React, { useRef, useState } from 'react';
import { MBTIAnalysisResult } from '../types';
import { MBTI_DETAILS, RELATIONSHIP_OPTIONS } from '../data/mbtiData';
import { 
  Check, 
  Copy, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

interface ResultViewProps {
  result: MBTIAnalysisResult;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const resultCardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const userDetail = MBTI_DETAILS[result.user_mbti] || MBTI_DETAILS.INTJ;
  const bestDetail = MBTI_DETAILS[result.best_match.mbti as any] || MBTI_DETAILS.ENFP;
  const worstDetail = MBTI_DETAILS[result.worst_match.mbti as any] || MBTI_DETAILS.ESFP;
  const partnerDetail = result.partner_match ? MBTI_DETAILS[result.partner_match.partner_mbti as any] : null;

  const currentRelOpt = RELATIONSHIP_OPTIONS.find(o => o.id === result.relationship_type) || RELATIONSHIP_OPTIONS[3];

  React.useEffect(() => {
    if (result.partner_match && result.partner_match.score >= 80) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#1A1A1A', '#2D6A4F', '#A4161A', '#888888'],
        });
      } catch (e) {
        // ignore
      }
    }
  }, [result]);

  const handleCopyText = () => {
    const textToCopy = `[MBTI Lab. Editorial Compatibility Dossier]
● Persona: ${result.user_mbti} (${userDetail.nameKr} • ${userDetail.alias})
● Overview: ${result.summary}
● Core Traits: ${result.traits.join(', ')}

✨ [BEST MATCH • SYNERGY] ${result.best_match.mbti} (${bestDetail.nameKr})
- Reason: ${result.best_match.reason}
- Synergy Point: ${result.best_match.synergy_point}

⚠️ [WORST MATCH • TENSION] ${result.worst_match.mbti} (${worstDetail.nameKr})
- Conflict Factor: ${result.worst_match.conflict_point}
- Resolution Protocol: ${result.worst_match.solution_tip}

${result.partner_match ? `🎯 [1:1 DYAD ASSESSMENT (${result.partner_match.partner_mbti})]
- Index Score: ${result.partner_match.score} / 100 (${result.partner_match.chemistry_title})
- Summary: ${result.partner_match.summary}` : ''}

💡 [ACTIONABLE COMMUNICATION PROTOCOL]
${result.action_guides.map((g, i) => `[0${i + 1}] ${g}`).join('\n')}

— Published by Google AI Studio Gemini`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadImage = async () => {
    if (!resultCardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(resultCardRef.current, {
        quality: 0.98,
        backgroundColor: '#F9F9F7',
      });
      const link = document.createElement('a');
      link.download = `MBTI_Lab_Dossier_${result.user_mbti}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Action Bar (Editorial Header Strip) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] p-4 sm:p-5 border border-[#E5E5E1]">
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
            Dossier Complete
          </span>
          <span className="text-[#CCC]">|</span>
          <span className="text-[11px] font-serif italic text-[#555]">
            {currentRelOpt.label}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopyText}
            id="copy-result-btn"
            className="inline-flex items-center px-3.5 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase text-[#1A1A1A] bg-white border border-[#E5E5E1] hover:border-[#1A1A1A] transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-[#1A1A1A]" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5 text-[#666]" />
                Copy Text
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            id="download-image-btn"
            className="inline-flex items-center px-4 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase text-white bg-[#1A1A1A] hover:bg-black transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {isExporting ? 'Exporting...' : 'Export Card (PNG)'}
          </button>

          <button
            type="button"
            onClick={onReset}
            id="re-analyze-btn"
            className="inline-flex items-center px-3.5 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] hover:text-[#1A1A1A] border border-[#E5E5E1] hover:border-[#1A1A1A] bg-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            New
          </button>
        </div>
      </div>

      {/* Capture Area / Publication Sheet */}
      <div 
        ref={resultCardRef} 
        className="bg-[#FFFFFF] p-6 sm:p-10 md:p-12 border border-[#E5E5E1] space-y-8 text-[#1A1A1A]"
      >
        {/* 1. Publication Hero Block */}
        <div className="border-b border-[#E5E5E1] pb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase mb-3 text-[#888] font-bold">
                Analysis Output 001_F • Dossier
              </p>
              <h2 className="text-7xl sm:text-9xl font-serif font-normal leading-[0.85] tracking-tighter text-[#1A1A1A] mb-4">
                {result.user_mbti}
              </h2>
              <div className="flex items-baseline space-x-3">
                <p className="text-xl sm:text-2xl italic font-serif text-[#444]">
                  {userDetail.nameKr}
                </p>
                <span className="text-xs font-serif italic text-[#888]">
                  "{userDetail.alias}"
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#888]">
                  • {userDetail.categoryName}
                </span>
              </div>
              <p className="text-sm font-serif italic text-[#555] max-w-2xl mt-3 leading-relaxed">
                "{result.summary}"
              </p>
            </div>

            {/* Trait Dimension Chips */}
            <div className="flex flex-wrap gap-2 md:justify-end md:max-w-[280px]">
              <span className="px-3 py-1 bg-[#1A1A1A] text-white text-[10px] uppercase font-bold tracking-wider">
                {result.user_mbti[0] === 'E' ? 'Extraverted' : 'Introverted'}
              </span>
              <span className="px-3 py-1 bg-[#1A1A1A] text-white text-[10px] uppercase font-bold tracking-wider">
                {result.user_mbti[1] === 'S' ? 'Observant (S)' : 'Intuitive (N)'}
              </span>
              <span className="px-3 py-1 bg-[#1A1A1A] text-white text-[10px] uppercase font-bold tracking-wider">
                {result.user_mbti[2] === 'T' ? 'Thinking (T)' : 'Feeling (F)'}
              </span>
              <span className="px-3 py-1 bg-[#1A1A1A] text-white text-[10px] uppercase font-bold tracking-wider">
                {result.user_mbti[3] === 'J' ? 'Judging (J)' : 'Prospecting (P)'}
              </span>

              {result.traits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 border border-[#E5E5E1] text-[#333] text-[10px] uppercase font-medium bg-[#F9F9F7]"
                >
                  #{trait}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2. 1:1 Dyad Assessment (If present) */}
        {result.partner_match && partnerDetail && (
          <div className="p-6 sm:p-8 border-2 border-[#1A1A1A] bg-[#F9F9F7] relative">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-6 pb-4 border-b border-[#E5E5E1]">
              <div>
                <p className="text-[10px] tracking-[0.25em] font-bold uppercase text-[#888] mb-1">
                  Dyad Compatibility Index
                </p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
                    {result.user_mbti} <span className="font-serif italic font-normal text-[#666]">&</span> {result.partner_match.partner_mbti}
                  </h3>
                  <span className="text-xs font-serif italic text-[#555]">
                    ({partnerDetail.nameKr})
                  </span>
                </div>
              </div>

              {/* Score Stamp */}
              <div className="flex items-baseline space-x-2 border border-[#1A1A1A] px-4 py-2 bg-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#666]">Index Score</span>
                <span className="text-3xl font-serif font-bold text-[#1A1A1A] leading-none">
                  {result.partner_match.score}
                </span>
                <span className="text-xs font-serif italic text-[#888]">/ 100</span>
              </div>
            </div>

            <p className="text-sm font-serif italic text-[#333] leading-relaxed mb-6 bg-white p-4 border border-[#E5E5E1]">
              "{result.partner_match.summary}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 border border-[#D1E8DC] bg-[#EBF7F1]">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2D6A4F] mb-3">
                  Dyad Synergies • 긍정 시너지
                </p>
                <ul className="space-y-2 text-xs text-[#1B4332]">
                  {result.partner_match.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#2D6A4F] mt-1 shrink-0" />
                      <span className="leading-relaxed">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 border border-[#FADAD8] bg-[#FFF1F0]">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A4161A] mb-3">
                  Dyad Friction Points • 주의 갈등
                </p>
                <ul className="space-y-2 text-xs text-[#660708]">
                  {result.partner_match.friction_points.map((fr, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#A4161A] mt-1 shrink-0" />
                      <span className="leading-relaxed">{fr}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dyad Communication Guide */}
            <div className="mt-6 pt-5 border-t border-[#E5E5E1]">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#888] mb-3">
                1:1 Communication Protocol
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {result.partner_match.communication_guide.map((tip, i) => (
                  <div key={i} className="p-3 border border-[#E5E5E1] bg-white text-[#333]">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#888] block mb-1">
                      Guideline 0{i + 1}
                    </span>
                    <p className="leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Best vs Worst Match Grid (High Editorial Aesthetic Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Best Match Card (Sage / Emerald Editorial Block) */}
          <section className="bg-[#EBF7F1] p-6 sm:p-8 border border-[#D1E8DC] flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2D6A4F] mb-6 block">
                Best Match • Synergy
              </span>
              <div className="flex items-baseline space-x-3 mb-4">
                <h3 className="text-4xl sm:text-5xl font-serif text-[#1B4332]">
                  {result.best_match.mbti}
                </h3>
                <span className="text-sm font-serif italic text-[#2D6A4F]">
                  {bestDetail.nameKr}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#2D6A4F] opacity-90 mb-6 font-serif">
                {result.best_match.reason}
              </p>
            </div>

            <div className="mt-auto pt-6 border-t border-[#D1E8DC]">
              <p className="text-[10px] uppercase font-bold mb-1 text-[#1B4332] tracking-wider">
                Synergy Point
              </p>
              <p className="text-xs font-medium italic text-[#2D6A4F] leading-relaxed">
                {result.best_match.synergy_point}
              </p>
            </div>
          </section>

          {/* Worst Match Card (Vintage Rose / Crimson Editorial Block) */}
          <section className="bg-[#FFF1F0] p-6 sm:p-8 border border-[#FADAD8] flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A4161A] mb-6 block">
                Worst Match • Tension
              </span>
              <div className="flex items-baseline space-x-3 mb-4">
                <h3 className="text-4xl sm:text-5xl font-serif text-[#660708]">
                  {result.worst_match.mbti}
                </h3>
                <span className="text-sm font-serif italic text-[#A4161A]">
                  {worstDetail.nameKr}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#A4161A] opacity-90 mb-6 font-serif">
                {result.worst_match.conflict_point || result.worst_match.reason}
              </p>
            </div>

            <div className="mt-auto pt-6 border-t border-[#FADAD8]">
              <p className="text-[10px] uppercase font-bold mb-1 text-[#660708] tracking-wider">
                Conflict Resolution Protocol
              </p>
              <p className="text-xs font-medium italic text-[#A4161A] leading-relaxed">
                {result.worst_match.solution_tip}
              </p>
            </div>
          </section>
        </div>

        {/* 4. Action Guidelines & Editorial Stamp Footer */}
        <footer className="mt-8 pt-8 border-t border-[#E5E5E1] flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold mb-3 text-[#888] tracking-widest">
              Actionable Communication Protocol • 관계 개선 3단계 실천 지침
            </p>
            <ul className="text-xs font-medium space-y-2.5 text-[#333]">
              {result.action_guides.map((guide, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#1A1A1A] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">
                    <strong className="font-serif italic mr-1">0{idx + 1}.</strong> {guide}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Circular Stamp / Seal Button */}
          <div 
            onClick={handleDownloadImage}
            title="Download Publication Card"
            className="w-28 h-28 sm:w-32 sm:h-32 border border-[#1A1A1A] rounded-full flex items-center justify-center p-3 text-center group cursor-pointer hover:bg-[#1A1A1A] hover:text-white transition-all shrink-0 self-center md:self-auto"
          >
            <p className="text-[10px] font-bold leading-tight uppercase tracking-tight">
              Share Your<br />Lab Result
            </p>
          </div>
        </footer>

        {/* Card Footer Stamp metadata */}
        <div className="flex items-center justify-between text-[10px] text-[#888] uppercase tracking-wider pt-4 border-t border-[#E5E5E1]">
          <span>Google AI Studio MBTI Lab • Gemini Model Synthesized</span>
          <span>{new Date().toLocaleDateString('ko-KR')} Edition</span>
        </div>
      </div>

      {/* Bottom Floating CTA */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center px-8 py-4 text-[11px] font-bold tracking-[0.15em] uppercase text-white bg-[#1A1A1A] hover:bg-black transition-all shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Analyze Another Persona
        </button>
      </div>
    </div>
  );
};

