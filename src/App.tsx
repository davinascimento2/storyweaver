import { useState, useEffect } from 'react';
import { PRESET_STORIES } from './data/presetStories';
import { StoryBook, PlayerCharacter } from './types';
import { Navigation } from './components/Navigation';
import { AdventureMode } from './components/AdventureMode';
import { StudioMode } from './components/StudioMode';
import { BranchGraph } from './components/BranchGraph';
import { CharacterCodex } from './components/CharacterCodex';
import { BookOpen } from 'lucide-react';
import { sound } from './utils/audio';

export function App() {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [story, setStory] = useState<StoryBook>(() => {
    const saved = localStorage.getItem('storyweaver_active_story');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return PRESET_STORIES[0];
      }
    }
    return PRESET_STORIES[0];
  });

  const [character, setCharacter] = useState<PlayerCharacter>(story.defaultCharacter);
  const [currentTab, setCurrentTab] = useState<'adventure' | 'studio' | 'graph' | 'codex'>('adventure');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    localStorage.setItem('storyweaver_active_story', JSON.stringify(story));
  }, [story]);

  const handleSelectPreset = (idx: number) => {
    sound.playClick();
    setSelectedStoryIndex(idx);
    const newStory = PRESET_STORIES[idx];
    setStory(newStory);
    setCharacter(newStory.defaultCharacter);
  };

  return (
    <div className="min-h-screen bg-[#0a0817] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Navigation Header */}
      <Navigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        storyTitle={story.title}
      />

      {/* Preset Selector Banner */}
      <div className="bg-[#120e24]/60 border-b border-purple-900/30 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            Preset Adventures:
          </span>
          <div className="flex gap-2">
            {PRESET_STORIES.map((preset, idx) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all shrink-0 ${
                  selectedStoryIndex === idx
                    ? 'bg-purple-900/80 border border-purple-500 text-cyan-300 shadow-sm'
                    : 'bg-[#181330]/40 border border-purple-900/30 text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Viewports */}
      <main className="flex-1 pb-16">
        {currentTab === 'adventure' && (
          <AdventureMode
            story={story}
            character={character}
            setCharacter={setCharacter}
          />
        )}

        {currentTab === 'studio' && (
          <StudioMode
            story={story}
            setStory={setStory}
          />
        )}

        {currentTab === 'graph' && (
          <BranchGraph
            story={story}
            onSelectScene={(_scId) => {
              setCurrentTab('studio');
            }}
          />
        )}

        {currentTab === 'codex' && (
          <CharacterCodex
            story={story}
            setStory={setStory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-950/60 bg-[#090714] py-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>StoryWeaver Studio • AI Interactive Narrative Engine</span>
          <span>Crafted by <a href="https://github.com/davinascimento2" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">Davi Nascimento</a></span>
        </div>
      </footer>
    </div>
  );
}

export default App;
