import React, { useState } from 'react';
import { RUBRIC_CRITERIA } from '../../data/learningData.ts';
import { ReflectionEntry, RubricScore } from '../../types/index.ts';
import { BookOpen, CheckCircle2, Award, Printer, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReflectionJournalProps {
  onComplete: () => void;
  addPoints: (points: number) => void;
  onOpenCertificate: () => void;
}

export const ReflectionJournal: React.FC<ReflectionJournalProps> = ({
  onComplete,
  addPoints,
  onOpenCertificate,
}) => {
  // 3-2-1 Reflection fields
  const [learning1, setLearning1] = useState('การแยกแยะข้อมูลส่วนบุคคลตามกฎหมาย PDPA และการตั้งรหัสผ่านที่ซับซ้อน');
  const [learning2, setLearning2] = useState('การเขียนอัลกอริทึมแก้ปัญหาด้วยโครงสร้าง 3 แบบ: ลำดับ เงื่อนไข และการวนซ้ำ');
  const [learning3, setLearning3] = useState('การเชื่อมต่อเซ็นเซอร์วัดอุณหภูมิและการแสดงผลไฟ LED บน Micro:bit');
  const [challenge1, setChallenge1] = useState('การเขียนลูปให้หุ่นยนต์เดินเลี้ยวหลบสิ่งกีดขวางในเขาวงกตโดยไม่ชนกำแพง');
  const [challenge2, setChallenge2] = useState('การตั้งค่าองศาการหมุนของตัวละครแมว Scratch เพื่อให้วาดรูปดาวได้พอดี 360 องศา');
  const [futureIdea, setFutureIdea] = useState('อยากสร้างโครงงานเครื่องให้อาหารสัตว์เลี้ยงอัตโนมัติที่สั่งงานผ่านอินเทอร์เน็ตได้');
  const [studentName, setStudentName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Rubric Scores (1 to 4)
  const [rubricScores, setRubricScores] = useState<RubricScore>({
    digitalSafety: 4,
    algorithmicThinking: 4,
    codingProficiency: 3,
    collaboration: 4,
  });

  const handleScoreChange = (key: keyof RubricScore, score: number) => {
    setRubricScores((prev) => ({
      ...prev,
      [key]: score,
    }));
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    addPoints(25);
    onComplete();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const totalRubricScore =
    rubricScores.digitalSafety +
    rubricScores.algorithmicThinking +
    rubricScores.codingProficiency +
    rubricScores.collaboration;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-10">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">สะท้อนผลการเรียนรู้</span>
        <h3 className="text-xl font-bold text-slate-900 mt-0.5">
          สมุดสะท้อนคิดการเรียนรู้ (3-2-1 Reflection Journal) &amp; แบบประเมินตนเอง
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          กระบวนการสรุปความคิด ทบทวนสิ่งที่ได้เรียนรู้ และประเมินสมรรถนะตามตัวชี้วัดวิทยาการคำนวณ
        </p>
      </div>

      {/* Section 1: 3-2-1 Reflection Form */}
      <div>
        <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>แบบบันทึกสะท้อนคิด 3-2-1 (Reflection Framework)</span>
        </h4>

        <form onSubmit={handleSaveJournal} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">ชื่อ-นามสกุล ผู้เรียน *</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="เช่น ด.ญ. อารียา รักษ์เรียน"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">โรงเรียน / สถาบันการศึกษา</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="เช่น โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* 3 Things Learned */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-indigo-900">
              🌟 3 สิ่งสำคัญที่ฉันได้เรียนรู้ใหม่ในบทเรียนนี้:
            </div>
            <input
              type="text"
              required
              value={learning1}
              onChange={(e) => setLearning1(e.target.value)}
              placeholder="1. สิ่งที่ได้เรียนรู้ข้อที่หนึ่ง..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              required
              value={learning2}
              onChange={(e) => setLearning2(e.target.value)}
              placeholder="2. สิ่งที่ได้เรียนรู้ข้อที่สอง..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              required
              value={learning3}
              onChange={(e) => setLearning3(e.target.value)}
              placeholder="3. สิ่งที่ได้เรียนรู้ข้อที่สาม..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
            />
          </div>

          {/* 2 Challenges */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div className="text-xs font-bold text-amber-900">
              🧗 2 สิ่งที่ฉันรู้สึกว่าท้าทาย หรือข้อผิดพลาด (Bug) ที่ฉันหาทางแก้ได้:
            </div>
            <input
              type="text"
              required
              value={challenge1}
              onChange={(e) => setChallenge1(e.target.value)}
              placeholder="1. ความท้าทายหรือบั๊กที่พบและการแก้ไข..."
              className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg"
            />
            <input
              type="text"
              required
              value={challenge2}
              onChange={(e) => setChallenge2(e.target.value)}
              placeholder="2. ความท้าทายหรือบั๊กที่สอง..."
              className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg"
            />
          </div>

          {/* 1 Future Idea */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <div className="text-xs font-bold text-emerald-900">
              🚀 1 ไอเดียหรือคำถามที่ฉันอยากนำความรู้นี้ไปต่อยอดสร้างสรรค์:
            </div>
            <textarea
              rows={2}
              required
              value={futureIdea}
              onChange={(e) => setFutureIdea(e.target.value)}
              placeholder="ไอเดียโครงงานที่อยากทำต่อในอนาคต..."
              className="w-full px-3 py-2 text-xs bg-white border border-emerald-300 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaved ? 'บันทึกสะท้อนคิดเรียบร้อยแล้ว' : 'บันทึกการสะท้อนคิด (+25 แต้ม)'}</span>
            </button>

            {isSaved && (
              <button
                type="button"
                onClick={onOpenCertificate}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors"
              >
                <Award className="w-4 h-4" />
                <span>ไปรับเกียรติบัตร</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Section 2: Rubric Assessment Matrix */}
      <div className="pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              เกณฑ์การประเมินตนเองตามมาตรฐานรูบริก (Self-Assessment Rubric)
            </h4>
            <p className="text-xs text-slate-500">
              ประเมินสมรรถนะการเรียนรู้ 4 ระดับ (4 = ดีเยี่ยม, 3 = ดี, 2 = พอใช้, 1 = ปรับปรุง)
            </p>
          </div>

          <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-semibold text-indigo-800">
            คะแนนรูบริกรวม: <span className="text-sm font-bold tabular-nums">{totalRubricScore}</span> / 16 คะแนน
          </div>
        </div>

        <div className="space-y-4">
          {RUBRIC_CRITERIA.map((criterion) => {
            const currentScore = rubricScores[criterion.key as keyof RubricScore];
            return (
              <div key={criterion.key} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{criterion.title}</span>
                  <div className="flex items-center gap-1">
                    {[4, 3, 2, 1].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => handleScoreChange(criterion.key as keyof RubricScore, lvl)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          currentScore === lvl
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-semibold text-indigo-700">คำอธิบายระดับ {currentScore}: </span>
                  <span>{criterion.descriptions[4 - currentScore]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
