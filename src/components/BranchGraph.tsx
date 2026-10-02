import React from 'react';
import { StoryBook } from '../types';
import { GitFork, Trophy, Skull } from 'lucide-react';
import { sound } from '../utils/audio';

interface BranchGraphProps {
  story: StoryBook;
  onSelectScene: (sceneId: string) => void;
}

export const BranchGraph: React.FC<BranchGraphProps> = ({ story, onSelectScene }) => {
  const sceneList = Object.values(story.scenes);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-[#120e24] border border-purple-900/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <GitFork className="w-5 h-5 text-purple-400" />
          <h2 className="font-serif font-bold text-xl text-white">Narrative Topology Graph</h2>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Visual mapping of all decision paths, branching story nodes, and possible endings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sceneList.map((scene) => {
          const isInitial = scene.id === story.initialSceneId;
          const isVictory = scene.endingType === 'victory';
          const isDefeat = scene.endingType === 'defeat';

          return (
            <div
              key={scene.id}
              onClick={() => {
                sound.playClick();
                onSelectScene(scene.id);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                isInitial
                  ? 'bg-[#1a1438] border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                  : isVictory
                  ? 'bg-[#12241b] border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                  : isDefeat
                  ? 'bg-[#261016] border-rose-500/60 shadow-lg shadow-rose-950/40'
                  : 'bg-[#140f29] border-purple-900/40 hover:border-purple-500 hover:bg-[#191433]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300">
                  {scene.chapter}
                </span>
                {isInitial && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                    ENTRY POINT
                  </span>
                )}
                {scene.isEnding && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                    isVictory ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                  }`}>
                    {isVictory ? <Trophy className="w-3 h-3" /> : <Skull className="w-3 h-3" />}
                    <span>ENDING</span>
                  </span>
                )}
              </div>

              <h3 className="font-serif font-bold text-white text-base group-hover:text-purple-300 transition-colors mb-2">
                {scene.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {scene.text}
              </p>

              <div className="border-t border-purple-900/30 pt-3 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{scene.choices.length} Output Branches</span>
                <span className="text-purple-400 group-hover:translate-x-1 transition-transform">Inspect Node →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
