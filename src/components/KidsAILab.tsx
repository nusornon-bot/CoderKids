import React, { useState } from 'react';
import {
  Bot,
  Brain,
  Sparkles,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
  HelpCircle,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AudioNarratorButton } from './AudioNarratorButton.tsx';

interface DataSample {
  id: string;
  name: string;
  emoji: string;
  category: 'recycle' | 'organic' | 'hazardous';
}

const INITIAL_TRAINING_DATA: DataSample[] = [
  { id: 'd1', name: 'ขวดพลาสติก PET', emoji: '🧴', category: 'recycle' },
  { id: 'd2', name: 'กระป๋องอะลูมิเนียม', emoji: '🥫', category: 'recycle' },
  { id: 'd3', name: 'กล่องกระดาษลัง', emoji: '📦', category: 'recycle' },
  { id: 'd4', name: 'เปลือกกล้วยหอม', emoji: '🍌', category: 'organic' },
  { id: 'd5', name: 'ก้างปลาทู', emoji: '🐟', category: 'organic' },
  { id: 'd6', name: 'ใบไม้แห้ง', emoji: '🍂', category: 'organic' },
  { id: 'd7', name: 'ถ่านไฟฉายเก่า', emoji: '🔋', category: 'hazardous' },
  { id: 'd8', name: 'หลอดไฟฟลูออเรสเซนต์', emoji: '💡', category: 'hazardous' },
  { id: 'd9', name: 'กระป๋องยาฆ่าแมลง', emoji: '🧪', category: 'hazardous' },
];

const TEST_ITEMS = [
  { id: 't1', name: 'แก้วน้ำพลาสติกชานม', emoji: '🥤', expected: 'recycle', hint: 'ทำจากพลาสติกใส สามารถหลอมแปรรูปใหม่ได้' },
  { id: 't2', name: 'เศษแอปเปิ้ลกินเหลือ', emoji: '🍎', expected: 'organic', hint: 'ย่อยสลายได้ตามธรรมชาติ นำไปทำปุ๋ยหมักได้' },
  { id: 't3', name: 'แบตเตอรี่มือถือบวม', emoji: '📱', expected: 'hazardous', hint: 'มีสารเคมีและลิเธียมอันตราย ต้องแยกทิ้งถังสีแดง' },
  { id: 't4', name: 'กล่องนม UHT', emoji: '🧃', expected: 'recycle', hint: 'กระดาษเคลือบฟอยล์ นำไปรีไซเคิลเป็นแผ่นหลังคาได้' },
];

interface KidsAILabProps {
  onAwardPoints?: (pts: number) => void;
}

