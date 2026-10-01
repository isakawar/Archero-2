/**
 * ============================================================================
 * ARCHERO 2 - PURE CALCULATOR ENGINE
 * ============================================================================
 * Чисті функції для розрахунку витрат, ланцюжків прокачки, багаторівневого
 * інвентаря копій (Common, Great, Rare, Epic, Gold...), дефіциту ресурсів
 * та пріоритетів фарму.
 * ============================================================================
 */

export const TIER_COMMON_VALUES = {
  'common': 1,
  'great': 3,
  'rare': 9,
  'epic': 27,
  'epic_1': 54,
  'epic_2': 108,
  'gold': 216,
  'gold_1': 432,
  'gold_2': 648,
  'gold_3': 1080,
  'mythic': 2160,
};

export function getEquipmentTier(tierId, gameData, type = 'equipment') {
  const tiers = gameData?.[type]?.tiers || gameData?.equipment?.tiers || [];
  return tiers.find(t => t.id === tierId) || null;
}

export function getEquipmentTierIndex(tierId, gameData, type = 'equipment') {
  const tiers = gameData?.[type]?.tiers || gameData?.equipment?.tiers || [];
  return tiers.findIndex(t => t.id === tierId) ?? -1;
}

/**
 * 1. Розраховує покроковий ланцюг прокачки (Upgrade Chain)
 */
export function calculateUpgradeChain(fromId, toId, type = 'equipment', gameData) {
  const tiers = gameData?.[type]?.tiers || gameData?.equipment?.tiers || [];
  const fromIndex = tiers.findIndex(t => t.id === fromId);
  const toIndex = tiers.findIndex(t => t.id === toId);

  if (fromIndex === -1 || toIndex === -1) {
    return { isValid: false, isAlreadyAtTarget: false, isInvalidTarget: true, steps: [] };
  }

  if (fromIndex === toIndex) {
    return { isValid: false, isAlreadyAtTarget: true, isInvalidTarget: false, steps: [] };
  }

  if (fromIndex > toIndex) {
    return { isValid: false, isAlreadyAtTarget: false, isInvalidTarget: true, steps: [] };
  }

  const steps = [];
  const stepReqs = gameData?.[type]?.stepRequirements || gameData?.equipment?.stepRequirements || {};

  for (let i = fromIndex; i < toIndex; i++) {
    const currentTier = tiers[i];
    const nextTier = tiers[i + 1];
    const req = stepReqs[currentTier.id] || { copies: 1, gold: 10000, scrolls: 10, other: 0 };

    const sameCopies = Math.max(0, Number(req.sameCopies !== undefined ? req.sameCopies : req.copies) || 0);
    const fodderCopies = Math.max(0, Number(req.fodderCopies) || 0);
    const totalCopies = sameCopies + fodderCopies;

    steps.push({
      stepIndex: i - fromIndex + 1,
      from: currentTier,
      to: nextTier,
      description: req.description || `${totalCopies} копій`,
      required: {
        copies: totalCopies,
        sameCopies,
        sameRarity: req.sameRarity || currentTier.label,
        fodderCopies,
        fodderRarity: req.fodderRarity || '',
        gold: Math.max(0, Number(req.gold) || 0),
        scrolls: Math.max(0, Number(req.scrolls) || 0),
        other: Math.max(0, Number(req.other) || 0)
      }
    });
  }

  return { isValid: true, isAlreadyAtTarget: false, isInvalidTarget: false, steps };
}

/**
 * 2. Розраховує сумарну вартість прокачки до цілі та першого кроку
 */
