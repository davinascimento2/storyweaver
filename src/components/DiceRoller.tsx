import React, { useState, useEffect } from 'react';
import { Dices, CheckCircle2, XCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface DiceRollerProps {
  statName: string;
  statValue: number;
  difficulty: number;
  onComplete: (passed: boolean, totalRoll: number) => void;
  onCancel: () => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  statName,
  statValue,
  difficulty,
  onComplete,
  onCancel,
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [dieResult, setDieResult] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<'success' | 'failure' | null>(null);

  const modifier = Math.floor((statValue - 10) / 2);

  const performRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    sound.playDiceRoll();

    let rollCounter = 0;
    const interval = setInterval(() => {
      setDieResult(Math.floor(Math.random() * 20) + 1);
      rollCounter++;
      if (rollCounter >= 10) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        const finalTotal = finalRoll + modifier;
        setDieResult(finalRoll);
        setTotal(finalTotal);
        setIsRolling(false);

        const passed = finalTotal >= difficulty;
        setOutcome(passed ? 'success' : 'failure');
        if (passed) {
          sound.playSuccess();
        } else {
          sound.playFailure();
        }

        setTimeout(() => {
          onComplete(passed, finalTotal);
        }, 1600);
      }
    }, 60);
  };

  useEffect(() => {
    // Auto start roll on mount
    performRoll();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#120d24] border border-purple-800/60 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-purple-950/80 text-center relative overflow-hidden">
        {/* Arcane glow effects */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-center gap-2 mb-2 text-purple-300 font-mono text-xs uppercase tracking-wider">
          <Dices className="w-4 h-4" />
          <span>D20 Skill Check</span>
        </div>

        <h3 className="text-xl font-serif font-bold text-white mb-1">
          {statName.toUpperCase()} Challenge
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Required Difficulty Class (DC): <span className="text-cyan-400 font-bold font-mono">{difficulty}</span>
        </p>

        {/* Die Display */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div
            onClick={!isRolling && outcome === null ? performRoll : undefined}
            className={`w-28 h-28 rounded-2xl flex items-center justify-center text-4xl font-mono font-black transition-all border-2 ${
              isRolling
                ? 'bg-purple-900/40 border-purple-500/80 text-purple-200 animate-spin'
                : outcome === 'success'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-900/40 scale-105'
                : outcome === 'failure'
                ? 'bg-rose-950/60 border-rose-500 text-rose-400 shadow-lg shadow-rose-900/40 scale-105'
                : 'bg-indigo-950/60 border-indigo-500/60 text-white cursor-pointer hover:border-purple-400'
            }`}
          >
            {dieResult ?? '?'}
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs font-mono text-slate-300">
            <span>Roll: <strong className="text-purple-300">{dieResult ?? '-'}</strong></span>
            <span>+</span>
            <span>Mod: <strong className="text-cyan-300">{modifier >= 0 ? `+${modifier}` : modifier}</strong></span>
            <span>=</span>
            <span>Total: <strong className="text-yellow-400 text-sm">{total ?? '-'}</strong></span>
          </div>
        </div>

        {/* Outcome result banner */}
        {outcome && (
          <div
            className={`mt-4 p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold tracking-wide animate-fade-in ${
              outcome === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
            }`}
          >
            {outcome === 'success' ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>SUCCESS! (DC {difficulty} MET)</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>CHECK FAILED</span>
              </>
            )}
          </div>
        )}

        {/* Cancel button if needed */}
        {!isRolling && outcome === null && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel Action
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
