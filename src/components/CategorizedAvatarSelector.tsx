import React, { useState } from 'react';
import { AVATAR_OPTIONS, AVATAR_CATEGORIES } from '../data/learningData.ts';
import {
  Code,
  Cpu,
  ShieldCheck,
  Brain,
  Sparkles,
  Check,
  Palette,
  Smile,
  Zap,
} from 'lucide-react';

export const CUSTOM_EMOJI_PRESETS = [
  '💻', '🚀', '🤖', '👾', '🧙‍♂️', '🦊', '⚡', '🌟',
  '🎮', '🦄', '🦖', '🐱', '🐶', '🐯', '🐼', '🦁',
  '🐬', '🌺', '🎨', '🧪', '🔮', '🎯', '💡', '🛡️',
  '👑', '🕶️', '🕹️', '🛰️', '🧭', '🧠', '🧩', '🔬',
  '💾', '📱', '📡', '🔋', '⚙️', '🔍', '⌨️', '🎧'
];

export const CUSTOM_COLOR_PRESETS = [
  { id: 'indigo', label: 'Indigo Cyber', bg: 'bg-indigo-600', ring: 'ring-indigo-500', glow: 'shadow-indigo-500/40' },
  { id: 'emerald', label: 'Emerald Forest', bg: 'bg-emerald-600', ring: 'ring-emerald-500', glow: 'shadow-emerald-500/40' },
  { id: 'sky', label: 'Sky Electric', bg: 'bg-sky-500', ring: 'ring-sky-500', glow: 'shadow-sky-500/40' },
  { id: 'amber', label: 'Solar Amber', bg: 'bg-amber-500', ring: 'ring-amber-500', glow: 'shadow-amber-500/40' },
  { id: 'purple', label: 'Cosmic Violet', bg: 'bg-purple-600', ring: 'ring-purple-500', glow: 'shadow-purple-500/40' },
  { id: 'rose', label: 'Neon Flame', bg: 'bg-rose-500', ring: 'ring-rose-500', glow: 'shadow-rose-500/40' },
  { id: 'slate', label: 'Dark Void', bg: 'bg-slate-800', ring: 'ring-slate-600', glow: 'shadow-slate-500/40' },
  { id: 'teal', label: 'Teal Matrix', bg: 'bg-teal-600', ring: 'ring-teal-500', glow: 'shadow-teal-500/40' },
  { id: 'cyan', label: 'Cyan Cyber', bg: 'bg-cyan-600', ring: 'ring-cyan-500', glow: 'shadow-cyan-500/40' },
];

export interface AvatarSelectionPayload {
  avatarId: string;
  avatarEmoji: string;
  color?: string;
  glow?: string;
  label?: string;
}

interface CategorizedAvatarSelectorProps {
  selectedAvatarId: string;
  selectedAvatarEmoji?: string;
  onSelectAvatar: (payload: AvatarSelectionPayload) => void;
  showCustomBuilderOnly?: boolean;
}

