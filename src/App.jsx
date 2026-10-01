import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.jsx';
import EquipmentTab from './components/EquipmentTab.jsx';
import RuneTab from './components/RuneTab.jsx';
import ResourcesTab from './components/ResourcesTab.jsx';
import TotalPlanSection from './components/TotalPlanSection.jsx';
import UpgradeTreeModal from './components/UpgradeTreeModal.jsx';
import DataConfigModal from './components/DataConfigModal.jsx';
import { DEFAULT_GAME_DATA, EQUIPMENT_CATALOG, RUNES_CATALOG } from './data/defaultGameData.js';
import { 
  calculateTotalPlan, 
  getFarmingPriority, 
  formatNumber 
} from './engine/calculator.js';

// Початкові демонстраційні предмети (відповідають прикладу в ТЗ)
const INITIAL_EQUIPMENT = [
  {
    id: 'eq_brightspear',
    name: 'Brightspear',
    slot: 'Weapon',
    icon: '⚡',
    currentTier: 'gold_2',
    targetTier: 'gold_3',
    ownedCopies: 3
  },
  {
    id: 'eq_armor',
    name: 'Golden Chestplate',
    slot: 'Armor',
    icon: '🛡️',
    currentTier: 'gold_1',
    targetTier: 'gold_3',
    ownedCopies: 1
  }
];

const INITIAL_RUNES = [
  {
    id: 'rune_courage',
    name: 'Руна Мужності (Courage Rune)',
    icon: '🦁',
    color: '#ff5722',
    currentLevel: 4,
    targetLevel: 8,
    ownedFragments: 15
  }
];

const INITIAL_RESOURCES = {
  gold: 125000,
  scrolls: 60,
  runeDust: 8,
  other: 5
};

