import React, { useState } from 'react';
import { Download, CheckCircle2, Share2, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  if (isInstalled || justInstalled) {
    if (variant === 'full') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>ติดตั้งแอปบนอุปกรณ์นี้แล้ว</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) setJustInstalled(true);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback instruction for browsers without deferred prompt
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="ติดตั้ง Coder Kids เป็นแอปบนอุปกรณ์ (เล่นออฟไลน์ได้)"
        className={`group relative inline-flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 2xl:px-3.5 text-xs font-bold rounded-xl transition-all duration-200 shadow-sm shrink-0 ${
          variant === 'full'
            ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:scale-[1.02]'
        } ${className}`}
      >
        <Download className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
        <span className="hidden 2xl:inline">ติดตั้งแอป (PWA)</span>
        <span className="hidden 2xl:inline-block px-1.5 py-0.2 text-[10px] bg-white/20 rounded-md font-mono">
          Offline
        </span>
      </button>

      {/* iOS / Manual Install Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  วิธีติดตั้งแอป Coder Kids
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  สำหรับ iPad, iPhone, Android หรือคอมพิวเตอร์ห้องปฏิบัติการ
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  เปิดด้วยเบราว์เซอร์ <strong>Safari</strong> (iOS/iPadOS) หรือ <strong>Chrome / Edge</strong> (PC/Android)
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <p className="flex items-center gap-1.5 flex-wrap">
                  กดปุ่ม <strong>แชร์ (Share)</strong> <Share2 className="w-3.5 h-3.5 inline text-indigo-500" /> บนแถบเครื่องมือ
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  เลื่อนลงมาแล้วเลือกเมนู <strong>&ldquo;เพิ่มไปยังหน้าจอโฮม&rdquo; (Add to Home Screen)</strong>
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs">
              ⚡ <strong>ข้อดีเมื่อติดตั้ง:</strong> เข้าเรียนและทำภารกิจคิดโค้ดดิ้งได้ทันทีจากหน้าจอ โดยไม่ต้องพิมพ์ URL และทำงานต่อได้แม้อินเทอร์เน็ตในห้องเรียนติดขัด
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md transition"
            >
              เข้าใจแล้ว ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </>
  );
};
