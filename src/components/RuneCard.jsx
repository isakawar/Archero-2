import React, { useState } from 'react';
import { Trash2, GitBranch, CheckCircle2, XCircle } from 'lucide-react';
import { 
  calculateUpgradeCost, 
  calculateMissingResources, 
  calculateProgress,
  formatNumber 
} from '../engine/calculator.js';

export default function RuneCard({
  rune,
  globalResources,
  gameData,
  onUpdateRune,
  onRemoveRune,
  onOpenUpgradeTree
}) {
  const [viewMode, setViewMode] = useState('target'); // 'target' | 'next'
  const maxLevel = gameData?.runes?.maxLevel || 20;

  const currentLevel = Number(rune.currentLevel) || 1;
  const targetLevel = Number(rune.targetLevel) || 2;
  const ownedFragments = Math.max(0, Number(rune.ownedFragments) || 0);

  const fullCost = calculateUpgradeCost(currentLevel, targetLevel, 'runes', gameData);

  const runeOwned = {
    fragments: ownedFragments,
    gold: Math.max(0, Number(globalResources.gold) || 0),
    runeDust: Math.max(0, Number(globalResources.runeDust) || 0)
  };

  const isNextMode = viewMode === 'next' && fullCost.nextStepRequired;
  const activeRequired = isNextMode ? fullCost.nextStepRequired : fullCost.totalRequired;

  const missingResult = fullCost.isValid 
    ? calculateMissingResources(activeRequired, runeOwned)
    : null;

  const progress = fullCost.isValid 
    ? calculateProgress(activeRequired, runeOwned)
    : (fullCost.isAlreadyAtTarget ? 100 : 0);

  const handleLevelChange = (newLevel) => {
    let newTarget = targetLevel;
    if (newLevel >= targetLevel) {
      newTarget = Math.min(maxLevel, newLevel + 1);
    }
    onUpdateRune(rune.id, { currentLevel: newLevel, targetLevel: newTarget });
  };

  const handleFragmentsChange = (delta) => {
    const nextVal = Math.max(0, ownedFragments + delta);
    onUpdateRune(rune.id, { ownedFragments: nextVal });
  };

  return (
    <div className="game-card" style={{
      padding: '18px',
      position: 'relative',
      borderLeft: `4px solid ${rune.color || 'var(--accent-cyan)'}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            fontSize: '1.6rem',
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {rune.icon || '🔮'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              {rune.name}
            </h3>
            <div style={{ fontSize: '0.8rem', color: rune.color || 'var(--accent-cyan)', fontWeight: 700 }}>
              Level {currentLevel} → Level {targetLevel}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => onOpenUpgradeTree(rune, fullCost)}
            className="game-btn game-btn-secondary"
            title="Показати покроковий шлях прокачки"
            style={{ fontSize: '0.78rem', padding: '6px 10px' }}
          >
            <GitBranch size={15} color="var(--accent-cyan)" />
            <span>Шлях</span>
          </button>

          <button
            onClick={() => onRemoveRune(rune.id)}
            className="stepper-btn"
            title="Видалити руну"
            style={{ color: '#ef4444' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Selectors Grid: Current Level, Owned Fragments Stepper, Target Level */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        background: 'var(--bg-surface)',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid var(--border-color)'
      }}>
        {/* Current Level */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
            Поточний рівень (Current)
          </label>
          <select
            value={currentLevel}
            onChange={e => handleLevelChange(parseInt(e.target.value, 10))}
            style={{ width: '100%', fontWeight: 600 }}
          >
            {Array.from({ length: maxLevel }, (_, i) => i + 1).map(lvl => (
              <option key={lvl} value={lvl}>
                Level {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Owned Fragments Stepper */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
            Наявні фрагменти (Owned)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => handleFragmentsChange(-5)}
              disabled={ownedFragments <= 0}
              className="stepper-btn"
            >
              -
            </button>
            <input
              type="number"
              min="0"
              value={ownedFragments}
              onChange={e => onUpdateRune(rune.id, { ownedFragments: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              style={{
                width: '60px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '5px'
              }}
            />
            <button
              onClick={() => handleFragmentsChange(5)}
              className="stepper-btn"
            >
              +
            </button>
          </div>
        </div>

        {/* Target Level */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
            Цільовий рівень (Target)
          </label>
          <select
            value={targetLevel}
            onChange={e => onUpdateRune(rune.id, { targetLevel: parseInt(e.target.value, 10) })}
            style={{ width: '100%', fontWeight: 600, color: 'var(--accent-cyan)' }}
          >
            {Array.from({ length: maxLevel }, (_, i) => i + 1).map(lvl => (
              <option key={lvl} value={lvl} disabled={lvl < currentLevel}>
                Level {lvl} {lvl === currentLevel ? '(Поточний)' : ''}
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
          ✓ Руна вже на цільовому рівні (Level {currentLevel})
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

      {/* Outcome Breakdown */}
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
          {/* Header */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                UPGRADE TO LEVEL {isNextMode ? currentLevel + 1 : targetLevel}
              </span>
              {fullCost.stepsCount > 1 && !isNextMode && (
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)'
                }}>
                  {fullCost.stepsCount} рівнів
                </span>
              )}
            </div>

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
                    color: 'var(--accent-cyan)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    padding: '2px 4px'
                  }}
                >
                  {viewMode === 'target' ? 'Наступний рівень →' : 'До всієї цілі →'}
                </button>
              )}
            </div>
          </div>

          {/* Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px'
          }}>
            {/* REQUIRED */}
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
                <div>• Фрагментів × <strong>{activeRequired.fragments}</strong></div>
                <div>• Gold × <strong>{formatNumber(activeRequired.gold)}</strong></div>
                {activeRequired.runeDust > 0 && (
                  <div>• Rune Dust × <strong>{activeRequired.runeDust}</strong></div>
                )}
              </div>
            </div>

            {/* YOU HAVE */}
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
                <div style={{ color: runeOwned.fragments >= activeRequired.fragments ? 'var(--status-ready-text)' : 'inherit' }}>
                  • Фрагментів × <strong>{runeOwned.fragments}</strong>
                </div>
                <div style={{ color: runeOwned.gold >= activeRequired.gold ? 'var(--status-ready-text)' : 'inherit' }}>
                  • Gold × <strong>{formatNumber(runeOwned.gold)}</strong>
                </div>
                {activeRequired.runeDust > 0 && (
                  <div style={{ color: runeOwned.runeDust >= activeRequired.runeDust ? 'var(--status-ready-text)' : 'inherit' }}>
                    • Rune Dust × <strong>{runeOwned.runeDust}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* MISSING */}
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
                    ✓ Усе готово до прокачки!
                  </div>
                ) : (
                  <>
                    {missingResult.missing.fragments > 0 ? (
                      <div style={{ color: '#ef4444', fontWeight: 600 }}>
                        ✕ Фрагментів × {missingResult.missing.fragments}
                      </div>
                    ) : (
                      <div style={{ color: 'var(--status-ready-text)', fontSize: '0.78rem' }}>
                        ✓ Фрагментів достатньо
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

                    {activeRequired.runeDust > 0 && (
                      missingResult.missing.runeDust > 0 ? (
                        <div style={{ color: '#ef4444', fontWeight: 600 }}>
                          ✕ Rune Dust × {missingResult.missing.runeDust}
                        </div>
                      ) : (
                        <div style={{ color: 'var(--status-ready-text)', fontSize: '0.78rem' }}>
                          ✓ Rune Dust достатньо
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
              <span style={{ color: 'var(--text-secondary)' }}>Прогрес руни:</span>
              <strong style={{ color: progress === 100 ? '#22c55e' : 'var(--accent-cyan)' }}>
                {progress}%
              </strong>
            </div>
            <div className="progress-bar-container">
              <div
                className={`progress-bar-fill ${progress === 100 ? 'complete' : ''}`}
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #06b6d4, #22c55e)' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
