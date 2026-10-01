import React from 'react';
import { FUSION_TIERS } from '../data/defaultGameData.js';
import { Sparkles, Layers } from 'lucide-react';

export default function MultiTierInventory({
  inventory = {},
  onChangeInventory,
  multiTierCalc,
  currentTier,
  targetTier,
  itemLabel = 'руни'
}) {
  const tiers = FUSION_TIERS;

  const handleStep = (tierId, delta) => {
    const current = Math.max(0, Number(inventory[tierId]) || 0);
    const next = Math.max(0, current + delta);
    onChangeInventory({
      ...inventory,
      [tierId]: next
    });
  };

  const handleDirectChange = (tierId, val) => {
    const next = Math.max(0, parseInt(val, 10) || 0);
    onChangeInventory({
      ...inventory,
      [tierId]: next
    });
  };

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={17} color="var(--accent-gold)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>
            Ваш інвентар копій ({itemLabel}):
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Вкажіть плюсиками/мінусиками наявні копії різної рідкості
        </span>
      </div>

      {/* Steppers Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
        gap: '8px'
      }}>
        {tiers.map(t => {
          const count = Number(inventory[t.id]) || 0;
          const hasItems = count > 0;

          return (
            <div
              key={t.id}
              style={{
                background: hasItems ? t.bg : 'var(--bg-input)',
                border: `1px solid ${hasItems ? t.border : 'var(--border-color)'}`,
                borderRadius: '8px',
                padding: '6px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Tier Name */}
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: t.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>{t.shortLabel}</span>
                {t.badge && (
                  <span style={{
                    background: t.color,
                    color: '#000',
                    fontSize: '0.6rem',
                    padding: '0 4px',
                    borderRadius: '3px',
                    fontWeight: 900
                  }}>
                    {t.badge}
                  </span>
                )}
              </div>

              {/* Stepper buttons [-] count [+] */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleStep(t.id, -1)}
                  disabled={count <= 0}
                  className="stepper-btn"
                  style={{ width: '26px', height: '26px', fontSize: '0.9rem' }}
                >
                  -
                </button>

                <input
                  type="number"
                  min="0"
                  value={count}
                  onChange={e => handleDirectChange(t.id, e.target.value)}
                  style={{
                    width: '42px',
                    textAlign: 'center',
                    padding: '2px 4px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: hasItems ? t.color : 'inherit',
                    borderRadius: '6px'
                  }}
                />

                <button
                  type="button"
                  onClick={() => handleStep(t.id, 1)}
                  className="stepper-btn"
                  style={{ width: '26px', height: '26px', fontSize: '0.9rem' }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Craftable alerts & Conversion insights */}
      {multiTierCalc && multiTierCalc.isValid && (
        <div style={{
          background: 'var(--bg-input)',
          borderRadius: '8px',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '0.8rem'
        }}>
          {/* Craftable hint */}
          {multiTierCalc.canFuse && multiTierCalc.canFuse.length > 0 && (
            <div style={{ color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} />
              <span>{multiTierCalc.canFuse.join(' • ')}</span>
            </div>
          )}

          {/* Missing in lower tiers equivalents */}
          {!multiTierCalc.isReady && (
            <div style={{ color: 'var(--text-secondary)' }}>
              До мети не вистачає в еквіваленті:{' '}
              <strong style={{ color: '#ffb300' }}>
                {multiTierCalc.missingEquivalents?.epic > 0 ? `${multiTierCalc.missingEquivalents.epic} Epic (Фіолетових)` : ''}
                {multiTierCalc.missingEquivalents?.rare > 0 ? ` або ${multiTierCalc.missingEquivalents.rare} Rare (Синіх)` : ''}
                {multiTierCalc.missingEquivalents?.great > 0 ? ` або ${multiTierCalc.missingEquivalents.great} Great (Зелених)` : ''}
              </strong>
            </div>
          )}

          {multiTierCalc.isReady && (
            <div style={{ color: '#22c55e', fontWeight: 700 }}>
              ✓ У вашому інвентарі достатньо копій для досягнення цілі!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
