import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import StatCard, { StatCardProps } from '../MUI_Components/StatCard';
import SessionsChart from '../MUI_Components/LineGraph';
import PageViewsBarChart from '../MUI_Components/BarGraph';
import CustomizedDataGrid from '../theme/customization/DataGrid';

const data: StatCardProps[] = [/* your data */]; 

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
        {data.map((card, index) => (
          <Grid
            key={index}
            size={{ xs: 12, sm: 6, lg: 3 }} // unified size prop
          >
            <StatCard {...card} />
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>

        <Grid size={12}>
          <CustomizedDataGrid />
        </Grid>
      </Grid>
    </Box>
  );
}
