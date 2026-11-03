import { type HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', dot = false, className = '', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-cream-300 text-dark-200 border border-olive-200',
      success: 'bg-green-500/20 text-green-400 border border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
      info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      primary: 'bg-brown-500/20 text-brown-500 border border-brown-500/30',
      accent: 'bg-olive-500/20 text-olive-500 border border-olive-500/30',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {dot && <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(variant)}`} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

function getDotColor(variant: BadgeProps['variant']): string {
  switch (variant) {
    case 'success': return 'bg-green-400';
    case 'warning': return 'bg-yellow-400';
    case 'danger': return 'bg-red-400';
    case 'info': return 'bg-blue-400';
    case 'primary': return 'bg-brown-500';
    case 'accent': return 'bg-olive-500';
    default: return 'bg-dark-400';
  }
}

interface StatusIndicatorProps {
  status: 'idle' | 'connecting' | 'active' | 'warning' | 'error' | 'disconnected';
  label?: string;
  showDot?: boolean;
  className?: string;
}

export function StatusIndicator({ status, label, showDot = true, className = '' }: StatusIndicatorProps) {
  const statusConfig = {
    idle: { variant: 'default' as const, dotColor: 'bg-dark-500', text: 'Idle' },
    connecting: { variant: 'info' as const, dotColor: 'bg-blue-400 animate-pulse', text: 'Connecting' },
    active: { variant: 'success' as const, dotColor: 'bg-green-400', text: 'Active' },
    warning: { variant: 'warning' as const, dotColor: 'bg-yellow-400 animate-pulse', text: 'Warning' },
    error: { variant: 'danger' as const, dotColor: 'bg-red-400', text: 'Error' },
    disconnected: { variant: 'danger' as const, dotColor: 'bg-red-500', text: 'Disconnected' },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {showDot && (
        <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
      )}
      {label || config.text}
    </span>
  );
}
