'use client';

interface PaymentStatusBadgeProps {
  status: 'pending' | 'partial' | 'complete' | 'overdue';
  size?: 'sm' | 'md' | 'lg';
}

export function PaymentStatusBadge({ status, size = 'md' }: PaymentStatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const statusConfig = {
    pending: {
      bg: 'bg-red-500/20',
      text: 'text-red-600 dark:text-red-400',
      label: 'Kutilmoqda',
      icon: '⏳',
    },
    partial: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      label: 'Qisman',
      icon: '⚠️',
    },
    complete: {
      bg: 'bg-green-500/20',
      text: 'text-green-600 dark:text-green-400',
      label: "To'langan",
      icon: '✓',
    },
    overdue: {
      bg: 'bg-orange-500/20',
      text: 'text-orange-600 dark:text-orange-400',
      label: "Muddati o'tgan",
      icon: '⚠️',
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${sizeClasses[size]} ${config.bg} ${config.text}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
