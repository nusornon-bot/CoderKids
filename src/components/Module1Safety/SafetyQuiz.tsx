import React, { useState } from 'react';
import { SAFETY_QUIZ } from '../../data/learningData.ts';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

interface SafetyQuizProps {
  onComplete: () => void;
  addPoints: (points: number) => void;
}

export const SafetyQuiz: React.FC<SafetyQuizProps> = ({ onComplete, addPoints }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [hasAwardedPoints, setHasAwardedPoints] = useState(false);

  const handleSelect = (qId: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optIdx,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    SAFETY_QUIZ.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    if (!hasAwardedPoints) {
      addPoints(score * 10);
      setHasAwardedPoints(true);
    }
    onComplete();
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();
  const allAnswered = SAFETY_QUIZ.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">แบบทดสอบท้ายบทเรียน</span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            แบบประเมินความรู้: ความปลอดภัยดิจิทัล &amp; PDPA
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            ทดสอบความรู้ความเข้าใจ 5 ข้อ เพื่อรับตราความรู้และเกียรติบัตร
          </p>
        </div>

        {submitted && (
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-semibold text-indigo-700">
              ได้คะแนน: <span className="text-base font-bold tabular-nums">{score}</span> / {SAFETY_QUIZ.length}
            </div>
            <button
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="ทำแบบทดสอบใหม่"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-6">
        {SAFETY_QUIZ.map((q, index) => {
          const userAns = selectedAnswers[q.id];
          const isCorrect = userAns === q.correctAnswer;

          return (
            <div key={q.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 flex items-start gap-2">
                <span className="text-indigo-600 font-bold tabular-nums">{index + 1}.</span>
                <span>{q.question}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isOptionSelected = userAns === optIdx;
                  let optStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/60';

                  if (submitted) {
                    if (optIdx === q.correctAnswer) {
                      optStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium';
                    } else if (isOptionSelected && !isCorrect) {
                      optStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                    } else {
                      optStyle = 'bg-white border-slate-200 text-slate-400 opacity-70';
                    }
                  } else if (isOptionSelected) {
                    optStyle = 'bg-indigo-50 border-indigo-400 text-indigo-900 font-medium ring-1 ring-indigo-400';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-2 ${optStyle}`}
                    >
                      <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`p-3 rounded-lg text-xs border ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold">{isCorrect ? 'ตอบถูกต้อง! ' : 'ยังไม่ถูกต้อง '}</span>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              allAnswered
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>ส่งคำตอบและตรวจคะแนน</span>
          </button>
        ) : (
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>ตรวจคำตอบเรียบร้อยแล้ว ได้รับคะแนนสะสมแล้ว</span>
          </div>
        )}
      </div>
    </div>
  );
};
