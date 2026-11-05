import React, { useState, useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  X,
  FileCheck,
  Printer,
  Sparkles,
  QrCode,
  Share2,
  TrendingUp,
  User,
  Star,
  Check,
  ChevronRight,
  Shield,
  Layers,
  Bug,
  Code2,
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';
import { soundEffects } from '../utils/soundEffects.ts';
import { fireConfetti } from './ConfettiCelebration.tsx';

interface RubricAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  points: number;
  completedModulesCount: number;
  addPoints?: (amount: number, reason: string, category?: any) => void;
  onCelebrate?: () => void;
}

interface RubricCriterion {
  id: string;
  name: string;
  iconName: string;
  levels: {
    score: number;
    label: string;
    description: string;
  }[];
}

const RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    id: 'crit_algorithm',
    name: '1. การออกแบบขั้นตอนวิธีและผังงาน (Algorithm Design)',
    iconName: 'Layers',
    levels: [
      { score: 1, label: 'เริ่มต้น (1)', description: 'บอกลำดับการทำงานได้บางส่วน แต่ผังงานยังมีขั้นตอนสับสน' },
      { score: 2, label: 'พอใช้ (2)', description: 'เขียนขั้นตอนการทำงานและ Flowchart ได้ แต่ยังขาดเงื่อนไข If-Else' },
      { score: 3, label: 'ดี (3)', description: 'ออกแบบอัลกอริทึมเป็นลำดับ มีการใช้เงื่อนไขและการวนซ้ำอย่างเหมาะสม' },
      { score: 4, label: 'ดีเยี่ยม (4)', description: 'วิเคราะห์ปัญหาซับซ้อน แยกย่อยปัญหา (Decomposition) และวางผังงานกระชับไม่มีขั้นตอนซ้ำซ้อน' },
    ],
  },
  {
    id: 'crit_coding',
    name: '2. การเขียนโปรแกรมและความคิดสร้างสรรค์ (Coding & Creativity)',
    iconName: 'Code2',
    levels: [
      { score: 1, label: 'เริ่มต้น (1)', description: 'ต่อบล็อกคำสั่งตามตัวอย่างได้ แต่ยังปรับแต่งด้วยตนเองไม่ได้' },
      { score: 2, label: 'พอใช้ (2)', description: 'ประยุกต์บล็อกคำสั่งสร้างเกมหรือแอนิเมชันสั้นๆ ได้ มีการใส่เสียงและกราฟิก' },
      { score: 3, label: 'ดี (3)', description: 'สร้างสรรค์โปรแกรมโดยใช้ตัวแปร (Variables) และตรวจจับเหตุการณ์ (Events) ได้คล่องแคล่ว' },
      { score: 4, label: 'ดีเยี่ยม (4)', description: 'ผสมผสานตรรกะระดับสูง เชื่อมโยงเซ็นเซอร์ Micro:bit หรือพัฒนาโครงงานที่มีเอกลักษณ์โดดเด่น' },
    ],
  },
  {
    id: 'crit_debugging',
    name: '3. การตรวจสอบและแก้ไขข้อผิดพลาด (Testing & Debugging)',
    iconName: 'Bug',
    levels: [
      { score: 1, label: 'เริ่มต้น (1)', description: 'ยังไม่สามารถระบุตำแหน่งที่เกิดข้อผิดพลาดของโปรแกรมได้ด้วยตนเอง' },
      { score: 2, label: 'พอใช้ (2)', description: 'ระบุจุดที่โปรแกรมไม่ทำงานได้เมื่อมีครูหรือเพื่อนช่วยแนะนำ' },
      { score: 3, label: 'ดี (3)', description: 'ทดสอบโปรแกรมตามกรณีทดสอบ (Test Cases) และแก้ไขบั๊กเบื้องต้นได้สำเร็จ' },
      { score: 4, label: 'ดีเยี่ยม (4)', description: 'มีทักษะ Systematic Debugging ทดสอบครอบคลุมทุกเงื่อนไข และปรับโค้ดให้ทำงานรวดเร็วขึ้น' },
    ],
  },
  {
    id: 'crit_safety',
    name: '4. ความปลอดภัยดิจิทัลและมารยาทไซเบอร์ (Digital Safety & PDPA)',
    iconName: 'Shield',
    levels: [
      { score: 1, label: 'เริ่มต้น (1)', description: 'ยังไม่ตระหนักถึงความเสี่ยงของการเปิดเผยข้อมูลส่วนตัวในโลกออนไลน์' },
      { score: 2, label: 'พอใช้ (2)', description: 'เข้าใจความแตกต่างระหว่างชื่อเล่นกับข้อมูลอ่อนไหวตามคำชี้แนะ' },
      { score: 3, label: 'ดี (3)', description: 'ตั้งรหัสผ่านที่รัดกุม ปฏิบัติตามกฎหมาย PDPA และให้เกียรติผู้อื่นในการรีวิวผลงาน' },
      { score: 4, label: 'ดีเยี่ยม (4)', description: 'เป็นผู้นำด้าน Netiquette ให้คำแนะนำเพื่อนในการป้องกัน Phishing และใช้เทคโนโลยีอย่างมีจริยธรรม' },
    ],
  },
];