export function calculateUpgradeCost(fromId, toId, type = 'equipment', gameData) {
  const chainResult = calculateUpgradeChain(fromId, toId, type, gameData);

  if (!chainResult.isValid) {
    return {
      isValid: false,
      isAlreadyAtTarget: chainResult.isAlreadyAtTarget,
      isInvalidTarget: chainResult.isInvalidTarget,
      stepsCount: 0,
      steps: [],
      totalRequired: { copies: 0, sameCopies: 0, fodderCopies: 0, gold: 0, scrolls: 0, other: 0 },
      nextStepRequired: null
    };
  }

  const { steps } = chainResult;
  const nextStepRequired = steps.length > 0 ? steps[0].required : null;

  const totalRequired = steps.reduce(
    (acc, step) => {
      acc.copies += step.required.copies;
      acc.sameCopies += step.required.sameCopies;
      acc.fodderCopies += step.required.fodderCopies;
      acc.gold += step.required.gold;
      acc.scrolls += step.required.scrolls;
      acc.other += step.required.other;
      return acc;
    },
    { copies: 0, sameCopies: 0, fodderCopies: 0, gold: 0, scrolls: 0, other: 0 }
  );

  return {
    isValid: true,
    isAlreadyAtTarget: false,
    isInvalidTarget: false,
    stepsCount: steps.length,
    steps,
    totalRequired,
    nextStepRequired
  };
}

/**
 * 3. Розрахунок багаторівневого інвентаря (Multi-Tier Inventory)
 * Дозволяє вказати, скільки у гравця зелених, синіх, фіолетових тощо рун чи зброї
 * і точно розраховує прогрес та еквівалент!
 */
export function calculateMultiTierInventory(fromTier, toTier, inventory = {}) {
  const fromVal = TIER_COMMON_VALUES[fromTier] || 1;
  const toVal = TIER_COMMON_VALUES[toTier] || 1;

  if (toVal <= fromVal) {
    return {
      isValid: false,
      requiredCommonValue: 0,
      ownedCommonValue: 0,
      missingCommonValue: 0,
      progressPercent: 100,
      isReady: true,
      canFuse: []
    };
  }

  const requiredCommonValue = toVal - fromVal;

  let ownedCommonValue = 0;
  for (const [tierKey, count] of Object.entries(inventory)) {
    const num = Math.max(0, Number(count) || 0);
    const tierVal = TIER_COMMON_VALUES[tierKey] || 0;
    ownedCommonValue += num * tierVal;
  }

  const missingCommonValue = Math.max(0, requiredCommonValue - ownedCommonValue);
  const progressPercent = Math.min(100, Math.round((ownedCommonValue / requiredCommonValue) * 100));
  const isReady = ownedCommonValue >= requiredCommonValue;

  // Що гравець може злити просто зараз із наявного інвентаря:
  const canFuse = [];
  if ((inventory.common || 0) >= 3) {
    const craftable = Math.floor((inventory.common || 0) / 3);
    canFuse.push(`Можна злити ${craftable * 3} Common (Сірих) ➔ ${craftable} Great (Зелена)`);
  }
  if ((inventory.great || 0) >= 3) {
    const craftable = Math.floor((inventory.great || 0) / 3);
    canFuse.push(`Можна злити ${craftable * 3} Great (Зелених) ➔ ${craftable} Rare (Синя)`);
  }
  if ((inventory.rare || 0) >= 3) {
    const craftable = Math.floor((inventory.rare || 0) / 3);
    canFuse.push(`Можна злити ${craftable * 3} Rare (Синіх) ➔ ${craftable} Epic (Фіолетова)`);
  }

  return {
    isValid: true,
    requiredCommonValue,
    ownedCommonValue,
    missingCommonValue,
    progressPercent,
    isReady,
    canFuse,
    // Еквіваленти того, чого не вистачає
    missingEquivalents: {
      gold: (missingCommonValue / 216).toFixed(1).replace(/\.0$/, ''),
      epic: (missingCommonValue / 27).toFixed(1).replace(/\.0$/, ''),
      rare: (missingCommonValue / 9).toFixed(1).replace(/\.0$/, ''),
      great: (missingCommonValue / 3).toFixed(1).replace(/\.0$/, ''),
      common: missingCommonValue
    }
  };
}

/**
 * 4. Розраховує різницю (Missing Resources) між потрібним і наявним
 */
