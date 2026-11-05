import React, { useState, useMemo } from 'react';
import {
  CODE_EXAMPLES_GALLERY_DATA,
  CodeExampleChallenge,
} from '../../data/codeExamplesData.ts';
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  X,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  Copy,
  Layers,
  Cpu,
  Brain,
  Award,
  Zap,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../../utils/soundEffects.ts';

interface CodeExamplesGalleryProps {
  onSelectScratchPreset?: (presetId: string) => void;
  onSelectMicrobitPreset?: (presetId: string) => void;
  onNavigateToSimulator?: (platform: 'scratch' | 'microbit', presetId?: string) => void;
  addPoints: (points: number, reason: string, category?: string) => void;
}

export const CodeExamplesGallery: React.FC<CodeExamplesGalleryProps> = ({
  onSelectScratchPreset,
  onSelectMicrobitPreset,
  onNavigateToSimulator,
  addPoints,
}) => {
  const [selectedExample, setSelectedExample] = useState<CodeExampleChallenge | null>(null);
  const [platformFilter, setPlatformFilter] = useState<'all' | 'scratch' | 'microbit'>('all');
  const [gradeFilter, setGradeFilter] = useState<'all' | 'ป.4' | 'ป.5' | 'ป.6'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal tab state
  const [modalTab, setModalTab] = useState<'blocks' | 'ipo' | 'challenge' | 'pitfalls'>('blocks');

  // Quiz interactive state in modal
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [claimedRewardIds, setClaimedRewardIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('coderkids_claimed_gallery_rewards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Filter logic
  const filteredExamples = useMemo(() => {
    return CODE_EXAMPLES_GALLERY_DATA.filter((ex) => {
      if (platformFilter !== 'all' && ex.platform !== platformFilter) return false;
      if (gradeFilter !== 'all' && ex.grade !== gradeFilter) return false;
      if (difficultyFilter !== 'all') {
        if (difficultyFilter === 'easy' && !ex.difficulty.includes('ง่าย')) return false;
        if (difficultyFilter === 'medium' && !ex.difficulty.includes('ปานกลาง')) return false;
        if (difficultyFilter === 'hard' && !ex.difficulty.includes('ท้าทาย')) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ex.title.toLowerCase().includes(q) || ex.englishTitle.toLowerCase().includes(q);
        const matchSummary = ex.summary.toLowerCase().includes(q);
        const matchConcepts = ex.concepts.some((c) => c.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchConcepts) return false;
      }
      return true;
    });
  }, [platformFilter, gradeFilter, difficultyFilter, searchQuery]);

  const handleOpenModal = (ex: CodeExampleChallenge) => {
    setSelectedExample(ex);
    setModalTab('blocks');
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    soundEffects.playClick();
  };

  const handleCloseModal = () => {
    setSelectedExample(null);
  };

  const handleCopyCode = (ex: CodeExampleChallenge) => {
    const raw = ex.blocks.map((b) => b.text).join('\n');
    try {
      navigator.clipboard.writeText(raw);
      setCopiedCodeId(ex.id);
      setTimeout(() => setCopiedCodeId(null), 2000);
      soundEffects.playClick();
    } catch {
      // fallback
    }
  };

  const handleCheckQuizAnswer = () => {
    if (selectedAnswer === null || !selectedExample) return;
    setIsAnswerSubmitted(true);

    if (selectedAnswer === selectedExample.conceptQuiz.correctAnswer) {
      soundEffects.playSuccess();
      // If not already claimed, award points!
      if (!claimedRewardIds.includes(selectedExample.id)) {
        addPoints(selectedExample.points, `ผ่านแบบฝึกหัดอ่านโค้ด: ${selectedExample.title}`, 'coding');
        const nextClaimed = [...claimedRewardIds, selectedExample.id];
        setClaimedRewardIds(nextClaimed);
        localStorage.setItem('coderkids_claimed_gallery_rewards', JSON.stringify(nextClaimed));
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      soundEffects.playError();
    }
  };

  const handleLaunchSimulator = (ex: CodeExampleChallenge) => {
    if (onNavigateToSimulator) {
      onNavigateToSimulator(ex.platform, ex.presetTarget);
    } else if (ex.platform === 'scratch' && onSelectScratchPreset && ex.presetTarget) {
      onSelectScratchPreset(ex.presetTarget);
    } else if (ex.platform === 'microbit' && onSelectMicrobitPreset && ex.presetTarget) {
      onSelectMicrobitPreset(ex.presetTarget);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-6 md:p-8 text-white shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bridge Reading to Writing Code · สะพานเชื่อมการอ่านสู่การเขียนโค้ด</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              คลังตัวอย่างและโจทย์โค้ดดิ้งบล็อก (Code Examples Gallery)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ฝึกทักษะการ &quot;อ่านโค้ดทำความเข้าใจ (Code Reading)&quot; ถอดรหัสโครงสร้างบล็อกคำสั่ง และวิเคราะห์ขั้นตอนวิธี (IPO Model) ก่อนลงมือเขียนโค้ดแก้โจทย์จริงบน Scratch Studio และ Micro:bit Simulator
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-row lg:flex-col gap-3 shrink-0">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-300">ความก้าวหน้า</div>
                <div className="text-base font-bold text-amber-300">
                  {claimedRewardIds.length} / {CODE_EXAMPLES_GALLERY_DATA.length} ภารกิจ
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-300">แต้มสะสมจากคลัง</div>
                <div className="text-base font-bold text-emerald-300">
                  +{claimedRewardIds.length * 25} แต้ม
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Platform filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setPlatformFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                platformFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({CODE_EXAMPLES_GALLERY_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => setPlatformFilter('scratch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                platformFilter === 'scratch'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700'
              }`}
            >
              <span>🐱 Scratch Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setPlatformFilter('microbit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                platformFilter === 'microbit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700'
              }`}
            >
              <span>📟 Micro:bit V2</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาโจทย์ เช่น ดาว, อุณหภูมิ, ตัวแปร, ลูป..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Grade & Difficulty Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>ระดับชั้น:</span>
          </span>
          {(['all', 'ป.4', 'ป.5', 'ป.6'] as const).map((gr) => (
            <button
              key={gr}
              type="button"
              onClick={() => setGradeFilter(gr)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                gradeFilter === gr
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {gr === 'all' ? 'ทุกระดับชั้น' : gr}
            </button>
          ))}

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <span className="font-semibold text-slate-700 dark:text-slate-300">ความยาก:</span>
          {(
            [
              { id: 'all', label: 'ทุกระดับ' },
              { id: 'easy', label: 'ง่าย' },
              { id: 'medium', label: 'ปานกลาง' },
              { id: 'hard', label: 'ท้าทาย' },
            ] as const
          ).map((dif) => (
            <button
              key={dif.id}
              type="button"
              onClick={() => setDifficultyFilter(dif.id)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                difficultyFilter === dif.id
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {dif.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExamples.map((ex) => {
          const isClaimed = claimedRewardIds.includes(ex.id);
          return (
            <div
              key={ex.id}
              onClick={() => handleOpenModal(ex)}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Visual Thumbnail Banner */}
              <div
                className={`relative h-40 bg-gradient-to-r ${ex.thumbnailGradient} p-5 flex flex-col justify-between text-white overflow-hidden`}
              >
                <div className="absolute -right-4 -bottom-4 opacity-15 text-8xl font-black select-none pointer-events-none">
                  {ex.thumbnailIcon}
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl bg-black/30 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase border border-white/20 flex items-center gap-1.5">
                    {ex.platform === 'scratch' ? '🐱 Scratch' : '📟 Micro:bit'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold border border-white/20">
                    {ex.grade}
                  </span>
                </div>

                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <div className="text-3xl">{ex.thumbnailIcon}</div>
                    <div className="text-xs font-semibold text-white/90 mt-1 line-clamp-1">
                      {ex.englishTitle}
                    </div>
                  </div>
                  {isClaimed && (
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/90 text-white text-[11px] font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ผ่านแล้ว</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      +{ex.points} แต้ม
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-slate-500 dark:text-slate-400">{ex.timeEstimate}</span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {ex.difficulty.split('(')[0]}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {ex.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {ex.summary}
                  </p>

                  {/* Concept Pills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {ex.concepts.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Code Preview Strip */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1 shadow-inner overflow-hidden">
                    <div className="text-[10px] text-slate-500 uppercase font-sans font-semibold mb-1">
                      ตัวอย่างบล็อกคำสั่ง:
                    </div>
                    {ex.blocks.slice(0, 3).map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className="truncate text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200"
                      >
                        {b.text}
                      </div>
                    ))}
                    {ex.blocks.length > 3 && (
                      <div className="text-[10px] text-indigo-400 font-sans font-semibold pt-0.5">
                        + อีก {ex.blocks.length - 3} บล็อกคำสั่ง...
                      </div>
                    )}
                  </div>
                </div>

                {/* Inspect Action */}
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" />
                    <span>ถอดรหัสโค้ด &amp; รับโจทย์ท้าทาย</span>
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExamples.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="text-4xl">🔍</div>
          <h4 className="text-base font-bold text-slate-800 dark:text-white">ไม่พบตัวอย่างโค้ดที่ตรงกับคำค้นหา</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองระดับชั้นและความยากเพื่อค้นหาตัวอย่างอื่นในคลัง
          </p>
          <button
            type="button"
            onClick={() => {
              setPlatformFilter('all');
              setGradeFilter('all');
              setDifficultyFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}

      {/* ===================== EXPLANATION & CHALLENGE MODAL ===================== */}
      {selectedExample && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div
              className={`p-5 sm:p-6 bg-gradient-to-r ${selectedExample.thumbnailGradient} text-white flex items-start justify-between gap-4`}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider border border-white/20">
                    {selectedExample.platform === 'scratch' ? '🐱 Scratch' : '📟 Micro:bit'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold border border-white/20">
                    {selectedExample.grade}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[11px] font-bold">
                    +{selectedExample.points} แต้ม
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2 mt-1">
                  <span>{selectedExample.thumbnailIcon}</span>
                  <span>{selectedExample.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-white/90 font-medium">
                  {selectedExample.missionScenario}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-navigation Tabs */}
            <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setModalTab('blocks')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'blocks'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>1. ถอดรหัสบล็อกโค้ด ({selectedExample.blocks.length} บล็อก)</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('ipo')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'ipo'
                    ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Cpu className="w-4 h-4 text-sky-500" />
                <span>2. วิเคราะห์ขั้นตอนวิธี (IPO Model)</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('challenge')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'challenge'
                    ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>3. ภารกิจท้าทาย &amp; แบบทดสอบ</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('pitfalls')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'pitfalls'
                    ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>4. จุดที่มักผิดบ่อย (Bug Watch)</span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: BLOCK-BY-BLOCK BREAKDOWN */}
              {modalTab === 'blocks' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        แกะรอยการทำงานทีละบล็อก (Line-by-Line Code Reading)
                      </h4>
                      <p className="text-xs text-slate-500">
                        อ่านโค้ดและทำความเข้าใจเหตุผลที่ต้องวางบล็อกคำสั่งนี้ในแต่ละบรรทัด
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(selectedExample)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {copiedCodeId === selectedExample.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">คัดลอกสำเร็จ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>คัดลอกโค้ด</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {selectedExample.blocks.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        {/* The Visual Block representation */}
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div
                            className={`px-3 py-1.5 rounded-xl font-mono font-bold text-xs shadow-xs ${b.color} ${
                              b.indent ? 'ml-4 sm:ml-6 border-l-4 border-white/50' : ''
                            }`}
                          >
                            {b.text}
                          </div>
                        </div>

                        {/* Explanation for students */}
                        <div className="flex-1 sm:max-w-md bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed flex items-start gap-2">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{b.explanation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: IPO MODEL & COMPUTATIONAL THINKING */}
              {modalTab === 'ipo' && (
                <div className="space-y-6">
                  {/* IPO Model 3 Cards */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                      โมเดลการประมวลผล (IPO Model: Input ➔ Process ➔ Output)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Input */}
                      <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/50 space-y-2">
                        <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-bold text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                          <span>1. อินพุต (Input)</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                          {selectedExample.ipo.input}
                        </p>
                      </div>

                      {/* Process */}
                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 space-y-2">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <span>2. การประมวลผล (Process)</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                          {selectedExample.ipo.process}
                        </p>
                      </div>

                      {/* Output */}
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span>3. เอาต์พุต (Output)</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                          {selectedExample.ipo.output}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Computational Thinking 4 Pillars */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <span>การประยุกต์ใช้ 4 เสาหลักการคิดเชิงคำนวณ (Computational Thinking)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          1. การแยกย่อยปัญหา (Decomposition):
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          {selectedExample.computationalPillars.decomposition}
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          2. การหารูปแบบ (Pattern Recognition):
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          {selectedExample.computationalPillars.patternRecognition}
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          3. การคิดเชิงนามธรรม (Abstraction):
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          {selectedExample.computationalPillars.abstraction}
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          4. การออกแบบขั้นตอนวิธี (Algorithms):
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          {selectedExample.computationalPillars.algorithms}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CHALLENGE & QUIZ (BRIDGE READING TO WRITING) */}
              {modalTab === 'challenge' && (
                <div className="space-y-6">
                  {/* Bridge Challenge Box */}
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-amber-400/40 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-xl bg-amber-500 text-white font-bold">
                        <Zap className="w-4 h-4" />
                      </span>
                      <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                        {selectedExample.bridgeChallenge.prompt}
                      </h4>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2 border border-amber-200 dark:border-amber-800/40">
                      <div>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">💡 แนวทางการดัดแปลงโค้ด: </span>
                        <span>{selectedExample.bridgeChallenge.actionHint}</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">🎯 ผลลัพธ์ที่คาดหวัง: </span>
                        <span>{selectedExample.bridgeChallenge.expectedOutcome}</span>
                      </div>
                    </div>
                  </div>

                  {/* Concept Checkpoint Quiz */}
                  <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-indigo-500" />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          แบบทดสอบความเข้าใจโค้ด (Comprehension Checkpoint)
                        </h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold">
                        รับ +{selectedExample.points} แต้ม
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {selectedExample.conceptQuiz.question}
                    </p>

                    <div className="space-y-2">
                      {selectedExample.conceptQuiz.options.map((opt, oIdx) => {
                        const isChosen = selectedAnswer === oIdx;
                        let optionStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-400';
                        if (isAnswerSubmitted) {
                          if (oIdx === selectedExample.conceptQuiz.correctAnswer) {
                            optionStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (isChosen) {
                            optionStyle = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200';
                          }
                        } else if (isChosen) {
                          optionStyle = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isAnswerSubmitted}
                            onClick={() => setSelectedAnswer(oIdx)}
                            className={`w-full p-3 rounded-2xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {isAnswerSubmitted && oIdx === selectedExample.conceptQuiz.correctAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {!isAnswerSubmitted ? (
                      <button
                        type="button"
                        disabled={selectedAnswer === null}
                        onClick={handleCheckQuizAnswer}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                      >
                        ส่งคำตอบและรับคะแนน (+{selectedExample.points} แต้ม)
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          {selectedAnswer === selectedExample.conceptQuiz.correctAnswer ? (
                            <span className="text-emerald-600">🎉 ตอบถูกต้อง!</span>
                          ) : (
                            <span className="text-rose-600">❌ ยังไม่ถูกต้อง ลองอ่านคำเฉลยด้านล่างนะ</span>
                          )}
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                          {selectedExample.conceptQuiz.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: COMMON PITFALLS */}
              {modalTab === 'pitfalls' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span>จุดที่นักเรียนมักทำผิดพลาดบ่อย (Common Bugs &amp; Pitfalls)</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      เรียนรู้จากข้อผิดพลาดที่พบบ่อย เพื่อเขียนโค้ดได้อย่างมั่นใจและตรวจแก้บั๊กได้รวดเร็ว
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectedExample.commonPitfalls.map((pitfall, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300"
                      >
                        <span className="p-1 rounded-md bg-rose-500 text-white font-bold text-[10px] shrink-0 mt-0.5">
                          บั๊ก {pIdx + 1}
                        </span>
                        <p className="leading-relaxed text-[11px] sm:text-xs">{pitfall}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>พร้อมแล้วหรือยัง? นำความรู้ไปทดลองรันโค้ดจริงบนซิมูเลเตอร์!</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchSimulator(selectedExample)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>
                    เปิดทดลองใน {selectedExample.platform === 'scratch' ? 'Scratch Studio' : 'Micro:bit Simulator'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
