import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Award,
  CheckCircle2,
  FileSpreadsheet,
  Users,
  Search,
  School,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';

interface StudentAssessmentRow {
  studentId: string;
  name: string;
  nickname: string;
  grade: string;
  pdpaScore: number; // Max 25
  logicScore: number; // Max 25
  codingScore: number; // Max 30
  showcaseScore: number; // Max 20
  totalScore: number; // Max 100
  gradeLevel: 'ดีเยี่ยม (4)' | 'ดีมาก (3.5)' | 'ดี (3)' | 'ผ่านเกณฑ์ (2)' | 'ควรปรับปรุง (1)';
  status: 'ผ่านเกณฑ์' | 'ปรับปรุง';
}

const SAMPLE_ASSESSMENT_DATA: StudentAssessmentRow[] = [
  { studentId: 'CK-2569-4101', name: 'ด.ช. ปัณณธร ศรีสว่าง', nickname: 'ปันปัน', grade: 'ป.4/1', pdpaScore: 24, logicScore: 25, codingScore: 29, showcaseScore: 19, totalScore: 97, gradeLevel: 'ดีเยี่ยม (4)', status: 'ผ่านเกณฑ์' },
  { studentId: 'CK-2569-4102', name: 'กวินท์ พงษ์สถิตย์', nickname: 'วิน', grade: 'ป.4/1', pdpaScore: 23, logicScore: 24, codingScore: 28, showcaseScore: 18, totalScore: 93, gradeLevel: 'ดีเยี่ยม (4)', status: 'ผ่านเกณฑ์' },
  { studentId: 'CK-2569-4103', name: 'ชนัญชิดา สุขสันต์', nickname: 'ณิชา', grade: 'ป.4/1', pdpaScore: 25, logicScore: 23, codingScore: 27, showcaseScore: 19, totalScore: 94, gradeLevel: 'ดีเยี่ยม (4)', status: 'ผ่านเกณฑ์' },
  { studentId: 'CK-2569-4104', name: 'ด.ญ. ภัทรวดี มงคลกุล', nickname: 'แพรว', grade: 'ป.4/1', pdpaScore: 24, logicScore: 22, codingScore: 26, showcaseScore: 18, totalScore: 90, gradeLevel: 'ดีเยี่ยม (4)', status: 'ผ่านเกณฑ์' },
  { studentId: 'CK-2569-4105', name: 'ด.ช. กิตติพงษ์ ใจมั่น', nickname: 'กอล์ฟ', grade: 'ป.4/1', pdpaScore: 22, logicScore: 21, codingScore: 25, showcaseScore: 17, totalScore: 85, gradeLevel: 'ดีมาก (3.5)', status: 'ผ่านเกณฑ์' },
  { studentId: 'CK-2569-4106', name: 'ด.ญ. ธัญญารัตน์ กลิ่นสุคนธ์', nickname: 'บัว', grade: 'ป.4/1', pdpaScore: 23, logicScore: 20, codingScore: 24, showcaseScore: 16, totalScore: 83, gradeLevel: 'ดีมาก (3.5)', status: 'ผ่านเกณฑ์' },
  { studentId: 'CK-2569-4107', name: 'ด.ช. ศุภณัฐ อุดมทรัพย์', nickname: 'ณัฐ', grade: 'ป.4/1', pdpaScore: 21, logicScore: 19, codingScore: 23, showcaseScore: 15, totalScore: 78, gradeLevel: 'ดี (3)', status: 'ผ่านเกณฑ์' },
  { studentId: 'CK-2569-4108', name: 'ด.ญ. นลินรัตน์ ศิริพร', nickname: 'ริน', grade: 'ป.4/1', pdpaScore: 22, logicScore: 20, codingScore: 22, showcaseScore: 15, totalScore: 79, gradeLevel: 'ดี (3)', status: 'ผ่านเกณฑ์' },
  { studentId: 'CK-2569-4109', name: 'ด.ช. ภูริณัฐ ทองคำ', nickname: 'ภู', grade: 'ป.4/1', pdpaScore: 20, logicScore: 18, codingScore: 21, showcaseScore: 14, totalScore: 73, gradeLevel: 'ผ่านเกณฑ์ (2)', status: 'ผ่านเกณฑ์' },
  { studentId: 'CK-2569-4110', name: 'ด.ช. ธนกร พลอยสุข', nickname: 'แทน', grade: 'ป.4/1', pdpaScore: 18, logicScore: 17, codingScore: 20, showcaseScore: 13, totalScore: 68, gradeLevel: 'ผ่านเกณฑ์ (2)', status: 'ผ่านเกณฑ์' },
];