export function calculateMissingResources(required = {}, owned = {}) {
  const missing = {};
  const status = {};
  let allSufficient = true;
  let partialCount = 0;
  let missingCount = 0;

  for (const key of Object.keys(required)) {
    if (key === 'sameRarity' || key === 'fodderRarity') continue;

    const req = Math.max(0, Number(required[key]) || 0);
    const own = Math.max(0, Number(owned[key]) || 0);
    const diff = Math.max(0, req - own);

    missing[key] = diff;

    if (req === 0 || own >= req) {
      status[key] = 'sufficient';
    } else if (own > 0) {
      status[key] = 'partial';
      allSufficient = false;
      partialCount++;
    } else {
      status[key] = 'missing';
      allSufficient = false;
      missingCount++;
    }
  }

  return {
    missing,
    status,
    allSufficient,
    partialCount,
    missingCount
  };
}

/**
 * 5. Розраховує прогрес прокачки у відсотках (0% - 100%)
 */
export function calculateProgress(required = {}, owned = {}) {
  const keys = Object.keys(required).filter(k => {
    if (k === 'sameRarity' || k === 'fodderRarity') return false;
    return (Number(required[k]) || 0) > 0;
  });

  if (keys.length === 0) return 100;

  let totalRatios = 0;
  for (const key of keys) {
    const req = Number(required[key]) || 0;
    const own = Math.max(0, Number(owned[key]) || 0);
    const ratio = Math.min(1, own / req);
    totalRatios += ratio;
  }

  const avg = (totalRatios / keys.length) * 100;
  return Math.min(100, Math.max(0, Math.round(avg)));
}

/**
 * 6. Розраховує загальний сумарний план прокачки (Масовий калькулятор)
 */
export function calculateTotalPlan(equipmentItems = [], runeItems = [], globalResources = {}, gameData) {
  let totalGoldRequired = 0;
  let totalCopiesRequired = 0;
  let totalSameCopiesRequired = 0;
  let totalFodderCopiesRequired = 0;
  let totalScrollsRequired = 0;

  const equipmentPlan = equipmentItems.map(item => {
    const cost = calculateUpgradeCost(item.currentTier, item.targetTier, 'equipment', gameData);
    const multiTier = calculateMultiTierInventory(item.currentTier, item.targetTier, item.inventory || {});
    
    // Сумарні копії
    const ownedCopies = Object.values(item.inventory || {}).reduce((a, b) => a + Number(b || 0), 0) + (Number(item.ownedCopies) || 0);

    const itemOwned = {
      copies: ownedCopies,
      sameCopies: ownedCopies,
      fodderCopies: Math.max(0, Number(globalResources.fodderEquipment || 0)),
      gold: Math.max(0, Number(globalResources.gold) || 0),
      scrolls: Math.max(0, Number(globalResources[`scrolls_${item.slot}`] || globalResources.scrolls) || 0)
    };

    const missingResult = cost.isValid 
      ? calculateMissingResources(cost.totalRequired, itemOwned)
      : null;

    const progress = multiTier.isValid ? multiTier.progressPercent : (cost.isAlreadyAtTarget ? 100 : 0);

    if (cost.isValid) {
      totalGoldRequired += cost.totalRequired.gold;
      totalCopiesRequired += cost.totalRequired.copies;
      totalSameCopiesRequired += cost.totalRequired.sameCopies;
      totalFodderCopiesRequired += cost.totalRequired.fodderCopies;
      totalScrollsRequired += cost.totalRequired.scrolls;
    }

    return {
      item,
      cost,
      multiTier,
      ownedCopies,
      missingResult,
      progress
    };
  });

  const runePlan = runeItems.map(rune => {
    const cost = calculateUpgradeCost(rune.currentTier, rune.targetTier, 'runes', gameData);
    const multiTier = calculateMultiTierInventory(rune.currentTier, rune.targetTier, rune.inventory || {});
    
    const ownedCopies = Object.values(rune.inventory || {}).reduce((a, b) => a + Number(b || 0), 0) + (Number(rune.ownedCopies) || 0);

    const runeOwned = {
      copies: ownedCopies,
      sameCopies: ownedCopies,
      fodderCopies: 0,
      gold: Math.max(0, Number(globalResources.gold) || 0),
      scrolls: 0
    };

    const missingResult = cost.isValid 
      ? calculateMissingResources(cost.totalRequired, runeOwned)
      : null;

    const progress = multiTier.isValid ? multiTier.progressPercent : (cost.isAlreadyAtTarget ? 100 : 0);

    if (cost.isValid) {
      totalGoldRequired += cost.totalRequired.gold;
      totalCopiesRequired += cost.totalRequired.copies;
      totalSameCopiesRequired += cost.totalRequired.sameCopies;
      totalFodderCopiesRequired += cost.totalRequired.fodderCopies;
    }

    return {
      rune,
      cost,
      multiTier,
      ownedCopies,
      missingResult,
      progress
    };
  });

  const totalRequired = {
    gold: totalGoldRequired,
    copies: totalCopiesRequired,
    sameCopies: totalSameCopiesRequired,
    fodderCopies: totalFodderCopiesRequired,
    scrolls: totalScrollsRequired
  };

  const totalOwned = {
    gold: Math.max(0, Number(globalResources.gold) || 0),
    copies: equipmentPlan.reduce((acc, p) => acc + p.ownedCopies, 0) + runePlan.reduce((acc, p) => acc + p.ownedCopies, 0),
    scrolls: Math.max(0, Number(globalResources.scrolls) || 0)
  };

  const globalMissing = calculateMissingResources(totalRequired, totalOwned);
  const overallProgress = calculateProgress(totalRequired, totalOwned);

  return {
    equipmentPlan,
    runePlan,
    totalRequired,
    totalOwned,
    globalMissing,
    overallProgress,
    hasActiveGoals: equipmentPlan.some(p => p.cost.isValid) || runePlan.some(p => p.cost.isValid)
  };
}

