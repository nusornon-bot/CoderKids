import React, { useState } from 'react';
import { RewardItem, PointTransaction, UserProfile } from '../types/index.ts';
import { REWARD_STORE_ITEMS } from '../data/learningData.ts';
import { Sparkles, ShoppingBag, History, Check, ArrowRight, Lock, Gift, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PointsRewardCenterProps {
  points: number;
  transactions: PointTransaction[];
  profile: UserProfile;
  onSpendPoints: (amount: number, description: string, rewardId: string) => boolean;
  onSelectTitle: (title: string) => void;
}

export const PointsRewardCenter: React.FC<PointsRewardCenterProps> = ({
  points,
  transactions,
  profile,
  onSpendPoints,
  onSelectTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'history'>('store');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const userLevel = Math.max(1, Math.floor(points / 75) + 1);
  const nextLevelPoints = userLevel * 75;

  const handleRedeem = (item: RewardItem) => {
    if (profile.unlockedRewardIds.includes(item.id)) {
      if (item.category === 'title') {
        onSelectTitle(item.title.replace('ฉายา: ', ''));
        setFeedbackMsg({ text: `ติดตั้ง ${item.title} ในโปรไฟล์เรียบร้อยแล้ว`, type: 'success' });
      }
      return;
    }

    if (points < item.cost) {
      setFeedbackMsg({ text: `แต้มสะสมไม่เพียงพอ (ต้องการ ${item.cost} แต้ม ขาดอีก ${item.cost - points} แต้ม)`, type: 'error' });
      return;
    }

    const success = onSpendPoints(item.cost, `แลกรางวัล: ${item.title}`, item.id);
    if (success) {
      setFeedbackMsg({ text: `แลกซื้อ ${item.title} สำเร็จแล้ว!`, type: 'success' });
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Top Banner with Point Economy */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-700 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold">
              <Coins className="w-3.5 h-3.5" />
              <span>ระบบสะสมแต้มและรางวัลการเรียนรู้ (Points Economy)</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ศูนย์แลกรางวัล &amp; บัญชีแต้มสะสม
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 max-w-lg leading-relaxed">
              แต้มที่คุณได้รับจากการทำภารกิจและเขียนโปรแกรม นำมาแลกปลดล็อกฉายาสุดเท่ กรอบอวตาร และธีมไมโครบิตได้ที่นี่!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 text-center shrink-0 min-w-[160px]">
            <div className="text-xs text-amber-200 uppercase font-semibold">ยอดแต้มคงเหลือ</div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mt-1 tabular-nums">
              {points}
            </div>
            <div className="text-[11px] text-amber-200/80 mt-1">
              ระดับเลเวลปัจจุบัน: LV.{userLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium border flex items-center justify-between ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-sm text-xs font-semibold">
        <button
          onClick={() => setActiveTab('store')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'store'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>ร้านค้าแลกรางวัล</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'history'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>ประวัติการได้รับแต้ม</span>
        </button>
      </div>

      {/* Tab 1: Reward Store */}
      {activeTab === 'store' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>ไอเทมพิเศษสำหรับผู้เรียน ({REWARD_STORE_ITEMS.length} รายการ)</span>
            <span>แต้มที่ต้องใช้: 40 - 80 แต้ม</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REWARD_STORE_ITEMS.map((item) => {
              const isUnlocked = profile.unlockedRewardIds.includes(item.id);
              const isEquipped = profile.selectedTitle === item.title.replace('ฉายา: ', '');
              const canAfford = points >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-emerald-50/50 border-emerald-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {item.category === 'title' ? 'ฉายาพิเศษ' : item.category === 'avatar' ? 'กรอบอวตาร' : 'ธีมฮาร์ดแวร์'}
                      </span>
                      {isUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3" /> เป็นเจ้าของแล้ว
                        </span>
                      ) : (
                        <span className="font-mono font-bold text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md tabular-nums">
                          {item.cost} แต้ม
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.description}</p>

                    {/* Preview box */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs font-medium text-slate-700 mb-4">
                      ตัวอย่าง: <span className="font-bold text-indigo-700">{item.preview}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRedeem(item)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                      isUnlocked
                        ? isEquipped
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                        : canAfford
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    {isUnlocked
                      ? isEquipped
                        ? 'กำลังใช้งานอยู่ ✓'
                        : 'คลิกเพื่อติดตั้งฉายานี้'
                      : canAfford
                      ? `ปลดล็อก (${item.cost} แต้ม)`
                      : `แต้มไม่พอ (ขาดอีก ${item.cost - points} แต้ม)`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Point Transaction History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            บันทึกประวัติการรับ-ใช้แต้ม (Transaction Ledger)
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      tx.type === 'earn' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {tx.type === 'earn' ? '+' : '-'}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{tx.description}</div>
                    <div className="text-[11px] text-slate-400">{tx.timestamp}</div>
                  </div>
                </div>

                <div
                  className={`font-mono font-bold tabular-nums text-sm ${
                    tx.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {tx.type === 'earn' ? `+${tx.amount}` : `-${tx.amount}`} แต้ม
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
