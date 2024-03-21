import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js/auto';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

// Interface For Linkedin Data
interface LocationData {
  urn_id: string;
  distance: string | number;
  jobtitle: string | null;
  location: string;
  name: string;
  type: string;
}

// Interface For Twitter Data
interface TwitterData {
  tweetLink: string;
  tweetDate: string;
  commentCount: number;
  retweetCount: number;
  quoteCount: number;
  likeCount: number;
  twitterId: number;
  handle: string;
  text: string;
  profileUser: string;
  mediaUrl: string;
  timestamp: string;
  query: string;
  type: string;
}

// Main Interface
interface Props {
  socialData: (LocationData | TwitterData)[] | null;
  dataType: 'linkedin' | 'twitter';
}

const BarChart: React.FC<Props> = ({ socialData, dataType }) => {

  // data Values
  const [data, setData] = useState<(LocationData | TwitterData)[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  // For Fetching Data
  useEffect(() => {
    if (socialData) {
      setData(socialData);
    }
  }, [socialData]);

  // For Genrate Linkedin Graph Data
  const generateLinkedInChartData = (filteredData: LocationData[]): { labels: string[], datasets: any[] } => {
    const groupedData: { [key: string]: number } = {};

    // Grouping Data Based on Job Title
    filteredData.forEach(item => {
      const jobTitle = item.jobtitle || 'Unknown';
      groupedData[jobTitle] = (groupedData[jobTitle] || 0) + 1;
    });

    // Sorting Data Using Job Titles
    const sortedData = Object.entries(groupedData)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10);

    const labels = sortedData.map(([jobTitle]) => jobTitle);
    const values = sortedData.map(([, count]) => count);

    const dataset = {
      label: 'Job Titles',
      data: values,
      backgroundColor: `rgba(51, 153, 51, 0.8)`,
      borderColor: `rgba(255, 99, 132, 1)`,
      borderWidth: 1,
    };

    return { labels, datasets: [dataset] };
  };

  // For Genrate Twitter Graph Data
  const generateTwitterChartData = (filteredData: TwitterData[]): { labels: string[], datasets: any[] } => {
    const sortedData = filteredData
      .sort((a, b) => b.retweetCount - a.retweetCount)
      .slice(0, 10);

    const labels = sortedData.map(item => item.tweetDate);
    const values = sortedData.map(item => item.retweetCount);

    const dataset = {
      label: 'Retweet Count',
      data: values,
      backgroundColor: `rgba(51, 153, 51, 0.8)`,
      borderColor: `rgba(255, 99, 132, 1)`,
      borderWidth: 1,
    };

    return { labels, datasets: [dataset] };
  };

  // Genrating Charts
  const generateChartData = () => {
    if (!data || data.length === 0) return { labels: [], datasets: [] };

    let filteredData: (LocationData | TwitterData)[] = [];

    if (dataType === 'linkedin') {
      filteredData = data.filter((item): item is LocationData => 'jobtitle' in item);
      return generateLinkedInChartData(filteredData as LocationData[]);
    } else if (dataType === 'twitter') {
      filteredData = data.filter((item): item is TwitterData => 'retweetCount' in item);
      return generateTwitterChartData(filteredData as TwitterData[]);
    }

    return { labels: [], datasets: [] };
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
        ticks: {
          color: 'black',
          font: {
            size: 10,
          },
        },
      },
      y: {
        title: {
          display: true,
        },
        ticks: {
          color: 'black',
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 10,
          },
        },
      },
    },
    elements: {
      bar: {
        backgroundColor: 'rgba(33, 150, 243, 0.8)',
        borderColor: 'white',
        borderWidth: 1,
      },
    },
    backgroundColor: 'white',
    borderColor: 'black',
  };

  // Genrating Table Data's
  const generateTableData = () => {
    if (!data || data.length === 0) return [];
  
    let twitterData: TwitterData[] = [];
  
    // Filter out Twitter data
    data.forEach(item => {
      if ('retweetCount' in item) {
        twitterData.push(item);
      }
    });
  
    // Sort Twitter data by retweet count in descending order
    twitterData.sort((a, b) => b.retweetCount - a.retweetCount);
  
    // Take only the top 10 records
    twitterData = twitterData.slice(0, 10);
  
    return twitterData.map((item, index) => ({
      id: index + 1,
      content: item.text,
      retweets: item.retweetCount,
      date: item.tweetDate,
    }));
  };

  return (
    <>
      {dataType === 'linkedin' && data && data.length > 0 && (
        <div>
         <Bar data={generateChartData()} options={options} />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {dataType === 'twitter' && data && data.length > 0 && (
          <>
            <div style={{ marginRight: '10px', flex: 1 }}>
              <h2>Top 10 Twitter Repost Data</h2>
              <div style={{ height: '400px' }}>
                <Bar data={generateChartData()} options={options} />
              </div>
            </div>
            <div
              ref={tableRef}
              style={{ overflowY: 'scroll', flex: 1, height: '400px', marginBottom: '20px' }}
            >
              <TableContainer component={Paper} style={{ background: '#f9f9f9', border: '1px solid #ddd' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>Content</TableCell>
                      <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>Retweets</TableCell>
                      <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {generateTableData().map((item) => (
                      <TableRow key={item.id}>
                        <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{item.id}</TableCell>
                        <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{item.content}</TableCell>
                        <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{item.retweets}</TableCell>
                        <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{item.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BarChart;
