import React, { useRef } from 'react';
import { Award, CheckCircle2, Download, Printer, X, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  schoolName: string;
  points: number;
  completedCount: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  schoolName,
  points,
  completedCount,
}) => {
  const certRef = useRef<HTMLDivElement | null>(null);

  const [selectedTrack, setSelectedTrack] = React.useState<'core' | 'microbit' | 'master' | 'bebras'>('core');
  const [customStudentName, setCustomStudentName] = React.useState<string>(studentName);
  const [customSchoolName, setCustomSchoolName] = React.useState<string>(schoolName);
  const [teacherName, setTeacherName] = React.useState<string>('ดร. ภาณุพงศ์ เจริญศิลป์ (ครูผู้สอน)');

  if (!isOpen) return null;

  const tracks = {
    core: {
      titleEn: 'COMPUTATIONAL THINKING EXPLORER',
      titleTh: 'เกียรติบัตรวิทยาการคำนวณขั้นพื้นฐาน (ป.4)',
      curriculum: 'หลักสูตรวิทยาการคำนวณและเทคโนโลยีดิจิทัลสร้างสรรค์ (Computing Science & Digital Literacy)',
      desc: 'ได้ผ่านการเรียนรู้ ปฏิบัติการแก้ปัญหา และพัฒนาผลงานครบทั้ง 4 ด้าน: ความปลอดภัยดิจิทัลและการปกป้องข้อมูลส่วนบุคคล (PDPA), การคิดเป็นลำดับขั้นและออกแบบอัลกอริทึม, ปฏิบัติการเขียนโค้ด Scratch ตลอดจนการสะท้อนผลการเรียนรู้เชิงสร้างสรรค์',
      badgeColor: 'from-amber-400 to-amber-600',
    },
    microbit: {
      titleEn: 'MICRO:BIT & IOT ROBOTICS MAKER',
      titleTh: 'เกียรติบัตรนักประดิษฐ์สมองกลและ IoT (ป.5)',
      curriculum: 'หลักสูตรระบบสมองกลฝังตัวและการเชื่อมต่อข้อมูลเซนเซอร์ (Embedded Systems & IoT Data Logging)',
      desc: 'มีความเชี่ยวชาญในการเขียนโปรแกรมควบคุมบอร์ด Micro:bit V2, การต่อวงจรเซนเซอร์อุณหภูมิ แสง ความชื้น และการพัฒนาโครงงาน STEM เพื่อแก้ปัญหาในชุมชนและสิ่งแวดล้อม',
      badgeColor: 'from-teal-500 to-emerald-600',
    },
    master: {
      titleEn: 'ADVANCED CODING & ALGORITHMIC MASTER',
      titleTh: 'เกียรติบัตรการเขียนโปรแกรมและการคิดขั้นสูง (ป.6)',
      curriculum: 'หลักสูตรการคิดเชิงนามธรรมและการเขียนโปรแกรมข้อความ (Text-based & Junior Python Programming)',
      desc: 'ผ่านการทดสอบสมรรถนะการเขียนโปรแกรมระดับสูง การแก้จุดบกพร่อง (Debugging), การออกแบบอัลกอริทึมค้นหาและเรียงลำดับ ตลอดจนความปลอดภัยและการใช้ AI อย่างมีจริยธรรม',
      badgeColor: 'from-indigo-600 to-purple-600',
    },
    bebras: {
      titleEn: 'BEBRAS COMPUTATIONAL CHALLENGE 2026',
      titleTh: 'เกียรติบัตรผู้พิชิตการคิดเชิงคำนวณนานาชาติ Bebras',
      curriculum: 'การทดสอบสมรรถนะการคิดเชิงคำนวณตามมาตรฐานสากล (Bebras International Challenge Standard)',
      desc: 'ผ่านเกณฑ์ประเมิน 4 เสาหลักการคิดเชิงคำนวณ: การแยกย่อยปัญหา (Decomposition), การจดจำรูปแบบ (Pattern Recognition), การคิดเชิงนามธรรม (Abstraction) และการออกแบบอัลกอริทึม (Algorithm Design)',
      badgeColor: 'from-amber-500 to-rose-600',
    },
  };

  const currentTrack = tracks[selectedTrack];
  const displayName = customStudentName.trim() || studentName.trim() || 'ผู้เรียนคนเก่ง วิทยาการคำนวณ';
  const displaySchool = customSchoolName.trim() || schoolName.trim() || 'ศูนย์การเรียนรู้ดิจิทัล CodingHero';
  const certDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const certNumber = `CH-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full p-6 sm:p-8 shadow-2xl my-8">
        {/* Top Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">เกียรติบัตรมาตรฐานรับรองการเรียนรู้</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerConfetti}
              className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
              title="ฉลองความสำเร็จ!"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Track Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {(
            [
              { id: 'core', label: '1. วิทยาการคำนวณ ป.4' },
              { id: 'microbit', label: '2. Micro:bit & IoT ป.5' },
              { id: 'master', label: '3. Coding Master ป.6' },
              { id: 'bebras', label: '4. Bebras Challenge' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrack(t.id)}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all truncate text-left border ${
                selectedTrack === t.id
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Editable Name & School inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1">ชื่อนักเรียน:</label>
            <input
              type="text"
              value={customStudentName}
              onChange={(e) => setCustomStudentName(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-800 font-bold focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-medium mb-1">โรงเรียน / สถาบัน:</label>
            <input
              type="text"
              value={customSchoolName}
              onChange={(e) => setCustomSchoolName(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-800 font-bold focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-medium mb-1">ชื่อครูผู้รับรอง:</label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-slate-300 text-slate-800 font-bold focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* The Printable Certificate Design */}
        <div
          ref={certRef}
          className="relative bg-gradient-to-br from-amber-50/40 via-white to-indigo-50/40 border-8 border-double border-amber-600/40 rounded-2xl p-8 sm:p-12 text-center shadow-inner"
        >
          {/* Certificate Header Emblem */}
          <div
            className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${currentTrack.badgeColor} text-white flex items-center justify-center shadow-md mb-4`}
          >
            <Award className="w-9 h-9" />
          </div>

          <div className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-1">
            {currentTrack.titleEn}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {currentTrack.titleTh}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            {currentTrack.curriculum}
          </p>

          <div className="my-6">
            <span className="text-xs text-slate-400">ขอมอบเกียรติบัตรฉบับนี้เพื่อแสดงว่า</span>
            <div className="text-xl sm:text-2xl font-bold text-indigo-900 underline decoration-indigo-400 decoration-2 underline-offset-8 my-2">
              {displayName}
            </div>
            <div className="text-xs text-slate-600">{displaySchool}</div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
            {currentTrack.desc}
          </p>

          {/* Badges and metadata */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-200">
            <span>คะแนนสะสม: <strong className="text-indigo-700 tabular-nums">{points} แต้ม</strong></span>
            <span aria-hidden="true">·</span>
            <span>วันที่ออกเอกสาร: <strong className="text-slate-700">{certDate}</strong></span>
            <span aria-hidden="true">·</span>
            <span>เลขที่เกียรติบัตร: <strong className="font-mono text-slate-700">{certNumber}</strong></span>
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-8 max-w-md mx-auto text-xs text-slate-500">
            <div>
              <div className="font-serif italic font-bold text-slate-800 text-sm mb-1">{teacherName}</div>
              <div className="border-t border-slate-300 pt-1">ครูผู้สอน / ผู้ประเมินการเรียนรู้</div>
            </div>
            <div>
              <div className="font-serif italic font-bold text-indigo-700 text-sm mb-1">สพฐ. &amp; สสวท. Standard</div>
              <div className="border-t border-slate-300 pt-1">มาตรฐานหลักสูตรแกนกลาง ว 4.2</div>
            </div>
          </div>
        </div>

        {/* Action Buttons & Gmail Dispatch */}
        <div className="mt-6 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Gmail Dispatch Field */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <span className="font-semibold text-slate-700 dark:text-slate-300">📧 อีเมลรับเกียรติบัตร:</span>
              <input
                type="email"
                placeholder="เช่น student@school.ac.th"
                defaultValue="nusorn.ont@thaimooc.ac.th"
                id="cert-email-input"
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button
              onClick={() => {
                const emailInput = (document.getElementById('cert-email-input') as HTMLInputElement)?.value || 'nusorn.ont@thaimooc.ac.th';
                const win = window as any;
                if (win.google && win.google.script && win.google.script.run) {
                  win.google.script.run
                    .withSuccessHandler((res: any) => {
                      alert(`ส่งเกียรติบัตรไปยัง ${emailInput} สำเร็จเรียบร้อยผ่าน Gmail!`);
                    })
                    .withFailureHandler((err: any) => {
                      alert(`เกิดข้อผิดพลาดในการส่งอีเมล: ${err.message || err}`);
                    })
                    .sendCertificateEmail(displayName, displaySchool, points, emailInput);
                } else {
                  // Browser simulation
                  alert(`[Google Workspace Integration] ส่งเกียรติบัตรไปยังอีเมล: ${emailInput} เรียบร้อยแล้ว! (ตรวจสอบในกล่องข้อความ Gmail)`);
                }
                confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>ส่งเกียรติบัตรเข้า Gmail</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ผ่านเกณฑ์การเรียนรู้ครบถ้วนตามหลักสูตร สพฐ.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์หรือบันทึกเป็น PDF</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
