'use client';

interface PaymentProgressBarProps {
  paid: number;
  total: number;
  showPercentage?: boolean;
  showAmount?: boolean;
}

export function PaymentProgressBar({ paid, total, showPercentage = true, showAmount = false }: PaymentProgressBarProps) {
  const percentage = total > 0 ? (paid / total) * 100 : 0;

  const getColor = () => {
    if (percentage === 0) return 'from-red-500 to-red-600';
    if (percentage < 50) return 'from-orange-500 to-orange-600';
    if (percentage < 100) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">To'lov jarayoni</span>
        {showPercentage && <span className="text-sm font-bold text-primary">{percentage.toFixed(1)}%</span>}
      </div>
      
      <div className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {showAmount && (
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{paid.toLocaleString()} so'm</span>
          <span>{total.toLocaleString()} so'm</span>
        </div>
      )}
    </div>
  );
}
