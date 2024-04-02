import { Typography } from '@mui/material';
import React from 'react';
import { Line } from 'react-chartjs-2';

interface GraphData {
  [key: string]: {
    likes: number;
    comments: number;
    dislikes: number;
    subscribersGained: number;
  };
}

interface TripleLineGraphProps {
  data: GraphData;
}

const formatDate = (dateString : any) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString('default', { month: 'long', year: 'numeric' });
  return formattedDate;
};

const TripleLineGraph: React.FC<TripleLineGraphProps> = ({ data }) => {
  const dates = Object.keys(data);
  const firstDate = formatDate(Object.keys(data)[0]);
  const lastDate = formatDate(Object.keys(data)[Object.keys(data).length - 1]);

  // Extracting data for each item
  const likesData = dates.map(date => data[date].likes);
  const dislikesData = dates.map(date => data[date].dislikes);
  const commentsData = dates.map(date => data[date].comments);
  const subscriberData = dates.map(date => data[date].subscribersGained);

  const totalLikes = Object.values(data).reduce((acc, curr) => acc + curr.likes, 0);
  const totalDislikes = Object.values(data).reduce((acc, curr) => acc + curr.dislikes, 0);
  const totalComments = Object.values(data).reduce((acc, curr) => acc + curr.comments, 0);
  const totalSubscribers = Object.values(data).reduce((acc, curr) => acc + curr.subscribersGained, 0);

  // Combined chart data for Likes and Dislikes
  const likesDislikesChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Likes',
        data: likesData,
        fill: false,
        borderColor: 'blue',
        tension: 0.1,
      },
      {
        label: 'Dislikes',
        data: dislikesData,
        fill: false,
        borderColor: 'red',
        tension: 0.1,
      },
    ],
  };

  // Chart data for Comments
  const commentsubscriberChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Comments',
        data: commentsData,
        fill: false,
        borderColor: 'brown',
        tension: 0.1,
      },
      {
        label: 'Subscribers',
        data: subscriberData,
        fill: false,
        borderColor: '#E9CB76',
        tension: 0.1,
      },
    ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '98%' }}>
      <div style={{ flex: 1, borderRadius: '20px', border: '1px solid #000', marginRight: '10px' }}>
        <Typography style={{ textAlign: 'center' , fontSize:'20px' , marginTop:'10px',marginBottom:'10px' }}><b>Likes vs Dislikes:</b> {firstDate} - {lastDate}</Typography>
        <Typography style={{ marginLeft: '20px' }}>Total Likes: {totalLikes}</Typography>
        <Typography style={{ marginLeft: '20px' }}>Total Dislikes: {totalDislikes}</Typography>
        <Line data={likesDislikesChartData} style={{ padding: '10px' }} />
      </div>
      <div style={{ flex: 1, borderRadius: '20px', border: '1px solid #000' }}>
      <Typography style={{ textAlign: 'center' , fontSize:'20px' , marginTop:'10px',marginBottom:'10px' }}><b>Comments & Subscribers:</b> {firstDate} - {lastDate}</Typography>
        <Typography style={{ marginLeft: '20px' }}>Total Comments: {totalComments}</Typography>
        <Typography style={{ marginLeft: '20px' }}>Total Subscribers: {totalSubscribers}</Typography>
        <Line data={commentsubscriberChartData} style={{ padding: '10px' }} />
      </div>
    </div>
  );
};

export default TripleLineGraph;
