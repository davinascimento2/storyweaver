import { StoryBook } from '../types';

export const PRESET_STORIES: StoryBook[] = [
  {
    id: 'cyberpunk-sector-09',
    title: 'Neon Shadows: Sector 09',
    subtitle: 'A Cyberpunk Corporate Espionage Thriller',
    author: 'Davi Nascimento & Neural Engine',
    genre: 'cyberpunk',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    synopsis: 'As a rogue Netrunner in Neo-Kowloon 2099, you are hired to infiltrate the fortified server spire of Arasaka-Vanguard and extract Project Chimera before the ICE burns your cortex.',
    initialSceneId: 'start',
    defaultCharacter: {
      name: 'Vex "Null" Callahan',
      title: 'Veteran Netrunner & Infiltrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      archetype: 'Cyber Specialist',
      hp: 100,
      maxHp: 100,
      energy: 80,
      maxEnergy: 100,
      sanity: 90,
      maxSanity: 100,
      stats: {
        strength: 10,
        agility: 14,
        intellect: 18,
        charisma: 12,
      },
      inventory: [
        { id: 'deck-01', name: 'Militech Cyberdeck MK-IV', description: 'Overclocked neural deck with ICE-breaking subroutines.', type: 'tool', quantity: 1 },
        { id: 'stim-01', name: 'Neuro-Stim Injector', description: 'Restores 40 energy and sharpens reflexes.', type: 'consumable', quantity: 2 },
        { id: 'keycard-01', name: 'Level 2 Maintenance Pass', description: 'Sub-level service tunnel access.', type: 'key', quantity: 1 }
      ]
    },
    scenes: {
      start: {
        id: 'start',
        title: 'Rain on Chrome',
        chapter: 'Act I: The Drop',
        text: `The acid rain of Neo-Kowloon hammers against your visor as you crouch atop the neon-lit parapet of Sector 09. Below, the monolith of Vanguard Dynamics glints like obsidian glass pierced by surveillance drones.

Your contact, "Whisper", pings your optic neural-link:
"Vex, security rotation occurs in three minutes. You have two entry vectors: brute-force the ventilation shaft at the coolant junction, or jack directly into the external optical junction to bypass the laser perimeter."

Your cyberdeck hums with anticipation.`,
        choices: [
          {
            id: 'c1',
            text: 'Jack into the Optical Relay (Intellect Check DC 13)',
            targetSceneId: 'optical-relay',
            requirement: { stat: 'intellect', difficulty: 13, energyCost: 15 }
          },
          {
            id: 'c2',
            text: 'Climb down to the Ventilation Shaft (Agility Check DC 11)',
            targetSceneId: 'vent-shaft',
            requirement: { stat: 'agility', difficulty: 11, energyCost: 10 }
          },
          {
            id: 'c3',
            text: 'Bribe the loading dock guard with fake credentials (Charisma Check DC 14)',
            targetSceneId: 'loading-dock',
            requirement: { stat: 'charisma', difficulty: 14, energyCost: 5 }
          }
        ]
      },
      'optical-relay': {
        id: 'optical-relay',
        title: 'Through the Firewall',
        chapter: 'Act II: The Infiltration',
        text: `You slip the neural cable into the junction box. Instant sensory rush: glowing neon grids of data streams pulse before your optic nerve. 

You slice cleanly through Vanguard's primary ICE layer, rerouting sensor feeds into an infinite loop. The laser grids on the 44th floor flicker and shut down, revealing the data core entrance.

You step quietly into the polished marble atrium of the executive tier.`,
        choices: [
          {
            id: 'opt-1',
            text: 'Proceed directly to the Mainframe Vault',
            targetSceneId: 'mainframe-vault'
          },
          {
            id: 'opt-2',
            text: 'Search the Director’s Terminal for encrypted security keys',
            targetSceneId: 'directors-terminal',
            requirement: { stat: 'intellect', difficulty: 14, energyCost: 20 }
          }
        ]
      },
      'vent-shaft': {
        id: 'vent-shaft',
        title: 'Grease and Fans',
        chapter: 'Act II: The Infiltration',
        text: `You rappel silently along the rusted iron framework and slip into the coolant exhaust ducts. The heat is oppressive, and industrial fans spin with lethal velocity.

Timing your dash between blade rotations, you land inside the sub-level utility closet. A maintenance drone glides past just inches from your locker!`,
        choices: [
          {
            id: 'vent-1',
            text: 'Hack the maintenance drone to scout ahead (Intellect DC 12)',
            targetSceneId: 'mainframe-vault',
            requirement: { stat: 'intellect', difficulty: 12, energyCost: 10 }
          },
          {
            id: 'vent-2',
            text: 'Take the freight elevator directly to the Data Vault',
            targetSceneId: 'mainframe-vault'
          }
        ]
      },
      'loading-dock': {
        id: 'loading-dock',
        title: 'The Silver Tongue',
        chapter: 'Act II: The Infiltration',
        text: `You flash your forged Level 2 Maintenance Pass and adopt a swagger of irritated authority. The cyborg guard scans the badge, his optics flickering yellow before settling on green.

"Hurry up, techie. Shifts change at midnight," he grunts, sliding the heavy blast doors open.`,
        choices: [
          {
            id: 'dock-1',
            text: 'Head into the Central Server Spire',
            targetSceneId: 'mainframe-vault'
          }
        ]
      },
      'directors-terminal': {
        id: 'directors-terminal',
        title: 'Dirty Secrets',
        chapter: 'Act III: The Core',
        text: `You crack the director's personal terminal. Among the encrypted files, you discover that "Project Chimera" isn't an AI weapon — it is a digital backup of human consciousness stolen from rogue hackers... including your missing partner!

You download the Master Decryption Cipher and bonus credentials (+20 Max Energy).`,
        choices: [
          {
            id: 'dt-1',
            text: 'Extract the Chimera Core and purge the facility logs',
            targetSceneId: 'victory-mastermind',
            consequence: { energyDelta: 20, customMessage: 'Acquired Master Cipher and partner backup!' }
          }
        ]
      },
      'mainframe-vault': {
        id: 'mainframe-vault',
        title: 'The Chimera Core',
        chapter: 'Act III: The Core',
        text: `The central data chamber is breathtaking: a suspended crystal prism surrounded by liquid nitrogen fog. Within it floats Project Chimera.

Suddenly, red sirens blare! A Vanguard Combat Automaton drops from the ceiling with dual thermal blades ignited!`,
        choices: [
          {
            id: 'boss-1',
            text: 'Engage EMP Burst and overload its capacitors (Intellect DC 15)',
            targetSceneId: 'victory-clean',
            requirement: { stat: 'intellect', difficulty: 15, energyCost: 30 }
          },
          {
            id: 'boss-2',
            text: 'Combat maneuver: Aim for the exposed hydraulic joints (Agility DC 16)',
            targetSceneId: 'victory-combat',
            requirement: { stat: 'agility', difficulty: 16, energyCost: 25 }
          },
          {
            id: 'boss-3',
            text: 'Desperate dash to upload the payload before getting hit (Strength DC 14)',
            targetSceneId: 'victory-bruised',
            requirement: { stat: 'strength', difficulty: 14 }
          }
        ]
      },
      'victory-mastermind': {
        id: 'victory-mastermind',
        title: 'The Ghost in the Machine',
        chapter: 'Epilogue: True Ending',
        text: `With the Chimera Core in your cyberdeck and your partner's digital soul preserved, you vanish into the rainy skyline of Neo-Kowloon without leaving a single breadcrumb.

You didn't just pull off the heist of the decade — you beat Vanguard at their own game.`,
        choices: [],
        isEnding: true,
        endingType: 'victory'
      },
      'victory-clean': {
        id: 'victory-clean',
        title: 'Silicon Ghost',
        chapter: 'Epilogue',
        text: `The EMP pulse detonates with a brilliant turquoise flash. The automaton locks up and crashes to the ground. You extract the Chimera data shard and grapple out through the skylight.

Mission accomplished with 100% operational stealth.`,
        choices: [],
        isEnding: true,
        endingType: 'victory'
      },
      'victory-combat': {
        id: 'victory-combat',
        title: 'Steel and Sparks',
        chapter: 'Epilogue',
        text: `You slide beneath the swinging thermal blade and sever the combat drone's central power conduit. It explodes in a shower of sparks as you secure the extraction drive and jump onto your getaway hoverbike!`,
        choices: [],
        isEnding: true,
        endingType: 'victory'
      },
      'victory-bruised': {
        id: 'victory-bruised',
        title: 'Narrow Escape',
        chapter: 'Epilogue',
        text: `You absorb a glancing blow from the drone's blade, fracturing your shoulder plate, but your cyberdeck successfully finishes the transfer. You deploy smoke grenades and leap into the canal below.

You survived, battered but victorious.`,
        choices: [],
        isEnding: true,
        endingType: 'victory'
      }
    },
    lore: [
      {
        id: 'lore-1',
        title: 'Vanguard Dynamics',
        category: 'Faction',
        summary: 'Megacorporation dominating cybernetic implants and defense security in the Pacific Rim.',
        details: 'Founded in 2064, Vanguard controls 40% of the orbital communication grid.',
        tags: ['MegaCorp', 'Enemy', 'Tech']
      },
      {
        id: 'lore-2',
        title: 'Project Chimera',
        category: 'Artifact',
        summary: 'Classified neural transfer protocol capable of binding human consciousness to AI neural networks.',
        details: 'Stolen research containing digitized memories of top netrunners.',
        tags: ['Classified', 'AI', 'Heist']
      }
    ]
  },
  {
    id: 'fantasy-obsidian-spire',
    title: 'The Obsidian Spire',
    subtitle: 'A Dark Fantasy Dungeon & Arcane Mystery',
    author: 'Davi Nascimento & Arcane Lorekeeper',
    genre: 'fantasy',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    synopsis: 'Ascend the forbidden Spire of Malakor, solve ancient runic riddles, and reclaim the Sunstone before the eclipse seals the realm in perpetual twilight.',
    initialSceneId: 'spire-gates',
    defaultCharacter: {
      name: 'Eldrin Moonshadow',
      title: 'Arcane Rogue & Rune Scholar',
      avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=400&auto=format&fit=crop',
      archetype: 'Spellblade',
      hp: 120,
      maxHp: 120,
      energy: 90,
      maxEnergy: 90,
      sanity: 85,
      maxSanity: 100,
      stats: {
        strength: 12,
        agility: 16,
        intellect: 17,
        charisma: 11,
      },
      inventory: [
        { id: 'f-blade', name: 'Runic Dagger of Frost', description: 'Glows blue in the presence of undead.', type: 'weapon', quantity: 1 },
        { id: 'f-potion', name: 'Elixir of Clarity', description: 'Restores 50 Mana/Energy and protects against curses.', type: 'consumable', quantity: 2 }
      ]
    },
    scenes: {
      'spire-gates': {
        id: 'spire-gates',
        title: 'The Gates of Malakor',
        chapter: 'Act I: The Threshold',
        text: `Towering black basalt arches loom against a blood-red moon. Two gargoyles carved from corrupted obsidian gaze down with glowing violet eyes. 

A riddle is engraved upon the heavy iron doors in the Elder Tongue:
"I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?"`,
        choices: [
          {
            id: 'f-c1',
            text: 'Whisper "A Map" into the rune keyhole (Intellect DC 10)',
            targetSceneId: 'hall-of-mirrors',
            requirement: { stat: 'intellect', difficulty: 10 }
          },
          {
            id: 'f-c2',
            text: 'Pick the enchanted tumbler lock with thieves tools (Agility DC 14)',
            targetSceneId: 'hall-of-mirrors',
            requirement: { stat: 'agility', difficulty: 14 }
          }
        ]
      },
      'hall-of-mirrors': {
        id: 'hall-of-mirrors',
        title: 'The Hall of Spectral Mirrors',
        chapter: 'Act II: The Trials',
        text: `Glass reflections duplicate your movement with an unsettling two-second delay. In the center stands the Lich Archivist, clutching the Sunstone staff.

"Another foolish mortal seeks to delay the eternal night," he hisses, raising a hand crackling with necrotic lightning!`,
        choices: [
          {
            id: 'f-c3',
            text: 'Counterspell his incantation with Frost Dagger (Intellect DC 14)',
            targetSceneId: 'spire-victory',
            requirement: { stat: 'intellect', difficulty: 14, energyCost: 25 }
          },
          {
            id: 'f-c4',
            text: 'Acrobatic leap across mirror shards to strike from behind (Agility DC 15)',
            targetSceneId: 'spire-victory',
            requirement: { stat: 'agility', difficulty: 15, energyCost: 20 }
          }
        ]
      },
      'spire-victory': {
        id: 'spire-victory',
        title: 'Dawn Restored',
        chapter: 'Epilogue',
        text: `The Lich dissolves into harmless dust as the Sunstone ignites with blinding golden radiance. Light bursts through the Spire's stained-glass dome, driving the shadow beasts back into the abyss.

The realm of Aethelgard is saved by your valor!`,
        choices: [],
        isEnding: true,
        endingType: 'victory'
      }
    },
    lore: [
      {
        id: 'lore-spire',
        title: 'The Obsidian Spire',
        category: 'Location',
        summary: 'Ancient bastion constructed during the First Age of Magic.',
        details: 'Harbors forbidden spells and ancient artifacts guarded by cursed sentinels.',
        tags: ['Magic', 'Dungeon', 'Ancient']
      }
    ]
  }
];
