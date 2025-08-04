import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AreaGradient from './AreaGradient';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';

export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend: 'up' | 'down' | 'neutral';
  data: number[];
  xAxisLabels: string[];
  chartColor?: string;
  trendPercent?: string;
};

export default React.memo(function StatCard({
  title,
  value,
  interval,
  trend,
  data,
  xAxisLabels,
  chartColor,
  trendPercent,
}: StatCardProps) {
  const theme = useTheme();
  // fallback colors
  const upColor = theme.palette.success.main;
  const downColor = theme.palette.error.main;
  const neutralColor = theme.palette.grey[400];
  const colors = { up: upColor, down: downColor, neutral: neutralColor };
  const labelColors = { up: 'success', down: 'error', neutral: 'default' } as const;
  const usedColor = chartColor ?? colors[trend];
  const chipColor = labelColors[trend];
  const gradientId = `area-gradient-${title.replace(/\s+/g, '-')}`;

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>{title}</Typography>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">{value}</Typography>
            <Chip size="small" color={chipColor} label={trendPercent} />
          </Stack>
          <Typography variant="caption" color="text.secondary">{interval}</Typography>
          <Box sx={{ height: 50 }}>
            <SparkLineChart
              color={usedColor}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{ scaleType: 'band', data: xAxisLabels }}
              sx={{ [`& .${areaElementClasses.root}`]: { fill: `url(#${gradientId})` } }}
            >
              <AreaGradient id={gradientId} color={usedColor} />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
});