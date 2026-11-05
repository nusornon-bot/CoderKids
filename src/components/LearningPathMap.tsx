import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Brain,
  Code2,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Trophy,
  Compass,
  Star,
  Award,
  PlayCircle,
  HelpCircle,
  FileCode2,
  Cpu,
  Layers,
  MessageSquare,
  BookOpen,
  ChevronRight,
  Flame,
  Check,
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';

export interface PathStep {
  id: string;
  moduleKey: 'safety' | 'thinking' | 'codingLab' | 'showcase';
  subSection?: string;
  stepNumber: number;
  title: string;
  shortDesc: string;
  duration: string;
  pointsReward: number;
  icon: React.ReactNode;
  categoryName: string;
  status: 'completed' | 'current' | 'locked';
  learningObjective: string;
  milestone?: boolean;
  milestoneTitle?: string;
}

export interface LearningZone {
  moduleKey: 'safety' | 'thinking' | 'codingLab' | 'showcase';
  title: string;
  subTitle: string;
  description: string;
  zoneNumber: number;
  colorName: 'emerald' | 'indigo' | 'sky' | 'purple';
  accentColor: string;
  bgGradient: string;
  badgeEmoji: string;
  isCompleted: boolean;
  steps: PathStep[];
}

export interface LearningPathMapProps {
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

export const LearningPathMap: React.FC<LearningPathMapProps> = ({
  moduleProgress,
  points,
  profile,
  onNavigate,
  onOpenCertificate,
  onCelebrate,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'safety' | 'thinking' | 'codingLab' | 'showcase'>('all');
  const [activeStepDetail, setActiveStepDetail] = useState<PathStep | null>(null);

  // Build the 4 Learning Zones with their step-by-step breakdown
  const zones: LearningZone[] = useMemo(() => {
    // 1. Zone 1: Cyber Safety & PDPA
    const zone1Steps: PathStep[] = [
      {
        id: 'step_1_1',
        moduleKey: 'safety',
        subSection: 'pdpaLab',
        stepNumber: 1,
        title: 'ห้องทดลองคุ้มครองข้อมูล PDPA',
        shortDesc: 'จำแนกข้อมูลส่วนบุคคลทั่วไป vs ข้อมูลอ่อนไหวในชีวิตประจำวัน',
        duration: '10 นาที',
        pointsReward: 15,
        icon: <ShieldCheck className="w-5 h-5" />,
        categoryName: 'PDPA Lab',
        status: moduleProgress.safety ? 'completed' : 'current',
        learningObjective: 'เข้าใจสิทธิในข้อมูลส่วนตัวและไม่เผลอเปิดเผยข้อมูลสำคัญลงโซเชียล',
      },
      {
        id: 'step_1_2',
        moduleKey: 'safety',
        subSection: 'passwordLab',
        stepNumber: 2,
        title: 'ห้องปฏิบัติการสร้างรหัสผ่านปลอดภัย',
        shortDesc: 'ทดสอบความแข็งแกร่งของรหัสผ่านและสร้าง Passphrase ป้องกันการแฮก',
        duration: '10 นาที',
        pointsReward: 15,
        icon: <Lock className="w-5 h-5" />,
        categoryName: 'Password Lab',
        status: moduleProgress.safety ? 'completed' : 'locked',
        learningObjective: 'สร้างรหัสผ่านที่ซับซ้อน รัดกุม และไม่ซ้ำกับบัญชีอื่นๆ',
      },
      {
        id: 'step_1_3',
        moduleKey: 'safety',
        subSection: 'netiquette',
        stepNumber: 3,
        title: 'มารยาทชาวดิจิทัล (Netiquette)',
        shortDesc: 'การสื่อสารเชิงสร้างสรรค์ ป้องกัน Cyberbullying และเคารพสิทธิ์ผู้อื่น',
        duration: '10 นาที',
        pointsReward: 20,
        icon: <MessageSquare className="w-5 h-5" />,
        categoryName: 'Cyber Ethics',
        status: moduleProgress.safety ? 'completed' : 'locked',
        learningObjective: 'ปฏิบัติตนตามมารยาทไซเบอร์ที่ดี มีน้ำใจ และรู้เท่าทันภัยออนไลน์',
        milestone: true,
        milestoneTitle: 'เกราะคุ้มกันดิจิทัล (Cyber Guardian)',
      },
    ];

    // 2. Zone 2: Algorithmic Thinking
    const isZone2Current = moduleProgress.safety && !moduleProgress.thinking;
    const isZone2Locked = !moduleProgress.safety;
    const zone2Steps: PathStep[] = [
      {
        id: 'step_2_1',
        moduleKey: 'thinking',
        subSection: 'pillars',
        stepNumber: 4,
        title: '4 เสาหลักการคิดเชิงคำนวณ',
        shortDesc: 'ฝึกแตกปัญหาย่อย (Decomposition) และค้นหารูปแบบ (Pattern)',
        duration: '12 นาที',
        pointsReward: 15,
        icon: <Brain className="w-5 h-5" />,
        categoryName: 'Computational Thinking',
        status: moduleProgress.thinking ? 'completed' : isZone2Current ? 'current' : 'locked',
        learningObjective: 'แยกแยะส่วนประกอบของปัญหาเพื่อวางแผนแก้ไขอย่างเป็นระบบ',
      },
      {
        id: 'step_2_2',
        moduleKey: 'thinking',
        subSection: 'flowchart',
        stepNumber: 5,
        title: 'ออกแบบผังงาน (Flowchart Studio)',
        shortDesc: 'สร้างลำดับคำสั่งแบบมีจุดเริ่มต้น กระบวนการ และการตัดสินใจ',
        duration: '15 นาที',
        pointsReward: 20,
        icon: <Layers className="w-5 h-5" />,
        categoryName: 'Flowcharting',
        status: moduleProgress.thinking ? 'completed' : 'locked',
        learningObjective: 'เขียนผังงานเพื่ออธิบายอัลกอริทึมให้มนุษย์และคอมพิวเตอร์เข้าใจ',
      },
      {
        id: 'step_2_3',
        moduleKey: 'thinking',
        subSection: 'logicGame',
        stepNumber: 6,
        title: 'ตรรกะเงื่อนไข & การทำซ้ำ (Loops)',
        shortDesc: 'ท้าทายเขาวงกตคำสั่ง If-Else และ Loop For/While ให้เดินถึงเป้าหมาย',
        duration: '15 นาที',
        pointsReward: 25,
        icon: <Flame className="w-5 h-5" />,
        categoryName: 'Logic & Loops',
        status: moduleProgress.thinking ? 'completed' : 'locked',
        learningObjective: 'ประยุกต์ใช้โครงสร้างควบคุมการตัดสินใจและการวนลูปเพื่อแก้ปัญหา',
        milestone: true,
        milestoneTitle: 'สถาปนิกอัลกอริทึม (Algorithm Architect)',
      },
    ];

    // 3. Zone 3: Coding Lab Scratch & Micro:bit
    const isZone3Current = moduleProgress.safety && moduleProgress.thinking && !moduleProgress.codingLab;
    const isZone3Locked = !moduleProgress.thinking;
    const zone3Steps: PathStep[] = [
      {
        id: 'step_3_1',
        moduleKey: 'codingLab',
        subSection: 'scratch',
        stepNumber: 7,
        title: 'สตูดิโอ Scratch แคนวาสจำลอง',
        shortDesc: 'เขียนบล็อกคำสั่งควบคุม Sprite แอนิเมชัน และตัวแปรนับคะแนน',
        duration: '20 นาที',
        pointsReward: 25,
        icon: <FileCode2 className="w-5 h-5" />,
        categoryName: 'Scratch Coding',
        status: moduleProgress.codingLab ? 'completed' : isZone3Current ? 'current' : 'locked',
        learningObjective: 'สร้างสรรค์เกมหรือแอนิเมชันด้วยบล็อกโค้ดดิ้งที่เข้าใจง่าย',
      },
      {
        id: 'step_3_2',
        moduleKey: 'codingLab',
        subSection: 'microbit',
        stepNumber: 8,
        title: 'บอร์ด Micro:bit เสมือน 5x5 Matrix',
        shortDesc: 'จำลองการแสดงไอคอนตัวเลข เซ็นเซอร์วัดอุณหภูมิ และปุ่มกด A/B',
        duration: '15 นาที',
        pointsReward: 25,
        icon: <Cpu className="w-5 h-5" />,
        categoryName: 'Micro:bit Simulator',
        status: moduleProgress.codingLab ? 'completed' : 'locked',
        learningObjective: 'เชื่อมโยงตรรกะการเขียนโปรแกรมเข้ากับอุปกรณ์ฮาร์ดแวร์ IoT เสมือน',
      },
      {
        id: 'step_3_3',
        moduleKey: 'codingLab',
        subSection: 'project',
        stepNumber: 9,
        title: 'โครงงานนวัตกรรมบูรณาการ (IoT Mini Project)',
        shortDesc: 'ผสานโปรเจกต์ Scratch + เซ็นเซอร์วัดค่าส่งต่อการควบคุม',
        duration: '20 นาที',
        pointsReward: 30,
        icon: <Code2 className="w-5 h-5" />,
        categoryName: 'IoT Innovation',
        status: moduleProgress.codingLab ? 'completed' : 'locked',
        learningObjective: 'ประดิษฐ์ชิ้นงานเทคโนโลยีที่ตอบโจทย์ชีวิตจริงในโรงเรียน',
        milestone: true,
        milestoneTitle: 'ผู้สร้างสรรค์โค้ดดิ้ง (Coding Innovator)',
      },
    ];

    // 4. Zone 4: Showcase & Reflection
    const isZone4Current = moduleProgress.safety && moduleProgress.thinking && moduleProgress.codingLab && !moduleProgress.showcase;
    const isZone4Locked = !moduleProgress.codingLab;
    const zone4Steps: PathStep[] = [
      {
        id: 'step_4_1',
        moduleKey: 'showcase',
        subSection: 'submit',
        stepNumber: 10,
        title: 'ส่งและนำเสนอผลงาน (Project Showcase)',
        shortDesc: 'อัปโหลดภาพตัวอย่าง แนบลิงก์ Scratch / Micro:bit สู่ชุมชน',
        duration: '10 นาที',
        pointsReward: 30,
        icon: <Sparkles className="w-5 h-5" />,
        categoryName: 'Project Showcase',
        status: moduleProgress.showcase ? 'completed' : isZone4Current ? 'current' : 'locked',
        learningObjective: 'ฝึกทักษะการสื่อสาร อธิบายที่มา และเผยแพร่ผลงานสู่สาธารณะ',
      },
      {
        id: 'step_4_2',
        moduleKey: 'showcase',
        subSection: 'peerReview',
        stepNumber: 11,
        title: 'กำแพงเพื่อนวิจารณ์ (2 Stars & A Wish)',
        shortDesc: 'แลกเปลี่ยนข้อคิดเห็น ให้ 2 คำชม และ 1 ข้อเสนอแนะเชิงสร้างสรรค์',
        duration: '10 นาที',
        pointsReward: 20,
        icon: <Star className="w-5 h-5" />,
        categoryName: 'Peer Review',
        status: moduleProgress.showcase ? 'completed' : 'locked',
        learningObjective: 'ยอมรับข้อคิดเห็นของเพื่อนและฝึกให้กำลังใจกันในชุมชนผู้เรียน',
      },
      {
        id: 'step_4_3',
        moduleKey: 'showcase',
        subSection: 'dailyJournal',
        stepNumber: 12,
        title: 'บันทึกการเรียนรู้ประจำวัน & รับเกียรติบัตร',
        shortDesc: 'สะท้อนคิดความสำเร็จ เช็คอินเป้าหมาย และขอรับใบประกาศนียบัตร',
        duration: '10 นาที',
        pointsReward: 35,
        icon: <Award className="w-5 h-5" />,
        categoryName: 'Daily Journal & Certificate',
        status: moduleProgress.showcase ? 'completed' : 'locked',
        learningObjective: 'สรุปองค์ความรู้ทั้งหมดและภาคภูมิใจในเกียรติบัตรมาตรฐาน สพฐ.',
        milestone: true,
        milestoneTitle: 'สุดยอดโปรแกรมเมอร์รุ่นจิ๋ว (Master Coder Graduate)',
      },
    ];

    return [
      {
        moduleKey: 'safety',
        title: 'โมดูล 1: ความปลอดภัยดิจิทัล & PDPA',
        subTitle: 'Digital Safety & Personal Data Protection',
        description: 'สร้างรากฐานการเป็นพลเมืองไซเบอร์ รู้จักปกป้องสิทธิ์ของตนเองและผู้อื่น',
        zoneNumber: 1,
        colorName: 'emerald',
        accentColor: '#10b981',
        bgGradient: 'from-emerald-500 via-teal-600 to-emerald-700',
        badgeEmoji: '🛡️',
        isCompleted: moduleProgress.safety,
        steps: zone1Steps,
      },
      {
        moduleKey: 'thinking',
        title: 'โมดูล 2: การคิดเชิงคำนวณและอัลกอริทึม',
        subTitle: 'Algorithmic & Computational Thinking',
        description: 'เรียนรู้วิธีคิดอย่างเป็นระบบ ออกแบบผังงาน และลำดับคำสั่งแก้ปัญหา',
        zoneNumber: 2,
        colorName: 'indigo',
        accentColor: '#6366f1',
        bgGradient: 'from-indigo-500 via-blue-600 to-indigo-700',
        badgeEmoji: '🧩',
        isCompleted: moduleProgress.thinking,
        steps: zone2Steps,
      },
      {
        moduleKey: 'codingLab',
        title: 'โมดูล 3: ปฏิบัติการ Scratch & Micro:bit',
        subTitle: 'Interactive Coding & IoT Simulator',
        description: 'ลงมือประกอบบล็อกโค้ดและควบคุมบอร์ดทดลองเสมือนจริงในเบราว์เซอร์',
        zoneNumber: 3,
        colorName: 'sky',
        accentColor: '#0ea5e9',
        bgGradient: 'from-sky-500 via-cyan-600 to-blue-700',
        badgeEmoji: '💻',
        isCompleted: moduleProgress.codingLab,
        steps: zone3Steps,
      },
      {
        moduleKey: 'showcase',
        title: 'โมดูล 4: แสดงผลงานและสะท้อนคิด',
        subTitle: 'Project Showcase, Peer Review & Certificate',
        description: 'นำเสนอโครงงาน แลกเปลี่ยนเรียนรู้กับเพื่อน และรับเกียรติบัตรรับรอง',
        zoneNumber: 4,
        colorName: 'purple',
        accentColor: '#a855f7',
        bgGradient: 'from-purple-500 via-fuchsia-600 to-indigo-700',
        badgeEmoji: '🏆',
        isCompleted: moduleProgress.showcase,
        steps: zone4Steps,
      },
    ];
  }, [moduleProgress]);

  // All 12 steps flattened
  const allSteps = useMemo(() => zones.flatMap((z) => z.steps), [zones]);
  const completedStepsCount = useMemo(() => allSteps.filter((s) => s.status === 'completed').length, [allSteps]);
  const progressPercent = Math.round((completedStepsCount / allSteps.length) * 100);

  // Current active step (where student is now)
  const currentStep = useMemo(() => {
    return allSteps.find((s) => s.status === 'current') || allSteps[allSteps.length - 1];
  }, [allSteps]);

  // Filtered zones
  const displayedZones = useMemo(() => {
    if (selectedFilter === 'all') return zones;
    return zones.filter((z) => z.moduleKey === selectedFilter);
  }, [zones, selectedFilter]);

  const handleStepClick = (step: PathStep) => {
    setActiveStepDetail(step);
  };

  const handleGoToStep = (step: PathStep) => {
    onNavigate(step.moduleKey, step.subSection);
    setActiveStepDetail(null);
  };

  return (
    <div className="space-y-6">
      {/* ----------------- ROADMAP HEADER & COMPASS BANNER ----------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-indigo-900/60 shadow-xl">
        {/* Background Sparkle Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Headline & Description */}
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '12s' }} />
              <span>LEARNING ADVENTURE ROADMAP • แผนที่การเดินทาง 4 ดินแดน</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              เส้นทางสู่การเป็น <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-indigo-300">โปรแกรมเมอร์รุ่นจิ๋ว</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ก้าวทีละขั้นอย่างมั่นใจผ่าน 12 ภารกิจหลัก ทั้ง 4 โมดูล ติดตามความก้าวหน้า ปลดล็อกเหรียญตรา และมุ่งสู่เกียรติบัตร สพฐ. &amp; สสวท.
            </p>

            {/* Quick Action Bar for Current Step */}
            {currentStep && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleGoToStep(currentStep)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  <PlayCircle className="w-4 h-4 text-amber-300" />
                  <span>ลุยต่อ: {currentStep.title} (ก้าวที่ {currentStep.stepNumber})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onCelebrate && (
                  <button
                    type="button"
                    onClick={onCelebrate}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all active:scale-95"
                    title="ทดสอบจุดพลุฉลองความสำเร็จ"
                  >
                    <span>🎉 ฉลองความก้าวหน้า</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* User Journey Stats Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 lg:w-80 shrink-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-inner">
                  {profile.avatarEmoji || '🐱'}
                </div>
                <div>
                  <div className="text-xs text-indigo-200">นักสำรวจโค้ด</div>
                  <div className="text-sm font-bold text-white">{profile.nickname || profile.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-300">แต้มสะสม</div>
                <div className="text-base font-extrabold text-amber-300 tabular-nums">
                  {points} <span className="text-xs font-normal text-slate-300">แต้ม</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">ความก้าวหน้ารวม</span>
                <span className="font-bold text-emerald-400">{completedStepsCount}/12 ก้าว ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-indigo-400 to-purple-400 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Micro Badge Checklist */}
            <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
              {zones.map((z) => (
                <div
                  key={z.moduleKey}
                  onClick={() => setSelectedFilter(z.moduleKey)}
                  className={`cursor-pointer p-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                    z.isCompleted
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                  title={z.title}
                >
                  <div className="text-sm">{z.badgeEmoji}</div>
                  <div>ม.{z.zoneNumber}</div>
                  <div className="text-[9px] font-normal">{z.isCompleted ? '✓ ผ่าน' : 'รอ'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- ZONE FILTER PILLS ----------------- */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🗺️ แผนที่ทั้งหมด (4 โมดูล)
          </button>
          {zones.map((z) => (
            <button
              key={z.moduleKey}
              type="button"
              onClick={() => setSelectedFilter(z.moduleKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedFilter === z.moduleKey
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{z.badgeEmoji}</span>
              <span>โมดูล {z.zoneNumber}</span>
              {z.isCompleted && <span className="text-emerald-500 font-bold">✓</span>}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>สำเร็จแล้ว</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
            <span>ก้าวต่อไป (คุณอยู่ที่นี่)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>รอปลดล็อก</span>
          </span>
        </div>
      </div>

      {/* ----------------- STEP-BY-STEP ADVENTURE ROADMAP ----------------- */}
      <div className="space-y-8">
        {displayedZones.map((zone) => {
          return (
            <div
              key={zone.moduleKey}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: zone.accentColor }}
              />

              {/* Zone Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 text-white"
                    style={{ backgroundColor: zone.accentColor }}
                  >
                    {zone.badgeEmoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        ZONE {zone.zoneNumber}
                      </span>
                      {zone.isCompleted ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>ผ่านโมดูลนี้แล้ว!</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          กำลังผจญภัย
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      {zone.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {zone.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate(zone.moduleKey)}
                  className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5 self-start sm:self-center shrink-0"
                >
                  <span>เข้าสู่ห้องเรียนโมดูล {zone.zoneNumber}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Steps Trail Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                {zone.steps.map((step, idx) => {
                  const isCurrent = step.status === 'current';
                  const isCompleted = step.status === 'completed';
                  const isLocked = step.status === 'locked';

                  return (
                    <div
                      key={step.id}
                      onClick={() => handleStepClick(step)}
                      className={`group relative rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-500 ring-2 ring-indigo-300 shadow-md transform scale-[1.02]'
                          : isCompleted
                          ? 'bg-emerald-50/40 border-emerald-200/90 hover:border-emerald-400 hover:shadow-sm'
                          : 'bg-slate-50/70 border-slate-200 opacity-80 hover:opacity-100 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Current Step "You Are Here" Pin */}
                      {isCurrent && (
                        <div className="absolute -top-3.5 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold shadow-md animate-bounce">
                          <span>{profile.avatarEmoji || '🐱'}</span>
                          <span>คุณอยู่ที่นี่! ก้าวต่อไป</span>
                        </div>
                      )}

                      {/* Card Content Top */}
                      <div>
                        {/* Step Number & Reward Points */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : isCurrent
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {isCompleted ? '✓' : step.stepNumber}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {step.categoryName}
                            </span>
                          </div>

                          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
                            <span>🪙</span>
                            <span>+{step.pointsReward}</span>
                          </span>
                        </div>

                        {/* Title & Short Description */}
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5">
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {step.shortDesc}
                        </p>
                      </div>

                      {/* Card Bottom Meta */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">⏱️ {step.duration}</span>
                        <div className="flex items-center gap-1 font-bold">
                          {isCompleted ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>สำเร็จแล้ว</span>
                            </span>
                          ) : isCurrent ? (
                            <span className="text-indigo-600 flex items-center gap-1">
                              <span>เริ่มเรียนทันที</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          ) : (
                            <span className="text-slate-400 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" />
                              <span>ดูตัวอย่าง</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Milestone Ribbon if applicable */}
                      {step.milestone && (
                        <div className="mt-3 pt-2 border-t border-dashed border-amber-200 text-[11px] font-semibold text-amber-800 bg-amber-50/70 -mx-5 -mb-5 p-2 rounded-b-2xl flex items-center justify-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          <span>หมุดหมาย: {step.milestoneTitle}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ----------------- STEP DETAIL MODAL (WHEN A STEP IS CLICKED) ----------------- */}
      {activeStepDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base shadow-xs">
                  {activeStepDetail.stepNumber}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    {activeStepDetail.categoryName}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {activeStepDetail.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStepDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
                <div className="font-bold text-slate-900">🎯 เป้าหมายการเรียนรู้:</div>
                <p className="leading-relaxed">{activeStepDetail.learningObjective}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                  <div className="text-xs text-amber-600">แต้มรางวัลภารกิจ</div>
                  <div className="text-lg font-extrabold">+{activeStepDetail.pointsReward} แต้ม</div>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800">
                  <div className="text-xs text-indigo-600">เวลาโดยประมาณ</div>
                  <div className="text-lg font-extrabold">{activeStepDetail.duration}</div>
                </div>
              </div>

              {activeStepDetail.milestone && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center gap-2.5">
                  <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="text-xs text-amber-900">
                    <span className="font-bold">หมุดหมายสำคัญ: </span>
                    {activeStepDetail.milestoneTitle}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleGoToStep(activeStepDetail)}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <PlayCircle className="w-4 h-4" />
                <span>เข้าสู่บทเรียนนี้ทันที</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveStepDetail(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- FINAL GRADUATION & CERTIFICATE CHECKPOINT BANNER ----------------- */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white border border-purple-800/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-3xl shadow-lg shrink-0">
            🎓
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                ปลายทางการผจญภัย: เกียรติบัตรรับรองมาตรฐาน สพฐ. &amp; สสวท.
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Official Certificate
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              เมื่อผ่านการเรียนรู้และทำกิจกรรมสะสมครบทุกด่าน สามารถกดรับเกียรติบัตรระบุชื่อนักเรียน โรงเรียน และรหัสรับรองดิจิทัลเพื่อใช้ใส่ Portfolio ได้ทันที
            </p>
          </div>
        </div>

        {onOpenCertificate && (
          <button
            type="button"
            onClick={onOpenCertificate}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <Award className="w-4 h-4" />
            <span>ดูเกียรติบัตรของคุณ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
