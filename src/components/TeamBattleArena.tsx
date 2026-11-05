import React, { useState, useEffect } from 'react';
import {
  Users,
  Trophy,
  Flame,
  Volume2,
  Tv,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Play,
  Pause,
  Award,
  Crown,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';
import confetti from 'canvas-confetti';

interface BattleQuestion {
  id: number;
  question: string;
  category: string;
  options: string[];
  correctIndex: number;
  points: number;
  explanation: string;
}

const BATTLE_QUESTIONS: BattleQuestion[] = [
  {
    id: 1,
    question: '⚡ คำถามความเร็ว: บล็อกคำสั่งใดใน Scratch ใช้สำหรับสั่งให้ตัวละครเดินซ้ำไม่รู้จบ?',
    category: 'Scratch Studio',
    options: ['repeat (10)', 'forever', 'repeat until', 'if-then'],
    correctIndex: 1,
    points: 20,
    explanation: 'บล็อก forever สั่งให้ชุดคำสั่งวนซ้ำตลอดเวลาจนกว่าจะกดปุ่มหยุดสีแดง',
  },
  {
    id: 2,
    question: '⚡ คำถามความเร็ว: รหัสผ่านใดต่อไปนี้มีความปลอดภัยสูงสุดตามหลัก Cyber Hygiene?',
    category: 'Cyber Safety',
    options: ['12345678', 'password2026', 'P@ssw0rd#Nara26!', 'kawin1111'],
    correctIndex: 2,
    points: 20,
    explanation: 'มีความยาวเกิน 12 ตัวอักษร ผสมตัวพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ',
  },
  {
    id: 3,
    question: '⚡ คำถามความเร็ว: บอร์ด Micro:bit มีหลอดไฟ LED แสดงผลแบบเมทริกซ์ขนาดเท่าใด?',
    category: 'Hardware & IoT',
    options: ['3 x 3 หลอด (9 หลอด)', '4 x 4 หลอด (16 หลอด)', '5 x 5 หลอด (25 หลอด)', '8 x 8 หลอด (64 หลอด)'],
    correctIndex: 2,
    points: 20,
    explanation: 'หน้าจอ Micro:bit V2 ประกอบด้วยไฟ LED สีแดง 5 แถว 5 คอลัมน์ รวมเป็น 25 ดวง',
  },
  {
    id: 4,
    question: '⚡ คำถามความเร็ว: การแตกปัญหาใหญ่ให้เป็นส่วนย่อย เรียกว่าอะไรใน 4 เสาหลัก Computational Thinking?',
    category: 'Algorithm Logic',
    options: ['Decomposition', 'Pattern Recognition', 'Abstraction', 'Algorithm'],
    correctIndex: 0,
    points: 20,
    explanation: 'Decomposition คือการแยกย่อยปัญหาออกเป็นส่วนเล็กๆ เพื่อจัดการได้ง่ายขึ้น',
  },
  {
    id: 5,
    question: '⚡ คำถามความเร็ว: ข้อมูลส่วนบุคคลใดถือเป็นข้อมูลอ่อนไหว (Sensitive Data) ตาม PDPA?',
    category: 'PDPA Law',
    options: ['ชื่อเล่น', 'สีที่ชอบ', 'ข้อมูลลายนิ้วมือ / ศาสนา / สุขภาพ', 'ชื่อโรงเรียน'],
    correctIndex: 2,
    points: 25,
    explanation: 'ข้อมูลชีวภาพ (ลายนิ้วมือ, ม่านตา), สุขภาพ, ศาสนา ถือเป็นข้อมูลอ่อนไหว ห้ามเปิดเผยโดยไม่ได้รับความยินยอมเป็นลายลักษณ์อักษร',
  },
];

interface TeamData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgGradient: string;
  score: number;
  streak: number;
}

export interface TeamBattleArenaProps {
  onAwardPoints: (points: number, reason: string) => void;
  onBack?: () => void;
}

