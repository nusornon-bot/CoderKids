import React, { useState } from 'react';
import {
  Rocket,
  Cpu,
  Layers,
  CheckCircle2,
  FileText,
  Printer,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Bot,
  Zap,
  HelpCircle,
  Clock,
  Award,
  BookOpen,
  Download,
  Share2,
  PenTool,
  Check,
  RotateCcw,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';
import { fireConfetti } from './ConfettiCelebration.tsx';

export interface StemProject {
  id: string;
  title: string;
  subtitle: string;
  grade: 'ป.4' | 'ป.5' | 'ป.6';
  category: 'IoT & Smart Home' | 'Game & Animation' | 'Environmental & Green' | 'Safety & AI';
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ท้าทาย';
  duration: string;
  icon: string;
  badgeColor: string;
  hardware: string[];
  software: string[];
  objective: string;
  realWorldImpact: string;
  steps: {
    title: string;
    description: string;
    codeSnippet?: string;
    tips?: string;
  }[];
  circuitDescription: string;
  curriculumStandard: string;
}

export const STEM_PROJECTS: StemProject[] = [
  {
    id: 'proj_smart_farm',
    title: 'ระบบรดน้ำต้นไม้อัจฉริยะ (Smart Plant Watering)',
    subtitle: 'ตรวจวัดความชื้นในดินและสั่งปั๊มน้ำจิ๋วทำงานอัตโนมัติด้วย Micro:bit V2',
    grade: 'ป.5',
    category: 'IoT & Smart Home',
    difficulty: 'ปานกลาง',
    duration: '45-60 นาที',
    icon: '🌱',
    badgeColor: 'emerald',
    hardware: ['บอร์ด Micro:bit V2', 'เซ็นเซอร์วัดความชื้นในดิน (Moisture Sensor)', 'โมดูลรีเลย์ 5V หรือ มอเตอร์ปั๊มน้ำ', 'สายไฟ Jumper'],
    software: ['MakeCode for Micro:bit', 'Block Editor'],
    objective: 'ฝึกการอ่านค่าสัญญาณอะนาล็อก (Analog Read) และใช้คำสั่งเงื่อนไข If-Else เพื่อควบคุมอุปกรณ์ภายนอก',
    realWorldImpact: 'ช่วยประหยัดน้ำในการทำเกษตรกรรมแม่นยำ และดูแลต้นไม้ในโรงเรียนช่วงวันหยุดเสาร์-อาทิตย์',
    curriculumStandard: 'ว 4.2 ป.5/2 ออกแบบและเขียนโปรแกรมอย่างง่ายเพื่อแก้ปัญหาในชีวิตประจำวัน',
    circuitDescription: 'ต่อขา Signal ของ Moisture Sensor เข้ากับ Pin P0, ขา VCC เข้า 3V, และ GND เข้า GND ของ Micro:bit',
    steps: [
      {
        title: 'ขั้นตอนที่ 1: วิเคราะห์ปัญหาและออกแบบผังงาน',
        description: 'กำหนดเงื่อนไข: หากค่าความชื้นต่ำกว่า 300 ให้เปิดปั๊มน้ำ 3 วินาที และแสดงไอคอนหน้าบึ้ง ☹️ บนหน้าจอ LED',
        tips: 'ใช้ Abstraction คัดแยกเฉพาะข้อมูลระดับความชื้นที่จำเป็นสำหรับการตัดสินใจ',
      },
      {
        title: 'ขั้นตอนที่ 2: เขียนบล็อกอ่านค่า Analog P0',
        description: 'สร้างตัวแปร `soilMoisture` และดึงบล็อก `analog read pin P0` มาเก็บไว้ในตัวแปรแบบวนซ้ำ (forever)',
        codeSnippet: 'forever {\n  soilMoisture = pins.analogReadPin(AnalogPin.P0)\n  basic.showNumber(soilMoisture)\n}',
      },
      {
        title: 'ขั้นตอนที่ 3: กำหนดเงื่อนไข If-Else และสั่งงาน Relay',
        description: 'ถ้า `soilMoisture < 300` ให้ `digital write pin P1 to 1` รอ 3000 ms แล้วดับปั๊ม `digital write pin P1 to 0`',
        codeSnippet: 'if (soilMoisture < 300) {\n  pins.digitalWritePin(DigitalPin.P1, 1)\n  basic.showIcon(IconNames.Sad)\n  basic.pause(3000)\n  pins.digitalWritePin(DigitalPin.P1, 0)\n} else {\n  basic.showIcon(IconNames.Happy)\n}',
      },
      {
        title: 'ขั้นตอนที่ 4: ทดสอบและบันทึกผล (Testing & Debugging)',
        description: 'ทดลองจุ่มเซ็นเซอร์ลงในดินแห้งและดินชื้น ตรวจสอบว่าปั๊มน้ำทำงานและหยุดทำงานตามเกณฑ์ที่กำหนดอย่างถูกต้อง',
      },
    ],
  },
  {
    id: 'proj_smart_bin',
    title: 'ถังขยะตรวจจับเปิด-ปิดอัตโนมัติ (Smart Touchless Bin)',
    subtitle: 'สุขอนามัยยุคใหม่ ใช้เซ็นเซอร์วัดระยะทาง Ultrasonic สั่งเซอร์โวมอเตอร์เปิดฝาถัง',
    grade: 'ป.6',
    category: 'IoT & Smart Home',
    difficulty: 'ปานกลาง',
    duration: '60 นาที',
    icon: '🗑️',
    badgeColor: 'sky',
    hardware: ['Micro:bit V2', 'HC-SR04 Ultrasonic Distance Sensor', 'SG90 Micro Servo Motor', 'กล่องกระดาษจำลองถังขยะ'],
    software: ['MakeCode for Micro:bit', 'Sonar Extension'],
    objective: 'เข้าใจการทำงานของคลื่นอัลตราโซนิกในการวัดระยะทาง และการควบคุมมุมการหมุนของเซอร์โวมอเตอร์ (0-90 องศา)',
    realWorldImpact: 'ลดการสัมผัสเชื้อโรคในโรงเรียนและโรงพยาบาล ส่งเสริมสุขอนามัยที่ดีแก่นักเรียน',
    curriculumStandard: 'ว 4.2 ป.6/2 ออกแบบและเขียนโปรแกรมเพื่อแก้ปัญหาในชีวิตประจำวันอย่างเป็นระบบ',
    circuitDescription: 'ต่อ Trig -> P1, Echo -> P2 ของ Ultrasonic Sensor และต่อสาย Signal ของ Servo Motor เข้ากับ P0',
    steps: [
      {
        title: 'ขั้นตอนที่ 1: ติดตั้ง Extension และตั้งค่า Servo',
        description: 'ติดตั้ง Extension `sonar` ใน MakeCode เพื่อให้ได้บล็อกวัดระยะทางเป็นหน่วยเซนติเมตร',
      },
      {
        title: 'ขั้นตอนที่ 2: วนซ้ำวัดระยะทางมือที่ยื่นเข้ามา',
        description: 'ใช้บล็อก `sonar.ping(P1, P2, PingUnit.Centimeters)` หากระยะทางน้อยกว่า 15 ซม. ให้ถือว่ามีคนจะทิ้งขยะ',
        codeSnippet: 'let distance = sonar.ping(DigitalPin.P1, DigitalPin.P2, PingUnit.Centimeters)\nif (distance > 0 && distance < 15) {\n  servos.P0.setAngle(90) // เปิดฝา\n  basic.pause(3000)      // รอทิ้งขยะ 3 วินาที\n  servos.P0.setAngle(0)  // ปิดฝา\n}',
      },
      {
        title: 'ขั้นตอนที่ 3: ประกอบกลไกฝาถังขยะและตกแต่ง',
        description: 'ใช้ไม้ไอศกรีมหรือก้านพลาสติกเชื่อมระหว่างเฟืองเซอร์โวมอเตอร์กับฝาถังขยะ เพื่อดึงฝาเปิด-ปิดได้นุ่มนวล',
      },
    ],
  },
  {
    id: 'proj_eco_recycling_game',
    title: 'เกมตะลุยแยกขยะรักษ์โลก (Eco-Recycling Scratch 3.0)',
    subtitle: 'เขียนโปรแกรม Scratch สุ่มขยะตกจากฟ้าและใช้ตัวแปรนับคะแนนตามประเภทถังขยะ',
    grade: 'ป.4',
    category: 'Game & Animation',
    difficulty: 'ง่าย',
    duration: '40 นาที',
    icon: '♻️',
    badgeColor: 'emerald',
    hardware: ['คอมพิวเตอร์ หรือ แท็บเล็ต'],
    software: ['Scratch 3.0 Web / Desktop'],
    objective: 'ฝึกการใช้ตัวแปร (Score, Lives), การสุ่มค่า (Pick Random), และการตรวจจับการสัมผัส (Touching Color/Sprite)',
    realWorldImpact: 'ปลูกจิตสำนึกการคัดแยกขยะ 4 ประเภท (ขยะเปียก, ขยะรีไซเคิล, ขยะทั่วไป, ขยะอันตราย) ในโรงเรียน',
    curriculumStandard: 'ว 4.2 ป.4/2 ใช้เหตุผลเชิงตรรกะในการแก้ปัญหาและออกแบบเกมจำลองสถานการณ์',
    circuitDescription: 'ไม่ต้องใช้อุปกรณ์ฮาร์ดแวร์ ใช้คีย์บอร์ดปุ่มลูกศรซ้าย-ขวาควบคุมถังขยะในแคนวาส',
    steps: [
      {
        title: 'ขั้นตอนที่ 1: วาดตัวละครขยะและถังขยะ',
        description: 'สร้าง Sprite ขยะ (ขวดน้ำ, กล้วย, ถ่านไฟฉาย) และถังขยะที่เลื่อนซ้าย-ขวาตามตำแหน่งเมาส์หรือปุ่มลูกศร',
      },
      {
        title: 'ขั้นตอนที่ 2: สุ่มตำแหน่งตกและควบคุมการเคลื่อนที่',
        description: 'ใช้บล็อก `forever` ให้ขยะตกจาก `y: 180` ลงมาเรื่อยๆ จนถึง `y: -180` ด้วยบล็อก `change y by (-5)`',
        codeSnippet: 'when green flag clicked\nforever {\n  set x to (pick random -200 to 200)\n  set y to 180\n  repeat until <(y position) < -170> {\n    change y by (-6)\n  }\n}',
      },
      {
        title: 'ขั้นตอนที่ 3: ตรวจจับการรับขยะและคิดคะแนน',
        description: 'ถ้าสัมผัสถังขยะประเภทถูกต้อง ได้ +10 แต้ม หากผิดประเภทลด 1 พลังชีวิต และเล่นเสียงฉลอง',
        codeSnippet: 'if <touching [RecycleBin v]?> then {\n  change [Score v] by 10\n  start sound [Coin v]\n  hide\n}',
      },
    ],
  },
  {
    id: 'proj_flood_alert',
    title: 'เครื่องเตือนภัยน้ำท่วมชุมชน (Community Flood Alarm)',
    subtitle: 'ตรวจจับระดับน้ำหลากด้วยสายสัญญาณสัมผัสและแจ้งเตือนผ่านเสียงลำโพง Buzzer & วิทยุคลื่นสั้น',
    grade: 'ป.6',
    category: 'Safety & AI',
    difficulty: 'ท้าทาย',
    duration: '60 นาที',
    icon: '🌊',
    badgeColor: 'indigo',
    hardware: ['Micro:bit V2 x 2 บอร์ด (ตัวส่ง & ตัวรับ)', 'เซ็นเซอร์ระดับน้ำ (Water Level Sensor)', 'Buzzer ลำโพงในตัว'],
    software: ['MakeCode for Micro:bit', 'Radio Groups'],
    objective: 'เรียนรู้เรื่อง IoT และการสื่อสารไร้สายระหว่างบอร์ดด้วย Radio Signal เพื่อกระจายข่าวเตือนภัย',
    realWorldImpact: 'แจ้งเตือนประชาชนริมแม่น้ำล่วงหน้าเมื่อน้ำขึ้นสูงผิดปกติในฤดูมรสุม',
    curriculumStandard: 'ว 4.2 ป.6/1 และ ป.6/2 บูรณาการวิทยาการคำนวณเข้ากับภัยพิบัติธรรมชาติในท้องถิ่น',
    circuitDescription: 'บอร์ดส่งสัญญาณตรวจระดับน้ำที่คลอง และส่งวิทยุ Group 88 ไปยังบอร์ดเตือนภัยที่ตั้งอยู่ในบ้าน',
    steps: [
      {
        title: 'ขั้นตอนที่ 1: ตั้งค่ากลุ่มวิทยุสื่อสาร (Radio Set Group)',
        description: 'กำหนด `radio.setGroup(88)` ทั้งสองบอร์ดเพื่อให้รับ-ส่งคลื่นความถี่เดียวกันได้อย่างแม่นยำ',
      },
      {
        title: 'ขั้นตอนที่ 2: เขียนโปรแกรมบอร์ดส่งสัญญาณที่ริมน้ำ',
        description: 'อ่านค่า Water Sensor ถ้าเกินระดับ 600 ให้ส่งวิทยุ string "FLOOD_ALERT"',
        codeSnippet: 'radio.setGroup(88)\nforever {\n  let water = pins.analogReadPin(AnalogPin.P0)\n  if (water > 600) {\n    radio.sendString("FLOOD_ALERT")\n    basic.showIcon(IconNames.Skull)\n  }\n  basic.pause(1000)\n}',
      },
      {
        title: 'ขั้นตอนที่ 3: โปรแกรมบอร์ดรับสัญญาณในบ้าน',
        description: 'เมื่อได้รับข้อความ "FLOOD_ALERT" ให้บอร์ดส่งเสียงไซเรนฉุกเฉินและกะพริบหน้าจอเตือนให้อพยพสิ่งของ',
        codeSnippet: 'radio.onReceivedString(function (receivedString) {\n  if (receivedString == "FLOOD_ALERT") {\n    music.play(music.builtinPlayableSound(Sounds.Siren), music.PlaybackMode.LoopingInBackground)\n    basic.showString("RUN!")\n  }\n})',
      },
    ],
  },
  {
    id: 'proj_shake_alarm',
    title: 'นาฬิกาปลุกเขย่าฝึกสมาธิ (Motion Shake Snooze Alarm)',
    subtitle: 'ประยุกต์เซ็นเซอร์ Accelerometer บังคับให้ผู้ใช้วิ่งหรือเขย่าบอร์ดครบ 30 ครั้งถึงจะหยุดร้อง',
    grade: 'ป.4',
    category: 'Game & Animation',
    difficulty: 'ง่าย',
    duration: '35 นาที',
    icon: '⏰',
    badgeColor: 'amber',
    hardware: ['Micro:bit V2', 'กล่องใส่ถ่าน AAA 2 ก้อน'],
    software: ['MakeCode for Micro:bit'],
    objective: 'เข้าใจการทำงานของเซ็นเซอร์ความเร่ง (3-axis Accelerometer) และตัวแปรนับจำนวนการกระทำ',
    realWorldImpact: 'ส่งเสริมสุขภาพให้เด็กๆ ตื่นนอนตรงเวลาและออกกำลังกายเบาๆ ยามเช้าก่อนไปโรงเรียน',
    curriculumStandard: 'ว 4.2 ป.4/1 อธิบายขั้นตอนการทำงานและเขียนโปรแกรมตรวจสอบอินพุตแบบการเคลื่อนไหว',
    circuitDescription: 'ใช้อุปกรณ์บอร์ดเดี่ยวแบบพกพาโดยใช้แบตเตอรี่แพ็ค AAA',
    steps: [
      {
        title: 'ขั้นตอนที่ 1: ตรวจจับเหตุการณ์ On Shake',
        description: 'ใช้บล็อก `input.onGesture(Gesture.Shake)` เพื่อเพิ่มตัวแปรนับครั้ง `shakeCount += 1`',
      },
      {
        title: 'ขั้นตอนที่ 2: นับถอยหลังและส่งเสียงปลุก',
        description: 'ใช้ลูปส่งเสียงดนตรีซ้ำไปเรื่อยๆ จนกว่า `shakeCount >= 30` จึงจะหยุดและแสดงรูปหัวใจ',
        codeSnippet: 'let count = 0\ninput.onGesture(Gesture.Shake, function () {\n  count += 1\n  basic.showNumber(count)\n})\nwhile (count < 30) {\n  music.playTone(262, music.beat(BeatFraction.Half))\n}\nmusic.stopAllSounds()\nbasic.showIcon(IconNames.Heart)',
      },
    ],
  },
  {
    id: 'proj_laser_security',
    title: 'สัญญาณกันขโมยแสงเลเซอร์เสมือน (Light Sensor Security Tripwire)',
    subtitle: 'ใช้เซ็นเซอร์วัดความเข้มแสงจำลองลำแสงเลเซอร์ป้องกันสิ่งของมีค่า',
    grade: 'ป.5',
    category: 'Safety & AI',
    difficulty: 'ปานกลาง',
    duration: '45 นาที',
    icon: '🔦',
    badgeColor: 'rose',
    hardware: ['Micro:bit V2', 'ไฟฉายขนาดเล็ก หรือ แสงเลเซอร์พอยน์เตอร์'],
    software: ['MakeCode for Micro:bit'],
    objective: 'เข้าใจการทำงานของเซ็นเซอร์วัดแสง (Light Level 0-255) และการรักษาความปลอดภัยทางกายภาพ',
    realWorldImpact: 'เรียนรู้ระบบรักษาความปลอดภัยในพิพิธภัณฑ์ ห้องคอมพิวเตอร์ และธนาคาร',
    curriculumStandard: 'ว 4.2 ป.5/2 การแก้ปัญหาเชิงตรรกะและบูรณาการความปลอดภัยดิจิทัล',
    circuitDescription: 'ใช้หน้าจอ LED 5x5 ของ Micro:bit เป็นเซ็นเซอร์วัดแสงในตัว ไม่ต้องต่ออุปกรณ์ภายนอก',
    steps: [
      {
        title: 'ขั้นตอนที่ 1: คาลิเบรตค่าแสงปกติในห้อง',
        description: 'กดปุ่ม A เพื่อบันทึกค่าแสงฐาน (Base Light Level) และฉายไฟฉายไปที่หน้าจอ Micro:bit',
      },
      {
        title: 'ขั้นตอนที่ 2: ตรวจจับเมื่อมีวัตถุตัดผ่านแสง',
        description: 'ถ้าค่าแสงลดลงฮวบฮาบ (มีคนเดินผ่านตัดลำแสง) ให้ส่งเสียงเตือนไซเรนและล็อกระบบทันที',
        codeSnippet: 'let baseLight = input.lightLevel()\nforever {\n  if (input.lightLevel() < baseLight - 30) {\n    basic.showIcon(IconNames.Angry)\n    music.ringTone(988)\n  }\n}',
      },
    ],
  },
];

interface StemProjectHubProps {
  onBack?: () => void;
  onNavigate?: (moduleKey: string, subSection?: string) => void;
  addPoints?: (amount: number, reason: string, category?: any) => void;
  onCelebrate?: () => void;
}

export const StemProjectHub: React.FC<StemProjectHubProps> = ({
  onBack,
  onNavigate,
  addPoints,
  onCelebrate,
}) => {
  const [selectedProject, setSelectedProject] = useState<StemProject>(STEM_PROJECTS[0]);
  const [activeGradeFilter, setActiveGradeFilter] = useState<'All' | 'ป.4' | 'ป.5' | 'ป.6'>('All');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'guide' | 'circuit' | 'canvas'>('guide');

  // Kids Project Canvas form state
  const [canvasProblem, setCanvasProblem] = useState('');
  const [canvasTargetUser, setCanvasTargetUser] = useState('');
  const [canvasHardware, setCanvasHardware] = useState('');
  const [canvasAlgorithm, setCanvasAlgorithm] = useState('');
  const [canvasTesting, setCanvasTesting] = useState('');
  const [canvasImpact, setCanvasImpact] = useState('');
  const [isSavedCanvas, setIsSavedCanvas] = useState(false);

  // Filter projects
  const filteredProjects = STEM_PROJECTS.filter((proj) => {
    const matchGrade = activeGradeFilter === 'All' || proj.grade === activeGradeFilter;
    const matchCat = activeCategoryFilter === 'All' || proj.category === activeCategoryFilter;
    return matchGrade && matchCat;
  });

  const handleSelectProject = (proj: StemProject) => {
    soundEffects.playClick();
    setSelectedProject(proj);
    setActiveTab('guide');
    // Pre-fill some canvas fields
    setCanvasProblem(`ต้องการแก้ปัญหาเกี่ยวกับ ${proj.subtitle}`);
    setCanvasTargetUser(`นักเรียนและคุณครูในโรงเรียน (${proj.grade})`);
    setCanvasHardware(proj.hardware.join(', '));
    setCanvasAlgorithm(`ใช้อัลกอริทึม: ${proj.steps[0].title} -> ${proj.steps[1].title}`);
    setCanvasTesting('ทดลองในสภาพแวดล้อมจริงและสังเกตผลการทำงาน');
    setCanvasImpact(proj.realWorldImpact);
    setIsSavedCanvas(false);
  };

  const handleSaveCanvas = () => {
    soundEffects.playFanfare();
    fireConfetti('burst');
    setIsSavedCanvas(true);
    if (addPoints) {
      addPoints(25, `ออกแบบโครงงานนวัตกรรม: ${selectedProject.title}`, 'coding');
    }
    if (onCelebrate) {
      onCelebrate();
    }
  };

  const handlePrintCanvas = () => {
    soundEffects.playClick();
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-700/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
                <Rocket className="w-3.5 h-3.5" />
                <span>STEM &amp; STEAM Project Hub</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-purple-200 border border-white/10">
                มาตรฐาน ว 4.2 สพฐ. &amp; สสวท.
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              คลังโครงงานนวัตกรรมต้นแบบ &amp; เครื่องมือวางแผนโครงงาน
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              ฝึกกระบวนการคิดเชิงออกแบบ (Design Thinking) จากปัญหาจริงในชีวิตประจำวัน เชื่อมโยงบอร์ด Micro:bit V2, เซ็นเซอร์ IoT, และโปรแกรม Scratch 3.0 พร้อมพิมพ์แผนงานโครงงาน A4 Project Canvas 1 หน้า
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2.5 shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>ออกแบบโครงงานรับ <strong>+25 Coder Coins</strong></span>
            </div>
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

      {/* 2. Filters & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Grade filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 shrink-0">ระดับชั้น:</span>
          {(['All', 'ป.4', 'ป.5', 'ป.6'] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => {
                soundEffects.playClick();
                setActiveGradeFilter(grade);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeGradeFilter === grade
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {grade === 'All' ? 'ทั้งหมด (ป.4-ป.6)' : grade}
            </button>
          ))}
        </div>

        {/* Tab switch inside project view */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('guide');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ขั้นตอนการสร้าง</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('circuit');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'circuit'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>วงจร &amp; Pinout</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('canvas');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'canvas'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-indigo-600 dark:text-indigo-400 hover:bg-white/50'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>ใบงาน Project Canvas (พิมพ์ A4)</span>
          </button>
        </div>
      </div>

      {/* 3. Main Split View: Left List, Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Project Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
            <span>รายการโครงงานแนะนำ ({filteredProjects.length})</span>
            <span>คลิกเพื่อดูวิธีทำ</span>
          </div>

          <div className="space-y-2.5">
            {filteredProjects.map((proj) => {
              const isSelected = selectedProject.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => handleSelectProject(proj)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-50/90 to-purple-50/50 dark:from-indigo-950/60 dark:to-slate-900 border-indigo-400 dark:border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 group-hover:scale-110 transition-transform">
                      {proj.icon}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {proj.grade}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {proj.difficulty}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{proj.duration}</span>
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {proj.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Guide & Project Canvas (8 cols) */}
        <div className="lg:col-span-8">
          {activeTab === 'canvas' ? (
            /* PROJECT CANVAS GENERATOR VIEW (PRINTABLE A4) */
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-600 text-white">
                      A4 One-Pager
                    </span>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      แผ่นกระดาษวางแผนโครงงาน (Kids Project Canvas)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    กรอกข้อมูลและบันทึกเพื่อรับแต้ม หรือกดสั่งพิมพ์ A4 เพื่อนำเสนอหน้าชั้นเรียน
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintCanvas}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>พิมพ์ใบงาน A4</span>
                  </button>
                  <button
                    onClick={handleSaveCanvas}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSavedCanvas ? 'บันทึกสำเร็จ (+25 แต้ม)' : 'บันทึกโครงงาน (+25 แต้ม)'}</span>
                  </button>
                </div>
              </div>

              {/* Printable Canvas Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {/* 1. Problem Statement */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[11px] font-mono">1</span>
                    <span>ปัญหาที่ต้องการแก้ไข (Problem Statement)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={canvasProblem}
                    onChange={(e) => setCanvasProblem(e.target.value)}
                    placeholder="เช่น ดินปลูกต้นไม้ในกระถางแห้งเฉาเวลาไม่มีคนอยู่รดน้ำ..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 2. Target Users */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[11px] font-mono">2</span>
                    <span>กลุ่มเป้าหมายหรือผู้ใช้งาน (Target Users)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={canvasTargetUser}
                    onChange={(e) => setCanvasTargetUser(e.target.value)}
                    placeholder="เช่น คุณครูเวรประจำวัน, นักเรียนชุมนุมเกษตร, แม่บ้าน..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 3. Hardware & Software */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[11px] font-mono">3</span>
                    <span>อุปกรณ์และเครื่องมือที่ใช้ (Tech Stack &amp; Hardware)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={canvasHardware}
                    onChange={(e) => setCanvasHardware(e.target.value)}
                    placeholder="เช่น บอร์ด Micro:bit V2, ปั๊มน้ำ 5V, MakeCode..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 4. Algorithm & Logic */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[11px] font-mono">4</span>
                    <span>อัลกอริทึมและเงื่อนไข (Algorithm &amp; Logic)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={canvasAlgorithm}
                    onChange={(e) => setCanvasAlgorithm(e.target.value)}
                    placeholder="เช่น ถ้าความชื้นต่ำกว่า 300 ให้เปิดปั๊ม 3 วินาที..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 5. Testing & Debugging */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[11px] font-mono">5</span>
                    <span>การทดสอบและข้อผิดพลาดที่พบ (Testing &amp; Debugging)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={canvasTesting}
                    onChange={(e) => setCanvasTesting(e.target.value)}
                    placeholder="เช่น ตรวจสอบความถูกต้องของค่า Analog จากเซ็นเซอร์เมื่อดินแห้ง..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 6. Impact on Community */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[11px] font-mono">6</span>
                    <span>ประโยชน์และผลกระทบต่อชุมชน (Impact &amp; Sustainability)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={canvasImpact}
                    onChange={(e) => setCanvasImpact(e.target.value)}
                    placeholder="เช่น ช่วยอนุรักษ์น้ำและสร้างแปลงผักปลอดภัยในโรงเรียน..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          ) : activeTab === 'circuit' ? (
            /* CIRCUIT & PINOUT DIAGRAM VIEW */
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-md space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedProject.icon}</span>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      แผนผังการต่อวงจร &amp; Pinout บอร์ด Micro:bit V2
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedProject.title}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {selectedProject.grade}
                </span>
              </div>

              {/* Circuit Explanatory Box */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>คำแนะนำการต่อสายสัญญาณ:</span>
                </div>
                <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed font-mono">
                  {selectedProject.circuitDescription}
                </p>
              </div>

              {/* Pinout Visual representation */}
              <div className="p-5 rounded-2xl bg-slate-950 text-white font-mono text-xs space-y-4 border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-emerald-400 font-bold">BBC Micro:bit V2 Edge Connector</span>
                  <span className="text-slate-400 text-[10px]">3.3V Logic Level</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-amber-400 font-bold text-sm">PIN 0 (P0)</div>
                    <div className="text-[10px] text-slate-400 mt-1">Analog In / Touch</div>
                    <div className="text-[11px] text-emerald-300 mt-1">Sensor In</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-sky-400 font-bold text-sm">PIN 1 (P1)</div>
                    <div className="text-[10px] text-slate-400 mt-1">Digital Output</div>
                    <div className="text-[11px] text-sky-300 mt-1">Relay / Motor</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-rose-400 font-bold text-sm">3V (VCC)</div>
                    <div className="text-[10px] text-slate-400 mt-1">Power +3.3V</div>
                    <div className="text-[11px] text-rose-300 mt-1">Sensor VCC</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-slate-300 font-bold text-sm">GND (0V)</div>
                    <div className="text-[10px] text-slate-400 mt-1">Ground</div>
                    <div className="text-[11px] text-slate-300 mt-1">Sensor GND</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  ⚠️ <strong>ข้อควรระวังเรื่องความปลอดภัย:</strong> ไม่ควรต่อมอเตอร์ที่กินกระแสสูงเข้ากับขา 3V ของ Micro:bit โดยตรง ควรใช้โมดูล Relay หรือบอร์ดขยาย Driver Motor เพื่อป้องกันพอร์ตเสียหาย
                </div>
              </div>

              {/* Hardware checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  รายการอุปกรณ์ที่ต้องจัดเตรียม:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProject.hardware.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* STEP-BY-STEP PROJECT GUIDE VIEW */
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-md space-y-6">
              {/* Project Header Info */}
              <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {selectedProject.grade}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    {selectedProject.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    ความยาก: {selectedProject.difficulty}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span className="text-2xl sm:text-3xl">{selectedProject.icon}</span>
                  <span>{selectedProject.title}</span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedProject.subtitle}
                </p>

                {/* Educational Goal & Standard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                      🎯 วัตถุประสงค์การเรียนรู้:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedProject.objective}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">
                      🌍 การประยุกต์ใช้ในชีวิตจริง:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedProject.realWorldImpact}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step By Step Guide List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>ขั้นตอนการลงมือปฏิบัติ (Step-by-Step Implementation)</span>
                  </h3>
                  <span className="text-xs text-slate-400">{selectedProject.steps.length} ขั้นตอน</span>
                </div>

                <div className="space-y-3">
                  {selectedProject.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {st.title}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-8.5">
                        {st.description}
                      </p>

                      {st.codeSnippet && (
                        <div className="pl-8.5 pt-1">
                          <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 text-[11px] font-mono overflow-x-auto border border-slate-800">
                            {st.codeSnippet}
                          </pre>
                        </div>
                      )}

                      {st.tips && (
                        <div className="pl-8.5 pt-1">
                          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                            <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                            <span><strong>ทริกการคิด:</strong> {st.tips}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveTab('canvas');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                >
                  <PenTool className="w-4 h-4" />
                  <span>เปิดใบงานวางแผนโครงงาน (Project Canvas)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {onNavigate && (
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onNavigate('codingLab', selectedProject.category.includes('Game') ? 'scratch' : 'microbit');
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>ไปที่ห้องทดลอง Coding Lab เพื่อจำลองรันโค้ด</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
