import { Avatar, Box, Divider, Select, Typography, useMediaQuery } from "@mui/material";
import { CssBaseline } from "@mui/material"
import SideNav from "../Components/Common/Navbar";
import Barchart from "../Components/Analysis/BarChart";
import { platforms } from "../Components/Common/platefroms";
import { useEffect, useState } from "react";
import LoadingScreen from "../Components/Common/Loading";
import axios from "axios";
import DoubleLineGraph from "../Components/Analysis/double_line";
import DoughnutChart from "../Components/Analysis/Doughnut_chart";
import AreaChartComponent from "../Components/Analysis/Areachart";
import YDoubleLineGraph from "../Components/Analysis/youtube_doubleline";

// Define interface for sentiment data
interface SentimentData {
    Tweet: string;
    Sentiment: string;
}

// Define options for the select dropdown
const options = [
    { value: '6', name: 'Last 6 Months'},
    { value: '9', name: 'Last 9 Months'},
    { value: '12', name: 'Last 12 Months'},
    { value: '24', name: 'Last 24 Months'}
];

const Analysis = () => {
    // Check for mobile view
    const isMobile = useMediaQuery('(max-width:600px)');

    // State variables
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>('linkedin');
    const [loading,setLoading] = useState(true);
    const [connectionData, setconnectiondata] = useState(null);
    const [postdata , setPostData] = useState(null);
    const [treemapImage, setTreemapImage] = useState('');
    const [wordcloudImage, setWordcloudImage] = useState('');
    const [Tweetdata, setTweetdata] = useState(null);
    const [youtubedata,setyoutubedata] = useState(null);
    const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
    const [months,setmonths] = useState('6');

    // Retrieve the user ID from sessionStorage
    const idString = sessionStorage.getItem('Myid');
    if (idString !== null) {
        var id = parseInt(idString);
    }

    // useEffect hook to fetch data based on selected platform and month
    useEffect(() => {
        // Simulate loading for 1 second
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        // Function to fetch LinkedIn data
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_Fast_API}/fetch_linkedin_data/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    const { connection_data, post_data , treemap_image_base64, wordcloud_image_base64  } = await response.data;
                    setconnectiondata(connection_data);
                    setPostData(post_data);
                    setTreemapImage(`data:image/png;base64,${treemap_image_base64}`);
                    setWordcloudImage(`data:image/png;base64,${wordcloud_image_base64}`);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Function to fetch Twitter data
        const fetchtData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_Fast_API}/fetch_twitter_data/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    const {tweet_data , sent_analysis, } = await response.data;
                    setTweetdata(tweet_data);
                    setSentimentData(JSON.parse(sent_analysis));
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Function to fetch YouTube data
        const fetchYData = async () => {
            const monthsint = parseInt(months);
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_Fast_API}/fetch_youtube_data/${id}/${monthsint}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    const youtubedata = await response.data;
                    setyoutubedata(youtubedata);
                    setLoading(false);
                } else {
                    setLoading(false);
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                setLoading(false);
                console.error('Error fetching data:', error);
            }
        };

        // Fetch data based on selected platform and month
        if(selectedPlatform === 'linkedin'){
            fetchData();
        } else if (selectedPlatform === "twitter"){
            fetchtData();
        } else if (selectedPlatform === "youtube"){
            fetchYData();
        }

        // Clear the timer on unmount or if loading is completed early
        return () => clearTimeout(timer);
    }, [selectedPlatform, months]);

    // Function to handle platform change
    const handlePlatformChange = (value: string) => {
        if (selectedPlatform === value) {
            // If the platform is already selected, deselect it
            setSelectedPlatform(null);
        } else {
            // If a platform is selected, update the selected platform
            setSelectedPlatform(value);
        }
    };

    return (
        <div style={{ display: 'flex', backgroundColor:'#FFFFFF' , height:'100vh' }}>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <CssBaseline />
            {loading && <LoadingScreen/>}
            {/* Sidebar */}
            <SideNav/>
            {/* Main content */}
            <div style={{ flex: 1 }}>
                <main style={{ flexGrow: 1, padding: 3, marginTop: '70px', marginLeft: isMobile ? '20px' : '240px', display: 'flex', flexDirection: 'column' }}>
                    {/* Platform selection */}
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
                                            <h2 style={{margin:'5px'}}>Job Titles</h2>
                                            {wordcloudImage && <img src={wordcloudImage} alt="Wordcloud" style={{height:'420px',width:'560px'}} />}  
                                        </div>
                                        <div style={{ width: '50%',marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #000' }} >
                                            <div>
                                                <h2> Top 10 Job Titles</h2>
                                                <Barchart socialData={connectionData || null} dataType="linkedin" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Connection Location Details */}
                                    <div style={{marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #000' }} >
                                        <h2 style={{margin:'5px'}}>Location Of Connections</h2>
                                        {treemapImage && <img src={treemapImage} alt="Treemap" style={{height:'420px' , width:'100%'}} />}
                                    </div>
                                </>
                            ) : (
                                <h2>Add Account for Insights</h2>
                            )}
                        </>
                    ) : selectedPlatform === 'twitter' ?  (
                        <>
                            {Tweetdata ? (
                                <>
                            <div style={{marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #000' }} >
                                    <div>
                                        <Barchart socialData={Tweetdata} dataType="twitter" />
                                    </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #000' }} >
                                    <div>
                                        <DoughnutChart data={sentimentData} />
                                    </div>
                                </div>
                            </div>
                            </>
                            ) : (
                               <h2>Please add account for insights</h2>
                            )}
                        </>
                    ) : selectedPlatform === 'youtube' ?  (
                        <>
                            {youtubedata ? (
                                <> 
                                    <div style={{display:'flex' , flexDirection:'row'}}>
                                        <Typography variant="h5" style={{marginRight:'30px' ,marginTop:'5px'}}><b>Analysis of:</b></Typography>
                                        {options.map(option => (
                                            <Box key={option.value} onClick={() => setmonths(option.value)} style={{ display: 'flex', alignItems: 'center',  backgroundColor: months === option.value ? '#283141' : '#D8D8D8', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(67, 131, 197, 0.9)', marginRight: '30px' , padding:'5px' }}>
                                                <Typography variant="subtitle1" style={{ marginLeft: '5px', marginRight: '30px', fontSize: '18px', color: months === option.value ? '#FFFFFF' : '#000000' }}>{option.name}</Typography>
                                            </Box>
                                        ))}
                                    </div> 
                                    <div style={{marginTop:'20px'}}>
                                        <YDoubleLineGraph data={youtubedata} />
                                    </div>  
                                    <div style={{marginTop:'20px', borderRadius:'20px',border: '1px solid #000' , width:'98%'}}>
                                        <AreaChartComponent apiResponse={youtubedata}/>
                                    </div>
                                </>
                            ) : (
                                <h2>Please add account for insights</h2>
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
