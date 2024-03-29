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
        <h2 style={{textAlign:'center'}}>Views And Time Watch(In Minutes)</h2>
        <div style={{marginLeft:'30px'}}>
          <Typography>This Month Total Minutes Watched: {lastDataValue}</Typography>
          <Typography>This Month Views: {lastViewsValue}</Typography>
        </div>
        <Line data={chartData} options={options} style={{padding:'10px'}} />
      </div>
  );
};

export default AreaChartComponent;
