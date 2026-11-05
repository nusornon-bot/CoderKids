import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Flag,
  Octagon,
  RotateCcw,
  Plus,
  Play,
  Sparkles,
  Volume2,
  Trash2,
  Palette,
  Crosshair,
  Repeat,
  Compass,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScratchStudioProps {
  onComplete: () => void;
  addPoints: (points: number) => void;
}

type BlockCategory = 'all' | 'events' | 'motion' | 'pen' | 'control' | 'looks';

interface ProgramBlock {
  id: string;
  category: 'events' | 'motion' | 'pen' | 'control' | 'looks';
  name: string;
  code: string;
  color: string;
  desc?: string;
  customType?: 'repeat' | 'repeat_walk' | 'goto' | 'turn_cw' | 'turn_ccw' | 'move' | 'custom_color' | 'wait';
  val1?: number; // repeat count, x, turn deg, move steps, wait seconds
  val2?: number; // y, or steps in repeat_walk
  colorVal?: string; // custom hex color
}

interface PenTrail {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  size: number;
}

const PRESET_COLORS = [
  { label: 'น้ำเงิน', hex: '#2563eb' },
  { label: 'แดง', hex: '#dc2626' },
  { label: 'เขียว', hex: '#16a34a' },
  { label: 'ส้ม', hex: '#ea580c' },
  { label: 'ม่วง', hex: '#9333ea' },
  { label: 'เหลืองทอง', hex: '#eab308' },
  { label: 'ชมพู', hex: '#ec4899' },
  { label: 'ฟ้าไซแอน', hex: '#06b6d4' },
];

