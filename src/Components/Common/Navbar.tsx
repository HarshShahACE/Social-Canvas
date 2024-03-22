import React, { useState } from 'react';
import { Drawer, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, useMediaQuery, AppBar, Toolbar, IconButton, Box, MenuItem, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import PersonIcon from '@mui/icons-material/Person';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import { NotificationsRounded, YouTube } from '@mui/icons-material';
import CampaignIcon from '@mui/icons-material/Campaign';
import Person from '../../assets/Photos/Person.png'

const drawerWidth = 230;

export default function SideNav() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [open, setOpen] = React.useState(!isMobile); // Start with sidebar open on larger screens
    const [alertAnchorEl, setAlertAnchorEl] = useState(null); // Anchor element for the alert popover
    const [profileAnchorEl, setProfileAnchorEl] = useState(null); // Anchor element for the profile popover
    const location = useLocation();
    const Navigate = useNavigate();

    const username = sessionStorage.getItem('Uname');
  
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };
  
    const handlealertopen = (event : any) => {
      setAlertAnchorEl(event.currentTarget); // Open the alert popover
    };
  
    const handlealertclose = () => {
      setAlertAnchorEl(null); // Close the alert popover
    };
  
    const handleProfileClick = (event : any) => {
      setProfileAnchorEl(event.currentTarget); // Open the profile popover
    };
  
    const handleProfileClose = () => {
      setProfileAnchorEl(null); // Close the profile popover
    };

    const handleNavigate = () => {
      Navigate("/Manage_Post");
    }
  
    const openAlert = Boolean(alertAnchorEl);
    const openProfile = Boolean(profileAnchorEl);

    const alertId = openAlert ? 'alert-popover' : undefined; 
    const profileId = openProfile ? 'profile-popover' : undefined; 

  const sideList = [
    { id: 'dashboard', text: 'Dashboard', icon: <HomeIcon style={{color:'#8B5CE1'}} />, path: '/Dashboard' },
    { id: 'Schedulepost', text: 'Schedule Post', icon:<PostAddIcon style={{color:'#F8A30C'}}/> ,path: '/Schedule_Post' },
    { id: 'youtubepost', text: 'Youtube Post', icon:<YouTube style={{color:'#FC424A'}}/> ,path: '/Youtube_Post' },
    { id: 'managepost', text: 'Manange Post', icon:<ManageHistoryIcon style={{color:'#0090E7'}}/>, path: '/Manage_Post' },
    { id: 'analysis', text: 'Insights', icon: <AnalyticsIcon style={{color:'#52D017'}}/>, path: '/Analysis' },
    { id: 'profile', text: 'My Profile', icon: <AccountCircleIcon style={{color:'#EB5406'}}/>, path: '/Profile' },
    { id: 'logout', text: 'Logout', icon: <LogoutIcon style={{color:'#D53940'}} /> , path:'/Logout' }, // Change path to the login page
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 2, top: 0 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor:'#F8F9FC'  }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 2 }}
          >
            <MenuIcon style={{color:'black'}}/>
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="alert"
            edge="end"
            size='large'
            onClick={handlealertopen}
            style={{marginRight:'5px', marginLeft:'auto' }}
          >
            <NotificationsRounded style={{color:'black'}} />
          </IconButton>
            <Popover
              id={alertId}
              open={openAlert}
              anchorEl={alertAnchorEl}
              onClose={handlealertclose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <div style={{ padding: '15px' }}>
                <div style={{ marginBottom: '10px' }}>Notifications</div>

                <Divider style={{ marginBottom: '10px' }} />

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ backgroundColor: '#0D0D0D', borderRadius: '50%', padding: '5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CampaignIcon style={{ color: '#00D25B' }} />
                  </div>
                  <Typography variant="body2" style={{marginLeft:'5px'}}>FaceBook And Instagram Is Coming Soon</Typography>
                </div>

                <Divider style={{ marginBottom: '10px' }} />

                <Typography variant="body2" style={{ display: 'flex', justifyContent: 'center' }}>
                  See All Notifications
                </Typography>
              </div>
            </Popover>

            <Divider orientation='vertical' flexItem  style={{color:'black' , width:'2px'}}/>

          <IconButton
            color="inherit"
            aria-label="profile"
            edge="end"
            size='large'
            onClick={handleProfileClick}
          >
            <img src={Person} alt="Logo" style={{ maxWidth: '50px', maxHeight: '50px'}} />
          </IconButton>
            <Popover
              id={profileId}
              open={openProfile}
              anchorEl={profileAnchorEl}
              onClose={handleProfileClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {/* Profile Popover content */}
              <MenuList autoFocusItem={openProfile} id="profile-menu">
                <MenuItem  component={Link} to="/Profile" onClick={handleProfileClose}>
                  <ListItemIcon>
                      <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem component={Link} to="/Logout" onClick={handleProfileClose}>
                  <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </MenuList>
            </Popover>
          <Typography onClick={handleProfileClick} style={{marginLeft:'5px' , userSelect:'none' , color:'black'}}>{username}</Typography>
        </Toolbar>
      </AppBar>

        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={open}
          onClose={handleDrawerClose}
          sx={{
            '& .MuiDrawer-paper': { 
              width: drawerWidth,
              backgroundColor: '#202020', // Light background color
            },
            ...(isMobile && {
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                backgroundColor: '#202020',
              },
            }),
            paddingLeft: '10px',
          }}
        >
        <Box sx={{ backgroundColor: 'inherit' }}> {/* This box ensures that the background color doesn't override the selected item color */}
          <Box sx={{ display: 'flex', flexDirection:'column' ,justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <img src="../../SitePhotos/img1.png" alt="Logo" style={{ maxWidth: '50px', maxHeight: '50px' }} />
            <img src="../../SitePhotos/TextLogo2.png" alt="Logo" style={{ maxWidth: '200px', maxHeight: '200px', marginTop:'15px' }} />
          </Box>
          <Divider style={{background:'#FFFFFF' , marginBottom:'20px'}}/>
          {sideList.map(({ id, text, icon, path }) => (
          <React.Fragment key={id}>
            <ListItem
              disablePadding
              onClick={handleDrawerClose}
              sx={{ 
                backgroundColor: location.pathname === path ? '#FFFFFF' : 'transparent', // Light blue color with reduced opacity 
                borderTopRightRadius: location.pathname === path ? '20px' : 0, // Add curved edges for the selected item
                borderBottomRightRadius: location.pathname === path ? '20px' : 0, // Add curved edges for the selected item
                paddingRight: location.pathname === path ? '20px' : 0,
              }}
            >
              <ListItemButton 
                component={Link} 
                to={path} 
                sx={{ 
                  borderLeft: location.pathname === path ? '4px solid #1D8AFF' : '4px solid transparent',
                  paddingRight: '20px',
                }}
              >
                <ListItemIcon sx={{ margin: 0, color: location.pathname === path ? '#4694E0' : '#FFFFFF', minWidth: 0 }}>
                  {icon}
                </ListItemIcon>
                <ListItemText 
                  primary={text} 
                  sx={{ 
                    color: location.pathname === path ? '#0D0D0D' : '#FFFFFF', 
                    marginLeft: 1,
                  }} 
                />
              </ListItemButton>
            </ListItem>
          </React.Fragment>
        ))}
        </Box>
      </Drawer>
    </Box>
  );
}