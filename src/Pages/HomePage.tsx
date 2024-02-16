import React from 'react';
import Typography from '@mui/material/Typography';
import SideNav from '../Components/Navbar';
import { CssBaseline, useMediaQuery } from '@mui/material';

export default function HomePage() {

  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <div style={{ display: 'flex' , backgroundImage: 'url(../SitePhotos/Login.png)', backgroundSize:'contain',
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
            <Typography paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Typography>
            </main>
        </div>
    </div>
  );
}
