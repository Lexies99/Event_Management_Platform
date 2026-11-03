import React from 'react';

/**
 * TenantLogo renders the company's brand logo or a high-end monogram emblem
 * styled strictly with the custom 4-color luxury palette:
 * Mauve (#AB6088), Coral (#FB9378), Champagne Gold (#E0C97E), Butter Vanilla (#FCF8B3).
 */
export default function TenantLogo({ 
  tenant, 
  className = "w-12 h-12 rounded-2xl", 
  size = 48,
  alt = ""
}) {
  const isDefaultBlue = 
    !tenant?.logoUrl || 
    tenant.logoUrl.includes('photo-1618005182384-a83a8bd57fbe') ||
    tenant.logoUrl.includes('unsplash');

  const initial = (tenant?.name || 'E').trim().charAt(0).toUpperCase();

  if (isDefaultBlue) {
    return (
      <div 
        className={`${className} shrink-0 flex items-center justify-center font-heading font-extrabold shadow-lg border border-[#E0C97E]/40 relative overflow-hidden select-none`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          background: 'linear-gradient(135deg, #AB6088 0%, #FB9378 50%, #E0C97E 100%)'
        }}
        title={tenant?.name}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]"></div>
        <span 
          className="relative z-10 font-heading font-black text-[#141413] tracking-tighter"
          style={{ fontSize: `${Math.round(size * 0.45)}px` }}
        >
          {initial}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={tenant.logoUrl} 
      alt={alt || tenant?.name || 'Company Logo'} 
      className={`${className} object-cover border-2 border-[#E0C97E]/40 shadow-lg bg-[#141413] shrink-0`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`
      }}
    />
  );
}

