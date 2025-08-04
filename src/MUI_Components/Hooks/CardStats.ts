import { useState, useEffect } from 'react';
import api from '../../library/axiosConfig';

export type MetricResp = {
  total: number;
  previous: number;
  history: number[];
  authenticated: boolean;
};

export type StatItem = {
  title: string;
  value: string;
  interval: string;
  trend: 'up' | 'down' | 'neutral';
  trendPercent: string;
  data: number[];
  xAxisLabels: string[];
};

export function useDashboardStats() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const endpoints = [
    { title: 'Users', endpoint: '/api/user_stats.php' },
    { title: 'Orders', endpoint: '/api/order_stats.php' },
    { title: 'Revenue', endpoint: '/api/revenue_stats.php' },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      try {
     const responses: { data: MetricResp }[] = await Promise.all(
  endpoints.map(e => api.get<MetricResp>(e.endpoint))
);

        const parsed = responses.map((res, i) => {
          const { total, previous, history, authenticated } = res.data;
          if (!authenticated) throw new Error('Session expired');

          const diff = total - previous;
          const pct =
            previous > 0 ? `${Math.round((diff / previous) * 100)}%` : '0%';
          const trend: 'up' | 'down' | 'neutral' =
            diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';

          return {
            title: endpoints[i].title,
            value:
              endpoints[i].title === 'Revenue'
                ? `Ksh ${total.toLocaleString()}`
                : total.toLocaleString(),
            interval: 'Last 7 days',
            trend,
            trendPercent: pct,
            data: history,
            xAxisLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          };
        });

        setStats(parsed);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { stats, loading, error };
}