export default function App() {
  // Тема (Dark / Light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('archero2_theme') || 'dark';
  });

  // Активна вкладка
  const [activeTab, setActiveTab] = useState('equipment');

  // Дані гри (конфігурація вимог прокачки)
  const [gameData, setGameData] = useState(() => {
    try {
      const saved = localStorage.getItem('archero2_game_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.version === DEFAULT_GAME_DATA.version) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved game data:', e);
    }
    return DEFAULT_GAME_DATA;
  });

  // Спорядження користувача (з валідацією рідкостей)
  const [equipmentItems, setEquipmentItems] = useState(() => {
    try {
      const saved = localStorage.getItem('archero2_equipment_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        const validTierIds = DEFAULT_GAME_DATA.equipment.tiers.map(t => t.id);
        const sanitized = parsed.map(it => ({
          ...it,
          currentTier: validTierIds.includes(it.currentTier) ? it.currentTier : 'gold_2',
          targetTier: validTierIds.includes(it.targetTier) ? it.targetTier : 'gold_3'
        }));
        return sanitized;
      }
    } catch (e) {}
    return INITIAL_EQUIPMENT;
  });

  // Руни користувача
  const [runeItems, setRuneItems] = useState(() => {
    try {
      const saved = localStorage.getItem('archero2_rune_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_RUNES;
  });

  // Глобальні ресурси
  const [globalResources, setGlobalResources] = useState(() => {
    try {
      const saved = localStorage.getItem('archero2_global_resources');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_RESOURCES;
  });

  // Модальне вікно Upgrade Tree
  const [treeModal, setTreeModal] = useState({
    isOpen: false,
    item: null,
    chainResult: null,
    type: 'equipment'
  });

  // Модальне вікно Data Config
  const [isDataConfigOpen, setIsDataConfigOpen] = useState(false);

  // Синхронізація теми з документом
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('archero2_theme', theme);
  }, [theme]);

  // Автозбереження стану в localStorage
  useEffect(() => {
    localStorage.setItem('archero2_equipment_items', JSON.stringify(equipmentItems));
  }, [equipmentItems]);

  useEffect(() => {
    localStorage.setItem('archero2_rune_items', JSON.stringify(runeItems));
  }, [runeItems]);

  useEffect(() => {
    localStorage.setItem('archero2_global_resources', JSON.stringify(globalResources));
  }, [globalResources]);

  useEffect(() => {
    localStorage.setItem('archero2_game_data', JSON.stringify(gameData));
  }, [gameData]);

  // Реактивні розрахунки
  const totalPlan = useMemo(() => {
    return calculateTotalPlan(equipmentItems, runeItems, globalResources, gameData);
  }, [equipmentItems, runeItems, globalResources, gameData]);

  const farmingPriorities = useMemo(() => {
    return getFarmingPriority(totalPlan);
  }, [totalPlan]);

  // Хендлери спорядження
  const handleAddOrUpdateItem = (item) => {
    setEquipmentItems(prev => {
      const idx = prev.findIndex(it => it.id === item.id || it.name.toLowerCase() === item.name.toLowerCase());
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...item };
        return next;
      }
      return [...prev, item];
    });
  };

  const handleUpdateItem = (id, fields) => {
    setEquipmentItems(prev => prev.map(it => it.id === id ? { ...it, ...fields } : it));
  };

  const handleRemoveItem = (id) => {
    setEquipmentItems(prev => prev.filter(it => it.id !== id));
  };

  // Хендлери рун
  const handleAddOrUpdateRune = (rune) => {
    setRuneItems(prev => {
      const idx = prev.findIndex(r => r.id === rune.id || r.name.toLowerCase() === rune.name.toLowerCase());
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...rune };
        return next;
      }
      return [...prev, rune];
    });
  };

  const handleUpdateRune = (id, fields) => {
    setRuneItems(prev => prev.map(r => r.id === id ? { ...r, ...fields } : r));
  };

  const handleRemoveRune = (id) => {
    setRuneItems(prev => prev.filter(r => r.id !== id));
  };

  // Оновлення ресурсів
  const handleUpdateGlobalResources = (fields) => {
    setGlobalResources(prev => ({ ...prev, ...fields }));
  };

  // Відкриття Upgrade Tree
  const handleOpenUpgradeTree = (item, chainResult, type = 'equipment') => {
    setTreeModal({
      isOpen: true,
      item,
      chainResult,
      type
    });
  };

  // Збереження / скидання конфігурації
  const handleSaveGameData = (newData) => {
    setGameData(newData);
  };

  const handleResetGameData = () => {
    setGameData(DEFAULT_GAME_DATA);
    localStorage.removeItem('archero2_game_data');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        onOpenDataConfig={() => setIsDataConfigOpen(true)}
      />

      {/* Main Content Area */}
      <main className="game-container" style={{ flex: 1, paddingBottom: '40px' }}>
        {/* Quick Resource Bar */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '10px 16px',
          marginBottom: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Ваші баланси:</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              🪙 Gold: <strong style={{ color: 'var(--accent-gold)' }}>{formatNumber(globalResources.gold)}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              📜 Scrolls: <strong style={{ color: '#2196f3' }}>{formatNumber(globalResources.scrolls)}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              ✨ Rune Dust: <strong style={{ color: '#a855f7' }}>{formatNumber(globalResources.runeDust)}</strong>
            </span>
          </div>

          <button
            onClick={() => setActiveTab('resources')}
            style={{
              fontSize: '0.8rem',
              color: 'var(--accent-gold)',
              fontWeight: 600,
              textDecoration: 'underline'
            }}
          >
            Редагувати запаси →
          </button>
        </div>

        {/* Tab 1: Equipment */}
        {activeTab === 'equipment' && (
          <EquipmentTab
            equipmentItems={equipmentItems}
            globalResources={globalResources}
            gameData={gameData}
            onAddOrUpdateItem={handleAddOrUpdateItem}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onOpenUpgradeTree={(item, chain) => handleOpenUpgradeTree(item, chain, 'equipment')}
          />
        )}

        {/* Tab 2: Runes */}
        {activeTab === 'runes' && (
          <RuneTab
            runeItems={runeItems}
            globalResources={globalResources}
            gameData={gameData}
            onAddOrUpdateRune={handleAddOrUpdateRune}
            onUpdateRune={handleUpdateRune}
            onRemoveRune={handleRemoveRune}
            onOpenUpgradeTree={(rune, chain) => handleOpenUpgradeTree(rune, chain, 'runes')}
          />
        )}

        {/* Tab 3: Resources */}
        {activeTab === 'resources' && (
          <ResourcesTab
            globalResources={globalResources}
            onUpdateGlobalResources={handleUpdateGlobalResources}
            equipmentItems={equipmentItems}
            runeItems={runeItems}
          />
        )}

        {/* Mass Calculator & Farming Priority Section */}
        <TotalPlanSection
          totalPlan={totalPlan}
          farmingPriorities={farmingPriorities}
          gameData={gameData}
        />
      </main>

      {/* Upgrade Tree Modal */}
      {treeModal.isOpen && (
        <UpgradeTreeModal
          item={treeModal.item}
          chainResult={treeModal.chainResult}
          type={treeModal.type}
          onClose={() => setTreeModal(prev => ({ ...prev, isOpen: false }))}
        />
      )}

      {/* Data Config Modal */}
      {isDataConfigOpen && (
        <DataConfigModal
          gameData={gameData}
          onSave={handleSaveGameData}
          onReset={handleResetGameData}
          onClose={() => setIsDataConfigOpen(false)}
        />
      )}

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
        padding: '16px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        Archero 2 Upgrade Calculator • Архітектура з розділеними формулами • Усі дані зберігаються локально
      </footer>
    </div>
  );
}
