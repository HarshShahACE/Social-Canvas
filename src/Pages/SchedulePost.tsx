import { Avatar, Box, Button, Card, CardContent, CssBaseline,  Divider,  Grid,  IconButton, MenuItem, Select, Typography, useMediaQuery } from "@mui/material";
import SideNav from "../Components/Navbar";
import { useState } from "react";
import LinkedInPostLayout from "../Components/Schedule_Post/Linkedin";
import {  AddPhotoAlternateRounded } from "@mui/icons-material";
import TwitterPostLayout from "../Components/Schedule_Post/Twitter";
import FacebookPostLayout from "../Components/Schedule_Post/Facebook";
import EventIcon from '@mui/icons-material/Event'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const platforms = [
    { name: "LinkedIn", value: "linkedin" },
    { name: "Twitter", value: "twitter" },
    { name: "Facebook", value: "facebook" },
    // Add more platforms as needed
  ];

export default function Schedule_Post(){
    
    const isMobile = useMediaQuery('(max-width:600px)');
    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

    const [selectedPlatform, setSelectedPlatform] = useState<string>('');

    const [content, setContent] = useState('');
    const [media, setMedia] = useState<string | null>(null); // State to store uploaded media
  
    const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const mediaURL = URL.createObjectURL(file);
          setMedia(mediaURL);
        }
      }
    };


    const handlePlatformChange = (e : any) => {
        setSelectedPlatform(e.target.value);
      };

    // Schedule Post
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTimeZone, setSelectedTimeZone] = useState('');
    const [isScheduled, setIsScheduled] = useState(false);

    const handleDateChange = (event : any) => {
        setSelectedDate(event.target.value);
    };

    const handleTimeChange = (event : any) => {
        setSelectedTime(event.target.value);
    };

    const handleTimeZoneChange = (event : any) => {
        setSelectedTimeZone(event.target.value);
    };

    const handlePostNow = () => {
        // Handle post now action
    };

    const handleSchedule = () => {
        // Handle schedule action
        setIsScheduled(true);
    };
  

    return(
        <div style={{ display: 'flex' , backgroundImage: `url(${defaultImagePath})`, backgroundSize:'contain',
            backgroundRepeat:'no-repeat',
            backgroundPosition:'bottom right'  , height:'100vh' }}>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <CssBaseline />
            {/* Sidebar */}
            <SideNav/>
            {/* Main content */}
            <div style={{ flex: 1 }}>
                <main style={{ flexGrow: 1, padding: 3, marginTop: '70px' , marginLeft: isMobile? '20px' : '240px'  }}>
                    {/* Main content */}
                    <Grid container spacing={2}>
                        <Grid md={6}>
                    <Card style={{background: 'rgba(255, 255, 255, 0.7)' , margin:'20px', borderRadius:'20px', height: '100%' }}>
                        <CardContent>
                            {/* Drop Down For Plateform Selection */}
                            <Box display="flex" alignItems="center" mt={2}>
                                <Select
                                    value={selectedPlatform}
                                    onChange={handlePlatformChange}
                                    variant="outlined"
                                    fullWidth
                                    id="platform-select"
                                    label="Select Platform"
                                    style={{ marginRight: '10px' }}
                                >
                                    <MenuItem value="">Select Platform</MenuItem>
                                    {platforms.map((platform) => (
                                        <MenuItem key={platform.value} value={platform.value}>{platform.name}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Divider style={{ margin: '10px 0' }} />

                            {/* Content Textarea with Emoji Picker */}
                            <Box display="flex" flexDirection="column" alignItems="flex-start" position="relative" width="100%" marginBottom={5}>
                                <textarea
                                    rows={10} // Increased the number of rows to make the textarea taller
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write something..."
                                    style={{ width: '100%' ,resize: 'none' , padding:'10px' }} // Full width textarea with margin at the bottom
                                />
                            </Box>

                            {/* Media Upload */}
                            <Box display="flex" alignItems="center" mt={2}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="media-upload"
                                    type="file"
                                    onChange={handleMediaUpload}
                                    multiple
                                />
                                <label htmlFor="media-upload">
                                    <IconButton component="span">
                                        <AddPhotoAlternateRounded />
                                    </IconButton>
                                </label>
                                {media && (
                                    <Avatar alt="Uploaded Media" src={media} sx={{ width: 100, height: 100, borderRadius: '0' }} /> // Remove border radius
                                )}
                            </Box>
                            <Divider/>
                            {/* Select Date And Time */}
                            <Box display="flex" alignItems="center" mt={2}>
                                <EventIcon />
                                <input type="date" value={selectedDate} onChange={handleDateChange} />
                            </Box>

                            {/* Time Picker */}
                            <Box display="flex" alignItems="center" mt={2}>
                                <AccessTimeIcon />
                                <input type="time" value={selectedTime} onChange={handleTimeChange} />
                            </Box>

                            {/* Time Zone Selection */}
                            <Box display="flex" alignItems="center" mt={2}>
                                <Select
                                    value={selectedTimeZone}
                                    onChange={handleTimeZoneChange}
                                    variant="outlined"
                                    fullWidth
                                >
                                    <MenuItem value="">Select Time Zone</MenuItem>
                                    {/* Add time zone options here */}
                                </Select>
                            </Box>

                            {/* Buttons */}
                            <Box display="flex" mt={4} mb={0}>
                                <Button variant="contained" onClick={handlePostNow}>Post Now</Button>
                                <Button variant="contained" onClick={handleSchedule} style={{marginLeft:'10px'}}>Schedule for Later</Button>
                            </Box>

                            {/* Confirmation message */}
                            {isScheduled && (
                                <Typography variant="body2" mt={2}>
                                    Scheduled for later.
                                </Typography>
                            )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid md={6} style={{ marginTop: isMobile? '20px' : '0px' }}>
                        {selectedPlatform === 'linkedin' && (
                            <Card style={{ background: 'rgba(255, 255, 255, 0.9)', margin: '20px', borderRadius: '20px', }}>
                            <CardContent>
                                {/* Pass data to LinkedInPostLayout component */}
                                <LinkedInPostLayout
                                username="Harsh"
                                content={content}
                                imageUrl={media || undefined}
                                />
                            </CardContent>
                            </Card>
                        )}
                        {selectedPlatform === 'facebook' && (
                            <Card style={{ background: 'rgba(255, 255, 255, 0.9)', margin: '20px', borderRadius: '20px', width: '70%' }}>
                            <CardContent>
                                {/* Pass data to LinkedInPostLayout component */}
                                <FacebookPostLayout
                                username="Harsh"
                                content={content}
                                imageUrl={media || undefined}
                                />
                            </CardContent>
                            </Card>
                        )}
                        {selectedPlatform === 'twitter' && (
                            <Card style={{ background: 'rgba(255, 255, 255, 0.9)', margin: '20px', borderRadius: '20px', width: '70%' }}>
                            <CardContent>
                                {/* Pass data to LinkedInPostLayout component */}
                                <TwitterPostLayout
                                username="Harsh"
                                handle="@Harsh-shah"
                                content={content}
                                imageUrl={media || undefined}
                                />
                            </CardContent>
                            </Card>
                        )}
                    </Grid>
                </Grid>
                </main>
            </div>
        </div>
    )
}