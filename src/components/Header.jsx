import React from 'react';
import { Settings, Moon, Sun, Shield, Sparkles, Package, ListChecks } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  onOpenDataConfig,
  totalPlanSummary
}) {
  const tabs = [
    { id: 'equipment', label: 'Обладнання', icon: '⚔️' },
    { id: 'runes', label: 'Руни', icon: '🔮' },
    { id: 'resources', label: 'Ресурси', icon: '📦' },
  ];

  return (
    <header style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)'
    }}>
      <div className="game-container" style={{ padding: '12px 16px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px'
        }}>
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ffb300, #ff5722)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 12px rgba(255, 179, 0, 0.35)'
            }}>
              🏹
            </div>
            <div>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: 'var(--text-primary)'
              }}>
                Archero 2 Upgrade Calculator
              </h1>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Розрахунок вартості прокачки, необхідних копій та пріоритетів фарму
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onOpenDataConfig}
              className="game-btn game-btn-secondary"
              title="Налаштування формул та вартості прокачки"
              style={{ fontSize: '0.85rem', padding: '7px 12px' }}
            >
              <Settings size={16} />
              <span>⚙ Дані прокачки</span>
            </button>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="game-btn game-btn-secondary"
              title={theme === 'dark' ? 'Перемкнути на світлу тему' : 'Перемкнути на темну тему'}
              style={{ padding: '7px 10px', borderRadius: '10px' }}
            >
              {theme === 'dark' ? <Sun size={17} color="#facc15" /> : <Moon size={17} color="#64748b" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '2px'
        }}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  borderRadius: '8px 8px 0 0',
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-card)' : 'transparent',
                  borderBottom: isActive ? '2px solid var(--accent-gold)' : '2px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
