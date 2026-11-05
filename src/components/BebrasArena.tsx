import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  Award,
  ChevronRight,
  GitBranch,
  Layers,
  Search,
  Cpu,
  Share2,
  Info,
  Check,
  Zap,
} from 'lucide-react';
import { AudioReaderButton } from './AudioReaderButton.tsx';

interface BebrasArenaProps {
  onBack: () => void;
  addPoints: (amount: number, reason: string, category: 'thinking') => void;
  onCelebrate: (type: 'badge' | 'module_completed' | 'points_milestone' | 'quiz_perfect', title: string, desc: string, icon: string) => void;
}

interface BebrasTask {
  id: string;
  pillar: 'Decomposition' | 'Pattern Recognition' | 'Abstraction' | 'Algorithm Design';
  pillarTh: string;
  pillarIcon: typeof Layers;
  pillarColor: string;
  title: string;
  difficulty: 'ง่าย (ป.4)' | 'ปานกลาง (ป.5)' | 'ท้าทาย (ป.6)';
  story: string;
  question: string;
  interactiveType: 'dam_order' | 'rail_switches' | 'bead_pattern' | 'abstraction_filter';
  hint: string;
  explanation: string;
  csConcept: string;
}

export const BebrasArena: React.FC<BebrasArenaProps> = ({ onBack, addPoints, onCelebrate }) => {
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
  const [taskAnswers, setTaskAnswers] = useState<Record<string, any>>({
    task_1: [null, null, null, null], // Dam order
    task_2: { switchA: 'left', switchB: 'left', switchC: 'left' }, // Rail switches
    task_3: { bead12: '', bead16: '' }, // Bead pattern
    task_4: [] as string[], // Selected essential items
  });
  const [submittedTasks, setSubmittedTasks] = useState<Record<string, { isCorrect: boolean; score: number }>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const tasks: BebrasTask[] = [
    {
      id: 'task_1',
      pillar: 'Decomposition',
      pillarTh: 'การแยกย่อยปัญหา (Decomposition)',
      pillarIcon: Layers,
      pillarColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      title: 'ภารกิจที่ 1: บีเวอร์สร้างเขื่อนต้านกระแสน้ำ',
      difficulty: 'ง่าย (ป.4)',
      story: 'คุณลุงบีเวอร์ต้องการสร้างเขื่อนเพื่อกักเก็บน้ำ โดยมีท่อนซุง 4 ขนาดแตกต่างกัน: A (ฐานกว้าง 40 ซม.), B (ท่อนกลาง 30 ซม.), C (ท่อนเล็ก 20 ซม.) และ D (กิ่งไม้เสริมยอด 10 ซม.)',
      question: 'เพื่อสร้างเขื่อนให้มั่นคงตามหลักวิศวกรรม ต้องเรียงท่อนซุงจากชั้นล่างสุดขึ้นไปชั้นบนสุดอย่างไรจึงจะไม่พังถล่ม?',
      interactiveType: 'dam_order',
      hint: 'นึกถึงการสร้างพีระมิด ชั้นล่างสุดต้องรับน้ำหนักมากที่สุดจึงต้องมีขนาดใหญ่ที่สุด แล้วค่อยๆ เล็กลง',
      explanation: 'การแยกย่อยปัญหา (Decomposition) ช่วยให้เราแบ่งการสร้างเขื่อนออกเป็น 4 ชั้นย่อย แล้ววิเคราะห์น้ำหนักและเสถียรภาพทีละชั้น จากกว้างสุด (A: 40cm) -> (B: 30cm) -> (C: 20cm) -> ยอดบนสุด (D: 10cm)',
      csConcept: 'Decomposition (การแตกปัญหาย่อย): แบ่งปัญหาใหญ่เป็นส่วนเล็กๆ เพื่อให้จัดการและหาคำตอบได้ง่ายขึ้น เช่นเดียวกับการเขียนฟังก์ชันย่อยในโค้ดดิ้ง',
    },
    {
      id: 'task_2',
      pillar: 'Algorithm Design',
      pillarTh: 'การออกแบบอัลกอริทึม (Algorithm Design)',
      pillarIcon: GitBranch,
      pillarColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      title: 'ภารกิจที่ 2: สับรางรถไฟผลไม้สู่ตลาดเป้าหมาย',
      difficulty: 'ปานกลาง (ป.5)',
      story: 'รถไฟบรรทุก "ส้มสายน้ำผึ้ง" วิ่งออกจากสถานีต้นทาง มีจุดสับราง 3 จุด (A, B, C) แต่ละจุดเลือกได้ว่าจะให้วิ่ง "ทางซ้าย" หรือ "ทางขวา"',
      question: 'คุณต้องตั้งค่าสวิตช์รางรถไฟอย่างไร เพื่อให้รถไฟขนส้มวิ่งไปถึง "โกดังตลาดผลไม้ (สถานี Y)" โดยปลอดภัย?',
      interactiveType: 'rail_switches',
      hint: 'เดินตามเส้นทางจากสถานีต้นทาง: จุดสับราง A แยกเป็นซ้ายไป B ขวาไป C ลองวาดเส้นทางตามทีละทางแยก',
      explanation: 'หากตั้ง สวิตช์ A = ขวา (Right) แล้วสวิตช์ C = ซ้าย (Left) รถไฟจะวิ่งเข้าสู่เส้นทางของสถานี Y พอดี การคิดเป็นลำดับขั้นตอนแบบมีเงื่อนไข (If-Else) คือหัวใจของ Algorithm',
      csConcept: 'Decision Tree & Flow of Control (โครงสร้างแบบเลือกทำ): โปรแกรมคอมพิวเตอร์ตัดสินใจเลือกเส้นทางตามเงื่อนไข (if switchA == right: ...)',
    },
    {
      id: 'task_3',
      pillar: 'Pattern Recognition',
      pillarTh: 'การจดจำและหารูปแบบ (Pattern Recognition)',
      pillarIcon: Search,
      pillarColor: 'text-amber-600 bg-amber-50 border-amber-200',
      title: 'ภารกิจที่ 3: สร้อยข้อมือลูกปัดและรหัสลูป',
      difficulty: 'ปานกลาง (ป.5)',
      story: 'หุ่นยนต์ร้อยลูกปัดตามลูปคำสั่งซ้ำๆ: [แดง, ฟ้า, เหลือง, ฟ้า] แล้ววนซ้ำไปเรื่อยๆ โดยเริ่มลูกปัดเม็ดที่ 1 คือ แดง, เม็ดที่ 2 คือ ฟ้า, เม็ดที่ 3 คือ เหลือง, เม็ดที่ 4 คือ ฟ้า ...',
      question: 'จงหารูปแบบเพื่อตอบว่า ลูกปัดเม็ดที่ 12 และ เม็ดที่ 15 คือสีอะไร?',
      interactiveType: 'bead_pattern',
      hint: 'ลูปซ้ำทุกๆ 4 เม็ด (หารด้วย 4 แล้วดูเศษเหลือ: เศษ 1=แดง, 2=ฟ้า, 3=เหลือง, 0=ฟ้า)',
      explanation: 'เม็ดที่ 12 หาร 4 ลงตัว (เศษ 0) ดังนั้นเป็นสี "ฟ้า", เม็ดที่ 15 หาร 4 เหลือเศษ 3 ดังนั้นเป็นสี "เหลือง" นี่คือการใช้ Modulo Operator (%) และ Pattern Recognition',
      csConcept: 'Loop & Modulo Arithmetic (การวนซ้ำและเลขคณิตมอดุโล): คอมพิวเตอร์ใช้การหาเศษในการคำนวณรอบลูปและการตรวจจับแพทเทิร์นข้อมูล',
    },
    {
      id: 'task_4',
      pillar: 'Abstraction',
      pillarTh: 'การคิดเชิงนามธรรม (Abstraction)',
      pillarIcon: Cpu,
      pillarColor: 'text-purple-600 bg-purple-50 border-purple-200',
      title: 'ภารกิจที่ 4: ย่อส่วนแผนที่รถเมล์อัจฉริยะ',
      difficulty: 'ท้าทาย (ป.6)',
      story: 'โปรแกรมเมอร์ต้องการสร้างแอพแผนที่รถเมล์แสดงเส้นทางวิ่งในเมือง โดยมีข้อมูลต่างๆ เช่น ป้ายจอดรถ, สีของเสาไฟฟ้า, ลำดับการแวะสถานี, ยี่ห้อของยางรถ, ค่าโดยสาร, และต้นไม้ริมทาง',
      question: 'จงเลือกเฉพาะ "ข้อมูลจำเป็น" 3 อย่างที่ต้องใส่ลงในแผนผังเส้นทางรถเมล์ (ตัดข้อมูลไม่สำคัญทิ้งตามหลัก Abstraction):',
      interactiveType: 'abstraction_filter',
      hint: 'คิดว่าผู้โดยสารต้องการรู้อะไรในการเดินทาง? สิ่งที่ไม่กระทบต่อการขึ้น-ลงรถเมล์ไม่ต้องนำมาใส่',
      explanation: 'ข้อมูลจำเป็นคือ: 1. ป้ายจอดรถและลำดับสถานี 2. สายรถเมล์และทิศทาง 3. อัตราค่าโดยสาร ส่วนสีเสาไฟฟ้าหรือยี่ห้อยางรถเป็นรายละเอียดที่ไม่จำเป็นต่อเป้าหมาย',
      csConcept: 'Abstraction (การกรองสาระสำคัญ): การคัดเลือกเฉพาะข้อมูลที่จำเป็นต่อการแก้ปัญหา และละเว้นรายละเอียดที่ไม่เกี่ยวข้อง ทำให้ระบบไม่ซับซ้อนและมีประสิทธิภาพสูง',
    },
  ];

  const currentTask = tasks[selectedTaskIndex];

  // Helper for Dam order
  const handleSelectDamLog = (slotIndex: number, logId: string) => {
    const current = [...taskAnswers.task_1];
    current[slotIndex] = logId;
    setTaskAnswers({ ...taskAnswers, task_1: current });
  };

  // Helper for Rail switch
  const handleToggleSwitch = (switchName: 'switchA' | 'switchB' | 'switchC') => {
    const current = { ...taskAnswers.task_2 };
    current[switchName] = current[switchName] === 'left' ? 'right' : 'left';
    setTaskAnswers({ ...taskAnswers, task_2: current });
  };

  // Helper for Bead pattern
  const handleSelectBead = (key: 'bead12' | 'bead16', color: string) => {
    setTaskAnswers({
      ...taskAnswers,
      task_3: { ...taskAnswers.task_3, [key]: color },
    });
  };

  // Helper for Abstraction filter
  const handleToggleAbstractionItem = (item: string) => {
    const current: string[] = taskAnswers.task_4 || [];
    if (current.includes(item)) {
      setTaskAnswers({ ...taskAnswers, task_4: current.filter((i) => i !== item) });
    } else {
      if (current.length < 3) {
        setTaskAnswers({ ...taskAnswers, task_4: [...current, item] });
      }
    }
  };

  // Evaluate current task
  const handleCheckAnswer = () => {
    let isCorrect = false;

    if (currentTask.id === 'task_1') {
      const ans = taskAnswers.task_1;
      // Bottom to top: A (40cm), B (30cm), C (20cm), D (10cm)
      if (ans[0] === 'A' && ans[1] === 'B' && ans[2] === 'C' && ans[3] === 'D') {
        isCorrect = true;
      }
    } else if (currentTask.id === 'task_2') {
      const { switchA, switchC } = taskAnswers.task_2;
      if (switchA === 'right' && switchC === 'left') {
        isCorrect = true;
      }
    } else if (currentTask.id === 'task_3') {
      const { bead12, bead16 } = taskAnswers.task_3;
      if (bead12 === 'ฟ้า' && bead16 === 'เหลือง') {
        isCorrect = true;
      }
    } else if (currentTask.id === 'task_4') {
      const ans = taskAnswers.task_4;
      const valid = ['ป้ายจอดและลำดับสถานี', 'สายรถเมล์และจุดต่อขบวน', 'อัตราค่าโดยสาร'];
      if (ans.length === 3 && ans.every((a: string) => valid.includes(a))) {
        isCorrect = true;
      }
    }

    const earnedScore = isCorrect ? 25 : 5;
    setSubmittedTasks({
      ...submittedTasks,
      [currentTask.id]: { isCorrect, score: earnedScore },
    });
    setShowExplanation({
      ...showExplanation,
      [currentTask.id]: true,
    });

    if (isCorrect) {
      addPoints(earnedScore, `พิชิตโจทย์ Bebras Thailand: ${currentTask.title}`, 'thinking');
      onCelebrate(
        'points_milestone',
        'สุดยอดนักคิด Bebras!',
        `คุณได้ผ่านการทดสอบ ${currentTask.pillarTh} พร้อมรับแต้มสมรรถนะ +${earnedScore} คะแนน`,
        '🦫'
      );
    }
  };

  // Reset current task
  const handleResetTask = () => {
    const updated = { ...submittedTasks };
    delete updated[currentTask.id];
    setSubmittedTasks(updated);

    const updatedExp = { ...showExplanation };
    delete updatedExp[currentTask.id];
    setShowExplanation(updatedExp);

    if (currentTask.id === 'task_1') {
      setTaskAnswers({ ...taskAnswers, task_1: [null, null, null, null] });
    }
  };

  const totalScore = Object.values(submittedTasks).reduce((sum, item) => sum + item.score, 0);
  const correctCount = Object.values(submittedTasks).filter((i) => i.isCorrect).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-8">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-amber-100 hover:text-white bg-white/15 px-3 py-1 rounded-full backdrop-blur-sm transition-colors"
            >
              ← กลับสู่แดชบอร์ดหลัก
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">🦫</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Bebras Thailand Arena
                </h1>
                <p className="text-amber-100 text-xs sm:text-sm">
                  เวทีประลองการคิดเชิงคำนวณมาตรฐานสากล (สพฐ. / สสวท. มาตรฐาน ว 4.2 ป.4-ป.6)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Score Card */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-amber-200">พิชิตภารกิจแล้ว</div>
              <div className="text-2xl font-black text-white">
                {correctCount} / {tasks.length}
              </div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-xs text-amber-200">คะแนนสมรรถนะ</div>
              <div className="text-2xl font-black text-amber-300">
                {totalScore} <span className="text-xs font-normal">XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Nav Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-6 border-t border-white/15">
          {tasks.map((t, idx) => {
            const isDone = submittedTasks[t.id]?.isCorrect;
            const isSelected = selectedTaskIndex === idx;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTaskIndex(idx)}
                className={`p-3 rounded-xl text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-md font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <div className="truncate">
                  <div className="text-[10px] opacity-80 uppercase tracking-wider">โจทย์ที่ {idx + 1}</div>
                  <div className="text-xs truncate">{t.pillar}</div>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-white/30 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Task Working Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Question & Interactive Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            {/* Task Top Badges & Audio Reader */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium border ${currentTask.pillarColor}`}>
                  {currentTask.pillarTh}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {currentTask.difficulty}
                </span>
              </div>

              {/* Assistive Audio Reader Button */}
              <AudioReaderButton
                textToRead={`${currentTask.title} ${currentTask.story} ${currentTask.question}`}
                label="ฟังโจทย์ภาษาไทย"
                size="md"
              />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
              {currentTask.title}
            </h2>

            {/* Story Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
              <p className="text-sm text-slate-700 leading-relaxed mb-2 font-medium">
                📖 {currentTask.story}
              </p>
              <p className="text-sm text-indigo-900 font-bold">
                ❓ {currentTask.question}
              </p>
            </div>

            {/* ---------------- INTERACTIVE AREA BY TASK TYPE ---------------- */}

            {/* TASK 1: Beaver Dam Logs Order */}
            {currentTask.interactiveType === 'dam_order' && (
              <div className="space-y-6">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  คลิกเลือกท่อนซุงใส่ในชั้นฐานเขื่อน (จากชั้น 1 ล่างสุดขึ้นไปชั้น 4 บนสุด):
                </div>

                {/* Dam Visual Slot Stack */}
                <div className="flex flex-col-reverse gap-2 max-w-md mx-auto p-4 bg-amber-50/60 rounded-2xl border border-amber-200">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const selectedLog = taskAnswers.task_1[slotIdx];
                    const slotLabels = ['ชั้น 1 (ฐานล่างสุด)', 'ชั้น 2 (กลางล่าง)', 'ชั้น 3 (กลางบน)', 'ชั้น 4 (ยอดบนสุด)'];
                    return (
                      <div
                        key={slotIdx}
                        className={`h-14 rounded-xl border-2 border-dashed flex items-center justify-center font-bold transition-all ${
                          selectedLog
                            ? 'bg-amber-700 text-white border-amber-800 shadow-sm'
                            : 'bg-white text-slate-400 border-slate-300'
                        }`}
                      >
                        {selectedLog ? (
                          <div className="flex items-center gap-2">
                            <span>🪵 ท่อนซุง {selectedLog}</span>
                            <button
                              onClick={() => handleSelectDamLog(slotIdx, null as any)}
                              className="text-amber-200 hover:text-white text-xs underline ml-2"
                            >
                              เอาออก
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs">{slotLabels[slotIdx]}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Log Choices */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'A', label: 'ท่อน A (40 ซม.) - ฐานกว้างที่สุด', color: 'from-amber-600 to-amber-800' },
                    { id: 'B', label: 'ท่อน B (30 ซม.) - ท่อนกลาง', color: 'from-amber-500 to-amber-700' },
                    { id: 'C', label: 'ท่อน C (20 ซม.) - ท่อนเล็ก', color: 'from-amber-400 to-amber-600' },
                    { id: 'D', label: 'ท่อน D (10 ซม.) - กิ่งไม้เสริมยอด', color: 'from-amber-300 to-amber-500' },
                  ].map((log) => {
                    const isUsed = taskAnswers.task_1.includes(log.id);
                    return (
                      <button
                        key={log.id}
                        disabled={isUsed}
                        onClick={() => {
                          const nextEmptySlot = taskAnswers.task_1.indexOf(null);
                          if (nextEmptySlot !== -1) {
                            handleSelectDamLog(nextEmptySlot, log.id);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          isUsed
                            ? 'opacity-40 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-white hover:border-amber-400 hover:shadow-md text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="font-bold text-amber-800">{log.id}</div>
                        <div className="text-[11px] text-slate-600 mt-1">{log.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TASK 2: Rail Switches */}
            {currentTask.interactiveType === 'rail_switches' && (
              <div className="space-y-6">
                <div className="p-6 bg-slate-900 text-white rounded-2xl relative overflow-hidden">
                  <div className="text-xs text-slate-400 mb-4 flex items-center justify-between">
                    <span>🚂 ผังทางรถไฟและจุดสับราง 3 ตำแหน่ง</span>
                    <span className="text-amber-400 font-bold">เป้าหมาย: วิ่งเข้าสู่ "สถานี Y (ตลาดผลไม้)"</span>
                  </div>

                  {/* ASCII Diagram & Switches */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">จุดสับราง A (ต้นทาง)</div>
                      <div className="text-lg font-bold text-amber-400 mb-2">
                        {taskAnswers.task_2.switchA === 'left' ? '← ซ้าย (ไป B)' : 'ขวา (ไป C) →'}
                      </div>
                      <button
                        onClick={() => handleToggleSwitch('switchA')}
                        className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        สลับราง A
                      </button>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">จุดสับราง B (ฝั่งซ้าย)</div>
                      <div className="text-lg font-bold text-slate-300 mb-2">
                        {taskAnswers.task_2.switchB === 'left' ? '← ซ้าย (สถานี X)' : 'ขวา (สถานี Z) →'}
                      </div>
                      <button
                        onClick={() => handleToggleSwitch('switchB')}
                        className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        สลับราง B
                      </button>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">จุดสับราง C (ฝั่งขวา)</div>
                      <div className="text-lg font-bold text-emerald-400 mb-2">
                        {taskAnswers.task_2.switchC === 'left' ? '← ซ้าย (สถานี Y ตลาด!)' : 'ขวา (สถานี W) →'}
                      </div>
                      <button
                        onClick={() => handleToggleSwitch('switchC')}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        สลับราง C
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TASK 3: Bead Pattern */}
            {currentTask.interactiveType === 'bead_pattern' && (
              <div className="space-y-6">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  ตัวอย่างลูปของสร้อยลูกปัด:
                </div>
                <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  {[
                    { n: 1, c: 'bg-red-500', name: 'แดง' },
                    { n: 2, c: 'bg-sky-500', name: 'ฟ้า' },
                    { n: 3, c: 'bg-amber-400', name: 'เหลือง' },
                    { n: 4, c: 'bg-sky-500', name: 'ฟ้า' },
                    { n: 5, c: 'bg-red-500', name: 'แดง' },
                    { n: 6, c: 'bg-sky-500', name: 'ฟ้า' },
                    { n: 7, c: 'bg-amber-400', name: 'เหลือง' },
                    { n: 8, c: 'bg-sky-500', name: 'ฟ้า' },
                    { n: '...', c: 'bg-slate-300', name: '...' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full ${item.c} shadow-sm border border-black/10`} />
                      <span className="text-[10px] text-slate-500 mt-1 font-mono">#{item.n}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      ลูกปัดเม็ดที่ 12 คือสีอะไร?
                    </label>
                    <div className="flex gap-2">
                      {['แดง', 'ฟ้า', 'เหลือง'].map((c) => (
                        <button
                          key={c}
                          onClick={() => handleSelectBead('bead12', c)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                            taskAnswers.task_3.bead12 === c
                              ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      ลูกปัดเม็ดที่ 15 คือสีอะไร?
                    </label>
                    <div className="flex gap-2">
                      {['แดง', 'ฟ้า', 'เหลือง'].map((c) => (
                        <button
                          key={c}
                          onClick={() => handleSelectBead('bead16', c)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                            taskAnswers.task_3.bead16 === c
                              ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TASK 4: Abstraction Filter */}
            {currentTask.interactiveType === 'abstraction_filter' && (
              <div className="space-y-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  เลือกข้อมูลที่จำเป็น 3 รายการ ({taskAnswers.task_4.length}/3 รายการ):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { text: 'ป้ายจอดและลำดับสถานี', tag: 'จำเป็น' },
                    { text: 'สีของเสาไฟฟ้าข้างทาง', tag: 'ไม่จำเป็น' },
                    { text: 'สายรถเมล์และจุดต่อขบวน', tag: 'จำเป็น' },
                    { text: 'ยี่ห้อของยางรถและป้ายทะเบียน', tag: 'ไม่จำเป็น' },
                    { text: 'อัตราค่าโดยสาร', tag: 'จำเป็น' },
                    { text: 'ชนิดต้นไม้รอบเกาะกลางถนน', tag: 'ไม่จำเป็น' },
                  ].map((item) => {
                    const isSelected = taskAnswers.task_4.includes(item.text);
                    return (
                      <button
                        key={item.text}
                        onClick={() => handleToggleAbstractionItem(item.text)}
                        className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-purple-50 text-purple-900 border-purple-400 font-bold shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.text}</span>
                        {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleResetTask}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                รีเซ็ตคำตอบ
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCheckAnswer}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all hover:shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  ตรวจคำตอบและบันทึกคะแนน
                </button>
              </div>
            </div>

            {/* Explanation & CS Concept Card */}
            {showExplanation[currentTask.id] && (
              <div
                className={`mt-6 p-6 rounded-2xl border transition-all ${
                  submittedTasks[currentTask.id]?.isCorrect
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-rose-50/70 border-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {submittedTasks[currentTask.id]?.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-emerald-900 text-sm">
                        ถูกต้องสมบูรณ์! (+{submittedTasks[currentTask.id]?.score} XP)
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span className="font-bold text-rose-900 text-sm">
                        ยังไม่ถูกต้อง ลองศึกษาเฉลยและแนวคิดด้านล่างนี้นะครับ
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                  {currentTask.explanation}
                </p>

                <div className="p-3 bg-white/80 rounded-xl border border-slate-200/60 text-xs text-slate-800">
                  <span className="font-bold text-indigo-700">💡 เชื่อมโยงหลักการวิทยาการคำนวณ (CS Concept): </span>
                  {currentTask.csConcept}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: 4 Pillars Competency Radar & Info */}
        <div className="space-y-6">
          {/* 4 Pillars Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              สมรรถนะการคิดเชิงคำนวณ 4 ด้าน
            </h3>

            <div className="space-y-4">
              {tasks.map((t) => {
                const isPassed = submittedTasks[t.id]?.isCorrect;
                return (
                  <div key={t.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800">{t.pillar}</span>
                      <span className={isPassed ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {isPassed ? 'ผ่านแล้ว 100%' : 'รอประลอง'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isPassed ? 'w-full bg-emerald-500' : 'w-0'
                        }`}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{t.pillarTh}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* About Bebras Thailand */}
          <div className="bg-gradient-to-br from-indigo-50 to-amber-50 rounded-3xl p-6 border border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-2">
              <Info className="w-4 h-4 text-indigo-600" />
              เกี่ยวกับการแข่งขัน Bebras
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              <strong>Bebras (บีบราส)</strong> คือการประเมินทักษะการคิดเชิงคำนวณระดับนานาชาติที่จัดขึ้นในกว่า 60 ประเทศทั่วโลก มุ่งเน้นการแก้ปัญหาตรรกะในชีวิตประจำวันโดยไม่ต้องเขียนโปรแกรมล่วงหน้า
            </p>
            <div className="text-[11px] text-indigo-700 font-medium">
              ✨ สอดคล้องกับตัวชี้วัด สพฐ. ว 4.2 สาระเทคโนโลยี (วิทยาการคำนวณ)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
