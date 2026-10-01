import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateUpgradeChain,
  calculateUpgradeCost,
  calculateMissingResources,
  calculateProgress,
  calculateTotalPlan,
  getFarmingPriority
} from './calculator.js';
import { DEFAULT_GAME_DATA } from '../data/defaultGameData.js';

test('1. calculateUpgradeChain - Equipment Multi-step chain (Gold +2 -> Legendary +0)', () => {
  const result = calculateUpgradeChain('gold_2', 'legendary_0', 'equipment', DEFAULT_GAME_DATA);
  assert.equal(result.isValid, true);
  assert.equal(result.isAlreadyAtTarget, false);
  // gold_2 -> gold_3 -> gold_4 -> gold_5 -> legendary_0 (4 steps)
  assert.equal(result.steps.length, 4);
  assert.equal(result.steps[0].from.id, 'gold_2');
  assert.equal(result.steps[0].to.id, 'gold_3');
  assert.equal(result.steps[3].from.id, 'gold_5');
  assert.equal(result.steps[3].to.id, 'legendary_0');
});

test('2. calculateUpgradeChain - Edge case: Current equals Target', () => {
  const result = calculateUpgradeChain('gold_2', 'gold_2', 'equipment', DEFAULT_GAME_DATA);
  assert.equal(result.isValid, false);
  assert.equal(result.isAlreadyAtTarget, true);
  assert.equal(result.steps.length, 0);
});

test('3. calculateUpgradeChain - Edge case: Current higher than Target', () => {
  const result = calculateUpgradeChain('legendary_0', 'gold_2', 'equipment', DEFAULT_GAME_DATA);
  assert.equal(result.isValid, false);
  assert.equal(result.isInvalidTarget, true);
  assert.equal(result.steps.length, 0);
});

test('4. calculateUpgradeCost - Sums up all intermediate steps correctly', () => {
  // gold_2 (req: 2 copies, 200k gold, 90 scrolls, 8 other)
  // gold_3 (req: 2 copies, 230k gold, 110 scrolls, 10 other)
  // gold_4 (req: 3 copies, 280k gold, 130 scrolls, 12 other)
  // gold_5 (req: 3 copies, 350k gold, 160 scrolls, 15 other)
  // Total: copies = 2+2+3+3 = 10, gold = 200k+230k+280k+350k = 1,060,000
  const result = calculateUpgradeCost('gold_2', 'legendary_0', 'equipment', DEFAULT_GAME_DATA);
  assert.equal(result.isValid, true);
  assert.equal(result.stepsCount, 4);
  assert.equal(result.totalRequired.copies, 10);
  assert.equal(result.totalRequired.gold, 1060000);
  assert.equal(result.totalRequired.scrolls, 90 + 110 + 130 + 160);
  assert.equal(result.totalRequired.other, 8 + 10 + 12 + 15);
  // Next step (first step only)
  assert.equal(result.nextStepRequired.copies, 2);
  assert.equal(result.nextStepRequired.gold, 200000);
});

test('5. calculateUpgradeCost - Runes chain (Level 4 -> Level 8)', () => {
  // Lv 4->5 (15 frags, 50k gold, 7 dust)
  // Lv 5->6 (20 frags, 75k gold, 10 dust)
  // Lv 6->7 (25 frags, 105k gold, 12 dust)
  // Lv 7->8 (30 frags, 140k gold, 15 dust)
  // Total: fragments = 90, gold = 370k, runeDust = 44
  const result = calculateUpgradeCost(4, 8, 'runes', DEFAULT_GAME_DATA);
  assert.equal(result.isValid, true);
  assert.equal(result.stepsCount, 4);
  assert.equal(result.totalRequired.fragments, 90);
  assert.equal(result.totalRequired.gold, 370000);
  assert.equal(result.totalRequired.runeDust, 44);
});