export const TeamBattleArena: React.FC<TeamBattleArenaProps> = ({ onAwardPoints, onBack }) => {
  const [teams, setTeams] = useState<TeamData[]>([
    {
      id: 'team_lion',
      name: 'ทีมราชสีห์คำนวณ',
      emoji: '🦁',
      color: 'text-amber-500',
      bgGradient: 'from-amber-500 to-orange-500',
      score: 120,
      streak: 3,
    },
    {
      id: 'team_rocket',
      name: 'ทีมนักบินอวกาศโค้ด',
      emoji: '🚀',
      color: 'text-indigo-500',
      bgGradient: 'from-indigo-500 to-purple-600',
      score: 140,
      streak: 4,
    },
    {
      id: 'team_robot',
      name: 'ทีมหุ่นยนต์อัจฉริยะ',
      emoji: '🤖',
      color: 'text-sky-500',
      bgGradient: 'from-sky-500 to-blue-600',
      score: 110,
      streak: 2,
    },
    {
      id: 'team_shield',
      name: 'ทีมนักพิทักษ์ไซเบอร์',
      emoji: '🛡️',
      color: 'text-emerald-500',
      bgGradient: 'from-emerald-500 to-teal-600',
      score: 130,
      streak: 3,
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isBigScreen, setIsBigScreen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(20);
  const [timerRunning, setTimerRunning] = useState(false);
  const [revealedAnswer, setRevealedAnswer] = useState(false);
  const [activeAnsweringTeam, setActiveAnsweringTeam] = useState<string | null>(null);

  // Timer
  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          soundEffects.playError();
          setTimerRunning(false);
          return 0;
        }
        soundEffects.playTick();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const currentQ = BATTLE_QUESTIONS[currentQuestionIndex];

  const handleStartTimer = () => {
    soundEffects.playClick();
    setTimerRunning(true);
  };

  const handlePauseTimer = () => {
    soundEffects.playClick();
    setTimerRunning(false);
  };

  const handleResetTimer = () => {
    soundEffects.playClick();
    setTimerSeconds(20);
    setTimerRunning(false);
    setRevealedAnswer(false);
    setActiveAnsweringTeam(null);
  };

  const handleTeamBuzzer = (teamId: string) => {
    soundEffects.playCheer();
    setActiveAnsweringTeam(teamId);
    setTimerRunning(false);
  };

  const handleAwardTeam = (teamId: string, isCorrect: boolean) => {
    if (isCorrect) {
      soundEffects.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
      });
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId
            ? { ...t, score: t.score + currentQ.points, streak: t.streak + 1 }
            : t
        )
      );
      setRevealedAnswer(true);
      onAwardPoints(10, `ทีมตอบคำถามประลองความเร็วถูกต้อง (+10 แต้ม)`);
    } else {
      soundEffects.playError();
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId ? { ...t, streak: 0 } : t
        )
      );
    }
  };

  const handleNextQuestion = () => {
    soundEffects.playClick();
    if (currentQuestionIndex < BATTLE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      handleResetTimer();
    } else {
      soundEffects.playFanfare();
      confetti({
        particleCount: 120,
        spread: 90,
      });
    }
  };

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${
      isBigScreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto text-white' : ''
    }`}>
      
      {/* Control Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md">
            ⚔️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                สนามประลองปัญญาเป็นทีม (Team Battle Arena)
              </h2>
              <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full">
                Classroom Co-op
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              รวมกลุ่มแข่งความเร็ว ตอบโจทย์วิทยาการคำนวณบนสมาร์ตบอร์ดห้องเรียน
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onBack();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
              title="กลับสู่หน้าหลัก Dashboard"
            >
              <span>← กลับหน้าหลัก</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEffects.playClick();
              setIsBigScreen(!isBigScreen);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isBigScreen
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
            title="สลับโหมดจอใหญ่ฉายโปรเจกเตอร์ในห้องเรียน"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>{isBigScreen ? 'ย่อหน้าต่าง' : 'โหมดฉายจอใหญ่ (Projector)'}</span>
          </button>
        </div>
      </div>

      {/* Team Leaderboard Podiums (4 Teams) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {teams.map((t, idx) => {
          const isLeader = sortedTeams[0].id === t.id;
          const isBuzzered = activeAnsweringTeam === t.id;
          return (
            <div
              key={t.id}
              className={`p-4 rounded-3xl border transition-all relative overflow-hidden ${
                isBuzzered
                  ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-400 ring-2 ring-amber-400 animate-pulse'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{t.emoji}</span>
                {isLeader && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-500" />
                    <span>นำอยู่</span>
                  </span>
                )}
              </div>

              <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {t.name}
              </div>
              <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                {t.score} <span className="text-xs text-slate-400 font-normal">แต้ม</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1 text-rose-500 font-semibold">
                  <Flame className="w-3 h-3" />
                  <span>Streak {t.streak}</span>
                </span>
                <button
                  onClick={() => handleTeamBuzzer(t.id)}
                  className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold cursor-pointer transition-colors"
                >
                  กดกริ่งแย่งตอบ!
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Question & Arena Stage */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        {/* Stage Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
              ข้อที่ {currentQuestionIndex + 1} / {BATTLE_QUESTIONS.length}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {currentQ.category}
            </span>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2">
            <div className={`px-4 py-1.5 rounded-2xl font-mono text-base font-black border flex items-center gap-2 ${
              timerSeconds <= 5
                ? 'bg-rose-500 text-white border-rose-600 animate-bounce'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700'
            }`}>
              <span>⏱️</span>
              <span>{timerSeconds}s</span>
            </div>

            {timerRunning ? (
              <button
                onClick={handlePauseTimer}
                className="p-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shadow-xs"
                title="หยุดเวลาชั่วคราว"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleStartTimer}
                className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                title="เริ่มจับเวลา"
              >
                <Play className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleResetTimer}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              title="รีเซ็ตเวลา"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Question */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`font-black text-slate-900 dark:text-white leading-relaxed ${
              isBigScreen ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
            }`}>
              {currentQ.question}
            </h3>
            <button
              onClick={() => soundEffects.speakThai(currentQ.question)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 shrink-0 cursor-pointer"
              title="อ่านโจทย์ภาษาไทย"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isCorrect = idx === currentQ.correctIndex;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                    revealedAnswer && isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-500 font-bold text-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    revealedAnswer && isCorrect
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">{opt}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Answering Team & Points Awarding */}
        {activeAnsweringTeam && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {teams.find((t) => t.id === activeAnsweringTeam)?.emoji}
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {teams.find((t) => t.id === activeAnsweringTeam)?.name} กำลังตอบ!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAwardTeam(activeAnsweringTeam, true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-xs active:scale-95"
              >
                ✓ ตอบถูก (+{currentQ.points} แต้ม)
              </button>
              <button
                onClick={() => handleAwardTeam(activeAnsweringTeam, false)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-xs active:scale-95"
              >
                ✗ ตอบผิด (ตัดสิทธิ์)
              </button>
            </div>
          </div>
        )}

        {/* Explanation when revealed */}
        {revealedAnswer && (
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1 animate-in fade-in">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>เฉลยคำตอบ: {currentQ.options[currentQ.correctIndex]}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">{currentQ.explanation}</p>
          </div>
        )}

        {/* Action Next Question */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setRevealedAnswer(!revealedAnswer)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {revealedAnswer ? 'ซ่อนเฉลย' : 'แสดงเฉลย'}
          </button>

          <button
            onClick={handleNextQuestion}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>โจทย์ข้อต่อไป</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
