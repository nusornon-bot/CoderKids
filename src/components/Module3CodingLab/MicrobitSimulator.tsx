import React, { useState, useEffect } from 'react';
import { MICROBIT_PRESETS } from '../../data/learningData.ts';
import {
  Sparkles,
  Volume2,
  RotateCcw,
  Smartphone,
  Thermometer,
  Sun,
  Play,
  Copy,
  Check,
  Code,
  Cpu,
  Lightbulb,
  BookOpen,
  Layers,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PresetExplanationData {
  id: string;
  name: string;
  badge: string;
  conceptBadge: string;
  summary: string;
  howToTest: string;
  ipo: {
    input: string;
    process: string;
    output: string;
  };
  codeBlocks: {
    title: string;
    description: string;
    lines: { text: string; color: string; indent?: number }[];
  }[];
  rawCode: string;
  computationalTakeaway: string;
}

const PRESET_EXPLANATIONS: Record<string, PresetExplanationData> = {
  heart: {
    id: 'heart',
    name: 'หัวใจเต้นกระพริบ (Beating Heart)',
    badge: 'ไอคอนและการแสดงผล',
    conceptBadge: 'ลำดับคำสั่ง & หน่วงเวลา (Sequencing & Pause)',
    summary: 'จำลองการเต้นของหัวใจสิ่งมีชีวิตด้วยการสลับภาพไอคอนขนาดใหญ่และเล็ก พร้อมหน่วงเวลาสั้นๆ ในแต่ละจังหวะ',
    howToTest: '👉 คลิกปุ่ม A บนบอร์ดจำลอง หรือคลิกปุ่มเลือกตัวอย่าง เพื่อเริ่มรันจังหวะหัวใจเต้นพร้อมเสียงดนตรี C5/E5',
    ipo: {
      input: 'การกดปุ่ม A (Button.A) หรือการเริ่มทำงานของโปรแกรม',
      process: 'สลับไอคอนหัวใจโตและเล็ก โดยมีคำสั่ง basic.pause(300) หน่วงเวลาจังหวะละ 0.3 วินาที',
      output: 'หลอดไฟ LED 5x5 ดวงแสดงผลเป็นรูปหัวใจ พร้อมเสียงโน้ต C5 และ E5 ผ่านลำโพงเสมือน',
    },
    codeBlocks: [
      {
        title: 'เมื่อกดปุ่ม A ให้เริ่มเต้นจังหวะหัวใจ',
        description: 'แสดงรูปหัวใจโตและเล็กสลับกัน พร้อมเล่นเสียงโน้ตดนตรี',
        lines: [
          { text: 'input.onButtonPressed(Button.A, () => {', color: 'text-sky-400' },
          { text: 'basic.showIcon(IconNames.Heart);', color: 'text-emerald-400', indent: 1 },
          { text: 'music.playTone(523, music.beat(BeatFraction.Half));', color: 'text-purple-400', indent: 1 },
          { text: 'basic.pause(300); // หน่วงเวลา 0.3 วินาที', color: 'text-slate-400', indent: 1 },
          { text: 'basic.showIcon(IconNames.SmallHeart);', color: 'text-emerald-400', indent: 1 },
          { text: 'music.playTone(659, music.beat(BeatFraction.Half));', color: 'text-purple-400', indent: 1 },
          { text: 'basic.pause(300);', color: 'text-slate-400', indent: 1 },
          { text: 'basic.showIcon(IconNames.Heart);', color: 'text-emerald-400', indent: 1 },
          { text: '});', color: 'text-sky-400' },
        ],
      },
    ],
    rawCode: `// โปรเจกต์: หัวใจเต้นกระพริบ (Beating Heart)
input.onButtonPressed(Button.A, () => {
    basic.showIcon(IconNames.Heart);
    music.playTone(523, music.beat(BeatFraction.Half));
    basic.pause(300);
    basic.showIcon(IconNames.SmallHeart);
    music.playTone(659, music.beat(BeatFraction.Half));
    basic.pause(300);
    basic.showIcon(IconNames.Heart);
});`,
    computationalTakeaway: 'การสร้างแอนิเมชันในคอมพิวเตอร์เกิดจากการนำภาพนิ่งหลายๆ ภาพมาแสดงผลสลับกันอย่างรวดเร็ว โดยอาศัยคำสั่งหน่วงเวลา (Pause/Delay)',
  },
  dice: {
    id: 'dice',
    name: 'ลูกเต๋าดิจิทัลเมื่อเขย่า (Shake to Roll Dice)',
    badge: 'เซ็นเซอร์และการสุ่ม',
    conceptBadge: 'โปรแกรมเชิงเหตุการณ์ & การสุ่ม (Event-Driven & Randomness)',
    summary: 'ใช้เซ็นเซอร์วัดความเร่ง (Accelerometer) ตรวจจับเมื่อผู้ใช้เขย่าบอร์ด แล้วสุ่มแต้มลูกเต๋า 1 ถึง 6 ออกมาบนหน้าจอ',
    howToTest: '👉 คลิกปุ่ม "เขย่าบอร์ด (Simulate Shake)" ใต้ตัวบอร์ดเพื่อสุ่มแต้มลูกเต๋าใหม่แบบเรียลไทม์',
    ipo: {
      input: 'เซ็นเซอร์ Accelerometer ตรวจพบการสั่นสะเทือน (Gesture.Shake)',
      process: 'ฟังก์ชัน randint(1, 6) สุ่มตัวเลขจำนวนเต็มระหว่าง 1 ถึง 6 แล้วเก็บลงในตัวแปร dice',
      output: 'คำสั่ง basic.showNumber(dice) แสดงแต้มลูกเต๋าที่สุ่มได้บนหน้าจอ LED 5x5 พร้อมเสียงปี๊บ',
    },
    codeBlocks: [
      {
        title: 'เมื่อเขย่าบอร์ด (On Shake)',
        description: 'สุ่มตัวเลข 1 ถึง 6 แล้วแสดงผลลัพธ์บนจอ LED ทันที',
        lines: [
          { text: 'input.onGesture(Gesture.Shake, () => {', color: 'text-sky-400' },
          { text: 'music.playTone(880, music.beat(BeatFraction.Quarter));', color: 'text-purple-400', indent: 1 },
          { text: 'let roll = randint(1, 6); // สุ่มเลข 1 ถึง 6', color: 'text-amber-400', indent: 1 },
          { text: 'basic.showNumber(roll);', color: 'text-emerald-400', indent: 1 },
          { text: '});', color: 'text-sky-400' },
        ],
      },
    ],
    rawCode: `// โปรเจกต์: ลูกเต๋าดิจิทัลเมื่อเขย่า (Shake to Roll Dice)
input.onGesture(Gesture.Shake, () => {
    music.playTone(880, music.beat(BeatFraction.Quarter));
    let roll = randint(1, 6);
    basic.showNumber(roll);
});`,
    computationalTakeaway: 'การสุ่มค่า (Random) ช่วยให้ระบบคอมพิวเตอร์สร้างผลลัพธ์ที่คาดเดาไม่ได้ นำไปใช้ในเกมและโปรแกรมจำลอง',
  },
  tally: {
    id: 'tally',
    name: 'เครื่องนับคนอัจฉริยะ (Tally Counter A/B)',
    badge: 'ตัวแปรและปุ่มควบคุม',
    conceptBadge: 'ตัวแปร & ตรวจสอบเงื่อนไข (Variables & Validation)',
    summary: 'ใช้เก็บสะสมจำนวนนับในตัวแปร โดยปุ่ม A เพิ่มค่า (+1), ปุ่ม B ลดค่า (-1), และปุ่ม A+B รีเซ็ตเป็น 0',
    howToTest: '👉 กดปุ่ม A บนบอร์ดเพื่อนับคนเข้า (+1), กดปุ่ม B เพื่อนับคนออก (-1), หรือกดปุ่ม A+B ด้านล่างเพื่อรีเซ็ตเป็น 0',
    ipo: {
      input: 'ปุ่มกด A (นับเพิ่ม), ปุ่มกด B (นับลด), หรือปุ่ม A+B พร้อมกัน (รีเซ็ต)',
      process: 'เพิ่มค่าตัวแปร count += 1, ลดค่า count -= 1 (ตรวจสอบ count > 0 ไม่ให้ติดลบ), หรือ count = 0',
      output: 'คำสั่ง basic.showNumber(count) อัปเดตตัวเลขล่าสุดบนจอ LED 5x5 พร้อมเสียงตอบรับ',
    },
    codeBlocks: [
      {
        title: 'เริ่มต้น และกดปุ่ม A เพิ่มจำนวน (+1)',
        description: 'สร้างตัวแปร count เริ่มต้นที่ 0 และเพิ่มค่าทีละ 1 เมื่อกด A',
        lines: [
          { text: 'let count = 0;', color: 'text-amber-400' },
          { text: 'basic.showNumber(count);', color: 'text-emerald-400' },
          { text: 'input.onButtonPressed(Button.A, () => {', color: 'text-sky-400' },
          { text: 'count += 1; // เพิ่มค่าในตัวแปรขึ้น 1', color: 'text-amber-400', indent: 1 },
          { text: 'basic.showNumber(count);', color: 'text-emerald-400', indent: 1 },
          { text: 'music.playTone(440, music.beat(BeatFraction.Quarter));', color: 'text-purple-400', indent: 1 },
          { text: '});', color: 'text-sky-400' },
        ],
      },
      {
        title: 'กดปุ่ม B ลดจำนวน (-1) และกด A+B รีเซ็ต',
        description: 'ตรวจสอบเงื่อนไข if (count > 0) ก่อนลดค่า เพื่อป้องกันจำนวนคนติดลบ',
        lines: [
          { text: 'input.onButtonPressed(Button.B, () => {', color: 'text-sky-400' },
          { text: 'if (count > 0) { count -= 1; }', color: 'text-amber-400', indent: 1 },
          { text: 'basic.showNumber(count);', color: 'text-emerald-400', indent: 1 },
          { text: 'music.playTone(330, music.beat(BeatFraction.Quarter));', color: 'text-purple-400', indent: 1 },
          { text: '});', color: 'text-sky-400' },
          { text: 'input.onButtonPressed(Button.AB, () => {', color: 'text-sky-400' },
          { text: 'count = 0; // รีเซ็ตตัวแปรกลับเป็น 0', color: 'text-amber-400', indent: 1 },
          { text: 'basic.showNumber(0);', color: 'text-emerald-400', indent: 1 },
          { text: 'music.playTone(700, music.beat(BeatFraction.Half));', color: 'text-purple-400', indent: 1 },
          { text: '});', color: 'text-sky-400' },
        ],
      },
    ],
    rawCode: `// โปรเจกต์: เครื่องนับคนอัจฉริยะ (Tally Counter A/B)
let count = 0;
basic.showNumber(count);

// กดปุ่ม A: เพิ่มค่าตัวนับ (+1)
input.onButtonPressed(Button.A, () => {
    count += 1;
    basic.showNumber(count);
    music.playTone(440, music.beat(BeatFraction.Quarter));
});

// กดปุ่ม B: ลดค่าตัวนับ (-1 โดยไม่ให้ติดลบ)
input.onButtonPressed(Button.B, () => {
    if (count > 0) {
        count -= 1;
    }
    basic.showNumber(count);
    music.playTone(330, music.beat(BeatFraction.Quarter));
});

// กดปุ่ม A+B: รีเซ็ตค่าตัวนับเป็น 0
input.onButtonPressed(Button.AB, () => {
    count = 0;
    basic.showNumber(0);
    music.playTone(700, music.beat(BeatFraction.Half));
});`,
    computationalTakeaway: 'ตัวแปร (Variable) เปรียบเหมือนกล่องเก็บข้อมูลที่มีชื่อเรียก สามารถเปลี่ยนแปลงค่าเพิ่มขึ้นหรือลดลงได้ตลอดเวลา',
  },
  temp: {
    id: 'temp',
    name: 'เซ็นเซอร์วัดอุณหภูมิแจ้งเตือน (Smart Thermometer)',
    badge: 'ระบบ IoT และเงื่อนไข',
    conceptBadge: 'การตัดสินใจแบบเงื่อนไข (Conditional Logic If-Else)',
    summary: 'ระบบตรวจวัดอุณหภูมิห้องอัตโนมัติ หากอุณหภูมิสูงเกิน 32°C จะส่งสัญญาณเตือนภัยด้วยหน้าบึ้งและเสียง Buzzer',
    howToTest: '👉 เลื่อนแถบสไลเดอร์ "เซ็นเซอร์วัดอุณหภูมิ" ด้านบน ให้มากกว่า 32°C เพื่อสังเกตการเตือนภัยอัตโนมัติ',
    ipo: {
      input: 'เซ็นเซอร์วัดอุณหภูมิบนชิปไมโครบิต (input.temperature())',
      process: 'เปรียบเทียบเงื่อนไข if (temp >= 32) ตรวจสอบว่าอุณหภูมิร้อนเกินเกณฑ์หรือไม่',
      output: 'ถ้าร้อนเกินจะแสดงไอคอน Sad พร้อมเสียง Buzzer เตือนภัย หากปกติจะแสดงตัวเลขอุณหภูมิ (°C)',
    },
    codeBlocks: [
      {
        title: 'วนซ้ำตลอดเวลาเพื่อตรวจวัดอุณหภูมิ (Forever Loop)',
        description: 'อ่านค่าอุณหภูมิและตัดสินใจด้วยเงื่อนไข If-Else อย่างต่อเนื่อง',
        lines: [
          { text: 'basic.forever(() => {', color: 'text-sky-400' },
          { text: 'let temp = input.temperature(); // อ่านค่าอุณหภูมิ', color: 'text-amber-400', indent: 1 },
          { text: 'if (temp >= 32) {', color: 'text-rose-400', indent: 1 },
          { text: 'basic.showIcon(IconNames.Sad); // แจ้งเตือนร้อนเกิน', color: 'text-emerald-400', indent: 2 },
          { text: 'music.playTone(300, music.beat(BeatFraction.Whole));', color: 'text-purple-400', indent: 2 },
          { text: '} else {', color: 'text-rose-400', indent: 1 },
          { text: 'basic.showNumber(temp); // แสดงตัวเลขปกติ', color: 'text-emerald-400', indent: 2 },
          { text: '}', color: 'text-rose-400', indent: 1 },
          { text: 'basic.pause(1000); // ตรวจวัดทุก 1 วินาที', color: 'text-slate-400', indent: 1 },
          { text: '});', color: 'text-sky-400' },
        ],
      },
    ],
    rawCode: `// โปรเจกต์: เซ็นเซอร์วัดอุณหภูมิแจ้งเตือน (Smart Thermometer)
basic.forever(() => {
    let temp = input.temperature();
    if (temp >= 32) {
        // อุณหภูมิสูงเกินกำหนด: ส่งเสียงเตือนและแสดงหน้าบึ้ง
        basic.showIcon(IconNames.Sad);
        music.playTone(300, music.beat(BeatFraction.Whole));
    } else {
        // อุณหภูมิปกติ: แสดงตัวเลข
        basic.showNumber(temp);
    }
    basic.pause(1000);
});`,
    computationalTakeaway: 'โครงสร้างแบบเงื่อนไข ถ้า...แล้ว...มิฉะนั้น (If-Else) ทำให้ระบบสามารถตัดสินใจตอบสนองต่อสภาวะแวดล้อมได้เองอย่างชาญฉลาด',
  },
  rps: {
    id: 'rps',
    name: 'เกมเป่ายิ้งฉุบสุ่ม (Rock-Paper-Scissors)',
    badge: 'เกมและการประมวลผล',
    conceptBadge: 'เงื่อนไขหลายทางเลือก (Multi-way Branching)',
    summary: 'เขย่าบอร์ดเพื่อสุ่มออก ค้อน (Rock), กระดาษ (Paper), หรือ กรรไกร (Scissors) บนหน้าจอ LED',
    howToTest: '👉 คลิกปุ่ม "เขย่าบอร์ด (Simulate Shake)" เพื่อสุ่มออก ค้อน ✊, กระดาษ ✋, หรือ กรรไกร ✌️',
    ipo: {
      input: 'การเขย่าบอร์ด Micro:bit (input.onGesture(Gesture.Shake))',
      process: 'สุ่มค่า tool = randint(1, 3) และใช้เงื่อนไขตรวจสอบว่าตรงกับ 1 (ค้อน), 2 (กระดาษ), หรือ 3 (กรรไกร)',
      output: 'แสดงไอคอน ค้อน (สี่เหลี่ยมทึบ), กระดาษ (กรอบสี่เหลี่ยม), หรือ กรรไกร บนไฟ LED 5x5',
    },
    codeBlocks: [
      {
        title: 'เมื่อเขย่าบอร์ด ให้สุ่มออกอาวุธเป่ายิ้งฉุบ',
        description: 'สุ่มเลข 1-3 แล้วใช้เงื่อนไข If - Else If - Else กำหนดรูปสัญลักษณ์',
        lines: [
          { text: 'input.onGesture(Gesture.Shake, () => {', color: 'text-sky-400' },
          { text: 'music.playTone(880, music.beat(BeatFraction.Quarter));', color: 'text-purple-400', indent: 1 },
          { text: 'let tool = randint(1, 3); // 1=ค้อน, 2=กระดาษ, 3=กรรไกร', color: 'text-amber-400', indent: 1 },
          { text: 'if (tool == 1) {', color: 'text-rose-400', indent: 1 },
          { text: 'basic.showIcon(IconNames.Square); // ค้อน ✊', color: 'text-emerald-400', indent: 2 },
          { text: '} else if (tool == 2) {', color: 'text-rose-400', indent: 1 },
          { text: 'basic.showIcon(IconNames.SmallSquare); // กระดาษ ✋', color: 'text-emerald-400', indent: 2 },
          { text: '} else {', color: 'text-rose-400', indent: 1 },
          { text: 'basic.showIcon(IconNames.Scissors); // กรรไกร ✌️', color: 'text-emerald-400', indent: 2 },
          { text: '}', color: 'text-rose-400', indent: 1 },
          { text: '});', color: 'text-sky-400' },
        ],
      },
    ],
    rawCode: `// โปรเจกต์: เกมเป่ายิ้งฉุบสุ่ม (Rock-Paper-Scissors)
input.onGesture(Gesture.Shake, () => {
    music.playTone(880, music.beat(BeatFraction.Quarter));
    let tool = randint(1, 3);
    if (tool == 1) {
        basic.showIcon(IconNames.Square); // ค้อน ✊
    } else if (tool == 2) {
        basic.showIcon(IconNames.SmallSquare); // กระดาษ ✋
    } else {
        basic.showIcon(IconNames.Scissors); // กรรไกร ✌️
    }
});`,
    computationalTakeaway: 'การใช้โครงสร้างเงื่อนไขแบบ If - Else If - Else เหมาะสำหรับการจัดการทางเลือกที่มีมากกว่า 2 ทาง เพื่อกำหนดผลลัพธ์ให้ตรงตามแต่ละกรณี',
  },
};

interface MicrobitSimulatorProps {
  onComplete: () => void;
  addPoints: (points: number) => void;
  onOpenMusicLab?: () => void;
}

export const MicrobitSimulator: React.FC<MicrobitSimulatorProps> = ({ onComplete, addPoints, onOpenMusicLab }) => {
  // 5x5 LED matrix state
  const [leds, setLeds] = useState<boolean[][]>([
    [false, true, false, true, false],
    [true, true, true, true, true],
    [true, true, true, true, true],
    [false, true, true, true, false],
    [false, false, true, false, false],
  ]);

  const [activePresetId, setActivePresetId] = useState<string>('heart');
  const [temperature, setTemperature] = useState<number>(27);
  const [lightLevel, setLightLevel] = useState<number>(128);
  const [counterValue, setCounterValue] = useState<number>(0);
  const [isShaking, setIsShaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('บอร์ดพร้อมทำงาน: กดปุ่ม A หรือเขย่าบอร์ดเพื่อสั่งงาน');
  const [hasCompleted, setHasCompleted] = useState(false);
  const [codeViewTab, setCodeViewTab] = useState<'code' | 'ipo'>('code');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard write failure
    }
  };

  // Web Audio Tone Synthesizer
  const playTone = (freq: number, durationMs: number = 200, type: OscillatorType = 'square') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + durationMs / 1000);
    } catch {
      // Audio not permitted or unsupported
    }
  };

  // Toggle individual LED pixel
  const toggleLed = (r: number, c: number) => {
    setLeds((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = !next[r][c];
      return next;
    });
    playTone(600, 50);
  };

  // Clear LEDs
  const clearLeds = () => {
    setLeds(Array.from({ length: 5 }, () => Array(5).fill(false)));
    setStatusMessage('หน้าจอ LED เคลียร์ว่างแล้ว - สามารถคลิกจุดเพื่อวาดไอคอนเองได้');
  };

  // Apply a preset
  const selectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    const preset = MICROBIT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    if (presetId === 'heart') {
      animateHeart();
    } else if (presetId === 'dice') {
      handleShake();
    } else if (presetId === 'tally') {
      displayDigit(counterValue);
      setStatusMessage('โหมดนับคะแนน: กดปุ่ม A (+1) | กดปุ่ม B (-1) | กดปุ่ม A+B (รีเซ็ต)');
    } else if (presetId === 'temp') {
      checkTemperatureDisplay(temperature);
    } else if (presetId === 'rps') {
      rollRockPaperScissors();
    }

    if (!hasCompleted) {
      setHasCompleted(true);
      addPoints(20);
      onComplete();
    }
  };

  // Heart animation
  const animateHeart = () => {
    playTone(523.25, 120); // Note C5
    const bigHeart = [
      [false, true, false, true, false],
      [true, true, true, true, true],
      [true, true, true, true, true],
      [false, true, true, true, false],
      [false, false, true, false, false],
    ];
    const smallHeart = [
      [false, false, false, false, false],
      [false, true, false, true, false],
      [false, true, true, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ];

    setLeds(bigHeart);
    setStatusMessage('กำลังเต้นจังหวะหัวใจ (Beating Heart)');

    setTimeout(() => {
      playTone(659.25, 120); // Note E5
      setLeds(smallHeart);
    }, 300);

    setTimeout(() => {
      setLeds(bigHeart);
    }, 600);
  };

  // Display single digit 0-9 on 5x5
  const displayDigit = (num: number) => {
    const digitPatterns: { [k: number]: boolean[][] } = {
      0: [
        [false, true, true, true, false],
        [false, true, false, true, false],
        [false, true, false, true, false],
        [false, true, false, true, false],
        [false, true, true, true, false],
      ],
      1: [
        [false, false, true, false, false],
        [false, true, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, true, true, true, false],
      ],
      2: [
        [false, true, true, true, false],
        [false, false, false, true, false],
        [false, true, true, true, false],
        [false, true, false, false, false],
        [false, true, true, true, false],
      ],
      3: [
        [false, true, true, true, false],
        [false, false, false, true, false],
        [false, false, true, true, false],
        [false, false, false, true, false],
        [false, true, true, true, false],
      ],
      4: [
        [false, true, false, true, false],
        [false, true, false, true, false],
        [false, true, true, true, false],
        [false, false, false, true, false],
        [false, false, false, true, false],
      ],
      5: [
        [false, true, true, true, false],
        [false, true, false, false, false],
        [false, true, true, true, false],
        [false, false, false, true, false],
        [false, true, true, true, false],
      ],
      6: [
        [false, true, true, true, false],
        [false, true, false, false, false],
        [false, true, true, true, false],
        [false, true, false, true, false],
        [false, true, true, true, false],
      ],
      7: [
        [false, true, true, true, false],
        [false, false, false, true, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
      ],
      8: [
        [false, true, true, true, false],
        [false, true, false, true, false],
        [false, true, true, true, false],
        [false, true, false, true, false],
        [false, true, true, true, false],
      ],
      9: [
        [false, true, true, true, false],
        [false, true, false, true, false],
        [false, true, true, true, false],
        [false, false, false, true, false],
        [false, true, true, true, false],
      ],
    };

    const pat = digitPatterns[Math.abs(num) % 10] || digitPatterns[0];
    setLeds(pat);
  };

  // Button A Click handler
  const handleButtonA = () => {
    playTone(440, 150);
    if (activePresetId === 'tally') {
      const nextVal = counterValue + 1;
      setCounterValue(nextVal);
      displayDigit(nextVal);
      setStatusMessage(`กดปุ่ม A: เพิ่มค่าตัวนับเป็น ${nextVal}`);
    } else {
      animateHeart();
      setStatusMessage('กดปุ่ม A: แสดงไอคอนหัวใจ');
    }
  };

  // Button B Click handler
  const handleButtonB = () => {
    playTone(550, 150);
    if (activePresetId === 'tally') {
      const nextVal = Math.max(0, counterValue - 1);
      setCounterValue(nextVal);
      displayDigit(nextVal);
      setStatusMessage(`กดปุ่ม B: ลดค่าตัวนับเหลือ ${nextVal}`);
    } else {
      // Show smiley
      const smiley = [
        [false, true, false, true, false],
        [false, true, false, true, false],
        [false, false, false, false, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
      ];
      setLeds(smiley);
      setStatusMessage('กดปุ่ม B: แสดงหน้ายิ้ม (Smiley Face)');
    }
  };

  // Button A+B Click handler
  const handleButtonAB = () => {
    playTone(700, 250);
    if (activePresetId === 'tally') {
      setCounterValue(0);
      displayDigit(0);
      setStatusMessage('กดปุ่ม A+B: รีเซ็ตค่าตัวนับเป็น 0');
    } else {
      clearLeds();
    }
  };

  // Shake sensor simulation
  const handleShake = () => {
    setIsShaking(true);
    playTone(880, 200, 'sawtooth');

    setTimeout(() => {
      setIsShaking(false);
      if (activePresetId === 'rps') {
        rollRockPaperScissors();
      } else {
        // Roll dice 1-6
        const diceVal = Math.floor(Math.random() * 6) + 1;
        displayDigit(diceVal);
        setStatusMessage(`เขย่าบอร์ด (On Shake): สุ่มได้แต้มลูกเต๋า ${diceVal} !`);
      }
    }, 400);
  };

  // Rock Paper Scissors
  const rollRockPaperScissors = () => {
    const choices = ['rock', 'paper', 'scissors'] as const;
    const choice = choices[Math.floor(Math.random() * choices.length)];

    const rock = [
      [false, false, false, false, false],
      [false, true, true, true, false],
      [false, true, true, true, false],
      [false, true, true, true, false],
      [false, false, false, false, false],
    ];

    const paper = [
      [true, true, true, true, true],
      [true, false, false, false, true],
      [true, false, false, false, true],
      [true, false, false, false, true],
      [true, true, true, true, true],
    ];

    const scissors = [
      [true, true, false, false, true],
      [true, true, false, true, false],
      [false, false, true, false, false],
      [true, true, false, true, false],
      [true, true, false, false, true],
    ];

    if (choice === 'rock') {
      setLeds(rock);
      setStatusMessage('เป่ายิ้งฉุบ: ออก "ค้อน (Rock)" ✊');
    } else if (choice === 'paper') {
      setLeds(paper);
      setStatusMessage('เป่ายิ้งฉุบ: ออก "กระดาษ (Paper)" ✋');
    } else {
      setLeds(scissors);
      setStatusMessage('เป่ายิ้งฉุบ: ออก "กรรไกร (Scissors)" ✌️');
    }
  };

  // Temperature logic
  const checkTemperatureDisplay = (temp: number) => {
    if (temp >= 32) {
      // Hot: frowning face or warning
      const hotFace = [
        [false, true, false, true, false],
        [false, true, false, true, false],
        [false, false, false, false, false],
        [false, true, true, true, false],
        [true, false, false, false, true],
      ];
      setLeds(hotFace);
      playTone(300, 300, 'sawtooth');
      setStatusMessage(`อุณหภูมิ ${temp}°C ร้อนเกินกำหนด! แจ้งเตือนสัญลักษณ์หน้าบึ้ง`);
    } else {
      displayDigit(temp % 10);
      setStatusMessage(`อุณหภูมิปกติ ${temp}°C`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">ซิมูเลเตอร์ฮาร์ดแวร์</span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            Micro:bit V2 Virtual Board Simulator
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            จำลองบอร์ดไมโครบิตเสมือนจริง ไฟ LED สีแดง 5x5 ดวง ปุ่มกด เซ็นเซอร์ความเร่ง และลำโพงเสียง
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">ตัวอย่างโปรแกรม:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {MICROBIT_PRESETS.map((p) => {
              const isActive = activePresetId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => selectPreset(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md ring-2 ring-indigo-500'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                  title={`คลิกเพื่อรันและดูคำอธิบายโค้ดของ ${p.name}`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                  <span>{p.name.split('(')[0]?.trim()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: The Micro:bit Board */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            className={`relative w-full max-w-[420px] aspect-[420/330] rounded-3xl bg-[#111827] border-4 border-slate-700 shadow-2xl p-6 flex flex-col justify-between transition-transform ${
              isShaking ? 'animate-bounce' : ''
            }`}
          >
            {/* Top Bar with Micro:bit logo and microphone */}
            <div className="flex items-center justify-between px-2 text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-300" />
                <span className="text-[11px] font-mono tracking-wider text-slate-300">micro:bit v2</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Volume2 className="w-3.5 h-3.5" />
                <span>SPEAKER</span>
              </div>
            </div>

            {/* Middle Section: Button A, 5x5 LED Matrix, Button B */}
            <div className="flex items-center justify-between my-auto px-1">
              {/* Button A */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={handleButtonA}
                  className="w-12 h-12 rounded-full bg-gradient-to-b from-slate-600 to-slate-800 border-2 border-slate-500 shadow-md active:scale-90 active:border-indigo-400 flex items-center justify-center font-bold text-white text-sm transition-transform"
                >
                  A
                </button>
                <span className="text-[10px] text-slate-400 font-mono">BTN A</span>
              </div>

              {/* 5x5 LED Matrix Grid */}
              <div className="p-3 bg-black/60 rounded-2xl border border-slate-800 shadow-inner">
                <div className="grid grid-cols-5 gap-2">
                  {leds.map((row, r) =>
                    row.map((isOn, c) => (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => toggleLed(r, c)}
                        className={`w-6 h-6 rounded-full transition-all duration-150 flex items-center justify-center ${
                          isOn
                            ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e] border border-rose-300 scale-105'
                            : 'bg-slate-800 border border-slate-900 hover:bg-slate-700'
                        }`}
                        title={`LED (${r}, ${c}) - คลิกเพื่อเปิด/ปิด`}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Button B */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={handleButtonB}
                  className="w-12 h-12 rounded-full bg-gradient-to-b from-slate-600 to-slate-800 border-2 border-slate-500 shadow-md active:scale-90 active:border-indigo-400 flex items-center justify-center font-bold text-white text-sm transition-transform"
                >
                  B
                </button>
                <span className="text-[10px] text-slate-400 font-mono">BTN B</span>
              </div>
            </div>

            {/* Edge Connector Strip (Gold Pins P0, P1, P2, 3V, GND) */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-around text-[10px] font-mono text-amber-300">
              <span className="px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">P0</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">P1</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">P2</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300">3V</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">GND</span>
            </div>
          </div>

          {/* Quick Hardware Actions below the board */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleShake}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>เขย่าบอร์ด (Simulate Shake)</span>
            </button>

            <button
              onClick={handleButtonAB}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              <span>กดปุ่ม A+B พร้อมกัน</span>
            </button>

            <button
              onClick={clearLeds}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-800 rounded-xl text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างหน้าจอ</span>
            </button>
          </div>

          {/* Status readout */}
          <div className="mt-4 w-full max-w-[420px] p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 text-center font-medium">
            {statusMessage}
          </div>
        </div>

        {/* Right: Sensor Sliders and Dynamic MakeCode Explanation */}
        <div className="lg:col-span-5 space-y-5">
          {/* Virtual Sensors */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              เซ็นเซอร์จำลอง (Hardware Sensors)
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Thermometer className="w-4 h-4 text-rose-500" />
                  <span>เซ็นเซอร์วัดอุณหภูมิ (Temperature)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{temperature} °C</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={temperature}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTemperature(val);
                  checkTemperatureDisplay(val);
                }}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0°C (เย็น)</span>
                <span>25°C (ห้อง)</span>
                <span>50°C (ร้อนจัด)</span>
              </div>
            </div>

            {/* Light Slider */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>เซ็นเซอร์วัดความสว่าง (Light Level)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{lightLevel} / 255</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={lightLevel}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLightLevel(val);
                  setStatusMessage(`ระดับแสงสว่าง: ${val} (ถ้าแสงน้อยกว่า 50 จะสั่งเปิดไฟอัตโนมัติ)`);
                }}
                className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Dynamic Block Logic & Code Explanation */}
          {(() => {
            const exp = PRESET_EXPLANATIONS[activePresetId] || PRESET_EXPLANATIONS.heart;
            return (
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 font-mono text-xs shadow-xl border border-slate-800 transition-all">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
                      <Code className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">
                        คำอธิบายโค้ดบล็อก MakeCode
                      </div>
                      <div className="text-sm font-bold font-sans text-amber-300 flex items-center gap-2">
                        <span>{exp.name}</span>
                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                          {exp.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Copy Code button */}
                  <button
                    type="button"
                    onClick={() => handleCopyCode(exp.rawCode)}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-[11px] font-sans cursor-pointer shrink-0"
                    title="คัดลอกโค้ด MakeCode"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">คัดลอกแล้ว!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>คัดลอกโค้ด</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Concept Banner */}
                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-900/50 text-indigo-200 text-[11px] font-sans flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">แนวคิดหลัก: </span>
                    <span>{exp.conceptBadge}</span>
                    <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{exp.summary}</p>
                  </div>
                </div>

                {/* Tab Switcher: Code vs IPO Analysis */}
                <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl font-sans text-[11px]">
                  <button
                    type="button"
                    onClick={() => setCodeViewTab('code')}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      codeViewTab === 'code'
                        ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>บล็อกโค้ด MakeCode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeViewTab('ipo')}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      codeViewTab === 'ipo'
                        ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>วิเคราะห์ระบบ (IPO Model)</span>
                  </button>
                </div>

                {/* Tab 1: Code View */}
                {codeViewTab === 'code' && (
                  <div className="space-y-2.5">
                    {exp.codeBlocks.map((block, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px] font-sans text-slate-400 border-b border-slate-800/80 pb-1.5">
                          <span className="font-semibold text-slate-300">{block.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{block.description}</span>
                        </div>
                        <div className="font-mono text-xs leading-relaxed space-y-0.5">
                          {block.lines.map((line, lIdx) => (
                            <div
                              key={lIdx}
                              className={`${line.color || 'text-slate-300'} ${
                                line.indent ? (line.indent === 2 ? 'ml-6' : 'ml-3') : ''
                              }`}
                            >
                              {line.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 2: IPO Model (Input-Process-Output) */}
                {codeViewTab === 'ipo' && (
                  <div className="space-y-2 font-sans text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1">
                      <div className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        <span>1. อินพุต (Input) - สิ่งที่รับเข้าสู่ระบบ</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed pl-3.5">
                        {exp.ipo.input}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1">
                      <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>2. การประมวลผล (Process) - การคำนวณและเงื่อนไข</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed pl-3.5">
                        {exp.ipo.process}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1">
                      <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>3. เอาต์พุต (Output) - การแสดงผลและเสียง</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed pl-3.5">
                        {exp.ipo.output}
                      </p>
                    </div>
                  </div>
                )}

                {/* How to test hint */}
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-[11px] font-sans flex items-center gap-2">
                  <span className="font-semibold">{exp.howToTest}</span>
                </div>

                {/* Computational Thinking Takeaway */}
                <div className="pt-2 text-[11px] text-slate-400 font-sans leading-relaxed border-t border-slate-800">
                  💡 <strong>ข้อคิดการเรียนรู้:</strong> {exp.computationalTakeaway}
                </div>

                {onOpenMusicLab && (
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={onOpenMusicLab}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer font-sans"
                    >
                      <span>🎵</span>
                      <span>เปิดแล็บประพันธ์เพลง Micro:bit Music Lab (Oscilloscope &amp; Synthesizer)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
