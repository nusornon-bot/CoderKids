import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Cpu,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  TrendingUp,
  Target,
  Bot,
  FileText,
  GraduationCap,
  Brain,
  Swords,
  Trophy,
  Printer,
  Rocket,
  Binary,
  Zap,
  LineChart,
  Keyboard,
  QrCode,
  Compass,
  Music,
  CheckCircle2,
  Flame,
  LayoutGrid,
  CheckSquare,
  Square,
  ExternalLink,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';
import { Leaderboard } from './Leaderboard.tsx';
import { SkillsRadarChart } from './SkillsRadarChart.tsx';
import { AudioNarratorButton } from './AudioNarratorButton.tsx';
import { DashboardWidget } from './DashboardWidget.tsx';
import { WeeklyQuestsWidget } from './WeeklyQuestsWidget.tsx';
import { PersonalizedLearningMap } from './PersonalizedLearningMap.tsx';
import { INITIAL_LEADERBOARD, QUICK_GOAL_SUGGESTIONS } from '../data/learningData.ts';
import { UserProfile, TodayLearningGoal } from '../types/index.ts';

interface DashboardProps {
  onNavigate: (moduleKey: string, subSection?: string) => void;
  onOpenCertificate: () => void;
  onOpenProfile: () => void;
  profile: UserProfile;
  moduleProgress: {
    safety: boolean;
    thinking: boolean;
    codingLab: boolean;
    showcase: boolean;
  };
  points: number;
  isLoggedIn?: boolean;
  onOpenLogin?: () => void;
  todayGoal?: TodayLearningGoal | null;
  onToggleTodayGoal?: () => void;
  onSetTodayGoal?: (goal: string, category: 'coding' | 'hardware' | 'thinking' | 'safety' | 'reflection') => void;
  isAdmin?: boolean;
  onCelebrate?: () => void;
  onOpenAITutor?: () => void;
  onOpenGasExport?: () => void;
  onOpenBugHunter?: () => void;
  onOpenUnpluggedWorksheets?: () => void;
  onOpenAssessmentReport?: () => void;
  onOpenExamArena?: () => void;
  onOpenDigitalPassport?: () => void;
  onOpenTeacherPlans?: () => void;
  onOpenRubricModal?: () => void;
  onOpenParentTeacherKit?: () => void;
  onOpenClassroomBattle?: () => void;
  onOpenCodeTyper?: () => void;
  onOpenPairArena?: () => void;
  onOpenStemPacks?: () => void;
  onOpenTeacherMastery?: () => void;
  onOpenHeroCards?: () => void;
  onOpenSmartExam?: () => void;
  onOpenCodeTracer?: () => void;
  onOpenStudentQRPass?: () => void;
  addPoints?: (amount: number, reason: string, category?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenCertificate,
  onOpenProfile,
  profile,
  moduleProgress,
  points,
  isLoggedIn = false,
  onOpenLogin,
  todayGoal,
  onToggleTodayGoal,
  onSetTodayGoal,
  isAdmin = false,
  onCelebrate,
  onOpenAITutor,
  onOpenGasExport,
  onOpenBugHunter,
  onOpenUnpluggedWorksheets,
  onOpenAssessmentReport,
  onOpenExamArena,
  onOpenDigitalPassport,
  onOpenTeacherPlans,
  onOpenRubricModal,
  onOpenParentTeacherKit,
  onOpenClassroomBattle,
  onOpenCodeTyper,
  onOpenPairArena,
  onOpenStemPacks,
  onOpenTeacherMastery,
  onOpenHeroCards,
  onOpenSmartExam,
  onOpenCodeTracer,
  onOpenStudentQRPass,
  addPoints,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'curriculum' | 'labs' | 'stem' | 'teacher'>('all');

  const completedCount = Object.values(moduleProgress).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 4) * 100);

  // Next Recommended Mission (The "One Next Action" Principle)
  const nextRecommended = useMemo(() => {
    if (!moduleProgress.safety) {
      return {
        key: 'safety',
        stepNum: '01',
        title: '01. ความปลอดภัยดิจิทัล & PDPA',
        desc: 'เรียนรู้การปกป้องข้อมูลส่วนบุคคล, สร้างรหัสผ่านที่ปลอดภัย และจำแนกภัยออนไลน์',
        badge: 'ก้าวแรกของคุณ',
        btnText: 'เริ่มเรียนรู้ก้าวที่ 1 (ความปลอดภัย)',
        gradient: 'from-emerald-600 to-teal-700',
        textColor: 'text-emerald-400',
      };
    }
    if (!moduleProgress.thinking) {
      return {
        key: 'thinking',
        stepNum: '02',
        title: '02. การคิดเชิงคำนวณ & Flowchart',
        desc: 'ฝึก 4 เสาหลัก CT, การเขียนผังงานแก้ปัญหา และเกมเขาวงกต 3 ระดับ',
        badge: 'ภารกิจต่อเนื่อง',
        btnText: 'ลุยต่อก้าวที่ 2 (การคิดเชิงคำนวณ)',
        gradient: 'from-sky-600 to-indigo-700',
        textColor: 'text-sky-400',
      };
    }
    if (!moduleProgress.codingLab) {
      return {
        key: 'codingLab',
        stepNum: '03',
        title: '03. ปฏิบัติการ Scratch & Micro:bit V2',
        desc: 'ลงมือเขียนบล็อกคำสั่ง Scratch และเชื่อมต่อบอร์ดจำลองฮาร์ดแวร์ Micro:bit V2',
        badge: 'ลงมือปฏิบัติจริง',
        btnText: 'เข้าห้องแล็บก้าวที่ 3 (Scratch & Micro:bit)',
        gradient: 'from-indigo-600 to-blue-700',
        textColor: 'text-indigo-400',
      };
    }
    if (!moduleProgress.showcase) {
      return {
        key: 'showcase',
        stepNum: '04',
        title: '04. แสดงผลงาน & ขอรับเกียรติบัตร',
        desc: 'ส่งโครงงาน ชื่นชมผลงานเพื่อน 2 Stars & A Wish และรับเกียรติบัตรทางการ',
        badge: 'ด่านสุดท้ายสู่ความสำเร็จ',
        btnText: 'ไปที่ก้าวที่ 4 (ผลงาน & เกียรติบัตร)',
        gradient: 'from-purple-600 to-pink-700',
        textColor: 'text-purple-400',
      };
    }
    return {
      key: 'certificate',
      stepNum: '04',
      title: 'สำเร็จครบ 4 ก้าวการเรียนรู้สมบูรณ์!',
      desc: 'ยอดเยี่ยมมาก! คุณผ่านครบทั้ง 4 ด้านตามมาตรฐาน สพฐ. / สสวท. สามารถเปิดรับเกียรติบัตรได้ทันที',
      badge: 'สำเร็จสมบูรณ์ 100%',
      btnText: 'เปิดดูเกียรติบัตรทางการ 🎓',
      gradient: 'from-amber-600 to-orange-700',
      textColor: 'text-amber-400',
    };
  }, [moduleProgress]);

  return (
    <div className="space-y-8 pb-20">
      {/* ----------------- 1. BENTO CATEGORY FILTER CONTROLS ----------------- */}
      <div className="sticky top-16 z-20 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md py-2 -mx-2 px-2 sm:mx-0 sm:px-0">
        <div className="p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => {
              soundEffects.play('click');
              setActiveCategory('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>ภาพรวมทั้งหมด (Bento Grid)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.play('click');
              setActiveCategory('curriculum');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeCategory === 'curriculum'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>4 ก้าวหลักการเรียนรู้</span>
            <span className="font-mono text-[11px] tabular-nums opacity-80">{progressPercent}%</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.play('click');
              setActiveCategory('labs');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeCategory === 'labs'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>มินิแล็บ &amp; สังเวียนประลอง</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.play('click');
              setActiveCategory('stem');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeCategory === 'stem'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-teal-400" />
            <span>โครงงาน STEM &amp; ฮาร์ดแวร์</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.play('click');
              setActiveCategory('teacher');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeCategory === 'teacher'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            <span>ศูนย์ครู &amp; ผู้ปกครอง</span>
          </button>
        </div>
      </div>

      {/* ----------------- 2. TOP BENTO ROW: HERO FOCUS + PROGRESS MASTERY ----------------- */}
      {(activeCategory === 'all' || activeCategory === 'curriculum') && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* BENTO BOX 1: Main Focus & Next Action (Col Span 7) */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-900 text-white border border-slate-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="space-y-4 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-indigo-400">มาตรฐาน สพฐ. / สสวท. ว 4.2</span>
                  <span aria-hidden="true">·</span>
                  <span>ป.4 – ป.6</span>
                </div>
                <AudioNarratorButton
                  textToRead="ศูนย์รวมการเรียนรู้วิทยาการคำนวณและโค้ดดิ้ง สพฐ. และ สสวท. เรียนรู้เป็นขั้นตอน ฝึกคิดอย่างเป็นระบบ และลงมือปฏิบัติจริงในห้องทดลองเสมือน"
                  label="ฟังเสียงแนะนำ"
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
                  ยินดีต้อนรับ, {profile.name || 'โปรแกรมเมอร์รุ่นจิ๋ว'} 👋
                </h1>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  เรียนรู้วิทยาการคำนวณอย่างเป็นขั้นตอน ปฏิบัติการในห้องทดลองเสมือนจริง และสร้างนวัตกรรมดิจิทัลแห่งอนาคต
                </p>
              </div>

              {/* Sub-card: One Next Action Tile */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>ภารกิจแนะนำถัดไป ({nextRecommended.badge})</span>
                  </span>
                  <span className="font-mono text-slate-400">{nextRecommended.stepNum}</span>
                </div>
                <div className="text-base font-bold text-white">{nextRecommended.title}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{nextRecommended.desc}</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 mt-4 border-t border-slate-800 flex flex-wrap items-center gap-3 relative z-10">
              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  if (nextRecommended.key === 'certificate') {
                    onOpenCertificate();
                  } else {
                    onNavigate(nextRecommended.key);
                  }
                }}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r ${nextRecommended.gradient} hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer`}
              >
                <span>{nextRecommended.btnText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenAITutor && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.play('click');
                    onOpenAITutor();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all active:scale-95 cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>ปรึกษาครูพี่โค้ด AI</span>
                </button>
              )}
            </div>
          </div>

          {/* BENTO BOX 2: Progress & Competency Mastery (Col Span 5) */}
          <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  Progress &amp; Mastery
                </span>
                <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  ระดับชั้น {profile.grade || 'ป.4'}
                </span>
              </div>

              {/* Progress Bar & Numerical Metrics */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                    {progressPercent}%
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                    สำเร็จแล้ว {completedCount} / 4 ขั้นหลัก
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Competency 4-Step Checklist */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-medium text-slate-700 dark:text-slate-300">01 ความปลอดภัยดิจิทัล &amp; PDPA</span>
                  {moduleProgress.safety ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">รอดำเนินการ</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-medium text-slate-700 dark:text-slate-300">02 การคิดเชิงคำนวณ &amp; Flowchart</span>
                  {moduleProgress.thinking ? (
                    <span className="text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">รอดำเนินการ</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-medium text-slate-700 dark:text-slate-300">03 Scratch &amp; Micro:bit V2</span>
                  {moduleProgress.codingLab ? (
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">รอดำเนินการ</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs py-1.5">
                  <span className="font-medium text-slate-700 dark:text-slate-300">04 โครงงาน &amp; รับเกียรติบัตร</span>
                  {moduleProgress.showcase ? (
                    <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">รอดำเนินการ</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Meta Stats */}
            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {points.toLocaleString()} XP
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-500" />
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {profile.unlockedRewardIds?.length || 0} รางวัล
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenProfile}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                ดูโปรไฟล์
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ----------------- 3. SECOND BENTO ROW: LATEST ACTIVITY & QUICK LINKS ----------------- */}
      {(activeCategory === 'all' || activeCategory === 'curriculum') && (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* BENTO BOX 3: Latest Activity & Today's Goal (Col Span 5) */}
          <div className="md:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  Latest Activity &amp; Goals
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Streak {profile.streakDays || 1} วัน</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  เป้าหมายการเรียนรู้วันนี้
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ตั้งเป้าหมายเล็กๆ วันละข้อเพื่อพัฒนาอย่างต่อเนื่อง
                </p>
              </div>

              {/* Goal Card with Interactive Toggle */}
              {todayGoal ? (
                <div
                  onClick={() => {
                    soundEffects.play('click');
                    if (onToggleTodayGoal) onToggleTodayGoal();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    todayGoal.completed
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="mt-0.5 text-emerald-600 dark:text-emerald-400">
                    {todayGoal.completed ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className={`text-xs font-bold ${todayGoal.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {todayGoal.goal}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>หมวด: {todayGoal.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono tabular-nums">
                        {todayGoal.completed ? '+20 XP (สำเร็จแล้ว)' : '+20 XP'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ยังไม่ได้ตั้งเป้าหมายวันนี้ คลิกเลือกภารกิจด่วนได้ทันที:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {QUICK_GOAL_SUGGESTIONS.slice(0, 2).map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          soundEffects.play('click');
                          if (onSetTodayGoal) onSetTodayGoal(item.goal, item.category);
                        }}
                        className="p-2.5 rounded-xl text-left text-xs bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-slate-700 dark:text-slate-300 truncate">{item.goal}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              {onOpenDigitalPassport && (
                <button
                  type="button"
                  onClick={onOpenDigitalPassport}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  <span>สมุดพาสปอร์ตดิจิทัล</span>
                </button>
              )}
              {onOpenCertificate && (
                <button
                  type="button"
                  onClick={onOpenCertificate}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  เกียรติบัตรทางการ
                </button>
              )}
            </div>
          </div>

          {/* BENTO BOX 4: Quick Links & Creative Tools (Col Span 7) */}
          <div className="md:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  Quick Links &amp; Tools
                </span>
                <span className="text-xs text-slate-400">เข้าถึงเครื่องมือหลักทันที</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  เครื่องมือลัด &amp; ห้องปฏิบัติการสร้างสรรค์
                </h3>
              </div>

              {/* 6 Quick Action Bento Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Microbit Music Lab */}
                <button
                  type="button"
                  onClick={() => onNavigate('musicLab')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/30 border border-slate-200 dark:border-slate-700 hover:border-purple-300 transition-all text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Music Lab 🎵</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">แต่งเพลง Web Audio</div>
                </button>

                {/* 3D Hardware Library */}
                <button
                  type="button"
                  onClick={() => onNavigate('digitalLibrary')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-slate-200 dark:border-slate-700 hover:border-teal-300 transition-all text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">โมเดล 3D 🔬</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">ฮาร์ดแวร์ Micro:bit</div>
                </button>

                {/* Kids Code Typer */}
                {onOpenCodeTyper && (
                  <button
                    type="button"
                    onClick={onOpenCodeTyper}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition-all text-left group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Keyboard className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Code Typer ⌨️</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">ฝึกพิมพ์ WPM</div>
                  </button>
                )}

                {/* Smart Exam */}
                {onOpenSmartExam && (
                  <button
                    type="button"
                    onClick={onOpenSmartExam}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-violet-50 dark:hover:bg-violet-950/30 border border-slate-200 dark:border-slate-700 hover:border-violet-300 transition-all text-left group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Smart Exam 📝</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">ข้อสอบปลายภาค</div>
                  </button>
                )}

                {/* Binary Pixel Art */}
                <button
                  type="button"
                  onClick={() => onNavigate('binaryLab')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 transition-all text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Binary className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Binary Pixel 👾</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">เลขฐานสอง 8x8</div>
                </button>

                {/* AI Tutor */}
                {onOpenAITutor && (
                  <button
                    type="button"
                    onClick={onOpenAITutor}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-pink-50 dark:hover:bg-pink-950/30 border border-slate-200 dark:border-slate-700 hover:border-pink-300 transition-all text-left group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">AI Tutor 🤖</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">ถามตอบบทเรียน</div>
                  </button>
                )}

                {/* Code Examples Gallery */}
                <button
                  type="button"
                  onClick={() => onNavigate('codingLab', 'examplesGallery')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-all text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <span>คลังโจทย์โค้ด 📚</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">ถอดรหัสบล็อกโค้ด</div>
                </button>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>เข้าสู่ห้องปฏิบัติการที่ต้องการเพื่อฝึกฝนทักษะเพิ่มเติม</span>
            </div>
          </div>
        </section>
      )}

      {/* ----------------- 4. CORE CURRICULUM BENTO GRID (01 - 04) ----------------- */}
      {(activeCategory === 'all' || activeCategory === 'curriculum') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                Core Curriculum
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                4 ก้าวหลักการเรียนรู้วิทยาการคำนวณ (สพฐ. &amp; สสวท.)
              </h2>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              เรียนรู้เป็นลำดับขั้นตอน 01 ➔ 02 ➔ 03 ➔ 04
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bento Step 01 */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-200 ${
              moduleProgress.safety
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 shadow-sm'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    01
                  </span>
                  {moduleProgress.safety ? (
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">ก้าวแรก</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ความปลอดภัยดิจิทัล &amp; PDPA
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  ปกป้องข้อมูลส่วนบุคคลตามกฎหมาย PDPA, เช็ครหัสผ่าน และแยกแยะภัยออนไลน์
                </p>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                  <span>PDPA</span>
                  <span aria-hidden="true">·</span>
                  <span>Passphrase</span>
                  <span aria-hidden="true">·</span>
                  <span>Quiz 5 ข้อ</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onNavigate('safety')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <span>{moduleProgress.safety ? 'ทบทวนบทเรียนที่ 1' : 'เริ่มเรียนรู้ก้าวที่ 1'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bento Step 02 */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-200 ${
              moduleProgress.thinking
                ? 'bg-sky-50/40 dark:bg-sky-950/20 border-sky-300 dark:border-sky-800 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-300 shadow-sm'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-sky-600 dark:text-sky-400">
                    02
                  </span>
                  {moduleProgress.thinking ? (
                    <span className="text-xs font-bold text-sky-700 dark:text-sky-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">ก้าวที่สอง</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  การคิดเชิงคำนวณ &amp; Flowchart
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  ฝึก 4 เสาหลัก CT, โครงสร้างลำดับ ทางเลือก If-Else และเกมอัลกอริทึม
                </p>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                  <span>4 เสา CT</span>
                  <span aria-hidden="true">·</span>
                  <span>Flowchart</span>
                  <span aria-hidden="true">·</span>
                  <span>เขาวงกต 3 ด่าน</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onNavigate('thinking')}
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <span>{moduleProgress.thinking ? 'ทบทวนบทเรียนที่ 2' : 'เข้าสู่บทเรียนก้าวที่ 2'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bento Step 03 */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-200 ${
              moduleProgress.codingLab
                ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 shadow-sm'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    03
                  </span>
                  {moduleProgress.codingLab ? (
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">ปฏิบัติการจริง</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Scratch Studio &amp; Micro:bit V2
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  ต่อบล็อกคำสั่งแอนิเมชัน Scratch และเขียนโปรแกรมบอร์ด Micro:bit จำลอง
                </p>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                  <span>Scratch Studio</span>
                  <span aria-hidden="true">·</span>
                  <span>บอร์ดจำลอง</span>
                  <span aria-hidden="true">·</span>
                  <span>เซนเซอร์แสง/อุณหภูมิ</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onNavigate('codingLab')}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <span>{moduleProgress.codingLab ? 'ทบทวนห้องแล็บที่ 3' : 'เข้าห้องแล็บก้าวที่ 3'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bento Step 04 */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-200 ${
              moduleProgress.showcase
                ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300 shadow-sm'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-purple-600 dark:text-purple-400">
                    04
                  </span>
                  {moduleProgress.showcase ? (
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านแล้ว
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">ก้าวสุดท้าย</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  แสดงผลงาน &amp; รับเกียรติบัตร
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  ส่งโครงงาน ชื่นชมผลงาน 2 Stars &amp; A Wish และขอรับเกียรติบัตรทางการ
                </p>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                  <span>แกลเลอรีโครงงาน</span>
                  <span aria-hidden="true">·</span>
                  <span>2 Stars &amp; Wish</span>
                  <span aria-hidden="true">·</span>
                  <span>เกียรติบัตร สพฐ.</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onNavigate('showcase')}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  <span>{moduleProgress.showcase ? 'ดูผลงานและเกียรติบัตร' : 'เข้าสู่ก้าวที่ 4'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ----------------- 5. MINI-LABS & ARENAS BENTO ----------------- */}
      {(activeCategory === 'all' || activeCategory === 'labs') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400">
                Interactive Labs &amp; Arenas
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                มินิแล็บปฏิบัติการ &amp; สังเวียนประลองโค้ด
              </h2>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              ฝึกฝนทักษะการคิดคำนวณและประลองความเร็วผ่านเกมการเรียนรู้
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bebras Arena */}
            <div
              onClick={() => onNavigate('bebrasArena')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    🦫
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    มาตรฐานนานาชาติ
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Bebras Thailand Arena
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  ประลอง 4 เสาหลักการคิดเชิงคำนวณ: เขื่อนบีเวอร์, สับรางรถไฟ, ถอดรหัสลูป และแยกส่วนปัญหา
                </p>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                  <span>เขื่อนบีเวอร์</span>
                  <span aria-hidden="true">·</span>
                  <span>สับรางรถไฟ</span>
                  <span aria-hidden="true">·</span>
                  <span>จับเวลา</span>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>เข้าสู่สังเวียน Bebras</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Live Classroom Coding Battle */}
            {onOpenClassroomBattle && (
              <div
                onClick={onOpenClassroomBattle}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                      <Zap className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      แข่งขันสดห้องเรียน
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Live Classroom Coding Battle ⚡
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    แข่งสปรินท์แก้โค้ดสดในห้องเรียน 5 ข้อ ตะลุยด่าน Scratch &amp; Python แบบเรียลไทม์
                  </p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <span>5 ข้อสปรินท์</span>
                    <span aria-hidden="true">·</span>
                    <span>กระดานคะแนนสด</span>
                    <span aria-hidden="true">·</span>
                    <span>เสียงเชียร์</span>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                  <span>เปิดห้องประลองสด</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

            {/* Pair Programming Arena */}
            {onOpenPairArena && (
              <div
                onClick={onOpenPairArena}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                      <Swords className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      จอแยก 2 ผู้เล่น
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Pair Programming Arena ⚔️
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    ดวลแก้โค้ด 2 คนบนจอเดียว หรือโหมดคนขับ-ผู้นำทาง (Driver &amp; Navigator) จับเวลาสลับบทบาท
                  </p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <span>จอแยก 2 ฝั่ง</span>
                    <span aria-hidden="true">·</span>
                    <span>Driver &amp; Navigator</span>
                    <span aria-hidden="true">·</span>
                    <span>สลับคีย์บอร์ด</span>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-pink-600 dark:text-pink-400">
                  <span>เปิดสังเวียนประลองคู่</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ----------------- 6. STEM & HARDWARE BENTO ----------------- */}
      {(activeCategory === 'all' || activeCategory === 'stem') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-teal-600 dark:text-teal-400">
                STEM &amp; Hardware Labs
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                โครงงานสะเต็ม &amp; ฮาร์ดแวร์จำลอง
              </h2>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              สร้างนวัตกรรม IoT โค้ดเสียงดนตรี และการจำลองระบบฮาร์ดแวร์ Micro:bit เสมือนจริง
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Microbit Music Lab */}
            <div
              onClick={() => onNavigate('musicLab')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                    <Music className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Web Audio API
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Micro:bit Music Lab 🎵
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  แต่งเพลง 16 จังหวะ, กราฟิกคลื่นเสียง Oscilloscope, คลังทำนองเพลง และแปลงเป็นโค้ด MakeCode / Python
                </p>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                  <span>16 บีต</span>
                  <span aria-hidden="true">·</span>
                  <span>คลื่นเสียงสด</span>
                  <span aria-hidden="true">·</span>
                  <span>คลังเมโลดี้</span>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                <span>เปิดห้องแล็บดนตรี</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 3D Hardware & e-Book */}
            <div
              onClick={() => onNavigate('digitalLibrary')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    3D Interactive Model
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  โมเดล 3D Micro:bit &amp; คลัง e-Book
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  ศึกษาฮาร์ดแวร์ Micro:bit V2 ในรูปแบบ 3 มิติหมุนได้รอบทิศทาง พร้อมคู่มือและใบความรู้
                </p>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                  <span>หมุน 360°</span>
                  <span aria-hidden="true">·</span>
                  <span>บอร์ด V2</span>
                  <span aria-hidden="true">·</span>
                  <span>เซนเซอร์ 5 ชนิด</span>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                <span>เปิดคลัง 3D &amp; e-Book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* STEM Projects Hub */}
            <div
              onClick={() => onNavigate('stemProjects')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    6 โครงงาน + Canvas
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  คลังโครงงาน STEM Project Hub 🚀
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Smart Farm, ถังขยะเซ็นเซอร์, เครื่องเตือนน้ำท่วม พร้อมตัวสร้าง Project Canvas พิมพ์ A4
                </p>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                  <span>Smart Farm</span>
                  <span aria-hidden="true">·</span>
                  <span>เตือนน้ำท่วม</span>
                  <span aria-hidden="true">·</span>
                  <span>Canvas A4</span>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>สำรวจโครงงานต้นแบบ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ----------------- 7. INSIGHTS & LEADERBOARD BENTO ----------------- */}
      {(activeCategory === 'all' || activeCategory === 'curriculum') && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                Insights &amp; Hall of Fame
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                สถิติเชิงลึก &amp; ตารางอันดับนักเรียน
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
              <SkillsRadarChart
                moduleProgress={moduleProgress}
                points={points}
                profile={profile}
                onNavigate={onNavigate}
              />
            </div>

            <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
              <Leaderboard
                initialEntries={INITIAL_LEADERBOARD}
                currentUserPoints={points}
                completedModulesCount={completedCount}
                onOpenCertificate={onOpenCertificate}
                isAdmin={isAdmin}
                profile={profile}
                onNavigate={onNavigate}
              />
            </div>
          </div>
        </section>
      )}

      {/* ----------------- 8. TEACHER & PARENT BENTO ----------------- */}
      {(activeCategory === 'all' || activeCategory === 'teacher') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-purple-600 dark:text-purple-400">
                Educators &amp; Parents
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                ศูนย์เครื่องมือคุณครู &amp; ผู้ปกครอง (สพฐ. ว 4.2)
              </h2>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              ระบบสนับสนุนการจัดการเรียนรู้ การวัดผลประเมินผล และเอกสารราชการ
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* PorPor5 Mastery Hub */}
            {onOpenTeacherMastery && (
              <div
                onClick={onOpenTeacherMastery}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    บันทึกคะแนน ปพ.5 (ว 4.2)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    บันทึกคะแนนตัวชี้วัด ป.4-6, รูบริกประเมินสมรรถนะ คลังแผน 5E และส่งออก CSV
                  </p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <span>ป.4-6</span>
                    <span aria-hidden="true">·</span>
                    <span>ส่งออก CSV</span>
                    <span aria-hidden="true">·</span>
                    <span>รูบริกส์</span>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                  <span>เปิดศูนย์ ปพ.5</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

            {/* Smart Exam Generator */}
            {onOpenSmartExam && (
              <div
                onClick={onOpenSmartExam}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    ข้อสอบปลายภาค Smart Exam
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    สุ่มข้อสอบ 5-10 ข้อ จับเวลาตรวจผลอัตโนมัติ หรือพิมพ์ข้อสอบพร้อมกระดาษคำตอบ A4
                  </p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <span>สุ่มข้อสอบ</span>
                    <span aria-hidden="true">·</span>
                    <span>จับเวลา</span>
                    <span aria-hidden="true">·</span>
                    <span>พิมพ์ A4</span>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-violet-600 dark:text-violet-400">
                  <span>สร้างชุดข้อสอบ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

            {/* Unplugged Worksheets */}
            {onOpenUnpluggedWorksheets && (
              <div
                onClick={onOpenUnpluggedWorksheets}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                    <Printer className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    ใบงาน Unplugged (พิมพ์ A4)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    ผังงาน Flowchart, ถอดรหัส Binary, เขาวงกตคำสั่ง สำหรับห้องเรียนไม่มีคอม
                  </p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <span>Flowchart</span>
                    <span aria-hidden="true">·</span>
                    <span>Binary</span>
                    <span aria-hidden="true">·</span>
                    <span>QR เฉลย</span>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>เปิดคลังใบงาน A4</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

            {/* Rubrics & Teacher Plans */}
            {onOpenTeacherPlans && (
              <div
                onClick={onOpenTeacherPlans}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    แผนการจัดการเรียนรู้ 8 แผน
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    แผนการสอน K-P-A บันทึกหลังสอน 3 ขั้น เกณฑ์รูบริก และโหมดเปิดสไลด์สอนสด
                  </p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <span>8 แผนสอน</span>
                    <span aria-hidden="true">·</span>
                    <span>สไลด์สอน</span>
                    <span aria-hidden="true">·</span>
                    <span>รูบริกส์</span>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span>เปิดดูแผนการสอน</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
