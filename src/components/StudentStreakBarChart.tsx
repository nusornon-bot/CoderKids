import React, { useState, useMemo } from 'react';
import {
  Flame,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Target,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types/index.ts';

export interface StudentStreakBarChartProps {
  profile: UserProfile;
  points: number;
  onCheckInStreak?: () => void;
  onNavigate?: (moduleKey: string, subSection?: string) => void;
}

interface DayStreakData {
  day: string;
  fullDay: string;
  dateStr: string;
  minutes: number;
  pointsEarned: number;
  attended: boolean;
  isToday: boolean;
  topic: string;
  streakCount: number;
}

export const StudentStreakBarChart: React.FC<StudentStreakBarChartProps> = ({
  profile,
  points,
  onCheckInStreak,
  onNavigate,
}) => {
  const [metricMode, setMetricMode] = useState<'minutes' | 'points'>('minutes');
  const [hasCheckedInToday, setHasCheckedInToday] = useState(true);
  const [showTarget, setShowTarget] = useState(true);

  // Current streak calculation
  const streak = profile.streakDays || 4;
  const nextMilestone = streak < 7 ? 7 : streak < 14 ? 14 : streak < 30 ? 30 : 60;
  const milestoneProgress = Math.min(100, Math.round((streak / nextMilestone) * 100));

  // Generate 7-day trend data ending today
  const last7DaysData: DayStreakData[] = useMemo(() => {
    const daysThai = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
    const fullDaysThai = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
    const topics = [
      'ความปลอดภัยดิจิทัล & PDPA',
      'รหัสผ่าน & มารยาทไซเบอร์',
      '4 เสาหลักการคิดเชิงคำนวณ',
      'ผังงาน Flowchart & อัลกอริทึม',
      'Scratch Studio Visual Block',
      'บอร์ดจำลอง Micro:bit LED 5x5',
      'โครงงานนวัตกรรม & บันทึกประจำวัน',
    ];

    const today = new Date();
    const result: DayStreakData[] = [];

    // Base seeded variations using student points
    const seed = (points % 7);
    const minuteBase = [35, 45, 50, 40, 65, 45, 55];
    const pointBase = [20, 25, 30, 25, 40, 30, 35];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayIdx = d.getDay();
      const isToday = i === 0;

      // Attended: past days matching streak are attended
      const attended = i <= (streak - 1) || i <= 5;
      const mins = attended ? minuteBase[(6 - i + seed) % 7] : 0;
      const pts = attended ? pointBase[(6 - i + seed) % 7] : 0;

      const dateNumber = d.getDate();
      const monthNames = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
      ];
      const dateStr = `${dateNumber} ${monthNames[d.getMonth()]}`;

      result.push({
        day: isToday ? 'วันนี้' : daysThai[dayIdx],
        fullDay: isToday ? 'วันนี้ (Today)' : fullDaysThai[dayIdx],
        dateStr,
        minutes: mins,
        pointsEarned: pts,
        attended,
        isToday,
        topic: topics[(6 - i) % topics.length],
        streakCount: attended ? Math.max(1, streak - i) : 0,
      });
    }

    return result;
  }, [streak, points]);

  // Total minutes in 7 days
  const total7DaysMinutes = useMemo(
    () => last7DaysData.reduce((acc, curr) => acc + curr.minutes, 0),
    [last7DaysData]
  );
  const attendedDaysCount = useMemo(
    () => last7DaysData.filter((d) => d.attended).length,
    [last7DaysData]
  );
  const attendanceRate = Math.round((attendedDaysCount / 7) * 100);

  // Handle local check in celebration
  const handleCheckIn = () => {
    setHasCheckedInToday(true);
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
      });
    }
    if (onCheckInStreak) {
      onCheckInStreak();
    }
  };

  // Custom Bar Chart Tooltip
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: DayStreakData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-2 z-50 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>{data.fullDay}</span>
              <span className="text-[10px] text-slate-400 font-mono">({data.dateStr})</span>
            </span>
            {data.attended ? (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <Check className="w-2.5 h-2.5" />
                เข้าเรียน
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                หยุดพัก
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">⏱️ เวลาเรียน:</span>
              <span className="font-bold text-indigo-300 tabular-nums">
                {data.minutes} นาที
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">🪙 แต้มสะสมที่ได้:</span>
              <span className="font-bold text-amber-400 tabular-nums">
                +{data.pointsEarned} แต้ม
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">🔥 สถิติสะสม:</span>
              <span className="font-bold text-rose-400 tabular-nums">
                Streak วันที่ {data.streakCount}
              </span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-300">
            <div className="text-slate-400 text-[10px]">หัวข้อการเรียนรู้:</div>
            <div className="truncate font-medium text-indigo-200">{data.topic}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-7 space-y-6 transition-colors">
      {/* 1. Header with Streak Badge & Motivation Message */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md ring-4 ring-amber-100 dark:ring-amber-950/60">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1 shadow-xs">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Streak {streak} วันต่อเนื่อง!</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>อัตราเข้าเรียน 7 วัน: {attendanceRate}% ({attendedDaysCount}/7 วัน)</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1.5 flex items-center gap-2">
              <span>สถิติการเรียนรู้ต่อเนื่อง 7 วันล่าสุด (Learning Streak Trends)</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {streak >= 7 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  🎉 สุดยอดนักพัฒนา! คุณเรียนต่อเนื่องครบ 7 วันแล้ว รักษาวินัยเพื่อพิชิตเป้าหมายถัดไป ({nextMilestone} วัน)
                </span>
              ) : (
                <span>
                  🔥 เรียนต่อเนื่องอีกเพียง <strong className="text-amber-600 dark:text-amber-400 font-bold">{nextMilestone - streak} วัน</strong> เพื่อปลดล็อกเข็มกลัดเกียรติยศ <em>"{nextMilestone}-Day Streak Champion"</em>!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Metric Mode Toggle & Target Checkbox */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMetricMode('minutes')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                metricMode === 'minutes'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ⏱️ เวลาเรียน (นาที)
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('points')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                metricMode === 'points'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🪙 แต้มสะสม (EXP)
            </button>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              checked={showTarget}
              onChange={(e) => setShowTarget(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span>แสดงเกณฑ์ขั้นต่ำ</span>
          </label>
        </div>
      </div>

      {/* 2. Key Streak Metrics Strip (3 Highlights) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Metric A: Active Streak Milestone */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 dark:border-amber-900/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>ความคืบหน้า Streak ปัจจุบัน</span>
            </span>
            <span className="font-bold text-amber-700 dark:text-amber-400">{streak}/{nextMilestone} วัน</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-amber-100 dark:bg-amber-950/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-700 shadow-xs"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>เป้าหมายถัดไป: {nextMilestone} วัน</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{milestoneProgress}% สำเร็จ</span>
            </div>
          </div>
        </div>

        {/* Metric B: Total Learning Minutes in Past 7 Days */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-200 dark:border-indigo-900/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>เวลาเรียนสะสม 7 วัน</span>
            </span>
            <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">สถิติสัปดาห์</span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {total7DaysMinutes}{' '}
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">นาที</span>
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
              เฉลี่ย {Math.round(total7DaysMinutes / 7)} นาที/วัน (เกินเกณฑ์ 30 นาที)
            </div>
          </div>
        </div>

        {/* Metric C: Attendance Discipline & Action */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200 dark:border-emerald-900/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>การเช็คอินประจำวัน</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
              Active Today
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-1">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {hasCheckedInToday ? '✅ เช็คอินสำเร็จแล้ว' : '⏳ รอเช็คอินวันนี้'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                รับแต้มสะสม +10 EXP และรักษาสถิติ
              </div>
            </div>
            <button
              type="button"
              onClick={handleCheckIn}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              title="คลิกเพื่อบันทึกการเข้าเรียนและรับแต้มสะสม"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>เช็คอิน</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Recharts Bar Chart (7-Day Attendance & Streak Trend) */}
      <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>
                {metricMode === 'minutes'
                  ? 'กราฟแท่งแนวโน้มเวลาเรียนรู้ 7 วันล่าสุด (นาที)'
                  : 'กราฟแท่งแนวโน้มคะแนนสะสม 7 วันล่าสุด (EXP)'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {metricMode === 'minutes'
                ? 'แท่งสีส้มคือวันนี้ (Today) | สีน้ำเงินคือวันที่เข้าเรียนสม่ำเสมอ | เส้นประคือเกณฑ์เป้าหมาย 30 นาที/วัน'
                : 'คะแนนที่ได้รับในแต่ละวันจากการทำโจทย์, เขียนโปรแกรม Scratch และจำลอง Micro:bit'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500 inline-block shadow-xs" />
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">วันนี้</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-600 dark:bg-indigo-500 inline-block" />
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">เข้าเรียนต่อเนื่อง</span>
            </div>
            {showTarget && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-emerald-500 inline-block" />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">เกณฑ์เป้าหมาย</span>
              </div>
            )}
          </div>
        </div>

        {/* Responsive BarChart Container */}
        <div className="w-full h-64 sm:h-72 pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={last7DaysData}
              margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                unit={metricMode === 'minutes' ? ' น.' : ' แต้ม'}
                domain={[0, 'dataMax + 15']}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />

              {/* Reference Target Line */}
              {showTarget && (
                <ReferenceLine
                  y={metricMode === 'minutes' ? 30 : 25}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: metricMode === 'minutes' ? 'เกณฑ์ขั้นต่ำ 30 น.' : 'เกณฑ์ 25 แต้ม',
                    position: 'insideTopRight',
                    fill: '#10b981',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              )}

              {/* Bar Component with Individual Cell Color Gradients */}
              <Bar
                dataKey={metricMode === 'minutes' ? 'minutes' : 'pointsEarned'}
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
              >
                {last7DaysData.map((entry, index) => {
                  let fillColor = '#6366f1'; // Default Indigo
                  if (entry.isToday) {
                    fillColor = '#f59e0b'; // Amber for Today
                  } else if (!entry.attended) {
                    fillColor = '#cbd5e1'; // Grey for missed day
                  } else if (entry.streakCount >= 4) {
                    fillColor = '#4f46e5'; // Deeper indigo
                  }
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={fillColor}
                      className="transition-all hover:opacity-85 cursor-pointer"
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Motivation & Next Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-base">💡</span>
          <span>
            เคล็ดลับ: การเข้าเรียนเพียงวันละ <strong>20-30 นาที</strong> ช่วยสร้างทักษะ Computational Thinking ได้ดีกว่าการเรียนอัดแน่นสัปดาห์ละครั้ง
          </span>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('showcase', 'dailyJournal')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>บันทึกไดอารี่ Daily Journal วันนี้</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
