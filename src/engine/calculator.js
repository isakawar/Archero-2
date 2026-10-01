/**
 * ============================================================================
 * ARCHERO 2 - PURE CALCULATOR ENGINE
 * ============================================================================
 * Чисті функції для розрахунку витрат, ланцюжків прокачки, дефіциту ресурсів,
 * загального плану та пріоритетів фарму.
 * Не залежить від UI чи DOM.
 * ============================================================================
 */

/**
 * Знаходить об'єкт рівня за його id
 */
export function getEquipmentTier(tierId, gameData) {
  return gameData?.equipment?.tiers?.find(t => t.id === tierId) || null;
}

/**
 * Отримує індекс рівня у списку рідкостей
 */
export function getEquipmentTierIndex(tierId, gameData) {
  return gameData?.equipment?.tiers?.findIndex(t => t.id === tierId) ?? -1;
}

/**
 * 1. Розраховує покроковий ланцюг прокачки (Upgrade Chain)
 * @param {string|number} fromId Поточний рівень/рідкість
 * @param {string|number} toId Цільовий рівень/рідкість
 * @param {'equipment'|'runes'} type Тип прокачки
 * @param {object} gameData Конфіг гри
 * @returns {object} { isValid, isAlreadyAtTarget, steps: Array<{from, to, required}> }
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

      steps.push({
        stepIndex: i - fromIndex + 1,
        from: currentTier,
        to: nextTier,
        required: {
          copies: Math.max(0, Number(req.copies) || 0),
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
 * @param {string|number} fromId Поточний рівень
 * @param {string|number} toId Цільовий рівень
 * @param {'equipment'|'runes'} type Тип
 * @param {object} gameData Конфіг гри
 * @returns {object} { isValid, isAlreadyAtTarget, totalRequired, nextStepRequired, stepsCount, steps }
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
        ? { copies: 0, gold: 0, scrolls: 0, other: 0 }
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
        acc.gold += step.required.gold;
        acc.scrolls += step.required.scrolls;
        acc.other += step.required.other;
        return acc;
      },
      { copies: 0, gold: 0, scrolls: 0, other: 0 }
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
 * @param {object} required Потрібні ресурси { [resourceKey]: number }
 * @param {object} owned Наявні ресурси { [resourceKey]: number }
 * @returns {object} { missing, status, allSufficient, partialCount, missingCount }
 */
export function calculateMissingResources(required = {}, owned = {}) {
  const missing = {};
  const status = {}; // 'sufficient' | 'partial' | 'missing'
  let allSufficient = true;
  let partialCount = 0;
  let missingCount = 0;

  for (const key of Object.keys(required)) {
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
 * Розраховується як середньозважений або гармонійний показник готовності всіх необхідних ресурсів.
 * @param {object} required Потрібні ресурси
 * @param {object} owned Наявні ресурси
 * @returns {number} Відсоток від 0 до 100
 */
export function calculateProgress(required = {}, owned = {}) {
  const keys = Object.keys(required).filter(k => (Number(required[k]) || 0) > 0);

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
 * @param {Array<object>} equipmentItems Список предметів користувача
 * @param {Array<object>} runeItems Список рун користувача
 * @param {object} globalResources Глобальні ресурси (gold, scrolls, etc.)
 * @param {object} gameData Конфіг гри
 * @returns {object} Деталізований звіт планів, суми та загальний статус
 */
export function calculateTotalPlan(equipmentItems = [], runeItems = [], globalResources = {}, gameData) {
  let totalGoldRequired = 0;
  let totalCopiesRequired = 0;
  let totalScrollsRequired = 0;
  let totalOtherRequired = 0;
  let totalFragmentsRequired = 0;
  let totalRuneDustRequired = 0;

  // Деталізація по кожному предмету
  const equipmentPlan = equipmentItems.map(item => {
    const cost = calculateUpgradeCost(item.currentTier, item.targetTier, 'equipment', gameData);
    const ownedCopies = Math.max(0, Number(item.ownedCopies) || 0);
    
    // Специфічні ресурси для цього предмета
    const itemOwned = {
      copies: ownedCopies,
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

  // Деталізація по кожній руні
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
    scrolls: totalScrollsRequired,
    fragments: totalFragmentsRequired,
    runeDust: totalRuneDustRequired,
    other: totalOtherRequired
  };

  const totalOwned = {
    gold: Math.max(0, Number(globalResources.gold) || 0),
    copies: equipmentItems.reduce((acc, it) => acc + (Number(it.ownedCopies) || 0), 0),
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
 * Перетворює дефіцит ресурсів у зрозумілий пріоритетний список.
 * @param {object} totalPlan Результат функції calculateTotalPlan
 * @returns {Array<object>} Впорядкований список для фарму
 */
export function getFarmingPriority(totalPlan) {
  if (!totalPlan) return [];

  const priorities = [];

  // 1. Копії конкретних предметів (найважливіший ресурс)
  for (const p of totalPlan.equipmentPlan || []) {
    if (p.cost?.isValid && p.missingResult) {
      const missingCopies = p.missingResult.missing.copies || 0;
      if (missingCopies > 0) {
        priorities.push({
          type: 'copies',
          name: `${p.item.name || 'Equipment'} copies`,
          icon: p.item.icon || '⚔️',
          slot: p.item.slot,
          need: missingCopies,
          unit: 'копій',
          priority: 1
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
          name: `${p.rune.name || 'Rune'} fragments`,
          icon: p.rune.icon || '🔮',
          need: missingFrags,
          unit: 'фрагментів',
          priority: 2
        });
      }
    }
  }

  // 3. Сумарні сувої (Scrolls)
  const missingScrolls = totalPlan.globalMissing?.missing?.scrolls || 0;
  if (missingScrolls > 0) {
    priorities.push({
      type: 'scrolls',
      name: 'Scrolls (Сувої покращення)',
      icon: '📜',
      need: missingScrolls,
      unit: 'шт.',
      priority: 3
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
      priority: 4
    });
  }

  // 5. Інші ресурси (Rune Dust / Other)
  const missingRuneDust = totalPlan.globalMissing?.missing?.runeDust || 0;
  if (missingRuneDust > 0) {
    priorities.push({
      type: 'runeDust',
      name: 'Rune Dust (Пил рун)',
      icon: '✨',
      need: missingRuneDust,
      unit: 'шт.',
      priority: 5
    });
  }

  const missingOther = totalPlan.globalMissing?.missing?.other || 0;
  if (missingOther > 0) {
    priorities.push({
      type: 'other',
      name: 'Special Materials (Особливі ресурси)',
      icon: '💎',
      need: missingOther,
      unit: 'шт.',
      priority: 6
    });
  }

  // Сортуємо за пріоритетом
  return priorities.sort((a, b) => a.priority - b.priority);
}

/**
 * Допоміжна функція форматування чисел (наприклад 1150000 -> "1,150,000" або "1.15M")
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US');
}

/**
 * Компактне форматування для бейджів (1.2k, 1.5M)
 */
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
