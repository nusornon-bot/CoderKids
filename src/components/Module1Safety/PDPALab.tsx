import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lock,
  Globe,
  Smartphone,
  Gamepad2,
  Users,
  Eye,
  EyeOff,
  Coins,
  BookOpen,
  HelpCircle,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface PDPAScenario {
  id: string;
  category: 'social' | 'gaming' | 'app' | 'school';
  categoryLabel: string;
  categoryIcon: React.ReactNode;
  title: string;
  context: string;
  mockUiType: 'instagram' | 'chat' | 'permission' | 'form';
  mockSenderOrApp: string;
  mockContent: string;
  dataItems: { label: string; isSensitive: boolean }[];
  correctDecision: 'private' | 'disclose';
  pdpaClassification: 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)' | 'ข้อมูลส่วนบุคคลทั่วไป (Personal Data)' | 'ข้อมูลสาธารณะ / ปลอดภัยที่จะแชร์ (Public / Safe)';
  pointsReward: number;
  explanation: string;
  consequence: string;
  safetyTip: string;
}

export const PDPA_SCENARIOS: PDPAScenario[] = [
  {
    id: 'pdpa_1',
    category: 'social',
    categoryLabel: 'โซเชียลมีเดีย',
    categoryIcon: <Globe className="w-4 h-4 text-sky-500" />,
    title: 'โพสต์รูปบัตรประชาชนและตั๋วเครื่องบินฉลองวันเกิดลงสตอรี่',
    context: 'น้องข้าวหอมอายุ 11 ปี ดีใจมากที่ครอบครัวจะพาไปเที่ยวทะเลวันเกิด จึงถ่ายรูปบัตรประชาชนคู่กับตั๋วเครื่องบินที่มีบาร์โค้ดชัดเจนลงสตอรี่สาธารณะ',
    mockUiType: 'instagram',
    mockSenderOrApp: 'Instagram Story • สาธารณะ (Public)',
    mockContent: '🎉 เย้ๆ พรุ่งนี้จะได้บินไปภูเก็ตแล้ว! ตั๋วพร้อม บัตรประชาชนพร้อม เจอกันทะเล! 🏖️ (ในภาพมีเลขบัตร 13 หลัก, วันเดือนปีเกิด และบาร์โค้ดตั๋วชัดเจน)',
    dataItems: [
      { label: 'เลขบัตรประชาชน 13 หลัก', isSensitive: true },
      { label: 'วัน เดือน ปีเกิด', isSensitive: true },
      { label: 'รหัสบาร์โค้ดตั๋วเครื่องบิน (PNR Code)', isSensitive: true },
    ],
    correctDecision: 'private',
    pdpaClassification: 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)',
    pointsReward: 15,
    explanation: 'เลขบัตรประชาชน 13 หลักและบาร์โค้ดตั๋วเครื่องบินสามารถนำไปใช้สวมรอย (Identity Theft) ตรวจสอบประวัติการเดินทาง หรือขโมยแต้มสะสมได้ เป็นข้อมูลสำคัญที่ห้ามโพสต์สู่สาธารณะเด็ดขาด',
    consequence: 'มิจฉาชีพอาจนำข้อมูลไปเปิดบัญชีม้า สมัครสินเชื่อออนไลน์ หรือทราบว่าบ้านไม่มีคนอยู่ช่วงที่เดินทาง',
    safetyTip: 'หากต้องการแชร์ความสุข ให้ถ่ายเฉพาะวิว บรรยากาศ หรือเบลอ/ปิดทับข้อมูลสำคัญและบาร์โค้ดให้มิดชิด 100%',
  },
  {
    id: 'pdpa_2',
    category: 'gaming',
    categoryLabel: 'เกมออนไลน์',
    categoryIcon: <Gamepad2 className="w-4 h-4 text-purple-500" />,
    title: 'ผู้เล่นแปลกหน้าในเกมทักแชทขอเบอร์โทรและที่อยู่เพื่อแจกสกินปืนฟรี',
    context: 'ขณะเล่นเกมเอาชีวิตรอดออนไลน์ มีผู้เล่นคนหนึ่งส่งข้อความส่วนตัวมาบอกว่าเป็นแอดมินใจดี ขอมอบสกินปืนหายากให้ฟรี ขอแค่ส่งเบอร์โทรศัพท์มือถือและที่อยู่บ้านมาให้',
    mockUiType: 'chat',
    mockSenderOrApp: 'Direct Message: ProGamer_VIP99',
    mockContent: 'น้องเล่นเก่งมากเลย! พี่เป็นสตรีมเมอร์อยากแจกสกินไอเทมแรร์ฟรี ขอเบอร์โทรศัพท์กับที่อยู่บ้านหน่อย เดี๋ยวส่งของรางวัลกับรหัส OTP ไปให้ที่บ้านนะ!',
    dataItems: [
      { label: 'เบอร์โทรศัพท์ส่วนตัว', isSensitive: false },
      { label: 'ที่อยู่บ้านพักอาศัย', isSensitive: true },
      { label: 'การขอรหัส OTP หรือข้อมูลยืนยันตัวตน', isSensitive: true },
    ],
    correctDecision: 'private',
    pdpaClassification: 'ข้อมูลส่วนบุคคลทั่วไป (Personal Data)',
    pointsReward: 15,
    explanation: 'นี่เป็นกลลวงแบบ Social Engineering / Phishing แอดมินเกมของจริงจะไม่มีวันทักมาขอเบอร์โทรศัพท์ ที่อยู่ หรือรหัส OTP ผ่านช่องแชทส่วนตัวของเกม',
    consequence: 'หากให้เบอร์และที่อยู่ อาจถูกโทรหลอกลวง ถูกส่งของเก็บเงินปลายทาง หรือถูกขโมยบัญชีเกม',
    safetyTip: 'ปฏิเสธทันที และกดปุ่มรายงาน (Report) ผู้เล่นคนนั้นต่อระบบดูแลความปลอดภัยของเกม',
  },
  {
    id: 'pdpa_3',
    category: 'school',
    categoryLabel: 'กิจกรรมโรงเรียน',
    categoryIcon: <Users className="w-4 h-4 text-emerald-500" />,
    title: 'กิจกรรมแนะนำตัววิชาวิทยาการคำนวณ: แชร์สัตว์เลี้ยงและงานอดิเรกที่ชอบ',
    context: 'คุณครูให้นักเรียนทำกิจกรรมป้ายนิเทศแนะนำตัวในระบบห้องเรียนเสมือน โดยให้นักเรียนเขียนบอกชื่อเล่น สัตว์เลี้ยงตัวโปรด สีที่ชอบ และแนวเกมที่สนใจ',
    mockUiType: 'form',
    mockSenderOrApp: 'ห้องเรียนเสมือนวิทยาการคำนวณ • กิจกรรม Ice Breaking',
    mockContent: 'สวัสดีเพื่อนๆ เราชื่อเล่นว่า "โฟกัส" สัตว์เลี้ยงที่ชอบคือแมวส้ม งานอดิเรกคือฝึกต่อบล็อกโค้ด Scratch สร้างเกมเขาวงกต ยินดีที่ได้รู้จักทุกคนนะ!',
    dataItems: [
      { label: 'ชื่อเล่น (Nickname)', isSensitive: false },
      { label: 'สัตว์เลี้ยงที่ชอบ (แมวส้ม)', isSensitive: false },
      { label: 'งานอดิเรก (เขียนโค้ด Scratch)', isSensitive: false },
    ],
    correctDecision: 'disclose',
    pdpaClassification: 'ข้อมูลสาธารณะ / ปลอดภัยที่จะแชร์ (Public / Safe)',
    pointsReward: 15,
    explanation: 'ข้อมูลความสนใจทั่วไป เช่น สัตว์เลี้ยง งานอดิเรก หรือชื่อเล่น ไม่ใช่ข้อมูลระบุตัวตนที่ก่อให้เกิดความเสี่ยง สามารถแบ่งปันในกิจกรรมการเรียนรู้เพื่อสร้างความสัมพันธ์อันดีกับเพื่อนได้',
    consequence: 'ช่วยส่งเสริมการแลกเปลี่ยนเรียนรู้และการทำงานร่วมกัน โดยไม่เสี่ยงต่อการถูกละเมิดความเป็นส่วนตัว',
    safetyTip: 'ระวังอย่าเผลอใส่ข้อมูลเจาะจง เช่น เลขที่บ้าน รหัสผ่าน หรือเบอร์โทรลงในบอร์ดสาธารณะ',
  },
  {
    id: 'pdpa_4',
    category: 'app',
    categoryLabel: 'แอปพลิเคชัน & Wi-Fi',
    categoryIcon: <Smartphone className="w-4 h-4 text-amber-500" />,
    title: 'หน้าจอลงทะเบียน Wi-Fi ฟรีขอสิทธิ์เข้าถึงพิกัด GPS ตลอดเวลาและรายชื่อติดต่อ',
    context: 'เดินห้างสรรพสินค้าแล้วเปิดเชื่อมต่อ Free Wi-Fi แต่หน้าเว็บขึ้นป๊อปอัปขอให้กด "ยินยอม" ให้เข้าถึงสมุดรายชื่อผู้ติดต่อทั้งหมด และติดตามตำแหน่ง GPS ตลอดเวลา 24 ชั่วโมง',
    mockUiType: 'permission',
    mockSenderOrApp: 'Mall_Free_WiFi ขอสิทธิ์เข้าถึงอุปกรณ์ของคุณ',
    mockContent: 'แอปพลิเคชันนี้ต้องการ: 1. เข้าถึงรายชื่อผู้ติดต่อในโทรศัพท์ของคุณทั้งหมด 2. เข้าถึงพิกัดตำแหน่ง GPS แบบเรียลไทม์ตลอดเวลา หากกดยินยอมจึงจะเริ่มใช้เน็ตฟรีได้',
    dataItems: [
      { label: 'สมุดรายชื่อผู้ติดต่อ (Contacts)', isSensitive: true },
      { label: 'พิกัด GPS ตลอดเวลา (Precise Location)', isSensitive: true },
    ],
    correctDecision: 'private',
    pdpaClassification: 'ข้อมูลส่วนบุคคลทั่วไป (Personal Data)',
    pointsReward: 15,
    explanation: 'ตามหลักการคุ้มครองข้อมูลส่วนบุคคล (Data Minimization) บริการ Wi-Fi ไม่มีความจำเป็นต้องขอเข้าถึงรายชื่อเพื่อนและพิกัด GPS ตลอดเวลา การขอสิทธิ์เกินจำเป็นถือเป็นความเสี่ยงต่อการถูกเก็บข้อมูลไปขายต่อ',
    consequence: 'ข้อมูลเพื่อนในเครื่องอาจถูกส่งสแปม และเราอาจถูกติดตามตำแหน่งที่อยู่อาศัยตลอดเวลา',
    safetyTip: 'กด "ปฏิเสธ (Deny)" และไม่ควรเชื่อมต่อ Wi-Fi ที่ขอสิทธิ์ล่วงล้ำความเป็นส่วนตัวเกินความจำเป็น',
  },
  {
    id: 'pdpa_5',
    category: 'school',
    categoryLabel: 'กลุ่มแชทเพื่อน',
    categoryIcon: <Users className="w-4 h-4 text-emerald-500" />,
    title: 'เพื่อนแอบถ่ายรูปเพื่อนคนอื่นกำลังร้องไห้ แล้วส่งมาบอกให้เราแชร์ต่อ',
    context: 'มีเพื่อนคนหนึ่งแอบถ่ายรูปเพื่อนร่วมชั้นที่กำลังร้องไห้เพราะสอบตก แล้วส่งเข้ามาในแชทกลุ่มย่อย พร้อมบอกว่า "ตลกมาก ช่วยกันแชร์ลงกลุ่มห้องใหญ่หน่อย"',
    mockUiType: 'chat',
    mockSenderOrApp: 'กลุ่มแชทแก๊งเพื่อนสนิท',
    mockContent: '[รูปภาพเพื่อนกำลังก้มหน้าร้องไห้] "ดูสิ ร้องไห้ขี้มูกโป่งเลย 555 ช่วยกันแชร์ประจานลงกลุ่มใหญ่หน่อยเร็ว!"',
    dataItems: [
      { label: 'ภาพถ่ายแสดงอารมณ์/ความเปราะบางของผู้อื่น', isSensitive: true },
      { label: 'ข้อมูลผลการเรียน/คะแนนสอบของเพื่อน', isSensitive: true },
    ],
    correctDecision: 'private',
    pdpaClassification: 'ข้อมูลส่วนบุคคลทั่วไป (Personal Data)',
    pointsReward: 15,
    explanation: 'การถ่ายและเผยแพร่ภาพของผู้อื่นโดยไม่ได้รับความยินยอม (Consent) โดยเฉพาะในลักษณะที่ทำให้อับอายหรือเสียชื่อเสียง เป็นการละเมิดสิทธิส่วนบุคคลตาม PDPA และเข้าข่ายการกลั่นแกล้งบนโลกไซเบอร์ (Cyberbullying)',
    consequence: 'เพื่อนที่ถูกแอบถ่ายจะได้รับความสะเทือนใจ และผู้ที่ส่งต่ออาจมีความผิดตาม พ.ร.บ. คอมพิวเตอร์ และ PDPA',
    safetyTip: 'ไม่ส่งต่อเด็ดขาด ตักเตือนเพื่อนที่แอบถ่าย และให้เกียรติความเป็นส่วนตัวของผู้อื่นเสมอ',
  },
  {
    id: 'pdpa_6',
    category: 'social',
    categoryLabel: 'โครงงาน & วิชาการ',
    categoryIcon: <Globe className="w-4 h-4 text-sky-500" />,
    title: 'เผยแพร่ลิงก์โครงงาน Scratch และแนวคิดอัลกอริทึมเพื่อเข้าร่วมการประกวด',
    context: 'นักเรียนสร้างเกมตอบคำถามวิทยาการคำนวณบน Scratch เสร็จแล้ว ต้องการแชร์ลิงก์โค้ดและโปสเตอร์อธิบายวิธีคิด (Flowchart) ให้คุณครูและคณะกรรมการประเมินผล',
    mockUiType: 'form',
    mockSenderOrApp: 'แบบฟอร์มส่งผลงานนวัตกรรมเยาวชน สพฐ. & สสวท.',
    mockContent: 'ชื่อโครงงาน: "เกมล่าสมบัติอัลกอริทึม" • ลิงก์ Scratch: scratch.mit.edu/projects/... • โค้ดตัวอย่างการใช้ Loop และ If-Else',
    dataItems: [
      { label: 'ชื่อโครงงานและแนวคิดการออกแบบ', isSensitive: false },
      { label: 'ลิงก์และชุดบล็อกคำสั่ง Scratch', isSensitive: false },
      { label: 'ผังงาน (Flowchart) แสดงวิธีคิด', isSensitive: false },
    ],
    correctDecision: 'disclose',
    pdpaClassification: 'ข้อมูลสาธารณะ / ปลอดภัยที่จะแชร์ (Public / Safe)',
    pointsReward: 15,
    explanation: 'ชิ้นงานสร้างสรรค์ ซอร์สโค้ด และแนวคิดทางวิชาการ ไม่ใช่ข้อมูลส่วนบุคคลที่ระบุตัวตนในเชิงลบ แต่เป็นผลงานที่ควรส่งเสริมให้เผยแพร่และแบ่งปันความรู้ (Open Education Resource)',
    consequence: 'ได้รับข้อเสนอแนะเพื่อพัฒนาทักษะ ได้รับคะแนนสะสม และเพื่อนๆ สามารถเรียนรู้โค้ดที่ดีได้',
    safetyTip: 'ตรวจสอบว่าในโค้ดหรือข้อความบรรยาย ไม่ได้เผลอใส่รหัสผ่าน หรือเบอร์โทรศัพท์ของตนเอง',
  },
  {
    id: 'pdpa_7',
    category: 'app',
    categoryLabel: 'แบบสำรวจออนไลน์',
    categoryIcon: <Smartphone className="w-4 h-4 text-amber-500" />,
    title: 'แบบสำรวจออนไลน์ลึกลับขอข้อมูลโรคประจำตัว กรุ๊ปเลือด และลายนิ้วมือ',
    context: 'คลิกลิงก์แบบสอบถามทายดวงชะตาบน Facebook แต่หน้าเว็บให้กรอกข้อมูลส่วนบุคคล เช่น โรคประจำตัว กรุ๊ปเลือด ข้อมูลสแกนลายนิ้วมือ และประวัติการรักษาพยาบาล',
    mockUiType: 'form',
    mockSenderOrApp: 'แอปทายดวงชะตาแม่นๆ 100% (ไม่ระบุผู้พัฒนา)',
    mockContent: 'กรุณากรอกข้อมูลเพื่อทำนายสุขภาพ: 1. โรคประจำตัว 2. ข้อมูลพันธุกรรมและกรุ๊ปเลือด 3. แนบรูปรอยลายนิ้วมือ เพื่อรับผลคำทำนายฟรีทางอีเมล',
    dataItems: [
      { label: 'ข้อมูลสุขภาพและโรคประจำตัว', isSensitive: true },
      { label: 'ข้อมูลชีวภาพ (Biometric / ลายนิ้วมือ)', isSensitive: true },
      { label: 'ข้อมูลทางพันธุกรรม', isSensitive: true },
    ],
    correctDecision: 'private',
    pdpaClassification: 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)',
    pointsReward: 15,
    explanation: 'ข้อมูลสุขภาพและข้อมูลชีวภาพ (Biometric) ถือเป็น "ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Personal Data)" ตามมาตรา 26 ของ PDPA ซึ่งมีบทลงโทษรุนแรงหากรั่วไหล ห้ามกรอกลงในเว็บที่ไม่น่าเชื่อถือเด็ดขาด',
    consequence: 'ข้อมูลสุขภาพอาจถูกนำไปปฏิเสธการทำประกัน หรือลายนิ้วมืออาจถูกนำไปจำลองเพื่อปลดล็อกอุปกรณ์',
    safetyTip: 'ปิดหน้าเว็บทันที และอย่าหลงเชื่อแบบทดสอบออนไลน์ที่ขอข้อมูลสุขภาพหรือลายนิ้วมือ',
  },
  {
    id: 'pdpa_8',
    category: 'gaming',
    categoryLabel: 'ความปลอดภัยบัญชี',
    categoryIcon: <Gamepad2 className="w-4 h-4 text-purple-500" />,
    title: 'เพื่อนข้างบ้านมาขอยืมรหัสผ่านบัญชีโรงเรียนและรหัสผ่านเข้าเล่นเกม',
    context: 'เพื่อนข้างบ้านมาทำการบ้านที่บ้าน แล้วขอให้เราจดรหัสผ่านบัญชี Google Workspace ของโรงเรียน และรหัสผ่าน Roblox ให้ โดยอ้างว่าจะช่วยปั๊มเลเวลและช่วยส่งการบ้านแทน',
    mockUiType: 'chat',
    mockSenderOrApp: 'ข้อความแชทจากเพื่อนข้างบ้าน',
    mockContent: '"ขอยืมพาสเวิร์ดเมลโรงเรียนกับรหัสเกมหน่อยสิ เดี๋ยวเย็นนี้เราช่วยฟาร์มของให้ แล้วช่วยกดส่งงานครูให้ด้วยนะ ไม่บอกใครหรอกสัญญา!"',
    dataItems: [
      { label: 'รหัสผ่านบัญชีโรงเรียน (Google Workspace)', isSensitive: true },
      { label: 'รหัสผ่านบัญชีเกม (Gaming Account Password)', isSensitive: true },
    ],
    correctDecision: 'private',
    pdpaClassification: 'ข้อมูลส่วนบุคคลอ่อนไหว (Sensitive Data)',
    pointsReward: 15,
    explanation: 'รหัสผ่าน (Password / Credentials) เป็นเสมือนกุญแจบ้านส่วนบุคคล กฎความปลอดภัยสากลระบุว่า "ห้ามแบ่งปันรหัสผ่านให้แก่ใครเด็ดขาด แม้กระทั่งเพื่อนสนิท"',
    consequence: 'หากเพื่อนนำบัญชีไปโพสต์สิ่งผิดกฎหมาย หรือถูกขโมยไอเทม เราจะต้องเป็นผู้รับผิดชอบผลการกระทำนั้นในฐานะเจ้าของบัญชี',
    safetyTip: 'ปฏิเสธอย่างสุภาพ แนะนำให้เพื่อนสมัครบัญชีของตนเอง และหากเผลอให้ไปแล้ว ให้รีบเปลี่ยนรหัสผ่านทันที',
  },
];

