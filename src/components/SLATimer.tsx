import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SLATimerProps {
  deadline: Date;
  status: string;
  compact?: boolean;
}

export function SLATimer({ deadline, status, compact = false }: SLATimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [slaStatus, setSlaStatus] = useState<'green' | 'yellow' | 'red'>('green');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      const remaining = deadlineTime - now;
      setTimeLeft(remaining);

      // Calculate SLA status
      const totalSla = 24 * 60 * 60 * 1000; // 24 hours in ms
      const percentRemaining = (remaining / totalSla) * 100;

      if (remaining <= 0) {
        setSlaStatus('red');
      } else if (percentRemaining <= 25) {
        setSlaStatus('yellow');
      } else {
        setSlaStatus('green');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  // If resolved, show completed state
  if (status === 'resolved') {
    return (
      <div className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success-bg text-status-success",
        compact ? "text-xs" : "text-sm"
      )}>
        <CheckCircle className={compact ? "h-3 w-3" : "h-4 w-4"} />
        <span className="font-medium">Completed</span>
      </div>
    );
  }

  const formatTime = (ms: number) => {
    if (ms <= 0) {
      const overdue = Math.abs(ms);
      const hours = Math.floor(overdue / (1000 * 60 * 60));
      const minutes = Math.floor((overdue % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m overdue`;
    }
    
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const statusColors = {
    green: 'bg-status-success-bg text-status-success',
    yellow: 'bg-status-warning-bg text-status-warning',
    red: 'bg-status-danger-bg text-status-danger',
  };

  const Icon = slaStatus === 'red' ? AlertTriangle : Clock;

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors",
      statusColors[slaStatus],
      slaStatus === 'red' && "animate-countdown",
      compact ? "text-xs" : "text-sm"
    )}>
      <Icon className={cn(
        compact ? "h-3 w-3" : "h-4 w-4",
        slaStatus === 'red' && "animate-pulse"
      )} />
      <span className="font-medium whitespace-nowrap">{formatTime(timeLeft)}</span>
    </div>
  );
}