export const ScratchStudio: React.FC<ScratchStudioProps> = ({ onComplete, addPoints }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const penTrailsRef = useRef<PenTrail[]>([]);
  const spritePosRef = useRef({ x: -40, y: -40, dir: 90, costume: 0 });
  const isPenDownRef = useRef(false);

  // Stage state
  const [spritePos, setSpritePos] = useState({ x: -40, y: -40, dir: 90, costume: 0 });
  const [speechBubble, setSpeechBubble] = useState<string | null>('คลิกธงเขียวเพื่อเริ่มวาดสี่เหลี่ยมจัตุรัส!');
  const [penTrails, setPenTrails] = useState<PenTrail[]>([]);
  const [isPenDown, setIsPenDown] = useState(false);
  const [penColor, setPenColor] = useState('#2563eb'); // Default vibrant royal blue
  const [penSize, setPenSize] = useState(5);
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BlockCategory>('all');
  const [activePreset, setActivePreset] = useState<'square' | 'star' | 'circle' | 'pinwheel' | 'intro'>('square');

  const SCRATCH_PRESET_EXPLANATIONS: Record<string, { title: string; concept: string; explanation: string; tip: string }> = {
    square: {
      title: 'สี่เหลี่ยมจัตุรัส (Loop 4)',
      concept: 'การทำซ้ำ 4 รอบ + หมุน 90° (4 × 90° = 360°)',
      explanation: 'จรดปากกาสีน้ำเงิน และใช้บล็อกทำซ้ำ 4 รอบ โดยแต่ละรอบเดินหน้าและเลี้ยวขวา 90 องศา จนบรรจบเป็นรูปสี่เหลี่ยมจัตุรัสครบ 4 ด้าน',
      tip: 'ลองปรับองศาเป็น 120° หรือ 60° เพื่อดูรูปหลายเหลี่ยมมุมอื่นๆ',
    },
    star: {
      title: 'ดาว 5 แฉก (Star Loop 5)',
      concept: 'การทำซ้ำ 5 รอบ + หมุน 144° (5 × 144° = 720°)',
      explanation: 'จรดปากกาสีเหลืองทอง และใช้บล็อกทำซ้ำ 5 รอบ วาดเส้นทะแยงมุมไขว้ 5 ด้าน โดยแต่ละรอบเลี้ยว 144 องศา แล้วเล่นเสียงดนตรีเวทมนตร์ Chime',
      tip: 'มุม 144° เกิดจาก (180° - 36°) เป็นมุมเลี้ยววาดดาว 5 แฉกที่สมบูรณ์แบบ',
    },
    circle: {
      title: 'วงกลมเรขาคณิต (Loop 36)',
      concept: 'การทำซ้ำ 36 รอบ + หมุน 10° (36 × 10° = 360°)',
      explanation: 'จรดปากกาสีม่วง และใช้บล็อกทำซ้ำ 36 รอบ โดยแต่ละรอบเดินหน้าก้าวสั้นๆ 6 ก้าวและหมุน 10 องศา เกิดเป็นเส้นโค้งวงกลมเรขาคณิต 360 องศา',
      tip: 'วงกลมในคอมพิวเตอร์สร้างจากรูปหลายเหลี่ยมด้านเท่าที่มีจำนวนด้านมากๆ',
    },
    pinwheel: {
      title: 'กังหัน 8 ทิศ (Pinwheel 8)',
      concept: 'การกระจายรัศมี 8 แฉก + หมุน 45° (8 × 45° = 360°)',
      explanation: 'จรดปากกาสีแดง วาดกิ่งกังหัน 8 ทิศทางกระจายออกจากจุดศูนย์กลาง x:0, y:0 โดยแต่ละแฉกหมุน 45 องศาอย่างสมมาตร',
      tip: '8 แฉก x 45 องศา = 360 องศา ครบหนึ่งรอบวงกลมพอดี',
    },
    intro: {
      title: 'ทักทายและเล่นเสียง (Interactive Intro)',
      concept: 'ลำดับขั้นตอน (Sequence) และมัลติมีเดีย (Say & Sound)',
      explanation: 'ควบคุมตัวละครแมวส้มให้เดินหน้า 40 ก้าว แสดงกล่องคำพูดทักทาย ส่งเสียงร้องเหมียว (Meow!) และสะสมแต้มคะแนน 10 แต้ม',
      tip: 'การเขียนโค้ดเริ่มต้นจากการสั่งงานตามลำดับจากบนลงล่าง',
    },
  };

  // Values configured in the Block Library (คลังบล็อกคำสั่ง) before adding
  const [paletteInputs, setPaletteInputs] = useState({
    gotoX: 0,
    gotoY: 0,
    turnCwDeg: 90,
    turnCcwDeg: 90,
    repeatCount: 5,
    repeatWalkSteps: 10,
    moveSteps: 10,
    waitSec: 1,
    penColorCustom: '#2563eb',
  });

  // Script blocks on canvas (Default square preset)
  const [scriptBlocks, setScriptBlocks] = useState<ProgramBlock[]>([
    { id: '1', category: 'events', name: 'เมื่อคลิก ธงเขียว', code: 'start', color: 'bg-amber-500' },
    { id: '2', category: 'pen', name: 'ลบทั้งหมด (Erase All)', code: 'erase_all', color: 'bg-emerald-600' },
    { id: '3', category: 'motion', name: 'ไปที่ x: -40 y: -40', code: 'goto:-40,-40', color: 'bg-blue-600', customType: 'goto', val1: -40, val2: -40 },
    { id: '4', category: 'motion', name: 'หันไปในทิศทาง (90)° [ขวา]', code: 'point:90', color: 'bg-blue-600' },
    { id: '5', category: 'pen', name: 'ตั้งค่าสีปากกาเป็น [สีน้ำเงิน]', code: 'set_color:#2563eb', color: 'bg-emerald-600' },
    { id: '6', category: 'pen', name: 'กำหนดขนาดปากกาเป็น (5)', code: 'set_size:5', color: 'bg-emerald-600' },
    { id: '7', category: 'pen', name: 'จรดปากกา (Pen Down)', code: 'pen_down', color: 'bg-emerald-600' },
    { id: '8', category: 'control', name: 'ทำซ้ำ (4) รอบ', code: 'repeat:4', color: 'bg-amber-600', customType: 'repeat', val1: 4 },
    { id: '9', category: 'pen', name: 'ยกปากกา (Pen Up)', code: 'pen_up', color: 'bg-emerald-600' },
    { id: '10', category: 'looks', name: 'พูดว่า [วาดสี่เหลี่ยมจัตุรัส 4 ด้านสำเร็จแล้ว! 🎉]', code: 'say:วาดสี่เหลี่ยมจัตุรัส 4 ด้านสำเร็จแล้ว! 🎉', color: 'bg-purple-600' },
  ]);

  // Comprehensive available blocks library
  const availableBlocks: ProgramBlock[] = [
    // 🚩 Events Blocks
    {
      id: 'ev_start',
      category: 'events',
      name: 'เมื่อคลิก ธงเขียว',
      code: 'start',
      color: 'bg-amber-500',
      desc: 'จุดเริ่มต้นรันโปรแกรมเมื่อคลิกธงเขียว (Event Flag)',
    },

    // 🔵 Motion Blocks - Parameterized and Editable
    {
      id: 'm_step_custom',
      category: 'motion',
      name: 'ก้าว (ระบุก้าว)',
      code: 'move:10',
      color: 'bg-blue-600',
      customType: 'move',
      val1: 10,
      desc: 'เดินหน้าตามจำนวนก้าวที่ระบุ เช่น 10 ก้าว, 20 ก้าว, 40 ก้าว',
    },
    {
      id: 'm_goto_custom',
      category: 'motion',
      name: 'ไปที่ x, y (ระบุพิกัด)',
      code: 'goto:0,0',
      color: 'bg-blue-600',
      customType: 'goto',
      val1: 0,
      val2: 0,
      desc: 'ระบุตัวเลขพิกัด x (-200 ถึง 200) และ y (-120 ถึง 120)',
    },
    {
      id: 'm_turn_cw_custom',
      category: 'motion',
      name: 'หมุนตามเข็ม (ระบุองศา)',
      code: 'turn:90',
      color: 'bg-blue-600',
      customType: 'turn_cw',
      val1: 90,
      desc: 'หมุนตามเข็มนาฬิกา ระบุตัวเลของศา เช่น 90°, 45°, 60°',
    },
    {
      id: 'm_turn_ccw_custom',
      category: 'motion',
      name: 'หมุนทวนเข็ม (ระบุองศา)',
      code: 'turn:-90',
      color: 'bg-blue-600',
      customType: 'turn_ccw',
      val1: 90,
      desc: 'หมุนทวนเข็มนาฬิกา ระบุตัวเลของศา เช่น 90°, 45°, 60°',
    },
    { id: 'm_goto_center', category: 'motion', name: 'ไปที่ x: 0 y: 0 (จุดกึ่งกลาง)', code: 'goto:0,0', color: 'bg-blue-600', desc: 'กลับจุดศูนย์กลางเวที' },
    { id: 'm_goto_random', category: 'motion', name: 'ไปที่ ตำแหน่งสุ่ม (Random)', code: 'goto:random', color: 'bg-blue-600', desc: 'สุ่มพิกัดบนเวที' },
    { id: 'm_point_right', category: 'motion', name: 'หันไปในทิศทาง (90)° [ขวา]', code: 'point:90', color: 'bg-blue-600', desc: 'หันหน้าไปทางขวา' },
    { id: 'm_point_up', category: 'motion', name: 'หันไปในทิศทาง (0)° [บน]', code: 'point:0', color: 'bg-blue-600', desc: 'หันหน้าชี้ขึ้นบน' },
    { id: 'm_bounce', category: 'motion', name: 'ถ้าชนขอบให้สะท้อนกลับ', code: 'bounce', color: 'bg-blue-600', desc: 'กลับหลังหันเมื่อชนขอบ' },

    // 🟢 Pen Blocks - Includes Custom Color Picker
    {
      id: 'p_custom_color',
      category: 'pen',
      name: 'กำหนดสีปากกาเอง (เลือกสี)',
      code: 'set_color:#2563eb',
      color: 'bg-emerald-600',
      customType: 'custom_color',
      colorVal: '#2563eb',
      desc: 'เลือกสีปากกาเองตามใจชอบด้วยตัวเลือกสี Color Picker',
    },
    { id: 'p_down', category: 'pen', name: 'จรดปากกา (Pen Down)', code: 'pen_down', color: 'bg-emerald-600', desc: 'เริ่มวาดเส้นเมื่อเคลื่อนที่' },
    { id: 'p_up', category: 'pen', name: 'ยกปากกา (Pen Up)', code: 'pen_up', color: 'bg-emerald-600', desc: 'หยุดวาดเส้น' },
    { id: 'p_erase', category: 'pen', name: 'ลบทั้งหมด (Erase All)', code: 'erase_all', color: 'bg-emerald-600', desc: 'ล้างเส้นที่วาดทั้งหมด' },
    { id: 'p_color_blue', category: 'pen', name: 'ตั้งค่าสีปากกาเป็น [สีน้ำเงิน]', code: 'set_color:#2563eb', color: 'bg-emerald-600', desc: 'เปลี่ยนสีปากกา' },
    { id: 'p_color_red', category: 'pen', name: 'ตั้งค่าสีปากกาเป็น [สีแดง]', code: 'set_color:#dc2626', color: 'bg-emerald-600', desc: 'เปลี่ยนสีปากกา' },
    { id: 'p_color_green', category: 'pen', name: 'ตั้งค่าสีปากกาเป็น [สีเขียว]', code: 'set_color:#16a34a', color: 'bg-emerald-600', desc: 'เปลี่ยนสีปากกา' },
    { id: 'p_color_orange', category: 'pen', name: 'ตั้งค่าสีปากกาเป็น [สีส้ม]', code: 'set_color:#ea580c', color: 'bg-emerald-600', desc: 'เปลี่ยนสีปากกา' },
    { id: 'p_color_purple', category: 'pen', name: 'ตั้งค่าสีปากกาเป็น [สีม่วง]', code: 'set_color:#9333ea', color: 'bg-emerald-600', desc: 'เปลี่ยนสีปากกา' },
    { id: 'p_color_gold', category: 'pen', name: 'ตั้งค่าสีปากกาเป็น [สีเหลืองทอง]', code: 'set_color:#eab308', color: 'bg-emerald-600', desc: 'เปลี่ยนสีปากกา' },
    { id: 'p_color_rainbow', category: 'pen', name: 'สุ่มสีปากกาสายรุ้ง (Rainbow Color)', code: 'random_color', color: 'bg-emerald-600', desc: 'สุ่มสีสดใส' },
    { id: 'p_size4', category: 'pen', name: 'กำหนดขนาดปากกาเป็น (4)', code: 'set_size:4', color: 'bg-emerald-600', desc: 'ขนาดเส้นปานกลาง' },
    { id: 'p_size8', category: 'pen', name: 'กำหนดขนาดปากกาเป็น (8) [เส้นหนา]', code: 'set_size:8', color: 'bg-emerald-600', desc: 'ขนาดเส้นหนาพิเศษ' },

    // 🟡 Control & Repeat Loops - Parameterized and Editable
    {
      id: 'c_repeat_walk',
      category: 'control',
      name: 'ทำซ้ำ (เดินหน้า)',
      code: 'repeat_walk:5:10',
      color: 'bg-amber-600',
      customType: 'repeat_walk',
      val1: 5,
      val2: 10,
      desc: 'ทำซ้ำการเดินหน้าตามจำนวนรอบและระยะก้าว เช่น เดินหน้า 10 ก้าว จำนวน 5 รอบ',
    },
    {
      id: 'c_repeat_custom',
      category: 'control',
      name: 'ทำซ้ำ (ระบุจำนวนรอบ)',
      code: 'repeat:4',
      color: 'bg-amber-600',
      customType: 'repeat',
      val1: 4,
      desc: 'ระบุตัวเลขจำนวนรอบทำซ้ำ (วาดรูปหลายเหลี่ยม หรือทำซ้ำคำสั่งที่อยู่ถัดไป)',
    },
    { id: 'c_rep_square', category: 'control', name: 'ทำซ้ำ (4) รอบ [วาดสี่เหลี่ยมจัตุรัส]', code: 'repeat_square:4', color: 'bg-amber-600', desc: 'เดิน 60 ก้าว + เลี้ยว 90°' },
    { id: 'c_rep_triangle', category: 'control', name: 'ทำซ้ำ (3) รอบ [วาดสามเหลี่ยม]', code: 'repeat_triangle:3', color: 'bg-amber-600', desc: 'เดิน 70 ก้าว + เลี้ยว 120°' },
    { id: 'c_rep_circle', category: 'control', name: 'ทำซ้ำ (36) รอบ [วาดวงกลมเรขาคณิต]', code: 'repeat_circle:36', color: 'bg-amber-600', desc: 'เดิน 6 ก้าว + เลี้ยว 10°' },
    { id: 'c_rep_star', category: 'control', name: 'ทำซ้ำ (5) รอบ [วาดดาว 5 แฉก]', code: 'repeat_star:5', color: 'bg-amber-600', desc: 'วาดดาวเส้นไขว้ 144°' },
    { id: 'c_rep_pinwheel', category: 'control', name: 'ทำซ้ำ (8) รอบ [วาดกังหัน 8 ทิศ]', code: 'repeat_pinwheel:8', color: 'bg-amber-600', desc: 'ลวดลายแฉกดอกไม้' },
    {
      id: 'c_wait_custom',
      category: 'control',
      name: 'รอ (ระบุวินาที)',
      code: 'wait:1000',
      color: 'bg-amber-600',
      customType: 'wait',
      val1: 1,
      desc: 'หน่วงเวลารอก่อนทำคำสั่งถัดไป (ระบุตัวเลขวินาที เช่น 0.5, 1, 2 วินาที)',
    },
    { id: 'c_wait', category: 'control', name: 'รอ (0.5) วินาที', code: 'wait:500', color: 'bg-amber-600', desc: 'หน่วงเวลาจังหวะโค้ด 0.5 วินาที' },
    { id: 'c_score', category: 'control', name: 'เปลี่ยน คะแนน เพิ่มขึ้น (10)', code: 'score:10', color: 'bg-amber-600', desc: 'สะสมแต้มคะแนน' },

    // 🟣 Looks & Sound
    { id: 'l_say_hello', category: 'looks', name: 'พูดว่า [สวัสดีครับ! มาเรียน Scratch กัน]', code: 'say:สวัสดีครับ! มาเรียน Scratch กัน', color: 'bg-purple-600', desc: 'แสดงกล่องคำพูด' },
    { id: 'l_say_done', category: 'looks', name: 'พูดว่า [เย้! โค้ดดิ้งสำเร็จแล้ว 🎉]', code: 'say:เย้! โค้ดดิ้งสำเร็จแล้ว 🎉', color: 'bg-purple-600', desc: 'แสดงกล่องคำพูด' },
    { id: 'l_costume', category: 'looks', name: 'สลับชุดตัวละครถัดไป (Next Costume)', code: 'next_costume', color: 'bg-purple-600', desc: 'ขยับท่าทางตัวละคร' },
    { id: 's_meow', category: 'control', name: 'เล่นเสียงเหมียว (Meow!)', code: 'sound_meow', color: 'bg-rose-500', desc: 'เล่นเสียงแมวส้ม' },
    { id: 's_chime', category: 'control', name: 'เล่นเสียงเวทมนตร์ (Chime!)', code: 'sound_chime', color: 'bg-rose-500', desc: 'เสียงกระดิ่งสำเร็จ' },
  ];

  // Presets with rich, diverse geometry and animations
  const loadPreset = (presetName: 'square' | 'star' | 'circle' | 'intro' | 'pinwheel') => {
    setActivePreset(presetName);
    resetStage();
    if (presetName === 'square') {
      setScriptBlocks([
        { id: 'p_sq1', category: 'events', name: 'เมื่อคลิก ธงเขียว', code: 'start', color: 'bg-amber-500' },
        { id: 'p_sq2', category: 'pen', name: 'ลบทั้งหมด (Erase All)', code: 'erase_all', color: 'bg-emerald-600' },
        { id: 'p_sq3', category: 'motion', name: 'ไปที่ x: -40 y: -40', code: 'goto:-40,-40', color: 'bg-blue-600', customType: 'goto', val1: -40, val2: -40 },
        { id: 'p_sq4', category: 'motion', name: 'หันไปในทิศทาง (90)° [ขวา]', code: 'point:90', color: 'bg-blue-600' },
        { id: 'p_sq5', category: 'pen', name: 'ตั้งค่าสีปากกาเป็น [สีน้ำเงิน]', code: 'set_color:#2563eb', color: 'bg-emerald-600' },
        { id: 'p_sq6', category: 'pen', name: 'กำหนดขนาดปากกาเป็น (5)', code: 'set_size:5', color: 'bg-emerald-600' },
        { id: 'p_sq7', category: 'pen', name: 'จรดปากกา (Pen Down)', code: 'pen_down', color: 'bg-emerald-600' },
        { id: 'p_sq8', category: 'control', name: 'ทำซ้ำ (4) รอบ', code: 'repeat:4', color: 'bg-amber-600', customType: 'repeat', val1: 4 },
        { id: 'p_sq9', category: 'pen', name: 'ยกปากกา (Pen Up)', code: 'pen_up', color: 'bg-emerald-600' },
        { id: 'p_sq10', category: 'looks', name: 'พูดว่า [วาดสี่เหลี่ยมจัตุรัส 4 ด้านสำเร็จแล้ว! 🎉]', code: 'say:วาดสี่เหลี่ยมจัตุรัส 4 ด้านสำเร็จแล้ว! 🎉', color: 'bg-purple-600' },
      ]);
    } else if (presetName === 'star') {
      setScriptBlocks([
        { id: 'p_st1', category: 'events', name: 'เมื่อคลิก ธงเขียว', code: 'start', color: 'bg-amber-500' },
        { id: 'p_st2', category: 'pen', name: 'ลบทั้งหมด (Erase All)', code: 'erase_all', color: 'bg-emerald-600' },
        { id: 'p_st3', category: 'motion', name: 'ไปที่ x: -30 y: 20', code: 'goto:-30,20', color: 'bg-blue-600', customType: 'goto', val1: -30, val2: 20 },
        { id: 'p_st4', category: 'pen', name: 'ตั้งค่าสีปากกาเป็น [สีเหลืองทอง]', code: 'set_color:#eab308', color: 'bg-emerald-600' },
        { id: 'p_st5', category: 'pen', name: 'กำหนดขนาดปากกาเป็น (4)', code: 'set_size:4', color: 'bg-emerald-600' },
        { id: 'p_st6', category: 'pen', name: 'จรดปากกา (Pen Down)', code: 'pen_down', color: 'bg-emerald-600' },
        { id: 'p_st7', category: 'control', name: 'ทำซ้ำ (5) รอบ [วาดดาว 5 แฉก]', code: 'repeat_star:5', color: 'bg-amber-600' },
        { id: 'p_st8', category: 'pen', name: 'ยกปากกา (Pen Up)', code: 'pen_up', color: 'bg-emerald-600' },
        { id: 'p_st9', category: 'control', name: 'เล่นเสียงเวทมนตร์ (Chime!)', code: 'sound_chime', color: 'bg-rose-500' },
        { id: 'p_st10', category: 'looks', name: 'พูดว่า [วาดดาว 5 แฉกสำเร็จแล้ว! ⭐]', code: 'say:วาดดาว 5 แฉกสำเร็จแล้ว! ⭐', color: 'bg-purple-600' },
      ]);
    } else if (presetName === 'circle') {
      setScriptBlocks([
        { id: 'p_c1', category: 'events', name: 'เมื่อคลิก ธงเขียว', code: 'start', color: 'bg-amber-500' },
        { id: 'p_c2', category: 'pen', name: 'ลบทั้งหมด (Erase All)', code: 'erase_all', color: 'bg-emerald-600' },
        { id: 'p_c3', category: 'motion', name: 'ไปที่ x: 0 y: -40', code: 'goto:0,-40', color: 'bg-blue-600', customType: 'goto', val1: 0, val2: -40 },
        { id: 'p_c4', category: 'pen', name: 'ตั้งค่าสีปากกาเป็น [สีม่วง]', code: 'set_color:#9333ea', color: 'bg-emerald-600' },
        { id: 'p_c5', category: 'pen', name: 'กำหนดขนาดปากกาเป็น (4)', code: 'set_size:4', color: 'bg-emerald-600' },
        { id: 'p_c6', category: 'pen', name: 'จรดปากกา (Pen Down)', code: 'pen_down', color: 'bg-emerald-600' },
        { id: 'p_c7', category: 'control', name: 'ทำซ้ำ (36) รอบ [วาดวงกลมเรขาคณิต]', code: 'repeat_circle:36', color: 'bg-amber-600' },
        { id: 'p_c8', category: 'pen', name: 'ยกปากกา (Pen Up)', code: 'pen_up', color: 'bg-emerald-600' },
        { id: 'p_c9', category: 'looks', name: 'พูดว่า [วาดวงกลม 360 องศาสำเร็จแล้ว! ⭕]', code: 'say:วาดวงกลม 360 องศาสำเร็จแล้ว! ⭕', color: 'bg-purple-600' },
      ]);
    } else if (presetName === 'pinwheel') {
      setScriptBlocks([
        { id: 'p_pw1', category: 'events', name: 'เมื่อคลิก ธงเขียว', code: 'start', color: 'bg-amber-500' },
        { id: 'p_pw2', category: 'pen', name: 'ลบทั้งหมด (Erase All)', code: 'erase_all', color: 'bg-emerald-600' },
        { id: 'p_pw3', category: 'motion', name: 'ไปที่ x: 0 y: 0', code: 'goto:0,0', color: 'bg-blue-600', customType: 'goto', val1: 0, val2: 0 },
        { id: 'p_pw4', category: 'pen', name: 'ตั้งค่าสีปากกาเป็น [สีแดง]', code: 'set_color:#dc2626', color: 'bg-emerald-600' },
        { id: 'p_pw5', category: 'pen', name: 'จรดปากกา (Pen Down)', code: 'pen_down', color: 'bg-emerald-600' },
        { id: 'p_pw6', category: 'control', name: 'ทำซ้ำ (8) รอบ [วาดกังหัน 8 ทิศ]', code: 'repeat_pinwheel:8', color: 'bg-amber-600' },
        { id: 'p_pw7', category: 'pen', name: 'ยกปากกา (Pen Up)', code: 'pen_up', color: 'bg-emerald-600' },
        { id: 'p_pw8', category: 'control', name: 'เล่นเสียงเวทมนตร์ (Chime!)', code: 'sound_chime', color: 'bg-rose-500' },
      ]);
    } else if (presetName === 'intro') {
      setScriptBlocks([
        { id: 'p_in1', category: 'events', name: 'เมื่อคลิก ธงเขียว', code: 'start', color: 'bg-amber-500' },
        { id: 'p_in2', category: 'motion', name: 'ไปที่ x: 0 y: 0 (จุดกึ่งกลาง)', code: 'goto:0,0', color: 'bg-blue-600' },
        { id: 'p_in3', category: 'motion', name: 'เคลื่อนที่ (40) ก้าว', code: 'move:40', color: 'bg-blue-600' },
        { id: 'p_in4', category: 'looks', name: 'พูดว่า [ยินดีต้อนรับสู่โลกวิทยาการคำนวณ!]', code: 'say:ยินดีต้อนรับสู่โลกวิทยาการคำนวณ!', color: 'bg-purple-600' },
        { id: 'p_in5', category: 'control', name: 'เล่นเสียงเหมียว (Meow!)', code: 'sound_meow', color: 'bg-rose-500' },
        { id: 'p_in6', category: 'control', name: 'เปลี่ยน คะแนน เพิ่มขึ้น (10)', code: 'score:10', color: 'bg-amber-600' },
      ]);
    }
  };

  const playMeowSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.36);
    } catch {
      // Audio fallback
    }
  };

  const playChimeSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.26);
      });
    } catch {
      // Audio fallback
    }
  };

  // Dedicated Canvas Renderer
  const drawStage = useCallback(
    (
      trails: PenTrail[],
      pos: { x: number; y: number; dir: number; costume: number },
      penDown: boolean,
      color: string,
      size: number
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2;

      // 1. Clear background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // 2. Subtle Grid background
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 3. Coordinate Axes
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(w, centerY);
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, h);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('(0, 0)', centerX + 4, centerY - 6);
      ctx.fillText('x: 200', w - 42, centerY - 6);
      ctx.fillText('x: -200', 8, centerY - 6);
      ctx.fillText('y: 120', centerX + 4, 18);
      ctx.fillText('y: -120', centerX + 4, h - 8);

      // 4. Draw Pen Trails (High contrast, rounded joins)
      trails.forEach((trail) => {
        ctx.strokeStyle = trail.color || '#2563eb';
        ctx.lineWidth = trail.size || 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX + trail.x1, centerY + trail.y1);
        ctx.lineTo(centerX + trail.x2, centerY + trail.y2);
        ctx.stroke();
      });

      // 5. Draw Sprite
      const spriteCanvasX = centerX + pos.x;
      const spriteCanvasY = centerY + pos.y;

      ctx.save();
      ctx.translate(spriteCanvasX, spriteCanvasY);
      ctx.rotate(((pos.dir - 90) * Math.PI) / 180);

      // Pen tip indicator below cat
      if (penDown) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 18, Math.max(4, size), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Cat Face/Head circle
      ctx.fillStyle = '#f97316'; // Scratch orange
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(-13, -11);
      ctx.lineTo(-20, -25);
      ctx.lineTo(-5, -16);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(13, -11);
      ctx.lineTo(20, -25);
      ctx.lineTo(5, -16);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-6, -3, 5, 0, Math.PI * 2);
      ctx.arc(6, -3, 5, 0, Math.PI * 2);
      ctx.fill();

      // Pupils
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(-5, -3, 2.5, 0, Math.PI * 2);
      ctx.arc(7, -3, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.arc(0, 3, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Whiskers
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-10, 3);
      ctx.lineTo(-22, 1);
      ctx.moveTo(-10, 6);
      ctx.lineTo(-22, 7);
      ctx.moveTo(10, 3);
      ctx.lineTo(22, 1);
      ctx.moveTo(10, 6);
      ctx.lineTo(22, 7);
      ctx.stroke();

      ctx.restore();
    },
    []
  );

  const resetStage = () => {
    penTrailsRef.current = [];
    spritePosRef.current = { x: -40, y: -40, dir: 90, costume: 0 };
    isPenDownRef.current = false;
    setSpritePos({ x: -40, y: -40, dir: 90, costume: 0 });
    setSpeechBubble('พร้อมรันสคริปต์ใหม่แล้ว!');
    setPenTrails([]);
    setIsPenDown(false);
    setScore(0);
    setIsRunning(false);
    setActiveBlockId(null);
    drawStage([], { x: -40, y: -40, dir: 90, costume: 0 }, false, penColor, penSize);
  };

  // Run script with interactive animation and live pen trails
  const runScript = async () => {
    if (isRunning || scriptBlocks.length === 0) return;
    setIsRunning(true);

    let curX = spritePos.x;
    let curY = spritePos.y;
    let curDir = spritePos.dir;
    let penActive = isPenDownRef.current || isPenDown;
    let curColor = penColor;
    let curSize = penSize;

    for (let i = 0; i < scriptBlocks.length; i++) {
      const block = scriptBlocks[i];
      setActiveBlockId(block.id);

      // Brief pause between blocks for student to trace
      await new Promise((r) => setTimeout(r, 260));

      if (block.code === 'start') {
        setSpeechBubble('🚩 เริ่มรันโปรแกรมตามลำดับสคริปต์!');
        await new Promise((r) => setTimeout(r, 220));
      } else if (block.code.startsWith('move:')) {
        const steps = parseInt(block.code.split(':')[1], 10) || 40;
        const rad = (curDir * Math.PI) / 180;
        const nextX = Math.round(curX + steps * Math.sin(rad));
        const nextY = Math.round(curY - steps * Math.cos(rad));

        const clampedX = Math.max(-210, Math.min(210, nextX));
        const clampedY = Math.max(-140, Math.min(140, nextY));

        if (penActive) {
          const newTrail: PenTrail = {
            x1: curX,
            y1: curY,
            x2: clampedX,
            y2: clampedY,
            color: curColor,
            size: curSize,
          };
          penTrailsRef.current.push(newTrail);
          setPenTrails([...penTrailsRef.current]);
        }

        curX = clampedX;
        curY = clampedY;
        const newPos = { x: curX, y: curY, dir: curDir, costume: (spritePosRef.current.costume + 1) % 2 };
        spritePosRef.current = newPos;
        setSpritePos(newPos);
        drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
      } else if (block.code.startsWith('turn:')) {
        const deg = parseInt(block.code.split(':')[1], 10) || 45;
        curDir = (curDir + deg) % 360;
        if (curDir < 0) curDir += 360;
        const newPos = { ...spritePosRef.current, dir: curDir };
        spritePosRef.current = newPos;
        setSpritePos(newPos);
        drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
      } else if (block.code.startsWith('point:')) {
        curDir = parseInt(block.code.split(':')[1], 10);
        if (isNaN(curDir)) curDir = 90;
        const newPos = { ...spritePosRef.current, dir: curDir };
        spritePosRef.current = newPos;
        setSpritePos(newPos);
        drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
      } else if (block.code.startsWith('goto:')) {
        const target = block.code.split(':')[1];
        let targetX = 0;
        let targetY = 0;

        if (target === 'random') {
          targetX = Math.round(Math.random() * 260 - 130);
          targetY = Math.round(Math.random() * 180 - 90);
        } else {
          const parts = target.split(',');
          targetX = parseInt(parts[0], 10);
          targetY = parseInt(parts[1], 10);
          if (isNaN(targetX)) targetX = 0;
          if (isNaN(targetY)) targetY = 0;
        }

        const clampedX = Math.max(-210, Math.min(210, targetX));
        const clampedY = Math.max(-140, Math.min(140, targetY));

        if (penActive) {
          const newTrail: PenTrail = {
            x1: curX,
            y1: curY,
            x2: clampedX,
            y2: clampedY,
            color: curColor,
            size: curSize,
          };
          penTrailsRef.current.push(newTrail);
          setPenTrails([...penTrailsRef.current]);
        }

        curX = clampedX;
        curY = clampedY;
        const newPos = { x: curX, y: curY, dir: curDir, costume: spritePosRef.current.costume };
        spritePosRef.current = newPos;
        setSpritePos(newPos);
        drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
      } else if (block.code.startsWith('say:')) {
        const text = block.code.split(':')[1] || '';
        setSpeechBubble(text);
      } else if (block.code === 'pen_down') {
        penActive = true;
        isPenDownRef.current = true;
        setIsPenDown(true);
        drawStage(penTrailsRef.current, spritePosRef.current, true, curColor, curSize);
      } else if (block.code === 'pen_up') {
        penActive = false;
        isPenDownRef.current = false;
        setIsPenDown(false);
        drawStage(penTrailsRef.current, spritePosRef.current, false, curColor, curSize);
      } else if (block.code === 'erase_all') {
        penTrailsRef.current = [];
        setPenTrails([]);
        drawStage([], spritePosRef.current, penActive, curColor, curSize);
      } else if (block.code.startsWith('set_color:')) {
        const hex = block.code.split(':')[1];
        if (hex) {
          curColor = hex;
          setPenColor(hex);
          drawStage(penTrailsRef.current, spritePosRef.current, penActive, curColor, curSize);
        }
      } else if (block.code === 'random_color') {
        const randomHex = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].hex;
        curColor = randomHex;
        setPenColor(randomHex);
        drawStage(penTrailsRef.current, spritePosRef.current, penActive, curColor, curSize);
      } else if (block.code.startsWith('set_size:')) {
        const sz = parseInt(block.code.split(':')[1], 10) || 5;
        curSize = sz;
        setPenSize(sz);
        drawStage(penTrailsRef.current, spritePosRef.current, penActive, curColor, curSize);
      } else if (block.code.startsWith('repeat_walk:')) {
        // Repeat walk: walk steps count times (e.g. เดินหน้า 10 ก้าว จำนวน 5 รอบ)
        const parts = block.code.split(':');
        const count = parseInt(parts[1], 10) || 5;
        const steps = parseInt(parts[2], 10) || 10;

        for (let s = 0; s < count; s++) {
          const rad = (curDir * Math.PI) / 180;
          const nx = Math.max(-210, Math.min(210, Math.round(curX + steps * Math.sin(rad))));
          const ny = Math.max(-140, Math.min(140, Math.round(curY - steps * Math.cos(rad))));

          if (penActive) {
            const newTrail: PenTrail = {
              x1: curX,
              y1: curY,
              x2: nx,
              y2: ny,
              color: curColor,
              size: curSize,
            };
            penTrailsRef.current.push(newTrail);
            setPenTrails([...penTrailsRef.current]);
          }

          curX = nx;
          curY = ny;
          const newPos = { x: curX, y: curY, dir: curDir, costume: s % 2 };
          spritePosRef.current = newPos;
          setSpritePos(newPos);
          drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
          await new Promise((r) => setTimeout(r, 220));
        }
      } else if (block.code.startsWith('repeat:')) {
        // Parameterized Repeat: if subsequent blocks exist (e.g. ก้าว 10 ก้าว), repeat them; otherwise draw polygon
        const count = parseInt(block.code.split(':')[1], 10) || 4;
        const remaining = scriptBlocks.slice(i + 1);
        const loopActions: ProgramBlock[] = [];
        for (const sub of remaining) {
          if (sub.code.startsWith('repeat') || sub.code === 'start') break;
          loopActions.push(sub);
        }

        if (loopActions.length > 0 && loopActions.length <= 4) {
          for (let loopIdx = 0; loopIdx < count; loopIdx++) {
            for (const subBlock of loopActions) {
              setActiveBlockId(subBlock.id);
              await new Promise((r) => setTimeout(r, 180));
              
              if (subBlock.code.startsWith('move:')) {
                const steps = parseInt(subBlock.code.split(':')[1], 10) || 10;
                const rad = (curDir * Math.PI) / 180;
                const nx = Math.max(-210, Math.min(210, Math.round(curX + steps * Math.sin(rad))));
                const ny = Math.max(-140, Math.min(140, Math.round(curY - steps * Math.cos(rad))));
                if (penActive) {
                  penTrailsRef.current.push({ x1: curX, y1: curY, x2: nx, y2: ny, color: curColor, size: curSize });
                  setPenTrails([...penTrailsRef.current]);
                }
                curX = nx;
                curY = ny;
              } else if (subBlock.code.startsWith('turn:')) {
                const deg = parseInt(subBlock.code.split(':')[1], 10) || 45;
                curDir = (curDir + deg) % 360;
                if (curDir < 0) curDir += 360;
              } else if (subBlock.code.startsWith('point:')) {
                curDir = parseInt(subBlock.code.split(':')[1], 10) || 90;
              }
              
              const newPos = { x: curX, y: curY, dir: curDir, costume: loopIdx % 2 };
              spritePosRef.current = newPos;
              setSpritePos(newPos);
              drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
            }
          }
          i += loopActions.length;
        } else {
          const turnAngle = Math.round(360 / Math.max(1, count));
          const sideLength = count >= 20 ? 12 : count >= 10 ? 25 : count >= 6 ? 50 : 75;

          for (let s = 0; s < count; s++) {
            const rad = (curDir * Math.PI) / 180;
            const nx = Math.max(-210, Math.min(210, Math.round(curX + sideLength * Math.sin(rad))));
            const ny = Math.max(-140, Math.min(140, Math.round(curY - sideLength * Math.cos(rad))));

            if (penActive) {
              const newTrail: PenTrail = {
                x1: curX,
                y1: curY,
                x2: nx,
                y2: ny,
                color: curColor,
                size: curSize,
              };
              penTrailsRef.current.push(newTrail);
              setPenTrails([...penTrailsRef.current]);
            }

            curX = nx;
            curY = ny;
            curDir = (curDir + turnAngle) % 360;
            if (curDir < 0) curDir += 360;
            const newPos = { x: curX, y: curY, dir: curDir, costume: s % 2 };
            spritePosRef.current = newPos;
            setSpritePos(newPos);
            drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
            await new Promise((r) => setTimeout(r, Math.max(50, Math.min(260, 1000 / count))));
          }
        }
      } else if (block.code === 'repeat_square:4') {
        // Repeat 4: Move 80 steps, turn 90° to form a complete square
        const sideLength = 80;
        for (let s = 0; s < 4; s++) {
          const rad = (curDir * Math.PI) / 180;
          const nx = Math.round(curX + sideLength * Math.sin(rad));
          const ny = Math.round(curY - sideLength * Math.cos(rad));

          if (penActive) {
            const newTrail: PenTrail = {
              x1: curX,
              y1: curY,
              x2: nx,
              y2: ny,
              color: curColor,
              size: curSize,
            };
            penTrailsRef.current.push(newTrail);
            setPenTrails([...penTrailsRef.current]);
          }

          curX = nx;
          curY = ny;
          curDir = (curDir + 90) % 360;
          const newPos = { x: curX, y: curY, dir: curDir, costume: s % 2 };
          spritePosRef.current = newPos;
          setSpritePos(newPos);
          drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
          await new Promise((r) => setTimeout(r, 260));
        }
      } else if (block.code === 'repeat_triangle:3') {
        // Repeat 3: Move 90, turn 120
        const sideLength = 90;
        for (let s = 0; s < 3; s++) {
          const rad = (curDir * Math.PI) / 180;
          const nx = Math.round(curX + sideLength * Math.sin(rad));
          const ny = Math.round(curY - sideLength * Math.cos(rad));

          if (penActive) {
            const newTrail: PenTrail = {
              x1: curX,
              y1: curY,
              x2: nx,
              y2: ny,
              color: curColor,
              size: curSize,
            };
            penTrailsRef.current.push(newTrail);
            setPenTrails([...penTrailsRef.current]);
          }

          curX = nx;
          curY = ny;
          curDir = (curDir + 120) % 360;
          const newPos = { x: curX, y: curY, dir: curDir, costume: s % 2 };
          spritePosRef.current = newPos;
          setSpritePos(newPos);
          drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
          await new Promise((r) => setTimeout(r, 260));
        }
      } else if (block.code === 'repeat_star:5') {
        // Repeat 5: 5-pointed star (length 75, turn 144°)
        const length = 75;
        for (let s = 0; s < 5; s++) {
          const rad = (curDir * Math.PI) / 180;
          const nx = Math.round(curX + length * Math.sin(rad));
          const ny = Math.round(curY - length * Math.cos(rad));

          if (penActive) {
            const newTrail: PenTrail = {
              x1: curX,
              y1: curY,
              x2: nx,
              y2: ny,
              color: curColor,
              size: curSize,
            };
            penTrailsRef.current.push(newTrail);
            setPenTrails([...penTrailsRef.current]);
          }

          curX = nx;
          curY = ny;
          curDir = (curDir + 144) % 360;
          const newPos = { x: curX, y: curY, dir: curDir, costume: s % 2 };
          spritePosRef.current = newPos;
          setSpritePos(newPos);
          drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
          await new Promise((r) => setTimeout(r, 220));
        }
      } else if (block.code === 'repeat_circle:36') {
        // Repeat 36: Circle (step 7, turn 10°)
        for (let s = 0; s < 36; s++) {
          const rad = (curDir * Math.PI) / 180;
          const nx = Math.round(curX + 7 * Math.sin(rad));
          const ny = Math.round(curY - 7 * Math.cos(rad));

          if (penActive) {
            const newTrail: PenTrail = {
              x1: curX,
              y1: curY,
              x2: nx,
              y2: ny,
              color: curColor,
              size: curSize,
            };
            penTrailsRef.current.push(newTrail);
            setPenTrails([...penTrailsRef.current]);
          }

          curX = nx;
          curY = ny;
          curDir = (curDir + 10) % 360;
          const newPos = { x: curX, y: curY, dir: curDir, costume: s % 2 };
          spritePosRef.current = newPos;
          setSpritePos(newPos);
          drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
          await new Promise((r) => setTimeout(r, 35));
        }
      } else if (block.code === 'repeat_pinwheel:8') {
        // Repeat 8: Pinwheel (step 55, turn 135°)
        for (let s = 0; s < 8; s++) {
          const rad = (curDir * Math.PI) / 180;
          const nx = Math.round(curX + 55 * Math.sin(rad));
          const ny = Math.round(curY - 55 * Math.cos(rad));

          if (penActive) {
            const newTrail: PenTrail = {
              x1: curX,
              y1: curY,
              x2: nx,
              y2: ny,
              color: curColor,
              size: curSize,
            };
            penTrailsRef.current.push(newTrail);
            setPenTrails([...penTrailsRef.current]);
          }

          curX = nx;
          curY = ny;
          curDir = (curDir + 135) % 360;
          const newPos = { x: curX, y: curY, dir: curDir, costume: s % 2 };
          spritePosRef.current = newPos;
          setSpritePos(newPos);
          drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
          await new Promise((r) => setTimeout(r, 160));
        }
      } else if (block.code.startsWith('score:')) {
        const pts = parseInt(block.code.split(':')[1], 10) || 10;
        setScore((prev) => prev + pts);
        confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
      } else if (block.code === 'sound_meow') {
        playMeowSound();
      } else if (block.code === 'sound_chime') {
        playChimeSound();
      } else if (block.code === 'next_costume') {
        const newPos = { ...spritePosRef.current, costume: (spritePosRef.current.costume + 1) % 2 };
        spritePosRef.current = newPos;
        setSpritePos(newPos);
        drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
      } else if (block.code === 'bounce') {
        curDir = (curDir + 180) % 360;
        const newPos = { ...spritePosRef.current, dir: curDir };
        spritePosRef.current = newPos;
        setSpritePos(newPos);
        drawStage(penTrailsRef.current, newPos, penActive, curColor, curSize);
      } else if (block.code.startsWith('wait:')) {
        const ms = parseInt(block.code.split(':')[1], 10) || 500;
        setSpeechBubble(`⏳ รอ ${(ms / 1000).toFixed(1)} วินาที...`);
        await new Promise((r) => setTimeout(r, ms));
      }
    }

    setActiveBlockId(null);
    setIsRunning(false);
    addPoints(25);
    onComplete();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    drawStage(penTrailsRef.current, spritePosRef.current, penActive, curColor, curSize);
  };

  const addBlockToScript = (block: ProgramBlock) => {
    if (isRunning) return;
    const newBlock: ProgramBlock = {
      ...block,
      id: Math.random().toString(),
    };

    if (block.customType === 'goto') {
      newBlock.val1 = paletteInputs.gotoX;
      newBlock.val2 = paletteInputs.gotoY;
      newBlock.code = `goto:${paletteInputs.gotoX},${paletteInputs.gotoY}`;
      newBlock.name = `ไปที่ x: ${paletteInputs.gotoX} y: ${paletteInputs.gotoY}`;
    } else if (block.customType === 'turn_cw') {
      newBlock.val1 = paletteInputs.turnCwDeg;
      newBlock.code = `turn:${paletteInputs.turnCwDeg}`;
      newBlock.name = `หมุนตามเข็ม (${paletteInputs.turnCwDeg}) องศา`;
    } else if (block.customType === 'turn_ccw') {
      newBlock.val1 = paletteInputs.turnCcwDeg;
      newBlock.code = `turn:-${paletteInputs.turnCcwDeg}`;
      newBlock.name = `หมุนทวนเข็ม (${paletteInputs.turnCcwDeg}) องศา`;
    } else if (block.customType === 'repeat_walk') {
      newBlock.val1 = paletteInputs.repeatCount;
      newBlock.val2 = paletteInputs.repeatWalkSteps;
      newBlock.code = `repeat_walk:${paletteInputs.repeatCount}:${paletteInputs.repeatWalkSteps}`;
      newBlock.name = `ทำซ้ำ (${paletteInputs.repeatCount}) รอบ (เดิน ${paletteInputs.repeatWalkSteps} ก้าว)`;
    } else if (block.customType === 'repeat') {
      newBlock.val1 = paletteInputs.repeatCount;
      newBlock.code = `repeat:${paletteInputs.repeatCount}`;
      newBlock.name = `ทำซ้ำ (${paletteInputs.repeatCount}) รอบ`;
    } else if (block.customType === 'move') {
      newBlock.val1 = paletteInputs.moveSteps;
      newBlock.code = `move:${paletteInputs.moveSteps}`;
      newBlock.name = `ก้าว (${paletteInputs.moveSteps}) ก้าว`;
    } else if (block.customType === 'wait') {
      const sec = paletteInputs.waitSec > 0 ? paletteInputs.waitSec : 1;
      newBlock.val1 = sec;
      newBlock.code = `wait:${Math.round(sec * 1000)}`;
      newBlock.name = `รอ (${sec}) วินาที`;
    } else if (block.customType === 'custom_color') {
      newBlock.colorVal = paletteInputs.penColorCustom;
      newBlock.code = `set_color:${paletteInputs.penColorCustom}`;
      newBlock.name = `ตั้งค่าสีปากกาเป็น [${paletteInputs.penColorCustom}]`;
    }

    setScriptBlocks((prev) => [...prev, newBlock]);
  };

  const updateScriptBlockParams = (index: number, val1?: number, val2?: number) => {
    if (isRunning) return;
    setScriptBlocks((prev) => {
      const next = [...prev];
      const b = { ...next[index] };
      if (val1 !== undefined) b.val1 = val1;
      if (val2 !== undefined) b.val2 = val2;

      if (b.customType === 'goto') {
        const x = b.val1 ?? 0;
        const y = b.val2 ?? 0;
        b.code = `goto:${x},${y}`;
        b.name = `ไปที่ x: ${x} y: ${y}`;
      } else if (b.customType === 'turn_cw') {
        const deg = b.val1 ?? 90;
        b.code = `turn:${deg}`;
        b.name = `หมุนตามเข็ม (${deg}) องศา`;
      } else if (b.customType === 'turn_ccw') {
        const deg = b.val1 ?? 90;
        b.code = `turn:-${deg}`;
        b.name = `หมุนทวนเข็ม (${deg}) องศา`;
      } else if (b.customType === 'repeat_walk') {
        const count = b.val1 ?? 5;
        const steps = b.val2 ?? 10;
        b.code = `repeat_walk:${count}:${steps}`;
        b.name = `ทำซ้ำ (${count}) รอบ (เดิน ${steps} ก้าว)`;
      } else if (b.customType === 'repeat') {
        const count = b.val1 ?? 4;
        b.code = `repeat:${count}`;
        b.name = `ทำซ้ำ (${count}) รอบ`;
      } else if (b.customType === 'move') {
        const steps = b.val1 ?? 10;
        b.code = `move:${steps}`;
        b.name = `ก้าว (${steps}) ก้าว`;
      } else if (b.customType === 'wait') {
        const sec = val1 !== undefined && val1 > 0 ? val1 : 1;
        b.val1 = sec;
        b.code = `wait:${Math.round(sec * 1000)}`;
        b.name = `รอ (${sec}) วินาที`;
      }

      next[index] = b;
      return next;
    });
  };

  const updateScriptBlockColor = (index: number, newColor: string) => {
    if (isRunning) return;
    setScriptBlocks((prev) => {
      const next = [...prev];
      const b = { ...next[index] };
      b.colorVal = newColor;
      b.code = `set_color:${newColor}`;
      b.name = `ตั้งค่าสีปากกาเป็น [${newColor}]`;
      next[index] = b;
      return next;
    });
  };

  const removeScriptBlock = (index: number) => {
    if (isRunning) return;
    setScriptBlocks((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Redraw on canvas on any component render or state change
  useEffect(() => {
    drawStage(penTrailsRef.current, spritePos, isPenDown, penColor, penSize);
  }, [drawStage, spritePos, penTrails, isPenDown, penColor, penSize]);

  const filteredBlocks = availableBlocks.filter((b) => {
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
      {/* Header with Project Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              สตูดิโอเขียนโปรแกรมแบบบล็อก
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">สพฐ. / สสวท. ว 4.2</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Scratch Visual Programming Studio 🐱
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            ต่อบล็อกคำสั่งควบคุมตัวละครแมวส้ม วาดภาพเรขาคณิตด้วยปากกาหลากสี ลูปทำซ้ำ และระบบพิกัด x, y
          </p>
        </div>

        {/* Project Presets Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
            <span className="text-[11px] font-semibold text-slate-500 px-2">พรีเซ็ตตัวอย่าง:</span>
            <button
              type="button"
              onClick={() => loadPreset('square')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activePreset === 'square'
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400 scale-[1.02]'
                  : 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm hover:brightness-105'
              }`}
            >
              <span>⏹️ สี่เหลี่ยม (Loop 4)</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('star')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activePreset === 'star'
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400 scale-[1.02]'
                  : 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-sm hover:brightness-105'
              }`}
            >
              <span>⭐ ดาว 5 แฉก</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('circle')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activePreset === 'circle'
                  ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400 scale-[1.02]'
                  : 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm hover:brightness-105'
              }`}
            >
              <span>⭕ วงกลม (Loop 36)</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('pinwheel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activePreset === 'pinwheel'
                  ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400 scale-[1.02]'
                  : 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-300 shadow-sm hover:brightness-105'
              }`}
            >
              <span>🌸 กังหัน 8 ทิศ</span>
            </button>
            <button
              type="button"
              onClick={() => loadPreset('intro')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activePreset === 'intro'
                  ? 'bg-slate-800 text-white shadow-md ring-2 ring-slate-400 scale-[1.02]'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm hover:brightness-105'
              }`}
            >
              <span>👋 ทักทาย</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Code Explanation Banner */}
      {(() => {
        const exp = SCRATCH_PRESET_EXPLANATIONS[activePreset] || SCRATCH_PRESET_EXPLANATIONS.square;
        return (
          <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-xs text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <span className="p-1.5 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200">
                    คำอธิบายโค้ดตัวอย่าง: {exp.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-medium text-[11px]">
                    {exp.concept}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] sm:text-xs mt-1 leading-relaxed">
                  {exp.explanation}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/50 font-medium">
              💡 {exp.tip}
            </div>
          </div>
        );
      })()}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Scratch Stage Canvas + Pen Color Selector */}
        <div className="lg:col-span-6 flex flex-col items-center space-y-4">
          {/* Stage Controls Header */}
          <div className="w-full flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={runScript}
                disabled={isRunning || scriptBlocks.length === 0}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="คลิกธงเขียวเพื่อรันโปรแกรม"
              >
                <Flag className="w-4 h-4 fill-white" />
                <span>รันโปรแกรม</span>
              </button>
              <button
                type="button"
                onClick={resetStage}
                className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="หยุดและรีเซ็ตเวที"
              >
                <Octagon className="w-4 h-4 fill-white" />
                <span>รีเซ็ต</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  penTrailsRef.current = [];
                  setPenTrails([]);
                  drawStage([], spritePos, isPenDown, penColor, penSize);
                }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
                title="ลบเฉพาะรอยวาด"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบรอยวาด</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-500 font-mono tabular-nums">
              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-sans font-bold text-[11px]">
                รอยวาด: {penTrails.length} เส้น
              </span>
              <span>X: {spritePos.x}</span>
              <span>Y: {spritePos.y}</span>
              <span>ทิศ: {spritePos.dir}°</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">แต้ม: {score}</span>
            </div>
          </div>

          {/* Interactive Canvas Viewport */}
          <div className="relative w-full max-w-[480px] aspect-[480/320] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={480}
              height={320}
              className="w-full h-full block"
            />

            {/* Speech bubble overlay */}
            {speechBubble && (
              <div className="absolute top-4 left-6 max-w-[280px] p-3 rounded-2xl bg-white border border-slate-300 shadow-xl text-xs text-slate-800 font-bold animate-in fade-in zoom-in duration-200">
                {speechBubble}
                <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-b border-r border-slate-300 transform rotate-45" />
              </div>
            )}
          </div>

          {/* Dedicated Pen Color & Size Toolbar */}
          <div className="w-full max-w-[480px] p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-500" />
                <span>เลือกสีปากกา (Pen Color Palette):</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: penColor }}
                />
                <span className="font-mono text-[11px] text-slate-500">{penColor}</span>
              </div>
            </div>

            {/* Quick Color Swatches */}
            <div className="flex items-center justify-between gap-1.5 overflow-x-auto py-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => {
                    setPenColor(c.hex);
                    // Also inject into active script if not running
                  }}
                  className={`w-7 h-7 rounded-full transition-transform active:scale-90 cursor-pointer flex items-center justify-center border-2 ${
                    penColor === c.hex ? 'border-slate-900 dark:border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={`เลือกสี${c.label}`}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  const randomHex = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].hex;
                  setPenColor(randomHex);
                }}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white cursor-pointer hover:opacity-90 transition-opacity"
                title="สุ่มสีรุ้ง"
              >
                สุ่มสี
              </button>
            </div>

            {/* Pen Size & Status Indicator */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span>ขนาดปากกา:</span>
                <div className="flex items-center gap-1">
                  {[2, 4, 8].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setPenSize(sz)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                        penSize === sz
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px]">สถานะ:</span>
                <span className={`font-bold text-[11px] ${isPenDown ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {isPenDown ? '● จรดปากกา' : '○ ยกปากกา'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Block Script Editor & Palette */}
        <div className="lg:col-span-6 space-y-5">
          {/* Category Tabs for Palette */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>คลังบล็อกคำสั่ง (คลิก + เพื่อเพิ่มในสคริปต์)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {filteredBlocks.length} บล็อก
              </span>
            </div>

            <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('events')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCategory === 'events'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-700'
                }`}
              >
                🚩 เหตุการณ์
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('motion')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCategory === 'motion'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700'
                }`}
              >
                🔵 เคลื่อนที่
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('pen')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCategory === 'pen'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700'
                }`}
              >
                🟢 ปากกา &amp; สี
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('control')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCategory === 'control'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-700'
                }`}
              >
                🟡 ทำซ้ำ (Loop)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('looks')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCategory === 'looks'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-700'
                }`}
              >
                🟣 พูด &amp; เสียง
              </button>
            </div>

            {/* Palette Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[235px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredBlocks.map((b) => {
                if (b.customType === 'goto') {
                  return (
                    <div
                      key={b.id}
                      className={`p-2 rounded-xl text-white text-xs font-mono font-medium flex items-center justify-between shadow-sm ${b.color}`}
                      title={b.desc || b.name}
                    >
                      <div className="flex items-center gap-1">
                        <span>ไปที่ x:</span>
                        <input
                          type="number"
                          value={paletteInputs.gotoX}
                          onChange={(e) =>
                            setPaletteInputs((prev) => ({
                              ...prev,
                              gotoX: parseInt(e.target.value) || 0,
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                        />
                        <span>y:</span>
                        <input
                          type="number"
                          value={paletteInputs.gotoY}
                          onChange={(e) =>
                            setPaletteInputs((prev) => ({
                              ...prev,
                              gotoY: parseInt(e.target.value) || 0,
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => addBlockToScript(b)}
                        disabled={isRunning}
                        className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-all cursor-pointer ml-1 shrink-0"
                        title="เพิ่มลงในสคริปต์"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                }

                if (b.customType === 'turn_cw') {
                  return (
                    <div
                      key={b.id}
                      className={`p-2 rounded-xl text-white text-xs font-mono font-medium flex items-center justify-between shadow-sm ${b.color}`}
                      title={b.desc || b.name}
                    >
                      <div className="flex items-center gap-1 truncate">
                        <span>หมุนตามเข็ม ↻</span>
                        <input
                          type="number"
                          value={paletteInputs.turnCwDeg}
                          onChange={(e) =>
                            setPaletteInputs((prev) => ({
                              ...prev,
                              turnCwDeg: parseInt(e.target.value) || 0,
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-14 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                        />
                        <span>°</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addBlockToScript(b)}
                        disabled={isRunning}
                        className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-all cursor-pointer ml-1 shrink-0"
                        title="เพิ่มลงในสคริปต์"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                }

                if (b.customType === 'turn_ccw') {
                  return (
                    <div
                      key={b.id}
                      className={`p-2 rounded-xl text-white text-xs font-mono font-medium flex items-center justify-between shadow-sm ${b.color}`}
                      title={b.desc || b.name}
                    >
                      <div className="flex items-center gap-1 truncate">
                        <span>หมุนทวนเข็ม ↺</span>
                        <input
                          type="number"
                          value={paletteInputs.turnCcwDeg}
                          onChange={(e) =>
                            setPaletteInputs((prev) => ({
                              ...prev,
                              turnCcwDeg: parseInt(e.target.value) || 0,
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-14 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                        />
                        <span>°</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addBlockToScript(b)}
                        disabled={isRunning}
                        className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-all cursor-pointer ml-1 shrink-0"
                        title="เพิ่มลงในสคริปต์"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                }

                if (b.customType === 'repeat') {
                  return (
                    <div
                      key={b.id}
                      className={`p-2 rounded-xl text-white text-xs font-mono font-medium flex items-center justify-between shadow-sm ${b.color}`}
                      title={b.desc || b.name}
                    >
                      <div className="flex items-center gap-1 truncate">
                        <span>ทำซ้ำ</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={paletteInputs.repeatCount}
                          onChange={(e) =>
                            setPaletteInputs((prev) => ({
                              ...prev,
                              repeatCount: Math.max(1, parseInt(e.target.value) || 1),
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                        />
                        <span>รอบ</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addBlockToScript(b)}
                        disabled={isRunning}
                        className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-all cursor-pointer ml-1 shrink-0"
                        title="เพิ่มลงในสคริปต์"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                }

                if (b.customType === 'custom_color') {
                  return (
                    <div
                      key={b.id}
                      className={`p-2 rounded-xl text-white text-xs font-mono font-medium flex items-center justify-between shadow-sm ${b.color}`}
                      title={b.desc || b.name}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span>กำหนดสีปากกา:</span>
                        <label className="relative flex items-center cursor-pointer">
                          <input
                            type="color"
                            value={paletteInputs.penColorCustom}
                            onChange={(e) =>
                              setPaletteInputs((prev) => ({
                                ...prev,
                                penColorCustom: e.target.value,
                              }))
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="w-6 h-6 rounded-md border-2 border-white cursor-pointer shadow-sm p-0 bg-transparent"
                          />
                        </label>
                        <span className="font-mono text-[11px] opacity-90">{paletteInputs.penColorCustom}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addBlockToScript(b)}
                        disabled={isRunning}
                        className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-all cursor-pointer ml-1 shrink-0"
                        title="เพิ่มลงในสคริปต์"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                }

                if (b.customType === 'repeat_walk') {
                  return (
                    <div
                      key={b.id}
                      className={`p-2 rounded-xl text-white text-xs font-mono font-medium flex items-center justify-between shadow-sm ${b.color}`}
                      title={b.desc || b.name}
                    >
                      <div className="flex items-center gap-1 text-[11px] truncate">
                        <span>ทำซ้ำ</span>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={paletteInputs.repeatCount}
                          onChange={(e) =>
                            setPaletteInputs((prev) => ({
                              ...prev,
                              repeatCount: Math.max(1, parseInt(e.target.value) || 1),
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                        />
                        <span>รอบ (เดิน</span>
                        <input
                          type="number"
                          min="1"
                          max="150"
                          value={paletteInputs.repeatWalkSteps}
                          onChange={(e) =>
                            setPaletteInputs((prev) => ({
                              ...prev,
                              repeatWalkSteps: parseInt(e.target.value) || 0,
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                        />
                        <span>ก้าว)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addBlockToScript(b)}
                        disabled={isRunning}
                        className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-all cursor-pointer ml-1 shrink-0"
                        title="เพิ่มลงในสคริปต์"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                }

                if (b.customType === 'move') {
                  return (
                    <div
                      key={b.id}
                      className={`p-2 rounded-xl text-white text-xs font-mono font-medium flex items-center justify-between shadow-sm ${b.color}`}
                      title={b.desc || b.name}
                    >
                      <div className="flex items-center gap-1 truncate">
                        <span>ก้าว</span>
                        <input
                          type="number"
                          min="1"
                          max="300"
                          value={paletteInputs.moveSteps}
                          onChange={(e) =>
                            setPaletteInputs((prev) => ({
                              ...prev,
                              moveSteps: parseInt(e.target.value) || 0,
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-14 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                        />
                        <span>ก้าว</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addBlockToScript(b)}
                        disabled={isRunning}
                        className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-all cursor-pointer ml-1 shrink-0"
                        title="เพิ่มลงในสคริปต์"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                }

                if (b.customType === 'wait') {
                  return (
                    <div
                      key={b.id}
                      className={`p-2 rounded-xl text-white text-xs font-mono font-medium flex items-center justify-between shadow-sm ${b.color}`}
                      title={b.desc || b.name}
                    >
                      <div className="flex items-center gap-1 truncate">
                        <span>รอ</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0.1"
                          max="60"
                          value={paletteInputs.waitSec}
                          onChange={(e) =>
                            setPaletteInputs((prev) => ({
                              ...prev,
                              waitSec: Math.max(0.1, parseFloat(e.target.value) || 0.1),
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-14 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                        />
                        <span>วินาที</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addBlockToScript(b)}
                        disabled={isRunning}
                        className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-all cursor-pointer ml-1 shrink-0"
                        title="เพิ่มลงในสคริปต์"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                }

                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => addBlockToScript(b)}
                    disabled={isRunning}
                    className={`p-2.5 rounded-xl text-white text-xs font-mono font-medium text-left flex items-center justify-between transition-all hover:brightness-110 active:scale-95 shadow-sm disabled:opacity-50 cursor-pointer ${b.color}`}
                    title={b.desc || b.name}
                  >
                    <span className="truncate pr-1 flex items-center gap-1.5">
                      {b.code === 'start' && <Flag className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />}
                      <span>{b.name}</span>
                    </span>
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Script sequence in progress */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span>ชุดคำสั่งสคริปต์ที่จะรัน ({scriptBlocks.length} บล็อก)</span>
              </span>
              {scriptBlocks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setScriptBlocks([])}
                  disabled={isRunning}
                  className="text-slate-400 hover:text-rose-600 text-[11px] normal-case cursor-pointer"
                >
                  ล้างบล็อกทั้งหมด
                </button>
              )}
            </div>

            <div className="min-h-[220px] max-h-[300px] overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              {scriptBlocks.length === 0 ? (
                <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs space-y-1">
                  <span>ยังไม่มีสคริปต์คำสั่งในกล่อง</span>
                  <span className="text-[11px] text-slate-400">คลิกที่ปุ่มบล็อกด้านบน หรือเลือกพรีเซ็ตตัวอย่างเพื่อเริ่ม</span>
                </div>
              ) : (
                scriptBlocks.map((b, idx) => {
                  const isActive = activeBlockId === b.id;
                  return (
                    <div
                      key={b.id}
                      className={`p-2.5 rounded-xl text-white text-xs font-mono font-medium flex items-center justify-between transition-all ${b.color} ${
                        isActive ? 'ring-2 ring-white scale-[1.02] shadow-lg brightness-125' : 'opacity-95'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate flex-1 mr-1">
                        <span className="w-5 h-5 rounded-full bg-black/20 text-[11px] flex items-center justify-center font-bold shrink-0">
                          {idx + 1}
                        </span>

                        {b.code === 'start' ? (
                          <span className="flex items-center gap-1.5 font-bold">
                            <Flag className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" />
                            <span>เมื่อคลิก ธงเขียว</span>
                          </span>
                        ) : b.customType === 'goto' ? (
                          <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                            <span>ไปที่ x:</span>
                            <input
                              type="number"
                              disabled={isRunning}
                              value={b.val1 ?? 0}
                              onChange={(e) =>
                                updateScriptBlockParams(idx, parseInt(e.target.value) || 0, b.val2 ?? 0)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                            />
                            <span>y:</span>
                            <input
                              type="number"
                              disabled={isRunning}
                              value={b.val2 ?? 0}
                              onChange={(e) =>
                                updateScriptBlockParams(idx, b.val1 ?? 0, parseInt(e.target.value) || 0)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                            />
                          </div>
                        ) : b.customType === 'turn_cw' ? (
                          <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                            <span>หมุนตามเข็ม ↻</span>
                            <input
                              type="number"
                              disabled={isRunning}
                              value={b.val1 ?? 90}
                              onChange={(e) =>
                                updateScriptBlockParams(idx, parseInt(e.target.value) || 0)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-14 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                            />
                            <span>องศา</span>
                          </div>
                        ) : b.customType === 'turn_ccw' ? (
                          <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                            <span>หมุนทวนเข็ม ↺</span>
                            <input
                              type="number"
                              disabled={isRunning}
                              value={b.val1 ?? 90}
                              onChange={(e) =>
                                updateScriptBlockParams(idx, parseInt(e.target.value) || 0)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-14 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                            />
                            <span>องศา</span>
                          </div>
                        ) : b.customType === 'repeat_walk' ? (
                          <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                            <span>ทำซ้ำ</span>
                            <input
                              type="number"
                              min="1"
                              max="50"
                              disabled={isRunning}
                              value={b.val1 ?? 5}
                              onChange={(e) =>
                                updateScriptBlockParams(idx, Math.max(1, parseInt(e.target.value) || 1), b.val2 ?? 10)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-10 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                            />
                            <span>รอบ (เดิน</span>
                            <input
                              type="number"
                              min="1"
                              max="150"
                              disabled={isRunning}
                              value={b.val2 ?? 10}
                              onChange={(e) =>
                                updateScriptBlockParams(idx, b.val1 ?? 5, parseInt(e.target.value) || 0)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-10 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                            />
                            <span>ก้าว)</span>
                          </div>
                        ) : b.customType === 'repeat' ? (
                          <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                            <span>ทำซ้ำ</span>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              disabled={isRunning}
                              value={b.val1 ?? 4}
                              onChange={(e) =>
                                updateScriptBlockParams(idx, Math.max(1, parseInt(e.target.value) || 1))
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-12 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                            />
                            <span>รอบ</span>
                          </div>
                        ) : b.customType === 'move' ? (
                          <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                            <span>ก้าว</span>
                            <input
                              type="number"
                              min="1"
                              max="300"
                              disabled={isRunning}
                              value={b.val1 ?? 10}
                              onChange={(e) =>
                                updateScriptBlockParams(idx, parseInt(e.target.value) || 0)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-14 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                            />
                            <span>ก้าว</span>
                          </div>
                        ) : b.customType === 'wait' || b.code.startsWith('wait:') ? (
                          <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                            <span>รอ</span>
                            <input
                              type="number"
                              step="0.5"
                              min="0.1"
                              max="60"
                              disabled={isRunning}
                              value={b.val1 ?? (parseInt(b.code.split(':')[1], 10) / 1000 || 1)}
                              onChange={(e) =>
                                updateScriptBlockParams(idx, Math.max(0.1, parseFloat(e.target.value) || 0.1))
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-14 px-1 py-0.5 rounded bg-white text-slate-900 font-bold text-center border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 text-xs"
                            />
                            <span>วินาที</span>
                          </div>
                        ) : b.customType === 'custom_color' || b.code.startsWith('set_color:') ? (
                          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                            <span>ตั้งค่าสีปากกาเป็น</span>
                            <label className="relative flex items-center cursor-pointer">
                              <input
                                type="color"
                                disabled={isRunning}
                                value={b.colorVal || b.code.split(':')[1] || '#2563eb'}
                                onChange={(e) => updateScriptBlockColor(idx, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-5 h-5 rounded-md border border-white cursor-pointer shadow-sm p-0 bg-transparent"
                              />
                            </label>
                            <span className="font-mono text-[11px] opacity-90">{b.colorVal || b.code.split(':')[1] || '#2563eb'}</span>
                          </div>
                        ) : (
                          <span className="truncate">{b.name}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeScriptBlock(idx)}
                        disabled={isRunning}
                        className="text-white/70 hover:text-white p-1 hover:bg-black/20 rounded-md transition-colors cursor-pointer shrink-0 ml-1"
                        title="ลบบล็อกนี้"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Execution Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={runScript}
              disabled={isRunning || scriptBlocks.length === 0}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all active:scale-95 cursor-pointer ${
                isRunning || scriptBlocks.length === 0
                  ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25'
              }`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? 'กำลังรันสคริปต์ทีละขั้น...' : 'รันสคริปต์ (คลิกธงเขียว)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
