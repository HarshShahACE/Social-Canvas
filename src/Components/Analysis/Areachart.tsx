import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface APIResponse {
  [key: string]: {
    temp: number;
    estimatedMinutesWatched: number;
    views: number;
    likes: number;
    subscribersGained: number;
    comments: number;
  };
}

const formatDate = (dateString : any) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString('default', { month: 'long', year: 'numeric' });
  return formattedDate;
};

const parseDataForChart = (apiResponse: APIResponse) => {
  const labels: string[] = [];
  const data: number[] = [];
  const views: number[] = [];

  for (const key in apiResponse) {
    labels.push(key);
    data.push(apiResponse[key].estimatedMinutesWatched);
    views.push(apiResponse[key].views);
  }

  return { labels, data, views };
};

const AreaChartComponent: React.FC<{ apiResponse: APIResponse }> = ({ apiResponse }) => {
  const { labels, data, views } = parseDataForChart(apiResponse);
  const firstDate = formatDate(Object.keys(apiResponse)[0]);
  const lastDate = formatDate(Object.keys(apiResponse)[Object.keys(apiResponse).length - 1]);

  const totaltime = Object.values(data).reduce((acc, curr) => acc + curr, 0);
  const totalview = Object.values(views).reduce((acc, curr) => acc + curr, 0);

  const lastDataValue = data[data.length - 1];
  const lastViewsValue = views[views.length - 1];

  const chartData = {
    labels: labels,
    datasets: [
      {
        fill: true,
        label: 'Total Minutes Watched',
        data: data,
        borderColor: 'rgb(103, 58, 183)', // Bright color
        backgroundColor: 'rgba(128, 0, 128, 0.6)', // Bright color with transparency
      },
      {
        fill: true,
        label: 'Views',
        data: views,
        borderColor: 'rgb(255,193,75)', // Dark color
        backgroundColor: 'rgba(255, 131, 0, 0.4)', // Dark color with transparency
      },
    ],
  };  

  const options = {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Minutes Watched and Views',
        },
      },
    },
  };

  return (
       <div>
        <Typography style={{ textAlign: 'center' , fontSize:'20px' , marginTop:'10px',marginBottom:'10px' }}><b>Views & Time Watched(In Minutes):</b> {firstDate} - {lastDate}</Typography>
        <div style={{marginLeft:'30px'}}>
          <Typography>Total Minutes Watched: {totaltime}</Typography>
          <Typography>Total Views: {totalview}</Typography>
        </div>
        <Line data={chartData} options={options} style={{padding:'10px'}} />
      </div>
  );
};

export default AreaChartComponent;
