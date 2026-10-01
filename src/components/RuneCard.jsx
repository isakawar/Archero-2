import React, { useState } from 'react';
import { Trash2, GitBranch, CheckCircle2, XCircle } from 'lucide-react';
import { 
  calculateUpgradeCost, 
  calculateMultiTierInventory,
  calculateMissingResources, 
  calculateProgress,
  formatNumber 
} from '../engine/calculator.js';
import { FUSION_TIERS } from '../data/defaultGameData.js';
import RuneIcon from './RuneIcon.jsx';
import MultiTierInventory from './MultiTierInventory.jsx';

export default function RuneCard({
  rune,
  globalResources,
  gameData,
  onUpdateRune,
  onRemoveRune,
  onOpenUpgradeTree
}) {
  const [viewMode, setViewMode] = useState('target');
  const tiers = FUSION_TIERS;

  const currentTier = rune.currentTier || 'gold_1';
  const targetTier = rune.targetTier || 'gold_2';
  const inventory = rune.inventory || { great: 2, rare: 1 }; // зразок з питання користувача: 2 зелені руни

  const currentTierObj = tiers.find(t => t.id === currentTier) || tiers[6];
  const targetTierObj = tiers.find(t => t.id === targetTier) || tiers[7];

  const currentIdx = tiers.findIndex(t => t.id === currentTier);
  const targetIdx = tiers.findIndex(t => t.id === targetTier);

  const fullCost = calculateUpgradeCost(currentTier, targetTier, 'runes', gameData);
  const multiTierCalc = calculateMultiTierInventory(currentTier, targetTier, inventory);

  // Ресурси користувача
  const userOwned = {
    gold: Math.max(0, Number(globalResources.gold) || 0),
    scrolls: 0
  };

  const isNextMode = viewMode === 'next' && fullCost.nextStepRequired;
  const activeRequired = isNextMode ? fullCost.nextStepRequired : fullCost.totalRequired;

  const missingResult = fullCost.isValid 
    ? calculateMissingResources(activeRequired, userOwned)
    : null;

  const progress = multiTierCalc.isValid 
    ? multiTierCalc.progressPercent 
    : (fullCost.isAlreadyAtTarget ? 100 : 0);

  const handleCurrentTierChange = (e) => {
    const newTier = e.target.value;
    const newIdx = tiers.findIndex(t => t.id === newTier);
    let newTarget = targetTier;
    if (newIdx >= targetIdx) {
      newTarget = tiers[newIdx + 1] ? tiers[newIdx + 1].id : tiers[newIdx].id;
    }
    onUpdateRune(rune.id, { currentTier: newTier, targetTier: newTarget });
  };

  const handleInventoryChange = (newInv) => {
    onUpdateRune(rune.id, { inventory: newInv });
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
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Real Rune Photo / Quality Frame */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: currentTierObj.bg,
            border: `2px solid ${currentTierObj.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 15px ${currentTierObj.color}44`,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {rune.image || (rune.iconKey === 'etched_echo_arrow' || rune.name.includes('Ехо') ? '/images/rune_echo_arrow.jpg' : rune.iconKey === 'etched_sword' || rune.name.includes('Меч') ? '/images/rune_sword.jpg' : rune.iconKey === 'etched_meteor' || rune.name.includes('Метеор') ? '/images/rune_meteor.jpg' : null) ? (
              <img
                src={rune.image || (rune.iconKey === 'etched_sword' ? '/images/rune_sword.jpg' : rune.iconKey === 'etched_meteor' ? '/images/rune_meteor.jpg' : '/images/rune_echo_arrow.jpg')}
                alt={rune.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <RuneIcon id={rune.iconKey || 'etched_echo_arrow'} size={34} rarityColor={currentTierObj.color} />
            )}
            {currentTierObj.badge && (
              <span style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                background: currentTierObj.color,
                color: '#000',
                fontSize: '0.65rem',
                fontWeight: 900,
                padding: '0 4px',
                borderRadius: '3px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
              }}>
                {currentTierObj.badge}
              </span>
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                {rune.name}
              </h3>
              <span style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'var(--bg-input)',
                color: 'var(--accent-gold)',
                fontWeight: 700
              }}>
                {rune.category || 'Гравійована'}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: currentTierObj.color, fontWeight: 700 }}>
              {currentTierObj.label} → {targetTierObj?.label}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => onOpenUpgradeTree(rune, fullCost, 'runes')}
            className="game-btn game-btn-secondary"
            title="Показати покроковий шлях злиття"
            style={{ fontSize: '0.78rem', padding: '6px 10px' }}
          >
            <GitBranch size={15} color="var(--accent-gold)" />
            <span>Шлях злиття</span>
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

      {/* Selectors Grid: Current Tier & Target Tier */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        background: 'var(--bg-surface)',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid var(--border-color)'
      }}>
        {/* Current Rarity */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
            Поточна рідкість руни
          </label>
          <select
            value={currentTier}
            onChange={handleCurrentTierChange}
            style={{ width: '100%', fontWeight: 700, color: currentTierObj.color }}
          >
            {tiers.map(t => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Target Rarity */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
            Цільова рідкість
          </label>
          <select
            value={targetTier}
            onChange={e => onUpdateRune(rune.id, { targetTier: e.target.value })}
            style={{ width: '100%', fontWeight: 700, color: targetTierObj?.color }}
          >
            {tiers.map((t, idx) => (
              <option key={t.id} value={t.id} disabled={idx < currentIdx}>
                {t.label} {idx === currentIdx ? '(Поточна)' : ''}
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
          ✓ Руна вже на цільовій рідкості ({currentTierObj.label})
        </div>
      )}

      {/* Main Calculation Outcome */}
      {fullCost.isValid && (
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
                  {fullCost.stepsCount} кроків злиття
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {multiTierCalc.isReady ? (
                <span className="badge-status badge-ready">
                  <CheckCircle2 size={14} />
                  READY TO UPGRADE
                </span>
              ) : (
                <span className="badge-status badge-missing">
                  <XCircle size={14} />
                  Зберіть ще копії
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

          {/* Three Columns: ПОТРІБНО | У ВАС В ІНВЕНТАРІ | НЕ ВИСТАЧАЄ */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px'
          }}>
            {/* 1. ПОТРІБНО */}
            <div style={{
              background: 'var(--bg-surface)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px' }}>
                СПОЧАТКУ ПОТРІБНО
              </div>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activeRequired.sameCopies > 0 && (
                  <div>• {rune.name} × <strong style={{ color: '#ffb300' }}>{activeRequired.sameCopies}</strong> <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(таких же)</span></div>
                )}
                {activeRequired.fodderCopies > 0 && (
                  <div>• Будь-які руни × <strong style={{ color: 'var(--accent-purple)' }}>{activeRequired.fodderCopies}</strong> <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({activeRequired.fodderRarity || 'корм'})</span></div>
                )}
                <div>• Gold × <strong>{formatNumber(activeRequired.gold)}</strong></div>
              </div>
            </div>

            {/* 2. У ВАС В ІНВЕНТАРІ */}
            <div style={{
              background: 'var(--bg-surface)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px' }}>
                У ВАС Є В НАЯВНОСТІ
              </div>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {Object.entries(inventory).filter(([_, c]) => Number(c) > 0).length === 0 ? (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>0 доданих рун</span>
                ) : (
                  Object.entries(inventory)
                    .filter(([_, count]) => Number(count) > 0)
                    .map(([tierId, count]) => {
                      const t = tiers.find(x => x.id === tierId);
                      return (
                        <div key={tierId} style={{ color: t?.color, fontWeight: 700 }}>
                          • {count} {t?.label}
                        </div>
                      );
                    })
                )}
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Сумарна цінність: <strong>{multiTierCalc.ownedCommonValue} / {multiTierCalc.requiredCommonValue}</strong>
                </div>
              </div>
            </div>

            {/* 3. НЕ ВИСТАЧАЄ */}
            <div style={{
              background: multiTierCalc.isReady ? 'var(--status-ready-bg)' : 'var(--bg-surface)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: multiTierCalc.isReady ? '1px solid var(--status-ready-border)' : '1px solid var(--border-color)'
            }}>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: multiTierCalc.isReady ? 'var(--status-ready-text)' : '#ef4444',
                marginBottom: '6px'
              }}>
                НЕ ВИСТАЧАЄ ДО МЕТИ
              </div>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {multiTierCalc.isReady ? (
                  <div style={{ color: 'var(--status-ready-text)', fontWeight: 700 }}>
                    ✓ Рун достатньо для покращення!
                  </div>
                ) : (
                  <>
                    <div style={{ color: '#ef4444', fontWeight: 700 }}>
                      ✕ {multiTierCalc.missingEquivalents?.rare} Синіх (Rare)
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                      або {multiTierCalc.missingEquivalents?.great} Зелених (Great)
                    </div>
                    {missingResult.missing.gold > 0 && (
                      <div style={{ color: '#ef4444', fontSize: '0.78rem' }}>
                        ✕ Gold × {formatNumber(missingResult.missing.gold)}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Прогрес руни з урахуванням інвентаря:</span>
              <strong style={{ color: progress >= 100 ? '#22c55e' : 'var(--accent-gold)' }}>
                {progress}%
              </strong>
            </div>
            <div className="progress-bar-container">
              <div
                className={`progress-bar-fill ${progress >= 100 ? 'complete' : ''}`}
                style={{ width: `${Math.min(100, progress)}%`, background: 'linear-gradient(90deg, #ffb300, #22c55e)' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Multi-Tier Steppers Inventory (Плюсики та мінусики для кожного рівня рун) */}
      <MultiTierInventory
        inventory={inventory}
        onChangeInventory={handleInventoryChange}
        multiTierCalc={multiTierCalc}
        currentTier={currentTier}
        targetTier={targetTier}
        itemLabel={rune.name}
      />
    </div>
  );
}
