import React, { useState } from 'react';
import SideNav from '../Components/Navbar';
import { CssBaseline, useMediaQuery } from '@mui/material';
import GrowthCard from '../Components/MainPage/MainPage_cards';
import SocialAccount from '../Components/MainPage/MainPage_Table';
import first from '../assets/Photos/1st.png'
import second from '../assets/Photos/2nd.png'
import third from '../assets/Photos/3rd.png'
import fourth from '../assets/Photos/4th.png'
import fifth from '../assets/Photos/5th.png'
import linkedin from '../assets/Photos/Linkedin.png'
import twitter from '../assets/Photos/twitter.jpg'
import facebook from '../assets/Photos/FBLogo.png'
import SelectComponent from '../Components/Selectfield';

const options = [
  { value: 'linkedin', label: 'LinkedIn', avatar: linkedin },
  { value: 'facebook', label: 'Facebook', avatar: facebook },
  { value: 'twitter', label: 'Twitter', avatar: twitter },
];

export default function HomePage() {

  const isMobile = useMediaQuery('(max-width:600px)');
  const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");

  const handlePlatformChange = (event : string) => {
    setSelectedPlatform(event);
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
                <div style={{width:'50%' , marginTop:'10px'}}>
                  <SelectComponent
                    label="Platform"
                    value={selectedPlatform}
                    onChange={handlePlatformChange}
                    options={options}
                  />
                </div>
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
                    <div style={{ display: 'flex' , flexDirection: isMobile? 'column' : 'row' }}>
                      <GrowthCard title="Posts" currentValue={500} previousValue={450} backgroundImage={first} />
                      <GrowthCard title="Likes" currentValue={1000} previousValue={980} backgroundImage={second} />
                      <GrowthCard title="Comments" currentValue={300} previousValue={275} backgroundImage={third} />
                      <GrowthCard title="New Connections" currentValue={30} previousValue={35} backgroundImage={fifth} />
                    </div>
                  )}
                  {selectedPlatform === "facebook" && (
                    <div style={{ display: 'flex' , flexDirection: isMobile? 'column' : 'row' }}>
                      <GrowthCard title="Posts" currentValue={500} previousValue={450} backgroundImage={first} />
                      <GrowthCard title="Likes" currentValue={1000} previousValue={980} backgroundImage={second} />
                      <GrowthCard title="Comments" currentValue={300} previousValue={275} backgroundImage={third} />
                      <GrowthCard title="Share" currentValue={150} previousValue={130} backgroundImage={fourth} />
                      <GrowthCard title="New Followers" currentValue={30} previousValue={35} backgroundImage={fifth} />
                    </div>
                  )}
                  {selectedPlatform === "twitter" && (
                    <div style={{ display: 'flex', flexDirection: isMobile? 'column' : 'row' }}>
                      <GrowthCard title="Posts" currentValue={500} previousValue={450} backgroundImage={first} />
                      <GrowthCard title="Likes" currentValue={1000} previousValue={980} backgroundImage={second} />
                      <GrowthCard title="Comments" currentValue={300} previousValue={275} backgroundImage={third} />
                      <GrowthCard title="Share" currentValue={140} previousValue={160} backgroundImage={fourth} />
                      <GrowthCard title="New Followers" currentValue={30} previousValue={35} backgroundImage={fifth} />
                    </div>
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