export const KidsAILab: React.FC<KidsAILabProps> = ({ onAwardPoints }) => {
  const [trainingData, setTrainingData] = useState<DataSample[]>(INITIAL_TRAINING_DATA);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainProgress, setTrainProgress] = useState<number>(0);
  const [isTrained, setIsTrained] = useState<boolean>(false);
  const [currentTestIdx, setCurrentTestIdx] = useState<number>(0);
  const [predictionResult, setPredictionResult] = useState<{
    predictedCat: 'recycle' | 'organic' | 'hazardous';
    confidence: number;
    isCorrect: boolean;
  } | null>(null);

  // Train model simulation
  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainProgress(0);
    setIsTrained(false);
    setPredictionResult(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setTrainProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsTraining(false);
        setIsTrained(true);

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });

        if (onAwardPoints) {
          onAwardPoints(15);
        }
      }
    }, 250);
  };

  // Test item with trained model
  const handleTestPrediction = () => {
    if (!isTrained) return;

    const testItem = TEST_ITEMS[currentTestIdx];
    const confidence = Math.floor(Math.random() * 8) + 91; // 91-98%
    const isCorrect = true;

    setPredictionResult({
      predictedCat: testItem.expected as any,
      confidence,
      isCorrect,
    });
  };

  const handleNextTestItem = () => {
    setPredictionResult(null);
    setCurrentTestIdx((prev) => (prev + 1) % TEST_ITEMS.length);
  };

  const getCatLabel = (cat: 'recycle' | 'organic' | 'hazardous') => {
    switch (cat) {
      case 'recycle':
        return { label: 'ขยะรีไซเคิล (ถังสีเหลือง)', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-300' };
      case 'organic':
        return { label: 'ขยะอินทรีย์ / เศษอาหาร (ถังสีเขียว)', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300' };
      case 'hazardous':
        return { label: 'ขยะอันตราย (ถังสีแดง)', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-300' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white border border-purple-800/40 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-400/30">
              <Brain className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/40 text-purple-200 border border-purple-400/30">
                  Kids AI &amp; Machine Learning Lab
                </span>
                <span className="text-xs text-purple-200">หลักสูตรเทคโนโลยี AI สำหรับเด็ก</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                ห้องปฏิบัติการเทรนปัญญาประดิษฐ์: หุ่นยนต์คัดแยกขยะอัจฉริยะ
              </h2>
            </div>
          </div>
          <AudioNarratorButton
            textToRead="ยินดีต้อนรับสู่ Kids AI Lab เรียนรู้ว่าปัญญาประดิษฐ์หรือ AI เรียนรู้ได้อย่างไร จากการนำข้อมูลตัวอย่างมาฝึกสอนโมเดล และทดสอบความแม่นยำในการทำนายผล"
            label="ฟังเสียงบรรยาย AI"
          />
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          เรียนรู้ 3 ขั้นตอนหลักของ Machine Learning: 1. ป้อนข้อมูลฝึกสอน (Training Data) → 2. ฝึกสอนสมองกล (Model Training) → 3. ทดสอบทำนายผล (Testing &amp; Prediction)
        </p>
      </div>

      {/* STEP 1: Training Data Overview */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>ขั้นตอนที่ 1: ชุดข้อมูลฝึกสอน (Training Dataset - {trainingData.length} ตัวอย่าง)</span>
          </h3>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
            ยิ่งมีข้อมูลมาก AI ยิ่งฉลาดแม่นยำ
          </span>
        </div>

        {/* 3 Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recycle */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <span>♻️</span>
              <span>1. ขยะรีไซเคิล (Recycle)</span>
            </span>
            <div className="space-y-1.5">
              {trainingData
                .filter((d) => d.category === 'recycle')
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 border border-amber-200 dark:border-amber-800 flex items-center gap-2 shadow-xs"
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Organic */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span>🌱</span>
              <span>2. ขยะอินทรีย์ (Organic)</span>
            </span>
            <div className="space-y-1.5">
              {trainingData
                .filter((d) => d.category === 'organic')
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 shadow-xs"
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Hazardous */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <span>☣️</span>
              <span>3. ขยะอันตราย (Hazardous)</span>
            </span>
            <div className="space-y-1.5">
              {trainingData
                .filter((d) => d.category === 'hazardous')
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 border border-rose-200 dark:border-rose-800 flex items-center gap-2 shadow-xs"
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* STEP 2: Train Model Button & Progress */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartTraining}
              disabled={isTraining}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{isTraining ? 'กำลังฝึกสอนโมเดล AI...' : isTrained ? 'ฝึกสอนโมเดลซ้ำ (Re-train)' : 'เริ่มฝึกสอนโมเดล AI (Train Model)'}</span>
            </button>

            {isTrained && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>โมเดล AI พร้อมใช้งานแล้ว! (ความแม่นยำ 96.4%)</span>
              </span>
            )}
          </div>

          {isTraining && (
            <div className="w-48 space-y-1">
              <div className="flex justify-between text-xs font-bold text-purple-600">
                <span>Training Progress</span>
                <span>{trainProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${trainProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STEP 3: Testing & Prediction Studio */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-600" />
          <span>ขั้นตอนที่ 2 &amp; 3: ทดสอบทำนายผลขยะชิ้นใหม่ (Testing Unseen Data)</span>
        </h3>

        {!isTrained ? (
          <div className="p-8 text-center space-y-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500">
            <Brain className="w-10 h-10 mx-auto text-slate-400 animate-pulse" />
            <p className="text-sm font-semibold">กรุณากดปุ่ม "เริ่มฝึกสอนโมเดล AI" ด้านบนก่อน</p>
            <p className="text-xs">เพื่อให้สมองกลของ AI จดจำคุณลักษณะของขยะแต่ละประเภท</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Test Sample Card */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-3">
              <span className="text-xs font-bold text-slate-500">ขยะทดสอบชิ้นที่ {currentTestIdx + 1} จาก {TEST_ITEMS.length}</span>
              <div className="text-6xl my-2">{TEST_ITEMS[currentTestIdx].emoji}</div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {TEST_ITEMS[currentTestIdx].name}
              </h4>
              <p className="text-xs text-slate-500">{TEST_ITEMS[currentTestIdx].hint}</p>

              <div className="pt-2">
                <button
                  onClick={handleTestPrediction}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  ส่งให้ AI สแกนและทำนายผล
                </button>
              </div>
            </div>

            {/* AI Prediction Result Box */}
            <div className="md:col-span-7 space-y-4">
              {predictionResult ? (
                <div className="p-5 rounded-2xl border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>ผลการวิเคราะห์ของปัญญาประดิษฐ์ (AI Prediction)</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                      ความมั่นใจ {predictionResult.confidence}%
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-800 space-y-1">
                    <span className="text-xs text-slate-500">ผลการจัดหมวดหมู่:</span>
                    <p className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                      {getCatLabel(predictionResult.predictedCat).label}
                    </p>
                  </div>

                  <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    <b>เหตุผลการตัดสินใจของ AI:</b> ตรวจพบคุณลักษณะของวัสดุตรงกับชุดข้อมูลฝึกสอน (Training Weights) ส่งผลให้หุ่นยนต์เปิดฝาถังขยะได้อย่างถูกต้องแม่นยำ!
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextTestItem}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
                    >
                      ทดสอบชิ้นถัดไป →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-2 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-slate-500">
                  <Bot className="w-8 h-8 mx-auto text-indigo-400" />
                  <p className="text-xs sm:text-sm font-semibold">
                    คลิก "ส่งให้ AI สแกนและทำนายผล" เพื่อดูการตัดสินใจของปัญญาประดิษฐ์
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
