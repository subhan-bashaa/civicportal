import { cn } from '@/lib/utils';
import { statusConfig } from '@/lib/mockData';

interface StatusBadgeProps {
  status: keyof typeof statusConfig;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      `bg-${config.bgColor} text-${config.color}`,
      className
    )}
    style={{
      backgroundColor: `hsl(var(--${config.bgColor}))`,
      color: `hsl(var(--${config.color}))`,
    }}
    >
      {config.label}
    </span>
  );
}
