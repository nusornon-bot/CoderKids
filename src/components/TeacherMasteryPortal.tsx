import React, { useState } from 'react';
import {
  GraduationCap,
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Filter,
  Search,
  Plus,
  Trash2,
  X,
  Sparkles,
  ClipboardCheck,
  TrendingUp,
  Award,
  Layers,
  Save,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';

interface TeacherMasteryPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StudentGradeRecord {
  id: string;
  code: string;
  name: string;
  grade: 'ป.4' | 'ป.5' | 'ป.6';
  room: string;
  indicator1: number; // 1-4 (4=ดีเยี่ยม, 3=ดี, 2=พอใช้, 1=ปรับปรุง)
  indicator2: number;
  indicator3: number;
  indicator4: number;
  attendancePercent: number;
  notes: string;
}

const INITIAL_STUDENTS: StudentGradeRecord[] = [
  { id: 'st1', code: '04101', name: 'ด.ช. กวินทร์ แสนดี', grade: 'ป.4', room: '4/1', indicator1: 4, indicator2: 4, indicator3: 3, indicator4: 4, attendancePercent: 98, notes: 'เด่นการเขียนโค้ด Scratch และแก้บั๊กไว' },
  { id: 'st2', code: '04102', name: 'ด.ญ. นลินทิพย์ วงศ์สว่าง', grade: 'ป.4', room: '4/1', indicator1: 3, indicator2: 4, indicator3: 4, indicator4: 4, attendancePercent: 100, notes: 'เข้าใจเรื่องความปลอดภัยไซเบอร์และ PDPA ดีมาก' },
  { id: 'st3', code: '04103', name: 'ด.ช. ภัทรดนัย บุญชู', grade: 'ป.4', room: '4/1', indicator1: 3, indicator2: 3, indicator3: 3, indicator4: 3, attendancePercent: 92, notes: 'ผ่านเกณฑ์มาตรฐานทุกตัวชี้วัด' },
  { id: 'st4', code: '04104', name: 'ด.ญ. ฐิตาภา สุขสมบูรณ์', grade: 'ป.4', room: '4/1', indicator1: 4, indicator2: 4, indicator3: 4, indicator4: 4, attendancePercent: 100, notes: 'ผลงานดีเด่น สมรรถนะครบ 4 เสาหลัก' },
  { id: 'st5', code: '05101', name: 'ด.ช. อิทธิกร วารินทร์', grade: 'ป.5', room: '5/1', indicator1: 4, indicator2: 3, indicator3: 4, indicator4: 4, attendancePercent: 95, notes: 'เก่งการต่อวงจรเซ็นเซอร์ Micro:bit' },
  { id: 'st6', code: '05102', name: 'ด.ญ. ปรียานุช รัตนศิลป์', grade: 'ป.5', room: '5/1', indicator1: 3, indicator2: 3, indicator3: 3, indicator4: 4, attendancePercent: 96, notes: 'มีวินัยดิจิทัลสูง ช่วยเหลือเพื่อนในกลุ่ม' },
  { id: 'st7', code: '06101', name: 'ด.ช. พงศกร มั่นคง', grade: 'ป.6', room: '6/2', indicator1: 4, indicator2: 4, indicator3: 4, indicator4: 4, attendancePercent: 99, notes: 'พร้อมแข่งขันทักษะวิชาการระดับเขตพื้นที่' },
  { id: 'st8', code: '06102', name: 'ด.ญ. กานดา รักษ์แผ่นดิน', grade: 'ป.6', room: '6/2', indicator1: 3, indicator2: 4, indicator3: 3, indicator4: 4, attendancePercent: 94, notes: 'ออกแบบผังงาน Flowchart ได้เป็นระบบ' },
];

const CURRICULUM_INDICATORS = {
  'ป.4': [
    { code: 'ว 4.2 ป.4/1', name: 'ใช้เหตุผลเชิงตรรกะในการแก้ปัญหาและอธิบายการทำงาน' },
    { code: 'ว 4.2 ป.4/2', name: 'ออกแบบและเขียนโปรแกรมอย่างง่าย ตรวจหาข้อผิดพลาด' },
    { code: 'ว 4.2 ป.4/3', name: 'ใช้อินเทอร์เน็ตค้นหาความรู้และประเมินความน่าเชื่อถือ' },
    { code: 'ว 4.2 ป.4/4', name: 'รวบรวม ประมวลผล นำเสนอข้อมูลสารสนเทศตามวัตถุประสงค์' },
  ],
  'ป.5': [
    { code: 'ว 4.2 ป.5/1', name: 'ใช้เหตุผลเชิงตรรกะในการคาดการณ์ผลลัพธ์จากปัญหาอย่างง่าย' },
    { code: 'ว 4.2 ป.5/2', name: 'ออกแบบและเขียนโปรแกรม ตรวจหาและแก้ไขข้อผิดพลาด (Debug)' },
    { code: 'ว 4.2 ป.5/3', name: 'ใช้อินเทอร์เน็ตค้นหาข้อมูลอย่างมีประสิทธิภาพ ประเมินความน่าเชื่อถือ' },
    { code: 'ว 4.2 ป.5/4', name: 'ใช้เทคโนโลยีสารสนเทศอย่างปลอดภัย มีมารยาท เข้าใจสิทธิและหน้าที่' },
  ],
  'ป.6': [
    { code: 'ว 4.2 ป.6/1', name: 'ใช้เหตุผลเชิงตรรกะในการอธิบายและออกแบบวิธีการแก้ปัญหาที่ซับซ้อน' },
    { code: 'ว 4.2 ป.6/2', name: 'ออกแบบและเขียนโปรแกรมเพื่อแก้ปัญหา ตรวจหาข้อผิดพลาดของโปรแกรม' },
    { code: 'ว 4.2 ป.6/3', name: 'ใช้อินเทอร์เน็ตสืบค้นข้อมูลอย่างมีประสิทธิภาพ ประเมินความน่าเชื่อถือของข้อมูล' },
    { code: 'ว 4.2 ป.6/4', name: 'ใช้เทคโนโลยีสารสนเทศทำงานร่วมกันอย่างปลอดภัย เข้าใจสิทธิและหน้าที่ตนเอง' },
  ],
};

const LESSON_PLANS_5E = [
  {
    grade: 'ป.4',
    title: 'แผนการจัดการเรียนรู้ที่ 1: ตะลุยเขาวงกตด้วยอัลกอริทึม (Decomposition & Pattern)',
    hours: '2 คาบ (100 นาที)',
    steps: {
      engagement: 'ขั้นสร้างความสนใจ (15 นาที): ครูเปิดคลิปสั้นหุ่นยนต์ส่งของหลงทางในโกดัง ให้นักเรียนช่วยกันคิดหาสาเหตุ',
      exploration: 'ขั้นสำรวจและค้นหา (30 นาที): นักเรียนแบ่งกลุ่ม 3-4 คน เล่นเกม Algorithm Puzzle บนแท็บเล็ต Coder Kids',
      explanation: 'ขั้นอธิบายและลงข้อสรุป (25 นาที): ตัวแทนกลุ่มนำเสนอขั้นตอนการเดินหน้า เลี้ยวซ้าย-ขวา และการตรวจจับสิ่งกีดขวาง',
      elaboration: 'ขั้นขยายความรู้ (20 นาที): ให้นักเรียนเขียนผังงาน Flowchart จำลองขั้นตอนการเดินออกจากบ้านมาโรงเรียน',
      evaluation: 'ขั้นประเมินผล (10 นาที): ทำแบบทดสอบสั้น 5 ข้อ และประเมินสมรรถนะตามเกณฑ์รูบริก ว 4.2 ป.4/1',
    },
  },
  {
    grade: 'ป.5',
    title: 'แผนการจัดการเรียนรู้ที่ 2: แปลงผักอัจฉริยะ IoT และการเขียนโปรแกรมเงื่อนไข If-Else',
    hours: '3 คาบ (150 นาที)',
    steps: {
      engagement: 'ขั้นสร้างความสนใจ (15 นาที): คุณครูนำต้นไม้ที่เหี่ยวเฉามาให้สังเกต พร้อมถามว่า "ถ้าเราไปเที่ยวเสาร์-อาทิตย์จะดูแลต้นไม้อย่างไร?"',
      exploration: 'ขั้นสำรวจและค้นหา (45 นาที): นักเรียนทดลองนำเซ็นเซอร์วัดความชื้นปักลงดินแห้งและดินเปียกเพื่อดูค่าตัวเลขบน Micro:bit',
      explanation: 'ขั้นอธิบายและลงข้อสรุป (30 นาที): อภิปรายคำสั่งเงื่อนไข If soilMoisture < 300 Then เปิดน้ำ Else ปิดน้ำ',
      elaboration: 'ขั้นขยายความรู้ (40 นาที): ต่อยอดระบบให้ส่งเสียงร้องเตือน Buzzer เมื่อน้ำในถังสำรองหมด',
      evaluation: 'ขั้นประเมินผล (20 นาที): ทดสอบโครงงานแปลงผักจริงและบันทึกผลการประเมินลง ปพ.5 ว 4.2 ป.5/2',
    },
  },
  {
    grade: 'ป.6',
    title: 'แผนการจัดการเรียนรู้ที่ 3: ป้องกันภัย Deepfake & ไซเบอร์ไฮยีน (PDPA & Netiquette)',
    hours: '2 คาบ (100 นาที)',
    steps: {
      engagement: 'ขั้นสร้างความสนใจ (15 นาที): ครูฉายภาพ AI Deepfake ดาราชื่อดังพูดขายของปลอม ให้นักเรียนทายว่าจริงหรือปลอม',
      exploration: 'ขั้นสำรวจและค้นหา (35 นาที): ใช้อุปกรณ์แว่นขยายใน AiPromptLab ส่องหารอยต่อ แสงสะท้อนในตา และการเคลื่อนไหวริมฝีปาก',
      explanation: 'ขั้นอธิบายและลงข้อสรุป (20 นาที): สรุป 5 วิธีสังเกตข่าวปลอม และกฎหมาย PDPA การนำรูปผู้อื่นไปโพสต์ประจาน',
      elaboration: 'ขั้นขยายความรู้ (20 นาที): นักเรียนสร้างโปสเตอร์ดิจิทัล "รู้ทันภัยไซเบอร์" เพื่อติดบอร์ดประชาสัมพันธ์หน้าห้อง',
      evaluation: 'ขั้นประเมินผล (10 นาที): ทำแบบทดสอบความตระหนักรู้ด้านความปลอดภัยดิจิทัล ว 4.2 ป.6/4',
    },
  },
];

export const TeacherMasteryPortal: React.FC<TeacherMasteryPortalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'porpor5' | 'lesson5e' | 'rubricGuide'>('porpor5');
  const [selectedGrade, setSelectedGrade] = useState<'ป.4' | 'ป.5' | 'ป.6'>('ป.4');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentGradeRecord[]>(INITIAL_STUDENTS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredStudents = students.filter(
    (s) => s.grade === selectedGrade && (s.name.includes(searchQuery) || s.code.includes(searchQuery))
  );

  // Update a single student's indicator score
  const updateScore = (id: string, field: 'indicator1' | 'indicator2' | 'indicator3' | 'indicator4', val: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: Math.max(1, Math.min(4, val)) } : s))
    );
  };

  const calculateStudentAvg = (s: StudentGradeRecord) => {
    return ((s.indicator1 + s.indicator2 + s.indicator3 + s.indicator4) / 4).toFixed(2);
  };

  const getRubricBadge = (avg: number) => {
    if (avg >= 3.5) return { label: 'ดีเยี่ยม (4)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    if (avg >= 2.5) return { label: 'ดี (3)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    if (avg >= 1.5) return { label: 'พอใช้ (2)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    return { label: 'ปรับปรุง (1)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
  };

  // CSV Export Function
  const handleExportCSV = () => {
    const indicators = CURRICULUM_INDICATORS[selectedGrade];
    const header = ['รหัสนักเรียน', 'ชื่อ-สกุล', 'ชั้น', 'ห้อง', indicators[0].code, indicators[1].code, indicators[2].code, indicators[3].code, 'คะแนนเฉลี่ย', 'ร้อยละการเข้าเรียน', 'บันทึกคุณครู'];

    const rows = filteredStudents.map((s) => [
      s.code,
      `"${s.name}"`,
      s.grade,
      s.room,
      s.indicator1,
      s.indicator2,
      s.indicator3,
      s.indicator4,
      calculateStudentAvg(s),
      `${s.attendancePercent}%`,
      `"${s.notes}"`,
    ]);

    const csvContent = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PorPor5_Grade_${selectedGrade}_CoderKids.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    soundEffects.play('correct');
  };

  // Print A4 Form
  const handlePrint = () => {
    soundEffects.play('click');
    window.print();
  };

  const handleSave = () => {
    soundEffects.play('badge');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-6xl rounded-3xl bg-slate-900 border border-indigo-500/30 text-white shadow-2xl flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300">
              <GraduationCap className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                  ศูนย์รวมคุณครู ว 4.2 & บันทึก ปพ.5 📚
                </h2>
                <span className="px-2.5 py-0.5 text-[11px] rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  สพฐ. / สสวท. มาตรฐาน
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ระบบจัดการคะแนนตัวชี้วัดรายบุคคล, รูบริกประเมินสมรรถนะ, แผนการสอน 5E และส่งออกเอกสารการศึกษา
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('porpor5')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'porpor5'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>แบบบันทึกคะแนน ปพ.5</span>
            </button>
            <button
              onClick={() => setActiveTab('lesson5e')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'lesson5e'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>คลังแผนการจัดการเรียนรู้ 5E</span>
            </button>
            <button
              onClick={() => setActiveTab('rubricGuide')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'rubricGuide'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>เกณฑ์รูบริก 4 ระดับคุณภาพ</span>
            </button>
          </div>

          {activeTab === 'porpor5' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">เลือกระดับชั้น:</span>
              {(['ป.4', 'ป.5', 'ป.6'] as const).map((gr) => (
                <button
                  key={gr}
                  onClick={() => setSelectedGrade(gr)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    selectedGrade === gr
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {gr}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab 1: Por-Por-5 Grading Sheet */}
        {activeTab === 'porpor5' && (
          <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาชื่อหรือรหัสนักเรียน..."
                    className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-56"
                  />
                </div>
                <div className="text-xs text-slate-400">
                  นักเรียนในชั้น {selectedGrade}: <strong>{filteredStudents.length} คน</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? 'บันทึกสำเร็จ! ✓' : 'บันทึกข้อมูล'}</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition flex items-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ดาวน์โหลด CSV (Excel)</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์แบบฟอร์ม ปพ.5</span>
                </button>
              </div>
            </div>

            {/* Indicator Legend Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[11px]">
              {CURRICULUM_INDICATORS[selectedGrade].map((ind, i) => (
                <div key={i} className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-cyan-400 font-mono">ตัวชี้วัดที่ {i + 1} ({ind.code})</div>
                  <div className="text-slate-400 text-[10px] mt-0.5 line-clamp-2">{ind.name}</div>
                </div>
              ))}
            </div>

            {/* Roster Table */}
            <div className="rounded-2xl border border-slate-800 overflow-x-auto bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                    <th className="p-3">รหัส</th>
                    <th className="p-3">ชื่อ-นามสกุล</th>
                    <th className="p-3 text-center">ตัวชี้วัด 1</th>
                    <th className="p-3 text-center">ตัวชี้วัด 2</th>
                    <th className="p-3 text-center">ตัวชี้วัด 3</th>
                    <th className="p-3 text-center">ตัวชี้วัด 4</th>
                    <th className="p-3 text-center">เฉลี่ย</th>
                    <th className="p-3 text-center">ระดับคุณภาพ</th>
                    <th className="p-3 text-center">การเข้าเรียน</th>
                    <th className="p-3">หมายเหตุคุณครู</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredStudents.map((s) => {
                    const avg = parseFloat(calculateStudentAvg(s));
                    const badge = getRubricBadge(avg);

                    return (
                      <tr key={s.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-3 font-mono text-cyan-300 font-medium">{s.code}</td>
                        <td className="p-3 font-semibold text-white whitespace-nowrap">{s.name}</td>

                        {/* Editable Indicator 1 */}
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="1"
                            max="4"
                            value={s.indicator1}
                            onChange={(e) => updateScore(s.id, 'indicator1', parseInt(e.target.value) || 1)}
                            className="w-10 text-center py-1 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold focus:border-cyan-400 outline-none"
                          />
                        </td>
                        {/* Editable Indicator 2 */}
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="1"
                            max="4"
                            value={s.indicator2}
                            onChange={(e) => updateScore(s.id, 'indicator2', parseInt(e.target.value) || 1)}
                            className="w-10 text-center py-1 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold focus:border-cyan-400 outline-none"
                          />
                        </td>
                        {/* Editable Indicator 3 */}
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="1"
                            max="4"
                            value={s.indicator3}
                            onChange={(e) => updateScore(s.id, 'indicator3', parseInt(e.target.value) || 1)}
                            className="w-10 text-center py-1 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold focus:border-cyan-400 outline-none"
                          />
                        </td>
                        {/* Editable Indicator 4 */}
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="1"
                            max="4"
                            value={s.indicator4}
                            onChange={(e) => updateScore(s.id, 'indicator4', parseInt(e.target.value) || 1)}
                            className="w-10 text-center py-1 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold focus:border-cyan-400 outline-none"
                          />
                        </td>

                        <td className="p-3 text-center font-mono font-bold text-white">{avg.toFixed(2)}</td>

                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>

                        <td className="p-3 text-center font-mono text-emerald-400">{s.attendancePercent}%</td>

                        <td className="p-3 text-slate-400 text-xs truncate max-w-xs">{s.notes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: 5E Lesson Plans */}
        {activeTab === 'lesson5e' && (
          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              {LESSON_PLANS_5E.map((plan, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold mr-2">
                        ระดับ {plan.grade}
                      </span>
                      <h3 className="font-bold text-white text-base inline">{plan.title}</h3>
                    </div>
                    <span className="text-xs text-slate-400">⏱️ เวลาสอน: {plan.hours}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="font-bold text-amber-400 flex items-center gap-1">
                        <span>1. Engagement</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{plan.steps.engagement}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="font-bold text-cyan-400 flex items-center gap-1">
                        <span>2. Exploration</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{plan.steps.exploration}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="font-bold text-blue-400 flex items-center gap-1">
                        <span>3. Explanation</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{plan.steps.explanation}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="font-bold text-purple-400 flex items-center gap-1">
                        <span>4. Elaboration</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{plan.steps.elaboration}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="font-bold text-emerald-400 flex items-center gap-1">
                        <span>5. Evaluation</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{plan.steps.evaluation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Rubric Guide */}
        {activeTab === 'rubricGuide' && (
          <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                <div className="text-emerald-300 font-bold text-base flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>ระดับ 4: ดีเยี่ยม (3.5 - 4.0)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  สามารถออกแบบอัลกอริทึม ตรวจหาและแก้ไขข้อผิดพลาด (Debug) ได้อย่างแม่นยำด้วยตนเอง
                  ประยุกต์ใช้แนวคิดเชิงคำนวณแก้ปัญหาในสถานการณ์ใหม่ได้อย่างสร้างสรรค์
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/40 space-y-2">
                <div className="text-blue-300 font-bold text-base flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  <span>ระดับ 3: ดี (2.5 - 3.4)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  เขียนโปรแกรมและแก้ปัญหาตามขั้นตอนที่กำหนดได้ถูกต้องครบถ้วน เข้าใจการทำงานของบล็อกคำสั่ง
                  และตระหนักถึงความปลอดภัยไซเบอร์
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                <div className="text-amber-300 font-bold text-base flex items-center gap-1.5">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <span>ระดับ 2: พอใช้ (1.5 - 2.4)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  สามารถแก้ปัญหาและเขียนโปรแกรมอย่างง่ายได้เมื่อได้รับคำแนะนำหรือมีตัวอย่างเปรียบเทียบ
                  เข้าใจข้อผิดพลาดเมื่อมีผู้ชี้แนะ
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-2">
                <div className="text-rose-300 font-bold text-base flex items-center gap-1.5">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                  <span>ระดับ 1: ปรับปรุง (1.0 - 1.4)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ยังไม่สามารถจัดลำดับขั้นตอนการแก้ปัญหาหรือเขียนโปรแกรมได้ ต้องการการดูแลและสอนเสริมอย่างใกล้ชิด
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            🏫 อ้างอิง: หลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน พ.ศ. 2551 (ฉบับปรับปรุง พ.ศ. 2560) กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี สาระที่ 4
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
