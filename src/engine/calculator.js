/**
 * ============================================================================
 * ARCHERO 2 - PURE CALCULATOR ENGINE
 * ============================================================================
 * Чисті функції для розрахунку витрат, ланцюжків прокачки, дефіциту ресурсів,
 * загального плану та пріоритетів фарму.
 * Не залежить від UI чи DOM.
 * ============================================================================
 */

export function getEquipmentTier(tierId, gameData) {
  return gameData?.equipment?.tiers?.find(t => t.id === tierId) || null;
}

export function getEquipmentTierIndex(tierId, gameData) {
  return gameData?.equipment?.tiers?.findIndex(t => t.id === tierId) ?? -1;
}

/**
 * 1. Розраховує покроковий ланцюг прокачки (Upgrade Chain)
 */
export function calculateUpgradeChain(fromId, toId, type = 'equipment', gameData) {
  if (type === 'equipment') {
    const tiers = gameData?.equipment?.tiers || [];
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
    const stepReqs = gameData?.equipment?.stepRequirements || {};

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

  if (type === 'runes') {
    const fromLvl = Number(fromId);
    const toLvl = Number(toId);

    if (isNaN(fromLvl) || isNaN(toLvl)) {
      return { isValid: false, isAlreadyAtTarget: false, isInvalidTarget: true, steps: [] };
    }

    if (fromLvl === toLvl) {
      return { isValid: false, isAlreadyAtTarget: true, isInvalidTarget: false, steps: [] };
    }

    if (fromLvl > toLvl) {
      return { isValid: false, isAlreadyAtTarget: false, isInvalidTarget: true, steps: [] };
    }

    const steps = [];
    const stepReqs = gameData?.runes?.stepRequirements || {};

    for (let lvl = fromLvl; lvl < toLvl; lvl++) {
      const req = stepReqs[lvl] || { fragments: 5, gold: 10000, runeDust: 2 };
      steps.push({
        stepIndex: lvl - fromLvl + 1,
        fromLevel: lvl,
        toLevel: lvl + 1,
        required: {
          fragments: Math.max(0, Number(req.fragments) || 0),
          gold: Math.max(0, Number(req.gold) || 0),
          runeDust: Math.max(0, Number(req.runeDust) || 0)
        }
      });
    }

    return { isValid: true, isAlreadyAtTarget: false, isInvalidTarget: false, steps };
  }

  return { isValid: false, isAlreadyAtTarget: false, isInvalidTarget: true, steps: [] };
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
      totalRequired: type === 'equipment' 
        ? { copies: 0, sameCopies: 0, fodderCopies: 0, gold: 0, scrolls: 0, other: 0 }
        : { fragments: 0, gold: 0, runeDust: 0 },
      nextStepRequired: null
    };
  }

  const { steps } = chainResult;
  const nextStepRequired = steps.length > 0 ? steps[0].required : null;

  if (type === 'equipment') {
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

  if (type === 'runes') {
    const totalRequired = steps.reduce(
      (acc, step) => {
        acc.fragments += step.required.fragments;
        acc.gold += step.required.gold;
        acc.runeDust += step.required.runeDust;
        return acc;
      },
      { fragments: 0, gold: 0, runeDust: 0 }
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
}

/**
 * 3. Розраховує різницю (Missing Resources) між потрібним і наявним
 */
export function calculateMissingResources(required = {}, owned = {}) {
  const missing = {};
  const status = {}; // 'sufficient' | 'partial' | 'missing'
  let allSufficient = true;
  let partialCount = 0;
  let missingCount = 0;

  for (const key of Object.keys(required)) {
    // Пропускаємо текстові мета-поля
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
 * 4. Розраховує прогрес прокачки у відсотках (0% - 100%)
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
 * 5. Розраховує загальний сумарний план прокачки (Масовий калькулятор)
 */
export function calculateTotalPlan(equipmentItems = [], runeItems = [], globalResources = {}, gameData) {
  let totalGoldRequired = 0;
  let totalCopiesRequired = 0;
  let totalSameCopiesRequired = 0;
  let totalFodderCopiesRequired = 0;
  let totalScrollsRequired = 0;
  let totalOtherRequired = 0;
  let totalFragmentsRequired = 0;
  let totalRuneDustRequired = 0;

  const equipmentPlan = equipmentItems.map(item => {
    const cost = calculateUpgradeCost(item.currentTier, item.targetTier, 'equipment', gameData);
    const ownedCopies = Math.max(0, Number(item.ownedCopies) || 0);
    const ownedFodder = Math.max(0, Number(globalResources.fodderEquipment || 0));

    const itemOwned = {
      copies: ownedCopies,
      sameCopies: ownedCopies,
      fodderCopies: ownedFodder,
      gold: Math.max(0, Number(globalResources.gold) || 0),
      scrolls: Math.max(0, Number(globalResources[`scrolls_${item.slot}`] || globalResources.scrolls) || 0),
      other: Math.max(0, Number(globalResources.other) || 0)
    };

    const missingResult = cost.isValid 
      ? calculateMissingResources(cost.totalRequired, itemOwned)
      : null;

    const progress = cost.isValid 
      ? calculateProgress(cost.totalRequired, itemOwned)
      : (cost.isAlreadyAtTarget ? 100 : 0);

    if (cost.isValid) {
      totalGoldRequired += cost.totalRequired.gold;
      totalCopiesRequired += cost.totalRequired.copies;
      totalSameCopiesRequired += cost.totalRequired.sameCopies;
      totalFodderCopiesRequired += cost.totalRequired.fodderCopies;
      totalScrollsRequired += cost.totalRequired.scrolls;
      totalOtherRequired += cost.totalRequired.other;
    }

    return {
      item,
      cost,
      ownedCopies,
      missingResult,
      progress
    };
  });

  const runePlan = runeItems.map(rune => {
    const cost = calculateUpgradeCost(rune.currentLevel, rune.targetLevel, 'runes', gameData);
    const ownedFragments = Math.max(0, Number(rune.ownedFragments) || 0);

    const runeOwned = {
      fragments: ownedFragments,
      gold: Math.max(0, Number(globalResources.gold) || 0),
      runeDust: Math.max(0, Number(globalResources.runeDust) || 0)
    };

    const missingResult = cost.isValid 
      ? calculateMissingResources(cost.totalRequired, runeOwned)
      : null;

    const progress = cost.isValid 
      ? calculateProgress(cost.totalRequired, runeOwned)
      : (cost.isAlreadyAtTarget ? 100 : 0);

    if (cost.isValid) {
      totalGoldRequired += cost.totalRequired.gold;
      totalFragmentsRequired += cost.totalRequired.fragments;
      totalRuneDustRequired += cost.totalRequired.runeDust;
    }

    return {
      rune,
      cost,
      ownedFragments,
      missingResult,
      progress
    };
  });

  const totalRequired = {
    gold: totalGoldRequired,
    copies: totalCopiesRequired,
    sameCopies: totalSameCopiesRequired,
    fodderCopies: totalFodderCopiesRequired,
    scrolls: totalScrollsRequired,
    fragments: totalFragmentsRequired,
    runeDust: totalRuneDustRequired,
    other: totalOtherRequired
  };

  const totalOwned = {
    gold: Math.max(0, Number(globalResources.gold) || 0),
    copies: equipmentItems.reduce((acc, it) => acc + (Number(it.ownedCopies) || 0), 0),
    sameCopies: equipmentItems.reduce((acc, it) => acc + (Number(it.ownedCopies) || 0), 0),
    fodderCopies: Math.max(0, Number(globalResources.fodderEquipment || 0)),
    scrolls: Math.max(0, Number(globalResources.scrolls) || 0),
    fragments: runeItems.reduce((acc, rn) => acc + (Number(rn.ownedFragments) || 0), 0),
    runeDust: Math.max(0, Number(globalResources.runeDust) || 0),
    other: Math.max(0, Number(globalResources.other) || 0)
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
 * 6. "Що мені зараз фармити?" (Farming Priority)
 */
export function getFarmingPriority(totalPlan) {
  if (!totalPlan) return [];

  const priorities = [];

  // 1. Копії конкретних предметів
  for (const p of totalPlan.equipmentPlan || []) {
    if (p.cost?.isValid && p.missingResult) {
      const missingSameCopies = p.missingResult.missing.sameCopies ?? p.missingResult.missing.copies ?? 0;
      if (missingSameCopies > 0) {
        priorities.push({
          type: 'copies',
          name: `${p.item.name || 'Equipment'} (копії)`,
          icon: p.item.icon || '⚔️',
          slot: p.item.slot,
          need: missingSameCopies,
          unit: 'копій',
          priority: 1
        });
      }

      // Корм (Fodder items)
      const missingFodder = p.missingResult.missing.fodderCopies || 0;
      if (missingFodder > 0) {
        priorities.push({
          type: 'fodder',
          name: `Корм для ${p.item.name} (будь-яке спорядження)`,
          icon: '📦',
          slot: p.item.slot,
          need: missingFodder,
          unit: 'предметів',
          priority: 2
        });
      }
    }
  }

  // 2. Фрагменти рун
  for (const p of totalPlan.runePlan || []) {
    if (p.cost?.isValid && p.missingResult) {
      const missingFrags = p.missingResult.missing.fragments || 0;
      if (missingFrags > 0) {
        priorities.push({
          type: 'fragments',
          name: `${p.rune.name || 'Rune'} (фрагменти)`,
          icon: p.rune.icon || '🔮',
          need: missingFrags,
          unit: 'фрагментів',
          priority: 3
        });
      }
    }
  }

  // 3. Сувої (Scrolls)
  const missingScrolls = totalPlan.globalMissing?.missing?.scrolls || 0;
  if (missingScrolls > 0) {
    priorities.push({
      type: 'scrolls',
      name: 'Scrolls (Сувої покращення)',
      icon: '📜',
      need: missingScrolls,
      unit: 'шт.',
      priority: 4
    });
  }

  // 4. Золото (Gold)
  const missingGold = totalPlan.globalMissing?.missing?.gold || 0;
  if (missingGold > 0) {
    priorities.push({
      type: 'gold',
      name: 'Gold (Золото)',
      icon: '🪙',
      need: missingGold,
      unit: 'золота',
      priority: 5
    });
  }

  // 5. Інші ресурси
  const missingRuneDust = totalPlan.globalMissing?.missing?.runeDust || 0;
  if (missingRuneDust > 0) {
    priorities.push({
      type: 'runeDust',
      name: 'Rune Dust (Пил рун)',
      icon: '✨',
      need: missingRuneDust,
      unit: 'шт.',
      priority: 6
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
