import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AudioNarratorButton } from './AudioNarratorButton.tsx';

interface CodeTemplate {
  id: string;
  lang: 'python' | 'javascript';
  title: string;
  description: string;
  code: string;
  expectedOutput: string;
}

const TEMPLATES: CodeTemplate[] = [
  {
    id: 'py_mult',
    lang: 'python',
    title: 'Python: ตารางสูตรคูณด้วยลูป for',
    description: 'ฝึกใช้คำสั่ง for loop และ range() คำนวณสูตรคูณแม่ 2 ถึงแม่ 5',
    code: `# ตารางสูตรคูณหรรษาด้วย Python\nnumber = 5\nprint(f"=== เริ่มต้นสูตรคูณแม่ {number} ===")\nfor i in range(1, 13):\n    result = number * i\n    print(f"{number} x {i} = {result}")\nprint("ฝึกคิดเป็นขั้นตอนสำเร็จ!")`,
    expectedOutput: `=== เริ่มต้นสูตรคูณแม่ 5 ===\n5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50\n5 x 11 = 55\n5 x 12 = 60\nฝึกคิดเป็นขั้นตอนสำเร็จ!`,
  },
  {
    id: 'py_grade',
    lang: 'python',
    title: 'Python: โปรแกรมตัดเกรดอัตโนมัติ (If-Elif-Else)',
    description: 'ตรวจสอบเงื่อนไขคะแนนตามเกณฑ์ สพฐ. เพื่อหาเกรด 4, 3, 2, 1',
    code: `# โปรแกรมคำนวณระดับผลการเรียน สพฐ.\nscore = 85\n\nif score >= 80:\n    grade = "4 (ดีเยี่ยม)"\nelif score >= 70:\n    grade = "3 (ดีมาก)"\nelif score >= 60:\n    grade = "2 (ผ่านเกณฑ์)"\nelse:\n    grade = "1 (ควรปรับปรุง)"\n\nprint(f"คะแนนที่ได้: {score} คะแนน")\nprint(f"ผลการประเมิน: เกรด {grade}")`,
    expectedOutput: `คะแนนที่ได้: 85 คะแนน\nผลการประเมิน: เกรด 4 (ดีเยี่ยม)\n[System] ประเมินผลสมรรถนะผู้เรียนเรียบร้อย`,
  },
  {
    id: 'js_microbit',
    lang: 'javascript',
    title: 'Micro:bit JS: เซ็นเซอร์ตรวจจับอุณหภูมิ',
    description: 'เขียน JavaScript ควบคุมบอร์ด Micro:bit แจ้งเตือนเมื่ออากาศร้อนเกิน 30°C',
    code: `// Micro:bit V2 JavaScript Simulation\nlet temp = input.temperature();\nbasic.showString("TEMP: " + temp + "C");\n\nif (temp > 30) {\n    basic.showIcon(IconNames.Sad);\n    music.playTone(440, music.beat(BeatFraction.Whole));\n    console.log("[Alert] อุณหภูมิสูงเกินเกณฑ์!");\n} else {\n    basic.showIcon(IconNames.Happy);\n    console.log("[Normal] สภาพอากาศปกติ รดน้ำต้นไม้สมบูรณ์");\n}`,
    expectedOutput: `[Micro:bit Booting...] V2.2 System Ready\nReading Temperature Sensor -> 32 C\n[Alert] อุณหภูมิสูงเกินเกณฑ์! หน้าจอแสดงไอคอน Sad :( \nส่งเสียง Buzzer แจ้งเตือนความถี่ 440 Hz สำเร็จ`,
  },
];

interface JuniorCodePlaygroundProps {
  onAwardPoints?: (pts: number) => void;
}

