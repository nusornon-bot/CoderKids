import React, { useState } from 'react';
import { NETIQUETTE_SCENARIOS } from '../../data/learningData.ts';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface NetiquetteScenariosProps {
  addPoints: (points: number) => void;
}

export const NetiquetteScenarios: React.FC<NetiquetteScenariosProps> = ({ addPoints }) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(NETIQUETTE_SCENARIOS[0].id);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [scenarioId: string]: number }>({});
  const [awardedScenarios, setAwardedScenarios] = useState<string[]>([]);

  const activeScenario = NETIQUETTE_SCENARIOS.find((s) => s.id === activeScenarioId) || NETIQUETTE_SCENARIOS[0];
  const chosenOptionIndex = selectedAnswers[activeScenario.id];

  const handleSelectOption = (idx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [activeScenario.id]: idx,
    }));

    if (activeScenario.options[idx].isAppropriate && !awardedScenarios.includes(activeScenario.id)) {
      addPoints(10);
      setAwardedScenarios((prev) => [...prev, activeScenario.id]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
      <div className="mb-6 pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">สถานการณ์จำลอง</span>
        <h3 className="text-xl font-bold text-slate-900 mt-0.5">
          มารยาทดิจิทัล &amp; พลเมืองดิจิทัลรู้เท่าทัน (Digital Citizenship)
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          วิเคราะห์ 4 สถานการณ์จริงในชีวิตประจำวันเพื่อตัดสินใจอย่างมีจริยธรรม เคารพสิทธิผู้อื่น และต่อต้าน Cyberbullying
        </p>
      </div>

      {/* Scenario navigation tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {NETIQUETTE_SCENARIOS.map((sc, index) => {
          const isSolved = awardedScenarios.includes(sc.id);
          return (
            <button
              key={sc.id}
              onClick={() => setActiveScenarioId(sc.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeScenarioId === sc.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>เคส {index + 1}: {sc.title.split(':')[1]?.trim() || sc.title}</span>
              {isSolved && <span className="ml-1.5 text-emerald-300">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Active Scenario Card */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
        <div>
          <h4 className="text-base font-bold text-slate-900 mb-2">{activeScenario.title}</h4>
          <p className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-200 leading-relaxed">
            {activeScenario.situation}
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            หากเป็นคุณ จะเลือกปฏิบัติตามแนวทางใด?
          </label>

          <div className="space-y-2.5">
            {activeScenario.options.map((opt, idx) => {
              const isSelected = chosenOptionIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl text-xs md:text-sm border transition-all ${
                    isSelected
                      ? opt.isAppropriate
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                        : 'bg-rose-50 border-rose-300 text-rose-900 font-medium'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback display */}
        {chosenOptionIndex !== undefined && (
          <div
            className={`p-4 rounded-xl text-xs md:text-sm border transition-all ${
              activeScenario.options[chosenOptionIndex].isAppropriate
                ? 'bg-emerald-100/50 border-emerald-300 text-emerald-900'
                : 'bg-rose-100/50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {activeScenario.options[chosenOptionIndex].isAppropriate ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold">
                  {activeScenario.options[chosenOptionIndex].isAppropriate ? 'คำตอบที่เหมาะสม: ' : 'ข้อเสนอแนะ: '}
                </span>
                <span>{activeScenario.options[chosenOptionIndex].feedback}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
