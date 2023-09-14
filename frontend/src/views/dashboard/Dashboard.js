import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// components
import SalesOverview from './components/SalesOverview';
import WarehouseTopRank from './components/WarehouseTopRank';
import StateOverviewComponents from './components/StateOverviewComponents';


const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={8}>
            <Typography variant="h6" sx={{ marginBottom: '16px', marginTop: '25px',  marginLeft: '25px' }}>
              연월별 발주/입고 현황
            </Typography>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ marginBottom: '16px', marginTop: '25px', marginLeft: '25px' }}>
                  창고 Top5
                </Typography>
                <WarehouseTopRank />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ marginBottom: '16px',  marginLeft: '25px' }}>
                  발주 상태 현황
                </Typography>
                <StateOverviewComponents />
              </Grid>
              {/* <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
