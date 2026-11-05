import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  Printer,
  X,
  RotateCcw,
  Shield,
  Zap,
  Flame,
  Star,
  Layers,
  Crown,
  Heart,
  Eye,
  CheckCircle2,
  Gift,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';
import confetti from 'canvas-confetti';

interface CoderHeroCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

export interface HeroCard {
  id: string;
  name: string;
  thaiTitle: string;
  role: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  rarityColor: string;
  emoji: string;
  element: 'Logic' | 'Security' | 'Hardware' | 'Creativity';
  stats: {
    logic: number;
    security: number;
    hardware: number;
    creativity: number;
  };
  specialMove: string;
  description: string;
  curriculumConnection: string;
}

const HERO_CARDS: HeroCard[] = [
  {
    id: 'card_cat_coder',
    name: 'Cat Coder (ส้มซ่า)',
    thaiTitle: 'จอมเวทบล็อก Scratch',
    role: 'Creative Animator',
    rarity: 'Legendary',
    rarityColor: 'from-amber-400 via-pink-500 to-purple-600',
    emoji: '🐱',
    element: 'Creativity',
    stats: { logic: 88, security: 70, hardware: 65, creativity: 99 },
    specialMove: 'Infinite Loop Vortex (วอร์เท็กซ์วนลูปไร้สิ้นสุด)',
    description: 'แมวส้มผู้เชี่ยวชาญการต่อบล็อกคำสั่ง สามารถสร้างเกม แอนิเมชัน และวาดรูปเรขาคณิตได้ในพริบตา',
    curriculumConnection: 'ว 4.2 ป.4/2 และ ป.5/2 การเขียนโปรแกรมแบบบล็อก',
  },
  {
    id: 'card_pdpa_knight',
    name: 'PDPA Guardian (อัศวินข้อมูล)',
    thaiTitle: 'ผู้พิทักษ์ความลับไซเบอร์',
    role: 'Cyber Defender',
    rarity: 'Epic',
    rarityColor: 'from-emerald-400 via-teal-500 to-cyan-600',
    emoji: '🛡️',
    element: 'Security',
    stats: { logic: 82, security: 99, hardware: 55, creativity: 70 },
    specialMove: 'Two-Factor Aegis (โล่กำบังสองชั้น)',
    description: 'ปกป้องข้อมูลส่วนบุคคลอย่างรัดกุม รู้เท่าทันกลโกง Phishing และข่าวปลอม Deepfake ทุกรูปแบบ',
    curriculumConnection: 'ว 4.2 ป.4/4 และ ป.6/4 การใช้เทคโนโลยีสารสนเทศอย่างปลอดภัย',
  },
  {
    id: 'card_micro_titan',
    name: 'Micro:Titan (โกเลม IoT)',
    thaiTitle: 'ยักษ์ใหญ่จักรกลเซ็นเซอร์',
    role: 'Hardware Engineer',
    rarity: 'Legendary',
    rarityColor: 'from-cyan-400 via-blue-500 to-indigo-600',
    emoji: '📟',
    element: 'Hardware',
    stats: { logic: 85, security: 75, hardware: 99, creativity: 84 },
    specialMove: 'Analog Pin Thunder (สายฟ้าสัญญาณอะนาล็อก P0)',
    description: 'เชื่อมโยงโลกดิจิทัลกับธรรมชาติ ตรวจวัดอุณหภูมิ แสง และความชื้นในดินเพื่อสั่งงานปั๊มน้ำอัตโนมัติ',
    curriculumConnection: 'ว 4.2 ป.5/2 การแก้ปัญหาด้วยอุปกรณ์สมองกลฝังตัว',
  },
  {
    id: 'card_beaver_builder',
    name: 'Bebras Builder (บีเวอร์สถาปนิก)',
    thaiTitle: 'แชมป์เขื่อนการคิดคำนวณ',
    role: 'Decomposition Master',
    rarity: 'Rare',
    rarityColor: 'from-amber-500 to-orange-600',
    emoji: '🦫',
    element: 'Logic',
    stats: { logic: 95, security: 70, hardware: 80, creativity: 82 },
    specialMove: 'Pattern Extraction (สกัดแก่นสาระสำคัญ)',
    description: 'เชี่ยวชาญการแยกย่อยปัญหาใหญ่ให้กลายเป็นงานย่อย ออกแบบทางเดินรถไฟและแก้ปริศนาตรรกะ',
    curriculumConnection: 'ว 4.2 การคิดเชิงคำนวณมาตรฐานสากล Bebras',
  },
  {
    id: 'card_ai_prompt_commander',
    name: 'Prompt Commander (ผู้บัญชาการ AI)',
    thaiTitle: 'วิศวกรผสมคำสั่งปัญญาประดิษฐ์',
    role: 'AI Whisperer',
    rarity: 'Epic',
    rarityColor: 'from-purple-400 via-violet-500 to-pink-500',
    emoji: '🤖',
    element: 'Creativity',
    stats: { logic: 92, security: 90, hardware: 80, creativity: 96 },
    specialMove: '4-Block Formula (บทบัญญัติ 4 เสาสั่งงานโมเดล)',
    description: 'ผสาน Role + Task + Style + Constraint เพื่อชี้นำปัญญาประดิษฐ์ได้อย่างแม่นยำ ปลอดภัย และมีจริยธรรม',
    curriculumConnection: 'ว 4.2 ป.6/3 และ ป.6/4 จริยธรรมการใช้งานปัญญาประดิษฐ์',
  },
  {
    id: 'card_bug_hunter',
    name: 'Phantom Hunter (นินจาล่าบั๊ก)',
    thaiTitle: 'นักแกะรอยข้อผิดพลาด',
    role: 'Code Debugger',
    rarity: 'Rare',
    rarityColor: 'from-rose-500 to-red-600',
    emoji: '🐞',
    element: 'Logic',
    stats: { logic: 94, security: 88, hardware: 78, creativity: 75 },
    specialMove: 'Syntax Trace Strike (ผ่าจุดผิดพลาดบรรทัดโค้ด)',
    description: 'จับตาทุกเซมิโคลอนและลูปที่ไม่มีวันหยุด ซ่อมแซมโปรแกรมที่พังให้กลับมาทำงานได้อย่างสมบูรณ์',
    curriculumConnection: 'ว 4.2 ตรวจหาและแก้ไขข้อผิดพลาดของโปรแกรม (Debugging)',
  },
];