interface PDPALabProps {
  addPoints: (points: number, reason?: string, category?: 'safety' | 'thinking' | 'coding' | 'showcase' | 'classroom') => void;
  onComplete?: () => void;
}

export const PDPALab: React.FC<PDPALabProps> = ({ addPoints, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'social' | 'gaming' | 'app' | 'school'>('all');
  const [userAnswers, setUserAnswers] = useState<{
    [scenarioId: string]: {
      decision: 'private' | 'disclose';
      isCorrect: boolean;
    };
  }>({});
  const [totalLabPoints, setTotalLabPoints] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompletedAll, setIsCompletedAll] = useState(false);

  // Filtered list
  const filteredScenarios = PDPA_SCENARIOS.filter((s) => {
    if (selectedFilter === 'all') return true;
    return s.category === selectedFilter;
  });

  const currentScenario = filteredScenarios[currentIndex] || filteredScenarios[0];
  const currentAnswer = currentScenario ? userAnswers[currentScenario.id] : undefined;

  // Handle learner decision
  const handleDecision = (decision: 'private' | 'disclose') => {
    if (!currentScenario || userAnswers[currentScenario.id]) return;

    const isCorrect = decision === currentScenario.correctDecision;
    if (isCorrect) {
      setTotalLabPoints((prev) => prev + currentScenario.pointsReward);
      addPoints(currentScenario.pointsReward, `ตัดสินใจสถานการณ์ PDPA "${currentScenario.title.slice(0, 25)}..." ถูกต้อง`, 'safety');
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    }

    setUserAnswers((prev) => ({
      ...prev,
      [currentScenario.id]: {
        decision,
        isCorrect,
      },
    }));

    setShowExplanation(true);
  };

  // Move to next scenario
  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex + 1 < filteredScenarios.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompletedAll(true);
      if (onComplete) onComplete();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    }
  };

  // Reset lab
  const handleReset = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setTotalLabPoints(0);
    setShowExplanation(false);
    setIsCompletedAll(false);
  };

  const correctAnswersCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round((answeredCount / filteredScenarios.length) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6 animate-fade-in">
      {/* 1. Header & Live Points Tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>PDPA DECISION SIMULATION LAB</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            ห้องปฏิบัติการจำลองสถานการณ์ข้อมูลส่วนบุคคล (PDPA Lab)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            สวมบทบาทเป็นผู้พิทักษ์ข้อมูล วิเคราะห์สถานการณ์จริงในชีวิตดิจิทัล แล้วตัดสินใจว่า{' '}
            <strong className="text-rose-600 font-bold">ข้อมูลใดห้ามเปิดเผย (Keep Private)</strong> หรือ{' '}
            <strong className="text-emerald-600 font-bold">ข้อมูลใดปลอดภัยที่จะแชร์ (Safe to Disclose)</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 shadow-xs">
            <Coins className="w-4 h-4 text-amber-600" />
            <div className="text-right">
              <div className="text-[10px] text-amber-800 font-semibold uppercase">แต้มที่ได้จากแล็บนี้</div>
              <div className="text-base font-extrabold text-amber-700 font-mono tabular-nums leading-none">
                +{totalLabPoints} XP
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            title="เริ่มทำแล็บใหม่"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Progress Strip & Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-500 mr-1 text-[11px]">หมวดหมู่:</span>
          {[
            { id: 'all', label: 'ทั้งหมด (8 ข้อ)' },
            { id: 'social', label: 'โซเชียลมีเดีย' },
            { id: 'gaming', label: 'เกม & ไอเทม' },
            { id: 'school', label: 'โรงเรียน & เพื่อน' },
            { id: 'app', label: 'แอป & สิทธิ์' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedFilter(cat.id as any);
                setCurrentIndex(0);
                setShowExplanation(false);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedFilter === cat.id
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            ผ่านแล้ว <strong className="text-emerald-600 font-bold font-mono">{correctAnswersCount}</strong> / {filteredScenarios.length} เคส
          </div>
          <div className="w-28 sm:w-36 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Scenario Scenario View or Completed Summary */}
      {!isCompletedAll && currentScenario ? (
        <div className="space-y-6">
          {/* Scenario Stepper Indicator */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-mono font-bold">
                เคสที่ {currentIndex + 1} จาก {filteredScenarios.length}
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                {currentScenario.categoryIcon}
                <span>{currentScenario.categoryLabel}</span>
              </span>
            </div>

            <div className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              รางวัล: +{currentScenario.pointsReward} แต้ม XP
            </div>
          </div>

          {/* Scenario Context Card */}
          <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
                {currentScenario.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentScenario.context}
              </p>
            </div>

            {/* Simulated UI Mockup (แชท / โพสต์ / การขอสิทธิ์) */}
            <div className="rounded-2xl border border-slate-300/80 bg-white shadow-sm overflow-hidden text-xs">
              <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2 font-semibold">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentScenario.mockSenderOrApp}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">สถานการณ์จำลอง</span>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50/50 text-slate-800 leading-relaxed font-medium">
                {currentScenario.mockContent}
              </div>
            </div>

            {/* Data Elements Involved in this Scenario */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>ข้อมูลที่เกี่ยวข้องในเหตุการณ์นี้:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentScenario.dataItems.map((item, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold ${
                      item.isSensitive
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {item.isSensitive ? <AlertTriangle className="w-3 h-3 text-rose-600" /> : <CheckCircle2 className="w-3 h-3 text-slate-400" />}
                    <span>{item.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Decision Buttons (ห้ามเปิดเผย vs เปิดเผยได้) */}
          {!currentAnswer ? (
            <div className="space-y-3">
              <div className="text-center text-xs font-bold text-slate-700">
                👉 ในฐานะเจ้าของข้อมูลส่วนบุคคล คุณควรตัดสินใจอย่างไร?
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Decision 1: Keep Private */}
                <button
                  type="button"
                  onClick={() => handleDecision('private')}
                  className="p-5 rounded-2xl border-2 border-rose-300 hover:border-rose-500 bg-rose-50/70 hover:bg-rose-100 text-left transition-all group shadow-sm active:scale-98 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-rose-900">
                        🛑 ห้ามเปิดเผย / ต้องปกปิดเป็นความลับ
                      </div>
                      <div className="text-[11px] text-rose-700 font-medium">Keep Private &amp; Do Not Disclose</div>
                    </div>
                  </div>
                  <p className="text-xs text-rose-800/80 mt-1">
                    ข้อมูลมีความเสี่ยงสูง ล่วงล้ำความเป็นส่วนตัว หรืออาจถูกสวมรอยโจรกรรมอัตลักษณ์
                  </p>
                </button>

                {/* Decision 2: Safe to Disclose */}
                <button
                  type="button"
                  onClick={() => handleDecision('disclose')}
                  className="p-5 rounded-2xl border-2 border-emerald-300 hover:border-emerald-500 bg-emerald-50/70 hover:bg-emerald-100 text-left transition-all group shadow-sm active:scale-98 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-emerald-900">
                        ✅ เปิดเผยได้ / ปลอดภัยที่จะแชร์
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium">Safe to Share &amp; Disclose</div>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-800/80 mt-1">
                    เป็นข้อมูลทั่วไป ไม่สามารถระบุเจาะจงตัวตนในทางเสื่อมเสีย หรือมีวัตถุประสงค์เพื่อการเรียนรู้
                  </p>
                </button>
              </div>
            </div>
          ) : (
            /* Result and Legal Explanation Feedback Card */
            <div
              className={`p-6 sm:p-8 rounded-3xl border-2 transition-all space-y-4 ${
                currentAnswer.isCorrect
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
                      currentAnswer.isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  >
                    {currentAnswer.isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-extrabold">
                      {currentAnswer.isCorrect ? '🎉 ยอดเยี่ยมมาก! การตัดสินใจของคุณถูกต้อง' : '⚠️ ยังไม่ถูกต้อง ลองศึกษาเหตุผลด้านล่างเพื่อความปลอดภัย'}
                    </h4>
                    <div className="text-xs font-semibold mt-0.5">
                      ประเภทข้อมูลตาม PDPA:{' '}
                      <span className="font-bold underline">{currentScenario.pdpaClassification}</span>
                    </div>
                  </div>
                </div>

                {currentAnswer.isCorrect && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-200/60 text-emerald-900 rounded-xl font-bold font-mono text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>+{currentScenario.pointsReward} XP</span>
                  </div>
                )}
              </div>

              {/* Explanation & Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>คำอธิบายตามหลักกฎหมาย PDPA:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{currentScenario.explanation}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>ผลกระทบและความเสี่ยง:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{currentScenario.consequence}</p>
                </div>
              </div>

              {/* Safety Tip */}
              <div className="p-3.5 rounded-2xl bg-amber-100/70 border border-amber-300 text-amber-950 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <strong>เกร็ดความรู้ความปลอดภัย (Tip):</strong> {currentScenario.safetyTip}
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <span>
                    {currentIndex + 1 < filteredScenarios.length ? 'ไปสถานการณ์ถัดไป' : 'ดูสรุปผลการประเมินแล็บ'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 4. Complete Lab Summary View */
        <div className="p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto bg-gradient-to-b from-emerald-50/50 to-white rounded-3xl border border-emerald-200 shadow-sm animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm ring-4 ring-emerald-200">
            <ShieldCheck className="w-10 h-10 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              LAB COMPLETED • สำเร็จหลักสูตรจำลองสถานการณ์
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ยินดีด้วย! คุณผ่านการทดสอบ PDPA Lab
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              คุณได้เรียนรู้การตัดสินใจและคุ้มครองข้อมูลส่วนบุคคลในหลากหลายสถานการณ์จริง
              สร้างภูมิคุ้มกันดิจิทัลที่เข้มแข็งให้ตนเองและคนรอบข้าง
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-emerald-200 text-left">
            <div>
              <div className="text-xs text-slate-400">ตอบถูกต้องทั้งหมด</div>
              <div className="text-2xl font-black text-emerald-600 font-mono">
                {correctAnswersCount} / {filteredScenarios.length} เคส
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">แต้มสะสมที่ได้รับ</div>
              <div className="text-2xl font-black text-amber-600 font-mono">
                +{totalLabPoints} XP
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ฝึกซ้ำอีกรอบ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
