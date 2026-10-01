import React from 'react';

/**
 * Аутентичні ігрові векторні іконки рун Archero 2
 * Включаючи Гравійовані руни (Etched Runes), Руни Благословення та Посилення
 */
export default function RuneIcon({ id, size = 36, rarityColor = '#ffb300' }) {
  const s = size;

  switch (id) {
    // 1. Гравійована руна: Стріла Ехо (Arrow of Echoes) - ТОП руна в грі
    case 'etched_echo_arrow':
    case 'etched_arrow':
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stone Base Tablet */}
          <rect x="8" y="6" width="48" height="52" rx="10" fill="#1b2230" stroke="#334155" strokeWidth="2" />
          <path d="M12 10L52 10M12 54L52 54" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Glowing Arcane Glyphs in Background */}
          <circle cx="32" cy="32" r="18" stroke={rarityColor} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 2" />
          {/* Engraved Bow */}
          <path d="M22 16C36 24 36 40 22 48" stroke={rarityColor} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="22" y1="16" x2="22" y2="48" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* Main Glowing Arrow */}
          <line x1="16" y1="32" x2="48" y2="32" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M42 25L50 32L42 39" fill={rarityColor} />
          <path d="M44 26L50 32L44 38" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
          {/* Echo Twin Arrow (Ghost) */}
          <line x1="20" y1="24" x2="44" y2="24" stroke={rarityColor} strokeWidth="2" strokeOpacity="0.75" strokeDasharray="3 2" />
          <path d="M40 20L46 24L40 28" fill={rarityColor} fillOpacity="0.75" />
          <line x1="20" y1="40" x2="44" y2="40" stroke={rarityColor} strokeWidth="2" strokeOpacity="0.75" strokeDasharray="3 2" />
          <path d="M40 36L46 40L40 44" fill={rarityColor} fillOpacity="0.75" />
          {/* Sparkles */}
          <circle cx="50" cy="18" r="2" fill="#fef08a" />
          <circle cx="16" cy="46" r="1.5" fill="#fef08a" />
        </svg>
      );

    // 2. Гравійована руна: Удар Меча (Sword Strike)
    case 'etched_sword':
    case 'etched_sword_strike':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="6" width="48" height="52" rx="10" fill="#1b2230" stroke="#334155" strokeWidth="2" />
          <circle cx="32" cy="32" r="18" stroke={rarityColor} strokeWidth="1" strokeOpacity="0.3" />
          {/* Left Blade */}
          <path d="M18 16L32 30L30 32L16 18Z" fill="#e2e8f0" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="30" y1="32" x2="46" y2="48" stroke={rarityColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="38" y1="44" x2="44" y2="38" stroke="#f1f5f9" strokeWidth="2.5" />
          {/* Right Blade */}
          <path d="M46 16L32 30L34 32L48 18Z" fill="#e2e8f0" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="34" y1="32" x2="18" y2="48" stroke={rarityColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="26" y1="44" x2="20" y2="38" stroke="#f1f5f9" strokeWidth="2.5" />
          {/* Center Slash Flash */}
          <polygon points="32,22 35,32 45,32 36,36 39,46 32,38 25,46 28,36 19,32 29,32" fill={rarityColor} />
        </svg>
      );

    // 3. Гравійована руна: Метеор (Meteor Rune)
    case 'etched_meteor':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="6" width="48" height="52" rx="10" fill="#1b2230" stroke="#334155" strokeWidth="2" />
          {/* Fiery Trail */}
          <path d="M48 14L28 34L22 28L42 8Z" fill="url(#meteorGrad)" opacity="0.8" />
          <path d="M42 20L26 36L22 32L38 16Z" fill="#f97316" />
          {/* Meteor Core */}
          <circle cx="24" cy="38" r="10" fill="#ea580c" />
          <circle cx="23" cy="37" r="7" fill="#facc15" />
          <circle cx="22" cy="36" r="4" fill="#ffffff" />
          {/* Impact Sparks */}
          <line x1="14" y1="44" x2="8" y2="50" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="50" x2="24" y2="56" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="44" x2="38" y2="50" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="meteorGrad" x1="48" y1="8" x2="22" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#facc15" />
              <stop offset="0.5" stopColor="#ea580c" />
              <stop offset="1" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 4. Гравійована руна: Пульсуюча Сфера (Pulsing Orb)
    case 'etched_orb':
    case 'etched_pulsing_orb':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="6" width="48" height="52" rx="10" fill="#1b2230" stroke="#334155" strokeWidth="2" />
          {/* Wave Rings */}
          <circle cx="32" cy="32" r="22" stroke={rarityColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          <circle cx="32" cy="32" r="16" stroke={rarityColor} strokeWidth="1.5" opacity="0.7" />
          {/* Core Orb */}
          <circle cx="32" cy="32" r="10" fill="#06b6d4" />
          <circle cx="30" cy="30" r="6" fill="#67e8f9" />
          <circle cx="29" cy="29" r="2.5" fill="#ffffff" />
          {/* Arcane Orbitals */}
          <ellipse cx="32" cy="32" rx="14" ry="5" stroke="#ffffff" strokeWidth="1.5" transform="rotate(-30 32 32)" />
        </svg>
      );

    // 5. Гравійована руна: Стихійний Шквал (Elemental Surge)
    case 'etched_elemental':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="6" width="48" height="52" rx="10" fill="#1b2230" stroke="#334155" strokeWidth="2" />
          {/* Triangle Elements */}
          {/* Fire */}
          <path d="M32 16L38 26H26Z" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />
          {/* Ice */}
          <path d="M42 36L48 46H36Z" fill="#06b6d4" stroke="#a5f3fc" strokeWidth="1" />
          {/* Lightning */}
          <path d="M22 36L28 46H16Z" fill="#eab308" stroke="#fef08a" strokeWidth="1" />
          <circle cx="32" cy="34" r="5" fill="#ffffff" />
        </svg>
      );

    // 6. Руна Благословення: Відродження (Blessing of Rebirth)
    case 'blessing_rebirth':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="6" width="48" height="52" rx="10" fill="#1b2230" stroke="#334155" strokeWidth="2" />
          {/* Phoenix Wing Halo */}
          <path d="M18 42C16 30 26 18 32 16C38 18 48 30 46 42C42 46 36 48 32 48C28 48 22 46 18 42Z" fill="url(#rebirthGrad)" opacity="0.35" />
          {/* Sacred Ankh / Wing Cross */}
          <circle cx="32" cy="24" r="6" stroke="#facc15" strokeWidth="2.5" />
          <line x1="32" y1="30" x2="32" y2="48" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          <line x1="22" y1="34" x2="42" y2="34" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          {/* Heart Light */}
          <circle cx="32" cy="34" r="3" fill="#ffffff" />
          <defs>
            <linearGradient id="rebirthGrad" x1="32" y1="16" x2="32" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#facc15" />
              <stop offset="1" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 7. Руна Посилення: Абсолютна Сила (Absolute Power)
    case 'enhancement_power':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="6" width="48" height="52" rx="10" fill="#1b2230" stroke="#334155" strokeWidth="2" />
          {/* Glowing Fist */}
          <path d="M24 28V22C24 20.9 24.9 20 26 20C27.1 20 28 20.9 28 22V28" stroke="#fbbf24" strokeWidth="2" />
          <path d="M28 28V19C28 17.9 28.9 17 30 17C31.1 17 32 17.9 32 19V28" stroke="#fbbf24" strokeWidth="2" />
          <path d="M32 28V21C32 19.9 32.9 19 34 19C35.1 19 36 19.9 36 21V28" stroke="#fbbf24" strokeWidth="2" />
          <rect x="22" y="27" width="20" height="17" rx="4" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
          <line x1="26" y1="44" x2="26" y2="50" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="38" y1="44" x2="38" y2="50" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          {/* Power Aura */}
          <circle cx="32" cy="33" r="16" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
        </svg>
      );

    // 8. Руна Здібностей: Критичний Удар (Precision Strike)
    case 'ability_crit':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="6" width="48" height="52" rx="10" fill="#1b2230" stroke="#334155" strokeWidth="2" />
          {/* Crosshair Target */}
          <circle cx="32" cy="32" r="16" stroke="#f43f5e" strokeWidth="2" />
          <circle cx="32" cy="32" r="8" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="32" cy="32" r="3" fill="#ffffff" />
          <line x1="12" y1="32" x2="20" y2="32" stroke="#f43f5e" strokeWidth="2" />
          <line x1="44" y1="32" x2="52" y2="32" stroke="#f43f5e" strokeWidth="2" />
          <line x1="32" y1="12" x2="32" y2="20" stroke="#f43f5e" strokeWidth="2" />
          <line x1="32" y1="44" x2="32" y2="52" stroke="#f43f5e" strokeWidth="2" />
        </svg>
      );
  }
}
