import React, { useState } from 'react';
import { Trash2, GitBranch, ArrowRight, CheckCircle2, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import { 
  calculateUpgradeCost, 
  calculateMissingResources, 
  calculateProgress,
  formatNumber 
} from '../engine/calculator.js';

export default function EquipmentCard({
  item,
  globalResources,
  gameData,
  onUpdateItem,
  onRemoveItem,
  onOpenUpgradeTree
}) {
  const [viewMode, setViewMode] = useState('target'); // 'target' (до цілі) або 'next' (наступний рівень)
  
  const tiers = gameData?.equipment?.tiers || [];
  const currentTierObj = tiers.find(t => t.id === item.currentTier) || tiers[0];
  const targetTierObj = tiers.find(t => t.id === item.targetTier) || tiers[1];

  const currentIdx = tiers.findIndex(t => t.id === item.currentTier);
  const targetIdx = tiers.findIndex(t => t.id === item.targetTier);

  // Вартість до повної цілі
  const fullCost = calculateUpgradeCost(item.currentTier, item.targetTier, 'equipment', gameData);
  
  // Ресурси користувача
  const ownedCopies = Math.max(0, Number(item.ownedCopies) || 0);
  const userOwned = {
    copies: ownedCopies,
    gold: Math.max(0, Number(globalResources.gold) || 0),
    scrolls: Math.max(0, Number(globalResources[`scrolls_${item.slot}`] || globalResources.scrolls) || 0),
    other: Math.max(0, Number(globalResources.other) || 0)
  };

  // Вибрана вартість (до повної цілі чи до наступного кроку)
  const isNextMode = viewMode === 'next' && fullCost.nextStepRequired;
  const activeRequired = isNextMode ? fullCost.nextStepRequired : fullCost.totalRequired;

  const missingResult = fullCost.isValid 
    ? calculateMissingResources(activeRequired, userOwned)
    : null;

  const progress = fullCost.isValid 
    ? calculateProgress(activeRequired, userOwned)
    : (fullCost.isAlreadyAtTarget ? 100 : 0);

  // Зміна копій через stepper
  const handleCopiesChange = (delta) => {
    const nextVal = Math.max(0, ownedCopies + delta);
    onUpdateItem(item.id, { ownedCopies: nextVal });
  };

  // Зміна поточного рівня
  const handleCurrentTierChange = (e) => {
    const newTier = e.target.value;
    const newIdx = tiers.findIndex(t => t.id === newTier);
    let newTarget = item.targetTier;
    // Якщо нова поточна рідкість більша або рівна цільовій, посуваємо ціль вперед
    if (newIdx >= targetIdx) {
      const nextPossibleTarget = tiers[newIdx + 1] ? tiers[newIdx + 1].id : tiers[newIdx].id;
      newTarget = nextPossibleTarget;
    }
    onUpdateItem(item.id, { currentTier: newTier, targetTier: newTarget });
  };

  return (
    <div className="game-card" style={{
      padding: '18px',
      position: 'relative',
      borderLeft: `4px solid ${currentTierObj.color}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Top row: Item info, slot badge, delete */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            fontSize: '1.6rem',
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: currentTierObj.bg || 'var(--bg-input)',
            border: `1px solid ${currentTierObj.border || 'var(--border-color)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {item.icon || '⚔️'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                {item.name}
              </h3>
              <span style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                fontWeight: 600
              }}>
                {item.slot}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: currentTierObj.color, fontWeight: 700 }}>
              {currentTierObj.label}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => onOpenUpgradeTree(item, fullCost)}
            className="game-btn game-btn-secondary"
            title="Показати покроковий шлях прокачки"
            style={{ fontSize: '0.78rem', padding: '6px 10px' }}
          >
            <GitBranch size={15} color="var(--accent-gold)" />
            <span style={{ display: 'none', md: 'inline' }}>Шлях</span>
          </button>

          <button
            onClick={() => onRemoveItem(item.id)}
            className="stepper-btn"
            title="Видалити предмет"
            style={{ color: '#ef4444' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Controls: Current, Owned Copies Stepper, Target */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        background: 'var(--bg-surface)',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid var(--border-color)'
      }}>
        {/* Current Rarity */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
            Поточний рівень
          </label>
          <select
            value={item.currentTier}
            onChange={handleCurrentTierChange}
            style={{ width: '100%', fontWeight: 600 }}
          >
            {tiers.map(t => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Owned Copies Stepper */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
            Копій у вас
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => handleCopiesChange(-1)}
              disabled={ownedCopies <= 0}
              className="stepper-btn"
            >
              -
            </button>
            <input
              type="number"
              min="0"
              value={ownedCopies}
              onChange={e => onUpdateItem(item.id, { ownedCopies: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              style={{
                width: '60px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '5px'
              }}
            />
            <button
              onClick={() => handleCopiesChange(1)}
              className="stepper-btn"
            >
              +
            </button>
          </div>
        </div>

        {/* Target Rarity */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
            Цільовий рівень
          </label>
          <select
            value={item.targetTier}
            onChange={e => onUpdateItem(item.id, { targetTier: e.target.value })}
            style={{ width: '100%', fontWeight: 600, color: targetTierObj?.color }}
          >
            {tiers.map((t, idx) => (
              <option key={t.id} value={t.id} disabled={idx < currentIdx}>
                {t.label} {idx === currentIdx ? '(Поточний)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Status / Edge cases */}
      {fullCost.isAlreadyAtTarget && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          background: 'var(--status-ready-bg)',
          color: 'var(--status-ready-text)',
          fontSize: '0.88rem',
          fontWeight: 700,
          textAlign: 'center',
          border: '1px solid var(--status-ready-border)'
        }}>
          ✓ Предмет вже на цільовому рівні ({currentTierObj.label})
        </div>
      )}

      {fullCost.isInvalidTarget && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          background: 'var(--status-missing-bg)',
          color: 'var(--status-missing-text)',
          fontSize: '0.88rem',
          fontWeight: 700,
          textAlign: 'center',
          border: '1px solid var(--status-missing-border)'
        }}>
          ✕ Цільовий рівень повинен бути вищим за поточний!
        </div>
      )}

      {/* Main Calculation Outcome */}
      {fullCost.isValid && missingResult && (
        <div style={{
          background: 'var(--bg-input)',
          borderRadius: '12px',
          padding: '14px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Header & Mode Switcher */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                UPGRADE TO {isNextMode ? tiers[currentIdx + 1]?.label : targetTierObj.label}
              </span>
              {fullCost.stepsCount > 1 && !isNextMode && (
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)'
                }}>
                  {fullCost.stepsCount} кроків
                </span>
              )}
            </div>

            {/* Ready badge or toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {missingResult.allSufficient ? (
                <span className="badge-status badge-ready">
                  <CheckCircle2 size={14} />
                  READY TO UPGRADE
                </span>
              ) : (
                <span className="badge-status badge-missing">
                  <XCircle size={14} />
                  {missingResult.missingCount + missingResult.partialCount} не вистачає
                </span>
              )}

              {fullCost.stepsCount > 1 && (
                <button
                  onClick={() => setViewMode(viewMode === 'target' ? 'next' : 'target')}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent-gold)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    padding: '2px 4px'
                  }}
                >
                  {viewMode === 'target' ? 'Наступний крок →' : 'До всієї цілі →'}
                </button>
              )}
            </div>
          </div>

          {/* Three Columns: REQUIRED | YOU HAVE | MISSING */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px'
          }}>
            {/* 1. REQUIRED */}
            <div style={{
              background: 'var(--bg-surface)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px' }}>
                ПОТРІБНО (REQUIRED)
              </div>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activeRequired.sameCopies > 0 && (
                  <div>• {item.name} × <strong style={{ color: '#ffb300' }}>{activeRequired.sameCopies}</strong> <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(таких же)</span></div>
                )}
                {activeRequired.fodderCopies > 0 && (
                  <div>• Корм × <strong style={{ color: 'var(--accent-purple)' }}>{activeRequired.fodderCopies}</strong> <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(будь-який {activeRequired.fodderRarity || ''})</span></div>
                )}
                {(!activeRequired.sameCopies && !activeRequired.fodderCopies) && (
                  <div>• {item.name} × <strong>{activeRequired.copies}</strong></div>
                )}
                <div>• Gold × <strong>{formatNumber(activeRequired.gold)}</strong></div>
                {activeRequired.scrolls > 0 && (
                  <div>• Scrolls × <strong>{formatNumber(activeRequired.scrolls)}</strong></div>
                )}
                {activeRequired.other > 0 && (
                  <div>• Other × <strong>{activeRequired.other}</strong></div>
                )}
              </div>
            </div>

            {/* 2. YOU HAVE */}
            <div style={{
              background: 'var(--bg-surface)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px' }}>
                У ВАС (YOU HAVE)
              </div>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ color: userOwned.copies >= (activeRequired.sameCopies || activeRequired.copies) ? 'var(--status-ready-text)' : 'inherit' }}>
                  • {item.name} × <strong>{userOwned.copies}</strong>
                </div>
                {activeRequired.fodderCopies > 0 && (
                  <div style={{ color: userOwned.fodderCopies >= activeRequired.fodderCopies ? 'var(--status-ready-text)' : 'inherit' }}>
                    • Корм × <strong>{userOwned.fodderCopies}</strong>
                  </div>
                )}
                <div style={{ color: userOwned.gold >= activeRequired.gold ? 'var(--status-ready-text)' : 'inherit' }}>
                  • Gold × <strong>{formatNumber(userOwned.gold)}</strong>
                </div>
                {activeRequired.scrolls > 0 && (
                  <div style={{ color: userOwned.scrolls >= activeRequired.scrolls ? 'var(--status-ready-text)' : 'inherit' }}>
                    • Scrolls × <strong>{formatNumber(userOwned.scrolls)}</strong>
                  </div>
                )}
                {activeRequired.other > 0 && (
                  <div style={{ color: userOwned.other >= activeRequired.other ? 'var(--status-ready-text)' : 'inherit' }}>
                    • Other × <strong>{userOwned.other}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* 3. MISSING */}
            <div style={{
              background: missingResult.allSufficient ? 'var(--status-ready-bg)' : 'var(--bg-surface)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: missingResult.allSufficient ? '1px solid var(--status-ready-border)' : '1px solid var(--border-color)'
            }}>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: missingResult.allSufficient ? 'var(--status-ready-text)' : '#ef4444',
                marginBottom: '6px'
              }}>
                НЕ ВИСТАЧАЄ (MISSING)
              </div>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {missingResult.allSufficient ? (
                  <div style={{ color: 'var(--status-ready-text)', fontWeight: 700, padding: '4px 0' }}>
                    ✓ Усе готово до покращення!
                  </div>
                ) : (
                  <>
                    {activeRequired.sameCopies > 0 && (
                      missingResult.missing.sameCopies > 0 ? (
                        <div style={{ color: '#ef4444', fontWeight: 600 }}>
                          ✕ {item.name} × {missingResult.missing.sameCopies}
                        </div>
                      ) : (
                        <div style={{ color: 'var(--status-ready-text)', fontSize: '0.78rem' }}>
                          ✓ {item.name} копій достатньо
                        </div>
                      )
                    )}

                    {activeRequired.fodderCopies > 0 && (
                      missingResult.missing.fodderCopies > 0 ? (
                        <div style={{ color: '#ef4444', fontWeight: 600 }}>
                          ✕ Корм ({activeRequired.fodderRarity || 'будь-який'}) × {missingResult.missing.fodderCopies}
                        </div>
                      ) : (
                        <div style={{ color: 'var(--status-ready-text)', fontSize: '0.78rem' }}>
                          ✓ Корму достатньо
                        </div>
                      )
                    )}

                    {(!activeRequired.sameCopies && !activeRequired.fodderCopies && missingResult.missing.copies > 0) && (
                      <div style={{ color: '#ef4444', fontWeight: 600 }}>
                        ✕ {item.name} × {missingResult.missing.copies}
                      </div>
                    )}

                    {missingResult.missing.gold > 0 ? (
                      <div style={{ color: '#ef4444', fontWeight: 600 }}>
                        ✕ Gold × {formatNumber(missingResult.missing.gold)}
                      </div>
                    ) : (
                      <div style={{ color: 'var(--status-ready-text)', fontSize: '0.78rem' }}>
                        ✓ Gold достатньо
                      </div>
                    )}

                    {activeRequired.scrolls > 0 && (
                      missingResult.missing.scrolls > 0 ? (
                        <div style={{ color: '#ef4444', fontWeight: 600 }}>
                          ✕ Scrolls × {formatNumber(missingResult.missing.scrolls)}
                        </div>
                      ) : (
                        <div style={{ color: 'var(--status-ready-text)', fontSize: '0.78rem' }}>
                          ✓ Scrolls достатньо
                        </div>
                      )
                    )}

                    {activeRequired.other > 0 && (
                      missingResult.missing.other > 0 ? (
                        <div style={{ color: '#ef4444', fontWeight: 600 }}>
                          ✕ Other × {missingResult.missing.other}
                        </div>
                      ) : (
                        <div style={{ color: 'var(--status-ready-text)', fontSize: '0.78rem' }}>
                          ✓ Інші ресурси достатньо
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Прогрес підготовки:</span>
              <strong style={{ color: progress === 100 ? '#22c55e' : 'var(--accent-gold)' }}>
                {progress}%
              </strong>
            </div>
            <div className="progress-bar-container">
              <div
                className={`progress-bar-fill ${progress === 100 ? 'complete' : ''}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