test('6. calculateMissingResources - Correctly computes missing, never negative, accurate statuses', () => {
  const required = { copies: 5, gold: 500000, scrolls: 100 };
  const owned = { copies: 7, gold: 300000, scrolls: 0 };

  const result = calculateMissingResources(required, owned);
  assert.equal(result.missing.copies, 0); // owned 7 >= 5, missing should be 0, never negative
  assert.equal(result.missing.gold, 200000);
  assert.equal(result.missing.scrolls, 100);

  assert.equal(result.status.copies, 'sufficient');
  assert.equal(result.status.gold, 'partial');
  assert.equal(result.status.scrolls, 'missing');
  assert.equal(result.allSufficient, false);
});

test('7. calculateMissingResources - All sufficient (Ready to upgrade)', () => {
  const required = { copies: 2, gold: 150000 };
  const owned = { copies: 5, gold: 200000 };

  const result = calculateMissingResources(required, owned);
  assert.equal(result.allSufficient, true);
  assert.equal(result.missing.copies, 0);
  assert.equal(result.missing.gold, 0);
});

test('8. calculateProgress - Correct percentage calculations', () => {
  // 100% when all owned exceed required
  const p1 = calculateProgress({ copies: 2, gold: 1000 }, { copies: 3, gold: 2000 });
  assert.equal(p1, 100);

  // 0% when nothing owned
  const p2 = calculateProgress({ copies: 2, gold: 1000 }, { copies: 0, gold: 0 });
  assert.equal(p2, 0);

  // 50% when half fulfilled
  const p3 = calculateProgress({ copies: 4 }, { copies: 2 });
  assert.equal(p3, 50);
});

test('9. calculateTotalPlan - Aggregates multiple equipment & runes goals', () => {
  const equipmentItems = [
    { id: 'item1', name: 'Brightspear', slot: 'Weapon', currentTier: 'gold_2', targetTier: 'gold_3', ownedCopies: 3 },
    { id: 'item2', name: 'Golden Chestplate', slot: 'Armor', currentTier: 'gold_1', targetTier: 'gold_2', ownedCopies: 1 }
  ];
  const runeItems = [
    { id: 'rune1', name: 'Courage Rune', currentLevel: 4, targetLevel: 5, ownedFragments: 10 }
  ];
  const globalResources = {
    gold: 250000,
    scrolls: 200,
    runeDust: 5
  };

  const totalPlan = calculateTotalPlan(equipmentItems, runeItems, globalResources, DEFAULT_GAME_DATA);
  assert.equal(totalPlan.hasActiveGoals, true);
  assert.equal(totalPlan.equipmentPlan.length, 2);
  assert.equal(totalPlan.runePlan.length, 1);

  // Gold required: gold_2->gold_3 (200k) + gold_1->gold_2 (180k) + rune 4->5 (50k) = 430k
  assert.equal(totalPlan.totalRequired.gold, 430000);
  // Gold owned: 250k
  assert.equal(totalPlan.globalMissing.missing.gold, 180000);
});

test('10. getFarmingPriority - Orders priorities cleanly with specific item copies first', () => {
  const equipmentItems = [
    { id: 'item1', name: 'Brightspear', slot: 'Weapon', currentTier: 'gold_2', targetTier: 'gold_3', ownedCopies: 0 },
  ];
  const runeItems = [
    { id: 'rune1', name: 'Courage Rune', currentLevel: 4, targetLevel: 5, ownedFragments: 5 }
  ];
  const globalResources = { gold: 10000, scrolls: 0, runeDust: 0 };

  const totalPlan = calculateTotalPlan(equipmentItems, runeItems, globalResources, DEFAULT_GAME_DATA);
  const priorities = getFarmingPriority(totalPlan);

  assert.ok(priorities.length > 0);
  // First priority should be item copies
  assert.equal(priorities[0].type, 'copies');
  assert.match(priorities[0].name, /Brightspear/);
  // Next is rune fragments
  assert.equal(priorities[1].type, 'fragments');
  // Next scrolls & gold
  const goldPriority = priorities.find(p => p.type === 'gold');
  assert.ok(goldPriority);
  assert.ok(goldPriority.need > 0);
});
