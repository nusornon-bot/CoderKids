import React, { useState, useEffect } from 'react';
import {
  X,
  Bug,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  RefreshCw,
  Code2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AudioNarratorButton } from './AudioNarratorButton.tsx';

interface BugChallenge {
  id: string;
  title: string;
  scenario: string;
  codeSnippet: string[];
  buggyLineIndex: number;
  explanation: string;
  fixOptions: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const DAILY_BUG_CHALLENGES: BugChallenge[] = [
  {
    id: 'bug_1',
    title: 'ภารกิจที่ 1: บั๊กลูปไม่สิ้นสุด (Infinite Loop Freeze)',
    scenario: 'สไปรต์น้องแมวตั้งใจจะเดินนับแต้ม 1 ถึง 5 ก้าว แต่พอกดธงเขียว โปรแกรมค้างและน้องแมวเดินไม่ยอมหยุด!',
    codeSnippet: [
      '1. when green flag clicked',
      '2. set [steps v] to (1)',
      '3. repeat until <(steps) = (5)>',
      '4.   move (10) steps',
      '5.   change [steps v] by (0)  <-- ทำไม steps ไม่เพิ่ม?',
      '6. end',
      '7. say [ถึงเป้าหมายแล้ว!] for (2) secs',
    ],
    buggyLineIndex: 4,
    explanation: 'ตัวแปร steps ถูกบวกเพิ่มด้วย 0 เสมอ ทำให้ค่า steps ไม่เคยเท่ากับ 5 ลูปจึงทำงานไม่รู้จบ (Infinite Loop)',
    fixOptions: [
      {
        text: 'เปลี่ยนคำสั่งในบรรทัดที่ 5 เป็น change [steps v] by (1)',
        isCorrect: true,
        feedback: 'ถูกต้องยอดเยี่ยม! เมื่อตัวแปร steps เพิ่มทีละ 1 จะนับถึง 5 แล้วออกจากลูปได้ตามเป้าหมาย',
      },
      {
        text: 'เปลี่ยน move (10) steps เป็น move (0) steps',
        isCorrect: false,
        feedback: 'ยังไม่ถูกต้อง การเปลี่ยนระยะก้าวไม่ได้แก้ปัญหาค่าตัวแปร steps ที่ไม่เพิ่มขึ้น',
      },
      {
        text: 'ลบบรรทัด repeat until ออกทั้งหมด',
        isCorrect: false,
        feedback: 'ไม่ถูกต้อง เพราะโปรแกรมต้องการทำซ้ำ 5 ครั้งตามขั้นตอน',
      },
    ],
  },
  {
    id: 'bug_2',
    title: 'ภารกิจที่ 2: บั๊กตรวจเงื่อนไขคะแนนสอบผ่าน (Logic Condition Inversion)',
    scenario: 'ครูเขียนโปรแกรมตรวจคะแนนสอบ หากได้ 50 คะแนนขึ้นไปถือว่า "สอบผ่าน" แต่นักเรียนที่ได้ 80 กลับขึ้นว่า "สอบไม่ผ่าน"!',
    codeSnippet: [
      '1. when I receive [checkScore v]',
      '2. ask [ใส่คะแนนที่ได้:] and wait',
      '3. set [myScore v] to (answer)',
      '4. if <(myScore) < (50)> then',
      '5.   say [ยินดีด้วย คุณสอบผ่าน!] for (2) secs',
      '6. else',
      '7.   say [เสียใจด้วย คุณยังไม่ผ่าน] for (2) secs',
    ],
    buggyLineIndex: 4,
    explanation: 'เงื่อนไขในบรรทัดที่ 4 ใช้เครื่องหมายน้อยกว่า (<) ทำให้คะแนนต่ำกว่า 50 กลายเป็นบอกว่าสอบผ่าน สลับความหมายกัน!',
    fixOptions: [
      {
        text: 'สลับคำพูด หรือเปลี่ยนเงื่อนไขเป็น if <(myScore) > (49)> then [ยินดีด้วย คุณสอบผ่าน!]',
        isCorrect: true,
        feedback: 'ถูกต้อง! การใช้เครื่องหมายเปรียบเทียบผิดทิศทาง เป็นหนึ่งในข้อผิดพลาดเชิงตรรกะ (Logic Error) ที่พบบ่อยที่สุด',
      },
      {
        text: 'เปลี่ยนตัวเลข 50 เป็น 100',
        isCorrect: false,
        feedback: 'ยังไม่ถูก หากเปลี่ยนเป็น 100 จะยิ่งทำให้ตรรกะคะแนนผิดเพี้ยนไปอีก',
      },
      {
        text: 'เปลี่ยนบล็อก say เป็น play sound',
        isCorrect: false,
        feedback: 'เสียงไม่เกี่ยวข้องกับการตัดสินเงื่อนไขตรรกะ',
      },
    ],
  },
  {
    id: 'bug_3',
    title: 'ภารกิจที่ 3: บั๊กลืมรีเซ็ตตัวแปรนับเหรียญ (Variable Initialization)',
    scenario: 'เกมเก็บเหรียญ เมื่อเล่นจบด่าน 1 ได้ 10 แต้ม พอเริ่มเล่นด่าน 2 แต้มกลับเริ่มนับต่อจาก 10 แทนที่จะเป็น 0!',
    codeSnippet: [
      '1. when green flag clicked',
      '2. show sprite [Cat v]',
      '3. go to x: (0) y: (0)',
      '4. forever',
      '5.   if <touching [Coin v]?> then',
      '6.     change [coinScore v] by (1)',
      '7.     play sound [Coin v]',
    ],
    buggyLineIndex: 0,
    explanation: 'ขาดการกำหนดค่าเริ่มต้น (Initialization) ให้กับตัวแปร coinScore เมื่อเริ่มเกมใหม่',
    fixOptions: [
      {
        text: 'เพิ่มบล็อก set [coinScore v] to (0) ใต้ when green flag clicked',
        isCorrect: true,
        feedback: 'ยอดเยี่ยมมาก! การ Initial ค่าตัวแปรให้เป็น 0 ก่อนเริ่มทำงานรอบใหม่เป็นหลักการพื้นฐานที่สำคัญของการเขียนโปรแกรม',
      },
      {
        text: 'เปลี่ยน forever เป็น repeat (10)',
        isCorrect: false,
        feedback: 'ทำให้เกมตรวจสอบการชนแค่ 10 รอบแล้วหยุดทำงาน',
      },
      {
        text: 'ลบตัวแปร coinScore ทิ้ง',
        isCorrect: false,
        feedback: 'การลบตัวแปรจะทำให้เกมนับแต้มไม่ได้เลย',
      },
    ],
  },
];

interface DailyBugHunterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessBugHunter: (points: number) => void;
}

