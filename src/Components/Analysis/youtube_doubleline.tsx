import { Typography } from '@mui/material';
import React from 'react';
import { Line } from 'react-chartjs-2';

interface GraphData {
  [key: string]: {
    likes: number;
    comments: number;
    dislikes: number;
    subscribersGained : number;
  };
}

interface TripleLineGraphProps {
  data: GraphData;
}

const TripleLineGraph: React.FC<TripleLineGraphProps> = ({ data }) => {
  const dates = Object.keys(data);

  // Extracting data for each item
  const likesData = dates.map(date => data[date].likes);
  const commentsData = dates.map(date => data[date].comments);
  const dislikesData = dates.map(date => data[date].dislikes);
  const subscriberData = dates.map(date => data[date].subscribersGained);

  const lastLikes = likesData[likesData.length - 1];
  const lastComments = commentsData[commentsData.length - 1];
  const lastDislikes = dislikesData[dislikesData.length - 1];
  const lastSubscribers = subscriberData[subscriberData.length - 1];


  // Chart data for Likes
  const likesChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Likes',
        data: likesData,
        fill: false,
        borderColor: 'purple',
        tension: 0.1
      }
    ]
  };

  // Chart data for Comments
  const commentsChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Comments',
        data: commentsData,
        fill: false,
        borderColor: 'brown',
        tension: 0.1
      }
    ]
  };

  // Chart data for Dislikes
  const dislikesChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Dislikes',
        data: dislikesData,
        fill: false,
        borderColor: 'blue',
        tension: 0.1
      }
    ]
  };

  const subscriberchartData = {
    labels: dates,
    datasets: [
      {
        label: 'Subscribers',
        data: subscriberData,
        fill: false,
        borderColor: 'Red',
        tension: 0.1
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' , width:'98%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1 ,borderRadius:'20px',border: '1px solid #000'}}>
          <h2 style={{textAlign:'center'}}>Likes</h2>
          <Typography style={{marginLeft:'20px'}}>Current Month Likes : {lastLikes}</Typography>
          <Line data={likesChartData} style={{padding:'10px'}}/>
        </div>
        <div style={{ flex: 1 ,borderRadius:'20px',border: '1px solid #000' , marginLeft:'15px'}}>
          <h2 style={{textAlign:'center'}}>Dislikes</h2>
          <Typography style={{marginLeft:'20px'}}>Current Month Dislikes : {lastDislikes}</Typography>
          <Line data={dislikesChartData} style={{padding:'10px'}}/>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row',marginTop:'15px' }}>
        <div style={{ flex: 1 ,borderRadius:'20px',border: '1px solid #000'}}>
          <h2 style={{textAlign:'center'}}>Comments</h2>
          <Typography style={{marginLeft:'20px'}}>Current Month Comments : {lastComments}</Typography>
          <Line data={commentsChartData} style={{padding:'10px'}}/>
        </div>
        <div style={{ flex: 1 ,borderRadius:'20px',border: '1px solid #000', marginLeft:'15px'}}>
          <h2 style={{textAlign:'center'}}>Subscribers</h2>
          <Typography style={{marginLeft:'20px'}}>Current Month Subscribers : {lastSubscribers}</Typography>
          <Line data={subscriberchartData} style={{padding:'10px'}}/>
        </div>
      </div>
    </div>
  );
};

export default TripleLineGraph;
