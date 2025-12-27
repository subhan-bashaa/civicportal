import { Trash2, Droplets, Construction, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categoryConfig } from '@/lib/mockData';

interface CategoryIconProps {
  category: keyof typeof categoryConfig;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const iconComponents = {
  Trash2,
  Droplets,
  Construction,
  Lightbulb,
};

export function CategoryIcon({ category, size = 'md', showLabel = false }: CategoryIconProps) {
  const config = categoryConfig[category];
  const IconComponent = iconComponents[config.icon as keyof typeof iconComponents];

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const containerSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-lg",
          containerSizes[size]
        )}
        style={{ backgroundColor: `${config.color}20` }}
      >
        <IconComponent className={sizeClasses[size]} style={{ color: config.color }} />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-foreground">{config.label}</span>
      )}
    </div>
  );
}
