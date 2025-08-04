import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  return Array.from({ length: date.getDate() }, (_, i) => `${monthName} ${i + 1}`);
}

// Generate natural fluctuations via random walk
function generateRandomWalk(start: number, steps: number, volatility: number) {
  const data: number[] = [];
  let prev = start;
  for (let i = 0; i < steps; i++) {
    const change = (Math.random() - 0.5) * volatility;
    prev = Math.max(0, prev + change); // prevent negative values
    data.push(prev);
  }
  return data;
}

export default function SessionsChart() {
  const theme = useTheme();
  const days = getDaysInMonth(4, 2024);

  // realistic data with ups & downs
  const directData = React.useMemo(() => generateRandomWalk(1200, days.length, 300), [days]);
  const referralData = React.useMemo(() => generateRandomWalk(800, days.length, 200), [days]);
  const organicData = React.useMemo(() => generateRandomWalk(500, days.length, 150), [days]);

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Sessions
        </Typography>
        <Stack sx={{ justifyContent: 'space-between', mb: 2 }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="h4">13,277</Typography>
            <Chip size="small" color="success" label="+35%" />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Sessions per day for the last {days.length} days
          </Typography>
        </Stack>

        <LineChart
          colors={[
            theme.palette.primary.light,
            theme.palette.primary.main,
            theme.palette.primary.dark,
          ]}
          xAxis={[{
            scaleType: 'point',
            data: days,
            tickInterval: (_, i) => (i + 1) % 5 === 0,
          }]}
          yAxis={[{}]}
          series={[
            {
              id: 'direct',
              label: 'Direct',
              showMark: false,
              curve: 'natural', // smoother curves :contentReference[oaicite:1]{index=1}
              area: true,
              data: directData,
            },
            {
              id: 'referral',
              label: 'Referral',
              showMark: false,
              curve: 'natural',
              area: true,
              data: referralData,
            },
            {
              id: 'organic',
              label: 'Organic',
              showMark: false,
              curve: 'natural',
              area: true,
              data: organicData,
            },
          ]}
          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-organic': { fill: "url('#organic')" },
            '& .MuiAreaElement-series-referral': { fill: "url('#referral')" },
            '& .MuiAreaElement-series-direct': { fill: "url('#direct')" },
          }}
        >
          <AreaGradient color={theme.palette.primary.dark} id="organic" />
          <AreaGradient color={theme.palette.primary.main} id="referral" />
          <AreaGradient color={theme.palette.primary.light} id="direct" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
