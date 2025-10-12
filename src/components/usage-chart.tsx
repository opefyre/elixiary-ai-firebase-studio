'use client';

interface UsageChartProps {
  data: { date: string; count: number }[];
  maxValue: number;
  label: string;
  color?: string;
}

export function UsageChart({ data, maxValue, label, color = '#8b5cf6' }: UsageChartProps) {
  // Fill in missing days (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const existing = data.find(d => d.date === date);
    return {
      date,
      count: existing?.count || 0,
    };
  });

  const max = Math.max(maxValue, ...chartData.map(d => d.count), 1);

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      
      {/* Bar Chart */}
      <div className="flex items-end justify-between h-32 gap-2">
        {chartData.map((item, index) => {
          const height = max > 0 ? (item.count / max) * 100 : 0;
          const date = new Date(item.date);
          const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          return (
            <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
              {/* Bar */}
              <div className="relative w-full flex items-end justify-center" style={{ height: '100px' }}>
                <div
                  className="w-full rounded-t-md transition-all hover:opacity-80 relative group"
                  style={{
                    height: `${height}%`,
                    backgroundColor: color,
                    minHeight: item.count > 0 ? '8px' : '0px',
                  }}
                >
                  {/* Tooltip on hover */}
                  {item.count > 0 && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
                      {item.count} {item.count === 1 ? 'recipe' : 'recipes'}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Day Label */}
              <div className="text-xs text-muted-foreground">
                {dayLabel[0]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
        <span>Last 7 days</span>
        <span>Total: {chartData.reduce((sum, d) => sum + d.count, 0)}</span>
      </div>
    </div>
  );
}

interface SimpleStatsProps {
  label: string;
  value: number;
  color?: string;
  icon?: React.ReactNode;
}

export function SimpleStat({ label, value, color = '#8b5cf6', icon }: SimpleStatsProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
      {icon && (
        <div 
          className="h-10 w-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      )}
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

