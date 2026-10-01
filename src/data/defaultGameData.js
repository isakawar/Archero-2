/**
 * ============================================================================
 * ARCHERO 2 - GAME UPGRADE DATA (MOCK DATA)
 * ============================================================================
 * 
 * ВАЖЛИВО:
 * Усі значення тут є тестовими (MOCK DATA) для демонстрації логіки.
 * Ви можете легко змінити будь-які вартості, рівні, ресурси або назви прямо тут
 * або через інтерфейс у вкладці "[⚙️ Дані прокачки]".
 * 
 * Структура:
 * - equipment.tiers: послідовність рідкостей / рівнів спорядження
 * - equipment.steps: вартість переходу з кожного рівня на наступний
 * - runes.levels: рівні рун та вартість кожного кроку (Lv N -> Lv N+1)
 * ============================================================================
 */

export const DEFAULT_GAME_DATA = {
  version: '1.0.0',
  description: 'Archero 2 Upgrade Configuration (MOCK DATA)',

  equipment: {
    // Порядок рівнів/рідкостей спорядження (від найнижчого до найвищого)
    tiers: [
      { id: 'common', label: 'Common', color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.15)', border: '#9e9e9e' },
      { id: 'great', label: 'Great', color: '#4caf50', bg: 'rgba(76, 175, 80, 0.15)', border: '#4caf50' },
      { id: 'rare', label: 'Rare', color: '#2196f3', bg: 'rgba(33, 150, 243, 0.15)', border: '#2196f3' },
      { id: 'epic', label: 'Epic', color: '#9c27b0', bg: 'rgba(156, 39, 176, 0.15)', border: '#9c27b0' },
      { id: 'perfect_epic', label: 'Perfect Epic', color: '#e91e63', bg: 'rgba(233, 30, 99, 0.15)', border: '#e91e63' },
      { id: 'gold_0', label: 'Gold +0', color: '#ffc107', bg: 'rgba(255, 193, 7, 0.15)', border: '#ffc107' },
      { id: 'gold_1', label: 'Gold +1', color: '#ffb300', bg: 'rgba(255, 179, 0, 0.18)', border: '#ffb300' },
      { id: 'gold_2', label: 'Gold +2', color: '#ffa000', bg: 'rgba(255, 160, 0, 0.22)', border: '#ffa000' },
      { id: 'gold_3', label: 'Gold +3', color: '#ff8f00', bg: 'rgba(255, 143, 0, 0.25)', border: '#ff8f00' },
      { id: 'gold_4', label: 'Gold +4', color: '#ff6f00', bg: 'rgba(255, 111, 0, 0.28)', border: '#ff6f00' },
      { id: 'gold_5', label: 'Gold +5', color: '#ff5722', bg: 'rgba(255, 87, 34, 0.28)', border: '#ff5722' },
      { id: 'legendary_0', label: 'Legendary +0', color: '#ff3d00', bg: 'rgba(255, 61, 0, 0.3)', border: '#ff3d00' },
      { id: 'legendary_1', label: 'Legendary +1', color: '#d500f9', bg: 'rgba(213, 0, 249, 0.3)', border: '#d500f9' },
      { id: 'legendary_2', label: 'Legendary +2', color: '#aa00ff', bg: 'rgba(170, 0, 255, 0.35)', border: '#aa00ff' },
      { id: 'legendary_3', label: 'Legendary +3', color: '#651fff', bg: 'rgba(101, 31, 255, 0.35)', border: '#651fff' },
      { id: 'mythic', label: 'Mythic', color: '#ff1744', bg: 'rgba(255, 23, 68, 0.4)', border: '#ff1744' },
    ],

    // MOCK DATA: Вартість переходу з кожного рівня на наступний
    // key: id поточного рівня -> value: вимоги для переходу на наступний рівень
    stepRequirements: {
      'common': { copies: 2, gold: 5000, scrolls: 5, other: 0 },
      'great': { copies: 2, gold: 15000, scrolls: 10, other: 0 },
      'rare': { copies: 2, gold: 35000, scrolls: 20, other: 1 },
      'epic': { copies: 2, gold: 75000, scrolls: 35, other: 2 },
      'perfect_epic': { copies: 3, gold: 120000, scrolls: 50, other: 3 },
      'gold_0': { copies: 2, gold: 150000, scrolls: 60, other: 5 },
      'gold_1': { copies: 2, gold: 180000, scrolls: 75, other: 6 },
      'gold_2': { copies: 2, gold: 200000, scrolls: 90, other: 8 },
      'gold_3': { copies: 2, gold: 230000, scrolls: 110, other: 10 },
      'gold_4': { copies: 3, gold: 280000, scrolls: 130, other: 12 },
      'gold_5': { copies: 3, gold: 350000, scrolls: 160, other: 15 },
      'legendary_0': { copies: 3, gold: 450000, scrolls: 200, other: 20 },
      'legendary_1': { copies: 3, gold: 550000, scrolls: 240, other: 25 },
      'legendary_2': { copies: 4, gold: 700000, scrolls: 300, other: 30 },
      'legendary_3': { copies: 4, gold: 900000, scrolls: 380, other: 40 },
    }
  },

  runes: {
    // Максимальний рівень рун у грі
    maxLevel: 20,
    
    // MOCK DATA: Вартість переходу з кожного рівня на наступний
    // key: поточний рівень -> value: вимоги для переходу на (поточний + 1)
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

// Каталог типів спорядження (слоти)
export const EQUIPMENT_SLOTS = [
  { id: 'Weapon', label: 'Зброя (Weapon)', icon: '⚔️', scrollName: 'Weapon Scrolls' },
  { id: 'Armor', label: 'Броня (Armor)', icon: '🛡️', scrollName: 'Armor Scrolls' },
  { id: 'Ring', label: 'Перстень (Ring)', icon: '💍', scrollName: 'Ring Scrolls' },
  { id: 'Bracelet', label: 'Браслет (Bracelet)', icon: '📿', scrollName: 'Bracelet Scrolls' },
  { id: 'Necklace', label: 'Амулет (Necklace)', icon: '🪬', scrollName: 'Necklace Scrolls' },
  { id: 'Spellbook', label: 'Книга (Spellbook)', icon: '📖', scrollName: 'Spellbook Scrolls' },
];

// Каталог відомих предметів спорядження у грі Archero 2
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

// Каталог рун
export const RUNES_CATALOG = [
  { id: 'courage', name: 'Руна Мужності (Courage Rune)', icon: '🦁', color: '#ff5722' },
  { id: 'power', name: 'Руна Сили (Power Rune)', icon: '⚡', color: '#ff9800' },
  { id: 'recovery', name: 'Руна Зцілення (Recovery Rune)', icon: '💚', color: '#4caf50' },
  { id: 'luck', name: 'Руна Удачі (Luck Rune)', icon: '🍀', color: '#00bcd4' },
  { id: 'resistance', name: 'Руна Опірності (Resistance Rune)', icon: '🛡️', color: '#9c27b0' },
];
