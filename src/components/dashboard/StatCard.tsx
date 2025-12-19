import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconClassName?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  iconClassName 
}: StatCardProps) => {
  return (
    <div className="stat-card group animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={cn(
              'mt-1 text-sm font-medium',
              changeType === 'positive' && 'text-success',
              changeType === 'negative' && 'text-destructive',
              changeType === 'neutral' && 'text-muted-foreground'
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
          iconClassName || 'bg-primary/10'
        )}>
          <Icon className={cn(
            'w-6 h-6',
            iconClassName?.includes('bg-primary') ? 'text-primary' :
            iconClassName?.includes('bg-success') ? 'text-success' :
            iconClassName?.includes('bg-warning') ? 'text-warning' :
            iconClassName?.includes('bg-accent') ? 'text-accent' :
            'text-primary'
          )} />
        </div>
      </div>
    </div>
  );
};
