import React, { useState } from 'react';
import { ArrowDown, HelpCircle, Repeat } from 'lucide-react';

export const ControlStructuresView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sequence' | 'selection' | 'loop'>('sequence');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
      <div className="mb-6 pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">โครงสร้างการทำงาน</span>
        <h3 className="text-xl font-bold text-slate-900 mt-0.5">
          3 โครงสร้างควบคุมหลักในการเขียนโปรแกรม (Control Structures)
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          หัวใจสำคัญของการเขียนคำสั่ง ไม่ว่าจะใน Scratch, Micro:bit, Python หรือภาษาใดในโลก
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('sequence')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'sequence' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. ลำดับ (Sequence)
        </button>
        <button
          onClick={() => setActiveTab('selection')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'selection' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. ทางเลือก (Selection)
        </button>
        <button
          onClick={() => setActiveTab('loop')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'loop' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. การวนซ้ำ (Iteration)
        </button>
      </div>

      {/* Content */}
      {activeTab === 'sequence' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
                1
              </span>
              <span>โครงสร้างแบบลำดับ (Sequence Structure)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              คือการเขียนคำสั่งให้ทำงานเรียงต่อกันจากบนลงล่าง ทีละขั้นตอนอย่างต่อเนื่อง โดยไม่มีการข้ามขั้นตอนหรือย้อนกลับ
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-slate-800">ตัวอย่างขั้นตอน: การตื่นนอนไปโรงเรียน</div>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>ตื่นนอนและพับผ้าห่ม</li>
                <li>แปรงฟันและอาบน้ำ</li>
                <li>แต่งชุดนักเรียน</li>
                <li>รับประทานอาหารเช้า</li>
                <li>เดินทางไปโรงเรียน</li>
              </ol>
            </div>
          </div>

          <div className="lg:col-span-5 bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 space-y-2">
            <div className="text-xs font-bold text-indigo-900 mb-2">บล็อกคำสั่งแบบลำดับใน Scratch</div>
            <div className="p-2.5 bg-blue-500 text-white text-xs font-mono font-medium rounded-md shadow-sm">
              move (10) steps
            </div>
            <div className="flex justify-center text-slate-400">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
            <div className="p-2.5 bg-purple-500 text-white text-xs font-mono font-medium rounded-md shadow-sm">
              say [สวัสดีครับ!] for (2) secs
            </div>
            <div className="flex justify-center text-slate-400">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
            <div className="p-2.5 bg-blue-500 text-white text-xs font-mono font-medium rounded-md shadow-sm">
              turn right (90) degrees
            </div>
          </div>
        </div>
      )}

      {activeTab === 'selection' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center text-xs">
                2
              </span>
              <span>โครงสร้างแบบทางเลือก (Selection / If-Else)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              คือการเขียนคำสั่งให้โปรแกรมตรวจสอบเงื่อนไข ถ้าเงื่อนไขเป็นจริง (True) จะทำงานชุดคำสั่งหนึ่ง หากเป็นเท็จ (False) จะไปทำงานอีกชุดคำสั่งหนึ่ง
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-slate-800">ตัวอย่าง: การตัดสินใจพกร่ม</div>
              <p className="text-slate-600">
                ถ้า (ฝนตก) -&gt; หยิบร่มใส่กระเป๋า <br />
                มิฉะนั้น (ฝนไม่ตก) -&gt; ใส่หมวกกันแดด
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-amber-50/50 p-5 rounded-xl border border-amber-100 space-y-2">
            <div className="text-xs font-bold text-amber-900 mb-2">บล็อกคำสั่งเงื่อนไข If-Else</div>
            <div className="p-3 bg-amber-500 text-white text-xs font-mono font-medium rounded-t-md shadow-sm flex items-center justify-between">
              <span>if &lt;score &gt; 50&gt; then</span>
            </div>
            <div className="p-2.5 bg-emerald-600 text-white text-xs font-mono font-medium ml-4 border-l-2 border-white shadow-sm">
              show string &quot;PASS&quot;
            </div>
            <div className="p-2 bg-amber-500 text-white text-xs font-mono font-medium shadow-sm">
              else
            </div>
            <div className="p-2.5 bg-rose-600 text-white text-xs font-mono font-medium ml-4 border-l-2 border-white rounded-b-md shadow-sm">
              show string &quot;RETRY&quot;
            </div>
          </div>
        </div>
      )}

      {activeTab === 'loop' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                3
              </span>
              <span>โครงสร้างแบบวนซ้ำ (Iteration / Loops)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              คือการเขียนคำสั่งให้ทำงานชุดเดิมซ้ำๆ ตามจำนวนรอบที่ระบุ (Repeat n times) หรือวนซ้ำตลอดไป (Forever) จนกว่าจะมีเงื่อนไขให้หยุด ช่วยลดความยาวของโค้ดได้อย่างมหาศาล
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-slate-800">ตัวอย่าง: การวิ่งรอบสนาม</div>
              <p className="text-slate-600">
                ทำซ้ำ 3 รอบ: (วิ่งจากจุดสตาร์ท -&gt; วิ่งครบรอบ -&gt; ตรวจสอบรอบ) เมื่อครบ 3 รอบจึงหยุดพัก
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 space-y-2">
            <div className="text-xs font-bold text-emerald-900 mb-2">บล็อกคำสั่งทำซ้ำใน Scratch / Micro:bit</div>
            <div className="p-3 bg-amber-500 text-white text-xs font-mono font-medium rounded-t-md shadow-sm flex items-center justify-between">
              <span>repeat (4) times</span>
              <Repeat className="w-3.5 h-3.5" />
            </div>
            <div className="p-2.5 bg-blue-500 text-white text-xs font-mono font-medium ml-4 border-l-2 border-white shadow-sm">
              move (100) steps
            </div>
            <div className="p-2.5 bg-blue-600 text-white text-xs font-mono font-medium ml-4 border-l-2 border-white shadow-sm">
              turn right (90) degrees
            </div>
            <div className="p-1 bg-amber-500 rounded-b-md"></div>
            <div className="text-[11px] text-emerald-800 font-medium pt-1">
              ผลลัพธ์: ตัวละครวาดรูปสี่เหลี่ยมจัตุรัสได้อย่างสมบูรณ์!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
