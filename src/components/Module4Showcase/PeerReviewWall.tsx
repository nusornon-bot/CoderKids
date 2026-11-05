import React, { useState } from 'react';
import { PeerReview, ShowcaseProject } from '../../types/index.ts';
import { Star, Sparkles, MessageCircle, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PeerReviewWallProps {
  projects: ShowcaseProject[];
  selectedProject: ShowcaseProject | null;
  onClearSelectedProject: () => void;
  reviews: PeerReview[];
  onAddReview: (review: PeerReview) => void;
  addPoints: (points: number) => void;
}

export const PeerReviewWall: React.FC<PeerReviewWallProps> = ({
  projects,
  selectedProject,
  onClearSelectedProject,
  reviews,
  onAddReview,
  addPoints,
}) => {
  const [activeProjectId, setActiveProjectId] = useState<string>(
    selectedProject ? selectedProject.id : projects[0]?.id || ''
  );
  const [reviewerName, setReviewerName] = useState('');
  const [star1, setStar1] = useState('');
  const [star2, setStar2] = useState('');
  const [wish, setWish] = useState('');

  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const projectReviews = reviews.filter((r) => r.projectId === currentProject?.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !star1.trim() || !wish.trim()) return;

    const newRev: PeerReview = {
      id: `rev_${Date.now()}`,
      projectId: currentProject.id,
      reviewerName,
      star1,
      star2: star2 || 'การออกแบบและผลงานมีความสวยงาม ใช้งานง่าย',
      wish,
      createdAt: 'เมื่อสักครู่',
    };

    onAddReview(newRev);
    setStar1('');
    setStar2('');
    setWish('');
    addPoints(15);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">แลกเปลี่ยนเรียนรู้ (Peer Review)</span>
        <h3 className="text-xl font-bold text-slate-900 mt-0.5">
          กำแพงแลกเปลี่ยนความคิดเห็น: Two Stars and a Wish ⭐⭐🌠
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          ฝึกทักษะการสื่อสารเชิงสร้างสรรค์ ชื่นชมจุดเด่น 2 อย่าง และให้ข้อเสนอแนะเพื่อพัฒนา 1 อย่าง
        </p>
      </div>

      {/* Project selector */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-slate-700 mb-2">เลือกผลงานที่ต้องการให้คำแนะนำ:</label>
        <div className="flex flex-wrap gap-2">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProjectId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeProjectId === p.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{p.title.length > 25 ? `${p.title.substring(0, 25)}...` : p.title}</span>
              <span className="text-[10px] ml-1.5 opacity-80">({p.studentName})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200 p-5">
          <div className="text-sm font-bold text-slate-900 mb-1">
            ร่วมส่งกำลังใจให้โครงงาน &quot;{currentProject?.title}&quot;
          </div>
          <div className="text-xs text-slate-500 mb-4">โดย {currentProject?.studentName}</div>

          <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">ชื่อผู้ให้ข้อเสนอแนะ *</label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="ชื่อของคุณ เช่น ด.ญ. พิมพ์มาดา"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-amber-700 mb-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>ดาวดวงที่ 1: สิ่งที่ชื่นชมด้านความคิดสร้างสรรค์/ไอเดีย *</span>
              </label>
              <input
                type="text"
                required
                value={star1}
                onChange={(e) => setStar1(e.target.value)}
                placeholder="เช่น ไอเดียการนำเซ็นเซอร์มาประยุกต์ใช้น่าสนใจมากและแก้ปัญหาได้ตรงจุด"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-amber-700 mb-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>ดาวดวงที่ 2: สิ่งที่ชื่นชมด้านการทำงานของโค้ด/เทคนิค</span>
              </label>
              <input
                type="text"
                value={star2}
                onChange={(e) => setStar2(e.target.value)}
                placeholder="เช่น การเขียนฟังก์ชันวนซ้ำช่วยให้โปรแกรมทำงานเร็วและไม่มีบั๊ก"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-indigo-700 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>หนึ่งความปรารถนา (Wish): ข้อเสนอแนะเพื่อพัฒนาต่อยอด *</span>
              </label>
              <textarea
                rows={2}
                required
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="เช่น ถ้าเพิ่มระบบบันทึกคะแนนสูงสุด (High Score) จะทำให้เกมน่าเล่นยิ่งขึ้น"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95 text-xs sm:text-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>โพสต์ความคิดเห็นเชิงบวก (+15 แต้ม)</span>
            </button>
          </form>
        </div>

        {/* Right: Review Stream */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider">
            <span>ความคิดเห็นจากเพื่อนๆ ({projectReviews.length})</span>
          </div>

          <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
            {projectReviews.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-xs">
                <MessageCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <span>ยังไม่มีข้อเสนอแนะสำหรับโครงงานนี้ เป็นคนแรกที่ให้คำชมเพื่อนกันเถอะ!</span>
              </div>
            ) : (
              projectReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rev.reviewerName}</span>
                    <span className="text-[11px] text-slate-400">{rev.createdAt}</span>
                  </div>

                  <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1">
                    <div className="text-amber-800 font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{rev.star1}</span>
                    </div>
                    {rev.star2 && (
                      <div className="text-amber-800 font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{rev.star2}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-900 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>ข้อเสนอแนะเพื่อพัฒนา:</strong> {rev.wish}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
