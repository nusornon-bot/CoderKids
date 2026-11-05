import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  Clock,
  Volume2,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Printer,
  BookOpen,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';
import confetti from 'canvas-confetti';

interface ExamQuestion {
  id: number;
  category: 'thinking' | 'coding' | 'safety' | 'debugging';
  categoryLabel: string;
  indicator: string; // ตัวชี้วัด สพฐ.
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  codeSnippet?: string;
}

const ONET_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    category: 'thinking',
    categoryLabel: 'การคิดเชิงคำนวณ',
    indicator: 'ว 4.2 ป.4/1',
    question: 'นักเรียนต้องการจัดเรียงหนังสือ 10 เล่มที่มีความหนาต่างกันจากน้อยไปมากตามลำดับ ขั้นตอนแรกตามหลักการแยกส่วนประกอบ (Decomposition) คืออะไร?',
    options: [
      'นำหนังสือทั้งหมดไปวางบนชั้นทันที',
      'วัดและบันทึกความหนาของหนังสือแต่ละเล่มอย่างเป็นระบบ',
      'สุ่มหยิบหนังสือ 2 เล่มมาสลับที่กันเรื่อยๆ จนกว่าจะเสร็จ',
      'จัดหนังสือตามสีของหน้าปกก่อน',
    ],
    correctIndex: 1,
    explanation: 'Decomposition คือการแตกปัญหาใหญ่เป็นการจัดการข้อมูลย่อย ขั้นแรกจึงเป็นการแยกพิจารณาและวัดความหนาของหนังสือแต่ละเล่มเพื่อนำมาเปรียบเทียบต่อไป',
  },
  {
    id: 2,
    category: 'safety',
    categoryLabel: 'ความปลอดภัยดิจิทัล & PDPA',
    indicator: 'ว 4.2 ป.4/4',
    question: 'หากมีข้อความส่งมาว่า "คุณได้รับรางวัลใหญ่คลิกลิงก์เพื่อกรอกเลขบัตรประชาชน 13 หลักและรหัส OTP เพื่อรับเงินทันที" นักเรียนควรปฏิบัติตามข้อใดจึงปลอดภัยที่สุด?',
    options: [
      'รีบกรอกข้อมูลทันทีก่อนหมดเขตสิทธิ์',
      'ส่งต่อข้อความให้เพื่อนสนิททุกคนร่วมรับรางวัล',
      'ไม่คลิกลิงก์ ไม่กรอกข้อมูล และแจ้งให้ผู้ปกครองหรือคุณครูทราบทันที',
      'ทดลองกรอกรหัสปลอมเพื่อตรวจสอบความถูกต้องของระบบ',
    ],
    correctIndex: 2,
    explanation: 'ข้อความดังกล่าวเป็นลักษณะของการหลอกลวง (Phishing) การไม่เปิดเผยข้อมูลส่วนบุคคลที่อ่อนไหว เช่น เลขบัตรประชาชนและ OTP เป็นมารยาทและความปลอดภัยดิจิทัลขั้นพื้นฐาน',
  },
  {
    id: 3,
    category: 'coding',
    categoryLabel: 'การเขียนโปรแกรม Scratch',
    indicator: 'ว 4.2 ป.5/2',
    question: 'ในโปรแกรม Scratch หากกำหนดคำสั่ง:\nเมื่อคลิกธงเขียว -> ตั้งค่า score เป็น 0 -> ทำซ้ำ 5 ครั้ง (เปลี่ยน score ทีละ 2 และเดินหน้า 10 ก้าว)\nเมื่อโปรแกรมทำงานเสร็จสิ้น ตัวแปร score จะมีค่าเท่าใด?',
    options: ['5', '10', '15', '20'],
    correctIndex: 1,
    codeSnippet: 'repeat (5) {\n  change [score] by (2)\n  move (10) steps\n}',
    explanation: 'ลูปทำงานซ้ำ 5 ครั้ง แต่ละครั้งเพิ่มค่า score ทีละ 2 ดังนั้นค่า score สุดท้ายคือ 5 x 2 = 10',
  },
  {
    id: 4,
    category: 'thinking',
    categoryLabel: 'อัลกอริทึมและตรรกะ',
    indicator: 'ว 4.2 ป.4/1',
    question: 'สัญลักษณ์รูป "สี่เหลี่ยมข้าวหลามตัด (Rhombus/Diamond)" ในผังงาน (Flowchart) ใช้แสดงความหมายของขั้นตอนใด?',
    options: [
      'จุดเริ่มต้นหรือจุดสิ้นสุดการทำงาน',
      'การประมวลผลหรือการคำนวณทั่วไป',
      'การตรวจสอบเงื่อนไขเพื่อตัดสินใจ (Decision)',
      'การแสดงผลข้อมูลทางหน้าจอ',
    ],
    correctIndex: 2,
    explanation: 'สัญลักษณ์สี่เหลี่ยมข้าวหลามตัดใช้สำหรับการตัดสินใจหรือตรวจสอบเงื่อนไข (Decision/Condition) โดยจะมีทิศทางออกเป็น ใช่ (Yes/True) หรือ ไม่ใช่ (No/False)',
  },
  {
    id: 5,
    category: 'coding',
    categoryLabel: 'ฮาร์ดแวร์ Micro:bit & IoT',
    indicator: 'ว 4.2 ป.6/2',
    question: 'หากต้องการให้บอร์ด Micro:bit V2 ตรวจจับเมื่อมีคนเขย่าบอร์ด แล้วแสดงรูปหัวใจกระพริบ ควรเลือกบล็อกคำสั่งใดเป็นตัวเริ่มต้น (Event Trigger)?',
    options: [
      'on start',
      'on shake',
      'on button A pressed',
      'forever',
    ],
    correctIndex: 1,
    explanation: 'บล็อก on shake เป็นตัวตรวจจับเหตุการณ์จากการทำงานของเซ็นเซอร์ Accelerometer เมื่อบอร์ดถูกสั่นหรือเขย่า',
  },
  {
    id: 6,
    category: 'debugging',
    categoryLabel: 'การแก้ปัญหาและ Debugging',
    indicator: 'ว 4.2 ป.5/2',
    question: 'ตัวละครใน Scratch เดินไปเรื่อยๆ จนทะลุจอแล้วไม่ยอมเดินกลับมา นักเรียนควรเพิ่มบล็อกคำสั่งใดเพื่อให้ตัวละครเด้งกลับเมื่อชนขอบหน้าจอ?',
    options: [
      'if on edge, bounce',
      'stop all',
      'hide',
      'glide 1 secs to x:0 y:0',
    ],
    correctIndex: 0,
    explanation: 'บล็อก "if on edge, bounce" เป็นคำสั่งตรวจสอบว่าตัวละครชนขอบจอแล้วให้กลับทิศทางทันที',
  },
  {
    id: 7,
    category: 'safety',
    categoryLabel: 'มารยาทไซเบอร์ & กฎหมาย',
    indicator: 'ว 4.2 ป.6/4',
    question: 'ข้อใดเป็นการนำผลงานภาพวาดของผู้อื่นจากอินเทอร์เน็ตมาใช้งานได้อย่างถูกต้องตามหลักจริยธรรมและกฎหมายลิขสิทธิ์?',
    options: [
      'ตัดลายน้ำของผู้สร้างสรรค์ออกแล้วนำไปแอบอ้างว่าเป็นงานของตนเอง',
      'นำภาพที่มีสัญญาอนุญาต Creative Commons (CC) มาใช้ พร้อมระบุแหล่งที่มาและให้เครดิตเจ้าของผลงาน',
      'โพสต์ขายในกลุ่มโซเชียลโดยไม่ขออนุญาตเจ้าของผลงาน',
      'นำภาพมาดัดแปลงแก้ไขเล็กน้อยเพื่อไม่ต้องใส่ชื่อเจ้าของ',
    ],
    correctIndex: 1,
    explanation: 'การใช้งานผลงานที่มีสัญญาอนุญาตเสรี (เช่น Creative Commons) อย่างถูกต้อง จำเป็นต้องระบุชื่อผู้สร้างสรรค์และแหล่งที่มา (Attribution)',
  },
  {
    id: 8,
    category: 'thinking',
    categoryLabel: 'การคิดเชิงคำนวณ',
    indicator: 'ว 4.2 ป.5/1',
    question: 'การสรุปเอาเฉพาะใจความสำคัญของปัญหา และตัดรายละเอียดที่ไม่จำเป็นออกไป เรียกว่ากระบวนการใดใน 4 เสาหลักการคิดเชิงคำนวณ?',
    options: [
      'Decomposition (การแยกส่วนประกอบ)',
      'Pattern Recognition (การจดจำรูปแบบ)',
      'Abstraction (การคิดเชิงนามธรรม)',
      'Algorithm Design (การออกแบบอัลกอริทึม)',
    ],
    correctIndex: 2,
    explanation: 'Abstraction (การคิดเชิงนามธรรม) คือการคัดกรองข้อมูลเพื่อมุ่งเน้นเฉพาะสาระสำคัญที่จำเป็นต่อการแก้ปัญหา และละเว้นรายละเอียดที่ไม่เกี่ยวข้อง',
  },
  {
    id: 9,
    category: 'coding',
    categoryLabel: 'ตรรกะเงื่อนไขและการเปรียบเทียบ',
    indicator: 'ว 4.2 ป.4/2',
    question: 'กำหนดเงื่อนไข: "ถ้า อุณหภูมิ > 35 ให้แสดงข้อความ ร้อนมาก มิฉะนั้น แสดงข้อความ อากาศสบาย"\nหากเซ็นเซอร์วัดอุณหภูมิได้ 32 องศาเซลเซียส ผลลัพธ์จะเป็นอย่างไร?',
    options: [
      'ร้อนมาก',
      'อากาศสบาย',
      'ไม่แสดงผลอะไรเลย',
      'เกิดข้อผิดพลาดในการรันโปรแกรม',
    ],
    correctIndex: 1,
    explanation: 'เนื่องจาก 32 ไม่ได้มากกว่า 35 (เงื่อนไขเป็นเท็จ) โปรแกรมจึงข้ามไปทำงานในส่วน "มิฉะนั้น" (else) และแสดงผลว่า "อากาศสบาย"',
  },
  {
    id: 10,
    category: 'debugging',
    categoryLabel: 'การค้นหาข้อผิดพลาดในโค้ด',
    indicator: 'ว 4.2 ป.6/2',
    question: 'เมื่อเขียนโปรแกรมให้หุ่นยนต์เดินวนรอบสี่เหลี่ยม แต่พบว่าหุ่นยนต์เลี้ยวแค่ 3 ครั้งแล้วหยุดทำงาน ข้อผิดพลาดเกิดจากสิ่งใด?',
    options: [
      'ลูปวนซ้ำถูกตั้งค่าไว้ที่ 3 ครั้ง แทนที่จะเป็น 4 ครั้ง',
      'มุมในการเลี้ยวถูกตั้งไว้ที่ 90 องศา',
      'หุ่นยนต์เคลื่อนที่ด้วยความเร็วสูงเกินไป',
      'คำสั่งเริ่มต้นโปรแกรมทำงานผิดพลาด',
    ],
    correctIndex: 0,
    explanation: 'รูปสี่เหลี่ยมมี 4 ด้านและ 4 มุม การจะเดินครบรอบสี่เหลี่ยมต้องทำคำสั่งเดินและเลี้ยวซ้ำ 4 รอบ หากตั้งค่าไว้เพียง 3 ครั้งจะทำให้ขาดด้านสุดท้ายไป 1 ด้าน',
  },
];

