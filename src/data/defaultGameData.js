/**
 * ============================================================================
 * ARCHERO 2 - GAME UPGRADE DATA (V2.5)
 * ============================================================================
 * Офіційна таблиця злиття (Fusion / Upgrade) для зброї та рун:
 * 
 * 1. Common -> Great: 1 база + 2 такі ж Common копії (разом 3)
 * 2. Great -> Rare: 1 база + 2 такі ж Great копії (разом 3)
 * 3. Rare -> Epic: 1 база + 2 такі ж Rare копії (разом 3)
 * 4. Epic -> Epic +1: 1 база + 1 будь-який Epic корм
 * 5. Epic +1 -> Epic +2: 1 база + 2 будь-які Epic корм
 * 6. Epic +2 -> Gold: 1 база + 1 такий самий Epic +2
 * 7. Gold -> Gold +1: 1 база + 1 будь-який Gold корм
 * 8. Gold +1 -> Gold +2: 1 база + 1 будь-який Gold корм
 * 9. Gold +2 -> Gold +3: 1 база + 2 будь-які Gold корм
 * 10. Gold +3 -> Mythic (Red): 1 база + 1 такий самий Gold +3
 * ============================================================================
 */

export const FUSION_TIERS = [
  { id: 'common', label: 'Common (Сіра)', shortLabel: 'Common', color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.15)', border: '#9e9e9e' },
  { id: 'great', label: 'Great (Зелена)', shortLabel: 'Great', color: '#4caf50', bg: 'rgba(76, 175, 80, 0.18)', border: '#4caf50' },
  { id: 'rare', label: 'Rare (Синя)', shortLabel: 'Rare', color: '#2196f3', bg: 'rgba(33, 150, 243, 0.18)', border: '#2196f3' },
  { id: 'epic', label: 'Epic (Фіолетова)', shortLabel: 'Epic', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.18)', border: '#a855f7' },
  { id: 'epic_1', label: 'Epic +1', shortLabel: 'Epic +1', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.22)', border: '#c084fc', badge: '1' },
  { id: 'epic_2', label: 'Epic +2', shortLabel: 'Epic +2', color: '#d8b4fe', bg: 'rgba(216, 180, 254, 0.25)', border: '#d8b4fe', badge: '2' },
  { id: 'gold', label: 'Gold (Золота)', shortLabel: 'Gold', color: '#ffb300', bg: 'rgba(255, 179, 0, 0.22)', border: '#ffb300' },
  { id: 'gold_1', label: 'Gold +1', shortLabel: 'Gold +1', color: '#ffa000', bg: 'rgba(255, 160, 0, 0.25)', border: '#ffa000', badge: '1' },
  { id: 'gold_2', label: 'Gold +2', shortLabel: 'Gold +2', color: '#ff8f00', bg: 'rgba(255, 143, 0, 0.28)', border: '#ff8f00', badge: '2' },
  { id: 'gold_3', label: 'Gold +3', shortLabel: 'Gold +3', color: '#ff6f00', bg: 'rgba(255, 111, 0, 0.32)', border: '#ff6f00', badge: '3' },
  { id: 'mythic', label: 'Mythic (Червона)', shortLabel: 'Mythic', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.3)', border: '#ef4444', badge: '◆' },
];

