import React, { useState } from 'react';
import {
  FileText,
  Printer,
  X,
  QrCode,
  Heart,
  Shield,
  HelpCircle,
  Sparkles,
  Download,
  CheckCircle2,
  Share2,
  BookOpen,
  Users,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';

interface ParentTeacherKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParentTeacherKitModal: React.FC<ParentTeacherKitModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'worksheet' | 'parentGuide'>('worksheet');
  const [selectedWorksheetTopic, setSelectedWorksheetTopic] = useState<'flowchart' | 'pdpa' | 'microbit'>('flowchart');

  if (!isOpen) return null;

  const handlePrint = () => {
    soundEffects.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
              🖨️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-400 text-slate-950">
                  สพฐ. ครู &amp; ผู้ปกครอง
                </span>
                <span className="text-xs text-teal-200">Parent &amp; Teacher Resource Kit</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                ชุดเครื่องมือพิมพ์ใบงานพร้อม QR Code &amp; คู่มือผู้ปกครอง
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('worksheet');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'worksheet'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. เครื่องมือพิมพ์ใบงานพร้อม QR เฉลย</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('parentGuide');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'parentGuide'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>2. คู่มือผู้ปกครองยุค AI (Family Guide)</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-teal-600" />
            <span>พิมพ์ A4 ทันที</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'worksheet' ? (
            <div className="space-y-6">
              {/* Topic Select */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">เลือกหัวข้อใบงาน:</span>
                <button
                  onClick={() => setSelectedWorksheetTopic('flowchart')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedWorksheetTopic === 'flowchart'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  🧩 ผังงานแก้ปัญหา (Flowchart Unplugged)
                </button>
                <button
                  onClick={() => setSelectedWorksheetTopic('pdpa')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedWorksheetTopic === 'pdpa'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  🛡️ แยกแยะข้อมูลส่วนบุคคล PDPA
                </button>
                <button
                  onClick={() => setSelectedWorksheetTopic('microbit')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedWorksheetTopic === 'microbit'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  📟 แผนผังพอร์ตและการต่อวงจร Micro:bit V2
                </button>
              </div>

              {/* Printable Worksheet Canvas (A4 Styled Box) */}
              <div className="p-7 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-5 text-slate-900 text-left">
                {/* Worksheet Header */}
                <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      ใบงานกิจกรรมวิทยาการคำนวณ (Unplugged Activity Sheet)
                    </h3>
                    <p className="text-xs text-slate-600">
                      สาระที่ 4 เทคโนโลยี (วิทยาการคำนวณ) หลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน สพฐ.
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <div>ชื่อ: ................................................................</div>
                    <div className="mt-1">ชั้น ป......./....... เลขที่: ........... วันที่: .............</div>
                  </div>
                </div>

                {/* Question Section based on topic */}
                {selectedWorksheetTopic === 'flowchart' ? (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold">โจทย์สถานการณ์:</span>
                      <p>
                        หุ่นยนต์ทำความสะอาดต้องกวาดพื้นห้องเรียน หากพบเศษขยะให้กวาดลงถังขยะ ถ้าไม่พบขยะให้เดินตรงไปข้างหน้า และตรวจสอบว่าถึงมุมห้องหรือยัง จงเติมสัญลักษณ์ผังงานต่อไปนี้ให้สมบูรณ์
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center font-mono">
                      <div className="p-3 border border-slate-300 rounded-lg">
                        <div className="font-bold mb-1">[ จุดเริ่มต้น ]</div>
                        <div className="text-[10px] text-slate-500">Terminal Oval</div>
                      </div>
                      <div className="p-3 border border-slate-300 rounded-lg">
                        <div className="font-bold mb-1">&lt; พบขยะหรือไม่? &gt;</div>
                        <div className="text-[10px] text-slate-500">Decision Diamond</div>
                      </div>
                      <div className="p-3 border border-slate-300 rounded-lg">
                        <div className="font-bold mb-1">[ กวาดลงถัง ]</div>
                        <div className="text-[10px] text-slate-500">Process Rectangle</div>
                      </div>
                    </div>

                    <div className="border border-dashed border-slate-400 p-8 rounded-xl text-center text-slate-400 text-xs">
                      [ พื้นที่สำหรับนักเรียนวาดแผนผัง Flowchart และลูกศรลำดับการทำงาน ]
                    </div>
                  </div>
                ) : selectedWorksheetTopic === 'pdpa' ? (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold">คำชี้แจง:</span>
                      <p>
                        ให้นักเรียนพิจารณาข้อมูลต่อไปนี้ แล้วทำเครื่องหมายถูก (✓) เลือกว่าเป็น "ข้อมูลทั่วไปที่เปิดเผยได้" หรือ "ข้อมูลอ่อนไหวที่ห้ามแชร์สู่สาธารณะ"
                      </p>
                    </div>

                    <table className="w-full text-xs text-left border-collapse border border-slate-300">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300">
                          <th className="p-2 border-r border-slate-300">รายการข้อมูล</th>
                          <th className="p-2 border-r border-slate-300 text-center w-36">ข้อมูลทั่วไป (แชร์ได้)</th>
                          <th className="p-2 text-center w-36">ข้อมูลอ่อนไหว (ห้ามแชร์)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 border-r border-slate-300">1. เลขประจำตัวประชาชน 13 หลัก</td>
                          <td className="p-2 border-r border-slate-300 text-center">[ ]</td>
                          <td className="p-2 text-center">[ ]</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 border-r border-slate-300">2. ชื่อเล่นและเกมโค้ดดิ้งที่ชอบ</td>
                          <td className="p-2 border-r border-slate-300 text-center">[ ]</td>
                          <td className="p-2 text-center">[ ]</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 border-r border-slate-300">3. รหัสผ่านอีเมล หรือ รหัส OTP 6 หลัก</td>
                          <td className="p-2 border-r border-slate-300 text-center">[ ]</td>
                          <td className="p-2 text-center">[ ]</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-r border-slate-300">4. ผลงานโครงงานวิทยาการคำนวณที่สร้างเอง</td>
                          <td className="p-2 border-r border-slate-300 text-center">[ ]</td>
                          <td className="p-2 text-center">[ ]</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold">โจทย์ Micro:bit Pinout:</span>
                      <p>
                        จงโยงเส้นจับคู่ขา Pin ของบอร์ด Micro:bit V2 กับอุปกรณ์ภายนอกที่เหมาะสม พร้อมระบุว่าเป็น Input หรือ Output
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border border-slate-300 rounded-lg space-y-2">
                        <span className="font-bold block">ฝั่งขา Micro:bit:</span>
                        <div>A. Pin 0 (P0)</div>
                        <div>B. Pin 1 (P1)</div>
                        <div>C. Pin 3V</div>
                        <div>D. Pin GND</div>
                      </div>
                      <div className="p-3 border border-slate-300 rounded-lg space-y-2">
                        <span className="font-bold block">ฝั่งอุปกรณ์เซ็นเซอร์:</span>
                        <div>1. ขั้วลบ (Ground)</div>
                        <div>2. เซ็นเซอร์วัดความชื้นในดิน (Analog In)</div>
                        <div>3. ไฟเลี้ยง +3.3V</div>
                        <div>4. โมดูลลำโพง Buzzer / Relay (Digital Out)</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer with QR Code for Answer Key */}
                <div className="pt-3 border-t-2 border-slate-900 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    <div>สื่อการเรียนรู้ดิจิทัล Coder Kids โปรแกรมเมอร์รุ่นจิ๋ว</div>
                    <div>ตรวจเฉลยและดูคลิปสาธิตจำลองเสมือนได้ที่ระบบ Coder Kids Online</div>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 border border-slate-400 rounded-xl">
                    <div className="w-10 h-10 bg-slate-950 text-white rounded p-0.5 flex items-center justify-center text-[7px] font-mono text-center">
                      [QR CODE]
                    </div>
                    <div className="text-[10px] text-slate-700">
                      <strong>สแกนดูเฉลย</strong>
                      <div>พร้อมคลิปสาธิต</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* PARENT GUIDE TAB */
            <div className="space-y-4 text-left">
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 space-y-2">
                <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>5 เคล็ดลับชวนลูกคิดแบบนักประดิษฐ์และปลอดภัยไซเบอร์ที่บ้าน:</span>
                </h3>
                <p className="text-xs text-teal-950 dark:text-teal-300 leading-relaxed">
                  วิทยาการคำนวณไม่ใช่แค่เรื่องของการนั่งหน้าจอคอมพิวเตอร์ แต่คือทักษะการคิดอย่างเป็นระบบ (Computational Thinking) ที่ฝึกได้ผ่านกิจกรรมในชีวิตประจำวัน
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>1. กฎ 20-20-20 ถนอมสายตา</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    ทุกๆ การใช้หน้าจอ 20 นาที ให้พักสายตามองไกล 20 ฟุตเป็นเวลาอย่างน้อย 20 วินาที เพื่อสุขอนามัยสายตาที่ดีของเด็กๆ
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>2. ฝึก Decompose จากงานบ้าน</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    ชวนลูกแยกย่อยขั้นตอนการจัดกระเป๋านักเรียน หรือทำอาหารเช้าเป็นลำดับขั้น เพื่อฝึกการมองปัญหาและแก้ปัญหาทีละส่วน
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>3. ข้อตกลงครอบครัว "รหัสผ่านคือความลับ"</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    ย้ำเตือนไม่ให้ลูกแชร์รหัสผ่านหรือส่งรูปถ่ายบ้านพักสู่สาธารณะ และร่วมกันตั้งรหัสผ่านแบบ Passphrase ประจำบ้าน
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>4. ชื่นชมกระบวนการ (Growth Mindset)</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    เมื่อลูกเจอข้อผิดพลาด (Bug) ในโค้ด ให้ชวนวิเคราะห์ว่าได้เรียนรู้อะไรจากบั๊กนี้ มากกว่าการมุ่งเน้นแต่ผลคะแนนสอบ
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
