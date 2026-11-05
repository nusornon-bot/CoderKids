import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Sparkles,
  Trophy,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sliders,
  Award,
  Play,
  ArrowRight,
  BookOpen,
  X,
  FileCheck,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';
import confetti from 'canvas-confetti';

interface SmartExamGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  onRewardPoints?: (points: number, reason: string) => void;
}

interface ExamQuestion {
  id: number;
  grade: 'ป.4' | 'ป.5' | 'ป.6';
  indicator: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUESTION_BANK: ExamQuestion[] = [
  // ป.4
  {
    id: 1,
    grade: 'ป.4',
    indicator: 'ว 4.2 ป.4/1',
    question: 'ข้อใดเป็นการใช้แนวคิดเชิงคำนวณแบบ "การแยกย่อยปัญหา" (Decomposition) ในชีวิตประจำวัน?',
    options: [
      'ก. ท่องจำสูตรคูณแม่ 2 ถึงแม่ 12',
      'ข. การแบ่งขั้นตอนการทำความสะอาดบ้านออกเป็น ห้องนอน ห้องน้ำ และห้องครัว',
      'ค. การระบายสีภาพตามตัวอย่างในหนังสือ',
      'ง. การวิ่งรอบสนามตามเวลาที่ครูกำหนด',
    ],
    correctAnswer: 1,
    explanation: 'Decomposition คือการแบ่งปัญหาใหญ่ที่ซับซ้อนให้กลายเป็นส่วนย่อยๆ เพื่อจัดการทีละขั้นตอน',
  },
  {
    id: 2,
    grade: 'ป.4',
    indicator: 'ว 4.2 ป.4/2',
    question: 'ในโปรแกรม Scratch ถ้าต้องการให้ตัวละครเดินไปข้างหน้า 10 ก้าว แล้วเลี้ยวขวา 90 องศา วนซ้ำ 4 รอบ จะได้รูปเรขาคณิตใด?',
    options: ['ก. สามเหลี่ยมด้านเท่า', 'ข. สี่เหลี่ยมจัตุรัส', 'ค. วงกลม', 'ง. หกเหลี่ยม'],
    correctAnswer: 1,
    explanation: 'หมุน 90 องศา 4 ครั้ง รวมเป็น 360 องศา และด้านเท่ากัน 4 ด้าน คือรูปสี่เหลี่ยมจัตุรัส',
  },
  {
    id: 3,
    grade: 'ป.4',
    indicator: 'ว 4.2 ป.4/4',
    question: 'ข้อมูลใดต่อไปนี้ "ไม่ควร" โพสต์เปิดเผยลงบนอินเทอร์เน็ตสาธารณะมากที่สุด?',
    options: ['ก. ชื่อสัตว์เลี้ยง', 'ข. บัตรประจำตัวประชาชนและที่อยู่บ้าน', 'ค. กีฬาที่ตนเองชื่นชอบ', 'ง. อาหารมื้อเย็นที่ชอบทาน'],
    correctAnswer: 1,
    explanation: 'เลขบัตรประชาชนและที่อยู่เป็นข้อมูลส่วนบุคคลอ่อนไหว เสี่ยงต่อการถูกมิจฉาชีพนำไปสวมรอย',
  },
  // ป.5
  {
    id: 4,
    grade: 'ป.5',
    indicator: 'ว 4.2 ป.5/1',
    question: 'สถานการณ์ใดใช้คำสั่งแบบมีเงื่อนไข (If - Else) ในการแก้ปัญหา?',
    options: [
      'ก. ถ้าฝนตกให้กางร่ม ถ้าฝนไม่ตกให้เดินตามปกติ',
      'ข. ปรบมือ 10 ครั้งติดต่อกัน',
      'ค. ล้างจานใบที่ 1 แล้วล้างใบที่ 2 จนหมด',
      'ง. เดินตรงไปข้างหน้า 50 เมตร',
    ],
    correctAnswer: 0,
    explanation: 'คำสั่งมีเงื่อนไข (If-Else) คือการเลือกทำกิจกรรมที่แตกต่างกันตามผลลัพธ์ที่เป็นจริงหรือเท็จ',
  },
  {
    id: 5,
    grade: 'ป.5',
    indicator: 'ว 4.2 ป.5/2',
    question: 'หากเซ็นเซอร์วัดความชื้นของ Micro:bit อ่านค่าได้ 200 (แห้งมาก) คำสั่งเงื่อนไขใดควรสั่งให้ปั๊มน้ำทำงาน?',
    options: [
      'ก. if moisture > 800: pump.start()',
      'ข. if moisture < 300: pump.start()',
      'ค. if moisture == 1000: pump.start()',
      'ง. if moisture != 0: pump.stop()',
    ],
    correctAnswer: 1,
    explanation: 'เมื่อความชื้นต่ำกว่าเกณฑ์วิกฤต (เช่น < 300) ต้องสั่งเปิดปั๊มน้ำเพื่อช่วยต้นไม้',
  },
  {
    id: 6,
    grade: 'ป.5',
    indicator: 'ว 4.2 ป.5/4',
    question: 'ข้อใดเป็นการมีมารยาทดิจิทัล (Netiquette) ที่ถูกต้องในกลุ่มแชทห้องเรียน?',
    options: [
      'ก. พิมพ์ข้อความตัวพิมพ์ใหญ่ทั้งหมดพร้อมเครื่องหมายตกใจหลายตัว',
      'ข. ส่งสติกเกอร์รัวๆ 50 รูปตอนตีสอง',
      'ค. ใช้ถ้อยคำสุภาพ ไม่แชร์ภาพถ่ายประจานเพื่อน และสื่อสารตามกาลเทศะ',
      'ง. โพสต์คลิปวิดีโอที่มีลิขสิทธิ์ของผู้อื่นโดยไม่อ้างอิงแหล่งที่มา',
    ],
    correctAnswer: 2,
    explanation: 'การเคารพผู้อื่น ไม่บูลลี่ และใช้คำสุภาพเป็นหัวใจของมารยาทดิจิทัล',
  },
  // ป.6
  {
    id: 7,
    grade: 'ป.6',
    indicator: 'ว 4.2 ป.6/2',
    question: 'โปรแกรมวนลูป while count < 5: แต่ในลูปไม่มีคำสั่งเพิ่มค่า count ผลลัพธ์จะเป็นอย่างไร?',
    options: [
      'ก. โปรแกรมหยุดทำงานทันที',
      'ข. เกิด Infinite Loop (ลูปวนไม่รู้จบ) เพราะ count จะเป็น 0 ตลอดไป',
      'ค. โปรแกรมทำงาน 5 รอบแล้วจบลง',
      'ง. ตัวแปร count จะลบค่าตัวเองอัตโนมัติ',
    ],
    correctAnswer: 1,
    explanation: 'หากไม่มีการเปลี่ยนค่าตัวแปรเงื่อนไข เงื่อนไขจะเป็นจริงตลอดกาล เกิดบั๊ก Infinite Loop',
  },
  {
    id: 8,
    grade: 'ป.6',
    indicator: 'ว 4.2 ป.6/3',
    question: 'วิธีใดช่วยตรวจสอบภาพถ่ายว่าสร้างจาก AI Deepfake หรือไม่ได้อย่างน่าเชื่อถือที่สุด?',
    options: [
      'ก. เชื่อทันทีหากส่งต่อมาจากกลุ่มไลน์ครอบครัว',
      'ข. สังเกตความผิดปกติของรอยต่อแสงสะท้อนในตา จำนวนนิ้วมือ และค้นหาภาพต้นฉบับย้อนกลับ (Reverse Image Search)',
      'ค. ดูว่ามีคนกดไลก์เยอะหรือไม่',
      'ง. ตรวจสอบแค่ความละเอียดของไฟล์ภาพ',
    ],
    correctAnswer: 1,
    explanation: 'AI ปัจจุบันมักมีจุดบกพร่องเรื่องการสะท้อนแสง รอยต่อผิวหนัง และสามารถตรวจสอบได้ด้วย Reverse Search',
  },
];

export const SmartExamGeneratorModal: React.FC<SmartExamGeneratorModalProps> = ({
  isOpen,
  onClose,
  studentName = 'กวินทร์ แสนดี',
  onRewardPoints,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'ป.4' | 'ป.5' | 'ป.6'>('ป.4');
  const [examType, setExamType] = useState<'online' | 'print'>('online');
  const [questionCount, setQuestionCount] = useState<number>(10);

  // Online exam state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);

  const gradeQuestions = QUESTION_BANK.filter((q) => q.grade === selectedGrade);
  const currentQ = gradeQuestions[currentQIndex] || gradeQuestions[0];

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && !isExamFinished) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive && !isExamFinished) {
      handleFinishExam();
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, isExamFinished]);

  if (!isOpen) return null;

  const handleStartExam = () => {
    setIsTimerActive(true);
    setCurrentQIndex(0);
    setUserAnswers({});
    setIsExamFinished(false);
    setTimeLeft(600);
    soundEffects.play('click');
  };

  const handleSelectAnswer = (ansIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [currentQIndex]: ansIdx }));
    soundEffects.play('click');
  };

  const handleFinishExam = () => {
    setIsTimerActive(false);
    setIsExamFinished(true);
    soundEffects.play('victory');
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });

    // Calculate score
    let correct = 0;
    gradeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correct++;
    });

    if (onRewardPoints) {
      onRewardPoints(correct * 10, `สอบปลายภาควิทยาการคำนวณ ${selectedGrade} ได้ ${correct}/${gradeQuestions.length}`);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const calculateScore = () => {
    let correct = 0;
    gradeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const handlePrint = () => {
    soundEffects.play('click');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-indigo-500/30 text-white shadow-2xl flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg">
              <FileCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
                  ระบบสุ่มชุดข้อสอบปลายภาค &amp; พิมพ์กระดาษคำตอบ A4 📝
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                  ว 4.2 สพฐ.
                </span>
              </div>
              <p className="text-xs text-slate-400">
                สุ่มข้อสอบตามสัดส่วนตัวชี้วัด จับเวลาทำสดพร้อมวิเคราะห์จุดอ่อน หรือพิมพ์ข้อสอบพร้อมกระดาษคำตอบ A4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Bar */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">เลือกระดับชั้น:</span>
            {(['ป.4', 'ป.5', 'ป.6'] as const).map((gr) => (
              <button
                key={gr}
                onClick={() => {
                  setSelectedGrade(gr);
                  setCurrentQIndex(0);
                  setIsExamFinished(false);
                  setIsTimerActive(false);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  selectedGrade === gr
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {gr}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExamType('online')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                examType === 'online'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>โหมดสอบออนไลน์จับเวลา</span>
            </button>
            <button
              onClick={() => setExamType('print')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                examType === 'print'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>โหมดพิมพ์ข้อสอบ A4</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {examType === 'online' ? (
            !isTimerActive && !isExamFinished ? (
              /* Ready to start online exam */
              <div className="py-8 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 mx-auto flex items-center justify-center">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  ชุดข้อสอบวัดผลสัมฤทธิ์ปลายภาค {selectedGrade}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ข้อสอบมาตรฐานจำนวน {gradeQuestions.length} ข้อ เวลาทำข้อสอบ 10 นาที
                  ระบบจะตรวจคะแนนและวิเคราะห์สมรรถนะรายตัวชี้วัดให้อัตโนมัติ
                </p>
                <button
                  onClick={handleStartExam}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 mx-auto active:scale-95"
                >
                  <Play className="w-4 h-4" />
                  <span>เริ่มทำข้อสอบจับเวลาทันที</span>
                </button>
              </div>
            ) : isExamFinished ? (
              /* Exam Finished & Results */
              <div className="space-y-6 py-4">
                <div className="text-center space-y-2">
                  <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-black text-white">
                    ผลการสอบปลายภาค: {calculateScore()} / {gradeQuestions.length} คะแนน
                  </h3>
                  <p className="text-xs text-slate-400">
                    ผู้เข้าสอบ: <strong>{studentName}</strong> (ชั้น {selectedGrade})
                  </p>
                </div>

                {/* Question-by-question review */}
                <div className="space-y-3">
                  {gradeQuestions.map((q, idx) => {
                    const userAns = userAnswers[idx];
                    const isCorrect = userAns === q.correctAnswer;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-2xl border ${
                          isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/40'
                            : 'bg-rose-950/20 border-rose-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="text-cyan-400 font-mono">ข้อที่ {idx + 1} ({q.indicator})</span>
                          <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                            {isCorrect ? '✓ ถูกต้อง' : '✗ ไม่ถูกต้อง'}
                          </span>
                        </div>
                        <p className="text-xs text-white font-medium mb-2">{q.question}</p>
                        <div className="text-xs text-slate-300">
                          คำตอบที่ถูกต้อง: <span className="font-bold text-emerald-400">{q.options[q.correctAnswer]}</span>
                        </div>
                        <div className="mt-1 text-[11px] text-slate-400">
                          💡 <strong>คำอธิบาย:</strong> {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center gap-3 pt-3">
                  <button
                    onClick={handleStartExam}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                  >
                    สอบใหม่อีกครั้ง
                  </button>
                </div>
              </div>
            ) : (
              /* Taking Online Exam */
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <div className="text-xs text-slate-400">
                    ข้อที่ <strong className="text-white font-mono text-base">{currentQIndex + 1}</strong> / {gradeQuestions.length}
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-sm bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                    <Timer className="w-4 h-4 animate-pulse" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>

                {/* Question Box */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="text-xs font-mono font-bold text-cyan-400">
                    ตัวชี้วัด: {currentQ.indicator}
                  </div>
                  <h4 className="text-base font-bold text-white leading-relaxed">
                    {currentQ.question}
                  </h4>

                  <div className="space-y-2 pt-2">
                    {currentQ.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(optIdx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                          userAnswers[currentQIndex] === optIdx
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                        }`}
                      >
                        <span>{opt}</span>
                        {userAnswers[currentQIndex] === optIdx && (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex((i) => Math.max(0, i - 1))}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-30"
                  >
                    ข้อก่อนหน้า
                  </button>

                  {currentQIndex + 1 < gradeQuestions.length ? (
                    <button
                      onClick={() => setCurrentQIndex((i) => i + 1)}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <span>ข้อถัดไป</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishExam}
                      className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md"
                    >
                      ส่งกระดาษคำตอบ ✓
                    </button>
                  )}
                </div>
              </div>
            )
          ) : (
            /* Print A4 Exam Paper Layout */
            <div className="p-6 rounded-2xl bg-white text-slate-900 space-y-6 shadow-inner print:p-0">
              <div className="text-center border-b pb-4 space-y-1">
                <h3 className="font-bold text-lg text-slate-900">
                  แบบทดสอบวัดผลสัมฤทธิ์ปลายภาคเรียน กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี
                </h3>
                <p className="text-xs text-slate-600">
                  รายวิชาวิทยาการคำนวณ (ว 4.2) ชั้นประถมศึกษาปีที่ {selectedGrade.replace('ป.', '')}
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-medium text-slate-700">
                  <div className="border-b border-dotted pb-1">ชื่อ-สกุล: ....................................................</div>
                  <div className="border-b border-dotted pb-1">เลขที่: ............</div>
                  <div className="border-b border-dotted pb-1">ห้อง: ............</div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4 text-xs">
                {gradeQuestions.map((q, idx) => (
                  <div key={q.id} className="space-y-1.5">
                    <p className="font-bold text-slate-900">
                      {idx + 1}. {q.question} ({q.indicator})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 text-slate-700">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx}>{opt}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t flex items-center justify-between print:hidden">
                <span className="text-xs text-slate-500">จัดหน้ามาตรฐานแบบทดสอบ สพฐ. พร้อมพิมพ์ A4</span>
                <button
                  onClick={handlePrint}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>สั่งพิมพ์เอกสารข้อสอบนี้</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>🏛️ อิงตามผังข้อสอบมาตรฐาน O-NET และตัวชี้วัด สสวท. มาตรฐาน ว 4.2</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
