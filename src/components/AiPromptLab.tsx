import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  Search,
  Eye,
  Award,
  Zap,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { AudioReaderButton } from './AudioReaderButton.tsx';

interface AiPromptLabProps {
  onBack: () => void;
  addPoints: (amount: number, reason: string, category: 'thinking') => void;
  onCelebrate: (type: 'badge' | 'module_completed' | 'points_milestone' | 'quiz_perfect', title: string, desc: string, icon: string) => void;
}

export const AiPromptLab: React.FC<AiPromptLabProps> = ({ onBack, addPoints, onCelebrate }) => {
  const [activeTab, setActiveTab] = useState<'promptBuilder' | 'deepfakeBuster' | 'digitalFootprint'>('promptBuilder');

  // 1. Prompt Builder State
  const [role, setRole] = useState<string>('นักวิทยาศาสตร์อวกาศใจดี');
  const [task, setTask] = useState<string>('อธิบายว่าทำไมดาวอังคารถึงมีสีแดงให้เด็ก ป.4 ฟัง');
  const [style, setStyle] = useState<string>('ภาษาเข้าใจง่าย มีมุกตลก และใช้อิโมจิ');
  const [constraint, setConstraint] = useState<string>('ความยาวไม่เกิน 3 ย่อหน้าสั้นๆ');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [hasGeneratedAiResponse, setHasGeneratedAiResponse] = useState<boolean>(true);

  // 2. Deepfake Buster State
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<number, boolean>>({});
  const [revealedClues, setRevealedClues] = useState<Record<number, boolean>>({});

  // 3. Digital Footprint State
  const [selectedSafetyItems, setSelectedSafetyItems] = useState<string[]>([]);
  const [footprintSubmitted, setFootprintSubmitted] = useState<boolean>(false);

  const fullPrompt = `คุณคือ ${role} กรุณา ${task} โดยใช้รูปแบบ ${style} และมีเงื่อนไขคือ ${constraint}`;

  const sampleAiResponses: Record<string, string> = {
    'นักวิทยาศาสตร์อวกาศใจดี':
      '🚀 สวัดดีครับนักบินอวกาศรุ่นเยาว์! รู้อะไรไหมว่าทำไมดาวอังคารถึงได้ฉายาว่า "ดาวเคราะห์สีแดง"?\n\n🪐 คำตอบคือ... ดาวอังคารไม่ได้ทาลิปสติกนะ! แต่บนพื้นผิวของมันเต็มไปด้วย "สนิมเหล็ก" (Iron Oxide) เหมือนกับตะปูเก่าๆ ที่ขึ้นสนิมบนโลกของเรานั่นเอง!\n\n💨 พายุทรายบนดาวอังคารจะพัดพาฝุ่นสนิมสีแดงส้มนี้ฟุ้งกระจายไปทั่วท้องฟ้า พอเรามองจากโลกผ่านกล้องโทรทรรศน์ จึงเห็นเป็นสีแดงเปล่งประกายสุดเท่ยังไงล่ะครับ! ✨',
    'ติวเตอร์โค้ดดิ้งจิ๋ว':
      '💻 ยินดีต้อนรับสู่โลกโค้ดดิ้งครับ! การเขียนโปรแกรมก็เหมือนกับการที่เราเขียนสูตรทำขนมเค้ก 🎂 ถ้าเราสั่งว่า "ใส่ไข่ -> ตีแป้ง -> อบ 20 นาที" คอมพิวเตอร์ก็จะทำตามคำสั่งนั้นเป๊ะๆ เลยครับ ลุยกันเลย! 🌟',
    'เชฟขนมหวานสุดสร้างสรรค์':
      '🧁 ว้าว! วันนี้เชฟขอชวนน้องๆ มาทำคัพเค้กช็อกโกแลตแบบไม่ต้องง้อเตาอบ แค่มีชามผสมกับไมโครเวฟ 1 นาที กลิ่นหอมฟุ้งทั้งบ้านเลยครับ! 🍫✨',
  };

  const getSimulatedAiOutput = () => {
    return (
      sampleAiResponses[role] ||
      `🤖 [AI ตอบกลับ]: สวัสดีครับ! ในฐานะ ${role} ยินดีช่วยเหลือน้องๆ ครับ!\n\nคำตอบสำหรับ "${task}" ในรูปแบบ ${style}:\n\nนี่คือข้อมูลที่น่าสนใจและสนุกสนาน เหมาะกับนักเรียนที่อยากค้นคว้าต่อในยุคดิจิทัลครับ!`
    );
  };

  // Scenarios for Deepfake Buster
  const busterScenarios = [
    {
      id: 1,
      title: 'สถานการณ์ที่ 1: ภาพบุคคลปริศนาในข่าวออนไลน์',
      description: 'ภาพเด็กหญิงยืนเล่นกับสุนัขในสวนสาธารณะ แต่ลองสังเกตบริเวณนิ้วมือ แว่นตา และตัวหนังสือที่ป้ายด้านหลัง',
      isAiGenerated: true,
      clue: '🔍 ข้อสังเกต AI: นิ้วมือมี 6 นิ้วอย่างผิดธรรมชาติ และตัวหนังสือบนป้ายข้างหลังสะกดไม่เป็นภาษาที่อ่านได้',
      explanation: 'ภาพนี้สร้างโดย AI (Generative Image Model) รุ่นแรกๆ มักจะมีปัญหาเรื่องการวาดโครงสร้างนิ้วมือและตัวอักษร',
    },
    {
      id: 2,
      title: 'สถานการณ์ที่ 2: ข้อความ SMS "ธนาคารแจกเงิน 5,000 บาท รีบกดรับใน 10 นาที"',
      description: 'ได้รับข้อความพร้อมลิงก์: www.bank-thailand-free-bonus999.xyz/claim กรุณากรอกรหัสผ่านและเลข OTP',
      isAiGenerated: false, // Phishing scam
      isScam: true,
      clue: '🔍 ข้อสังเกตมิจฉาชีพ: ธนาคารจริงจะไม่มีการส่งลิงก์ขอ OTP หรือรหัสผ่าน และชื่อโดเมนเป็น .xyz ไม่ใช่ของทางการ',
      explanation: 'นี่คือ Phishing (การหลอกเอาข้อมูล) ห้ามกดเด็ดขาด และห้ามให้รหัสผ่านหรือ OTP แก่ผู้อื่นเป็นอันขาด',
    },
    {
      id: 3,
      title: 'สถานการณ์ที่ 3: ภาพถ่ายบอร์ดทดลอง Micro:bit ในห้องเรียนวิทยาศาสตร์',
      description: 'ภาพถ่ายบอร์ด Micro:bit V2 มีสายไฟสีแดง-ดำเสียบเข้าช่อง 3V และ GND มีเงาตกกระทบสมจริงและตัวหนังสือชัดเจน',
      isAiGenerated: false,
      clue: '🔍 ข้อสังเกตภาพจริง: แสงและเงาตกกระทบถูกต้อง ตัวอักษรบนชิปและพินทองแดงตรงตามมาตรฐานโรงงาน',
      explanation: 'ภาพนี้เป็นภาพถ่ายอุปกรณ์จริงในห้องปฏิบัติการ STEM สำหรับการเรียนรู้',
    },
    {
      id: 4,
      title: 'สถานการณ์ที่ 4: เสียงคลิปดาราชื่อดังชวนนำเงินเก็บมาลงทุนบิตคอยน์',
      description: 'วิดีโอมีภาพดาราพูด แต่สังเกตว่าริมฝีปากขยับไม่ตรงกับจังหวะเสียง และโทนเสียงมีความแปร่งเป็นโลหะ',
      isAiGenerated: true,
      clue: '🔍 ข้อสังเกต AI: ปากไม่ซิงค์กับเสียง (Lip-sync error) และเสียงมีความสั่นผิดธรรมชาติจากการสังเคราะห์ Deepfake',
      explanation: 'นี่คือ Deepfake Audio/Video มิจฉาชีพใช้ AI เลียนแบบหน้าและเสียงดาราเพื่อหลอกลวงประชาชน',
    },
  ];

  const handleBusterAnswer = (userGuessedAiOrScam: boolean) => {
    const scenario = busterScenarios[currentScenarioIndex];
    const isCorrect = userGuessedAiOrScam === (scenario.isAiGenerated || scenario.isScam);

    setScenarioAnswers({
      ...scenarioAnswers,
      [currentScenarioIndex]: isCorrect,
    });

    if (isCorrect) {
      addPoints(15, `ตอบถูกในภารกิจ AI & Deepfake Buster: ${scenario.title}`, 'thinking');
      onCelebrate('points_milestone', 'สุดยอดนักสืบดิจิทัล!', 'คุณตรวจจับเนื้อหา AI และภัยออนไลน์ได้อย่างแม่นยำ (+15 แต้ม)', '🛡️');
    }
  };

  // 3. Digital Footprint Items
  const safeItems = [
    { id: 'drawing', label: 'ภาพวาดการ์ตูนฝีมือตนเอง', isSafe: true },
    { id: 'pet', label: 'รูปถ่ายน้องแมวสัตว์เลี้ยง', isSafe: true },
    { id: 'hobby', label: 'โพสต์เล่าว่าชอบเล่นกีฬาบาสเกตบอล', isSafe: true },
    { id: 'password', label: 'รหัสผ่าน Wi-Fi หรือรหัสเกม Roblox', isSafe: false },
    { id: 'address', label: 'ที่อยู่บ้านและเบอร์โทรศัพท์ส่วนตัว', isSafe: false },
    { id: 'idcard', label: 'ภาพถ่ายบัตรประชาชนของผู้ปกครอง', isSafe: false },
    { id: 'live_loc', label: 'เช็กอินตำแหน่งที่อยู่ปัจจุบันขณะอยู่บ้านคนเดียว', isSafe: false },
  ];

  const handleToggleFootprint = (id: string) => {
    if (selectedSafetyItems.includes(id)) {
      setSelectedSafetyItems(selectedSafetyItems.filter((i) => i !== id));
    } else {
      setSelectedSafetyItems([...selectedSafetyItems, id]);
    }
  };

  const handleCheckFootprint = () => {
    setFootprintSubmitted(true);
    // Correct selection: selecting all safe items and NO unsafe items
    const correctlyPickedSafe = safeItems.filter((i) => i.isSafe).every((i) => selectedSafetyItems.includes(i.id));
    const noUnsafePicked = safeItems.filter((i) => !i.isSafe).every((i) => !selectedSafetyItems.includes(i.id));

    if (correctlyPickedSafe && noUnsafePicked) {
      addPoints(25, 'พิชิตแบบทดสอบ Digital Footprint & Netiquette ปลอดภัย 100%', 'thinking');
      onCelebrate('badge', 'ผู้พิทักษ์ความปลอดภัยดิจิทัล!', 'คุณเข้าใจการปกป้องข้อมูลส่วนบุคคลตามกฎหมาย PDPA เด็ก (+25 แต้ม)', '🔒');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-purple-200 hover:text-white bg-white/15 px-3 py-1 rounded-full backdrop-blur-sm transition-colors"
            >
              ← กลับสู่แดชบอร์ดหลัก
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">🤖</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Kids AI &amp; Safe Prompting Lab
                </h1>
                <p className="text-purple-100 text-xs sm:text-sm">
                  ห้องทดลองปัญญาประดิษฐ์ สั่งงาน AI อย่างสร้างสรรค์ และรู้เท่าทันภัยดิจิทัล
                </p>
              </div>
            </div>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex flex-wrap gap-2 bg-black/25 p-1.5 rounded-2xl backdrop-blur-md border border-white/15">
            <button
              onClick={() => setActiveTab('promptBuilder')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'promptBuilder' ? 'bg-white text-purple-900 shadow-md' : 'text-purple-100 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Prompt Builder
            </button>
            <button
              onClick={() => setActiveTab('deepfakeBuster')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'deepfakeBuster' ? 'bg-white text-purple-900 shadow-md' : 'text-purple-100 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Deepfake Buster
            </button>
            <button
              onClick={() => setActiveTab('digitalFootprint')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'digitalFootprint' ? 'bg-white text-purple-900 shadow-md' : 'text-purple-100 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Digital Footprint
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- 1. TAB: PROMPT BUILDER ---------------- */}
      {activeTab === 'promptBuilder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Recipe Ingredients */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    สูตรผสมคำสั่ง AI (The 4 Building Blocks)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    การสั่ง AI ให้ได้ผลลัพธ์ที่ดีต้องมี: บทบาท + คำสั่ง + รูปแบบ + ข้อจำกัด
                  </p>
                </div>
                <AudioReaderButton
                  textToRead="สูตรผสมคำสั่ง AI ประกอบด้วย 4 องค์ประกอบ คือ บทบาท คำสั่งที่ต้องการ รูปแบบการตอบ และข้อจำกัดที่ชัดเจน"
                  size="sm"
                />
              </div>

              {/* Block 1: Role */}
              <div className="space-y-2 mb-5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px]">1</span>
                  🎭 กำหนดบทบาทของ AI (Role):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'นักวิทยาศาสตร์อวกาศใจดี',
                    'ติวเตอร์โค้ดดิ้งจิ๋ว',
                    'เชฟขนมหวานสุดสร้างสรรค์',
                    'นักประวัติศาสตร์ไดโนเสาร์',
                    'หุ่นยนต์นักเล่านิทาน',
                  ].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all truncate ${
                        role === r
                          ? 'bg-purple-50 text-purple-900 border-purple-400 ring-2 ring-purple-200'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Block 2: Task */}
              <div className="space-y-2 mb-5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">2</span>
                  🎯 งานหรือคำถามที่ต้องการ (Task):
                </label>
                <input
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                  placeholder="เช่น อธิบายเรื่องทำไมท้องฟ้าถึงเป็นสีฟ้า..."
                />
              </div>

              {/* Block 3: Style & Tone */}
              <div className="space-y-2 mb-5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px]">3</span>
                  🎨 รูปแบบและโทนเสียง (Style &amp; Tone):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'ภาษาเข้าใจง่าย มีมุกตลก และใช้อิโมจิ',
                    'เรียบร้อย เป็นวิชาการ มีข้อ 1 2 3 ชัดเจน',
                    'บทกลอนหรือนิทานสั้นคล้องจอง',
                    'คำอธิบายแบบเปรียบเทียบกับชีวิตประจำวัน',
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                        style === s
                          ? 'bg-sky-50 text-sky-900 border-sky-400 ring-2 ring-sky-200'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Block 4: Constraints */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px]">4</span>
                  ⚠️ ข้อจำกัด (Constraints):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'ความยาวไม่เกิน 3 ย่อหน้าสั้นๆ',
                    'ไม่ใช้คำศัพท์ยาก ป.4 เข้าใจได้ทันที',
                    'ปิดท้ายด้วยคำถามชวนคิด 1 ข้อ',
                    'เน้นตัวอย่างอุปกรณ์ที่หาได้ในบ้าน',
                  ].map((c) => (
                    <button
                      key={c}
                      onClick={() => setConstraint(c)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                        constraint === c
                          ? 'bg-amber-50 text-amber-900 border-amber-400 ring-2 ring-amber-200'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Prompt & AI Simulator */}
          <div className="lg:col-span-5 space-y-6">
            {/* Generated Prompt Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-400" />
                  คำสั่งพร้อมส่ง (Generated Prompt)
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(fullPrompt);
                    setCopiedPrompt(true);
                    setTimeout(() => setCopiedPrompt(false), 2000);
                  }}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedPrompt ? 'คัดลอกแล้ว' : 'คัดลอก'}
                </button>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-slate-200 font-mono leading-relaxed">
                "{fullPrompt}"
              </div>
            </div>

            {/* AI Response Simulator */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  ผลลัพธ์จำลองจาก AI (AI Output Simulator)
                </div>
                <AudioReaderButton textToRead={getSimulatedAiOutput()} size="sm" />
              </div>

              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {getSimulatedAiOutput()}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">ทดลองสร้างคำสั่งหลากหลายเพื่อดูผลลัพธ์</span>
                <button
                  onClick={() => {
                    addPoints(10, 'ฝึกผสมคำสั่ง AI Prompt Builder', 'thinking');
                    onCelebrate('points_milestone', 'เก่งมาก!', 'คุณได้เรียนรู้โครงสร้างการสั่งงาน AI ยุคใหม่ (+10 แต้ม)', '💡');
                  }}
                  className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition-all"
                >
                  สะสมแต้มสำเร็จ (+10 XP)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 2. TAB: DEEPFAKE BUSTER ---------------- */}
      {activeTab === 'deepfakeBuster' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            {/* Top Indicator */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                ด่านที่ {currentScenarioIndex + 1} จาก {busterScenarios.length}
              </span>
              <AudioReaderButton
                textToRead={`${busterScenarios[currentScenarioIndex].title} ${busterScenarios[currentScenarioIndex].description}`}
                size="sm"
              />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              {busterScenarios[currentScenarioIndex].title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {busterScenarios[currentScenarioIndex].description}
            </p>

            {/* Clue Revealer */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-purple-600" />
                  ต้องการแว่นขยายช่วยส่องเบาะแสไหม?
                </span>
                <button
                  onClick={() =>
                    setRevealedClues({
                      ...revealedClues,
                      [currentScenarioIndex]: !revealedClues[currentScenarioIndex],
                    })
                  }
                  className="text-xs text-purple-700 hover:text-purple-900 font-bold underline"
                >
                  {revealedClues[currentScenarioIndex] ? 'ซ่อนเบาะแส' : 'เปิดดูเบาะแส'}
                </button>
              </div>

              {revealedClues[currentScenarioIndex] && (
                <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-purple-900 font-medium">
                  {busterScenarios[currentScenarioIndex].clue}
                </div>
              )}
            </div>

            {/* Guess Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleBusterAnswer(false)}
                className="py-3 px-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ของจริง / ปลอดภัย
              </button>

              <button
                onClick={() => handleBusterAnswer(true)}
                className="py-3 px-4 rounded-2xl border-2 border-rose-500 bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                AI สร้าง / หลอกลวง
              </button>
            </div>

            {/* Feedback & Result */}
            {scenarioAnswers[currentScenarioIndex] !== undefined && (
              <div
                className={`mt-6 p-4 rounded-2xl border text-xs leading-relaxed ${
                  scenarioAnswers[currentScenarioIndex]
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="font-bold mb-1">
                  {scenarioAnswers[currentScenarioIndex] ? '🎉 ตอบถูกยอดเยี่ยม!' : '❌ ยังไม่ถูกต้องครับ'}
                </div>
                <div>{busterScenarios[currentScenarioIndex].explanation}</div>
              </div>
            )}

            {/* Next Scenario Control */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                disabled={currentScenarioIndex === 0}
                onClick={() => setCurrentScenarioIndex(currentScenarioIndex - 1)}
                className="text-xs text-slate-500 disabled:opacity-30"
              >
                ← ข้อก่อนหน้า
              </button>
              <button
                disabled={currentScenarioIndex === busterScenarios.length - 1}
                onClick={() => setCurrentScenarioIndex(currentScenarioIndex + 1)}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 disabled:opacity-30"
              >
                ข้อถัดไป →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 3. TAB: DIGITAL FOOTPRINT & NETIQUETTE ---------------- */}
      {activeTab === 'digitalFootprint' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                ปลอดภัยหรือไม่? รอยเท้าดิจิทัล (Digital Footprint)
              </h2>
              <AudioReaderButton
                textToRead="จงเลือกเฉพาะข้อมูลที่ปลอดภัย สามารถแบ่งปันในโลกออนไลน์ได้ โดยไม่ละเมิดความเป็นส่วนตัวหรือทำให้เกิดอันตราย"
                size="sm"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              เลือกเฉพาะข้อมูลที่ <strong>"ปลอดภัย"</strong> สามารถแบ่งปันในโลกออนไลน์ได้ตามหลัก พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA):
            </p>

            <div className="space-y-3 mb-6">
              {safeItems.map((item) => {
                const isSelected = selectedSafetyItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleFootprint(item.id)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleCheckFootprint}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-2xl shadow-md transition-all"
            >
              ตรวจคำตอบและรับเหรียญรางวัล (+25 แต้ม)
            </button>

            {footprintSubmitted && (
              <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>💡 ข้อคิดสำคัญ:</strong> สิ่งที่โพสต์ลงบนอินเทอร์เน็ตจะทิ้งรอยเท้าดิจิทัล (Digital Footprint) ไว้ตลอดไป ข้อมูลส่วนตัว รหัสผ่าน และเลขบัตรประชาชน ห้ามโพสต์หรือส่งให้คนแปลกหน้าเป็นอันขาด!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
