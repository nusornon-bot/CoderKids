import React, { useEffect, useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Sparkles,
  Award,
  Star,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  ArrowRight,
  Flame,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';

export interface CelebrationEvent {
  id: string;
  type:
    | 'module_complete'
    | 'milestone_points'
    | 'badge_unlocked'
    | 'certificate_unlocked'
    | 'streak_milestone'
    | 'custom';
  title: string;
  subtitle: string;
  moduleKey?: 'safety' | 'thinking' | 'codingLab' | 'showcase' | 'all';
  moduleName?: string;
  pointsAwarded?: number;
  totalPoints?: number;
  badgeName?: string;
  badgeEmoji?: string;
  nextStepTitle?: string;
  nextStepModule?: string;
  nextStepSubSection?: string;
}

// ----------------- WEBAUDIO SYNTHESIZER CHIME -----------------
// Plays an uplifting major chord arpeggio (C5 - E5 - G5 - C6) using pure browser Web Audio API
export const playCelebrationSound = (muted: boolean = false) => {
  if (muted) return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Notes: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index === notes.length - 1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);

      gain.gain.setValueAtTime(0.001, now + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.18, now + index * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 0.65);
    });

    // Close audio context after sounds play to free resources
    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        // ignore
      }
    }, 1800);
  } catch {
    // Ignore audio autoplay restrictions if user hasn't interacted
  }
};

// ----------------- PARTICLE FIRE EFFECTS -----------------
export const fireConfetti = (type: 'burst' | 'stars' | 'fireworks' | 'school' = 'burst') => {
  if (typeof window === 'undefined') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  if (type === 'burst') {
    confetti({
      ...defaults,
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
    });
  } else if (type === 'stars') {
    confetti({
      ...defaults,
      particleCount: 50,
      spread: 100,
      shapes: ['star', 'circle'],
      colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#6366f1'],
    });
  } else if (type === 'fireworks') {
    const end = Date.now() + 1.2 * 1000;
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
      });
    }, 250);
  } else if (type === 'school') {
    // Left & Right celebratory cannons
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#4f46e5', '#10b981', '#f59e0b'],
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#4f46e5', '#10b981', '#f59e0b'],
    });
  }
};

// ----------------- MAIN COMPONENT PROPS -----------------
export interface ConfettiCelebrationProps {
  event: CelebrationEvent | null;
  onClose: () => void;
  onNavigate?: (moduleKey: string, subSection?: string) => void;
  profile?: UserProfile;
}

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  event,
  onClose,
  onNavigate,
  profile,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('coderkids_sound_muted') === 'true';
  });
  const [isClosing, setIsClosing] = useState(false);
  const audioPlayedRef = useRef(false);

  const toggleSound = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('coderkids_sound_muted', String(next));
      if (!next) {
        playCelebrationSound(false);
      }
      return next;
    });
  };

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  }, [onClose]);

  // Trigger celebration particles & audio chime when a new event occurs
  useEffect(() => {
    if (event) {
      audioPlayedRef.current = false;
      setIsClosing(false);

      // 1. Initial fire burst
      fireConfetti(event.type === 'certificate_unlocked' ? 'fireworks' : 'school');

      // 2. Secondary star sparkle
      const timer = setTimeout(() => {
        fireConfetti('stars');
      }, 350);

      // 3. Audio chime
      playCelebrationSound(isMuted);

      return () => clearTimeout(timer);
    }
  }, [event, isMuted]);

  if (!event) return null;

  const handleNextStep = () => {
    if (event.nextStepModule && onNavigate) {
      onNavigate(event.nextStepModule, event.nextStepSubSection);
    }
    handleClose();
  };

  // Icon & Theme selection based on event type
  const getEventBadge = () => {
    switch (event.type) {
      case 'certificate_unlocked':
        return {
          icon: <Award className="w-12 h-12 text-purple-600 animate-bounce" />,
          gradient: 'from-purple-500 via-indigo-600 to-amber-500',
          bgCircle: 'bg-purple-100 border-purple-300 text-purple-600',
          label: 'ปลดล็อกเกียรติบัตรสำเร็จ!',
        };
      case 'module_complete':
        return {
          icon: <Trophy className="w-12 h-12 text-amber-500 animate-bounce" />,
          gradient: 'from-amber-400 via-orange-500 to-emerald-500',
          bgCircle: 'bg-amber-100 border-amber-300 text-amber-600',
          label: 'จบโมดูลการเรียนรู้แล้ว!',
        };
      case 'milestone_points':
        return {
          icon: <Zap className="w-12 h-12 text-indigo-600 animate-bounce" />,
          gradient: 'from-indigo-500 via-sky-500 to-emerald-500',
          bgCircle: 'bg-indigo-100 border-indigo-300 text-indigo-600',
          label: 'พิชิตหมุดหมายคะแนนสะสม!',
        };
      case 'streak_milestone':
        return {
          icon: <Flame className="w-12 h-12 text-orange-500 animate-bounce" />,
          gradient: 'from-orange-500 via-amber-500 to-red-500',
          bgCircle: 'bg-orange-100 border-orange-300 text-orange-600',
          label: 'สถิติการเรียนรู้ต่อเนื่อง!',
        };
      case 'badge_unlocked':
      default:
        return {
          icon: <Star className="w-12 h-12 text-emerald-500 animate-bounce" />,
          gradient: 'from-emerald-400 via-indigo-600 to-sky-500',
          bgCircle: 'bg-emerald-100 border-emerald-300 text-emerald-600',
          label: 'ปลดล็อกเหรียญรางวัลใหม่!',
        };
    }
  };

  const badgeInfo = getEventBadge();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100 animate-fade-in'
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Top Decorative Confetti Ribbon Banner */}
        <div className={`h-3 w-full bg-gradient-to-r ${badgeInfo.gradient}`} />

        {/* Action Controls: Sound Toggle & Close */}
        <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? 'เปิดเสียงเอฟเฟกต์ (Unmute)' : 'ปิดเสียงเอฟเฟกต์ (Mute)'}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            aria-label={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 text-center space-y-5">
          {/* Animated Icon Container */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400/40 via-indigo-500/30 to-purple-500/40 blur-md animate-pulse" />
            <div
              className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center shadow-lg ${badgeInfo.bgCircle}`}
            >
              {event.badgeEmoji ? (
                <span className="text-5xl animate-bounce">{event.badgeEmoji}</span>
              ) : (
                badgeInfo.icon
              )}
            </div>
            {/* Sparkle Badges */}
            <div className="absolute -top-1 -right-1 p-1.5 bg-amber-400 text-white rounded-full shadow-md animate-spin" style={{ animationDuration: '6s' }}>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Milestone Badge Pill */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{badgeInfo.label}</span>
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {event.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              {event.subtitle}
            </p>
          </div>

          {/* Reward Points & Learner Profile Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            {event.pointsAwarded && event.pointsAwarded > 0 && (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-bold shadow-xs">
                <span className="text-base">🪙</span>
                <span>+{event.pointsAwarded} แต้มสะสม</span>
              </div>
            )}
            {profile && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium">
                <span className="text-base">{profile.avatarEmoji || '🐱'}</span>
                <span className="font-semibold">{profile.nickname || profile.name}</span>
              </div>
            )}
          </div>

          {/* Next Step / Action Button */}
          <div className="pt-3 space-y-2.5">
            {event.nextStepTitle ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-98"
              >
                <span>{event.nextStepTitle}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ยอดเยี่ยมมาก! ลุยต่อเลย</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                fireConfetti('burst');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <span>🎉 จุดพลุเฉลองอีกรอบ!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
