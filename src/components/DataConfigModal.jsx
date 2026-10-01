import React, { useState } from 'react';
import { X, Save, RotateCcw, Copy, Check, AlertCircle, FileCode, Sliders } from 'lucide-react';
import { DEFAULT_GAME_DATA } from '../data/defaultGameData.js';

export default function DataConfigModal({ gameData, onSave, onReset, onClose }) {
  const [activeTab, setActiveTab] = useState('equipment'); // 'equipment' | 'runes' | 'json'
  const [localData, setLocalData] = useState(() => JSON.parse(JSON.stringify(gameData)));
  const [jsonText, setJsonText] = useState(() => JSON.stringify(gameData, null, 2));
  const [jsonError, setJsonError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Оновлення окремого поля спорядження
  const handleEquipmentStepChange = (tierId, field, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setLocalData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next.equipment.stepRequirements[tierId]) {
        next.equipment.stepRequirements[tierId] = { copies: 2, gold: 100000, scrolls: 50, other: 0 };
      }
      next.equipment.stepRequirements[tierId][field] = num;
      setJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  // Оновлення окремого поля рун
  const handleRuneStepChange = (level, field, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setLocalData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next.runes.stepRequirements[level]) {
        next.runes.stepRequirements[level] = { fragments: 10, gold: 50000, runeDust: 5 };
      }
      next.runes.stepRequirements[level][field] = num;
      setJsonText(JSON.stringify(next, null, 2));
      return next;
    });
  };

  // Синхронізація JSON редактора
  const handleJsonChange = (e) => {
    const val = e.target.value;
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      if (!parsed.equipment || !parsed.runes) {
        throw new Error('Конфіг повинен містити об\'єкти equipment та runes');
      }
      setLocalData(parsed);
      setJsonError(null);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onSave(parsed);
      setSuccessMsg('✓ Дані успішно збережено!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 700);
    } catch (err) {
      setJsonError('Помилка синтаксису JSON перед збереженням');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Скинути всі налаштування прокачки до стандартних MOCK-значень?')) {
      onReset();
      setLocalData(JSON.parse(JSON.stringify(DEFAULT_GAME_DATA)));
      setJsonText(JSON.stringify(DEFAULT_GAME_DATA, null, 2));
      setJsonError(null);
      setSuccessMsg('✓ Скинуто до стандартних значень!');
      setTimeout(() => setSuccessMsg(''), 1500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '820px', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>⚙️</span>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                Дані прокачки (Upgrade Game Data)
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Редагуйте вимоги та формули в одному місці без зміни коду
              </p>
            </div>
          </div>
          <button onClick={onClose} className="stepper-btn" style={{ border: 'none', background: 'transparent' }}>
            <X size={20} />
          </button>
        </div>

        {/* Notice Banner */}
        <div style={{
          background: 'rgba(255, 179, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 179, 0, 0.25)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.82rem',
          color: 'var(--text-primary)'
        }}>
          <AlertCircle size={18} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
          <div>
            <strong>MOCK DATA:</strong> Усі формули та вартості тут тестові. Змініть значення в таблиці нижче або вставте свій JSON, коли матимете точні цифри з гри.
          </div>
        </div>

        {/* Sub-tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 20px 0 20px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-surface)'
        }}>
          <button
            onClick={() => setActiveTab('equipment')}
            style={{
              padding: '8px 14px',
              fontWeight: 600,
              fontSize: '0.88rem',
              color: activeTab === 'equipment' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'equipment' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              background: 'transparent'
            }}
          >
            ⚔️ Спорядження
          </button>
          <button
            onClick={() => setActiveTab('runes')}
            style={{
              padding: '8px 14px',
              fontWeight: 600,
              fontSize: '0.88rem',
              color: activeTab === 'runes' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'runes' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              background: 'transparent'
            }}
          >
            🔮 Руни
          </button>
          <button
            onClick={() => setActiveTab('json')}
            style={{
              padding: '8px 14px',
              fontWeight: 600,
              fontSize: '0.88rem',
              color: activeTab === 'json' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'json' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              background: 'transparent'
            }}
          >
            📝 Raw JSON
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'equipment' && (
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Вимоги для переходу на наступний рівень спорядження (Крок: поточний рівень → наступний):
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-input)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '10px 12px' }}>Рівень (Поточний)</th>
                      <th style={{ padding: '10px 12px' }}>Копій</th>
                      <th style={{ padding: '10px 12px' }}>Золото (Gold)</th>
                      <th style={{ padding: '10px 12px' }}>Сувої (Scrolls)</th>
                      <th style={{ padding: '10px 12px' }}>Інші ресурси</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localData.equipment.tiers.slice(0, -1).map((tier, idx) => {
                      const nextTier = localData.equipment.tiers[idx + 1];
                      const req = localData.equipment.stepRequirements[tier.id] || { copies: 2, gold: 100000, scrolls: 50, other: 0 };
                      return (
                        <tr key={tier.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                            <span style={{ color: tier.color }}>{tier.label}</span>
                            <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>→</span>
                            <span style={{ color: nextTier.color }}>{nextTier.label}</span>
                          </td>
                          <td style={{ padding: '6px 12px' }}>
                            <input
                              type="number"
                              min="0"
                              value={req.copies}
                              onChange={e => handleEquipmentStepChange(tier.id, 'copies', e.target.value)}
                              style={{ width: '70px', padding: '6px 8px' }}
                            />
                          </td>
                          <td style={{ padding: '6px 12px' }}>
                            <input
                              type="number"
                              min="0"
                              step="5000"
                              value={req.gold}
                              onChange={e => handleEquipmentStepChange(tier.id, 'gold', e.target.value)}
                              style={{ width: '110px', padding: '6px 8px' }}
                            />
                          </td>
                          <td style={{ padding: '6px 12px' }}>
                            <input
                              type="number"
                              min="0"
                              value={req.scrolls}
                              onChange={e => handleEquipmentStepChange(tier.id, 'scrolls', e.target.value)}
                              style={{ width: '70px', padding: '6px 8px' }}
                            />
                          </td>
                          <td style={{ padding: '6px 12px' }}>
                            <input
                              type="number"
                              min="0"
                              value={req.other || 0}
                              onChange={e => handleEquipmentStepChange(tier.id, 'other', e.target.value)}
                              style={{ width: '70px', padding: '6px 8px' }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'runes' && (
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Вимоги для прокачки рун на кожному рівні (Lv N → Lv N+1):
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-input)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '10px 12px' }}>Крок рівня</th>
                      <th style={{ padding: '10px 12px' }}>Фрагментів (Fragments)</th>
                      <th style={{ padding: '10px 12px' }}>Золото (Gold)</th>
                      <th style={{ padding: '10px 12px' }}>Пил рун (Rune Dust)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 19 }, (_, i) => i + 1).map(level => {
                      const req = localData.runes.stepRequirements[level] || { fragments: 10, gold: 50000, runeDust: 5 };
                      return (
                        <tr key={level} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                            Level {level} <span style={{ color: 'var(--text-muted)' }}>→</span> Level {level + 1}
                          </td>
                          <td style={{ padding: '6px 12px' }}>
                            <input
                              type="number"
                              min="0"
                              value={req.fragments}
                              onChange={e => handleRuneStepChange(level, 'fragments', e.target.value)}
                              style={{ width: '80px', padding: '6px 8px' }}
                            />
                          </td>
                          <td style={{ padding: '6px 12px' }}>
                            <input
                              type="number"
                              min="0"
                              step="5000"
                              value={req.gold}
                              onChange={e => handleRuneStepChange(level, 'gold', e.target.value)}
                              style={{ width: '120px', padding: '6px 8px' }}
                            />
                          </td>
                          <td style={{ padding: '6px 12px' }}>
                            <input
                              type="number"
                              min="0"
                              value={req.runeDust || 0}
                              onChange={e => handleRuneStepChange(level, 'runeDust', e.target.value)}
                              style={{ width: '80px', padding: '6px 8px' }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Ви можете відредагувати JSON напряму або скопіювати/вставити свій файл конфігурації:
                </span>
                <button 
                  onClick={handleCopyJson} 
                  className="game-btn game-btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                >
                  {copied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                  <span>{copied ? 'Скопійовано!' : 'Копіювати JSON'}</span>
                </button>
              </div>

              {jsonError && (
                <div style={{
                  padding: '10px 14px',
                  background: 'var(--status-missing-bg)',
                  color: 'var(--status-missing-text)',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  fontSize: '0.85rem'
                }}>
                  {jsonError}
                </div>
              )}

              <textarea
                value={jsonText}
                onChange={handleJsonChange}
                rows={18}
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  lineHeight: '1.4',
                  whiteSpace: 'pre',
                  resize: 'vertical'
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'var(--bg-surface)'
        }}>
          <div>
            <button
              onClick={handleResetToDefault}
              className="game-btn game-btn-danger"
              style={{ fontSize: '0.85rem', padding: '8px 14px' }}
            >
              <RotateCcw size={15} />
              <span>Скинути до стандартних mock</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {successMsg && (
              <span style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: 600 }}>
                {successMsg}
              </span>
            )}
            <button onClick={onClose} className="game-btn game-btn-secondary">
              Скасувати
            </button>
            <button onClick={handleSave} className="game-btn game-btn-primary">
              <Save size={16} />
              <span>Зберегти налаштування</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
