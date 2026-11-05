import React, { useState, useEffect, useRef } from 'react';
import {
  Keyboard,
  Trophy,
  Flame,
  Zap,
  RotateCcw,
  Sparkles,
  Award,
  Volume2,
  VolumeX,
  X,
  CheckCircle,
  HelpCircle,
  Timer,
  Gauge,
  Target,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';
import confetti from 'canvas-confetti';

interface CodeTyperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardPoints?: (points: number, reason: string) => void;
}

interface TypingSnippet {
  text: string;
  category: 'keywords' | 'symbols' | 'logic';
  hint: string;
  fingerTip: string;
}

const SNIPPET_DATA: Record<'keywords' | 'symbols' | 'logic', TypingSnippet[]> = {
  keywords: [
    { text: 'print', category: 'keywords', hint: 'คำสั่งแสดงผลข้อความออกหน้าจอ', fingerTip: 'ใช้นิ้วก้อยขวา (p), ชี้ซ้าย (r), กลางขวา (i)' },
    { text: 'input', category: 'keywords', hint: 'คำสั่งรับค่าจากแป้นพิมพ์ของผู้ใช้', fingerTip: 'ใช้นิ้วกลางขวา (i), ชี้ขวา (u), ก้อยขวา (p)' },
    { text: 'if', category: 'keywords', hint: 'คำสั่งตรวจสอบเงื่อนไข ถ้าเป็นจริง', fingerTip: 'ใช้นิ้วกลางขวา (i), ชี้ซ้าย (f)' },
    { text: 'else', category: 'keywords', hint: 'คำสั่งทำงานเมื่อเงื่อนไขข้างต้นเป็นเท็จ', fingerTip: 'ใช้นิ้วกลางซ้าย (e), นางขวา (l), นางซ้าย (s)' },
    { text: 'while', category: 'keywords', hint: 'คำสั่งวนซ้ำตราบเท่าที่เงื่อนไขยังเป็นจริง', fingerTip: 'ใช้นิ้วนางซ้าย (w), ชี้ขวา (h), กลางขวา (i)' },
    { text: 'for', category: 'keywords', hint: 'คำสั่งวนซ้ำตามจำนวนรอบที่ระบุ', fingerTip: 'ใช้นิ้วชี้ซ้าย (f), นางขวา (o), ชี้ซ้าย (r)' },
    { text: 'def', category: 'keywords', hint: 'คำสั่งสร้างฟังก์ชันส่วนตัว (Define Function)', fingerTip: 'ใช้นิ้วกลางซ้าย (d), กลางซ้าย (e), ชี้ซ้าย (f)' },
    { text: 'return', category: 'keywords', hint: 'คำสั่งส่งค่าผลลัพธ์กลับจากฟังก์ชัน', fingerTip: 'ใช้นิ้วชี้ซ้าย (r), กลางซ้าย (e), ชี้ซ้าย (t)' },
  ],
  symbols: [
    { text: '()', category: 'symbols', hint: 'วงเล็บกลม (Parentheses) ใช้ครอบอาร์กิวเมนต์', fingerTip: 'กด Shift ค้าง + กดเลข 9 และ 0 ด้านบน' },
    { text: '{}', category: 'symbols', hint: 'วงเล็บปีกกา (Curly Braces) ใช้ในบล็อกคำสั่ง/Dict', fingerTip: 'กด Shift ค้าง + ปุ่ม [ และ ] ใกล้แป้น Enter' },
    { text: '[]', category: 'symbols', hint: 'วงเล็บเหลี่ยม (Square Brackets) ใช้สำหรับ List', fingerTip: 'ใช้นิ้วก้อยขวากดปุ่ม บ และ ล (โดยไม่ต้องกด Shift)' },
    { text: ':', category: 'symbols', hint: 'เครื่องหมายโคลอน (Colon) จบหัวฟังก์ชันหรือเงื่อนไข', fingerTip: 'กด Shift + กดปุ่ม ว (อัฒภาค) ด้วยนิ้วก้อยขวา' },
    { text: '""', category: 'symbols', hint: 'อัญประกาศคู่ (Double Quotes) ครอบข้อความสตริง', fingerTip: 'กด Shift + กดปุ่ม ง ด้วยนิ้วก้อยขวา' },
    { text: '->', category: 'symbols', hint: 'สัญลักษณ์ลูกศรชี้ (Arrow Operator)', fingerTip: 'กดเครื่องหมายลบ (-) ตามด้วยเครื่องหมายมากกว่า (>)' },
    { text: '#', category: 'symbols', hint: 'เครื่องหมายแฮชแท็ก ใช้เขียนคอมเมนต์ใน Python', fingerTip: 'กด Shift ค้าง + กดเลข 3' },
  ],
  logic: [
    { text: 'x == 10', category: 'logic', hint: 'ตรวจสอบว่า x เท่ากับ 10 หรือไม่ (ไม่ใช่การกำหนดค่า)', fingerTip: 'เครื่องหมายเท่ากับสองตัวติดกัน = =' },
    { text: 'score >= 80', category: 'logic', hint: 'เงื่อนไขคะแนนมากกว่าหรือเท่ากับ 80 (เกรด 4)', fingerTip: 'กด Shift + > แล้วกด =' },
    { text: 'count += 1', category: 'logic', hint: 'คำสั่งเพิ่มค่าตัวแปรขึ้นทีละ 1 (Increment)', fingerTip: 'กด Shift + + แล้วตามด้วย =' },
    { text: 'print("Coder")', category: 'logic', hint: 'รวมฟังก์ชัน ข้อความ และวงเล็บเข้าด้วยกัน', fingerTip: 'ระวังการเปิด-ปิดวงเล็บและเครื่องหมายคำพูดให้ครบ' },
    { text: 'age != 0', category: 'logic', hint: 'เงื่อนไขอายุไม่เท่ากับ 0', fingerTip: 'กด Shift + 1 เพื่อพิมพ์เครื่องหมาย ! (ตกใจ)' },
  ],
};

