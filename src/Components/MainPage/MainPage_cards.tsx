import { Card, CardContent, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import first from '../../assets/Photos/1st.png'
import second from '../../assets/Photos/2nd.png'
import third from '../../assets/Photos/3rd.png'
import fourth from '../../assets/Photos/4th.png'

interface GrowthCardProps {
    platform: string;
}

const GrowthCard: React.FC<GrowthCardProps> = ({ platform }) => {

    const [data, setData] = useState<any>({});
    const isMobile = useMediaQuery('(max-width:600px)');
    const idstring = sessionStorage.getItem("Myid");
    if (idstring !== null) {
        var id = parseInt(idstring);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_Fast_API}/${platform}_Dashboard/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    const responseData = await response.data;
                    setData(responseData);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
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
                return first;
            case 'Total Likes':
                return second;
            case 'Total Comments':
                return third;
            case 'Total  Connections':
                return fourth;
            default:
                return ''; // Default background image if key doesn't match
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
            {Object.entries(data).map(([key, value]) => (
                <Card key={key} sx={{
                    minWidth: 200,
                    maxWidth: 300,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 5,
                    backgroundImage: `linear-gradient(rgba(32, 33, 40, 0.1), rgba(32, 33, 40, 0.1)), url(${getBackgroundImage(key)})`, // Assuming you have a function to get the appropriate background image based on the key
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    margin: '20px 40px 20px 0px'
                }}>
                    <CardContent style={{ position: 'relative', zIndex: 1, color: '#FFF', textAlign: 'center' }}>
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
