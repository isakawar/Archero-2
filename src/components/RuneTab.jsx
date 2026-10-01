import React, { useState } from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import RuneCard from './RuneCard.jsx';
import { RUNES_CATALOG } from '../data/defaultGameData.js';

export default function RuneTab({
  runeItems,
  globalResources,
  gameData,
  onAddOrUpdateRune,
  onUpdateRune,
  onRemoveRune,
  onOpenUpgradeTree
}) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [notice, setNotice] = useState('');

  const handleAddRune = (catalogRune) => {
    const existing = runeItems.find(r => r.name.toLowerCase() === catalogRune.name.toLowerCase());
    
    if (existing) {
      onUpdateRune(existing.id, { ownedFragments: (Number(existing.ownedFragments) || 0) + 10 });
      setNotice(`Руна "${catalogRune.name}" вже є! Додано +10 фрагментів (всього: ${(Number(existing.ownedFragments) || 0) + 10}).`);
    } else {
      const newRune = {
        id: 'rune_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        name: catalogRune.name,
        icon: catalogRune.icon,
        color: catalogRune.color,
        currentLevel: 4,
        targetLevel: 8,
        ownedFragments: 20
      };
      onAddOrUpdateRune(newRune);
      setNotice(`Додано ціль для: "${catalogRune.name}"`);
    }

    setTimeout(() => setNotice(''), 3500);
    setShowAddMenu(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Controls */}
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
            🔮 Руни (Runes)
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Виберіть руну, вкажіть поточний та цільовий рівень і наявні фрагменти
          </p>
        </div>

        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="game-btn game-btn-primary"
        >
          <Plus size={18} />
          <span>{showAddMenu ? 'Приховати список' : '+ Додати руну'}</span>
        </button>
      </div>

      {notice && (
        <div style={{
          background: 'var(--status-ready-bg)',
          border: '1px solid var(--status-ready-border)',
          color: 'var(--status-ready-text)',
          padding: '10px 16px',
          borderRadius: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* Add Rune Menu */}
      {showAddMenu && (
        <div className="game-card" style={{ padding: '16px', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 600 }}>
            Оберіть руну зі списку:
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '8px'
          }}>
            {RUNES_CATALOG.map(catRune => {
              const alreadyHas = runeItems.some(r => r.name.toLowerCase() === catRune.name.toLowerCase());
              return (
                <button
                  key={catRune.id}
                  onClick={() => handleAddRune(catRune)}
                  className="game-btn game-btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '10px 14px',
                    gap: '10px',
                    textAlign: 'left',
                    borderRadius: '8px',
                    borderLeft: `3px solid ${catRune.color}`
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{catRune.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{catRune.name}</div>
                  </div>
                  {alreadyHas && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                      +10 фр.
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Rune Items List */}
      {runeItems.length === 0 ? (
        <div className="game-card" style={{
          padding: '40px 20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ fontSize: '3rem' }}>🔮</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Немає доданих рун</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
            Додайте руну, щоб розрахувати потрібні фрагменти та золото для прокачки
          </p>
          <button
            onClick={() => handleAddRune(RUNES_CATALOG[0])}
            className="game-btn game-btn-primary"
            style={{ marginTop: '6px' }}
          >
            + Додати {RUNES_CATALOG[0].name}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {runeItems.map(rune => (
            <RuneCard
              key={rune.id}
              rune={rune}
              globalResources={globalResources}
              gameData={gameData}
              onUpdateRune={onUpdateRune}
              onRemoveRune={onRemoveRune}
              onOpenUpgradeTree={onOpenUpgradeTree}
            />
          ))}
        </div>
      )}
    </div>
  );
}
