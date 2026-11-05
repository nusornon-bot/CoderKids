import React, { useState, useEffect } from 'react';
import {
  Zap,
  Trophy,
  Users,
  Timer,
  Play,
  RotateCcw,
  Sparkles,
  X,
  Tv,
  CheckCircle2,
  XCircle,
  Flame,
  ArrowRight,
  Shield,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AudioReaderButton } from './AudioReaderButton.tsx';

interface ClassroomBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  addPoints: (amount: number, reason: string, category: 'thinking') => void;
  onCelebrate: (type: 'badge' | 'module_completed' | 'points_milestone' | 'quiz_perfect', title: string, desc: string, icon: string) => void;
}

interface BugQuestion {
  id: number;
  title: string;
  codeSnippet: string;
  language: 'Scratch Block' | 'Python' | 'Micro:bit' | 'JavaScript';
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const ClassroomBattleModal: React.FC<ClassroomBattleModalProps> = ({
  isOpen,
  onClose,
  studentName,
  addPoints,
  onCelebrate,
}) => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'roundResult' | 'podium'>('lobby');
  const [gamePin, setGamePin] = useState<string>('849201');
  const [playerNickname, setPlayerNickname] = useState<string>(studentName || 'น้องโค้ดเดอร์');
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);

  // Simulated peer competitors
  const [leaderboard, setLeaderboard] = useState<Array<{ name: string; score: number; streak: number }>>([
    { name: 'ต้นกล้า (ป.5/1)', score: 380, streak: 3 },
    { name: 'ฟ้าใส (ป.5/2)', score: 320, streak: 2 },
    { name: 'ภูริ (ป.6/1)', score: 290, streak: 1 },
    { name: 'มีนา (ป.4/3)', score: 250, streak: 2 },
  ]);

  const questions: BugQuestion[] = [
    {
      id: 1,
      title: 'ข้อที่ 1: ตรวจจับจุดผิดในภาษา Python!',
      language: 'Python',
      codeSnippet: 'score = 85\nif score >= 80\n    print("ได้เกรด 4 เก่งมาก!")',
      options: [
        'บรรทัดที่ 2 ขาดเครื่องหมายโคลอน (:) หลังเงื่อนไข if',
        'ตัวแปร score ต้องเขียนด้วยตัวพิมพ์ใหญ่เท่านั้น',
        'คำสั่ง print() ใช้เครื่องหมายฟันหนูไม่ได้',
        'โค้ดถูกต้องแล้ว ไม่มีจุดผิด',
      ],
      correctIndex: 0,
      explanation: 'ในไวยากรณ์ภาษา Python ทุกประโยคเงื่อนไข if ต้องปิดท้ายด้วยเครื่องหมายโคลอน (:) เสมอ เช่น if score >= 80:',
    },
    {
      id: 2,
      title: 'ข้อที่ 2: แมว Scratch วาดรูปแต่เส้นไม่ขึ้น!',
      language: 'Scratch Block',
      codeSnippet: '[เมื่อธงเขียวถูกคลิก]\n[ลบทั้งหมด]\n[เคลื่อนที่ 100 ก้าว]\n[จรดปากกา (Pen Down)]',
      options: [
        'ต้องเอาบล็อก [จรดปากกา] มาวางก่อนบล็อก [เคลื่อนที่ 100 ก้าว]',
        'ต้องเปลี่ยนจำนวนก้าวเป็น 500 ก้าว',
        'แมว Scratch ไม่สามารถวาดรูปได้',
        'ต้องลบบล็อก [ลบทั้งหมด] ออก',
      ],
      correctIndex: 0,
      explanation: 'การวาดรูปด้วยคำสั่ง Pen ต้องจรดปากกาลงบนกระดาษก่อน (Pen Down) แล้วจึงสั่งให้ตัวละครเคลื่อนที่ จึงจะเกิดรอยเส้น',
    },
    {
      id: 3,
      title: 'ข้อที่ 3: Micro:bit ไฟกะพริบไม่ยอมหยุด!',
      language: 'Micro:bit',
      codeSnippet: 'forever {\n  basic.showIcon(IconNames.Heart)\n  basic.pause(1000)\n  // ไฟหัวใจค้าง ไม่ดับเลย\n}',
      options: [
        'ต้องเพิ่มคำสั่ง basic.clearScreen() เพื่อดับไฟก่อนรอบถัดไป',
        'ต้องเปลี่ยนบอร์ดเป็น Arduino',
        'ห้ามใส่คำสั่ง pause ในลูป forever',
        'ต้องเขย่าบอร์ด 3 ครั้งเพื่อรีเซ็ต',
      ],
      correctIndex: 0,
      explanation: 'เมื่อแสดงรูปไอคอนหัวใจแล้ว หากไม่สั่งเคลียร์หน้าจอ (clearScreen) หรือสลับไอคอน หลอด LED จะยังคงติดค้างอยู่ตลอดเวลา',
    },
    {
      id: 4,
      title: 'ข้อที่ 4: ลูปนับเลขใน JavaScript ขาดไป 1 รอบ!',
      language: 'JavaScript',
      codeSnippet: 'for (let i = 1; i < 5; i++) {\n  console.log("รอบที่ " + i);\n}',
      options: [
        'เงื่อนไข i < 5 จะหยุดที่ 4 ต้องเปลี่ยนเป็น i <= 5 จึงจะครบ 5 รอบ',
        'ต้องเริ่มต้นที่ let i = 10',
        'ต้องเปลี่ยนเครื่องหมาย ++ เป็น --',
        'คำสั่ง console.log() ใช้ไม่ได้ในลูป',
      ],
      correctIndex: 0,
      explanation: 'เงื่อนไข i < 5 จะทำให้ลูปทำงานเมื่อ i = 1, 2, 3, 4 (รวม 4 รอบ) ถ้าต้องการ 5 รอบต้องใช้ i <= 5 (Off-by-one bug)',
    },
    {
      id: 5,
      title: 'ข้อที่ 5: บั๊กตัวแปรลึกลับ (Undefined Variable)!',
      language: 'Python',
      codeSnippet: 'total_coins = points + 50\npoints = 100',
      options: [
        'มีการเรียกใช้ตัวแปร points ก่อนที่จะกำหนดค่าบรรทัดถัดไป',
        'เครื่องหมายบวก (+) บวกตัวเลขไม่ได้',
        'ห้ามตั้งชื่อตัวแปรว่า total_coins',
        'โปรแกรมจะทำงานได้ปกติโดยเดาค่าให้เป็น 0',
      ],
      correctIndex: 0,
      explanation: 'คอมพิวเตอร์ทำงานตามลำดับจากบนลงล่าง การเรียกใช้ตัวแปรก่อนการประกาศ (Declaration) จะทำให้เกิดข้อผิดพลาด NameError: name is not defined',
    },
  ];

  // Timer effect during playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0 && !isAnswerSubmitted) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (gameState === 'playing' && timeLeft === 0 && !isAnswerSubmitted) {
      handleAnswerOption(-1); // Timeout
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft, isAnswerSubmitted]);

  if (!isOpen) return null;

  const currentQ = questions[currentRound];

  const handleStartGame = () => {
    setGameState('playing');
    setCurrentRound(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setIsAnswerSubmitted(false);
    setSelectedOption(null);
  };

  const handleAnswerOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQ.correctIndex;
    let roundPoints = 0;

    if (isCorrect) {
      const timeBonus = Math.max(5, timeLeft * 2);
      const newStreak = streak + 1;
      const multiplier = newStreak >= 3 ? 2 : newStreak >= 2 ? 1.5 : 1;
      roundPoints = Math.round((50 + timeBonus) * multiplier);

      setScore((prev) => prev + roundPoints);
      setStreak(newStreak);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      setStreak(0);
    }

    // Update simulated leaderboard
    setTimeout(() => {
      setGameState('roundResult');
    }, 1200);
  };

  const handleNextRound = () => {
    if (currentRound < questions.length - 1) {
      setCurrentRound((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(15);
      setGameState('playing');
    } else {
      // Game Over -> Podium
      setGameState('podium');
      const earnedXP = Math.round(score / 5);
      addPoints(earnedXP, `ประลองสดใน Live Classroom Battle (คะแนน ${score} pts)`, 'thinking');
      onCelebrate('points_milestone', 'ผู้ชนะสังเวียนประลองโค้ด!', `คุณทำคะแนนได้ ${score} แต้ม พร้อมรับ +${earnedXP} XP`, '🏆');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className={`bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl transition-all duration-300 w-full ${
          isProjectorMode ? 'max-w-6xl min-h-[85vh] p-8' : 'max-w-3xl p-6 sm:p-8'
        }`}
      >
        {/* Top Bar Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏁</span>
            <div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                Live Classroom Coding Battle
              </div>
              <h3 className="text-base sm:text-lg font-bold">ห้องประลองโค้ดดิ้งและแก้บักสด</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProjectorMode(!isProjectorMode)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 text-xs"
              title="สลับโหมดจอโปรเจกเตอร์สำหรับครู"
            >
              <Tv className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">{isProjectorMode ? 'ขนาดย่อ' : 'ฉายโปรเจกเตอร์'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ---------------- 1. STATE: LOBBY ---------------- */}
        {gameState === 'lobby' && (
          <div className="text-center py-8 space-y-6 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-10 h-10 text-white" />
            </div>

            <div>
              <div className="text-xs text-slate-400 mb-1">รหัสเข้าร่วมห้องเรียน (Game PIN)</div>
              <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-widest font-mono bg-slate-800/80 py-3 px-6 rounded-2xl border border-slate-700 inline-block">
                {gamePin}
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-xs text-slate-400 font-medium">ชื่อเล่นผู้แข่งขัน:</label>
              <input
                type="text"
                value={playerNickname}
                onChange={(e) => setPlayerNickname(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed text-left">
              🎮 <strong>กติกาการแข่งขัน:</strong> มีทั้งหมด 5 ข้อ แต่ละข้อมีเวลา 15 วินาที ยิ่งตอบเร็วและตอบถูกต่อเนื่อง (Streak) จะได้รับตัวคูณคะแนนพิเศษ!
            </div>

            <button
              onClick={handleStartGame}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              เริ่มการแข่งขันสด (Start Battle)
            </button>
          </div>
        )}

        {/* ---------------- 2. STATE: PLAYING ---------------- */}
        {gameState === 'playing' && (
          <div className="space-y-6">
            {/* Header Status Bar */}
            <div className="flex items-center justify-between bg-slate-800/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300">
                  รอบที่ {currentRound + 1} / {questions.length}
                </span>
                {streak > 1 && (
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
                    Streak x{streak}
                  </span>
                )}
              </div>

              {/* Countdown Timer */}
              <div
                className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold ${
                  timeLeft <= 5 ? 'bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/30' : 'bg-slate-800 text-slate-200'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{timeLeft} วินาที</span>
              </div>

              <div className="text-sm font-black text-emerald-400">{score} PTS</div>
            </div>

            {/* Question Info & Audio */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                {currentQ.language}
              </span>
              <AudioReaderButton textToRead={`${currentQ.title} โค้ดมีข้อผิดพลาดอะไร`} size="sm" />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white">{currentQ.title}</h2>

            {/* Code Snippet Box */}
            <div className="bg-black/60 rounded-2xl p-5 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed overflow-x-auto shadow-inner">
              <pre>{currentQ.codeSnippet}</pre>
            </div>

            {/* Choices Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleAnswerOption(idx)}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 font-mono text-xs">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- 3. STATE: ROUND RESULT ---------------- */}
        {gameState === 'roundResult' && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              {selectedOption === currentQ.correctIndex ? (
                <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-lg bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                  ตอบถูกต้อง! ยอดเยี่ยมมาก
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-rose-400 font-bold text-lg bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/20">
                  <XCircle className="w-5 h-5" />
                  ตอบผิด ไม่เป็นไร ลองดูคำอธิบายนะ!
                </div>
              )}
            </div>

            {/* Explanation */}
            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-400">💡 เฉลยและข้อคิด: </span>
              {currentQ.explanation}
            </div>

            <button
              onClick={handleNextRound}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{currentRound < questions.length - 1 ? 'ไปข้อถัดไป' : 'ดูสรุปผลการแข่งขัน'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ---------------- 4. STATE: PODIUM & FINAL LEADERBOARD ---------------- */}
        {gameState === 'podium' && (
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-full bg-amber-400/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-400/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">สิ้นสุดการประลองสด!</h2>
              <p className="text-xs text-slate-400 mt-1">
                ขอแสดงความยินดีกับ {playerNickname} คุณทำคะแนนได้ {score} คะแนน!
              </p>
            </div>

            {/* Simulated Live Podium */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 max-w-md mx-auto text-left space-y-3">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                🏆 ตารางคะแนนรวมในห้องเรียน (Classroom Leaderboard)
              </div>

              {[
                { rank: 1, name: `${playerNickname} (คุณ)`, score: score + 120, isYou: true },
                { rank: 2, name: 'ต้นกล้า (ป.5/1)', score: 380, isYou: false },
                { rank: 3, name: 'ฟ้าใส (ป.5/2)', score: 320, isYou: false },
                { rank: 4, name: 'ภูริ (ป.6/1)', score: 290, isYou: false },
              ].map((user) => (
                <div
                  key={user.rank}
                  className={`p-3 rounded-xl flex items-center justify-between text-xs font-semibold ${
                    user.isYou
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                      {user.rank}
                    </span>
                    <span>{user.name}</span>
                  </div>
                  <span className="font-mono text-emerald-400">{user.score} pts</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 max-w-md mx-auto">
              <button
                onClick={handleStartGame}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                ประลองใหม่อีกรอบ
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                เสร็จสิ้นและรับรางวัล
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
