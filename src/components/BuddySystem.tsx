import React, { useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  Heart,
  Send,
  Flame,
  Trophy,
  Star,
  Bell,
  CheckCircle2,
  Shuffle,
  Zap,
  Award,
  ArrowRight,
  Smile,
  Activity,
  MessageSquareHeart,
  Clock,
  Radio,
  Share2,
} from 'lucide-react';
import {
  BuddyProfile,
  CheerReactionOption,
  CheerMessage,
  BuddyActivityLog,
  UserProfile,
} from '../types/index.ts';
import {
  BUDDY_CANDIDATES,
  CHEER_REACTIONS,
  INITIAL_CHEER_MESSAGES,
  INITIAL_BUDDY_ACTIVITIES,
} from '../data/learningData.ts';
import confetti from 'canvas-confetti';

interface BuddySystemProps {
  profile: UserProfile;
  addPoints: (amount: number, reason: string, category?: any) => void;
  onNavigateModule?: (moduleKey: string) => void;
}

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

export const BuddySystem: React.FC<BuddySystemProps> = ({
  profile,
  addPoints,
  onNavigateModule,
}) => {
  // Current active buddy state
  const [activeBuddyId, setActiveBuddyId] = useState<string>(() => {
    return localStorage.getItem('coderkids_active_buddy_id') || 'buddy_nicha';
  });

  // Cheer messages state
  const [cheerMessages, setCheerMessages] = useState<CheerMessage[]>(() => {
    const saved = localStorage.getItem('coderkids_cheer_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CHEER_MESSAGES;
  });

  // Buddy activity log state
  const [activities, setActivities] = useState<BuddyActivityLog[]>(() => {
    const saved = localStorage.getItem('coderkids_buddy_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BUDDY_ACTIVITIES;
  });

  // Active notification banner for buddy quest completion
  const [activeNotification, setActiveNotification] = useState<{
    id: string;
    buddyName: string;
    buddyEmoji: string;
    questTitle: string;
    points: number;
    timeAgo: string;
  } | null>(null);

  // Floating emojis animation state
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [customCheerText, setCustomCheerText] = useState('');
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [coopProgress, setCoopProgress] = useState({
    userChecked: true,
    buddyChecked: true,
    claimedBonus: false,
  });

  const activeBuddy =
    BUDDY_CANDIDATES.find((b) => b.id === activeBuddyId) || BUDDY_CANDIDATES[0];

  useEffect(() => {
    localStorage.setItem('coderkids_active_buddy_id', activeBuddyId);
  }, [activeBuddyId]);

  useEffect(() => {
    localStorage.setItem('coderkids_cheer_messages', JSON.stringify(cheerMessages));
  }, [cheerMessages]);

  useEffect(() => {
    localStorage.setItem('coderkids_buddy_activities', JSON.stringify(activities));
  }, [activities]);

  // Handle sending cheer reaction
  const handleSendCheer = (reaction: CheerReactionOption, customText?: string) => {
    const messageText = customText || `${reaction.label} ${reaction.description}`;
    
    // Add floating animation
    const newEmoji: FloatingEmoji = {
      id: `float_${Date.now()}_${Math.random()}`,
      emoji: reaction.emoji,
      x: 30 + Math.random() * 40,
      y: 70,
    };
    setFloatingEmojis((prev) => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 1800);

    // Fire minor confetti burst
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7, x: 0.5 },
      colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981'],
    });

    const newMsg: CheerMessage = {
      id: `msg_${Date.now()}`,
      fromName: profile.name.split(' ')[0] || 'เรา',
      fromEmoji: profile.avatarEmoji || '🐱',
      toName: activeBuddy.nickname,
      emoji: reaction.emoji,
      text: messageText,
      timestamp: 'เมื่อสักครู่',
      isFromUser: true,
      pointsBonus: 5,
    };

    setCheerMessages((prev) => [newMsg, ...prev]);
    setCustomCheerText('');

    // Award friendship points
    addPoints(5, `ส่งอิโมจิให้กำลังใจ ${activeBuddy.nickname} (${reaction.emoji})`, 'classroom');

    // Simulated buddy automated cheer reply after 1.5 seconds
    setTimeout(() => {
      const buddyReplies = [
        `ขอบคุณมากนะ ${profile.name.split(' ')[0]}! กำลังตั้งใจเขียนโค้ดอยู่พอดีเลย ✨`,
        `เย้! ได้รับพลังใจแล้ว เดี๋ยวจะรีบทำภารกิจให้สำเร็จนะ 🚀`,
        `ขอบคุณสำหรับกำลังใจนะเพื่อน! วันนี้มาพิชิต 100 แต้มไปด้วยกันนะ 💖`,
        `สุดยอดเลยเพื่อนรัก! มีอะไรติดขัดปรึกษากันได้เสมอนะ 💡`,
      ];
      const randomReply = buddyReplies[Math.floor(Math.random() * buddyReplies.length)];

      const buddyMsg: CheerMessage = {
        id: `msg_reply_${Date.now()}`,
        fromName: activeBuddy.nickname,
        fromEmoji: activeBuddy.avatarEmoji,
        toName: profile.name.split(' ')[0] || 'เรา',
        emoji: '💖',
        text: randomReply,
        timestamp: 'เมื่อสักครู่',
        isFromUser: false,
        pointsBonus: 5,
      };

      setCheerMessages((prev) => [buddyMsg, ...prev]);

      // Pop mini notification
      setActiveNotification({
        id: `notif_${Date.now()}`,
        buddyName: activeBuddy.nickname,
        buddyEmoji: activeBuddy.avatarEmoji,
        questTitle: `ส่งกำลังใจตอบกลับ: "${randomReply.slice(0, 32)}..."`,
        points: 5,
        timeAgo: 'เมื่อสักครู่',
      });
    }, 1600);
  };

  // Simulate Buddy Completing a Quest
  const handleSimulateBuddyQuest = () => {
    const questPool = [
      { title: 'พิชิตแบบทดสอบ PDPA และสิทธิส่วนบุคคล 5/5 ข้อ', category: 'ความปลอดภัยดิจิทัล & PDPA', pts: 15 },
      { title: 'สร้างบล็อกคำสั่งนับคะแนนเกมใน Scratch Studio สำเร็จ', category: 'Scratch Studio', pts: 20 },
      { title: 'เขียนโค้ดวัดระดับแสงแสดงผลไอคอนบนบอร์ด Micro:bit', category: 'Micro:bit Simulator', pts: 20 },
      { title: 'ผ่านด่านเขาวงกต Computational Thinking ระดับ 3', category: 'Algorithm Thinking', pts: 15 },
      { title: 'ทำภารกิจล่าบั๊กประจำวันสำเร็จอย่างรวดเร็ว (+15 EXP)', category: 'Daily Bug Hunter', pts: 15 },
    ];
    const picked = questPool[Math.floor(Math.random() * questPool.length)];

    // Trigger celebration confetti
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.4 },
    });

    const newAct: BuddyActivityLog = {
      id: `act_${Date.now()}`,
      buddyId: activeBuddy.id,
      buddyName: activeBuddy.nickname,
      buddyEmoji: activeBuddy.avatarEmoji,
      actionType: 'quest_complete',
      questTitle: picked.title,
      category: picked.category,
      pointsEarned: picked.pts,
      timestamp: 'เมื่อสักครู่',
      celebrated: false,
    };

    setActivities((prev) => [newAct, ...prev]);

    // Show Notification Toast Banner
    setActiveNotification({
      id: `notif_${Date.now()}`,
      buddyName: activeBuddy.nickname,
      buddyEmoji: activeBuddy.avatarEmoji,
      questTitle: picked.title,
      points: picked.pts,
      timeAgo: 'เมื่อสักครู่',
    });
  };

  // Claim shared co-op mission bonus
  const handleClaimCoopBonus = () => {
    if (coopProgress.claimedBonus) return;
    addPoints(20, 'รับโบนัสภารกิจคู่หูประจำวัน (Co-op Daily Mission)', 'classroom');
    setCoopProgress((prev) => ({ ...prev, claimedBonus: true }));
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Auto-Match Random Buddy
  const handleAutoMatch = () => {
    const others = BUDDY_CANDIDATES.filter((b) => b.id !== activeBuddyId);
    const randomBuddy = others[Math.floor(Math.random() * others.length)] || BUDDY_CANDIDATES[0];
    setActiveBuddyId(randomBuddy.id);
    setShowSwitchModal(false);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      
      {/* 1. Header Banner & Co-op Synergy Info */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-700/50">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>ระบบคู่หูเรียนรู้ Coder Buddy System</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-300">Co-learning Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>จับคู่เรียนรู้ &amp; ส่งพลังใจให้เพื่อน</span>
              <Sparkles className="w-6 h-6 text-amber-400 animate-bounce" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              ร่วมมือกับคู่หูในชั้นเรียน ติดตามความสำเร็จแบบเรียลไทม์ และส่งอิโมจิเชียร์อัพผ่านแผงควบคุมเพื่อรับแต้มมิตรภาพ (+5 แต้มต่อข้อความ)
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowSwitchModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-xs"
            >
              <Shuffle className="w-4 h-4 text-indigo-300" />
              <span>สลับ / เลือกคู่หูใหม่</span>
            </button>
            <button
              onClick={handleSimulateBuddyQuest}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-md"
              title="ทดสอบจำลองให้คู่หูทำภารกิจสำเร็จเพื่อดูการแจ้งเตือนสด"
            >
              <Zap className="w-4 h-4" />
              <span>จำลองเพื่อนทำเควสต์ (+EXP)</span>
            </button>
          </div>
        </div>

        {/* Floating Emojis Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingEmojis.map((item) => (
            <div
              key={item.id}
              className="absolute text-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000 transition-transform"
              style={{
                left: `${item.x}%`,
                bottom: `${item.y}%`,
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
              }}
            >
              {item.emoji}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Real-time Notification Banner (Alert when buddy completes a quest) */}
      {activeNotification && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg border border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
              {activeNotification.buddyEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-100">
                <Bell className="w-3.5 h-3.5" />
                <span>การแจ้งเตือนจากคู่หูการเรียนรู้</span>
                <span>•</span>
                <span>{activeNotification.timeAgo}</span>
              </div>
              <div className="text-sm font-black leading-tight text-white">
                🎉 ว้าว! {activeNotification.buddyName} {activeNotification.questTitle} (+{activeNotification.points} แต้ม)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => {
                const reaction = CHEER_REACTIONS.find((r) => r.id === 'cheer_star') || CHEER_REACTIONS[0];
                handleSendCheer(reaction, `สุดยอดมากเลย ${activeNotification.buddyName}! เก่งที่สุดในโลก ⭐🎉`);
                setActiveNotification(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-white text-amber-900 font-bold text-xs hover:bg-amber-50 active:scale-95 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>⭐ ส่งคำยินดีทันที (+5 แต้ม)</span>
            </button>
            <button
              onClick={() => setActiveNotification(null)}
              className="p-1.5 text-white/80 hover:text-white rounded-lg transition-colors cursor-pointer text-xs"
            >
              ✕ ปิด
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Grid: Active Buddy Card & Cheer Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Buddy Profile Card & Co-op Quest (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Buddy Detail Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>คู่หูปัจจุบันของคุณ</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{activeBuddy.statusText}</span>
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${activeBuddy.avatarBg || 'from-indigo-500 to-purple-600'} text-white flex items-center justify-center text-3xl shadow-md shrink-0 relative group`}>
                <span>{activeBuddy.avatarEmoji}</span>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-slate-900 text-white text-[10px] font-mono font-bold border border-white">
                  LV.{activeBuddy.level}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
                    {activeBuddy.name} ({activeBuddy.nickname})
                  </h3>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeBuddy.grade} • {activeBuddy.school}
                </div>
                
                {/* Stats row */}
                <div className="flex items-center gap-3 mt-3">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>{activeBuddy.points} แต้ม</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>สตรีค {activeBuddy.streakDays} วัน</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Current Activity Box */}
            <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-500" />
                <span>กิจกรรมล่าสุดของ {activeBuddy.nickname}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {activeBuddy.currentActivity}
              </p>
            </div>

            {/* Synergy & Co-op Level */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>พลังผูกพันคู่หู (Synergy Level)</span>
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  ระดับ {activeBuddy.synergyLevel}/5
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(activeBuddy.synergyLevel / 5) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                <span>โบนัสแต้มร่วมกัน: +{activeBuddy.synergyLevel * 5}%</span>
                <span>ความถนัด: {activeBuddy.favoriteTopic}</span>
              </div>
            </div>

            {/* Switch Buddy Button */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">ต้องการเปลี่ยนเพื่อนคู่หู?</span>
              <button
                onClick={() => setShowSwitchModal(true)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>เลือกเพื่อนคนอื่น</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Co-op Daily Mission Card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>ภารกิจคู่หูประจำวัน (Co-op Mission)</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                +20 แต้มพิเศษ
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mb-3">
              🎯 เช็คอินการเรียนรู้พร้อมกันทั้งสองคนในวันนี้ เพื่อรับโบนัสคู่หูพลังแห่งมิตรภาพ!
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <span className="flex items-center gap-2">
                  <span>{profile.avatarEmoji || '🐱'}</span>
                  <span>{profile.name.split(' ')[0]} (เรา) เช็คอินแล้ว</span>
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <span className="flex items-center gap-2">
                  <span>{activeBuddy.avatarEmoji}</span>
                  <span>{activeBuddy.nickname} เช็คอินแล้ว</span>
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>

            <button
              onClick={handleClaimCoopBonus}
              disabled={coopProgress.claimedBonus}
              className={`w-full mt-4 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                coopProgress.claimedBonus
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md active:scale-95 cursor-pointer'
              }`}
            >
              {coopProgress.claimedBonus ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>รับโบนัสคู่หู 20 แต้มไปแล้ววันนี้ 🎉</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>กดรับโบนัสคู่หู (+20 แต้ม)</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Cheer Control Panel & Live Cheer Wall (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Cheer Reaction Pad */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Smile className="w-5 h-5 text-indigo-500" />
                  <span>แผงควบคุมส่งอิโมจิให้กำลังใจ (Cheer Pad)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  คลิกอิโมจิด้านล่างเพื่อส่งเสียงเชียร์ไปยัง {activeBuddy.nickname} ได้ทันที (+5 แต้ม)
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                +5 แต้มมิตรภาพ
              </span>
            </div>

            {/* 8 Reaction Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CHEER_REACTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSendCheer(item)}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/60 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all text-center group cursor-pointer active:scale-95 shadow-xs hover:shadow-md"
                >
                  <div className="text-3xl sm:text-4xl group-hover:scale-125 transition-transform duration-200">
                    {item.emoji}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 leading-tight">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {item.description}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Cheer Input */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={customCheerText}
                onChange={(e) => setCustomCheerText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customCheerText.trim()) {
                    const defaultReaction = CHEER_REACTIONS[0];
                    handleSendCheer(defaultReaction, customCheerText);
                  }
                }}
                placeholder={`พิมพ์ข้อความให้กำลังใจ ${activeBuddy.nickname} เช่น สู้ๆ นะเพื่อน...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => {
                  if (customCheerText.trim()) {
                    const defaultReaction = CHEER_REACTIONS[0];
                    handleSendCheer(defaultReaction, customCheerText);
                  }
                }}
                disabled={!customCheerText.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ส่งกำลังใจ</span>
              </button>
            </div>
          </div>

          {/* Live Cheer Wall & Activity Feed (Tabs) */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-pink-500" />
                <span>กระดานส่งกำลังใจ &amp; บันทึกกิจกรรมคู่หู</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {cheerMessages.length} ข้อความ
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cheerMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl flex items-start gap-3 transition-all ${
                    msg.isFromUser
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 ml-6'
                      : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 mr-6'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-lg shadow-xs shrink-0">
                    {msg.fromEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {msg.fromName} {msg.isFromUser ? '(เรา)' : ''}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{msg.timestamp}</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-2">
                      <span className="text-base">{msg.emoji}</span>
                      <span className="font-medium">{msg.text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buddy Quest Activity Stream */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>ความสำเร็จล่าสุดของเพื่อนๆ ในห้อง</span>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {activities.slice(0, 3).map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg">{act.buddyEmoji}</span>
                      <div className="truncate">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{act.buddyName}</span>
                        <span className="text-slate-500 dark:text-slate-400"> {act.questTitle}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-[10px] font-bold font-mono shrink-0">
                      +{act.pointsEarned} แต้ม
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 4. Buddy Selection / Switcher Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span>เลือกเพื่อนคู่หูการเรียนรู้ (Choose Your Buddy)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  เลือกเพื่อนจากในชั้นเรียนเพื่อเรียนรู้และให้กำลังใจกันตลอดเทอม
                </p>
              </div>
              <button
                onClick={() => setShowSwitchModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Auto Match Button */}
            <button
              onClick={handleAutoMatch}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-sm cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span>สุ่มจับคู่เพื่อนอัตโนมัติ (AI Smart Match)</span>
            </button>

            {/* List of Candidates */}
            <div className="space-y-3 pt-1">
              {BUDDY_CANDIDATES.map((buddy) => {
                const isSelected = buddy.id === activeBuddyId;
                return (
                  <div
                    key={buddy.id}
                    onClick={() => {
                      setActiveBuddyId(buddy.id);
                      setShowSwitchModal(false);
                      confetti({ particleCount: 30, spread: 50 });
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500'
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${buddy.avatarBg || 'from-indigo-500 to-purple-500'} text-white flex items-center justify-center text-2xl shadow-xs shrink-0`}>
                        {buddy.avatarEmoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {buddy.name} ({buddy.nickname})
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono">
                            LV.{buddy.level}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          ความถนัด: {buddy.favoriteTopic}
                        </div>
                        <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                          {buddy.points} แต้ม • สตรีค {buddy.streakDays} วัน
                        </div>
                      </div>
                    </div>

                    <button
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {isSelected ? 'กำลังจับคู่' : 'เลือกเป็นคู่หู'}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// Compact Dashboard Widget Version for Embedding directly on Dashboard
interface BuddyDashboardWidgetProps {
  onOpenBuddyFull: () => void;
  addPoints: (amount: number, reason: string, category?: any) => void;
}

export const BuddyDashboardWidget: React.FC<BuddyDashboardWidgetProps> = ({
  onOpenBuddyFull,
  addPoints,
}) => {
  const [activeBuddyId] = useState<string>(() => {
    return localStorage.getItem('coderkids_active_buddy_id') || 'buddy_nicha';
  });

  const [cheeredCount, setCheeredCount] = useState(0);

  const activeBuddy =
    BUDDY_CANDIDATES.find((b) => b.id === activeBuddyId) || BUDDY_CANDIDATES[0];

  const handleQuickCheer = (emoji: string) => {
    setCheeredCount((prev) => prev + 1);
    addPoints(5, `ส่งอิโมจิ ${emoji} ให้ ${activeBuddy.nickname}`, 'classroom');
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.8 },
    });
  };

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-pink-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-200/90 dark:border-indigo-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
              คู่หูการเรียนรู้ (Buddy System)
            </h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{activeBuddy.statusText}</span>
            </span>
          </div>
        </div>

        <button
          onClick={onOpenBuddyFull}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>เปิดแผงควบคุม</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Buddy snippet */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${activeBuddy.avatarBg || 'from-indigo-500 to-purple-600'} text-white flex items-center justify-center text-xl shrink-0`}>
          {activeBuddy.avatarEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-black text-slate-900 dark:text-white truncate">
            {activeBuddy.name} ({activeBuddy.nickname})
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {activeBuddy.currentActivity}
          </div>
        </div>
      </div>

      {/* Quick Cheer Emojis Bar */}
      <div className="mt-3 flex items-center justify-between gap-1 pt-2 border-t border-indigo-100 dark:border-slate-800">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          ส่งกำลังใจด่วน:
        </span>
        <div className="flex items-center gap-1.5">
          {['🔥', '⭐', '🚀', '💖', '👏'].map((em) => (
            <button
              key={em}
              onClick={() => handleQuickCheer(em)}
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-base cursor-pointer shadow-xs"
              title={`ส่ง ${em} ให้ ${activeBuddy.nickname} (+5 แต้ม)`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
