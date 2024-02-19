import React from 'react';
import SideNav from '../Components/Navbar';
import { CssBaseline, useMediaQuery } from '@mui/material';
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' ,justifyContent: 'space-between' ,  
                    alignItems: isMobile ? 'center' : 'flex-start',  }}>
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
                      title="Share"
                      currentValue={70}
                      previousValue={60}
                      backgroundImage={fourth}
                    />
                    <GrowthCard
                      title="New Followers"
                      currentValue={30}
                      previousValue={35}
                      backgroundImage={fifth}
                    />
                  </div>
              </div>
              <div style={{margin:'10px' , justifyContent:'flex-start'}}> 
                <SocialAccount/>
              </div>
            </main>
            
        </div>
    </div>
  );
}
