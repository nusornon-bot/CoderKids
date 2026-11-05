import React, { useState, useEffect } from 'react';
import {
  Users,
  Trophy,
  Swords,
  Timer,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Crown,
  Zap,
  ArrowRight,
  Shield,
  Shuffle,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';
import confetti from 'canvas-confetti';

interface PairProgrammingArenaProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardPoints?: (points: number, reason: string) => void;
}

interface DuelChallenge {
  id: number;
  title: string;
  scenario: string;
  buggyCode: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const DUEL_CHALLENGES: DuelChallenge[] = [
  {
    id: 1,
    title: 'ภารกิจที่ 1: วนลูปนับก้าวหุ่นยนต์เดินหน้า 5 ก้าว',
    scenario: 'โปรแกรมนี้ตั้งใจให้หุ่นยนต์เดิน 5 ก้าว แต่กลับเดินไม่ยอมหยุด เกิดจากบั๊กใด?',
    buggyCode: `count = 0\nwhile count < 5:\n    robot.step_forward()\n    # ลืมบรรทัดนี้!`,
    options: [
      { label: 'count = count + 1', isCorrect: true, explanation: 'ถูกต้อง! ถ้าไม่เพิ่มค่า count ลูปจะกลายเป็น Infinite Loop ไม่รู้จบ' },
      { label: 'count = 0', isCorrect: false, explanation: 'ไม่ใช่ จะทำให้ count เป็น 0 ตลอดไป' },
      { label: 'break', isCorrect: false, explanation: 'การใส่ break ทันทีจะทำให้เดินได้แค่ 1 ก้าวเท่านั้น' },
      { label: 'count = count - 1', isCorrect: false, explanation: 'จะทำให้ค่ายิ่งลดลงและไม่ถึง 5' },
    ],
  },
  {
    id: 2,
    title: 'ภารกิจที่ 2: ระบบแจ้งเตือนอุณหภูมิห้องเซิร์ฟเวอร์',
    scenario: 'ถ้าอุณหภูมิเกิน 35 องศา ให้เปิดพัดลมระบายอากาศ คำสั่งใดเขียนเงื่อนไขถูกต้อง?',
    buggyCode: `temp = sensor.read_temperature()\nif ?????:\n    fan.turn_on()`,
    options: [
      { label: 'temp > 35', isCorrect: true, explanation: 'ถูกต้อง! ใช้เครื่องหมายมากกว่า (>) เพื่อตรวจสอบค่าเกิน 35' },
      { label: 'temp = 35', isCorrect: false, explanation: 'เครื่องหมาย = เดียวเป็นการกำหนดค่า ไม่ใช่การเปรียบเทียบ' },
      { label: 'temp < 35', isCorrect: false, explanation: 'เครื่องหมาย < หมายถึงต่ำกว่า 35 องศา' },
      { label: 'temp != 35', isCorrect: false, explanation: 'เครื่องหมาย != หมายถึงไม่เท่ากับ 35' },
    ],
  },
  {
    id: 3,
    title: 'ภารกิจที่ 3: สุ่มทอยลูกเต๋า 1 ถึง 6',
    scenario: 'ต้องการจำลองการทอยลูกเต๋าหกหน้า คำสั่งใน Python ข้อใดถูกต้องที่สุด?',
    buggyCode: `import random\ndice = ?????\nprint("แต้มลูกเต๋า:", dice)`,
    options: [
      { label: 'random.randint(1, 6)', isCorrect: true, explanation: 'ถูกต้อง! ฟังก์ชัน randint(a, b) สุ่มตัวเลขจำนวนเต็มตั้งแต่ a ถึง b' },
      { label: 'random.random(6)', isCorrect: false, explanation: 'random() ไม่รับค่าพารามิเตอร์เดี่ยวแบบนี้' },
      { label: 'random.choice(6)', isCorrect: false, explanation: 'choice() ต้องรับลิสต์หรือลำดับ เช่น [1, 2, 3, 4, 5, 6]' },
      { label: 'random.range(1, 6)', isCorrect: false, explanation: 'ไม่มีโมดูลย่อย random.range' },
    ],
  },
  {
    id: 4,
    title: 'ภารกิจที่ 4: ตรวจสอบความปลอดภัยรหัสผ่าน',
    scenario: 'เงื่อนไข: รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
    buggyCode: `password = input("ตั้งรหัสผ่าน: ")\nif ?????:\n    print("รหัสผ่านปลอดภัย")`,
    options: [
      { label: 'len(password) >= 8', isCorrect: true, explanation: 'ถูกต้อง! ฟังก์ชัน len() ตรวจสอบความยาว และ >= หมายถึงอย่างน้อย 8 ตัว' },
      { label: 'password.length > 8', isCorrect: false, explanation: 'ใน Python ใช้ len(obj) ไม่ใช่ .length' },
      { label: 'len(password) == 8', isCorrect: false, explanation: 'ถ้าเท่ากับ 8 พอดี คนที่ตั้ง 9 หรือ 10 ตัวจะใช้งานไม่ได้' },
      { label: 'password >= 8', isCorrect: false, explanation: 'ไม่สามารถเปรียบเทียบสตริงกับตัวเลขได้โดยตรง' },
    ],
  },
];

export const PairProgrammingArena: React.FC<PairProgrammingArenaProps> = ({
  isOpen,
  onClose,
  onRewardPoints,
}) => {
  const [mode, setMode] = useState<'duel' | 'coop'>('duel');
  const [challengeIndex, setChallengeIndex] = useState(0);

  // Player 1 (Red / Left)
  const [p1Score, setP1Score] = useState(0);
  const [p1Selection, setP1Selection] = useState<number | null>(null);
  const [p1Status, setP1Status] = useState<'thinking' | 'correct' | 'wrong'>('thinking');

  // Player 2 (Blue / Right)
  const [p2Score, setP2Score] = useState(0);
  const [p2Selection, setP2Selection] = useState<number | null>(null);
  const [p2Status, setP2Status] = useState<'thinking' | 'correct' | 'wrong'>('thinking');

  // Co-op Mode State
  const [coopRole, setCoopRole] = useState<'p1_driver' | 'p2_driver'>('p1_driver');
  const [coopTimer, setCoopTimer] = useState(180); // 3-minute pair rotation timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // General duel state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const currentChallenge = DUEL_CHALLENGES[challengeIndex] || DUEL_CHALLENGES[0];

  // Co-op rotation timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === 'coop' && isTimerRunning && coopTimer > 0) {
      interval = setInterval(() => {
        setCoopTimer((prev) => {
          if (prev <= 1) {
            // Role rotation alarm
            if (soundEnabled) soundEffects.play('badge');
            setCoopRole((r) => (r === 'p1_driver' ? 'p2_driver' : 'p1_driver'));
            return 180;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, isTimerRunning, coopTimer, soundEnabled]);

  if (!isOpen) return null;

  // Handle Player 1 Answer Click
  const handleP1Answer = (index: number) => {
    if (p1Selection !== null || winner) return;
    setP1Selection(index);
    const isCorrect = currentChallenge.options[index].isCorrect;
    if (isCorrect) {
      setP1Status('correct');
      setP1Score((s) => s + 20);
      if (soundEnabled) soundEffects.play('correct');
    } else {
      setP1Status('wrong');
      if (soundEnabled) soundEffects.play('error');
    }
    checkRoundEnd(index, p2Selection);
  };

  // Handle Player 2 Answer Click
  const handleP2Answer = (index: number) => {
    if (p2Selection !== null || winner) return;
    setP2Selection(index);
    const isCorrect = currentChallenge.options[index].isCorrect;
    if (isCorrect) {
      setP2Status('correct');
      setP2Score((s) => s + 20);
      if (soundEnabled) soundEffects.play('correct');
    } else {
      setP2Status('wrong');
      if (soundEnabled) soundEffects.play('error');
    }
    checkRoundEnd(p1Selection, index);
  };

  const checkRoundEnd = (sel1: number | null, sel2: number | null) => {
    if (sel1 !== null && sel2 !== null) {
      // Both answered, transition next after delay
      setTimeout(() => {
        if (challengeIndex + 1 < DUEL_CHALLENGES.length) {
          setChallengeIndex((prev) => prev + 1);
          setP1Selection(null);
          setP2Selection(null);
          setP1Status('thinking');
          setP2Status('thinking');
        } else {
          // Finish Duel
          if (p1Score > p2Score) setWinner('ผู้เล่น 1 (ฝั่งแดง)');
          else if (p2Score > p1Score) setWinner('ผู้เล่น 2 (ฝั่งน้ำเงิน)');
          else setWinner('เสมออย่างสมเกียรติ!');

          if (soundEnabled) soundEffects.play('victory');
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          if (onRewardPoints) onRewardPoints(40, 'จบการแข่งขัน Pair Programming Arena');
        }
      }, 1800);
    }
  };

  const handleNextRoundDirect = () => {
    if (challengeIndex + 1 < DUEL_CHALLENGES.length) {
      setChallengeIndex((prev) => prev + 1);
      setP1Selection(null);
      setP2Selection(null);
      setP1Status('thinking');
      setP2Status('thinking');
    }
  };

  const handleReset = () => {
    setChallengeIndex(0);
    setP1Score(0);
    setP2Score(0);
    setP1Selection(null);
    setP2Selection(null);
    setP1Status('thinking');
    setP2Status('thinking');
    setWinner(null);
    setCoopTimer(180);
    setIsTimerRunning(false);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-indigo-500/30 text-white shadow-2xl flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Arena Top Header */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white shadow-lg">
              <Swords className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black bg-gradient-to-r from-rose-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent">
                  Pair Programming Arena ⚔️
                </h2>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                  Split Screen 1v1 / Co-op
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ประลองโค้ดดิ้ง 2 คนบนหน้าจอเดียวกัน หรือโหมดสลับบทบาทคนขับกับผู้นำทาง
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
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

        {/* Mode Selector & Status Header */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setMode('duel'); handleReset(); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'duel'
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>โหมดดวล 1v1 สปีดดวล</span>
            </button>
            <button
              onClick={() => { setMode('coop'); handleReset(); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'coop'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>โหมดนักบิน-ผู้ช่วย (Driver & Navigator)</span>
            </button>
          </div>

          {mode === 'coop' && (
            <div className="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                <Timer className="w-4 h-4 text-emerald-400" />
                <span>สลับบทบาทใน: {formatTimer(coopTimer)}</span>
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
              >
                {isTimerRunning ? 'หยุดชั่วคราว' : 'เริ่มจับเวลา'}
              </button>
            </div>
          )}

          <div className="text-xs text-slate-400">
            ภารกิจที่ {challengeIndex + 1} จาก {DUEL_CHALLENGES.length}
          </div>
        </div>

        {/* Central Scenario / Question Board */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> {currentChallenge.title}
            </span>
            <span className="text-xs text-slate-400">{currentChallenge.scenario}</span>
          </div>

          {/* Buggy Code Snippet */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/30 font-mono text-xs text-indigo-200 relative overflow-x-auto">
            <div className="text-[10px] text-slate-500 absolute top-2 right-3 font-sans">
              Python 3.x
            </div>
            <pre className="whitespace-pre-wrap">{currentChallenge.buggyCode}</pre>
          </div>
        </div>

        {/* Winner Banner if finished */}
        {winner && (
          <div className="p-6 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20 border-b border-amber-500/30 text-center space-y-3 animate-in zoom-in-95">
            <Crown className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-black text-white">ผู้ชนะคือ: {winner}</h3>
            <p className="text-xs text-slate-300">
              คะแนนสรุป: ฝั่งแดง {p1Score} แต้ม — ฝั่งน้ำเงิน {p2Score} แต้ม
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
            >
              เล่นอีกรอบ (Play Again)
            </button>
          </div>
        )}

        {/* Split Screen Dual Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 p-4 gap-4">
          {/* Player 1 Panel (Red) */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border-2 border-rose-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-rose-500" />
                  <span className="font-bold text-rose-300 text-sm">ผู้เล่น 1 (ฝั่งซ้าย)</span>
                  {mode === 'coop' && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      coopRole === 'p1_driver' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {coopRole === 'p1_driver' ? '🚗 คนขับ (Driver)' : '🗺️ ผู้นำทาง (Navigator)'}
                    </span>
                  )}
                </div>
                <div className="text-sm font-black text-rose-400 font-mono">
                  {p1Score} แต้ม
                </div>
              </div>

              {/* Player 1 Choice Options */}
              <div className="space-y-2 mt-4">
                {currentChallenge.options.map((opt, idx) => {
                  let btnColor = 'bg-slate-900 hover:bg-rose-900/40 border-slate-700/80 text-slate-200';
                  if (p1Selection === idx) {
                    btnColor = opt.isCorrect
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                      : 'bg-rose-600 border-rose-400 text-white';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={p1Selection !== null || !!winner}
                      onClick={() => handleP1Answer(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-mono font-medium transition flex items-center justify-between ${btnColor} ${
                        p1Selection === null ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {p1Selection === idx && (
                        <span>
                          {opt.isCorrect ? <CheckCircle2 className="w-4 h-4 text-white" /> : <XCircle className="w-4 h-4 text-white" />}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {p1Selection !== null && (
              <div className="mt-4 p-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-[11px] text-slate-300">
                {currentChallenge.options[p1Selection]?.explanation}
              </div>
            )}
          </div>

          {/* Player 2 Panel (Blue) */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border-2 border-indigo-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-indigo-500" />
                  <span className="font-bold text-indigo-300 text-sm">ผู้เล่น 2 (ฝั่งขวา)</span>
                  {mode === 'coop' && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      coopRole === 'p2_driver' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {coopRole === 'p2_driver' ? '🚗 คนขับ (Driver)' : '🗺️ ผู้นำทาง (Navigator)'}
                    </span>
                  )}
                </div>
                <div className="text-sm font-black text-indigo-400 font-mono">
                  {p2Score} แต้ม
                </div>
              </div>

              {/* Player 2 Choice Options */}
              <div className="space-y-2 mt-4">
                {currentChallenge.options.map((opt, idx) => {
                  let btnColor = 'bg-slate-900 hover:bg-indigo-900/40 border-slate-700/80 text-slate-200';
                  if (p2Selection === idx) {
                    btnColor = opt.isCorrect
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                      : 'bg-rose-600 border-rose-400 text-white';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={p2Selection !== null || !!winner}
                      onClick={() => handleP2Answer(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-mono font-medium transition flex items-center justify-between ${btnColor} ${
                        p2Selection === null ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {p2Selection === idx && (
                        <span>
                          {opt.isCorrect ? <CheckCircle2 className="w-4 h-4 text-white" /> : <XCircle className="w-4 h-4 text-white" />}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {p2Selection !== null && (
              <div className="mt-4 p-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-[11px] text-slate-300">
                {currentChallenge.options[p2Selection]?.explanation}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>คำตอบถูกต้องรับทันทีคนละ +20 แต้ม EXP</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>เริ่มใหม่</span>
            </button>
            <button
              onClick={handleNextRoundDirect}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>ข้อถัดไป</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
