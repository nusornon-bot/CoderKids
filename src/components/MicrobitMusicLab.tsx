import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Music,
  Play,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Code2,
  Copy,
  Check,
  Award,
  Layers,
  Activity,
  Sliders,
  ChevronRight,
  Lightbulb,
  Radio,
  FileCode,
  ArrowRight,
  Maximize2,
  Info,
  Bookmark,
  Save,
  Trash2,
  Download,
  Upload,
  Plus,
  Star,
  Edit3,
  X,
  Library,
  Music2,
  FolderHeart,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/soundEffects.ts';

// -------------------------------------------------------------
// TYPES & CONSTANTS
// -------------------------------------------------------------

export type WaveformType = 'square' | 'sine' | 'triangle' | 'sawtooth';

export interface CustomMelody {
  id: string;
  name: string;
  nameEn?: string;
  category: 'tune' | 'sfx' | 'custom';
  bpm: number;
  waveform: WaveformType;
  description: string;
  steps: (string | null)[];
  createdAt: string;
  noteCount: number;
  author?: string;
}

export type LibraryCardItem = (
  | CustomMelody
  | (PresetMelody & {
      waveform?: WaveformType;
      createdAt?: string;
      noteCount?: number;
      author?: string;
    })
) & {
  isCustom: boolean;
};

export const INITIAL_CUSTOM_MELODIES: CustomMelody[] = [
  {
    id: 'custom_school_bell',
    name: 'ระฆังโรงเรียนเวียงพิงค์ (Westminster Chime)',
    nameEn: 'School Bell',
    category: 'custom',
    bpm: 120,
    waveform: 'square',
    description: 'เสียงกริ่งบอกเวลาเข้าแถวและเปลี่ยนคาบเรียน โน้ต Do-Mi-Sol-Do',
    steps: [
      'C4', null, 'E4', null,
      'G4', null, 'C5', null,
      'C5', null, 'G4', null,
      'E4', null, 'C4', null,
    ],
    createdAt: '2026-10-31T08:00:00.000Z',
    noteCount: 8,
    author: 'ครูนุสรณ์ & Coder Kids',
  },
  {
    id: 'custom_cyber_hero',
    name: 'นักสู้ไซเบอร์ 8-Bit (Cyber Hero Theme)',
    nameEn: 'Cyber Hero',
    category: 'custom',
    bpm: 170,
    waveform: 'square',
    description: 'ซาวด์แทร็กเกมอาร์เคดยุค 80s จังหวะเร้าใจ เหมาะกับเกมผจญภัย',
    steps: [
      'A4', 'C5', 'A4', 'E4',
      'G4', 'E4', 'G4', 'C5',
      'A4', 'C5', 'D5', 'E5',
      'D5', 'C5', 'A4', null,
    ],
    createdAt: '2026-10-31T09:30:00.000Z',
    noteCount: 15,
    author: 'ทีมนักประพันธ์ ป.5',
  },
];

export interface NoteDefinition {
  id: string;
  name: string;
  solfege: string;
  freq: number;
  isBlack?: boolean;
  keyboardKey: string;
  pyName: string;
}

export const MUSICAL_NOTES: NoteDefinition[] = [
  { id: 'C4', name: 'C4', solfege: 'โด', freq: 261.63, keyboardKey: 'A', pyName: 'c4' },
  { id: 'C#4', name: 'C#4', solfege: 'โด#', freq: 277.18, isBlack: true, keyboardKey: 'W', pyName: 'c#4' },
  { id: 'D4', name: 'D4', solfege: 'เร', freq: 293.66, keyboardKey: 'S', pyName: 'd4' },
  { id: 'D#4', name: 'D#4', solfege: 'เร#', freq: 311.13, isBlack: true, keyboardKey: 'E', pyName: 'd#4' },
  { id: 'E4', name: 'E4', solfege: 'มี', freq: 329.63, keyboardKey: 'D', pyName: 'e4' },
  { id: 'F4', name: 'F4', solfege: 'ฟา', freq: 349.23, keyboardKey: 'F', pyName: 'f4' },
  { id: 'F#4', name: 'F#4', solfege: 'ฟา#', freq: 369.99, isBlack: true, keyboardKey: 'T', pyName: 'f#4' },
  { id: 'G4', name: 'G4', solfege: 'ซอล', freq: 392.00, keyboardKey: 'G', pyName: 'g4' },
  { id: 'G#4', name: 'G#4', solfege: 'ซอล#', freq: 415.30, isBlack: true, keyboardKey: 'Y', pyName: 'g#4' },
  { id: 'A4', name: 'A4', solfege: 'ลา', freq: 440.00, keyboardKey: 'H', pyName: 'a4' },
  { id: 'A#4', name: 'A#4', solfege: 'ลา#', freq: 466.16, isBlack: true, keyboardKey: 'U', pyName: 'a#4' },
  { id: 'B4', name: 'B4', solfege: 'ที', freq: 493.88, keyboardKey: 'J', pyName: 'b4' },
  { id: 'C5', name: 'C5', solfege: 'โดสูง', freq: 523.25, keyboardKey: 'K', pyName: 'c5' },
  { id: 'C#5', name: 'C#5', solfege: 'โด#สูง', freq: 554.37, isBlack: true, keyboardKey: 'O', pyName: 'c#5' },
  { id: 'D5', name: 'D5', solfege: 'เรสูง', freq: 587.33, keyboardKey: 'L', pyName: 'd5' },
  { id: 'D#5', name: 'D#5', solfege: 'เร#สูง', freq: 622.25, isBlack: true, keyboardKey: 'P', pyName: 'd#5' },
  { id: 'E5', name: 'E5', solfege: 'มีสูง', freq: 659.25, keyboardKey: ';', pyName: 'e5' },
];

// Sequencer Pitch Rows (8 main diatonic pitches)
export const SEQUENCER_PITCHES = ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];

export interface PresetMelody {
  id: string;
  name: string;
  nameEn: string;
  category: 'tune' | 'sfx';
  bpm: number;
  description: string;
  // sequence of note IDs for 16 steps (null = rest)
  steps: (string | null)[];
}

