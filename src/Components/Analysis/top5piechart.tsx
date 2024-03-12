import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js/auto';

Chart.register(ArcElement);

interface LocationData {
  urn_id: string;
  distance: string;
  jobtitle: string | null;
  location: string;
  name: string;
}

interface PieChartProps {
  locationData: LocationData[] | null;
}

const TopFivePieChart: React.FC<PieChartProps> = ({ locationData }) => {
  const generateChartData = () => {
    if (!locationData) return { labels: [], datasets: [] };

    const locations: { [key: string]: number } = {};
    locationData.forEach(item => {
      const location = item.location;
      locations[location] = (locations[location] || 0) + 1;
    });

    const sortedLocations = Object.entries(locations).sort((a, b) => b[1] - a[1]);
    const slicedLocations = sortedLocations.slice(0, 5);

    const labels = slicedLocations.map(([location]) => location);
    const chartData = slicedLocations.map(([, value]) => value);

    return {
      labels: labels,
      datasets: [
        {
          data: chartData,
          backgroundColor: [
            'rgba(255, 51, 102, 0.9)', // Pink
            'rgba(255, 204, 0, 0.9)', // Yellow
            'rgba(0, 255, 255, 0.9)', // Cyan
            'rgba(153, 51, 255, 0.9)', // Purple
            'rgba(0, 204, 255, 0.9)', // Sky blue
          ],
          borderColor: [
            'rgba(255, 51, 102, 1)',
            'rgba(255, 204, 0, 1)',
            'rgba(0, 255, 255, 1)',
            'rgba(153, 51, 255, 1)',
            'rgba(0, 204, 255, 1)',
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

    const sortedLocations = Object.entries(locations).sort((a, b) => b[1] - a[1]);
    const slicedLocations = sortedLocations.slice(0, 5);

    return slicedLocations.map(([location, value]) => ({ location, value }));
  };

  const chartData = generateChartData();

  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'white', // Change the color of the labels
          font: {
            size: 14 // Adjust the font size of the labels
          }
        },
        position: 'bottom' as 'bottom', // Specify the position as 'bottom'
      }
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ height: '450px', width: '50%', marginRight: '20px' }}>
        <Pie data={chartData} options={options} />
      </div>
      <TableContainer component={Paper} style={{ background: '#3B3C45', border: '1px solid #ddd', width: '50%', height: '40%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ background: '#494A52', borderBottom: '1px solid #ddd', fontSize: '20px', fontWeight: 'bold' }}>Location</TableCell>
              <TableCell style={{ background: '#494A52', borderBottom: '1px solid #ddd', fontSize: '20px', fontWeight: 'bold' }}>Value</TableCell>
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
  );
};

export default TopFivePieChart;
