import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Fab, Typography } from '@mui/material';
import { IconBulb, IconCurrencyDollar } from '@tabler/icons';
import DashboardCard from '../../../components/shared/DashboardCard';
import axios from 'axios';

const MonthlyEarnings = () => {
  const theme = useTheme();

  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8888/api/mainPage/stateValue')
      .then((response) => {
        const data = response.data.data[0];
        const waitCount = data.waitCount;
        const ingCount = data.ingCount;
        const cmpCount = data.cmpCount;

        const graphData = [
          {
            x: '대기중',
            y: waitCount,
          },
          {
            x: '진행중',
            y: ingCount,
          },
          {
            x: '완료',
            y: cmpCount,
          },
        ];

        setGraphData(graphData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        barHeight: '50%',
        columnWidth: '42%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    colors: ['#999999', 'rgb(255, 174, 31)', 'rgba(93, 135, 255, 0.85)'],
    stroke: {
      show: true,
      width: 5,
      lineCap: 'butt',
      colors: ['transparent'],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: ['대기중', '진행중', '완료'],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    
  };
  
  const seriescolumnchart = [
    {
      name: '상태',
      data: graphData,
    },
  ];

  const chart = graphData.length > 0 ? (
    <Chart
      options={optionscolumnchart}
      series={seriescolumnchart}
      type="bar"
      height="300px"
    />
  ) : null;

  return (
    <DashboardCard
      title="발주 상태 현황"
      action={
        <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
          <IconBulb width={24} />
        </Fab>
      }
      footer={chart}
    >
      <>
          
      </>
    </DashboardCard>
    
  );
};

export default MonthlyEarnings;