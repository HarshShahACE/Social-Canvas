import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js/auto';
import locationData from '../../assets/UserJSON/profileConnection1.json'; // Importing JSON file
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

const PieChart = () => {
  const [data, setData] = useState<LocationData[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const batchSize = 10;
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setData(locationData); // Set data from imported JSON file
  }, []);

  const handleScroll = () => {
    if (!tableRef.current) return;
    const scrollTop = tableRef.current.scrollTop;
    const newIndex = Math.floor(scrollTop / batchSize);
    setStartIndex(newIndex);
  };

  const generateChartData = () => {
    if (!data) return { labels: [], datasets: [] }; // Return empty data if no data available
  
    const locations: { [key: string]: number } = {}; // Object to store location counts
  
    // Count occurrences of each location
    data.forEach(item => {
      const location = item.location;
      locations[location] = (locations[location] || 0) + 1;
    });
  
    // Extract labels and data from the locations object
    const labels = Object.keys(locations);
    const chartData = Object.values(locations);
  
    return {
      labels: labels,
      datasets : [
        {
          data: chartData,
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)', // Dark blue
            'rgba(255, 99, 132, 0.8)', // Dark red
            'rgba(255, 206, 86, 0.8)', // Dark yellow
            'rgba(75, 192, 192, 0.8)', // Dark green
            'rgba(153, 102, 255, 0.8)', // Dark purple
            // Add more colors here
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)', // Dark blue
            'rgba(255, 99, 132, 1)', // Dark red
            'rgba(255, 206, 86, 1)', // Dark yellow
            'rgba(75, 192, 192, 1)', // Dark green
            'rgba(153, 102, 255, 1)', // Dark purple
            // Add more colors here
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const generateTableData = () => {
    if (!data) return [];
    
    const locations: { [key: string]: number } = {}; // Object to store location counts
  
    // Count occurrences of each location
    data.forEach(item => {
      const location = item.location;
      locations[location] = (locations[location] || 0) + 1;
    });

    // Convert locations object into an array of objects for table rendering
    return Object.entries(locations).map(([location, value]) => ({ location, value }));
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
      <div style={{ height: '350px', width: '50%', marginRight: '20px' }}>
        {data.length > 0 && <Pie data={generateChartData()} options={chartOptions} />}
      </div>

      <div
        ref={tableRef}
        onScroll={handleScroll}
        style={{ overflowY: 'scroll', width: '50%', height: '300px' }}
      >
         <TableContainer component={Paper} style={{ background: '#f9f9f9', border: '1px solid #ddd' }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>Location</TableCell>
        <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '14px', fontWeight: 'bold' }}>Value</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {generateTableData().map((item, index) => (
        <TableRow key={index}>
          <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '12px' }}>{item.location}</TableCell>
          <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '12px' }}>{item.value}</TableCell>
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
