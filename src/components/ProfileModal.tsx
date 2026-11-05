import React, { useState } from 'react';
import { UserProfile, AchievementBadge } from '../types/index.ts';
import { AVATAR_OPTIONS } from '../data/learningData.ts';
import { CategorizedAvatarSelector, AvatarSelectionPayload } from './CategorizedAvatarSelector.tsx';
import { X, Award, ShieldCheck, Flame, BookOpen, Sparkles, Check, Edit3, Save, FileSpreadsheet, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  badges: AchievementBadge[];
  points: number;
  completedModulesCount: number;
  onOpenProfileManagement?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  badges,
  points,
  completedModulesCount,
  onOpenProfileManagement,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [school, setSchool] = useState(profile.school || 'โรงเรียนอนุบาลนราธิวาส');
  const [grade, setGrade] = useState(profile.grade || 'ประถมศึกษาปีที่ 4/1');
  const [bio, setBio] = useState(profile.bio);
  const [selectedAvatarId, setSelectedAvatarId] = useState(profile.avatarId);
  const [selectedAvatarEmoji, setSelectedAvatarEmoji] = useState(profile.avatarEmoji || '🐱');
  const [selectedTitle, setSelectedTitle] = useState(profile.selectedTitle);

  if (!isOpen) return null;

  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === selectedAvatarId) || AVATAR_OPTIONS[0];

  // Level calculation: 100 points per level
  const userLevel = Math.max(1, Math.floor(points / 75) + 1);
  const currentLevelMin = (userLevel - 1) * 75;
  const nextLevelMin = userLevel * 75;
  const levelProgress = Math.min(100, Math.round(((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name: name.trim() || profile.name,
      school: school.trim() || profile.school,
      grade: grade.trim() || profile.grade,
      bio: bio.trim() || profile.bio,
      avatarId: selectedAvatarId,
      avatarEmoji: selectedAvatarEmoji,
      selectedTitle,
    };
    onUpdateProfile(updated);
    setIsEditing(false);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 space-y-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">โปรไฟล์ผู้เรียน (Student Profile)</h3>
              <p className="text-xs text-slate-500">ข้อมูลส่วนตัว เหรียญตราความสำเร็จ และระดับการเรียนรู้</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-md">
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar Circle */}
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-2xl ${currentAvatar.color} flex items-center justify-center text-4xl shadow-xl ring-4 ring-white/20`}
              >
                {currentAvatar.emoji}
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-amber-400 text-slate-950 rounded-md font-mono text-[10px] font-extrabold uppercase shadow">
                LV.{userLevel}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="text-xl font-bold text-white">
                  {profile.name} {profile.nickname ? `(${profile.nickname})` : ''}
                </h4>
                <span className="text-xs text-indigo-200 bg-white/10 px-2.5 py-0.5 rounded-md font-medium border border-white/10">
                  {profile.selectedTitle}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-300">
                {profile.studentId && <span className="font-mono text-amber-300 font-semibold">{profile.studentId}</span>}
                {profile.studentId && <span aria-hidden="true">·</span>}
                <span>{profile.grade}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.school}</span>
              </div>

              <p className="text-xs text-slate-300 max-w-md pt-1 italic">
                &ldquo;{profile.bio}&rdquo;
              </p>
              {profile.motto && (
                <div className="text-[11px] text-amber-300 font-medium">
                  💡 คติประจำใจ: {profile.motto}
                </div>
              )}

              {/* Level XP Bar */}
              <div className="pt-3 max-w-sm space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>เลเวล {userLevel} (ความก้าวหน้าสู่เลเวล {userLevel + 1})</span>
                  <span className="font-mono tabular-nums font-semibold text-amber-300">{points} / {nextLevelMin} XP</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium border border-white/20 transition-all shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>แก้ไขโปรไฟล์</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center text-amber-500 mb-1">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">{points}</div>
            <div className="text-[11px] text-slate-500">แต้มสะสมทั้งหมด</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center text-orange-500 mb-1">
              <Flame className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">{profile.streakDays} วัน</div>
            <div className="text-[11px] text-slate-500">เรียนต่อเนื่อง (Streak)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center text-indigo-500 mb-1">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">{unlockedBadgesCount} / {badges.length}</div>
            <div className="text-[11px] text-slate-500">เหรียญตราที่ปลดล็อก</div>
          </div>
        </div>

        {/* Edit Form (Collapsible) */}
        {isEditing && (
          <form onSubmit={handleSave} className="p-5 rounded-2xl bg-slate-50 border border-indigo-200 space-y-4 text-xs sm:text-sm">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>แก้ไขข้อมูลส่วนตัว</span>
              <span className="text-xs text-indigo-600 font-normal">* บันทึกแล้วข้อมูลจะอัปเดตทันที</span>
            </div>

            {/* Avatar Picker */}
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">
                เลือกรูปสัญลักษณ์อวตาร (เลือกตามหมวดหมู่ หรือสร้างเองได้)
              </label>
              <CategorizedAvatarSelector
                selectedAvatarId={selectedAvatarId}
                selectedAvatarEmoji={selectedAvatarEmoji}
                onSelectAvatar={(payload: AvatarSelectionPayload) => {
                  setSelectedAvatarId(payload.avatarId);
                  if (payload.avatarEmoji) setSelectedAvatarEmoji(payload.avatarEmoji);
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น กวินท์ พงษ์สถิตย์"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">รหัสนักเรียน (อัตโนมัติ)</label>
                <input
                  type="text"
                  readOnly
                  value={profile.studentId || 'CK-2569-4102'}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs sm:text-sm font-mono text-slate-600 cursor-not-allowed select-all"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">ระดับชั้น / ห้อง</label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="เช่น ประถมศึกษาปีที่ 4/1"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">โรงเรียน / สถาบันการศึกษา</label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="เช่น โรงเรียนอนุบาลนราธิวาส"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">คำแนะนำตัวสั้นๆ (Bio)</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="ความสนใจในการเรียนรู้..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>บันทึกโปรไฟล์</span>
              </button>
            </div>
          </form>
        )}

        {/* Achievement Badges Showcase */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900 uppercase tracking-wider">
            <span>ทำเนียบเหรียญตราเกียรติยศ (Badges)</span>
            <span className="text-slate-400">ปลดล็อกแล้ว {unlockedBadgesCount}/{badges.length}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                  b.unlocked
                    ? 'bg-amber-50/60 border-amber-200 text-slate-900'
                    : 'bg-slate-50/80 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm ${
                    b.unlocked ? 'bg-amber-400 text-amber-950 font-bold shadow-sm' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {b.unlocked ? '🏅' : '🔒'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{b.title}</div>
                  <div className="text-[11px] leading-tight text-slate-500 mt-0.5 line-clamp-2">
                    {b.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Close & Google Sheets CTA */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {onOpenProfileManagement && (
            <button
              onClick={() => {
                onClose();
                onOpenProfileManagement();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>จัดการ &amp; ซิงก์สู่ Google Sheets</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors ml-auto"
          >
            เรียบร้อย
          </button>
        </div>
      </div>
    </div>
  );
};
