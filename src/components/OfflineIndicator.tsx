import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-amber-600/95 dark:bg-amber-600 text-white px-4 py-2.5 shadow-2xl backdrop-blur-md border border-amber-400/40 animate-bounce">
      <div className="p-1.5 rounded-full bg-white/20">
        <WifiOff className="w-4 h-4 text-white" />
      </div>
      <div className="text-xs">
        <p className="font-bold flex items-center gap-1.5">
          <span>โหมดออฟไลน์ (Offline Mode)</span>
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        </p>
        <p className="text-[11px] text-amber-100 flex items-center gap-1">
          <Database className="w-3 h-3 inline" /> ข้อมูลและบทเรียนถูกแคชไว้ในเครื่องเรียบร้อย เรียนต่อได้เลย!
        </p>
      </div>
    </div>
  );
};
