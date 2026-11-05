import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Bug,
  HelpCircle,
  Database,
  Terminal,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';

interface VisualCodeTracerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardPoints?: (points: number, reason: string) => void;
}

interface TraceStep {
  lineNumber: number;
  explanation: string;
  variables: Record<string, string | number>;
  consoleOutput?: string;
  robotPosition?: number; // 0 to 4
}

interface TraceScenario {
  id: string;
  title: string;
  grade: string;
  codeLines: string[];
  steps: TraceStep[];
}

const TRACE_SCENARIOS: TraceScenario[] = [
  {
    id: 'loop_counter',
    title: '1. ลูปนับก้าวหุ่นยนต์เดินหน้า (While Loop & Counter)',
    grade: 'ป.4 - ว 4.2 ป.4/2',
    codeLines: [
      'step = 0',
      'while step < 4:',
      '    robot.walk_forward()',
      '    step = step + 1',
      'print("ถึงเป้าหมายแล้ว!")',
    ],
    steps: [
      { lineNumber: 1, explanation: 'กำหนดตัวแปรเริ่มต้น step = 0 ในหน่วยความจำ', variables: { step: 0 }, robotPosition: 0 },
      { lineNumber: 2, explanation: 'ตรวจสอบเงื่อนไข step < 4 (0 < 4 เป็นจริง -> เข้าสู่ลูป)', variables: { step: 0 }, robotPosition: 0 },
      { lineNumber: 3, explanation: 'สั่งให้หุ่นยนต์เดินก้าวที่ 1', variables: { step: 0 }, robotPosition: 1, consoleOutput: 'Robot moved step 1' },
      { lineNumber: 4, explanation: 'เพิ่มค่าตัวแปร step ขึ้น 1 (step กลายเป็น 1)', variables: { step: 1 }, robotPosition: 1 },
      { lineNumber: 2, explanation: 'วนลูปกลับมาตรวจ: 1 < 4 เป็นจริง -> ทำงานต่อ', variables: { step: 1 }, robotPosition: 1 },
      { lineNumber: 3, explanation: 'สั่งให้หุ่นยนต์เดินก้าวที่ 2', variables: { step: 1 }, robotPosition: 2, consoleOutput: 'Robot moved step 2' },
      { lineNumber: 4, explanation: 'เพิ่มค่าตัวแปร step ขึ้น 1 (step กลายเป็น 2)', variables: { step: 2 }, robotPosition: 2 },
      { lineNumber: 2, explanation: 'วนลูปกลับมาตรวจ: 2 < 4 เป็นจริง -> ทำงานต่อ', variables: { step: 2 }, robotPosition: 2 },
      { lineNumber: 3, explanation: 'สั่งให้หุ่นยนต์เดินก้าวที่ 3', variables: { step: 2 }, robotPosition: 3, consoleOutput: 'Robot moved step 3' },
      { lineNumber: 4, explanation: 'เพิ่มค่าตัวแปร step ขึ้น 1 (step กลายเป็น 3)', variables: { step: 3 }, robotPosition: 3 },
      { lineNumber: 2, explanation: 'วนลูปกลับมาตรวจ: 3 < 4 เป็นจริง -> ทำงานต่อ', variables: { step: 3 }, robotPosition: 3 },
      { lineNumber: 3, explanation: 'สั่งให้หุ่นยนต์เดินก้าวที่ 4', variables: { step: 3 }, robotPosition: 4, consoleOutput: 'Robot moved step 4' },
      { lineNumber: 4, explanation: 'เพิ่มค่าตัวแปร step ขึ้น 1 (step กลายเป็น 4)', variables: { step: 4 }, robotPosition: 4 },
      { lineNumber: 2, explanation: 'ตรวจเงื่อนไข: 4 < 4 เป็นเท็จ! -> สิ้นสุดการวนลูป', variables: { step: 4 }, robotPosition: 4 },
      { lineNumber: 5, explanation: 'ทำงานบรรทัดสุดท้าย แสดงข้อความสรุปผล', variables: { step: 4 }, robotPosition: 4, consoleOutput: 'ถึงเป้าหมายแล้ว!' },
    ],
  },
  {
    id: 'if_else_grade',
    title: '2. การตัดสินใจเงื่อนไขคะแนนสอบ (If-Else Decision)',
    grade: 'ป.5 - ว 4.2 ป.5/1',
    codeLines: [
      'score = 85',
      'if score >= 80:',
      '    grade = "A (ดีเยี่ยม)"',
      'else:',
      '    grade = "ผ่านเกณฑ์"',
      'print("เกรดของคุณคือ:", grade)',
    ],
    steps: [
      { lineNumber: 1, explanation: 'กำหนดตัวแปร score = 85', variables: { score: 85 } },
      { lineNumber: 2, explanation: 'ตรวจสอบเงื่อนไข score >= 80 (85 >= 80 เป็นจริง!)', variables: { score: 85 } },
      { lineNumber: 3, explanation: 'เนื่องจากเป็นจริง เข้าทำงานในบล็อก if: กำหนด grade = "A (ดีเยี่ยม)"', variables: { score: 85, grade: 'A (ดีเยี่ยม)' } },
      { lineNumber: 6, explanation: 'ข้ามบล็อก else ไปทำงานคำสั่ง print สรุปผลทันที', variables: { score: 85, grade: 'A (ดีเยี่ยม)' }, consoleOutput: 'เกรดของคุณคือ: A (ดีเยี่ยม)' },
    ],
  },
  {
    id: 'variable_swap',
    title: '3. ปริศนาการสลับค่าตัวแปร (Variable Swap)',
    grade: 'ป.6 - ว 4.2 ป.6/1',
    codeLines: [
      'glass_red = "น้ำส้ม"',
      'glass_blue = "นมสด"',
      'temp_glass = glass_red',
      'glass_red = glass_blue',
      'glass_blue = temp_glass',
    ],
    steps: [
      { lineNumber: 1, explanation: 'แก้วแดงบรรจุน้ำส้ม', variables: { glass_red: 'น้ำส้ม' } },
      { lineNumber: 2, explanation: 'แก้วน้ำเงินบรรจุนมสด', variables: { glass_red: 'น้ำส้ม', glass_blue: 'นมสด' } },
      { lineNumber: 3, explanation: 'นำแก้วสำรอง (temp_glass) มาถ่ายน้ำส้มเก็บไว้ก่อน', variables: { glass_red: 'น้ำส้ม', glass_blue: 'นมสด', temp_glass: 'น้ำส้ม' } },
      { lineNumber: 4, explanation: 'เทนมสดจากแก้วน้ำเงินลงแก้วแดง', variables: { glass_red: 'นมสด', glass_blue: 'นมสด', temp_glass: 'น้ำส้ม' } },
      { lineNumber: 5, explanation: 'เทน้ำส้มจากแก้วสำรองลงแก้วน้ำเงิน -> สลับค่าสำเร็จสมบูรณ์!', variables: { glass_red: 'นมสด', glass_blue: 'น้ำส้ม', temp_glass: 'น้ำส้ม' } },
    ],
  },
];

