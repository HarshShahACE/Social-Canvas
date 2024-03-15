// import React, { useState, useEffect } from 'react';
// import ReactD3Cloud from 'react-d3-cloud'; // Import the library

// // Define the type for the data
// interface LocationData {
//   urn_id: string;
//   distance: string | number;
//   jobtitle: string | null;
//   location: string;
//   name: string;
// }

// interface Props {
//   locationData: LocationData[] | null;
// }

// const WordCloudComponent: React.FC<Props> = ({ locationData }) => {
//   const [data, setData] = useState<string[]>([]);

//   useEffect(() => {
//     if (locationData) {
//       setData(generateWordList(locationData.slice(0, 200)));
//     }
//   }, [locationData]);

//   const generateWordList = (locationData: LocationData[]): string[] => {
//     const words: string[] = [];
//     locationData.forEach(item => {
//       if (item.jobtitle) {
//         const jobTitles = item.jobtitle.split(/[|@]/);
//         jobTitles.forEach(title => {
//           const smallerTitles = title.trim().split(/\s+/);
//           words.push(...smallerTitles);
//         });
//       }
//     });
//     return words;
//   };

//   const generateWordCloudData = () => {
//     if (!data) return []; // Return empty data if no data available

//     // Count occurrences of each word
//     const wordCounts: { [key: string]: number } = {};
//     data.forEach(word => {
//       if (!wordCounts[word]) {
//         wordCounts[word] = 0;
//       }
//       wordCounts[word]++;
//     });

//     // Convert word counts to word cloud data format
//     const wordCloudData = Object.entries(wordCounts).map(([word, count]) => ({
//       text: word,
//       value: count,
//     }));

//     return wordCloudData;
//   };

//   // Define your fontSizeMapper function
//   const fontSizeMapper = (word: { value: number }) => {
//     // Ensure that the font size is at least 10
//     const minFontSize = 15;
//     return Math.max(minFontSize, Math.log2(word.value) * 5);
//   };

//   return (
//     <div style={{ margin: 'auto' }}>
//       <h2>All Job Titles</h2>
//       {data.length > 0 && (
//         <ReactD3Cloud
//           data={generateWordCloudData()}
//           fontSize={fontSizeMapper} // Use your fontSizeMapper function here
//           width={600}
//           height={400}
//         />
//       )}
//     </div>
//   );
// };

// export default WordCloudComponent;

import React, { useState, useEffect } from 'react';
import ReactD3Cloud from 'react-d3-cloud'; // Import the library

// Define the type for the data
interface LocationData {
  urn_id: string;
  distance: string | number;
  jobtitle: string | null;
  location: string;
  name: string;
}

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

interface Props {
  data: (LocationData | TwitterData)[] | null;
}

const WordCloudComponent: React.FC<Props> = ({ data }) => {
  const [wordData, setWordData] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setWordData(generateWordList(data.slice(0, 200)));
    }
  }, [data]);

  const generateWordList = (data: (LocationData | TwitterData)[]): string[] => {
    const words: string[] = [];
    data.forEach(item => {
      if ('jobtitle' in item && item.jobtitle) {
        const jobTitles = item.jobtitle.split(/[|@]/);
        jobTitles.forEach(title => {
          const smallerTitles = title.trim().split(/\s+/);
          words.push(...smallerTitles);
        });
      } else if ('retweetCount' in item && item.text) {
        const textWords = item.text.split(/\s+/);
        words.push(...textWords);
      }
    });
    return words;
  };

  const generateWordCloudData = () => {
    if (!wordData) return []; // Return empty data if no data available

    // Count occurrences of each word
    const wordCounts: { [key: string]: number } = {};
    wordData.forEach(word => {
      if (!wordCounts[word]) {
        wordCounts[word] = 0;
      }
      wordCounts[word]++;
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
      {wordData.length > 0 && (
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
