import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speechManager } from '../utils/speechUtils.ts';

interface AudioReaderButtonProps {
  textToRead: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioReaderButton: React.FC<AudioReaderButtonProps> = ({
  textToRead,
  label,
  className = '',
  size = 'md',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = speechManager.subscribe((speaking) => {
      if (!speaking) {
        setIsPlaying(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      speechManager.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speechManager.speak(textToRead);
    }
  };

  const sizeClasses = {
    sm: 'p-1 text-xs gap-1',
    md: 'p-1.5 text-xs gap-1.5',
    lg: 'px-2.5 py-1.5 text-sm gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5',
  }[size];

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isPlaying ? 'หยุดอ่านเสียง' : 'กดฟังเสียงอ่านโจทย์ภาษาไทย (Assistive Audio)'}
      aria-label={isPlaying ? 'หยุดอ่านเสียง' : 'อ่านออกเสียงข้อความ'}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all ${sizeClasses} ${
        isPlaying
          ? 'bg-amber-500 text-white animate-pulse shadow-md ring-2 ring-amber-300'
          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 border border-indigo-200'
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <VolumeX className={`${iconSizes} animate-bounce`} />
          {label && <span>กำลังอ่าน...</span>}
        </>
      ) : (
        <>
          <Volume2 className={iconSizes} />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
