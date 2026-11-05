import React, { useMemo } from 'react';
import { LeaderboardEntry } from '../types/index.ts';
import {
  X,
  Trophy,
  Brain,
  Shield,
  Code2,
  Palette,
  Sparkles,
  Printer,
  ArrowRight,
  Award,
  CheckCircle2,
  TrendingUp,
  GraduationCap,
  School,
  ExternalLink,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';

export interface StudentSkillStats {
  safety: number;
  thinking: number;
  codingLab: number;
  showcase: number;
  strongest: {
    key: 'safety' | 'thinking' | 'codingLab' | 'showcase';
    title: string;
    shortTitle: string;
    score: number;
    emoji: string;
    color: string;
    badgeClass: string;
    description: string;
    curriculumIndicator: string;
  };
  growth: {
    key: 'safety' | 'thinking' | 'codingLab' | 'showcase';
    title: string;
    score: number;
    tip: string;
    targetTab: string;
  };
}

export const computeStudentSkills = (
  entry: LeaderboardEntry,
  isCurrentUser: boolean,
  completedModulesCount = 0,
  currentUserPoints = 0
): StudentSkillStats => {
  let safety = 80;
  let thinking = 80;
  let codingLab = 80;
  let showcase = 80;

  if (isCurrentUser) {
    safety = Math.min(100, 68 + (completedModulesCount >= 1 ? 24 : 6) + Math.min(8, Math.floor(currentUserPoints / 35)));
    thinking = Math.min(100, 62 + (completedModulesCount >= 2 ? 28 : 8) + Math.min(10, Math.floor(currentUserPoints / 25)));
    codingLab = Math.min(100, 58 + (completedModulesCount >= 3 ? 32 : 8) + Math.min(10, Math.floor(currentUserPoints / 22)));
    showcase = Math.min(100, 64 + (completedModulesCount >= 4 ? 26 : 10) + Math.min(10, Math.floor(currentUserPoints / 30)));
  } else if (entry.skillScores) {
    safety = entry.skillScores.safety;
    thinking = entry.skillScores.thinking;
    codingLab = entry.skillScores.codingLab;
    showcase = entry.skillScores.showcase;
  } else {
    // Deterministic hash based on ID
    const hash = (entry.studentId || entry.studentName).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const pBonus = Math.min(12, Math.floor(entry.points / 25));
    safety = Math.min(99, Math.max(65, 72 + (hash % 20) + pBonus));
    thinking = Math.min(99, Math.max(65, 74 + ((hash * 3) % 20) + pBonus));
    codingLab = Math.min(99, Math.max(65, 70 + ((hash * 7) % 22) + pBonus));
    showcase = Math.min(99, Math.max(65, 68 + ((hash * 11) % 24) + pBonus));
  }

  const items = [
    {
      key: 'safety' as const,
      title: 'ความปลอดภัยไซเบอร์ & PDPA',
      shortTitle: 'ความปลอดภัย',
      score: safety,
      emoji: '🛡️',
      color: '#10b981',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700',
      description: 'วิเคราะห์ภัยไซเบอร์ รู้จักการปกป้องข้อมูลส่วนบุคคล (PDPA) มารยาทดิจิทัล และรู้เท่าทันการหลอกลวง (Phishing)',
      curriculumIndicator: 'ว 4.2 มฐ. การใช้เทคโนโลยีสารสนเทศอย่างปลอดภัยและมีจริยธรรม',
      tip: 'ทบทวนภารกิจใน Safe Sharing Game และทำแบบทดสอบ Safety Quiz เพิ่มเติม',
      targetTab: 'safety',
    },
    {
      key: 'thinking' as const,
      title: 'การคิดเชิงคำนวณ & อัลกอริทึม',
      shortTitle: 'อัลกอริทึม',
      score: thinking,
      emoji: '🧠',
      color: '#6366f1',
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700',
      description: 'แตกปัญหาย่อย (Decomposition) ตรวจหารูปแบบซ้ำ และออกแบบขั้นตอนคำสั่งแบบมีเงื่อนไขและลูปวนซ้ำได้อย่างเป็นระบบ',
      curriculumIndicator: 'ว 4.2 มฐ. การออกแบบและการเขียนอัลกอริทึมในการแก้ปัญหา',
      tip: 'ลับสมองด้วยโจทย์ปัญหา Bebras Arena และจำลองโค้ดทีละขั้นใน Code Tracer',
      targetTab: 'thinking',
    },
    {
      key: 'codingLab' as const,
      title: 'การเขียนโค้ด Scratch & Micro:bit',
      shortTitle: 'โค้ดดิ้ง & IoT',
      score: codingLab,
      emoji: '💻',
      color: '#0284c7',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-700',
      description: 'ประกอบบล็อกคำสั่ง Scratch สร้างสรรค์เกม/แอนิเมชัน และเขียนโปรแกรมควบคุมเซ็นเซอร์บอร์ด Micro:bit',
      curriculumIndicator: 'ว 4.2 มฐ. การเขียนโปรแกรมและการตรวจหาข้อผิดพลาดของโปรแกรม',
      tip: 'ลงมือประดิษฐ์ใน Scratch Studio หรือฝึกเชื่อมต่อเซ็นเซอร์ใน Micro:bit Data Logger',
      targetTab: 'codingLab',
    },
    {
      key: 'showcase' as const,
      title: 'ความคิดสร้างสรรค์ & สะท้อนคิด',
      shortTitle: 'สร้างสรรค์',
      score: showcase,
      emoji: '🎨',
      color: '#ec4899',
      badgeClass: 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-700',
      description: 'ริเริ่มโครงงานที่มีเอกลักษณ์ ให้ข้อเสนอแนะเชิงบวก (2 Stars and a Wish) และบันทึกสะท้อนคิดการเรียนรู้ได้อย่างลึกซึ้ง',
      curriculumIndicator: 'ว 4.2 มฐ. การสื่อสารและแบ่งปันผลงานการแก้ปัญหาอย่างสร้างสรรค์',
      tip: 'ส่งผลงานขึ้น Showcase Gallery และร่วมให้คำชมเพื่อนใน Peer Review Wall',
      targetTab: 'showcase',
    },
  ];

  const sorted = [...items].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const growth = sorted[sorted.length - 1];

  return {
    safety,
    thinking,
    codingLab,
    showcase,
    strongest,
    growth: {
      key: growth.key,
      title: growth.title,
      score: growth.score,
      tip: growth.tip,
      targetTab: growth.targetTab,
    },
  };
};

export interface StudentSkillRadarModalProps {
  entry: LeaderboardEntry | null;
  isOpen: boolean;
  onClose: () => void;
  completedModulesCount?: number;
  currentUserPoints?: number;
  gradeAverage?: { safety: number; thinking: number; codingLab: number; showcase: number };
  onNavigate?: (tab: string, subSection?: string) => void;
}

export const StudentSkillRadarModal: React.FC<StudentSkillRadarModalProps> = ({
  entry,
  isOpen,
  onClose,
  completedModulesCount = 0,
  currentUserPoints = 0,
  gradeAverage = { safety: 82, thinking: 85, codingLab: 81, showcase: 83 },
  onNavigate,
}) => {
  if (!isOpen || !entry) return null;

  const isMe = Boolean(entry.isCurrentUser);
  const stats = useMemo(
    () => computeStudentSkills(entry, isMe, completedModulesCount, currentUserPoints),
    [entry, isMe, completedModulesCount, currentUserPoints]
  );

  // Radar geometry
  const cx = 160;
  const cy = 150;
  const radius = 95;

  // Vertex order:
  // 0: Top = Thinking
  // 1: Right = CodingLab
  // 2: Bottom = Showcase
  // 3: Left = Safety
  const getVertex = (score: number, angleIdx: number) => {
    const ratio = Math.max(0.1, Math.min(1, score / 100));
    const r = radius * ratio;
    switch (angleIdx) {
      case 0: // Top
        return { x: cx, y: cy - r };
      case 1: // Right
        return { x: cx + r, y: cy };
      case 2: // Bottom
        return { x: cx, y: cy + r };
      case 3: // Left
        return { x: cx - r, y: cy };
      default:
        return { x: cx, y: cy };
    }
  };

  const studentTop = getVertex(stats.thinking, 0);
  const studentRight = getVertex(stats.codingLab, 1);
  const studentBottom = getVertex(stats.showcase, 2);
  const studentLeft = getVertex(stats.safety, 3);
  const studentPointsString = `${studentTop.x},${studentTop.y} ${studentRight.x},${studentRight.y} ${studentBottom.x},${studentBottom.y} ${studentLeft.x},${studentLeft.y}`;

  const avgTop = getVertex(gradeAverage.thinking, 0);
  const avgRight = getVertex(gradeAverage.codingLab, 1);
  const avgBottom = getVertex(gradeAverage.showcase, 2);
  const avgLeft = getVertex(gradeAverage.safety, 3);
  const avgPointsString = `${avgTop.x},${avgTop.y} ${avgRight.x},${avgRight.y} ${avgBottom.x},${avgBottom.y} ${avgLeft.x},${avgLeft.y}`;

  const handlePrint = () => {
    soundEffects.play('click');
    window.print();
  };

  const handleGoToGrowthModule = () => {
    if (onNavigate && stats.growth.targetTab) {
      soundEffects.play('click');
      onClose();
      onNavigate(stats.growth.targetTab);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-5 sm:p-6">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${entry.avatarColor || 'bg-indigo-600'} text-white font-black flex items-center justify-center text-2xl sm:text-3xl shadow-lg ring-4 ring-white/20 shrink-0`}
              >
                {entry.avatarEmoji || '🐱'}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                    {entry.studentName}
                  </h3>
                  {entry.nickname && (
                    <span className="text-indigo-200 font-medium text-sm">
                      ({entry.nickname})
                    </span>
                  )}
                  {isMe && (
                    <span className="text-[10px] bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded-full shadow-xs">
                      คุณ (My Profile)
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-indigo-200 mt-1">
                  <span className="font-mono text-white/90 font-bold">
                    {entry.studentId || 'CK-2569-4101'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                    <span>{entry.grade}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 truncate max-w-[180px] sm:max-w-none">
                    <School className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{entry.school}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-amber-300 text-xs font-bold border border-white/20">
                    <Trophy className="w-3 h-3 text-amber-300" />
                    <span>อันดับที่ #{entry.rank || 1}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-white text-xs font-mono font-bold">
                    <span>{entry.points} แต้มสะสม XP</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Strongest Skill Highlight Banner */}
        <div className="px-5 sm:px-6 pt-5 pb-2">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-50/50 to-orange-50/60 dark:from-amber-950/40 dark:via-slate-800 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                {stats.strongest.emoji}
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>ทักษะที่เก่งที่สุด (Strongest Competency)</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                  {stats.strongest.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {stats.strongest.description}
                </div>
              </div>
            </div>

            <div className="sm:text-right shrink-0 bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {stats.strongest.score}%
              </div>
              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center sm:justify-end gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>ระดับเชี่ยวชาญ (Master)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Main Body: Radar Chart on Left & Competency Details on Right */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: SVG Radar Chart */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-[320px] aspect-square relative flex items-center justify-center">
              <svg viewBox="0 0 320 300" className="w-full h-full overflow-visible">
                {/* Background Concentric Polygons */}
                {[0.25, 0.5, 0.75, 1].map((lvl) => {
                  const r = radius * lvl;
                  const pts = `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
                  return (
                    <g key={lvl}>
                      <polygon
                        points={pts}
                        fill={lvl === 1 ? 'rgba(248, 250, 252, 0.8)' : 'none'}
                        stroke="#cbd5e1"
                        strokeWidth={lvl === 1 ? '1.5' : '1'}
                        strokeDasharray={lvl === 1 ? 'none' : '3 3'}
                        className="dark:stroke-slate-700 dark:fill-slate-800/40"
                      />
                      <text
                        x={cx + 3}
                        y={cy - r + 9}
                        fontSize="9"
                        fill="#94a3b8"
                        className="font-mono font-bold select-none"
                      >
                        {Math.round(lvl * 100)}%
                      </text>
                    </g>
                  );
                })}

                {/* Axes */}
                <line x1={cx} y1={cy - radius} x2={cx} y2={cy + radius} stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-slate-700" />
                <line x1={cx - radius} y1={cy} x2={cx + radius} y2={cy} stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-slate-700" />

                {/* Benchmark (Grade Average) Polygon - Dashed Green */}
                <polygon
                  points={avgPointsString}
                  fill="rgba(16, 185, 129, 0.12)"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />

                {/* Student Skill Polygon - Vibrant Indigo Gradient */}
                <polygon
                  points={studentPointsString}
                  fill="rgba(99, 102, 241, 0.35)"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />

                {/* Vertex Dots - Student */}
                {[studentTop, studentRight, studentBottom, studentLeft].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#4f46e5"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="drop-shadow-xs"
                  />
                ))}

                {/* Outer Axis Labels */}
                {/* Top: Thinking */}
                <g className="cursor-default">
                  <text
                    x={cx}
                    y={cy - radius - 14}
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-indigo-700 dark:fill-indigo-300 select-none"
                  >
                    🧠 การคิดเชิงคำนวณ ({stats.thinking}%)
                  </text>
                </g>

                {/* Right: CodingLab */}
                <g className="cursor-default">
                  <text
                    x={cx + radius + 10}
                    y={cy + 4}
                    textAnchor="start"
                    className="text-[11px] font-bold fill-sky-700 dark:fill-sky-300 select-none"
                  >
                    💻 โค้ดดิ้ง ({stats.codingLab}%)
                  </text>
                </g>

                {/* Bottom: Showcase */}
                <g className="cursor-default">
                  <text
                    x={cx}
                    y={cy + radius + 18}
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-pink-700 dark:fill-pink-300 select-none"
                  >
                    🎨 สร้างสรรค์ ({stats.showcase}%)
                  </text>
                </g>

                {/* Left: Safety */}
                <g className="cursor-default">
                  <text
                    x={cx - radius - 10}
                    y={cy + 4}
                    textAnchor="end"
                    className="text-[11px] font-bold fill-emerald-700 dark:fill-emerald-300 select-none"
                  >
                    🛡️ ความปลอดภัย ({stats.safety}%)
                  </text>
                </g>
              </svg>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-4 text-xs font-semibold mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 w-full">
              <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                <span>คะแนนของผู้เรียน</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <span className="w-3 h-0.5 bg-emerald-500 border border-emerald-500 border-dashed" />
                <span>ค่าเฉลี่ยระดับชั้น ({entry.grade})</span>
              </span>
            </div>
          </div>

          {/* Right: Detailed Competency Breakdown */}
          <div className="md:col-span-6 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>ผลการประเมิน 4 สมรรถนะ (ว 4.2 สสวท.)</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">เต็ม 100%</span>
            </div>

            {/* 4 Skill Bars */}
            <div className="space-y-2.5">
              {/* Safety */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>ความปลอดภัยไซเบอร์ &amp; PDPA</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.safety}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.safety}%` }}
                  />
                </div>
              </div>

              {/* Thinking */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>🧠</span>
                    <span>การคิดเชิงคำนวณ &amp; อัลกอริทึม</span>
                  </span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {stats.thinking}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.thinking}%` }}
                  />
                </div>
              </div>

              {/* CodingLab */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>💻</span>
                    <span>โค้ดดิ้ง Scratch &amp; Micro:bit</span>
                  </span>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                    {stats.codingLab}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.codingLab}%` }}
                  />
                </div>
              </div>

              {/* Showcase */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>🎨</span>
                    <span>ความคิดสร้างสรรค์ &amp; สะท้อนคิด</span>
                  </span>
                  <span className="font-mono font-bold text-pink-600 dark:text-pink-400">
                    {stats.showcase}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-pink-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.showcase}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Growth Recommendation Card */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                <span className="flex items-center gap-1">
                  <span>💡</span>
                  <span>โอกาสพัฒนาต่อยอด (Growth Area):</span>
                </span>
                <span className="font-mono text-indigo-700 dark:text-indigo-400">{stats.growth.score}%</span>
              </div>
              <div className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                {stats.growth.tip}
              </div>
              {onNavigate && isMe && (
                <button
                  onClick={handleGoToGrowthModule}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <span>ไปฝึกฝนโมดูลนี้ทันที</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>เทียบมาตรฐานการเรียนรู้วิทยาการคำนวณ ว 4.2 สพฐ. / สสวท.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs border border-slate-200 dark:border-slate-700 shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ใบบันทึกผลสมรรถนะ (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