export const JuniorCodePlayground: React.FC<JuniorCodePlaygroundProps> = ({
  onAwardPoints,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate>(TEMPLATES[0]);
  const [userCode, setUserCode] = useState<string>(TEMPLATES[0].code);
  const [terminalOutput, setTerminalOutput] = useState<string>('พร้อมรันโค้ด คลิกปุ่ม "รันโค้ด (Run Code)" เพื่อดูผลลัพธ์...');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleSelectTemplate = (template: CodeTemplate) => {
    setSelectedTemplate(template);
    setUserCode(template.code);
    setTerminalOutput(`โหลดแม่แบบ: ${template.title}\nพร้อมประมวลผล...`);
  };

  const handleResetCode = () => {
    setUserCode(selectedTemplate.code);
    setTerminalOutput('รีเซ็ตโค้ดกลับสู่ค่าเริ่มต้นแล้ว');
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalOutput('⏳ กำลังคอมไพล์และประมวลผลสคริปต์...');

    setTimeout(() => {
      setIsRunning(false);
      setTerminalOutput(selectedTemplate.expectedOutput);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });

      if (onAwardPoints) {
        onAwardPoints(10);
      }
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Playground Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/40 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/30">
              <Terminal className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/40 text-indigo-200 border border-indigo-400/30">
                  Junior Code Playground
                </span>
                <span className="text-xs text-slate-300">สะพานเชื่อมจาก Block สู่ Text-based Coding</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                ห้องทดลองเขียนโค้ดภาษา Python &amp; Micro:bit JavaScript
              </h2>
            </div>
          </div>
          <AudioNarratorButton
            textToRead="ยินดีต้อนรับสู่ห้องทดลองเขียนโค้ด Junior Code Playground เรียนรู้การเปลี่ยนผ่านจากบล็อกคำสั่งสู่การเขียนโค้ดจริงด้วยภาษา Python และ JavaScript"
            label="ฟังคำอธิบาย"
          />
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          ฝึกทักษะการพิมพ์คำสั่งไวยากรณ์ (Syntax), การใช้ตัวแปร, ฟังก์ชัน, และลูปวนซ้ำ สอดคล้องกับหลักสูตรวิทยาการคำนวณระดับประถมปลายและมัธยมศึกษาตอนต้น
        </p>
      </div>

      {/* Template Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-3 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <span>เลือกแม่แบบโปรแกรม:</span>
        </span>
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => handleSelectTemplate(tmpl)}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedTemplate.id === tmpl.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600'
            }`}
          >
            {tmpl.title}
          </button>
        ))}
      </div>

      {/* Editor & Terminal 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Code Editor */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-300 ml-2">
                main.{selectedTemplate.lang === 'python' ? 'py' : 'js'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 text-xs flex items-center gap-1 cursor-pointer"
                title="คัดลอกโค้ด"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'คัดลอกแล้ว' : 'Copy'}</span>
              </button>
              <button
                onClick={handleResetCode}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 text-xs flex items-center gap-1 cursor-pointer"
                title="รีเซ็ตโค้ด"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ต</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner">
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={14}
              spellCheck={false}
              className="w-full p-4 font-mono text-xs sm:text-sm bg-transparent text-emerald-400 focus:outline-none resize-none leading-relaxed selection:bg-indigo-700 selection:text-white"
            />
          </div>

          {/* Action Execution Button */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>พิมพ์แก้ไขตัวเลขหรือข้อความได้ตามใจชอบ แล้วกดปุ่มรันโค้ด</span>
            </span>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? 'กำลังรัน...' : 'รันโค้ด (Run Code)'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Simulated Terminal & Concept Card */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Terminal Console */}
          <div className="rounded-2xl border border-slate-800 bg-black text-slate-200 overflow-hidden shadow-xl flex flex-col h-[280px]">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Output Console / Terminal</span>
              </span>
              <span className="text-[10px] text-slate-500">Node.js / Python 3.11</span>
            </div>
            <div className="p-4 font-mono text-xs text-emerald-400 overflow-y-auto flex-1 whitespace-pre-wrap leading-relaxed">
              {terminalOutput}
            </div>
          </div>

          {/* Explanation & Learning Objectives */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>ความรู้หลักการคิดเชิงคำนวณที่ใช้:</span>
            </h4>
            <p className="text-xs text-indigo-950/80 dark:text-indigo-300/90 leading-relaxed">
              {selectedTemplate.description}
            </p>
            <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/60 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ผ่านเกณฑ์ตัวชี้วัด สพฐ. ด้านการเขียนโปรแกรม</span>
              </span>
              <span>+10 แต้ม EXP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
