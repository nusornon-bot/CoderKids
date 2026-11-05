import React, { useState, useMemo } from 'react';
import { ShowcaseProject, ProjectStage } from '../../types/index.ts';
import { PROJECT_STAGES_CONFIG } from '../../data/learningData.ts';
import {
  Heart,
  Plus,
  ExternalLink,
  MessageSquare,
  Award,
  Sparkles,
  Lightbulb,
  PencilRuler,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Search,
  Info,
  TrendingUp,
  RefreshCw,
  Check,
  Calendar,
  Layers,
  X,
  Target,
  Clock,
  Sparkle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../../utils/soundEffects.ts';

interface ShowcaseGalleryProps {
  projects: ShowcaseProject[];
  onOpenSubmitModal: () => void;
  onSelectProjectForReview: (project: ShowcaseProject) => void;
  onLikeProject: (projectId: string) => void;
  likedProjectIds: string[];
  onUpdateProjectStage?: (projectId: string, newStage: ProjectStage) => void;
}

export const ShowcaseGallery: React.FC<ShowcaseGalleryProps> = ({
  projects,
  onOpenSubmitModal,
  onSelectProjectForReview,
  onLikeProject,
  likedProjectIds,
  onUpdateProjectStage,
}) => {
  const [filterTool, setFilterTool] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showGrowthGuide, setShowGrowthGuide] = useState<boolean>(false);
  const [selectedDetailProject, setSelectedDetailProject] = useState<ShowcaseProject | null>(null);

  // Fallback / default stage resolver
  const getProjectStage = (proj: ShowcaseProject): ProjectStage => {
    return proj.stage || 'final';
  };

  // Stage order for progression
  const stageOrder: ProjectStage[] = ['idea', 'draft', 'review', 'final'];

  // Calculate project distribution across stages
  const stageCounts = useMemo(() => {
    const counts: Record<ProjectStage, number> = {
      idea: 0,
      draft: 0,
      review: 0,
      final: 0,
    };
    projects.forEach((p) => {
      const s = getProjectStage(p);
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [projects]);

  // Filtered projects
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      // Tool filter
      if (filterTool !== 'all' && !p.tool.toLowerCase().includes(filterTool.toLowerCase())) {
        return false;
      }
      // Stage filter
      const pStage = getProjectStage(p);
      if (filterStage !== 'all' && pStage !== filterStage) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesStudent = p.studentName.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesStudent && !matchesDesc && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [projects, filterTool, filterStage, searchQuery]);

  // Stage helper info
  const getStageMeta = (stage: ProjectStage) => {
    return (
      PROJECT_STAGES_CONFIG.find((s) => s.stage === stage) ||
      PROJECT_STAGES_CONFIG[PROJECT_STAGES_CONFIG.length - 1]
    );
  };

  // Advance project stage
  const handleAdvanceStage = (proj: ShowcaseProject) => {
    const current = getProjectStage(proj);
    const currentIndex = stageOrder.indexOf(current);
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      if (onUpdateProjectStage) {
        onUpdateProjectStage(proj.id, nextStage);
      }
      soundEffects.playSuccess();
      if (nextStage === 'final') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  // Change stage from modal
  const handleChangeStageFromModal = (projId: string, targetStage: ProjectStage) => {
    if (onUpdateProjectStage) {
      onUpdateProjectStage(projId, targetStage);
      soundEffects.playSuccess();
      if (targetStage === 'final') {
        confetti({ particleCount: 55, spread: 65, origin: { y: 0.6 } });
      }
      // Update local modal state
      if (selectedDetailProject && selectedDetailProject.id === projId) {
        setSelectedDetailProject({
          ...selectedDetailProject,
          stage: targetStage,
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-7">
      {/* 1. Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              นิทรรศการผลงานและการเติบโต
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">สพฐ. / สสวท. ว 4.2</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            คลังผลงานสร้างสรรค์ (Creative Showcase Gallery) 🎨
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            ติดตามเส้นทางการเติบโตของโครงงานตั้งแต่จุดประกายไอเดีย สู่การร่างแบบ รับฟังคำแนะนำ และสร้างผลงานจริงที่สมบูรณ์
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowGrowthGuide(!showGrowthGuide)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 bg-white hover:bg-purple-50/50 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Info className="w-4 h-4 text-purple-600" />
            <span>{showGrowthGuide ? 'ซ่อนคู่มือการเติบโต' : '📖 คู่มือ 4 ขั้นตอนการเติบโต'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenSubmitModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-indigo-200 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>นำเสนอผลงานของฉัน</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Progress Timeline Banner: 4 Stages of Project Development */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-slate-50 border border-indigo-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <span>เส้นทางการเติบโตของโครงงาน (Project Development Journey)</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  4 ระยะการเรียนรู้
                </span>
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                คลิกที่แต่ละขั้นตอนเพื่อดูผลงานที่อยู่ในระยะนั้น และมองเห็นพัฒนาการของเพื่อนๆ ในห้องเรียน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 font-bold text-slate-700">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>ภาพรวมทั้งห้อง:</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-indigo-700">
              {projects.length} โครงงาน
            </span>
          </div>
        </div>

        {/* 4 Interactive Stage Nodes in Timeline Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {PROJECT_STAGES_CONFIG.map((stageConfig, idx) => {
            const isSelected = filterStage === stageConfig.stage;
            const count = stageCounts[stageConfig.stage];
            const percent = projects.length > 0 ? Math.round((count / projects.length) * 100) : 0;

            return (
              <div
                key={stageConfig.stage}
                onClick={() => setFilterStage(isSelected ? 'all' : stageConfig.stage)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? `${stageConfig.badgeBgLight} ring-2 ${stageConfig.ringColor} shadow-md scale-[1.02]`
                    : 'bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-indigo-300 shadow-xs'
                }`}
              >
                {/* Connecting arrow indicator for visual flow (on desktop) */}
                {idx < PROJECT_STAGES_CONFIG.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] shadow-xs">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{stageConfig.emoji}</span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        ขั้นที่ {stageConfig.stepNumber}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        isSelected
                          ? stageConfig.badgeColor
                          : 'bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-800'
                      }`}
                    >
                      {count} ชิ้น ({percent}%)
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {stageConfig.labelTh}
                  </h5>

                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {stageConfig.tagline}
                  </p>
                </div>

                {/* Micro Milestones & Progress */}
                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>ความก้าวหน้าโครงงาน</span>
                    <span className="font-mono font-bold text-slate-600">
                      {stageConfig.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stageConfig.dotColor} rounded-full transition-all duration-500`}
                      style={{ width: `${stageConfig.progressPercent}%` }}
                    />
                  </div>

                  <div className="mt-2 text-[10px] font-medium text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{isSelected ? '✓ กำลังแสดงระยะนี้ (คลิกเพื่อยกเลิก)' : 'คลิกเพื่อกรองระยะนี้'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Stage Filter Tag Notice */}
        {filterStage !== 'all' && (
          <div className="flex items-center justify-between p-2.5 px-3.5 rounded-xl bg-white border border-indigo-200 text-xs text-slate-700 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-indigo-900">
                กำลังแสดงผลงานในระยะ: {getStageMeta(filterStage as ProjectStage).labelTh}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">พบ {filtered.length} โครงงาน</span>
            </div>
            <button
              type="button"
              onClick={() => setFilterStage('all')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>แสดงทุกระยะ (ล้างตัวกรอง)</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Educational Growth Guide (Collapsible Drawer) */}
      {showGrowthGuide && (
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800 animate-fade-in shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">
                  คู่มือกระบวนการเติบโตของนักคิดดิจิทัล (Growth Mindset Framework)
                </h4>
                <p className="text-xs text-slate-300">
                  เข้าใจขั้นตอนการพัฒนาโครงงานจริง เพื่อสร้างความมั่นใจและเห็นคุณค่าในทุกความพยายาม
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowGrowthGuide(false)}
              className="text-slate-400 hover:text-white p-1 text-xs"
            >
              ✕ ปิด
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {PROJECT_STAGES_CONFIG.map((s) => (
              <div key={s.stage} className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <span>{s.emoji}</span>
                  <span>{s.labelTh}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{s.description}</p>
                <div className="space-y-1 pt-1 border-t border-slate-700/50">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    เป้าหมายที่ต้องผ่าน (Milestones):
                  </span>
                  {s.milestones.map((m, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        {/* Tool Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit">
          <span className="text-[11px] font-semibold text-slate-500 px-2">เครื่องมือ:</span>
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'scratch', label: '🐱 Scratch' },
            { id: 'micro:bit', label: '📟 Micro:bit' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilterTool(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTool === t.id
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Stage Filter Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500">ระยะ:</span>
          <button
            type="button"
            onClick={() => setFilterStage('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterStage === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทุกระยะ ({projects.length})
          </button>
          {PROJECT_STAGES_CONFIG.map((s) => (
            <button
              key={s.stage}
              type="button"
              onClick={() => setFilterStage(s.stage)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                filterStage === s.stage
                  ? `${s.badgeColor} shadow-xs`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{s.emoji}</span>
              <span>
                {s.labelShort} ({stageCounts[s.stage]})
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อโครงงาน, ผู้สร้าง..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 5. Project Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto text-xl shadow-xs">
            🔍
          </div>
          <h4 className="text-sm font-bold text-slate-800">ไม่พบผลงานที่ตรงกับเงื่อนไขการค้นหา</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือเลือกตัวกรองระยะการพัฒนาเป็น &quot;ทุกระยะ&quot; เพื่อดูโครงงานทั้งหมด
          </p>
          <button
            type="button"
            onClick={() => {
              setFilterTool('all');
              setFilterStage('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-slate-100 transition-colors shadow-xs"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => {
            const isLiked = likedProjectIds.includes(proj.id);
            const stage = getProjectStage(proj);
            const stageMeta = getStageMeta(stage);
            const stageIdx = stageOrder.indexOf(stage);

            return (
              <div
                key={proj.id}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={proj.thumbnailUrl}
                      alt={proj.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Tool Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/75 backdrop-blur-sm rounded-lg text-[11px] font-bold text-white shadow-sm">
                      {proj.tool}
                    </div>

                    {/* Stage Badge on Thumbnail */}
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black shadow-sm ${stageMeta.badgeColor}`}
                      >
                        <span>{stageMeta.emoji}</span>
                        <span>{stageMeta.labelShort}</span>
                      </span>
                    </div>

                    {/* Multi-image indicator */}
                    {proj.images && proj.images.length > 1 && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-md text-[10px] font-semibold text-white flex items-center gap-1">
                        <span>📷 {proj.images.length} ภาพ</span>
                      </div>
                    )}
                  </div>

                  {/* Visual Progress Timeline Stepper on Card */}
                  <div className="px-5 pt-3.5 pb-2 bg-slate-50/70 border-b border-slate-100">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                        <span>ไทม์ไลน์การเติบโต:</span>
                      </span>
                      <span className="font-bold text-slate-900 font-mono text-[10px]">
                        ขั้นที่ {stageMeta.stepNumber}/4 ({stageMeta.progressPercent}%)
                      </span>
                    </div>

                    {/* 4 Connected Dots Indicator */}
                    <div className="flex items-center gap-1 relative my-1">
                      {PROJECT_STAGES_CONFIG.map((s, idx) => {
                        const isPast = idx < stageIdx;
                        const isCurrent = idx === stageIdx;
                        return (
                          <div key={s.stage} className="flex-1 flex items-center">
                            <div
                              title={`${s.labelTh} (${s.progressPercent}%)`}
                              className={`h-2 flex-1 rounded-full transition-all ${
                                isPast
                                  ? 'bg-emerald-500'
                                  : isCurrent
                                  ? `${s.dotColor} ring-2 ring-indigo-200`
                                  : 'bg-slate-200'
                              }`}
                            />
                            {idx < PROJECT_STAGES_CONFIG.length - 1 && <div className="w-1" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span className="truncate">{stageMeta.labelTh}</span>
                      {stageIdx < stageOrder.length - 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdvanceStage(proj);
                          }}
                          className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors ml-2 shrink-0 flex items-center gap-0.5 cursor-pointer"
                          title="คลิกเพื่อเลื่อนระดับการเติบโตของโครงงานนี้"
                        >
                          <span>ก้าวสู่ขั้นต่อไป</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                      <span className="font-medium text-slate-700">{proj.studentName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{proj.grade}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">
                      {proj.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                      {proj.description}
                    </p>

                    {proj.projectUrl && (
                      <div className="mb-3">
                        <a
                          href={proj.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>เปิดดูโครงงานจริง</span>
                        </a>
                      </div>
                    )}

                    {/* Unboxed tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                      {proj.tags.map((t, idx) => (
                        <span key={idx} className="hover:text-slate-600 transition-colors">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => onLikeProject(proj.id)}
                    className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                      isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                    <span className="tabular-nums">{proj.likes}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDetailProject(proj)}
                      className="text-slate-700 hover:text-indigo-600 font-bold text-xs px-2.5 py-1 rounded-lg hover:bg-white transition-all cursor-pointer"
                    >
                      ดูแนวคิด &amp; ไทม์ไลน์
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectProjectForReview(proj)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>ให้คำชม (2 Stars)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Comprehensive Project Detail & Growth Timeline Modal */}
      {selectedDetailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-8 space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase">
                    {selectedDetailProject.tool}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                      getStageMeta(getProjectStage(selectedDetailProject)).badgeColor
                    }`}
                  >
                    {getStageMeta(getProjectStage(selectedDetailProject)).emoji}{' '}
                    {getStageMeta(getProjectStage(selectedDetailProject)).labelTh}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {selectedDetailProject.title}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  สร้างสรรค์โดย <strong className="text-slate-800">{selectedDetailProject.studentName}</strong> (
                  {selectedDetailProject.grade})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailProject(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* EXPANDED PROJECT GROWTH TIMELINE (Idea -> Draft -> Review -> Final) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      เส้นทางการเติบโตและพัฒนาการของผลงานนี้ (Project Growth Timeline)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      แสดงขั้นตอนตั้งแต่เริ่มคิด พัฒนาต้นแบบแรก รับฟีดแบ็ก จนถึงผลงานฉบับสมบูรณ์
                    </p>
                  </div>
                </div>

                {/* Stage Switcher Controls inside Modal */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-medium text-[11px]">ปรับระดับ:</span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                    {stageOrder.map((stg) => {
                      const cur = getProjectStage(selectedDetailProject);
                      const isCur = cur === stg;
                      const sInfo = getStageMeta(stg);
                      return (
                        <button
                          key={stg}
                          type="button"
                          onClick={() => handleChangeStageFromModal(selectedDetailProject.id, stg)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            isCur
                              ? `${sInfo.badgeColor} shadow-xs`
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                          title={`ปรับโครงงานสู่ระยะ ${sInfo.labelTh}`}
                        >
                          <span>{sInfo.emoji}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4 Vertical Timeline Stages */}
              <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {PROJECT_STAGES_CONFIG.map((stageConfig, sIdx) => {
                  const currentStage = getProjectStage(selectedDetailProject);
                  const currentIdx = stageOrder.indexOf(currentStage);
                  const isDone = sIdx < currentIdx;
                  const isCurrent = sIdx === currentIdx;
                  const isUpcoming = sIdx > currentIdx;

                  // Historical note if available
                  const historyItem = selectedDetailProject.stageHistory?.[stageConfig.stage];

                  return (
                    <div key={stageConfig.stage} className="relative">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                          isDone
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                            : isCurrent
                            ? `${stageConfig.badgeColor} ring-4 ring-indigo-100 scale-110 animate-pulse`
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <span>{stageConfig.stepNumber}</span>
                        )}
                      </div>

                      {/* Stage Card */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                          isCurrent
                            ? `${stageConfig.badgeBgLight} border-indigo-300 shadow-sm`
                            : isDone
                            ? 'bg-white border-emerald-200/80'
                            : 'bg-white/60 border-slate-200/70 opacity-75'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{stageConfig.emoji}</span>
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              {stageConfig.labelTh}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px]">
                                อยู่ในระยะนี้
                              </span>
                            )}
                            {isDone && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                สำเร็จแล้ว ✓
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400 font-medium">
                            {historyItem?.date || (isDone ? 'สำเร็จในขั้นก่อนหน้า' : isCurrent ? 'กำลังดำเนินการ' : 'รอเริ่มขั้นตอนถัดไป')}
                          </div>
                        </div>

                        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mb-2">
                          {stageConfig.description}
                        </p>

                        {/* Student Journey Note */}
                        {historyItem?.note && (
                          <div className="p-2.5 rounded-lg bg-white/90 border border-slate-200 text-[11px] text-slate-700 italic space-y-0.5 mb-2">
                            <span className="font-bold not-italic text-indigo-700 block text-[10px] uppercase">
                              บันทึกการเติบโตของผู้เรียน (Student Journal):
                            </span>
                            <span>&quot;{historyItem.note}&quot;</span>
                          </div>
                        )}

                        {/* Milestone checklist */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            หมุดหมายความสำเร็จ (Milestones):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                            {stageConfig.milestones.map((ms, mIndex) => {
                              const isCompletedMs = isDone || (isCurrent && mIndex === 0);
                              return (
                                <div
                                  key={mIndex}
                                  className={`flex items-center gap-1.5 p-1 rounded-md ${
                                    isCompletedMs
                                      ? 'text-emerald-800 font-medium bg-emerald-50/60'
                                      : 'text-slate-500'
                                  }`}
                                >
                                  {isCompletedMs ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                                  )}
                                  <span className="truncate">{ms}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Uploaded Images Preview Gallery */}
            {selectedDetailProject.images && selectedDetailProject.images.length > 0 && (
              <div className="space-y-2">
                <span className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center justify-between">
                  <span>ภาพตัวอย่างผลงาน ({selectedDetailProject.images.length} ภาพ):</span>
                  <span className="text-[11px] text-slate-400 font-normal">คลิกเพื่อดูภาพขยาย</span>
                </span>
                <div
                  className={`grid gap-3 ${
                    selectedDetailProject.images.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {selectedDetailProject.images.map((imgSrc, i) => (
                    <a
                      key={i}
                      href={imgSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs hover:border-indigo-400 transition-all"
                      title="คลิกเพื่อเปิดภาพเต็ม"
                    >
                      <img
                        src={imgSrc}
                        alt={`ภาพตัวอย่าง ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white rounded text-[10px] font-medium">
                        ภาพที่ {i + 1}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Project Link URL Banner */}
            {selectedDetailProject.projectUrl && (
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2 text-indigo-950 font-semibold text-xs min-w-0">
                  <ExternalLink className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="truncate">
                    ลิงก์โครงงาน:{' '}
                    <strong className="font-mono text-indigo-700">{selectedDetailProject.projectUrl}</strong>
                  </span>
                </div>
                <a
                  href={selectedDetailProject.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs"
                >
                  <span>เปิดดูผลงานจริง</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Objective & Description */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs sm:text-sm">
              <span className="font-bold text-slate-800">วัตถุประสงค์และภาพรวมโครงงาน:</span>
              <p className="text-slate-600 leading-relaxed">{selectedDetailProject.description}</p>
            </div>

            {/* Code Highlights */}
            {selectedDetailProject.codeHighlights && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1 text-xs sm:text-sm">
                <span className="font-bold text-indigo-900">
                  การคิดเป็นลำดับขั้นและไฮไลท์โค้ด (Computational Thinking & Code):
                </span>
                <p className="text-indigo-800 font-mono text-xs leading-relaxed">
                  {selectedDetailProject.codeHighlights}
                </p>
              </div>
            )}

            {/* Reflection & Debugging */}
            {selectedDetailProject.reflectionNote && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1 text-xs sm:text-sm">
                <span className="font-bold text-amber-900">
                  ปัญหาที่พบและการแก้ปัญหา (Reflection &amp; Debugging):
                </span>
                <p className="text-amber-800 leading-relaxed">{selectedDetailProject.reflectionNote}</p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const p = selectedDetailProject;
                  setSelectedDetailProject(null);
                  onSelectProjectForReview(p);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>ให้ข้อเสนอแนะเพื่อน (Two Stars &amp; A Wish)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDetailProject(null)}
                className="px-4 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer text-center"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
