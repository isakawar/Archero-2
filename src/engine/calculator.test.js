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

test('1. calculateUpgradeChain - Equipment Multi-step chain (Gold +2 -> Mythic)', () => {
  const result = calculateUpgradeChain('gold_2', 'mythic', 'equipment', DEFAULT_GAME_DATA);
  assert.equal(result.isValid, true);
  assert.equal(result.isAlreadyAtTarget, false);
  // gold_2 -> gold_3 -> mythic (2 steps)
  assert.equal(result.steps.length, 2);
  assert.equal(result.steps[0].from.id, 'gold_2');
  assert.equal(result.steps[0].to.id, 'gold_3');
  assert.equal(result.steps[1].from.id, 'gold_3');
  assert.equal(result.steps[1].to.id, 'mythic');
});

test('2. calculateUpgradeChain - Edge case: Current equals Target', () => {
  const result = calculateUpgradeChain('gold_2', 'gold_2', 'equipment', DEFAULT_GAME_DATA);
  assert.equal(result.isValid, false);
  assert.equal(result.isAlreadyAtTarget, true);
  assert.equal(result.steps.length, 0);
});

test('3. calculateUpgradeChain - Edge case: Current higher than Target', () => {
  const result = calculateUpgradeChain('mythic', 'gold_2', 'equipment', DEFAULT_GAME_DATA);
  assert.equal(result.isValid, false);
  assert.equal(result.isInvalidTarget, true);
  assert.equal(result.steps.length, 0);
});

test('4. calculateUpgradeCost - Official fusion requirements (Epic -> Gold)', () => {
  // epic -> epic_1 (1 fodder Epic)
  // epic_1 -> epic_2 (2 fodder Epic)
  // epic_2 -> gold (1 same Epic +2)
  const result = calculateUpgradeCost('epic', 'gold', 'equipment', DEFAULT_GAME_DATA);
  assert.equal(result.isValid, true);
  assert.equal(result.stepsCount, 3);
  assert.equal(result.totalRequired.sameCopies, 1);
  assert.equal(result.totalRequired.fodderCopies, 3);
  assert.equal(result.totalRequired.copies, 4);
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
  assert.equal(result.missing.copies, 0);
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
  const p1 = calculateProgress({ copies: 2, gold: 1000 }, { copies: 3, gold: 2000 });
  assert.equal(p1, 100);

  const p2 = calculateProgress({ copies: 2, gold: 1000 }, { copies: 0, gold: 0 });
  assert.equal(p2, 0);

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
  assert.equal(priorities[0].type, 'fodder');
  const goldPriority = priorities.find(p => p.type === 'gold');
  assert.ok(goldPriority);
});