export const DailyBugHunterModal: React.FC<DailyBugHunterModalProps> = ({
  isOpen,
  onClose,
  onSuccessBugHunter,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedFix, setSelectedFix] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('coderkids_bug_streak');
    return saved ? parseInt(saved, 10) : 3;
  });

  if (!isOpen) return null;

  const challenge = DAILY_BUG_CHALLENGES[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedFix(idx);
    setIsAnswered(true);

    const isCorrect = challenge.fixOptions[idx].isCorrect;
    if (isCorrect) {
      setIsWon(true);
      const newStreak = streakDays + 1;
      setStreakDays(newStreak);
      localStorage.setItem('coderkids_bug_streak', newStreak.toString());
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      onSuccessBugHunter(15);
    } else {
      setIsWon(false);
    }
  };

  const handleNextChallenge = () => {
    setSelectedFix(null);
    setIsAnswered(false);
    setIsWon(false);
    setCurrentIdx((prev) => (prev + 1) % DAILY_BUG_CHALLENGES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-2xl border border-white/20">
              <Bug className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
                  ภารกิจประจำวัน (Daily Quest)
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-200 font-bold">
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>Streak: {streakDays} วันติดต่อกัน</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                ภารกิจล่า Bug ประจำวัน (Daily Bug Hunter)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-amber-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* Challenge title & Audio narration */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span>{challenge.title}</span>
            </h3>
            <AudioNarratorButton
              textToRead={`${challenge.title} ${challenge.scenario}`}
              label="ฟังโจทย์ล่า Bug"
            />
          </div>

          {/* Scenario Description */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs sm:text-sm text-amber-950 dark:text-amber-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>สถานการณ์ปัญหา:</span>
            </p>
            <p className="leading-relaxed">{challenge.scenario}</p>
          </div>

          {/* Code Viewer with Highlight */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Code2 className="w-4 h-4 text-indigo-500" />
                <span>สคริปต์บล็อก Scratch ที่มีข้อผิดพลาด:</span>
              </span>
              <span className="text-rose-500 font-semibold">มองหาบรรทัดที่ทำให้เกิด Bug</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm space-y-1.5 border border-slate-800 shadow-inner overflow-x-auto">
              {challenge.codeSnippet.map((line, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-1 rounded transition-colors ${
                    idx === challenge.buggyLineIndex && isAnswered
                      ? 'bg-rose-900/60 text-rose-300 font-bold border-l-4 border-rose-500'
                      : 'hover:bg-slate-800/60'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Fix Options (Multiple Choices) */}
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              เลือกวิธีการแก้ไข (Debugging Solution) ที่ถูกต้องที่สุด:
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {challenge.fixOptions.map((opt, idx) => {
                const isSelected = selectedFix === idx;
                let btnStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-200';
                if (isAnswered) {
                  if (opt.isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-current text-xs font-bold mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Result Panel */}
          {isAnswered && (
            <div
              className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
                isWon
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {isWon ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>ภารกิจกำจัด Bug สำเร็จ! รับ +15 แต้ม EXP</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>ยังไม่ถูกต้อง ลองสังเกตคำอธิบายเพิ่มเติมนะ</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed">
                {selectedFix !== null && challenge.fixOptions[selectedFix].feedback}
              </p>
              <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs">
                <span className="font-bold">สรุปหลักการคิดเชิงคำนวณ: </span>
                <span>{challenge.explanation}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            โจทย์ข้อที่ {currentIdx + 1} จาก {DAILY_BUG_CHALLENGES.length}
          </span>
          <div className="flex items-center gap-2">
            {isAnswered && (
              <button
                onClick={handleNextChallenge}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>ภารกิจถัดไป</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 font-semibold cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
