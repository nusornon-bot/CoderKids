import React, { useState, useMemo } from 'react';
import {
  Clock,
  TrendingUp,
  Calendar,
  Sparkles,
  Flame,
  CheckCircle2,
  BarChart2,
  Zap,
  Target,
  ArrowUpRight,
  Info,
  Layers,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { UserProfile } from '../types/index.ts';

export interface LearningOverviewAnalyticsProps {
  moduleProgress: {
    safety: boolean;
    thinking: boolean;
    codingLab: boolean;
    showcase: boolean;
  };
  points: number;
  profile: UserProfile;
  totalActivitiesCompleted?: number;
}

interface DailyTrendItem {
  day: string;
  shortDay: string;
  minutes: number;
  targetMinutes: number;
  pointsEarned: number;
  modulesFocused: string;
}

interface WeeklyTrendItem {
  week: string;
  shortWeek: string;
  hours: number;
  points: number;
  modulesCompleted: number;
}

export const LearningOverviewAnalytics: React.FC<LearningOverviewAnalyticsProps> = ({
  moduleProgress,
  points,
  profile,
  totalActivitiesCompleted = 8,
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [showTargetLine, setShowTargetLine] = useState(true);

  // 1. Calculate realistic total learning hours and stats based on user progress & streak
  const completedCount = Object.values(moduleProgress).filter(Boolean).length;
  const streak = profile.streakDays || 4;

  // Base learning time estimation:
  // Each completed module ~ 3.2 hours, in-progress modules ~ 1.2 hours
  // Streak multiplier + points activity time
  const calculatedTotalHours = useMemo(() => {
    const baseModuleHours = completedCount * 3.2 + (4 - completedCount) * 0.9;
    const activityBonusHours = Math.round((points / 35) * 10) / 10;
    const total = baseModuleHours + activityBonusHours;
    return Math.max(4.5, Math.round(total * 10) / 10);
  }, [completedCount, points]);

  const totalMinutes = Math.round(calculatedTotalHours * 60);
  const dailyAverageMinutes = Math.round(totalMinutes / Math.max(1, streak + 3));

  // 2. Data for daily view (จันทร์ - อาทิตย์ ในสัปดาห์นี้)
  const dailyData: DailyTrendItem[] = useMemo(() => {
    // Dynamic based on current points and streak
    const seed = points % 10;
    return [
      {
        day: 'จันทร์',
        shortDay: 'จ.',
        minutes: 35 + seed,
        targetMinutes: 40,
        pointsEarned: 25,
        modulesFocused: 'PDPA & ความปลอดภัย',
      },
      {
        day: 'อังคาร',
        shortDay: 'อ.',
        minutes: 45 + (seed % 5),
        targetMinutes: 40,
        pointsEarned: 30,
        modulesFocused: 'รหัสผ่าน & มารยาทไซเบอร์',
      },
      {
        day: 'พุธ',
        shortDay: 'พ.',
        minutes: 60 + seed * 2,
        targetMinutes: 40,
        pointsEarned: 45,
        modulesFocused: '4 เสาหลักการคิด & Flowchart',
      },
      {
        day: 'พฤหัสบดี',
        shortDay: 'พฤ.',
        minutes: 40 + (seed % 4),
        targetMinutes: 40,
        pointsEarned: 25,
        modulesFocused: 'ตรรกะ Loops & If-Else',
      },
      {
        day: 'ศุกร์',
        shortDay: 'ศ.',
        minutes: 65 + seed * 3,
        targetMinutes: 40,
        pointsEarned: 50,
        modulesFocused: 'Scratch Canvas Studio',
      },
      {
        day: 'เสาร์',
        shortDay: 'ส.',
        minutes: 50 + seed,
        targetMinutes: 40,
        pointsEarned: 35,
        modulesFocused: 'Micro:bit Simulator',
      },
      {
        day: 'อาทิตย์ (วันนี้)',
        shortDay: 'อา.',
        minutes: 55 + (seed % 6),
        targetMinutes: 40,
        pointsEarned: 40,
        modulesFocused: 'สรุปโครงงาน & Daily Journal',
      },
    ];
  }, [points]);

  // 3. Data for weekly trend (4 สัปดาห์ล่าสุด)
  const weeklyData: WeeklyTrendItem[] = useMemo(() => {
    return [
      {
        week: 'สัปดาห์ที่ 1',
        shortWeek: 'สัปดาห์ 1',
        hours: 2.8,
        points: 45,
        modulesCompleted: 0,
      },
      {
        week: 'สัปดาห์ที่ 2',
        shortWeek: 'สัปดาห์ 2',
        hours: 3.6,
        points: 75,
        modulesCompleted: 1,
      },
      {
        week: 'สัปดาห์ที่ 3',
        shortWeek: 'สัปดาห์ 3',
        hours: 4.1,
        points: 110,
        modulesCompleted: completedCount >= 2 ? 2 : 1,
      },
      {
        week: 'สัปดาห์ที่ 4 (ปัจจุบัน)',
        shortWeek: 'สัปดาห์ 4',
        hours: calculatedTotalHours > 10.5 ? 4.8 : 3.9,
        points: points,
        modulesCompleted: completedCount,
      },
    ];
  }, [calculatedTotalHours, points, completedCount]);

  // Time distribution by module
  const moduleBreakdown = [
    { name: '1. ความปลอดภัย & PDPA', hours: '3.5 ชม.', percent: 24, color: 'bg-emerald-500', text: 'text-emerald-700' },
    { name: '2. อัลกอริทึม & ตรรกะ', hours: '4.2 ชม.', percent: 28, color: 'bg-indigo-500', text: 'text-indigo-700' },
    { name: '3. ปฏิบัติการ Scratch & Micro:bit', hours: '4.9 ชม.', percent: 33, color: 'bg-sky-500', text: 'text-sky-700' },
    { name: '4. นำเสนอ & สะท้อนคิด', hours: '2.2 ชม.', percent: 15, color: 'bg-purple-500', text: 'text-purple-700' },
  ];

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 z-50">
          <div className="font-bold text-amber-300 border-b border-slate-700 pb-1 flex items-center justify-between gap-4">
            <span>{label}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              {viewMode === 'daily' ? 'รายวัน' : 'รายสัปดาห์'}
            </span>
          </div>
          {viewMode === 'daily' ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300">⏱️ เวลาที่ใช้เรียน:</span>
                <span className="font-bold text-indigo-300 tabular-nums">{data.minutes} นาที</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300">🎯 เกณฑ์เป้าหมาย:</span>
                <span className="font-semibold text-emerald-400 tabular-nums">{data.targetMinutes} นาที</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300">🪙 แต้มที่ได้รับ:</span>
                <span className="font-bold text-amber-300 tabular-nums">+{data.pointsEarned} แต้ม</span>
              </div>
              {data.modulesFocused && (
                <div className="pt-1 text-[11px] text-slate-400 border-t border-slate-800">
                  <span className="text-indigo-200">หัวข้อ: </span>
                  {data.modulesFocused}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300">⏱️ เวลาเรียนรวม:</span>
                <span className="font-bold text-indigo-300 tabular-nums">{data.hours} ชม.</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300">🪙 แต้มสะสม:</span>
                <span className="font-bold text-amber-300 tabular-nums">{data.points} แต้ม</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300">🎓 จบแล้ว:</span>
                <span className="font-semibold text-emerald-400 tabular-nums">{data.modulesCompleted} โมดูล</span>
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      {/* ----------------- HEADER & CONTROLS ----------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Learning Analytics &amp; Time
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>+24% จากสัปดาห์ก่อน</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              สรุปภาพรวมเวลาเรียนรู้ &amp; แนวโน้มการเรียนรายสัปดาห์
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              ติดตามสถิติจำนวนชั่วโมงที่ใช้ไปกับการลงมือปฏิบัติจริง และวิเคราะห์ความสม่ำเสมอตามเกณฑ์มาตรฐาน สพฐ.
            </p>
          </div>
        </div>

        {/* View Toggle (รายวัน vs รายสัปดาห์) */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'daily'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📅 7 วันล่าสุด
            </button>
            <button
              type="button"
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'weekly'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 4 สัปดาห์
            </button>
          </div>
        </div>
      </div>

      {/* ----------------- 4 SUMMARY METRIC TILES ----------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Learning Time */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-white border border-indigo-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">เวลาเรียนรู้ทั้งหมด</span>
            <span className="p-1.5 rounded-xl bg-indigo-100/80 text-indigo-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums">
              {calculatedTotalHours}{' '}
              <span className="text-sm font-semibold text-slate-500">ชั่วโมง</span>
            </div>
            <div className="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
              <span>≈ {totalMinutes.toLocaleString()} นาที</span>
              <span className="text-slate-400 font-normal">| สะสม {completedCount}/4 โมดูล</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Daily Average Time */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-white border border-emerald-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">เวลาเฉลี่ยต่อวัน</span>
            <span className="p-1.5 rounded-xl bg-emerald-100/80 text-emerald-700">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight tabular-nums">
              {dailyAverageMinutes}{' '}
              <span className="text-sm font-semibold text-slate-500">นาที/วัน</span>
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>เกินเกณฑ์ขั้นต่ำ (เป้า 40 นาที)</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Active Streak */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-white border border-amber-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">สถิติเรียนต่อเนื่อง</span>
            <span className="p-1.5 rounded-xl bg-amber-100/80 text-amber-700">
              <Flame className="w-4 h-4 text-amber-500" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight tabular-nums flex items-center gap-1.5">
              <span>{streak}</span>
              <span className="text-sm font-semibold text-slate-500">วันติดกัน</span>
              <span className="text-base">🔥</span>
            </div>
            <div className="text-xs text-amber-800 font-semibold mt-1">
              <span>เป้าหมายถัดไป: 7 วัน (Badge ปลดล็อก)</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Learning Efficiency / Points per Hour */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-white border border-purple-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">ประสิทธิภาพการทำโจทย์</span>
            <span className="p-1.5 rounded-xl bg-purple-100/80 text-purple-700">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-800 tracking-tight tabular-nums">
              {Math.round(points / Math.max(1, calculatedTotalHours))}{' '}
              <span className="text-sm font-semibold text-slate-500">แต้ม/ชม.</span>
            </div>
            <div className="text-xs text-purple-700 font-semibold mt-1">
              <span>ระดับ: ผู้เรียนที่มีความกระตือรือร้นสูง</span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- RECHARTS LINE CHART SECTION ----------------- */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/60 border border-slate-200/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>
                {viewMode === 'daily'
                  ? 'แนวโน้มระยะเวลาเรียนรายวันในรอบสัปดาห์ (นาที)'
                  : 'แนวโน้มจำนวนชั่วโมงเรียนตลอด 4 สัปดาห์ (ชั่วโมง)'}
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {viewMode === 'daily'
                ? 'เส้นสีน้ำเงินแสดงเวลาเรียนจริงในแต่ละวัน เทียบกับเส้นประเกณฑ์มาตรฐาน สพฐ. (40 นาที)'
                : 'กราฟแสดงการเติบโตของชั่วโมงเรียนและคะแนนสะสมต่อเนื่อง 4 สัปดาห์'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
              <input
                type="checkbox"
                checked={showTargetLine}
                onChange={(e) => setShowTargetLine(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>แสดงเกณฑ์เป้าหมาย</span>
            </label>
          </div>
        </div>

        {/* Recharts Chart Container */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'daily' ? (
              <LineChart data={dailyData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  unit=" น."
                  domain={[0, 'dataMax + 15']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="circle"
                />
                {showTargetLine && (
                  <Line
                    type="monotone"
                    dataKey="targetMinutes"
                    name="เกณฑ์มาตรฐาน สพฐ. (40 นาที)"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="minutes"
                  name="เวลาที่ใช้เรียนจริง (นาที)"
                  stroke="#4f46e5"
                  strokeWidth={3.5}
                  dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7, fill: '#6366f1' }}
                />
              </LineChart>
            ) : (
              <LineChart data={weeklyData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="week"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  unit=" ชม."
                  domain={[0, 'dataMax + 1.5']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="hours"
                  name="ชั่วโมงเรียนสะสม (ชม.)"
                  stroke="#6366f1"
                  strokeWidth={3.5}
                  dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 8, fill: '#4f46e5' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Insight Callout Box */}
        <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">บทวิเคราะห์แนวโน้มการเรียน: </span>
            <span className="leading-relaxed">
              ผู้เรียนมีเวลาฝึกฝนเข้มข้นที่สุดในวันศุกร์ (65 นาที) และวันพุธ (60 นาที) ซึ่งสอดคล้องกับช่วงปฏิบัติการ Scratch &amp; Micro:bit การจัดเวลาอย่างสม่ำเสมอช่วยให้ทักษะโค้ดดิ้งพัฒนาได้อย่างต่อเนื่องและรักษาสถิติ Streak ได้เป็นอย่างดี
            </span>
          </div>
        </div>
      </div>

      {/* ----------------- TIME DISTRIBUTION BY 4 MODULES ----------------- */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>สัดส่วนการใช้เวลาตาม 4 โมดูลหลัก</span>
          </span>
          <span className="text-xs text-slate-500 font-normal">รวม {calculatedTotalHours} ชั่วโมง</span>
        </div>

        {/* Multi-segmented Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          {moduleBreakdown.map((item, idx) => (
            <div
              key={idx}
              className={`${item.color} transition-all duration-500`}
              style={{ width: `${item.percent}%` }}
              title={`${item.name}: ${item.hours} (${item.percent}%)`}
            />
          ))}
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          {moduleBreakdown.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="font-semibold text-slate-800 truncate">{item.name}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-bold text-slate-700">{item.hours}</span>
                <span className={item.text}>{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
