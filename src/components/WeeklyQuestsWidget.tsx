import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Users,
  Star,
  Zap,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';
import { fireConfetti } from './ConfettiCelebration.tsx';

export interface WeeklyQuestItem {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  category: 'thinking' | 'safety' | 'coding' | 'showcase';
  completed: boolean;
  targetModuleKey: string;
  targetSubSection?: string;
  icon: string;
}

interface WeeklyQuestsWidgetProps {
  onNavigate: (moduleKey: string, subSection?: string) => void;
  addPoints?: (amount: number, reason: string, category?: any) => void;
  onCelebrate?: () => void;
}

export const WeeklyQuestsWidget: React.FC<WeeklyQuestsWidgetProps> = ({
  onNavigate,
  addPoints,
  onCelebrate,
}) => {
  const [quests, setQuests] = useState<WeeklyQuestItem[]>(() => {
    return [
      {
        id: 'wq_1',
        title: 'พิชิตเขาวงกตอัลกอริทึม 1 ด่าน',
        description: 'วางบล็อกคำสั่งเดินหน้า เลี้ยว และวนซ้ำพาหุ่นยนต์แก้ปัญหา',
        rewardPoints: 20,
        category: 'thinking',
        completed: true,
        targetModuleKey: 'thinking',
        targetSubSection: 'puzzle',
        icon: '🧩',
      },
      {
        id: 'wq_2',
        title: 'ทำแบบทดสอบ PDPA และไซเบอร์ 10 ข้อ',
        description: 'ตอบคำถามจำแนกข้อมูลอ่อนไหวและสร้างรหัสผ่านที่รัดกุม',
        rewardPoints: 25,
        category: 'safety',
        completed: false,
        targetModuleKey: 'safety',
        targetSubSection: 'quiz',
        icon: '🛡️',
      },
      {
        id: 'wq_3',
        title: 'รันโค้ดจำลองบอร์ด Micro:bit V2',
        description: 'ทดลองแสดงผลหน้าจอ LED Matrix หรืออ่านค่าเซ็นเซอร์อุณหภูมิ',
        rewardPoints: 25,
        category: 'coding',
        completed: true,
        targetModuleKey: 'codingLab',
        targetSubSection: 'microbit',
        icon: '📟',
      },
      {
        id: 'wq_4',
        title: 'รีวิวผลงานเพื่อน 2 Stars & 1 Wish',
        description: 'ส่งคำชมและข้อเสนอแนะโครงงานของเพื่อนร่วมชั้นอย่างสร้างสรรค์',
        rewardPoints: 20,
        category: 'showcase',
        completed: false,
        targetModuleKey: 'showcase',
        targetSubSection: 'reviews',
        icon: '⭐',
      },
    ];
  });

  const [hasClaimedWeeklyBonus, setHasClaimedWeeklyBonus] = useState(false);

  // Live School Achievement Toast
  const [liveToastIndex, setLiveToastIndex] = useState(0);
  const liveToasts = [
    { student: 'ด.ช. กิตติภพ (ป.5/2)', action: 'เพิ่งผ่านภารกิจเขาวงกตอัลกอริทึม!', emoji: '🤖', time: 'เมื่อ 2 นาทีที่แล้ว' },
    { student: 'ด.ญ. ชนัญชิดา (ป.4/1)', action: 'ได้คะแนนประเมินรูบริกส์ 16/16 แต้มเต็ม!', emoji: '🏆', time: 'เมื่อ 5 นาทีที่แล้ว' },
    { student: 'ด.ช. ภัทรพล (ป.6/3)', action: 'ส่งโครงงานรดน้ำต้นไม้อัจฉริยะ Micro:bit!', emoji: '🌱', time: 'เมื่อ 8 นาทีที่แล้ว' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveToastIndex((prev) => (prev + 1) % liveToasts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [liveToasts.length]);

  const completedQuestsCount = quests.filter((q) => q.completed).length;
  const allQuestsCompleted = completedQuestsCount === quests.length;
  const progressPercent = Math.round((completedQuestsCount / quests.length) * 100);

  const handleToggleQuest = (id: string) => {
    soundEffects.playClick();
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const next = !q.completed;
          if (next) {
            soundEffects.playFanfare();
            fireConfetti('burst');
            if (addPoints) {
              addPoints(q.rewardPoints, `สำเร็จเควสต์ประจำสัปดาห์: ${q.title}`, q.category);
            }
          }
          return { ...q, completed: next };
        }
        return q;
      })
    );
  };

  const handleClaimGrandBonus = () => {
    if (!allQuestsCompleted || hasClaimedWeeklyBonus) return;
    setHasClaimedWeeklyBonus(true);
    soundEffects.playFanfare();
    fireConfetti('fireworks');
    if (addPoints) {
      addPoints(50, 'ปลดล็อกเหรียญตราแชมเปี้ยนเควสต์ประจำสัปดาห์ (Weekend Code Hero)!', 'classroom');
    }
    if (onCelebrate) {
      onCelebrate();
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md p-6 space-y-5">
      {/* Header with Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl shadow-xs">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                เควสต์ท้าทายประจำสัปดาห์ (Weekly Coding Quests)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                สัปดาห์นี้
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ทำภารกิจครบ 4 ข้อเพื่อรับเหรียญตราพิเศษและโบนัส +50 Coder Coins
            </p>
          </div>
        </div>

        {/* Live School Feed */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2 self-start sm:self-auto">
          <span className="text-sm">{liveToasts[liveToastIndex].emoji}</span>
          <div className="text-[11px] leading-tight">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {liveToasts[liveToastIndex].student}
            </span>{' '}
            <span className="text-slate-500 dark:text-slate-400">
              {liveToasts[liveToastIndex].action}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Milestone */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            ความคืบหน้าเควสต์: <strong>{completedQuestsCount} / {quests.length} ภารกิจ</strong>
          </span>
          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quests.map((q) => (
          <div
            key={q.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              q.completed
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => handleToggleQuest(q.id)}
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer ${
                  q.completed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                }`}
                title={q.completed ? 'คลิกเพื่อยกเลิก' : 'คลิกเพื่อทำภารกิจสำเร็จ'}
              >
                {q.completed ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-xs">{q.icon}</span>}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className={`text-xs font-bold truncate ${q.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {q.title}
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                    +{q.rewardPoints}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {q.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.playClick();
                onNavigate(q.targetModuleKey, q.targetSubSection);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-indigo-50 text-indigo-600 dark:text-indigo-300 text-xs font-semibold shrink-0 transition-colors cursor-pointer border border-slate-200 dark:border-slate-600 flex items-center gap-1"
              title="ไปที่บทเรียนนี้"
            >
              <span>ลุยเลย</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Claim Grand Bonus Button if all finished */}
      {allQuestsCompleted && (
        <div className="pt-2">
          <button
            onClick={handleClaimGrandBonus}
            disabled={hasClaimedWeeklyBonus}
            className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
              hasClaimedWeeklyBonus
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 cursor-default'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white hover:brightness-105 active:scale-98 animate-pulse'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {hasClaimedWeeklyBonus
                ? 'รับรางวัลแชมป์เควสต์ประจำสัปดาห์เรียบร้อยแล้ว (+50 Coins)'
                : 'กดรับรางวัลใหญ่ประจำสัปดาห์: ปลดล็อกเหรียญตรา + 50 Coins! 🎉'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
