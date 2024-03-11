import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js/auto';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';

Chart.register(ArcElement);

// Define the type for the data
interface LocationData {
  urn_id: string;
  distance: string;
  jobtitle: string | null;
  location: string;
  name: string;
}

interface fetchData{
  locationData : LocationData[] | null
}

const PieChart: React.FC<fetchData> = ({ locationData }) => {
  const tableRef = useRef<HTMLDivElement>(null);

  const generateChartData = () => {
    if (!locationData) return { labels: [], datasets: [] };

    const locations: { [key: string]: number } = {};
    locationData.forEach(item => {
      const location = item.location;
      locations[location] = (locations[location] || 0) + 1;
    });

    const labels = Object.keys(locations);
    const chartData = Object.values(locations);

    return {
      labels: labels,
      datasets: [
        {
          data: chartData,
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const generateTableData = () => {
    if (!locationData) return [];

    const locations: { [key: string]: number } = {};
    locationData.forEach(item => {
      const location = item.location;
      locations[location] = (locations[location] || 0) + 1;
    });

    return Object.entries(locations).map(([location, value]) => ({ location, value }));
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
      <div style={{ height: '450px', width: '50%', marginRight: '20px' }}>
        {locationData && locationData.length > 0 && <Pie data={generateChartData()} options={chartOptions} />}
      </div>

      <div
        ref={tableRef}
        style={{ overflowY: 'scroll', width: '30%', height: '400px' }}
      >
        <TableContainer component={Paper} style={{ background: '#f9f9f9', border: '1px solid #ddd' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '20px', fontWeight: 'bold' }}>Location</TableCell>
                <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '20px', fontWeight: 'bold' }}>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {generateTableData().map((item, index) => (
                <TableRow key={index}>
                  <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '16px' }}>{item.location}</TableCell>
                  <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '16px' }}>{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default PieChart;
