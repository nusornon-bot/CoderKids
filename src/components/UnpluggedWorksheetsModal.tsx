import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Palette,
  Compass,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface UnpluggedWorksheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteWorksheet?: () => void;
}

export const UnpluggedWorksheetsModal: React.FC<UnpluggedWorksheetsModalProps> = ({
  isOpen,
  onClose,
  onCompleteWorksheet,
}) => {
  const [selectedSheet, setSelectedSheet] = useState<'flowchart' | 'pixel' | 'maze' | 'pdpa'>('flowchart');

  if (!isOpen) return null;

  const handlePrint = () => {
    if (onCompleteWorksheet) {
      onCompleteWorksheet();
    }
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 text-white flex items-center justify-between shadow-md print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-2xl border border-white/20">
              <FileText className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/60 text-white border border-emerald-400/30">
                  คลังใบงานวิทยาการคำนวณแบบ Unplugged
                </span>
                <span className="text-xs text-emerald-200">กิจกรรมฝึกคิดโดยไม่ต้องใช้คอมพิวเตอร์</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                ใบกิจกรรมและแบบฝึกหัดพัฒนาทักษะ (พิมพ์ A4 พร้อมใช้งาน)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Print Action */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedSheet('flowchart')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                selectedSheet === 'flowchart'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>1. ผังงาน Flowchart ต้มบะหมี่</span>
            </button>

            <button
              onClick={() => setSelectedSheet('pixel')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                selectedSheet === 'pixel'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>2. ถอดรหัส Pixel Art (Binary)</span>
            </button>

            <button
              onClick={() => setSelectedSheet('maze')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                selectedSheet === 'maze'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>3. เขาวงกตคำสั่งหุ่นยนต์</span>
            </button>

            <button
              onClick={() => setSelectedSheet('pdpa')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                selectedSheet === 'pdpa'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>4. สำรวจ PDPA ในโรงเรียน</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ใบงานนี้ (Print A4)</span>
          </button>
        </div>

        {/* Worksheet Printable Canvas Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950/50">
          <div className="mx-auto max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 sm:p-12 shadow-lg rounded-xl border border-slate-200 space-y-6 print:shadow-none print:border-none print:p-0">
            
            {/* Sheet Universal Header */}
            <div className="border-b-2 border-slate-800 pb-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี</span>
                <span>ระดับชั้นประถมศึกษาปีที่ 4 - 6</span>
              </div>
              <div className="text-center space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  ใบกิจกรรมวิทยาการคำนวณ (Unplugged Coding Activity)
                </h1>
                <p className="text-sm font-semibold text-emerald-800">
                  {selectedSheet === 'flowchart' && 'กิจกรรมที่ 1: การเขียนผังงาน (Flowchart) ลำดับขั้นตอนการต้มบะหมี่'}
                  {selectedSheet === 'pixel' && 'กิจกรรมที่ 2: การแทนค่าข้อมูลดิจิทัลด้วยเลขฐานสอง (8x8 Binary Pixel Art)'}
                  {selectedSheet === 'maze' && 'กิจกรรมที่ 3: ออกแบบชุดคำสั่งนำทางหุ่นยนต์กู้ภัย (Robot Navigation Algorithm)'}
                  {selectedSheet === 'pdpa' && 'กิจกรรมที่ 4: นักสืบไซเบอร์ สำรวจและปกป้องข้อมูลส่วนบุคคล (PDPA Detective)'}
                </p>
              </div>

              {/* Student Name/ID Fill-in Box */}
              <div className="grid grid-cols-12 gap-3 pt-3 text-xs sm:text-sm">
                <div className="col-span-6 border-b border-dotted border-slate-600 pb-1 flex">
                  <span className="font-semibold text-slate-700">ชื่อ - สกุล:</span>
                  <span className="flex-1 ml-2">...........................................................................</span>
                </div>
                <div className="col-span-3 border-b border-dotted border-slate-600 pb-1 flex">
                  <span className="font-semibold text-slate-700">เลขที่:</span>
                  <span className="flex-1 ml-2">.....................</span>
                </div>
                <div className="col-span-3 border-b border-dotted border-slate-600 pb-1 flex">
                  <span className="font-semibold text-slate-700">ชั้น:</span>
                  <span className="flex-1 ml-2">.....................</span>
                </div>
              </div>
            </div>

            {/* SHEET 1: FLOWCHART */}
            {selectedSheet === 'flowchart' && (
              <div className="space-y-6">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs sm:text-sm space-y-1 text-emerald-950">
                  <p className="font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-700" />
                    <span>คำชี้แจงสำหรับนักเรียน:</span>
                  </p>
                  <p>
                    ให้นักเรียนนำกล่องข้อความขั้นตอนการต้มบะหมี่กึ่งสำเร็จรูปด้านล่าง ไปเติมลงในรูปทรงสัญลักษณ์ผังงาน (Flowchart) ให้ถูกต้องตามลำดับและมีเงื่อนไขตรวจสอบความสุก
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 border border-slate-300 rounded-lg bg-slate-50 font-medium">
                    1. ต้มน้ำให้เดือด (100°C)
                  </div>
                  <div className="p-3 border border-slate-300 rounded-lg bg-slate-50 font-medium">
                    2. ใส่เส้นบะหมี่และเครื่องปรุง
                  </div>
                  <div className="p-3 border border-slate-300 rounded-lg bg-slate-50 font-medium">
                    3. จับเวลาต้ม 3 นาที
                  </div>
                  <div className="p-3 border border-slate-300 rounded-lg bg-slate-50 font-medium">
                    4. ตรวจสอบว่า "เส้นนุ่มสุกแล้วหรือไม่?"
                  </div>
                  <div className="p-3 border border-slate-300 rounded-lg bg-slate-50 font-medium">
                    5. ตักใส่ชามพร้อมรับประทาน
                  </div>
                  <div className="p-3 border border-slate-300 rounded-lg bg-slate-50 font-medium">
                    6. ต้มต่ออีก 1 นาที (ถ้ายังไม่สุก)
                  </div>
                </div>

                {/* Drawn Flowchart Template to Fill */}
                <div className="flex flex-col items-center space-y-4 pt-2">
                  <div className="w-48 py-2 px-4 rounded-full border-2 border-slate-800 text-center font-bold text-xs bg-slate-100">
                    เริ่มต้น (Start)
                  </div>
                  <div className="w-0.5 h-6 bg-slate-800" />
                  
                  <div className="w-56 h-12 border-2 border-slate-800 flex items-center justify-center text-xs text-slate-500 border-dashed">
                    [ ขั้นตอนที่ 1 ................................... ]
                  </div>
                  <div className="w-0.5 h-6 bg-slate-800" />

                  <div className="w-56 h-12 border-2 border-slate-800 flex items-center justify-center text-xs text-slate-500 border-dashed">
                    [ ขั้นตอนที่ 2 ................................... ]
                  </div>
                  <div className="w-0.5 h-6 bg-slate-800" />

                  {/* Decision Diamond */}
                  <div className="w-36 h-36 border-2 border-slate-800 rotate-45 flex items-center justify-center my-2 border-dashed">
                    <span className="-rotate-45 text-center text-xs text-slate-600 p-2 font-medium">
                      [ เงื่อนไขตรวจสอบความสุก ? ]
                    </span>
                  </div>
                  <div className="w-0.5 h-6 bg-slate-800" />

                  <div className="w-56 h-12 border-2 border-slate-800 flex items-center justify-center text-xs text-slate-500 border-dashed">
                    [ สิ้นสุดการทำงาน ตักใส่ชาม ]
                  </div>
                  <div className="w-0.5 h-6 bg-slate-800" />

                  <div className="w-48 py-2 px-4 rounded-full border-2 border-slate-800 text-center font-bold text-xs bg-slate-100">
                    สิ้นสุด (End)
                  </div>
                </div>
              </div>
            )}

            {/* SHEET 2: PIXEL ART BINARY */}
            {selectedSheet === 'pixel' && (
              <div className="space-y-6">
                <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 text-xs sm:text-sm space-y-1 text-teal-950">
                  <p className="font-bold flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-teal-700" />
                    <span>คำชี้แจงการถอดรหัสบิต (0 และ 1):</span>
                  </p>
                  <p>
                    หน้าจอคอมพิวเตอร์และ LED ของบอร์ด Micro:bit แสดงผลด้วยพิกเซล หากกำหนดให้ <b>เลข 0 = ช่องว่างสีขาว</b> และ <b>เลข 1 = ระบายสีดำ/แดง</b> ให้นักเรียนระบายสีตามตารางเพื่อถอดรหัสว่าคือภาพอะไร!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 items-center">
                  {/* Binary Code Rows */}
                  <div className="space-y-2 font-mono text-xs border border-slate-300 p-4 rounded-xl bg-slate-50">
                    <p className="font-sans font-bold text-slate-700 mb-2">ชุดข้อมูลเลขฐานสอง (8 แถว):</p>
                    <p className="p-1 bg-white border border-slate-200 rounded">แถวที่ 1: 0 1 1 0 0 1 1 0</p>
                    <p className="p-1 bg-white border border-slate-200 rounded">แถวที่ 2: 1 1 1 1 1 1 1 1</p>
                    <p className="p-1 bg-white border border-slate-200 rounded">แถวที่ 3: 1 1 1 1 1 1 1 1</p>
                    <p className="p-1 bg-white border border-slate-200 rounded">แถวที่ 4: 1 1 1 1 1 1 1 1</p>
                    <p className="p-1 bg-white border border-slate-200 rounded">แถวที่ 5: 0 1 1 1 1 1 1 0</p>
                    <p className="p-1 bg-white border border-slate-200 rounded">แถวที่ 6: 0 0 1 1 1 1 0 0</p>
                    <p className="p-1 bg-white border border-slate-200 rounded">แถวที่ 7: 0 0 0 1 1 0 0 0</p>
                    <p className="p-1 bg-white border border-slate-200 rounded">แถวที่ 8: 0 0 0 0 0 0 0 0</p>
                  </div>

                  {/* 8x8 Grid to color */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-700 mb-2">ตารางพิกเซล 8x8 สำหรับระบายสี</span>
                    <div className="grid grid-cols-8 gap-0.5 border-2 border-slate-800 p-1 bg-slate-200">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 sm:w-8 sm:h-8 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-dashed border-slate-400 rounded-xl space-y-2">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    ตอบคำถาม: ภาพที่ได้จากการถอดรหัสเลขฐานสองคือรูปอะไร?
                  </p>
                  <p className="text-xs text-slate-500">
                    คำตอบ: .........................................................................................................................
                  </p>
                </div>
              </div>
            )}

            {/* SHEET 3: ROBOT MAZE */}
            {selectedSheet === 'maze' && (
              <div className="space-y-6">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-xs sm:text-sm space-y-1 text-indigo-950">
                  <p className="font-bold flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-indigo-700" />
                    <span>คำชี้แจงภารกิจนำทางหุ่นยนต์:</span>
                  </p>
                  <p>
                    พาน้องหุ่นยนต์เดินจาก <b>จุดเริ่มต้น (S)</b> ไปยัง <b>ธงชัยชนะ (G)</b> โดยหลบก้อนหินสิ่งกีดขวาง (X) โดยใช้คำสั่งลูกศร: เดินหน้า (↑), เลี้ยวซ้าย (↶), เลี้ยวขวา (↷) และเขียนคำสั่งให้สั้นที่สุดโดยใช้การวนซ้ำ (Loop)!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 items-center">
                  {/* Grid Maze */}
                  <div className="grid grid-cols-5 gap-1 border-2 border-slate-800 p-1 bg-slate-200 max-w-[260px] mx-auto">
                    {/* Row 1 */}
                    <div className="w-11 h-11 bg-emerald-100 border border-slate-400 flex items-center justify-center font-bold text-emerald-800">S (เริ่ม)</div>
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>
                    <div className="w-11 h-11 bg-slate-800 text-white border border-slate-400 flex items-center justify-center font-bold">X</div>
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>

                    {/* Row 2 */}
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>
                    <div className="w-11 h-11 bg-slate-800 text-white border border-slate-400 flex items-center justify-center font-bold">X</div>
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>

                    {/* Row 3 */}
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>
                    <div className="w-11 h-11 bg-slate-800 text-white border border-slate-400 flex items-center justify-center font-bold">X</div>
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>

                    {/* Row 4 */}
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>
                    <div className="w-11 h-11 bg-white border border-slate-400"></div>
                    <div className="w-11 h-11 bg-slate-800 text-white border border-slate-400 flex items-center justify-center font-bold">X</div>
                    <div className="w-11 h-11 bg-amber-100 border border-slate-400 flex items-center justify-center font-bold text-amber-800">G (เส้นชัย)</div>
                  </div>

                  {/* Commands Write Area */}
                  <div className="space-y-3 text-xs">
                    <p className="font-bold text-slate-800">เขียนชุดคำสั่ง (Algorithm Script):</p>
                    <div className="space-y-1.5 font-mono">
                      <p className="p-1.5 border border-slate-300 rounded bg-slate-50">คำสั่งที่ 1: .............................................</p>
                      <p className="p-1.5 border border-slate-300 rounded bg-slate-50">คำสั่งที่ 2: .............................................</p>
                      <p className="p-1.5 border border-slate-300 rounded bg-slate-50">คำสั่งที่ 3: .............................................</p>
                      <p className="p-1.5 border border-slate-300 rounded bg-slate-50">คำสั่งที่ 4: .............................................</p>
                      <p className="p-1.5 border border-slate-300 rounded bg-slate-50">คำสั่งที่ 5: .............................................</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SHEET 4: PDPA DETECTIVE */}
            {selectedSheet === 'pdpa' && (
              <div className="space-y-6">
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-xs sm:text-sm space-y-1 text-rose-950">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-700" />
                    <span>คำชี้แจงการจำแนกข้อมูลตามกฎหมาย PDPA:</span>
                  </p>
                  <p>
                    ให้นักเรียนทำเครื่องหมาย ✓ ลงในช่อง <b>"ข้อมูลทั่วไป (เปิดเผยได้เมื่อยินยอม)"</b> หรือ <b>"ข้อมูลส่วนบุคคลอ่อนไหว (ห้ามเปิดเผยเด็ดขาด)"</b>
                  </p>
                </div>

                <table className="w-full text-xs sm:text-sm border border-slate-300">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2.5 text-left border-r border-slate-300">รายการข้อมูลดิจิทัล</th>
                      <th className="p-2.5 text-center border-r border-slate-300 w-36">ข้อมูลทั่วไป</th>
                      <th className="p-2.5 text-center w-44 text-rose-700">ข้อมูลอ่อนไหว (ห้ามแชร์)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 text-slate-700">
                    <tr>
                      <td className="p-2 border-r border-slate-300">1. เลขประจำตัวประชาชน 13 หลัก</td>
                      <td className="p-2 border-r border-slate-300 text-center">[ &nbsp;&nbsp; ]</td>
                      <td className="p-2 text-center">[ &nbsp;&nbsp; ]</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">2. ชื่อเล่น และ สีที่ชอบ</td>
                      <td className="p-2 border-r border-slate-300 text-center">[ &nbsp;&nbsp; ]</td>
                      <td className="p-2 text-center">[ &nbsp;&nbsp; ]</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">3. รหัสผ่าน Facebook / อีเมลส่วนตัว</td>
                      <td className="p-2 border-r border-slate-300 text-center">[ &nbsp;&nbsp; ]</td>
                      <td className="p-2 text-center">[ &nbsp;&nbsp; ]</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">4. ประวัติการรักษาพยาบาล / ข้อมูลสุขภาพ</td>
                      <td className="p-2 border-r border-slate-300 text-center">[ &nbsp;&nbsp; ]</td>
                      <td className="p-2 text-center">[ &nbsp;&nbsp; ]</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">5. ภาพผลงานเกม Scratch ที่เขียนเอง</td>
                      <td className="p-2 border-r border-slate-300 text-center">[ &nbsp;&nbsp; ]</td>
                      <td className="p-2 text-center">[ &nbsp;&nbsp; ]</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">6. ลายนิ้วมือ และ ข้อมูลสแกนใบหน้า (Biometrics)</td>
                      <td className="p-2 border-r border-slate-300 text-center">[ &nbsp;&nbsp; ]</td>
                      <td className="p-2 text-center">[ &nbsp;&nbsp; ]</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Score & Teacher Note for Grading */}
            <div className="pt-6 border-t-2 border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-800">ข้อเสนอแนะของคุณครู:</p>
                <p className="text-slate-500">..........................................................................................................................................</p>
              </div>
              <div className="border border-slate-800 p-3 rounded-lg text-center w-36">
                <span className="font-bold text-slate-800">คะแนนที่ได้</span>
                <p className="text-lg font-black text-emerald-700">..... / 10</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>Coder Kids v2.5 • คลังใบงาน Unplugged Coding พิมพ์ได้ตามมาตรฐาน สพฐ.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 font-semibold cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
