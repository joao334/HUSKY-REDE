import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from './ui/Card';

type ChartCardProps = {
  title: string;
  data: Array<{ label: string; value: number }>;
  type?: 'area' | 'bar';
};

export function ChartCard({ title, data, type = 'area' }: ChartCardProps) {
  return (
    <Card className="p-4">
      <h3 className="text-base font-black text-husky-cocoa dark:text-husky-cream">{title}</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(91, 68, 46, 0.12)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b6da6" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`chart-${title}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#3b6da6" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#3b6da6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(91, 68, 46, 0.12)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <Tooltip />
              <Area dataKey="value" stroke="#3b6da6" strokeWidth={3} fill={`url(#chart-${title})`} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