export const STEP_REQUIREMENTS = {
  'common': {
    sameCopies: 2,
    sameRarity: 'Common',
    fodderCopies: 0,
    fodderRarity: '',
    gold: 5000,
    scrolls: 10,
    description: '2 такі ж самі Common копії'
  },
  'great': {
    sameCopies: 2,
    sameRarity: 'Great',
    fodderCopies: 0,
    fodderRarity: '',
    gold: 15000,
    scrolls: 25,
    description: '2 такі ж самі Great копії'
  },
  'rare': {
    sameCopies: 2,
    sameRarity: 'Rare',
    fodderCopies: 0,
    fodderRarity: '',
    gold: 40000,
    scrolls: 50,
    description: '2 такі ж самі Rare копії'
  },
  'epic': {
    sameCopies: 0,
    sameRarity: '',
    fodderCopies: 1,
    fodderRarity: 'Epic',
    gold: 80000,
    scrolls: 80,
    description: '1 будь-який Epic (корм)'
  },
  'epic_1': {
    sameCopies: 0,
    sameRarity: '',
    fodderCopies: 2,
    fodderRarity: 'Epic',
    gold: 120000,
    scrolls: 120,
    description: '2 будь-які Epic (корм)'
  },
  'epic_2': {
    sameCopies: 1,
    sameRarity: 'Epic +2',
    fodderCopies: 0,
    fodderRarity: '',
    gold: 180000,
    scrolls: 160,
    description: '1 такий самий Epic +2'
  },
  'gold': {
    sameCopies: 0,
    sameRarity: '',
    fodderCopies: 1,
    fodderRarity: 'Gold',
    gold: 240000,
    scrolls: 200,
    description: '1 будь-який Gold (корм)'
  },
  'gold_1': {
    sameCopies: 0,
    sameRarity: '',
    fodderCopies: 1,
    fodderRarity: 'Gold',
    gold: 300000,
    scrolls: 250,
    description: '1 будь-який Gold (корм)'
  },
  'gold_2': {
    sameCopies: 0,
    sameRarity: '',
    fodderCopies: 2,
    fodderRarity: 'Gold',
    gold: 400000,
    scrolls: 320,
    description: '2 будь-які Gold (корм)'
  },
  'gold_3': {
    sameCopies: 1,
    sameRarity: 'Gold +3',
    fodderCopies: 0,
    fodderRarity: '',
    gold: 600000,
    scrolls: 450,
    description: '1 такий самий Gold +3'
  },
};

export const DEFAULT_GAME_DATA = {
  version: '2.5.0',
  description: 'Archero 2 Fusion & Upgrade Data',
  equipment: {
    tiers: FUSION_TIERS,
    stepRequirements: STEP_REQUIREMENTS
  },
  runes: {
    tiers: FUSION_TIERS,
    stepRequirements: STEP_REQUIREMENTS
  }
};

export const EQUIPMENT_SLOTS = [
  { id: 'Weapon', label: 'Зброя (Weapon)', icon: '⚔️', scrollName: 'Weapon Scrolls' },
  { id: 'Armor', label: 'Броня (Armor)', icon: '🛡️', scrollName: 'Armor Scrolls' },
  { id: 'Ring', label: 'Перстень (Ring)', icon: '💍', scrollName: 'Ring Scrolls' },
  { id: 'Bracelet', label: 'Браслет (Bracelet)', icon: '📿', scrollName: 'Bracelet Scrolls' },
  { id: 'Necklace', label: 'Амулет (Necklace)', icon: '🪬', scrollName: 'Necklace Scrolls' },
  { id: 'Spellbook', label: 'Книга (Spellbook)', icon: '📖', scrollName: 'Spellbook Scrolls' },
];

export const EQUIPMENT_CATALOG = [
  { id: 'brightspear', name: 'Brightspear', slot: 'Weapon', icon: '⚡' },
  { id: 'demon_blade', name: 'Demon Blade: Rain', slot: 'Weapon', icon: '🗡️' },
  { id: 'death_scythe', name: 'Death Scythe', slot: 'Weapon', icon: '🪓' },
  { id: 'stalker_staff', name: 'Stalker Staff', slot: 'Weapon', icon: '🪄' },
  { id: 'brave_bow', name: 'Brave Bow', slot: 'Weapon', icon: '🏹' },
  { id: 'tornado', name: 'Tornado (Boomerang)', slot: 'Weapon', icon: '🌀' },
  { id: 'saw_blade', name: 'Saw Blade', slot: 'Weapon', icon: '🪚' },
  { id: 'mini_atreus', name: 'Mini Atreus', slot: 'Weapon', icon: '🎸' },

  { id: 'golden_chestplate', name: 'Golden Chestplate', slot: 'Armor', icon: '🛡️' },
  { id: 'phantom_cloak', name: 'Phantom Cloak', slot: 'Armor', icon: '🥋' },
  { id: 'vest_of_dexterity', name: 'Vest of Dexterity', slot: 'Armor', icon: '🦺' },
  { id: 'shadow_robe', name: 'Shadow Robe', slot: 'Armor', icon: '🧥' },
  { id: 'void_robe', name: 'Void Robe', slot: 'Armor', icon: '🌌' },
  { id: 'bright_robe', name: 'Bright Robe', slot: 'Armor', icon: '✨' },

  { id: 'lion_ring', name: 'Lion Ring', slot: 'Ring', icon: '🦁' },
  { id: 'bull_ring', name: 'Bull Ring', slot: 'Ring', icon: '🐂' },
  { id: 'dragon_ring', name: 'Dragon Ring', slot: 'Ring', icon: '🐉' },
  { id: 'wolf_ring', name: 'Wolf Ring', slot: 'Ring', icon: '🐺' },

  { id: 'quickshot_bracelet', name: 'Quickshot Bracelet', slot: 'Bracelet', icon: '⚡' },
  { id: 'invincible_bracelet', name: 'Invincible Bracelet', slot: 'Bracelet', icon: '🛡️' },
  { id: 'shield_bracelet', name: 'Shield Bracelet', slot: 'Bracelet', icon: '🔰' },

  { id: 'angel_locket', name: 'Angel Locket', slot: 'Necklace', icon: '🪽' },
  { id: 'bloodthirsty_locket', name: 'Bloodthirsty Locket', slot: 'Necklace', icon: '🩸' },
  { id: 'counterattack_charm', name: 'Counterattack Charm', slot: 'Necklace', icon: '🗡️' },

  { id: 'giants_contract', name: "Giant's Contract", slot: 'Spellbook', icon: '📜' },
  { id: 'arcane_archer', name: 'Arcane Archer', slot: 'Spellbook', icon: '🏹' },
  { id: 'enlightenment', name: 'Enlightenment', slot: 'Spellbook', icon: '📖' },
];