export const RubricAssessmentModal: React.FC<RubricAssessmentModalProps> = ({
  isOpen,
  onClose,
  profile,
  points,
  completedModulesCount,
  addPoints,
  onCelebrate,
}) => {
  // Selected score for each of 4 criteria (default 3 for each)
  const [scores, setScores] = useState<Record<string, number>>({
    crit_algorithm: 3,
    crit_coding: 3,
    crit_debugging: 3,
    crit_safety: 4,
  });

  const [activeTab, setActiveTab] = useState<'rubric' | 'portfolio'>('rubric');
  const [reflectionNote, setReflectionNote] = useState(
    'ผมรู้สึกภูมิใจที่สามารถเขียนโปรแกรมสั่งบอร์ด Micro:bit แสดงผลอุณหภูมิได้ และในอนาคตอยากฝึกแก้อัลกอริทึมเขาวงกตให้รวดเร็วยิ่งขึ้นครับ'
  );
  const [isSaved, setIsSaved] = useState(false);

  // Total Score out of 16
  const totalScore = useMemo(() => {
    return Object.values(scores).reduce((a, b) => a + b, 0);
  }, [scores]);

  const scorePercentage = Math.round((totalScore / 16) * 100);

  // Proficiency Tier
  const proficiency = useMemo(() => {
    if (totalScore >= 14) return { label: 'ระดับยอดเยี่ยม (Exemplary)', color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-300' };
    if (totalScore >= 11) return { label: 'ระดับดี (Proficient)', color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-300' };
    if (totalScore >= 8) return { label: 'ระดับพอใช้ (Developing)', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300' };
    return { label: 'ระดับกำลังพัฒนา (Beginner)', color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-300' };
  }, [totalScore]);

  if (!isOpen) return null;

  const handleSelectScore = (critId: string, scoreVal: number) => {
    soundEffects.playClick();
    setScores((prev) => ({ ...prev, [critId]: scoreVal }));
    setIsSaved(false);
  };

  const handleSaveAssessment = () => {
    soundEffects.playFanfare();
    fireConfetti('burst');
    setIsSaved(true);
    if (addPoints) {
      addPoints(20, 'ทำแบบประเมินตนเองตามเกณฑ์รูบริกส์ ว 4.2 สสวท. สำเร็จ', 'classroom');
    }
    if (onCelebrate) {
      onCelebrate();
    }
  };

  const handlePrint = () => {
    soundEffects.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                  สพฐ. &amp; สสวท. ว 4.2
                </span>
                <span className="text-xs text-indigo-200">แบบประเมินเกณฑ์รูบริกส์ &amp; ดิจิทัลพอร์ตโฟลิโอ</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                ระบบประเมินตนเองตามเกณฑ์รูบริกส์ (Rubric Assessment)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Rubric Checklist vs Digital Portfolio */}
        <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('rubric');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rubric'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>เกณฑ์ประเมิน 4 มิติ</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('portfolio');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'portfolio'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>แฟ้มผลงานดิจิทัล (Digital Portfolio Card)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="สั่งพิมพ์ใบรายงาน A4"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
              <span>พิมพ์ใบประเมิน A4</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'rubric' ? (
            <div className="space-y-6">
              {/* Scorecard Summary Pill */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 to-purple-50/60 dark:from-indigo-950/40 dark:to-slate-800 border border-indigo-200 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-mono font-black text-xl flex items-center justify-center shadow-md">
                    {totalScore}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">คะแนนประเมินรวม (Total Score)</div>
                    <div className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{totalScore} จาก 16 คะแนน</span>
                      <span className="text-xs font-bold text-indigo-600">({scorePercentage}%)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${proficiency.bg} ${proficiency.color} border ${proficiency.border}`}>
                    {proficiency.label}
                  </span>
                </div>
              </div>

              {/* 4 Rubric Criteria Accordion/List */}
              <div className="space-y-4">
                {RUBRIC_CRITERIA.map((crit) => {
                  const currentScore = scores[crit.id] || 1;
                  return (
                    <div
                      key={crit.id}
                      className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{crit.name}</span>
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {currentScore} / 4 แต้ม
                        </span>
                      </div>

                      {/* 4 Levels Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        {crit.levels.map((lvl) => {
                          const isSelected = currentScore === lvl.score;
                          return (
                            <button
                              key={lvl.score}
                              onClick={() => handleSelectScore(crit.id, lvl.score)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400/30'
                                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-bold text-xs">{lvl.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                              <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                {lvl.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reflection Statement */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>บันทึกความรู้สึกและเป้าหมายการพัฒนาตนเอง (Self Reflection):</span>
                </label>
                <textarea
                  rows={2}
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          ) : (
            /* PORTFOLIO CARD VIEW */
            <div className="space-y-6">
              {/* Digital Portfolio Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/40 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-200 dark:border-slate-700 shadow-md space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl shadow-sm">
                      {profile.avatarEmoji || '🐱'}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {profile.name} ({profile.nickname || 'Coder'})
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {profile.school} • ชั้น {profile.grade} • ฉายา: <span className="font-semibold text-indigo-600">{profile.selectedTitle}</span>
                      </p>
                    </div>
                  </div>

                  {/* QR Code sharing pill */}
                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto shadow-2xs">
                    <div className="w-12 h-12 bg-slate-950 text-white rounded-lg p-1 flex items-center justify-center text-[8px] font-mono font-bold text-center">
                      [QR CODE]
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white">สแกนดูพอร์ตโฟลิโอ</div>
                      <div className="text-[10px] text-slate-400">สำหรับคุณครูและผู้ปกครอง</div>
                    </div>
                  </div>
                </div>

                {/* Portfolio 3 Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">ผลการประเมินรูบริกส์</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{totalScore} / 16 แต้ม</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{proficiency.label}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">บทเรียนสำเร็จ</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{completedModulesCount} / 4 โมดูล</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">มาตรฐาน สพฐ. ว 4.2</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">ความสม่ำเสมอ Streak</span>
                    <span className="text-lg font-black text-orange-600 dark:text-orange-400">{profile.streakDays || 4} วันต่อเนื่อง</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Active Coder</span>
                  </div>
                </div>

                {/* Teacher Comment Box */}
                <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>ความคิดเห็นและข้อเสนอแนะของคุณครู:</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{profile.name} มีพัฒนาการที่ยอดเยี่ยมในการเชื่อมโยงเหตุผลเชิงตรรกะ มีความกระตือรือร้นในการทดลองรันโค้ด Micro:bit และร่วมแบ่งปันความรู้กับเพื่อนๆ ในห้องเรียนอย่างสม่ำเสมอ"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {isSaved ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>บันทึกผลการประเมินลงในโปรไฟล์เรียบร้อยแล้ว</span>
              </span>
            ) : (
              <span>กดบันทึกเพื่ออัปเดตเกณฑ์รูบริกส์และรับแต้ม Coder Coins</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
            <button
              onClick={handleSaveAssessment}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกผลการประเมิน (+20 แต้ม)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
