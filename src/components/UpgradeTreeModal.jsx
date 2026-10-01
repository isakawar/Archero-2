import React from 'react';
import { X, ArrowDown, ArrowLeft, Plus } from 'lucide-react';
import { formatNumber } from '../engine/calculator.js';

export default function UpgradeTreeModal({ item, chainResult, type = 'equipment', onClose }) {
  if (!item || !chainResult) return null;

  const { steps, isValid, isAlreadyAtTarget, isInvalidTarget } = chainResult;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '640px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
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
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                Шлях прокачки: {item.name}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Схема злиття за офіційними правилами Archero 2
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {steps.map((step, idx) => (
                <div key={idx}>
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '16px',
                    position: 'relative'
                  }}>
                    {/* Step Title & Formula */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
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
                          fontWeight: 800
                        }}>
                          {step.stepIndex}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                          Крок: {type === 'equipment' ? `${step.from.label} → ${step.to.label}` : `Level ${step.fromLevel} → Level ${step.toLevel}`}
                        </span>
                      </div>

                      {type === 'equipment' && step.description && (
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'var(--bg-input)',
                          color: 'var(--accent-gold)',
                          fontWeight: 600
                        }}>
                          {step.description}
                        </span>
                      )}
                    </div>

                    {/* Visual Fusion Row (Як на картинці з гри) */}
                    {type === 'equipment' && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'var(--bg-input)',
                        padding: '12px',
                        borderRadius: '10px',
                        marginBottom: '12px',
                        overflowX: 'auto'
                      }}>
                        {/* Target Item (Result) */}
                        <div style={{
                          minWidth: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          border: `2px solid ${step.to.border}`,
                          background: step.to.bg,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}>
                          <span style={{ fontSize: '1.4rem' }}>{item.icon || '🏹'}</span>
                          {step.to.badge && (
                            <span style={{
                              position: 'absolute',
                              bottom: '-2px',
                              background: step.to.color,
                              color: '#000',
                              fontSize: '0.62rem',
                              fontWeight: 900,
                              borderRadius: '4px',
                              padding: '0 4px',
                              lineHeight: 1.2
                            }}>
                              {step.to.badge}
                            </span>
                          )}
                        </div>

                        {/* Arrow pointing to result */}
                        <div style={{ color: '#22c55e', display: 'flex', alignItems: 'center' }}>
                          <ArrowLeft size={22} strokeWidth={3} />
                        </div>

                        {/* Base Item */}
                        <div style={{
                          minWidth: '52px',
                          height: '52px',
                          borderRadius: '10px',
                          border: `2px solid ${step.from.border}`,
                          background: step.from.bg,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }} title={`Базовий предмет: ${step.from.label}`}>
                          <span style={{ fontSize: '1.3rem' }}>{item.icon || '🏹'}</span>
                          {step.from.badge && (
                            <span style={{
                              position: 'absolute',
                              bottom: '-2px',
                              background: step.from.color,
                              color: '#000',
                              fontSize: '0.6rem',
                              fontWeight: 900,
                              borderRadius: '4px',
                              padding: '0 4px',
                              lineHeight: 1.2
                            }}>
                              {step.from.badge}
                            </span>
                          )}
                        </div>

                        {/* Same copies material */}
                        {step.required.sameCopies > 0 && Array.from({ length: step.required.sameCopies }).map((_, i) => (
                          <React.Fragment key={'same_' + i}>
                            <span style={{ color: '#22c55e', fontWeight: 900, fontSize: '1.2rem' }}>+</span>
                            <div style={{
                              minWidth: '52px',
                              height: '52px',
                              borderRadius: '10px',
                              border: `2px solid ${step.from.border}`,
                              background: step.from.bg,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative'
                            }} title={`Такий самий предмет: ${item.name} (${step.required.sameRarity})`}>
                              <span style={{ fontSize: '1.3rem' }}>{item.icon || '🏹'}</span>
                              {step.from.badge && (
                                <span style={{
                                  position: 'absolute',
                                  bottom: '-2px',
                                  background: step.from.color,
                                  color: '#000',
                                  fontSize: '0.6rem',
                                  fontWeight: 900,
                                  borderRadius: '4px',
                                  padding: '0 4px',
                                  lineHeight: 1.2
                                }}>
                                  {step.from.badge}
                                </span>
                              )}
                            </div>
                          </React.Fragment>
                        ))}

                        {/* Fodder material (Корм) */}
                        {step.required.fodderCopies > 0 && Array.from({ length: step.required.fodderCopies }).map((_, i) => (
                          <React.Fragment key={'fodder_' + i}>
                            <span style={{ color: '#22c55e', fontWeight: 900, fontSize: '1.2rem' }}>+</span>
                            <div style={{
                              minWidth: '52px',
                              height: '52px',
                              borderRadius: '10px',
                              border: `2px dashed ${step.from.border}`,
                              background: step.from.bg,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              opacity: 0.85
                            }} title={`Будь-який предмет ${step.required.fodderRarity} на корм`}>
                              <span style={{ fontSize: '1.3rem', filter: 'grayscale(100%) opacity(0.6)' }}>{item.icon || '🏹'}</span>
                              <span style={{
                                position: 'absolute',
                                bottom: '2px',
                                fontSize: '0.55rem',
                                color: 'var(--text-secondary)',
                                fontWeight: 700
                              }}>
                                КОРМ
                              </span>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    {/* Step Requirements Data Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                      gap: '8px',
                      background: 'var(--bg-surface)',
                      padding: '10px 12px',
                      borderRadius: '8px'
                    }}>
                      {type === 'equipment' && (
                        <>
                          {step.required.sameCopies > 0 && (
                            <div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Таких же копій</div>
                              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffb300' }}>
                                × {step.required.sameCopies} ({step.required.sameRarity})
                              </div>
                            </div>
                          )}

                          {step.required.fodderCopies > 0 && (
                            <div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Будь-який корм</div>
                              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--accent-purple)' }}>
                                × {step.required.fodderCopies} ({step.required.fodderRarity})
                              </div>
                            </div>
                          )}

                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Золото (Gold)</div>
                            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                              🪙 {formatNumber(step.required.gold)}
                            </div>
                          </div>

                          {step.required.scrolls > 0 && (
                            <div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Сувої (Scrolls)</div>
                              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                                📜 {formatNumber(step.required.scrolls)}
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
