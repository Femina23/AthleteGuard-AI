import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-14 h-14 rounded-2xl',
  };

  return (
    <div
      className={`relative flex items-center justify-center bg-[#5F432F] shadow-sm flex-shrink-0 ${sizeMap[size]} ${className}`}
      style={{
        boxShadow: '0 4px 12px rgba(60, 40, 20, 0.25)',
      }}
    >
      <svg
        viewBox="0 0 40 40"
        className="w-3/5 h-3/5 text-[#F8F1D9]"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="rotate(-45 20 20)">
          {/* Left weight plates */}
          <rect x="7" y="14" width="4" height="12" rx="1.5" />
          <rect x="12" y="16" width="3" height="8" rx="1" />
          
          {/* Center handle */}
          <rect x="15" y="18.5" width="10" height="3" rx="1.5" />
          
          {/* Grip ring */}
          <circle cx="20" cy="20" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.85" />
          
          {/* Right weight plates */}
          <rect x="25" y="16" width="3" height="8" rx="1" />
          <rect x="29" y="14" width="4" height="12" rx="1.5" />
        </g>
      </svg>
    </div>
  );
};
