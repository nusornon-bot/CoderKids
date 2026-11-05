import React, { useState } from 'react';
import {
  X,
  Printer,
  BookOpen,
  FileText,
  CheckCircle2,
  Download,
  Presentation,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects.ts';

interface LessonPlanItem {
  id: number;
  unit: string;
  title: string;
  duration: string; // เช่น 2 ชั่วโมง
  indicator: string; // ตัวชี้วัด สพฐ.
  objectives: {
    k: string; // ความรู้
    p: string; // ทักษะ
    a: string; // คุณลักษณะ
  };
  steps: {
    intro: string; // ขั้นนำ
    instruct: string; // ขั้นสอนและลงมือทำ
    summary: string; // ขั้นสรุป
  };
  media: string[];
  rubric: string;
  slideSummary: string[];
}

const LESSON_PLANS: LessonPlanItem[] = [
  {
    id: 1,
    unit: 'หน่วยที่ 1: ความปลอดภัยและพลเมืองดิจิทัล',
    title: 'แผนการจัดการเรียนรู้ที่ 1: การปกป้องข้อมูลส่วนบุคคล (PDPA) และรอยเท้าดิจิทัล',
    duration: '2 ชั่วโมง (120 นาที)',
    indicator: 'ว 4.2 ป.4/4, ป.5/4',
    objectives: {
      k: 'อธิบายความหมายและความสำคัญของข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) ได้',
      p: 'สามารถจำแนกข้อมูลทั่วไปและข้อมูลอ่อนไหว (Sensitive Data) ที่ไม่ควรเปิดเผยบนโลกออนไลน์ได้',
      a: 'ตระหนักถึงสิทธิความเป็นส่วนตัวและเคารพข้อมูลส่วนบุคคลของตนเองและผู้อื่น',
    },
    steps: {
      intro: 'ครูเปิดประเด็นด้วยคลิปข่าวจำลองมิจฉาชีพหลอกขอ OTP และให้เด็กๆ ร่วมกันทายว่าข้อมูลใดที่ไม่ควรบอกคนแปลกหน้า',
      instruct: 'นักเรียนเข้าสู่ระบบ Coder Kids โมดูลที่ 1 ปฏิบัติการ "PDPA Lab" และเล่นเกมจำแนกการ์ดข้อมูลส่วนบุคคล 10 การ์ดเพื่อฝึกวิเคราะห์',
      summary: 'ร่วมกันสรุปหลัก 3 อย่า (อย่าบอกรหัส อย่ากดลิงก์แปลก อย่าแชร์รูปคนอื่นโดยไม่ขออนุญาต) และบันทึกคะแนนสะสม',
    },
    media: ['การ์ดข้อมูลส่วนบุคคล Coder Kids', 'วิดีโอจำลองสถานการณ์ PDPA', 'ใบงาน Unplugged สำรวจข้อมูลในโรงเรียน'],
    rubric: 'ระดับดีเยี่ยม (4): จำแนกข้อมูลส่วนบุคคลได้ถูกต้อง 100% พร้อมให้เหตุผลทางกฎหมาย PDPA ได้ชัดเจน',
    slideSummary: [
      '📌 สไลด์ 1: ข้อมูลส่วนบุคคล (Personal Data) คืออะไร?',
      '📌 สไลด์ 2: ข้อแตกต่างระหว่าง "ข้อมูลทั่วไป" VS "ข้อมูลอ่อนไหว"',
      '📌 สไลด์ 3: กฎทอง PDPA: ขออนุญาตก่อนโพสต์ภาพเพื่อนเสมอ!',
    ],
  },
  {
    id: 2,
    unit: 'หน่วยที่ 1: ความปลอดภัยและพลเมืองดิจิทัล',
    title: 'แผนการจัดการเรียนรู้ที่ 2: รหัสผ่านแข็งแกร่ง (Strong Password) และการยืนยันตัวตน 2FA',
    duration: '2 ชั่วโมง (120 นาที)',
    indicator: 'ว 4.2 ป.4/4',
    objectives: {
      k: 'อธิบายหลักการตั้งรหัสผ่านที่ปลอดภัย (Cyber Hygiene) ได้',
      p: 'สามารถออกแบบรหัสผ่านที่มีความยาวเกิน 12 ตัวอักษร ผสมอักขระพิเศษและตัวเลขได้',
      a: 'มีความรับผิดชอบต่อการดูแลบัญชีดิจิทัลของตนเอง ไม่บอกรหัสแก่เพื่อน',
    },
    steps: {
      intro: 'ทดสอบให้เด็กๆ ส่งตัวอย่างรหัสผ่านที่คิดว่าเดายากเข้าสู่โปรแกรมวัดความแข็งแกร่ง',
      instruct: 'เปิด "Password Lab" บน Coder Kids ให้นักเรียนทดลองพิมพ์รหัสผ่าน ดูเวลาที่แฮกเกอร์ใช้ถอดรหัส และเปิดใช้งาน 2FA',
      summary: 'นักเรียนสร้างสูตรลับจำรหัสผ่านส่วนตัว (Passphrase) คนละ 1 สูตรโดยไม่ต้องจดลงสมุดให้ใครเห็น',
    },
    media: ['โปรแกรมจำลอง Password Lab', 'ใบกิจกรรม Password Formula Sheet'],
    rubric: 'ระดับดีเยี่ยม (4): ออกแบบรหัสผ่านระดับ Very Strong ที่ใช้เวลาถอดรหัสมากกว่า 100 ปีได้',
    slideSummary: [
      '📌 สไลด์ 1: 5 รหัสผ่านยอดแย่ที่แฮกเกอร์ชอบที่สุด (เช่น 123456)',
      '📌 สไลด์ 2: เทคนิค Passphrase: แปลงประโยคโปรดเป็นรหัสลับ',
      '📌 สไลด์ 3: 2FA กุญแจดอกที่สอง ป้องกันการแฮกได้ 99.9%',
    ],
  },
  {
    id: 3,
    unit: 'หน่วยที่ 2: การคิดเชิงคำนวณและขั้นตอนวิธี',
    title: 'แผนการจัดการเรียนรู้ที่ 3: 4 เสาหลักการคิดเชิงคำนวณ (Computational Thinking)',
    duration: '2 ชั่วโมง (120 นาที)',
    indicator: 'ว 4.2 ป.4/1, ป.5/1',
    objectives: {
      k: 'เข้าใจความหมายของ Decomposition, Pattern, Abstraction, Algorithm',
      p: 'สามารถประยุกต์ใช้ทั้ง 4 เสาหลักในการแตกปัญหากิจวัตรประจำวันได้',
      a: 'กระตือรือร้นในการคิดวิเคราะห์อย่างเป็นระบบ มีเหตุผล',
    },
    steps: {
      intro: 'กิจกรรมเกมถอดประกอบปากกา: สังเกตชิ้นส่วนย่อยและการทำงานร่วมกัน',
      instruct: 'เรียนรู้ผ่านโมดูลที่ 2 ใน Coder Kids ทดลองลากเส้นเชื่อมโยงเสาหลักกับตัวอย่างสถานการณ์จริง',
      summary: 'ตัวแทนนักเรียนนำเสนอวิธีนำการคิดเชิงคำนวณไปใช้แก้ปัญหาการจัดกระเป๋านักเรียนตามตารางสอน',
    },
    media: ['สื่ออินโฟกราฟิก 4 เสาหลัก', 'เกมเขาวงกตปริศนา Algorithm Puzzle'],
    rubric: 'ระดับดีเยี่ยม (4): สามารถวิเคราะห์ปัญหาซับซ้อนโดยใช้ครบทั้ง 4 เสาหลักได้อย่างถูกต้องแม่นยำ',
    slideSummary: [
      '📌 สไลด์ 1: การแตกปัญหาย่อย (Decomposition)',
      '📌 สไลด์ 2: การมองหารูปแบบ (Pattern Recognition)',
      '📌 สไลด์ 3: การคัดเลือกสาระสำคัญ (Abstraction) และขั้นตอนวิธี (Algorithm)',
    ],
  },
  {
    id: 4,
    unit: 'หน่วยที่ 2: การคิดเชิงคำนวณและขั้นตอนวิธี',
    title: 'แผนการจัดการเรียนรู้ที่ 4: การออกแบบขั้นตอนวิธีด้วยผังงาน (Flowchart)',
    duration: '2 ชั่วโมง (120 นาที)',
    indicator: 'ว 4.2 ป.4/1, ป.5/1',
    objectives: {
      k: 'จดจำและอธิบายความหมายของสัญลักษณ์ผังงานมาตรฐานสากลได้',
      p: 'สามารถเขียนผังงานแบบมีเงื่อนไขและแบบวนซ้ำเพื่อแก้ปัญหาได้',
      a: 'ทำงานอย่างเป็นระเบียบ เรียบร้อย และตรวจสอบความถูกต้องของงาน',
    },
    steps: {
      intro: 'เล่นเกมบอร์ดเกมกระดาษ: หุ่นยนต์เดินตามบัตรคำสั่งลูกศร',
      instruct: 'ลงมือวาดผังงานการต้มบะหมี่และการคัดแยกขยะลงในใบงาน Unplugged A4 พร้อมตรวจทานสัญลักษณ์เงื่อนไข',
      summary: 'แลกเปลี่ยนผังงานกับคู่หู (Buddy) เพื่อทดลองรันโค้ดกระดาษ (Dry Run) หาข้อผิดพลาด',
    },
    media: ['ใบงาน Unplugged Flowchart A4', 'สไลด์สัญลักษณ์มาตรฐาน ISO'],
    rubric: 'ระดับดีเยี่ยม (4): เขียนผังงานถูกต้องตามหลักสัญลักษณ์ มีทิศทางลูกศรชัดเจน ไม่มีจุด Dead End',
    slideSummary: [
      '📌 สไลด์ 1: สัญลักษณ์ผังงาน Start/End, Process, Decision, IO',
      '📌 สไลด์ 2: โครงสร้าง 3 แบบ: ตามลำดับ, ทางเลือก, และทำซ้ำ',
      '📌 สไลด์ 3: ตัวอย่างผังงานระบบรดน้ำต้นไม้อัตโนมัติ',
    ],
  },
  {
    id: 5,
    unit: 'หน่วยที่ 3: ปฏิบัติการโค้ดดิ้งจำลอง',
    title: 'แผนการจัดการเรียนรู้ที่ 5: การสร้างเกมแอนิเมชันด้วย Scratch Studio',
    duration: '3 ชั่วโมง (180 นาที)',
    indicator: 'ว 4.2 ป.4/2, ป.5/2',
    objectives: {
      k: 'เข้าใจการทำงานของบล็อกเหตุการณ์ (Events), การเคลื่อนที่ (Motion) และการควบคุม (Control)',
      p: 'สามารถประกอบบล็อกคำสั่งสร้างเกมเก็บคะแนนที่มีการตรวจจับเงื่อนไข (Sensing) ได้',
      a: 'มีความเพียรพยายามในการฝึกเขียนโค้ดและสนุกกับการสร้างสรรค์',
    },
    steps: {
      intro: 'สาธิตเกม "เจ้าเหมียววิ่งเก็บเหรียญ" ใน Scratch Studio และชวนสังเกตเงื่อนไขเมื่อชนสิ่งกีดขวาง',
      instruct: 'นักเรียนลงมือเขียนโปรแกรมใน Coder Kids Scratch Studio ประกอบบล็อก if-touching-then เปลี่ยนคะแนนและเล่นเสียง',
      summary: 'ทดสอบรันเกมและแชร์คะแนนสูงสุดที่ทำได้ขึ้นกระดานคะแนนของห้องเรียน',
    },
    media: ['Scratch Studio จำลองบนเว็บ', 'สไปรต์ตัวละครและฉากหลังสำเร็จรูป'],
    rubric: 'ระดับดีเยี่ยม (4): เกมทำงานได้สมบูรณ์ มีระบบนับคะแนน มีเงื่อนไขการชน และเล่นได้จริงโดยไม่มีบั๊ก',
    slideSummary: [
      '📌 สไลด์ 1: ทำความรู้จัก Coordinate (X, Y) และบล็อก Motion',
      '📌 สไลด์ 2: การสร้างตัวแปร (Variables) เก็บแต้ม Score',
      '📌 สไลด์ 3: บล็อก Sensing: เมื่อตัวละครสัมผัสเป้าหมาย',
    ],
  },
  {
    id: 6,
    unit: 'หน่วยที่ 3: ปฏิบัติการโค้ดดิ้งจำลอง',
    title: 'แผนการจัดการเรียนรู้ที่ 6: การจำลองฮาร์ดแวร์ Micro:bit V2 และเซ็นเซอร์ IoT',
    duration: '3 ชั่วโมง (180 นาที)',
    indicator: 'ว 4.2 ป.6/2',
    objectives: {
      k: 'อธิบายส่วนประกอบของบอร์ด Micro:bit V2 และหน้าที่ของเซ็นเซอร์แสง/ความเร่งได้',
      p: 'สามารถเขียนโปรแกรมจำลองหน้าจอ LED 5x5 และเขียนโค้ดรับสัญญาณปุ่มกด A/B ได้',
      a: 'สนใจเทคโนโลยีฮาร์ดแวร์และอินเทอร์เน็ตของสรรพสิ่ง (IoT)',
    },
    steps: {
      intro: 'ชูบอร์ดจำลอง Micro:bit บนหน้าจอ และกดปุ่มให้หลอดไฟ LED แสดงเป็นรูปไอคอนหัวใจเต้น',
      instruct: 'นักเรียนเขียนโค้ด on shake เพื่อสร้างเกมทอยลูกเต๋า หรือระบบตรวจจับอุณหภูมิห้องบนตัวจำลอง Coder Kids',
      summary: 'นำเสนอแนวคิดการนำ Micro:bit ไปประยุกต์ใช้งานในชีวิตประจำวัน เช่น กล่องแจ้งเตือนการกินยา',
    },
    media: ['Micro:bit V2 Simulator', 'ตารางเมทริกซ์ 5x5 LED'],
    rubric: 'ระดับดีเยี่ยม (4): เขียนโปรแกรมสั่งงานบอร์ดจำลองตอบสนองต่อเซ็นเซอร์ได้อย่างถูกต้องแม่นยำ',
    slideSummary: [
      '📌 สไลด์ 1: สำรวจบอร์ด Micro:bit V2: ปุ่ม A/B, 25 LED, เซ็นเซอร์แสง',
      '📌 สไลด์ 2: การเขียนโค้ดเกมเป่ายิ้งฉุบด้วย on shake',
      '📌 สไลด์ 3: เชื่อมโยงสู่ Smart Home และระบบอัตโนมัติ',
    ],
  },
  {
    id: 7,
    unit: 'หน่วยที่ 3: ปฏิบัติการโค้ดดิ้งจำลอง',
    title: 'แผนการจัดการเรียนรู้ที่ 7: ภารกิจล่าบั๊กและการดีบักโปรแกรม (Debugging Master)',
    duration: '2 ชั่วโมง (120 นาที)',
    indicator: 'ว 4.2 ป.5/2, ป.6/2',
    objectives: {
      k: 'เข้าใจสาเหตุของข้อผิดพลาด (Syntax Error & Logic Error) ในโปรแกรม',
      p: 'สามารถตรวจสอบลำดับคำสั่งทีละบรรทัด (Tracing) และแก้ไขบั๊กให้โปรแกรมทำงานถูกต้องได้',
      a: 'มีความอดทน ไม่ย่อท้อเมื่อพบข้อผิดพลาด และมองว่าบั๊กคือโอกาสในการเรียนรู้',
    },
    steps: {
      intro: 'เล่าประวัติศาสตร์ของคำว่า Bug (แมลงติดในรีเลย์คอมพิวเตอร์ยุคแรก)',
      instruct: 'เปิดมินิเกม "ภารกิจล่า Bug ประจำวัน" ใน Coder Kids นักเรียนทดสอบสคริปต์ที่มีบั๊ก 5 จุดและแก้ไขค่าตัวแปร',
      summary: 'บันทึกเคล็ดลับ 3 ขั้นตอนการดีบัก: 1. อ่าน Error 2. ไล่ลำดับ 3. ทดสอบค่าตัวแปร',
    },
    media: ['Daily Bug Hunter Mini-game', 'ตัวอย่างโค้ดที่มีข้อผิดพลาดจำลอง'],
    rubric: 'ระดับดีเยี่ยม (4): สามารถค้นหาจุดผิดพลาดเชิงตรรกะและแก้ไขให้โปรแกรมทำงานลุล่วงได้ภายในเวลา',
    slideSummary: [
      '📌 สไลด์ 1: บั๊ก (Bug) เกิดจากอะไร? Logic Error VS Syntax Error',
      '📌 สไลด์ 2: วิธี Trace Code: อ่านโค้ดทีละบรรทัดเหมือนคอมพิวเตอร์',
      '📌 สไลด์ 3: เทคนิคแก้ลูปไม่รู้จบ (Infinite Loop Fix)',
    ],
  },
  {
    id: 8,
    unit: 'หน่วยที่ 4: โครงงานและการสะท้อนคิด',
    title: 'แผนการจัดการเรียนรู้ที่ 8: โครงงานนวัตกรรมวิทยาการคำนวณและการประเมินตนเอง',
    duration: '3 ชั่วโมง (180 นาที)',
    indicator: 'ว 4.2 ป.4/2, ป.5/2, ป.6/2',
    objectives: {
      k: 'เข้าใจกระบวนการพัฒนาโครงงานคอมพิวเตอร์อย่างเป็นขั้นตอน',
      p: 'สามารถเผยแพร่ผลงาน เขียนบันทึกสะท้อนคิด 3-2-1 และประเมินเพื่อนแบบ 2 Stars & A Wish ได้',
      a: 'มีน้ำใจ ให้กำลังใจเพื่อน และยอมรับฟังข้อเสนอแนะเพื่อการพัฒนาตนเอง',
    },
    steps: {
      intro: 'ชมแกลเลอรีโครงงานยอดนิยมใน Showcase Gallery ของเพื่อนในระบบ Coder Kids',
      instruct: 'นักเรียนส่งโครงงานขึ้นระบบ เขียนบันทึกสะท้อนคิดความประทับใจ และเปิดดูเกียรติบัตรรับรองตนเอง',
      summary: 'ครูและนักเรียนร่วมกันจัดนิทรรศการออนไลน์ และออกรายงานผลการประเมิน ปพ.5 ส่งออกเป็น CSV',
    },
    media: ['Showcase Gallery', 'ระบบประเมิน 2 Stars & A Wish', 'เกียรติบัตรและรายงาน ปพ.5'],
    rubric: 'ระดับดีเยี่ยม (4): ผลงานมีความคิดสร้างสรรค์ มีประโยชน์ และสะท้อนคิดการเรียนรู้ได้อย่างลึกซึ้ง',
    slideSummary: [
      '📌 สไลด์ 1: 5 ขั้นตอนการสร้างโครงงานโค้ดดิ้งฉบับเด็กประถม',
      '📌 สไลด์ 2: วัฒนธรรมการให้ Feedback: 2 สิ่งที่ชม + 1 สิ่งที่แนะ',
      '📌 สไลด์ 3: ภาคภูมิใจในผลงาน และรับเกียรติบัตรสู่ก้าวต่อไป',
    ],
  },
];

export const TeacherLessonPlansModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<number>(1);
  const [slideMode, setSlideMode] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPlan = LESSON_PLANS.find((p) => p.id === selectedPlanId) || LESSON_PLANS[0];

  const handlePrint = () => {
    soundEffects.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[95vh] overflow-y-auto print:max-w-none print:shadow-none print:border-none print:p-0 print:max-h-none print:text-black">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                  คลังแผนการจัดการเรียนรู้ &amp; สไลด์สอนครู (Teacher Lesson Plans Pack)
                </h3>
                <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                  มาตรฐาน ว 4.2 ป.4-6
                </span>
              </div>
              <p className="text-xs text-slate-500">
                8 แผนการสอนครบทุกหน่วยการเรียนรู้ พร้อมจุดประสงค์, กิจกรรม, สื่อ, รูบริก และโหมดฉายสไลด์
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                setSlideMode(!slideMode);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                slideMode
                  ? 'bg-amber-500 text-white'
                  : 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>{slideMode ? 'ปิดโหมดสไลด์' : 'โหมดฉายสไลด์สอน'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์แผน (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lesson Plans Horizontal Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar print:hidden">
          {LESSON_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <button
                key={plan.id}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedPlanId(plan.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                แผนที่ {plan.id}: {plan.title.split(':')[1]?.trim() || plan.title}
              </button>
            );
          })}
        </div>

        {/* Slide Presentation Mode Overlay */}
        {slideMode && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white border-2 border-indigo-700 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Presentation className="w-4 h-4" />
                <span>โหมดฉายสไลด์ห้องเรียน (CLASSROOM SLIDE DECK)</span>
              </span>
              <span className="text-xs font-mono bg-white/10 px-2.5 py-0.5 rounded-full">
                {currentPlan.unit}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-amber-300">
              {currentPlan.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {currentPlan.slideSummary.map((slide, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-2 hover:bg-white/15 transition-all"
                >
                  <div className="text-sm font-bold text-white">{slide}</div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    เนื้อหาแนะนำสำหรับการบรรยายและชวนเด็กๆ อภิปรายก่อนเข้าสู่ห้องปฏิบัติการจำลอง Coder Kids
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
              <span>💡 คลิก "ปิดโหมดสไลด์" เพื่อกลับสู่เอกสารแผนการจัดการเรียนรู้ฉบับเต็ม</span>
            </div>
          </div>
        )}

        {/* Printable Lesson Plan Content */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-6 print:bg-white print:border-none print:p-0">
          
          {/* Plan Header */}
          <div className="border-b-2 border-slate-300 dark:border-slate-700 pb-4 space-y-2">
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {currentPlan.unit}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {currentPlan.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <span>⏱️ เวลาที่ใช้: {currentPlan.duration}</span>
              <span>📋 ตัวชี้วัด: {currentPlan.indicator}</span>
              <span>🏫 ระดับชั้น: ประถมศึกษาปีที่ 4-6</span>
            </div>
          </div>

          {/* Section 1: Objectives (K-P-A) */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>1. จุดประสงค์การเรียนรู้ (Learning Objectives)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block">ด้านความรู้ (K):</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{currentPlan.objectives.k}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">ด้านทักษะปฏิบัติ (P):</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{currentPlan.objectives.p}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="font-bold text-amber-600 dark:text-amber-400 block">ด้านเจตคติ (A):</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{currentPlan.objectives.a}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Pedagogical Steps */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>2. กระบวนการจัดการเรียนรู้ (3 ขั้นตอนการสอน)</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">
                  1. ขั้นนำเข้าสู่บทเรียน (Introduction - 15 นาที):
                </strong>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{currentPlan.steps.intro}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <strong className="text-emerald-600 dark:text-emerald-400 block mb-1">
                  2. ขั้นสอนและปฏิบัติการ (Instruction &amp; Hands-on - 80 นาที):
                </strong>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{currentPlan.steps.instruct}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <strong className="text-amber-600 dark:text-amber-400 block mb-1">
                  3. ขั้นสรุปและสะท้อนคิด (Summary &amp; Reflection - 25 นาที):
                </strong>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{currentPlan.steps.summary}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Media & Evaluation Rubric */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>สื่อและแหล่งเรียนรู้ (Learning Resources)</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                {currentPlan.media.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>เกณฑ์การประเมินรูบริก (Rubric Assessment)</span>
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentPlan.rubric}
              </p>
            </div>
          </div>

          {/* Teacher Signature */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
            <span>เอกสารประกอบการจัดการเรียนรู้ Coder Kids สพฐ.</span>
            <div className="text-right">
              <p>ลงชื่อ .............................................................. ครูผู้สอน</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
