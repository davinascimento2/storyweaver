export type Genre = 'cyberpunk' | 'fantasy' | 'scifi' | 'gothic' | 'custom';

export interface CharacterStat {
  name: string;
  value: number;
  maxValue: number;
  icon?: string;
  color: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'tool' | 'relic' | 'consumable' | 'key';
  quantity: number;
}

export interface PlayerCharacter {
  name: string;
  title: string;
  avatar: string;
  archetype: string;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  sanity: number;
  maxSanity: number;
  stats: {
    strength: number;
    agility: number;
    intellect: number;
    charisma: number;
  };
  inventory: InventoryItem[];
}

export interface StoryChoice {
  id: string;
  text: string;
  targetSceneId: string;
  requirement?: {
    stat?: 'strength' | 'agility' | 'intellect' | 'charisma';
    difficulty?: number;
    requiredItem?: string;
    energyCost?: number;
  };
  consequence?: {
    hpDelta?: number;
    energyDelta?: number;
    sanityDelta?: number;
    addItem?: InventoryItem;
    removeItemId?: string;
    customMessage?: string;
  };
}

export interface StoryScene {
  id: string;
  title: string;
  chapter: string;
  text: string;
  imageUrl?: string;
  ambientSound?: 'ambient' | 'combat' | 'mystery' | 'victory' | 'defeat';
  choices: StoryChoice[];
  isEnding?: boolean;
  endingType?: 'victory' | 'defeat' | 'neutral' | 'cliffhanger';
}

export interface LoreEntry {
  id: string;
  title: string;
  category: 'Faction' | 'Location' | 'Artifact' | 'History' | 'NPC';
  summary: string;
  details: string;
  tags: string[];
}

export interface StoryBook {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  genre: Genre;
  coverImage: string;
  synopsis: string;
  initialSceneId: string;
  scenes: Record<string, StoryScene>;
  lore: LoreEntry[];
  defaultCharacter: PlayerCharacter;
}
