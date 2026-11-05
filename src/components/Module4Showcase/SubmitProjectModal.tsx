import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Link as LinkIcon, Image as ImageIcon, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ShowcaseProject, ProjectStage } from '../../types/index.ts';

interface SubmitProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: ShowcaseProject) => void;
  defaultStudentName?: string;
  defaultGrade?: string;
}

export const SubmitProjectModal: React.FC<SubmitProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultStudentName = '',
  defaultGrade = '',
}) => {
  const [title, setTitle] = useState('');
  const [studentName, setStudentName] = useState(defaultStudentName);
  const [grade, setGrade] = useState(defaultGrade);
  const [tool, setTool] = useState<'Scratch' | 'Micro:bit' | 'Scratch & Micro:bit'>('Scratch');
  const [stage, setStage] = useState<ProjectStage>('draft');
  const [projectUrl, setProjectUrl] = useState('');
  const [description, setDescription] = useState('');
  const [codeHighlights, setCodeHighlights] = useState('');
  const [reflectionNote, setReflectionNote] = useState('');
  const [tagInput, setTagInput] = useState('Game, Loops, Creative');

  // Up to 2 uploaded preview images
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle uploading preview images (maximum 2 images)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 2 - images.length;
    if (availableSlots <= 0) {
      setImageError('อัปโหลดภาพตัวอย่างผลงานได้ไม่เกิน 2 ภาพเท่านั้น');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (files.length > availableSlots) {
      setImageError(`คุณสามารถเพิ่มได้อีกเพียง ${availableSlots} ภาพเท่านั้น (จำกัดไม่เกิน 2 ภาพ)`);
    }

    const filesToRead = Array.from(files).slice(0, availableSlots);
    filesToRead.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageError('กรุณาเลือกไฟล์รูปภาพเท่านั้น (PNG, JPG, WebP)');
        return;
      }

      // Max size: 4MB
      if (file.size > 4 * 1024 * 1024) {
        setImageError('ขนาดไฟล์ภาพต้องไม่เกิน 4MB ต่อรูป');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImages((prev) => {
            if (prev.length >= 2) return prev;
            return [...prev, result];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageError(null);
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !studentName.trim()) return;

    // Default thumbnails if no custom image was uploaded
    const defaultThumbnail =
      tool === 'Scratch'
        ? '/src/assets/images/hero_computing_education_1791966913783.jpg'
        : '/src/assets/images/module_scratch_microbit_1791966916245.jpg';

    const newProject: ShowcaseProject = {
      id: `user_proj_${Date.now()}`,
      title: title.trim(),
      studentName: studentName.trim(),
      grade: grade.trim() || 'ป.6/1',
      tool,
      description: description.trim(),
      thumbnailUrl: images.length > 0 ? images[0] : defaultThumbnail,
      images: images.length > 0 ? images : undefined,
      projectUrl: projectUrl.trim() || undefined,
      tags: tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      likes: 1,
      codeHighlights: codeHighlights.trim(),
      reflectionNote: reflectionNote.trim(),
      featured: true,
      stage,
      stageHistory: {
        [stage]: {
          date: 'วันนี้',
          note: reflectionNote.trim() || `บันทึกโครงงานในระยะ ${stage.toUpperCase()}`,
          milestonesDone: ['ลงทะเบียนโครงงานเข้าสู่ระบบคลังแสดงผลงาน'],
        },
      },
    };

    onSubmit(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">ส่งผลงานและร่วมนำเสนอ</h3>
              <p className="text-xs text-slate-500">
                เผยแพร่โครงงาน Scratch &amp; Micro:bit เพื่อแลกเปลี่ยนเรียนรู้และรับข้อเสนอแนะจากเพื่อนๆ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Author Name & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ชื่อผู้จัดทำ / เจ้าของผลงาน *
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="เช่น ด.ช. ณภัทร ใจดี"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ระดับชั้น / ห้องเรียน *
              </label>
              <input
                type="text"
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="ป.6/1"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Project Title & Tool */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                ชื่อผลงาน / โครงงาน *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น หุ่นยนต์ตรวจจับสิ่งกีดขวางด้วย Micro:bit"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                เครื่องมือที่ใช้
              </label>
              <select
                value={tool}
                onChange={(e) => setTool(e.target.value as any)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 font-medium"
              >
                <option value="Scratch">Scratch</option>
                <option value="Micro:bit">Micro:bit</option>
                <option value="Scratch & Micro:bit">Scratch &amp; Micro:bit</option>
              </select>
            </div>
          </div>

          {/* Development Stage Timeline Selector */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800 text-xs sm:text-sm">
                ระยะการพัฒนาโครงงานในปัจจุบัน (Project Development Stage)
              </label>
              <span className="text-[11px] text-indigo-600 font-semibold">
                สะท้อนการเติบโตของคุณ
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'idea', label: '1. ไอเดีย', emoji: '💡', desc: 'วางแผน/แตกย่อยปัญหา' },
                { key: 'draft', label: '2. ร่างแบบ', emoji: '✏️', desc: 'ลงมือโค้ดรอบแรก' },
                { key: 'review', label: '3. รีวิว', emoji: '💬', desc: 'รับคำแนะนำ 2 Stars' },
                { key: 'final', label: '4. สมบูรณ์', emoji: '🏆', desc: 'พร้อมจัดแสดงจริง' },
              ].map((s) => {
                const isSelected = stage === s.key;
                return (
                  <button
                    type="button"
                    key={s.key}
                    onClick={() => setStage(s.key as ProjectStage)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>{s.emoji}</span>
                      <span>{s.label}</span>
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {s.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NEW: Project Link / URL Input */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>ช่องสำหรับเพิ่มลิงก์ผลงาน (Project Link / URL)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">ไม่บังคับ</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="เช่น https://scratch.mit.edu/projects/... หรือ https://makecode.microbit.org/..."
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 font-mono text-xs sm:text-sm"
              />
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              แนบลิงก์ผลงาน Scratch, Micro:bit MakeCode, GitHub, Canva หรือวิดีโอคลิป เพื่อให้เพื่อนๆ เปิดทดสอบได้
            </p>
          </div>

          {/* NEW: Upload Preview Images (Max 2 images) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>ภาพตัวอย่างผลงาน (อัปโหลดได้ไม่เกิน 2 ภาพ)</span>
              </label>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                images.length === 2
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {images.length}/2 ภาพ {images.length === 2 && '✓ ครบแล้ว'}
              </span>
            </div>

            {/* Error Message */}
            {imageError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{imageError}</span>
              </div>
            )}

            {/* Uploaded Images Previews & Upload Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Display Uploaded Images */}
              {images.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-2xl border-2 border-indigo-200 overflow-hidden bg-slate-100 group shadow-xs"
                >
                  <img
                    src={imgSrc}
                    alt={`ตัวอย่างผลงานภาพที่ ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white rounded-md text-[10px] font-semibold">
                    ภาพที่ {idx + 1} / 2
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-colors"
                    title="ลบภาพนี้"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Upload Dropzone / Button (Shown if less than 2 images) */}
              {images.length < 2 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-video ${
                    images.length === 0
                      ? 'border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/70 sm:col-span-2'
                      : 'border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/30'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1.5">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {images.length === 0 ? 'คลิกเพื่อเลือกภาพตัวอย่างผลงาน' : 'เพิ่มภาพที่ 2 (ไม่เกิน 2 ภาพ)'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    รองรับไฟล์ JPG, PNG, WebP (สูงสุด 2 ภาพ, ภาพละไม่เกิน 4MB)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              คำอธิบายและแนวคิดของผลงาน
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="โครงงานนี้ทำอะไรได้ มีแรงบันดาลใจมาจากอะไร และช่วยแก้ปัญหาอะไร"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
            />
          </div>

          {/* Code Highlights */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ไฮไลท์ของโค้ดหรืออัลกอริทึมที่ใช้
            </label>
            <input
              type="text"
              value={codeHighlights}
              onChange={(e) => setCodeHighlights(e.target.value)}
              placeholder="เช่น ใช้คำสั่ง If-Else ตรวจสอบค่าเซ็นเซอร์แสง และสุ่มตัวเลข"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
            />
          </div>

          {/* Reflection Note */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ปัญหาที่พบและวิธีการแก้ปัญหา (Debugging &amp; Reflection)
            </label>
            <textarea
              rows={2}
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder="ตอนทำเจอบั๊กอะไร และมีวิธีคิดในการแก้ไขอย่างไร"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
            />
          </div>

          {/* Keywords / Tags */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              แท็กคำสำคัญ (คั่นด้วยเครื่องหมายจุลภาค)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Game, STEM, Sensor, Loop"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>เผยแพร่ผลงานสู่คลัง</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
