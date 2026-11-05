import React, { useState } from 'react';
import { DID_YOU_KNOW_DATA } from '../data/learningData.ts';
import { DidYouKnowItem } from '../types/index.ts';
import {
  Lightbulb,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  ShieldCheck,
  Cpu,
  Smartphone,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DidYouKnowSectionProps {
  addPoints: (points: number, reason: string) => void;
}

export const DidYouKnowSection: React.FC<DidYouKnowSectionProps> = ({ addPoints }) => {
  const [selectedTopic, setSelectedTopic] = useState<number | 'all'>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(DID_YOU_KNOW_DATA[0].id);
  const [userAnswers, setUserAnswers] = useState<{ [cardId: string]: number }>({});
  const [awardedCardIds, setAwardedCardIds] = useState<string[]>([]);

  const filteredItems = DID_YOU_KNOW_DATA.filter((item) => {
    if (selectedTopic === 'all') return true;
    return item.topicNumber === selectedTopic;
  });

  const handleSelectOption = (card: DidYouKnowItem, optionIdx: number) => {
    if (userAnswers[card.id] !== undefined) return;

    setUserAnswers((prev) => ({
      ...prev,
      [card.id]: optionIdx,
    }));

    if (optionIdx === card.interactiveChallenge.correctIndex && !awardedCardIds.includes(card.id)) {
      setAwardedCardIds((prev) => [...prev, card.id]);
      addPoints(10, `ตอบคำถามชวนคิด: ${card.headline}`);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }
  };

  const toggleExpand = (cardId: string) => {
    setExpandedCardId((prev) => (prev === cardId ? null : cardId));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>เกร็ดความรู้ &amp; คำถามกระตุกต่อมคิด</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            เรื่องน่ารู้ชวนคิด เกี่ยวกับบทเรียนทั้ง 4 หัวข้อ (Did You Know?)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            เรื่องราวมหัศจรรย์เบื้องหลังโลกเทคโนโลยี ประวัติศาสตร์อัลกอริทึม และเทคนิคฝึกคิดวิเคราะห์
          </p>
        </div>

        {/* Topic Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs self-start sm:self-auto font-medium">
          <button
            onClick={() => setSelectedTopic('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedTopic === 'all'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ทั้งหมด ({DID_YOU_KNOW_DATA.length})
          </button>
          <button
            onClick={() => setSelectedTopic(1)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedTopic === 1
                ? 'bg-white text-emerald-700 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. ความปลอดภัย
          </button>
          <button
            onClick={() => setSelectedTopic(2)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedTopic === 2
                ? 'bg-white text-sky-700 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. การคิดเชิงตรรกะ
          </button>
          <button
            onClick={() => setSelectedTopic(3)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedTopic === 3
                ? 'bg-white text-indigo-700 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Scratch &amp; Micro:bit
          </button>
          <button
            onClick={() => setSelectedTopic(4)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedTopic === 4
                ? 'bg-white text-purple-700 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. แสดงผลงาน &amp; สะท้อนคิด
          </button>
        </div>
      </div>

      {/* 2. Interactive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => {
          const isExpanded = expandedCardId === item.id;
          const userChoice = userAnswers[item.id];
          const hasAnswered = userChoice !== undefined;
          const isCorrect = userChoice === item.interactiveChallenge.correctIndex;

          const topicColors: Record<number, { border: string; bg: string; text: string; icon: any }> = {
            1: { border: 'border-emerald-200', bg: 'bg-emerald-50/60', text: 'text-emerald-700', icon: ShieldCheck },
            2: { border: 'border-sky-200', bg: 'bg-sky-50/60', text: 'text-sky-700', icon: Cpu },
            3: { border: 'border-indigo-200', bg: 'bg-indigo-50/60', text: 'text-indigo-700', icon: Smartphone },
            4: { border: 'border-purple-200', bg: 'bg-purple-50/60', text: 'text-purple-700', icon: Star },
          };

          const style = topicColors[item.topicNumber];
          const TopicIcon = style.icon;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                isExpanded ? 'border-indigo-300 shadow-md ring-1 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className={`inline-flex items-center gap-1.5 font-semibold ${style.text}`}>
                    <TopicIcon className="w-3.5 h-3.5" />
                    <span>หัวข้อที่ {item.topicNumber}: {item.topicTitle}</span>
                  </div>

                  {awardedCardIds.includes(item.id) && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> พิชิตแล้ว (+10)
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  💡 {item.headline}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80">
                  {item.fact}
                </p>

                {/* Deep Dive & Reflection when expanded */}
                {isExpanded && (
                  <div className="space-y-4 pt-2 text-xs sm:text-sm">
                    {/* Deep Dive */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-slate-600 leading-relaxed">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <BrainCircuit className="w-4 h-4 text-indigo-600" />
                        <span>เรื่องเจาะลึก (Deep Dive):</span>
                      </div>
                      <p>{item.deepDive}</p>
                    </div>

                    {/* Think Prompt */}
                    <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1 text-indigo-900">
                      <div className="font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>คำถามชวนคิดต่อยอด:</span>
                      </div>
                      <p className="text-xs leading-relaxed italic">{item.thinkPrompt}</p>
                    </div>

                    {/* Interactive Challenge */}
                    <div className="pt-2 border-t border-slate-200 space-y-3">
                      <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                        <span>คำถามท้าทายความเข้าใจ (+10 แต้ม)</span>
                        <span className="text-[11px] text-slate-400">เลือก 1 คำตอบ</span>
                      </div>

                      <div className="text-xs text-slate-700 font-medium">
                        {item.interactiveChallenge.question}
                      </div>

                      <div className="space-y-2">
                        {item.interactiveChallenge.options.map((opt, optIdx) => {
                          const isOptionSelected = userChoice === optIdx;
                          let optStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';

                          if (hasAnswered) {
                            if (optIdx === item.interactiveChallenge.correctIndex) {
                              optStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium';
                            } else if (isOptionSelected && !isCorrect) {
                              optStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                            } else {
                              optStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={hasAnswered}
                              onClick={() => handleSelectOption(item, optIdx)}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${optStyle}`}
                            >
                              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div
                          className={`p-3 rounded-xl text-xs border ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-rose-50 border-rose-200 text-rose-900'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className="font-bold">{isCorrect ? 'ตอบถูกต้อง! ' : 'ยังไม่ถูกต้อง '}</span>
                              <span>{item.interactiveChallenge.explanation}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Expand Toggle Footer */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <span>{isExpanded ? 'ย่อเนื้อหา' : 'อ่านต่อ & ตอบคำถามชวนคิด'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <span className="text-[11px] text-slate-400">
                  {hasAnswered ? 'ทำแบบฝึกแล้ว' : 'มีแบบฝึกชวนคิด'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