export const CoderHeroCardsModal: React.FC<CoderHeroCardsModalProps> = ({
  isOpen,
  onClose,
  studentName = 'กวินทร์ แสนดี',
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(HERO_CARDS[0].id);
  const [openedCards, setOpenedCards] = useState<string[]>(['card_cat_coder', 'card_pdpa_knight', 'card_micro_titan']);
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [newlyUnlockedCard, setNewlyUnlockedCard] = useState<HeroCard | null>(null);

  if (!isOpen) return null;

  const selectedCard = HERO_CARDS.find((c) => c.id === selectedCardId) || HERO_CARDS[0];

  const handleOpenPack = () => {
    setIsOpeningPack(true);
    soundEffects.play('tick');

    setTimeout(() => {
      // Find a card that isn't opened or pick random
      const unopened = HERO_CARDS.filter((c) => !openedCards.includes(c.id));
      const pool = unopened.length > 0 ? unopened : HERO_CARDS;
      const picked = pool[Math.floor(Math.random() * pool.length)];

      if (!openedCards.includes(picked.id)) {
        setOpenedCards((prev) => [...prev, picked.id]);
      }

      setNewlyUnlockedCard(picked);
      setSelectedCardId(picked.id);
      setIsOpeningPack(false);
      soundEffects.play('victory');
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }, 1500);
  };

  const handlePrintCards = () => {
    soundEffects.play('click');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-indigo-500/30 text-white shadow-2xl flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-pink-500 text-white shadow-lg">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black bg-gradient-to-r from-amber-300 via-pink-200 to-indigo-300 bg-clip-text text-transparent">
                  สมุดสะสมการ์ดพลังฮีโร่โค้ดดิ้ง (Coder Hero Cards) 🎴
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  สะสม {openedCards.length}/{HERO_CARDS.length} ใบ
                </span>
              </div>
              <p className="text-xs text-slate-400">
                การ์ดพลังฮีโร่สมรรถนะ ว 4.2 สพฐ. สะสม ปลดล็อกพลัง และสั่งพิมพ์เป็นกระดาษการ์ดเล่นจริง
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintCards}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
              title="พิมพ์การ์ดขนาด A4"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">พิมพ์ชุดการ์ด A4</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Pack Opening Banner */}
        <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-300 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>เจ้าของการ์ด: <strong>{studentName}</strong></span>
          </div>

          <button
            onClick={handleOpenPack}
            disabled={isOpeningPack}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <Gift className={`w-4 h-4 ${isOpeningPack ? 'animate-spin' : 'animate-bounce'}`} />
            <span>{isOpeningPack ? 'กำลังเปิดซองลุ้นการ์ด...' : 'เปิดซองลุ้นการ์ดใหม่! 🎁'}</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto max-h-[70vh]">
          {/* Left Column: Hero Card Showcase (3D Holographic view) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group w-full max-w-[320px]">
              {/* Card Holographic Frame */}
              <div
                className={`relative rounded-3xl p-1 bg-gradient-to-tr ${selectedCard.rarityColor} shadow-2xl shadow-indigo-500/20 transition-all duration-300 transform group-hover:scale-[1.02]`}
              >
                <div className="rounded-[22px] bg-slate-950 p-5 flex flex-col justify-between h-[450px] relative overflow-hidden border border-white/10">
                  {/* Holographic light reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-white border border-white/20">
                      {selectedCard.rarity}
                    </span>
                    <span className="text-xs font-bold text-cyan-300 font-mono">
                      ว 4.2 Hero
                    </span>
                  </div>

                  {/* Card Character Art Illustration Box */}
                  <div className="my-auto text-center space-y-2 z-10">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 border-2 border-white/20 mx-auto flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 transition-transform">
                      {selectedCard.emoji}
                    </div>
                    <h3 className="text-xl font-black text-white">{selectedCard.name}</h3>
                    <div className="text-xs text-amber-300 font-semibold">{selectedCard.thaiTitle}</div>
                  </div>

                  {/* Power Stats Matrix */}
                  <div className="space-y-2 z-10 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">🧠 Logic:</span>
                        <span className="font-mono font-bold text-cyan-300">{selectedCard.stats.logic}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">🛡️ Security:</span>
                        <span className="font-mono font-bold text-emerald-300">{selectedCard.stats.security}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">📟 Hardware:</span>
                        <span className="font-mono font-bold text-blue-300">{selectedCard.stats.hardware}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">🎨 Creative:</span>
                        <span className="font-mono font-bold text-pink-300">{selectedCard.stats.creativity}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[10px]">
                      <span className="font-bold text-amber-400">ท่าไม้ตาย:</span> {selectedCard.specialMove}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Album Collection Grid & Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>สมุดสะสมการ์ดทั้งหมด ({HERO_CARDS.length} แบบ)</span>
                </h4>
                <span className="text-xs text-slate-400">คลิกการ์ดเพื่อส่องดูพลัง</span>
              </div>

              {/* Grid of All Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {HERO_CARDS.map((card) => {
                  const isUnlocked = openedCards.includes(card.id);
                  const isSelected = selectedCardId === card.id;

                  return (
                    <div
                      key={card.id}
                      onClick={() => {
                        setSelectedCardId(card.id);
                        soundEffects.play('click');
                      }}
                      className={`p-3 rounded-2xl transition-all cursor-pointer border text-center flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                          : isUnlocked
                          ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-950/60 border-slate-800/40 opacity-50'
                      }`}
                    >
                      <div className="text-3xl mb-1.5">{isUnlocked ? card.emoji : '❓'}</div>
                      <div className="text-xs font-bold text-white truncate">
                        {isUnlocked ? card.name : 'การ์ดลึกลับ'}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {isUnlocked ? card.thaiTitle : 'รอการปลดล็อก'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Card Deep Dive */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" />
                <span>คำอธิบายตัวละคร &amp; การเชื่อมโยงหลักสูตร:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedCard.description}
              </p>
              <div className="pt-2 text-[11px] text-emerald-400 font-mono">
                🎯 สอดคล้องตัวชี้วัด: {selectedCard.curriculumConnection}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>💡 สะสมครบทุกใบเพื่อปลดล็อกฉายา "Card Master of CS"</span>
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
