import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Brain,
  Code2,
  Share2,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Trophy,
  Flame,
  Award,
  Star,
  Compass,
  Play,
  RotateCcw,
  Zap,
  ChevronRight,
  Eye,
  Info,
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';
import { soundEffects } from '../utils/soundEffects.ts';
import confetti from 'canvas-confetti';

interface PersonalizedLearningMapProps {
  moduleProgress: {
    safety: boolean;
    thinking: boolean;
    codingLab: boolean;
    showcase: boolean;
  };
  points: number;
  profile: UserProfile;
  onNavigate: (moduleKey: string, subSection?: string) => void;
  onOpenCertificate?: () => void;
  onCelebrate?: () => void;
}

export interface StageNode {
  id: string;
  moduleKey: 'safety' | 'thinking' | 'codingLab' | 'showcase';
  stageNumber: number;
  name: string;
  realmName: string;
  themeColor: string;
  accentBg: string;
  borderColor: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  description: string;
  curriculumStandard: string;
  rewardExp: number;
  subQuests: {
    title: string;
    subSection?: string;
    type: string;
  }[];
  diagnosticTip: string;
}

export const PersonalizedLearningMap: React.FC<PersonalizedLearningMapProps> = ({
  moduleProgress,
  points,
  profile,
  onNavigate,
  onOpenCertificate,
  onCelebrate,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>('safety');
  const [viewMode, setViewMode] = useState<'map' | 'diagnostic'>('map');

  // 1. Analyze Student Progress & Diagnostics
  const {
    completedCount,
    progressPercent,
    currentActiveStageKey,
    studentRankTitle,
    motivationalMessage,
    nextMilestoneDesc,
  } = useMemo(() => {
    const completedArr = [
      moduleProgress.safety,
      moduleProgress.thinking,
      moduleProgress.codingLab,
      moduleProgress.showcase,
    ];
    const count = completedArr.filter(Boolean).length;
    const pct = Math.round((count / 4) * 100);

    let activeKey: 'safety' | 'thinking' | 'codingLab' | 'showcase' = 'safety';
    if (!moduleProgress.safety) {
      activeKey = 'safety';
    } else if (!moduleProgress.thinking) {
      activeKey = 'thinking';
    } else if (!moduleProgress.codingLab) {
      activeKey = 'codingLab';
    } else if (!moduleProgress.showcase) {
      activeKey = 'showcase';
    } else {
      activeKey = 'showcase';
    }

    // Rank Title analysis
    let rankTitle = 'ผู้เริ่มต้นการเดินทางไซเบอร์ (Cyber Cadet)';
    let msg = 'ยินดีต้อนรับสู่โลกแห่งโค้ดดิ้ง! เริ่มต้นสร้างเกราะความปลอดภัยดิจิทัลด่านแรกกันเลย';
    let nextDesc = 'พิชิตด่านที่ 1 เพื่อรับเกราะ Cyber Shield และ +50 EXP';

    if (count === 1) {
      rankTitle = 'ผู้พิทักษ์ข้อมูลดิจิทัล (Digital Guardian)';
      msg = 'เกราะไซเบอร์ของคุณแข็งแกร่งแล้ว! ก้าวต่อไปคือการฝึกแยกย่อยปัญหาและออกแบบอัลกอริทึม';
      nextDesc = 'พิชิตด่านที่ 2 เพื่อปลดล็อกตราประทับ Logic Master';
    } else if (count === 2) {
      rankTitle = 'นักสืบตรรกะ & อัลกอริทึม (Logic Architect)';
      msg = 'คุณคิดเป็นระบบอย่างยอดเยี่ยม! ถึงเวลาสร้างผลงานจริงด้วย Scratch และบอร์ด Micro:bit';
      nextDesc = 'พิชิตด่านที่ 3 เพื่อเป็นนักประดิษฐ์โค้ดและควบคุมฮาร์ดแวร์ IoT';
    } else if (count === 3) {
      rankTitle = 'โปรแกรมเมอร์ผู้สร้างสรรค์ (Creative Coder)';
      msg = 'ผลงานโปรแกรมของคุณน่าทึ่งมาก! ไปยังด่านสุดท้ายเพื่อแลกเปลี่ยนความคิดเห็นกับเพื่อนและรับเกียรติบัตร';
      nextDesc = 'พิชิตด่านที่ 4 เพื่อสำเร็จหลักสูตรและออกเกียรติบัตร ว 4.2 สพฐ.';
    } else if (count === 4) {
      rankTitle = 'สุดยอดมาสเตอร์โค้ดเดอร์ ว 4.2 (Grand Master)';
      msg = '🎉 มหัศจรรย์มาก! คุณพิชิตครบทุกดินแดนแห่งการเรียนรู้แล้ว พร้อมรับเกียรติบัตรอย่างเป็นทางการ!';
      nextDesc = 'สำเร็จครบ 100%! ร่วมแบ่งปันแรงบันดาลใจและเป็นพี่เลี้ยงให้เพื่อนๆ ในห้องเรียน';
    }

    return {
      completedCount: count,
      progressPercent: pct,
      currentActiveStageKey: activeKey,
      studentRankTitle: rankTitle,
      motivationalMessage: msg,
      nextMilestoneDesc: nextDesc,
    };
  }, [moduleProgress]);

  // 2. Configure 4 Adventure Stages with status
  const stages: StageNode[] = useMemo(() => {
    return [
      {
        id: 'safety',
        moduleKey: 'safety',
        stageNumber: 1,
        name: 'เกราะคุ้มกันดิจิทัล & PDPA',
        realmName: 'เกาะพิทักษ์ไซเบอร์ (Cyber Safe Haven)',
        themeColor: 'from-emerald-500 to-teal-600',
        accentBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        borderColor: 'border-emerald-500',
        icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
        isCompleted: moduleProgress.safety,
        isCurrent: currentActiveStageKey === 'safety' && !moduleProgress.safety,
        isLocked: false,
        description: 'เรียนรู้การปกป้องข้อมูลส่วนบุคคลตามกฎหมาย PDPA การตั้งรหัสผ่านแบบสองชั้น และมารยาทชาวเน็ต Netiquette',
        curriculumStandard: 'ว 4.2 ป.4/4 & ป.5/4 การใช้เทคโนโลยีสารสนเทศอย่างปลอดภัย มีมารยาท',
        rewardExp: 50,
        subQuests: [
          { title: 'ห้องทดลองคุ้มครองข้อมูล PDPA Lab', subSection: 'pdpaLab', type: 'เกมจำแนกข้อมูล' },
          { title: 'ห้องปฏิบัติการวัดพลังรหัสผ่าน Password Lab', subSection: 'password', type: 'ตรวจสอบความปลอดภัย' },
          { title: 'สถานการณ์จำลองมารยาทดิจิทัล Netiquette', subSection: 'netiquette', type: 'วิเคราะห์สถานการณ์' },
          { title: 'แบบทดสอบใบประกาศความปลอดภัยไซเบอร์', subSection: 'quiz', type: 'ประเมิน 10 ข้อ' },
        ],
        diagnosticTip: moduleProgress.safety
          ? 'คุณมีความรู้รอบด้านเรื่องการปกป้องข้อมูลส่วนบุคคลและรู้เท่าทันภัยออนไลน์เป็นเลิศ'
          : 'ควรเริ่มจากเกม PDPA Lab เพื่อทำความคุ้นเคยกับข้อมูลที่ควรเก็บเป็นความลับ',
      },
      {
        id: 'thinking',
        moduleKey: 'thinking',
        stageNumber: 2,
        name: 'กรอบคิดเชิงคำนวณ & อัลกอริทึม',
        realmName: 'หุบเขาตรรกะแห่งปัญญา (Logic Mountain)',
        themeColor: 'from-sky-500 to-indigo-600',
        accentBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
        borderColor: 'border-sky-500',
        icon: <Brain className="w-5 h-5 text-sky-500" />,
        isCompleted: moduleProgress.thinking,
        isCurrent: currentActiveStageKey === 'thinking' && !moduleProgress.thinking,
        isLocked: !moduleProgress.safety,
        description: 'ฝึกฝน 4 เสาหลักการคิดเชิงคำนวณ (แยกย่อย, หารูปแบบ, สกัดสาระสำคัญ, ออกแบบอัลกอริทึม) และ 3 โครงสร้างควบคุม',
        curriculumStandard: 'ว 4.2 ป.4/1, ป.5/1, ป.6/1 การใช้เหตุผลเชิงตรรกะในการแก้ปัญหา',
        rewardExp: 65,
        subQuests: [
          { title: '4 เสาหลักการคิดเชิงคำนวณ (Computational Pillars)', subSection: 'pillars', type: 'ทฤษฎี & ตัวอย่าง' },
          { title: '3 โครงสร้างควบคุม: ลำดับ, ทางเลือก, การวนซ้ำ', subSection: 'controls', type: 'ผังงาน Flowchart' },
          { title: 'เกมไขปริศนาอัลกอริทึมหุ่นยนต์เขาวงกต 3 ด่าน', subSection: 'puzzle', type: 'เกมเขียนโปรแกรม' },
        ],
        diagnosticTip: moduleProgress.thinking
          ? 'ทักษะการแยกย่อยปัญหาและออกแบบขั้นตอนการทำงานมีประสิทธิภาพสูงมาก'
          : 'ต้องผ่านด่านเกราะคุ้มกันดิจิทัลก่อน หรือเข้าเล่นเกมเขาวงกตเพื่อฝึกเรียงลำดับคำสั่ง',
      },
      {
        id: 'codingLab',
        moduleKey: 'codingLab',
        stageNumber: 3,
        name: 'สตูดิโอโค้ดดิ้ง Scratch & Micro:bit',
        realmName: 'นครเวทมนตร์นักประดิษฐ์ (Coding Citadel)',
        themeColor: 'from-indigo-500 to-purple-600',
        accentBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
        borderColor: 'border-indigo-500',
        icon: <Code2 className="w-5 h-5 text-indigo-500" />,
        isCompleted: moduleProgress.codingLab,
        isCurrent: currentActiveStageKey === 'codingLab' && !moduleProgress.codingLab,
        isLocked: !moduleProgress.thinking,
        description: 'ลงมือเขียนบล็อกโค้ด Scratch บังคับตัวละคร วาดภาพเรขาคณิต และจำลองฮาร์ดแวร์ Micro:bit V2 พร้อมเซนเซอร์ IoT',
        curriculumStandard: 'ว 4.2 ป.4/2, ป.5/2, ป.6/2 ออกแบบและเขียนโปรแกรม ตรวจหาและแก้ไขข้อผิดพลาด',
        rewardExp: 80,
        subQuests: [
          { title: 'สตูดิโอ Scratch แคนวาส & บล็อกคำสั่งการเคลื่อนที่', subSection: 'scratch', type: 'แอนิเมชัน & เกม' },
          { title: 'ซิมูเลเตอร์บอร์ด Micro:bit V2 & ไฟ LED 5x5', subSection: 'microbit', type: 'ฮาร์ดแวร์เสมือน' },
          { title: 'การอ่านค่าเซนเซอร์แสง อุณหภูมิ และเข็มทิศ', subSection: 'microbit', type: 'IoT วิทยาศาสตร์' },
        ],
        diagnosticTip: moduleProgress.codingLab
          ? 'มีความสามารถระดับสูงในการใช้บล็อกคำสั่งวนซ้ำ เงื่อนไข และสร้างโปรเจกต์เชิงตอบโต้'
          : 'ต้องผ่านการคิดเชิงคำนวณก่อน จึงจะสามารถควบคุมบล็อกคำสั่งและตรวจจับบั๊กได้อย่างคล่องแคล่ว',
      },
      {
        id: 'showcase',
        moduleKey: 'showcase',
        stageNumber: 4,
        name: 'พื้นที่แลกเปลี่ยน & สะท้อนคิด',
        realmName: 'วิหารแห่งการแบ่งปัน (Showcase Sanctuary)',
        themeColor: 'from-purple-500 to-pink-600',
        accentBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
        borderColor: 'border-purple-500',
        icon: <Share2 className="w-5 h-5 text-purple-500" />,
        isCompleted: moduleProgress.showcase,
        isCurrent: currentActiveStageKey === 'showcase' && !moduleProgress.showcase,
        isLocked: !moduleProgress.codingLab,
        description: 'จัดแสดงผลงานโครงงานของคุณ แลกเปลี่ยนข้อเสนอแนะเชิงบวก (2 Stars & A Wish) และเขียนบันทึกสะท้อนคิด 3-2-1',
        curriculumStandard: 'ว 4.2 การนำเสนอข้อมูลสารสนเทศ และการประเมินตนเองตามเกณฑ์รูบริก',
        rewardExp: 100,
        subQuests: [
          { title: 'คลังผลงานเพื่อนนักเรียน (Student Showcase Gallery)', subSection: 'gallery', type: 'จัดแสดงผลงาน' },
          { title: 'กำแพงข้อเสนอแนะเพื่อน 2 Stars and a Wish', subSection: 'reviews', type: 'Peer Review' },
          { title: 'สมุดบันทึกสะท้อนผลการเรียนรู้ 3-2-1', subSection: 'reflection', type: 'Self Assessment' },
          { title: 'บันทึกการเรียนรู้ประจำวัน & รักษาสถิติ Streak', subSection: 'dailyJournal', type: 'Habit Tracker' },
        ],
        diagnosticTip: moduleProgress.showcase
          ? 'คุณมีความพร้อมครบทุกด้านทั้งความรู้ การลงมือทำ และการสะท้อนผลการเรียนรู้ สามารถรับเกียรติบัตรได้ทันที'
          : 'ส่งผลงานและร่วมให้คำชื่นชมเพื่อนๆ 2 Stars and a Wish เพื่อปลดล็อกเกียรติบัตรการศึกษา',
      },
    ];
  }, [moduleProgress, currentActiveStageKey]);

  const selectedStage = stages.find((s) => s.id === selectedStageId) || stages[0];

  const handleStageClick = (stage: StageNode) => {
    setSelectedStageId(stage.id);
    soundEffects.play('click');
  };

  const handleStartQuest = (stage: StageNode, subSection?: string) => {
    soundEffects.play('click');
    onNavigate(stage.moduleKey, subSection);
  };

  const handleClaimFinalTrophy = () => {
    soundEffects.play('victory');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    if (onOpenCertificate) {
      onOpenCertificate();
    } else if (onCelebrate) {
      onCelebrate();
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-indigo-500/30 text-white shadow-xl transition-all duration-300">
      {/* Background Ambience / Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Student Personal Status Bar */}
      <div className="relative z-10 px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-800/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          {/* Avatar with pulse ring */}
          <div className="relative shrink-0">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-2xl animate-bounce duration-1000">
                {profile.avatarEmoji || '🐱'}
              </div>
            </div>
            {/* Active Radar indicator */}
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
                แผนที่ความสำเร็จส่วนบุคคล (Personalized Learning Map) 🗺️
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                ว 4.2 สพฐ.
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{profile.name}</span>
              <span className="text-slate-600 dark:text-slate-500">•</span>
              <span className="text-amber-400 font-medium font-mono">ฉายา: {studentRankTitle}</span>
            </p>
          </div>
        </div>

        {/* Diagnostic Snapshot & Mode Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Overall Progress Gauge */}
          <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 px-3.5 py-2 rounded-2xl">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">ความสำเร็จรวม</div>
              <div className="text-base font-black text-cyan-400 font-mono leading-none">
                {progressPercent}% <span className="text-xs text-slate-400 font-normal">({completedCount}/4 ด่าน)</span>
              </div>
            </div>
            {/* Circular Mini Progress */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <Trophy className="w-4 h-4 text-amber-400 absolute" />
            </div>
          </div>

          {/* View Mode Toggle Button */}
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => { setViewMode('map'); soundEffects.play('click'); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>แผนที่เส้นทาง</span>
            </button>
            <button
              onClick={() => { setViewMode('diagnostic'); soundEffects.play('click'); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                viewMode === 'diagnostic'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>การวินิจฉัยเฉพาะบุคคล</span>
            </button>
          </div>
        </div>
      </div>

      {/* Motivational Coach Bar */}
      <div className="relative z-10 px-6 py-2.5 sm:px-8 bg-indigo-950/40 border-b border-indigo-900/40 flex items-center justify-between text-xs gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-indigo-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span><strong>คำแนะนำจากระบบ:</strong> {motivationalMessage}</span>
        </div>
        <div className="text-[11px] text-cyan-300 font-mono font-medium">
          🚩 {nextMilestoneDesc}
        </div>
      </div>

      {/* VIEW MODE 1: Interactive Adventure Map Pathway */}
      {viewMode === 'map' && (
        <div className="relative z-10 p-6 sm:p-8 space-y-6">
          {/* Main Visual Pathway (4 Connected Adventure Island Nodes) */}
          <div className="relative py-4">
            {/* Background SVG Animated Journey Track */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 -translate-y-1/2 h-4 pointer-events-none">
              {/* Static Track Background */}
              <div className="w-full h-2 bg-slate-800 rounded-full" />
              {/* Dynamic Animated Progress Track */}
              <div
                className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 transition-all duration-1000 shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                style={{ width: `${Math.min(100, Math.max(12, (completedCount / 4) * 100))}%` }}
              />
            </div>

            {/* 4 Interactive Stage Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
              {stages.map((stage, idx) => {
                const isSelected = selectedStageId === stage.id;

                return (
                  <div
                    key={stage.id}
                    onClick={() => handleStageClick(stage)}
                    className={`relative p-5 rounded-3xl transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-slate-800/95 ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/10 -translate-y-1'
                        : 'bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Node Indicator & Status Pill */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Step Number Circle */}
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-105 ${
                          stage.isCompleted
                            ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/30'
                            : stage.isCurrent
                            ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white animate-pulse shadow-cyan-500/40 ring-4 ring-cyan-500/20'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {stage.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : stage.isLocked ? (
                          <Lock className="w-4 h-4 text-slate-500" />
                        ) : (
                          <span>0{stage.stageNumber}</span>
                        )}
                      </div>

                      {/* Status Tag */}
                      {stage.isCompleted ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> พิชิตแล้ว
                        </span>
                      ) : stage.isCurrent ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse flex items-center gap-1">
                          <Zap className="w-3 h-3 text-cyan-400" /> กำลังลุยด่านนี้
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-500 border border-slate-700 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> ด่านรอปลดล็อก
                        </span>
                      )}
                    </div>

                    {/* Stage Name & Realm */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-mono font-medium text-cyan-400 truncate">
                        {stage.realmName}
                      </div>
                      <h4 className="font-bold text-white text-base leading-snug group-hover:text-cyan-200 transition-colors">
                        {stage.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>

                    {/* Bottom Action / Student Avatar Floating Indicator */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      {stage.isCurrent ? (
                        <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                          <span className="text-base">{profile.avatarEmoji || '🐱'}</span>
                          <span>คุณอยู่ที่นี่!</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          {stage.isCompleted ? '✓ ผ่านเกณฑ์ ว 4.2' : `+${stage.rewardExp} EXP เมื่อผ่าน`}
                        </span>
                      )}

                      <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                        <span>ดูภารกิจ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Glowing highlight indicator for current node */}
                    {stage.isCurrent && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Stage Detail & Mission Dispatcher Box */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${selectedStage.accentBg}`}>
                  {selectedStage.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                      ด่านที่ {selectedStage.stageNumber}: {selectedStage.realmName}
                    </span>
                    {selectedStage.isCompleted && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        สำเร็จแล้ว 100%
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedStage.name}</h3>
                </div>
              </div>

              {/* Action Jump Button */}
              <button
                onClick={() => handleStartQuest(selectedStage)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 ${
                  selectedStage.isCompleted
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : selectedStage.isCurrent
                    ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-indigo-500/25 animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>
                  {selectedStage.isCompleted ? 'ทบทวนเนื้อหาด่านนี้' : selectedStage.isCurrent ? 'ลุยด่านนี้ต่อเลย ⚡' : 'เปิดด่านนี้'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sub-quests / Topics in this stage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {selectedStage.subQuests.map((quest, qIdx) => (
                <div
                  key={qIdx}
                  onClick={() => handleStartQuest(selectedStage, quest.subSection)}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-bold text-cyan-400 font-mono mb-1">
                      {quest.type}
                    </div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-200 transition-colors line-clamp-2">
                      {quest.title}
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>เข้าทำภารกิจ</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Curriculum standard badge */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>ตัวชี้วัดหลักสูตร:</strong> {selectedStage.curriculumStandard}</span>
              </div>
              <div className="text-amber-400 font-mono">
                รางวัลประจำด่าน: +{selectedStage.rewardExp} EXP
              </div>
            </div>
          </div>

          {/* 100% Milestone Celebration Box (If all 4 stages are completed) */}
          {completedCount === 4 && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20 border-2 border-amber-500/40 text-center space-y-3 animate-in zoom-in-95">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-white">
                🏆 พิชิตเส้นทางวิทยาการคำนวณ ว 4.2 ครบ 100% สมบูรณ์แบบ!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                ยินดีด้วยกับ <strong>{profile.name}</strong> คุณได้ก้าวข้ามทุกด่านการเรียนรู้ตั้งแต่วินัยไซเบอร์, ตรรกะอัลกอริทึม, ปฏิบัติการโค้ดดิ้ง จนถึงการสะท้อนคิด
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleClaimFinalTrophy}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition active:scale-95 flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>เปิดดูเกียรติบัตรทางการ (Official Certificate)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: Personalized Diagnostic View (วิเคราะห์จุดเด่น & แนะนำก้าวต่อไป) */}
      {viewMode === 'diagnostic' && (
        <div className="relative z-10 p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: 4-Core Competency Analysis */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <span>การวิเคราะห์สมรรถนะ 4 ด้าน (ว 4.2 สพฐ.)</span>
              </h3>

              <div className="space-y-3">
                {stages.map((stage) => (
                  <div key={stage.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-200">
                        <span>{stage.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        stage.isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {stage.isCompleted ? '✓ เชี่ยวชาญแล้ว (Mastered)' : 'อยู่ระหว่างการพัฒนา (In Progress)'}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          stage.isCompleted
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 w-full'
                            : stage.isCurrent
                            ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 w-2/5 animate-pulse'
                            : 'bg-slate-700 w-0'
                        }`}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      💡 {stage.diagnosticTip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Personalized Coach Recommendations */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>บันทึกโค้ชส่วนบุคคล &amp; แผนพัฒนาสู่ความเป็นเลิศ</span>
                </h3>

                <div className="mt-4 space-y-3.5 text-xs">
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-1.5">
                    <div className="font-bold text-cyan-300">🎯 เป้าหมายถัดไปของคุณ:</div>
                    <p className="text-slate-300 leading-relaxed">
                      {nextMilestoneDesc}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-amber-300">🔥 สถิติการเรียนรู้ต่อเนื่อง:</div>
                    <p className="text-slate-300">
                      ปัจจุบันคุณกำลังสะสมสถิติการเรียนรู้ <strong>{profile.streakDays || 1} วันต่อเนื่อง</strong> (Streak) และมีคะแนนสะสมรวม <strong>{points} แต้ม</strong>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="font-bold text-emerald-300">🌟 คำแนะนำเพื่อสอบ O-NET &amp; สสวท.:</div>
                    <p className="text-slate-300 leading-relaxed">
                      เน้นการฝึกตรวจหาจุดบกพร่องในโค้ด (Debugging) และการจับคู่ความสัมพันธ์ของข้อมูลในแล็บ Bebras เพื่อความแม่นยำสูงสุด
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Action Button */}
              <button
                onClick={() => handleStartQuest(stages.find((s) => s.isCurrent) || stages[0])}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>ไปที่ด่านแนะนำทันที</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
