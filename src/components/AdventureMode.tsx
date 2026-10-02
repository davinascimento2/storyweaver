import React, { useState } from 'react';
import { StoryBook, PlayerCharacter, StoryChoice } from '../types';
import { Heart, Zap, Brain, Sparkles, RotateCcw, Backpack, Trophy, Skull, Shield } from 'lucide-react';
import { DiceRoller } from './DiceRoller';
import { sound } from '../utils/audio';

interface AdventureModeProps {
  story: StoryBook;
  character: PlayerCharacter;
  setCharacter: React.Dispatch<React.SetStateAction<PlayerCharacter>>;
}

export const AdventureMode: React.FC<AdventureModeProps> = ({
  story,
  character,
  setCharacter
}) => {
  const [currentSceneId, setCurrentSceneId] = useState<string>(story.initialSceneId);
  const [history, setHistory] = useState<string[]>([story.initialSceneId]);
  const [activeCheck, setActiveCheck] = useState<{
    choice: StoryChoice;
    statName: 'strength' | 'agility' | 'intellect' | 'charisma';
    statValue: number;
    difficulty: number;
  } | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const currentScene = story.scenes[currentSceneId] || story.scenes[story.initialSceneId];

  const handleChoiceSelect = (choice: StoryChoice) => {
    sound.playClick();

    // Check if choice has skill check requirement
    if (choice.requirement?.stat && choice.requirement?.difficulty) {
      const statKey = choice.requirement.stat;
      const statVal = character.stats[statKey];
      setActiveCheck({
        choice,
        statName: statKey,
        statValue: statVal,
        difficulty: choice.requirement.difficulty
      });
      return;
    }

    applyChoiceTransition(choice);
  };

  const applyChoiceTransition = (choice: StoryChoice) => {
    sound.playPageTurn();

    // Apply energy cost
    if (choice.requirement?.energyCost) {
      setCharacter(prev => ({
        ...prev,
        energy: Math.max(0, prev.energy - (choice.requirement?.energyCost || 0))
      }));
    }

    // Apply consequences
    if (choice.consequence) {
      if (choice.consequence.hpDelta) {
        setCharacter(prev => ({
          ...prev,
          hp: Math.min(prev.maxHp, Math.max(0, prev.hp + choice.consequence!.hpDelta!))
        }));
      }
      if (choice.consequence.energyDelta) {
        setCharacter(prev => ({
          ...prev,
          energy: Math.min(prev.maxEnergy, Math.max(0, prev.energy + choice.consequence!.energyDelta!))
        }));
      }
      if (choice.consequence.customMessage) {
        setNotification(choice.consequence.customMessage);
        setTimeout(() => setNotification(null), 4000);
      }
    }

    // Move to next scene
    setCurrentSceneId(choice.targetSceneId);
    setHistory(prev => [...prev, choice.targetSceneId]);
  };

  const handleDiceComplete = (passed: boolean) => {
    if (!activeCheck) return;
    const choice = activeCheck.choice;
    setActiveCheck(null);

    if (passed) {
      applyChoiceTransition(choice);
    } else {
      // Failed check consequence: deduct HP / energy and show feedback
      sound.playFailure();
      setCharacter(prev => ({
        ...prev,
        hp: Math.max(10, prev.hp - 15),
        sanity: Math.max(10, prev.sanity - 10)
      }));
      setNotification(`Failed check! Lost 15 HP and 10 Sanity.`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const restartAdventure = () => {
    sound.playClick();
    setCurrentSceneId(story.initialSceneId);
    setHistory([story.initialSceneId]);
    setCharacter(story.defaultCharacter);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left / Top: Character HUD */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#120e24] border border-purple-900/50 rounded-2xl p-5 shadow-xl shadow-purple-950/40 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={character.avatar}
              alt={character.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-purple-500/60 shadow-md shadow-purple-900/50"
            />
            <div>
              <h3 className="font-serif font-bold text-white text-base leading-tight">
                {character.name}
              </h3>
              <p className="text-xs text-purple-400 font-mono mt-0.5">{character.title}</p>
              <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950 text-cyan-300 border border-purple-800/60">
                {character.archetype}
              </span>
            </div>
          </div>

          {/* Core Bars */}
          <div className="space-y-3 font-mono text-xs">
            {/* HP */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1 text-rose-400 font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500/30" /> Vitality (HP)
                </span>
                <span>{character.hp}/{character.maxHp}</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-rose-900/40">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-red-400 transition-all duration-300"
                  style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
                />
              </div>
            </div>

            {/* Energy */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                  <Zap className="w-3.5 h-3.5 fill-cyan-500/30" /> Energy / Mana
                </span>
                <span>{character.energy}/{character.maxEnergy}</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/40">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 transition-all duration-300"
                  style={{ width: `${(character.energy / character.maxEnergy) * 100}%` }}
                />
              </div>
            </div>

            {/* Sanity */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="flex items-center gap-1 text-purple-400 font-semibold">
                  <Brain className="w-3.5 h-3.5 fill-purple-500/30" /> Sanity / Will
                </span>
                <span>{character.sanity}/{character.maxSanity}</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-purple-900/40">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-400 transition-all duration-300"
                  style={{ width: `${(character.sanity / character.maxSanity) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats Matrix */}
          <div className="mt-5 pt-4 border-t border-purple-900/40 grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-[#191433] p-2 rounded-lg border border-purple-900/30 flex justify-between items-center">
              <span className="text-slate-400">Strength:</span>
              <span className="text-amber-400 font-bold">{character.stats.strength}</span>
            </div>
            <div className="bg-[#191433] p-2 rounded-lg border border-purple-900/30 flex justify-between items-center">
              <span className="text-slate-400">Agility:</span>
              <span className="text-emerald-400 font-bold">{character.stats.agility}</span>
            </div>
            <div className="bg-[#191433] p-2 rounded-lg border border-purple-900/30 flex justify-between items-center">
              <span className="text-slate-400">Intellect:</span>
              <span className="text-cyan-400 font-bold">{character.stats.intellect}</span>
            </div>
            <div className="bg-[#191433] p-2 rounded-lg border border-purple-900/30 flex justify-between items-center">
              <span className="text-slate-400">Charisma:</span>
              <span className="text-pink-400 font-bold">{character.stats.charisma}</span>
            </div>
          </div>

          {/* Inventory */}
          <div className="mt-5 pt-4 border-t border-purple-900/40">
            <div className="flex items-center gap-1.5 text-xs font-mono text-purple-300 mb-2">
              <Backpack className="w-3.5 h-3.5" />
              <span>Inventory & Gear ({character.inventory.length})</span>
            </div>
            <div className="space-y-1.5">
              {character.inventory.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#191433]/80 border border-purple-900/40 rounded-lg p-2 text-xs flex items-start justify-between gap-2"
                >
                  <div>
                    <p className="font-semibold text-slate-200">{item.name}</p>
                    <p className="text-[11px] text-slate-400 leading-tight">{item.description}</p>
                  </div>
                  <span className="font-mono text-purple-400 font-bold text-[11px]">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Breadcrumbs / Scene Counter */}
        <div className="bg-[#120e24] border border-purple-900/40 rounded-2xl p-4 text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>Decisions Made: <strong className="text-purple-300">{history.length - 1}</strong></span>
          <button
            onClick={restartAdventure}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Right: Narrative Reader & Choices */}
      <div className="lg:col-span-8 space-y-6">
        {notification && (
          <div className="bg-purple-950/80 border border-purple-500/60 rounded-xl p-3 text-purple-200 text-xs font-mono flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Narrative Card */}
        <div className="bg-[#120e24]/90 border border-purple-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Chapter header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-purple-900/40 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400">
                {currentScene.chapter}
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-1">
                {currentScene.title}
              </h2>
            </div>
            {currentScene.isEnding && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-500/40">
                {currentScene.endingType === 'victory' ? (
                  <Trophy className="w-5 h-5 text-amber-400" />
                ) : (
                  <Skull className="w-5 h-5 text-rose-400" />
                )}
                <span className="text-xs font-mono font-bold uppercase text-purple-200">
                  {currentScene.endingType}
                </span>
              </div>
            )}
          </div>

          {/* Story Text */}
          <div className="font-serif text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4 tracking-wide">
            {currentScene.text}
          </div>

          {/* Interactive Choices */}
          <div className="mt-8 pt-6 border-t border-purple-900/40">
            <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-4 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Available Actions & Paths</span>
            </h4>

            {currentScene.isEnding ? (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400 mb-4">You have reached a definitive chronicle conclusion.</p>
                <button
                  onClick={restartAdventure}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-purple-900/60 transition-all font-mono text-sm inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Embark on a New Timeline</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentScene.choices.map((choice) => {
                  const hasRequirement = !!choice.requirement?.stat;
                  const reqStat = choice.requirement?.stat;
                  const reqDifficulty = choice.requirement?.difficulty;
                  const energyCost = choice.requirement?.energyCost || 0;
                  const canAfford = character.energy >= energyCost;

                  return (
                    <button
                      key={choice.id}
                      disabled={!canAfford}
                      onClick={() => handleChoiceSelect(choice)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group flex items-center justify-between gap-4 ${
                        !canAfford
                          ? 'opacity-40 border-slate-800 bg-slate-900/40 cursor-not-allowed'
                          : 'bg-[#181330] border-purple-900/50 hover:border-purple-500 hover:bg-purple-950/60 hover:shadow-lg hover:shadow-purple-950/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="text-slate-100 font-medium text-sm group-hover:text-purple-200 transition-colors flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform" />
                          <span>{choice.text}</span>
                        </div>
                        {hasRequirement && (
                          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pl-3.5">
                            <span className="text-cyan-300">
                              Requires {reqStat?.toUpperCase()} (DC {reqDifficulty})
                            </span>
                            {energyCost > 0 && (
                              <span className="text-amber-400">-{energyCost} Energy</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-700/40 flex items-center justify-center text-purple-300 group-hover:border-purple-400 group-hover:text-white transition-all">
                          →
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skill Check Dice Roller Modal */}
      {activeCheck && (
        <DiceRoller
          statName={activeCheck.statName}
          statValue={activeCheck.statValue}
          difficulty={activeCheck.difficulty}
          onComplete={handleDiceComplete}
          onCancel={() => setActiveCheck(null)}
        />
      )}
    </div>
  );
};
