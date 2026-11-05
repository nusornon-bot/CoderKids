import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { UserProfile } from '../types/index.ts';
import {
  Shield,
  Brain,
  Code2,
  Sparkles,
  TrendingUp,
  Target,
  Award,
  ArrowUpRight,
  ChevronRight,
  Info,
  CheckCircle2,
  Users,
} from 'lucide-react';

export interface SkillItem {
  id: 'safety' | 'thinking' | 'codingLab' | 'showcase';
  name: string;
  shortName: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  fillColor: string;
  strokeColor: string;
  description: string;
  benchmarkScore: number; // เกณฑ์มาตรฐาน สพฐ.
  classAvgScore: number;  // ค่าเฉลี่ยห้องเรียน
  rubrics: string[];
}

export interface SkillsRadarChartProps {
  moduleProgress: {
    safety: boolean;
    thinking: boolean;
    codingLab: boolean;
    showcase: boolean;
  };
  points: number;
  profile?: UserProfile;
  onNavigate?: (moduleKey: string) => void;
}

export const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({
  moduleProgress,
  points,
  profile,
  onNavigate,
}) => {
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [showClassAvg, setShowClassAvg] = useState(false);
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  // 4 Core Competencies Definition
  const skillDefinitions: SkillItem[] = useMemo(
    () => [
      {
        id: 'safety',
        name: 'ความปลอดภัยไซเบอร์ & PDPA',
        shortName: 'ความปลอดภัย',
        category: 'Digital Safety & PDPA',
        icon: <Shield className="w-4 h-4 text-emerald-500" />,
        color: '#10b981',
        fillColor: 'rgba(16, 185, 129, 0.25)',
        strokeColor: '#059669',
        description: 'การคุ้มครองข้อมูลส่วนบุคคล การตั้งรหัสผ่านรัดกุม มารยาทดิจิทัล และการรู้เท่าทันภัยไซเบอร์',
        benchmarkScore: 75,
        classAvgScore: 70,
        rubrics: [
          'จำแนกข้อมูลส่วนบุคคลทั่วไปและข้อมูลอ่อนไหวตาม PDPA ได้ถูกต้อง',
          'เข้าใจหลักการสร้างรหัสผ่านที่มีความซับซ้อนและการยืนยันตัวตน',
          'ปฏิบัติตามมารยาทไซเบอร์ ไม่ละเมิดความเป็นส่วนตัวของผู้อื่น',
        ],
      },
      {
        id: 'thinking',
        name: 'อัลกอริทึม & ลำดับขั้นตอน',
        shortName: 'อัลกอริทึม',
        category: 'Algorithmic Thinking',
        icon: <Brain className="w-4 h-4 text-indigo-500" />,
        color: '#6366f1',
        fillColor: 'rgba(99, 102, 241, 0.25)',
        strokeColor: '#4f46e5',
        description: 'การคิดเชิงคำนวณ 4 เสาหลัก การแตกปัญหาย่อย ลำดับขั้นตอน และโครงสร้างควบคุมแบบวนซ้ำ/เงื่อนไข',
        benchmarkScore: 70,
        classAvgScore: 65,
        rubrics: [
          'ออกแบบลำดับขั้นตอน (Flowchart & Pseudo-code) ในการแก้ปัญหาได้',
          'ประยุกต์ใช้แนวคิดเงื่อนไข If-Else และการทำซ้ำ Loops ได้อย่างถูกต้อง',
          'สามารถตรวจสอบและแก้ไขข้อผิดพลาดของลำดับขั้นตอน (Debugging)',
        ],
      },
      {
        id: 'codingLab',
        name: 'โค้ดดิ้ง Scratch & Micro:bit',
        shortName: 'โค้ดดิ้ง',
        category: 'Coding & IoT Lab',
        icon: <Code2 className="w-4 h-4 text-sky-500" />,
        color: '#0284c7',
        fillColor: 'rgba(2, 132, 199, 0.25)',
        strokeColor: '#0369a1',
        description: 'การเขียนโปรแกรมเชิงภาพ Scratch การเชื่อมต่อเซ็นเซอร์ฮาร์ดแวร์ Micro:bit และการสร้างตรรกะเกม',
        benchmarkScore: 80,
        classAvgScore: 68,
        rubrics: [
          'ประกอบบล็อกคำสั่งควบคุมการเคลื่อนที่ กราฟิก และตัวแปรใน Scratch',
          'จำลองการอ่านค่าเซ็นเซอร์แสง อุณหภูมิ และปุ่มกดบน Micro:bit',
          'สร้างปฏิสัมพันธ์ระหว่างผู้เล่นและโค้ดโปรแกรมได้อย่างสมบูรณ์',
        ],
      },
      {
        id: 'showcase',
        name: 'ความคิดสร้างสรรค์ & การสะท้อนคิด',
        shortName: 'ความคิดสร้างสรรค์',
        category: 'Creativity & Reflection',
        icon: <Sparkles className="w-4 h-4 text-purple-500" />,
        color: '#a855f7',
        fillColor: 'rgba(168, 85, 247, 0.25)',
        strokeColor: '#7e22ce',
        description: 'การสร้างสรรค์โครงงานนวัตกรรม การให้ข้อเสนอแนะเชิงบวก (2 Stars & Wish) และบันทึกสะท้อนคิด 3-2-1',
        benchmarkScore: 75,
        classAvgScore: 72,
        rubrics: [
          'ออกแบบโครงงานที่ตอบโจทย์และแก้ปัญหาในชีวิตประจำวัน',
          'ให้ข้อเสนอแนะสร้างสรรค์แก่เพื่อนร่วมชั้นตามหลัก Two Stars & A Wish',
          'สรุปองค์ความรู้และประเมินตนเองผ่านสมุดบันทึกสะท้อนคิด 3-2-1',
        ],
      },
    ],
    []
  );

  // Dynamic Skill Score Computation (0 - 100)
  const userScores = useMemo(() => {
    // Base scores from module completion & overall points factor
    const pointsBonus = Math.min(25, Math.floor(points / 15)); // up to +25 from points

    return {
      safety: moduleProgress.safety ? Math.min(100, 80 + pointsBonus) : Math.min(65, 45 + pointsBonus),
      thinking: moduleProgress.thinking ? Math.min(100, 78 + pointsBonus) : Math.min(60, 40 + pointsBonus),
      codingLab: moduleProgress.codingLab ? Math.min(100, 82 + pointsBonus) : Math.min(65, 42 + pointsBonus),
      showcase: moduleProgress.showcase ? Math.min(100, 85 + pointsBonus) : Math.min(60, 38 + pointsBonus),
    };
  }, [moduleProgress, points]);

  // Overall Average Score
  const overallAvg = useMemo(() => {
    const vals = Object.values(userScores);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [userScores]);

  // SVG Geometry Dimensions
  const size = 320;
  const radius = 105;
  const center = size / 2;
  const levels = [20, 40, 60, 80, 100];
  const angleSlice = (Math.PI * 2) / skillDefinitions.length;

  // D3 Scale: Linear mapping 0-100 to 0-radius
  const rScale = useMemo(() => {
    return d3.scaleLinear().domain([0, 100]).range([0, radius]);
  }, [radius]);

  // Polar to Cartesian Helper Function
  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleSlice - Math.PI / 2; // start from top
    return {
      x: center + rScale(value) * Math.cos(angle),
      y: center + rScale(value) * Math.sin(angle),
    };
  };

  // Generate Polygon Path Points string
  const getUserPolygonPoints = () => {
    return skillDefinitions
      .map((skill, index) => {
        const val = userScores[skill.id] || 50;
        const { x, y } = getCoordinates(val, index);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const getBenchmarkPolygonPoints = () => {
    return skillDefinitions
      .map((skill, index) => {
        const { x, y } = getCoordinates(skill.benchmarkScore, index);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const getClassAvgPolygonPoints = () => {
    return skillDefinitions
      .map((skill, index) => {
        const { x, y } = getCoordinates(skill.classAvgScore, index);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const activeSkill = skillDefinitions.find((s) => s.id === activeSkillId) || skillDefinitions[0];

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>COMPUTING SCIENCE COMPETENCY RADAR</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>แผนภูมิเรดาร์ประเมินระดับทักษะ (Skills Radar Chart)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              D3 Engine
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            วิเคราะห์ความเชี่ยวชาญ 4 ด้านหลักตามหลักสูตรแกนกลาง สพฐ. &amp; สสวท. คำนวณจากความก้าวหน้าในบทเรียน
            แต้มสะสม และการทำกิจกรรมในระบบ
          </p>
        </div>

        {/* Legend / Toggles */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setShowBenchmark(!showBenchmark)}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              showBenchmark
                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>เกณฑ์มาตรฐาน สพฐ. (75%)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClassAvg(!showClassAvg)}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              showClassAvg
                ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>ค่าเฉลี่ยห้องเรียน</span>
          </button>
        </div>
      </div>

      {/* 2. Main Radar Layout (D3 SVG Chart + Interactive Skill Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: D3 Radar Chart Graphic */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-50/70 rounded-3xl border border-slate-100 relative">
          <div className="relative w-[320px] h-[320px] max-w-full">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full overflow-visible select-none"
            >
              <defs>
                {/* Radial Gradient for User Skills Area */}
                <radialGradient id="userRadarGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                  <stop offset="70%" stopColor="#818cf8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.15" />
                </radialGradient>

                {/* Drop shadow filter */}
                <filter id="radarShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* 1. Concentric Web Rings (Levels 20%, 40%, 60%, 80%, 100%) */}
              {levels.map((lvl) => {
                const webPoints = skillDefinitions
                  .map((_, i) => {
                    const { x, y } = getCoordinates(lvl, i);
                    return `${x},${y}`;
                  })
                  .join(' ');

                return (
                  <g key={lvl}>
                    <polygon
                      points={webPoints}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth={lvl === 100 ? '1.5' : '1'}
                      strokeDasharray={lvl === 100 ? 'none' : '3,3'}
                    />
                    <text
                      x={center + 4}
                      y={center - rScale(lvl) - 2}
                      fontSize="9"
                      fill="#94a3b8"
                      className="font-mono font-bold"
                    >
                      {lvl}%
                    </text>
                  </g>
                );
              })}

              {/* 2. Axis Spokes (Center to Edges) */}
              {skillDefinitions.map((skill, i) => {
                const { x, y } = getCoordinates(100, i);
                return (
                  <line
                    key={skill.id}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#cbd5e1"
                    strokeWidth="1.2"
                  />
                );
              })}

              {/* 3. Target Benchmark Polygon (Dashed Gold) */}
              {showBenchmark && (
                <polygon
                  points={getBenchmarkPolygonPoints()}
                  fill="rgba(245, 158, 11, 0.08)"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  className="transition-all duration-300 pointer-events-none"
                />
              )}

              {/* 4. Classroom Average Polygon (Sky Blue) */}
              {showClassAvg && (
                <polygon
                  points={getClassAvgPolygonPoints()}
                  fill="rgba(14, 165, 233, 0.08)"
                  stroke="#0ea5e9"
                  strokeWidth="1.8"
                  strokeDasharray="2,2"
                  className="transition-all duration-300 pointer-events-none"
                />
              )}

              {/* 5. User Skills Active Polygon */}
              <polygon
                points={getUserPolygonPoints()}
                fill="url(#userRadarGradient)"
                stroke="#4f46e5"
                strokeWidth="2.5"
                filter="url(#radarShadow)"
                className="transition-all duration-300"
              />

              {/* 6. Data Points (Vertices) & Axis Label Nodes */}
              {skillDefinitions.map((skill, index) => {
                const val = userScores[skill.id];
                const { x, y } = getCoordinates(val, index);
                const isSelected = activeSkillId === skill.id;

                // Outer label placement with offset
                const labelCoord = getCoordinates(126, index);

                return (
                  <g
                    key={skill.id}
                    onClick={() => setActiveSkillId(skill.id)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring on selected */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="11"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                        className="animate-ping opacity-60"
                      />
                    )}

                    {/* Vertex Dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 6.5 : 5}
                      fill={skill.color}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-all duration-200 group-hover:scale-125"
                    />

                    {/* Value Badge on vertex */}
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#1e293b"
                      fontWeight="bold"
                      className="font-mono"
                    >
                      {val}%
                    </text>

                    {/* External Skill Name Label */}
                    <text
                      x={labelCoord.x}
                      y={labelCoord.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="11"
                      fontWeight={isSelected ? 'bold' : '600'}
                      fill={isSelected ? '#4338ca' : '#475569'}
                      className="transition-colors group-hover:fill-indigo-600"
                    >
                      {skill.shortName}
                    </text>
                  </g>
                );
              })}

              {/* Center Pivot Indicator */}
              <circle cx={center} cy={center} r="3" fill="#64748b" />
            </svg>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              <span>ระดับของคุณ ({overallAvg}%)</span>
            </span>
            {showBenchmark && (
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-amber-500 inline-block border-t border-dashed border-amber-500" />
                <span>เป้าหมาย สพฐ.</span>
              </span>
            )}
            {showClassAvg && (
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-sky-500 inline-block" />
                <span>ค่าเฉลี่ยห้องเรียน</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Detailed Skill Inspector & Action Recommendation */}
        <div className="lg:col-span-6 space-y-4">
          {/* Quick Skill Selector Chips */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {skillDefinitions.map((s) => {
              const score = userScores[s.id];
              const isSelected = activeSkill.id === s.id;
              const isDone = moduleProgress[s.id];

              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSkillId(s.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-400/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-0.5">{s.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 truncate flex items-center justify-between">
                      <span>{s.shortName}</span>
                      <span className="font-mono text-indigo-700 font-extrabold">{score}%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      {isDone ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> ผ่านโมดูลแล้ว
                        </span>
                      ) : (
                        <span>กำลังเรียนรู้</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Skill Detailed Card */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  {activeSkill.icon}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{activeSkill.name}</h4>
                  <span className="text-[10px] text-slate-500 font-medium">{activeSkill.category}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-indigo-700 font-mono leading-none">
                  {userScores[activeSkill.id]}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {userScores[activeSkill.id] >= 80 ? 'ระดับชำนาญ (Master)' : 'กำลังพัฒนา (Developing)'}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeSkill.description}
            </p>

            {/* Rubrics Checklist */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Info className="w-3 h-3 text-indigo-600" />
                <span>เกณฑ์ประเมินสมรรถนะ (Curriculum Rubrics):</span>
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
                {activeSkill.rubrics.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-indigo-600 font-bold shrink-0">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action CTA Button */}
            {onNavigate && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate(activeSkill.id)}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
                >
                  <span>เข้าสู่ห้องเรียนเพื่ออัปเกรดทักษะด้านนี้</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
