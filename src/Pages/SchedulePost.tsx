import { Avatar, Box, CssBaseline, Divider, Typography, useMediaQuery } from "@mui/material";
import SideNav from "../Components/Common/Navbar";
import { useState } from "react";
import Youtubepost from "../Components/Schedule_Post/youtube_post";
import { platforms } from "../Components/Common/platefroms";
import TwitterPost from "../Components/Schedule_Post/Twitter_post";
import LinkedinPost from "../Components/Schedule_Post/Linkedin_post";

const Schedule_Post = () =>{

    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;
    const isMobile = useMediaQuery('(max-width:600px)');

    const [selectedPlatform, setSelectedPlatform] = useState<string | null>('linkedin');

    const handlePlatformChange = (value: string) => {
        if (selectedPlatform === value) {
            // If the platform is already selected, deselect it
            setSelectedPlatform(null);
        } else {
            // If a platform is selected, update the selected platform
            setSelectedPlatform(value);
        }
    };


    return(
        <div style={{ backgroundColor:'#FFFFFF' , backgroundImage: `url(${defaultImagePath})`, backgroundSize:'contain',
            backgroundRepeat:'no-repeat',
            backgroundPosition:'bottom right'  , height:'100vh' }}>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <CssBaseline />
            {/* Sidebar */}
            <SideNav/>
            <div style={{marginTop:'90px' , marginLeft:isMobile?'10px':'250px'}}>
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
                        <LinkedinPost/>
                    ) : selectedPlatform === 'twitter' ?  (
                        <TwitterPost/>
                    ) : selectedPlatform === 'youtube' ?  (
                        <Youtubepost/>              
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                            <h2>Please select a Platform to Post.</h2>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default Schedule_Post;