import React, { useState } from 'react';
import { Plus, Search, Shield, Filter, Sparkles, CheckCircle } from 'lucide-react';
import EquipmentCard from './EquipmentCard.jsx';
import { EQUIPMENT_CATALOG, EQUIPMENT_SLOTS } from '../data/defaultGameData.js';

export default function EquipmentTab({
  equipmentItems,
  globalResources,
  gameData,
  onAddOrUpdateItem,
  onUpdateItem,
  onRemoveItem,
  onOpenUpgradeTree
}) {
  const [selectedSlot, setSelectedSlot] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [mergeNotice, setMergeNotice] = useState('');

  // Фільтрація каталогу для додавання
  const filteredCatalog = EQUIPMENT_CATALOG.filter(item => {
    const matchesSlot = selectedSlot === 'ALL' || item.slot === selectedSlot;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSlot && matchesSearch;
  });

  // Додавання предмета (з перевіркою на дублікати)
  const handleAddItem = (catalogItem) => {
    // Шукаємо, чи такий предмет вже є
    const existing = equipmentItems.find(it => it.name.toLowerCase() === catalogItem.name.toLowerCase());
    
    if (existing) {
      // Об'єднуємо: збільшуємо кількість копій на 1 замість дублювання
      onUpdateItem(existing.id, { ownedCopies: (Number(existing.ownedCopies) || 0) + 1 });
      setMergeNotice(`Предмет "${catalogItem.name}" вже є у списку! Додано +1 копію (всього: ${(Number(existing.ownedCopies) || 0) + 1}).`);
    } else {
      // Додаємо новий предмет
      const newItem = {
        id: 'eq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        name: catalogItem.name,
        slot: catalogItem.slot,
        icon: catalogItem.icon,
        currentTier: 'gold_2', // зразок за замовчуванням
        targetTier: 'gold_3',
        ownedCopies: 3
      };
      onAddOrUpdateItem(newItem);
      setMergeNotice(`Додано предмет: "${catalogItem.name}"`);
    }

    setTimeout(() => setMergeNotice(''), 3500);
    setShowAddMenu(false);
    setSearchQuery('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Controls: Add button, quick actions */}
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
            ⚔️ Спорядження (Equipment)
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Додайте предмети, вкажіть поточний та бажаний рівень і кількість наявних копій
          </p>
        </div>

        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="game-btn game-btn-primary"
        >
          <Plus size={18} />
          <span>{showAddMenu ? 'Приховати каталог' : '+ Додати предмет'}</span>
        </button>
      </div>

      {/* Merge/Duplicate Notice */}
      {mergeNotice && (
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
          gap: '8px',
          animation: 'modalEnter 0.2s ease-out'
        }}>
          <CheckCircle size={16} />
          <span>{mergeNotice}</span>
        </div>
      )}

      {/* Add Item Dropdown / Catalog Picker */}
      {showAddMenu && (
        <div className="game-card" style={{ padding: '16px', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {/* Slot filters */}
            <button
              onClick={() => setSelectedSlot('ALL')}
              className={`game-btn ${selectedSlot === 'ALL' ? 'game-btn-primary' : 'game-btn-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '5px 12px' }}
            >
              Всі слоти
            </button>
            {EQUIPMENT_SLOTS.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSlot(s.id)}
                className={`game-btn ${selectedSlot === s.id ? 'game-btn-primary' : 'game-btn-secondary'}`}
                style={{ fontSize: '0.78rem', padding: '5px 12px' }}
              >
                <span>{s.icon}</span>
                <span>{s.id}</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Пошук предмета за назвою (напр. Brightspear, Blade, Golden...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '36px' }}
              autoFocus
            />
          </div>

          {/* Catalog grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '8px',
            maxHeight: '260px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {filteredCatalog.map(catItem => {
              const alreadyHas = equipmentItems.some(it => it.name.toLowerCase() === catItem.name.toLowerCase());
              return (
                <button
                  key={catItem.id}
                  onClick={() => handleAddItem(catItem)}
                  className="game-btn game-btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '8px 12px',
                    gap: '10px',
                    textAlign: 'left',
                    borderRadius: '8px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{catItem.icon}</span>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{catItem.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{catItem.slot}</div>
                  </div>
                  {alreadyHas && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                      +1
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Equipment Items List */}
      {equipmentItems.length === 0 ? (
        <div className="game-card" style={{
          padding: '40px 20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ fontSize: '3rem' }}>⚔️</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Немає доданого спорядження</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
            Додайте предмети зі списку або натисніть швидкий старт для демонстрації
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button
              onClick={() => handleAddItem(EQUIPMENT_CATALOG[0])}
              className="game-btn game-btn-primary"
            >
              + Додати {EQUIPMENT_CATALOG[0].name}
            </button>
            <button
              onClick={() => handleAddItem(EQUIPMENT_CATALOG[8])}
              className="game-btn game-btn-secondary"
            >
              + Додати {EQUIPMENT_CATALOG[8].name}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {equipmentItems.map(item => (
            <EquipmentCard
              key={item.id}
              item={item}
              globalResources={globalResources}
              gameData={gameData}
              onUpdateItem={onUpdateItem}
              onRemoveItem={onRemoveItem}
              onOpenUpgradeTree={onOpenUpgradeTree}
            />
          ))}
        </div>
      )}
    </div>
  );
}