export const PRESET_MELODIES: PresetMelody[] = [
  {
    id: 'ode_to_joy',
    name: 'เพลง Ode to Joy (Beethoven)',
    nameEn: 'Ode to Joy',
    category: 'tune',
    bpm: 120,
    description: 'ทำนองซิมโฟนีระดับโลกของเบโธเฟน ใช้เป็นทำนองมาตรฐานในบอร์ด Micro:bit',
    steps: [
      'E4', 'E4', 'F4', 'G4',
      'G4', 'F4', 'E4', 'D4',
      'C4', 'C4', 'D4', 'E4',
      'E4', 'D4', 'D4', null,
    ],
  },
  {
    id: 'birthday',
    name: 'สุขสันต์วันเกิด (Happy Birthday)',
    nameEn: 'Happy Birthday',
    category: 'tune',
    bpm: 125,
    description: 'เพลงวันเกิดยอดนิยมที่เด็กๆ คุ้นเคย โน้ตง่ายเหมาะแก่การเริ่มต้น',
    steps: [
      'C4', 'C4', 'D4', 'C4',
      'F4', 'E4', null, 'C4',
      'C4', 'D4', 'C4', 'G4',
      'F4', null, null, null,
    ],
  },
  {
    id: 'twinkle',
    name: 'ดวงดาวส่องแสง (Twinkle Twinkle)',
    nameEn: 'Twinkle Star',
    category: 'tune',
    bpm: 110,
    description: 'ทำนองเพลงคลาสสิกสำหรับเด็ก ฝึกฟังคู่เสียงขั้น 5 (C -> G)',
    steps: [
      'C4', 'C4', 'G4', 'G4',
      'A4', 'A4', 'G4', null,
      'F4', 'F4', 'E4', 'E4',
      'D4', 'D4', 'C4', null,
    ],
  },
  {
    id: 'ba_ding',
    name: 'กระดิ่งแจ้งเตือน (Ba-Ding)',
    nameEn: 'Ba-Ding Chime',
    category: 'sfx',
    bpm: 180,
    description: 'เสียงแจ้งเตือนสำเร็จยอดฮิตบน Micro:bit เมื่อส่งงานหรือชนะเกม',
    steps: [
      'B4', null, 'E5', null,
      null, null, null, null,
      'B4', null, 'E5', null,
      null, null, null, null,
    ],
  },
  {
    id: 'jump_up',
    name: 'เสียงกระโดดเกมเรโทร (Jump Up)',
    nameEn: 'Jump Up SFX',
    category: 'sfx',
    bpm: 190,
    description: 'เสียง Arpeggio พุ่งขึ้นแบบเกมมาริโอ เหมาะสำหรับเกมเก็บเหรียญ',
    steps: [
      'C4', 'E4', 'G4', 'C5',
      null, null, 'C4', 'E4',
      'G4', 'C5', null, null,
      'C4', 'E4', 'G4', 'C5',
    ],
  },
  {
    id: 'power_up',
    name: 'พลังอัปเกรด (Power Up Level)',
    nameEn: 'Power Up SFX',
    category: 'sfx',
    bpm: 175,
    description: 'เสียงฉลองเมื่อได้ไอเทมพิเศษหรือผ่านด่านในเกม Micro:bit',
    steps: [
      'C4', 'D4', 'E4', 'G4',
      'C5', null, 'E5', null,
      'G4', 'C5', 'E5', null,
      null, null, null, null,
    ],
  },
  {
    id: 'game_over',
    name: 'เกมโอเวอร์ (Game Over)',
    nameEn: 'Game Over Tune',
    category: 'sfx',
    bpm: 100,
    description: 'เสียงบันไดเสียงดิ่งลงอย่างช้าๆ เมื่อผู้เล่นแพ้หรือหมดเวลา',
    steps: [
      'C5', null, 'B4', null,
      'A4', null, 'G4', null,
      'F4', null, 'E4', null,
      'D4', null, 'C4', null,
    ],
  },
  {
    id: 'chase',
    name: 'วิ่งไล่ล่าตื่นเต้น (Speed Chase)',
    nameEn: 'Action Chase',
    category: 'tune',
    bpm: 160,
    description: 'ทำนองจังหวะเร็ว เร้าใจ เหมาะกับเกมขับรถหรือวิ่งหลบสิ่งกีดขวาง',
    steps: [
      'A4', 'A4', 'C5', 'A4',
      'G4', 'G4', 'A4', 'C5',
      'A4', 'A4', 'C5', 'A4',
      'E4', 'G4', 'A4', null,
    ],
  },
];

interface MicrobitMusicLabProps {
  onBack?: () => void;
  addPoints?: (points: number, reason?: string, category?: 'safety' | 'thinking' | 'coding' | 'showcase' | 'classroom') => void;
  onNavigateCodingLab?: () => void;
}

