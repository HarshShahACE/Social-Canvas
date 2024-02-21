import React, { useState } from 'react';
import SideNav from '../Components/Navbar';
import { Avatar, CssBaseline, ListItemAvatar, MenuItem, Select, useMediaQuery } from '@mui/material';
import GrowthCard from '../Components/MainPage/MainPage_cards';
import SocialAccount from '../Components/MainPage/MainPage_Table';
import first from '../Photos/1st.png'
import second from '../Photos/2nd.png'
import third from '../Photos/3rd.png'
import fourth from '../Photos/4th.png'
import fifth from '../Photos/5th.png'


export default function HomePage() {

  const isMobile = useMediaQuery('(max-width:600px)');
  const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");

  const handlePlatformChange = (event : any) => {
    setSelectedPlatform(event.target.value);
  };

  return (
    <div style={{ display: 'flex' , backgroundImage: `url(${defaultImagePath})`, backgroundSize:'contain',
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
                <Select
                  value={selectedPlatform}
                  onChange={handlePlatformChange}
                  variant="outlined"
                  style={{ marginBottom: "10px" , width:'50%' }}
                >
                  <MenuItem value="linkedin">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ListItemAvatar>
                        <Avatar src="avatar_url_linkedin" alt="LinkedIn" />
                      </ListItemAvatar>
                      <span>LinkedIn</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="facebook">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ListItemAvatar>
                        <Avatar src="avatar_url_facebook" alt="Facebook" />
                      </ListItemAvatar>
                      <span>Facebook</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="twitter">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ListItemAvatar>
                        <Avatar src="avatar_url_twitter" alt="Twitter" />
                      </ListItemAvatar>
                      <span>Twitter</span>
                    </div>
                  </MenuItem>
                </Select>
                {/* Growth Cards */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Conditional rendering of GrowthCard components based on selected platform */}
                  {selectedPlatform === "linkedin" && (
                    <>
                      <GrowthCard
                        title="Posts"
                        currentValue={500}
                        previousValue={450}
                        backgroundImage={first}
                      />
                      <GrowthCard
                        title="Likes"
                        currentValue={1000}
                        previousValue={980}
                        backgroundImage={second}
                      />
                      <GrowthCard
                        title="Comments"
                        currentValue={300}
                        previousValue={275}
                        backgroundImage={third}
                      />
                      <GrowthCard
                        title="New Connections"
                        currentValue={30}
                        previousValue={35}
                        backgroundImage={fifth}
                      />
                    </>
                  )}
                  {selectedPlatform === "facebook" && (
                    <>
                      <GrowthCard
                        title="Posts"
                        currentValue={500}
                        previousValue={450}
                        backgroundImage={first}
                      />
                      <GrowthCard
                        title="Likes"
                        currentValue={1000}
                        previousValue={980}
                        backgroundImage={second}
                      />
                      <GrowthCard
                        title="Comments"
                        currentValue={300}
                        previousValue={275}
                        backgroundImage={third}
                      />
                      <GrowthCard
                        title="New Followers"
                        currentValue={30}
                        previousValue={35}
                        backgroundImage={fifth}
                      />
                    </>
                  )}
                  {selectedPlatform === "twitter" && (
                    <>
                     <GrowthCard
                        title="Posts"
                        currentValue={500}
                        previousValue={450}
                        backgroundImage={first}
                      />
                      <GrowthCard
                        title="Likes"
                        currentValue={1000}
                        previousValue={980}
                        backgroundImage={second}
                      />
                      <GrowthCard
                        title="Comments"
                        currentValue={300}
                        previousValue={275}
                        backgroundImage={third}
                      />
                      <GrowthCard
                        title="New Followers"
                        currentValue={30}
                        previousValue={35}
                        backgroundImage={fifth}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Social Account Component */}
              <div style={{ margin: "10px", justifyContent: "flex-start" }}>
                <SocialAccount />
              </div>
            </main>  
        </div>
    </div>
  );
}
