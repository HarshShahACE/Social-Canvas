// import React, { useEffect, useRef, useState } from 'react';
// import Chart from 'chart.js/auto';
// import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

// interface PostData {
//   postUrl: string;
//   type: string;
//   postContent: string;
//   likeCount: number;
//   commentCount: number;
//   repostCount: number;
//   postDate: string;
//   viewCount: number;
//   timestamp: string;
//   postTimestamp: string;
//   // Add other properties if needed
// }

// interface Props {
//   postData: PostData[] | null;
// }

// const DoubleLineGraph: React.FC<Props> = ({ postData }) => {
//   const [topPosts, setTopPosts] = useState<PostData[]>([]);
//   const chartInstance = useRef<Chart | null>(null);
//   const tableRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (postData && postData.length > 0) {
//       const sortedPosts = postData.sort((a, b) => b.likeCount - a.likeCount).slice(0, 5);
//       setTopPosts(sortedPosts);
//     }
//   }, [postData]);

//   useEffect(() => {
//     if (topPosts.length > 0) {
//       const canvas = document.getElementById('doubleLineGraph');
//       if (canvas instanceof HTMLCanvasElement) {
//         const ctx = canvas.getContext('2d');
//         if (ctx) {
//           // Destroy existing chart if it exists
//           if (chartInstance.current) {
//             chartInstance.current.destroy();
//           }

//           const labels = topPosts.map((_, index) => (index + 1).toString()); // Use post IDs as labels
//           const likeData = topPosts.map(post => post.likeCount);
//           const viewData = topPosts.map(post => post.commentCount);

//           chartInstance.current = new Chart(ctx, {
//             type: 'line',
//             data: {
//               labels: labels,
//               datasets: [{
//                 label: 'Likes',
//                 data: likeData,
//                 borderColor: '#4386C2',
//                 backgroundColor: 'transparent',
//                 yAxisID: 'likes'
//               }, {
//                 label: 'comments',
//                 data: viewData,
//                 borderColor: '#CA5C5C',
//                 backgroundColor: 'transparent',
                
//                 yAxisID: 'Comments'
//               }]
//             },
//             options: {
//               scales: {
//                 x: {
//                     ticks: {
//                       color: 'white' // Change color of x-axis ticks (index labels)
//                     }
//                   },
//                 likes: {
//                   type: 'linear',
//                   display: true,
//                   position: 'left',
//                   title: {
//                     display: true,
//                     text: 'Likes',
//                     color: 'white'
//                   },
//                   ticks:{
//                     color:'white'
//                   }
//                 },
//                 Comments: {
//                   type: 'linear',
//                   display: true,
//                   position: 'right',
//                   title: {
//                     display: true,
//                     text: 'Comments',
//                     color:'white',
//                   },
//                   grid: {
//                     drawOnChartArea: false
//                   },
//                   ticks:{
//                     color:'white'
//                   }
//                 }
//               },
//               plugins: {
//                 legend: {
//                   labels: {
//                     color: 'white' // Change color of legend labels
//                   }
//                 }
//               }
//             }
//           });
//         }
//       }
//     }
//   }, [topPosts]);

//   return (
//     <div style={{ display: 'flex' }}>
//       <div style={{ height: '450px', minWidth: '50%', marginRight: '20px' }}>
//         <canvas id="doubleLineGraph" width="500" height="200" color='white'></canvas>
//       </div>
//       <div
//         ref={tableRef}
//         style={{ overflowY: 'scroll', width: '50%', height: '400px' }}
//       >
//         <TableContainer component={Paper} style={{ background: '#3B3C45', border: '1px solid #ddd' }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell style={{ background: '#494A52', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>ID</TableCell>
//                 <TableCell style={{ background: '#494A52', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>Post Type</TableCell>
//                 <TableCell style={{ background: '#494A52', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>Post Content</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {topPosts.map((post, index) => (
//                 <TableRow key={index}>
//                   <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{index + 1}</TableCell>
//                   <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{post.type}</TableCell>
//                   <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{post.postContent}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>
//     </div>
//   );
// };

// export default DoubleLineGraph;

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

interface PostData {
  postUrl: string;
  type: string;
  postContent: string;
  likeCount: number;
  commentCount: number;
  repostCount: number;
  postDate: string;
  viewCount: number;
  timestamp: string;
  postTimestamp: string;
}

interface Props {
  postData: PostData[] | null;
}

const DoubleLineGraph: React.FC<Props> = ({ postData }) => {
  const [topPosts, setTopPosts] = useState<PostData[]>([]);
  const chartInstance = useRef<Chart | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (postData && postData.length > 0) {
      const sortedPosts = postData.sort((a, b) => b.likeCount - a.likeCount);
      setTopPosts(sortedPosts);
    }
  }, [postData]);

  useEffect(() => {
    if (topPosts.length > 0) {
      const canvas = document.getElementById('doubleLineGraph');
      if (canvas instanceof HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          const labels = topPosts.map((_, index) => (index + 1).toString());
          const likeData = topPosts.map(post => post.likeCount);
          const commentData = topPosts.map(post => post.commentCount);

          chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Likes',
                data: likeData,
                borderColor: '#36A2EB',
                backgroundColor: 'transparent',
                yAxisID: 'likes'
              }, {
                label: 'Comments',
                data: commentData,
                borderColor: '#FF3A17',
                backgroundColor: 'transparent',
                yAxisID: 'comments'
              }]
            },
            options: {
              scales: {
                x: {
                  ticks: {
                    color: ' black'
                  }
                },
                likes: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Likes',
                    color: ' black'
                  },
                  ticks: {
                    color: ' black'
                  }
                },
                comments: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Comments',
                    color: ' black'
                  },
                  ticks: {
                    color: ' black'
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: ' black'
                  }
                }
              }
            }
          });
        }
      }
    }
  }, [topPosts]);

  const generateTableData = () => {
    if (!topPosts) return [];

    const topFivePosts = topPosts.slice(0, 5);

    return topFivePosts.map((post, index) => ({
      id: index + 1,
      type: post.type,
      postContent: post.postContent
    }));
  };

  return (
    <div style={{ display: 'flex' , alignItems: 'flex-start' }}>
      <div style={{ height: '450px', minWidth: '50%', marginRight: '20px' , flex: 1 }}>
        <h2>Top Post Based On Likes And Comments</h2>
        <canvas id="doubleLineGraph" width="500" height="200" color=' black'></canvas>
      </div>
      <div
        ref={tableRef}
        style={{ overflowY: 'scroll', flex:'1' ,  width: '50%', height: '400px', marginBottom: '20px' }}
      >
        <TableContainer component={Paper} style={{ background: '#f9f9f9', border: '1px solid #ddd' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>Post Type</TableCell>
                <TableCell style={{ background: '#eaeaea', borderBottom: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>Post Content</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {generateTableData().map((item, index) => (
                <TableRow key={index}>
                  <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{item.id}</TableCell>
                  <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{item.type}</TableCell>
                  <TableCell style={{ borderBottom: '1px solid #ddd', padding: '8px', fontSize: '14px' }}>{item.postContent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default DoubleLineGraph;
