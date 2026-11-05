import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakThai, stopSpeech } from '../utils/thaiSpeech.ts';

interface AudioNarratorButtonProps {
  textToRead: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AudioNarratorButton: React.FC<AudioNarratorButtonProps> = ({
  textToRead,
  label = 'ฟังเสียงบรรยาย',
  size = 'sm',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (isPlaying) {
        stopSpeech();
      }
    };
  }, [isPlaying]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const ok = speakThai(textToRead, () => {
        setIsPlaying(false);
      });
      if (!ok) {
        setIsPlaying(false);
      }
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-4 py-2.5 gap-2.5',
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center rounded-xl font-medium transition-all shadow-sm cursor-pointer select-none ${
        isPlaying
          ? 'bg-rose-500 text-white animate-pulse hover:bg-rose-600 ring-2 ring-rose-300'
          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800'
      } ${sizeClasses[size]} ${className}`}
      title={isPlaying ? 'คลิกเพื่อหยุดเสียง' : 'คลิกเพื่อฟังเสียงอ่านบรรยายภาษาไทย'}
      aria-label={label}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-4 h-4 shrink-0 text-white animate-bounce" />
          <span className="font-semibold">{isPlaying ? 'กำลังอ่าน... (หยุด)' : label}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
