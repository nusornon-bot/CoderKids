import React, { useState, useEffect } from 'react';
import {
  Eye,
  Type,
  Maximize2,
  Minimize2,
  Sliders,
  Sparkles,
  Contrast,
  X,
  Check,
  Volume2,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';

export type FontSizeOption = 'normal' | 'large' | 'xlarge';

interface AccessibilityControlsProps {
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  isFocusMode,
  onToggleFocusMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizeOption>(() => {
    return (localStorage.getItem('coderkids_fontsize') as FontSizeOption) || 'normal';
  });
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('coderkids_high_contrast') === 'true';
  });
  const [isAutoSpeech, setIsAutoSpeech] = useState<boolean>(() => {
    return localStorage.getItem('coderkids_auto_speech') === 'true';
  });

  // Global Auto Read-Aloud effect on hover
  useEffect(() => {
    localStorage.setItem('coderkids_auto_speech', String(isAutoSpeech));
    if (!isAutoSpeech) {
      soundEffects.stopSpeaking();
      return;
    }

    let timeout: NodeJS.Timeout;
    const handleMouseOver = (e: MouseEvent) => {
      clearTimeout(timeout);
      const target = (e.target as HTMLElement)?.closest('button, a, h1, h2, h3, h4, [data-speech], [role="button"]') as HTMLElement | null;
      if (target) {
        const textToRead = target.getAttribute('data-speech') || target.innerText || target.getAttribute('title') || target.getAttribute('aria-label');
        if (textToRead && textToRead.trim().length > 1 && textToRead.trim().length < 180) {
          timeout = setTimeout(() => {
            soundEffects.speakThai(textToRead.trim().slice(0, 150));
          }, 380);
        }
      }
    };

    const handleMouseOut = () => {
      clearTimeout(timeout);
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      soundEffects.stopSpeaking();
    };
  }, [isAutoSpeech]);

  // Apply font size class to document
  useEffect(() => {
    localStorage.setItem('coderkids_fontsize', fontSize);
    const root = document.documentElement;
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    if (fontSize === 'large') {
      root.classList.add('text-size-large');
      root.style.fontSize = '17px';
    } else if (fontSize === 'xlarge') {
      root.classList.add('text-size-xlarge');
      root.style.fontSize = '18.5px';
    } else {
      root.classList.add('text-size-normal');
      root.style.fontSize = '';
    }
  }, [fontSize]);

  // Apply high contrast class to document
  useEffect(() => {
    localStorage.setItem('coderkids_high_contrast', String(isHighContrast));
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  const handleSelectFontSize = (size: FontSizeOption) => {
    soundEffects.playClick();
    setFontSize(size);
  };

  const handleToggleContrast = () => {
    soundEffects.playClick();
    setIsHighContrast((prev) => !prev);
  };

  const handleToggleAutoSpeech = () => {
    soundEffects.playClick();
    setIsAutoSpeech((prev) => {
      const next = !prev;
      if (next) soundEffects.speakThai('เปิดโหมดอ่านออกเสียงอัตโนมัติแล้ว');
      return next;
    });
  };

  return (
    <div className="relative inline-block text-left">
      {/* Floating or Header Button */}
      <button
        onClick={() => {
          soundEffects.playClick();
          setIsOpen((prev) => !prev);
        }}
        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
        title="การเข้าถึงและการมองเห็น (Accessibility Tools)"
        aria-label="การเข้าถึงและการมองเห็น"
      >
        <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span className="hidden 2xl:inline">การเข้าถึง</span>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 space-y-4 animate-fadeIn text-left">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>เครื่องมืออำนวยความสะดวก</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1. Font Size Adjustment */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              ขนาดตัวอักษร (Font Size):
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleSelectFontSize('normal')}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  fontSize === 'normal'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                ปกติ (A)
              </button>
              <button
                onClick={() => handleSelectFontSize('large')}
                className={`py-1.5 px-2 rounded-xl text-sm font-bold transition-all ${
                  fontSize === 'large'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                ใหญ่ (A+)
              </button>
              <button
                onClick={() => handleSelectFontSize('xlarge')}
                className={`py-1.5 px-2 rounded-xl text-base font-bold transition-all ${
                  fontSize === 'xlarge'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                ใหญ่มาก (A++)
              </button>
            </div>
          </div>

          {/* 2. Focus Mode */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                {isFocusMode ? <Minimize2 className="w-3.5 h-3.5 text-indigo-600" /> : <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />}
                <span>โหมดสมาธิ (Focus Mode)</span>
              </div>
              <div className="text-[10px] text-slate-500">ซ่อนแถบเมนูที่ไม่จำเป็นขณะเรียน</div>
            </div>
            <button
              onClick={() => {
                soundEffects.playClick();
                onToggleFocusMode();
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isFocusMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  isFocusMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 3. High Contrast Mode */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Contrast className="w-3.5 h-3.5 text-amber-500" />
                <span>คอนทราสต์สูง (High Contrast)</span>
              </div>
              <div className="text-[10px] text-slate-500">เน้นเส้นขอบและตัวอักษรให้อ่านง่าย</div>
            </div>
            <button
              onClick={handleToggleContrast}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isHighContrast ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  isHighContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Auto Read-Aloud Accessibility Mode */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-500" />
                <span>อ่านออกเสียงอัตโนมัติ (Auto Voice)</span>
              </div>
              <div className="text-[10px] text-slate-500">อ่านหัวข้อ/โจทย์เมื่อชี้เมาส์ สำหรับเด็กประถม</div>
            </div>
            <button
              onClick={handleToggleAutoSpeech}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isAutoSpeech ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  isAutoSpeech ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
