import React from 'react';
import { BookOpen, Edit3, GitFork, Compass, Volume2, VolumeX, Sparkles, Shield } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavigationProps {
  currentTab: 'adventure' | 'studio' | 'graph' | 'codex';
  setCurrentTab: (tab: 'adventure' | 'studio' | 'graph' | 'codex') => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  storyTitle: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  setCurrentTab,
  isMuted,
  setIsMuted,
  storyTitle
}) => {
  const toggleAudio = () => {
    sound.isMuted = !isMuted;
    setIsMuted(!isMuted);
    if (isMuted) {
      sound.playClick();
    }
  };

  const navItems = [
    { id: 'adventure', label: 'Play Story', icon: BookOpen },
    { id: 'studio', label: 'Story Studio', icon: Edit3 },
    { id: 'graph', label: 'Branch Graph', icon: GitFork },
    { id: 'codex', label: 'Character & Lore', icon: Compass },
  ] as const;

  return (
    <header className="border-b border-purple-900/40 bg-[#0d0a1a]/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo and Story Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-purple-900/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#0d0a1a] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300">
                STORYWEAVER
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>{storyTitle}</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1.5 bg-[#141026] p-1 rounded-xl border border-purple-900/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setCurrentTab(item.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-purple-900/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Audio Toggle & Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            title={isMuted ? 'Unmute procedural audio' : 'Mute audio'}
            className="p-2 rounded-lg border border-purple-900/40 bg-[#141026] text-slate-400 hover:text-purple-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