export const MicrobitMusicLab: React.FC<MicrobitMusicLabProps> = ({
  onBack,
  addPoints,
  onNavigateCodingLab,
}) => {
  // Web Audio Context & Nodes refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Synth state
  const [waveform, setWaveform] = useState<WaveformType>('square');
  const [bpm, setBpm] = useState<number>(120);
  const [volume, setVolume] = useState<number>(0.2);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeFrequency, setActiveFrequency] = useState<number | null>(null);
  const [activeNoteName, setActiveNoteName] = useState<string | null>(null);

  // Sequencer state: 16 steps (each can have a note string or null)
  const [sequence, setSequence] = useState<(string | null)[]>(PRESET_MELODIES[0].steps);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string>('ode_to_joy');

  // Visualization mode: waveform (Oscilloscope) or spectrum (FFT Bars)
  const [visMode, setVisMode] = useState<'waveform' | 'spectrum'>('waveform');

  // Code exporter state
  const [codeLanguage, setCodeLanguage] = useState<'makecode' | 'python'>('makecode');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Reactive 5x5 LED Matrix Display
  const [ledMatrix, setLedMatrix] = useState<boolean[][]>([
    [false, false, false, false, false],
    [false, true, false, true, false],
    [false, false, false, false, false],
    [true, false, false, false, true],
    [false, true, true, true, false],
  ]);

  // Quests / Challenges Completed State
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('coderkids_music_quests');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save quests to storage
  useEffect(() => {
    try {
      localStorage.setItem('coderkids_music_quests', JSON.stringify(completedQuests));
    } catch {
      // ignore
    }
  }, [completedQuests]);

  // Custom Melody Library State (Saved to localStorage)
  const [customMelodies, setCustomMelodies] = useState<CustomMelody[]>(() => {
    try {
      const saved = localStorage.getItem('coderkids_custom_music_library');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOM_MELODIES;
    } catch {
      return INITIAL_CUSTOM_MELODIES;
    }
  });

  // Save custom melodies to storage
  useEffect(() => {
    try {
      localStorage.setItem('coderkids_custom_music_library', JSON.stringify(customMelodies));
    } catch {
      // ignore
    }
  }, [customMelodies]);

  // Library Preset Filter Tab: 'all' | 'custom' | 'standard' | 'sfx'
  const [activePresetTab, setActivePresetTab] = useState<'all' | 'custom' | 'standard' | 'sfx'>('all');
  const [librarySearchQuery, setLibrarySearchQuery] = useState<string>('');
  const [librarySortBy, setLibrarySortBy] = useState<'default' | 'name' | 'bpm' | 'notes'>('default');

  // Save Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [saveName, setSaveName] = useState<string>('');
  const [saveDescription, setSaveDescription] = useState<string>('');
  const [saveCategory, setSaveCategory] = useState<'tune' | 'sfx' | 'custom'>('custom');
  const [saveAuthor, setSaveAuthor] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);

  // Helper to color-code notes in the mini piano roll
  const getNotePitchColor = (noteId: string | null) => {
    if (!noteId) return 'bg-slate-800/40';
    if (noteId.startsWith('C4')) return 'bg-teal-400';
    if (noteId.startsWith('D4')) return 'bg-sky-400';
    if (noteId.startsWith('E4')) return 'bg-cyan-400';
    if (noteId.startsWith('F4')) return 'bg-emerald-400';
    if (noteId.startsWith('G4')) return 'bg-green-400';
    if (noteId.startsWith('A4')) return 'bg-amber-400';
    if (noteId.startsWith('B4')) return 'bg-orange-400';
    if (noteId.startsWith('C5') || noteId.startsWith('D5') || noteId.startsWith('E5')) return 'bg-purple-400';
    return 'bg-pink-400';
  };

  // Helper for height of note in the mini piano roll
  const getNotePitchHeight = (noteId: string | null) => {
    if (!noteId) return '20%';
    const index = SEQUENCER_PITCHES.indexOf(noteId);
    if (index !== -1) {
      return `${Math.round(((7 - index) / 7) * 75 + 25)}%`;
    }
    return '50%';
  };

  // Duplicate / Clone a melody
  const handleDuplicateMelody = (item: CustomMelody | PresetMelody) => {
    soundEffects.play('click');
    const newId = `custom_${Date.now()}`;
    const duplicated: CustomMelody = {
      id: newId,
      name: `${item.name} (ฉบับคัดลอก)`,
      category: 'custom',
      bpm: item.bpm,
      waveform: 'waveform' in item && item.waveform ? item.waveform : 'square',
      description: `คัดลอกจาก ${item.name}`,
      steps: [...item.steps],
      createdAt: new Date().toISOString(),
      noteCount: item.steps.filter(Boolean).length,
      author: 'นักเรียน Coder Kids',
    };
    setCustomMelodies((prev) => [duplicated, ...prev]);
    setActivePresetId(newId);
    setSequence([...duplicated.steps]);
    setBpm(duplicated.bpm);
    if (duplicated.waveform) setWaveform(duplicated.waveform);
    setToastMessage(`คัดลอก "${item.name}" เข้าสู่คลังเพลงเรียบร้อย`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // New Blank Composition
  const handleNewComposition = () => {
    soundEffects.play('click');
    setIsPlaying(false);
    setCurrentStep(-1);
    setSequence(new Array(16).fill(null));
    setActivePresetId('');
    setToastMessage('เปิดกระดานแต่งเพลงใหม่เรียบร้อย');
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Combined library items for the Visual Library Panel
  const allLibraryItems: LibraryCardItem[] = useMemo(() => {
    const customItems: LibraryCardItem[] = customMelodies.map((m) => ({
      ...m,
      isCustom: true,
    }));
    const presetItems: LibraryCardItem[] = PRESET_MELODIES.map((p) => ({
      ...p,
      isCustom: false,
      waveform: 'square' as WaveformType,
      author: 'Micro:bit Official',
      noteCount: p.steps.filter(Boolean).length,
    }));

    let list: LibraryCardItem[] = [];
    if (activePresetTab === 'all') {
      list = [...customItems, ...presetItems];
    } else if (activePresetTab === 'custom') {
      list = customItems;
    } else if (activePresetTab === 'standard') {
      list = presetItems.filter((p) => p.category === 'tune');
    } else if (activePresetTab === 'sfx') {
      list = presetItems.filter((p) => p.category === 'sfx');
    }

    if (librarySearchQuery.trim()) {
      const q = librarySearchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.nameEn && item.nameEn.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.author && item.author.toLowerCase().includes(q))
      );
    }

    if (librarySortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (librarySortBy === 'bpm') {
      list = [...list].sort((a, b) => b.bpm - a.bpm);
    } else if (librarySortBy === 'notes') {
      list = [...list].sort((a, b) => {
        const countA = a.noteCount || a.steps.filter(Boolean).length;
        const countB = b.noteCount || b.steps.filter(Boolean).length;
        return countB - countA;
      });
    }

    return list;
  }, [customMelodies, activePresetTab, librarySearchQuery, librarySortBy]);

  // -------------------------------------------------------------
  // AUDIO CONTEXT INITIALIZATION
  // -------------------------------------------------------------
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.85;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);

      masterGain.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      masterGainRef.current = masterGain;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    return {
      ctx: audioCtxRef.current,
      analyser: analyserRef.current!,
      masterGain: masterGainRef.current!,
    };
  }, [isMuted, volume]);

  // Volume change effect
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume,
        audioCtxRef.current.currentTime
      );
    }
  }, [volume, isMuted]);

  // -------------------------------------------------------------
  // PLAY SINGLE TONE (KEYBOARD & SEQUENCER)
  // -------------------------------------------------------------
  const playTone = useCallback(
    (freq: number, durationSec: number = 0.25, noteLabel?: string) => {
      try {
        const { ctx, masterGain } = getAudioContext();
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = waveform;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const now = ctx.currentTime;
        // ADSR Envelope
        const attack = 0.015;
        const decay = 0.05;
        const sustain = 0.7;
        const release = 0.08;

        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(1, now + attack);
        noteGain.gain.linearRampToValueAtTime(sustain, now + attack + decay);

        const stopTime = Math.max(now + durationSec, now + attack + decay);
        noteGain.gain.setValueAtTime(sustain, stopTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, stopTime + release);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now);
        osc.stop(stopTime + release);

        // Update active note readout
        setActiveFrequency(Math.round(freq));
        if (noteLabel) setActiveNoteName(noteLabel);

        // Animate 5x5 LED Matrix Equalizer
        const normalized = Math.min(1, Math.max(0, (freq - 260) / 400));
        const barsHeight = Math.ceil(normalized * 5);
        setLedMatrix((prev) => {
          const next = prev.map((row, r) =>
            row.map((_, c) => {
              // Create dynamic wave / equalizer on 5x5 LED
              const distFromCenter = Math.abs(c - 2);
              const heightThreshold = Math.max(1, barsHeight - distFromCenter);
              return 4 - r < heightThreshold;
            })
          );
          return next;
        });

        // Clear frequency after note stops
        setTimeout(() => {
          setActiveFrequency((prev) => (prev === Math.round(freq) ? null : prev));
          setActiveNoteName((prev) => (prev === noteLabel ? null : prev));
        }, (durationSec + release) * 1000);
      } catch (e) {
        console.error('Audio playback error', e);
      }
    },
    [getAudioContext, waveform]
  );

  // Trigger Tone from Keyboard
  const handleKeyClick = (note: NoteDefinition) => {
    soundEffects.play('click');
    playTone(note.freq, 0.35, `${note.name} (${note.solfege})`);

    // Check Quest 1: Playing notes C4, E4, G4, C5 (School Bell)
    if (note.id === 'C5' && !completedQuests['quest_bell']) {
      // Checked dynamically or via sequencer
    }
  };

  // Keyboard listener for physical computer keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing when user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const key = e.key.toUpperCase();
      const matched = MUSICAL_NOTES.find((n) => n.keyboardKey === key);
      if (matched) {
        e.preventDefault();
        playTone(matched.freq, 0.3, `${matched.name} (${matched.solfege})`);
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playTone]);

  // -------------------------------------------------------------
  // CANVAS AUDIO VISUALIZER (OSCILLOSCOPE & FFT SPECTRUM)
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFrameId: number;

    const render = () => {
      localFrameId = requestAnimationFrame(render);
      const analyser = analyserRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 30) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Center baseline
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (!analyser || activeFrequency === null) {
        // Idle ambient gentle wave
        const time = Date.now() * 0.003;
        ctx.lineWidth = 2.5;
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, '#06b6d4');
        grad.addColorStop(0.5, '#10b981');
        grad.addColorStop(1, '#8b5cf6');
        ctx.strokeStyle = grad;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.02 + time) * 4 * Math.sin(x * 0.005);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        return;
      }

      if (visMode === 'waveform') {
        // TIME DOMAIN OSCILLOSCOPE
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 3.5;
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, '#22d3ee'); // cyan-400
        grad.addColorStop(0.3, '#34d399'); // emerald-400
        grad.addColorStop(0.7, '#fbbf24'); // amber-400
        grad.addColorStop(1, '#a855f7'); // purple-500
        ctx.strokeStyle = grad;
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        const sliceWidth = (width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      } else {
        // FREQUENCY SPECTRUM (FFT BARS)
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barCount = 48;
        const barWidth = (width / barCount) - 3;
        let x = 2;

        for (let i = 0; i < barCount; i++) {
          const sampleIndex = Math.floor((i / barCount) * (bufferLength * 0.6));
          const barHeight = ((dataArray[sampleIndex] || 0) / 255) * (height - 20);

          const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          grad.addColorStop(0, '#06b6d4');
          grad.addColorStop(0.7, '#10b981');
          grad.addColorStop(1, '#f59e0b');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight - 2, barWidth, barHeight + 2, [3, 3, 0, 0]);
          ctx.fill();

          x += barWidth + 3;
        }
      }
    };

    render();

    return () => {
      if (localFrameId) cancelAnimationFrame(localFrameId);
    };
  }, [visMode, activeFrequency]);

  // -------------------------------------------------------------
  // SEQUENCER PLAYBACK ENGINE
  // -------------------------------------------------------------
  const stepIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (stepIntervalRef.current) {
        clearInterval(stepIntervalRef.current);
        stepIntervalRef.current = null;
      }
      return;
    }

    // Calculate step interval based on BPM (16th notes: 4 steps per beat)
    const stepDurationMs = (60 / bpm / 4) * 1000;

    let stepCounter = currentStep >= 0 && currentStep < 15 ? currentStep : -1;

    stepIntervalRef.current = window.setInterval(() => {
      stepCounter = (stepCounter + 1) % 16;
      setCurrentStep(stepCounter);

      const noteId = sequence[stepCounter];
      if (noteId) {
        const noteDef = MUSICAL_NOTES.find((n) => n.id === noteId);
        if (noteDef) {
          playTone(noteDef.freq, (stepDurationMs * 0.8) / 1000, `${noteDef.name} (${noteDef.solfege})`);
        }
      }

      // Check Quest: Finished Happy Birthday sequence
      if (activePresetId === 'birthday' && stepCounter === 15 && !completedQuests['quest_birthday']) {
        triggerQuestComplete('quest_birthday', 'ทำนองวันเกิดสุขสันต์ (Happy Birthday)');
      }
    }, stepDurationMs);

    return () => {
      if (stepIntervalRef.current) {
        clearInterval(stepIntervalRef.current);
        stepIntervalRef.current = null;
      }
    };
  }, [isPlaying, bpm, sequence, playTone, currentStep, activePresetId, completedQuests]);

  // Toggle note in 16-step grid
  const handleToggleStepNote = (pitchId: string, stepIndex: number) => {
    soundEffects.play('click');
    setSequence((prev) => {
      const next = [...prev];
      if (next[stepIndex] === pitchId) {
        next[stepIndex] = null; // deselect
      } else {
        next[stepIndex] = pitchId; // select
        const noteDef = MUSICAL_NOTES.find((n) => n.id === pitchId);
        if (noteDef) {
          playTone(noteDef.freq, 0.2, `${noteDef.name} (${noteDef.solfege})`);
        }
      }

      // Check Quest 1: School chime sequence
      const nonNull = next.filter(Boolean);
      if (
        nonNull.length >= 4 &&
        nonNull.slice(0, 4).join(',') === 'C4,E4,G4,C5' &&
        !completedQuests['quest_bell']
      ) {
        triggerQuestComplete('quest_bell', 'เสียงระฆังโรงเรียน (C4-E4-G4-C5)');
      }

      return next;
    });
  };

  // Load Preset or Custom Melody into Sequencer
  const handleLoadPreset = (preset: PresetMelody | CustomMelody) => {
    soundEffects.play('click');
    setActivePresetId(preset.id);
    setBpm(preset.bpm);
    if ('waveform' in preset && preset.waveform) {
      setWaveform(preset.waveform);
    }
    setSequence([...preset.steps]);
    setCurrentStep(-1);
    setIsPlaying(true);
    setToastMessage(`โหลดทำนองเพลง "${preset.name}" สำเร็จ!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Open Save Modal
  const handleOpenSaveModal = () => {
    soundEffects.play('click');
    const noteCount = sequence.filter(Boolean).length;
    if (noteCount === 0) {
      setToastMessage('⚠️ กรุณาคลิกเลือกตัวโน้ตอย่างน้อย 1 ตัวในตารางก่อนบันทึก');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setSaveName(`ทำนองเพลงของฉัน #${customMelodies.length + 1}`);
    setSaveDescription('');
    setSaveCategory('custom');
    setSaveAuthor('นักเรียน Coder Kids');
    setIsSaveModalOpen(true);
  };

  // Save Custom Melody to Library
  const handleSaveCustomMelody = () => {
    soundEffects.play('click');
    const noteCount = sequence.filter(Boolean).length;
    if (noteCount === 0) return;

    const newId = `custom_${Date.now()}`;
    const newMelody: CustomMelody = {
      id: newId,
      name: saveName.trim() || `ทำนองเพลงของฉัน #${customMelodies.length + 1}`,
      category: saveCategory,
      bpm,
      waveform,
      description: saveDescription.trim() || `แต่งเมื่อ ${new Date().toLocaleDateString('th-TH')}`,
      steps: [...sequence],
      createdAt: new Date().toISOString(),
      noteCount,
      author: saveAuthor.trim() || 'นักเรียน Coder Kids',
    };

    setCustomMelodies((prev) => [newMelody, ...prev]);
    setActivePresetId(newId);
    setIsSaveModalOpen(false);

    // Check Quest: Custom Library Save
    if (!completedQuests['quest_custom_save']) {
      triggerQuestComplete('quest_custom_save', 'บันทึกเพลงลงคลังทำนองเพลงส่วนบุคคล');
    }

    soundEffects.playFanfare();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (addPoints) {
      addPoints(10, `บันทึกทำนองเพลง "${newMelody.name}" ลงคลังเพลงสำเร็จ`, 'coding');
    }

    setToastMessage(`🎉 บันทึก "${newMelody.name}" ลงในคลังเพลงเรียบร้อย (+10 EXP)`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Delete Custom Melody
  const handleDeleteCustomMelody = (id: string, name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEffects.play('click');
    if (window.confirm(`ต้องการลบเพลง "${name}" ออกจากคลังเพลงหรือไม่?`)) {
      setCustomMelodies((prev) => prev.filter((m) => m.id !== id));
      if (activePresetId === id) {
        setActivePresetId('');
      }
      setToastMessage(`ลบเพลง "${name}" เรียบร้อย`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  // Export Custom Library JSON
  const handleExportLibraryJSON = () => {
    soundEffects.play('click');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customMelodies, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `coderkids_music_library_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setToastMessage('📥 ส่งออกคลังเพลงเป็นไฟล์ JSON เรียบร้อย');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Import Custom Library JSON
  const handleImportLibraryJSON = () => {
    soundEffects.play('click');
    setImportError(null);
    try {
      const parsed = JSON.parse(importJsonText);
      const itemsToImport: CustomMelody[] = Array.isArray(parsed) ? parsed : [parsed];

      const validItems = itemsToImport.filter(
        (item) => item && typeof item.name === 'string' && Array.isArray(item.steps) && item.steps.length === 16
      );

      if (validItems.length === 0) {
        setImportError('รูปแบบไฟล์ไม่ถูกต้อง: ข้อมูลต้องเป็น Array ของเพลงที่มีตัวโน้ต 16 จังหวะ (steps: 16)');
        return;
      }

      setCustomMelodies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newItems = validItems.map((item) => ({
          ...item,
          id: existingIds.has(item.id) ? `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` : item.id,
          createdAt: item.createdAt || new Date().toISOString(),
          noteCount: item.steps.filter(Boolean).length,
        }));
        return [...newItems, ...prev];
      });

      setIsImportModalOpen(false);
      setImportJsonText('');
      soundEffects.playFanfare();
      setToastMessage(`🎉 นำเข้าทำนองเพลงสำเร็จ ${validItems.length} เพลง!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch {
      setImportError('ไม่สามารถแปลงข้อมูล JSON ได้ กรุณาตรวจสอบรูปแบบข้อความ');
    }
  };

  // Clear Grid
  const handleClearGrid = () => {
    soundEffects.play('click');
    setIsPlaying(false);
    setCurrentStep(-1);
    setSequence(new Array(16).fill(null));
  };

  // Randomize Melody
  const handleRandomize = () => {
    soundEffects.play('click');
    const randomSeq = Array.from({ length: 16 }, () => {
      if (Math.random() > 0.4) {
        const randPitch = SEQUENCER_PITCHES[Math.floor(Math.random() * SEQUENCER_PITCHES.length)];
        return randPitch;
      }
      return null;
    });
    setSequence(randomSeq);
    setCurrentStep(-1);
  };

  // Trigger Quest Completion
  const triggerQuestComplete = (questId: string, questTitle: string) => {
    setCompletedQuests((prev) => ({ ...prev, [questId]: true }));
    soundEffects.playFanfare();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    if (addPoints) {
      addPoints(15, `ผ่านภารกิจเสียงดนตรี: ${questTitle}`, 'coding');
    }
  };

  // Check Quest 2 (Jump SFX with Square wave & Tempo >= 160)
  useEffect(() => {
    if (waveform === 'square' && bpm >= 160 && isPlaying && !completedQuests['quest_jump']) {
      triggerQuestComplete('quest_jump', 'ซาวด์เอฟเฟกต์กระโดดเกมเรโทร (Square + BPM 160+)');
    }
  }, [waveform, bpm, isPlaying, completedQuests]);

  // -------------------------------------------------------------
  // CODE GENERATOR (MAKECODE & MICROPYTHON)
  // -------------------------------------------------------------
  const generatedMakeCode = React.useMemo(() => {
    const activeNotes = sequence
      .map((s, idx) => (s ? { note: s, step: idx } : null))
      .filter(Boolean) as { note: string; step: number }[];

    if (activeNotes.length === 0) {
      return `// กดเลือกโน้ตในตาราง Sequencer เพื่อสร้างโค้ดอัตโนมัติ
music.setVolume(127)
music.setTempo(${bpm})
music.playTone(Note.C, music.beat(BeatFraction.Quarter))`;
    }

    const lines = [
      `// โค้ดเสียงดนตรี Micro:bit V2 (MakeCode JavaScript)`,
      `music.setVolume(${Math.round(volume * 255)})`,
      `music.setTempo(${bpm})`,
      ``,
      `basic.forever(function () {`,
    ];

    activeNotes.forEach(({ note }) => {
      const cleanNote = note.replace('#', 'Sharp');
      lines.push(`    music.playTone(Note.${cleanNote}, music.beat(BeatFraction.Quarter))`);
      lines.push(`    basic.pause(50)`);
    });

    lines.push(`    basic.pause(1000) // พักจบห้องเพลง`);
    lines.push(`})`);

    return lines.join('\n');
  }, [sequence, bpm, volume]);

  const generatedPython = React.useMemo(() => {
    const activeNotes = sequence.filter(Boolean) as string[];

    if (activeNotes.length === 0) {
      return `# โค้ดเสียงดนตรี MicroPython (v2)
from microbit import *
import music

# กำหนดความเร็วและเล่นเสียง
music.set_tempo(ticks=4, bpm=${bpm})
music.play(['c4:4'])`;
    }

    const pyNotes = activeNotes
      .map((n) => {
        const def = MUSICAL_NOTES.find((m) => m.id === n);
        return `'${def?.pyName || 'c4'}:4'`;
      })
      .join(', ');

    return `# โค้ดเสียงดนตรี MicroPython (v2)
from microbit import *
import music

# กำหนดความเร็วห้องเพลง (BPM: ${bpm})
music.set_tempo(ticks=4, bpm=${bpm})

# รายการตัวโน้ตเพลงที่นักเรียนแต่ง
melody = [${pyNotes}]

# สั่งให้บอร์ด Micro:bit ส่งเสียงผ่านลำโพงในตัว V2 หรือ Pin 0
while True:
    display.show(Image.MUSIC_QUAVER)
    music.play(melody)
    sleep(1000)`;
  }, [sequence, bpm]);

  // Copy code handler
  const handleCopyCode = () => {
    soundEffects.play('click');
    const text = codeLanguage === 'makecode' ? generatedMakeCode : generatedPython;
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ----------------- TOP HERO HEADER ----------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-purple-900/50">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -top-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold">
              <Music className="w-3.5 h-3.5 text-pink-400" />
              <span>Micro:bit Web Audio Synthesizer &amp; Oscilloscope</span>
              <span className="px-1.5 py-0.2 rounded bg-pink-500/80 text-white font-mono text-[10px]">
                Web Audio API
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>ห้องแล็บประพันธ์เพลง Micro:bit Music Lab</span>
              <span className="text-2xl">🎵</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              ฝึกเขียนโปรแกรมสร้างเสียงดนตรี ซาวด์เอฟเฟกต์เกม และศึกษาฟิสิกส์ของคลื่นเสียง (Waveform &amp; Frequency) ผ่านลำโพงจำลองของบอร์ด Micro:bit V2 พร้อมนำโค้ดไปรันบนบอร์ดจริงได้ทันที!
            </p>

            {/* Quick stats & features badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>แสดงคลื่นเสียง Oscilloscope Real-time</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>16-Step Melody Sequencer</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>ส่งออก MakeCode &amp; Python</span>
              </span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-center gap-3 shrink-0">
            {onBack && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  onBack();
                }}
                className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>← ย้อนกลับ</span>
              </button>
            )}
            {onNavigateCodingLab && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  onNavigateCodingLab();
                }}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs shadow-lg hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Code2 className="w-4 h-4" />
                <span>ไปทดลองใน Coding Lab</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ----------------- TOP INTERACTIVE WORKBENCH: VISUALIZER + VIRTUAL MICRO:BIT ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Real-time Oscilloscope Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>กราฟิกคลื่นเสียงแบบเรียลไทม์ (Audio Oscilloscope)</span>
              </h3>
            </div>

            {/* Visualizer Mode Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  setVisMode('waveform');
                }}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  visMode === 'waveform' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                คลื่นเสียง (Waveform)
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  setVisMode('spectrum');
                }}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  visMode === 'spectrum' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                สเปกตรัมความถี่ (FFT Bars)
              </button>
            </div>
          </div>

          {/* Canvas Element */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-inner">
            <canvas
              ref={canvasRef}
              width={720}
              height={180}
              className="w-full h-44 block bg-slate-950"
            />

            {/* Live readout badge overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-md">
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>
                  {activeFrequency ? `${activeFrequency} Hz` : 'พร้อมส่งเสียง (Standby)'}
                </span>
                {activeNoteName && (
                  <span className="text-amber-400 font-bold border-l border-slate-700 pl-1.5 ml-1">
                    {activeNoteName}
                  </span>
                )}
              </span>
            </div>

            {/* Waveform indicator */}
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                {waveform === 'square'
                  ? 'คลื่นสี่เหลี่ยม (Buzzer 8-bit)'
                  : waveform === 'sine'
                  ? 'คลื่นไซน์ (Sine Wave)'
                  : waveform === 'triangle'
                  ? 'คลื่นสามเหลี่ยม (Triangle)'
                  : 'คลื่นฟันเลื่อย (Sawtooth)'}
              </span>
            </div>
          </div>

          {/* Synth Control Sliders & Waveform Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1 text-xs">
            {/* Waveform selector */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium block">รูปแบบคลื่นเสียง (Waveform):</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['square', 'sine', 'triangle', 'sawtooth'] as WaveformType[]).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      soundEffects.play('click');
                      setWaveform(w);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer capitalize ${
                      waveform === w
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {w === 'square' ? 'Square 8-bit' : w}
                  </button>
                ))}
              </div>
            </div>

            {/* Tempo (BPM) Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 font-medium">ความเร็ว (Tempo):</label>
                <span className="font-mono font-bold text-teal-400 text-xs">{bpm} BPM</span>
              </div>
              <input
                type="range"
                min={60}
                max={240}
                step={5}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>ช้า (60)</span>
                <span>ปกติ (120)</span>
                <span>เร็ว (240)</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 font-medium">ระดับเสียง (Volume):</label>
                <button
                  type="button"
                  onClick={() => setIsMuted((m) => !m)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-bold text-[11px]"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-teal-400" />}
                  <span>{isMuted ? 'ปิดเสียง' : `${Math.round(volume * 100)}%`}</span>
                </button>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                จำลองระดับเสียงบอร์ด Micro:bit V2 Built-in Speaker
              </div>
            </div>
          </div>
        </div>

        {/* Right: Virtual Micro:bit V2 Reactive Speaker & LED Matrix (4 Cols) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-slate-900 to-indigo-950 rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                Micro:bit V2 Sound Reactor
              </span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-mono">
                Pin 0 / Speaker
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">หน้าจอแสดงผล 5×5 LED เต้นตามจังหวะเสียง</h4>
          </div>

          {/* Micro:bit Chassis Visual */}
          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-indigo-900/60 shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* Top Logo & Mic */}
            <div className="w-full flex items-center justify-between px-2 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-300 shadow-xs" />
                <span className="text-[10px] font-extrabold text-amber-300">TOUCH LOGO</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>MIC</span>
              </div>
            </div>

            {/* 5x5 LED Grid */}
            <div className="grid grid-cols-5 gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
              {ledMatrix.map((row, r) =>
                row.map((on, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`w-4 h-4 rounded-full transition-all duration-75 ${
                      on
                        ? 'bg-rose-500 shadow-md shadow-rose-500/80 scale-110'
                        : 'bg-slate-800/80 border border-slate-700/40'
                    }`}
                  />
                ))
              )}
            </div>

            {/* Buttons A and B simulation */}
            <div className="w-full flex items-center justify-between px-2 mt-3 pt-2 border-t border-slate-900">
              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  playTone(440, 0.3, 'A4 (ปุ่ม A)');
                }}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-black text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-md"
              >
                A
              </button>
              <div className="text-center">
                <span className="text-[9px] font-mono text-slate-400 block">BUILT-IN SPEAKER</span>
                <span className="text-[10px] text-teal-400 font-bold block">
                  {isPlaying ? 'กำลังเล่นเพลง...' : 'แตะทดสอบเสียง'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  playTone(523.25, 0.3, 'C5 (ปุ่ม B)');
                }}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-black text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-md"
              >
                B
              </button>
            </div>
          </div>

          {/* Quick Tip Box */}
          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/50 text-[11px] text-indigo-200 leading-relaxed flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <span>
              <strong>รู้หรือไม่:</strong> บนบอร์ด Micro:bit V2 ลำโพงจะส่งสัญญาณ PWM ที่ความถี่ 20Hz–20,000Hz โดยตรง ไม่ต้องต่อลำโพงภายนอก!
            </span>
          </div>
        </div>
      </div>

      {/* ----------------- 16-STEP MELODY SEQUENCER ----------------- */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>เครื่องบันทึกและเรียงโน้ตทำนองเพลง (16-Step Grid Sequencer)</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              คลิกช่องตารางเพื่อวางตัวโน้ตเพลง และกดปุ่ม Play เพื่อฟังผลงาน
            </h3>
          </div>

          {/* Playback, Reset, Save & Randomize Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.play('click');
                setIsPlaying((p) => !p);
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-teal-500/25'
              }`}
            >
              {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? 'หยุดเล่น (Stop)' : 'เล่นเพลง (Play)'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenSaveModal}
              className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-indigo-500/25 cursor-pointer flex items-center gap-1.5 active:scale-95"
              title="บันทึกทำนองเพลงที่กำลังแต่งลงในคลังเพลงส่วนบุคคล"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-300" />
              <span>บันทึกเพลงลงคลัง</span>
            </button>

            <button
              type="button"
              onClick={handleNewComposition}
              className="py-2.5 px-3 rounded-xl border border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              title="ล้างและเริ่มแต่งทำนองเพลงใหม่"
            >
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              <span>+ แต่งเพลงใหม่</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.play('click');
                const el = document.getElementById('visual-melody-library');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-2.5 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              title="เลื่อนลงไปยังคลังเพลงและการประพันธ์"
            >
              <Library className="w-3.5 h-3.5 text-purple-500" />
              <span>คลังผลงาน ({PRESET_MELODIES.length + customMelodies.length})</span>
            </button>

            <button
              type="button"
              onClick={handleClearGrid}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title="ล้างตารางทั้งหมด"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleRandomize}
              className="py-2.5 px-3 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>สุ่มทำนอง</span>
            </button>
          </div>
        </div>

        {/* Step Sequencer Matrix Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[680px] space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            {/* Step numbers header */}
            <div className="grid grid-cols-[80px_repeat(16,1fr)] gap-1 text-center text-[10px] font-mono text-slate-500 mb-2">
              <span className="text-left pl-2">ตัวโน้ต</span>
              {Array.from({ length: 16 }).map((_, i) => (
                <span
                  key={i}
                  className={`py-0.5 rounded ${
                    currentStep === i ? 'bg-cyan-500 text-slate-950 font-bold' : ''
                  } ${i % 4 === 0 ? 'text-cyan-400 font-bold' : ''}`}
                >
                  {i + 1}
                </span>
              ))}
            </div>

            {/* Note Rows */}
            {SEQUENCER_PITCHES.map((pitchId) => {
              const noteDef = MUSICAL_NOTES.find((n) => n.id === pitchId);
              return (
                <div
                  key={pitchId}
                  className="grid grid-cols-[80px_repeat(16,1fr)] gap-1 items-center"
                >
                  {/* Note Label */}
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between pr-2 font-mono">
                    <span className="text-teal-400">{pitchId}</span>
                    <span className="text-[10px] text-slate-400">{noteDef?.solfege}</span>
                  </div>

                  {/* 16 Step Buttons for this pitch */}
                  {Array.from({ length: 16 }).map((_, stepIdx) => {
                    const isSelected = sequence[stepIdx] === pitchId;
                    const isPlayhead = currentStep === stepIdx;
                    const isBeatStart = stepIdx % 4 === 0;

                    return (
                      <button
                        key={stepIdx}
                        type="button"
                        onClick={() => handleToggleStepNote(pitchId, stepIdx)}
                        className={`h-9 rounded-lg transition-all cursor-pointer flex items-center justify-center text-[10px] font-bold ${
                          isSelected
                            ? 'bg-gradient-to-t from-teal-600 to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/40 scale-95'
                            : isPlayhead
                            ? 'bg-slate-700/80 border border-cyan-400/60'
                            : isBeatStart
                            ? 'bg-slate-850 hover:bg-slate-800 border-l border-slate-700'
                            : 'bg-slate-900 hover:bg-slate-800'
                        }`}
                        title={`จังหวะที่ ${stepIdx + 1}: ${pitchId}`}
                      >
                        {isSelected && '♪'}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ----------------- VISUAL MELODY LIBRARY PANEL ----------------- */}
      <div
        id="visual-melody-library"
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 scroll-mt-20"
      >
        {/* Panel Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              <Library className="w-4 h-4" />
              <span>คลังทำนองเพลงและการประพันธ์ (Visual Melody Library)</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-mono font-bold text-[10px]">
                {PRESET_MELODIES.length + customMelodies.length} เพลง
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>การ์ดผลงานเพลงและพรีเซ็ตพร้อมโหลดใช้งาน</span>
              <span className="text-lg">🎼</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              คลิกการ์ดเพื่อโหลดทำนองเข้าตาราง Sequencer หรือกดฟังเสียงพรีวิวแบบเรียลไทม์พร้อมกราฟิกคลื่นเสียง
            </p>
          </div>

          {/* Quick Library Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleOpenSaveModal}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              title="บันทึกทำนองเพลงปัจจุบันลงคลัง"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-300" />
              <span>+ บันทึกเพลงปัจจุบัน</span>
            </button>

            <button
              type="button"
              onClick={handleNewComposition}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="เปิดกระดานแต่งเพลงใหม่"
            >
              <Plus className="w-3.5 h-3.5 text-teal-500" />
              <span>แต่งเพลงใหม่</span>
            </button>

            <button
              type="button"
              onClick={handleExportLibraryJSON}
              className="p-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="ดาวน์โหลดไฟล์สำรองคลังเพลง JSON"
            >
              <Download className="w-3.5 h-3.5 text-teal-500" />
              <span className="hidden sm:inline">ส่งออก JSON</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.play('click');
                setIsImportModalOpen(true);
              }}
              className="p-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="นำเข้าไฟล์เพลง JSON"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">นำเข้า JSON</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={librarySearchQuery}
              onChange={(e) => setLibrarySearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อเพลง, ผู้แต่ง, หรือคำอธิบาย..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            {librarySearchQuery && (
              <button
                type="button"
                onClick={() => setLibrarySearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                title="ล้างข้อความค้นหา"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Category Tabs & Sorter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  setActivePresetTab('all');
                }}
                className={`py-1.5 px-3 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activePresetTab === 'all'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>🌟 ทั้งหมด</span>
                <span className="text-[10px] opacity-75 font-mono">
                  ({PRESET_MELODIES.length + customMelodies.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  setActivePresetTab('custom');
                }}
                className={`py-1.5 px-3 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activePresetTab === 'custom'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60'
                }`}
              >
                <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>💾 เพลงของฉัน</span>
                <span className="px-1.5 py-0.2 rounded bg-purple-700/80 text-white text-[10px] font-mono">
                  {customMelodies.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  setActivePresetTab('standard');
                }}
                className={`py-1.5 px-3 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activePresetTab === 'standard'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>🤖 เพลงมาตรฐาน</span>
                <span className="text-[10px] opacity-75 font-mono">
                  ({PRESET_MELODIES.filter((p) => p.category === 'tune').length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.play('click');
                  setActivePresetTab('sfx');
                }}
                className={`py-1.5 px-3 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activePresetTab === 'sfx'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>⚡ ซาวด์เอฟเฟกต์</span>
                <span className="text-[10px] opacity-75 font-mono">
                  ({PRESET_MELODIES.filter((p) => p.category === 'sfx').length})
                </span>
              </button>
            </div>

            {/* Sorter Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={librarySortBy}
                onChange={(e) => setLibrarySortBy(e.target.value as any)}
                className="py-1 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
              >
                <option value="newest">เรียงตาม: ล่าสุด</option>
                <option value="name">เรียงตาม: ชื่อเพลง (ก-ฮ)</option>
                <option value="bpm">เรียงตาม: ความเร็ว (BPM)</option>
                <option value="notes">เรียงตาม: จำนวนโน้ต</option>
              </select>
            </div>
          </div>
        </div>

        {/* ----------------- SELECTABLE CARDS GRID ----------------- */}
        {allLibraryItems.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 dark:bg-slate-950/60 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-3xl">
              🎼
            </div>
            <h5 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {librarySearchQuery ? 'ไม่พบเพลงที่ตรงกับคำค้นหา' : 'ยังไม่มีเพลงในหมวดหมู่นี้'}
            </h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {librarySearchQuery
                ? `ไม่พบคลังเพลงที่มีคำว่า "${librarySearchQuery}" ลองค้นหาด้วยคำอื่น หรือกดล้างการค้นหา`
                : 'คลิกวางตัวโน้ตในตาราง Sequencer ด้านบน แล้วกดปุ่ม "บันทึกเพลงลงคลัง" เพื่อสร้างคอลเลกชันเพลงของคุณเอง!'}
            </p>
            {librarySearchQuery ? (
              <button
                type="button"
                onClick={() => setLibrarySearchQuery('')}
                className="py-2 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                ล้างการค้นหา
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenSaveModal}
                className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>บันทึกทำนองเพลงปัจจุบันลงคลังทันที</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allLibraryItems.map((item) => {
              const isCardActive = activePresetId === item.id;
              const isCurrentCardPlaying = isCardActive && isPlaying;
              const noteTotal = item.noteCount || item.steps.filter(Boolean).length;

              return (
                <div
                  key={item.id}
                  className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between space-y-4 cursor-default ${
                    isCardActive
                      ? 'bg-gradient-to-b from-purple-50/90 to-indigo-50/60 dark:from-purple-950/40 dark:to-slate-900 border-purple-400 dark:border-purple-600 shadow-lg ring-2 ring-purple-400/40'
                      : 'bg-white dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700/70 hover:shadow-md'
                  }`}
                >
                  {/* Top Meta Header */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.isCustom ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700/50">
                            <Bookmark className="w-3 h-3 text-amber-500 fill-amber-400" />
                            <span>เพลงของฉัน</span>
                          </span>
                        ) : item.category === 'sfx' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
                            <span>⚡ ซาวด์เอฟเฟกต์</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700/50">
                            <span>🤖 เพลงมาตรฐาน</span>
                          </span>
                        )}

                        {isCardActive && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-xs">
                            <Check className="w-3 h-3" />
                            <span>กำลังใช้งาน</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {item.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomMelody(item.id, item.name, e)}
                            className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                            title="ลบเพลงนี้ออกจากคลังเพลงส่วนบุคคล"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 flex items-center gap-1.5">
                        <span className="text-purple-600 dark:text-purple-400">♪</span>
                        <span>{item.name}</span>
                        {item.nameEn && (
                          <span className="text-xs font-normal text-slate-400 dark:text-slate-500 hidden sm:inline">
                            ({item.nameEn})
                          </span>
                        )}
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    {/* 16-Step Mini Piano-Roll / Waveform Graphic Contour */}
                    <div className="pt-1">
                      <div className="text-[10px] text-slate-400 font-mono mb-1 flex items-center justify-between">
                        <span>ผังทำนอง 16 จังหวะ (Pitch Contour)</span>
                        <span className="text-teal-500 font-bold">{noteTotal}/16 ช่อง</span>
                      </div>

                      <div className="h-12 bg-slate-950 rounded-xl p-1.5 flex items-end gap-1 border border-slate-800/80">
                        {item.steps.map((noteId: string | null, sIdx: number) => {
                          const hasNote = Boolean(noteId);
                          const height = getNotePitchHeight(noteId);
                          const colorClass = getNotePitchColor(noteId);
                          const isPlayheadHere = isCurrentCardPlaying && currentStep === sIdx;
                          const isBeatMarker = sIdx % 4 === 0;

                          return (
                            <div
                              key={sIdx}
                              className={`flex-1 h-full flex flex-col justify-end relative rounded-sm ${
                                isBeatMarker ? 'border-l border-slate-700/60 pl-[1px]' : ''
                              }`}
                              title={hasNote ? `จังหวะ ${sIdx + 1}: ${noteId}` : `จังหวะ ${sIdx + 1}: พัก`}
                            >
                              <div
                                style={{ height }}
                                className={`w-full rounded-sm transition-all duration-150 ${colorClass} ${
                                  hasNote
                                    ? isPlayheadHere
                                      ? 'ring-2 ring-white shadow-md shadow-cyan-400 scale-110 brightness-125'
                                      : 'opacity-90'
                                    : 'opacity-20'
                                }`}
                              />
                              {isPlayheadHere && (
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stats Chips Row */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">
                        ⚡ {item.bpm} BPM
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">
                        🎵 {noteTotal} โน้ต
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] capitalize">
                        คลื่น {item.waveform || 'square'}
                      </span>
                      {item.author && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto truncate max-w-[110px]">
                          โดย {item.author}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      {/* Quick Play / Preview Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrentCardPlaying) {
                            soundEffects.play('click');
                            setIsPlaying(false);
                          } else {
                            handleLoadPreset(item);
                          }
                        }}
                        className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
                          isCurrentCardPlaying
                            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                        }`}
                        title="ฟังเสียงเพลงนี้ทันที"
                      >
                        {isCurrentCardPlaying ? (
                          <>
                            <Square className="w-3 h-3 fill-white" />
                            <span>หยุด</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-white" />
                            <span>ฟังพรีวิว</span>
                          </>
                        )}
                      </button>

                      {/* Load into Sequencer without auto-play */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEffects.play('click');
                          setSequence([...item.steps]);
                          setBpm(item.bpm);
                          if (item.waveform) setWaveform(item.waveform);
                          setActivePresetId(item.id);
                          setCurrentStep(-1);
                          setIsPlaying(false);
                          setToastMessage(`📥 โหลด "${item.name}" เข้า Sequencer เรียบร้อย (พร้อมแก้ไขโน้ต)`);
                          setTimeout(() => setToastMessage(null), 2500);
                        }}
                        className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                        title="โหลดเข้าตาราง Sequencer เพื่อแก้ไขโน้ต"
                      >
                        <span>📥 โหลดทำนอง</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Duplicate / Remix */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateMelody(item);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs transition-colors cursor-pointer"
                        title="ทำสำเนาเพลงนี้เพื่อนำไปดัดแปลงต่อในคลังเพลงของฉัน"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      </button>

                      {/* Copy MakeCode */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEffects.play('click');
                          const activeNotes = item.steps
                            .map((s: string | null, idx: number) => (s ? { note: s, step: idx } : null))
                            .filter(Boolean) as { note: string; step: number }[];
                          const lines = [
                            `// โค้ดเสียงดนตรี Micro:bit V2: ${item.name}`,
                            `music.setVolume(255)`,
                            `music.setTempo(${item.bpm})`,
                            `basic.forever(function () {`,
                          ];
                          activeNotes.forEach(({ note }) => {
                            const cleanNote = note.replace('#', 'Sharp');
                            lines.push(`    music.playTone(Note.${cleanNote}, music.beat(BeatFraction.Quarter))`);
                            lines.push(`    basic.pause(50)`);
                          });
                          lines.push(`    basic.pause(1000)`);
                          lines.push(`})`);
                          navigator.clipboard.writeText(lines.join('\n'));
                          setToastMessage(`📋 คัดลอกโค้ด MakeCode ของ "${item.name}" แล้ว`);
                          setTimeout(() => setToastMessage(null), 2500);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs transition-colors cursor-pointer"
                        title="คัดลอกโค้ด MakeCode ของเพลงนี้"
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ----------------- INTERACTIVE VIRTUAL PIANO KEYBOARD ----------------- */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Music className="w-4 h-4" />
              <span>เปียโนคีย์บอร์ดเสมือนจริง (Interactive Piano Keyboard)</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              คลิกหรือกดแป้นพิมพ์คีย์บอร์ดบนคอมพิวเตอร์ (A, S, D, F, G, H, J, K) เพื่อเล่นเสียง
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:block">
            Keyboard Ready ⌨️
          </span>
        </div>

        {/* Piano Keys Visual Representation */}
        <div className="relative flex justify-center bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 select-none overflow-x-auto">
          <div className="flex relative">
            {MUSICAL_NOTES.filter((n) => !n.isBlack).map((whiteNote, idx) => {
              // Check if black note exists to the right of this white note
              const nextNote = MUSICAL_NOTES[MUSICAL_NOTES.findIndex((n) => n.id === whiteNote.id) + 1];
              const hasBlack = nextNote && nextNote.isBlack;

              return (
                <div key={whiteNote.id} className="relative">
                  {/* White Key */}
                  <button
                    type="button"
                    onClick={() => handleKeyClick(whiteNote)}
                    className="w-10 sm:w-14 h-36 sm:h-44 bg-gradient-to-b from-white to-slate-100 hover:from-teal-50 hover:to-teal-100 active:from-teal-200 active:to-teal-300 border-x border-b-4 border-slate-300 rounded-b-xl flex flex-col justify-end items-center pb-3 transition-colors cursor-pointer shadow-sm shadow-black/20 group relative"
                  >
                    <span className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-teal-700">
                      {whiteNote.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {whiteNote.solfege}
                    </span>
                    <span className="text-[9px] font-mono bg-slate-200 text-slate-700 px-1 rounded mt-1 font-bold">
                      {whiteNote.keyboardKey}
                    </span>
                  </button>

                  {/* Black Key Overlay */}
                  {hasBlack && (
                    <button
                      type="button"
                      onClick={() => handleKeyClick(nextNote)}
                      className="absolute top-0 -right-3.5 sm:-right-4.5 z-20 w-7 sm:w-9 h-24 sm:h-28 bg-gradient-to-b from-slate-800 to-slate-950 hover:from-slate-700 hover:to-slate-900 active:from-purple-900 active:to-slate-950 border border-slate-900 rounded-b-lg flex flex-col justify-end items-center pb-2 transition-colors cursor-pointer shadow-lg shadow-black/50"
                    >
                      <span className="text-[10px] sm:text-xs font-bold text-white">
                        {nextNote.name}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-mono bg-slate-700 text-slate-200 px-1 rounded mt-0.5">
                        {nextNote.keyboardKey}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ----------------- CODE EXPORTER & BLOCKS BRIDGE ----------------- */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider mb-0.5">
              <Code2 className="w-4 h-4" />
              <span>แปลงทำนองเพลงเป็นโค้ด Micro:bit (MakeCode &amp; MicroPython)</span>
            </div>
            <p className="text-xs text-slate-400">
              นำโค้ดด้านล่างไปวางใน MakeCode Editor หรือ Python Editor เพื่อรันบนบอร์ดจริง
            </p>
          </div>

          {/* Language Switcher & Copy Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setCodeLanguage('makecode')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  codeLanguage === 'makecode' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                MakeCode (Blocks / JS)
              </button>
              <button
                type="button"
                onClick={() => setCodeLanguage('python')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  codeLanguage === 'python' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                MicroPython (v2)
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="py-1.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'คัดลอกสำเร็จ!' : 'คัดลอกโค้ด'}</span>
            </button>
          </div>
        </div>

        {/* Code Block Display */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>
              {codeLanguage === 'makecode' ? 'main.ts (MakeCode JavaScript)' : 'main.py (MicroPython)'}
            </span>
            <span className="text-teal-400 font-bold">Auto-Generated Code</span>
          </div>
          <pre className="p-4 text-xs font-mono text-teal-300 overflow-x-auto leading-relaxed max-h-56">
            <code>{codeLanguage === 'makecode' ? generatedMakeCode : generatedPython}</code>
          </pre>
        </div>
      </div>

      {/* ----------------- EDUCATIONAL QUESTS & CHALLENGES ----------------- */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-amber-950/20 rounded-3xl p-6 border border-amber-200 dark:border-amber-900/40 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
              ภารกิจนักประพันธ์เพลงจิ๋ว (Music Composer Quests)
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-800">
            สำเร็จแล้ว {Object.values(completedQuests).filter(Boolean).length}/4 ภารกิจ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Quest 1 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              completedQuests['quest_bell']
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-white dark:bg-slate-950 border-amber-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <span>🔔</span> 1. เสียงระฆังโรงเรียน
              </span>
              {completedQuests['quest_bell'] ? (
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">✓ ผ่านแล้ว</span>
              ) : (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">+15 EXP</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              เรียงโน้ต 4 ตัวแรกเป็น C4 → E4 → G4 → C5 ในตาราง Sequencer
            </p>
          </div>

          {/* Quest 2 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              completedQuests['quest_jump']
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-white dark:bg-slate-950 border-amber-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <span>⚡</span> 2. ซาวด์เอฟเฟกต์กระโดด
              </span>
              {completedQuests['quest_jump'] ? (
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">✓ ผ่านแล้ว</span>
              ) : (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">+15 EXP</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              เลือกคลื่น Square Wave และปรับความเร็ว Tempo ไปที่ 160 BPM ขึ้นไปแล้วกด Play
            </p>
          </div>

          {/* Quest 3 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              completedQuests['quest_birthday']
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-white dark:bg-slate-950 border-amber-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <span>🎂</span> 3. ทำนองเพลงวันเกิด
              </span>
              {completedQuests['quest_birthday'] ? (
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">✓ ผ่านแล้ว</span>
              ) : (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">+15 EXP</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              โหลดเพลงสำเร็จรูป &quot;สุขสันต์วันเกิด (Happy Birthday)&quot; และเล่นให้จบเพลง
            </p>
          </div>

          {/* Quest 4: Save Custom Melody to Library */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              completedQuests['quest_custom_save']
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-white dark:bg-slate-950 border-amber-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5">
                <span>💾</span> 4. คลังเพลงส่วนบุคคล
              </span>
              {completedQuests['quest_custom_save'] ? (
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">✓ ผ่านแล้ว</span>
              ) : (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">+15 EXP</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              แต่งทำนองเพลงใน Sequencer และกดบันทึกลงในคลังเพลงส่วนบุคคล
            </p>
          </div>
        </div>
      </div>

      {/* ----------------- TOAST NOTIFICATION ----------------- */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="px-4 py-3 rounded-2xl bg-slate-900 text-white border border-purple-500/50 shadow-2xl flex items-center gap-2 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ----------------- SAVE MELODY MODAL ----------------- */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    บันทึกเพลงลงคลังพรีเซ็ต
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    เก็บทำนองไว้เล่นและส่งออกโค้ดได้ตลอดเวลา
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Sequence Stats Recap */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  โน้ตที่เลือก: {sequence.filter(Boolean).length} ตัว
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                <span>{bpm} BPM</span>
                <span>•</span>
                <span className="capitalize">{waveform}</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* Melody Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  ชื่อเพลง / ชื่องานประพันธ์: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="เช่น เสียงกระดิ่งหน้าบ้าน, ด่านบอส 8-Bit"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-semibold"
                  autoFocus
                />

                {/* Quick naming chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400">ไอเดียชื่อ:</span>
                  {['เสียงระฆังโรงเรียน', 'ซาวด์เอฟเฟกต์กระโดด', 'เพลงประจำทีม', 'ทำนองแห่งชัยชนะ'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setSaveName(chip)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  หมวดหมู่:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'tune' as const, label: '🎼 บทเพลง (Tune)' },
                    { id: 'sfx' as const, label: '⚡ ซาวด์เอฟเฟกต์ (SFX)' },
                    { id: 'custom' as const, label: '💾 เพลงของฉัน' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSaveCategory(cat.id)}
                      className={`py-2 px-2 rounded-xl font-bold text-[11px] transition-all cursor-pointer text-center ${
                        saveCategory === cat.id
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  คำอธิบายหรือเทคนิคการประพันธ์:
                </label>
                <textarea
                  value={saveDescription}
                  onChange={(e) => setSaveDescription(e.target.value)}
                  placeholder="เช่น ทำนองบันไดเสียง C เมเจอร์ ใช้คลื่น Square สำหรับเกมผจญภัย"
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Author */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  ชื่อผู้แต่ง:
                </label>
                <input
                  type="text"
                  value={saveAuthor}
                  onChange={(e) => setSaveAuthor(e.target.value)}
                  placeholder="เช่น เด็กหญิงกิ๊ฟ ป.5/1"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSaveCustomMelody}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกลงคลัง (+10 EXP)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- IMPORT JSON MODAL ----------------- */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    นำเข้าทำนองเพลง (Import JSON)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    วางโค้ด JSON ของทำนองเพลงที่เพื่อนหรือคุณครูแชร์มา
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportError(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {importError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{importError}</span>
              </div>
            )}

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                ข้อมูล JSON ของทำนองเพลง:
              </label>
              <textarea
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='[ { "name": "เพลงของเพื่อน", "bpm": 120, "steps": ["C4", null, "E4", ...] } ]'
                rows={6}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-teal-300 font-mono text-[11px] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportError(null);
                }}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleImportLibraryJSON}
                disabled={!importJsonText.trim()}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>นำเข้าเพลงสู่คลัง</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
