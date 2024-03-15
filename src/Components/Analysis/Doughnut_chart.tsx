import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

interface SentimentData {
  Tweet: string;
  Sentiment: string;
}

interface TableData {
  id: number;
  content: string;
  sentiment: string;
}

interface Props {
  data: SentimentData[];
}

const DoughnutChart: React.FC<Props> = ({ data }) => {
  // Generate table data
  const generateTableData = (): TableData[] => {
    return data.map((item, index) => ({
      id: index + 1,
      content: item.Tweet,
      sentiment: item.Sentiment,
    }));
  };

  // Chart data
  const chartData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [data.filter(item => item.Sentiment === 'positive').length,
               data.filter(item => item.Sentiment === 'negative').length,
               data.filter(item => item.Sentiment === 'neutral').length],
        backgroundColor: [
          'rgba(255, 51, 102, 0.9)', // Pink
          'rgba(255, 204, 0, 0.9)', // Yellow
          'rgba(0, 255, 255, 0.9)', // Cyan
        ],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'doughnut'> = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  return (
    <div>
        <h2 style={{ margin: 0 }}>Tweet Sentiment Analysis</h2>
        <div style={{display:'flex'}}>
      <div style={{ height: '430px' , width:'50%' }}>
        
        <Doughnut data={chartData} options={options} style={{ marginTop: '10px', height: '400px', width: '400px' ,marginLeft:'80px' }} />
      </div>
      <div style={{ overflowY: 'scroll', width:'50%' ,height: '400px', marginBottom: '20px' , marginLeft:'20px' }}>
        <TableContainer component={Paper} style={{ background: '#f9f9f9', border: '1px solid #ddd' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>Content</TableCell>
                <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>Sentiment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {generateTableData().map((item) => (
                <TableRow key={item.id}>
                  <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{item.id}</TableCell>
                  <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{item.content}</TableCell>
                  <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{item.sentiment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      </div>
    </div>
  );
};

export default DoughnutChart;
