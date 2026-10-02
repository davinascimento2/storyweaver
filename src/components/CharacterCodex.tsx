import React, { useState } from 'react';
import { StoryBook, LoreEntry } from '../types';
import { Compass, Tag, Plus } from 'lucide-react';
import { sound } from '../utils/audio';

interface CharacterCodexProps {
  story: StoryBook;
  setStory: React.Dispatch<React.SetStateAction<StoryBook>>;
}

export const CharacterCodex: React.FC<CharacterCodexProps> = ({ story, setStory }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Faction', 'Location', 'Artifact', 'NPC', 'History'];

  const filteredLore = selectedCategory === 'All'
    ? story.lore
    : story.lore.filter(l => l.category === selectedCategory);

  const handleAddLore = () => {
    sound.playClick();
    const newLore: LoreEntry = {
      id: `lore-${Date.now()}`,
      title: 'New Codex Entry',
      category: 'Faction',
      summary: 'Short synopsis of this worldbuilding element...',
      details: 'Deep lore, historical significance, and hidden secrets...',
      tags: ['Worldbuilding']
    };

    setStory(prev => ({
      ...prev,
      lore: [...prev.lore, newLore]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Lore Header */}
      <div className="bg-[#120e24] border border-purple-900/50 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="font-serif font-bold text-xl text-white">World Lore & Faction Codex</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Encyclopedia of lore, factions, artifacts, and hidden knowledge of {story.title}.
          </p>
        </div>

        <button
          onClick={handleAddLore}
          className="px-4 py-2 rounded-xl bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs font-mono flex items-center gap-1.5 hover:bg-purple-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Codex Entry</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playClick();
              setSelectedCategory(cat);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-[#140f29] border border-purple-900/30 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLore.map((item) => (
          <div
            key={item.id}
            className="bg-[#120e24] border border-purple-900/40 rounded-2xl p-6 hover:border-purple-600/60 transition-colors shadow-lg"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950 text-cyan-300 border border-purple-800/60">
                {item.category}
              </span>
              <div className="flex gap-1">
                {item.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono text-slate-500 flex items-center gap-0.5">
                    <Tag className="w-2.5 h-2.5" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="font-serif font-bold text-lg text-white mb-2">
              {item.title}
            </h3>

            <p className="text-xs text-purple-300/90 font-medium mb-3">
              {item.summary}
            </p>

            <p className="text-xs text-slate-400 leading-relaxed pt-3 border-t border-purple-900/30">
              {item.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
