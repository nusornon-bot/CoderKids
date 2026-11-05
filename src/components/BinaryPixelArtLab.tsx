import React, { useState, useMemo } from 'react';
import {
  Grid,
  Binary,
  Sparkles,
  RefreshCw,
  Award,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Eye,
  Lock,
  Unlock,
  Volume2,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';
import { fireConfetti } from './ConfettiCelebration.tsx';

// 8x8 Template Presets
const PRESETS: Record<string, { name: string; icon: string; rows: number[] }> = {
  heart: {
    name: 'หัวใจรักโค้ดดิ้ง',
    icon: '❤️',
    rows: [
      0b01100110, // 0 1 1 0 0 1 1 0
      0b11111111, // 1 1 1 1 1 1 1 1
      0b11111111, // 1 1 1 1 1 1 1 1
      0b11111111, // 1 1 1 1 1 1 1 1
      0b01111110, // 0 1 1 1 1 1 1 0
      0b00111100, // 0 0 1 1 1 1 0 0
      0b00011000, // 0 0 0 1 1 0 0 0
      0b00000000, // 0 0 0 0 0 0 0 0
    ],
  },
  smiley: {
    name: 'หน้ายิ้มเบิกบาน',
    icon: '😊',
    rows: [
      0b00111100,
      0b01000010,
      0b10100101,
      0b10000001,
      0b10100101,
      0b10011001,
      0b01000010,
      0b00111100,
    ],
  },
  robot: {
    name: 'หุ่นยนต์เพื่อนรัก',
    icon: '🤖',
    rows: [
      0b00011000,
      0b00011000,
      0b01111110,
      0b11011011,
      0b11111111,
      0b01000010,
      0b01111110,
      0b01000010,
    ],
  },
  star: {
    name: 'ดวงดาวแห่งปัญญา',
    icon: '⭐',
    rows: [
      0b00011000,
      0b00011000,
      0b11111111,
      0b01111110,
      0b00111100,
      0b01100110,
      0b11000011,
      0b10000001,
    ],
  },
  alien: {
    name: 'เอเลี่ยนอวกาศ',
    icon: '👾',
    rows: [
      0b00100100,
      0b00011000,
      0b01111110,
      0b11011011,
      0b11111111,
      0b10111101,
      0b10100101,
      0b00111100,
    ],
  },
};

interface BinaryPixelArtLabProps {
  onBack?: () => void;
  addPoints?: (amount: number, reason: string, category?: any) => void;
  onCelebrate?: () => void;
}

export const BinaryPixelArtLab: React.FC<BinaryPixelArtLabProps> = ({
  onBack,
  addPoints,
  onCelebrate,
}) => {
  const [subMode, setSubMode] = useState<'pixelArt' | 'secretMessenger'>('pixelArt');

  // 8x8 Grid state (8 rows, each 8 bits: 0 or 1)
  const [grid, setGrid] = useState<number[][]>(() => {
    // Default to heart
    return PRESETS.heart.rows.map((r) => {
      return Array.from({ length: 8 }, (_, i) => (r >> (7 - i)) & 1);
    });
  });

  const [currentColor, setCurrentColor] = useState<string>('#6366f1'); // Indigo
  const [isCopied, setIsCopied] = useState(false);

  // Puzzle Challenge State
  const [isPuzzleMode, setIsPuzzleMode] = useState(false);
  const [targetPresetKey, setTargetPresetKey] = useState<string>('robot');
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  // Messenger State
  const [plainMessage, setPlainMessage] = useState('HELLO CODER');
  const [cipherShift, setCipherShift] = useState(3);
  const [decryptInput, setDecryptInput] = useState('');
  const [decryptSuccess, setDecryptSuccess] = useState<boolean | null>(null);

  // Toggle cell bit
  const handleToggleCell = (row: number, col: number) => {
    soundEffects.playClick();
    setGrid((prev) => {
      const next = prev.map((r, rIdx) => {
        if (rIdx !== row) return [...r];
        const newRow = [...r];
        newRow[col] = newRow[col] === 1 ? 0 : 1;
        return newRow;
      });

      // Check puzzle solve if in puzzle mode
      if (isPuzzleMode && !puzzleSolved) {
        const targetRows = PRESETS[targetPresetKey].rows;
        let matches = true;
        for (let r = 0; r < 8; r++) {
          let rowInt = 0;
          for (let c = 0; c < 8; c++) {
            rowInt = (rowInt << 1) | next[r][c];
          }
          if (rowInt !== targetRows[r]) {
            matches = false;
            break;
          }
        }
        if (matches) {
          setPuzzleSolved(true);
          soundEffects.playFanfare();
          fireConfetti('fireworks');
          if (addPoints) {
            addPoints(20, `แก้ปริศนาเลขฐานสอง Binary Pixel Art (${PRESETS[targetPresetKey].name}) สำเร็จ!`, 'thinking');
          }
          if (onCelebrate) {
            onCelebrate();
          }
        }
      }

      return next;
    });
  };

  // Load preset
  const handleLoadPreset = (key: string) => {
    soundEffects.playClick();
    const preset = PRESETS[key];
    if (!preset) return;
    const newGrid = preset.rows.map((r) => {
      return Array.from({ length: 8 }, (_, i) => (r >> (7 - i)) & 1);
    });
    setGrid(newGrid);
    setIsPuzzleMode(false);
    setPuzzleSolved(false);
  };

  // Clear grid
  const handleClearGrid = () => {
    soundEffects.playClick();
    setGrid(Array.from({ length: 8 }, () => Array(8).fill(0)));
    setIsPuzzleMode(false);
    setPuzzleSolved(false);
  };

  // Invert grid
  const handleInvertGrid = () => {
    soundEffects.playClick();
    setGrid((prev) => prev.map((r) => r.map((c) => (c === 1 ? 0 : 1))));
  };

  // Start puzzle challenge
  const handleStartPuzzle = () => {
    soundEffects.playClick();
    setIsPuzzleMode(true);
    setPuzzleSolved(false);
    setTargetPresetKey('robot');
    // Start with blank grid
    setGrid(Array.from({ length: 8 }, () => Array(8).fill(0)));
  };

  // Calculate row integers and binary string representation
  const rowStats = useMemo(() => {
    return grid.map((r) => {
      const binStr = r.join('');
      const intVal = parseInt(binStr, 2);
      const hexVal = '0x' + intVal.toString(16).toUpperCase().padStart(2, '0');
      return { binStr, intVal, hexVal };
    });
  }, [grid]);

  // Total active bits
  const activeBitsCount = useMemo(() => {
    return grid.reduce((acc, r) => acc + r.filter((b) => b === 1).length, 0);
  }, [grid]);

  // Copy Binary Array
  const handleCopyCode = () => {
    const code = `const pixelArt = [\n  ${rowStats.map((s) => s.hexVal).join(', ')}\n];`;
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    soundEffects.playClick();
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Convert plain text to ASCII, Binary, and Hex
  const textEncodings = useMemo(() => {
    const chars = plainMessage.split('');
    const binaryList: string[] = [];
    const hexList: string[] = [];
    const asciiList: number[] = [];

    chars.forEach((ch) => {
      const code = ch.charCodeAt(0);
      asciiList.push(code);
      binaryList.push(code.toString(2).padStart(8, '0'));
      hexList.push('0x' + code.toString(16).toUpperCase());
    });

    // Caesar cipher
    const ciphered = chars
      .map((ch) => {
        const code = ch.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + cipherShift) % 26) + 65);
        }
        if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + cipherShift) % 26) + 97);
        }
        return ch;
      })
      .join('');

    return {
      asciiList,
      binaryList,
      hexList,
      ciphered,
    };
  }, [plainMessage, cipherShift]);

  // Check Decrypt Mission
  // Mission: Decrypt "FRGH" with shift=3 -> "CODE"
  const handleCheckDecrypt = () => {
    soundEffects.playClick();
    if (decryptInput.trim().toUpperCase() === 'CODE') {
      setDecryptSuccess(true);
      soundEffects.playFanfare();
      fireConfetti('burst');
      if (addPoints) {
        addPoints(15, 'ถอดรหัสลับสายลับคอมพิวเตอร์ Caesar Cipher สำเร็จ!', 'safety');
      }
      if (onCelebrate) {
        onCelebrate();
      }
    } else {
      setDecryptSuccess(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
                <Binary className="w-3.5 h-3.5" />
                <span>Hands-on Mini Lab: Binary &amp; Data Encoding</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-emerald-200 border border-white/10">
                สาระวิทยาการคำนวณ ป.4-ป.6
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              ห้องแล็บพิกเซลเลขฐานสอง &amp; ถอดรหัสลับ ASCII
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
              ไขความลับว่าคอมพิวเตอร์แปลงข้อมูลตัวเลข 0 และ 1 (Bits &amp; Bytes) ให้กลายเป็นภาพกราฟิกสุดน่ารัก และข้อความลับเข้ารหัสได้อย่างไร
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>กลับสู่แดชบอร์ด</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Sub-mode Selector Switch */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              setSubMode('pixelArt');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subMode === 'pixelArt'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>1. Binary Pixel Art 8×8 (ถอดรหัสพิกเซล)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setSubMode('secretMessenger');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              subMode === 'secretMessenger'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>2. ASCII &amp; Cipher Messenger (สายลับรหัสลับ)</span>
          </button>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium px-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>เคล็ดลับ: 1 พิกเซล = 1 บิต, 8 พิกเซล = 1 ไบต์ (Byte)</span>
        </span>
      </div>

      {/* 3. Main Content based on subMode */}
      {subMode === 'pixelArt' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 8x8 Grid Canvas (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-md space-y-5">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">รูปทรงต้นแบบ:</span>
                {Object.entries(PRESETS).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => handleLoadPreset(key)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1"
                    title={p.name}
                  >
                    <span>{p.icon}</span>
                    <span className="hidden sm:inline">{p.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleInvertGrid}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
                  title="สลับค่า 0 เป็น 1 และ 1 เป็น 0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleClearGrid}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
                >
                  ล้างตาราง
                </button>
              </div>
            </div>

            {/* Puzzle Mode Banner */}
            {isPuzzleMode ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl animate-bounce">{PRESETS[targetPresetKey].icon}</div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
                      ภารกิจปริศนา: จำลองภาพ "{PRESETS[targetPresetKey].name}"
                    </h4>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300">
                      คลิกเปิดพิกเซล (1) ให้ตรงกับรหัสฐานสองด้านขวาเพื่อรับ <strong>+20 Coins</strong>!
                    </p>
                  </div>
                </div>

                {puzzleSolved ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>สำเร็จแล้ว! (+20 แต้ม)</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleLoadPreset(targetPresetKey)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-100 cursor-pointer"
                  >
                    ดูเฉลย
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-xs">
                <span className="text-indigo-950 dark:text-indigo-200">
                  💡 คลิกที่ช่องเพื่อสลับค่า <strong>0 (ปิด)</strong> และ <strong>1 (เปิด)</strong>
                </span>
                <button
                  onClick={handleStartPuzzle}
                  className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] hover:bg-indigo-700 cursor-pointer"
                >
                  เริ่มโหมดเกมปริศนา (+20 แต้ม)
                </button>
              </div>
            )}

            {/* 8x8 Interactive Grid */}
            <div className="flex justify-center p-3 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
              <div className="space-y-1.5">
                {grid.map((row, rIdx) => (
                  <div key={rIdx} className="flex items-center gap-1.5">
                    {/* Row index indicator */}
                    <span className="w-5 text-[10px] font-mono text-slate-500 text-right select-none">
                      R{rIdx + 1}
                    </span>

                    {/* 8 Bits */}
                    {row.map((bit, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => handleToggleCell(rIdx, cIdx)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-mono font-bold text-xs transition-all flex items-center justify-center cursor-pointer select-none active:scale-90 ${
                          bit === 1
                            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-100 ring-2 ring-emerald-300'
                            : 'bg-slate-900 text-slate-600 hover:bg-slate-800 hover:text-slate-400 border border-slate-800/80'
                        }`}
                        title={`แถว ${rIdx + 1}, คอลัมน์ ${cIdx + 1}: ค่า=${bit}`}
                      >
                        {bit}
                      </button>
                    ))}

                    {/* Hex summary per row */}
                    <span className="w-12 text-[10px] font-mono text-emerald-400 text-left pl-2 select-none">
                      {rowStats[rIdx].hexVal}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <span>พิกเซลที่เปิด: <strong className="text-emerald-600 dark:text-emerald-400">{activeBitsCount} / 64 บิต</strong></span>
                <span>ขนาดความจำ: <strong className="text-indigo-600 dark:text-indigo-400">8 Bytes (64 bits)</strong></span>
              </div>
              <button
                onClick={handleCopyCode}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'คัดลอก Array สำเร็จ' : 'คัดลอกโค้ด Hex Array'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Binary & Hex Stream Inspector (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Binary className="w-4 h-4 text-emerald-600" />
                  <span>การแปลงรหัสเลขฐานสอง (Row by Row)</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  8-Bit Decimal &amp; Hex
                </span>
              </div>

              {/* Row inspector list */}
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {rowStats.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs font-mono"
                  >
                    <span className="text-slate-400 w-8">R{idx + 1}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold tracking-wider">
                      {st.binStr}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 w-12 text-right">
                      {st.intVal}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-[11px]">
                      {st.hexVal}
                    </span>
                  </div>
                ))}
              </div>

              {/* Explanatory pedagogical card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-slate-800 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2 text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>วิธีคิดเลขฐานสองสู่ฐานสิบ (Binary to Decimal):</span>
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                  แต่ละหลักแทนค่าตามกำลังของ 2 จากขวาไปซ้าย:
                  <br />
                  <code className="bg-white/80 dark:bg-slate-900 px-1 py-0.5 rounded font-mono font-bold text-emerald-800 dark:text-emerald-300">
                    128 + 64 + 32 + 16 + 8 + 4 + 2 + 1
                  </code>
                  <br />
                  เช่น <code className="font-bold">00011000</code> คือ 16 + 8 = <strong>24</strong> นั่นเอง!
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SUBMODE 2: ASCII & SECRET CIPHER MESSENGER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Text Encoder (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-md space-y-5">
            <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-teal-600" />
                <span>เครื่องแปลงข้อความเป็นรหัสลับ ASCII &amp; Binary</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                พิมพ์ข้อความภาษาอังกฤษเพื่อดูว่าคอมพิวเตอร์แปลงตัวอักษรเป็นตัวเลข ASCII และเลขฐานสองอย่างไร
              </p>
            </div>

            {/* Input Form */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>ข้อความต้นฉบับ (Plain Text):</span>
                <span className="text-[11px] text-slate-400 font-normal">{plainMessage.length} ตัวอักษร</span>
              </label>
              <input
                type="text"
                value={plainMessage}
                onChange={(e) => setPlainMessage(e.target.value.slice(0, 30))}
                placeholder="พิมพ์ข้อความ เช่น HELLO CODER"
                className="w-full text-sm font-mono font-bold p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Caesar Cipher Slider */}
            <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-teal-900 dark:text-teal-200">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-teal-600" />
                  <span>การเลื่อนรหัสลับ Caesar Cipher: เลื่อน +{cipherShift} ตำแหน่ง</span>
                </span>
                <span className="font-mono text-teal-700 dark:text-teal-300 font-bold">Shift = {cipherShift}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={cipherShift}
                onChange={(e) => setCipherShift(parseInt(e.target.value, 10))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-teal-800 dark:text-teal-300">
                  ข้อความเข้ารหัสลับ (Ciphertext):
                </span>
                <span className="font-mono font-black text-sm text-teal-900 dark:text-teal-200 tracking-widest bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-teal-300 dark:border-teal-700">
                  {textEncodings.ciphered}
                </span>
              </div>
            </div>

            {/* Characters Table (Character -> ASCII -> Binary -> Hex) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                ตารางแจกแจงทีละตัวอักษร (Character Breakdown):
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                      <th className="py-2 px-2">ตัวอักษร</th>
                      <th className="py-2 px-2">รหัส ASCII</th>
                      <th className="py-2 px-2">เลขฐานสอง (8-Bit Binary)</th>
                      <th className="py-2 px-2">เลขฐาน 16 (Hex)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plainMessage.split('').map((ch, idx) => {
                      const code = ch.charCodeAt(0);
                      const bin = code.toString(2).padStart(8, '0');
                      const hex = '0x' + code.toString(16).toUpperCase();
                      return (
                        <tr
                          key={idx}
                          className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        >
                          <td className="py-2 px-2 font-black text-indigo-600 dark:text-indigo-400 text-sm">
                            '{ch}'
                          </td>
                          <td className="py-2 px-2 font-bold text-slate-800 dark:text-slate-200">
                            {code}
                          </td>
                          <td className="py-2 px-2 text-emerald-600 dark:text-emerald-400 font-bold">
                            {bin}
                          </td>
                          <td className="py-2 px-2 text-purple-600 dark:text-purple-400 font-bold">
                            {hex}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Spy Decryption Challenge (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl bg-slate-900 text-white border border-slate-800 p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-teal-500/20 text-teal-300">🕵️</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">ภารกิจสายลับ: ถอดรหัสลับ</h4>
                    <span className="text-[10px] text-teal-400">Cyber Agent Challenge</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  +15 แต้ม
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 block">ข้อความลับที่ดักจับได้ (Intercepted Cipher):</span>
                <div className="text-xl font-mono font-black text-amber-400 tracking-widest text-center py-2 bg-slate-900 rounded-xl border border-slate-800">
                  " F R G H "
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  💡 <strong>คำใบ้จากศูนย์บัญชาการ:</strong> ข้อความนี้ถูกเข้ารหัสด้วย Caesar Cipher ที่เลื่อนไปข้างหน้า 3 ตำแหน่ง (Shift = +3). ให้ถอยหลัง 3 ก้าวเพื่อหาคำศัพท์ภาษาอังกฤษที่มีความหมาย!
                </div>
              </div>

              {/* Decrypt Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  พิมพ์คำตอบที่คุณถอดรหัสได้:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={decryptInput}
                    onChange={(e) => setDecryptInput(e.target.value.toUpperCase())}
                    placeholder="ใส่คำตอบ เช่น CODE"
                    className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold uppercase text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={handleCheckDecrypt}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    ตรวจคำตอบ
                  </button>
                </div>
              </div>

              {/* Feedback State */}
              {decryptSuccess === true && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>🎉 ถูกต้องแล้ว! คำตอบคือ "CODE" คุณได้รับ +15 Coder Coins!</span>
                </div>
              )}
              {decryptSuccess === false && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-2">
                  <span>❌ ยังไม่ถูกต้องนะ ลองถอยหลังตัวอักษรทีละตัว เช่น F -&gt; E -&gt; D -&gt; C</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