export const CategorizedAvatarSelector: React.FC<CategorizedAvatarSelectorProps> = ({
  selectedAvatarId,
  selectedAvatarEmoji = '🐱',
  onSelectAvatar,
}) => {
  // Determine initial category
  const initialCategory = (() => {
    if (selectedAvatarId.startsWith('custom_')) return 'custom';
    const found = AVATAR_OPTIONS.find((a) => a.id === selectedAvatarId);
    return found ? found.category : 'coding';
  })();

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  // Custom Avatar Creator States
  const [customEmoji, setCustomEmoji] = useState<string>(selectedAvatarEmoji || '🚀');
  const [customColor, setCustomColor] = useState<string>('bg-indigo-600');
  const [customGlow, setCustomGlow] = useState<string>('shadow-indigo-500/40');
  const [customLabel, setCustomLabel] = useState<string>('นักประดิษฐ์โค้ดดิ้งจิ๋ว');

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'coding':
        return <Code className="w-3.5 h-3.5" />;
      case 'hardware':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'security':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'logic':
        return <Brain className="w-3.5 h-3.5" />;
      case 'custom':
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const handleApplyCustomAvatar = () => {
    const payload: AvatarSelectionPayload = {
      avatarId: `custom_${Date.now()}`,
      avatarEmoji: customEmoji || '🚀',
      color: customColor,
      glow: customGlow,
      label: customLabel.trim() || 'อวตารสร้างเอง (Custom)',
    };
    onSelectAvatar(payload);
  };

  const filteredAvatars = AVATAR_OPTIONS.filter((av) => av.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* 1. Category Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl text-xs font-semibold">
        {AVATAR_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-sm font-bold ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label.split(' ')[1] || cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Categorized Grid (for coding, hardware, security, logic) */}
      {activeCategory !== 'custom' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredAvatars.map((av) => {
              const isSelected = selectedAvatarId === av.id;
              return (
                <button
                  key={av.id}
                  type="button"
                  onClick={() =>
                    onSelectAvatar({
                      avatarId: av.id,
                      avatarEmoji: av.emoji,
                      color: av.color,
                      glow: av.glow,
                      label: av.label,
                    })
                  }
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all relative overflow-hidden ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${av.color} text-white flex items-center justify-center text-2xl shadow-sm shrink-0`}
                  >
                    {av.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {av.label}
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                      {av.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Custom Avatar Creator (สร้างอวตารของฉันเอง) */}
      {activeCategory === 'custom' && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-slate-50 border border-indigo-200 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>ห้องปฏิบัติการสร้างอวตารของฉันเอง (Custom Avatar Creator)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                เลือกสัญลักษณ์คอมพิวเตอร์ที่ชื่นชอบ สีพื้นหลัง และฉายาประจำตัว เพื่อสร้างอวตารที่ไม่ซ้ำใคร
              </p>
            </div>

            {/* Live Preview Card */}
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-indigo-100 shadow-sm self-start sm:self-auto shrink-0">
              <div
                className={`w-12 h-12 rounded-2xl ${customColor} text-white flex items-center justify-center text-2xl shadow-md ${customGlow} ring-2 ring-white`}
              >
                {customEmoji}
              </div>
              <div className="text-xs pr-2">
                <div className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                  ตัวอย่างพรีวิว
                </div>
                <div className="font-bold text-slate-900 truncate max-w-[130px]">
                  {customLabel || 'อวตารของฉัน'}
                </div>
              </div>
            </div>
          </div>

          {/* Emoji Selection Grid & Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-indigo-600" />
                <span>เลือกสัญลักษณ์อิโมจิ (Emoji) หรือพิมพ์สัญลักษณ์ที่ต้องการ</span>
              </label>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">พิมพ์อิโมจิเอง:</span>
                <input
                  type="text"
                  maxLength={4}
                  value={customEmoji}
                  onChange={(e) => setCustomEmoji(e.target.value)}
                  className="w-12 px-2 py-1 bg-white border border-indigo-300 rounded-lg text-center text-base focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 p-2 bg-white rounded-xl border border-slate-200 max-h-[140px] overflow-y-auto">
              {CUSTOM_EMOJI_PRESETS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setCustomEmoji(em)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-transform ${
                    customEmoji === em
                      ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-110 shadow-xs'
                      : 'hover:bg-slate-100 hover:scale-105'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Color & Glow Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span>เลือกโทนสีพื้นหลังอวตาร (Background Theme)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CUSTOM_COLOR_PRESETS.map((col) => {
                const isSelected = customColor === col.bg;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      setCustomColor(col.bg);
                      setCustomGlow(col.glow);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-white ring-2 ring-indigo-500 shadow-sm font-bold text-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${col.bg} shadow-xs shrink-0`} />
                    <span>{col.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Avatar Label Input & Save Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-indigo-100">
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                ตั้งชื่อสัญลักษณ์ / ฉายาอวตารของคุณ:
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="เช่น วิศวกรซอฟต์แวร์รุ่นเยาว์, แฮกเกอร์สายขาว"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleApplyCustomAvatar}
              className="w-full sm:w-auto mt-auto sm:mt-5 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>ใช้อวตารที่สร้างเองนี้</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
