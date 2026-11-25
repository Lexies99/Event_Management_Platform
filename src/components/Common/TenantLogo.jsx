import React from 'react';
import { getAccessibleTextColor } from '../../utils/branding';

/**
 * TenantLogo renders the organization's uploaded logo or a crisp FinPlanner monogram badge
 * using the tenant's dynamic primary color and accessible WCAG text contrast.
 */
export default function TenantLogo({
  tenant,
  className = "rounded-xl",
  size = 44,
  alt = ""
}) {
  const numericSize = typeof size === 'number'
    ? size
    : size === 'sm' ? 32 : size === 'md' ? 44 : 52;

  const hasCustomLogo = Boolean(
    tenant?.logoUrl &&
    !tenant.logoUrl.includes('unsplash.com')
  );

  const initials = (tenant?.shortName || tenant?.name || 'EP')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const primaryBg = tenant?.primaryColor || tenant?.brandColor || '#5A6552';
  const textColor = getAccessibleTextColor(primaryBg);

  if (!hasCustomLogo) {
    return (
      <div
        className={`${className} shrink-0 flex items-center justify-center font-bold select-none`}
        style={{
          width: `${numericSize}px`,
          height: `${numericSize}px`,
          minWidth: `${numericSize}px`,
          minHeight: `${numericSize}px`,
          backgroundColor: primaryBg,
          color: textColor,
          fontSize: `${Math.round(numericSize * 0.36)}px`,
          border: '1px solid rgba(0,0,0,0.08)',
        }}
        title={tenant?.name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={tenant.logoUrl}
      alt={alt || tenant?.name || 'Organization Logo'}
      className={`${className} object-contain shrink-0 bg-white`}
      style={{
        width: `${numericSize}px`,
        height: `${numericSize}px`,
        minWidth: `${numericSize}px`,
        minHeight: `${numericSize}px`,
        padding: '3px',
        border: '1px solid var(--border-color)',
      }}
    />
  );
}
