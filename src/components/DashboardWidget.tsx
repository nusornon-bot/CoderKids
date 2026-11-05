import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Coins,
  Calendar,
  Check,
  User,
  ExternalLink,
  ChevronRight,
  Target,
  Zap,
  CheckSquare,
  Square,
  PartyPopper,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { UserProfile, PointTransaction, TodayLearningGoal } from '../types/index.ts';
import { soundEffects } from '../utils/soundEffects.ts';
import { fireConfetti, playCelebrationSound } from './ConfettiCelebration.tsx';

export interface DashboardWidgetProps {
  profile: UserProfile;
  points: number;
  moduleProgress: {
    safety: boolean;
    thinking: boolean;
    codingLab: boolean;
    showcase: boolean;
  };
  onNavigate: (moduleKey: string, subSection?: string) => void;
  onOpenProfile?: () => void;
  onCelebrate?: () => void;
  addPoints?: (amount: number, reason: string, category?: any) => void;
  todayGoal?: TodayLearningGoal | null;
  onToggleTodayGoal?: () => void;
  onSetTodayGoal?: (goal: string, category: 'coding' | 'hardware' | 'thinking' | 'safety' | 'reflection') => void;
  className?: string;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  profile,
  points,
  moduleProgress,
  onNavigate,
  onOpenProfile,
  onCelebrate,
  addPoints,
  todayGoal,
  onToggleTodayGoal,
  onSetTodayGoal,
  className = '',
}) => {
  // Calculated stats
  const completedModulesCount = useMemo(() => {
    return Object.values(moduleProgress).filter(Boolean).length;
  }, [moduleProgress]);

  const progressPercent = Math.round((completedModulesCount / 4) * 100);
  const userLevel = Math.max(1, Math.floor(points / 75) + 1);
  const nextLevelPoints = userLevel * 75;
  const currentLevelBase = (userLevel - 1) * 75;
  const pointsInCurrentLevel = points - currentLevelBase;
  const levelProgressPercent = Math.min(100, Math.round((pointsInCurrentLevel / 75) * 100));

  // Streak state & calculations
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const currentStreak = profile.streakDays || 4;

  // Streak milestone target calculation (3 days -> 5 days -> 7 days -> 14 days)
  const streakMilestoneTarget = useMemo(() => {
    if (currentStreak < 3) return 3;
    if (currentStreak < 5) return 5;
    if (currentStreak < 7) return 7;
    return Math.ceil((currentStreak + 1) / 7) * 7;
  }, [currentStreak]);

  const streakProgressPercent = useMemo(() => {
    return Math.min(100, Math.round((currentStreak / streakMilestoneTarget) * 100));
  }, [currentStreak, streakMilestoneTarget]);

  // Goal celebration visual state
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);

  // Recent activity stream (loaded from localStorage or defaults)
  const recentActivities = useMemo(() => {
    try {
      const saved = localStorage.getItem('coderkids_transactions');
      if (saved) {
        const parsed: PointTransaction[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 3);
        }
      }
    } catch {
      // fallback
    }

    return [
      {
        id: 'act_1',
        description: 'ตอบคำถามจำแนกข้อมูล PDPA และความปลอดภัยไซเบอร์',
        amount: 25,
        type: 'earn',
        timestamp: 'เมื่อสักครู่',
        category: 'safety',
      },
      {
        id: 'act_2',
        description: 'ผ่านด่านเขาวงกตอัลกอริทึมพาหุ่นยนต์แก้ปัญหา',
        amount: 30,
        type: 'earn',
        timestamp: 'เมื่อ 2 ชั่วโมงที่แล้ว',
        category: 'thinking',
      },
      {
        id: 'act_3',
        description: 'ทดลองเขียนโค้ดและรันบอร์ด Micro:bit V2 ใน Coding Lab',
        amount: 35,
        type: 'earn',
        timestamp: 'เมื่อวานนี้',
        category: 'coding',
      },
    ];
  }, []);

  // Today's Date formatted in Thai
  const todayDateString = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('th-TH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date());
    } catch {
      return 'วันพุธที่ 28 ตุลาคม 2026';
    }
  }, []);

  // Handle Daily Streak Check-in
  const handleDailyCheckIn = () => {
    if (hasCheckedInToday) return;
    setHasCheckedInToday(true);
    soundEffects.playFanfare();
    fireConfetti('burst');
    if (addPoints) {
      addPoints(15, 'เช็คอินเรียนรู้วันนี้ (Daily Streak Check-in)', 'classroom');
    }
    if (onCelebrate) {
      onCelebrate();
    }
  };

  // Handle Daily Goal Completion with Confetti Celebration
  const handleCompleteDailyGoal = () => {
    if (!todayGoal) return;

    if (!todayGoal.completed) {
      // Celebrate completion with confetti fireworks & sounds
      fireConfetti('fireworks');
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'],
      });

      playCelebrationSound();
      soundEffects.playFanfare();

      setShowCelebrationBanner(true);
      setTimeout(() => {
        setShowCelebrationBanner(false);
      }, 5000);

      onToggleTodayGoal?.();
      onCelebrate?.();
    } else {
      // If already completed and user taps to replay celebration
      fireConfetti('burst');
      playCelebrationSound();
      onToggleTodayGoal?.();
    }
  };

  // Quick goal presets for 1-click goal setup
  const quickGoalPresets = [
    { text: 'ทดลองรันโค้ดบอร์ด Micro:bit 1 โปรแกรม', category: 'hardware' as const, icon: '⚡' },
    { text: 'ทำแบบทดสอบ PDPA และความปลอดภัยไซเบอร์', category: 'safety' as const, icon: '🛡️' },
    { text: 'แก้ปริศนาเขาวงกตอัลกอริทึม 1 ด่าน', category: 'thinking' as const, icon: '🧩' },
  ];

  // Find next recommended module to study
  const nextRecommendedModule = useMemo(() => {
    if (!moduleProgress.safety) return { key: 'safety', label: '1. ความปลอดภัยดิจิทัล & PDPA' };
    if (!moduleProgress.thinking) return { key: 'thinking', label: '2. คิดเป็นลำดับขั้น (Computational)' };
    if (!moduleProgress.codingLab) return { key: 'codingLab', label: '3. ปฏิบัติการ Scratch & Micro:bit' };
    if (!moduleProgress.showcase) return { key: 'showcase', label: '4. โชว์ผลงานและสะท้อนคิด' };
    return { key: 'learningMap', label: 'ทบทวนแผนที่การเรียนรู้' };
  }, [moduleProgress]);

  // Days of week for 7-day streak visualizer
  const weekDays = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];
  const activeDayIndex = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md p-6 sm:p-7 space-y-6 transition-all duration-300 relative overflow-hidden ${className}`}
    >
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header: Welcome Greeting & Student Identification */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3.5">
          {/* Avatar with Level Badge */}
          <div className="relative shrink-0">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl sm:text-3xl shadow-sm border border-white/20">
              {profile.avatarEmoji || '🐱'}
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-mono font-black shadow-xs border border-white dark:border-slate-900 leading-none">
              LV.{userLevel}
            </span>
          </div>

          {/* Student Info */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                สวัสดี, {profile.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>เข้าสู่ระบบแล้ว</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {profile.selectedTitle || 'นักประดิษฐ์รุ่นเยาว์'}
              </span>
              <span>•</span>
              <span>{profile.grade || 'ป.4/1'}</span>
              <span>•</span>
              <span className="truncate max-w-[180px]">{profile.school || 'โรงเรียนคุณภาพ สพฐ.'}</span>
            </div>
          </div>
        </div>

        {/* Date and Quick Profile Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ภาพรวมกิจกรรมวันนี้
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>{todayDateString}</span>
            </span>
          </div>

          {onOpenProfile && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenProfile();
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="ดูโปรไฟล์และเกียรติบัตรของคุณ"
            >
              <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">โปรไฟล์</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Primary 3-Metric Highlight Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Lessons Completed */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/40 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <BookOpen className="w-4 h-4" />
                </span>
                <span>บทเรียนที่สำเร็จแล้ว</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                Lessons Completed
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                {completedModulesCount}
              </span>
              <span className="text-base font-bold text-slate-400 dark:text-slate-500">
                / 4 บทเรียนหลัก
              </span>
              <span className="ml-auto text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {progressPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(8, progressPercent)}%` }}
              />
            </div>

            {/* Sub-lessons Checklist Tags */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
              <span
                className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-medium ${
                  moduleProgress.safety
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {moduleProgress.safety && <Check className="w-3 h-3 text-emerald-600" />}
                <span>1. PDPA</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-medium ${
                  moduleProgress.thinking
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {moduleProgress.thinking && <Check className="w-3 h-3 text-emerald-600" />}
                <span>2. คิดเป็นขั้นตอน</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-medium ${
                  moduleProgress.codingLab
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {moduleProgress.codingLab && <Check className="w-3 h-3 text-emerald-600" />}
                <span>3. โค้ดดิ้ง</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-md flex items-center gap-1 font-medium ${
                  moduleProgress.showcase
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {moduleProgress.showcase && <Check className="w-3 h-3 text-emerald-600" />}
                <span>4. โชว์ผลงาน</span>
              </span>
            </div>
          </div>

          {/* Action Link */}
          <div className="pt-4 border-t border-indigo-100/70 dark:border-indigo-900/50 mt-4">
            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate(nextRecommendedModule.key);
              }}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            >
              <span>{completedModulesCount === 4 ? 'ทบทวนบทเรียนทั้งหมด' : 'เรียนต่อ: ' + nextRecommendedModule.label.slice(0, 18) + '...'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Card 2: Total Points Earned */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-yellow-50/40 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border border-amber-200/80 dark:border-amber-800/60 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Coins className="w-4 h-4" />
                </span>
                <span>คะแนนสะสมทั้งหมด</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                Total Points Earned
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-900 dark:text-amber-300 tabular-nums">
                {points}
              </span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                Coder Coins
              </span>
              <span className="ml-auto text-[11px] font-bold text-amber-800 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                LV.{userLevel}
              </span>
            </div>

            {/* Level Up Progress */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>ความก้าวหน้าสู่ LV.{userLevel + 1}</span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                  {pointsInCurrentLevel} / 75 แต้ม
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              สะสมแต้มจากการทำโจทย์มินิเกม ล่าบั๊ก ส่งการบ้าน และอ่าน e-Book เพื่อปลดล็อกฉายาสุดเท่
            </p>
          </div>

          {/* Action Link */}
          <div className="pt-4 border-t border-amber-100/70 dark:border-amber-900/50 mt-4 flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('rewards');
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ร้านค้าแลกรางวัล</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('leaderboard');
              }}
              className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              title="ดูตารางอันดับ Leaderboard"
            >
              <span>อันดับ</span>
            </button>
          </div>
        </div>

        {/* Card 3: Days in Streak WITH Visual Progress Bar */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50/90 via-white to-rose-50/40 dark:from-orange-950/40 dark:via-slate-900 dark:to-slate-900 border border-orange-200/80 dark:border-orange-800/60 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-950 dark:text-orange-300 uppercase tracking-wider">
                <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-xs">
                  <Flame className="w-4 h-4 fill-amber-200 text-amber-200" />
                </span>
                <span>เรียนรู้อย่างต่อเนื่อง</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300">
                Days in Streak
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-orange-600 dark:text-orange-400 tabular-nums">
                {currentStreak}
              </span>
              <span className="text-base font-bold text-slate-700 dark:text-slate-300">
                วันติดต่อกัน 🔥
              </span>
              <span className="ml-auto text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>

            {/* VISUAL REPRESENTATION: Learning Streak Progress Bar */}
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span>เป้าหมาย Streak สัปดาห์</span>
                  <span className="text-orange-600 dark:text-orange-400 font-bold">
                    ({currentStreak}/{streakMilestoneTarget} วัน)
                  </span>
                </span>
                <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
                  {streakProgressPercent}%
                </span>
              </div>

              {/* Progress Bar Container with Gradient Fill & Glow */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-orange-200/60 dark:border-orange-950 shadow-inner">
                <div
                  className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 h-full rounded-full transition-all duration-700 relative shadow-xs"
                  style={{ width: `${Math.max(6, streakProgressPercent)}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/40 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Milestones Checkpoints */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5 px-0.5">
                <span
                  className={`flex items-center gap-0.5 transition-colors ${
                    currentStreak >= 3 ? 'text-amber-700 dark:text-amber-400 font-bold' : ''
                  }`}
                >
                  <span>🥉 3 วัน</span>
                  {currentStreak >= 3 && <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />}
                </span>
                <span
                  className={`flex items-center gap-0.5 transition-colors ${
                    currentStreak >= 5 ? 'text-orange-700 dark:text-orange-400 font-bold' : ''
                  }`}
                >
                  <span>🥈 5 วัน</span>
                  {currentStreak >= 5 && <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />}
                </span>
                <span
                  className={`flex items-center gap-0.5 transition-colors ${
                    currentStreak >= 7 ? 'text-rose-600 dark:text-rose-400 font-bold' : ''
                  }`}
                >
                  <span>🏆 7 วัน (แชมป์)</span>
                  {currentStreak >= 7 && <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />}
                </span>
              </div>
            </div>

            {/* 7-Day Mini Dots Tracker */}
            <div className="mb-3 space-y-1">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
                <span>ตารางความต่อเนื่อง 7 วัน</span>
                <span className="font-semibold text-orange-600">สัปดาห์นี้</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day, idx) => {
                  const isPastOrToday = idx <= activeDayIndex;
                  return (
                    <div
                      key={day}
                      className={`text-center py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        isPastOrToday
                          ? 'bg-orange-500 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      <div>{day}</div>
                      <div className="text-[9px]">{isPastOrToday ? '✓' : '•'}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {hasCheckedInToday
                ? 'เช็คอินความสำเร็จวันนี้เรียบร้อยแล้ว! รักษาสถิตินี้ไว้ในวันพรุ่งนี้'
                : 'เช็คอินเรียนรู้วันนี้เพื่อเพิ่มจำนวนวัน Streak และรับแต้มโบนัส +15 แต้ม'}
            </p>
          </div>

          {/* Action Link: Daily Checkin */}
          <div className="pt-4 border-t border-orange-100/70 dark:border-orange-900/50 mt-4">
            <button
              onClick={handleDailyCheckIn}
              disabled={hasCheckedInToday}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                hasCheckedInToday
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white active:scale-98'
              }`}
            >
              {hasCheckedInToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>เช็คอินวันนี้แล้ว (+15 แต้ม)</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 fill-amber-200" />
                  <span>กดเช็คอินความสำเร็จวันนี้ (+15 แต้ม)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2.5 Daily Learning Goal Section with Confetti Celebration */}
      <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-amber-50/50 dark:from-slate-800/90 dark:via-slate-800 dark:to-indigo-950/40 border border-indigo-200/90 dark:border-indigo-800/70 shadow-xs space-y-3">
        {/* Celebration Banner when goal is completed */}
        {showCelebrationBanner && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-between gap-2 shadow-md animate-bounce">
            <div className="flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-amber-200 animate-spin" />
              <span>🎉 ยินดีด้วย! คุณทำเป้าหมายประจำวันสำเร็จแล้ว! รับ +10 Coder Coins และเพิ่มสถิติ Streak!</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Great Job!</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Target className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  เป้าหมายการเรียนรู้วันนี้ (Daily Goal)
                </h3>
                {todayGoal?.completed ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <Check className="w-3 h-3" />
                    <span>สำเร็จแล้ว (+10 แต้ม)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    <Clock className="w-3 h-3" />
                    <span>กำลังทำภารกิจ</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ทำภารกิจประจำวันให้สำเร็จเพื่อจุดพลุฉลอง Confetti และรับเหรียญรางวัลพิเศษ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {todayGoal?.completed && (
              <button
                type="button"
                onClick={() => {
                  fireConfetti('fireworks');
                  playCelebrationSound();
                  soundEffects.playFanfare();
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                title="จุดพลุฉลองเป้าหมายอีกครั้ง"
              >
                <PartyPopper className="w-3.5 h-3.5" />
                <span>ฉลองอีกครั้ง 🎉</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('showcase', 'dailyJournal')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>ไปที่ Daily Journal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Goal Card Body */}
        {todayGoal ? (
          <div
            className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              todayGoal.completed
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80'
                : 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-slate-700 hover:border-indigo-400'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              {/* Checkbox Button */}
              <button
                type="button"
                onClick={handleCompleteDailyGoal}
                className={`mt-0.5 shrink-0 transition-transform active:scale-90 p-0.5 rounded-lg cursor-pointer ${
                  todayGoal.completed
                    ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700'
                    : 'text-slate-400 hover:text-indigo-600'
                }`}
                title={todayGoal.completed ? 'คลิกเพื่อทบทวนสถานะเป้าหมาย' : 'คลิกเพื่อทำเป้าหมายสำเร็จและจุดพลุฉลอง! (+10 แต้ม)'}
              >
                {todayGoal.completed ? (
                  <CheckSquare className="w-6 h-6 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                ) : (
                  <Square className="w-6 h-6 hover:text-indigo-600 transition-colors" />
                )}
              </button>

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      todayGoal.category === 'coding'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : todayGoal.category === 'hardware'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : todayGoal.category === 'thinking'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : todayGoal.category === 'safety'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {todayGoal.category === 'coding'
                      ? '💻 โค้ดดิ้ง Scratch'
                      : todayGoal.category === 'hardware'
                      ? '⚡ Micro:bit V2'
                      : todayGoal.category === 'thinking'
                      ? '🧩 การคิดเชิงคำนวณ'
                      : todayGoal.category === 'safety'
                      ? '🛡️ ปลอดภัยไซเบอร์'
                      : '📝 สรุปความรู้'}
                  </span>
                  {todayGoal.completed && todayGoal.completedAt && (
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                      สำเร็จเมื่อ {todayGoal.completedAt}
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs sm:text-sm font-semibold transition-all ${
                    todayGoal.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {todayGoal.goal}
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="shrink-0 flex items-center gap-2">
              {!todayGoal.completed ? (
                <button
                  type="button"
                  onClick={handleCompleteDailyGoal}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>เช็คอินสำเร็จ & ฉลอง (+10 แต้ม)</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>บันทึกความสำเร็จแล้ว</span>
                </span>
              )}
            </div>
          </div>
        ) : (
          /* If no goal is set yet, display 1-click goal picker */
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-indigo-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                ยังไม่ได้ตั้งเป้าหมายวันนี้ เลือกตั้งเป้าหมาย 1 คลิกเพื่อเริ่มทำภารกิจ:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {quickGoalPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    onSetTodayGoal?.(preset.text, preset.category);
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-left transition-all flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">{preset.icon}</span>
                  <span className="truncate flex-1">{preset.text}</span>
                  <Plus className="w-3 h-3 text-indigo-500 shrink-0 opacity-70 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Recent Activity Stream & Quick Action Hub */}
      <div className="relative z-10 pt-2 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Recent Activity Feed (8 cols) */}
        <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>ประวัติกิจกรรมและแต้มสะสมล่าสุด (Recent Activity)</span>
            </div>
            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('rewards');
              }}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>ดูประวัติทั้งหมด</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {recentActivities.map((act, idx) => (
              <div
                key={act.id || idx}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm ${
                      act.category === 'safety'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                        : act.category === 'thinking'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300'
                        : act.category === 'coding'
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                    }`}
                  >
                    {act.category === 'safety' ? '🛡️' : act.category === 'thinking' ? '🧩' : act.category === 'coding' ? '💻' : '⭐'}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {act.timestamp}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs">
                    +{act.amount} แต้ม
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Action Hub (4 cols) */}
        <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white border border-indigo-800/50 flex flex-col justify-between space-y-3 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>ทางลัดเริ่มเรียนทันที</span>
            </div>
            <h4 className="text-sm font-bold text-white leading-snug">
              เลือกพื้นที่การเรียนรู้ที่คุณสนใจ
            </h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              ฝึกโค้ดดิ้ง ทำโจทย์ หรือเข้าสู่ห้องเรียนออนไลน์เพื่อส่งการบ้านประจำสัปดาห์
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('classroom');
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-all border border-white/10 cursor-pointer"
            >
              <div className="text-base mb-0.5">🏫</div>
              <div className="text-xs font-bold text-white truncate">ห้องเรียนเสมือน</div>
              <div className="text-[10px] text-indigo-300 truncate">ส่งการบ้าน & ตาราง</div>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('digitalLibrary');
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-all border border-white/10 cursor-pointer"
            >
              <div className="text-base mb-0.5">📖</div>
              <div className="text-xs font-bold text-white truncate">คลัง e-Book</div>
              <div className="text-[10px] text-teal-300 truncate">คู่มือ Micro:bit V2</div>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('codingLab');
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-all border border-white/10 cursor-pointer"
            >
              <div className="text-base mb-0.5">💻</div>
              <div className="text-xs font-bold text-white truncate">Coding Lab</div>
              <div className="text-[10px] text-sky-300 truncate">Scratch & Hardware</div>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate('showcase', 'dailyJournal');
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-all border border-white/10 cursor-pointer"
            >
              <div className="text-base mb-0.5">🔥</div>
              <div className="text-xs font-bold text-white truncate">Daily Journal</div>
              <div className="text-[10px] text-orange-300 truncate">บันทึกสะสมแต้ม</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
