import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import axios from 'axios';

const SalesOverview = () => {
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });

  const [selectedYear, setSelectedYear] = useState('2023'); // 연도 선택 상태 변수

  const handleChange = async (event) => {
    const year = event.target.value; // 선택한 연도
    setSelectedYear(year); // 선택한 연도를 상태 변수에 저장
  
    try {
      // Axios를 사용하여 데이터 가져오기
      const response = await axios.get('http://localhost:8888/api/mainPage/totalReceivesOrders', {
        params: {
          year, // 직접 year 변수를 사용
        },
      });
  
      const data = response.data.data;
  
      // 가져온 데이터를 차트 데이터로 설정
      setChartData({
        categories: data.map((item) => item.yearMonth),
        series: [
          {
            name: '발주물량',
            data: data.map((item) => item.totalOrders),
          },
          {
            name: '입고물량',
            data: data.map((item) => item.totalReceives),
          },
        ],
      });
    } catch (error) {
      // 오류 처리
      console.error('데이터 가져오기 오류:', error);
    }
  };

  // useEffect를 사용하여 컴포넌트가 마운트될 때 한 번 데이터를 가져오도록 설정
  useEffect(() => {
    handleChange({ target: { value: selectedYear } });
  }, [selectedYear]);

  const theme = useTheme();

  return (
    <DashboardCard
      title="POrder/Receieve Graph"
      action={
        <Select
          labelId="month-dd"
          id="month-dd"
          value={selectedYear}
          size="small"
          onChange={handleChange}
        >
          <MenuItem value="2021">2021</MenuItem>
          <MenuItem value="2022">2022</MenuItem>
          <MenuItem value="2023">2023</MenuItem>
        </Select>
      }
    >
    <Typography variant="h3" fontWeight="600" mt={4} mb={4}>
        입고&발주 수량
    </Typography>
      <Chart
        options={{
          chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
              show: true,
            },
            height: 370,
          },
          colors: [theme.palette.primary.main, theme.palette.secondary.main],
          plotOptions: {
            bar: {
              horizontal: false,
              barHeight: '60%',
              columnWidth: '42%',
              borderRadius: [6],
              borderRadiusApplication: 'end',
              borderRadiusWhenStacked: 'all',
            },
          },
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
          yaxis: {
            tickAmount: 4,
          },
          xaxis: {
            categories: chartData.categories,
            axisBorder: {
              show: false,
            },
          },
          tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
          },
        }}
        series={chartData.series}
        type="bar"
        height="500px"
      />
    </DashboardCard>
  );
};

export default SalesOverview;