import React from 'react';
import { Drawer, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, useMediaQuery, AppBar, Toolbar, Typography, IconButton, Box, MenuItem } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, Link } from 'react-router-dom';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';

const drawerWidth = 230;

export default function SideNav() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [open, setOpen] = React.useState(!isMobile); // Start with sidebar open on larger screens
    const [anchorEl, setAnchorEl] = React.useState(null); // Anchor element for the profile menu
    const location = useLocation();
  
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };
  
    const handleProfileClick = (event : any) => {
      setAnchorEl(event.currentTarget); // Open the profile menu
    };
  
    const handleProfileClose = () => {
      setAnchorEl(null); // Close the profile menu
    };
  
    const openProfile = Boolean(anchorEl);
    const profileId = openProfile ? 'profile-popover' : undefined;
  

  const sideList = [
    { id: 'dashboard', text: 'Dashboard', icon: <HomeIcon />, path: '/Dashboard' },
    { id: 'Schedulepost', text: 'Schedule New Post', icon:<PostAddIcon/> ,path: '/Schedule_Post' },
    { id: 'managepost', text: 'Manange Post', icon:<ManageHistoryIcon/>, path: '/Manage_Post' },
    { id: 'analysis', text: 'Insights', icon: <AnalyticsIcon />, path: '/Analytics' },
    { id: 'profile', text: 'My Profile', icon: <AccountCircleIcon />, path: '/Profile' },
    { id: 'logout', text: 'Logout', icon: <LogoutIcon />, path: '/Login' }, // Change path to the login page
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1, top: 0 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Social Canvas
          </Typography>
          <IconButton
            color="inherit"
            aria-label="profile"
            edge="end"
            onClick={handleProfileClick}
            style={{ marginRight: '10px' }}
          >
            <AccountCircleIcon />
          </IconButton>
          <Popover
            id={profileId}
            open={openProfile}
            anchorEl={anchorEl}
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
              <MenuList autoFocusItem={openProfile} id="profile-menu">
                <MenuItem  component={Link} to="/Profile" onClick={handleProfileClose}>
                <ListItemIcon>
                    <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
                </MenuItem>
                <MenuItem onClick={handleProfileClose}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
                </MenuItem>
            </MenuList>
          </Popover>
        </Toolbar>
      </AppBar>

  <Drawer
    variant={isMobile ? 'temporary' : 'permanent'}
    open={open}
    onClose={handleDrawerClose}
    sx={{
      '& .MuiDrawer-paper': { 
        width: drawerWidth,
        backgroundColor: '#f0f0f0', // Light background color
      },
      ...(isMobile && {
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
        },
      }),
      paddingLeft: '10px',
    }}
  >
    <Box sx={{ backgroundColor: 'inherit' }}> {/* This box ensures that the background color doesn't override the selected item color */}
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
    <img src="../../SitePhotos/SCLOGO.png" alt="Logo" style={{ maxWidth: '50px', maxHeight: '50px' }} />
  </Box>
  <Divider />
  {sideList.map(({ id, text, icon, path }) => (
  <React.Fragment key={id}>
    <ListItem
      disablePadding
      onClick={handleDrawerClose}
      sx={{ 
        backgroundColor: location.pathname === path ? '#E3F2FD80' : 'transparent', // Light blue color with reduced opacity 
      }}
    >
      <ListItemButton 
        component={Link} 
        to={path} 
        sx={{ 
          borderLeft: location.pathname === path ? '4px solid #1D8AFF' : '4px solid transparent',
        }}
      >
        <ListItemIcon sx={{ margin: 0, color: location.pathname === path ? '#1D8AFF' : '#494F55', minWidth: 0 }}>
          {icon}
        </ListItemIcon>
        <ListItemText 
          primary={text} 
          sx={{ 
            color: location.pathname === path ? '#1D8AFF' : 'inherit', 
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