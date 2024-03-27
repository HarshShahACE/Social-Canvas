import { Box, CssBaseline, Tab, Tabs, useMediaQuery } from "@mui/material";
import SideNav from "../Components/Common/Navbar";
import { SetStateAction, useState } from "react";
import Linkedin_Twitter_Post from "./Linkedin_Twitter_post";
import Youtubepost from "./youtube_post";

const Schedule_Post = () =>{

    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;
    const isMobile = useMediaQuery('(max-width:600px)');

    const [value, setValue] = useState(0);

    const handleChange = (event: any, newValue: SetStateAction<number>) => {
        setValue(newValue);
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
                <Box sx={{ width: '100%' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Linkedin & Twitter" />
                        <Tab label="Youtube" />
                    </Tabs>
                </Box>
                <div style={{marginTop:'10px'}}>
                    {value === 0 && (
                        <Linkedin_Twitter_Post />
                    )}
                    {value === 1 && (
                        <Box>
                            <Youtubepost/>
                        </Box>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Schedule_Post;