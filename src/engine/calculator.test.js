import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateUpgradeChain,
  calculateUpgradeCost,
  calculateMissingResources,
  calculateProgress,
  calculateTotalPlan,
  getFarmingPriority,
  calculateMultiTierInventory
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
  const result = calculateUpgradeCost('epic', 'gold', 'equipment', DEFAULT_GAME_DATA);
  assert.equal(result.isValid, true);
  assert.equal(result.stepsCount, 3);
  assert.equal(result.totalRequired.sameCopies, 1);
  assert.equal(result.totalRequired.fodderCopies, 3);
  assert.equal(result.totalRequired.copies, 4);
});

test('5. calculateUpgradeCost - Runes fusion chain (Gold 1 -> Gold 2)', () => {
  const result = calculateUpgradeCost('gold_1', 'gold_2', 'runes', DEFAULT_GAME_DATA);
  assert.equal(result.isValid, true);
  assert.equal(result.stepsCount, 1);
  assert.equal(result.totalRequired.fodderCopies, 1);
  assert.equal(result.totalRequired.gold, 300000);
});

test('6. calculateMultiTierInventory - User scenario (Gold 1 -> Gold 2 with 2 Green and 1 Blue)', () => {
  // 1 Green (Great) = 3 Commons
  // 1 Blue (Rare) = 9 Commons
  // User has: 2 Green (6) + 1 Blue (9) = 15 Commons
  // Cost Gold 1 -> Gold 2 = 648 - 432 = 216 Commons
  const inv = { great: 2, rare: 1 };
  const result = calculateMultiTierInventory('gold_1', 'gold_2', inv);

  assert.equal(result.isValid, true);
  assert.equal(result.requiredCommonValue, 216);
  assert.equal(result.ownedCommonValue, 15);
  assert.equal(result.missingCommonValue, 201);
  assert.equal(result.isReady, false);
  assert.equal(result.progressPercent, Math.round((15 / 216) * 100)); // 7%
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

test('9. calculateTotalPlan - Aggregates multiple equipment & runes goals with multi-tier inventory', () => {
  const equipmentItems = [
    { id: 'item1', name: 'Brightspear', slot: 'Weapon', currentTier: 'gold_1', targetTier: 'gold_2', inventory: { great: 2 } },
    { id: 'item2', name: 'Golden Chestplate', slot: 'Armor', currentTier: 'gold_1', targetTier: 'gold_3', inventory: { great: 3 } }
  ];
  const runeItems = [
    { id: 'rune1', name: 'Arrow of Echoes', currentTier: 'gold_1', targetTier: 'gold_2', inventory: { great: 2, rare: 1 } }
  ];
  const globalResources = {
    gold: 250000,
    scrolls: 200
  };

  const totalPlan = calculateTotalPlan(equipmentItems, runeItems, globalResources, DEFAULT_GAME_DATA);
  assert.equal(totalPlan.hasActiveGoals, true);
  assert.equal(totalPlan.equipmentPlan.length, 2);
  assert.equal(totalPlan.runePlan.length, 1);
});

test('10. getFarmingPriority - Orders priorities cleanly with specific item copies first', () => {
  const equipmentItems = [
    { id: 'item1', name: 'Brightspear', slot: 'Weapon', currentTier: 'gold_1', targetTier: 'gold_2', inventory: { great: 0 } },
  ];
  const runeItems = [
    { id: 'rune1', name: 'Arrow of Echoes', currentTier: 'gold_1', targetTier: 'gold_2', inventory: { great: 1 } }
  ];
  const globalResources = { gold: 10000, scrolls: 0 };

  const totalPlan = calculateTotalPlan(equipmentItems, runeItems, globalResources, DEFAULT_GAME_DATA);
  const priorities = getFarmingPriority(totalPlan);

  assert.ok(priorities.length > 0);
  assert.equal(priorities[0].type, 'copies');
  const goldPriority = priorities.find(p => p.type === 'gold');
  assert.ok(goldPriority);
});
