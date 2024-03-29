import { Avatar, Box, Divider, Typography, useMediaQuery } from "@mui/material";
import { CssBaseline } from "@mui/material"
import SideNav from "../Components/Common/Navbar";
import Barchart from "../Components/Analysis/BarChart";
import { platforms } from "../Components/Common/platefroms";
import { useEffect, useState } from "react";
import WordCloudComponent from "../Components/Analysis/wordcloud";
import LoadingScreen from "../Components/Common/Loading";
import axios from "axios";
import TopFivePieChart from "../Components/Analysis/top5piechart";
import BottomFivePieChart from "../Components/Analysis/bottom5chart";
import DoubleLineGraph from "../Components/Analysis/double_line";
import DoughnutChart from "../Components/Analysis/Doughnut_chart";
import AreaChartComponent from "../Components/Analysis/Areachart";
import YDoubleLineGraph from "../Components/Analysis/youtube_doubleline";

interface SentimentData {
    Tweet: string;
    Sentiment: string;
  }

const Analysis = () => {
    const isMobile = useMediaQuery('(max-width:600px)');

    const [selectedPlatform, setSelectedPlatform] = useState<string | null>('linkedin');
    const [loading,setLoading] = useState(true);

    const handlePlatformChange = (value: string) => {
        if (selectedPlatform === value) {
            // If the platform is already selected, deselect it
            setSelectedPlatform(null);
        } else {
            // If a platform is selected, update the selected platform
            setSelectedPlatform(value);
        }
    };

    const [connectionData, setconnectiondata] = useState(null);
    const [postdata , setPostData] = useState(null);
    const [Tweetdata, setTweetdata] = useState(null);
    const [youtubedata,setyoutubedata] = useState(null);
    const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);

    const idString = sessionStorage.getItem('Myid'); // Retrieve the value from localStorage
      if (idString !== null) {
        var id = parseInt(idString);
    }

    useEffect(() => {
        // Simulate loading for 10 seconds
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1000);

        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_Fast_API}/fetch_linkedin_data/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    const { connection_data, post_data } = await response.data;
        
                    // Assuming connection_data and post_data are properties of the response data object
        
                    setconnectiondata(connection_data); // Set connection data in state
                    setPostData(post_data); // Set post data in state
        
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchtData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_Fast_API}/fetch_twitter_data/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    const {tweet_data , sent_analysis } = await response.data;
                    setTweetdata(tweet_data);
                    setSentimentData(JSON.parse(sent_analysis));
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        const fetchYData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_Fast_API}/fetch_youtube_data/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    const youtubedata = await response.data;
                    setyoutubedata(youtubedata);
                    console.log(youtubedata);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if(selectedPlatform === 'linkedin'){
        fetchData();
        }else if (selectedPlatform === "twitter"){
            fetchtData();
        }else if (selectedPlatform === "youtube"){
            fetchYData();
        }
    
        // Clear the timer on unmount or if loading is completed early
        return () => clearTimeout(timer);
    }, [selectedPlatform]);

    return (
        <div style={{ display: 'flex', backgroundColor:'#FFFFFF' , height:'100vh' }}>
            <CssBaseline />
            {loading && <LoadingScreen/>}
            {/* Sidebar */}
            <SideNav/>
            {/* Main content */}
            <div style={{ flex: 1 }}>
                <main style={{ flexGrow: 1, padding: 3, marginTop: '70px', marginLeft: isMobile ? '20px' : '240px', display: 'flex', flexDirection: 'column' }}>
                    {/* First row */}
                    <Box display="flex" alignItems="center" mt={2}>
                  {platforms.map(platform => (
                    <Box key={platform.value} onClick={() => handlePlatformChange(platform.value)} style={{ display: 'flex', alignItems: 'center',  backgroundColor: selectedPlatform === platform.value ? '#283141' : '#D8D8D8', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(67, 131, 197, 0.9)', marginRight: '20px' , padding:'5px' }}>
                      <Avatar style={{ cursor: 'pointer' }}>
                        <img src={platform.imageUrl} alt={platform.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      </Avatar>
                      <Typography variant="subtitle1" style={{ marginLeft: '5px', marginRight: '30px', fontSize: '18px', color: selectedPlatform === platform.value ? '#FFFFFF' : '#000000' }}>{platform.name}</Typography>
                    </Box>
                  ))}
                </Box>
                    <Divider style={{ margin: '10px 0' }} />
                    {/* Render charts based on the selected platform */}
                    {selectedPlatform === 'linkedin' ? (
                        <>
                            {connectionData && postdata ? (
                            <>
                                {/* Post Data Charts */}
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ width: '100%',marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #000' }} >
                                        <div>
                                            <DoubleLineGraph postData={postdata || null} />
                                        </div>
                                    </div>
                                    
                                </div>
                                {/*  Second Row - Word Cloud Chart and Bar Chart Table*/}
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ width: '48%',marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #000' }} >
                                        <div>
                                            <WordCloudComponent data={connectionData || null} />
                                        </div>
                                    </div>
                                    <div style={{ width: '50%',marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #000' }} >
                                        <div>
                                            <h2> Top 10 Job Titles</h2>
                                            <Barchart socialData={connectionData || null} dataType="linkedin" />
                                        </div>
                                    </div>
                                </div>
                                {/* Connection Location Details */}
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ width: '50%',marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(255, 255, 355, 0.8)', border: '1px solid #000' }} >
                                        <div>
                                            <h3>Top 5 Location Of Connections</h3>
                                            <TopFivePieChart locationData={connectionData || null} />
                                        </div>
                                    </div>
                                    <div style={{ width: '50%',marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #000' }} >
                                        <div>
                                            <h3>Bottom 5 Location Of Connections</h3>
                                            <BottomFivePieChart locationData={connectionData || null} />
                                        </div>
                                    </div>
                                </div>
                                
                            </>
                            ) : (
                            <div style={{ marginTop: '15px', borderRadius: '20px', height: '50px', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #000' }}>
                                <h2>Add Account for Insights</h2>
                            </div>
                            )}
                        </>
                    ) : selectedPlatform === 'twitter' ?  (
                        <div>
                                    <div style={{marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #000' }} >
                                        {Tweetdata ? (
                                            <div>
                                            <Barchart socialData={Tweetdata} dataType="twitter" />
                                            </div>
                                        ) : (
                                            <div>Please add account for insights</div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #000' }} >
                                        <div>
                                            <DoughnutChart data={sentimentData} />
                                        </div>
                                    </div>
                                </div>
                        </div>
                    ) : selectedPlatform === 'youtube' ?  (
                        <>
                                {youtubedata ? (
                                    <>  
                                    <div style={{height:'850px'}}>
                                        <YDoubleLineGraph data={youtubedata} />
                                    </div>  
                                    <div style={{ height:'750px' , borderRadius:'20px',border: '1px solid #000' , width:'98%'}}>
                                        <AreaChartComponent apiResponse={youtubedata}/>
                                    </div>
                            </>
                                ) : (
                                    <div>Please add account for insights</div>
                                )}
                        </>
                                              
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                            <h2>Please select a Platform to view Analysis</h2>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default Analysis;