export const CodeTyperModal: React.FC<CodeTyperModalProps> = ({
  isOpen,
  onClose,
  onRewardPoints,
}) => {
  const [level, setLevel] = useState<'keywords' | 'symbols' | 'logic'>('keywords');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalKeysTyped, setTotalKeysTyped] = useState(0);
  const [correctKeysTyped, setCorrectKeysTyped] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const snippets = SNIPPET_DATA[level];
  const currentSnippet = snippets[currentIndex] || snippets[0];
  const targetText = currentSnippet.text;

  // Reset when level changes
  useEffect(() => {
    setCurrentIndex(0);
    setUserInput('');
    setStreak(0);
    setMaxStreak(0);
    setTotalKeysTyped(0);
    setCorrectKeysTyped(0);
    setStartTime(null);
    setWpm(0);
    setIsCompleted(false);
  }, [level]);

  // Focus input on mount or level change
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, level, currentIndex]);

  if (!isOpen) return null;

  // Handle typing change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    setTotalKeysTyped((prev) => prev + 1);

    // Check correctness of latest character
    const charIndex = val.length - 1;
    const isCharCorrect = val[charIndex] === targetText[charIndex];

    if (isCharCorrect) {
      setCorrectKeysTyped((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
      if (soundEnabled) {
        soundEffects.play('click');
      }
    } else {
      setStreak(0);
      if (soundEnabled) {
        soundEffects.play('error');
      }
    }

    setUserInput(val);

    // Calculate real-time WPM
    if (startTime) {
      const minutesElapsed = (Date.now() - startTime) / 60000;
      if (minutesElapsed > 0) {
        const words = (correctKeysTyped + 1) / 5;
        setWpm(Math.round(words / minutesElapsed));
      }
    }

    // Check if whole snippet is completed correctly
    if (val === targetText) {
      if (soundEnabled) soundEffects.play('correct');

      if (currentIndex + 1 < snippets.length) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setUserInput('');
        }, 180);
      } else {
        // Completed this level!
        setIsCompleted(true);
        if (soundEnabled) soundEffects.play('victory');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        if (onRewardPoints) {
          onRewardPoints(35, `สำเร็จภารกิจพิมพ์โค้ดดิ้ง: ${level.toUpperCase()}`);
        }
      }
    }
  };

  const accuracy = totalKeysTyped > 0 ? Math.round((correctKeysTyped / totalKeysTyped) * 100) : 100;

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserInput('');
    setStreak(0);
    setMaxStreak(0);
    setTotalKeysTyped(0);
    setCorrectKeysTyped(0);
    setStartTime(null);
    setWpm(0);
    setIsCompleted(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-indigo-500/30 text-white shadow-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/40 border border-indigo-400/30 text-indigo-300 shadow-inner">
              <Keyboard className="w-6 h-6 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                  Kids Code Typer ⌨️
                </h2>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  Beta 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                มินิเกมฝึกความไวและคุ้นเคยกับสัญลักษณ์โปรแกรมมิ่ง ว 4.2
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Level Switcher Tabs */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLevel('keywords')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                level === 'keywords'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              ระดับ 1: คีย์เวิร์ดพื้นฐาน ({SNIPPET_DATA.keywords.length})
            </button>
            <button
              onClick={() => setLevel('symbols')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                level === 'symbols'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              ระดับ 2: สัญลักษณ์ & วงเล็บ ({SNIPPET_DATA.symbols.length})
            </button>
            <button
              onClick={() => setLevel('logic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                level === 'logic'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              ระดับ 3: นิพจน์เงื่อนไข ({SNIPPET_DATA.logic.length})
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>คำที่ {currentIndex + 1} / {snippets.length}</span>
          </div>
        </div>

        {/* Real-time Scoreboard Bar */}
        <div className="grid grid-cols-4 gap-2 px-6 py-3 bg-slate-900/80 border-b border-slate-800/80 text-center">
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
              <Gauge className="w-3 h-3 text-cyan-400" /> ความเร็ว WPM
            </div>
            <div className="text-lg font-black text-cyan-400 font-mono">{wpm}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> แม่นยำ
            </div>
            <div className="text-lg font-black text-emerald-400 font-mono">{accuracy}%</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> คอมโบ Streak
            </div>
            <div className="text-lg font-black text-amber-400 font-mono flex items-center justify-center gap-1">
              <span>{streak}</span>
              {streak >= 5 && <span className="text-[10px] px-1 bg-amber-500/20 text-amber-300 rounded">x{Math.min(4, Math.floor(streak / 5) + 1)}</span>}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-purple-400" /> แต้มรางวัล
            </div>
            <div className="text-lg font-black text-purple-400 font-mono">+35 XP</div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {!isCompleted ? (
            <>
              {/* Target Snippet Display Box */}
              <div className="relative p-8 rounded-2xl bg-slate-950 border-2 border-indigo-500/40 text-center shadow-inner flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-slate-500 font-mono ml-2">code_typer.py</span>
                </div>

                {/* Target String with character coloring */}
                <div className="text-4xl sm:text-5xl font-mono tracking-wider font-extrabold flex items-center justify-center my-3">
                  {targetText.split('').map((char, idx) => {
                    let charClass = 'text-slate-500';
                    let isCurrent = idx === userInput.length;

                    if (idx < userInput.length) {
                      charClass = userInput[idx] === char ? 'text-emerald-400' : 'text-red-400 bg-red-900/40 rounded';
                    }

                    return (
                      <span
                        key={idx}
                        className={`transition-colors duration-75 relative ${charClass} ${
                          isCurrent ? 'border-b-4 border-cyan-400 animate-pulse text-cyan-200' : ''
                        }`}
                      >
                        {char === ' ' ? '␣' : char}
                      </span>
                    );
                  })}
                </div>

                {/* Meaning & CS Concept Hint */}
                <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/70 border border-indigo-800/60 px-3.5 py-1.5 rounded-full mt-2">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{currentSnippet.hint}</span>
                </div>
              </div>

              {/* Secret Typing Input (automatically captured) */}
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-800/90 border-2 border-indigo-400 focus:border-cyan-400 text-cyan-200 font-mono text-xl tracking-wider text-center outline-none shadow-lg shadow-indigo-950/50"
                  placeholder="พิมพ์ตามข้อความด้านบน..."
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>

              {/* Hand & Finger Guidance Tip */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>คำแนะนำนิ้วมือ:</strong> {currentSnippet.fingerTip}
                  </span>
                </div>
                <button
                  onClick={handleRestart}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                  title="เริ่มรอบใหม่"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            /* Level Completed Victory Screen */
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Trophy className="w-10 h-10 text-white animate-bounce" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">
                  🎉 สุดยอดมาก! ผ่านด่าน {level === 'keywords' ? 'คีย์เวิร์ด' : level === 'symbols' ? 'สัญลักษณ์' : 'นิพจน์เงื่อนไข'}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  ทักษะการพิมพ์คีย์เวิร์ดโปรแกรมมิ่งของคุณพัฒนาขึ้นอย่างรวดเร็ว!
                </p>
              </div>

              <div className="max-w-md mx-auto grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-indigo-500/30">
                <div>
                  <div className="text-xs text-slate-400">ความเร็วเฉลี่ย</div>
                  <div className="text-xl font-black text-cyan-400 font-mono">{wpm} WPM</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">ความแม่นยำ</div>
                  <div className="text-xl font-black text-emerald-400 font-mono">{accuracy}%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">คอมโบสูงสุด</div>
                  <div className="text-xl font-black text-amber-400 font-mono">{maxStreak} Hit</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  เล่นรอบนี้อีกครั้ง
                </button>
                {level !== 'logic' && (
                  <button
                    onClick={() => {
                      if (level === 'keywords') setLevel('symbols');
                      else if (level === 'symbols') setLevel('logic');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
                  >
                    <span>ไปด่านถัดไป</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