export interface ExamArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAwardPoints?: (points: number, reason: string) => void;
  onCompleteExam?: (score: number) => void;
  studentName: string;
}

export const ExamArenaModal: React.FC<ExamArenaModalProps> = ({
  isOpen,
  onClose,
  onAwardPoints,
  onCompleteExam,
  studentName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(900); // 15 mins
  const [examStarted, setExamStarted] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || !examStarted || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, examStarted, isSubmitted]);

  if (!isOpen) return null;

  const currentQ = ONET_EXAM_QUESTIONS[currentIndex];
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    soundEffects.playClick();
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIdx,
    }));
  };

  const handleNext = () => {
    soundEffects.playClick();
    if (currentIndex < ONET_EXAM_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    soundEffects.playClick();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    ONET_EXAM_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const percent = Math.round((score / ONET_EXAM_QUESTIONS.length) * 100);

    if (percent >= 70) {
      soundEffects.playSuccess();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    } else {
      soundEffects.playFanfare();
    }

    if (onCompleteExam) {
      onCompleteExam(score);
    }
    if (onAwardPoints) {
      if (percent >= 70) {
        onAwardPoints(25, `พิชิตข้อสอบมาตรฐาน O-NET / สสวท. ได้ ${score}/10 คะแนน (${percent}%)`);
      } else {
        onAwardPoints(10, `ทำข้อสอบจำลอง O-NET / สสวท. (${score}/10 คะแนน)`);
      }
    }
  };

  const handleResetExam = () => {
    soundEffects.playClick();
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setTimeLeftSeconds(900);
    setExamStarted(true);
  };

  const handleReadQuestion = () => {
    soundEffects.speakThai(currentQ.question + ' ข้อ 1 ' + currentQ.options[0] + ' ข้อ 2 ' + currentQ.options[1] + ' ข้อ 3 ' + currentQ.options[2] + ' ข้อ 4 ' + currentQ.options[3]);
  };

  const handlePrintReport = () => {
    soundEffects.playClick();
    window.print();
  };

  const score = calculateScore();
  const percent = Math.round((score / ONET_EXAM_QUESTIONS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[95vh] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                  สนามสอบจำลอง O-NET &amp; สสวท. (Exam Arena)
                </h3>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                  ว 4.2 ป.4-6
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                แบบทดสอบวัดสมรรถนะการคิดเชิงคำนวณและทักษะดิจิทัล 10 ข้อมาตรฐาน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {examStarted && !isSubmitted && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                timeLeftSeconds < 180
                  ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeFormatted}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Start Intro Screen */}
        {!examStarted ? (
          <div className="py-8 text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-4xl shadow-inner">
              📝
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                พร้อมทดสอบความรู้วิทยาการคำนวณหรือยัง?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                ข้อสอบ 10 ข้อ มีเวลาทำ 15 นาที ครอบคลุมการคิดเชิงคำนวณ, อัลกอริทึม, บล็อก Scratch, Micro:bit และกฎหมาย PDPA ผ่าน 70% รับ 25 แต้มพิเศษ
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setExamStarted(true);
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>เริ่มทำข้อสอบทันที (Start Exam)</span>
              </button>
            </div>
          </div>
        ) : !isSubmitted ? (
          /* Question View */
          <div className="space-y-6">
            
            {/* Top Indicator & TTS Reader */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  ข้อที่ {currentIndex + 1} จาก {ONET_EXAM_QUESTIONS.length}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                  {currentQ.categoryLabel}
                </span>
                <span className="hidden sm:inline text-slate-400 font-mono">({currentQ.indicator})</span>
              </div>

              <button
                onClick={handleReadQuestion}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-semibold text-[11px] cursor-pointer shadow-xs active:scale-95"
                title="ฟังเสียงโจทย์ภาษาไทย"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>ฟังโจทย์ (Audio)</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                {currentQ.question}
              </h4>

              {currentQ.codeSnippet && (
                <pre className="p-3.5 rounded-2xl bg-slate-900 text-amber-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                  {currentQ.codeSnippet}
                </pre>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-900 dark:text-indigo-200'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pagination / Stepper */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                ← ข้อก่อนหน้า
              </button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-xs px-2 py-1">
                {ONET_EXAM_QUESTIONS.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurr = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        soundEffects.playClick();
                        setCurrentIndex(idx);
                      }}
                      className={`w-6 h-6 rounded-lg text-[10px] font-bold font-mono transition-all shrink-0 ${
                        isCurr
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                          : isAnswered
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {currentIndex < ONET_EXAM_QUESTIONS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <span>ข้อถัดไป</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>ส่งข้อสอบ &amp; ตรวจคะแนน</span>
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Result & Diagnosis View */
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-amber-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border border-indigo-200 dark:border-slate-700 text-center space-y-3">
              <div className="text-4xl">
                {percent >= 80 ? '🏆' : percent >= 60 ? '🌟' : '📚'}
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                รายงานผลการประเมินมาตรฐาน: {studentName}
              </h4>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {score} / {ONET_EXAM_QUESTIONS.length} คะแนน ({percent}%)
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {percent >= 80
                  ? 'ระดับดีเยี่ยม (Level 4): มีสมรรถนะการคิดเชิงคำนวณและทักษะโค้ดดิ้งขั้นสูงตามมาตรฐาน สสวท.'
                  : percent >= 60
                  ? 'ระดับดี (Level 3): ผ่านเกณฑ์มาตรฐาน เข้าใจหลักการคิดเชิงคำนวณและความปลอดภัย'
                  : 'ระดับกำลังพัฒนา (Level 2): แนะนำให้ทบทวนบทเรียนที่ 2 และ 3 เพิ่มเติม'}
              </p>
            </div>

            {/* Answer Explanations List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
                เฉลยและคำอธิบายรายข้อ (Solutions &amp; Rubrics)
              </h5>
              {ONET_EXAM_QUESTIONS.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                      isCorrect
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-800 dark:text-slate-200">
                        ข้อที่ {idx + 1}: {q.question.split('\n')[0].slice(0, 50)}...
                      </span>
                      <span className={isCorrect ? 'text-emerald-600' : 'text-rose-600'}>
                        {isCorrect ? '✓ ถูกต้อง' : '✗ ไม่ถูกต้อง'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      <strong>คำตอบที่ถูกต้อง:</strong> {q.options[q.correctIndex]}
                    </div>
                    <div className="text-[11px] text-indigo-700 dark:text-indigo-300 bg-white/70 dark:bg-slate-800/70 p-2 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                      💡 <strong>คำอธิบาย:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleResetExam}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ทดสอบใหม่อีกครั้ง</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReport}
                  className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์ใบรายงานผล (Print)</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
