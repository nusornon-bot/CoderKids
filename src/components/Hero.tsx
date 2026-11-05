import React from 'react';
import { ShieldCheck, Cpu, PlayCircle, Share2, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroProps {
  onSelectModule: (moduleKey: string) => void;
  moduleProgress: {
    safety: boolean;
    thinking: boolean;
    codingLab: boolean;
    showcase: boolean;
  };
}

export const Hero: React.FC<HeroProps> = ({ onSelectModule, moduleProgress }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 bg-gradient-to-b from-indigo-50/70 via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-column Hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3">
              <span>วิทยาการคำนวณและเทคโนโลยีดิจิทัล</span>
              <span aria-hidden="true">·</span>
              <span>สื่อการเรียนรู้เชิงปฏิสัมพันธ์</span>
              <span aria-hidden="true">·</span>
              <span>ระดับประถมศึกษาและมัธยมศึกษา</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-5" style={{ textWrap: 'balance' }}>
              ฝึกทักษะโค้ดดิ้ง ปลอดภัยในโลกดิจิทัล คิดอย่างเป็นระบบด้วย Scratch และ Micro:bit
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              ศูนย์รวมบทเรียนการคิดเชิงคำนวณ การใช้เทคโนโลยีอย่างปลอดภัยและมีมารยาท พร้อมห้องทดลองเขียนโปรแกรมจำลองเสมือนจริง และพื้นที่จัดแสดงผลงานสะท้อนความคิดอย่างสร้างสรรค์
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onSelectModule('safety')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span>เริ่มบทเรียนที่ 1: ความปลอดภัยดิจิทัล</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectModule('codingLab')}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <PlayCircle className="w-4 h-4 text-indigo-600" />
                <span>เข้าสู่ Coding Lab ทันที</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-900/5 aspect-video lg:aspect-auto">
              <img
                src="/src/assets/images/hero_computing_education_1791966913783.jpg"
                alt="การเรียนรู้การเขียนโปรแกรมและการคิดเชิงคำนวณ"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 4 Core Module Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div
            onClick={() => onSelectModule('safety')}
            className="group cursor-pointer p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">โมดูลที่ 1</div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                ความปลอดภัย &amp; มารยาทดิจิทัล
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                การปกป้องข้อมูลส่วนบุคคล (PDPA), รหัสผ่านที่ปลอดภัย, สิทธิในโลกออนไลน์ และการตระหนักรู้เรื่อง Cyberbullying
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">เกมแยกแยะ &amp; แบบทดสอบ</span>
              {moduleProgress.safety ? (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> เรียนแล้ว
                </span>
              ) : (
                <span className="text-indigo-600 font-medium group-hover:underline">เข้าสู่บทเรียน →</span>
              )}
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onSelectModule('thinking')}
            className="group cursor-pointer p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">โมดูลที่ 2</div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                การคิดเป็นลำดับขั้น &amp; อัลกอริทึม
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                4 เสาหลักการคิดเชิงคำนวณ, โครงสร้างควบคุม 3 รูปแบบ (ลำดับ, ทางเลือก, วนซ้ำ) และมินิเกมแก้ปัญหาเขาวงกต
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">อัลกอริทึมพัซเซิล 3 ด่าน</span>
              {moduleProgress.thinking ? (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> เรียนแล้ว
                </span>
              ) : (
                <span className="text-indigo-600 font-medium group-hover:underline">เข้าสู่บทเรียน →</span>
              )}
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onSelectModule('codingLab')}
            className="group cursor-pointer p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">โมดูลที่ 3</div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                ปฏิบัติการ Scratch &amp; Micro:bit
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                สตูดิโอบล็อก Scratch รันบนแคนวาสสด และซิมูเลเตอร์บอร์ด Micro:bit V2 พร้อมไฟ LED 5x5, เซ็นเซอร์ และเสียง
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Interactive Simulator</span>
              {moduleProgress.codingLab ? (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> เรียนแล้ว
                </span>
              ) : (
                <span className="text-indigo-600 font-medium group-hover:underline">เข้าสู่บทเรียน →</span>
              )}
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onSelectModule('showcase')}
            className="group cursor-pointer p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">โมดูลที่ 4</div>
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                แสดงผลงาน &amp; สะท้อนคิด
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                คลังโครงงานนักเรียน, ฟอร์มส่งผลงาน, ระบบให้คำติชมเพื่อน (2 Stars &amp; 1 Wish), สมุดสะท้อนคิด 3-2-1 และรูบริก
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">แกลเลอรี &amp; รูบริก</span>
              {moduleProgress.showcase ? (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> เรียนแล้ว
                </span>
              ) : (
                <span className="text-indigo-600 font-medium group-hover:underline">เข้าสู่บทเรียน →</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
