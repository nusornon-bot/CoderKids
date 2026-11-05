import React, { useState } from 'react';
import { PRIVACY_CARDS } from '../../data/learningData.ts';
import { ShieldCheck, ShieldAlert, CheckCircle, HelpCircle, RotateCcw } from 'lucide-react';

interface SafeSharingGameProps {
  onComplete: () => void;
  addPoints: (points: number) => void;
}

export const SafeSharingGame: React.FC<SafeSharingGameProps> = ({ onComplete, addPoints }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredCards, setAnsweredCards] = useState<{ [id: string]: { userChoice: 'private' | 'public'; isCorrect: boolean } }>({});
  const [gameFinished, setGameFinished] = useState(false);

  const currentCard = PRIVACY_CARDS[currentIndex];

  const handleClassify = (choice: 'private' | 'public') => {
    if (!currentCard || answeredCards[currentCard.id]) return;

    const isCorrect = choice === currentCard.category;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      addPoints(10);
    }

    setAnsweredCards((prev) => ({
      ...prev,
      [currentCard.id]: { userChoice: choice, isCorrect },
    }));

    if (currentIndex + 1 >= PRIVACY_CARDS.length) {
      setGameFinished(true);
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnsweredCards({});
    setGameFinished(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">มินิเกมฝึกคิด</span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            เกมจำแนก: ข้อมูลส่วนบุคคล (PDPA) vs ข้อมูลที่เปิดเผยได้
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            พิจารณาการ์ดแต่ละใบ แล้วตัดสินใจว่าควรเก็บเป็นความลับ หรือสามารถแชร์สู่สาธารณะได้
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">
            คะแนน: <span className="text-emerald-600 text-sm tabular-nums font-bold">{score}</span> / {PRIVACY_CARDS.length}
          </div>
          <button
            onClick={resetGame}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="เริ่มเกมใหม่"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!gameFinished ? (
        <div className="mt-8 max-w-xl mx-auto">
          {/* Card to Classify */}
          <div className="p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center shadow-sm relative">
            <div className="text-xs text-slate-400 mb-2 font-mono tabular-nums">
              การ์ดที่ {currentIndex + 1} จาก {PRIVACY_CARDS.length}
            </div>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <HelpCircle className="w-7 h-7" />
            </div>

            <h4 className="text-lg font-bold text-slate-900 mb-2">{currentCard.title}</h4>
            <p className="text-sm text-slate-600 mb-6">{currentCard.description}</p>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/80">
              <button
                onClick={() => handleClassify('private')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200 font-semibold text-sm rounded-xl transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>ข้อมูลส่วนบุคคล (ห้ามเปิดเผย)</span>
              </button>

              <button
                onClick={() => handleClassify('public')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 border border-emerald-200 font-semibold text-sm rounded-xl transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ข้อมูลทั่วไป (แชร์ได้อย่างปลอดภัย)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center p-8 bg-emerald-50/60 border border-emerald-200 rounded-2xl max-w-lg mx-auto">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 mb-2">ทำภารกิจสำเร็จแล้ว!</h4>
          <p className="text-sm text-slate-600 mb-4">
            คุณตอบถูก {score} จากทั้งหมด {PRIVACY_CARDS.length} ข้อ ได้รับคะแนนสะสม {score * 10} แต้ม
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-2.5 bg-emerald-600 text-white font-medium text-sm rounded-xl hover:bg-emerald-700 transition-colors"
          >
            เล่นซ้ำอีกรอบ
          </button>
        </div>
      )}

      {/* Review list */}
      <div className="mt-10">
        <h4 className="text-sm font-semibold text-slate-800 mb-4">สรุปและคำอธิบายตามหลัก PDPA</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRIVACY_CARDS.map((card) => {
            const answer = answeredCards[card.id];
            return (
              <div
                key={card.id}
                className={`p-4 rounded-xl border transition-all text-xs ${
                  answer
                    ? answer.isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-semibold text-slate-900">{card.title}</div>
                  <span
                    className={`font-semibold shrink-0 ${
                      card.category === 'private' ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {card.category === 'private' ? '● ข้อมูลส่วนบุคคล' : '● แชร์ได้ปลอดภัย'}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{card.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