/**
 * Реальний каталог рун Archero 2:
 * Включаючи найпотужніші Гравійовані руни (Etched Runes), Руни Благословення та Посилення
 */
export const RUNES_CATALOG = [
  {
    id: 'etched_echo_arrow',
    name: 'Гравійована: Стріла Ехо (Arrow of Echoes)',
    category: 'Гравійована (Etched)',
    iconKey: 'etched_echo_arrow',
    icon: '🏹',
    color: '#ffb300',
    description: 'ТОП руна Archero 2: випускає подвійні стріли-відлуння з величезним уроном'
  },
  {
    id: 'etched_sword',
    name: 'Гравійована: Удар Меча (Sword Strike)',
    category: 'Гравійована (Etched)',
    iconKey: 'etched_sword',
    icon: '⚔️',
    color: '#ff8f00',
    description: 'Викликає літаючі мечі, що атакують ворогів навколо'
  },
  {
    id: 'etched_meteor',
    name: 'Гравійована: Метеор (Meteor Rune)',
    category: 'Гравійована (Etched)',
    iconKey: 'etched_meteor',
    icon: '☄️',
    color: '#ff5722',
    description: 'Падіння палаючого метеора при атаках'
  },
  {
    id: 'etched_orb',
    name: 'Гравійована: Пульсуюча Сфера (Pulsing Orb)',
    category: 'Гравійована (Etched)',
    iconKey: 'etched_orb',
    icon: '🔮',
    color: '#06b6d4',
    description: 'Сфера арканної енергії з періодичним сплеском'
  },
  {
    id: 'etched_elemental',
    name: 'Гравійована: Стихійний Шквал (Elemental Surge)',
    category: 'Гравійована (Etched)',
    iconKey: 'etched_elemental',
    icon: '⚡',
    color: '#a855f7',
    description: 'Посилює всі стихійні ефекти (вогонь, блискавка, лід)'
  },
  {
    id: 'blessing_rebirth',
    name: 'Благословення: Відродження (Blessing of Rebirth)',
    category: 'Благословення (Blessing)',
    iconKey: 'blessing_rebirth',
    icon: '✨',
    color: '#22c55e',
    description: 'Дає шанс другого життя при загибелі'
  },
  {
    id: 'enhancement_power',
    name: 'Посилення: Абсолютна Сила (Absolute Power)',
    category: 'Посилення (Enhancement)',
    iconKey: 'enhancement_power',
    icon: '💪',
    color: '#eab308',
    description: 'Значне підвищення базової атаки'
  },
  {
    id: 'ability_crit',
    name: 'Здібність: Критичний Удар (Precision Strike)',
    category: 'Здібність (Ability)',
    iconKey: 'ability_crit',
    icon: '🎯',
    color: '#ef4444',
    description: 'Збільшує шанс та силу критичного удару'
  },
];
