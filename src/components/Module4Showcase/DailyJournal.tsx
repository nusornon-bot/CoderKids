import React, { useState, useEffect } from 'react';
import { UserProfile, DailyJournalEntry, TodayLearningGoal } from '../../types/index.ts';
import { INITIAL_DAILY_JOURNALS, QUICK_GOAL_SUGGESTIONS } from '../../data/learningData.ts';
import {
  TARGET_SPREADSHEET_ID,
  auth,
  saveDailyJournalToGoogleSheet,
} from '../../services/googleSheetsService.ts';
import {
  Flame,
  Calendar,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Send,
  FileSpreadsheet,
  Plus,
  Smile,
  Zap,
  Tag,
  Target,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Share2,
  CheckSquare,
  Square,
  Edit3,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyJournalProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  addPoints: (points: number, reason?: string, category?: 'safety' | 'thinking' | 'coding' | 'showcase' | 'classroom') => void;
  onNavigateModule?: (moduleKey: string, subSection?: string) => void;
  todayGoal?: TodayLearningGoal | null;
  onSetTodayGoal?: (goal: string, category: 'coding' | 'hardware' | 'thinking' | 'safety' | 'reflection') => void;
  onToggleTodayGoal?: () => void;
}

const MOOD_OPTIONS = [
  { id: 'excited', emoji: '🤩', label: 'สนุกและตื่นเต้น', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'inspired', emoji: '💡', label: 'เกิดไอเดียใหม่', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { id: 'accomplished', emoji: '🚀', label: 'ทำภารกิจสำเร็จ', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'challenged', emoji: '🤔', label: 'ท้าทายต้องคิดเยอะ', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  { id: 'tired', emoji: '😴', label: 'เหนื่อยแต่ได้ความรู้', color: 'bg-purple-100 text-purple-800 border-purple-300' },
] as const;

const CATEGORY_OPTIONS = [
  { id: 'coding', label: '🐱 Scratch Visual Code', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'hardware', label: '📟 Micro:bit & IoT', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'thinking', label: '🧩 การคิดเชิงคำนวณ & อัลกอริทึม', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'safety', label: '🛡️ ความปลอดภัยดิจิทัล & PDPA', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'reflection', label: '⭐ ชุมชนแลกเปลี่ยน & นำเสนอ', color: 'bg-purple-50 text-purple-700 border-purple-200' },
] as const;

const QUICK_ACTIVITY_TEMPLATES = [
  {
    category: 'coding' as const,
    activity: 'เขียนบล็อก Scratch คำสั่งลูป Forever เพื่อให้ตัวละครเคลื่อนไหวและเก็บแต้ม',
    learningKey: 'การใช้ Event When Green Flag Clicked ร่วมกับ Variables เพื่อสร้างตัวแปรนับคะแนน',
    challengeFaced: 'ตัวละครกระพริบ แก้ด้วยการใส่คำสั่ง wait 0.05 วินาทีในลูป',
    tomorrowGoal: 'เพิ่มระบบพลังชีวิต (Lives) และเพลงประกอบ',
  },
  {
    category: 'hardware' as const,
    activity: 'ต่อวงจร Micro:bit V2 จำลองเซ็นเซอร์วัดอุณหภูมิและความชื้นสัมพัทธ์',
    learningKey: 'การอ่านค่า Analog Pin และแสดงสัญลักษณ์ไอคอนพระอาทิตย์บนจอ LED 5x5',
    challengeFaced: 'ค่าอุณหภูมิกระโดด แก้โดยคำนวณค่าเฉลี่ย 3 ครั้งล่าสุด',
    tomorrowGoal: 'ต่อลำโพง Buzzer ให้ส่งเสียงเตือนเมื่อร้อนเกิน 35 องศา',
  },
  {
    category: 'safety' as const,
    activity: 'ทำแบบทดสอบวิเคราะห์กรณีศึกษา PDPA และการจัดการรหัสผ่านแบบ 2 ปัจจัย (2FA)',
    learningKey: 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data) ต้องได้รับการปกป้องอย่างเคร่งครัด',
    challengeFaced: 'จำสัญลักษณ์อักขระพิเศษสำหรับรหัสผ่าน แก้โดยใช้วิธีรหัสผ่านแบบวลี Passphrase',
    tomorrowGoal: 'แชร์เทคนิคการตั้งรหัสผ่านปลอดภัยให้เพื่อนในห้องเรียน',
  },
  {
    category: 'thinking' as const,
    activity: 'ฝึกวิเคราะห์ปัญหาด้วย 4 เสาหลัก Computational Thinking ในด่านเกมเขาวงกต',
    learningKey: 'Decomposition ช่วยแตกด่านยากๆ ออกเป็น 3 ส่วน: เลี้ยวซ้าย, เดินหน้า, หลบสิ่งกีดขวาง',
    challengeFaced: 'หุ่นยนต์เดินวนลูปไม่รู้จบ แก้โดยเพิ่มเงื่อนไข If Goal Reached Then Break',
    tomorrowGoal: 'ออกแบบเกมเขาวงกตของตัวเองให้เพื่อนมาทดลองเล่น',
  },
];

export const DailyJournal: React.FC<DailyJournalProps> = ({
  profile,
  onUpdateProfile,
  addPoints,
  onNavigateModule,
  todayGoal,
  onSetTodayGoal,
  onToggleTodayGoal,
}) => {
  // Saved Journals State
  const [journals, setJournals] = useState<DailyJournalEntry[]>(() => {
    const saved = localStorage.getItem('coderkids_daily_journals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DAILY_JOURNALS;
  });

  // Today Date String (YYYY-MM-DD)
  const todayDateStr = new Date().toISOString().split('T')[0];

  // Learning Goal for Today state
  const [goalText, setGoalText] = useState(todayGoal?.goal || '');
  const [goalCategory, setGoalCategory] = useState<'coding' | 'hardware' | 'thinking' | 'safety' | 'reflection'>(
    todayGoal?.category || 'coding'
  );
  const [isEditingGoal, setIsEditingGoal] = useState(!todayGoal);

  useEffect(() => {
    if (todayGoal) {
      setGoalText(todayGoal.goal);
      setGoalCategory(todayGoal.category);
    }
  }, [todayGoal]);

  const handleSaveGoal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!goalText.trim()) return;
    if (onSetTodayGoal) {
      onSetTodayGoal(goalText.trim(), goalCategory);
      setIsEditingGoal(false);
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
      setStatusMsg({
        text: 'บันทึกเป้าหมายการเรียนรู้วันนี้เรียบร้อย! เชื่อมโยงเป็น Checklist บนแดชบอร์ดหลักแล้ว 🎯',
        type: 'success',
      });
    }
  };

  const handleSelectQuickGoal = (suggestion: typeof QUICK_GOAL_SUGGESTIONS[0]) => {
    setGoalText(suggestion.goal);
    setGoalCategory(suggestion.category);
  };

  // Form states
  const [date, setDate] = useState(todayDateStr);
  const [mood, setMood] = useState<typeof MOOD_OPTIONS[number]['id']>('accomplished');
  const [category, setCategory] = useState<typeof CATEGORY_OPTIONS[number]['id']>('coding');
  const [activity, setActivity] = useState('');
  const [learningKey, setLearningKey] = useState('');
  const [challengeFaced, setChallengeFaced] = useState('');
  const [tomorrowGoal, setTomorrowGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncToGoogleSheet, setSyncToGoogleSheet] = useState(true);

  // Status message
  const [statusMsg, setStatusMsg] = useState<{
    text: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  // Filter state for journal history
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  // Save journals to LocalStorage
  useEffect(() => {
    localStorage.setItem('coderkids_daily_journals', JSON.stringify(journals));
  }, [journals]);

  // Calculate current streak
  const currentStreak = profile.streakDays || 4;

  // Check if today already logged
  const hasLoggedToday = journals.some((j) => j.date === todayDateStr);

  // Selected mood metadata
  const activeMoodMeta = MOOD_OPTIONS.find((m) => m.id === mood) || MOOD_OPTIONS[0];

  // Quick template filler
  const handleApplyTemplate = (tpl: typeof QUICK_ACTIVITY_TEMPLATES[0]) => {
    setCategory(tpl.category);
    setActivity(tpl.activity);
    setLearningKey(tpl.learningKey);
    setChallengeFaced(tpl.challengeFaced);
    setTomorrowGoal(tpl.tomorrowGoal);
    setStatusMsg({ text: 'ดึงแม่แบบกิจกรรมตัวอย่างเรียบร้อย คุณสามารถปรับแก้ข้อความได้ตามต้องการ', type: 'info' });
  };

  // Submit daily journal
  const handleSubmitJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim() || !learningKey.trim()) {
      setStatusMsg({ text: 'กรุณากรอกกิจกรรมที่ทำ และสิ่งที่ได้เรียนรู้ใหม่ในวันนี้', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const pointsAwarded = hasLoggedToday ? 10 : 20; // 20 points for new day streak, 10 for bonus entry
    const newStreak = hasLoggedToday ? currentStreak : currentStreak + 1;

    const newEntry: DailyJournalEntry = {
      id: `dj_${Date.now()}`,
      studentId: profile.studentId || 'CK-2569-042',
      studentName: profile.name,
      date,
      time: timeStr,
      mood,
      moodEmoji: activeMoodMeta.emoji,
      activity: activity.trim(),
      learningKey: learningKey.trim(),
      challengeFaced: challengeFaced.trim() || undefined,
      tomorrowGoal: tomorrowGoal.trim() || undefined,
      category,
      streakDayCount: newStreak,
      pointsEarned: pointsAwarded,
      todayGoal: todayGoal?.goal,
      todayGoalCompleted: todayGoal?.completed,
    };

    // Update Journals list
    const updatedJournals = [newEntry, ...journals];
    setJournals(updatedJournals);

    // Update profile streak and reward points
    if (!hasLoggedToday) {
      onUpdateProfile({
        ...profile,
        streakDays: newStreak,
      });
    }

    addPoints(pointsAwarded, `บันทึก Daily Journal รักษา Streak วันที่ ${newStreak}`, 'showcase');

    // Attempt Google Sheet Sync if requested
    if (syncToGoogleSheet) {
      try {
        await saveDailyJournalToGoogleSheet(TARGET_SPREADSHEET_ID, newEntry, profile.contactEmail || '');
      } catch (err) {
        console.warn('Google Sheet auto-sync info:', err);
      }
    }

    // Success feedback
    setIsSubmitting(false);
    confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });
    setStatusMsg({
      text: `บันทึกสำเร็จ! +${pointsAwarded} แต้ม 🎉 คุณกำลังรักษา Streak ได้ ${newStreak} วันต่อเนื่อง!`,
      type: 'success',
    });

    // Reset form fields
    setActivity('');
    setLearningKey('');
    setChallengeFaced('');
    setTomorrowGoal('');
  };

  // Filtered journals
  const filteredJournals = journals.filter((j) => {
    if (selectedFilterCategory === 'all') return true;
    return j.category === selectedFilterCategory;
  });

  // Last 7 days streak indicator dots
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().split('T')[0];
    const isDone = journals.some((j) => j.date === dStr);
    const dayNameThai = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'][d.getDay()];
    const isToday = dStr === todayDateStr;
    return { dateStr: dStr, dayName: dayNameThai, isDone, isToday };
  });

  return (
    <div className="space-y-8">
      {/* 1. Header with Fire Streak Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 text-white p-6 sm:p-8 shadow-xl">
        {/* Background glow graphics */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-yellow-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Streak Counter & Info */}
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs text-xs font-bold text-amber-200 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>ระบบบันทึกความก้าวหน้าและการเรียนรู้ต่อเนื่อง (Daily Streak)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                Streak {currentStreak} วันต่อเนื่อง!
              </h1>
              <span className="text-2xl animate-pulse">🔥</span>
            </div>

            <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
              การเขียนบันทึกกิจกรรมประจำวันสั้นๆ เพียง 3 นาที ช่วยทบทวนสิ่งที่ได้เรียนรู้ ปลูกฝังนิสัยนักพัฒนาโปรแกรมที่ดี และสะสมแต้มแลกรางวัลพิเศษ
            </p>

            {/* 7-Day Streak Tracker Strip */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-amber-200 mb-2 flex items-center justify-between">
                <span>บันทึกความต่อเนื่องในรอบ 7 วันล่าสุด</span>
                <span className="text-[11px] font-mono text-white">
                  {last7Days.filter((d) => d.isDone).length}/7 วัน
                </span>
              </div>
              <div className="grid grid-cols-7 gap-2 max-w-md">
                {last7Days.map((d, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      d.isDone
                        ? 'bg-white text-orange-600 shadow-md ring-2 ring-yellow-300 scale-105'
                        : d.isToday
                        ? 'bg-white/20 text-white border border-dashed border-white/50'
                        : 'bg-black/20 text-amber-200/60'
                    }`}
                  >
                    <span className="text-[10px] font-bold">{d.dayName}</span>
                    <span className="text-base my-0.5">
                      {d.isDone ? '🔥' : d.isToday ? '⏳' : '⚪'}
                    </span>
                    <span className="text-[9px] font-mono opacity-80">
                      {d.isDone ? 'เช็คอิน' : d.isToday ? 'วันนี้' : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Milestone Badges Pill */}
          <div className="md:col-span-4 bg-black/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-200">เป้าหมายเหรียญตรา Streak</span>
              <Award className="w-4 h-4 text-amber-300" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/10">
                <div className="flex items-center gap-2">
                  <span>🌱 3 วันติด</span>
                  <span className="text-[11px] text-amber-100">นักเขียนรุ่นเยาว์</span>
                </div>
                {currentStreak >= 3 ? (
                  <span className="text-emerald-300 font-bold text-xs flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ผ่าน
                  </span>
                ) : (
                  <span className="text-amber-200/70 text-[11px]">{currentStreak}/3</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/10">
                <div className="flex items-center gap-2">
                  <span>🚀 7 วันติด</span>
                  <span className="text-[11px] text-amber-100">โค้ดเดอร์ไฟแรง</span>
                </div>
                {currentStreak >= 7 ? (
                  <span className="text-emerald-300 font-bold text-xs flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ผ่าน
                  </span>
                ) : (
                  <span className="text-amber-200/70 text-[11px]">{currentStreak}/7</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/10">
                <div className="flex items-center gap-2">
                  <span>⭐ 14 วันติด</span>
                  <span className="text-[11px] text-amber-100">วินัยเหล็กกล้า</span>
                </div>
                {currentStreak >= 14 ? (
                  <span className="text-emerald-300 font-bold text-xs flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ผ่าน
                  </span>
                ) : (
                  <span className="text-amber-200/70 text-[11px]">{currentStreak}/14</span>
                )}
              </div>
            </div>

            <div className="pt-1 text-[11px] text-amber-200/90 text-center">
              💡 บันทึกทุกวันเพื่อรับ +15 แต้ม และโบนัส Streak!
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold border flex items-center justify-between shadow-sm transition-all ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : statusMsg.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-indigo-50 border-indigo-300 text-indigo-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : statusMsg.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            onClick={() => setStatusMsg(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Main Two-Column Layout: Entry Form on Left, History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Col 7): Learning Goal for Today + New Journal Entry Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Set Today's Learning Goal (ก่อนเขียนบันทึก) */}
          <div className="bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/60 rounded-3xl border-2 border-indigo-200/90 p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-base shadow-sm shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      ตั้งเป้าหมายการเรียนรู้วันนี้ (Learning Goal for Today)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      แสดงบน Dashboard
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    ตั้งภารกิจสั้นๆ ก่อนเริ่มเขียนบันทึก และสามารถเช็คอินได้จากหน้าแดชบอร์ดหลัก (+10 แต้ม)
                  </p>
                </div>
              </div>

              {todayGoal && !isEditingGoal && (
                <button
                  type="button"
                  onClick={() => setIsEditingGoal(true)}
                  className="px-3 py-1.5 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>แก้ไขเป้าหมาย</span>
                </button>
              )}
            </div>

            {/* Active Goal Checklist Item or Edit Form */}
            {todayGoal && !isEditingGoal ? (
              <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={onToggleTodayGoal}
                    className="mt-0.5 shrink-0 transition-transform active:scale-95 p-0.5"
                    title={todayGoal.completed ? 'คลิกเพื่อยกเลิกการติ๊ก' : 'คลิกเพื่อทำเครื่องหมายเป้าหมายสำเร็จ (+10 แต้ม)'}
                  >
                    {todayGoal.completed ? (
                      <CheckSquare className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Square className="w-6 h-6 text-slate-400 hover:text-indigo-600" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        {todayGoal.category === 'coding' && '🐱 Scratch Visual Code'}
                        {todayGoal.category === 'hardware' && '📟 Micro:bit & IoT'}
                        {todayGoal.category === 'thinking' && '🧩 Computational Thinking'}
                        {todayGoal.category === 'safety' && '🛡️ PDPA & Cyber Safety'}
                        {todayGoal.category === 'reflection' && '⭐ ชุมชน & สะท้อนคิด'}
                      </span>
                      {todayGoal.completed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>ทำสำเร็จแล้ว! (+10 แต้ม)</span>
                          {todayGoal.completedAt && <span className="font-mono">({todayGoal.completedAt})</span>}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md font-semibold">
                          ⏳ รอเช็คอิน (ติ๊กช่องสี่เหลี่ยมเมื่อทำสำเร็จ)
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono ml-auto">
                        ตั้งเมื่อ: {todayGoal.createdAt}
                      </span>
                    </div>

                    <p className={`text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed ${todayGoal.completed ? 'line-through text-slate-400' : ''}`}>
                      {todayGoal.goal}
                    </p>

                    <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between border-t border-slate-100">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>สถานะซิงก์กับกล่อง Checklist หน้าแดชบอร์ดหลักแล้ว</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigateModule && onNavigateModule('dashboard')}
                        className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>ดูบน Dashboard</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Quick suggestions */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>คลิกเพื่อเลือกเป้าหมายแนะนำด่วน:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {QUICK_GOAL_SUGGESTIONS.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectQuickGoal(item)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          goalText === item.goal
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white hover:bg-indigo-50/60 border-indigo-100 text-slate-800'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{item.badge}</span>
                          <span className="text-[10px] opacity-80">คลิกเลือก</span>
                        </div>
                        <div className={`text-[11px] mt-0.5 line-clamp-1 ${goalText === item.goal ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {item.goal}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    หมวดหมู่เป้าหมาย:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setGoalCategory(c.id as any)}
                        className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                          goalCategory === c.id
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal Input form */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    พิมพ์เป้าหมายการเรียนรู้วันนี้ของคุณ:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={goalText}
                      onChange={(e) => setGoalText(e.target.value)}
                      placeholder="เช่น เขียนบล็อกคำสั่งนับคะแนนใน Scratch Studio และทดสอบระบบเงื่อนไข..."
                      className="flex-1 px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm shadow-inner"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveGoal();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveGoal()}
                      disabled={!goalText.trim()}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                    >
                      <Target className="w-4 h-4" />
                      <span>บันทึกเป้าหมาย</span>
                    </button>
                    {todayGoal && isEditingGoal && (
                      <button
                        type="button"
                        onClick={() => setIsEditingGoal(false)}
                        className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                      >
                        ยกเลิก
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    💡 เป้าหมายนี้จะไปแสดงเป็น Checklist บนแดชบอร์ดหลัก ให้คุณติ๊กสำเร็จและรับแต้มสะสม
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Main Journal Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>เขียนบันทึกกิจกรรมประจำวัน (Daily Entry)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                เขียนบันทึกสั้นๆ 1-3 ประโยคเพื่อทบทวนบทเรียนและรักษา Streak
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold border border-amber-200 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>+20 แต้ม/วัน</span>
              </span>
            </div>
          </div>

          {/* Quick Activity Templates */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>หรือคลิกเลือกแม่แบบกิจกรรมตัวอย่างเพื่อเติมข้อความเร็ว:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_ACTIVITY_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/50 text-left transition-all text-xs group"
                >
                  <div className="font-bold text-slate-900 group-hover:text-indigo-700 truncate">
                    {tpl.category === 'coding' && '🐱 Scratch: คำสั่งวนซ้ำ'}
                    {tpl.category === 'hardware' && '📟 Micro:bit: เซ็นเซอร์'}
                    {tpl.category === 'safety' && '🛡️ PDPA: ความเป็นส่วนตัว'}
                    {tpl.category === 'thinking' && '🧩 Computational Thinking'}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {tpl.activity}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Journal Form */}
          <form onSubmit={handleSubmitJournal} className="space-y-5 text-xs sm:text-sm">
            {/* Row 1: Date & Mood */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>วันที่บันทึก</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-amber-500" />
                  <span>อารมณ์การเรียนรู้วันนี้</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id)}
                      title={m.label}
                      className={`flex-1 py-2 rounded-xl text-lg flex items-center justify-center transition-all ${
                        mood === m.id
                          ? 'bg-amber-100 ring-2 ring-amber-400 scale-110 shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 opacity-70'
                      }`}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 text-center font-medium">
                  รู้สึก: {activeMoodMeta.label}
                </div>
              </div>
            </div>

            {/* Row 2: Category Selector */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-slate-500" />
                <span>หมวดหมู่บทเรียนที่ทำวันนี้</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-left truncate ${
                      category === c.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Daily Activity */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                1. กิจกรรมโค้ดดิ้งสั้นๆ ที่ได้ลงมือทำในวันนี้ *
              </label>
              <textarea
                rows={2}
                required
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="เช่น วันนี้ทดลองเขียนโค้ด Scratch ให้ตัวละครเดินตรวจจับสิ่งกีดขวางในเขาวงกต..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
              />
            </div>

            {/* Row 4: Key Learning Takeaway */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                2. สิ่งที่ได้เรียนรู้ใหม่หรือเคล็ดลับสำคัญ 1 เรื่อง *
              </label>
              <textarea
                rows={2}
                required
                value={learningKey}
                onChange={(e) => setLearningKey(e.target.value)}
                placeholder="เช่น การใช้ If-Then-Else ตรวจสอบทิศทางช่วยลดจำนวนบรรทัดของโค้ดได้มาก..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
              />
            </div>

            {/* Row 5: Challenge & Tomorrow Goal (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  3. อุปสรรคที่พบและวิธีแก้ไข (ถ้ามี)
                </label>
                <input
                  type="text"
                  value={challengeFaced}
                  onChange={(e) => setChallengeFaced(e.target.value)}
                  placeholder="เช่น ติดบั๊กตัวละครไม่หมุน แก้โดยปรับมุม 90 องศา"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  4. สิ่งที่ตั้งเป้าจะทำในวันพรุ่งนี้
                </label>
                <input
                  type="text"
                  value={tomorrowGoal}
                  onChange={(e) => setTomorrowGoal(e.target.value)}
                  placeholder="เช่น ต่อลำโพงบน Micro:bit และแชร์ลง Showcase"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Google Sheets Sync Checkbox */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <label className="flex items-center gap-2.5 text-xs text-emerald-950 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncToGoogleSheet}
                  onChange={(e) => setSyncToGoogleSheet(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500"
                />
                <span className="flex items-center gap-1.5 flex-wrap">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                  {profile.role === 'admin' ? (
                    <span>บันทึกและส่งข้อมูลเข้าสู่ Google Sheets อัตโนมัติ (ID: <code className="font-mono text-emerald-800 font-bold bg-white/70 px-1 rounded">{TARGET_SPREADSHEET_ID}</code>)</span>
                  ) : (
                    <span>บันทึกและส่งข้อมูลเข้าสู่คลาวด์ชีตของโรงเรียนอัตโนมัติ (ปลอดภัยตามมาตรฐาน PDPA)</span>
                  )}
                </span>
              </label>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                เขียนบันทึกประจำวันรับ <strong>+20 แต้ม</strong> และรักษาสถิติ Streak
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Flame className="w-4 h-4 text-yellow-200" />
                <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกกิจกรรม & เพิ่ม Streak (+20 แต้ม)'}</span>
              </button>
            </div>
          </form>
          </div>
        </div>

        {/* Right Column (Col 5): Journal History & Study Logs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>ประวัติบันทึกการเรียนรู้ ({journals.length} วัน)</span>
                </h3>
                <p className="text-[11px] text-slate-500">บันทึกกิจกรรมต่อเนื่องของ {profile.name}</p>
              </div>

              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-full text-xs flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentStreak} วัน</span>
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedFilterCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedFilterCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setSelectedFilterCategory('coding')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedFilterCategory === 'coding'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Scratch
              </button>
              <button
                onClick={() => setSelectedFilterCategory('hardware')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedFilterCategory === 'hardware'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Micro:bit
              </button>
              <button
                onClick={() => setSelectedFilterCategory('safety')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedFilterCategory === 'safety'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                PDPA
              </button>
            </div>

            {/* Journal Entries List */}
            <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredJournals.map((j) => {
                const categoryMeta = CATEGORY_OPTIONS.find((c) => c.id === j.category) || CATEGORY_OPTIONS[0];

                return (
                  <div
                    key={j.id}
                    className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/70 hover:bg-white transition-all space-y-2.5 shadow-xs"
                  >
                    {/* Top Row: Date, Mood & Category Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl" title={j.mood}>{j.moodEmoji}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{j.date}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{j.time} น.</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-0.5">
                          <Flame className="w-3 h-3 text-amber-600" />
                          <span>วันที่ {j.streakDayCount}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          +{j.pointsEarned} แต้ม
                        </span>
                      </div>
                    </div>

                    {/* Activity */}
                    <div className="space-y-1">
                      <div className="text-xs text-slate-800 font-semibold leading-snug">
                        {j.activity}
                      </div>
                      <div className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="font-bold text-indigo-700">สิ่งที่ได้เรียนรู้:</span> {j.learningKey}
                      </div>
                    </div>

                    {/* Today Goal Tag if logged with entry */}
                    {j.todayGoal && (
                      <div className="flex items-center gap-1.5 text-[11px] bg-indigo-50/80 text-indigo-900 px-2.5 py-1.5 rounded-lg border border-indigo-100">
                        <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="font-bold">เป้าหมายประจำวัน:</span>
                        <span className="truncate flex-1">{j.todayGoal}</span>
                        {j.todayGoalCompleted && (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> สำเร็จ
                          </span>
                        )}
                      </div>
                    )}

                    {/* Optional Obstacle or Goal */}
                    {(j.challengeFaced || j.tomorrowGoal) && (
                      <div className="space-y-1 pt-1 text-[11px] text-slate-500">
                        {j.challengeFaced && (
                          <div className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold shrink-0">💡 วิธีแก้:</span>
                            <span>{j.challengeFaced}</span>
                          </div>
                        )}
                        {j.tomorrowGoal && (
                          <div className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold shrink-0">🎯 พรุ่งนี้:</span>
                            <span>{j.tomorrowGoal}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Tag */}
                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200/50">
                      <span className="font-medium text-slate-600">{categoryMeta.label}</span>
                      <span>บันทึกโดย {j.studentName.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}

              {filteredJournals.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                  <div>ไม่พบบันทึกในหมวดหมู่นี้</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
