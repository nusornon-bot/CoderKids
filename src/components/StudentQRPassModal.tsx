import React, { useState } from 'react';
import {
  QrCode,
  Scan,
  Printer,
  X,
  CheckCircle2,
  Sparkles,
  Camera,
  Coins,
  Award,
  Users,
  Search,
  RotateCcw,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';
import confetti from 'canvas-confetti';

interface StudentQRPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudentName?: string;
  onRewardPoints?: (points: number, reason: string) => void;
}

interface StudentRosterItem {
  id: string;
  code: string;
  name: string;
  grade: string;
  room: string;
  avatar: string;
  points: number;
  attended: boolean;
  homeworkSubmitted: boolean;
}

const SAMPLE_STUDENTS: StudentRosterItem[] = [
  { id: 'st_1', code: 'CK-04101', name: 'กวินทร์ แสนดี', grade: 'ป.4/1', room: 'ห้อง 401', avatar: '🐱', points: 145, attended: true, homeworkSubmitted: true },
  { id: 'st_2', code: 'CK-04102', name: 'นลินทิพย์ วงศ์สว่าง', grade: 'ป.4/1', room: 'ห้อง 401', avatar: '🦊', points: 120, attended: false, homeworkSubmitted: false },
  { id: 'st_3', code: 'CK-04103', name: 'ภัทรดนัย บุญชู', grade: 'ป.4/1', room: 'ห้อง 401', avatar: '🐼', points: 95, attended: true, homeworkSubmitted: false },
  { id: 'st_4', code: 'CK-04104', name: 'ฐิตาภา สุขสมบูรณ์', grade: 'ป.4/1', room: 'ห้อง 401', avatar: '🐰', points: 160, attended: true, homeworkSubmitted: true },
  { id: 'st_5', code: 'CK-05101', name: 'อิทธิกร วารินทร์', grade: 'ป.5/1', room: 'ห้อง 501', avatar: '🦁', points: 130, attended: false, homeworkSubmitted: false },
];

