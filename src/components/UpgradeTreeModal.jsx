import React from 'react';
import { X, ArrowDown, Sparkles } from 'lucide-react';
import { formatNumber } from '../engine/calculator.js';

export default function UpgradeTreeModal({ item, chainResult, type = 'equipment', onClose }) {
  if (!item || !chainResult) return null;

  const { steps, isValid, isAlreadyAtTarget, isInvalidTarget } = chainResult;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '580px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
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
            <span style={{ fontSize: '1.5rem' }}>{item.icon || '⚔️'}</span>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                Шлях прокачки: {item.name}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Покрокові вимоги для кожного рівня
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="stepper-btn"
            style={{ border: 'none', background: 'transparent' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {isAlreadyAtTarget && (
            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'var(--status-ready-bg)',
              color: 'var(--status-ready-text)',
              textAlign: 'center',
              fontWeight: 600
            }}>
              ✓ Предмет вже на цільовому рівні! Прокачка не потрібна.
            </div>
          )}

          {isInvalidTarget && (
            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'var(--status-missing-bg)',
              color: 'var(--status-missing-text)',
              textAlign: 'center',
              fontWeight: 600
            }}>
              ✕ Цільовий рівень повинен бути вищим за поточний!
            </div>
          )}

          {isValid && steps && steps.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {steps.map((step, idx) => (
                <div key={idx}>
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    position: 'relative'
                  }}>
                    {/* Step Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {step.stepIndex}
                        </span>
                        <span style={{
                          fontWeight: 700,
                          color: type === 'equipment' ? step.from.color : 'var(--accent-gold)'
                        }}>
                          {type === 'equipment' ? step.from.label : `Level ${step.fromLevel}`}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>→</span>
                        <span style={{
                          fontWeight: 700,
                          color: type === 'equipment' ? step.to.color : '#22c55e'
                        }}>
                          {type === 'equipment' ? step.to.label : `Level ${step.toLevel}`}
                        </span>
                      </div>
                    </div>

                    {/* Step Requirements Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                      gap: '8px',
                      background: 'var(--bg-input)',
                      padding: '10px 12px',
                      borderRadius: '8px'
                    }}>
                      {type === 'equipment' && (
                        <>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Копій предмета</div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffb300' }}>
                              × {step.required.copies}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Золото (Gold)</div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                              🪙 {formatNumber(step.required.gold)}
                            </div>
                          </div>
                          {step.required.scrolls > 0 && (
                            <div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Сувої (Scrolls)</div>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                📜 {formatNumber(step.required.scrolls)}
                              </div>
                            </div>
                          )}
                          {step.required.other > 0 && (
                            <div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Інші ресурси</div>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                💎 {step.required.other}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {type === 'runes' && (
                        <>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Фрагменти руни</div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#06b6d4' }}>
                              🔮 {step.required.fragments}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Золото (Gold)</div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                              🪙 {formatNumber(step.required.gold)}
                            </div>
                          </div>
                          {step.required.runeDust > 0 && (
                            <div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Пил рун (Dust)</div>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                ✨ {step.required.runeDust}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow to next step */}
                  {idx < steps.length - 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '4px 0',
                      color: 'var(--text-muted)'
                    }}>
                      <ArrowDown size={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'var(--bg-surface)'
        }}>
          <button onClick={onClose} className="game-btn game-btn-secondary" style={{ padding: '8px 20px' }}>
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
}