interface TeacherAssessmentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
}

export const TeacherAssessmentReportModal: React.FC<TeacherAssessmentReportModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'table' | 'rubric' | 'summary'>('table');

  if (!isOpen) return null;

  // Filter student rows
  const filteredStudents = SAMPLE_ASSESSMENT_DATA.filter(
    (s) =>
      s.name.includes(searchTerm) ||
      s.nickname.includes(searchTerm) ||
      s.studentId.includes(searchTerm)
  );

  const averageScore = Math.round(
    SAMPLE_ASSESSMENT_DATA.reduce((acc, cur) => acc + cur.totalScore, 0) /
      SAMPLE_ASSESSMENT_DATA.length
  );

  const passRate = Math.round(
    (SAMPLE_ASSESSMENT_DATA.filter((s) => s.status === 'ผ่านเกณฑ์').length /
      SAMPLE_ASSESSMENT_DATA.length) *
      100
  );

  // Export CSV function
  const handleExportCSV = () => {
    const headers = [
      'รหัสนักเรียน',
      'ชื่อ-นามสกุล',
      'ชื่อเล่น',
      'ระดับชั้น',
      'ความปลอดภัยและPDPA (25)',
      'การคิดเชิงคำนวณ (25)',
      'การเขียนโปรแกรม (30)',
      'การสะท้อนคิดและโครงงาน (20)',
      'คะแนนรวม (100)',
      'ระดับผลการเรียน',
      'สถานะ',
    ];

    const rows = SAMPLE_ASSESSMENT_DATA.map((s) => [
      `"${s.studentId}"`,
      `"${s.name}"`,
      `"${s.nickname}"`,
      `"${s.grade}"`,
      s.pdpaScore,
      s.logicScore,
      s.codingScore,
      s.showcaseScore,
      s.totalScore,
      `"${s.gradeLevel}"`,
      `"${s.status}"`,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ปพ5_วิทยาการคำนวณ_ป4_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white flex items-center justify-between shadow-md print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl border border-white/20">
              <GraduationCap className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/60 text-white border border-indigo-400/40">
                  ระบบบริหารจัดการสำหรับครูผู้สอน
                </span>
                <span className="text-xs text-indigo-200">ตามหลักสูตร สพฐ. &amp; สสวท.</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                แบบบันทึกผลการพัฒนาคุณภาพผู้เรียน (ปพ.5) วิชา วิทยาการคำนวณ
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Sub-tabs */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 print:hidden">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedTab('table')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedTab === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
              }`}
            >
              ตารางคะแนนรายบุคคล
            </button>
            <button
              onClick={() => setSelectedTab('rubric')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedTab === 'rubric'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
              }`}
            >
              เกณฑ์ประเมิน (Rubrics)
            </button>
            <button
              onClick={() => setSelectedTab('summary')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedTab === 'summary'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
              }`}
            >
              สถิติและตัวชี้วัด 5 ด้าน
            </button>
          </div>

          {/* Export / Print Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>ส่งออก CSV (Excel/Sheets)</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ใบรายงาน ปพ.5</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          
          {/* Official Document Print Header (Only visible during print or in preview) */}
          <div className="border border-slate-300 dark:border-slate-700 p-6 rounded-2xl bg-white dark:bg-slate-900 space-y-4">
            <div className="text-center space-y-1.5 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm sm:text-base">
                <School className="w-5 h-5" />
                <span>{currentProfile.school || 'โรงเรียนอนุบาลนราธิวาส'}</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                แบบบันทึกผลการประเมินการเรียนรู้รายวิชา วิทยาการคำนวณและเทคโนโลยี (ปพ.5)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี • ภาคเรียนที่ 2 ปีการศึกษา 2568 - 2569 • ชั้น{currentProfile.grade || 'ประถมศึกษาปีที่ 4/1'}
              </p>
            </div>

            {/* Quick KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
                <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">จำนวนนักเรียนที่ประเมิน</span>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{SAMPLE_ASSESSMENT_DATA.length} คน</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">คะแนนเฉลี่ยรวม</span>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{averageScore} / 100</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60">
                <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">อัตราการผ่านเกณฑ์</span>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{passRate}%</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60">
                <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">ระดับคุณภาพโดยรวม</span>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">ดีเยี่ยม (ระดับ 4)</p>
              </div>
            </div>

            {/* TAB 1: Student Score Table */}
            {selectedTab === 'table' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 print:hidden">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="ค้นหาชื่อหรือรหัสนักเรียน..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <span className="text-xs text-slate-500">
                    แสดง {filteredStudents.length} จาก {SAMPLE_ASSESSMENT_DATA.length} รายการ
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold uppercase text-xs">
                      <tr>
                        <th className="p-3">รหัสนักเรียน</th>
                        <th className="p-3">ชื่อ - นามสกุล</th>
                        <th className="p-3 text-center">PDPA (25)</th>
                        <th className="p-3 text-center">การคิดเชิงคำนวณ (25)</th>
                        <th className="p-3 text-center">Coding Lab (30)</th>
                        <th className="p-3 text-center">Showcase (20)</th>
                        <th className="p-3 text-center font-bold text-indigo-700 dark:text-indigo-400">รวม (100)</th>
                        <th className="p-3 text-center">ระดับผลการเรียน</th>
                        <th className="p-3 text-center">ผลการประเมิน</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {filteredStudents.map((student) => (
                        <tr key={student.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-mono text-xs">{student.studentId}</td>
                          <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                            {student.name} ({student.nickname})
                          </td>
                          <td className="p-3 text-center">{student.pdpaScore}</td>
                          <td className="p-3 text-center">{student.logicScore}</td>
                          <td className="p-3 text-center">{student.codingScore}</td>
                          <td className="p-3 text-center">{student.showcaseScore}</td>
                          <td className="p-3 text-center font-bold text-indigo-600 dark:text-indigo-400">
                            {student.totalScore}
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                              {student.gradeLevel}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{student.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Rubrics Detail */}
            {selectedTab === 'rubric' && (
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200">
                  <p className="font-bold mb-1">เกณฑ์การให้คะแนนแบบรูบริก (Rubrics Assessment) 4 ระดับคุณภาพ:</p>
                  <p>ระดับ 4 = ดีเยี่ยม (80-100%), ระดับ 3 = ดี (70-79%), ระดับ 2 = พอใช้/ผ่านเกณฑ์ (60-69%), ระดับ 1 = ควรปรับปรุง (&lt;60%)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span>ด้านที่ 1: ความปลอดภัยดิจิทัลและ PDPA (25 คะแนน)</span>
                    </h4>
                    <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      <li>• <b>ระดับ 4:</b> จำแนกข้อมูลส่วนบุคคลได้แม่นยำ 100% ตั้งรหัสผ่านปลอดภัยสูง และปฏิบัติตนตามมารยาทไซเบอร์</li>
                      <li>• <b>ระดับ 3:</b> จำแนกข้อมูลส่วนบุคคลได้ถูกต้องส่วนใหญ่ ตั้งรหัสผ่านระดับปานกลาง</li>
                      <li>• <b>ระดับ 2:</b> เข้าใจแนวคิด PDPA พื้นฐาน แต่ยังสับสนข้อมูลบางประเภท</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span>ด้านที่ 2: การคิดเชิงคำนวณ (25 คะแนน)</span>
                    </h4>
                    <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      <li>• <b>ระดับ 4:</b> ใช้ 4 เสาหลัก (Decomposition, Pattern, Abstraction, Algorithm) แก้ปัญหาเขาวงกตได้ครบ 3 ระดับ</li>
                      <li>• <b>ระดับ 3:</b> เขียนลำดับขั้นตอนแบบมีเงื่อนไขและวนซ้ำได้ถูกต้องส่วนใหญ่</li>
                      <li>• <b>ระดับ 2:</b> แก้ปัญหาแบบลำดับตรงได้ แต่อาจติดขัดเมื่อมีเงื่อนไขซับซ้อน</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>ด้านที่ 3: การเขียนโปรแกรม Scratch &amp; Micro:bit (30 คะแนน)</span>
                    </h4>
                    <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      <li>• <b>ระดับ 4:</b> ประกอบบล็อกคำสั่งถูกต้อง ควบคุมเซ็นเซอร์/หน้าจอ LED และดีบั๊กแก้ข้อผิดพลาดได้ด้วยตนเอง</li>
                      <li>• <b>ระดับ 3:</b> เขียนโปรแกรมตามโจทย์สำเร็จ และดัดแปลงพารามิเตอร์ได้</li>
                      <li>• <b>ระดับ 2:</b> ทำงานตามตัวอย่างได้อย่างถูกต้อง แต่ต้องการคำแนะนำเพิ่มเติมในการดีบั๊ก</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>ด้านที่ 4: การนำเสนอและสะท้อนคิด (20 คะแนน)</span>
                    </h4>
                    <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      <li>• <b>ระดับ 4:</b> นำเสนอชิ้นงานอย่างสร้างสรรค์ ให้ข้อเสนอแนะเพื่อนแบบ 2 Stars &amp; a Wish และสะท้อนคิด 3-2-1 ครบถ้วน</li>
                      <li>• <b>ระดับ 3:</b> อธิบายแนวคิดโครงงานได้ชัดเจน มีส่วนร่วมในการแลกเปลี่ยนเรียนรู้</li>
                      <li>• <b>ระดับ 2:</b> มีชิ้นงานนำเสนอ แต่ยังต้องฝึกทักษะการให้ข้อคิดเห็นเพื่อน</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Summary Analytics */}
            {selectedTab === 'summary' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      การกระจายผลการเรียน (Grade Distribution)
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>ดีเยี่ยม (เกรด 4, 80-100 คะแนน)</span>
                          <span className="text-emerald-600 font-bold">6 คน (60%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>ดีมาก (เกรด 3.5, 75-79 คะแนน)</span>
                          <span className="text-indigo-600 font-bold">2 คน (20%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: '20%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>ดี / ผ่านเกณฑ์ (เกรด 2-3, 60-74 คะแนน)</span>
                          <span className="text-amber-600 font-bold">2 คน (20%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '20%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      สมรรถนะสำคัญของผู้เรียน (5 Core Competencies)
                    </h4>
                    <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                      <li className="flex items-center justify-between">
                        <span>1. ความสามารถในการสื่อสารดิจิทัล</span>
                        <span className="text-emerald-600 font-bold">ยอดเยี่ยม (92%)</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>2. ความสามารถในการคิดเชิงคำนวณและแก้ปัญหา</span>
                        <span className="text-indigo-600 font-bold">ดีมาก (88%)</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>3. ความสามารถในการแก้ปัญหาเชิงตรรกะ</span>
                        <span className="text-indigo-600 font-bold">ดีมาก (85%)</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>4. ความสามารถในการใช้ทักษะชีวิตและมารยาทไซเบอร์</span>
                        <span className="text-emerald-600 font-bold">ยอดเยี่ยม (95%)</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>5. ความสามารถในการใช้เทคโนโลยี Scratch &amp; Micro:bit</span>
                        <span className="text-indigo-600 font-bold">ดีมาก (89%)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Official Signatures Section for Official Document Print */}
            <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-700 dark:text-slate-300">
              <div className="space-y-6">
                <div className="border-b border-dotted border-slate-400 dark:border-slate-600 w-3/4 mx-auto pb-4" />
                <div>
                  <p className="font-semibold">(........................................................)</p>
                  <p className="text-slate-500">ครูผู้สอนประจำวิชา</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-b border-dotted border-slate-400 dark:border-slate-600 w-3/4 mx-auto pb-4" />
                <div>
                  <p className="font-semibold">(........................................................)</p>
                  <p className="text-slate-500">หัวหน้ากลุ่มสาระการเรียนรู้</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-b border-dotted border-slate-400 dark:border-slate-600 w-3/4 mx-auto pb-4" />
                <div>
                  <p className="font-semibold">(........................................................)</p>
                  <p className="text-slate-500">ผู้อำนวยการสถานศึกษา</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>Coder Kids v2.5 • ระบบสนับสนุนครูวิทยาการคำนวณตามมาตรฐาน สพฐ.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