export const StudentQRPassModal: React.FC<StudentQRPassModalProps> = ({
  isOpen,
  onClose,
  currentStudentName = 'กวินทร์ แสนดี',
  onRewardPoints,
}) => {
  const [activeTab, setActiveTab] = useState<'myPass' | 'teacherScanner'>('myPass');
  const [students, setStudents] = useState<StudentRosterItem[]>(SAMPLE_STUDENTS);
  const [scannedStudent, setScannedStudent] = useState<StudentRosterItem | null>(null);
  const [scanLog, setScanLog] = useState<{ name: string; action: string; time: string }[]>([
    { name: 'กวินทร์ แสนดี', action: 'เช็คชื่อเข้าเรียนตรงเวลา', time: '08:30 น.' },
    { name: 'ฐิตาภา สุขสมบูรณ์', action: 'ส่งงานแปลงผักอัจฉริยะ', time: '08:32 น.' },
  ]);

  if (!isOpen) return null;

  // Handle Scan Simulation
  const handleScanStudent = (student: StudentRosterItem) => {
    soundEffects.play('correct');
    setScannedStudent(student);
    const newLog = {
      name: student.name,
      action: 'สแกนบัตรนักเรียนสำเร็จ',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
    };
    setScanLog((prev) => [newLog, ...prev]);
  };

  const handleMarkAttendance = (id: string) => {
    soundEffects.play('correct');
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attended: true } : s))
    );
    if (scannedStudent && scannedStudent.id === id) {
      setScannedStudent({ ...scannedStudent, attended: true });
    }
  };

  const handleAwardBonusPoints = (id: string, amount: number) => {
    soundEffects.play('victory');
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, points: s.points + amount } : s))
    );
    if (scannedStudent && scannedStudent.id === id) {
      setScannedStudent({ ...scannedStudent, points: scannedStudent.points + amount });
    }
    if (onRewardPoints) {
      onRewardPoints(amount, `รับแต้มพิเศษผ่านการสแกน QR Code`);
    }
  };

  const handlePrint = () => {
    soundEffects.play('click');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-indigo-500/30 text-white shadow-2xl flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-600/30 border border-teal-400/40 text-teal-300">
              <QrCode className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold bg-gradient-to-r from-teal-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                  บัตรประจำตัวนักเรียน QR Pass &amp; สแกนเนอร์ห้องเรียน 📷
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
                  Quick Pass
                </span>
              </div>
              <p className="text-xs text-slate-400">
                บัตรประจำตัวนักเรียนพร้อม QR สแกนส่งงาน เช็คชื่อเข้าเรียน และมอบแต้มความดีใน 1 วินาที
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>พิมพ์บัตร A4</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('myPass'); soundEffects.play('click'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'myPass'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>บัตรประจำตัวของฉัน (My Student Pass)</span>
          </button>
          <button
            onClick={() => { setActiveTab('teacherScanner'); soundEffects.play('click'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'teacherScanner'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>ระบบสแกนเนอร์ครูผู้สอน (Classroom Scanner)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'myPass' ? (
            /* My Student Pass View */
            <div className="flex flex-col items-center justify-center space-y-6 py-4">
              {/* Badge Card Design */}
              <div className="w-full max-w-sm rounded-3xl p-1 bg-gradient-to-tr from-teal-500 via-indigo-600 to-pink-500 shadow-2xl">
                <div className="rounded-[22px] bg-slate-950 p-6 space-y-4 text-center border border-white/10 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-teal-400">CODER KIDS ID PASS</span>
                    <span className="font-mono">ว 4.2 สพฐ.</span>
                  </div>

                  <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-teal-400 mx-auto flex items-center justify-center text-3xl shadow-md">
                    🐱
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">{currentStudentName}</h3>
                    <p className="text-xs text-slate-400">ชั้นประถมศึกษาปีที่ 4/1 • รหัส: CK-04101</p>
                  </div>

                  {/* QR Code SVG Mockup */}
                  <div className="p-4 rounded-2xl bg-white mx-auto w-36 h-36 flex flex-col items-center justify-center shadow-inner">
                    <QrCode className="w-28 h-28 text-slate-950" />
                  </div>

                  <div className="text-[11px] text-teal-300 font-mono">
                    สแกนเพื่อเช็คชื่อ • ส่งการบ้าน • รับแต้มความดี
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-slate-400 max-w-md">
                💡 ครูผู้สอนสามารถใช้แท็บเล็ตหรือกล้องเว็บแคมสแกน QR นี้เพื่อบันทึกคะแนนกิจกรรมกลุ่มได้ทันที
              </div>
            </div>
          ) : (
            /* Teacher Scanner Simulator View */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left: Quick Roster click-to-scan */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-white">รายชื่อนักเรียนในห้อง (คลิกเพื่อจำลองสแกน QR)</span>
                  <span>{students.length} คน</span>
                </div>

                <div className="space-y-2">
                  {students.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => handleScanStudent(st)}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                          {st.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {st.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {st.code} • {st.grade}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {st.attended ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            มาเรียน
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                            ยังไม่สแกน
                          </span>
                        )}
                        <span className="text-xs font-mono font-bold text-amber-400">{st.points} แต้ม</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Scanner Result & Quick Actions */}
              <div className="md:col-span-5 space-y-4">
                {scannedStudent ? (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-teal-500/40 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center text-2xl">
                        {scannedStudent.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{scannedStudent.name}</h4>
                        <p className="text-[11px] text-slate-400">{scannedStudent.code} • {scannedStudent.grade}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => handleMarkAttendance(scannedStudent.id)}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{scannedStudent.attended ? 'เช็คชื่อเรียบร้อยแล้ว ✓' : 'เช็คชื่อเข้าเรียน (+10 แต้ม)'}</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAwardBonusPoints(scannedStudent.id, 20)}
                          className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>+20 แต้มตอบคำถาม</span>
                        </button>
                        <button
                          onClick={() => handleAwardBonusPoints(scannedStudent.id, 50)}
                          className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>+50 ส่งโครงงาน</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                    <Camera className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
                    <p className="text-xs text-slate-400">คลิกที่รายชื่อนักเรียนทางซ้ายเพื่อจำลองการสแกน QR</p>
                  </div>
                )}

                {/* Scan Activity Log */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>บันทึกประวัติการสแกนล่าสุด:</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-400">
                    {scanLog.map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900">
                        <span><strong>{log.name}:</strong> {log.action}</span>
                        <span className="font-mono text-slate-500">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>💡 สามารถพิมพ์ใส่กระดาษการ์ดเคลือบพลาสติกเป็นบัตรประจำตัวนักเรียนจริงได้</span>
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
