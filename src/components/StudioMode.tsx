import React, { useState } from 'react';
import { StoryBook, StoryScene } from '../types';
import { Plus, Trash2, Wand2, Download, Layers } from 'lucide-react';
import { sound } from '../utils/audio';

interface StudioModeProps {
  story: StoryBook;
  setStory: React.Dispatch<React.SetStateAction<StoryBook>>;
}

export const StudioMode: React.FC<StudioModeProps> = ({ story, setStory }) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(story.initialSceneId);
  const [aiPromptStyle, setAiPromptStyle] = useState<'action' | 'twist' | 'dialogue' | 'sensory'>('twist');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeScene = story.scenes[selectedSceneId] || Object.values(story.scenes)[0];

  const handleTextChange = (newText: string) => {
    setStory(prev => ({
      ...prev,
      scenes: {
        ...prev.scenes,
        [activeScene.id]: {
          ...prev.scenes[activeScene.id],
          text: newText
        }
      }
    }));
  };

  const handleTitleChange = (newTitle: string) => {
    setStory(prev => ({
      ...prev,
      scenes: {
        ...prev.scenes,
        [activeScene.id]: {
          ...prev.scenes[activeScene.id],
          title: newTitle
        }
      }
    }));
  };

  const handleAddScene = () => {
    sound.playClick();
    const newId = `scene-${Date.now()}`;
    const newScene: StoryScene = {
      id: newId,
      title: 'New Branch Scene',
      chapter: 'Act II: The Unfolding',
      text: 'Describe the events, sights, and tensions of this encounter...',
      choices: []
    };

    setStory(prev => ({
      ...prev,
      scenes: {
        ...prev.scenes,
        [newId]: newScene
      }
    }));
    setSelectedSceneId(newId);
  };

  const handleAddChoice = () => {
    sound.playClick();
    const newChoiceId = `choice-${Date.now()}`;
    const availableScenes = Object.keys(story.scenes).filter(id => id !== activeScene.id);
    const target = availableScenes[0] || activeScene.id;

    setStory(prev => ({
      ...prev,
      scenes: {
        ...prev.scenes,
        [activeScene.id]: {
          ...prev.scenes[activeScene.id],
          choices: [
            ...prev.scenes[activeScene.id].choices,
            {
              id: newChoiceId,
              text: 'Investigate the unusual anomaly (Intellect DC 12)',
              targetSceneId: target,
              requirement: {
                stat: 'intellect',
                difficulty: 12
              }
            }
          ]
        }
      }
    }));
  };

  const handleRemoveChoice = (choiceId: string) => {
    sound.playClick();
    setStory(prev => ({
      ...prev,
      scenes: {
        ...prev.scenes,
        [activeScene.id]: {
          ...prev.scenes[activeScene.id],
          choices: prev.scenes[activeScene.id].choices.filter(c => c.id !== choiceId)
        }
      }
    }));
  };

  const handleAiContinue = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    sound.playDiceRoll();

    setTimeout(() => {
      let continuation = '';
      if (aiPromptStyle === 'twist') {
        continuation = `\n\nSuddenly, the shadows in the periphery coalesce into a humanoid figure. A familiar voice echoes across the chamber: "You should not have come back here, operative."`;
      } else if (aiPromptStyle === 'action') {
        continuation = `\n\nA deafening explosion shatters the reinforced glass above! Shards rain down as sirens begin their frantic wail, giving you mere seconds to react.`;
      } else if (aiPromptStyle === 'dialogue') {
        continuation = `\n\n"The price of knowledge is always steep," the enigmatic figure remarks, sliding a glowing data canister across the steel table. "Will you pay it?"`;
      } else {
        continuation = `\n\nThe air grows noticeably cold, thick with the ozone scent of spent plasma capacitors and decaying magnetic shields.`;
      }

      handleTextChange(activeScene.text + continuation);
      setIsGenerating(false);
      sound.playSuccess();
    }, 800);
  };

  const exportStoryJson = () => {
    sound.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(story, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${story.title.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Sidebar: Scene List */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-[#120e24] border border-purple-900/50 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-purple-900/40 mb-3">
            <h3 className="font-serif font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Scene Index ({Object.keys(story.scenes).length})</span>
            </h3>
            <button
              onClick={handleAddScene}
              className="p-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs flex items-center gap-1 border border-purple-700/50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Scene</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {Object.values(story.scenes).map((sc) => {
              const isSelected = sc.id === activeScene.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedSceneId(sc.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs font-mono flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-950/80 border-purple-500 text-white shadow-md'
                      : 'bg-[#181330]/50 border-purple-900/30 text-slate-300 hover:border-purple-700 hover:bg-[#181330]'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="font-semibold text-slate-100 truncate">{sc.title}</p>
                    <p className="text-[10px] text-purple-400/80 truncate">{sc.chapter}</p>
                  </div>
                  <span className="text-[10px] bg-purple-900/50 px-1.5 py-0.5 rounded text-purple-300">
                    {sc.choices.length} paths
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            onClick={exportStoryJson}
            className="flex-1 py-2.5 rounded-xl bg-[#141026] border border-purple-900/40 text-purple-300 hover:text-white hover:border-purple-600 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Story JSON</span>
          </button>
        </div>
      </div>

      {/* Main Studio Editor */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-[#120e24] border border-purple-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Scene Title & Chapter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Scene Title
              </label>
              <input
                type="text"
                value={activeScene.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-[#181330] border border-purple-900/50 rounded-xl px-3.5 py-2 text-white font-serif font-bold text-lg focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                Chapter / Act Label
              </label>
              <input
                type="text"
                value={activeScene.chapter}
                onChange={(e) => {
                  setStory(prev => ({
                    ...prev,
                    scenes: {
                      ...prev.scenes,
                      [activeScene.id]: {
                        ...prev.scenes[activeScene.id],
                        chapter: e.target.value
                      }
                    }
                  }));
                }}
                className="w-full bg-[#181330] border border-purple-900/50 rounded-xl px-3.5 py-2 text-purple-300 font-mono text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* AI Story Co-Writer Assistant Bar */}
          <div className="bg-[#181330] border border-purple-800/40 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-purple-200 font-semibold">AI Assistant:</span>
              <select
                value={aiPromptStyle}
                onChange={(e) => setAiPromptStyle(e.target.value as any)}
                className="bg-[#120e24] border border-purple-900/60 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-purple-500 font-mono"
              >
                <option value="twist">Narrative Plot Twist</option>
                <option value="action">High-Octane Combat Action</option>
                <option value="dialogue">Character Confrontation</option>
                <option value="sensory">Atmospheric Sensory Detail</option>
              </select>
            </div>

            <button
              onClick={handleAiContinue}
              disabled={isGenerating}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-medium font-mono flex items-center gap-1.5 hover:shadow-md hover:shadow-purple-900/50 transition-all disabled:opacity-50"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Weaving Narrative...' : 'Continue Scene with AI'}</span>
            </button>
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
              Scene Prose & Narrative Content
            </label>
            <textarea
              rows={8}
              value={activeScene.text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full bg-[#181330] border border-purple-900/50 rounded-2xl p-4 text-slate-200 font-serif text-base leading-relaxed focus:outline-none focus:border-purple-500 resize-y"
            />
          </div>

          {/* Choice Branching Editor */}
          <div className="pt-4 border-t border-purple-900/40">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300">
                Decision Branches from this Scene ({activeScene.choices.length})
              </h4>
              <button
                onClick={handleAddChoice}
                className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-700/50 text-purple-300 hover:text-white text-xs font-mono flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Branch Option</span>
              </button>
            </div>

            <div className="space-y-3">
              {activeScene.choices.map((ch, idx) => (
                <div
                  key={ch.id}
                  className="bg-[#181330] border border-purple-900/50 rounded-xl p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                      Branch #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveChoice(ch.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={ch.text}
                    onChange={(e) => {
                      const updated = activeScene.choices.map(c => c.id === ch.id ? { ...c, text: e.target.value } : c);
                      setStory(prev => ({
                        ...prev,
                        scenes: {
                          ...prev.scenes,
                          [activeScene.id]: {
                            ...prev.scenes[activeScene.id],
                            choices: updated
                          }
                        }
                      }));
                    }}
                    placeholder="Choice prompt text..."
                    className="w-full bg-[#120e24] border border-purple-900/40 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  />

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Target Scene:</span>
                      <select
                        value={ch.targetSceneId}
                        onChange={(e) => {
                          const updated = activeScene.choices.map(c => c.id === ch.id ? { ...c, targetSceneId: e.target.value } : c);
                          setStory(prev => ({
                            ...prev,
                            scenes: {
                              ...prev.scenes,
                              [activeScene.id]: {
                                ...prev.scenes[activeScene.id],
                                choices: updated
                              }
                            }
                          }));
                        }}
                        className="bg-[#120e24] border border-purple-900/50 text-cyan-300 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        {Object.values(story.scenes).map(sc => (
                          <option key={sc.id} value={sc.id}>{sc.title} ({sc.id})</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Difficulty DC:</span>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={ch.requirement?.difficulty || 10}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 10;
                          const updated = activeScene.choices.map(c => c.id === ch.id ? {
                            ...c,
                            requirement: {
                              ...c.requirement,
                              stat: c.requirement?.stat || 'intellect',
                              difficulty: val
                            }
                          } : c);
                          setStory(prev => ({
                            ...prev,
                            scenes: {
                              ...prev.scenes,
                              [activeScene.id]: {
                                ...prev.scenes[activeScene.id],
                                choices: updated
                              }
                            }
                          }));
                        }}
                        className="w-14 bg-[#120e24] border border-purple-900/50 text-amber-300 rounded-lg px-2 py-1 focus:outline-none text-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
