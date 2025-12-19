import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STAGE_CONFIG } from '@/types/request';

interface PipelineChartProps {
  data: Record<string, number>;
}

const stageColors: Record<string, string> = {
  new: '#3b82f6',
  under_review: '#f59e0b',
  contacted: '#14b8a6',
  proposal_sent: '#6366f1',
  negotiation: '#f97316',
  won: '#22c55e',
  lost: '#ef4444',
};

export const PipelineChart = ({ data }: PipelineChartProps) => {
  const chartData = STAGE_CONFIG.slice(0, -2).map(stage => ({
    name: stage.label,
    value: data[stage.id] || 0,
    id: stage.id,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-lg)'
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={stageColors[entry.id]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
