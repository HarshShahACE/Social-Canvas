import { Card, CardContent, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import first from '../../assets/Photos/1st.png'
import second from '../../assets/Photos/2nd.png'
import third from '../../assets/Photos/3rd.png'
import fourth from '../../assets/Photos/4th.png'
import LoadingScreen from "../Common/Loading";

interface GrowthCardProps {
    platform: string;
}

const GrowthCard: React.FC<GrowthCardProps> = ({ platform }) => {

    const [data, setData] = useState<any>({});
    const [loading,setLoading] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const idstring = sessionStorage.getItem("Myid");
    if (idstring !== null) {
        var id = parseInt(idstring);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_Fast_API}/Dashboard_${platform}/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    const responseData = await response.data;
                    setData(responseData);
                    setLoading(false);
                } else {
                    setLoading(false);
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            setData({}); // Reset data when component unmounts or when platform changes
        };

    }, [platform]);

    const getBackgroundImage = (key: string) => {
        switch (key) {
            case 'Posts':
            case 'Following Count':
            case 'Total subscriber':
                return first; // Use the same image as 'Posts' for Twitter
            case 'Total Comments':
            case 'Likes Count':
                return second; // Use the same image as 'Total Likes' for Twitter
            case 'Total Likes':
            case 'Tweets Count':
                return third; // Use the same image as 'Total Comments' for Twitter
            case 'Total Connections':
            case 'Followers Count':
            case 'Total Views':
                return fourth; // Use the same image as 'Total Connections' for Twitter
            default:
                return ''; // Default background image if key doesn't match
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
            {loading && <LoadingScreen/>}
            {Object.entries(data).map(([key, value]) => (
                <Card key={key} sx={{
                    minWidth: 200,
                    maxWidth: 300,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 5,
                    backgroundImage: `url(${getBackgroundImage(key)})`, // Assuming you have a function to get the appropriate background image based on the key
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    margin: '20px 40px 20px 0px',
                    boxShadow:'2px 2px 5px 2px rgba(0, 0, 0, 0.5)',
                    "&:hover": {
                        boxShadow: "12px 12px 16px 5px rgba(0, 0, 0, 0.5)",
                        // backgroundColor: "#d4d4d4",
                      },
                }}>
                    <CardContent style={{ position: 'relative', zIndex: 1, color: '#000', textAlign: 'center' }}>
                        <Typography variant="h5" component="div" >
                            {key}
                        </Typography>
                        <Typography variant="h6">
                            {value !== null && value !== undefined ? String(value) : 0}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default GrowthCard;