export const VisualCodeTracerModal: React.FC<VisualCodeTracerModalProps> = ({
  isOpen,
  onClose,
  onRewardPoints,
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenario = TRACE_SCENARIOS[selectedScenarioIndex];
  const step = scenario.steps[currentStepIndex] || scenario.steps[0];

  // Auto-play interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev + 1 < scenario.steps.length) {
            soundEffects.play('click');
            return prev + 1;
          } else {
            setIsPlaying(false);
            soundEffects.play('victory');
            if (onRewardPoints) onRewardPoints(20, `เรียนรู้ Trace Code: ${scenario.title}`);
            return prev;
          }
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isPlaying, scenario.steps.length, scenario.title, onRewardPoints]);

  if (!isOpen) return null;

  const handleStepForward = () => {
    if (currentStepIndex + 1 < scenario.steps.length) {
      setCurrentStepIndex((i) => i + 1);
      soundEffects.play('click');
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i) => i - 1);
      soundEffects.play('click');
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    soundEffects.play('click');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-indigo-500/30 text-white shadow-2xl flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-600/30 border border-cyan-400/40 text-cyan-300 shadow-inner">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                  เครื่องมือจำลองการทำงานโค้ดทีละขั้น (Visual Code Tracer) 🔍
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  สสวท. Debugger
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ส่องดูการประมวลผลของคอมพิวเตอร์ทีละบรรทัด พร้อมตารางค่าตัวแปรในหน่วยความจำสด
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {TRACE_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioIndex(idx);
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                selectedScenarioIndex === idx
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{sc.title}</span>
            </button>
          ))}
        </div>

        {/* Main Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto max-h-[70vh]">
          {/* Left: Code Viewer with Step Highlighting */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-mono text-cyan-400 font-bold">Python Code View</span>
                <span>บรรทัดที่ {step.lineNumber}</span>
              </div>

              {/* Code Lines with Highlighting */}
              <div className="font-mono text-xs space-y-1.5 pt-1">
                {scenario.codeLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isActive = step.lineNumber === lineNum;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-200 border-l-4 border-cyan-400 shadow-sm font-bold'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="w-5 text-right text-slate-600 select-none">{lineNum}</span>
                      <pre className="whitespace-pre">{line}</pre>
                      {isActive && <span className="ml-auto text-[10px] text-cyan-400 font-mono">◀ RUNNING</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stepper Control Buttons */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'หยุดชั่วคราว' : 'เล่นอัตโนมัติ'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="เริ่มใหม่ตั้งแต่ต้น"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={handleStepBackward}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-30 transition"
                >
                  ถอยหลัง 1 บรรทัด
                </button>
                <button
                  disabled={currentStepIndex + 1 >= scenario.steps.length}
                  onClick={handleStepForward}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 disabled:opacity-30"
                >
                  <span>ก้าวถัดไป</span>
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Variable Memory Inspector & Visual Simulator */}
          <div className="lg:col-span-6 space-y-4">
            {/* Step Explanation Card */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-1.5">
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>คำอธิบายขั้นตอนที่ {currentStepIndex + 1} / {scenario.steps.length}:</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {step.explanation}
              </p>
            </div>

            {/* Variable Table (RAM Memory Inspector) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Database className="w-4 h-4" />
                <span>หน่วยความจำตัวแปร (Variable Memory State)</span>
              </div>

              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-850 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                      <th className="p-2.5">ชื่อตัวแปร (Variable)</th>
                      <th className="p-2.5">ค่าปัจจุบัน (Current Value)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {Object.entries(step.variables).map(([name, val], i) => (
                      <tr key={i} className="hover:bg-slate-800/50">
                        <td className="p-2.5 text-cyan-300 font-bold">{name}</td>
                        <td className="p-2.5 text-emerald-400 font-black">{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Arena / Output Console */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Terminal className="w-4 h-4" />
                <span>จอผลลัพธ์จำลอง (Console &amp; Simulator)</span>
              </div>

              {step.robotPosition !== undefined && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span>ตำแหน่งหุ่นยนต์:</span>
                  <div className="flex items-center gap-2">
                    {[0, 1, 2, 3, 4].map((pos) => (
                      <div
                        key={pos}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          step.robotPosition === pos
                            ? 'bg-cyan-500 text-slate-950 shadow-md ring-2 ring-cyan-300 animate-bounce'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {step.robotPosition === pos ? '🤖' : pos}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 min-h-[48px] flex items-center">
                {step.consoleOutput ? `> ${step.consoleOutput}` : '> (กำลังประมวลผลคำสั่ง...)'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>💡 การ Trace Code ช่วยให้เด็กประถมเข้าใจลูปและตัวแปรอย่างเป็นรูปธรรม</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
