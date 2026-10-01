import React from 'react';
import { Target, Compass, Sparkles, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { formatNumber } from '../engine/calculator.js';

export default function TotalPlanSection({
  totalPlan,
  farmingPriorities,
  gameData
}) {
  const tiers = gameData?.equipment?.tiers || [];
  const getTierLabel = (tierId) => tiers.find(t => t.id === tierId)?.label || tierId;

  const { equipmentPlan, runePlan, totalRequired, totalOwned, globalMissing, overallProgress, hasActiveGoals } = totalPlan;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {/* 1. MY UPGRADE PLAN (Масовий калькулятор цілей) */}
        <div className="game-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={20} color="var(--accent-gold)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                MY UPGRADE PLAN
              </h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {equipmentPlan.filter(p => p.cost.isValid).length + runePlan.filter(p => p.cost.isValid).length} активних цілей
            </span>
          </div>

          {/* List of Goals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
            {equipmentPlan.map(p => {
              if (!p.cost.isValid) return null;
              const missingCopies = p.missingResult?.missing?.copies || 0;
              const missingGold = p.missingResult?.missing?.gold || 0;
              const isReady = p.missingResult?.allSufficient;

              return (
                <div
                  key={p.item.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                      <span>{p.item.icon}</span>
                      <span>{p.item.name}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                      {getTierLabel(p.item.currentTier)} → {getTierLabel(p.item.targetTier)}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: isReady ? 'var(--status-ready-text)' : 'var(--text-secondary)' }}>
                    {isReady ? (
                      <span style={{ fontWeight: 600 }}>✓ Готово до прокачки</span>
                    ) : (
                      <span>
                        Missing: <strong style={{ color: '#ef4444' }}>{missingCopies} copies</strong> / <strong style={{ color: '#ef4444' }}>{formatNumber(missingGold)} gold</strong>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {runePlan.map(p => {
              if (!p.cost.isValid) return null;
              const missingFrags = p.missingResult?.missing?.fragments || 0;
              const missingGold = p.missingResult?.missing?.gold || 0;
              const isReady = p.missingResult?.allSufficient;

              return (
                <div
                  key={p.rune.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                      <span>{p.rune.icon}</span>
                      <span>{p.rune.name}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      Lv. {p.rune.currentLevel} → Lv. {p.rune.targetLevel}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: isReady ? 'var(--status-ready-text)' : 'var(--text-secondary)' }}>
                    {isReady ? (
                      <span style={{ fontWeight: 600 }}>✓ Готово до прокачки</span>
                    ) : (
                      <span>
                        Missing: <strong style={{ color: '#ef4444' }}>{missingFrags} fragments</strong> / <strong style={{ color: '#ef4444' }}>{formatNumber(missingGold)} gold</strong>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {!hasActiveGoals && (
              <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Всі вибрані предмети або руни вже досягли своїх цілей!
              </div>
            )}
          </div>

          {/* TOTAL Section at bottom */}
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: '10px',
            padding: '12px 16px',
            border: '1px solid var(--border-color)',
            marginTop: 'auto'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '8px', letterSpacing: '0.04em' }}>
              TOTAL (СУМАРНА ПОТРЕБА ДЛЯ ВСІХ ЦІЛЕЙ)
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '8px',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Gold: </span>
                <strong>{formatNumber(totalRequired.gold)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Copies: </span>
                <strong>{totalRequired.copies}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Fragments: </span>
                <strong>{totalRequired.fragments}</strong>
              </div>
              {totalRequired.scrolls > 0 && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Scrolls: </span>
                  <strong>{formatNumber(totalRequired.scrolls)}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. FARMING PRIORITY ("Що мені зараз фармити?") */}
        <div className="game-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #ffb300' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} color="#ffb300" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                FARMING PRIORITY
              </h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Що фармити насамперед
            </span>
          </div>

          {/* List of farming priorities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, maxHeight: '360px', overflowY: 'auto' }}>
            {farmingPriorities.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '30px 16px',
                background: 'var(--status-ready-bg)',
                borderRadius: '10px',
                border: '1px solid var(--status-ready-border)',
                color: 'var(--status-ready-text)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={32} />
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Усі ресурси зібрано!</div>
                <div style={{ fontSize: '0.82rem' }}>Ви можете прокачати всі заплановані цілі прямо зараз.</div>
              </div>
            ) : (
              farmingPriorities.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      color: idx === 0 ? '#ffb300' : 'var(--text-secondary)'
                    }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Пріоритет: {item.type === 'copies' ? 'Найвищий (Предмет)' : item.type === 'fragments' ? 'Руни' : 'Ресурс'}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Need:
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ef4444' }}>
                      {formatNumber(item.need)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick hint */}
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            padding: '8px 12px',
            background: 'var(--bg-surface)',
            borderRadius: '8px'
          }}>
            💡 <strong>Порада:</strong> Спочатку фарміть рідкісні копії та фрагменти рун, оскільки золото накопичується попутно під час проходження глав і патрулів.
          </div>
        </div>
      </div>
    </div>
  );
}
