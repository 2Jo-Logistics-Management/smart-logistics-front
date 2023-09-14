import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Paper, Box } from '@mui/material';
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

  return (
    <Paper elevation={3} sx={{ padding: '16px', borderRadius: '4px', marginLeft: '25px', marginRight: '25px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="bar"
          width="400px" // 차트의 가로 확장을 100%로 설정
        />
      </Box>
    </Paper>
  );
};

export default MonthlyEarnings;