/**
 * 7. "Що мені зараз фармити?" (Farming Priority)
 */
export function getFarmingPriority(totalPlan) {
  if (!totalPlan) return [];

  const priorities = [];

  // Копії спорядження
  for (const p of totalPlan.equipmentPlan || []) {
    if (p.cost?.isValid && p.multiTier && !p.multiTier.isReady) {
      priorities.push({
        type: 'copies',
        name: `${p.item.name} (${p.item.targetTier ? p.item.targetTier.toUpperCase() : 'Upgrade'})`,
        icon: p.item.icon || '⚔️',
        slot: p.item.slot,
        need: `${p.multiTier.missingEquivalents?.great || 0} Зелених (Great) або ${p.multiTier.missingEquivalents?.rare || 0} Синіх (Rare)`,
        rawNeed: p.multiTier.missingCommonValue,
        unit: '',
        priority: 1
      });
    }
  }

  // Руни
  for (const p of totalPlan.runePlan || []) {
    if (p.cost?.isValid && p.multiTier && !p.multiTier.isReady) {
      priorities.push({
        type: 'runes',
        name: `${p.rune.name} (${p.rune.targetTier ? p.rune.targetTier.toUpperCase() : 'Upgrade'})`,
        icon: p.rune.icon || '🔮',
        need: `${p.multiTier.missingEquivalents?.great || 0} Зелених (Great) або ${p.multiTier.missingEquivalents?.rare || 0} Синіх (Rare)`,
        rawNeed: p.multiTier.missingCommonValue,
        unit: '',
        priority: 2
      });
    }
  }

  // Золото
  const missingGold = totalPlan.globalMissing?.missing?.gold || 0;
  if (missingGold > 0) {
    priorities.push({
      type: 'gold',
      name: 'Gold (Золото для злиття)',
      icon: '🪙',
      need: formatNumber(missingGold),
      rawNeed: missingGold,
      unit: 'золота',
      priority: 3
    });
  }

  // Сувої
  const missingScrolls = totalPlan.globalMissing?.missing?.scrolls || 0;
  if (missingScrolls > 0) {
    priorities.push({
      type: 'scrolls',
      name: 'Scrolls (Сувої покращення)',
      icon: '📜',
      need: formatNumber(missingScrolls),
      rawNeed: missingScrolls,
      unit: 'шт.',
      priority: 4
    });
  }

  return priorities.sort((a, b) => a.priority - b.priority);
}

export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US');
}

export function formatCompact(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const n = Number(num);
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (n >= 1_000) {
    return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return n.toString();
}
