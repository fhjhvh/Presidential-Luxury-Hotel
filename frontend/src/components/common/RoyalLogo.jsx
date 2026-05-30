import React from 'react';
import './RoyalLogo.css';

// Inline SVG crest — crisp at any size, no network request
const Crest = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 240"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="rlg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#F5DC6E"/>
        <stop offset="40%"  stopColor="#D4AF37"/>
        <stop offset="100%" stopColor="#9E7A15"/>
      </linearGradient>
      <linearGradient id="rsbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#10101C"/>
        <stop offset="100%" stopColor="#07070F"/>
      </linearGradient>
    </defs>

    {/* Shield outer */}
    <path d="M100 4 L192 36 L192 148 Q192 212 100 236 Q8 212 8 148 L8 36 Z"
          fill="url(#rsbg)" stroke="url(#rlg)" strokeWidth="1.8"/>
    {/* Shield inner border */}
    <path d="M100 14 L182 42 L182 146 Q182 204 100 226 Q18 204 18 146 L18 42 Z"
          fill="none" stroke="#D4AF37" strokeWidth="0.7" opacity="0.45"/>

    {/* Crown body */}
    <path d="M62,96 L62,71 L80,82 L100,62 L120,82 L138,71 L138,96 Z"
          fill="url(#rlg)"/>
    {/* Crown rim */}
    <rect x="60" y="92" width="80" height="9" rx="3.5" fill="url(#rlg)"/>

    {/* Crown peak orbs */}
    <circle cx="62"  cy="71" r="4"   fill="url(#rlg)"/>
    <circle cx="100" cy="62" r="5"   fill="url(#rlg)"/>
    <circle cx="138" cy="71" r="4"   fill="url(#rlg)"/>

    {/* Crown gems */}
    <ellipse cx="80"  cy="80" rx="4.5" ry="4" fill="#8B0000" opacity="0.9"/>
    <ellipse cx="100" cy="73" rx="5"   ry="4.5" fill="#00246A" opacity="0.9"/>
    <ellipse cx="120" cy="80" rx="4.5" ry="4" fill="#004D1A" opacity="0.9"/>

    {/* Top divider */}
    <line x1="30" y1="112" x2="170" y2="112" stroke="#D4AF37" strokeWidth="0.7" opacity="0.6"/>
    <circle cx="52"  cy="112" r="2"   fill="#D4AF37" opacity="0.7"/>
    <rect x="98" y="109" width="4" height="4" fill="#D4AF37" transform="rotate(45 100 112)"/>
    <circle cx="148" cy="112" r="2"   fill="#D4AF37" opacity="0.7"/>

    {/* Monogram P */}
    <text x="100" y="188"
          fontFamily="'Playfair Display','Cinzel','Times New Roman',Georgia,serif"
          fontSize="82" fontWeight="700"
          textAnchor="middle" dominantBaseline="auto"
          fill="url(#rlg)" opacity="0.97">P</text>

    {/* Bottom divider */}
    <line x1="30" y1="198" x2="170" y2="198" stroke="#D4AF37" strokeWidth="0.7" opacity="0.6"/>
    <circle cx="52"  cy="198" r="2"   fill="#D4AF37" opacity="0.7"/>
    <rect x="98" y="195" width="4" height="4" fill="#D4AF37" transform="rotate(45 100 198)"/>
    <circle cx="148" cy="198" r="2"   fill="#D4AF37" opacity="0.7"/>

    {/* Stars */}
    <text x="100" y="218"
          fontFamily="serif" fontSize="9"
          textAnchor="middle" fill="url(#rlg)"
          letterSpacing="3">★★★★★</text>
  </svg>
);

/**
 * RoyalLogo — reusable hotel brand logo.
 *
 * Props:
 *   size      : 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 *   layout    : 'horizontal' | 'vertical'
 *   showTagline : boolean
 *   className : additional CSS class
 */
export default function RoyalLogo({
  size       = 'md',
  layout     = 'horizontal',
  showTagline = false,
  className  = '',
}) {
  return (
    <div className={`royal-logo royal-logo--${size} royal-logo--${layout} ${className}`}>
      <Crest className="royal-logo__crest" />
      <div className="royal-logo__text">
        <span className="royal-logo__title">PRESIDENTIAL</span>
        <span className="royal-logo__subtitle">ROYAL PALACE</span>
        <span className="royal-logo__hotel">HOTEL</span>
        {showTagline && (
          <span className="royal-logo__tagline">Luxury. Comfort. Excellence.</span>
        )}
      </div>
    </div>
  );
}
