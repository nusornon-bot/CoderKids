import React, { useState, useEffect } from 'react';
import { ALGORITHM_LEVELS } from '../../data/learningData.ts';
import { Play, RotateCcw, Plus, Trash2, CheckCircle2, AlertTriangle, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AlgorithmPuzzleGameProps {
  onComplete: () => void;
  addPoints: (points: number) => void;
}

type CommandType = 'move' | 'turn_left' | 'turn_right' | 'repeat_2';

interface CommandItem {
  id: string;
  type: CommandType;
  label: string;
  color: string;
}

export const AlgorithmPuzzleGame: React.FC<AlgorithmPuzzleGameProps> = ({ onComplete, addPoints }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [commands, setCommands] = useState<CommandItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null);

  const level = ALGORITHM_LEVELS[currentLevelIdx];

  // Robot runtime state
  const [robotPos, setRobotPos] = useState({ r: level.start.r, c: level.start.c, dir: level.start.dir });
  const [collectedCoins, setCollectedCoins] = useState<{ r: number; c: number }[]>([]);

  // Reset robot position when switching level
  useEffect(() => {
    setRobotPos({ r: level.start.r, c: level.start.c, dir: level.start.dir });
    setCollectedCoins([]);
    setCommands([]);
    setIsRunning(false);
    setActiveStepIdx(null);
    setStatusMessage(null);
  }, [currentLevelIdx]);

  const addCommand = (type: CommandType) => {
    if (isRunning) return;
    const labels: Record<CommandType, { label: string; color: string }> = {
      move: { label: 'เดินหน้า 1 ก้าว', color: 'bg-blue-600' },
      turn_left: { label: 'เลี้ยวซ้าย 90°', color: 'bg-indigo-600' },
      turn_right: { label: 'เลี้ยวขวา 90°', color: 'bg-indigo-600' },
      repeat_2: { label: 'วนซ้ำ (เดินหน้า 2 ก้าว)', color: 'bg-amber-600' },
    };

    setCommands((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type,
        label: labels[type].label,
        color: labels[type].color,
      },
    ]);
  };

  const removeCommand = (index: number) => {
    if (isRunning) return;
    setCommands((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCommands = () => {
    if (isRunning) return;
    setCommands([]);
    setRobotPos({ r: level.start.r, c: level.start.c, dir: level.start.dir });
    setCollectedCoins([]);
    setStatusMessage(null);
  };

  const runAlgorithm = async () => {
    if (isRunning || commands.length === 0) return;

    setIsRunning(true);
    setStatusMessage({ text: 'กำลังรันคำสั่งทีละขั้นตอน...', type: 'info' });

    // Reset to start
    let curR = level.start.r;
    let curC = level.start.c;
    let curDir = level.start.dir;
    let coinsCollectedSoFar: { r: number; c: number }[] = [];

    setRobotPos({ r: curR, c: curC, dir: curDir });
    setCollectedCoins([]);

    const directions: ('up' | 'right' | 'down' | 'left')[] = ['up', 'right', 'down', 'left'];

    const moveForward = (): boolean => {
      let nextR = curR;
      let nextC = curC;
      if (curDir === 'up') nextR -= 1;
      if (curDir === 'down') nextR += 1;
      if (curDir === 'left') nextC -= 1;
      if (curDir === 'right') nextC += 1;

      // Check bounds
      if (nextR < 0 || nextR >= level.gridSize.rows || nextC < 0 || nextC >= level.gridSize.cols) {
        return false;
      }
      // Check obstacles
      const isHitObstacle = level.obstacles.some((obs) => obs.r === nextR && obs.c === nextC);
      if (isHitObstacle) {
        return false;
      }

      curR = nextR;
      curC = nextC;

      // Check coins
      const foundCoin = level.coins.find(
        (cn) => cn.r === curR && cn.c === curC && !coinsCollectedSoFar.some((c) => c.r === cn.r && c.c === cn.c)
      );
      if (foundCoin) {
        coinsCollectedSoFar = [...coinsCollectedSoFar, foundCoin];
        setCollectedCoins([...coinsCollectedSoFar]);
      }

      setRobotPos({ r: curR, c: curC, dir: curDir });
      return true;
    };

    // Flatten commands if repeat
    const flatActions: { type: CommandType; originIndex: number }[] = [];
    commands.forEach((cmd, idx) => {
      if (cmd.type === 'repeat_2') {
        flatActions.push({ type: 'move', originIndex: idx });
        flatActions.push({ type: 'move', originIndex: idx });
      } else {
        flatActions.push({ type: cmd.type, originIndex: idx });
      }
    });

    let failed = false;

    for (let i = 0; i < flatActions.length; i++) {
      const act = flatActions[i];
      setActiveStepIdx(act.originIndex);

      await new Promise((resolve) => setTimeout(resolve, 450));

      if (act.type === 'move') {
        const ok = moveForward();
        if (!ok) {
          failed = true;
          setStatusMessage({
            text: 'ชนสิ่งกีดขวางหรือออกนอกแผนที่! ลองตรวจสอบอัลกอริทึมและแก้ไขบั๊ก (Debug)',
            type: 'error',
          });
          break;
        }
      } else if (act.type === 'turn_left') {
        const currentIdx = directions.indexOf(curDir);
        curDir = directions[(currentIdx + 3) % 4];
        setRobotPos({ r: curR, c: curC, dir: curDir });
      } else if (act.type === 'turn_right') {
        const currentIdx = directions.indexOf(curDir);
        curDir = directions[(currentIdx + 1) % 4];
        setRobotPos({ r: curR, c: curC, dir: curDir });
      }
    }

    setActiveStepIdx(null);
    setIsRunning(false);

    if (!failed) {
      const reachedGoal = curR === level.goal.r && curC === level.goal.c;
      const allCoinsCollected = level.coins.every((cn) =>
        coinsCollectedSoFar.some((c) => c.r === cn.r && c.c === cn.c)
      );

      if (reachedGoal && allCoinsCollected) {
        setStatusMessage({
          text: `ยอดเยี่ยมมาก! คุณผ่าน ${level.title} และเก็บพลังงานได้ครบถ้วน!`,
          type: 'success',
        });

        if (!completedLevels.includes(level.id)) {
          setCompletedLevels((prev) => [...prev, level.id]);
          addPoints(25);
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          if (completedLevels.length + 1 >= ALGORITHM_LEVELS.length) {
            onComplete();
          }
        }
      } else if (reachedGoal && !allCoinsCollected) {
        setStatusMessage({
          text: 'ถึงจุดหมายแล้ว แต่ยังเก็บพลังงานเหรียญไม่ครบ ลองวางแผนเส้นทางใหม่!',
          type: 'error',
        });
      } else {
        setStatusMessage({
          text: 'ยังไม่ถึงจุดหมายปลายทาง ลองเพิ่มคำสั่งให้หุ่นยนต์เดินต่อนะครับ',
          type: 'error',
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">มินิเกมฝึกออกแบบอัลกอริทึม</span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            หุ่นยนต์แก้ปัญหาเขาวงกต (Algorithm Maze Challenge)
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            นำหลักการลำดับขั้นตอน เงื่อนไข และการวนซ้ำมาวางบล็อกคำสั่งสั่งการให้หุ่นยนต์เดินถึงเป้าหมาย
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-2">
          {ALGORITHM_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              onClick={() => setCurrentLevelIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentLevelIdx === idx
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ด่าน {lvl.id} {completedLevels.includes(lvl.id) && '✓'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Grid Map Stage */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-slate-800">{level.title}</span>
            <div className="flex items-center gap-3 text-slate-500">
              <span>เหรียญพลังงาน: {collectedCoins.length}/{level.coins.length}</span>
              <span>ขนาด: {level.gridSize.rows}x{level.gridSize.cols}</span>
            </div>
          </div>

          {/* Grid Box */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner inline-block">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${level.gridSize.cols}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: level.gridSize.rows }).map((_, r) =>
                Array.from({ length: level.gridSize.cols }).map((_, c) => {
                  const isRobot = robotPos.r === r && robotPos.c === c;
                  const isGoal = level.goal.r === r && level.goal.c === c;
                  const isObstacle = level.obstacles.some((o) => o.r === r && o.c === c);
                  const isCoin =
                    level.coins.some((coin) => coin.r === r && coin.c === c) &&
                    !collectedCoins.some((col) => col.r === r && col.c === c);

                  let rotationDeg = 0;
                  if (robotPos.dir === 'right') rotationDeg = 90;
                  if (robotPos.dir === 'down') rotationDeg = 180;
                  if (robotPos.dir === 'left') rotationDeg = 270;

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center relative transition-all duration-300 ${
                        isObstacle
                          ? 'bg-slate-800 border border-slate-700 text-rose-400'
                          : isGoal
                          ? 'bg-emerald-950/80 border-2 border-emerald-500'
                          : 'bg-slate-800/50 border border-slate-800 text-slate-500'
                      }`}
                    >
                      {/* Obstacle */}
                      {isObstacle && <span className="text-xl">🧱</span>}

                      {/* Goal Flag */}
                      {isGoal && !isRobot && (
                        <div className="text-center">
                          <span className="text-xl">🏁</span>
                        </div>
                      )}

                      {/* Energy Coin */}
                      {isCoin && !isRobot && (
                        <div className="animate-bounce text-amber-400 text-lg">⭐</div>
                      )}

                      {/* Robot */}
                      {isRobot && (
                        <div
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-lg transition-transform duration-300"
                          style={{ transform: `rotate(${rotationDeg}deg)` }}
                        >
                          ▲
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Hint callout */}
          <div className="mt-4 w-full p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">คำใบ้แนวคิด: </span>
              <span>{level.hint}</span>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`mt-3 w-full p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Right: Code Block Palette & Sequence Program */}
        <div className="lg:col-span-5 space-y-5">
          {/* Action Palette */}
          <div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1. เลือกบล็อกคำสั่ง (Command Palette)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={isRunning}
                onClick={() => addCommand('move')}
                className="p-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-between transition-colors shadow-sm disabled:opacity-50"
              >
                <span>เดินหน้า 1 ก้าว</span>
                <Plus className="w-3.5 h-3.5" />
              </button>

              <button
                disabled={isRunning}
                onClick={() => addCommand('turn_left')}
                className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center justify-between transition-colors shadow-sm disabled:opacity-50"
              >
                <span>เลี้ยวซ้าย 90°</span>
                <Plus className="w-3.5 h-3.5" />
              </button>

              <button
                disabled={isRunning}
                onClick={() => addCommand('turn_right')}
                className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center justify-between transition-colors shadow-sm disabled:opacity-50"
              >
                <span>เลี้ยวขวา 90°</span>
                <Plus className="w-3.5 h-3.5" />
              </button>

              <button
                disabled={isRunning}
                onClick={() => addCommand('repeat_2')}
                className="p-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium flex items-center justify-between transition-colors shadow-sm disabled:opacity-50"
              >
                <span>วนซ้ำ (เดิน 2 ก้าว)</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Program Sequence */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              <span>2. ลำดับคำสั่งโปรแกรม ({commands.length} คำสั่ง)</span>
              {commands.length > 0 && (
                <button
                  disabled={isRunning}
                  onClick={clearCommands}
                  className="text-slate-400 hover:text-rose-600 text-[11px] normal-case"
                >
                  ล้างทั้งหมด
                </button>
              )}
            </div>

            <div className="min-h-[170px] max-h-[220px] overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              {commands.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <span>ยังไม่มีคำสั่ง</span>
                  <span className="text-[11px] text-slate-400 mt-1">คลิกปุ่มด้านบนเพื่อเพิ่มคำสั่งในอัลกอริทึม</span>
                </div>
              ) : (
                commands.map((cmd, idx) => {
                  const isActive = activeStepIdx === idx;
                  return (
                    <div
                      key={cmd.id}
                      className={`flex items-center justify-between p-2 rounded-lg text-white text-xs font-mono transition-all ${cmd.color} ${
                        isActive ? 'ring-2 ring-white scale-[1.02] shadow-md' : 'opacity-90'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-black/20 text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{cmd.label}</span>
                      </div>
                      <button
                        disabled={isRunning}
                        onClick={() => removeCommand(idx)}
                        className="text-white/60 hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Control Run Button */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={runAlgorithm}
              disabled={isRunning || commands.length === 0}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-sm transition-all ${
                isRunning || commands.length === 0
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'กำลังทำงานตามขั้นตอน...' : 'รันอัลกอริทึม (Run Code)'}</span>
            </button>

            <button
              onClick={() => {
                setRobotPos({ r: level.start.r, c: level.start.c, dir: level.start.dir });
                setCollectedCoins([]);
                setStatusMessage(null);
              }}
              disabled={isRunning}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="รีเซ็ตตำแหน่งหุ่นยนต์"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
