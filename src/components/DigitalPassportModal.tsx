import React from 'react';
import {
  X,
  Printer,
  Shield,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';
import { soundEffects } from '../utils/soundEffects.ts';

interface DigitalPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  moduleProgress: {
    safety: boolean;
    thinking: boolean;
    codingLab: boolean;
    showcase: boolean;
  };
  points: number;
}

export const DigitalPassportModal: React.FC<DigitalPassportModalProps> = ({
  isOpen,
  onClose,
  profile,
  moduleProgress,
  points,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundEffects.playClick();
    window.print();
  };

  const completedCount = Object.values(moduleProgress).filter(Boolean).length;
  const userLevel = Math.max(1, Math.floor(points / 75) + 1);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[95vh] overflow-y-auto print:max-w-none print:shadow-none print:border-none print:p-0 print:max-h-none print:dark:bg-white print:text-black">
        
        {/* Modal Top Bar (Hidden during print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📖</span>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                พาสปอร์ตการเรียนรู้โค้ดดิ้ง (Digital Coding Passport)
              </h3>
              <p className="text-xs text-slate-500">
                สมุดสะสมวีซ่าและแสตมป์รับรองสมรรถนะวิทยาการคำนวณ พิมพ์ขนาด A4 ได้ทันที
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์พาสปอร์ต (Print A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= Printable Passport Canvas ================= */}
        <div className="border-4 border-indigo-900 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-50/40 via-white to-indigo-50/30 print:border-2 print:border-black print:p-6 print:rounded-none">
          
          {/* Official Emblem & Header */}
          <div className="text-center space-y-2 pb-6 border-b-2 border-indigo-900/30">
            <div className="w-14 h-14 mx-auto rounded-full bg-indigo-900 text-amber-400 flex items-center justify-center text-2xl shadow-md border-2 border-amber-300">
              👑
            </div>
            <div className="font-serif tracking-widest text-xs uppercase text-indigo-900 font-bold">
              KINGDOM OF THAILAND • MINISTRY OF EDUCATION
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-indigo-950 font-serif tracking-tight">
              พาสปอร์ตการเรียนรู้วิทยาการคำนวณ (CODING PASSPORT)
            </h1>
            <p className="text-[11px] text-slate-600 font-serif">
              หลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี (สสวท. / สพฐ.)
            </p>
          </div>

          {/* Student Profile Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-6 border-b-2 border-indigo-900/30">
            {/* Avatar Photo Frame */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="w-28 h-32 rounded-2xl border-2 border-dashed border-indigo-700 bg-white shadow-inner flex flex-col items-center justify-center p-2 relative">
                <span className="text-5xl">{profile.avatarEmoji || '🐱'}</span>
                <span className="mt-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-900 text-amber-300">
                  LEVEL {userLevel}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 font-mono">OFFICIAL PHOTO</span>
              </div>
            </div>

            {/* Identification Details */}
            <div className="md:col-span-8 grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-serif">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-sans block">ชื่อ-นามสกุล / Full Name</span>
                <span className="font-bold text-sm text-slate-900">{profile.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-sans block">รหัสนักเรียน / Student ID</span>
                <span className="font-mono font-bold text-slate-800">{profile.studentId || 'CK-2569-4102'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-sans block">ระดับชั้น / Grade Level</span>
                <span className="font-bold text-slate-900">{profile.grade}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-sans block">สถานศึกษา / School</span>
                <span className="font-bold text-slate-900">{profile.school}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-sans block">แต้มสะสม / Coder Coins</span>
                <span className="font-mono font-bold text-amber-700 text-sm">{points} แต้ม</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-sans block">วันที่ออกพาสปอร์ต / Date of Issue</span>
                <span className="font-bold text-slate-900">{profile.joinedDate || '12 มีนาคม 2026'}</span>
              </div>
            </div>
          </div>

          {/* 4 Visa Stamps Grid */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm uppercase tracking-wider text-indigo-950 font-serif flex items-center gap-1.5">
                <span>ตราประทับวีซ่าสมรรถนะ 4 ดินแดน (COMPETENCY VISA STAMPS)</span>
              </h4>
              <span className="text-xs font-mono font-bold text-indigo-800">
                ผ่านการรับรอง: {completedCount} / 4 โมดูล
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Stamp 1 */}
              <div className={`p-4 rounded-2xl border-2 transition-all relative ${
                moduleProgress.safety
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 opacity-60 border-dashed'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">1. ความปลอดภัยดิจิทัล &amp; PDPA</div>
                      <div className="text-[10px] text-slate-500 font-mono">CODE: VISA-PDPA-2026</div>
                    </div>
                  </div>
                  {moduleProgress.safety ? (
                    <div className="w-12 h-12 rounded-full border-2 border-emerald-700 text-emerald-800 flex items-center justify-center font-bold text-[9px] uppercase font-mono rotate-12 bg-white/80 shadow-xs">
                      APPROVED
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">PENDING</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-600 mt-2">
                  ผ่านการทดสอบรหัสผ่าน 2FA, การคัดแยกข้อมูลส่วนบุคคล และมารยาทไซเบอร์
                </div>
              </div>

              {/* Stamp 2 */}
              <div className={`p-4 rounded-2xl border-2 transition-all relative ${
                moduleProgress.thinking
                  ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 opacity-60 border-dashed'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🧩</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">2. การคิดเชิงคำนวณ (Computational)</div>
                      <div className="text-[10px] text-slate-500 font-mono">CODE: VISA-ALGO-2026</div>
                    </div>
                  </div>
                  {moduleProgress.thinking ? (
                    <div className="w-12 h-12 rounded-full border-2 border-amber-700 text-amber-800 flex items-center justify-center font-bold text-[9px] uppercase font-mono -rotate-6 bg-white/80 shadow-xs">
                      APPROVED
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">PENDING</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-600 mt-2">
                  เชี่ยวชาญ 4 เสาหลักการคิดแก้ปัญหา ผังงาน Flowchart และเกมอัลกอริทึม
                </div>
              </div>

              {/* Stamp 3 */}
              <div className={`p-4 rounded-2xl border-2 transition-all relative ${
                moduleProgress.codingLab
                  ? 'border-sky-600 bg-sky-50/50 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 opacity-60 border-dashed'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💻</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">3. ปฏิบัติการ Scratch &amp; Micro:bit</div>
                      <div className="text-[10px] text-slate-500 font-mono">CODE: VISA-CODE-2026</div>
                    </div>
                  </div>
                  {moduleProgress.codingLab ? (
                    <div className="w-12 h-12 rounded-full border-2 border-sky-700 text-sky-800 flex items-center justify-center font-bold text-[9px] uppercase font-mono rotate-6 bg-white/80 shadow-xs">
                      APPROVED
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">PENDING</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-600 mt-2">
                  สร้างเกมด้วยบล็อกคำสั่ง Scratch และจำลองบอร์ด Micro:bit V2 สำเร็จ
                </div>
              </div>

              {/* Stamp 4 */}
              <div className={`p-4 rounded-2xl border-2 transition-all relative ${
                moduleProgress.showcase
                  ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 opacity-60 border-dashed'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">4. แสดงผลงานและสะท้อนคิด</div>
                      <div className="text-[10px] text-slate-500 font-mono">CODE: VISA-STAR-2026</div>
                    </div>
                  </div>
                  {moduleProgress.showcase ? (
                    <div className="w-12 h-12 rounded-full border-2 border-purple-700 text-purple-800 flex items-center justify-center font-bold text-[9px] uppercase font-mono -rotate-12 bg-white/80 shadow-xs">
                      APPROVED
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">PENDING</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-600 mt-2">
                  แบ่งปันโครงงาน ให้ข้อเสนอแนะเพื่อน (Peer Review) และบันทึกสะท้อนคิด
                </div>
              </div>

            </div>
          </div>

          {/* Teacher and Parent Endorsement Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t-2 border-indigo-900/30 text-center text-xs font-serif">
            <div>
              <div className="w-48 mx-auto border-b border-dotted border-slate-700 pb-1 h-8"></div>
              <p className="mt-1 font-bold text-slate-900">ลงชื่อ ................................................................</p>
              <p className="text-[11px] text-slate-500">( ครูผู้สอนกลุ่มสาระวิทยาศาสตร์และเทคโนโลยี )</p>
            </div>
            <div>
              <div className="w-48 mx-auto border-b border-dotted border-slate-700 pb-1 h-8"></div>
              <p className="mt-1 font-bold text-slate-900">ลงชื่อ ................................................................</p>
              <p className="text-[11px] text-slate-500">( ผู้ปกครองนักเรียนรับทราบความก้าวหน้า )</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
