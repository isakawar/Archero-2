import React from 'react';
import { Coins, Scroll, Sparkles, RotateCcw, CheckCircle2, Shield } from 'lucide-react';
import { formatNumber } from '../engine/calculator.js';
import { EQUIPMENT_SLOTS } from '../data/defaultGameData.js';

export default function ResourcesTab({
  globalResources,
  onUpdateGlobalResources,
  equipmentItems,
  runeItems
}) {
  const handleResourceChange = (key, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    onUpdateGlobalResources({ [key]: num });
  };

  const handleQuickAdd = (key, amount) => {
    const current = Math.max(0, Number(globalResources[key]) || 0);
    onUpdateGlobalResources({ [key]: current + amount });
  };

  const handleResetResources = () => {
    if (window.confirm('Очистити наявні ресурси до 0?')) {
      onUpdateGlobalResources({
        gold: 0,
        scrolls: 0,
        runeDust: 0,
        other: 0,
        ...EQUIPMENT_SLOTS.reduce((acc, s) => ({ ...acc, [`scrolls_${s.id}`]: 0 }), {})
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        background: 'var(--bg-surface)',
        padding: '14px 18px',
        borderRadius: '14px',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
            📦 Ресурси (Inventory & Global Resources)
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Введіть ваші запаси — вони миттєво синхронізуються з усіма розрахунками спорядження та рун
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} /> Автозбереження
          </span>
          <button
            onClick={handleResetResources}
            className="game-btn game-btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <RotateCcw size={14} />
            <span>Очистити</span>
          </button>
        </div>
      </div>

      {/* Main Currency Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {/* 1. Gold (Золото) */}
        <div className="game-card" style={{ padding: '18px', borderLeft: '4px solid #ffb300' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255, 179, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem'
            }}>
              🪙
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800 }}>Золото (Gold)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Основна валюта покращень</div>
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <input
              type="number"
              min="0"
              step="10000"
              value={globalResources.gold || 0}
              onChange={e => handleResourceChange('gold', e.target.value)}
              style={{
                width: '100%',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--accent-gold)',
                padding: '10px 14px'
              }}
            />
          </div>

          {/* Quick add gold */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[50000, 100000, 500000, 1000000].map(amt => (
              <button
                key={amt}
                onClick={() => handleQuickAdd('gold', amt)}
                className="game-btn game-btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              >
                +{formatNumber(amt)}
              </button>
            ))}
          </div>
        </div>

        {/* 2. General Scrolls (Загальні сувої) */}
        <div className="game-card" style={{ padding: '18px', borderLeft: '4px solid #2196f3' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(33, 150, 243, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem'
            }}>
              📜
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800 }}>Сувої (Scrolls)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Загальний баланс сувоїв</div>
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <input
              type="number"
              min="0"
              step="10"
              value={globalResources.scrolls || 0}
              onChange={e => handleResourceChange('scrolls', e.target.value)}
              style={{
                width: '100%',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#2196f3',
                padding: '10px 14px'
              }}
            />
          </div>

          {/* Quick add scrolls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[10, 50, 100, 500].map(amt => (
              <button
                key={amt}
                onClick={() => handleQuickAdd('scrolls', amt)}
                className="game-btn game-btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              >
                +{amt}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Rune Dust (Пил рун) */}
        <div className="game-card" style={{ padding: '18px', borderLeft: '4px solid #a855f7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem'
            }}>
              ✨
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800 }}>Пил рун (Rune Dust)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Для покращення рун</div>
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <input
              type="number"
              min="0"
              step="5"
              value={globalResources.runeDust || 0}
              onChange={e => handleResourceChange('runeDust', e.target.value)}
              style={{
                width: '100%',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#a855f7',
                padding: '10px 14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[5, 20, 50, 100].map(amt => (
              <button
                key={amt}
                onClick={() => handleQuickAdd('runeDust', amt)}
                className="game-btn game-btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
              >
                +{amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary of item copies & rune fragments from other tabs */}
      <div className="game-card" style={{ padding: '18px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>
          📋 Наявні копії та фрагменти у ваших цілях:
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px'
        }}>
          {equipmentItems.map(item => (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-surface)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{item.icon}</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.name}</span>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>
                {item.ownedCopies || 0} шт.
              </div>
            </div>
          ))}

          {runeItems.map(rune => (
            <div
              key={rune.id}
              style={{
                background: 'var(--bg-surface)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{rune.icon}</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{rune.name}</span>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {rune.ownedFragments || 0} фр.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
