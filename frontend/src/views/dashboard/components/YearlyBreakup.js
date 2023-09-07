import React, { useEffect, useState  } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons';
import axios from 'axios';
// 메인페이지 도넛그래프




import DashboardCard from '../../../components/shared/DashboardCard';

const YearlyBreakup = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = '#ecf2ff';
  const successlight = theme.palette.success.light;

  const [warehouseData, setWarehouseData] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:8888/api/mainPage/warehouseRank')
      .then((response) => {
        const data = response.data.data;
        setWarehouseData(data);
      })
      .catch((error) => {
        console.error('데이터를 불러오는데 실패했습니다.', error);
      });
  }, []);

  const warehouseNames = warehouseData.map((item) => item.warehouseName);
  const totalCounts = warehouseData.map((item) => item.totalCount);

  const colors = ['rgba(93, 135, 255, 0.85)', 'rgba(73, 190, 255, 0.85)', '#13DEB9', '#FFAE1F', '#FA896B'];

  // chart
  const optionsDonutChart  = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      width: 300,
      height: 400,
    },
    labels: warehouseNames,
    colors: colors,
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '55%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };

  return (
    <DashboardCard title="Warehouse Loading Rate ">
      <Grid container spacing={3}>
        <Grid item xs={5} sm={5}>
          <Typography variant="h3" fontWeight="700">
            창고 Top5
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpLeft width={20} color="#39B69A" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              +9%
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              last year
            </Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: 'rgba(93, 135, 255, 0.85)', svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                B-2
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: primarylight, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                A-1
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                B-1
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: primarylight, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                2023
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={5} sm={5} >
          <Chart
            options={optionsDonutChart}
            series={totalCounts}
            type="donut"
            height="250px"
            width="250px"
            labels={warehouseNames} // 도넛 그래프의 레이블 설정
            colors={colors} // 도넛 그래프의 색상 설정
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};


export default YearlyBreakup;
