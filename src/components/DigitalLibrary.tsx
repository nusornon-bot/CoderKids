import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  BookMarked,
  Bookmark,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Printer,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Award,
  Layers,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Cpu,
  Share2,
  GraduationCap,
  ArrowRight,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  FileText,
} from 'lucide-react';
import { DigitalBook, BookSection, DigitalBookCategory, ReadingProgressRecord, UserProfile } from '../types/index.ts';
import { DIGITAL_LIBRARY_BOOKS } from '../data/digitalLibraryData.ts';
import { soundEffects } from '../utils/soundEffects.ts';
import { DigitalLibrary3DView, HardwareModelType } from './DigitalLibrary3DView.tsx';

interface DigitalLibraryProps {
  profile: UserProfile;
  addPoints: (points: number, reason?: string, category?: 'safety' | 'thinking' | 'coding' | 'showcase' | 'classroom') => void;
  onNavigateModule?: (moduleKey: string) => void;
  initialMode?: 'books' | '3d';
}

export const DigitalLibrary: React.FC<DigitalLibraryProps> = ({
  profile,
  addPoints,
  onNavigateModule,
  initialMode = 'books',
}) => {
  // Top view mode: books or 3D Hardware Lab
  const [viewMode, setViewMode] = useState<'books' | '3d'>(initialMode);
  const [selected3DModel, setSelected3DModel] = useState<HardwareModelType>('microbit');

  // Category & search state
  const [selectedCategory, setSelectedCategory] = useState<DigitalBookCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected book for reader modal/view
  const [activeBook, setActiveBook] = useState<DigitalBook | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Reader customization state
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCheatsheetModal, setShowCheatsheetModal] = useState<DigitalBook | null>(null);

  // Persistent reading progress records
  const [readingProgress, setReadingProgress] = useState<Record<string, ReadingProgressRecord>>(() => {
    try {
      const saved = localStorage.getItem('coderkids_library_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('coderkids_library_progress', JSON.stringify(readingProgress));
    } catch {
      // Ignore write errors
    }
  }, [readingProgress]);

  // Stop speech when unmounting or changing section
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [activeBook, currentSectionIndex]);

  // Categories config
  const categories = [
    { id: 'all' as DigitalBookCategory, label: '📚 ทั้งหมด', count: DIGITAL_LIBRARY_BOOKS.length },
    { id: 'microbit_manual' as DigitalBookCategory, label: '🤖 คู่มือ Micro:bit', count: DIGITAL_LIBRARY_BOOKS.filter(b => b.category === 'microbit_manual').length },
    { id: 'ebook_cs' as DigitalBookCategory, label: '🧠 วิทยาการคำนวณ ป.4-6', count: DIGITAL_LIBRARY_BOOKS.filter(b => b.category === 'ebook_cs').length },
    { id: 'scratch_guide' as DigitalBookCategory, label: '🐱 คัมภีร์ Scratch', count: DIGITAL_LIBRARY_BOOKS.filter(b => b.category === 'scratch_guide').length },
    { id: 'cyber_pdpa' as DigitalBookCategory, label: '🛡️ พลเมืองดิจิทัล & PDPA', count: DIGITAL_LIBRARY_BOOKS.filter(b => b.category === 'cyber_pdpa').length },
    { id: 'unplugged' as DigitalBookCategory, label: '🧩 Unplugged Coding', count: DIGITAL_LIBRARY_BOOKS.filter(b => b.category === 'unplugged').length },
  ];

  // Filtered books
  const filteredBooks = useMemo(() => {
    return DIGITAL_LIBRARY_BOOKS.filter((book) => {
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.subtitle.toLowerCase().includes(q) ||
        book.synopsis.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.sections.some((sec) => sec.title.toLowerCase().includes(q) || sec.paragraphs.some(p => p.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Overall reading statistics
  const totalCompletedBooks = useMemo(() => {
    return Object.values(readingProgress).filter((p) => p.isCompleted).length;
  }, [readingProgress]);

  const totalSectionsRead = useMemo(() => {
    let count = 0;
    Object.values(readingProgress).forEach((rec) => {
      count += rec.completedSectionIds?.length || 0;
    });
    return count;
  }, [readingProgress]);

  // Handle open reader
  const handleOpenBook = (book: DigitalBook, startSectionIndex?: number) => {
    soundEffects.playClick();
    setActiveBook(book);
    const saved = readingProgress[book.id];
    if (startSectionIndex !== undefined) {
      setCurrentSectionIndex(startSectionIndex);
    } else if (saved && saved.currentSectionIndex < book.sections.length) {
      setCurrentSectionIndex(saved.currentSectionIndex);
    } else {
      setCurrentSectionIndex(0);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mark section as read
  const handleMarkSectionComplete = (book: DigitalBook, sectionId: string) => {
    soundEffects.playClick();
    setReadingProgress((prev) => {
      const existing = prev[book.id] || {
        bookId: book.id,
        currentSectionIndex: 0,
        completedSectionIds: [],
        isCompleted: false,
        lastReadAt: new Date().toISOString(),
        bookmarkedSections: [],
      };

      const completed = existing.completedSectionIds.includes(sectionId)
        ? existing.completedSectionIds
        : [...existing.completedSectionIds, sectionId];

      const isAllDone = completed.length >= book.sections.length;

      if (isAllDone && !existing.isCompleted) {
        soundEffects.playFanfare();
        addPoints(35, `อ่าน e-Book จบเล่ม: ${book.title}`, 'thinking');
      } else if (!existing.completedSectionIds.includes(sectionId)) {
        soundEffects.playSuccess();
        addPoints(10, `อ่านบทเรียน: ${book.sections[currentSectionIndex].title.slice(0, 30)}...`, 'thinking');
      }

      return {
        ...prev,
        [book.id]: {
          ...existing,
          completedSectionIds: completed,
          isCompleted: isAllDone,
          currentSectionIndex,
          lastReadAt: new Date().toISOString(),
        },
      };
    });
  };

  // Toggle bookmark for current section
  const handleToggleBookmark = (bookId: string, sectionId: string) => {
    soundEffects.playClick();
    setReadingProgress((prev) => {
      const existing = prev[bookId] || {
        bookId,
        currentSectionIndex: 0,
        completedSectionIds: [],
        isCompleted: false,
        lastReadAt: new Date().toISOString(),
        bookmarkedSections: [],
      };

      const bookmarks = existing.bookmarkedSections || [];
      const hasBookmark = bookmarks.includes(sectionId);
      const newBookmarks = hasBookmark
        ? bookmarks.filter((id) => id !== sectionId)
        : [...bookmarks, sectionId];

      return {
        ...prev,
        [bookId]: {
          ...existing,
          bookmarkedSections: newBookmarks,
        },
      };
    });
  };

  // TTS Voice narration
  const handleToggleTTS = (textToSpeak: string) => {
    if (isSpeaking) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    soundEffects.speakThai(textToSpeak);

    // Watch for speech completion
    const checkInterval = setInterval(() => {
      if (!window.speechSynthesis || !window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        clearInterval(checkInterval);
      }
    }, 500);
  };

  // Text size classes
  const getTextSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg leading-relaxed';
      case 'xlarge':
        return 'text-xl leading-loose';
      default:
        return 'text-base leading-normal';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ----------------- TOP HERO BANNER ----------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Digital Library &amp; Micro:bit Handbooks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>คลังสื่อการเรียนรู้อิเล็กทรอนิกส์</span>
              <span className="text-2xl">📖</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              รวบรวม e-Book สาระวิทยาการคำนวณ ป.4-6 ตามหลักสูตร สพฐ. (ว 4.2), คู่มือฉบับสมบูรณ์บอร์ด Micro:bit V2, คัมภีร์ Scratch 3.0, และใบความรู้แบบโต้ตอบพร้อมระบบอ่านออกเสียงภาษาไทย
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>มีหนังสือทั้งหมด {DIGITAL_LIBRARY_BOOKS.length} เล่ม</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>คุณอ่านจบแล้ว {totalCompletedBooks}/{DIGITAL_LIBRARY_BOOKS.length} เล่ม</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>สะสมบทเรียน {totalSectionsRead} ตอน</span>
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  setViewMode('books');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === 'books'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📚 คลังหนังสือ &amp; คู่มือ e-Book</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  setViewMode('3d');
                  setSelected3DModel('microbit');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-amber-300" />
                <span>🔬 ห้องทดลองโมเดลฮาร์ดแวร์ 3D</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-400/90 text-slate-900 font-extrabold animate-pulse">
                  ใหม่ 360°
                </span>
              </button>
            </div>
          </div>

          {/* Quick Action & Student Badge */}
          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0">
            <div className="text-right hidden md:block">
              <div className="text-xs text-slate-400">ผู้อ่าน: <span className="font-semibold text-white">{profile.name}</span></div>
              <div className="text-xs text-teal-300 font-mono">{profile.grade || 'ชั้น ป.5'} • {profile.school || 'โรงเรียนคุณภาพ สพฐ.'}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  setSelected3DModel('microbit');
                  setViewMode('3d');
                }}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Cpu className="w-4 h-4 text-amber-300" />
                <span>ส่องโมเดล 3D หมุนได้</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenBook(DIGITAL_LIBRARY_BOOKS[0])}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs shadow-lg hover:shadow-teal-500/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>เปิดคู่มือ Micro:bit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- RENDER 3D HARDWARE LAB OR BOOK READER/SHELF ----------------- */}
      {viewMode === '3d' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                soundEffects.play('click');
                setViewMode('books');
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>← กลับสู่ชั้นหนังสือ e-Book</span>
            </button>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-medium">ห้องทดลองโมเดลสามมิติเสมือนจริง (Interactive 3D Hardware Lab)</span>
            </div>
          </div>

          <DigitalLibrary3DView
            initialModel={selected3DModel}
            onNavigateCodingLab={() => onNavigateModule?.('codingLab')}
            onClose={() => setViewMode('books')}
          />
        </div>
      ) : activeBook ? (
        <div className="space-y-6">
          {/* Reader Top Navigation Bar */}
          <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveBook(null);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>กลับสู่ชั้นหนังสือ</span>
              </button>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
              <div className="hidden sm:block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                  {activeBook.categoryLabel}
                </span>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs md:max-w-md">
                  {activeBook.title}
                </h2>
              </div>
            </div>

            {/* Reader Controls: Font size, Audio TTS, Cheatsheet Print */}
            <div className="flex items-center gap-2">
              {/* Font size control */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-xs">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-1 rounded-lg transition-all font-semibold ${fontSize === 'normal' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                  title="ตัวอักษรขนาดปกติ"
                >
                  ก
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-1 rounded-lg transition-all font-bold ${fontSize === 'large' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                  title="ตัวอักษรขนาดใหญ่"
                >
                  ก+
                </button>
                <button
                  onClick={() => setFontSize('xlarge')}
                  className={`px-2 py-1 rounded-lg transition-all font-extrabold ${fontSize === 'xlarge' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                  title="ตัวอักษรขนาดใหญ่พิเศษ"
                >
                  ก++
                </button>
              </div>

              {/* TTS Voice Narration Button */}
              {activeBook.sections[currentSectionIndex] && (
                <button
                  onClick={() => {
                    const currentSec = activeBook.sections[currentSectionIndex];
                    const fullText = `${currentSec.title}. ${currentSec.paragraphs.join(' ')}. สรุปสำคัญ: ${currentSec.keyTakeaway || ''}`;
                    handleToggleTTS(fullText);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-rose-500 text-white animate-pulse shadow-md'
                      : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800'
                  }`}
                  title={isSpeaking ? 'คลิกเพื่อหยุดการอ่าน' : 'คลิกเพื่อให้ระบบอ่านออกเสียงภาษาไทย'}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? 'หยุดอ่าน' : 'อ่านให้ฟัง (AI Voice)'}</span>
                </button>
              )}

              {/* Bookmark Button */}
              {activeBook.sections[currentSectionIndex] && (
                <button
                  onClick={() => handleToggleBookmark(activeBook.id, activeBook.sections[currentSectionIndex].id)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    readingProgress[activeBook.id]?.bookmarkedSections?.includes(activeBook.sections[currentSectionIndex].id)
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400 border border-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title="คั่นหน้านี้ไว้"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              )}

              {/* Print / Cheatsheet button */}
              {activeBook.downloadableCheatsheet && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setShowCheatsheetModal(activeBook);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="พิมพ์ใบสรุปความรู้ (Cheatsheet A4)"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">ใบสรุป A4</span>
                </button>
              )}
            </div>
          </div>

          {/* Reader Main Layout: Table of Contents Sidebar + Reader Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Sidebar: Table of Contents */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-700 dark:text-slate-200">
                  <BookMarked className="w-4 h-4 text-teal-500" />
                  <span>สารบัญบทเรียน ({activeBook.sections.length} ตอน)</span>
                </div>
                {readingProgress[activeBook.id]?.isCompleted && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    <Check className="w-3 h-3" /> อ่านจบแล้ว
                  </span>
                )}
              </div>

              {/* Book Info Card in Sidebar */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                <div className="font-bold text-slate-800 dark:text-slate-100">{activeBook.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">ระดับ: {activeBook.level}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">ผู้เขียน: {activeBook.author}</div>
                <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">{activeBook.organization}</div>
              </div>

              {/* Section list */}
              <nav className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {activeBook.sections.map((sec, idx) => {
                  const isCurrent = currentSectionIndex === idx;
                  const isRead = readingProgress[activeBook.id]?.completedSectionIds?.includes(sec.id);
                  const isBookmarked = readingProgress[activeBook.id]?.bookmarkedSections?.includes(sec.id);

                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        soundEffects.playClick();
                        setCurrentSectionIndex(idx);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-teal-500 text-white font-bold shadow-sm'
                          : isRead
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                        isCurrent
                          ? 'bg-white text-teal-700'
                          : isRead
                          ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate leading-tight">{sec.title}</div>
                        {sec.subtitle && (
                          <div className={`text-[10px] truncate ${isCurrent ? 'text-teal-100' : 'text-slate-400'}`}>
                            {sec.subtitle}
                          </div>
                        )}
                      </div>
                      {isBookmarked && (
                        <Bookmark className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-amber-200' : 'text-amber-500'}`} />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Progress Bar in Sidebar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>ความก้าวหน้า</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {Math.round(((readingProgress[activeBook.id]?.completedSectionIds?.length || 0) / activeBook.sections.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300"
                    style={{
                      width: `${((readingProgress[activeBook.id]?.completedSectionIds?.length || 0) / activeBook.sections.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Reader Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {activeBook.sections[currentSectionIndex] && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                  {/* Header of Section */}
                  <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
                      <span>ตอนที่ {currentSectionIndex + 1} จาก {activeBook.sections.length}</span>
                      <span className="flex items-center gap-1 text-slate-400 font-normal">
                        <Clock className="w-3.5 h-3.5" /> เวลาอ่าน ~{Math.ceil(activeBook.readTimeMinutes / activeBook.sections.length)} นาที
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {activeBook.sections[currentSectionIndex].title}
                    </h2>
                    {activeBook.sections[currentSectionIndex].subtitle && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {activeBook.sections[currentSectionIndex].subtitle}
                      </p>
                    )}
                  </div>

                  {/* Body Paragraphs */}
                  <div className={`space-y-4 text-slate-700 dark:text-slate-300 ${getTextSizeClass()}`}>
                    {activeBook.sections[currentSectionIndex].paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="indent-6 sm:indent-8 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Visual Diagrams for specific types */}
                  {activeBook.sections[currentSectionIndex].diagramType === 'microbit_pinout' && (
                    <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-inner border border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                          <Cpu className="w-4 h-4" />
                          <span>แผนผังฮาร์ดแวร์ Micro:bit V2 Pinout Diagram</span>
                        </div>
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                          BBC micro:bit V2 Spec
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                          <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                            <span>🔘</span> ด้านหน้า: 5x5 LED Matrix
                          </div>
                          <p className="text-slate-400 text-[11px]">
                            ไฟ LED สีแดง 25 ดวง แสดงผลภาพ ตัวอักษร และทำหน้าที่เป็นตัววัดความเข้มแสง (Light Sensor)
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                          <div className="font-bold text-amber-300 flex items-center gap-1.5">
                            <span>⚡</span> ขาต่อ Edge Connector Pins
                          </div>
                          <p className="text-slate-400 text-[11px]">
                            Pin 0, 1, 2 (I/O อนาล็อก &amp; ดิจิทัล), 3V (จ่ายไฟบวก 3.3V) และ GND (สายดิน/ขั้วลบ)
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                          <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                            <span>🔊</span> เซ็นเซอร์ V2 ใหม่ล่าสุด
                          </div>
                          <p className="text-slate-400 text-[11px]">
                            ลำโพงในตัว (Speaker), ไมโครโฟน MEMS พร้อมไฟแสดงผล และเซ็นเซอร์สัมผัสรูปโลโก้สีทอง
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.play('click');
                            setSelected3DModel('microbit');
                            setViewMode('3d');
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-indigo-600 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                        >
                          <Cpu className="w-4 h-4 text-amber-300" />
                          <span>🔬 ส่องดูโมเดล 3D แบบหมุนได้ 360° (พร้อมจำลองกดปุ่ม A และแสดงผลไฟ LED)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {activeBook.sections[currentSectionIndex].diagramType === 'computational_thinking' && (
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                      <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        <span>แผนภาพ 4 เสาหลักการคิดเชิงคำนวณ (Computational Thinking)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 text-center">
                          <div className="text-xl mb-1">🔍</div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">1. การแบ่งย่อย</div>
                          <div className="text-[10px] text-slate-500">Decomposition</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 text-center">
                          <div className="text-xl mb-1">🧬</div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">2. การหารูปแบบ</div>
                          <div className="text-[10px] text-slate-500">Pattern</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 text-center">
                          <div className="text-xl mb-1">🎯</div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">3. การคิดเชิงนามธรรม</div>
                          <div className="text-[10px] text-slate-500">Abstraction</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 text-center">
                          <div className="text-xl mb-1">📋</div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">4. ออกแบบขั้นตอน</div>
                          <div className="text-[10px] text-slate-500">Algorithm</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeBook.sections[currentSectionIndex].diagramType === 'flowchart' && (
                    <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
                      <div className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>สัญลักษณ์ผังงานมาตรฐาน (Flowchart Symbols)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900">
                          <div className="font-bold text-amber-900 dark:text-amber-200">⭕ วงรี (Terminator)</div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400">จุดเริ่มต้น (Start) หรือ จุดสิ้นสุด (Stop)</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900">
                          <div className="font-bold text-amber-900 dark:text-amber-200">▭ สี่เหลี่ยมผืนผ้า (Process)</div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400">การคำนวณ หรือการกระทำทั่วไป</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900">
                          <div className="font-bold text-amber-900 dark:text-amber-200">◇ สี่เหลี่ยมข้าวหลามตัด (Decision)</div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400">การตัดสินใจ เงื่อนไข จริง/เท็จ</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeBook.sections[currentSectionIndex].diagramType === 'circuit_wiring' && (
                    <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-700">
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        <span>แผนภาพการต่อสายวงจรฮาร์ดแวร์ (Hardware Wiring)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-800 border border-red-500/30">
                          <span className="font-bold text-red-400">🔴 สายสีแดง (VCC / 3.3V)</span>
                          <p className="text-[11px] text-slate-400">จ่ายไฟเลี้ยงบวกจากขั้ว 3V ของ Micro:bit ไปยังเซ็นเซอร์</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800 border border-slate-600">
                          <span className="font-bold text-slate-300">⚫ สายสีดำ (GND / Ground)</span>
                          <p className="text-[11px] text-slate-400">สายกราวด์ต่อกลับขั้ว GND ให้ครบวงจรเสมอ</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800 border border-blue-500/30">
                          <span className="font-bold text-blue-400">🔵 สายสีน้ำเงิน/เหลือง (Signal)</span>
                          <p className="text-[11px] text-slate-400">ส่งค่าข้อมูลเข้า Pin 0 (อนาล็อก) หรือสั่งเปิด Relay ที่ Pin 1</p>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.play('click');
                            setSelected3DModel('ultrasonic');
                            setViewMode('3d');
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                        >
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                          <span>3D Ultrasonic (HC-SR04)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.play('click');
                            setSelected3DModel('servo');
                            setViewMode('3d');
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                        >
                          <Cpu className="w-3.5 h-3.5 text-amber-400" />
                          <span>3D SG90 เซอร์โว (หมุน 0-180°)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.play('click');
                            setSelected3DModel('soil');
                            setViewMode('3d');
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                        >
                          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                          <span>3D เซนเซอร์วัดความชื้นดิน</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Code snippet block if any */}
                  {activeBook.sections[currentSectionIndex].codeSnippet && (
                    <div className="rounded-2xl bg-slate-900 text-slate-100 overflow-hidden shadow-lg border border-slate-800">
                      <div className="px-4 py-2 bg-slate-800/90 text-xs font-mono text-slate-400 flex items-center justify-between">
                        <span>{activeBook.sections[currentSectionIndex].codeSnippet?.language}</span>
                        <span className="text-[11px] text-teal-400">ตัวอย่างโค้ดพร้อมใช้งาน</span>
                      </div>
                      <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-teal-300">
                        <code>{activeBook.sections[currentSectionIndex].codeSnippet?.code}</code>
                      </pre>
                      {activeBook.sections[currentSectionIndex].codeSnippet?.caption && (
                        <div className="px-4 py-2 bg-slate-950 text-[11px] text-slate-400 border-t border-slate-800">
                          💡 {activeBook.sections[currentSectionIndex].codeSnippet?.caption}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Key Takeaway Box */}
                  {activeBook.sections[currentSectionIndex].keyTakeaway && (
                    <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider mb-0.5">
                          สรุปสาระสำคัญ (Key Takeaway)
                        </div>
                        <div className="text-xs text-teal-800 dark:text-teal-300 font-medium">
                          {activeBook.sections[currentSectionIndex].keyTakeaway}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Callout box */}
                  {activeBook.sections[currentSectionIndex].callout && (
                    <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      activeBook.sections[currentSectionIndex].callout?.type === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-900 dark:text-amber-200'
                        : activeBook.sections[currentSectionIndex].callout?.type === 'pro_tip'
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 text-purple-900 dark:text-purple-200'
                        : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 text-blue-900 dark:text-blue-200'
                    }`}>
                      <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <strong className="block mb-0.5">
                          {activeBook.sections[currentSectionIndex].callout?.type === 'pro_tip' ? 'เคล็ดลับระดับโปร (Pro Tip):' :
                           activeBook.sections[currentSectionIndex].callout?.type === 'warning' ? 'ข้อควรระวังสำคัญ:' : 'รู้หรือไม่? (Did you know?):'}
                        </strong>
                        {activeBook.sections[currentSectionIndex].callout?.text}
                      </div>
                    </div>
                  )}

                  {/* Bottom Navigation Buttons */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        setCurrentSectionIndex((prev) => Math.max(0, prev - 1));
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      disabled={currentSectionIndex === 0}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>ตอนก่อนหน้า</span>
                    </button>

                    <button
                      onClick={() => handleMarkSectionComplete(activeBook, activeBook.sections[currentSectionIndex].id)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                        readingProgress[activeBook.id]?.completedSectionIds?.includes(activeBook.sections[currentSectionIndex].id)
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300'
                          : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {readingProgress[activeBook.id]?.completedSectionIds?.includes(activeBook.sections[currentSectionIndex].id)
                          ? 'อ่านตอนนี้สำเร็จแล้ว (+10 EXP)'
                          : 'ทำเครื่องหมายว่าอ่านจบตอนนี้ (+10 EXP)'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        if (currentSectionIndex < activeBook.sections.length - 1) {
                          setCurrentSectionIndex((prev) => prev + 1);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        } else {
                          // Already at last section
                          handleMarkSectionComplete(activeBook, activeBook.sections[currentSectionIndex].id);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>{currentSectionIndex < activeBook.sections.length - 1 ? 'ตอนถัดไป' : 'อ่านจบเล่มนี้'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ----------------- BOOKSHELF EXPLORER VIEW ----------------- */
        <div className="space-y-6">
          {/* Search & Category Filter Pills */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === cat.id ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหา e-Book, เซ็นเซอร์, บล็อกโค้ด..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Bookshelf Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const progress = readingProgress[book.id];
              const isCompleted = progress?.isCompleted;
              const readCount = progress?.completedSectionIds?.length || 0;
              const percent = Math.round((readCount / book.sections.length) * 100);

              return (
                <div
                  key={book.id}
                  className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
                >
                  {/* Book Spine / Cover Header */}
                  <div className={`p-6 bg-gradient-to-br ${book.coverGradient} text-white relative overflow-hidden min-h-[160px] flex flex-col justify-between`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
                    
                    <div className="flex items-start justify-between relative z-10">
                      <span className="px-2.5 py-1 rounded-lg bg-black/25 backdrop-blur-xs text-[11px] font-bold tracking-wide border border-white/20">
                        {book.categoryLabel}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/20">
                        {book.coverEmoji}
                      </div>
                    </div>

                    <div className="relative z-10 pt-4">
                      <div className="text-[11px] text-white/80 font-medium">{book.level}</div>
                      <h3 className="text-base font-black text-white leading-snug line-clamp-2 mt-0.5">
                        {book.title}
                      </h3>
                    </div>
                  </div>

                  {/* Book Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        {book.synopsis}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-teal-500" />
                          <span>{book.totalSections} บทเรียน</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>~{book.readTimeMinutes} นาที</span>
                        </span>
                      </div>
                    </div>

                    {/* Reading Progress Indicator */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">ความก้าวหน้า</span>
                        <span className={`font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {isCompleted ? '🎉 สำเร็จแล้ว' : `${percent}% (${readCount}/${book.sections.length})`}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-teal-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenBook(book)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{readCount > 0 ? 'อ่านต่อจากเดิม' : 'เริ่มอ่านเล่มนี้'}</span>
                      </button>

                      {book.category === 'microbit_manual' && (
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.play('click');
                            setSelected3DModel('microbit');
                            setViewMode('3d');
                          }}
                          className="px-3 py-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                          title="ส่องดูโมเดล 3D แบบหมุนได้ 360°"
                        >
                          <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>โมเดล 3D</span>
                        </button>
                      )}

                      {book.downloadableCheatsheet && (
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setShowCheatsheetModal(book);
                          }}
                          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                          title="พิมพ์สรุป Cheatsheet A4"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-4xl">🔍</div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">ไม่พบสื่อการเรียนรู้ที่ตรงกับคำค้น</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">ลองค้นหาด้วยคำอื่น เช่น Micro:bit, ป.6, Scratch หรือ PDPA</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                ล้างการค้นหา
              </button>
            </div>
          )}

          {/* Quick Learning Suite Cross-Links */}
          <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  ต้องการฝึกทดลองเขียนโค้ดและรันผลจริงคู่กับคู่มือ?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  สลับไปที่ห้องปฏิบัติการ Scratch &amp; Micro:bit Simulator เพื่อกดปุ่มและทดสอบเซ็นเซอร์เสมือนจริง
                </p>
              </div>
            </div>
            {onNavigateModule && (
              <button
                onClick={() => onNavigateModule('codingLab')}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                <span>เปิดห้องแล็บ Scratch &amp; Micro:bit</span>
                <ArrowRight className="w-4 h-4 text-teal-500" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ----------------- CHEATSHEET PRINT / VIEW MODAL (A4 PRINTABLE) ----------------- */}
      {showCheatsheetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 flex items-center justify-center">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {showCheatsheetModal.downloadableCheatsheet?.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    ใบสรุปความรู้ฉบับย่อมาตรฐาน A4 เหมาะสำหรับนักเรียนทบทวนและคุณครูพิมพ์แจก
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCheatsheetModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* A4 Sheet Preview */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4 font-sans text-xs">
              <div className="border-b border-slate-300 dark:border-slate-700 pb-3 flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-700 dark:text-slate-300">กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี</span>
                <span>มาตรฐาน ว 4.2</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">{showCheatsheetModal.title}</h4>
                <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">{showCheatsheetModal.organization}</div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">📌 สรุปประเด็นหัวใจสำคัญ:</div>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  {showCheatsheetModal.downloadableCheatsheet?.summaryPoints.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {pIdx + 1}
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between text-[11px] text-slate-400">
                <span>ชื่อนักเรียน: ................................................................</span>
                <span>ชั้น: ................ เลขที่: ................</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCheatsheetModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  window.print();
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>สั่งพิมพ์ (Print A4)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
