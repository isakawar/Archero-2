/**
 * ============================================================================
 * ARCHERO 2 - GAME UPGRADE DATA
 * ============================================================================
 * 
 * Точна таблиця злиття (Fusion / Upgrade) для спорядження за офіційною схемою гри:
 * 
 * 1. Common -> Great: 1 база + 2 однакові Common копії (всього 3 Common)
 * 2. Great -> Rare: 1 база + 2 однакові Great копії (всього 3 Great)
 * 3. Rare -> Epic: 1 база + 2 однакові Rare копії (всього 3 Rare)
 * 4. Epic -> Epic +1: 1 база + 1 будь-який Epic (корм)
 * 5. Epic +1 -> Epic +2: 1 база + 2 будь-які Epic (корм)
 * 6. Epic +2 -> Gold: 1 база + 1 однаковий Epic +2
 * 7. Gold -> Gold +1: 1 база + 1 будь-який Gold (корм)
 * 8. Gold +1 -> Gold +2: 1 база + 1 будь-який Gold (корм)
 * 9. Gold +2 -> Gold +3: 1 база + 2 будь-які Gold (корм)
 * 10. Gold +3 -> Mythic (Red): 1 база + 1 однаковий Gold +3
 * ============================================================================
 */

export const DEFAULT_GAME_DATA = {
  version: '2.0.0',
  description: 'Archero 2 Upgrade Configuration (Official Fusion Table for Equipment)',

  equipment: {
    // Офіційний порядок рідкостей спорядження Archero 2 з таблиці
    tiers: [
      { id: 'common', label: 'Common', color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.15)', border: '#9e9e9e' },
      { id: 'great', label: 'Great', color: '#4caf50', bg: 'rgba(76, 175, 80, 0.15)', border: '#4caf50' },
      { id: 'rare', label: 'Rare', color: '#2196f3', bg: 'rgba(33, 150, 243, 0.15)', border: '#2196f3' },
      { id: 'epic', label: 'Epic', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7' },
      { id: 'epic_1', label: 'Epic +1', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.18)', border: '#c084fc', badge: '1' },
      { id: 'epic_2', label: 'Epic +2', color: '#d8b4fe', bg: 'rgba(216, 180, 254, 0.22)', border: '#d8b4fe', badge: '2' },
      { id: 'gold', label: 'Gold', color: '#ffb300', bg: 'rgba(255, 179, 0, 0.18)', border: '#ffb300' },
      { id: 'gold_1', label: 'Gold +1', color: '#ffa000', bg: 'rgba(255, 160, 0, 0.22)', border: '#ffa000', badge: '1' },
      { id: 'gold_2', label: 'Gold +2', color: '#ff8f00', bg: 'rgba(255, 143, 0, 0.25)', border: '#ff8f00', badge: '2' },
      { id: 'gold_3', label: 'Gold +3', color: '#ff6f00', bg: 'rgba(255, 111, 0, 0.28)', border: '#ff6f00', badge: '3' },
      { id: 'mythic', label: 'Mythic (Red)', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.25)', border: '#ef4444', badge: '◆' },
    ],

    // Точні вимоги кожного кроку з таблиці користувача
    stepRequirements: {
      // 1. Common -> Great (1 база + 2 такі самі Common)
      'common': {
        sameCopies: 2,
        sameRarity: 'Common',
        fodderCopies: 0,
        fodderRarity: '',
        gold: 5000,
        scrolls: 10,
        other: 0,
        description: '2 такі ж самі Common копії'
      },
      // 2. Great -> Rare (1 база + 2 такі самі Great)
      'great': {
        sameCopies: 2,
        sameRarity: 'Great',
        fodderCopies: 0,
        fodderRarity: '',
        gold: 15000,
        scrolls: 25,
        other: 0,
        description: '2 такі ж самі Great копії'
      },
      // 3. Rare -> Epic (1 база + 2 такі самі Rare)
      'rare': {
        sameCopies: 2,
        sameRarity: 'Rare',
        fodderCopies: 0,
        fodderRarity: '',
        gold: 40000,
        scrolls: 50,
        other: 1,
        description: '2 такі ж самі Rare копії'
      },
      // 4. Epic -> Epic +1 (1 база + 1 будь-який Epic корм)
      'epic': {
        sameCopies: 0,
        sameRarity: '',
        fodderCopies: 1,
        fodderRarity: 'Epic',
        gold: 80000,
        scrolls: 80,
        other: 2,
        description: '1 будь-який Epic (корм)'
      },
      // 5. Epic +1 -> Epic +2 (1 база + 2 будь-які Epic корм)
      'epic_1': {
        sameCopies: 0,
        sameRarity: '',
        fodderCopies: 2,
        fodderRarity: 'Epic',
        gold: 120000,
        scrolls: 120,
        other: 3,
        description: '2 будь-які Epic (корм)'
      },
      // 6. Epic +2 -> Gold (1 база + 1 однаковий Epic +2)
      'epic_2': {
        sameCopies: 1,
        sameRarity: 'Epic +2',
        fodderCopies: 0,
        fodderRarity: '',
        gold: 180000,
        scrolls: 160,
        other: 5,
        description: '1 такий самий Epic +2'
      },
      // 7. Gold -> Gold +1 (1 база + 1 будь-який Gold корм)
      'gold': {
        sameCopies: 0,
        sameRarity: '',
        fodderCopies: 1,
        fodderRarity: 'Gold',
        gold: 240000,
        scrolls: 200,
        other: 8,
        description: '1 будь-який Gold (корм)'
      },
      // 8. Gold +1 -> Gold +2 (1 база + 1 будь-який Gold корм)
      'gold_1': {
        sameCopies: 0,
        sameRarity: '',
        fodderCopies: 1,
        fodderRarity: 'Gold',
        gold: 300000,
        scrolls: 250,
        other: 10,
        description: '1 будь-який Gold (корм)'
      },
      // 9. Gold +2 -> Gold +3 (1 база + 2 будь-які Gold корм)
      'gold_2': {
        sameCopies: 0,
        sameRarity: '',
        fodderCopies: 2,
        fodderRarity: 'Gold',
        gold: 400000,
        scrolls: 320,
        other: 15,
        description: '2 будь-які Gold (корм)'
      },
      // 10. Gold +3 -> Mythic (1 база + 1 однаковий Gold +3)
      'gold_3': {
        sameCopies: 1,
        sameRarity: 'Gold +3',
        fodderCopies: 0,
        fodderRarity: '',
        gold: 600000,
        scrolls: 450,
        other: 25,
        description: '1 такий самий Gold +3'
      },
    }
  },

  runes: {
    maxLevel: 20,
    stepRequirements: {
      1: { fragments: 5, gold: 10000, runeDust: 2 },
      2: { fragments: 8, gold: 20000, runeDust: 3 },
      3: { fragments: 12, gold: 35000, runeDust: 5 },
      4: { fragments: 15, gold: 50000, runeDust: 7 },
      5: { fragments: 20, gold: 75000, runeDust: 10 },
      6: { fragments: 25, gold: 105000, runeDust: 12 },
      7: { fragments: 30, gold: 140000, runeDust: 15 },
      8: { fragments: 38, gold: 180000, runeDust: 18 },
      9: { fragments: 45, gold: 230000, runeDust: 22 },
      10: { fragments: 55, gold: 290000, runeDust: 28 },
      11: { fragments: 65, gold: 360000, runeDust: 35 },
      12: { fragments: 75, gold: 440000, runeDust: 42 },
      13: { fragments: 90, gold: 530000, runeDust: 50 },
      14: { fragments: 105, gold: 640000, runeDust: 60 },
      15: { fragments: 125, gold: 760000, runeDust: 72 },
      16: { fragments: 150, gold: 900000, runeDust: 85 },
      17: { fragments: 180, gold: 1060000, runeDust: 100 },
      18: { fragments: 215, gold: 1250000, runeDust: 120 },
      19: { fragments: 260, gold: 1500000, runeDust: 150 },
    }
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
  // Weapon
  { id: 'brightspear', name: 'Brightspear', slot: 'Weapon', icon: '⚡' },
  { id: 'demon_blade', name: 'Demon Blade: Rain', slot: 'Weapon', icon: '🗡️' },
  { id: 'death_scythe', name: 'Death Scythe', slot: 'Weapon', icon: '🪓' },
  { id: 'stalker_staff', name: 'Stalker Staff', slot: 'Weapon', icon: '🪄' },
  { id: 'brave_bow', name: 'Brave Bow', slot: 'Weapon', icon: '🏹' },
  { id: 'tornado', name: 'Tornado (Boomerang)', slot: 'Weapon', icon: '🌀' },
  { id: 'saw_blade', name: 'Saw Blade', slot: 'Weapon', icon: '🪚' },
  { id: 'mini_atreus', name: 'Mini Atreus', slot: 'Weapon', icon: '🎸' },

  // Armor
  { id: 'golden_chestplate', name: 'Golden Chestplate', slot: 'Armor', icon: '🛡️' },
  { id: 'phantom_cloak', name: 'Phantom Cloak', slot: 'Armor', icon: '🥋' },
  { id: 'vest_of_dexterity', name: 'Vest of Dexterity', slot: 'Armor', icon: '🦺' },
  { id: 'shadow_robe', name: 'Shadow Robe', slot: 'Armor', icon: '🧥' },
  { id: 'void_robe', name: 'Void Robe', slot: 'Armor', icon: '🌌' },
  { id: 'bright_robe', name: 'Bright Robe', slot: 'Armor', icon: '✨' },

  // Ring
  { id: 'lion_ring', name: 'Lion Ring', slot: 'Ring', icon: '🦁' },
  { id: 'bull_ring', name: 'Bull Ring', slot: 'Ring', icon: '🐂' },
  { id: 'dragon_ring', name: 'Dragon Ring', slot: 'Ring', icon: '🐉' },
  { id: 'wolf_ring', name: 'Wolf Ring', slot: 'Ring', icon: '🐺' },
  { id: 'serpent_ring', name: 'Serpent Ring', slot: 'Ring', icon: '🐍' },
  { id: 'bear_ring', name: 'Bear Ring', slot: 'Ring', icon: '🐻' },

  // Bracelet
  { id: 'quickshot_bracelet', name: 'Quickshot Bracelet', slot: 'Bracelet', icon: '⚡' },
  { id: 'invincible_bracelet', name: 'Invincible Bracelet', slot: 'Bracelet', icon: '🛡️' },
  { id: 'shield_bracelet', name: 'Shield Bracelet', slot: 'Bracelet', icon: '🔰' },
  { id: 'thunder_bracelet', name: 'Thunder Bracelet', slot: 'Bracelet', icon: '🌩️' },
  { id: 'frozen_bracelet', name: 'Frozen Bracelet', slot: 'Bracelet', icon: '❄️' },

  // Necklace / Locket
  { id: 'angel_locket', name: 'Angel Locket', slot: 'Necklace', icon: '🪽' },
  { id: 'bloodthirsty_locket', name: 'Bloodthirsty Locket', slot: 'Necklace', icon: '🩸' },
  { id: 'counterattack_charm', name: 'Counterattack Charm', slot: 'Necklace', icon: '🗡️' },
  { id: 'agile_locket', name: 'Agile Locket', slot: 'Necklace', icon: '💨' },
  { id: 'iron_locket', name: 'Iron Locket', slot: 'Necklace', icon: '⛓️' },

  // Spellbook
  { id: 'giants_contract', name: "Giant's Contract", slot: 'Spellbook', icon: '📜' },
  { id: 'arcane_archer', name: 'Arcane Archer', slot: 'Spellbook', icon: '🏹' },
  { id: 'enlightenment', name: 'Enlightenment', slot: 'Spellbook', icon: '📖' },
  { id: 'art_of_combat', name: 'Art of Combat', slot: 'Spellbook', icon: '⚔️' },
  { id: 'ice_realm', name: 'Ice Realm', slot: 'Spellbook', icon: '❄️' },
];

export const RUNES_CATALOG = [
  { id: 'courage', name: 'Руна Мужності (Courage Rune)', icon: '🦁', color: '#ff5722' },
  { id: 'power', name: 'Руна Сили (Power Rune)', icon: '⚡', color: '#ff9800' },
  { id: 'recovery', name: 'Руна Зцілення (Recovery Rune)', icon: '💚', color: '#4caf50' },
  { id: 'luck', name: 'Руна Удачі (Luck Rune)', icon: '🍀', color: '#00bcd4' },
  { id: 'resistance', name: 'Руна Опірності (Resistance Rune)', icon: '🛡️', color: '#9c27b0' },
];
