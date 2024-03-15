import React, { useState } from 'react';
import SideNav from '../Components/Common/Navbar';
import { Avatar, Box, CssBaseline, Typography, useMediaQuery } from '@mui/material';
import GrowthCard from '../Components/MainPage/MainPage_cards';
import SocialAccount from '../Components/MainPage/MainPage_Table';
import { platforms } from '../Components/Common/platefroms';

export default function HomePage() {

  // Check for Phone View
  const isMobile = useMediaQuery('(max-width:600px)');
  const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

  // Selected Paterforms
  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");

  // Chnage On Selected Plaeform
  const handlePlatformChange = (event : string) => {
    setSelectedPlatform(event);
  };

  return (
    <div style={{ display: 'flex' ,backgroundColor:'#FFFFFF' ,backgroundImage: `url(${defaultImagePath})`, backgroundSize:'contain', width:'100%',
    backgroundRepeat:'no-repeat',
    backgroundPosition:'bottom right'  , height:'100vh' }}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <CssBaseline />
      {/* Sidebar */}
      <SideNav/>
      {/* Main content */}
      <div style={{ flex: 1  }}>
            <main style={{ flexGrow: 1, padding: 3, marginTop: '70px' , marginLeft: isMobile? '20px' : '240px'  }}>
            {/* Main content */}
              <div style={{marginLeft: "20px", justifyContent: "flex-start"}}>
                {/* Dropdown for selecting platform */}
                <Box display="flex" alignItems="center" mt={2}>
                  {platforms.map(platform => (
                    <Box key={platform.value} style={{ display: 'flex', alignItems: 'center',  backgroundColor: selectedPlatform === platform.value ? '#283141' : '#D8D8D8', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(67, 131, 197, 0.9)', marginRight: '20px' , padding:'5px' }}>
                      <Avatar style={{ cursor: 'pointer' }} onClick={() => handlePlatformChange(platform.value)}>
                        <img src={platform.imageUrl} alt={platform.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      </Avatar>
                      <Typography variant="subtitle1" style={{ marginLeft: '5px', marginRight: '30px', fontSize: '18px', color: selectedPlatform === platform.value ? '#FFFFFF' : '#000000' }}>{platform.name}</Typography>
                    </Box>
                  ))}
                </Box>
                {/* Growth Cards */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "",
                    alignItems: "flex-start",
                    width:'80%'
                  }}
                >
                  {/* Conditional rendering of GrowthCard components based on selected platform */}
                  {selectedPlatform && (
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                      <GrowthCard platform={selectedPlatform} />
                    </div>
                  )}
                </div>
              </div>

              {/* Social Account Component */}
              <div style={{ margin: "20px 10px", justifyContent: "flex-start" }}>
                <SocialAccount />
              </div>
            </main>  
        </div>
    </div>
  );
}
