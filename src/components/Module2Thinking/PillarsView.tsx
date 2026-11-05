import React, { useState } from 'react';
import { Layers, Search, EyeOff, GitBranch, ChevronRight } from 'lucide-react';

export const PillarsView: React.FC = () => {
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillars = [
    {
      id: 0,
      title: '1. การแยกย่อยปัญหา (Decomposition)',
      subtitle: 'แตกปัญหาใหญ่ให้กลายเป็นปัญหาย่อยที่จัดการได้ง่าย',
      icon: Layers,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      description:
        'กระบวนการแยกปัญหาหรือระบบที่ซับซ้อนออกเป็นส่วนย่อยๆ เพื่อให้เข้าใจ วิเคราะห์ และแก้ไขได้ทีละขั้นตอน',
      dailyExample:
        'การทำความสะอาดบ้าน: แทนที่จะมองว่าต้องทำทั้งบ้านพร้อมกัน เราแยกย่อยเป็น ทำห้องนอน -> ล้างจานในครัว -> กวาดห้องนั่งเล่น -> ทิ้งขยะ',
      codingExample:
        'ในเกม Scratch: แยกออกเป็น 1. ระบบควบคุมตัวละครเคลื่อนที่ 2. ระบบสุ่มเกิดศัตรู 3. ระบบนับคะแนน 4. หน้าจอ Game Over',
    },
    {
      id: 1,
      title: '2. การหารูปแบบ (Pattern Recognition)',
      subtitle: 'ค้นหาความเหมือน คล้าย หรือพฤติกรรมที่เกิดขึ้นซ้ำๆ',
      icon: Search,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      description:
        'การสังเกตและวิเคราะห์หาแบบแผน ความสัมพันธ์ หรือแนวโน้มที่เกิดขึ้น เพื่อนำวิธีการแก้ปัญหาเดิมมาปรับใช้ซ้ำได้อย่างรวดเร็ว',
      dailyExample:
        'การจราจรตอนเช้า: สังเกตว่าวันจันทร์และวันศุกร์ รถจะติดมากเป็นพิเศษในช่วงเวลา 07.30 - 08.30 น. จึงวางแผนออกเดินทางเร็วขึ้น',
      codingExample:
        'การวาดรูปสี่เหลี่ยมด้วย Scratch: มีรูปแบบ "เดินหน้า 100 ก้าว แล้วหมุน 90 องศา" ทำซ้ำกัน 4 ครั้ง จึงใช้บล็อก Repeat 4 รอบแทนการเขียนคำสั่งซ้ำ',
    },
    {
      id: 2,
      title: '3. การคิดเชิงนามธรรม (Abstraction)',
      subtitle: 'คัดกรองเฉพาะสิ่งสำคัญ ละทิ้งรายละเอียดที่ไม่จำเป็น',
      icon: EyeOff,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      description:
        'การมุ่งเน้นไปยังสาระสำคัญของปัญหา โดยตัดรายละเอียดปลีกย่อยที่ไม่เกี่ยวข้องกับการแก้ไขปัญหาในขณะนั้นออกไป',
      dailyExample:
        'แผนที่รถไฟฟ้า (BTS/MRT): ไม่ได้บอกว่ารางรถไฟโค้งกี่องศาหรือถนนข้างล่างมีต้นไม้อะไรบ้าง แต่แสดงเฉพาะ "สถานี" และ "จุดเชื่อมต่อ" ที่ผู้โดยสารต้องใช้เดินทาง',
      codingExample:
        'ใน Micro:bit: ตัวแปร score (คะแนน) เก็บเพียงตัวเลข เช่น 5 โดยโปรแกรมไม่จำเป็นต้องรู้ว่าคะแนนนั้นได้จากเหรียญสีอะไร สนใจเพียงค่าตัวเลขในการตัดสินชนะ/แพ้',
    },
    {
      id: 3,
      title: '4. การออกแบบอัลกอริทึม (Algorithm Design)',
      subtitle: 'พัฒนาขั้นตอนวิธีแก้ปัญหาเป็นลำดับที่ชัดเจนและปฏิบัติตามได้',
      icon: GitBranch,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      description:
        'การจัดลำดับขั้นตอนคำสั่งอย่างเป็นระบบ ชัดเจน แน่นอน เพื่อให้คอมพิวเตอร์หรือบุคคลสามารถปฏิบัติตามและได้ผลลัพธ์ที่ถูกต้องเสมอ',
      dailyExample:
        'สูตรทำไข่เจียว: 1. ตอกไข่ใส่ชาม 2. ใส่ซีอิ๊ว 3. ตีไข่ให้เข้ากัน 4. ตั้งกระทะใส่น้ำมันรอร้อน 5. เทไข่ลงทอด 6. กลับด้านเมื่อสุก 7. ตักใส่จาน',
      codingExample:
        'ใน Micro:bit: "เมื่อกดปุ่ม A -> สุ่มเลข 1 ถึง 6 -> แสดงผลตัวเลขบน LED -> ส่งเสียงบี๊บ 1 ครั้ง"',
    },
  ];

  const current = pillars[activePillar];
  const Icon = current.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
      <div className="mb-6 pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">พื้นฐานการคิด</span>
        <h3 className="text-xl font-bold text-slate-900 mt-0.5">
          4 เสาหลักการคิดเชิงคำนวณ (Computational Thinking)
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          ทักษะการแก้ปัญหาที่มีคุณค่าสำหรับศตวรรษที่ 21 ช่วยให้คิดอย่างมีตรรกะและออกแบบคำสั่งโปรแกรมได้อย่างมีประสิทธิภาพ
        </p>
      </div>

      {/* Pillar switcher buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {pillars.map((p) => {
          const PIcon = p.icon;
          const isSelected = activePillar === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePillar(p.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${isSelected ? 'bg-white/20 text-white' : 'bg-white border text-slate-700'}`}>
                  <PIcon className="w-4 h-4" />
                </span>
                {isSelected && <ChevronRight className="w-4 h-4 text-sky-400" />}
              </div>
              <div className="text-xs font-semibold">{p.title.split('.')[1]?.trim()}</div>
            </button>
          );
        })}
      </div>

      {/* Detail Showcase */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${current.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">{current.title}</h4>
            <p className="text-xs text-slate-500 font-medium">{current.subtitle}</p>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mb-6 bg-white p-4 rounded-xl border border-slate-200">
          {current.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <div className="text-xs font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <span>☕ ตัวอย่างในชีวิตประจำวัน</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{current.dailyExample}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <div className="text-xs font-semibold text-indigo-600 mb-1 flex items-center gap-1.5">
              <span>💻 ตัวอย่างในการเขียนโปรแกรม</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{current.codingExample}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
