import React, { useState, useEffect } from 'react';
import ReactD3Cloud from 'react-d3-cloud'; // Import the library
import locationData from '../../assets/UserJSON/profileConnection2.json'; // Importing JSON file

// Define the type for the data
interface LocationData {
  urn_id: string;
  distance: string | number;
  jobtitle: string | null;
  location: string;
  name: string;
}

  const WordCloudComponent: React.FC = () => {
    const [data, setData] = useState<LocationData[]>([]);
  
    useEffect(() => {
      setData(locationData.slice(0,200));
    }, []);
  
    const generateWordCloudData = () => {
      if (!data) return []; // Return empty data if no data available
    
      // Count occurrences of each job title
      const wordCounts: { [key: string]: number } = {};
      data.forEach(item => {
        const jobTitle = item.jobtitle || 'Unknown';
        if (!wordCounts[jobTitle]) {
          wordCounts[jobTitle] = 0;
        }
        wordCounts[jobTitle]++;
      });
    
      // Convert word counts to word cloud data format
      const wordCloudData = Object.entries(wordCounts).map(([word, count]) => ({
        text: word,
        value: count,
      }));
  
      return wordCloudData;
    };
  
    // Define your fontSizeMapper function
    const fontSizeMapper = (word: { value: number }) => {
        // Ensure that the font size is at least 10
        const minFontSize = 15;
        return Math.max(minFontSize, Math.log2(word.value) * 5);
      };
    return (
      <div style={{ margin: 'auto' }}>
      <h2>All Job Titles</h2>
      {data.length > 0 && (
        <ReactD3Cloud
          data={generateWordCloudData()}
          fontSize={fontSizeMapper} // Use your fontSizeMapper function here
          width={600}
          height={400}
        />
      )}
    </div>
    );
};
  

export default WordCloudComponent;
